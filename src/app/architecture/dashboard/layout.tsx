"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Menu, X, Building2 } from "lucide-react"

const sidebarLinks = [
  {
    href: "/architecture/dashboard/our-works",
    label: "Our Works",
    icon: Building2,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#fbf7ef]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#dfcfaa]/60 bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#dfcfaa]/60 px-6">
          <Link href="/architecture/dashboard/our-works" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B1118] text-white text-xs font-bold">
              R
            </div>
            <div>
              <p className="text-sm font-bold text-[#15110d]">Ractysh</p>
              <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-[#62594f]">Architecture Admin</p>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="text-[#62594f] hover:text-[#15110d] lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#8B1118] text-white shadow-md"
                    : "text-[#62594f] hover:bg-[#ede5d6] hover:text-[#15110d]"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[#dfcfaa]/60 px-6 py-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-[#9d742a]">
            Ractysh Design

          </p>
          <p className="mt-0.5 text-[0.55rem] text-[#62594f]">Architecture Admin v1.0</p>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[#dfcfaa]/60 bg-white/80 px-5 backdrop-blur-md sm:px-8">
          <button onClick={() => setOpen(true)} className="text-[#62594f] hover:text-[#15110d] lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-xs text-[#62594f]">
            <LayoutDashboard className="h-4 w-4" />
            <span className="font-semibold uppercase tracking-wider">
              {pathname.includes("our-works") ? "Our Works" : "Dashboard"}
            </span>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
