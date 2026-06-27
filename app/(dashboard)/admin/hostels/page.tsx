import { prisma } from "@/lib/prisma";
import HostelAdmin from "@/components/admin/HostelAdmin";

export default async function AdminHostelsPage() {
  const hostels = await prisma.hostel.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-xl font-bold text-teal mb-4">Hostels</h1>
      <HostelAdmin
        initialHostels={hostels.map((h) => ({
          id: h.id,
          name: h.name,
          type: h.type,
          area: h.area,
          pricePerYear: h.pricePerYear,
          deposit: h.deposit,
          roomsAvailable: h.roomsAvailable,
        }))}
      />
    </div>
  );
}
