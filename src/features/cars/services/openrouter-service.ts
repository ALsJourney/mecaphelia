"use server";

import { Car, ProblemSeverity } from "../types";
import { getAuth } from "@/features/auth/queries/get-auth";

interface AnalysisResult {
  analysis: string;
  estimatedCost: number;
  severity: ProblemSeverity;
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODEL = "mistralai/mistral-7b-instruct:free";

const stripCodeFences = (value: string) => {
  return value
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/i, "")
    .trim();
};

type UserWithOpenrouterApiKey = {
  openrouterApiKey?: string | null;
};

export async function analyzeCarProblem(
  car: Pick<Car, "make" | "model" | "year" | "currentMileage">,
  problemDescription: string
): Promise<AnalysisResult> {
  const { user } = await getAuth();
  const apiKey =
    (user as unknown as UserWithOpenrouterApiKey | null)?.openrouterApiKey ??
    process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      analysis: "API Key fehlt. Openrouter KI-Analyse nicht möglich.",
      estimatedCost: 0,
      severity: ProblemSeverity.LOW,
    };
  }

  const prompt = `
    Du bist ein erfahrener KFZ-Mechaniker KI-Assistent.
    Fahrzeug: ${car.make} ${car.model}, Baujahr ${car.year}, Kilometerstand ${car.currentMileage}km.
    Problembeschreibung: "${problemDescription}"
    
    Bitte analysiere das Problem. Gib mögliche Ursachen an, schätze die Reparaturkosten (in Euro) und bestimme den Schweregrad (LOW, MEDIUM, HIGH, CRITICAL).
    Antworte im JSON Format mit den Feldern: analysis (string), estimatedCost (number), severity (string).
  `;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Title": "Mecaphelia",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Du bist ein erfahrener KFZ-Mechaniker KI-Assistent. Antworte exakt im JSON-Format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        response_format: {
          type: "json_object",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Keine Antwort erhalten");
    }

    const parsed = JSON.parse(stripCodeFences(text));

    const severityMap: Record<string, ProblemSeverity> = {
      low: ProblemSeverity.LOW,
      medium: ProblemSeverity.MEDIUM,
      high: ProblemSeverity.HIGH,
      critical: ProblemSeverity.CRITICAL,
      LOW: ProblemSeverity.LOW,
      MEDIUM: ProblemSeverity.MEDIUM,
      HIGH: ProblemSeverity.HIGH,
      CRITICAL: ProblemSeverity.CRITICAL,
    };

    return {
      analysis: parsed.analysis || "",
      estimatedCost: parsed.estimatedCost || 0,
      severity: severityMap[parsed.severity] || ProblemSeverity.MEDIUM,
    };
  } catch (error) {
    console.error("Openrouter Error:", error);
    return {
      analysis: "Fehler bei der KI-Analyse. Bitte versuchen Sie es später erneut.",
      estimatedCost: 0,
      severity: ProblemSeverity.MEDIUM,
    };
  }
}

export async function suggestMaintenance(
  car: Pick<Car, "make" | "model" | "year" | "currentMileage">
): Promise<string> {
  const { user } = await getAuth();
  const apiKey =
    (user as unknown as UserWithOpenrouterApiKey | null)?.openrouterApiKey ??
    process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return "API Key fehlt.";
  }

  const prompt = `
    Fahrzeug: ${car.make} ${car.model}, Baujahr ${car.year}, ${car.currentMileage}km.
    Wann steht die nächste große Wartung an und worauf sollte ich bei diesem Modell besonders achten (bekannte Schwachstellen)?
    Antworte kurz und prägnant auf Deutsch.
  `;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Title": "Mecaphelia",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "Antworte kurz und prägnant auf Deutsch.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content || "Keine Informationen verfügbar."
    );
  } catch (error) {
    console.error("Openrouter Error:", error);
    return "Fehler beim Abrufen der Wartungsinformationen.";
  }
}
