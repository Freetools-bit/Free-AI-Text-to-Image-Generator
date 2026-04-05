import { GoogleGenAI } from "@google/genai";

export async function generateImage(prompt: string) {
  // Initialize the Gemini AI client inside the function to ensure the latest API key is used
  const apiKey = process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from the AI model.");
    }

    const parts = response.candidates[0].content?.parts || [];
    
    for (const part of parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    // If no image part was found, check if there's text (it might be a refusal or error message)
    const textPart = parts.find(p => p.text);
    if (textPart) {
      throw new Error(`AI Response: ${textPart.text}`);
    }

    throw new Error("No image data found in the AI response.");
  } catch (error: any) {
    console.error("Error generating image:", error);
    
    // Provide a more user-friendly error message
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please check your configuration.");
    } else if (error.message?.includes("safety")) {
      throw new Error("The prompt was flagged by safety filters. Please try a different description.");
    }
    
    throw error;
  }
}
