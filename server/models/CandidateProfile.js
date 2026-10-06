const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      default: 'Full Stack & Backend Engineer',
    },
    bio: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '+1 (555) 234-5678',
    },
    location: {
      type: String,
      default: 'Atlanta, GA (Hybrid / Remote)',
    },
    college: {
      type: String,
      default: 'Georgia Institute of Technology',
    },
    degree: {
      type: String,
      default: 'B.S. in Computer Science',
    },
    graduationYear: {
      type: Number,
      default: 2025,
    },
    resumeUrl: {
      type: String,
      default: 'https://zelis-careers.storage.example/resumes/candidate-resume.pdf',
    },
    resumeText: {
      type: String,
      default: 'Full stack engineer with deep interest in distributed systems, healthcare fintech, and algorithm design.',
    },
    yearsOfExperience: {
      type: Number,
      default: 2,
    },
    skills: {
      type: [String],
      default: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Data Structures', 'SQL', 'Python'],
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/candidate',
    },
    linkedinUrl: {
      type: String,
      default: 'https://linkedin.com/in/candidate',
    },
    portfolioUrl: {
      type: String,
      default: 'https://candidate.dev',
    },
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        graduationYear: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
