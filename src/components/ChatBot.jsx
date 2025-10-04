import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import Icon from "./UI/Icon";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage, getQuickResponse } from "@services/geminiApi";

const ChatBot = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Prevent body scroll when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Gemini API chat mutation
  const chatMutation = useMutation({
    mutationFn: async ({ message, history }) => {
      try {
        const response = await sendChatMessage(message, history);
        return response;
      } catch (error) {
        console.error("Chat error:", error);
        // Fallback response if API fails
        return {
          message:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or check if your Gemini API key is properly configured.",
          timestamp: new Date().toISOString(),
        };
      }
    },
    onSuccess: (data) => {
      setChatHistory((prev) => [...prev, { type: "assistant", ...data }]);
    },
    onError: (error) => {
      console.error("Chat mutation error:", error);
      // Add error message to chat
      setChatHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          message:
            "I apologize, but I'm experiencing technical difficulties. Please make sure your Gemini API key is properly configured and try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    },
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      message,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setMessage("");

    chatMutation.mutate({ message, history: newHistory });
  };

  const quickQuestions = [
    "Tell me about Mars exploration",
    "What is the James Webb Space Telescope?",
    "How do we discover exoplanets?",
    "What is the International Space Station?",
    "What are black holes?",
    "How do rockets work?",
  ];

  const handleQuickQuestion = (question) => {
    // Auto-send the quick question
    const userMessage = {
      type: "user",
      message: question,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);

    // Send the message with the updated history
    chatMutation.mutate({ message: question, history: newHistory });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-neon-blue via-neon-purple to-neon-orange rounded-full shadow-2xl hover:shadow-neon-blue/50 transition-all duration-300 z-50 flex items-center justify-center group animate-glow"
        style={{
          boxShadow:
            "0 0 30px rgba(0, 245, 255, 0.4), 0 0 60px rgba(191, 0, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)",
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </motion.div>

        {/* Notification dot */}
        {chatHistory.length === 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-neon-orange to-red-500 rounded-full flex items-center justify-center animate-pulse"
            style={{
              boxShadow: "0 0 15px rgba(255, 136, 0, 0.6)",
            }}
          >
            <span className="text-xs text-white font-bold">!</span>
          </motion.div>
        )}
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="rounded-2xl shadow-2xl w-full max-w-md h-[500px] sm:h-[600px] flex flex-col backdrop-blur-xl border border-neon-blue/20"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 25%, rgba(51, 65, 85, 0.85) 50%, rgba(30, 41, 59, 0.9) 75%, rgba(15, 23, 42, 0.95) 100%)",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 245, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neon-blue/20 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-neon-blue via-neon-purple to-neon-orange rounded-full flex items-center justify-center animate-pulse"
                    style={{
                      boxShadow:
                        "0 0 20px rgba(0, 245, 255, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                      NASA Explorer AI
                    </h3>
                    <p className="text-neon-blue/80 text-xs font-medium">
                      Powered by Gemini
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/20"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 relative"
                style={{
                  background:
                    "radial-gradient(circle at 20% 80%, rgba(0, 245, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(191, 0, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255, 136, 0, 0.03) 0%, transparent 50%)",
                }}
              >
                {chatHistory.length === 0 ? (
                  <div className="text-center py-4">
                    <Icon
                      name="gear"
                      size={32}
                      className="mb-3 animate-pulse text-white"
                    />
                    <h3 className="text-lg font-semibold text-white mb-2 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                      Welcome to NASA Explorer AI!
                    </h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Powered by Google Gemini AI. Ask me anything about space,
                      NASA missions, or astronomy.
                    </p>

                    {/* Quick Questions */}
                    {/* <div className="space-y-2">
                      <p className="text-slate-500 text-xs">Try asking:</p>
                      {quickQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question)}
                          className="block w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-colors duration-200"
                        >
                          {question}
                        </button>
                      ))}
                    </div> */}
                  </div>
                ) : (
                  <AnimatePresence>
                    {chatHistory.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${
                          msg.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 text-sm ${
                            msg.type === "user"
                              ? "bg-gradient-to-br from-neon-blue to-neon-purple text-white shadow-lg"
                              : "bg-gradient-to-br from-slate-700/80 to-slate-600/80 text-slate-100 backdrop-blur-sm border border-slate-600/50"
                          }`}
                          style={
                            msg.type === "user"
                              ? {
                                  boxShadow:
                                    "0 8px 25px rgba(0, 245, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                                }
                              : {
                                  boxShadow:
                                    "0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                                }
                          }
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {chatMutation.isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="bg-gradient-to-br from-slate-700/80 to-slate-600/80 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 text-sm"
                      style={{
                        boxShadow:
                          "0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gradient-to-r from-neon-purple to-neon-orange rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gradient-to-r from-neon-orange to-neon-blue rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-neon-blue/20 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about space..."
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-slate-700/80 to-slate-600/80 border border-neon-blue/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 backdrop-blur-sm transition-all duration-300 placeholder-slate-400"
                    style={{
                      boxShadow:
                        "inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                    disabled={chatMutation.isPending}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || chatMutation.isPending}
                    className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-orange disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
                    style={{
                      boxShadow:
                        "0 4px 15px rgba(0, 245, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
