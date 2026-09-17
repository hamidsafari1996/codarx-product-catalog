import type { CatalogSearchParams } from "@/lib/catalog-params";
import SidebarFilters from "@/components/layout/SidebarFilters";

type SidebarProps = {
  filters: CatalogSearchParams;
};

export default function Sidebar({ filters }: SidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-72">
      <SidebarFilters filters={filters} />
    </aside>
  );
}
