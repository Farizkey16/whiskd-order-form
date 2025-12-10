"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { OrderItemRow } from "@/components/order-item-row";
import { CheckoutBar } from "@/components/checkout-bar";
import { CustomerForm } from "@/components/customer-form";
import { useRouter } from "next/navigation";

export interface BakeryProduct {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  imageUrl?: string;
  category: string;
  stock?: number; // Root level stock fallback
  variants: {
    [sizeName: string]: { 
      id: string; 
      price: number;
      stock?: number; // Variant specific stock
    };
  };
}

export default function BakeryOrderForm({
  initialMenu,
}: {
  initialMenu: BakeryProduct[];
}) {

  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(initialMenu.map((p) => [p.id, 0]))
  );
  const [sizes, setSizes] = useState<Record<string, string>>(
    Object.fromEntries(initialMenu.map((p) => [p.id, p.sizes[0]]))
  );
  const [customer, setCustomer] = useState({
    name: "",
    whatsapp: "",
    address: "",
    deliveryMethod: "", // Added deliveryMethod state
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const additionalItems = initialMenu.filter((p) =>
    ["Additional", "Add-on", "Packaging"].includes(p.category)
  );

  const mainItems = initialMenu.filter(
    (p) => !["Additional", "Add-on", "Packaging"].includes(p.category)
  );

  // Helper to safely get stock for a specific size
  const getStock = (product: BakeryProduct, size: string) => {
    const variantStock = product.variants[size]?.stock;
    if (variantStock !== undefined) return variantStock;
    return product.stock ?? 999; // Default to 999 if no stock tracking found
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    // 1. Check Stock Limit before updating
    const product = initialMenu.find((p) => p.id === id);
    if (product) {
      const currentSize = sizes[id] || product.sizes[0];
      const maxStock = getStock(product, currentSize);

      if (quantity > maxStock) {
        // Optional: You could show a toast here
        console.warn("Exceeds stock limits");
        return; 
      }
    }
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const handleSizeChange = (id: string, size: string) => {
    setSizes((prev) => ({ ...prev, [id]: size }));
    // Reset quantity to 0 if size changes to prevent carrying over quantity to OOS size
    setQuantities((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCustomerChange = (field: string, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const totalPrice = initialMenu.reduce((sum, p) => {
    const qty = quantities[p.id] || 0;
    if (qty === 0) return sum;

    const selectedSize = sizes[p.id] || p.sizes[0];
    const variantPrice = p.variants[selectedSize]?.price ?? p.price;

    return sum + variantPrice * qty;
  }, 0);

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (!customer.name || !customer.whatsapp) {
      alert("Please fill in your name and WhatsApp number.");
      setIsSubmitting(false); // Reset loading state
      return;
    }

    const selectedItems = initialMenu
      .filter((p) => quantities[p.id] > 0)
      .map((p) => {
        const selectedSize = sizes[p.id] || p.sizes[0];
        const variant = p.variants[selectedSize];

        const finalId = variant?.id || p.id;
        const finalPrice = variant?.price || p.price;

        return {
          product_name: p.name,
          sku_id: finalId,
          size: selectedSize,
          quantity: quantities[p.id],
          unit_price: finalPrice,
          subtotal: finalPrice * quantities[p.id],
        };
      });

    const payload = {
      customer,
      items: selectedItems,
      total_items: totalItems,
      estimated_total: totalPrice,
      order_date: new Date().toISOString(),
    };

    sessionStorage.setItem("orderData", JSON.stringify(payload));

    router.push("/checkout");

    console.log("Order Payload:", JSON.stringify(payload, null, 2));
  };

  const renderProductList = (products: BakeryProduct[]) => (
    <div className="bg-card rounded-3xl p-4 shadow-md border border-border">
      <div className="grid grid-cols-3 gap-3 pb-3 border-b-2 border-accent mb-2">
        <span className="font-bold text-foreground text-sm">Item Name</span>
        <span className="font-bold text-foreground text-sm text-center">
          Size
        </span>
        <span className="font-bold text-foreground text-sm text-right">
          Quantity
        </span>
      </div>
      <div>
        {products.map((product) => {
          const currentSize = sizes[product.id] || product.sizes[0];
          const realVariant = product.variants[currentSize];
          const currentPrice = realVariant ? realVariant.price : product.price;

          // Stock Logic
          const stock = getStock(product, currentSize);
          const isOutOfStock = stock <= 0;
          const isLowStock = stock > 0 && stock <= 5;

          // Create the "Pill" visuals
          // We wrap the name in a div to inject the pill if component allows
          const displayName = (
            <div className="flex flex-col items-start gap-1">
              <span>{product.name}</span>
              {isOutOfStock && (
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 mb-2 rounded-full border border-red-200">
                  Out of Stock
                </span>
              )}
              {!isOutOfStock && isLowStock && (
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-1.5 py-0.5 mb-2 rounded-full border border-yellow-200">
                  Only {stock} left!
                </span>
              )}
            </div>
          );

          return (
            <div key={product.id} className={isOutOfStock ? "opacity-60 grayscale-[0.5]" : ""}>
               {/* Note: We are casting displayName to 'any' or string here 
                 because OrderItemRow usually expects a string for 'name'. 
                 If OrderItemRow supports ReactNode, this renders perfectly.
               */}
              <OrderItemRow
                id={product.id}
                name={displayName as any} 
                price={currentPrice}
                sizes={product.sizes}
                selectedSize={currentSize}
                quantity={quantities[product.id]}
                onSizeChange={handleSizeChange}
                onQuantityChange={(id, qty) => {
                    // Prevent adding if OOS
                    if (isOutOfStock && qty > 0) return;
                    handleQuantityChange(id, qty);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background pb-32 md:pb-12">
      {/* Header */}
      <header className="sticky top-0 bg-[#1D4667] text-accent-foreground px-4 py-4 shadow-md z-40">
        <div className="max-w-lg md:max-w-6xl mx-auto flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary shadow-sm">
            <img
              src="/icon.png"
              alt="Whisk'd Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-[family-name:var(--font-lazydog)]">
              Whisk'd
            </h1>
            <p className="text-sm font-bold opacity-90">
              Straight from your whisk'd list
            </p>
          </div>
        </div>
      </header>

      {/* Main Content - Now Responsive! */}
      {/* max-w-lg for Mobile, max-w-6xl for Desktop */}
      <div className="max-w-lg md:max-w-6xl mx-auto px-4 py-6 md:py-12">
        {/* Grid System: 1 Col (Mobile) -> 12 Cols (Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* --- LEFT COLUMN (Menu) --- */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8">
            <section>
              <h2 className="text-4xl font-[family-name:var(--font-lazydog)] text-[#1D4667] mb-1">
                Our Menu
              </h2>
              <p className="text-muted-foreground text-base font-bold leading-relaxed mb-3">
                Select from our freshly baked goods
              </p>
              <div className="rounded-3xl shadow-md border border-border">
                <img
                  src="../whiskd-menu.jpg"
                  alt="Featured Item"
                  className="w-full h-full object-contain rounded-3xl bg-muted"
                />
              </div>
            </section>

            {/* Render MAIN ITEMS */}
            <section>
              <h2 className="text-4xl font-[family-name:var(--font-lazydog)] text-[#1D4667] mb-1">
                Fresh Bakes
              </h2>
              <p className="text-muted-foreground text-base font-bold leading-relaxed mb-3">
                Daily baked goods, straight from the oven
              </p>
              {renderProductList(mainItems)}
            </section>

            {/* Render ADDITIONAL ITEMS */}
            {additionalItems.length > 0 && (
              <section>
                <h2 className="text-4xl font-[family-name:var(--font-lazydog)] text-[#1D4667] mb-1">
                  Extras & Packaging
                </h2>
                <p className="text-muted-foreground text-base font-bold leading-relaxed mb-3">
                  Don't forget candles, cards, and gift boxes to make it
                  special.
                </p>
                {renderProductList(additionalItems)}
              </section>
            )}
          </div>

          {/* --- RIGHT COLUMN (Checkout - Sticky) --- */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Customer Form */}

              <CustomerForm
                customer={customer}
                onChange={handleCustomerChange}
              />

              {/* Desktop Checkout Summary Box */}
              <div className="bg-muted/30 p-6 rounded-3xl border border-border space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total Items</span>
                  <span className="font-bold text-foreground">
                    {totalItems}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border pb-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-[#1D4667]">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={totalItems === 0 || isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground font-bold py-4 px-6 rounded-full shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />{" "}
                      <span>Sending Order...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Place Order ({totalItems})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Checkout Bar (Hidden on Desktop) */}
      <div className="md:hidden">
        <CheckoutBar totalItems={totalItems} totalPrice={totalPrice} />
      </div>
    </main>
  );
}