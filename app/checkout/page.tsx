"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Croissant, ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";
import { CheckoutModal } from "@/components/checkout-modal";
import { PaymentUpload } from "@/components/payment-upload";

interface OrderItem {
  sku_id: string;
  product_name: string;
  size: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderData {
  customer: {
    name: string;
    whatsapp: string;
    address: string;
    deliveryMethod: string;
  };
  items: OrderItem[];
  total_items: number;      
  estimated_total: number;  
  order_date?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("orderData");
    if (storedData) {
      setOrderData(JSON.parse(storedData));
    } else {
      router.push("/");
    }
  }, [router]);

  const handlePlaceOrder = () => {
    if (!paymentProof) {
      alert("Please upload payment proof first!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmOrder = () => {
    if (!orderData) return;

    const formData = new FormData();

    const finalPayload = {
      ...orderData,
      paymentProof: paymentProof
        ? {
            name: paymentProof.name,
            size: paymentProof.size,
            type: paymentProof.type,
          }
        : null,
      submittedAt: new Date().toISOString(),
    };

    formData.append("orderData", JSON.stringify(finalPayload));
    if (paymentProof) {
      formData.append("paymentProof", paymentProof);
    }

    console.log("Final Order Payload:", JSON.stringify(finalPayload, null, 2));
    setIsModalOpen(false);
    setIsSubmitted(true);
    sessionStorage.removeItem("orderData");

    fetch("/api/submit-order", {
      method: "POST",
      body: formData,
    }).catch((err) => console.error("Upload failed", err));
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#F8F2EC] flex items-center justify-center">
        <p className="text-[#1D4667] font-bold animate-pulse">
          Loading Order...
        </p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#F8F2EC]">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-4 shadow-sm z-40">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <div className="bg-[#1D4667] rounded-full p-2">
              <Croissant className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-[family-name:var(--font-lazydog)] text-[#1D4667]">
                Whisk'd
              </h1>
              <p className="text-sm opacity-90 text-[#1D4667]">
                Straight from your whisk'd list
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1D4667]/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#1D4667]" />
          </div>
          <h2 className="text-4xl font-[family-name:var(--font-lazydog)] text-[#1D4667] mb-4">
            Order Placed!
          </h2>
          <p className="text-[#1D4667]/80 mb-8 font-medium">
            Thank you for your order. We will verify your payment and contact
            you via WhatsApp shortly.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#1D4667] hover:bg-[#1D4667]/90 cursor-pointer text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all"
          >
            Back to Menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F2EC] pb-12">
      {/* Header */}
      <header className="sticky top-0 bg-[#F8F2EC]/90 backdrop-blur-md px-4 py-4 shadow-sm z-40 border-b border-[#1D4667]/10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-full bg-[#1D4667]/10 flex items-center justify-center hover:bg-[#1D4667]/20 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#1D4667]" />
          </button>
          <div>
            <h1 className="text-2xl font-[family-name:var(--font-lazydog)] text-[#1D4667]">
              Checkout
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1D4667]/60">
              Review & Pay
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Order Summary */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#1D4667]/10">
          <h2 className="text-2xl font-[family-name:var(--font-lazydog)] text-[#1D4667] mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Order Summary
          </h2>

          <div className="space-y-3 mb-4">
            {orderData.items.map((item) => (
              <div
                key={item.sku_id}
                className="flex justify-between items-start py-3 border-b border-[#1D4667]/10 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-bold text-[#1D4667] text-sm">
                    {item.product_name}
                  </p>
                  <p className="text-xs font-medium text-[#1D4667]/60">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-[#1D4667]">
                  Rp {item.subtotal.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t-2 border-[#1D4667]/10">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1D4667]">Total Items</span>
              <span className="font-bold text-[#1D4667]">
                {orderData.total_items}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xl font-bold text-[#1D4667]">
                Total Pay
              </span>
              <span className="text-2xl font-bold text-[#1D4667]">
                Rp {(orderData.estimated_total || 0).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </section>

        {/* Customer Details */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#1D4667]/10">
          <h2 className="text-2xl font-[family-name:var(--font-lazydog)] text-[#1D4667] mb-4">
            Customer Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-[#1D4667]/60 font-medium">Name</span>
              <span className="font-bold text-[#1D4667]">
                {orderData.customer.name || "-"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#1D4667]/60 font-medium">WhatsApp</span>
              <span className="font-bold text-[#1D4667]">
                {orderData.customer.whatsapp || "-"}
              </span>
            </div>
            <div className="flex justify-between items-start py-1">
              <span className="text-[#1D4667]/60 font-medium">Address</span>
              <span className="font-bold text-[#1D4667] text-right max-w-[60%] leading-tight">
                {orderData.customer.address || "-"}
              </span>
            </div>
            <div className="flex justify-between items-start py-1">
              <span className="text-[#1D4667]/60 font-medium">Delivery Method</span>
              <span className="font-bold text-[#1D4667] text-right max-w-[60%] leading-tight">
                {orderData.customer.deliveryMethod || "-"}
              </span>
            </div>
          </div>
        </section>

        {/* Payment Info */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#1D4667]/10">
          <h2 className="text-2xl font-[family-name:var(--font-lazydog)] text-[#1D4667] mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h2>
          <div className="bg-[#1D4667]/5 rounded-2xl p-5 border border-[#1D4667]/10">
            <p className="font-bold text-[#1D4667] mb-1">Bank Transfer (BCA)</p>
            <p className="text-2xl font-mono text-[#1D4667] tracking-wider mb-1 select-all">
              1234567890
            </p>
            <p className="text-sm text-[#1D4667]/70 font-medium">
              a/n Sweet Crust Bakery
            </p>
          </div>
        </section>

        {/* Payment Proof Upload */}
        <PaymentUpload file={paymentProof} onFileChange={setPaymentProof} />

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-[#1D4667] hover:bg-[#1D4667]/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
        >
          Confirm Payment & Order
        </button>
      </div>

      {/* Checkout Confirmation Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
        totalPrice={orderData.estimated_total || 0}
      />
    </main>
  );
}
