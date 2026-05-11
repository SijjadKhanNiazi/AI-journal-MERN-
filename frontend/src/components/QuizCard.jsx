import { useState } from "react";

const QuizCard = ({ quiz }) => {
  const [open, setOpen] = useState(false);

  if (!quiz) return null;

  return (
    <div className="mt-4 p-4 bg-blue-950/20 border-l-4 border-blue-400 rounded">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase text-blue-400">
          Practice Quiz
        </h3>

        <button
          onClick={() => setOpen(!open)}
          className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          {open ? "Minimize" : "Expand"}
        </button>
      </div>

      {/* Quiz Content */}
      {open && (
        <p className="text-sm text-white/80 whitespace-pre-wrap mt-3">{quiz}</p>
      )}
    </div>
  );
};

export default QuizCard;
