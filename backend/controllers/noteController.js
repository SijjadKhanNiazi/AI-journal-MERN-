const Note = require("../models/Note");
const axios = require("axios");

const createNote = async (req, res) => {
  try {
    const { title, content } = await req.body;
    const newNote = new Note({ title, content });
    res.status(201).json(newNote);
    newNote.save();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const summarizeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const FASTAPI_URL = "http://127.0.0.1:8000/summarize";

    const aiResponse = await axios.post(FASTAPI_URL, {
      text: note.content,
    });

    note.summary = aiResponse.data.summary;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ message: "AI Summarizer failed" });
  }
};
const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, createNote, summarizeNote, deleteNote };
