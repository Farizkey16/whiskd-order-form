import { getProducts } from "@/lib/notion";
import BakeryOrderForm from "@/components/order-form";

export default async function Page() {
  // 1. Fetch data on the server
  const menuItems = await getProducts();

  // 2. Pass data to the Client Component
  return (
    <main className="min-h-screen bg-[#F8F2EC]">
      <BakeryOrderForm initialMenu={menuItems} />
    </main>
  );
}