"use server";

import { Car, ProblemSeverity } from "../types";

interface AnalysisResult {
  analysis: string;
  estimatedCost: number;
  severity: ProblemSeverity;
}

export async function analyzeCarProblem(
  car: Pick<Car, "make" | "model" | "year" | "currentMileage">,
  problemDescription: string
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      analysis: "API Key fehlt. KI-Analyse nicht möglich.",
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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("Keine Antwort erhalten");
    }

    const parsed = JSON.parse(text);
    
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
    console.error("Gemini Error:", error);
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
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return "API Key fehlt.";
  }

  const prompt = `
    Fahrzeug: ${car.make} ${car.model}, Baujahr ${car.year}, ${car.currentMileage}km.
    Wann steht die nächste große Wartung an und worauf sollte ich bei diesem Modell besonders achten (bekannte Schwachstellen)?
    Antworte kurz und prägnant auf Deutsch.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Keine Informationen verfügbar.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Fehler beim Abrufen der Wartungsinformationen.";
  }
}
