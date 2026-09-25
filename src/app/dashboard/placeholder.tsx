import Link from "next/link";

/**
 * Shared shell for dashboard nav destinations that don't have a full
 * implementation yet (Earnings, Calendar, Messages, Settings, Support).
 * Keeps the sidebar free of 404s while those screens are built.
 */
export default function DashboardPlaceholderPage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-lg mx-auto py-16 text-center">
      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
        Coming soon
      </p>
      <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-3">
        {title}
      </h1>
      <p className="text-gray-500 font-medium mb-8">
        {description ?? `The ${title.toLowerCase()} screen is on the way. Meanwhile, your dashboard has the essentials.`}
      </p>
      <Link
        href="/dashboard"
        className="inline-block px-6 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
