import prisma from "@estacionamento-sys/db";

export class ParkingService {
  async list() {
    const items = await prisma.parkingSpace.findMany({ orderBy: { id: "asc" } });

    const counts = items.reduce(
      (acc, r) => {
        acc[r.status as "livre" | "ocupada"] = (acc[r.status as "livre" | "ocupada"] ?? 0) + 1;
        return acc;
      },
      { livre: 0, ocupada: 0 } as Record<"livre" | "ocupada", number>
    );

    return { items, counts };
  }
  async create(data: { numero: string; status?: "livre" | "ocupada"; tipo?: "carro" | "moto" | "deficiente" }) {
    const exists = await prisma.parkingSpace.findFirst({ where: { numero: data.numero } });
    if (exists) throw new Error("numero_already_exists");
    const created = await prisma.parkingSpace.create({
      data: { numero: data.numero, status: data.status ?? "livre", tipo: data.tipo ?? "carro" },
    });

    return created;
  }
  async update(
    id: number,
    patch: Partial<{ numero: string; status: "livre" | "ocupada"; tipo: "carro" | "moto" | "deficiente" }>
  ) {
    const exists = await prisma.parkingSpace.findUnique({ where: { id } });
    if (!exists) throw new Error("not_found");
    const updated = await prisma.parkingSpace.update({ where: { id }, data: patch });

    return updated;
  }
  async remove(id: number) {
    const exists = await prisma.parkingSpace.findUnique({ where: { id } });
    if (!exists) throw new Error("not_found");
    await prisma.parkingSpace.delete({ where: { id } });

    return { ok: true as const };
  }
}
export const parkingService = new ParkingService();
