import { useState } from "react";

function SummaryCard({ summary }) {
  const [open, setOpen] = useState(false);

  if (!summary) return null;

  return (
    <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-red-400">AI Summary</h3>

        <button
          onClick={() => setOpen(!open)}
          className="text-xs bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20 transition"
        >
          {open ? "Minimize" : "Expand"}
        </button>
      </div>

      {open && (
        <p className="text-white/70 text-sm mt-3 leading-relaxed">{summary}</p>
      )}
    </div>
  );
}

export default SummaryCard;
