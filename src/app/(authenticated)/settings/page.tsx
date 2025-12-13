import { redirect } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const { user } = await getAuth();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold mb-4">Einstellungen</h2>
      <p className="text-muted-foreground mb-8">Mecaphelia Version 1.0.0</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Datenschutz</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Alle Daten werden sicher in der Datenbank gespeichert und sind nur für dich zugänglich.
            Die KI-Analyse verwendet die Google Gemini API.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Konto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Benutzername</span>
              <span className="font-medium">{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">E-Mail</span>
              <span className="font-medium">{user.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
