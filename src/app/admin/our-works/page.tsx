"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Edit3, Plus, Trash2, X } from "lucide-react"

interface Project {
  _id: string
  title: string
  slug: string
  category: string
  description: string
  location: string
  status: string
  coverImage: string
  galleryImages: string[]
  featured: boolean
  published: boolean
  position: number
}

const emptyForm = {
  title: "",
  slug: "",
  category: "Architecture Works",
  description: "",
  location: "",
  status: "Completed",
  coverImage: "",
  galleryImages: [] as string[],
  featured: false,
  published: true,
  position: 0,
}

export default function OurWorksAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(emptyForm)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/our-works")
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const startCreate = () => {
    setForm(emptyForm)
    setEditing(null)
  }

  const startEdit = (project: Project) => {
    setForm({
      title: project.title,
      slug: project.slug,
      category: project.category,
      description: project.description || "",
      location: project.location || "",
      status: project.status || "Completed",
      coverImage: project.coverImage || "",
      galleryImages: project.galleryImages || [],
      featured: project.featured || false,
      published: project.published ?? true,
      position: project.position || 0,
    })
    setEditing(project)
  }

  const cancelEdit = () => {
    setForm(emptyForm)
    setEditing(null)
  }

  const handleSave = async () => {
    try {
      const body = { ...form }
      if (editing) {
        const res = await fetch(`/api/our-works/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Update failed")
      } else {
        const res = await fetch("/api/our-works", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Create failed")
      }
      await fetchProjects()
      cancelEdit()
    } catch (err) {
      console.error(err)
      alert("Save failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return
    try {
      const res = await fetch(`/api/our-works/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      await fetchProjects()
    } catch (err) {
      console.error(err)
      alert("Delete failed")
    }
  }

  const handleUpload = async (file: File, isCover: boolean) => {
    const data = new FormData()
    data.append("file", file)
    try {
      const res = await fetch("/api/our-works/upload", { method: "POST", body: data })
      const json = await res.json()
      if (json.url) {
        if (isCover) {
          setForm((f) => ({ ...f, coverImage: json.url }))
        } else {
          setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, json.url] }))
        }
      }
    } catch (err) {
      console.error(err)
      alert("Upload failed")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf7ef]">
        <p className="text-lg text-[#62594f]">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbf7ef] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold text-[#15110d]">
              Our Works Manager
            </h1>
            <p className="mt-2 text-[#62594f]">
              {projects.length} project{projects.length !== 1 ? "s" : ""} in database
            </p>
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 rounded-full bg-[#8B1118] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#741016]"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>

        {editing !== null || form.title || form.galleryImages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-2xl border border-[#dfcfaa]/60 bg-white p-6 shadow-lg sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-[#15110d]">
                {editing ? "Edit Project" : "New Project"}
              </h2>
              <button onClick={cancelEdit} className="text-[#62594f] hover:text-[#8B1118]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-[#62594f]">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-3 text-[#15110d] outline-none focus:border-[#C9A45C]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#62594f]">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-3 text-[#15110d] outline-none focus:border-[#C9A45C]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#62594f]">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-3 text-[#15110d] outline-none focus:border-[#C9A45C]"
                >
                  <option>Architecture Works</option>
                  <option>Construction Works</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#62594f]">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-3 text-[#15110d] outline-none focus:border-[#C9A45C]"
                >
                  <option>Completed</option>
                  <option>Ongoing</option>
                  <option>Upcoming</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#62594f]">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-3 text-[#15110d] outline-none focus:border-[#C9A45C]"
                />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-3 text-sm font-semibold text-[#62594f] transition hover:border-[#C9A45C]">
                  <Plus className="h-4 w-4" />
                  Upload Cover
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(file, true)
                    }}
                  />
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-3 text-sm font-semibold text-[#62594f] transition hover:border-[#C9A45C]">
                  <Plus className="h-4 w-4" />
                  Add Gallery
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(file, false)
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-[#62594f]">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-xl border border-[#dfcfaa]/60 bg-[#fbf7ef] px-4 py-3 text-[#15110d] outline-none focus:border-[#C9A45C]"
              />
            </div>

            {form.coverImage && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-[#62594f]">Cover Image</label>
                <img
                  src={form.coverImage}
                  alt="Cover"
                  className="mt-1 h-40 w-full rounded-xl object-cover"
                />
              </div>
            )}

            {form.galleryImages.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-[#62594f]">
                  Gallery Images ({form.galleryImages.length})
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.galleryImages.map((url, i) => (
                    <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            galleryImages: f.galleryImages.filter((_, j) => j !== i),
                          }))
                        }
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#62594f]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                Featured
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#62594f]">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                Published
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={cancelEdit}
                className="rounded-full border border-[#dfcfaa]/60 px-6 py-2.5 text-sm font-semibold text-[#62594f] transition hover:border-[#C9A45C]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-full bg-[#8B1118] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#741016]"
              >
                {editing ? "Update Project" : "Create Project"}
              </button>
            </div>
          </motion.div>
        ) : null}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.div
              key={project._id}
              layout
              className="group overflow-hidden rounded-2xl border border-[#dfcfaa]/50 bg-white shadow transition hover:shadow-lg"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-[#ede5d6]">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#dfcfaa]">
                    No Image
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {project.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-[#15110d]">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-[#9d742a]">{project.location || "—"}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider ${
                      project.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="rounded-full bg-[#C9A45C]/20 px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider text-[#C9A45C]">
                      Featured
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => startEdit(project)}
                    className="flex items-center gap-1 rounded-full border border-[#dfcfaa]/60 px-3 py-1.5 text-xs font-semibold text-[#62594f] transition hover:border-[#C9A45C] hover:text-[#15110d]"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!projects.length && (
          <div className="mt-20 text-center">
            <p className="text-lg text-[#62594f]">
              No projects yet. Click &ldquo;Add Project&rdquo; to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
