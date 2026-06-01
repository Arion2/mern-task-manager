// backend/routes/tasks.js
const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get all tasks for logged-in user
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// Create task
router.post('/', auth, async (req, res) => {
  const task = await Task.create({ user: req.user.id, title: req.body.title });
  res.status(201).json(task);
});

// Toggle completed
router.patch('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { completed: req.body.completed },
    { new: true }
  );
  res.json(task);
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'Task deleted' });
});

module.exports = router;