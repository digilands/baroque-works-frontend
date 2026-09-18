import Link from "next/link";

/** Shared "service unavailable" UI — used inline by the detail page and
 * as the segment not-found boundary. */
export function ServiceNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">
        Service not found
      </p>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
        This service is no longer available
      </h1>
      <p className="text-gray-500 font-medium max-w-md mb-8">
        It may have been removed by the pro. Browse similar services instead.
      </p>
      <div className="flex gap-4">
        <Link
          href="/home"
          className="px-6 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all"
        >
          Browse services
        </Link>
        <Link
          href="/search"
          className="px-6 py-3.5 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all"
        >
          Search pros
        </Link>
      </div>
    </div>
  );
}

export default ServiceNotFound;
