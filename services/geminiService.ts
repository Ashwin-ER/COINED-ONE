import { GoogleGenAI, Chat } from "@google/genai";
import { calculateEmiToolDeclaration, executeCalculateEmi, CALCULATE_EMI_TOOL_NAME } from "../tools/mortgageTools";
import { SYSTEM_INSTRUCTION } from "../constants";
import { EMIToolInput } from "../types";

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;
  private modelId = "gemini-2.5-flash";

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is not defined in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  public async startChat() {
    try {
      this.chat = this.ai.chats.create({
        model: this.modelId,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: [calculateEmiToolDeclaration] }],
        },
      });
      return true;
    } catch (error) {
      console.error("Failed to start chat:", error);
      return false;
    }
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      await this.startChat();
    }

    if (!this.chat) {
      throw new Error("Chat session could not be initialized.");
    }

    try {
      // 1. Send user message
      let response = await this.chat.sendMessage({ message });
      
      // 2. Loop to handle potential function calls (recursively or loop)
      // The Gemini API might return a tool call. We need to check for it.
      let text = response.text || '';
      
      // Check for function calls in the candidates
      const candidate = response.candidates?.[0];
      const functionCalls = candidate?.content?.parts?.filter(p => p.functionCall).map(p => p.functionCall);

      if (functionCalls && functionCalls.length > 0) {
        // We have function calls to execute
        const functionResponses = [];

        for (const call of functionCalls) {
          if (call && call.name === CALCULATE_EMI_TOOL_NAME) {
            console.log("Executing Tool:", call.name, call.args);
            const input = call.args as unknown as EMIToolInput;
            const result = executeCalculateEmi(input);
            
            functionResponses.push({
              id: call.id,
              name: call.name,
              response: { result: result }
            });
          }
        }

        if (functionResponses.length > 0) {
           // Send the tool results back to the model
           // IMPORTANT: In a chat, we send the new parts. The history is maintained by the Chat object.
           const parts = functionResponses.map(fr => ({ functionResponse: fr }));
           
           // Send tool output back to model to get the final text response
           const toolResponse = await this.chat.sendMessage({ message: parts });
           text = toolResponse.text || "I've calculated that for you.";
        }
      }

      return text;

    } catch (error) {
      console.error("Error in sendMessage:", error);
      return "I'm having a bit of trouble connecting to my brain right now. Can we try that again?";
    }
  }
}

export const geminiService = new GeminiService();