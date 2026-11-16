import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

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

const MESSAGES_COL = collection(db, 'messages')

function toIso(val: unknown): string {
  if (val instanceof Timestamp) return val.toDate().toISOString()
  if (typeof val === 'string') return val
  return new Date().toISOString()
}

export async function addMessage(input: {
  name: string
  email: string
  phone?: string
  whatsapp?: string
  budget: string
  message: string
}): Promise<void> {
  const phone = input.phone?.trim()
  const whatsapp = input.whatsapp?.trim()
  await addDoc(MESSAGES_COL, {
    name: input.name.trim(),
    email: input.email.trim(),
    ...(phone ? { phone } : {}),
    ...(whatsapp ? { whatsapp } : {}),
    budget: input.budget.trim(),
    message: input.message.trim(),
    createdAt: serverTimestamp(),
    read: false,
  })
}

export function subscribeMessages(
  onChange: (msgs: Message[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const q = query(MESSAGES_COL, orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      const msgs: Message[] = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          name: String(data.name ?? ''),
          email: String(data.email ?? ''),
          phone: typeof data.phone === 'string' ? data.phone : undefined,
          whatsapp: typeof data.whatsapp === 'string' ? data.whatsapp : undefined,
          budget: String(data.budget ?? ''),
          message: String(data.message ?? ''),
          createdAt: toIso(data.createdAt),
          read: Boolean(data.read),
        }
      })
      onChange(msgs)
    },
    (err) => {
      onError?.(err)
    },
  )
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await updateDoc(doc(db, 'messages', id), { read })
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, 'messages', id))
}

export async function markAllMessagesRead(ids: string[]): Promise<void> {
  if (!ids.length) return
  const batch = writeBatch(db)
  for (const id of ids) batch.update(doc(db, 'messages', id), { read: true })
  await batch.commit()
}

export async function clearAllMessages(ids: string[]): Promise<void> {
  if (!ids.length) return
  const batch = writeBatch(db)
  for (const id of ids) batch.delete(doc(db, 'messages', id))
  await batch.commit()
}
