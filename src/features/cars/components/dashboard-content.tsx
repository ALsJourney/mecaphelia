"use client";

import { Euro, AlertTriangle, CalendarClock, TrendingUp, AlertCircle, Wrench } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarWithRelations, ProblemStatus } from "../types";

interface DashboardContentProps {
  cars: CarWithRelations[];
}

export function DashboardContent({ cars }: DashboardContentProps) {
  const totalValue = cars.reduce((acc, car) => acc + car.purchasePrice, 0);

  const totalSpent = cars.reduce((acc, car) => {
    return acc + car.expenses.reduce((eAcc, exp) => eAcc + exp.amount, 0);
  }, 0);

  const totalProblems = cars.reduce(
    (acc, car) =>
      acc + car.problems.filter((p) => p.status !== ProblemStatus.RESOLVED).length,
    0
  );

  const data = cars.map((car) => ({
    name: `${car.make} ${car.model}`,
    Investiert: car.expenses.reduce((sum, exp) => sum + exp.amount, 0) / 100,
    Kaufpreis: car.purchasePrice / 100,
  }));

  const upcomingInspections = cars
    .map((c) => ({
      car: `${c.make} ${c.model}`,
      date: new Date(c.nextInspectionDate),
      daysLeft: Math.ceil(
        (new Date(c.nextInspectionDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .filter((x) => x.daysLeft > -400);

  const mostUrgentInspection = upcomingInspections[0];
  let inspectionUrgencyColor = "text-green-500";
  let InspectionIcon = CalendarClock;

  if (mostUrgentInspection) {
    if (mostUrgentInspection.daysLeft < 0) {
      inspectionUrgencyColor = "text-destructive";
      InspectionIcon = AlertTriangle;
    } else if (mostUrgentInspection.daysLeft < 30) {
      inspectionUrgencyColor = "text-orange-500";
      InspectionIcon = AlertCircle;
    }
  }

  const upcomingServices = cars
    .filter((c) => c.nextServiceDate)
    .map((c) => ({
      car: `${c.make} ${c.model}`,
      date: new Date(c.nextServiceDate!),
      daysLeft: Math.ceil(
        (new Date(c.nextServiceDate!).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .filter((x) => x.daysLeft > -400);

  const mostUrgentService = upcomingServices[0];
  let serviceUrgencyColor = "text-muted-foreground";
  let ServiceIcon = Wrench;

  if (mostUrgentService) {
    if (mostUrgentService.daysLeft < 0) {
      serviceUrgencyColor = "text-destructive";
      ServiceIcon = AlertTriangle;
    } else if (mostUrgentService.daysLeft < 30) {
      serviceUrgencyColor = "text-orange-500";
      ServiceIcon = AlertCircle;
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2">Übersicht</h2>
        <p className="text-muted-foreground">
          Willkommen zurück. Hier ist der Status deiner Flotte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Gesamtwert
            </CardTitle>
            <Euro className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              €{(totalValue / 100).toLocaleString("de-DE")}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Kaufpreis Basis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Ausgaben
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              €{(totalSpent / 100).toLocaleString("de-DE")}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Investitionen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Probleme
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProblems}</p>
            <p className="text-xs text-muted-foreground mt-2">Offene Tickets</p>
          </CardContent>
        </Card>

        <Card
          className={
            mostUrgentInspection?.daysLeft < 0
              ? "border-destructive bg-destructive/5"
              : ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              TÜV / Pickerl
            </CardTitle>
            <InspectionIcon
              className={`h-5 w-5 ${
                mostUrgentInspection?.daysLeft < 0 ? "animate-pulse" : ""
              } ${inspectionUrgencyColor}`}
            />
          </CardHeader>
          <CardContent>
            {mostUrgentInspection ? (
              <>
                <p className="text-xl font-bold truncate">
                  {mostUrgentInspection.car}
                </p>
                <p className={`text-sm font-bold mt-1 ${inspectionUrgencyColor}`}>
                  {mostUrgentInspection.daysLeft < 0
                    ? `SEIT ${Math.abs(mostUrgentInspection.daysLeft)} TAGEN`
                    : `in ${mostUrgentInspection.daysLeft} Tagen`}
                </p>
              </>
            ) : (
              <p>Keine Daten</p>
            )}
          </CardContent>
        </Card>

        <Card
          className={
            mostUrgentService?.daysLeft < 0
              ? "border-destructive bg-destructive/5"
              : ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Nächster Service
            </CardTitle>
            <ServiceIcon
              className={`h-5 w-5 ${
                mostUrgentService?.daysLeft < 0 ? "animate-pulse" : ""
              } ${serviceUrgencyColor}`}
            />
          </CardHeader>
          <CardContent>
            {mostUrgentService ? (
              <>
                <p className="text-xl font-bold truncate">
                  {mostUrgentService.car}
                </p>
                <p className={`text-sm font-bold mt-1 ${serviceUrgencyColor}`}>
                  {mostUrgentService.daysLeft < 0
                    ? `SEIT ${Math.abs(mostUrgentService.daysLeft)} TAGEN`
                    : `in ${mostUrgentService.daysLeft} Tagen`}
                </p>
              </>
            ) : (
              <p>Keine Daten</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investitionsvergleich</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(val) => `€${val}`}
                />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip
                  formatter={(value: number) => `€${value.toLocaleString("de-DE")}`}
                />
                <Bar
                  dataKey="Kaufpreis"
                  stackId="a"
                  fill="hsl(var(--muted))"
                  radius={[0, 4, 4, 0]}
                  barSize={32}
                />
                <Bar
                  dataKey="Investiert"
                  stackId="a"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
