import Sidebar from "@/components/layout/Sidebar";
import ProductList from "@/components/products/ProductList";

export default function HomePage() {
  return (
    <div className="flex flex-1 gap-6">
      <Sidebar />
      <ProductList />
    </div>
  );
}
