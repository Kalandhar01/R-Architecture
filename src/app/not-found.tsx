import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-full border border-[#6D1018]/20 bg-[#6D1018]/5">
          <span className="font-display text-2xl text-[#6D1018]">R</span>
        </div>
        <h1 className="font-display text-3xl font-light text-[#111111]">Page not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#111111]/60">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-3 border-2 border-[#111111]/20 px-8 py-4 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[#111111] transition-all duration-500 hover:border-[#6D1018] hover:bg-[#6D1018] hover:text-white"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
