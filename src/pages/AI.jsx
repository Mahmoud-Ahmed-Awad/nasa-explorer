import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@services/api";
import Icon from "../components/UI/Icon";

const AI = () => {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Mock chat mutation
  const chatMutation = useMutation({
    mutationFn: async (userMessage) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock responses based on message content
      const responses = {
        "james webb":
          "The James Webb Space Telescope is NASA's most powerful space telescope ever built. It was launched in December 2021 and is designed to study the formation of stars and planets, investigate the origins of life, and observe the first galaxies formed after the Big Bang.",
        exoplanet:
          "Exoplanets are planets that orbit stars outside our solar system. Scientists have discovered over 5,000 confirmed exoplanets using various detection methods including the transit method and radial velocity method.",
        mars: "Mars is the fourth planet from the Sun and is often called the 'Red Planet' due to its reddish appearance. NASA has sent multiple rovers to Mars, including Perseverance, which is currently exploring the planet's surface.",
        iss: "The International Space Station (ISS) is a modular space station in low Earth orbit. It's a collaborative project between NASA, Roscosmos, ESA, JAXA, and CSA, serving as a microgravity laboratory.",
        default:
          "I'm NASA Explorer's AI assistant! I can help you learn about space missions, exoplanets, satellites, and other space-related topics. Feel free to ask me anything about space exploration, NASA missions, or astronomy!",
      };

      const lowerMessage = userMessage.toLowerCase();
      let response = responses.default;

      if (
        lowerMessage.includes("james webb") ||
        lowerMessage.includes("webb")
      ) {
        response = responses["james webb"];
      } else if (lowerMessage.includes("exoplanet")) {
        response = responses.exoplanet;
      } else if (lowerMessage.includes("mars")) {
        response = responses.mars;
      } else if (
        lowerMessage.includes("iss") ||
        lowerMessage.includes("space station")
      ) {
        response = responses.iss;
      }

      return { message: response, timestamp: new Date().toISOString() };
    },
    onSuccess: (data) => {
      setChatHistory((prev) => [...prev, { type: "assistant", ...data }]);
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
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");

    chatMutation.mutate(message);
  };

  const exampleQuestions = [
    t("ai.examples.q1"),
    t("ai.examples.q2"),
    t("ai.examples.q3"),
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient font-space mb-4">
              {t("ai.title")}
            </h1>
            <p className="text-xl text-slate-400">{t("ai.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <div className="card h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center space-x-3 p-4 border-b border-slate-700">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      NASA Explorer AI
                    </h3>
                    <p className="text-slate-400 text-sm">Online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="gear" size={48} className="mb-4 text-white" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Welcome to NASA Explorer AI!
                      </h3>
                      <p className="text-slate-400">
                        Ask me anything about space, NASA missions, or
                        astronomy.
                      </p>
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
                            msg.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              msg.type === "user"
                                ? "bg-neon-blue text-white"
                                : "bg-slate-700 text-slate-100"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-2">
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
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-slate-400 text-sm">
                            {t("ai.thinking")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-700">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("ai.placeholder")}
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                      disabled={chatMutation.isPending}
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || chatMutation.isPending}
                      className="px-6 py-3 bg-neon-blue hover:bg-neon-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300"
                    >
                      {t("ai.send")}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Example Questions */}
              <div className="card">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t("ai.examples.title")}
                </h3>
                <div className="space-y-3">
                  {exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(question)}
                      className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-300"
                    >
                      <p className="text-slate-300 text-sm">{question}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Capabilities */}
              <div className="card">
                <h3 className="text-xl font-semibold text-white mb-4">
                  AI Capabilities
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span className="text-slate-300 text-sm">
                      Space Mission Information
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span className="text-slate-300 text-sm">
                      Exoplanet Data
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span className="text-slate-300 text-sm">
                      Satellite Tracking
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span className="text-slate-300 text-sm">
                      Astronomy Facts
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span className="text-slate-300 text-sm">NASA History</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      setMessage("Tell me about the latest NASA missions")
                    }
                    className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-300"
                  >
                    <span className="text-slate-300 text-sm">
                      Latest Missions
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      setMessage(
                        "What are the most interesting exoplanets discovered recently?"
                      )
                    }
                    className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-300"
                  >
                    <span className="text-slate-300 text-sm">
                      Recent Exoplanets
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      setMessage("How can I track satellites in real-time?")
                    }
                    className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-300"
                  >
                    <span className="text-slate-300 text-sm">
                      Satellite Tracking
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AI;
