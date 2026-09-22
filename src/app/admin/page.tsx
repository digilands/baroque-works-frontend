import { redirect } from "next/navigation";
import {
  getBookings,
  getSessionUser,
  getUsersList,
} from "@/lib/server/queries";
import { formatDate, formatNaira } from "@/lib/server/mappers";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

/**
 * Read-only admin overview (v1). Server-enforced: only `admin` sessions
 * may view; everyone else is bounced to the separate admin login.
 */
export default async function AdminPage() {
  const user = await getSessionUser().catch(() => null);
  if (!user || user.role !== "admin") redirect("/admin/login");

  const [{ users }, { bookings }] = await Promise.all([
    getUsersList({ limit: 20 }),
    getBookings({ limit: 20 }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500">
          Signed in as {user.fullname ?? user.email} · {users.length} users ·{" "}
          {bookings.length} recent bookings
        </p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Users</h2>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 font-bold">Name</th>
                <th className="px-5 py-3 font-bold">Email</th>
                <th className="px-5 py-3 font-bold">Role</th>
                <th className="px-5 py-3 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 font-bold text-gray-900">{u.fullname ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold capitalize">
                      {u.role ?? "none"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent bookings</h2>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 font-bold">Ref</th>
                <th className="px-5 py-3 font-bold">Source</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold">Amount</th>
                <th className="px-5 py-3 font-bold">Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 font-mono text-gray-500">#{b._id?.slice(-6)}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {b.bookingSource === "JOB_PROPOSAL" ? "Job proposal" : "Direct"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                      {(b.status ?? "PENDING").replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-gray-900">
                    {formatNaira(b.totalAmount ?? 0)}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
