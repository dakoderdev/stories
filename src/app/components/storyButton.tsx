import Image from "next/image";
import { useState, useEffect } from "react";

export function ProgressBar({storiesOpen, amount = 1, duration = 3000 }: { storiesOpen: boolean; amount?: number; duration?: number }) {
  const [progress, setProgress] = useState(0);

  function timer() {
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    if (storiesOpen) {
      setProgress(0);
      startTimer = setTimeout(() => setProgress(100), 20);
    } else {
      setProgress(0);
    }
    return () => {
      if (startTimer) clearTimeout(startTimer);
    };
  }
  useEffect(() => {
    timer();
  }, [storiesOpen]);

  return (
    <div className="flex w-full gap-1 h-1">
      {[...Array(amount)].map((_, index) => (
        <div key={index} className="grow h-full rounded-full bg-white/20 overflow-hidden">
          <div
            style={{ width: `${progress}%`, transition: `width ${duration}ms linear` }}
            className="bg-white h-full rounded-full"
          />
        </div>
      ))}
    </div>
  );
}

export function Stories({url, storiesOpen, setStoriesOpen}: {url: string; storiesOpen: boolean; setStoriesOpen: (open: boolean) => void }) {
  return (
    <dialog open className="fixed gap-2 flex flex-col items-stretch top-1/2 left-1/2 -translate-1/2 w-9/10 h-9/10 bg-background border border-white/20 rounded-2xl p-6">
      <div className="flex justify-between">
        <p className="text-foreground/60 text-lg">Stories</p>
        <button onClick={() => setStoriesOpen(false)} className="text-foreground/50 cursor-pointer hover:text-foreground transition-colors" aria-label="Close">
          X
        </button>
      </div>
      <ProgressBar storiesOpen={storiesOpen} duration={3000} />
      <Image src={url} alt="User's Story" className="h-full self-center w-full rounded-xl max-w-xs aspect-9/16 object-cover" width={64} height={64} />
    </dialog>
  );
}

export default function StoryButton({ url }: { url: string }) {
    const [storiesOpen, setStoriesOpen] = useState(false);
    const handleStoryClick = () => {
        setStoriesOpen(true);
        setTimeout(() => {
            setStoriesOpen(false);
        }, 3000);
    }

  return (
    <>
        <button onClick={handleStoryClick} className="w-16 h-16 cursor-pointer rounded-full bg-linear-to-br from-pink-300 to-purple-700 p-0.5">
        <div className="w-full h-full rounded-full bg-background p-0.5 flex items-center justify-center">
            <Image src={url} alt="See User's Story" className="w-full h-full rounded-full object-cover" width={64} height={64} />
        </div>
        </button>
        {storiesOpen && <Stories url={url} storiesOpen={storiesOpen} setStoriesOpen={setStoriesOpen} />}
    </>
  );
}
