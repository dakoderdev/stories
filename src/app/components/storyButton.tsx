import { useState, useEffect, useRef } from "react";

type ProgressBarProps = { amount: number; currentIndex: number; progress: number };
export function ProgressBar({ amount, currentIndex, progress }: ProgressBarProps) {
  return (
    <div className="flex w-full gap-1 h-1">
      {[...Array(amount)].map((_, i) => {
        const width = i < currentIndex ? "100%" : i === currentIndex ? `${progress}%` : "0%";
        return (
          <div key={i} className="grow h-full rounded-full bg-white/20 overflow-hidden">
            <div style={{ width, transition: "width 100ms linear" }} className="bg-white h-full rounded-full" />
          </div>
        );
      })}
    </div>
  );
}

export function Stories({ urls, storiesOpen, setStoriesOpen, duration = 3000 }: { urls: string[]; storiesOpen: boolean; setStoriesOpen: (open: boolean) => void; duration?: number }) {
  const amount = urls.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // === STORIES AUTO-TIMER ===
  function step(now: number) {
    if (startRef.current === null) startRef.current = now;

    const elapsed = now - startRef.current;
    const pct = Math.min(100, (elapsed / duration) * 100);
    setProgress(pct);

    if (pct >= 100) {
      goNextStory();
    } else {
      rafRef.current = requestAnimationFrame(step);
    }
  }

  useEffect(() => {
    if (!storiesOpen) {
      setCurrentIndex(0);
      setProgress(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [storiesOpen, currentIndex, duration]);

  // === RESET WHEN URLS CHANGE ===
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [urls]);

  // === ARROW NAVIGATION LISTENER ===
  function goNextStory() {
    setCurrentIndex((i) => {
      if (i >= amount - 1) {
        setStoriesOpen(false);
        return i;
      }
      startRef.current = null;
      setProgress(0);
      return i + 1;
    });
  }

  function goPrevStory() {
    setCurrentIndex((i) => {
      if (i <= 0) return i;
      startRef.current = null;
      setProgress(0);
      return i - 1;
    });
  }

  function handleArrowNavigation(e: KeyboardEvent) {
    if (e.key === "ArrowRight") goNextStory();
    if (e.key === "ArrowLeft") goPrevStory();
  }

  useEffect(() => {
    if (!storiesOpen) return;

    window.addEventListener("keydown", handleArrowNavigation);
    return () => window.removeEventListener("keydown", handleArrowNavigation);
  }, [storiesOpen]);

  return (
    <dialog open className="fixed gap-2 flex flex-col items-stretch top-1/2 left-1/2 -translate-1/2 w-9/10 h-9/10 bg-background border border-white/20 rounded-2xl p-6">
      <div className="flex justify-between">
        <p className="text-foreground/60 text-lg">Stories</p>
        <button onClick={() => setStoriesOpen(false)} className="text-foreground/50 cursor-pointer text-2xl leading-0 hover:text-foreground transition-colors" aria-label="Close">
          &times;
        </button>
      </div>

      <ProgressBar amount={amount} currentIndex={currentIndex} progress={progress} />

      <div className="h-full self-center w-full rounded-xl max-w-xs aspect-9/16 overflow-hidden flex items-center justify-center">
        <img src={urls[currentIndex]} alt={`Story ${currentIndex + 1}`} className="w-full h-full object-cover" />
      </div>
    </dialog>
  );
}

export default function StoryButton({ urls }: { urls: string[] }) {
  const [storiesOpen, setStoriesOpen] = useState(false);
  const handleStoryClick = () => {
    setStoriesOpen(true);
  };

  return (
    <>
      <button onClick={handleStoryClick} className="w-16 h-16 cursor-pointer rounded-full bg-linear-to-br from-pink-300 to-purple-700 p-0.5">
        <div className="w-full h-full rounded-full bg-background p-0.5 flex items-center justify-center">
          <img src={urls[0]} alt="See User's Story" className="w-full h-full rounded-full object-cover" />
        </div>
      </button>
      {storiesOpen && <Stories urls={urls} storiesOpen={storiesOpen} setStoriesOpen={setStoriesOpen} duration={3000} />}
    </>
  );
}
