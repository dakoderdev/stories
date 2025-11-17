
import Image from "next/image";

const imageUrl = "https://picsum.photos/100"

function AddButtonCircle() {
  return (
    <button className="w-16 h-16 rounded-full cursor-pointer bg-white/10 p-0.5" type="button" aria-label="Add">
      <div className="w-full h-full rounded-full bg-background p-0.5 flex items-center justify-center">
        <div
          className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white"
        >
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
  );
}

function PreviewCircle() {
  return (
    <button className="w-16 h-16 cursor-pointer rounded-full bg-linear-to-br from-pink-300 to-purple-700 p-0.5">
      <div className="w-full h-full rounded-full bg-background p-0.5 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt="Abstract"
          className="w-full h-full rounded-full object-cover"
          width={64}
          height={64}
        />
      </div>
    </button>
  )
}

export default function Circle({ isAddButton = false }: { isAddButton?: boolean }) {
  return isAddButton ? <AddButtonCircle /> : <PreviewCircle />
}