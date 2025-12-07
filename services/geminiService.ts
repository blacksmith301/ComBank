import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateThankYouMessage = async (userWish: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are the warm, empathetic voice of Commercial Bank during a Christmas charity drive called "Wish for the Nation".
        We are collecting wishes for flood victims. For every wish, we donate Rs. 1,000.
        
        A user has just submitted this wish: "${userWish}"
        
        Write a very short, poetic, and heartwarming thank you note (max 2 sentences) to the user.
        Acknowledge the specific sentiment of their wish.
        Mention that their wish has turned into aid.
        Keep the tone hopeful, festive but respectful of the tragedy.
      `,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster response on a kiosk
        temperature: 0.7,
      }
    });

    return response.text || "Thank you for your warm wish. Your kindness has contributed Rs. 1,000 to the relief fund.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Thank you for your heartfelt message. Together, we are making a difference this Christmas.";
  }
};