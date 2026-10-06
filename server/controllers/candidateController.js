const User = require('../models/User');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');

// @desc    Get candidate dashboard statistics and personalized summary
// @route   GET /api/candidates/dashboard
// @access  Private (Candidate)
exports.getCandidateDashboard = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    const [profile, applications, completedAttempts, inProgressAttempt, availableAssessments] = await Promise.all([
      CandidateProfile.findOne({ user: candidateId }),
      Application.find({ candidate: candidateId }).populate('assessment').sort({ updatedAt: -1 }),
      AssessmentAttempt.find({ candidate: candidateId, status: 'completed' })
        .populate('assessment', 'title topics duration')
        .sort({ submittedAt: -1 }),
      AssessmentAttempt.findOne({ candidate: candidateId, status: 'in-progress' })
        .populate('assessment', 'title duration questionCount'),
      Assessment.find({ status: 'published' }).sort({ createdAt: -1 }),
    ]);

    // Aggregate statistics across completed tests
    let totalScoreSum = 0;
    let totalMaxScoreSum = 0;
    let totalQuestionsSum = 0;
    let totalAccuracySum = 0;
    let highestDifficultyReached = 'easy';

    const diffRank = { easy: 1, medium: 2, hard: 3 };
    let highestRank = 1;

    // Aggregate topic performance
    const topicMap = {};

    completedAttempts.forEach((att) => {
      totalScoreSum += att.totalScore || 0;
      totalMaxScoreSum += att.maxPossibleScore || 0;
      totalQuestionsSum += att.questionsAttemptedCount || 0;
      totalAccuracySum += att.accuracy || 0;

      const diff = (att.highestDifficulty || 'easy').toLowerCase();
      if (diffRank[diff] && diffRank[diff] > highestRank) {
        highestRank = diffRank[diff];
        highestDifficultyReached = diff;
      }

      (att.skillAnalysis || []).forEach((sa) => {
        if (!topicMap[sa.topic]) {
          topicMap[sa.topic] = { attempted: 0, correct: 0 };
        }
        topicMap[sa.topic].attempted += sa.attempted;
        topicMap[sa.topic].correct += sa.correct;
      });
    });

    const completedCount = completedAttempts.length;
    const overallScore = totalMaxScoreSum > 0 ? Math.round((totalScoreSum / totalMaxScoreSum) * 100) : 0;
    const accuracy = completedCount > 0 ? Math.round(totalAccuracySum / completedCount) : 0;

    // Compute strong & weak skills
    const strongSkills = [];
    const weakSkills = [];
    const skillList = Object.keys(topicMap).map((topic) => {
      const stat = topicMap[topic];
      const acc = stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
      if (acc >= 75) {
        strongSkills.push(`${topic} (${acc}%)`);
      } else if (acc < 60) {
        weakSkills.push(`${topic} (${acc}%)`);
      }
      return { topic, accuracy: acc, attempted: stat.attempted, correct: stat.correct };
    });

    const currentApplication = applications[0] || null;

    res.status(200).json({
      success: true,
      data: {
        candidate: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          title: req.user.title,
        },
        profile,
        metrics: {
          overallScore,
          accuracy,
          totalQuestionsAnswered: totalQuestionsSum,
          highestDifficulty: highestDifficultyReached,
          assessmentsCompleted: completedCount,
        },
        strongSkills: strongSkills.length ? strongSkills : ['Building baseline skills'],
        weakSkills: weakSkills.length ? weakSkills : ['None detected yet'],
        topicBreakdown: skillList,
        currentApplication,
        applications,
        inProgressAttempt,
        recentAttempts: completedAttempts.slice(0, 5),
        availableAssessments: availableAssessments.slice(0, 6),
      },
    });
  } catch (error) {
    next(error);
  }
};
