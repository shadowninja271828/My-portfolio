import { useState, type ReactNode } from 'react'
import { asset, content, defaultContent, resetContent, saveContent, type Content } from '../data/content'

// FRONTEND-ONLY admin. The passcode gate is a convenience, NOT security:
// everything lives in this browser's localStorage and anyone can read the bundle.
const PASS_KEY = 'crown-admin-pass'
const SESSION_KEY = 'crown-admin-session'

const inputCls = 'w-full rounded-lg bg-surface-2 px-3 py-2 text-sm text-white placeholder:text-muted'
const btn = 'rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-lime hover:text-lime'

function Field({ label, value, onChange, area }: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <label className="block text-xs text-muted">
      <span className="mb-1 block">{label}</span>
      {area
        ? <textarea rows={3} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
        : <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />}
    </label>
  )
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-xs text-muted">
      <span className="mb-1 block">{label}</span>
      <input type="number" className={inputCls} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  )
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const pick = (f?: File) => {
    if (!f) return
    const r = new FileReader()
    r.onload = () => onChange(String(r.result))
    r.readAsDataURL(f)
  }
  return (
    <div className="text-xs text-muted">
      <Field label={`${label} (URL or upload)`} value={value.startsWith('data:') ? '(uploaded image)' : value} onChange={onChange} />
      <input type="file" accept="image/*" className="mt-2 block text-xs" aria-label={`Upload ${label}`} onChange={(e) => pick(e.target.files?.[0])} />
      {value && <img src={asset(value)} alt="" className="mt-2 h-20 rounded object-cover" />}
    </div>
  )
}

function List<T>({ title, items, onChange, make, render }: {
  title: string; items: T[]; onChange: (v: T[]) => void; make: () => T
  render: (item: T, set: (patch: Partial<T>) => void, i: number) => ReactNode
}) {
  const set = (i: number, patch: Partial<T>) => onChange(items.map((it, n) => (n === i ? { ...it, ...patch } : it)))
  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const c = [...items]; [c[i], c[j]] = [c[j], c[i]]; onChange(c)
  }
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-white/10 bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="pixel text-xs text-orange">{title} {String(i + 1).padStart(2, '0')}</span>
            <div className="flex gap-2">
              <button className={btn} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
              <button className={btn} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
              <button className={btn} onClick={() => onChange(items.filter((_, n) => n !== i))}>Delete</button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">{render(it, (p) => set(i, p), i)}</div>
        </div>
      ))}
      <button className={btn} onClick={() => onChange([...items, make()])}>+ Add {title.toLowerCase()}</button>
    </div>
  )
}

const csv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)
const lines = (s: string) => s.split('\n').filter((x) => x.trim())

const TABS = ['Profile', 'Stats', 'Services', 'Projects', 'Skills', 'Experience', 'Education', 'Testimonials', 'FAQ', 'Socials', 'Form', 'Raw JSON'] as const
type Tab = (typeof TABS)[number]

function Panel() {
  const [draft, setDraft] = useState<Content>(() => JSON.parse(JSON.stringify(content)))
  const [tab, setTab] = useState<Tab>('Profile')
  const [saved, setSaved] = useState(false)
  const [json, setJson] = useState('')
  const [jsonErr, setJsonErr] = useState('')
  const up = <K extends keyof Content>(k: K, v: Content[K]) => { setDraft({ ...draft, [k]: v }); setSaved(false) }

  const save = () => { saveContent(draft); setSaved(true) }
  const reset = () => {
    if (!confirm('Discard all admin edits and restore defaults?')) return
    resetContent(); setDraft(JSON.parse(JSON.stringify(defaultContent))); setSaved(true)
  }
  const exportJson = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' }))
    a.download = 'content.json'; a.click()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="pixel text-lg text-lime">ADMIN_</h1>
        <div className="flex flex-wrap items-center gap-2">
          {saved && <span role="status" className="text-sm text-lime">Saved ✓</span>}
          <a href={import.meta.env.BASE_URL} className={btn}>View site</a>
          <button className={btn} onClick={exportJson}>Export</button>
          <button className={btn} onClick={reset}>Reset</button>
          <button className={btn} onClick={() => { sessionStorage.removeItem(SESSION_KEY); location.reload() }}>Log out</button>
          <button className="pixel-btn rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-black" onClick={save}>Save</button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <nav aria-label="Admin sections">
          <ul className="flex gap-2 overflow-x-auto md:flex-col">
            {TABS.map((t) => (
              <li key={t}>
                <button onClick={() => { setTab(t); if (t === 'Raw JSON') { setJson(JSON.stringify(draft, null, 2)); setJsonErr('') } }}
                  aria-current={tab === t}
                  className={`w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm ${tab === t ? 'bg-lime text-black' : 'bg-surface hover:text-lime'}`}>{t}</button>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label={tab} className="min-w-0 space-y-4">
          {tab === 'Profile' && (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name" value={draft.name} onChange={(v) => up('name', v)} />
              <Field label="Typed name" value={draft.typedName} onChange={(v) => up('typedName', v)} />
              <Field label="Eyebrow" value={draft.eyebrow} onChange={(v) => up('eyebrow', v)} />
              <Field label="Role (white word)" value={draft.role[0]} onChange={(v) => up('role', [v, draft.role[1]])} />
              <Field label="Role (ghost word)" value={draft.role[1]} onChange={(v) => up('role', [draft.role[0], v])} />
              <div className="md:col-span-2"><Field label="Short bio (profile card)" value={draft.shortBio} onChange={(v) => up('shortBio', v)} /></div>
              <div className="md:col-span-2"><Field area label="Hero paragraph" value={draft.heroParagraph} onChange={(v) => up('heroParagraph', v)} /></div>
              <div className="md:col-span-2"><ImageField label="Photo" value={draft.photo} onChange={(v) => up('photo', v)} /></div>
              <label className="text-xs text-muted">Hero visual
                <select className={`${inputCls} mt-1`} value={draft.heroVisual} onChange={(e) => up('heroVisual', e.target.value as Content['heroVisual'])}>
                  <option value="pixelScene">pixelScene</option><option value="none">none</option>
                </select>
              </label>
              <label className="text-xs text-muted">Projects layout
                <select className={`${inputCls} mt-1`} value={draft.projectsLayout} onChange={(e) => up('projectsLayout', e.target.value as Content['projectsLayout'])}>
                  <option value="grid">grid</option><option value="carousel">carousel</option>
                </select>
              </label>
            </div>
          )}

          {tab === 'Stats' && (
            <List title="Stat" items={draft.stats} onChange={(v) => up('stats', v)} make={() => ({ value: 0, suffix: '+', label: 'Label', icon: 'star' as const })}
              render={(s, set) => (<>
                <NumField label="Value" value={s.value} onChange={(v) => set({ value: v })} />
                <Field label="Suffix" value={s.suffix} onChange={(v) => set({ suffix: v })} />
                <Field label="Label" value={s.label} onChange={(v) => set({ label: v })} />
                <label className="text-xs text-muted">Icon
                  <select className={`${inputCls} mt-1`} value={s.icon} onChange={(e) => set({ icon: e.target.value as typeof s.icon })}>
                    {['star', 'users', 'repo', 'code', 'zap', 'layers', 'palette'].map((i) => <option key={i}>{i}</option>)}
                  </select>
                </label>
              </>)} />
          )}

          {tab === 'Services' && (
            <List title="Service" items={draft.services} onChange={(v) => up('services', v)} make={() => ({ title: 'Title', text: 'Text', icon: 'code' as const })}
              render={(s, set) => (<>
                <Field label="Title" value={s.title} onChange={(v) => set({ title: v })} />
                <label className="text-xs text-muted">Icon
                  <select className={`${inputCls} mt-1`} value={s.icon} onChange={(e) => set({ icon: e.target.value as typeof s.icon })}>
                    {['star', 'users', 'repo', 'code', 'zap', 'layers', 'palette'].map((i) => <option key={i}>{i}</option>)}
                  </select>
                </label>
                <div className="md:col-span-2"><Field area label="Text" value={s.text} onChange={(v) => set({ text: v })} /></div>
              </>)} />
          )}

          {tab === 'Projects' && (
            <List title="Project" items={draft.projects} onChange={(v) => up('projects', v)}
              make={() => ({ title: 'New project', description: '', tech: [], tags: [], image: '', liveUrl: '', repoUrl: '' })}
              render={(p, set) => (<>
                <Field label="Title" value={p.title} onChange={(v) => set({ title: v })} />
                <Field label="Description" value={p.description} onChange={(v) => set({ description: v })} />
                <Field label="Tags (comma separated)" value={p.tags.join(', ')} onChange={(v) => set({ tags: csv(v) })} />
                <Field label="Tech (comma separated)" value={p.tech.join(', ')} onChange={(v) => set({ tech: csv(v) })} />
                <Field label="Live URL" value={p.liveUrl} onChange={(v) => set({ liveUrl: v })} />
                <Field label="Repo URL" value={p.repoUrl} onChange={(v) => set({ repoUrl: v })} />
                <div className="md:col-span-2"><ImageField label="Screenshot" value={p.image} onChange={(v) => set({ image: v })} /></div>
              </>)} />
          )}

          {tab === 'Skills' && (
            <List title="Group" items={draft.skills} onChange={(v) => up('skills', v)} make={() => ({ title: 'Group', items: [] })}
              render={(g, set) => (<>
                <Field label="Group title" value={g.title} onChange={(v) => set({ title: v })} />
                <Field label="Items (comma separated)" value={g.items.join(', ')} onChange={(v) => set({ items: csv(v) })} />
              </>)} />
          )}

          {tab === 'Experience' && (
            <List title="Job" items={draft.experience} onChange={(v) => up('experience', v)} make={() => ({ role: 'Role', org: 'Company', start: '2024', end: 'Present', bullets: [] })}
              render={(j, set) => (<>
                <Field label="Role" value={j.role} onChange={(v) => set({ role: v })} />
                <Field label="Organisation" value={j.org} onChange={(v) => set({ org: v })} />
                <Field label="Start" value={j.start} onChange={(v) => set({ start: v })} />
                <Field label="End" value={j.end} onChange={(v) => set({ end: v })} />
                <div className="md:col-span-2"><Field area label="Bullets (one per line)" value={j.bullets.join('\n')} onChange={(v) => set({ bullets: lines(v) })} /></div>
              </>)} />
          )}

          {tab === 'Education' && (
            <List title="Entry" items={draft.education} onChange={(v) => up('education', v)} make={() => ({ title: 'Course', org: 'School', start: '2020', end: '2024' })}
              render={(e, set) => (<>
                <Field label="Title" value={e.title} onChange={(v) => set({ title: v })} />
                <Field label="Organisation" value={e.org} onChange={(v) => set({ org: v })} />
                <Field label="Start" value={e.start} onChange={(v) => set({ start: v })} />
                <Field label="End" value={e.end} onChange={(v) => set({ end: v })} />
              </>)} />
          )}

          {tab === 'Testimonials' && (
            <List title="Testimonial" items={draft.testimonials} onChange={(v) => up('testimonials', v)} make={() => ({ quote: '', name: '', role: '', rating: 5 })}
              render={(t, set) => (<>
                <Field label="Name" value={t.name} onChange={(v) => set({ name: v })} />
                <Field label="Role" value={t.role} onChange={(v) => set({ role: v })} />
                <NumField label="Rating (1-5)" value={t.rating} onChange={(v) => set({ rating: Math.max(0, Math.min(5, v)) })} />
                <div className="md:col-span-2"><Field area label="Quote" value={t.quote} onChange={(v) => set({ quote: v })} /></div>
              </>)} />
          )}

          {tab === 'FAQ' && (
            <List title="Q&A" items={draft.faq} onChange={(v) => up('faq', v)} make={() => ({ q: '', a: '' })}
              render={(f, set) => (<>
                <div className="md:col-span-2"><Field label="Question" value={f.q} onChange={(v) => set({ q: v })} /></div>
                <div className="md:col-span-2"><Field area label="Answer" value={f.a} onChange={(v) => set({ a: v })} /></div>
              </>)} />
          )}

          {tab === 'Socials' && (
            <div className="grid gap-3 md:grid-cols-2">
              {(Object.keys(draft.socials) as (keyof Content['socials'])[]).map((k) => (
                <Field key={k} label={k} value={draft.socials[k]} onChange={(v) => up('socials', { ...draft.socials, [k]: v })} />
              ))}
              <p className="text-xs text-muted md:col-span-2">Leave empty to hide an icon.</p>
            </div>
          )}

          {tab === 'Form' && (
            <div className="space-y-3">
              <Field label="Contact headline (white)" value={draft.contactHeadline[0]} onChange={(v) => up('contactHeadline', [v, draft.contactHeadline[1]])} />
              <Field label="Contact headline (ghost)" value={draft.contactHeadline[1]} onChange={(v) => up('contactHeadline', [draft.contactHeadline[0], v])} />
              <Field area label="Budget options (one per line)" value={draft.budgetOptions.join('\n')} onChange={(v) => up('budgetOptions', lines(v))} />
            </div>
          )}

          {tab === 'Raw JSON' && (
            <div className="space-y-3">
              <textarea className={`${inputCls} mono h-[28rem]`} spellCheck={false} aria-label="Raw JSON" value={json} onChange={(e) => setJson(e.target.value)} />
              {jsonErr && <p role="alert" className="text-sm text-orange">{jsonErr}</p>}
              <button className={btn} onClick={() => {
                try { setDraft(JSON.parse(json)); setSaved(false); setJsonErr('Applied to draft. Press Save to publish.') }
                catch (e) { setJsonErr(`Invalid JSON: ${(e as Error).message}`) }
              }}>Apply JSON to draft</button>
            </div>
          )}
        </section>
      </div>
      <p className="mono mt-10 text-xs text-muted">Changes are saved to this browser only (localStorage). Use Export and copy values into src/data/content.ts to make them permanent.</p>
    </div>
  )
}

async function hash(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const hasPass = !!localStorage.getItem(PASS_KEY)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasPass) {
      if (pass.length < 4) return setErr('Use at least 4 characters.')
      localStorage.setItem(PASS_KEY, await hash(pass))
    } else if ((await hash(pass)) !== localStorage.getItem(PASS_KEY)) {
      return setErr('Wrong passcode.')
    }
    sessionStorage.setItem(SESSION_KEY, '1'); setAuthed(true)
  }

  if (authed) return <Panel />
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-[24px] border border-white/10 bg-surface p-6">
        <h1 className="pixel text-lg text-lime">ADMIN_</h1>
        <p className="text-sm text-muted">{hasPass ? 'Enter your passcode.' : 'First visit: choose a passcode for this browser.'}</p>
        <label className="block text-xs text-muted">
          <span className="mb-1 block">Passcode</span>
          <input type="password" autoFocus className={inputCls} value={pass} onChange={(e) => { setPass(e.target.value); setErr('') }} />
        </label>
        {err && <p role="alert" className="text-sm text-orange">{err}</p>}
        <button className="pixel-btn w-full rounded-lg bg-lime py-2 text-sm font-semibold text-black">{hasPass ? 'Unlock' : 'Set passcode'}</button>
        <p className="text-xs text-muted">Frontend-only gate; not real security. <a className="text-lime underline" href={import.meta.env.BASE_URL}>Back to site</a></p>
      </form>
    </main>
  )
}
