import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface ExtractedItem {
  monto: number | null;
  tipo: "ingreso" | "egreso";
  moneda: "ARS" | "USD";
  categoria: string;
  empresa: string | null;
  descripcion: string;
}

const SYSTEM_PROMPT = `Actuá como un extractor de datos financieros y gestor experto para el mercado argentino.
Tu función es transformar mensajes informales (texto o transcripciones) en comandos y datos estructurados.

REGLAS DE INTENCIONES (intent):
1. "REGISTRAR": Para gastos o ingresos.
2. "GESTIONAR_EMPRESA": Para crear o borrar empresas.
3. "ELIMINAR_MOVIMIENTO": Para borrar el registro más reciente.

JERGA ARGENTINA: "lucas/k" = 1000, "gamba" = 100, "palo" = 1.000.000, "pe" = pesos.

REGLAS DE CATEGORIZACIÓN:
- Sé inteligente. Si alguien dice "pan", la categoría es "Alimentos". 
- Si dice "nafta", es "Transporte". 
- Si dice "luz/gas", es "Servicios". 
- Si no estás seguro, usá "Otros".

REGLAS DE MONEDA: ARS (default), USD (dólares, verdes).
REGLAS DE TIPO: "ingreso" o "egreso".`;

let aiInstance: GoogleGenerativeAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY;
    if (!apiKey) {
      // In this environment GEMINI_API_KEY is usually in process.env but for Vite we use internal methods sometimes
      // However the platform says use process.env.GEMINI_API_KEY for Gemini.
      // But in client side it might not be exposed.
      // Actually, the platform says: Always use process.env.GEMINI_API_KEY for the Gemini API.
      return new GoogleGenerativeAI("REPLACE_WITH_ACTUAL_KEY_IF_NEEDED"); 
    }
    aiInstance = new GoogleGenerativeAI(apiKey);
  }
  return aiInstance;
}

export type GeminiResponse = 
  | { intent: "REGISTRAR"; items: ExtractedItem[] }
  | { intent: "GESTIONAR_EMPRESA"; action: "ADD" | "DELETE"; companyName: string }
  | { intent: "ELIMINAR_MOVIMIENTO"; target: "last" | string }
  | { intent: "CONSULTAR"; query: string }
  | { error: string };

export async function extractFinancialData(text: string): Promise<GeminiResponse> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            intent: { type: SchemaType.STRING, enum: ["REGISTRAR", "GESTIONAR_EMPRESA", "ELIMINAR_MOVIMIENTO", "CONSULTAR"] },
            items: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  monto: { type: SchemaType.NUMBER },
                  tipo: { type: SchemaType.STRING, enum: ["ingreso", "egreso"] },
                  moneda: { type: SchemaType.STRING, enum: ["ARS", "USD"] },
                  categoria: { type: SchemaType.STRING },
                  empresa: { type: SchemaType.STRING },
                  descripcion: { type: SchemaType.STRING }
                },
                required: ["tipo", "moneda", "categoria", "descripcion"]
              }
            },
            action: { type: SchemaType.STRING },
            companyName: { type: SchemaType.STRING },
            target: { type: SchemaType.STRING },
            query: { type: SchemaType.STRING },
            error: { type: SchemaType.STRING }
          }
        } as any
      },
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(text);
    const response = await result.response;
    return JSON.parse(response.text()) as GeminiResponse;
  } catch (error) {
    console.error("Error extracting data:", error);
    return { error: error instanceof Error ? error.message : "failed_to_process" };
  }
}
