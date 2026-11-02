import type { Metadata } from "next";
import StoreClient from "@/components/store/StoreClient";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/i18n-server";
import { localeCopy } from "@/lib/locale-copy";

// पूजा स्टोर page (M6) — deep-linkable standalone (NAVIGATION §7.7)
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: localeCopy(locale, "पूजा सामग्री स्टोर", "Puja supplies store") };
}

export default async function StorePage() {
  const [products, locale] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, orderBy: { price: "asc" } }),
    getLocale(),
  ]);

  return (
    <div className="p-4">
      <StoreClient
        locale={locale}
        products={products.map((p) => ({
          id: p.id,
          nameHi: p.nameHi,
          price: p.price,
          unit: p.unit,
          icon: p.icon,
          certified: p.certified,
        }))}
      />
    </div>
  );
}
