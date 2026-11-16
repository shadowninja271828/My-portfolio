export interface Message {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  budget: string
  message: string
  createdAt: string
  read: boolean
}

const KEY = 'crown-messages'

export function loadMessages(): Message[] {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveMessages(messages: Message[]) {
  localStorage.setItem(KEY, JSON.stringify(messages))
}

export function addMessage(input: { name: string; email: string; phone?: string; whatsapp?: string; budget: string; message: string }): Message {
  const msg: Message = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,
    whatsapp: input.whatsapp?.trim() || undefined,
    budget: input.budget.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  }
  const next = [msg, ...loadMessages()]
  saveMessages(next)
  return msg
}
