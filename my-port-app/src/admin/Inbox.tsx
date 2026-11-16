import { useState } from 'react'
import { content } from '../data/content'
import {
  addMessage,
  clearAllMessages,
  deleteMessage,
  markAllMessagesRead,
  setMessageRead,
  type Message,
} from '../data/messages'

const btn = 'min-h-10 rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-lime hover:text-lime disabled:opacity-50'

export function Inbox({ messages }: { messages: Message[] }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const unread = messages.filter((m) => !m.read).length

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    setErr('')
    try { await fn() }
    catch (e) { setErr((e as Error).message) }
    finally { setBusy(false) }
  }

  const addSample = () => run(() => addMessage({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 555 234 5678',
    whatsapp: '+1 555 234 5678',
    budget: content.budgetOptions[1] ?? '$1k - $5k',
    message: "Hi Crown! I saw your React portfolio and would love to collaborate on a redesign for our web app's dashboard. Are you available next month?",
  }))

  const clearAll = () => {
    if (!confirm('Delete all messages from Firestore?')) return
    void run(() => clearAllMessages(messages.map((m) => m.id)))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-surface p-4">
        <p className="text-sm text-muted">
          <span className="font-semibold text-white">{messages.length}</span> total
          {unread > 0 && <> · <span className="font-semibold text-lime">{unread} unread</span></>}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} className={btn} onClick={addSample}>+ Sample message</button>
          {unread > 0 && (
            <button type="button" disabled={busy} className={btn} onClick={() => run(() => markAllMessagesRead(messages.filter((m) => !m.read).map((m) => m.id)))}>
              Mark all read
            </button>
          )}
          {messages.length > 0 && <button type="button" disabled={busy} className={btn} onClick={clearAll}>Clear all</button>}
        </div>
      </div>

      {err && <p role="alert" className="rounded-xl border border-orange/40 bg-surface p-3 text-sm text-orange">{err}</p>}

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface p-6 text-center text-sm text-muted">
          No messages yet. Submissions from the contact form sync here in real time via Cloud Firestore.
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
                  {(m.phone || m.whatsapp) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {m.phone && (
                        <a href={`tel:${m.phone.replace(/[^\d+]/g, '')}`} className="text-white/90 hover:text-lime hover:underline">
                          Phone: {m.phone}
                        </a>
                      )}
                      {m.whatsapp && (
                        <a href={`https://wa.me/${m.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer noopener" className="text-lime hover:underline">
                          WhatsApp: {m.whatsapp}
                        </a>
                      )}
                    </div>
                  )}
                  <p className="mono text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy} className={btn} onClick={() => run(() => setMessageRead(m.id, !m.read))}>
                    {m.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button type="button" disabled={busy} className={btn} onClick={() => run(() => deleteMessage(m.id))}>Delete</button>
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
