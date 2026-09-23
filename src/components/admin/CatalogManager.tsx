"use client";

import React, { useState } from "react";
import {
  useCreateAdminCategory,
  useCreateAdminSubcategory,
  useCreateAdminTag,
  useDeleteAdminCategory,
  useDeleteAdminSubcategory,
  useDeleteAdminTag,
  useUpdateAdminCategory,
  useUpdateAdminSubcategory,
  useUpdateAdminTag,
} from "@/hooks/useAdmin";
import type {
  ApiTag,
  ProfessionSubCategory,
  ServiceCategory,
} from "@/lib/server/queries";
import StyledSelect from "@/components/ui/StyledSelect";

interface CatalogManagerProps {
  categories: ServiceCategory[];
  subcategories: ProfessionSubCategory[];
  tags: ApiTag[];
}

type Tab = "categories" | "subcategories" | "tags";

const PROFESSIONS = ["plumber", "electrician", "painter", "masonry", "designer"];
const TAG_CATEGORIES = ["urgency", "location", "quality", "price", "features", "availability", "additional"];

const inputClasses =
  "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gray-900";
const btnPrimary =
  "px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50";
const btnDanger =
  "px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-800 transition-colors";
const btnEdit =
  "px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors";

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ErrorNote({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
      {message}
    </p>
  );
}

function CategoryTab({ initial }: { initial: ServiceCategory[] }) {
  const [rows, setRows] = useState(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const create = useCreateAdminCategory();
  const update = useUpdateAdminCategory();
  const remove = useDeleteAdminCategory();
  const [form, setForm] = useState({ code: "", displayName: "", description: "" });
  const [editName, setEditName] = useState("");

  const refreshLocal = (list: ServiceCategory[]) => setRows(list);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = async () => {
    if (!form.code.trim() || !form.displayName.trim()) return;
    const res = (await create.mutateAsync({
      code: form.code.trim(),
      displayName: form.displayName.trim(),
      description: form.description.trim() || undefined,
    })) as { category?: ServiceCategory } | null;
    const created = (res as { category?: ServiceCategory })?.category;
    if (created?._id) refreshLocal([...rows, created]);
    setForm({ code: "", displayName: "", description: "" });
    setShowCreate(false);
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await update.mutateAsync({ id, input: { displayName: editName.trim() } });
    refreshLocal(rows.map((r) => (r._id === id ? { ...r, displayName: editName.trim() } : r)));
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await remove.mutateAsync(id);
    refreshLocal(rows.filter((r) => r._id !== id));
  };

  const error = create.error?.message ?? update.error?.message ?? remove.error?.message;

  return (
    <Section
      title={`Categories (${rows.length})`}
      action={
        <button onClick={() => setShowCreate((v) => !v)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
          {showCreate ? "Close" : "+ New category"}
        </button>
      }
    >
      <ErrorNote message={error} />
      {showCreate && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <input value={form.code} onChange={set("code")} placeholder="code (e.g. plumbing)" className={inputClasses} />
          <input value={form.displayName} onChange={set("displayName")} placeholder="Display name" className={inputClasses} />
          <input value={form.description} onChange={set("description")} placeholder="Description (optional)" className={inputClasses} />
          <button onClick={handleCreate} disabled={create.isPending} className={btnPrimary}>
            {create.isPending ? "Creating…" : "Create"}
          </button>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100">
            <th className="py-2 font-bold">Code</th>
            <th className="py-2 font-bold">Display name</th>
            <th className="py-2 font-bold">Active</th>
            <th className="py-2 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 font-mono text-gray-500">{row.code}</td>
              <td className="py-2.5 font-bold text-gray-900">
                {editingId === row._id ? (
                  <span className="flex gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={inputClasses}
                    />
                    <button onClick={() => row._id && handleRename(row._id)} className={btnPrimary}>
                      Save
                    </button>
                  </span>
                ) : (
                  row.displayName
                )}
              </td>
              <td className="py-2.5 text-gray-500">{row.isActive === false ? "No" : "Yes"}</td>
              <td className="py-2.5 text-right whitespace-nowrap">
                <button
                  onClick={() => {
                    setEditingId(row._id ?? null);
                    setEditName(row.displayName ?? "");
                  }}
                  className={btnEdit}
                >
                  Edit
                </button>
                <button onClick={() => row._id && handleDelete(row._id)} className={btnDanger}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-400">No categories yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </Section>
  );
}

function SubcategoryTab({ initial }: { initial: ProfessionSubCategory[] }) {
  const [rows, setRows] = useState(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const create = useCreateAdminSubcategory();
  const update = useUpdateAdminSubcategory();
  const remove = useDeleteAdminSubcategory();
  const [form, setForm] = useState({ displayName: "", profession: PROFESSIONS[0], description: "" });

  const handleCreate = async () => {
    if (!form.displayName.trim()) return;
    const res = (await create.mutateAsync({
      displayName: form.displayName.trim(),
      profession: form.profession,
      description: form.description.trim() || undefined,
    })) as { subcategory?: ProfessionSubCategory } | null;
    const created = (res as { subcategory?: ProfessionSubCategory })?.subcategory;
    if (created?._id) setRows([...rows, created]);
    setForm({ displayName: "", profession: PROFESSIONS[0], description: "" });
    setShowCreate(false);
  };

  const handleDelete = async (id: string) => {
    await remove.mutateAsync(id);
    setRows(rows.filter((r) => r._id !== id));
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await update.mutateAsync({ id, input: { displayName: editName.trim() } });
    setRows(rows.map((r) => (r._id === id ? { ...r, displayName: editName.trim() } : r)));
    setEditingId(null);
  };

  const error = create.error?.message ?? update.error?.message ?? remove.error?.message;

  return (
    <Section
      title={`Subcategories (${rows.length})`}
      action={
        <button onClick={() => setShowCreate((v) => !v)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
          {showCreate ? "Close" : "+ New subcategory"}
        </button>
      }
    >
      <ErrorNote message={error} />
      {showCreate && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <input
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            placeholder="Display name"
            className={inputClasses}
          />
          <StyledSelect
            value={form.profession}
            onChange={(v) => setForm((f) => ({ ...f, profession: v }))}
            options={PROFESSIONS.map((p) => ({ value: p, label: p }))}
            aria-label="Profession"
            className="w-full"
            triggerClassName={inputClasses}
          />
          <input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Description (optional)"
            className={inputClasses}
          />
          <button onClick={handleCreate} disabled={create.isPending} className={btnPrimary}>
            {create.isPending ? "Creating…" : "Create"}
          </button>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100">
            <th className="py-2 font-bold">Display name</th>
            <th className="py-2 font-bold">Profession</th>
            <th className="py-2 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 font-bold text-gray-900">
                {editingId === row._id ? (
                  <span className="flex gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={inputClasses}
                    />
                    <button onClick={() => row._id && handleRename(row._id)} className={btnPrimary}>
                      Save
                    </button>
                  </span>
                ) : (
                  row.displayName
                )}
              </td>
              <td className="py-2.5 text-gray-500 capitalize">{row.profession}</td>
              <td className="py-2.5 text-right whitespace-nowrap">
                <button
                  onClick={() => {
                    setEditingId(row._id ?? null);
                    setEditName(row.displayName ?? "");
                  }}
                  className={btnEdit}
                >
                  Edit
                </button>
                <button onClick={() => row._id && handleDelete(row._id)} className={btnDanger}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="py-8 text-center text-gray-400">No subcategories yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </Section>
  );
}

function TagTab({ initial }: { initial: ApiTag[] }) {
  const [rows, setRows] = useState(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const create = useCreateAdminTag();
  const update = useUpdateAdminTag();
  const remove = useDeleteAdminTag();
  const [form, setForm] = useState({ displayName: "", category: TAG_CATEGORIES[0], color: "" });

  const handleCreate = async () => {
    if (!form.displayName.trim()) return;
    const res = (await create.mutateAsync({
      displayName: form.displayName.trim(),
      category: form.category,
      color: form.color.trim() || undefined,
    })) as { tag?: ApiTag } | null;
    const created = (res as { tag?: ApiTag })?.tag;
    if (created?._id) setRows([...rows, created]);
    setForm({ displayName: "", category: TAG_CATEGORIES[0], color: "" });
    setShowCreate(false);
  };

  const handleDelete = async (id: string) => {
    await remove.mutateAsync(id);
    setRows(rows.filter((r) => r._id !== id));
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await update.mutateAsync({ id, input: { displayName: editName.trim() } });
    setRows(rows.map((r) => (r._id === id ? { ...r, displayName: editName.trim() } : r)));
    setEditingId(null);
  };

  const error = create.error?.message ?? update.error?.message ?? remove.error?.message;

  return (
    <Section
      title={`Tags (${rows.length})`}
      action={
        <button onClick={() => setShowCreate((v) => !v)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
          {showCreate ? "Close" : "+ New tag"}
        </button>
      }
    >
      <ErrorNote message={error} />
      {showCreate && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <input
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            placeholder="Display name"
            className={inputClasses}
          />
          <StyledSelect
            value={form.category}
            onChange={(v) => setForm((f) => ({ ...f, category: v }))}
            options={TAG_CATEGORIES.map((c) => ({ value: c, label: c }))}
            aria-label="Tag category"
            className="w-full"
            triggerClassName={inputClasses}
          />
          <input
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            placeholder="Color (optional)"
            className={inputClasses}
          />
          <button onClick={handleCreate} disabled={create.isPending} className={btnPrimary}>
            {create.isPending ? "Creating…" : "Create"}
          </button>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100">
            <th className="py-2 font-bold">Display name</th>
            <th className="py-2 font-bold">Category</th>
            <th className="py-2 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 font-bold text-gray-900">
                {editingId === row._id ? (
                  <span className="flex gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={inputClasses}
                    />
                    <button onClick={() => row._id && handleRename(row._id)} className={btnPrimary}>
                      Save
                    </button>
                  </span>
                ) : (
                  row.displayName
                )}
              </td>
              <td className="py-2.5 text-gray-500 capitalize">{row.category}</td>
              <td className="py-2.5 text-right whitespace-nowrap">
                <button
                  onClick={() => {
                    setEditingId(row._id ?? null);
                    setEditName(row.displayName ?? "");
                  }}
                  className={btnEdit}
                >
                  Edit
                </button>
                <button onClick={() => row._id && handleDelete(row._id)} className={btnDanger}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="py-8 text-center text-gray-400">No tags yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </Section>
  );
}

/** Admin catalog manager: categories, subcategories, tags. */
export default function CatalogManager({ categories, subcategories, tags }: CatalogManagerProps) {
  const [tab, setTab] = useState<Tab>("categories");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-white border border-gray-200 p-1.5 rounded-2xl w-full max-w-md">
        {(["categories", "subcategories", "tags"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
              tab === t ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "categories" && <CategoryTab initial={categories} />}
      {tab === "subcategories" && <SubcategoryTab initial={subcategories} />}
      {tab === "tags" && <TagTab initial={tags} />}
    </div>
  );
}
