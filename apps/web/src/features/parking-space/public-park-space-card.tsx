import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ParkingStatus, ParkingType } from "@estacionamento-sys/api/interfaces";

type Props = {
  numero: string;
  tipo: ParkingType;
  status: ParkingStatus;
};

export default function PublicParkingCard({ numero, tipo, status }: Props) {
  const statusColor = status === "LIVRE" ? "bg-green-500" : "bg-red-500";
  const statusText = status === "LIVRE" ? "Disponível" : "Ocupada";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-semibold text-lg">Vaga {numero}</span>
          <Badge variant="secondary" className="uppercase">
            {tipo}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusColor}`} />
          <span className={status === "LIVRE" ? "text-green-700" : "text-red-700"}>{statusText}</span>
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
