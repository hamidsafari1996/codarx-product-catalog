import type { CatalogSearchParams } from "@/lib/catalog-params";
import type { ProductCategory } from "@/types/product";
import SidebarFilters from "@/components/layout/SidebarFilters";

type SidebarProps = {
  filters: CatalogSearchParams;
  categories?: ProductCategory[];
};

export default function Sidebar({
  filters,
  categories = [],
}: SidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-72">
      <SidebarFilters filters={filters} categories={categories} />
    </aside>
  );
}
