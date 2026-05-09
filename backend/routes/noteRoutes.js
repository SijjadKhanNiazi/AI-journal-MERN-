const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  summarizeNote,
  deleteNote,
} = require("../controllers/noteController");
router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id/summarize", summarizeNote);
router.delete("/:id", deleteNote);

module.exports = router;
