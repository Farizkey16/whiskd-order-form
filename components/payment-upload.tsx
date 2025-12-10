"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"

interface PaymentUploadProps {
  onFileChange: (file: File | null) => void
  file: File | null
}

export function PaymentUpload({ onFileChange, file }: PaymentUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileChange(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleRemove = () => {
    onFileChange(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      onFileChange(droppedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1D4667]/10">
      <h3 className="text-2xl font-[family-name:var(--font-lazydog)] text-[#1D4667] mb-2 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Payment Proof
      </h3>

      <p className="text-sm font-medium text-[#1D4667]/60 mb-4">
        Please upload your transfer receipt as proof.
      </p>

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[#1D4667]/20 rounded-2xl p-8 text-center cursor-pointer hover:border-[#1D4667] hover:bg-[#1D4667]/5 transition-all group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1D4667]/10 flex items-center justify-center group-hover:bg-[#1D4667]/20 transition-colors">
              <ImageIcon className="w-6 h-6 text-[#1D4667]" />
            </div>
            <div>
              <p className="font-bold text-[#1D4667]">Click to upload</p>
              <p className="text-sm text-[#1D4667]/60">or drag and drop</p>
            </div>
            <p className="text-xs text-[#1D4667]/40 font-medium">PNG, JPG up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Payment proof preview"
            className="w-full h-48 object-cover rounded-2xl border border-[#1D4667]/10"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="mt-2 text-sm text-[#1D4667]/60 font-medium truncate">{file?.name}</p>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}