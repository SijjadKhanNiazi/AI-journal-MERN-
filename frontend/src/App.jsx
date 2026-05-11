import { useState, useEffect } from "react";
import axios from "axios";
import SummaryCard from "./components/SummaryCard";
import QuizCard from "./components/QuizCard";

const ApiUrl = "http://localhost:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loadingId, setLoadingId] = useState(null);
  const [quizLoadingId, setQuizLoadingId] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(ApiUrl);
      setNotes(response.data);

      if (response.data.length > 0) {
        setSelectedNote(response.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return alert("Please fill all fields");
    }

    try {
      const res = await axios.post(ApiUrl, {
        title,
        content,
      });

      const updatedNotes = [res.data, ...notes];

      setNotes(updatedNotes);
      setSelectedNote(res.data);

      setTitle("");
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSummarize = async (id) => {
    setLoadingId(id);

    try {
      const res = await axios.put(`${ApiUrl}/${id}/summarize`);

      const updatedNotes = notes.map((n) => (n._id === id ? res.data : n));

      setNotes(updatedNotes);
      setSelectedNote(res.data);
    } catch (error) {
      alert("Check servers!");
    } finally {
      setLoadingId(null);
    }
  };

  const handleGenerateQuiz = async (id) => {
    setQuizLoadingId(id);

    try {
      const res = await axios.put(`${ApiUrl}/${id}/generate-quiz`);

      const updatedNotes = notes.map((n) => (n._id === id ? res.data : n));

      setNotes(updatedNotes);
      setSelectedNote(res.data);
    } catch (error) {
      alert("Quiz generation failed!");
    } finally {
      setQuizLoadingId(null);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await axios.delete(`${ApiUrl}/${id}`);

      const filtered = notes.filter((n) => n._id !== id);

      setNotes(filtered);

      if (selectedNote?._id === id) {
        setSelectedNote(filtered[0] || null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[320px] border-r border-white/10 bg-zinc-950 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <h1 className="text-2xl font-bold">
            AI Study <span className="text-red-400">Journal</span>
          </h1>
          <p className="text-xs text-white/40 mt-1">MERN + FastAPI + AI</p>
        </div>

        {/* Add Note */}
        <div className="p-4 border-b border-white/10">
          <form onSubmit={addNote} className="space-y-3">
            <input
              type="text"
              placeholder="Topic title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-red-400"
            />

            <textarea
              placeholder="Write notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none resize-none focus:border-red-400"
            />

            <button className="w-full bg-red-500 hover:bg-red-600 transition py-2 rounded-lg font-medium">
              Save Note
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {notes.map((note) => (
            <div
              key={note._id}
              onClick={() => setSelectedNote(note)}
              className={`p-3 rounded-xl cursor-pointer transition border ${
                selectedNote?._id === note._id
                  ? "bg-white/10 border-red-400"
                  : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-semibold text-sm truncate">{note.title}</h2>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note._id);
                  }}
                  className="text-xs text-white/40 hover:text-red-400"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-white/40 mt-2 line-clamp-2">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gradient-to-b from-zinc-950 to-black">
        {!selectedNote ? (
          <div className="flex flex-1 items-center justify-center text-white/30">
            Select a note to view
          </div>
        ) : (
          <>
            <div className="border-b border-white/10 p-5">
              <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* User Note */}
              <div className="flex justify-end">
                <div className="max-w-3xl bg-red-500 text-white rounded-2xl rounded-br-sm px-5 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedNote.content}
                  </p>
                </div>
              </div>

              {/* Summary */}
              {selectedNote.summary && (
                <div className="flex justify-start">
                  <div className="max-w-3xl bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4">
                    <h3 className="font-semibold text-red-400 mb-2">
                      AI Summary
                    </h3>

                    <SummaryCard summary={selectedNote.summary} />
                  </div>
                </div>
              )}

              {selectedNote.quiz && (
                <div className="flex justify-start">
                  <div className="max-w-3xl bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4">
                    <h3 className="font-semibold text-blue-400 mb-2">
                      Practice Quiz
                    </h3>

                    <QuizCard quiz={selectedNote.quiz} />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-4 flex gap-3">
              <button
                onClick={() => handleSummarize(selectedNote._id)}
                disabled={loadingId === selectedNote._id}
                className="flex-1 bg-white text-black py-3 rounded-xl font-semibold hover:bg-red-100 transition disabled:opacity-50"
              >
                {loadingId === selectedNote._id
                  ? "Summarizing..."
                  : "AI Summarize"}
              </button>

              <button
                onClick={() => handleGenerateQuiz(selectedNote._id)}
                disabled={quizLoadingId === selectedNote._id}
                className="flex-1 border border-white/10 bg-white/5 hover:bg-white/10 py-3 rounded-xl transition disabled:opacity-50"
              >
                {quizLoadingId === selectedNote._id
                  ? "Generating..."
                  : "Generate Quiz"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
