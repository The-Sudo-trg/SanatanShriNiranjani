import StoreClient from "@/components/store/StoreClient";
import { prisma } from "@/lib/db";

// पूजा स्टोर page (M6) — deep-linkable standalone (NAVIGATION §7.7)
export const dynamic = "force-dynamic";

export default async function StorePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });

  return (
    <div className="p-4">
      <StoreClient
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
