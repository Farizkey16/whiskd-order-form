"use client"

import { User, Phone, MapPin, Truck } from "lucide-react"

interface CustomerFormProps {
  customer: {
    name: string
    whatsapp: string
    address: string
    deliveryMethod: string 
  }
  onChange: (field: string, value: string) => void
}

const DELIVERY_OPTIONS = [
  { value: "Pickup", label: "Self Pickup" },
  { value: "Instant Courier", label: "Instant Courier (GoSend/Grab)" },
  { value: "Same Day", label: "Same Day Delivery" },
  { value: "Expedition", label: "Expedition (JNE/SiCepat)" },
]

export function CustomerForm({ customer, onChange }: CustomerFormProps) {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-md border border-border">
      <h2 className="text-xl font-[family-name:var(--font-lazydog)] text-foreground mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-accent" />
        Your Details
      </h2>
      <div className="space-y-4">
        
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={customer.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Your full name"
              className="w-full pl-12 pr-4 py-3 bg-input rounded-full border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* WhatsApp Field */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">WhatsApp Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              value={customer.whatsapp}
              onChange={(e) => onChange("whatsapp", e.target.value)}
              placeholder="081xxxxxxxxx"
              className="w-full pl-12 pr-4 py-3 bg-input rounded-full border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Delivery Method Field */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Delivery Method</label>
          <div className="relative">
            <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={customer.deliveryMethod}
              onChange={(e) => onChange("deliveryMethod", e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-input rounded-full border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground appearance-none cursor-pointer"
            >
              <option value="" disabled>Select delivery method</option>
              {DELIVERY_OPTIONS.map((option: { value: string; label: string }) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* Custom Arrow Icon for the Select */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Delivery Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <textarea
              value={customer.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Enter your delivery address"
              rows={3}
              className="w-full pl-12 pr-4 py-3 bg-input rounded-3xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>
        </div>

      </div>
    </div>
  )
}