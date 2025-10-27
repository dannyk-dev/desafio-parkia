import * as React from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParkingSpaceSchema, type ParkingSpaceValues } from "./schemas";

export type ParkingSpaceFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<ParkingSpaceValues>;
  onSubmit: (values: ParkingSpaceValues) => Promise<void> | void;
  disabled?: boolean;
  submitLabel?: string;
  numeroHint?: string;
  className?: string;
};

export default function ParkingSpaceForm({
  mode,
  initialValues,
  onSubmit,
  disabled,
  submitLabel,
  numeroHint,
  className,
}: ParkingSpaceFormProps) {
  const form = useForm<ParkingSpaceValues>({
    resolver: zodResolver(ParkingSpaceSchema),
    defaultValues: {
      numero: initialValues?.numero ?? "",
      status: initialValues?.status ?? "livre",
      tipo: initialValues?.tipo ?? "carro",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const isSubmitting = form.formState.isSubmitting || !!disabled;

  // A11y-friendly ids
  const idNumero = React.useId();
  const idStatus = React.useId();
  const idTipo = React.useId();

  return (
    <form
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      noValidate
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>{mode === "edit" ? "Editar vaga" : "Nova vaga"}</FieldLegend>

          <FieldGroup>
            <Controller
              control={form.control}
              name="numero"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={idNumero}>Número</FieldLabel>
                  <Input
                    id={idNumero}
                    placeholder="Ex.: A1, B2..."
                    autoComplete="off"
                    disabled={isSubmitting}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                  {numeroHint ? <FieldDescription>{numeroHint}</FieldDescription> : null}
                  {form.formState.errors.numero ? (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.numero.message as string}</p>
                  ) : null}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={idStatus}>Status</FieldLabel>
                  <Select disabled={isSubmitting} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={idStatus}>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="livre">livre</SelectItem>
                      <SelectItem value="ocupada">ocupada</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.status ? (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.status.message as string}</p>
                  ) : null}
                </Field>
              )}
            />

            {/* TIPO */}
            <Controller
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={idTipo}>Tipo</FieldLabel>
                  <Select disabled={isSubmitting} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={idTipo}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carro">carro</SelectItem>
                      <SelectItem value="moto">moto</SelectItem>
                      <SelectItem value="deficiente">deficiente</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.tipo ? (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.tipo.message as string}</p>
                  ) : null}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel ?? (mode === "edit" ? "Salvar alterações" : "Criar vaga")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
