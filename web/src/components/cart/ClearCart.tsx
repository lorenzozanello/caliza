'use client'
import { useEffect } from 'react'
import { useCart } from './CartProvider'

/** Vacía el carrito cuando el cliente llega a su pedido ya creado. */
export function ClearCart() {
  const { items, clear } = useCart()
  useEffect(() => { if (items.length) clear() }, [items.length, clear])
  return null
}
