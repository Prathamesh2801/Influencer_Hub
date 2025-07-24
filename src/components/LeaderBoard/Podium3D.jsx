import React from "react";
import { motion } from "framer-motion";
import { Crown, Medal, Award, Users, Zap, Star } from "lucide-react";

export const Podium3D = ({ topThree }) => {
  const podiumVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  const avatarVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.3 + 0.5,
        duration: 0.6,
        type: "spring",
        stiffness: 120,
      },
    }),
  };

  const crownVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 1.5,
        duration: 0.8,
        type: "spring",
        stiffness: 150,
      },
    },
  };

  const getPodiumHeight = (rank) => {
    switch (rank) {
      case 1:
        return "h-24 sm:h-32";
      case 2:
        return "h-20 sm:h-28";
      case 3:
        return "h-16 sm:h-24";
      default:
        return "h-12 sm:h-16";
    }
  };

  const getPodiumColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 via-yellow-500 to-yellow-600";
      case 2:
        return "from-gray-300 via-gray-400 to-gray-500";
      case 3:
        return "from-orange-400 via-orange-500 to-orange-600";
      default:
        return "from-pink-400 via-pink-500 to-pink-600";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-700" />;
      case 2:
        return <Medal className="w-4 h-4 sm:w-7 sm:h-7 text-gray-500" />;
      case 3:
        return <Award className="w-4 h-4 sm:w-6 sm:h-6 text-orange-800" />;
      default:
        return null;
    }
  };

  // Arrange podium order: 2nd, 1st, 3rd for visual appeal
  const podiumOrder = [
    topThree.find((creator) => creator.rank === 2),
    topThree.find((creator) => creator.rank === 1),
    topThree.find((creator) => creator.rank === 3),
  ].filter(Boolean);

  return (
    <div className="relative w-full max-w-5xl  mx-auto mb-4 sm:mb-8 px-4">
      <div className="relative rounded-3xl p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r bungee-regular from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            🏆 Top Performers
          </h2>
          <p className="text-md sm:text-xl text-orange-500">
            This month's leaderboard champions
          </p>
        </motion.div>

        <div className="flex items-end justify-center gap-2 sm:gap-8 perspective-1000 mt-8 sm:mt-20">
          {podiumOrder.map((creator, index) => {
            const actualRank = creator.rank;
            const displayIndex =
              actualRank === 1 ? 1 : actualRank === 2 ? 0 : 2;

            return (
              <motion.div
                key={creator.rank}
                className="relative flex flex-col items-center"
                custom={displayIndex}
                initial="hidden"
                animate="visible"
                variants={podiumVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Crown for 1st place */}
                {actualRank === 1 && (
                  <motion.div
                    className="absolute -top-8 sm:-top-16 z-20"
                    initial="hidden"
                    animate="visible"
                    variants={crownVariants}
                  >
                    <div className="relative">
                      <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500 drop-shadow-lg" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 absolute -top-1 left-1" />
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 absolute -top-1 right-1" />
                        <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-yellow-300 absolute top-1 left-1/2 transform -translate-x-1/2" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Avatar */}
                <motion.div
                  className="relative mb-2 sm:mb-4 z-10"
                  custom={displayIndex}
                  initial="hidden"
                  animate="visible"
                  variants={avatarVariants}
                >
                  <div
                    className={`relative w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 sm:border-4 ${
                      actualRank === 1
                        ? "border-yellow-400 shadow-lg shadow-yellow-400/50"
                        : actualRank === 2
                        ? "border-gray-400 shadow-lg shadow-gray-400/50"
                        : "border-orange-400 shadow-lg shadow-orange-400/50"
                    }`}
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Rank badge */}
                  <motion.div
                    className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg ${
                      actualRank === 1
                        ? "bg-yellow-500"
                        : actualRank === 2
                        ? "bg-gray-500"
                        : "bg-orange-500"
                    }`}
                    whileHover={{ scale: 1.2 }}
                  >
                    {actualRank}
                  </motion.div>
                </motion.div>

                {/* Creator info */}
                <div className="text-center mb-2 sm:mb-4 z-10">
                  <h3 className="font-bold text-xs sm:text-lg text-gray-800 mb-1 truncate max-w-16 sm:max-w-32">
                    {creator.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">
                      {creator.total_videos} videos
                    </span>
                    <span className="sm:hidden">{creator.total_videos}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                    <span className="font-bold text-sm sm:text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {creator.score.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 3D Podium */}
                <motion.div
                  className={`relative ${getPodiumHeight(
                    actualRank
                  )} w-20 sm:w-32 rounded-t-lg overflow-hidden shadow-2xl`}
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    backgroundImage: `linear-gradient(135deg, ${
                      actualRank === 1
                        ? "#fbbf24, #f59e0b, #d97706"
                        : actualRank === 2
                        ? "#d1d5db, #9ca3af, #6b7280"
                        : "#fb923c, #f97316, #ea580c"
                    })`,
                  }}
                  whileHover={{
                    rotateX: -8,
                    rotateY: actualRank === 1 ? 8 : actualRank === 2 ? -8 : 8,
                    scale: 1.05,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Podium shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>

                  {/* Podium sides for 3D effect */}
                  <div className="absolute right-0 top-0 w-2 sm:w-3 h-full bg-black/20 transform skew-y-12 origin-top"></div>
                  <div className="absolute bottom-0 left-0 right-2 sm:right-3 h-2 sm:h-3 bg-black/30 transform skew-x-12 origin-left"></div>

                  {/* Rank icon */}
                  <div className="absolute top-2 sm:top-3 left-1/2 transform -translate-x-1/2">
                    {getRankIcon(actualRank)}
                  </div>

                  {/* Podium number */}
                  <div className="absolute bottom-2 sm:bottom-5 left-1/2 transform -translate-x-1/2">
                    <span className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">
                      {actualRank}
                    </span>
                  </div>

                  {/* Decorative sparkles */}
                  <div className="absolute inset-0 opacity-40">
                    <motion.div
                      className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                  </div>
                </motion.div>

                {/* Podium base shadow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-36 h-2 bg-black/20 rounded-full blur-sm"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Floating celebration particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
