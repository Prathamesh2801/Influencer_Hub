import { useEffect, useState, useMemo } from "react";
import { fetchAllReels } from "../../api/SuperAdmin/FetchAllReels";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RepostModal from "./RepostModal";
import { useSearchParams } from "react-router-dom";
import VideoCard from "./VideoCard";
import VideoDetailModal from "./VideoDetailModal";
import FilterSection from "./FilterSection";

// Main ReelsSection Component
export default function ReelsSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const userRole = localStorage.getItem("Role");

  // New states for filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(9);
  const [filters, setFilters] = useState({
    status: "all",
    coordinator: "all",
    searchQuery: "",
    taskId: "",
    VideoId: "",
    dateRange: {
      start: "",
      end: "",
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();

  // 1️⃣ On mount: pull video_id into filters, then remove it from the URL
  useEffect(() => {
    const vid = searchParams.get("video_id");
    if (vid) {
      setFilters((f) => ({ ...f, VideoId: vid }));

      // remove from URL immediately
      const next = new URLSearchParams(searchParams);
      next.delete("video_id");
      setSearchParams(next, { replace: true });
    }
  }, []); // run once on mount

  // 2️⃣ Whenever filters.VideoId is cleared, make sure URL stays clean
  useEffect(() => {
    if (!filters.VideoId) {
      const next = new URLSearchParams(searchParams);
      if (next.has("video_id")) {
        next.delete("video_id");
        setSearchParams(next, { replace: true });
      }
    }
  }, [filters.VideoId]);

  // Computed values
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      if (filters.status !== "all" && video.Status !== parseInt(filters.status))
        return false;
      if (
        filters.coordinator !== "all" &&
        video.Coordinator_username !== filters.coordinator
      )
        return false;
      if (
        filters.taskId &&
        !video.Task_ID.toLowerCase().includes(filters.taskId.toLowerCase())
      )
        return false;
      if (
        filters.VideoId &&
        !video.Video_ID.toLowerCase().includes(filters.VideoId.toLowerCase())
      )
        return false;
      if (
        filters.searchQuery &&
        !video.Username.toLowerCase().includes(
          filters.searchQuery.toLowerCase()
        )
      )
        return false;
      if (
        filters.dateRange.start &&
        new Date(video.Created_AT) < new Date(filters.dateRange.start)
      )
        return false;
      if (
        filters.dateRange.end &&
        new Date(video.Created_AT) > new Date(filters.dateRange.end)
      )
        return false;
      return true;
    });
  }, [videos, filters]);

  // Get unique coordinators for filter options
  const coordinators = useMemo(() => {
    const unique = [
      ...new Set(videos.map((video) => video.Coordinator_username)),
    ];
    return ["all", ...unique];
  }, [videos]);

  // Pagination logic
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  async function getAllReels() {
    try {
      setLoading(true);
      const response = await fetchAllReels(localStorage.getItem("fcmToken"));

      if (response.data && response.data.Status) {
        setVideos(response.data.Data || []);
      } else {
        setError("Failed to fetch videos");
      }
    } catch (err) {
      setError("Error loading videos: " + err.message);
      toast.error(err.response?.data?.Message || "Error Fetch Reels");

      console.error("Error fetching reels:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllReels();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    getAllReels(); // Refresh the video list
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    getAllReels(); // Refresh the video list
  };

  const handleVideoUpdate = (videoId, newStatus, newScore = null) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) => {
        if (video.Video_ID === videoId) {
          return {
            ...video,
            Status: newStatus !== undefined ? newStatus : video.Status,
            Score: newScore !== null ? newScore : video.Score,
          };
        }
        return video;
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#E4007C]">
                Video Management
              </h1>
              <p className="text-[#F06292] mt-1">
                Manage and review submitted videos
              </p>
            </div>
            {/* <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {filteredVideos.length} video
                {filteredVideos.length !== 1 ? "s" : ""} found
              </span>
            </div> */}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          coordinators={coordinators}
          totalVideos={videos.length}
          filteredCount={filteredVideos.length}
          role={userRole}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />

        {/* Video Grid */}
        {currentVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-500">
              {videos.length === 0
                ? "There are no videos to display at this time."
                : "No videos match your current filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
              {currentVideos.map((video) => (
                <VideoCard
                  key={video.Video_ID}
                  video={video}
                  onClick={handleVideoClick}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border bg-[#FFF1F7] border-[#FACCE0] text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border bg-[#FFF1F7] border-[#FACCE0] text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[#FF2D99]">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstVideo + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastVideo, filteredVideos.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredVideos.length}</span>{" "}
                    videos
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <nav
                    className="inline-flex items-center rounded-md border border-[#FACCE0] bg-[#FFF1F7] shadow-sm"
                    aria-label="Pagination"
                  >
                    {/* First */}
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border-r border-[#FACCE0] text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
                    >
                      <span className="sr-only">First</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" />
                      </svg>
                    </button>

                    {/* Pages */}
                    {(() => {
                      const pages = [];
                      const startPage = Math.max(2, currentPage - 1);
                      const endPage = Math.min(totalPages - 1, currentPage + 1);

                      // Page 1
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className={`px-4 py-2 text-sm border-r border-[#FACCE0] font-medium ${
                            currentPage === 1
                              ? "bg-[#FF2D99] text-white"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          1
                        </button>
                      );

                      // Start ellipsis
                      if (startPage > 2) {
                        pages.push(
                          <span
                            key="start-ellipsis"
                            className="px-3 py-2 text-sm text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }

                      // Middle pages
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`px-4 py-2 text-sm border-r border-[#FACCE0] font-medium ${
                              currentPage === i
                                ? "bg-[#FF2D99] text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      // End ellipsis
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span
                            key="end-ellipsis"
                            className="px-3 py-2 text-sm text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }

                      // Last page
                      if (totalPages > 1) {
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className={`px-4 py-2 text-sm font-medium ${
                              currentPage === totalPages
                                ? "bg-[#FF2D99] text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}

                    {/* Last */}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border-l border-[#FACCE0] text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
                    >
                      <span className="sr-only">Last</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Video Detail Modal */}
      <VideoDetailModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleVideoUpdate}
      />
      <RepostModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
