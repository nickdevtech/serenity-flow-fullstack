const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' }).populate('created_by', 'full_name email').sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ created_by: req.user._id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-sessions/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, created_by: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/my-sessions/save-draft', auth, async (req, res) => {
  try {
    const sessionData = { ...req.body, status: 'draft', created_by: req.user._id };
    let session;
    if (req.body._id) {
      session = await Session.findOneAndUpdate(
        { _id: req.body._id, created_by: req.user._id },
        sessionData,
        { new: true, runValidators: true }
      );
    } else {
      session = new Session(sessionData);
      await session.save();
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/my-sessions/publish', auth, async (req, res) => {
  try {
    const sessionData = { ...req.body, status: 'published', created_by: req.user._id };
    let session;
    if (req.body._id) {
      session = await Session.findOneAndUpdate(
        { _id: req.body._id, created_by: req.user._id },
        sessionData,
        { new: true, runValidators: true }
      );
    } else {
      session = new Session(sessionData);
      await session.save();
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/my-sessions/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, created_by: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/my-sessions/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, created_by: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;