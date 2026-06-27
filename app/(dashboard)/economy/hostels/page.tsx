import { prisma } from "@/lib/prisma";
import BuyButton from "@/components/economy/BuyButton";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default async function HostelsPage() {
  const hostels = await prisma.hostel.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">STUDENT ECONOMY</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Hostels</h1>
      <p className="text-sm text-muted mt-1">Verified owned and partner hostels.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {hostels.map((hostel) => (
          <div key={hostel.id} className="rounded-xl border border-border-light bg-white p-5">
            <span className="text-xs bg-cream text-teal font-medium px-2 py-0.5 rounded-full">
              {hostel.type === "OWNED" ? "ComplexOne owned" : "Verified partner"}
            </span>
            <h2 className="font-bold text-teal mt-2">{hostel.name}</h2>
            <p className="text-sm text-muted mt-1">{hostel.area}</p>
            {Array.isArray(hostel.amenities) && hostel.amenities.length > 0 && (
              <p className="text-xs text-muted mt-1">{(hostel.amenities as string[]).join(", ")}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="font-bold text-teal">{formatNaira(hostel.pricePerYear)}/yr</p>
                <p className="text-xs text-muted">
                  Deposit {formatNaira(hostel.deposit)} · {hostel.roomsAvailable} rooms left
                </p>
              </div>
              <BuyButton itemType="HOSTEL" itemId={hostel.id} label="Pay deposit" />
            </div>
          </div>
        ))}
        {hostels.length === 0 && (
          <p className="text-sm text-muted text-center py-12 col-span-2">
            No hostels listed yet.
          </p>
        )}
      </div>
    </div>
  );
}
