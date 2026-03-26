'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/employees', label: 'Employees', icon: '👥' },
  { href: '/documents', label: 'Documents', icon: '📄' },
  { href: '/hiring', label: 'Hiring', icon: '🔍' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col w-64 min-h-screen flex-shrink-0"
      style={{ backgroundColor: '#062115' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: '#06C175', color: '#062115' }}
          >
            W
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">WorkbenchHR</div>
            <div className="text-white/50 text-xs">Small Business Suite</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4 space-y-2">
        <Link
          href="/documents"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#06C175', color: '#062115' }}
        >
          <span className="text-base">+</span>
          <span>Create Document</span>
        </Link>
        <Link
          href="/employees"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
        >
          <span className="text-base">+</span>
          <span>Add Employee</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { backgroundColor: 'rgba(6, 193, 117, 0.15)', color: '#06C175' } : {}}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#06C175' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* AI Assistant (placeholder) */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-white/50 text-xs mb-2 font-medium uppercase tracking-wide">
          AI Assistant
        </div>
        <textarea
          placeholder="Ask WorkbenchHR anything… (coming soon)"
          disabled
          className="w-full rounded-lg px-3 py-2 text-xs text-white/40 resize-none h-16 cursor-not-allowed"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ backgroundColor: '#038839', color: 'white' }}
          >
            SB
          </div>
          <div>
            <div className="text-white text-xs font-medium">Small Business</div>
            <div className="text-white/40 text-xs">Free Plan</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
