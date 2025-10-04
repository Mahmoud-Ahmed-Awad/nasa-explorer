import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Google Gemini API Service
 * Handles chat interactions with Google's Gemini AI model using @google/generative-ai
 */

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Google Generative AI
let genAI = null;
let model = null;

// Initialize the AI model
const initializeAI = () => {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables."
    );
  }

  console.log("Gemini API Key found:", GEMINI_API_KEY ? "Yes" : "No");

  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    });
    console.log("Gemini model initialized successfully");
  }

  return model;
};

/**
 * Send a chat message to Gemini API
 * @param {string} message - The user's message
 * @param {Array} chatHistory - Previous chat messages for context
 * @returns {Promise<Object>} - The AI response
 */
export const sendChatMessage = async (message, chatHistory = []) => {
  try {
    const model = initializeAI();

    // Build the conversation history for context
    const chat = model.startChat({
      history: chatHistory.slice(-10).map((msg) => ({
        role: msg.type === "user" ? "user" : "model",
        parts: [{ text: msg.message }],
      })),
    });

    console.log("Sending message to Gemini:", message);
    console.log("Chat history:", chatHistory);

    const result = await chat.sendMessage(message);
    console.log("Gemini result:", result);

    const response = await result.response;
    console.log("Gemini response:", response);

    const responseText = response.text();
    console.log("Response text:", responseText);

    if (!responseText) {
      console.error("Empty response from Gemini API");
      console.error("Response object:", response);
      console.error("Result object:", result);

      // Check if response was blocked by safety filters
      if (
        response.candidates &&
        response.candidates[0] &&
        response.candidates[0].finishReason
      ) {
        const finishReason = response.candidates[0].finishReason;
        console.error("Finish reason:", finishReason);

        if (finishReason === "SAFETY") {
          throw new Error(
            "Response blocked by safety filters. Please rephrase your message."
          );
        } else if (finishReason === "RECITATION") {
          throw new Error(
            "Response blocked due to recitation concerns. Please try a different question."
          );
        } else if (finishReason === "MAX_TOKENS") {
          throw new Error(
            "Response was too long and got truncated. Please ask a more specific question."
          );
        }
      }

      throw new Error("No response received from Gemini API");
    }

    console.log("Received response from Gemini:", responseText);

    return {
      message: responseText,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);

    // Handle specific error cases
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error(
        "Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY."
      );
    } else if (error.message?.includes("QUOTA_EXCEEDED")) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else if (error.message?.includes("SAFETY")) {
      throw new Error(
        "Content blocked by safety filters. Please rephrase your message."
      );
    } else if (error.message?.includes("MAX_TOKENS")) {
      throw new Error(
        "Response was too long and got truncated. Please ask a more specific question."
      );
    }

    throw error;
  }
};

/**
 * Get a quick response for common space-related questions
 * @param {string} question - The user's question
 * @returns {Promise<Object>} - The AI response
 */
export const getQuickResponse = async (question) => {
  const spaceContext = `You are NASA Explorer's AI assistant. You help users learn about space, NASA missions, exoplanets, satellites, and astronomy. 
  
  Guidelines:
  - Provide accurate, educational information about space and NASA
  - Keep responses concise but informative (2-3 sentences)
  - Use a friendly, enthusiastic tone
  - If you don't know something specific, suggest where users can find more information
  - Focus on NASA missions, space exploration, and astronomy topics
  
  User question: ${question}`;

  return sendChatMessage(spaceContext);
};

/**
 * Check if Gemini API is available
 * @returns {Promise<boolean>} - Whether the API is accessible
 */
export const checkGeminiApiHealth = async () => {
  try {
    const model = initializeAI();
    // Make a simple test request
    const result = await model.generateContent("Hello");
    const response = await result.response;
    return !!response.text();
  } catch (error) {
    console.error("Gemini API health check failed:", error);
    return false;
  }
};

export default {
  sendChatMessage,
  getQuickResponse,
  checkGeminiApiHealth,
};
