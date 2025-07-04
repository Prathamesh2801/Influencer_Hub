"use client";

import { useEffect, useState } from "react";
import { getComments, addComment } from "../../api/Reel Section/CommentAPI";
import { updateVideoScore } from "../../api/Reel Section/ScoreAPI";
import { ArrowTopRightOnSquareIcon, EyeIcon } from "@heroicons/react/24/solid";
import { CheckIcon, XIcon } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateVideoStatus } from "../../api/Reel Section/VideoStaus";
import { ArrowUpTrayIcon, PencilIcon } from "@heroicons/react/24/outline";

import EditUrlModal from "../ReelSection/EditUrlModal";
import { updateSocialMediaUrl } from "../../api/Reel Section/SocialVideoURL";
import RepostModal from "./RepostModal";
import AnalyticsModal from "./AnalyticsModal";
import { getInsightImages } from "../../api/InsightsAPI/getInsights";

export default function VideoDetailModal({
  video,
  isOpen,
  onClose,
  onStatusUpdate,
}) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState("");
  const [submittingScore, setSubmittingScore] = useState(false);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const userRole = localStorage.getItem("Role");
  const canComment = ["Admin", "Client"].includes(userRole);
  const [mobileView, setMobileView] = useState("comments"); // "comments" or "details"

  const [isEditUrlModalOpen, setIsEditUrlModalOpen] = useState(false);
  const [ratings, setRatings] = useState({
    punctuality: 0,
    creativity: 0,
    content: 0,
  });
  const [insightsAvailable, setInsightsAvailable] = useState(false);
  const [insightChecked, setInsightChecked] = useState(false);

  // Fetch comments when modal opens
  useEffect(() => {
    if (video && isOpen) {
      fetchComments();
      setRatings({
        creativity: video.Creativity ?? 0,
        punctuality: video.Punctuality ?? 0,
        content: video.Content ?? 0,
      });
    }
  }, [video, isOpen]);

  // To check if there are any insights
  useEffect(() => {
    const checkInsights = async () => {
      if (!video?.Video_ID) return;

      try {
        const response = await getInsightImages(video.Video_ID); // Call your API here
        console.log("From VideoDetailModal : ", response);
        if (response?.Data?.images.length > 0) {
          setInsightsAvailable(true);
        } else {
          setInsightsAvailable(false);
        }
      } catch (error) {
        console.error("Error checking insights:", error);
        setInsightsAvailable(false);
      } finally {
        setInsightChecked(true);
      }
    };

    if (video?.Video_ID) {
      checkInsights();
    }
  }, [video?.Video_ID]);

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
        // toast.error(response.data?.Message || "Failed to add comment");
        toast.error(
          response?.response?.data?.Message || "Failed to Add Comment"
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.response?.data?.Message || "Failed to Add Comment");
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
          response?.response?.data?.Message || "Failed to update video status",
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

  const handleRatingChange = (category, rating) => {
    setRatings((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };
  const handleScoreSubmit = async () => {
    if (submittingScore) return;

    try {
      setSubmittingScore(true);
      const response = await updateVideoScore(
        video.Video_ID,
        ratings.creativity,
        ratings.punctuality,
        ratings.content
      );

      if (response?.data?.Status) {
        toast.success("Score updated successfully");
        video.Creativity = ratings.creativity;
        video.Punctuality = ratings.punctuality;
        video.Content = ratings.content;
        setScore(ratings.creativity + ratings.punctuality + ratings.content);

        if (typeof onStatusUpdate === "function") {
          onStatusUpdate(video.Video_ID, video.Status);
        }
      } else {
        toast.error(
          response?.response?.data?.Message || "Failed to update score"
        );
      }
    } catch (error) {
      toast.error("Failed to update score");
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
    case 4:
      videoStatusBadgeColor = "bg-purple-100 text-purple-800";
      videoStatusText = "Completed";
      break;
    default:
      videoStatusBadgeColor = "bg-gray-100 text-gray-800";
      videoStatusText = "Unknown";
  }
}


  const handleUrlUpdate = async (newUrl) => {
    try {
      const response = await updateSocialMediaUrl(video.Video_ID, newUrl);
      if (response.data?.Status) {
        // Update the video object with new URL
        video.SocialMedia_URL = newUrl;
        toast.success("Social media URL updated successfully");

        // Update parent component if callback exists
        if (typeof onStatusUpdate === "function") {
          onStatusUpdate(video.Video_ID, video.Status);
        }
      } else {
        toast.error(
          response?.response?.data?.Message || "Failed to update URL"
        );
      }
    } catch (error) {
      console.error("Error updating URL:", error);
      toast.error(error.response?.data?.Message || "Failed to update URL");
    }
  };

  const handleRepostSuccess = () => {
    setIsRepostModalOpen(false);
    onClose();
    // getAllReels(); // Refresh the video list
  };

  const RatingComponent = ({ category, label, value, onChange }) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 block">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(category, rating)}
              className={`w-8 h-8 rounded-full border-2 font-semibold text-sm transition-all duration-200 ${
                value >= rating
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-400 border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {rating}
            </button>
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {value > 0 ? `${value}/5` : "Not rated"}
          </span>
        </div>
      </div>
    );
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFF1F7] rounded-xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E4007C] bg-white sticky top-0 z-10 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {video.Username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#E4007C]">
                Video Details
              </h2>
              <p className="text-sm text-[#F06292]">
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
        <div className="flex-1 bg-[#FFF1F7] overflow-hidden">
          <div className="h-full">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 h-full">
              {/* Left Column - Video and Comments (Desktop) */}
              <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Video Player (Desktop) */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                  <video
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                    playsInline
                  >
                    <source src={video.Video_Path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Comments Section (Desktop) */}
                <div className="bg-white border border-[#E4007C] rounded-xl shadow-sm">
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
                            className="w-full min-h-[100px] p-3 border border-[#E4007C] rounded-lg outline-none resize-none"
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
                        You can view but cannot add comments.
                      </div>
                    )}
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
                          <p className="text-gray-500 text-sm">
                            No comments yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Desktop) */}
              <div className="overflow-y-auto border-l p-6 space-y-6 custom-scrollbar">
                {/* Status Card */}
                <div className="bg-white rounded-xl border border-[#E4007C] shadow-sm p-6">
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
                          {video.Coordinator_username?.charAt(
                            0
                          ).toUpperCase() || "C"}
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
                <div className="bg-white border border-[#E4007C] rounded-xl shadow-sm p-6 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Video Details
                    </h3>
                    {userRole !== "Admin" && userRole !== "Client" && (
                      <h3 className="text-sm bg-green-200 text-gray-800 px-3 py-1 rounded-full border border-gray-300">
                        {video.Score
                          ? `Score :  ${score || video.Score}`
                          : "No score assigned yet"}
                      </h3>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-row justify-between">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Video ID
                        </label>
                        {video.is_repost && (
                          <h3 className="text-sm bg-yellow-100 text-yellow-800 border-yellow-300 px-3 -mt-2 mb-1 py-1 rounded-full border ">
                            Reposted
                          </h3>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-800">
                          {video.Video_ID}
                        </code>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Task ID
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-800">
                          {video.Task_ID}
                        </code>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Social Media URL
                      </label>
                      <div className="flex items-center space-x-2">
                        {video.SocialMedia_URL ? (
                          <>
                            <a
                              href={video.SocialMedia_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 flex-1"
                            >
                              <span className="break-words">
                                {video.SocialMedia_URL}
                              </span>
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
                            {userRole === "Creator" &&
                              videoStatusText === "Approved" && (
                                <button
                                  onClick={() => setIsEditUrlModalOpen(true)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                              )}
                          </>
                        ) : (
                          <p className="text-gray-500 italic flex-1">
                            Social media URL missing. You can only add URLs for
                            approved videos.
                          </p>
                        )}
                        {userRole === "Creator" &&
                          !video.SocialMedia_URL &&
                          videoStatusText === "Approved" && (
                            <button
                              onClick={() => setIsEditUrlModalOpen(true)}
                              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-600"
                            >
                              Add URL
                            </button>
                          )}
                      </div>
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
                <div className="max-w-2xl mx-auto p-4">
                  {(userRole === "Admin" || userRole === "Client") && (
                    <div className="bg-white border border-[#E4007C] rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Admin Actions
                        </h3>
                        <div className="text-sm bg-green-200 text-gray-800 px-3 py-1 rounded-full border border-gray-300">
                          {video.Score
                            ? `Score: ${score || video.Score}`
                            : "No score assigned yet"}
                        </div>
                      </div>
                      {insightChecked &&
                        (video?.SocialMedia_URL ? (
                          insightsAvailable ? (
                            <div className="space-y-6">
                              {/* 🟢 Score Inputs */}
                              <div className="grid gap-6">
                                <RatingComponent
                                  category="punctuality"
                                  label="Consistency"
                                  value={ratings.punctuality}
                                  onChange={handleRatingChange}
                                />
                                <RatingComponent
                                  category="creativity"
                                  label="Creativity"
                                  value={ratings.creativity}
                                  onChange={handleRatingChange}
                                />
                                <RatingComponent
                                  category="content"
                                  label="Content Quality"
                                  value={ratings.content}
                                  onChange={handleRatingChange}
                                />
                              </div>

                              {/* 🟢 Preview */}
                              {(ratings.punctuality > 0 ||
                                ratings.creativity > 0 ||
                                ratings.content > 0) && (
                                <div className="bg-gray-50 rounded-lg p-4 border">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-700">
                                      Score Preview
                                    </h4>
                                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                                      <span>
                                        Punctuality: {ratings.punctuality}/5
                                      </span>
                                      <span>
                                        Creativity: {ratings.creativity}/5
                                      </span>
                                      <span>
                                        Content Quality: {ratings.content}/5
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 🟢 Submit */}
                              <div className="flex justify-end">
                                <button
                                  onClick={handleScoreSubmit}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                                  disabled={submittingScore}
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
                                      <span>Submitting...</span>
                                    </>
                                  ) : (
                                    <span>Submit Score</span>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-300">
                              The creator has not uploaded the insight images
                              yet.
                            </div>
                          )
                        ) : (
                          <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-300">
                            No social media video URL provided. Please ensure
                            the creator has uploaded the Instagram Reel URL.
                          </div>
                        ))}
                    </div>
                  )}
                </div>
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
                  {video.Status === 2 && (
                    <button
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                      disabled={loading}
                      onClick={() => setIsAnalyticsModalOpen(true)}
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                      <span>Insights</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col h-full">
              {/* Video Player (Mobile - Always Visible) */}
              <div className="p-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                  <video
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                    playsInline
                  >
                    <source src={video.Video_Path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Mobile Toggle Buttons */}
              <div className="flex px-4 gap-2 border-b pb-2 border-[#E4007C]">
                <button
                  onClick={() => setMobileView("comments")}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    mobileView === "comments"
                      ? "bg-[#E4007C] text-white"
                      : "bg-white text-[#E4007C] border border-[#E4007C]"
                  }`}
                >
                  Comments
                </button>
                <button
                  onClick={() => setMobileView("details")}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    mobileView === "details"
                      ? "bg-[#E4007C] text-white"
                      : "bg-white text-[#E4007C] border border-[#E4007C]"
                  }`}
                >
                  Video Details
                </button>
              </div>

              {/* Mobile Content Area - Toggleable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Comments Section (Mobile) */}
                {mobileView === "comments" && (
                  <div className="p-4 space-y-6">
                    <div className="bg-white border border-[#E4007C] rounded-xl shadow-sm">
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
                                className="w-full min-h-[100px] p-3 border border-[#E4007C] rounded-lg outline-none resize-none"
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
                            You can view but cannot add comments.
                          </div>
                        )}
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
                              <p className="text-gray-500 text-sm">
                                No comments yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Details Section (Mobile) */}
                {mobileView === "details" && (
                  <div className="p-4 space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl border border-[#E4007C] shadow-sm p-6">
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
                              {video.Coordinator_username?.charAt(
                                0
                              ).toUpperCase() || "C"}
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
                    <div className="bg-white border border-[#E4007C] rounded-xl shadow-sm p-6 space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Video Details
                        </h3>
                        {(userRole !== "Admin" || userRole !== "Client") && (
                          <h3 className="text-sm bg-green-200 text-gray-800 px-3 py-1 rounded-full border border-gray-300">
                            {video.Score
                              ? `Score :  ${score || video.Score}`
                              : "No score assigned yet"}
                          </h3>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex flex-row justify-between">
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                              Video ID
                            </label>
                            {video.is_repost && (
                              <h3 className="text-sm bg-yellow-100 text-yellow-800 border-yellow-300 px-3 -mt-2 mb-1 py-1 rounded-full border ">
                                Reposted
                              </h3>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-800">
                              {video.Video_ID}
                            </code>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Task ID
                          </label>
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-800">
                              {video.Task_ID}
                            </code>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Social Media URL
                          </label>
                          <div className="flex items-center space-x-2">
                            {video.SocialMedia_URL ? (
                              <>
                                <a
                                  href={video.SocialMedia_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 flex-1"
                                >
                                  <span className="break-words">
                                    {video.SocialMedia_URL}
                                  </span>
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
                                {userRole === "Creator" &&
                                  videoStatusText === "Approved" && (
                                    <button
                                      onClick={() =>
                                        setIsEditUrlModalOpen(true)
                                      }
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                      <PencilIcon className="h-5 w-5" />
                                    </button>
                                  )}
                              </>
                            ) : (
                              <p className="text-gray-500 italic flex-1">
                                Social media URL missing. You can only add URLs
                                for approved videos.
                              </p>
                            )}
                            {userRole === "Creator" &&
                              !video.SocialMedia_URL &&
                              videoStatusText === "Approved" && (
                                <button
                                  onClick={() => setIsEditUrlModalOpen(true)}
                                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-600"
                                >
                                  Add URL
                                </button>
                              )}
                          </div>
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
                    <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-4">
                      {(userRole === "Admin" || userRole === "Client") && (
                        <div className="bg-white border border-[#E4007C] rounded-xl shadow-sm p-4 sm:p-6">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Admin Actions
                            </h3>
                            <div className="text-sm bg-green-200 text-gray-800 px-3 py-1 rounded-full border border-gray-300 text-center">
                              {video.Score
                                ? `Score: ${score || video.Score}`
                                : "No score assigned yet"}
                            </div>
                          </div>

                          {/* Rating Inputs */}
                          {insightChecked &&
                            (video?.SocialMedia_URL ? (
                              insightsAvailable ? (
                                <div className="space-y-6">
                                  {/* 🟢 Score Inputs */}
                                  <div className="grid gap-6">
                                    <RatingComponent
                                      category="punctuality"
                                      label="Consistency"
                                      value={ratings.punctuality}
                                      onChange={handleRatingChange}
                                    />
                                    <RatingComponent
                                      category="creativity"
                                      label="Creativity"
                                      value={ratings.creativity}
                                      onChange={handleRatingChange}
                                    />
                                    <RatingComponent
                                      category="content"
                                      label="Content Quality"
                                      value={ratings.content}
                                      onChange={handleRatingChange}
                                    />
                                  </div>

                                  {/* 🟢 Preview */}
                                  {(ratings.punctuality > 0 ||
                                    ratings.creativity > 0 ||
                                    ratings.content > 0) && (
                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-gray-700">
                                          Score Preview
                                        </h4>
                                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                                          <span>
                                            Punctuality: {ratings.punctuality}/5
                                          </span>
                                          <span>
                                            Creativity: {ratings.creativity}/5
                                          </span>
                                          <span>
                                            Content Quality: {ratings.content}/5
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* 🟢 Submit */}
                                  <div className="flex justify-end">
                                    <button
                                      onClick={handleScoreSubmit}
                                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                                      disabled={submittingScore}
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
                                          <span>Submitting...</span>
                                        </>
                                      ) : (
                                        <span>Submit Score</span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-300">
                                  The creator has not uploaded the insight
                                  images yet.
                                </div>
                              )
                            ) : (
                              <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-300">
                                No social media video URL provided. Please
                                ensure the creator has uploaded the Instagram
                                Reel URL.
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

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
                    </div>
                    {/* Analytics button visible to all roles */}
                    {video.Status === 2 && (
                      <button
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        disabled={loading}
                        onClick={() => setIsAnalyticsModalOpen(true)}
                      >
                        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                        <span>Insights</span>
                      </button>
                    )}
                  </div>
                )}
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
      <AnalyticsModal
        video={video}
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
      <EditUrlModal
        isOpen={isEditUrlModalOpen}
        onClose={() => setIsEditUrlModalOpen(false)}
        onSubmit={handleUrlUpdate}
        initialUrl={video.SocialMedia_URL}
      />
    </div>
  );
}
