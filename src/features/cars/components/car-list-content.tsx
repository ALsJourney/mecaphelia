"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createCar } from "../actions/car-actions";
import { CarWithRelations } from "../types";

interface CarListContentProps {
  cars: CarWithRelations[];
}

export function CarListContent({ cars }: CarListContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddCar = () => {
    startTransition(async () => {
      const newCar = await createCar({
        make: "Neues Auto",
        model: "(Modell bearbeiten)",
        year: new Date().getFullYear(),
        purchasePrice: 0,
        purchaseDate: new Date(),
        currentMileage: 0,
        nextInspectionDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        nextServiceDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
      });
      router.push(`/cars/${newCar.id}`);
    });
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Fahrzeuge</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Verwalte deinen Fuhrpark.</p>
        </div>
        <Button onClick={handleAddCar} disabled={isPending} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Fahrzeug hinzufügen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Link key={car.id} href={`/cars/${car.id}`}>
            <Card className="group cursor-pointer hover:border-primary/50 transition-all h-full flex flex-col overflow-hidden">
              <div className="relative h-48 bg-muted">
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Kein Bild
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold border">
                  {car.year}
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mt-1">
                    {car.currentMileage.toLocaleString()} km
                  </p>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex justify-between text-sm py-2 border-t">
                    <span className="text-muted-foreground">Investiert</span>
                    <span className="font-mono">
                      €
                      {(
                        car.expenses.reduce((s, e) => s + e.amount, 0) / 100
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-foreground transition-colors pt-2">
                    <span>Details anzeigen</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {cars.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>Noch keine Fahrzeuge vorhanden.</p>
            <Button onClick={handleAddCar} className="mt-4" disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" />
              Erstes Fahrzeug hinzufügen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
