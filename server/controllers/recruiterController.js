const User = require('../models/User');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const Interview = require('../models/Interview');
const SecurityEvent = require('../models/SecurityEvent');
const CodingSubmission = require('../models/CodingSubmission');
const RecruiterAction = require('../models/RecruiterAction');
const proctoringService = require('../services/proctoringService');

// @desc    Get recruiter dashboard aggregate metrics & chart telemetry
// @route   GET /api/recruiters/dashboard
// @access  Private (Recruiter / Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const assessmentsCreated = await Assessment.countDocuments();
    const completedAttempts = await AssessmentAttempt.countDocuments({ status: 'completed' });
    const inProgressAttempts = await AssessmentAttempt.countDocuments({ status: 'in-progress' });

    // Stage counts
    const shortlistedCandidates = await Application.countDocuments({ status: 'Shortlisted' });
    const l1Candidates = await Application.countDocuments({ status: 'L1 Interview' });
    const l2Candidates = await Application.countDocuments({ status: 'L2 Interview' });
    const selectedCandidates = await Application.countDocuments({ status: 'Selected' });
    const offerCandidates = await Application.countDocuments({ status: 'Offer' });

    // Average Score across completed attempts
    const scoreAgg = await AssessmentAttempt.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$percentage' }, avgAccuracy: { $avg: '$accuracy' } } },
    ]);
    const averageScore = scoreAgg[0] ? Math.round(scoreAgg[0].avgScore) : 0;
    const averageAccuracy = scoreAgg[0] ? Math.round(scoreAgg[0].avgAccuracy) : 0;

    // Score distribution buckets for charts (0-40%, 41-60%, 61-80%, 81-100%)
    const scoreBuckets = [
      { range: '0-40%', count: 0 },
      { range: '41-60%', count: 0 },
      { range: '61-80%', count: 0 },
      { range: '81-100%', count: 0 },
    ];
    const allCompleted = await AssessmentAttempt.find({ status: 'completed' }).select(
      'percentage highestDifficulty skillAnalysis codingScore maxCodingScore'
    );
    allCompleted.forEach((att) => {
      const p = att.percentage || 0;
      if (p <= 40) scoreBuckets[0].count++;
      else if (p <= 60) scoreBuckets[1].count++;
      else if (p <= 80) scoreBuckets[2].count++;
      else scoreBuckets[3].count++;
    });

    // Highest difficulty distribution
    const difficultyDist = { easy: 0, medium: 0, hard: 0 };
    allCompleted.forEach((att) => {
      const diff = (att.highestDifficulty || 'easy').toLowerCase();
      if (difficultyDist[diff] !== undefined) {
        difficultyDist[diff]++;
      }
    });

    // Pipeline funnel distribution
    const pipelineStages = [
      'Applied',
      'Assessment',
      'Shortlisted',
      'L1 Interview',
      'L2 Interview',
      'Selected',
      'Offer',
      'Rejected',
    ];
    const pipelineDistribution = await Promise.all(
      pipelineStages.map(async (stage) => ({
        stage,
        count: await Application.countDocuments({ status: stage }),
      }))
    );

    // Topic performance aggregate
    const topicAggMap = {};
    allCompleted.forEach((att) => {
      (att.skillAnalysis || []).forEach((sa) => {
        if (!topicAggMap[sa.topic]) {
          topicAggMap[sa.topic] = { totalAccuracy: 0, count: 0 };
        }
        topicAggMap[sa.topic].totalAccuracy += sa.accuracy || 0;
        topicAggMap[sa.topic].count++;
      });
    });

    const topicPerformance = Object.keys(topicAggMap).map((topic) => ({
      topic,
      averageAccuracy: Math.round(topicAggMap[topic].totalAccuracy / topicAggMap[topic].count),
    }));

    // Coding performance metrics
    const totalCodingSubmissions = await CodingSubmission.countDocuments();
    const acceptedCodingSubmissions = await CodingSubmission.countDocuments({ status: 'Accepted' });

    res.status(200).json({
      success: true,
      data: {
        totalCandidates,
        assessmentsCreated,
        completedAssessments: completedAttempts,
        inProgressAssessments: inProgressAttempts,
        shortlistedCandidates,
        l1Candidates,
        l2Candidates,
        selectedCandidates,
        offerCandidates,
        averageScore,
        averageAccuracy,
        completionRate:
          completedAttempts + inProgressAttempts > 0
            ? Math.round((completedAttempts / (completedAttempts + inProgressAttempts)) * 100)
            : 0,
        scoreBuckets,
        difficultyDist: [
          { name: 'Easy', count: difficultyDist.easy, color: '#10b981' },
          { name: 'Medium', count: difficultyDist.medium, color: '#f59e0b' },
          { name: 'Hard', count: difficultyDist.hard, color: '#ef4444' },
        ],
        pipelineDistribution,
        topicPerformance,
        codingMetrics: {
          totalSubmissions: totalCodingSubmissions,
          acceptedSubmissions: acceptedCodingSubmissions,
          passRate: totalCodingSubmissions > 0 ? Math.round((acceptedCodingSubmissions / totalCodingSubmissions) * 100) : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate leaderboard & comparison with configurable weighted scoring
// @route   GET /api/recruiters/candidates
// @access  Private (Recruiter / Admin)
exports.getCandidatesLeaderboard = async (req, res, next) => {
  try {
    const {
      wAssessment = 40,
      wProblemSolving = 25,
      wCoding = 20,
      wAccuracy = 15,
      search,
      stage,
      sort = 'compositeScore',
    } = req.query;

    const weights = {
      assessment: parseFloat(wAssessment) / 100,
      problemSolving: parseFloat(wProblemSolving) / 100,
      coding: parseFloat(wCoding) / 100,
      accuracy: parseFloat(wAccuracy) / 100,
    };

    const candidates = await User.find({ role: 'candidate' }).select('-password');

    const leaderboard = await Promise.all(
      candidates.map(async (candidate) => {
        const profile = await CandidateProfile.findOne({ user: candidate._id });
        const application = await Application.findOne({ candidate: candidate._id })
          .populate('latestAttempt')
          .sort({ updatedAt: -1 });

        const latestAttempt =
          application?.latestAttempt ||
          (await AssessmentAttempt.findOne({ candidate: candidate._id, status: 'completed' }).sort({ submittedAt: -1 }));

        const assessmentScore = latestAttempt?.percentage || 0;
        const accuracy = latestAttempt?.accuracy || 0;
        const highestDifficulty = latestAttempt?.highestDifficulty || 'easy';

        // Extract topic accuracies
        const topicMap = {};
        (latestAttempt?.skillAnalysis || []).forEach((sa) => {
          topicMap[sa.topic] = sa.accuracy;
        });

        const dsaScore = topicMap['DSA'] || topicMap['General'] || assessmentScore;
        const sqlScore = topicMap['SQL'] || assessmentScore;
        const problemSolvingScore = highestDifficulty === 'hard' ? 95 : highestDifficulty === 'medium' ? 80 : 65;
        
        // Coding score calculation
        const codingScore = latestAttempt?.maxCodingScore > 0
          ? Math.round((latestAttempt.codingScore / latestAttempt.maxCodingScore) * 100)
          : (dsaScore >= 80 ? 85 : 70);

        // Weighted Composite Score formula
        const compositeScore = Math.round(
          assessmentScore * weights.assessment +
          problemSolvingScore * weights.problemSolving +
          codingScore * weights.coding +
          accuracy * weights.accuracy
        );

        let recommendation = 'Under Review';
        if (compositeScore >= 85) recommendation = 'Strong Hire';
        else if (compositeScore >= 70) recommendation = 'Hire';
        else if (compositeScore >= 50) recommendation = 'Hold';
        else if (assessmentScore > 0) recommendation = 'Reject';

        return {
          id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          title: candidate.title,
          college: profile?.college || 'Engineering College',
          degree: profile?.degree || 'B.S. Computer Science',
          graduationYear: profile?.graduationYear || 2025,
          resumeUrl: profile?.resumeUrl || '',
          applicationId: application?._id,
          stage: application?.status || 'Applied',
          attemptId: latestAttempt?._id,
          assessmentScore,
          accuracy,
          highestDifficulty,
          problemSolvingScore,
          codingScore,
          dsaScore,
          sqlScore,
          compositeScore,
          recommendation,
          lastActivity: latestAttempt?.submittedAt || application?.updatedAt || candidate.createdAt,
        };
      })
    );

    // Apply filters
    let filtered = leaderboard;
    if (stage && stage !== 'all') {
      filtered = filtered.filter((c) => c.stage === stage);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }

    // Sort by requested column descending
    filtered.sort((a, b) => (b[sort] || b.compositeScore) - (a[sort] || a.compositeScore));

    // Assign rank
    const ranked = filtered.map((c, idx) => ({
      ...c,
      rank: idx + 1,
    }));

    res.status(200).json({
      success: true,
      weights,
      count: ranked.length,
      data: ranked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get in-depth candidate performance details for recruiter review
// @route   GET /api/recruiters/candidates/:id
// @access  Private (Recruiter / Admin)
exports.getCandidateDetails = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.params.id).select('-password');
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const profile = await CandidateProfile.findOne({ user: candidate._id });
    const applications = await Application.find({ candidate: candidate._id }).populate('assessment');
    const attempts = await AssessmentAttempt.find({ candidate: candidate._id })
      .populate('assessment')
      .sort({ createdAt: -1 });

    const latestAttempt = attempts.find((a) => a.status === 'completed') || attempts[0];

    // Get coding submissions
    const codingSubmissions = latestAttempt
      ? await CodingSubmission.find({ attempt: latestAttempt._id }).populate('codingQuestion')
      : [];

    // Get security events and proctoring summary
    const securityEvents = latestAttempt
      ? await SecurityEvent.find({ attempt: latestAttempt._id }).sort({ timestamp: -1 })
      : [];

    const proctoringSummary = proctoringService.calculateIntegrityScore(
      securityEvents,
      latestAttempt?.tabSwitchCount || 0,
      latestAttempt?.fullscreenExitCount || 0
    );

    // Get scheduled interviews
    const interviews = await Interview.find({ candidate: candidate._id }).sort({ date: 1 });

    // Strengths and Weaknesses
    const strengths = [];
    const weaknesses = [];

    if (latestAttempt?.skillAnalysis) {
      latestAttempt.skillAnalysis.forEach((skill) => {
        if (skill.accuracy >= 75) {
          strengths.push(`${skill.topic} (${skill.accuracy}% accuracy)`);
        } else if (skill.accuracy < 60) {
          weaknesses.push(`${skill.topic} (${skill.accuracy}% accuracy)`);
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        candidate,
        profile,
        applications,
        attempts,
        latestAttempt,
        codingSubmissions,
        securityEvents,
        proctoringSummary,
        interviews,
        strengths: strengths.length ? strengths : ['Consistent Baseline Performance'],
        weaknesses: weaknesses.length ? weaknesses : ['No critical knowledge gaps detected'],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate recruitment application status (Kanban pipeline)
// @route   PATCH /api/recruiters/applications/:id/status
// @access  Private (Recruiter / Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const validStatuses = [
      'Applied',
      'Assessment',
      'Shortlisted',
      'L1 Interview',
      'L2 Interview',
      'Selected',
      'Offer',
      'Rejected',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user._id,
      note: note || `Candidate transitioned to ${status}`,
    });

    await application.save();

    await RecruiterAction.create({
      recruiter: req.user._id,
      candidate: application.candidate,
      application: application._id,
      actionType: 'STATUS_CHANGE',
      details: `Application stage changed to ${status}`,
    });

    res.status(200).json({
      success: true,
      message: `Candidate application updated to ${status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule or update L1 / L2 Interview
// @route   POST /api/recruiters/interviews
// @access  Private (Recruiter / Admin)
exports.scheduleInterview = async (req, res, next) => {
  try {
    const {
      candidateId,
      applicationId,
      round = 'L1',
      interviewer,
      date,
      time,
      meetingLink,
      notes,
    } = req.body;

    if (!candidateId || !interviewer || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide candidateId, interviewer, date, and time.',
      });
    }

    let app = null;
    if (applicationId) {
      app = await Application.findById(applicationId);
    } else {
      app = await Application.findOne({ candidate: candidateId });
    }

    const interview = await Interview.create({
      candidate: candidateId,
      application: app?._id,
      round,
      interviewer,
      date,
      time,
      meetingLink: meetingLink || 'https://meet.zelis.internal/interview-room',
      notes: notes || '',
      status: 'Scheduled',
      scheduledBy: req.user._id,
    });

    // Update application stage if currently in assessment or shortlisted
    if (app) {
      const nextStage = round === 'L2' ? 'L2 Interview' : 'L1 Interview';
      app.status = nextStage;
      app.statusHistory.push({
        status: nextStage,
        changedAt: new Date(),
        changedBy: req.user._id,
        note: `${round} interview scheduled with ${interviewer} on ${date} at ${time}`,
      });
      await app.save();
    }

    await RecruiterAction.create({
      recruiter: req.user._id,
      candidate: candidateId,
      application: app?._id,
      actionType: 'INTERVIEW_SCHEDULED',
      details: `${round} interview scheduled with ${interviewer}`,
    });

    res.status(201).json({
      success: true,
      message: `${round} Interview scheduled successfully`,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview evaluation results
// @route   PUT /api/recruiters/interviews/:id
// @access  Private (Recruiter / Admin)
exports.updateInterview = async (req, res, next) => {
  try {
    const { rating, technicalScore, communicationScore, notes, recommendation, status } = req.body;

    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (rating !== undefined) interview.rating = rating;
    if (technicalScore !== undefined) interview.technicalScore = technicalScore;
    if (communicationScore !== undefined) interview.communicationScore = communicationScore;
    if (notes !== undefined) interview.notes = notes;
    if (recommendation !== undefined) interview.recommendation = recommendation;
    if (status !== undefined) interview.status = status;

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Interview evaluation updated successfully',
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate comprehensive recruiter report for a candidate
// @route   GET /api/recruiters/candidates/:id/report
// @access  Private (Recruiter / Admin)
exports.getCandidateReport = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.params.id).select('-password');
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const profile = await CandidateProfile.findOne({ user: candidate._id });
    const application = await Application.findOne({ candidate: candidate._id }).populate('assessment');
    const attempt = await AssessmentAttempt.findOne({ candidate: candidate._id, status: 'completed' }).sort({
      submittedAt: -1,
    });

    const codingSubmissions = attempt
      ? await CodingSubmission.find({ attempt: attempt._id }).populate('codingQuestion')
      : [];

    const securityEvents = attempt ? await SecurityEvent.find({ attempt: attempt._id }) : [];
    const proctoringSummary = proctoringService.calculateIntegrityScore(
      securityEvents,
      attempt?.tabSwitchCount || 0,
      attempt?.fullscreenExitCount || 0
    );

    const interviews = await Interview.find({ candidate: candidate._id }).sort({ round: 1 });

    const l1 = interviews.find((i) => i.round === 'L1');
    const l2 = interviews.find((i) => i.round === 'L2');

    // Overall recommendation synthesis
    let finalRecommendation = 'Hold';
    if ((attempt?.percentage || 0) >= 80 && (l1?.technicalScore || 80) >= 75) {
      finalRecommendation = 'Strong Hire';
    } else if ((attempt?.percentage || 0) >= 65) {
      finalRecommendation = 'Hire';
    } else if ((attempt?.percentage || 0) < 50) {
      finalRecommendation = 'Reject';
    }

    const report = {
      generatedAt: new Date().toISOString(),
      candidateSummary: {
        name: candidate.name,
        email: candidate.email,
        phone: profile?.phone || 'N/A',
        college: profile?.college || 'N/A',
        degree: profile?.degree || 'N/A',
        graduationYear: profile?.graduationYear || 'N/A',
        currentStage: application?.status || 'Assessment',
      },
      assessmentPerformance: {
        title: application?.assessment?.title || 'Technical Assessment',
        overallScore: `${attempt?.percentage || 0}%`,
        accuracy: `${attempt?.accuracy || 0}%`,
        highestDifficultyReached: (attempt?.highestDifficulty || 'easy').toUpperCase(),
        questionsAttempted: attempt?.questionsAttemptedCount || 0,
        skillBreakdown: attempt?.skillAnalysis || [],
      },
      codingAbility: {
        problemsAttempted: attempt?.codingProblemsAttempted || 0,
        problemsSolved: attempt?.codingProblemsSolved || 0,
        languagesUsed: attempt?.languagesUsed || [],
        codingScore: `${attempt?.codingScore || 0} / ${attempt?.maxCodingScore || 20}`,
      },
      securityAndProctoring: {
        integrityScore: `${proctoringSummary.score}/100`,
        status: proctoringSummary.statusLabel,
        tabSwitches: attempt?.tabSwitchCount || 0,
        fullscreenExits: attempt?.fullscreenExitCount || 0,
        totalFlags: proctoringSummary.totalFlags,
        flagEvents: securityEvents.map((ev) => ({
          type: ev.eventType,
          severity: ev.severity,
          details: ev.details,
          timestamp: ev.timestamp,
        })),
      },
      interviewEvaluations: {
        l1: l1
          ? {
              interviewer: l1.interviewer,
              date: l1.date,
              technicalScore: l1.technicalScore,
              communicationScore: l1.communicationScore,
              recommendation: l1.recommendation,
              notes: l1.notes,
            }
          : { status: 'Not yet conducted' },
        l2: l2
          ? {
              interviewer: l2.interviewer,
              date: l2.date,
              technicalScore: l2.technicalScore,
              communicationScore: l2.communicationScore,
              recommendation: l2.recommendation,
              notes: l2.notes,
            }
          : { status: 'Not yet conducted' },
      },
      finalRecruiterRecommendation: finalRecommendation,
    };

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get per-assessment leaderboard — all candidates who attempted a specific assessment, ranked
// @route   GET /api/recruiters/assessments/:id/leaderboard
// @access  Private (Recruiter / Admin)
exports.getAssessmentLeaderboard = async (req, res, next) => {
  try {
    const { id } = req.params; // assessment ID
    const { search } = req.query;

    const Assessment = require('../models/Assessment');
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // All completed attempts for this assessment
    const attempts = await AssessmentAttempt.find({
      assessment: id,
      status: 'completed',
    })
      .populate('candidate', 'name email role')
      .sort({ totalScore: -1, submittedAt: 1 });

    const leaderboard = await Promise.all(
      attempts.map(async (attempt, idx) => {
        const profile = await CandidateProfile.findOne({ user: attempt.candidate?._id });

        // Security events count
        const secEvents = await SecurityEvent.countDocuments({ attempt: attempt._id });

        // Coding submissions for this attempt
        const codingSubmissions = await CodingSubmission.find({ attempt: attempt._id });
        const codingPassed = codingSubmissions.filter((s) => s.allTestsPassed).length;

        return {
          rank: idx + 1,
          attemptId: attempt._id,
          candidateId: attempt.candidate?._id,
          name: attempt.candidate?.name || 'Unknown',
          email: attempt.candidate?.email || '',
          // Social Links from profile
          githubUrl: profile?.githubUrl || null,
          linkedinUrl: profile?.linkedinUrl || null,
          portfolioUrl: profile?.portfolioUrl || null,
          college: profile?.college || null,
          degree: profile?.degree || null,
          yearsOfExperience: profile?.yearsOfExperience || 0,
          skills: profile?.skills || [],
          headline: profile?.headline || '',
          // Assessment metrics
          totalScore: attempt.totalScore || 0,
          maxPossibleScore: attempt.maxPossibleScore || 0,
          percentage: attempt.percentage || 0,
          accuracy: attempt.accuracy || 0,
          highestDifficulty: attempt.highestDifficulty || 'easy',
          questionsAttempted: attempt.questionsAttemptedCount || 0,
          totalQuestions: attempt.totalQuestions || 0,
          codingProblemsCompleted: codingPassed,
          securityEvents: secEvents,
          submittedAt: attempt.submittedAt,
          skillAnalysis: attempt.skillAnalysis || [],
          tabSwitchCount: attempt.tabSwitchCount || 0,
        };
      })
    );

    // Apply optional search filter
    let filtered = leaderboard;
    if (search) {
      const q = search.toLowerCase();
      filtered = leaderboard.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      assessment: {
        _id: assessment._id,
        title: assessment.title,
        totalMarks: assessment.totalMarks,
        passingScore: assessment.passingScore,
        duration: assessment.duration,
        topics: assessment.topics,
      },
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

