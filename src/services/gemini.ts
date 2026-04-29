import { GoogleGenAI, Type } from "@google/genai";

export interface ExtractedData {
  monto: number | null;
  tipo: "ingreso" | "egreso";
  moneda: "ARS" | "USD";
  categoria: string;
  empresa: string | null;
  descripcion: string;
}

const SYSTEM_PROMPT = `Actuá como un extractor de datos financieros y gestor de empresas para el mercado argentino.
Tu función es doble:
1. Extraer transacciones (ingresos/egresos) de mensajes informales.
2. Identificar comandos de gestión (ej: agregar una empresa).

REGLAS DE COMANDOS:
- Si el usuario dice "agregar empresa [nombre]", "crear empresa [nombre]", etc.
  Devolvé: {"command": "ADD_COMPANY", "companyName": "[nombre]"}

REGLAS DE TRANSACCIONES:
- Devolvé una lista de items dentro de "items".
- MONTO: "Gamba" (100), "Luca" (1000), "Palo" (1M).
- MONEDA: "ARS" (pesos/$) o "USD" (dólares/verdes).
- TIPO: "ingreso" o "egreso".

EJEMPLO DE SALIDA PARA TRANSACCIONES:
{
  "items": [{"monto": 5000, "tipo": "ingreso", "moneda": "ARS", "categoria": "ventas", "empresa": "taller", "descripcion": "Venta"}]
}

EJEMPLO DE SALIDA PARA COMANDO:
{
  "command": "ADD_COMPANY",
  "companyName": "Casa"
}

RESTRICCIÓN: Si no es nada de esto, devolvé {"error": "no_data_found"}.`;

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export type GeminiResponse = 
  | { items: ExtractedData[] }
  | { command: "ADD_COMPANY"; companyName: string }
  | { error: string };

export async function extractFinancialData(text: string): Promise<GeminiResponse> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: text,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  monto: { type: Type.NUMBER, nullable: true },
                  tipo: { type: Type.STRING, enum: ["ingreso", "egreso"] },
                  moneda: { type: Type.STRING, enum: ["ARS", "USD"] },
                  categoria: { type: Type.STRING },
                  empresa: { type: Type.STRING, nullable: true },
                  descripcion: { type: Type.STRING }
                },
                required: ["tipo", "moneda", "categoria", "descripcion"]
              }
            },
            command: { type: Type.STRING },
            companyName: { type: Type.STRING },
            error: { type: Type.STRING, nullable: true }
          }
        }
      },
    });

    return JSON.parse(response.text || '{}') as GeminiResponse;
  } catch (error) {
    console.error("Error extracting data:", error);
    return { error: error instanceof Error ? error.message : "failed_to_process" };
  }
}

