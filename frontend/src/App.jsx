import { useState, useEffect } from "react";
import axios from "axios";

const ApiUrl = "http://localhost:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [quizLoadingId, setQuizLoadingId] = useState(null); // Added for Quiz loading state

  const fetchNotes = async () => {
    try {
      const response = await axios.get(ApiUrl);
      setNotes(response.data);
    } catch (error) {
      console.log("Error getting notes", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill all fields!");
    try {
      const res = await axios.post(ApiUrl, { title, content });
      setNotes([res.data, ...notes]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.log("Error saving notes", error);
    }
  };

  const handleSummarize = async (id) => {
    setLoadingId(id);
    try {
      const res = await axios.put(`${ApiUrl}/${id}/summarize`);
      setNotes(notes.map((n) => (n._id === id ? res.data : n)));
    } catch (error) {
      alert("Make sure both Node.js and FastAPI servers are running!");
    } finally {
      setLoadingId(null);
    }
  };

  // --- NEW FUNCTIONALITY ---
  const handleGenerateQuiz = async (id) => {
    setQuizLoadingId(id);
    try {
      const res = await axios.put(`${ApiUrl}/${id}/generate-quiz`);
      setNotes(notes.map((n) => (n._id === id ? res.data : n)));
    } catch (error) {
      alert("Quiz generation failed. Check your servers!");
    } finally {
      setQuizLoadingId(null);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await axios.delete(`${ApiUrl}/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (error) {
      console.log("Delete failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950 to-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            AI Study <span className="text-red-400">Journal</span>
          </h1>
          <p className="text-white/50 mt-2 text-sm">
            MERN + FastAPI + AI Assistant
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl mb-10">
          <form onSubmit={addNote} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter topic title"
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 focus:border-red-400 outline-none"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes..."
              className="w-full p-4 h-40 rounded-xl bg-black/40 border border-white/10 focus:border-red-400 outline-none"
            />
            <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold transition">
              Save Note
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {notes.length === 0 ? (
            <div className="text-center text-white/30 py-20 border border-dashed border-white/10 rounded-xl">
              No notes yet
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-red-400/40 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-xl font-bold">{note.title}</h2>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-white/70 mt-3 text-sm leading-relaxed">
                  {note.content}
                </p>

                {/* Summary Section */}
                {note.summary && (
                  <div className="mt-4 p-4 bg-black/40 border-l-4 border-red-400 rounded">
                    <h3 className="text-xs font-bold uppercase text-red-400 mb-1">
                      AI Summary
                    </h3>
                    <p className="text-sm text-white/80 italic whitespace-pre-wrap">
                      {note.summary}
                    </p>
                  </div>
                )}

                {/* --- NEW QUIZ SECTION --- */}
                {note.quiz && (
                  <div className="mt-4 p-4 bg-blue-950/20 border-l-4 border-blue-400 rounded">
                    <h3 className="text-xs font-bold uppercase text-blue-400 mb-1">
                      Practice Quiz
                    </h3>
                    <p className="text-sm text-white/80 whitespace-pre-wrap">
                      {note.quiz}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleSummarize(note._id)}
                    disabled={loadingId === note._id}
                    className="flex-1 bg-white text-black py-2 rounded-lg font-semibold hover:bg-red-100 disabled:opacity-50"
                  >
                    {loadingId === note._id ? "Summarizing..." : "AI Summarize"}
                  </button>

                  <button
                    onClick={() => handleGenerateQuiz(note._id)}
                    disabled={quizLoadingId === note._id}
                    className="flex-1 border border-white/20 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
                  >
                    {quizLoadingId === note._id
                      ? "Creating Quiz..."
                      : "Generate Quiz"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
