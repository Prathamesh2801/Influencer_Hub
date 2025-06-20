"use client"

import { useEffect, useState } from "react"
import { getAllScores } from "../../api/ScoreBoard/ScoreBoardAPI"
import toast from "react-hot-toast"
import { AcademicCapIcon, TrophyIcon } from "@heroicons/react/24/outline"

export default function LeaderBoardBarChartRace() {
  const [scores, setScores] = useState([])
  const [animatedScores, setAnimatedScores] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await getAllScores()
        if (response.data?.Status) {
          const sortedScores = response.data.Data.sort((a, b) => b.total_score - a.total_score)
          setScores(sortedScores)

          // Initialize animated scores with 0 values for animation
          setAnimatedScores(sortedScores.map((score) => ({ ...score, animatedScore: 0 })))

          // Start animation after a brief delay
          setTimeout(() => {
            setIsAnimating(true)
            setAnimatedScores(sortedScores.map((score) => ({ ...score, animatedScore: score.total_score })))
          }, 300)
        } else {
          console.error("Failed to fetch scores:", response.data?.Message)
        }
      } catch (error) {
        toast.error(error.response?.data?.Message || "Failed to Fetch Scores")
        console.error("API error:", error)
      }
    }

    fetchScores()
  }, [])

  const maxScore = Math.max(...scores.map((s) => s.total_score), 1)

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-yellow-600"
      case 2:
        return "from-gray-300 to-gray-500"
      case 3:
        return "from-amber-600 to-amber-800"
      default:
        return "from-[#E4007C] to-[#FF2D99]"
    }
  }

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <TrophyIcon className="w-5 h-5 text-white" />
    }
    return <span className="text-white font-bold text-sm">#{rank}</span>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold tracking-wide text-[#E4007C] flex items-center gap-3">
            <TrophyIcon className="w-8 h-8" />
            LeaderBoard
          </h1>
          <p className="mt-2 text-md text-[#FF2D99]">
            Live leaderboard showing top performers with animated score visualization
          </p>
        </div>
      </div>

      {scores.length === 0 ? (
        <div className="text-center py-12">
          <AcademicCapIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Scores yet</h3>
          <p className="text-gray-500">No Scores available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {animatedScores.map((user, index) => (
            <div
              key={user.username}
              // className="relative bg-white rounded-xl border-2 border-[#FFC3E2] p-4 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isAnimating ? "slideInUp 0.6s ease-out forwards" : "none",
              }}
            >
              {/* Rank Badge */}
              {/* <div
                className={`absolute -top-2 -left-2 w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(user.rank)} flex items-center justify-center shadow-lg z-10`}
              >
                {getRankIcon(user.rank)}
              </div> */}

              {/* User Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 ml-6 sm:ml-8">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{user.username}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#FF2D99] rounded-full"></span>
                      Videos: {user.total_videos}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#E4007C] rounded-full"></span>
                      Rank: #{user.rank}
                    </span>
                  </div>
                </div>

                {/* Score Display */}
                <div className="text-right mt-2 sm:mt-0">
                  <div className="text-2xl font-bold text-[#E4007C]">{Math.round(user.animatedScore || 0)}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E4007C] to-[#FF2D99] rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                    style={{
                      width: `${((user.animatedScore || 0) / maxScore) * 100}%`,
                      minWidth: user.animatedScore > 0 ? "60px" : "0px",
                    }}
                  >
                    {/* {user.animatedScore > 0 && (
                      <span className="text-white text-xs font-semibold">
                        {Math.round(((user.animatedScore || 0) / maxScore) * 100)}%
                      </span>
                    )} */}
                  </div>
                </div>
              </div>

              {/* Mobile-friendly additional info */}
              <div className="mt-3 flex justify-between items-center text-xs text-gray-500 sm:hidden">
                <span>Position: #{user.rank}</span>
                <span>{user.total_videos} videos</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
