
import { GoogleGenAI, Type } from "@google/genai";
import { PlasticAnalysis } from "../types";

export const analyzePlasticImage = async (base64Image: string): Promise<PlasticAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analyze this image to identify the type of plastic present. Determine the resin code (1-7), the common name (e.g., PET, HDPE), and provide a list of scientifically documented or AI-engineered enzymes that can biodegrade this specific polymer. For each enzyme, provide: name, source, description, and efficiency. Crucially, if the current known efficiency is low or could be improved, provide specific 'optimizationSuggestions' (e.g., specific mutations, pH/temperature adjustments, or directed evolution paths) to increase the enzyme's breakdown capacity for this material.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          resinCode: { type: Type.INTEGER },
          fullTitle: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          environmentalImpact: { type: Type.STRING },
          recommendedEnzymes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                source: { type: Type.STRING },
                description: { type: Type.STRING },
                efficiency: { type: Type.STRING },
                optimizedByAI: { type: Type.BOOLEAN },
                optimizationSuggestions: { type: Type.STRING, description: "Detailed suggestions to increase degradation efficiency" },
              },
              required: ["name", "source", "description", "efficiency", "optimizedByAI"],
            },
          },
        },
        required: ["type", "resinCode", "fullTitle", "confidence", "description", "environmentalImpact", "recommendedEnzymes"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI model");
  }

  return JSON.parse(response.text) as PlasticAnalysis;
};
