import Link from "next/link";

/** Global fallback for unknown routes and unhandled notFound() calls. */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white">
      <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">
        404 · Page not found
      </p>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
        This page doesn&apos;t exist
      </h1>
      <p className="text-gray-500 font-medium max-w-md mb-8">
        The link may be broken or the page may have moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all"
      >
        Back to home
      </Link>
    </div>
  );
}
