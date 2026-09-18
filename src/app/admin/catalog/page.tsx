import { redirect } from "next/navigation";
import CatalogManager from "@/components/admin/CatalogManager";
import {
  getAllSubcategories,
  getAllTags,
  getCategories,
  getSessionUser,
} from "@/lib/server/queries";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

/** Admin catalog management — server-enforced admin sessions only. */
export default async function CatalogPage() {
  const user = await getSessionUser().catch(() => null);
  if (!user || user.role !== "admin") redirect("/admin/login");

  const [categories, subcategories, tags] = await Promise.all([
    getCategories(),
    getAllSubcategories(),
    getAllTags(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catalog</h1>
        <p className="text-sm text-gray-500">Manage service categories, subcategories, and tags.</p>
      </div>
      <CatalogManager categories={categories} subcategories={subcategories} tags={tags} />
    </div>
  );
}
