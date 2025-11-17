"use client";
import { useRef, useState } from "react";
import StoryButton from "@/app/components/storyButton";

export default function Home() {
  // each story is an array of image URLs
  const [stories, setStories] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addStory = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const urls = files.map((f) => URL.createObjectURL(f));
    setStories((prev) => [...prev, urls]);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground font-sans px-8 py-12">
      <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

      <div className="flex gap-2">
        <button onClick={addStory} className="w-16 h-16 rounded-full cursor-pointer bg-white/10 p-0.5" type="button" aria-label="Add">
          <div className="w-full h-full rounded-full bg-background p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
        </button>

        {stories.map((urls, index) => (
          <StoryButton urls={urls} key={index} />
        ))}
      </div>
    </main>
  );
}
