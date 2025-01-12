import JoinOrCreateForm from "@/app/components/JoinOrCreateForm";
import Link from "next/link";

const YoutubeLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-red-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 p-4">
      <main className="flex-grow flex flex-col items-center justify-center w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-4">
            <YoutubeLogo />
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Youtube-Cowatch
            </h1>
          </div>
          <p className="text-indigo-300 mt-2 text-lg">
            Watch YouTube together. Instantly.
          </p>
        </div>
        <JoinOrCreateForm />
      </main>
      <footer className="w-full text-center py-4">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
        >
          Admin Panel
        </Link>
      </footer>
    </div>
  );
}
