import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Category } from '../types';
import { ALL_CATEGORIES } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to determine category from description
export const predictCategory = async (description: string): Promise<string> => {
  if (!apiKey) return Category.OTHER;
  
  try {
    const categoriesList = ALL_CATEGORIES.join(', ');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // Added context about Indian transactions
      contents: `Classify the transaction described as "${description}" into exactly one of these categories: [${categoriesList}]. 
      Context: This is for an Indian user. 
      Examples: "Swiggy" -> Food, "Ola/Uber" -> Transportation, "Bescom/Tata Power" -> Utilities, "Kirana" -> Food, "UPI" -> Check context.
      If unsure, choose 'Other'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: ALL_CATEGORIES,
            },
          },
          required: ["category"],
        },
      }
    });

    const text = response.text;
    if (!text) return Category.OTHER;
    
    const json = JSON.parse(text);
    return json.category || Category.OTHER;
  } catch (error) {
    console.error("Gemini categorization error:", error);
    return Category.OTHER;
  }
};

// Helper to generate insights
export const generateInsights = async (transactions: Transaction[]): Promise<string> => {
  if (!apiKey || transactions.length === 0) return "No transactions to analyze yet.";

  try {
    // Summarize data for the prompt
    const summary = transactions.slice(0, 50).map(t => 
      `${t.date}: ${t.description} (${t.type}) - ₹${t.amount} [${t.category}]`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze these recent financial transactions for an Indian user and provide 3 short, actionable bullet points of advice. 
      Focus on spending habits (e.g., excessive ordering from Zomato/Swiggy), savings opportunities, or budget tracking.
      
      Transactions:
      ${summary}`,
      config: {
        systemInstruction: "You are a friendly Indian financial advisor. Use Indian terminology where appropriate (Lakhs, Crores if applicable, or just friendly tone). Keep advice concise (under 20 words per point). Format as a Markdown list."
      }
    });

    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini insights error:", error);
    return "Unable to generate insights. Please try again later.";
  }
};