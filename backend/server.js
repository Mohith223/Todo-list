
require('dotenv').config();

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const TodoModel = require('./models/todoList');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// environment variables
const mongoUri = process.env.MONGO_URI;
const port     = process.env.PORT || 3001;

// connect to MongoDB
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// routes

// Get all todos
app.get('/getTodoList', async (req, res) => {
  try {
    const todos = await TodoModel.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo
app.post('/addTodoList', async (req, res) => {
  try {
    const { task, status, deadline } = req.body;
    const todo = await TodoModel.create({ task, status, deadline });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing todo
app.post('/updateTodoList/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      task: req.body.task,
      status: req.body.status,
      deadline: req.body.deadline,
    };
    const todo = await TodoModel.findByIdAndUpdate(id, updateData, { new: true });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
app.delete('/deleteTodoList/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findByIdAndDelete(id);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
