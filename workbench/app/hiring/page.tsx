'use client'

import { useState } from 'react'
import { mockJobListings } from '@/lib/mock-data'
import type { JobListing, Applicant } from '@/lib/types'

const stages: Array<Applicant['stage']> = ['applied', 'screening', 'interview', 'offer', 'hired']

const stageLabels: Record<Applicant['stage'], string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
}

const stageColors: Record<Applicant['stage'], { bg: string; text: string }> = {
  applied: { bg: '#f3f4f6', text: '#6b7280' },
  screening: { bg: '#eff6ff', text: '#3b82f6' },
  interview: { bg: '#fefce8', text: '#ca8a04' },
  offer: { bg: '#fdf4ff', text: '#a855f7' },
  hired: { bg: '#f0fdf4', text: '#16a34a' },
}

export default function HiringPage() {
  const [jobs] = useState<JobListing[]>(mockJobListings)
  const [selectedJobId, setSelectedJobId] = useState<string>(mockJobListings[0].id)

  const selectedJob = jobs.find((j) => j.id === selectedJobId)!
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants.length, 0)
  const activeJobs = jobs.filter((j) => j.status === 'active').length
  const hiredCount = jobs.reduce(
    (sum, j) => sum + j.applicants.filter((a) => a.stage === 'hired').length,
    0
  )

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Hiring</h1>
        <p className="text-gray-500 text-sm mt-1">Manage job listings and track applicant pipelines</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Listings', value: activeJobs },
          { label: 'Total Applicants', value: totalApplicants },
          { label: 'Hired This Cycle', value: hiredCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{stat.label}</div>
            <div className="text-2xl font-bold" style={{ color: '#062115' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Job Listings */}
        <div className="col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Open Positions</h2>
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className="w-full text-left"
            >
              <div
                className={`bg-white rounded-xl border p-4 transition-all ${
                  selectedJobId === job.id
                    ? 'shadow-md'
                    : 'border-gray-100 shadow-sm hover:shadow-md'
                }`}
                style={selectedJobId === job.id ? { borderColor: '#06C175', boxShadow: '0 0 0 2px rgba(6,193,117,0.15)' } : {}}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{job.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{job.department} · {job.location}</div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      job.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                  <span>{job.applicants.length} applicants</span>
                  <span>·</span>
                  <span className="capitalize">{job.type}</span>
                  <span>·</span>
                  <span>
                    Posted{' '}
                    {new Date(job.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {/* Mini pipeline preview */}
                <div className="mt-2 flex gap-1">
                  {stages.map((stage) => {
                    const count = job.applicants.filter((a) => a.stage === stage).length
                    return (
                      <div
                        key={stage}
                        className="flex-1 h-1 rounded-full"
                        style={{
                          backgroundColor: count > 0 ? '#06C175' : '#e5e7eb',
                          opacity: count > 0 ? 1 : 0.4,
                        }}
                        title={`${stageLabels[stage]}: ${count}`}
                      />
                    )
                  })}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pipeline Kanban */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">{selectedJob.title} — Pipeline</h2>
              <p className="text-xs text-gray-500 mt-0.5">{selectedJob.applicants.length} total applicants</p>
            </div>
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {stages.map((stage) => {
                  const applicants = selectedJob.applicants.filter((a) => a.stage === stage)
                  return (
                    <div key={stage} className="w-40 flex-shrink-0">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: stageColors[stage].bg,
                            color: stageColors[stage].text,
                          }}
                        >
                          {stageLabels[stage]}
                        </span>
                        <span className="text-xs text-gray-400">{applicants.length}</span>
                      </div>
                      <div className="space-y-2">
                        {applicants.map((applicant) => (
                          <div
                            key={applicant.id}
                            className="rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
                            style={{ backgroundColor: '#fafafa' }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                                style={{ backgroundColor: '#062115' }}
                              >
                                {applicant.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span className="text-xs font-medium text-gray-900 truncate">{applicant.name}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(applicant.appliedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        ))}
                        {applicants.length === 0 && (
                          <div
                            className="rounded-lg p-3 text-xs text-gray-300 text-center"
                            style={{ border: '1px dashed #e5e7eb' }}
                          >
                            No candidates
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
