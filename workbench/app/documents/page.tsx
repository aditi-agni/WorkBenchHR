'use client'

import { useState, useRef } from 'react'
import { mockDocuments, mockEmployees } from '@/lib/mock-data'
import type { Document, DocumentType, Employee } from '@/lib/types'

const documentTypeLabels: Record<DocumentType, string> = {
  offer_letter: 'Offer Letter',
  employment_contract: 'Employment Contract',
  onboarding_checklist: 'Onboarding Checklist',
  performance_review: 'Performance Review',
  termination_letter: 'Termination Letter',
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [selectedType, setSelectedType] = useState<DocumentType>('offer_letter')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(mockEmployees[0].id)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const selectedEmployee = mockEmployees.find((e) => e.id === selectedEmployeeId)!

  async function handleGenerate() {
    setGeneratedContent('')
    setIsGenerating(true)
    setSaveSuccess(false)

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: selectedType, employee: selectedEmployee }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        setGeneratedContent('Error generating document. Please check your API key and try again.')
        setIsGenerating(false)
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let content = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        content += chunk
        setGeneratedContent(content)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setGeneratedContent('Error generating document. Please try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  function handleSave() {
    if (!generatedContent) return
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: `${documentTypeLabels[selectedType]} — ${selectedEmployee.name}`,
      type: selectedType,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      status: 'complete',
      createdAt: new Date().toISOString().split('T')[0],
      content: generatedContent,
    }
    setDocuments((prev) => [newDoc, ...prev])
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  function handleCopy() {
    if (!generatedContent) return
    navigator.clipboard.writeText(generatedContent)
  }

  function handleStop() {
    abortRef.current?.abort()
    setIsGenerating(false)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
        <p className="text-gray-500 text-sm mt-1">Generate and manage HR documents with AI assistance</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Document List */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">All Documents</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {documents.map((doc) => (
                <div key={doc.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: '#f0fdf4' }}
                    >
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{doc.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(doc.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${
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
                </div>
              ))}
              {documents.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">No documents yet</div>
              )}
            </div>
          </div>
        </div>

        {/* AI Generator */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className="px-5 py-4 border-b border-gray-100"
              style={{ background: 'linear-gradient(135deg, #062115 0%, #038839 100%)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <h2 className="font-semibold text-white text-sm">AI Document Generator</h2>
              </div>
              <p className="text-white/60 text-xs mt-0.5">Powered by Claude Opus 4.6</p>
            </div>

            <div className="p-5 space-y-4">
              {/* Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Document Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as DocumentType)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent"
                  >
                    {(Object.keys(documentTypeLabels) as DocumentType[]).map((type) => (
                      <option key={type} value={type}>{documentTypeLabels[type]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Employee</label>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent"
                  >
                    {mockEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Employee Preview */}
              {selectedEmployee && (
                <div className="rounded-lg px-3 py-2 text-xs text-gray-600" style={{ backgroundColor: '#f8fffe', border: '1px solid #dcfce7' }}>
                  <span className="font-medium">{selectedEmployee.name}</span> · {selectedEmployee.role} · {selectedEmployee.department} · ${selectedEmployee.salary.toLocaleString()}/yr
                </div>
              )}

              {/* Generate Button */}
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
                  style={{ backgroundColor: '#06C175', color: '#062115' }}
                >
                  {isGenerating ? '⏳ Generating…' : '✨ Generate with AI'}
                </button>
                {isGenerating && (
                  <button
                    onClick={handleStop}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Stop
                  </button>
                )}
              </div>

              {/* Output */}
              {(generatedContent || isGenerating) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Generated Document</span>
                    {generatedContent && !isGenerating && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={handleSave}
                          className="text-xs px-2 py-1 rounded text-white transition-colors"
                          style={{ backgroundColor: '#038839' }}
                        >
                          {saveSuccess ? '✓ Saved!' : 'Save Document'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    className="rounded-lg p-4 text-sm text-gray-800 font-mono whitespace-pre-wrap overflow-auto leading-relaxed"
                    style={{
                      backgroundColor: '#fafafa',
                      border: '1px solid #e5e7eb',
                      maxHeight: '420px',
                      minHeight: '120px',
                    }}
                  >
                    {generatedContent}
                    {isGenerating && (
                      <span
                        className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
                        style={{ backgroundColor: '#06C175', verticalAlign: 'text-bottom' }}
                      />
                    )}
                  </div>
                </div>
              )}

              {!generatedContent && !isGenerating && (
                <div
                  className="rounded-lg p-6 text-center text-sm text-gray-400"
                  style={{ border: '1px dashed #e5e7eb' }}
                >
                  Select a document type and employee, then click Generate to create a document using AI.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
