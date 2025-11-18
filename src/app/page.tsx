"use client";
import { useRef, useState, useEffect } from "react";
import StoryButton from "@/app/components/storyButton";

type Story = {
  id: string;
  urls: string[];
  createdAt: number;
  expiresAt: number;
};

const TEST_DURATION = 24 * 60 * 60 * 1000;

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokeStoryUrls = (s: Story) => {
    s.urls.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {
        /* ignore */
      }
    });
  };
  const purgeExpired = () => {
    const now = Date.now();
    setStories((prev) => {
      const alive = prev.filter((s) => s.expiresAt > now);

      if (alive.length !== prev.length) {
        const expired = prev.filter((s) => s.expiresAt <= now);
        expired.forEach(revokeStoryUrls);
      }

      return alive;
    });
  };

  const addStory = () => {
    fileInputRef.current?.click();
  };

  const createStoryFromFiles = (files: File[]): Story => {
    const urls = files.map((f) => URL.createObjectURL(f));
    const now = Date.now();
    return {
      id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
      urls,
      createdAt: now,
      expiresAt: now + TEST_DURATION,
    };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const story = createStoryFromFiles(files);
    setStories((prev) => [...prev, story]);

    event.target.value = "";
  };

  useEffect(() => {
    const intervalId = setInterval(purgeExpired, 1000);
    purgeExpired();
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground font-sans px-8 py-12">
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex gap-2">
        <button
          onClick={addStory}
          className="w-16 h-16 rounded-full cursor-pointer bg-white/10 p-0.5"
          type="button"
          aria-label="Add"
        >
          <div className="w-full h-full rounded-full bg-background p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
        </button>

        {stories.map((story) => (
          <StoryButton urls={story.urls} key={story.id} />
        ))}
      </div>
    </main>
  );
}
