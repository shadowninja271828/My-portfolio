import { content } from '../data/content'
import type { Message } from '../data/messages'

const btn = 'min-h-10 rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-lime hover:text-lime'

export function Inbox({ messages, onChange }: { messages: Message[]; onChange: (next: Message[]) => void }) {
  const unread = messages.filter((m) => !m.read).length

  const addSample = () => {
    const sample: Message = {
      id: `sample-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      budget: content.budgetOptions[1] ?? '$1k - $5k',
      message: "Hi Crown! I saw your React portfolio and would love to collaborate on a redesign for our web app's dashboard. Are you available next month?",
      createdAt: new Date().toISOString(),
      read: false,
    }
    onChange([sample, ...messages])
  }

  const toggleRead = (id: string) =>
    onChange(messages.map((m) => (m.id === id ? { ...m, read: !m.read } : m)))

  const remove = (id: string) =>
    onChange(messages.filter((m) => m.id !== id))

  const markAllRead = () =>
    onChange(messages.map((m) => ({ ...m, read: true })))

  const clearAll = () => {
    if (!confirm('Delete all messages?')) return
    onChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-surface p-4">
        <p className="text-sm text-muted">
          <span className="font-semibold text-white">{messages.length}</span> total
          {unread > 0 && <> · <span className="font-semibold text-lime">{unread} unread</span></>}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={addSample}>+ Sample message</button>
          {unread > 0 && <button type="button" className={btn} onClick={markAllRead}>Mark all read</button>}
          {messages.length > 0 && <button type="button" className={btn} onClick={clearAll}>Clear all</button>}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface p-6 text-center text-sm text-muted">
          No messages yet. Submissions from the contact form are saved locally in this browser until a backend is connected.
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`space-y-3 rounded-2xl border bg-surface p-4 ${m.read ? 'border-white/10' : 'border-lime/60'}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{m.name}</span>
                    {!m.read && <span className="pixel rounded bg-lime px-1.5 py-0.5 text-[10px] text-black">NEW</span>}
                    {m.budget && <span className="mono rounded-full border border-white/15 px-2 py-0.5 text-xs text-white/80">{m.budget}</span>}
                  </div>
                  <a href={`mailto:${m.email}`} className="block break-all text-sm text-lime hover:underline">{m.email}</a>
                  <p className="mono text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btn} onClick={() => toggleRead(m.id)}>
                    {m.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button type="button" className={btn} onClick={() => remove(m.id)}>Delete</button>
                </div>
              </div>
              <p className="whitespace-pre-wrap break-words rounded-xl bg-surface-2 p-3 text-sm text-white/90">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
