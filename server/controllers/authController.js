const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'zelis_super_secret_jwt_key_2026_adaptive_platform',
    { expiresIn: '7d' }
  );
};

// @desc    Verify HR organization access code for recruiter registration
// @route   POST /api/auth/verify-hr-code
// @access  Public
exports.verifyHrCode = async (req, res, next) => {
  try {
    const { accessCode } = req.body;
    const expectedCode = process.env.HR_REGISTRATION_CODE || '10101';

    if (!accessCode || String(accessCode).trim() !== String(expectedCode).trim()) {
      return res.status(401).json({
        success: false,
        verified: false,
        message: 'Invalid HR Access Code. Please contact your Zelis Talent administrator.',
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: 'HR Access Code Verified ✓',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, title, skills, headline, hrAccessCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const userRole = role && ['candidate', 'recruiter', 'admin'].includes(role) ? role : 'candidate';

    // Strictly enforce HR Access code verification if registering as Recruiter
    if (userRole === 'recruiter') {
      const expectedCode = process.env.HR_REGISTRATION_CODE || '10101';
      if (!hrAccessCode || String(hrAccessCode).trim() !== String(expectedCode).trim()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized. A valid HR Access Code is strictly required to create a Recruiter account.',
        });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      title: title || (userRole === 'candidate' ? 'Software Engineer Candidate' : 'Technical Recruiter'),
    });

    // Automatically create candidate profile if role is candidate
    let profile = null;
    if (userRole === 'candidate') {
      profile = await CandidateProfile.create({
        user: user._id,
        headline: headline || 'Full Stack & Algorithms Engineer',
        skills: skills && Array.isArray(skills) && skills.length > 0 ? skills : ['DSA', 'SQL', 'OOP', 'DBMS', 'React', 'Node.js'],
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    let profile = null;
    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;
    if (user.role === 'candidate') {
      profile = await CandidateProfile.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      headline,
      bio,
      phone,
      location,
      college,
      degree,
      graduationYear,
      resumeUrl,
      resumeText,
      skills,
      yearsOfExperience,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    } = req.body;

    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new CandidateProfile({ user: req.user.id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (college !== undefined) profile.college = college;
    if (degree !== undefined) profile.degree = degree;
    if (graduationYear !== undefined) profile.graduationYear = graduationYear;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (resumeText !== undefined) profile.resumeText = resumeText;
    if (skills !== undefined) profile.skills = skills;
    if (yearsOfExperience !== undefined) profile.yearsOfExperience = yearsOfExperience;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
};
