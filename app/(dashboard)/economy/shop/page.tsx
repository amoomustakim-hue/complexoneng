import { prisma } from "@/lib/prisma";
import BuyButton from "@/components/economy/BuyButton";

const CATEGORY_LABELS: Record<string, string> = {
  TEXTBOOK: "Textbooks",
  LAPTOP: "Laptops & devices",
  ACADEMIC_MATERIAL: "Academic materials",
};

const CATEGORIES = ["TEXTBOOK", "LAPTOP", "ACADEMIC_MATERIAL"];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const items = await prisma.inventoryItem.findMany({
    where: category ? { category: category as never } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">STUDENT ECONOMY</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Shop</h1>

      <div className="flex gap-2 mt-4 flex-wrap">
        <a
          href="/economy/shop"
          className={`text-xs font-medium px-3 py-1.5 rounded-full ${
            !category ? "bg-teal text-cream" : "bg-white border border-border-light text-teal"
          }`}
        >
          All
        </a>
        {CATEGORIES.map((c) => (
          <a
            key={c}
            href={`/economy/shop?category=${c}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full ${
              category === c ? "bg-teal text-cream" : "bg-white border border-border-light text-teal"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border-light bg-white p-5">
            <span className="text-xs bg-cream text-teal font-medium px-2 py-0.5 rounded-full">
              {CATEGORY_LABELS[item.category]}
            </span>
            <h2 className="font-bold text-teal mt-2">{item.name}</h2>
            {item.description && <p className="text-sm text-muted mt-1">{item.description}</p>}
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="font-bold text-teal">{formatNaira(item.price)}</p>
                {item.condition && <p className="text-xs text-muted">{item.condition}</p>}
              </div>
              <BuyButton itemType="INVENTORY" itemId={item.id} />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted text-center py-12 col-span-2">
            No items in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
