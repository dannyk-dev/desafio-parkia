import prisma, { type ParkingSpace, type ParkingStatus } from "@estacionamento-sys/db";
import { type TParkingSpaceSchema } from "../schemas/parking";
import { ORPCError } from "@orpc/server";

export class ParkingService {
  async list(): Promise<{
    items: ParkingSpace[];
    counts: Record<ParkingStatus, number>;
  }> {
    const items = await prisma.parkingSpace.findMany({ orderBy: { id: "asc" } });

    const counts = items.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] ?? 0) + 1;
        return acc;
      },
      { LIVRE: 0, OCUPADA: 0 } as Record<ParkingStatus, number>
    );

    return { items, counts };
  }
  async create(data: TParkingSpaceSchema): Promise<ParkingSpace> {
    const exists = await prisma.parkingSpace.findFirst({ where: { numero: data.numero } });
    console.log(exists);
    if (exists !== null) throw new ORPCError("CONFLICT", { message: "Parking space already exists." });

    const created = await prisma.parkingSpace.create({
      data: { numero: data.numero, status: data.status ?? "LIVRE", tipo: data.tipo ?? "CARRO" },
    });

    return created;
  }
  async update(id: number, patch: Partial<TParkingSpaceSchema>): Promise<ParkingSpace> {
    const exists = await prisma.parkingSpace.findUnique({ where: { id } });
    if (!exists) throw new ORPCError("NOT_FOUND", { message: "Parking space not found." });
    const updated = await prisma.parkingSpace.update({ where: { id }, data: patch });

    return updated;
  }
  async remove(id: number) {
    const exists = await prisma.parkingSpace.findUnique({ where: { id } });
    if (!exists) throw new ORPCError("NOT_FOUND", { message: "Parking space not found." });
    await prisma.parkingSpace.delete({ where: { id } });

    return { ok: true as const };
  }
}
export const parkingService = new ParkingService();
