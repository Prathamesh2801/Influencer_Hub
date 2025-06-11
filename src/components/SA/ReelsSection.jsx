import { useEffect, useState } from "react";
import { fetchAllReels } from "../../api/SuperAdmin/FetchAllReels";
import { PlayIcon } from "@heroicons/react/24/solid";

// Video Card Component
function VideoCard({ video, onClick }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  let videoStatusBadgeColor;
  let videoStatusText;
  switch (video.Status) {
    case 0:
      videoStatusBadgeColor = "bg-yellow-100 text-yellow-800";
      videoStatusText = "Pending";
      break;
    case 1:
      videoStatusBadgeColor = "bg-blue-100 text-blue-800";
      videoStatusText = "Review";
      break;
    case 2:
      videoStatusBadgeColor = "bg-green-100 text-green-800";
      videoStatusText = "Approved";
      break;
    case 3:
      videoStatusBadgeColor = "bg-red-100 text-red-800";
      videoStatusText = "Rejected";
      break;
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
      onClick={() => onClick(video)}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gray-900">
        <video className="w-full h-full object-cover" preload="metadata" muted>
          <source src={video.Video_Path} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
            <PlayIcon className="w-6 h-6 text-gray-800" />
          </div>
        </div>
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${videoStatusBadgeColor}`}
          >
            {videoStatusText}
          </span>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {video.Username.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate mb-1">
              Video by {video.Username}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              ID: {video.Video_ID.split(".")[0]}...
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created: {formatDate(video.Created_AT)}</span>
              <span>Updated: {formatDate(video.Update_AT)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Video Detail Modal Component
function VideoDetailModal({ video, isOpen, onClose }) {
  if (!isOpen || !video) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  let videoStatusBadgeColor;
  let videoStatusText;
  switch (video.Status) {
    case 0:
      videoStatusBadgeColor = "bg-yellow-100 text-yellow-800";
      videoStatusText = "Pending";
      break;
    case 1:
      videoStatusBadgeColor = "bg-blue-100 text-blue-800";
      videoStatusText = "Review";
      break;
    case 2:
      videoStatusBadgeColor = "bg-green-100 text-green-800";
      videoStatusText = "Approved";
      break;
    case 3:
      videoStatusBadgeColor = "bg-red-100 text-red-800";
      videoStatusText = "Rejected";
      break;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Video Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
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

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Player */}
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  className="w-full h-full object-contain"
                  controls
                  preload="metadata"
                >
                  <source src={video.Video_Path} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Video Information */}
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {video.Username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {video.Username}
                  </h3>
                  <p className="text-gray-600">Content Creator</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${videoStatusBadgeColor}`}
                >
                  {videoStatusText}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">
                      Video ID:
                    </span>
                    <span className="text-sm text-gray-900 font-mono">
                      {video.Video_ID}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700 block">
                      Video URL:
                    </span>
                    <a
                      href={video.Video_Path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                    >
                      {video.Video_Path}
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        Created:
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDate(video.Created_AT)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        Last Updated:
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDate(video.Update_AT)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {video.Allowed === 0 && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Approve Video
                  </button>
                )}
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Download
                </button>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main ReelsSection Component
export default function ReelsSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function getAllReels() {
      try {
        setLoading(true);
        const response = await fetchAllReels();

        if (response.data && response.data.Status) {
          setVideos(response.data.Data || []);
        } else {
          setError("Failed to fetch videos");
        }
      } catch (err) {
        setError("Error loading videos: " + err.message);
        console.error("Error fetching reels:", err);
      } finally {
        setLoading(false);
      }
    }

    getAllReels();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Video Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and review submitted videos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {videos.length} video{videos.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {videos.length === 0 ? (
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
              There are no videos to display at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.Video_ID}
                video={video}
                onClick={handleVideoClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video Detail Modal */}
      <VideoDetailModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
