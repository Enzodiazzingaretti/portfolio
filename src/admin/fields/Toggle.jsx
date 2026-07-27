// Interruptor accesible con estética raveRed.
export default function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer select-none group">
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-raveRedBright/50 ${
          checked ? "bg-raveRed" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white transition-transform duration-300 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
      {label && <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">{label}</span>}
    </label>
  );
}
