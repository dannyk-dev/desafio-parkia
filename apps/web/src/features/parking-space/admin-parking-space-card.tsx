import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, RefreshCw, Car, Bike, Accessibility } from "lucide-react";
import { orpc } from "@/utils/orpc";
import type { ParkingSpace } from "@estacionamento-sys/api/interfaces";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  space: ParkingSpace;
  onEdit?: (space: ParkingSpace) => void;
};

export default function AdminParkingCard({ space, onEdit }: Props) {
  const { mutateAsync: updateParkingSpace, isPending: isUpdating } = useMutation(
    orpc.parkingSpace.update.mutationOptions()
  );
  const { mutateAsync: removeParkingSpace, isPending: isRemoving } = useMutation(
    orpc.parkingSpace.remove.mutationOptions()
  );

  const toggleStatus = async () => {
    const next = space.status === "LIVRE" ? "OCUPADA" : "LIVRE";
    await updateParkingSpace({ ...space, status: next });
  };

  const changeTipo = async (tipo: ParkingSpace["tipo"]) => {
    await updateParkingSpace({ ...space, tipo });
  };

  const remove = async () => {
    await removeParkingSpace(
      { id: space.id },
      {
        onSuccess: () => {
          toast.success("Vaga removida com sucesso!");
        },
        onError: (error) => {
          toast.error(`Erro ao remover vaga: ${error.message}`);
        },
      }
    );
  };

  const isPending = useMemo(() => isUpdating || isRemoving, [isUpdating, isRemoving]);
  const statusText = space.status === "LIVRE" ? "Disponível" : "Ocupada";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="font-semibold text-lg">Vaga {space.numero}</span>
              <Badge variant="secondary" className="uppercase">
                {space.tipo}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2"></CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" aria-label="Ações" disabled={isPending}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(space)} disabled={isPending}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar dados
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={toggleStatus} disabled={isPending}>
                {space.status === "LIVRE" ? (
                  <>
                    Marcar como <Badge variant="destructive">OCUPADA</Badge>
                  </>
                ) : (
                  <>
                    Marcar como <Badge variant="success">LIVRE</Badge>
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span className="mr-2">Alterar Tipo</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => changeTipo("CARRO")} disabled={isPending || space.tipo === "CARRO"}>
                    <Car className="mr-2 h-4 w-4" /> carro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeTipo("MOTO")} disabled={isPending || space.tipo === "MOTO"}>
                    <Bike className="mr-2 h-4 w-4" /> moto
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => changeTipo("DEFICIENTE")}
                    disabled={isPending || space.tipo === "DEFICIENTE"}
                  >
                    <Accessibility className="mr-2 h-4 w-4" /> deficiente
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={remove} variant="destructive" disabled={isPending}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <Badge variant={space.status === "LIVRE" ? "success" : "destructive"}>{statusText}</Badge>
      </CardContent>
    </Card>
  );
}
