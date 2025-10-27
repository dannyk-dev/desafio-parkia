import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ParkingStatus, ParkingType } from "@estacionamento-sys/api/interfaces";

type Props = {
  numero: string;
  tipo: ParkingType;
  status: ParkingStatus;
};

export default function PublicParkingCard({ numero, tipo, status }: Props) {
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
      </CardHeader>
      <CardContent>
        <Badge variant={status === "LIVRE" ? "success" : "destructive"}>{statusText}</Badge>
      </CardContent>
    </Card>
  );
}
