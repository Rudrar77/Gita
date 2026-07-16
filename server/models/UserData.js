const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bookmarks: {
    type: [String],
    default: []
  },
  notes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  readVerses: {
    type: [String],
    default: []
  },
  chapterProgress: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  learningSessions: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  moodHistory: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  journalHistory: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  weeklyChallenges: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  flashcardsRead: {
    type: [String],
    default: []
  },
  lastReadVerseByChapter: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  appLanguage: {
    type: String,
    enum: ['hindi', 'english'],
    default: 'hindi'
  },
  dailyVerseNotificationEnabled: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
userDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('UserData', userDataSchema);
