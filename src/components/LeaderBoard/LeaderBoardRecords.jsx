"use client";

import { useState, useMemo, useEffect } from "react";
import { getAllScores } from "../../api/ScoreBoard/ScoreBoardAPI";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DownloadIcon } from "lucide-react";

// Simple UI components for Vite/React
const Button = ({
  children,
  variant = "default",
  size = "default",
  onClick,
  disabled,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500",
    outline:
      "border border-pink-300 text-pink-600 hover:bg-pink-50 focus:ring-pink-500",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
};

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

// Icons as simple SVG components
const SearchIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ChevronLeftIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
  </div>
);

const TrophyIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);

export default function LeaderBoardRecords() {
  const [activeFilter, setActiveFilter] = useState("All List");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const userRole = localStorage.getItem("Role");
  const username = localStorage.getItem("Username");
  const [userRank, setUserRank] = useState(null);

  // Download entire leaderboard as Excel
  const handleDownloadExcel = () => {
    const data = creators.map(({ rank, name, score }) => ({
      Rank: rank,
      Creator: name,
      Score: score,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leaderboard");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "leaderboard.xlsx");
  };
  // Filter configuration
  const filters = [
    { label: "All List", value: null },
    { label: "Core 50", value: "Premium" },
    { label: "Core 250", value: "Core" },
  ];

  // Fetch data from API
  const fetchLeaderboardData = async (userType = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllScores(userType);

      if (response.data?.Status) {
        // Transform API data to include avatars
        const transformedData = response.data.Data.map((creator) => ({
          ...creator,
          id: creator.rank,
          name: creator.username,
          score: creator.total_score,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            creator.username
          )}&background=ec4899&color=fff&size=40`,
        }));
        setCreators(transformedData);
      } else {
        setError(response.data?.Message || "Failed to fetch leaderboard data");
        toast.error(
          response.data?.Message || "Failed to fetch leaderboard data"
        );
      }
    } catch (error) {
      console.error("API error:", error);
      setError(
        error.response?.data?.Message || "Failed to fetch leaderboard data"
      );
      toast.error(
        error.response?.data?.Message || "Failed to fetch leaderboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    if (creators.length > 0 && username) {
      const found = creators.find((creator) => creator.name === username);
      if (found) {
        setUserRank(found.rank);
      } else {
        setUserRank(null); // not found
      }
    }
  }, [creators, username]);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter.label);
    setCurrentPage(1);
    setSearchTerm("");
    fetchLeaderboardData(filter.value);
  };

  // Get top 10 creators for bar chart
  const top10Creators = creators.slice(0, 10);
  const maxScore = Math.max(...top10Creators.map((c) => c.score), 1);

  // Filter and paginate remaining creators (after top 10)
  const remainingCreators = creators.slice(10);

  const filteredCreators = useMemo(() => {
    return remainingCreators.filter((creator) =>
      creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [remainingCreators, searchTerm]);

  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCreators = filteredCreators.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Creator Leaderboard
            </h1>
            <p className="text-gray-600">
              Top performing creators and their scores
            </p>
          </div>
          <Card className="border-red-200 bg-red-50">
            <CardContent>
              <div className="text-center py-12">
                <div className="text-red-500 text-xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error Loading Leaderboard
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={() => fetchLeaderboardData()}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[#E80071]">
              Creator Leaderboard
            </h1>
            <p className="text-[#EF3F8F]">
              Top performing creators and their scores
            </p>
          </div>
          {userRole === "Admin" || userRole === "Client" ? (
            <Button
              variant="default"
              onClick={handleDownloadExcel}
              className="rounded-full flex items-center"
            >
              <DownloadIcon className="w-5 h-5 mr-2" /> Download Excel
            </Button>
          ) : (
            <>
              {userRank !== null ? (
                <p className="text-green-600 font-bold">
                  Your Rank: {userRank}
                </p>
              ) : (
                <p className="text-gray-500">You are not ranked yet.</p>
              )}
            </>
          )}
        </div>

        {/* Filter Buttons */}
        {(userRole === "Admin" || userRole === "Client") && (
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.label}
                variant={activeFilter === filter.label ? "default" : "outline"}
                onClick={() => handleFilterChange(filter)}
                className="rounded-full px-6 py-2"
                disabled={loading}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}

        {/* Top 10 Bar Chart */}
        {top10Creators.length > 0 && (
          <Card className="border-pink-200 shadow-lg">
            <CardContent>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Top {Math.min(10, creators.length)} Creators
              </h2>
              <div className="space-y-3">
                {top10Creators.map((creator) => (
                  <div key={creator.id} className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="w-8 text-sm font-medium text-gray-600 text-right">
                      #{creator.rank}
                    </div>

                    {/* Avatar */}
                    <img
                      src={creator.avatar || "/placeholder.svg"}
                      alt={creator.name}
                      className="w-8 h-8 rounded-full border-2 border-pink-200"
                    />

                    {/* Name */}
                    <div className="w-24 md:w-32 text-sm font-medium text-gray-700 truncate">
                      {creator.name}
                    </div>

                    {/* Bar */}
                    <div className="flex-1 relative">
                      <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E80071] to-[#EF3F8F]  rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                          style={{
                            width: `${(creator.score / maxScore) * 100}%`,
                            minWidth: "40px",
                          }}
                        >
                          <span className="text-white text-xs font-semibold">
                            {creator.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Videos count */}
                    <div className="hidden md:block text-xs text-gray-500 w-16 text-right">
                      {creator.total_videos} videos
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Bar - Only show if there are creators beyond top 10 */}
        {remainingCreators.length > 0 && (
          <div className="relative max-w-md mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 rounded-full border-pink-300 focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
        )}

        {/* Creators Table - Only show if there are creators beyond top 10 */}
        {remainingCreators.length > 0 && (
          <Card className="border-pink-200 shadow-lg ">
            <CardContent className="p-0 ">
              {/* Table Header */}
              <div className="bg-pink-100 px-6 py-4 border-b border-pink-200">
                <div className="grid grid-cols-4 gap-4 font-semibold text-pink-800">
                  <div>Rank</div>
                  <div>Creator</div>
                  <div className="text-center">Videos</div>
                  <div className="text-right">Score</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-pink-100 ">
                {paginatedCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="px-6 py-4 transition-colors even:bg-[#FFF1F7] hover:bg-gray-50 hover:backdrop-blur-md hover:shadow-md"
                  >
                    <div className="grid grid-cols-4 gap-4 items-center">
                      {/* Rank */}
                      <div className="font-medium text-gray-900">
                        #{creator.rank}
                      </div>

                      {/* Creator */}
                      <div className="flex items-center gap-3">
                        {/* <img
                          src={creator.avatar || "/placeholder.svg"}
                          alt={creator.name}
                          className="w-10 h-10 rounded-full border-2 border-pink-200"
                        /> */}
                        <span className="font-medium text-gray-900 truncate">
                          {creator.name}
                        </span>
                      </div>

                      {/* Videos */}
                      <div className="text-center text-gray-600">
                        {creator.total_videos}
                      </div>

                      {/* Score */}
                      <div className="text-right font-bold text-pink-600">
                        {creator.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {paginatedCreators.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No creators found matching your search.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pagination - Only show if needed */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              Next
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Stats */}
        {creators.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            {remainingCreators.length > 0 ? (
              <>
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredCreators.length)}{" "}
                of {filteredCreators.length} creators
                {searchTerm && ` matching "${searchTerm}"`}
                <br />
                Total creators: {creators.length}
              </>
            ) : (
              `Total creators: ${creators.length}`
            )}
          </div>
        )}

        {/* No Data State */}
        {creators.length === 0 && !loading && !error && (
          <Card className="border-gray-200">
            <CardContent>
              <div className="text-center py-12">
                <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Creators Found
                </h3>
                <p className="text-gray-500">
                  No creators available for the selected filter.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
