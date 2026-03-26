'use client'

import { useState } from 'react'
import { mockEmployees } from '@/lib/mock-data'
import type { Employee } from '@/lib/types'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const avatarColors = [
  '#06C175', '#038839', '#B9D04C', '#0891b2', '#7c3aed', '#db2777',
]

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    salary: '',
  })

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: form.name,
      role: form.role,
      department: form.department,
      email: form.email,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      salary: parseInt(form.salary) || 0,
    }
    setEmployees((prev) => [newEmployee, ...prev])
    setForm({ name: '', role: '', department: '', email: '', salary: '' })
    setShowModal(false)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm mt-1">{employees.filter((e) => e.status === 'active').length} active team members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#06C175', color: '#062115' }}
        >
          + Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Employees', value: employees.length },
          { label: 'Departments', value: new Set(employees.map((e) => e.department)).size },
          { label: 'Avg. Salary', value: `$${Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length).toLocaleString()}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{stat.label}</div>
            <div className="text-2xl font-bold" style={{ color: '#062115' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees by name, role, or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
          style={{ '--tw-ring-color': '#06C175' } as React.CSSProperties}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Employee</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Role</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Department</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Salary</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((emp, idx) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                      style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}
                    >
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                      <div className="text-xs text-gray-400">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">{emp.role}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{emp.department}</td>
                <td className="px-6 py-3 text-sm text-gray-500">
                  {new Date(emp.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">${emp.salary.toLocaleString()}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    emp.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                  No employees found matching &ldquo;{search}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Add New Employee</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              {[
                { field: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Smith' },
                { field: 'role', label: 'Job Title', type: 'text', placeholder: 'Software Engineer' },
                { field: 'department', label: 'Department', type: 'text', placeholder: 'Engineering' },
                { field: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@company.com' },
                { field: 'salary', label: 'Annual Salary ($)', type: 'number', placeholder: '75000' },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': '#06C175' } as React.CSSProperties}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#06C175', color: '#062115' }}
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
