const express = require('express');
const UserData = require('../models/UserData');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/userdata — Get all user data
router.get('/', async (req, res) => {
  try {
    let userData = await UserData.findOne({ userId: req.userId });
    if (!userData) {
      userData = new UserData({ userId: req.userId });
      await userData.save();
    }
    res.json(userData);
  } catch (error) {
    console.error('Get user data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/userdata — Full update of user data
router.put('/', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.userId;
    delete updateData._id;

    let userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json(userData);
  } catch (error) {
    console.error('Update user data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/userdata/bookmarks — Add a bookmark
router.post('/bookmarks', async (req, res) => {
  try {
    const { verseId } = req.body;
    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $addToSet: { bookmarks: verseId } },
      { new: true, upsert: true }
    );
    res.json({ bookmarks: userData.bookmarks });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/userdata/bookmarks/:verseId — Remove a bookmark
router.delete('/bookmarks/:verseId', async (req, res) => {
  try {
    const { verseId } = req.params;
    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $pull: { bookmarks: verseId } },
      { new: true }
    );
    res.json({ bookmarks: userData ? userData.bookmarks : [] });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/userdata/notes — Set a note for a verse
router.put('/notes', async (req, res) => {
  try {
    const { verseId, note } = req.body;
    const updateKey = `notes.${verseId}`;
    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $set: { [updateKey]: note } },
      { new: true, upsert: true }
    );
    res.json({ notes: userData.notes });
  } catch (error) {
    console.error('Set note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/userdata/readverses — Mark verse as read
router.post('/readverses', async (req, res) => {
  try {
    const { verseId } = req.body;
    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $addToSet: { readVerses: verseId } },
      { new: true, upsert: true }
    );
    res.json({ readVerses: userData.readVerses });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/userdata/chapter-progress — Update chapter progress
router.put('/chapter-progress', async (req, res) => {
  try {
    const { chapterProgress } = req.body;
    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $set: { chapterProgress } },
      { new: true, upsert: true }
    );
    res.json({ chapterProgress: userData.chapterProgress });
  } catch (error) {
    console.error('Update chapter progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/userdata/learning-sessions — Update learning sessions
router.put('/learning-sessions', async (req, res) => {
  try {
    const { learningSessions } = req.body;
    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $set: { learningSessions } },
      { new: true, upsert: true }
    );
    res.json({ learningSessions: userData.learningSessions });
  } catch (error) {
    console.error('Update learning sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/userdata/settings — Update settings (language, notifications)
router.put('/settings', async (req, res) => {
  try {
    const { appLanguage, dailyVerseNotificationEnabled } = req.body;
    const updateData = {};
    if (appLanguage !== undefined) updateData.appLanguage = appLanguage;
    if (dailyVerseNotificationEnabled !== undefined) updateData.dailyVerseNotificationEnabled = dailyVerseNotificationEnabled;

    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ 
      appLanguage: userData.appLanguage, 
      dailyVerseNotificationEnabled: userData.dailyVerseNotificationEnabled 
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/userdata/flashcards-read — Update flashcards read
router.put('/flashcards-read', async (req, res) => {
  try {
    const { flashcardsRead } = req.body;
    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $set: { flashcardsRead } },
      { new: true, upsert: true }
    );
    res.json({ flashcardsRead: userData.flashcardsRead });
  } catch (error) {
    console.error('Update flashcards read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/userdata/last-read — Update last read verse position
router.put('/last-read', async (req, res) => {
  try {
    const { lastReadVerseByChapter } = req.body;
    const userData = await UserData.findOneAndUpdate(
      { userId: req.userId },
      { $set: { lastReadVerseByChapter } },
      { new: true, upsert: true }
    );
    res.json({ lastReadVerseByChapter: userData.lastReadVerseByChapter });
  } catch (error) {
    console.error('Update last read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
