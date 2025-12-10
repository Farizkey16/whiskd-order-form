"use client"

import { ChevronDown, Minus, Plus } from "lucide-react"

interface OrderItemRowProps {
  id: string
  name: string
  price: number
  sizes: string[]
  selectedSize: string
  quantity: number
  stock?: number
  onSizeChange: (id: string, size: string) => void
  onQuantityChange: (id: string, quantity: number) => void
}

export function OrderItemRow({
  id,
  name,
  price,
  sizes,
  selectedSize,
  stock,
  quantity,
  onSizeChange,
  onQuantityChange,
}: OrderItemRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3 items-center py-3 border-b border-border last:border-b-0">
      {/* Item Name */}
      <div className="flex flex-col">
        <span className="font-bold text-foreground text-sm">{name}</span>
        <span className="text-xs text-muted-foreground">Rp {price.toLocaleString("id-ID")}</span>
      </div>

      {/* Size Selector */}
      <div className="flex justify-center">
        {sizes.length > 1 ? (
          <div className="relative group">
            {/* Visual Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-transparent group-hover:border-primary/20 group-hover:bg-muted transition-all cursor-pointer">
              <span className="text-xs font-bold text-foreground">
                {selectedSize}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            {/* Hidden Native Select (For Mobile Logic) */}
            <select
              value={selectedSize}
              onChange={(e) => onSizeChange(id, e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ) : (
          // If only 1 size, just show text (no dropdown)
          <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
            {selectedSize}
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onQuantityChange(id, Math.max(0, quantity - 1))}
          className="w-8 h-8 rounded-full bg-[#1D4667] text-[#F8F2EC] flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(id, Math.max(0, Number.parseInt(e.target.value) || 0))}
          className="w-10 text-center bg-[#F8F2EC] text-[#1D4667] font-semibold text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min="0"
          aria-label="Quantity"
        />
        <button
          onClick={() => onQuantityChange(id, quantity + 1)}
          className="w-8 h-8 rounded-full bg-[#1D4667] text-[#F8F2EC] flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
