import { prisma } from "@/lib/prisma";
import InventoryAdmin from "@/components/admin/InventoryAdmin";

export default async function AdminInventoryPage() {
  const items = await prisma.inventoryItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-xl font-bold text-teal mb-4">Inventory</h1>
      <InventoryAdmin
        initialItems={items.map((i) => ({
          id: i.id,
          name: i.name,
          category: i.category,
          price: i.price,
          stock: i.stock,
          condition: i.condition,
        }))}
      />
    </div>
  );
}
