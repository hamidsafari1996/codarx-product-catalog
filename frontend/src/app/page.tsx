import { redirect } from "next/navigation";
import { CATALOG_PATH } from "@/lib/catalog-params";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value !== "") {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      const first = value.find((entry) => entry !== "");
      if (first) {
        query.set(key, first);
      }
    }
  }

  const qs = query.toString();
  redirect(qs ? `${CATALOG_PATH}?${qs}` : CATALOG_PATH);
}
