"use client"

import { X, CheckCircle } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  totalPrice: number
}

export function CheckoutModal({ isOpen, onClose, onConfirm, totalPrice }: CheckoutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1D4667]/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-[#F8F2EC] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#1D4667]/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1D4667]/10 flex items-center justify-center hover:bg-[#1D4667]/20 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 text-[#1D4667]" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#1D4667] flex items-center justify-center shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-[family-name:var(--font-lazydog)] text-[#1D4667] text-center mb-2">Confirm Order?</h3>
        <p className="text-[#1D4667]/70 text-center mb-6 font-medium text-sm">
            Payment proof attached. Ready to send order for:
        </p>
        <div className="bg-white rounded-xl p-4 mb-6 border border-[#1D4667]/10 text-center">
             <p className="text-sm uppercase tracking-wide text-[#1D4667]/60 font-bold mb-1">Total Payment</p>
             <p className="text-3xl font-[family-name:var(--font-lazydog)] text-[#1D4667]">Rp {totalPrice.toLocaleString("id-ID")}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-[#1D4667]/10 text-[#1D4667] font-bold hover:bg-[#1D4667]/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1D4667] text-white font-bold hover:bg-[#1D4667]/90 transition-colors shadow-md cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}