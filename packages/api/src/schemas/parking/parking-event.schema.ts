import z from "zod";

export const ParkingUpdate = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("created"),
    item: z.object({
      id: z.number().int().positive(),
      numero: z.string().min(1).max(8),
      status: z.enum(["livre", "ocupada"]),
      tipo: z.enum(["carro", "moto", "deficiente"]),
      criadoEm: z.coerce.date(),
    }),
  }),
  z.object({
    type: z.literal("updated"),
    item: z.object({
      id: z.number().int().positive(),
      numero: z.string().min(1).max(8),
      status: z.enum(["livre", "ocupada"]),
      tipo: z.enum(["carro", "moto", "deficiente"]),
      criadoEm: z.coerce.date(),
    }),
  }),
  z.object({ type: z.literal("removed"), id: z.number().int().positive() }),
]);

export type TParkingUpdate = z.infer<typeof ParkingUpdate>;
