import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { orpc } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import ParkingSpaceForm from "./parking-form";
import type { ParkingSpaceValues } from "./schemas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { TParkingSpaceSchema } from "@estacionamento-sys/api/schemas/parking/index";

const AddParkingSpace = () => {
  const [openState, setOpenState] = useState(false);
  const { mutateAsync, isPending } = useMutation(orpc.parkingSpace.create.mutationOptions());

  const handleMutation = async (values: TParkingSpaceSchema) => {
    console.log(values);
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success("Vaga criada com sucesso!");
        setOpenState(false);
      },
      onError: (error) => {
        toast.error(`Erro ao criar vaga: ${error.message}`);
      },
    });
  };

  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogTrigger>
        <Button>Adicionar Vaga</Button>
      </DialogTrigger>
      <DialogContent>
        <ParkingSpaceForm mode="create" onSubmit={handleMutation} />
      </DialogContent>
    </Dialog>
  );
};

export default AddParkingSpace;
