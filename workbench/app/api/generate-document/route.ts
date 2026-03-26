import Anthropic from '@anthropic-ai/sdk'
import type { DocumentType, Employee } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function buildPrompt(documentType: DocumentType, employee: Employee): string {
  const docLabels: Record<DocumentType, string> = {
    offer_letter: 'Offer Letter',
    employment_contract: 'Employment Contract',
    onboarding_checklist: 'Onboarding Checklist',
    performance_review: 'Performance Review',
    termination_letter: 'Termination Letter',
  }

  const label = docLabels[documentType]
  const startDateFormatted = new Date(employee.startDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const details = [
    `Employee Name: ${employee.name}`,
    `Job Title: ${employee.role}`,
    `Department: ${employee.department}`,
    `Email: ${employee.email}`,
    `Start Date: ${startDateFormatted}`,
    `Annual Salary: $${employee.salary.toLocaleString()}`,
    `Status: ${employee.status}`,
  ].join('\n')

  const instructions: Record<DocumentType, string> = {
    offer_letter: `Generate a professional and warm offer letter for the above employee. Include: position details, start date, compensation, benefits overview (PTO, health insurance), reporting structure placeholder, offer expiration date (7 days from today), and signature blocks for both employer and employee. Format it as a proper business letter.`,

    employment_contract: `Generate a comprehensive employment contract. Include sections for: position and duties, compensation and benefits, work schedule, confidentiality and IP assignment, at-will employment clause, dispute resolution, and signature blocks. Make it legally sound but readable for a small business context.`,

    onboarding_checklist: `Generate a detailed onboarding checklist organized by timeline (Before Day 1, Day 1, First Week, First 30 Days, First 90 Days). Include tasks for both HR/Manager and the new employee. Cover: account setup, equipment, introductions, training, goal-setting, and check-ins.`,

    performance_review: `Generate a structured performance review form/document. Include sections for: overall performance rating (1-5 scale with descriptions), key achievements, areas for improvement, goal progress from last period, new goals for next period, manager comments, employee self-assessment section, and development plan. Make it constructive and forward-looking.`,

    termination_letter: `Generate a professional and respectful termination letter. Include: effective date, reason (use "position elimination due to business restructuring" as a placeholder), final paycheck information, benefits continuation (COBRA), return of company property checklist, and contact for questions. Keep the tone dignified and professional.`,
  }

  return `Please generate a ${label} for the following employee:\n\n${details}\n\n${instructions[documentType]}\n\nToday's date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\nCompany Name: WorkbenchHR Client Company`
}

export async function POST(req: Request) {
  try {
    const { documentType, employee } = (await req.json()) as {
      documentType: DocumentType
      employee: Employee
    }

    if (!documentType || !employee) {
      return new Response('Missing documentType or employee', { status: 400 })
    }

    const prompt = buildPrompt(documentType, employee)

    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 4000,
      system:
        'You are an expert HR professional and employment attorney specializing in small business HR documentation. Generate clear, professional, legally-sound HR documents. Format documents with proper headers, sections, and spacing. Use plain language while maintaining professionalism.',
      messages: [{ role: 'user', content: prompt }],
    })

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text))
          }
        }
        controller.close()
      },
      cancel() {
        stream.abort()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Document generation error:', error)
    return new Response('Failed to generate document', { status: 500 })
  }
}
