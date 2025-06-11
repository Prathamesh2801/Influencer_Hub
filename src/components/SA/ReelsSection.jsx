import { useEffect, useState, useMemo } from "react";
import { fetchAllReels } from "../../api/SuperAdmin/FetchAllReels";
import { getComments, addComment } from "../../api/Reel Section/CommentAPI";
import { updateVideoScore } from "../../api/Reel Section/ScoreAPI";
import { EyeIcon, PlayIcon } from "@heroicons/react/24/solid";
import { CheckIcon, DownloadIcon, XIcon } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateVideoStatus } from "../../api/Reel Section/VideoStaus";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import RepostModal from "./RepostModal";

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
      videoStatusBadgeColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
      videoStatusText = "Pending";
      break;
    case 1:
      videoStatusBadgeColor = "bg-blue-100 text-blue-800 border-blue-300";
      videoStatusText = "Review";
      break;
    case 2:
      videoStatusBadgeColor = "bg-green-100 text-green-800 border-green-300";
      videoStatusText = "Approved";
      break;
    case 3:
      videoStatusBadgeColor = "bg-red-100 text-red-800 border-red-300";
      videoStatusText = "Rejected";
      break;
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      onClick={() => onClick(video)}
    >
      {/* Video Thumbnail Container */}
      <div className="relative aspect-video bg-gray-900 group">
        <video
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          poster={video.Video_Path + "?t=0.5"}
        >
          <source src={video.Video_Path} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <PlayIcon className="w-7 h-7 text-gray-800" />
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${videoStatusBadgeColor} shadow-sm`}
          >
            {videoStatusText}
          </span>
        </div>

        {/* Duration Badge (if needed) */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-md">
            Posted {formatDate(video.Created_AT)}
          </span>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-lg">
                {video.Username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-xs font-bold">
                {video.Coordinator_username?.charAt(0).toUpperCase() || "C"}
              </span>
            </div>
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              Video by {video.Username}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Coordinator: {video.Coordinator_username}
            </p>
            <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
              <span className="flex items-center">
                ID: {video.Video_ID.split(".")[0].slice(-8)}
              </span>
              <span>•</span>
              <span>Updated: {formatDate(video.Update_AT)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Video Detail Modal Component
function VideoDetailModal({ video, isOpen, onClose, onStatusUpdate }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState("");
  const [submittingScore, setSubmittingScore] = useState(false);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const userRole = localStorage.getItem("Role");
  const canComment = ["Admin", "Client", "Creator"].includes(userRole);

  // Fetch comments when modal opens
  useEffect(() => {
    if (video && isOpen) {
      fetchComments();
    }
  }, [video, isOpen]);

  const fetchComments = async () => {
    try {
      const response = await getComments(video.Video_ID);
      if (response.data?.Status) {
        setComments(
          response.data.Data.map((comment) => ({
            id: comment.SR_NO,
            text: comment.Message,
            user: comment.Created_BY,
            role:
              comment.Created_BY === video.Username
                ? "Creator"
                : comment.Created_BY === video.Coordinator_username
                ? "Coordinator"
                : "Admin",
            timestamp: comment.Created_AT,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await addComment(video.Video_ID, comment.trim());

      if (response.data?.Status) {
        // Add the new comment to the list
        const newComment = {
          id: Date.now(),
          text: comment,
          user: localStorage.getItem("username") || "User",
          role: userRole,
          timestamp: new Date().toISOString(),
        };

        setComments([newComment, ...comments]);
        setComment("");

        toast.success("Comment added successfully");
        // Refresh comments to get the latest
        fetchComments();
      } else {
        toast.error(response.data?.Message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (loading) return;

    const statusMessages = {
      0: "Video marked as pending",
      1: "Video moved to review",
      2: "Video approved successfully",
      3: "Video rejected",
    };

    try {
      setLoading(true);
      const response = await UpdateVideoStatus(video.Video_ID, newStatus);

      if (response?.data?.Status) {
        // Show success toast
        toast.success(
          statusMessages[newStatus] || "Status updated successfully",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Update parent component
        if (typeof onStatusUpdate === "function") {
          onStatusUpdate(video.Video_ID, newStatus);
        }

        // Close modal
        onClose();
      } else {
        // Show error toast
        toast.error(
          response?.data?.Message || "Failed to update video status",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Show error toast
      toast.error(
        error.response?.data?.Message || "Failed to connect to server",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScoreSubmit = async () => {
    if (!score || submittingScore) return;

    try {
      setSubmittingScore(true);
      const response = await updateVideoScore(video.Video_ID, score);

      if (response?.data?.Status) {
        toast.success("Score updated successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Update the local video object with new score
        video.Score = score;

        // Update parent component if callback exists
        if (typeof onStatusUpdate === "function") {
          onStatusUpdate(video.Video_ID, video.Status, score);
        }
        setScore("");
      } else {
        toast.error(response?.data?.Message || "Failed to update score", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error("Failed to update score", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSubmittingScore(false);
    }
  };

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

  // Define status colors and text before rendering
  let videoStatusBadgeColor;
  let videoStatusText;
  if (video) {
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
      default:
        videoStatusBadgeColor = "bg-gray-100 text-gray-800";
        videoStatusText = "Unknown";
    }
  }

  const handleRepostSuccess = (repostedData) => {
    setIsRepostModalOpen(false);
    // toast.success("Video reposted successfully");

    // Update the video list with new data
    if (typeof onStatusUpdate === "function") {
      onStatusUpdate(video.Video_ID, 0); // Reset status to pending
    }
    onClose();
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {video.Username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Video Details</h2>
              <p className="text-sm text-gray-500">
                Uploaded by {video.Username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-500"
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
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Column - Video and Comments */}
            <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <video
                  className="w-full h-full object-contain"
                  controls
                  preload="metadata"
                >
                  <source src={video.Video_Path} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Comments & Feedback
                  </h3>
                </div>

                <div className="p-4">
                  {/* Comment Input */}
                  {canComment ? (
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                      <div className="flex flex-col space-y-3">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add your feedback..."
                          className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          disabled={!canComment}
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={!comment.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                          >
                            <span>Add Comment</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg text-gray-600 text-sm">
                      You can view but cannot add comments as a coordinator.
                    </div>
                  )}{" "}
                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {comment.user.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {comment.user}
                                {/* <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                                  {comment.role}
                                </span> */}
                              </p>
                              <p className="mt-1 text-sm text-gray-700">
                                {comment.text}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                              {formatDate(comment.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {comments.length === 0 && (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
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
                        </div>
                        <p className="text-gray-500 text-sm">No comments yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="overflow-y-auto border-l p-6 space-y-6 custom-scrollbar">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Current Status
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${videoStatusBadgeColor}`}
                  >
                    {videoStatusText}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {video.Coordinator_username?.charAt(0).toUpperCase() ||
                          "C"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Assigned Coordinator
                      </p>
                      <p className="font-medium text-gray-900">
                        {video.Coordinator_username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Video Details Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Video Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Video ID
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-800">
                        {video.Video_ID}
                      </code>
                    </div>
                  </div>

                  <div className="">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Source URL
                    </label>
                    <a
                      href={video.Video_Path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 "
                    >
                      <span className="break-words">{video.Video_Path}</span>
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Created
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatDate(video.Created_AT)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Last Updated
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatDate(video.Update_AT)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Admin Score Input */}
              {userRole === "Admin" && video.Status !== 2 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Admin Actions
                    </h3>
                    <h3 className="text-sm bg-green-200 text-gray-800 px-3 py-1 rounded-full border border-gray-300">
                      {video.Score
                        ? `Score :  ${video.Score}`
                        : "No score assigned yet"}
                    </h3>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className=" flex-1 ">
                      <div className="flex flex-1 space-x-4">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Score (0-100)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter score..."
                            value={score}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 0 && value <= 100) {
                                setScore(value);
                              } else if (e.target.value === "") {
                                setScore("");
                              }
                            }}
                          />
                        </div>{" "}
                        <button
                          onClick={handleScoreSubmit}
                          disabled={!score || submittingScore}
                          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                        >
                          {submittingScore ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <span>Updating...</span>
                            </>
                          ) : (
                            <span>Submit Score</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {userRole === "Admin" && (
                  <>
                    <button
                      className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
                      onClick={() => handleStatusUpdate(1)}
                      disabled={loading}
                    >
                      <EyeIcon className="h-5 w-5" />
                      <span>Review</span>
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      onClick={() => handleStatusUpdate(3)}
                      disabled={loading}
                    >
                      <XIcon className="h-5 w-5" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {userRole === "Client" && (
                  <>
                    <button
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      onClick={() => handleStatusUpdate(2)}
                      disabled={loading}
                    >
                      <CheckIcon className="h-5 w-5" />
                      <span>Approve</span>
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      onClick={() => handleStatusUpdate(3)}
                      disabled={loading}
                    >
                      <XIcon className="h-5 w-5" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                {userRole === "Creator" && (
                  <button
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    disabled={loading}
                    onClick={() => setIsRepostModalOpen(true)}
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    <span>Repost the video</span>
                  </button>
                )}

                {/* Download button visible to all roles */}
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  onClick={() => window.open(video.Video_Path, "_blank")}
                  disabled={loading}
                >
                  <DownloadIcon className="h-5 w-5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RepostModal
        video={video}
        isOpen={isRepostModalOpen}
        onClose={() => setIsRepostModalOpen(false)}
        onSuccess={handleRepostSuccess}
      />
    </div>
  );
}

// Filter Section Component
function FilterSection({
  filters,
  setFilters,
  coordinators,
  totalVideos,
  filteredCount,
  role,
  onUploadClick
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
          {/* Search Input */}
          {role !== "Creator" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Creator
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by username..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
              />
            </div>
          )}
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              {role !== "Client" && <option value="0">Pending</option>}
              <option value="1">Review</option>
              <option value="2">Approved</option>
              <option value="3">Rejected</option>
            </select>
          </div>

          {/* Coordinator Filter */}
          {role !== "Creator" && role !== "Co-ordinator" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coordinator
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.coordinator}
                onChange={(e) =>
                  setFilters({ ...filters, coordinator: e.target.value })
                }
              >
                {coordinators.map((coord) => (
                  <option key={coord} value={coord}>
                    {coord === "all" ? "All Coordinators" : coord}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.dateRange.start}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.dateRange.end}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value },
                })
              }
            />
          </div>
        </div>

        {/* Upload Button for Creator */}
        {role === "Creator" && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onUploadClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              <span>Upload Video</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {filteredCount} out of {totalVideos} videos
          {filters.searchQuery && ` matching "${filters.searchQuery}"`}
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

  // New states for filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(12);
  const [filters, setFilters] = useState({
    status: "all",
    coordinator: "all",
    searchQuery: "",
    dateRange: {
      start: "",
      end: "",
    },
  });

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateRangeChange = (startOrEnd, value) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [startOrEnd]: value,
      },
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
                {filteredVideos.length} video
                {filteredVideos.length !== 1 ? "s" : ""} found
              </span>
            </div>
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
          role={localStorage.getItem("Role")}
          onUploadClick={() => console.log("Upload button clicked")}
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
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstVideo + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastVideo, filteredVideos.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredVideos.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">First</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Last</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>{" "}
      {/* Video Detail Modal */}
      <VideoDetailModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleVideoUpdate}
      />
    </div>
  );
}
