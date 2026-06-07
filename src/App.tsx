import { useState } from 'react';
import { computeSaju, type SajuInput, type SajuResult as SajuResultData } from './lib/saju';
import BirthForm from './components/BirthForm';
import SajuResult from './components/SajuResult';
import PrivacyNote from './components/PrivacyNote';

// Set this once your channel exists. Empty string hides the CTA.
const YOUTUBE_URL = '';

export default function App() {
  const [result, setResult] = useState<SajuResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(input: SajuInput) {
    try {
      setError(null);
      setResult(computeSaju(input));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Something went wrong while reading your Saju.',
      );
    }
  }

  return (
    <div className="bg-hanji-texture min-h-full">
      <div className="mx-auto flex min-h-full max-w-xl flex-col px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-xs font-medium text-ink/60">
            <span className="font-serif text-ink">四柱</span> K-Saju · Korean Four Pillars
          </div>
          <h1 className="font-serif text-3xl font-black tracking-tight text-ink sm:text-4xl">
            What's My Saju?
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
            Discover your Korean <strong className="text-ink/80">Day Pillar (Ilju)</strong> —
            one of the 60 Gapja that reveals your core nature. Enter your birth details
            below; everything is calculated privately in your browser.
          </p>
        </header>

        {/* Main card */}
        <main className="mt-8 rounded-3xl border border-ink/10 bg-white/55 p-5 shadow-seal backdrop-blur-sm sm:p-7">
          {result ? (
            <SajuResult data={result} onReset={() => setResult(null)} />
          ) : (
            <>
              <BirthForm onSubmit={handleSubmit} />
              {error && (
                <p className="mt-4 rounded-lg bg-fire/10 px-3 py-2 text-sm text-fire" role="alert">
                  {error}
                </p>
              )}
              <div className="mt-5">
                <PrivacyNote />
              </div>
            </>
          )}
        </main>

        {/* YouTube funnel CTA (shown once the channel is live) */}
        {YOUTUBE_URL && (
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-fire px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fire/90"
          >
            ▶ Watch K-Saju shorts on YouTube
          </a>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-10 text-center text-xs text-ink/40">
          <p>
            For entertainment and cultural curiosity. Saju (사주) is a traditional East
            Asian system of self-reflection.
          </p>
          <p className="mt-1">Made with care · No accounts · No tracking cookies</p>
        </footer>
      </div>
    </div>
  );
}
