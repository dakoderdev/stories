import Circle from "@/app/components/Circle";
import Stories from "@/app/components/Stories"; 

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground font-sans px-8 py-12">
      <div className="flex gap-2">
        <Circle isAddButton={true} />
        {[...Array(5)].map((_, index) => (
          <Circle key={index} />
        ))}
      </div>
      <Stories />
    </main>
  );
}
