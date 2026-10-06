const Question = require('../models/Question');
const QuestionAttempt = require('../models/QuestionAttempt');

const DIFFICULTY_HIERARCHY = ['easy', 'medium', 'hard'];

const DIFFICULTY_MARKS = {
  easy: 1,
  medium: 2,
  hard: 3,
};

/**
 * Calculates the next difficulty and failure counter given current state and whether the answer was correct.
 * Follows exact Zelis Adaptive Algorithm specifications:
 *
 * If correct:
 *   failureCount = 0
 *   easy -> medium
 *   medium -> hard
 *   hard -> hard
 *
 * If incorrect:
 *   failureCount += 1
 *   if failureCount >= 2:
 *     hard -> medium
 *     medium -> easy
 *     easy -> easy (never below easy)
 *     failureCount = 0
 *   else:
 *     retain currentDifficulty
 */
function computeNextDifficulty(currentDifficulty, failureCount, isCorrect) {
  const normCurrent = (currentDifficulty || 'easy').toLowerCase();
  let nextDifficulty = normCurrent;
  let nextFailureCount = failureCount;

  if (isCorrect) {
    nextFailureCount = 0;
    if (normCurrent === 'easy') {
      nextDifficulty = 'medium';
    } else if (normCurrent === 'medium') {
      nextDifficulty = 'hard';
    } else {
      nextDifficulty = 'hard';
    }
  } else {
    nextFailureCount = (failureCount || 0) + 1;
    if (nextFailureCount >= 2) {
      if (normCurrent === 'hard') {
        nextDifficulty = 'medium';
      } else if (normCurrent === 'medium') {
        nextDifficulty = 'easy';
      } else {
        nextDifficulty = 'easy';
      }
      nextFailureCount = 0; // reset counter after level drop
    } else {
      nextDifficulty = normCurrent; // maintain current difficulty on 1st failure
    }
  }

  return {
    nextDifficulty,
    nextFailureCount,
    transition: `${normCurrent} -> ${nextDifficulty}`,
  };
}

/**
 * Finds the next question for a candidate in an active assessment.
 * Filters out already attempted questions in this attempt.
 * Respects assessment topics.
 * Matches required difficulty, with graceful fallback to closest difficulty if unavailable.
 */
async function selectNextQuestion({
  assessment,
  attemptId,
  targetDifficulty,
  preferredTopic = null,
}) {
  // 1. Get IDs of questions already attempted in this attempt
  const attemptedRecords = await QuestionAttempt.find({ attempt: attemptId }).select('question');
  const attemptedQuestionIds = attemptedRecords.map((r) => r.question);

  const topics = assessment.topics && assessment.topics.length > 0 ? assessment.topics : null;

  // Build base query
  const baseFilter = {
    _id: { $nin: attemptedQuestionIds },
  };

  if (topics) {
    baseFilter.topic = { $in: topics };
  }

  // 2. Try exact target difficulty first
  let targetFilter = { ...baseFilter, difficulty: targetDifficulty };
  if (preferredTopic && topics && topics.includes(preferredTopic)) {
    targetFilter.topic = preferredTopic;
  }

  let candidates = await Question.find(targetFilter);

  // If topic filter was too strict, broaden to any assessment topic at target difficulty
  if (candidates.length === 0 && preferredTopic) {
    candidates = await Question.find({ ...baseFilter, difficulty: targetDifficulty });
  }

  // 3. Fallback to closest available difficulty if no question found
  if (candidates.length === 0) {
    const fallbackDifficulties =
      targetDifficulty === 'hard'
        ? ['medium', 'easy']
        : targetDifficulty === 'medium'
        ? ['easy', 'hard']
        : ['medium', 'hard'];

    for (const fallbackDiff of fallbackDifficulties) {
      candidates = await Question.find({ ...baseFilter, difficulty: fallbackDiff });
      if (candidates.length > 0) {
        break;
      }
    }
  }

  // If still no question matching topic filters, try any unused question
  if (candidates.length === 0) {
    candidates = await Question.find({ _id: { $nin: attemptedQuestionIds } });
  }

  if (candidates.length === 0) {
    return null; // All questions exhausted
  }

  // Pick a random question from candidate pool to ensure variety
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

/**
 * Recalculates metrics for the entire attempt:
 * totalScore, maximumPossibleScore, accuracy, percentage, skillAnalysis, difficultyHistory
 */
async function recalculateAttemptMetrics(attempt) {
  const attempts = await QuestionAttempt.find({ attempt: attempt._id })
    .populate('question')
    .sort({ questionNumber: 1 });

  let totalScore = 0;
  let maxPossibleScore = 0;
  let correctCount = 0;
  let totalTime = 0;
  const topicStats = {};
  const difficultyHistory = [];

  const highestRanks = { easy: 1, medium: 2, hard: 3 };
  let highestRankVal = 1;
  let highestDiff = 'easy';

  for (const qa of attempts) {
    const diff = (qa.difficulty || 'easy').toLowerCase();
    const marks = DIFFICULTY_MARKS[diff] || 1;
    maxPossibleScore += marks;

    if (qa.isCorrect) {
      totalScore += marks;
      correctCount += 1;
    }

    totalTime += qa.timeTakenSeconds || 0;

    // Track highest difficulty experienced
    if (highestRanks[diff] && highestRanks[diff] > highestRankVal) {
      highestRankVal = highestRanks[diff];
      highestDiff = diff;
    }

    // Topic performance
    const topic = qa.topic || 'General';
    if (!topicStats[topic]) {
      topicStats[topic] = { attempted: 0, correct: 0 };
    }
    topicStats[topic].attempted += 1;
    if (qa.isCorrect) {
      topicStats[topic].correct += 1;
    }

    // Difficulty History entry for progression chart
    difficultyHistory.push({
      questionNumber: qa.questionNumber,
      difficulty: diff,
      result: qa.isCorrect ? 'correct' : 'wrong',
      score: qa.marksAwarded,
      topic: qa.topic,
      timeTaken: qa.timeTakenSeconds,
    });
  }

  const questionsAttemptedCount = attempts.length;
  const accuracy = questionsAttemptedCount > 0 ? Math.round((correctCount / questionsAttemptedCount) * 100) : 0;
  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  // Build skill analysis array
  const skillAnalysis = Object.keys(topicStats).map((topic) => {
    const stat = topicStats[topic];
    return {
      topic,
      attempted: stat.attempted,
      correct: stat.correct,
      accuracy: stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0,
    };
  });

  return {
    totalScore,
    maxPossibleScore,
    questionsAttemptedCount,
    accuracy,
    percentage,
    highestDifficulty: highestDiff,
    skillAnalysis,
    difficultyHistory,
    averageTimePerQuestion: questionsAttemptedCount > 0 ? Math.round(totalTime / questionsAttemptedCount) : 0,
  };
}

module.exports = {
  DIFFICULTY_MARKS,
  computeNextDifficulty,
  selectNextQuestion,
  recalculateAttemptMetrics,
};
