'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  productId: number
  slug: string
  name: string
  image: string | null
  selection: { stone?: number; size?: number; base?: number }
  config: string
  unitPrice: number
  quantity: number
  /** % que se paga al comprar (100 en entrega inmediata). */
  deposit?: number
}

type CartCtx = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (index: number) => void
  clear: () => void
  open: boolean
  setOpen: (v: boolean) => void
  whatsapp: string
  source: string | null
  bump: number
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'caliza_cart_v1'
const SRC = 'caliza_origin'

const read = <T,>(k: string, d: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d } catch { return d }
}
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* sin almacenamiento */ } }

export function CartProvider({ children, whatsapp }: { children: React.ReactNode; whatsapp: string }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<string | null>(null)
  const [bump, setBump] = useState(0)

  useEffect(() => {
    setItems(read<CartItem[]>(KEY, []))
    let src: string | null = null
    try { src = new URLSearchParams(window.location.search).get('utm_source') } catch { src = null }
    if (src) write(SRC, src)
    setSource(src || read<string | null>(SRC, null))
  }, [])

  const persist = useCallback((next: CartItem[]) => { setItems(next); write(KEY, next) }, [])
  const add = useCallback((item: CartItem) => { persist([...read<CartItem[]>(KEY, []), item]); setBump((b) => b + 1) }, [persist])
  const remove = useCallback((i: number) => { const next = [...items]; next.splice(i, 1); persist(next) }, [items, persist])
  const clear = useCallback(() => persist([]), [persist])

  const value = useMemo(() => ({ items, add, remove, clear, open, setOpen, whatsapp, source, bump }), [items, add, remove, clear, open, whatsapp, source, bump])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart fuera de CartProvider')
  return c
}
