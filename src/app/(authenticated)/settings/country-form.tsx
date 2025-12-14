"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCountry } from "@/features/account/actions/update-country";
import { Country, CountryLabels } from "@/features/cars/types";

interface CountryFormProps {
  defaultValue: Country;
}

export function CountryForm({ defaultValue }: CountryFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: Country) => {
    startTransition(async () => {
      await updateCountry(value);
    });
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Wähle dein Land aus, um die korrekten TÜV/Pickerl-Bezeichnungen und Überzugsfristen zu sehen.
      </p>
      <Select
        defaultValue={defaultValue}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Land auswählen" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(Country).map((country) => (
            <SelectItem key={country} value={country}>
              {CountryLabels[country]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && (
        <p className="text-xs text-muted-foreground">Speichern...</p>
      )}
    </div>
  );
}
