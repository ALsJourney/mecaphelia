import { redirect } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpenrouterApiKeyForm } from "./openrouter-api-key-form";
import { CountryForm } from "./country-form";
import { Country } from "@/features/cars/types";

type UserWithSettings = {
  openrouterApiKey?: string | null;
  country?: Country;
};

export default async function SettingsPage() {
  const { user } = await getAuth();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Einstellungen</h2>
      <p className="text-muted-foreground mb-8">Mecaphelia Version 1.0.0</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Datenschutz</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Alle Daten werden sicher in der Datenbank gespeichert und sind nur für dich zugänglich.
            Die KI-Analyse verwendet die Openrouter API.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Openrouter</CardTitle>
        </CardHeader>
        <CardContent>
          <OpenrouterApiKeyForm
            defaultValue={
              (user as unknown as UserWithSettings | null)
                ?.openrouterApiKey
            }
          />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Land / Region</CardTitle>
        </CardHeader>
        <CardContent>
          <CountryForm
            defaultValue={
              ((user as unknown as UserWithSettings)?.country as Country) ||
              Country.DEUTSCHLAND
            }
          />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Konto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
              <span className="text-muted-foreground">Benutzername</span>
              <span className="font-medium break-all">{user.username}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
              <span className="text-muted-foreground">E-Mail</span>
              <span className="font-medium break-all">{user.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
