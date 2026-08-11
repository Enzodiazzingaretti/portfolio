export default function LanguageSelector({ languages, currentLanguage, onChange }) {
  return (
    <div className="flex items-center gap-1 border border-white/[0.08] bg-white/[0.025] p-1">
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => onChange(language.code)}
          aria-label={language.name}
          aria-current={currentLanguage === language.code}
          className={`min-h-[32px] min-w-[32px] px-2 py-1 font-mono text-label uppercase tracking-[0.2em] transition ${
            currentLanguage === language.code
              ? "bg-raveRed/20 text-white"
              : "text-white/52 hover:text-white"
          }`}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
