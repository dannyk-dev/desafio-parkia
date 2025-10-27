import z from "zod";

export const ParkingSpaceSchema = z.object({
  numero: z.string().min(1, "Informe o número da vaga"),
  status: z.enum(["livre", "ocupada"], {
    error: "Informe o status da vaga",
  }),
  tipo: z.enum(["carro", "moto", "deficiente"], {
    error: "Informe o tipo da vaga",
  }),
});

export type ParkingSpaceValues = z.infer<typeof ParkingSpaceSchema>;
