import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import Icon from "../components/UI/Icon";

const Team = () => {
  const { t } = useI18n();

  const teamMembers = [
    {
      name: "Youssef Ayman",
      role: "Team Leader",
      bio: "Youssef Ayman is a Full Stack Developer with a passion for building scalable and efficient systems. He is responsible for the leading the team and the overall project.",
      image: "/assets/team/youssef-ayman.jpg",
    },
    {
      name: "Mahmoud Ahmed",
      role: "Backend Developer",
      bio: "Mahmoud Ahmed is a Full Stack Developer with a passion for building scalable and efficient systems. He is responsible for the backend of the application.",
      image: "/assets/team/mahmoud-ahmed.jpg",
    },
    {
      name: "Moahmed Saeed",
      role: "Researcher",
      bio: "Moahmed Saeed is a Researcher with a passion for building scalable and efficient systems. He is responsible for the research of the application.",
      image: "/assets/team/mohamed-saeed.jpg",
    },
    {
      name: "Malak Nour",
      role: "Designer",
      bio: "Malak Nour is a Designer with a passion for building scalable and efficient systems. She is responsible for the design of the presentation and other designs.",
      image: "/assets/team/malak-nour.jpg",
    },
    {
      name: "Demiana Shenouda",
      role: "Presenter",
      bio: "Demiana Shenouda is a Presenter with a passion for building scalable and efficient systems. She is responsible for the presentation of the application.",
      image: "/assets/team/demiana-shenouda.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient font-space mb-4">
              {t("team.title")}
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              {t("team.subtitle")}
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-holographic text-center group"
              >
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="astronaut" size={32} className="text-white" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Member Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-neon-blue font-medium">{member.role}</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  {/* <div className="flex justify-center space-x-4 pt-4">
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-neon-blue transition-colors duration-300"
                        aria-label="Twitter"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-neon-blue transition-colors duration-300"
                        aria-label="LinkedIn"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {member.social.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className="text-slate-400 hover:text-neon-blue transition-colors duration-300"
                        aria-label="Email"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </a>
                    )}
                  </div> */}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Join Our Team CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="card-holographic max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">
                Join Our Mission
              </h2>
              <p className="text-slate-300 mb-6">
                We're always looking for passionate individuals to join our team
                and help us explore the universe.
              </p>
              <a
                href="mailto:careers@nasa-explorer.com"
                className="btn-primary"
              >
                View Open Positions
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
