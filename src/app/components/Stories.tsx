"use client";
import { useEffect, useRef, useState } from "react";

export function ProgressBar({ amount, currentStory = 0, progress = 0 }) {
  function currentProgress(index) {
    if (index < currentStory) return 100;
    if (index === currentStory) return progress;
    return 0;
  }

  return (
    <div className="flex w-full gap-1 h-1">
      {[...Array(amount)].map((_, index) => (
        <div key={index} className="grow h-full rounded-full bg-white/20">
          <div
            style={{ width: currentProgress(index) + "%" }}
            className="bg-white h-full rounded-full transition-all"
          />
        </div>
      ))}
    </div>
  );
}

export default function Stories() {
  const [amount] = useState(5);
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(true);

  const dialogRef = useRef(null);
  const intervalRef = useRef(null);
  const countRef = useRef(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    return () => dialog.close();
  }, []);

  useEffect(() => {
    if (!open) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    countRef.current = 0;

    const duration = 3000;
    const tick = 100;
    const steps = duration / tick;

    intervalRef.current = setInterval(() => {
      countRef.current += 1;
      const pct = Math.min(100, (countRef.current / steps) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(intervalRef.current);
        const next = currentStory + 1;

        if (next >= amount) {
          setOpen(false);
          return;
        }

        setCurrentStory(next);
        setProgress(0);
      }
    }, tick);

    return () => clearInterval(intervalRef.current);
  }, [currentStory, open, amount]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed gap-2 flex flex-col top-1/2 left-1/2 -translate-1/2 w-9/10 h-9/10 bg-background border border-white/20 rounded-2xl p-6"
    >
      <div className="flex justify-between">
        <p className="text-foreground/60 text-lg">Stories</p>
        <button
          onClick={() => setOpen(false)}
          className="text-foreground/50 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          X
        </button>
      </div>

      <ProgressBar amount={amount} currentStory={currentStory} progress={progress} />
    </dialog>
  );
}
