export default function PrivacyNote() {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-ink/10 bg-white/40 px-4 py-3 text-xs text-ink/60">
      <span aria-hidden className="mt-0.5 text-sm">
        🔒
      </span>
      <p>
        <span className="font-semibold text-ink/75">Your data is never stored.</span>{' '}
        All calculations happen locally in your browser. Your birth date, time, and
        place are never sent to any server and are gone the moment you close this tab.
        We only count anonymous visits by country to understand reach.
      </p>
    </div>
  );
}
