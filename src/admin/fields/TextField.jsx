export default function TextField({ label, value, onChange, placeholder, hint }) {
  return (
    <label className="block mb-4">
      <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 mb-1.5">{label}</span>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 px-3 py-2.5 text-sm text-[#EAEAEA] placeholder-white/25 outline-none transition-colors focus:border-raveRedBright"
      />
      {hint && <span className="block font-mono text-[10px] text-white/35 mt-1.5 tracking-wide normal-case">{hint}</span>}
    </label>
  );
}
