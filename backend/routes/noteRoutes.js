const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  summarizeNote,
  generatequize,
  deleteNote,
} = require("../controllers/noteController");
router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id/summarize", summarizeNote);
router.put("/:id/generate-quiz", generatequize);
router.delete("/:id", deleteNote);

module.exports = router;
