"use client"

import { ShoppingBag } from "lucide-react"

interface CheckoutBarProps {
  totalItems: number
  totalPrice: number
}

export function CheckoutBar({ totalItems, totalPrice }: CheckoutBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1D4667] text-accent-foreground px-4 py-4 shadow-lg border-t border-border z-50">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-2">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm opacity-90">Total Items</p>
            <p className="font-bold text-lg">{totalItems}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Estimated Total</p>
          <p className="font-bold text-2xl">Rp {totalPrice.toLocaleString("id-ID")}</p>
        </div>
      </div>
    </div>
  )
}
