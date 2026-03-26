import Link from 'next/link'
import { mockNotifications, mockEmployees, mockJobListings, mockDocuments } from '@/lib/mock-data'

const priorityColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#06C175',
}

const priorityBg: Record<string, string> = {
  high: '#fef2f2',
  medium: '#fffbeb',
  low: '#f0fdf4',
}

export default function DashboardPage() {
  const activeEmployees = mockEmployees.filter((e) => e.status === 'active').length
  const activeJobs = mockJobListings.filter((j) => j.status === 'active').length
  const pendingDocs = mockDocuments.filter((d) => d.status === 'pending' || d.status === 'needs_review').length

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Active Employees</div>
          <div className="text-3xl font-bold" style={{ color: '#062115' }}>{activeEmployees}</div>
          <Link href="/employees" className="text-xs mt-2 inline-block" style={{ color: '#06C175' }}>
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Active Job Listings</div>
          <div className="text-3xl font-bold" style={{ color: '#062115' }}>{activeJobs}</div>
          <Link href="/hiring" className="text-xs mt-2 inline-block" style={{ color: '#06C175' }}>
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Pending Documents</div>
          <div className="text-3xl font-bold" style={{ color: '#062115' }}>{pendingDocs}</div>
          <Link href="/documents" className="text-xs mt-2 inline-block" style={{ color: '#06C175' }}>
            View all →
          </Link>
        </div>
      </div>

      {/* Needs Attention */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Needs Attention</h2>
          <p className="text-xs text-gray-500 mt-0.5">Action items requiring your review</p>
        </div>
        <div className="divide-y divide-gray-50">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className="px-6 py-4 flex items-start gap-4">
              {/* Priority indicator */}
              <div
                className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: priorityColors[notif.priority], marginTop: '6px' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{notif.title}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                    style={{
                      backgroundColor: priorityBg[notif.priority],
                      color: priorityColors[notif.priority],
                    }}
                  >
                    {notif.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{notif.description}</p>
                {notif.dueDate && (
                  <p className="text-xs text-gray-400 mt-1">
                    Due:{' '}
                    {new Date(notif.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
              <Link
                href={notif.actionHref}
                className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: '#f0fdf4', color: '#038839' }}
              >
                {notif.actionLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Recent Documents</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest HR documents generated</p>
          </div>
          <Link href="/documents" className="text-xs font-medium" style={{ color: '#06C175' }}>
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {mockDocuments.slice(0, 4).map((doc) => (
            <div key={doc.id} className="px-6 py-3 flex items-center gap-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: '#f0fdf4' }}
              >
                📄
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{doc.title}</div>
                <div className="text-xs text-gray-400">
                  {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                  doc.status === 'complete'
                    ? 'bg-green-50 text-green-700'
                    : doc.status === 'needs_review'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {doc.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
