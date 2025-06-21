import { useEffect, useState } from "react";
import {
  XMarkIcon,
  VideoCameraIcon,
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { fetchAllReels } from "../../api/SuperAdmin/FetchAllReels";
import { Frontend_URL } from "../../../config";

export default function TaskViewModal({ isOpen, onClose, task }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const userRole = localStorage.getItem("Role");
  const videosPerPage = 5;

  useEffect(() => {
    if (isOpen && task?.id) {
      const loadVideos = async () => {
        console.log("TTEST", task);
        try {
          setLoading(true);
          const token = localStorage.getItem("fcm_token");
          const res = await fetchAllReels(token, task.id);
          setVideos(res.data?.Data || []);
          setCurrentPage(1); // Reset to page 1 every time modal opens
        } catch (err) {
          console.error("Error fetching task videos:", err);
        } finally {
          setLoading(false);
        }
      };
      loadVideos();
    }
  }, [isOpen, task]);

  const indexOfLast = currentPage * videosPerPage;
  const indexOfFirst = indexOfLast - videosPerPage;
  const currentVideos = videos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(videos.length / videosPerPage);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-[#E4007C]">
            📋 Task Overview
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full p-2 transition"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Task Info */}
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm">{task.description}</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-pink-50 p-4 rounded-xl text-sm">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Total Videos Required
              </label>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <VideoCameraIcon className="w-5 h-5 text-pink-500" />
                {task.totalVideos}
              </p>
            </div>

            <div>
              {(userRole === "Admin" || userRole === "Client") && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Creator Type
                  </label>
                  <p className="text-gray-800">{task.userType}</p>
                </div>
              )}
              {(userRole === "Creator" || userRole === "Co-ordinator") && (
                <>
                  <label className="block text-gray-700 font-medium mb-1">
                    Uploaded Videos
                  </label>
                  <p className="font-semibold text-gray-900">
                    {task.uploadedVideos ? task.uploadedVideos : 0}
                  </p>
                </>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Start Date
              </label>
              <p className="text-gray-800 flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-pink-400" />
                {new Date(task.startDate).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                End Date
              </label>
              <p className="text-gray-800">
                {new Date(task.endDate).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Reference Link
              </label>
              <p className="text-gray-800">{task.referenceLink}</p>
            </div>
          </div>

          {/* Videos */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              🎞️ Submitted Videos
            </h4>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : currentVideos.length > 0 ? (
              <div className="space-y-3">
                {currentVideos.map((video) => (
                  <div
                    key={video.Video_ID}
                    className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition"
                  >
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-medium text-gray-900">
                        Video ID: {video.Video_ID}
                      </p>
                      <p className="text-sm text-gray-600">
                        Score: {video.Score ?? "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Updated At: {video.Update_AT}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <a
                        href={`${Frontend_URL}/dashboard?video_id=${video.Video_ID}`}
                        // target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 font-medium text-sm"
                      >
                        Watch Video
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No videos uploaded yet
              </p>
            )}

            {/* Pagination Controls */}
            {videos.length > videosPerPage && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 px-2 pt-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
