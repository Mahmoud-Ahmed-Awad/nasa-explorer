import React, { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import Icon from "@components/UI/Icon";

const Contact = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.05),transparent_50%)]"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-blue/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-neon-purple/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-green/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          {/* Enhanced Header */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent font-space mb-6">
                {t("contact.title")}
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              {t("contact.subtitle")}
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="w-32 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Enhanced Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {/* Form Card with Clean Design */}
              <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-2xl mb-4 border border-slate-600/50"
                  >
                    <Icon name="send" size={32} className="text-neon-blue" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Send us a message
                  </h2>
                  <p className="text-slate-400">We'd love to hear from you</p>
                </div>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        name="checkCircle"
                        size={24}
                        className="text-green-400"
                      />
                      <span className="text-green-400 font-medium">
                        Message sent successfully! We'll get back to you soon.
                      </span>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label
                      htmlFor="name"
                      className="block text-slate-300 mb-3 font-semibold text-lg"
                    >
                      {t("contact.form.name")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all duration-300 backdrop-blur-sm text-lg hover:border-neon-blue/50"
                      placeholder="Enter your full name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-slate-300 mb-3 font-semibold text-lg"
                    >
                      {t("contact.form.email")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all duration-300 backdrop-blur-sm text-lg hover:border-neon-blue/50"
                      placeholder="Enter your email address"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label
                      htmlFor="subject"
                      className="block text-slate-300 mb-3 font-semibold text-lg"
                    >
                      {t("contact.form.subject")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all duration-300 backdrop-blur-sm text-lg hover:border-neon-blue/50"
                      placeholder="What's this about?"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label
                      htmlFor="message"
                      className="block text-slate-300 mb-3 font-semibold text-lg"
                    >
                      {t("contact.form.message")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent resize-none transition-all duration-300 backdrop-blur-sm text-lg hover:border-neon-blue/50"
                      placeholder="Tell us more about your inquiry..."
                    />
                    <div className="flex justify-end mt-3">
                      <span className="text-slate-400 text-sm">
                        {formData.message.length}/500
                      </span>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 py-4 px-8 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 border border-slate-600 hover:border-neon-blue/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="send" size={24} />
                        <span>{t("contact.form.send")}</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
            {/* Enhanced Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* Contact Info Card */}
              <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-2xl mb-4 border border-slate-600/50"
                  >
                    <Icon name="mail" size={32} className="text-neon-blue" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Get in touch
                  </h2>
                  <p className="text-slate-400">Multiple ways to reach us</p>
                </div>

                <div className="space-y-8">
                  <motion.div
                    className="flex items-start space-x-6 group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2, delay: 0.7 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center group-hover:bg-slate-600/50 transition-all duration-300 group-hover:scale-110 border border-slate-600/50">
                      <Icon name="mail" size={28} className="text-neon-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-xl mb-2">
                        Email
                      </h3>
                      <p className="text-slate-300 hover:text-neon-blue transition-colors duration-300 text-lg mb-1">
                        contact@nasa-explorer.com
                      </p>
                      <p className="text-slate-300 hover:text-neon-blue transition-colors duration-300 text-lg">
                        support@nasa-explorer.com
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-6 group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2, delay: 0.8 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center group-hover:bg-slate-600/50 transition-all duration-300 group-hover:scale-110 border border-slate-600/50">
                      <Icon
                        name="phone"
                        size={28}
                        className="text-neon-purple"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-xl mb-2">
                        Phone
                      </h3>
                      <p className="text-slate-300 hover:text-neon-purple transition-colors duration-300 text-lg mb-2">
                        +1 (555) 123-4567
                      </p>
                      <div className="flex items-center space-x-3">
                        <Icon
                          name="clock"
                          size={20}
                          className="text-slate-400"
                        />
                        <p className="text-slate-300 text-lg">
                          Mon-Fri 9AM-6PM EST
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-6 group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2, delay: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center group-hover:bg-slate-600/50 transition-all duration-300 group-hover:scale-110 border border-slate-600/50">
                      <Icon
                        name="mapPin"
                        size={28}
                        className="text-neon-green"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-xl mb-2">
                        Address
                      </h3>
                      <p className="text-slate-300 text-lg mb-1">
                        NASA Explorer Headquarters
                      </p>
                      <p className="text-slate-300 text-lg mb-1">
                        123 Space Avenue
                      </p>
                      <p className="text-slate-300 text-lg">
                        Houston, TX 77058
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Social Media */}
              <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-2xl mb-4 border border-slate-600/50"
                  >
                    <Icon name="globe" size={32} className="text-neon-blue" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Follow us
                  </h2>
                  <p className="text-slate-400">
                    Stay connected with our latest updates
                  </p>
                </div>

                <div className="flex justify-center space-x-6">
                  <motion.a
                    href="#"
                    className="w-16 h-16 bg-slate-700/50 hover:bg-slate-600/50 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-slate-600/50 hover:border-neon-blue/50"
                    aria-label="Twitter"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <svg
                      className="w-8 h-8 text-slate-300 hover:text-neon-blue transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-16 h-16 bg-slate-700/50 hover:bg-slate-600/50 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-slate-600/50 hover:border-neon-blue/50"
                    aria-label="LinkedIn"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <svg
                      className="w-8 h-8 text-slate-300 hover:text-neon-blue transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-16 h-16 bg-slate-700/50 hover:bg-slate-600/50 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-slate-600/50 hover:border-neon-blue/50"
                    aria-label="GitHub"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <svg
                      className="w-8 h-8 text-slate-300 hover:text-neon-blue transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
            {/* Enhanced FAQ Section */}
            <motion.div
              className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl md:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-2xl mb-4 border border-slate-600/50"
                >
                  <Icon name="info" size={32} className="text-neon-blue" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-400">
                  Quick answers to common questions
                </p>
              </div>

              <div className="space-y-6">
                <motion.div
                  className="border border-slate-600/50 rounded-2xl p-6 hover:border-neon-blue/50 transition-all duration-300 bg-slate-700/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2, delay: 1.5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-white font-bold text-xl mb-3 flex items-center space-x-3">
                    <Icon name="search" size={24} className="text-neon-blue" />
                    <span>How can I get access to NASA data?</span>
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    NASA provides free access to most of its data through
                    various APIs and data portals. Check our API documentation
                    for integration details and start exploring the cosmos
                    today!
                  </p>
                </motion.div>

                <motion.div
                  className="border border-slate-600/50 rounded-2xl p-6 hover:border-neon-blue/50 transition-all duration-300 bg-slate-700/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2, delay: 1.6 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-white font-bold text-xl mb-3 flex items-center space-x-3">
                    <Icon name="star" size={24} className="text-neon-purple" />
                    <span>Is this service free to use?</span>
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Yes! NASA Explorer is completely free to use. We're
                    committed to making space data accessible to everyone and
                    inspiring the next generation of space explorers.
                  </p>
                </motion.div>

                <motion.div
                  className="border border-slate-600/50 rounded-2xl p-6 hover:border-neon-blue/50 transition-all duration-300 bg-slate-700/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2, delay: 1.7 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-white font-bold text-xl mb-3 flex items-center space-x-3">
                    <Icon name="clock" size={24} className="text-neon-green" />
                    <span>How often is the data updated?</span>
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Data is updated in real-time for live missions and daily for
                    historical data. Check individual mission pages for specific
                    update schedules and never miss a cosmic event!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default Contact;
