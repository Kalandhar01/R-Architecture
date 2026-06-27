"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react"

interface OurWorkProject {
  _id: string
  title: string
  slug: string
  division: string
  shortDescription: string
  description: string
  location: string
  status: string
  coverImage: string
  galleryImages: string[]
  featured: boolean
  published: boolean
  position: number
  createdAt: string
  updatedAt: string
}

interface ProjectFormData {
  title: string
  slug: string
  shortDescription: string
  description: string
  location: string
  status: string
  coverImage: string
  galleryImages: string[]
  featured: boolean
  published: boolean
}

const emptyForm: ProjectFormData = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  location: "",
  status: "Completed",
  coverImage: "",
  galleryImages: [],
  featured: false,
  published: true,
}

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Ongoing: "bg-amber-50 text-amber-700 border-amber-200",
  Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
}

function slugify(val: string) {
  return val
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-[#dfcfaa]/40">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className={`h-4 rounded bg-[#ede5d6] ${i === 0 ? "w-12" : i === 1 ? "w-36" : i === 2 ? "w-24" : i === 3 ? "w-20" : i === 4 ? "w-16" : i === 5 ? "w-24" : "w-20"}`} />
        </td>
      ))}
    </tr>
  )
}

export default function OurWorksDashboard() {
  const [projects, setProjects] = useState<OurWorkProject[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [featuredFilter, setFeaturedFilter] = useState("All")

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProjectFormData>({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [viewProject, setViewProject] = useState<OurWorkProject | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const fetchProjects = useCallback(async (p?: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ admin: "true", limit: "15", division: "Architecture" })
      if (p) params.set("page", String(p))
      if (search) params.set("search", search)
      if (statusFilter !== "All") params.set("status", statusFilter)
      if (featuredFilter !== "All") params.set("featured", featuredFilter)

      const res = await fetch(`/api/our-works?${params}`)
      const data = await res.json()
      setProjects(data.projects || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
      setPage(data.page || 1)
    } catch {
      console.error("Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, featuredFilter])

  useEffect(() => {
    fetchProjects(1)
  }, [fetchProjects])

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormOpen(true)
  }

  const openEdit = (project: OurWorkProject) => {
    setForm({
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      location: project.location || "",
      status: project.status,
      coverImage: project.coverImage || "",
      galleryImages: project.galleryImages || [],
      featured: project.featured || false,
      published: project.published ?? true,
    })
    setEditingId(project._id)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/our-works/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error("Update failed")
      } else {
        const res = await fetch("/api/our-works", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, division: "Architecture" }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Create failed")
        }
      }
      closeForm()
      fetchProjects(page)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/our-works/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      setDeleteId(null)
      fetchProjects(page)
    } catch {
      alert("Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  const uploadFile = async (file: File, isCover: boolean) => {
    setUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/our-works/upload", { method: "POST", body: formData })
      const data = await res.json()
      clearInterval(interval)
      setUploadProgress(100)

      if (data.url) {
        if (isCover) {
          setForm((f) => ({ ...f, coverImage: data.url }))
        } else {
          setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, data.url] }))
        }
      }
    } catch {
      clearInterval(interval)
      alert("Upload failed")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) uploadFile(file, true)
  }

  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"))
    files.forEach((file) => uploadFile(file, false))
  }

  const removeGalleryImage = (index: number) => {
    setForm((f) => ({
      ...f,
      galleryImages: f.galleryImages.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#15110d]">Our Works</h1>
            <p className="mt-1 text-sm text-[#62594f]">
              {total} project{total !== 1 ? "s" : ""} • Page {page} of {totalPages}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-[#8B1118] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#741016]"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#62594f]" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-[#dfcfaa]/60 bg-white py-2.5 pl-10 pr-4 text-sm text-[#15110d] outline-none placeholder:text-[#62594f]/50 focus:border-[#C9A45C]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-[#dfcfaa]/60 bg-white px-4 py-2.5 text-sm text-[#62594f] outline-none focus:border-[#C9A45C]"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-[#dfcfaa]/60 bg-white px-4 py-2.5 text-sm text-[#62594f] outline-none focus:border-[#C9A45C]"
          >
            <option value="All">All Projects</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 rounded-xl bg-[#15110d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a241e]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Apply
          </button>
        </div>

        {/* Data Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#dfcfaa]/60 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#dfcfaa]/60 bg-[#fbf7ef]">
                {["Cover", "Project Title", "Location", "Status", "Featured", "Last Updated", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#62594f]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-[#62594f]">
                    <Building2 className="mx-auto h-10 w-10 mb-3 opacity-40" />
                    <p className="font-semibold">No projects found</p>
                    <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id} className="border-b border-[#dfcfaa]/40 transition hover:bg-[#fbf7ef]/60">
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-[#ede5d6]">
                        {project.coverImage ? (
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#dfcfaa] text-[0.55rem] font-semibold uppercase">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#15110d]">{project.title}</p>
                      <p className="mt-0.5 text-[0.65rem] text-[#9d742a]">{project.shortDescription || project.description?.slice(0, 60)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-[#62594f]">
                        <MapPin className="h-3.5 w-3.5 text-[#9d742a]" />
                        {project.location || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${statusStyles[project.status] || "bg-stone-50 text-stone-600 border-stone-200"}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#C9A45C]/15 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-[#C9A45C]">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[0.6rem] text-[#dfcfaa]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#62594f]">
                      {formatDate(project.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewProject(project)}
                          className="rounded-lg p-2 text-[#62594f] transition hover:bg-[#ede5d6] hover:text-[#15110d]"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(project)}
                          className="rounded-lg p-2 text-[#62594f] transition hover:bg-[#ede5d6] hover:text-[#15110d]"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(project._id)}
                          className="rounded-lg p-2 text-[#62594f] transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => fetchProjects(page - 1)}
              className="rounded-xl border border-[#dfcfaa]/60 px-4 py-2 text-sm font-semibold text-[#62594f] transition hover:border-[#C9A45C] disabled:opacity-30"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-[#dfcfaa]">...</span>
                  )}
                  <button
                    onClick={() => fetchProjects(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${
                      p === page
                        ? "bg-[#8B1118] text-white shadow"
                        : "text-[#62594f] hover:bg-[#ede5d6]"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              disabled={page >= totalPages}
              onClick={() => fetchProjects(page + 1)}
              className="rounded-xl border border-[#dfcfaa]/60 px-4 py-2 text-sm font-semibold text-[#62594f] transition hover:border-[#C9A45C] disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10 sm:p-8">
            <div className="w-full max-w-3xl rounded-2xl border border-[#dfcfaa]/60 bg-white p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[#15110d]">
                  {editingId ? "Edit Project" : "New Project"}
                </h2>
                <button onClick={closeForm} className="text-[#62594f] hover:text-[#15110d]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Project Title</label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        title: e.target.value,
                        slug: editingId ? f.slug : slugify(e.target.value),
                      }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-2.5 text-sm text-[#15110d] outline-none focus:border-[#C9A45C]"
                    placeholder="Enter project title"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    className="mt-1.5 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-2.5 text-sm text-[#62594f] outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Short Description</label>
                  <textarea
                    value={form.shortDescription}
                    onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                    rows={2}
                    className="mt-1.5 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-2.5 text-sm text-[#15110d] outline-none resize-none focus:border-[#C9A45C]"
                    placeholder="Brief summary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-2.5 text-sm text-[#15110d] outline-none focus:border-[#C9A45C]"
                    placeholder="City, State"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Full Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={4}
                    className="mt-1.5 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-2.5 text-sm text-[#15110d] outline-none resize-none focus:border-[#C9A45C]"
                    placeholder="Detailed project description"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-2.5 text-sm text-[#15110d] outline-none focus:border-[#C9A45C]"
                  >
                    <option>Completed</option>
                    <option>Ongoing</option>
                    <option>Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Category</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-amber-700/20 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700">
                    <Building2 className="h-4 w-4" />
                    Architecture
                  </div>
                </div>

                <div className="flex items-end gap-6">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#62594f]">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                      className="h-4 w-4 rounded border-[#dfcfaa]/60 text-[#8B1118] focus:ring-[#8B1118]"
                    />
                    <span className="font-semibold">Featured Project</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#62594f]">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                      className="h-4 w-4 rounded border-[#dfcfaa]/60 text-[#8B1118] focus:ring-[#8B1118]"
                    />
                    <span className="font-semibold">Published</span>
                  </label>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Cover Image</label>
                {form.coverImage ? (
                  <div className="group relative mt-1.5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#ede5d6]">
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#15110d] shadow transition hover:bg-white"
                      >
                        Replace
                      </button>
                      <button
                        onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                        className="rounded-full bg-red-500/90 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={handleCoverDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-10 transition hover:border-[#C9A45C] hover:bg-[#ede5d6]/50"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-[#C9A45C]" />
                        <div className="h-2 w-48 overflow-hidden rounded-full bg-[#ede5d6]">
                          <div
                            className="h-full rounded-full bg-[#C9A45C] transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#62594f]">Uploading... {uploadProgress}%</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-2 h-8 w-8 text-[#dfcfaa] group-hover:text-[#C9A45C]" />
                        <p className="text-sm font-semibold text-[#62594f]">Drop cover image here or click to browse</p>
                        <p className="mt-0.5 text-xs text-[#dfcfaa]">Recommended: 1920×1080 • WebP</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadFile(file, true)
                    e.target.value = ""
                  }}
                />
              </div>

              {/* Gallery Images Upload */}
              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">
                  Gallery Images {form.galleryImages.length > 0 && `(${form.galleryImages.length})`}
                </label>
                <div
                  onDrop={handleGalleryDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="mt-1.5"
                >
                  <div className="flex flex-wrap gap-3">
                    {form.galleryImages.map((url, i) => (
                      <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-xl bg-[#ede5d6] shadow-sm">
                        <img
                          src={url}
                          alt={`Gallery ${i + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <button
                          onClick={() => removeGalleryImage(i)}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={uploading}
                      className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-[#dfcfaa]/60 bg-[#fbf7ef] text-[#dfcfaa] transition hover:border-[#C9A45C] hover:text-[#C9A45C] disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[0.6rem] text-[#dfcfaa]">Drag & drop images here or click to add. Supports WebP, JPEG, PNG.</p>
                </div>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    files.forEach((file) => uploadFile(file, false))
                    e.target.value = ""
                  }}
                />
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex justify-end gap-3 border-t border-[#dfcfaa]/40 pt-6">
                <button
                  onClick={closeForm}
                  className="rounded-full border border-[#dfcfaa]/60 px-6 py-2.5 text-sm font-semibold text-[#62594f] transition hover:border-[#C9A45C]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.slug}
                  className="inline-flex items-center gap-2 rounded-full bg-[#8B1118] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#741016] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Update Project" : "Create Project"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              <button
                onClick={() => setViewProject(null)}
                className="absolute right-4 top-4 text-[#62594f] hover:text-[#15110d]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-xl bg-[#ede5d6]">
                {viewProject.coverImage ? (
                  <img
                    src={viewProject.coverImage}
                    alt={viewProject.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#dfcfaa] text-sm font-semibold">No Cover Image</div>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#15110d]">{viewProject.title}</h2>
                  <div className="mt-1 flex items-center gap-3 text-sm text-[#62594f]">
                    <MapPin className="h-4 w-4 text-[#9d742a]" />
                    {viewProject.location || "Location not set"}
                  </div>
                </div>
                <span className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-wider ${statusStyles[viewProject.status] || ""}`}>
                  {viewProject.status}
                </span>
              </div>

              {viewProject.shortDescription && (
                <p className="mt-3 text-sm font-semibold text-[#62594f]">{viewProject.shortDescription}</p>
              )}
              {viewProject.description && (
                <p className="mt-2 text-sm leading-relaxed text-[#62594f]">{viewProject.description}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#62594f]">
                <span className="rounded-full bg-[#fbf7ef] px-3 py-1">
                  <strong>Division:</strong> {viewProject.division}
                </span>
                <span className="rounded-full bg-[#fbf7ef] px-3 py-1">
                  <strong>Slug:</strong> {viewProject.slug}
                </span>
                <span className="rounded-full bg-[#fbf7ef] px-3 py-1">
                  <strong>Featured:</strong> {viewProject.featured ? "Yes" : "No"}
                </span>
                {viewProject.createdAt && (
                  <span className="rounded-full bg-[#fbf7ef] px-3 py-1">
                    <strong>Created:</strong> {formatDate(viewProject.createdAt)}
                  </span>
                )}
              </div>

              {viewProject.galleryImages && viewProject.galleryImages.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#62594f]">Gallery ({viewProject.galleryImages.length})</h3>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {viewProject.galleryImages.map((url, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-[#ede5d6]">
                        <img
                          src={url}
                          alt={`${viewProject.title} gallery ${i + 1}`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3 border-t border-[#dfcfaa]/40 pt-4">
                <button
                  onClick={() => { setViewProject(null); openEdit(viewProject) }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#dfcfaa]/60 px-5 py-2 text-sm font-semibold text-[#62594f] transition hover:border-[#C9A45C]"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => { setViewProject(null); setDeleteId(viewProject._id) }}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button
                  onClick={() => setViewProject(null)}
                  className="rounded-full bg-[#8B1118] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#741016]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-[#15110d]">Delete Project</h3>
              <p className="mt-2 text-sm text-[#62594f]">
                Are you sure you want to delete this project? This will also remove all associated images from Cloudinary.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="rounded-full border border-[#dfcfaa]/60 px-5 py-2 text-sm font-semibold text-[#62594f] transition hover:border-[#C9A45C]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
