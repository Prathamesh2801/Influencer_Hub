import { useEffect, useState } from "react";
import {
  XMarkIcon,
  VideoCameraIcon,
  CalendarDaysIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { fetchAllReels } from "../../api/SuperAdmin/FetchAllReels";
import { API_URL, Frontend_URL } from "../../../config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TaskViewModal({ isOpen, onClose, task }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);
  const userRole = localStorage.getItem("Role");
  const videosPerPage = 5;
  // console.log("Task In View Modal ", task);
  useEffect(() => {
    if (isOpen && task?.id) {
      const loadVideos = async () => {
        // console.log("TTEST", task);
        try {
          setLoading(true);
          const token = localStorage.getItem("fcm_token");
          const res = await fetchAllReels(token, task.id);
          setVideos(res.data?.Data || []);
          console.log("Task View Modal : ", res.data);
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

  // Excel export function
  const exportToExcel = async () => {
    if (videos.length === 0) {
      alert("No data to export");
      return;
    }

    setExportLoading(true);
    try {
      // Prepare data for Excel
      const excelData = videos.map((video) => ({
        Username: video.Username || "N/A",
        User_Type:
          video.User_Type === "Premium" ? "Core 50" : "Core 250" || "N/A",
        SocialMedia_URL: video.SocialMedia_URL || "N/A",
        Instagram_URL: video.insta_id || "N/A",
        UTM_URL: video.UTM_URL || "N/A",
        Score: video.Score || "N/A",
        Video_ID: video.Video_ID || "N/A",
        Insight_Image1: video.Image1 || 'N/A',
        Insight_Image2: video.Image2 || 'N/A',
        Insight_Image3: video.Image3 || 'N/A',

      }));

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better readability
      const columnWidths = [
        { wch: 20 }, // Username
        { wch: 15 }, // User_Type
        { wch: 30 }, // SocialMedia_URL
        { wch: 10 }, // Score
        { wch: 35 }, // Video_ID
      ];
      worksheet["!cols"] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Video Data");

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create blob and save file
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `${task.id || "task"}_video_data.xlsx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  function formatDescriptionWithLinks(text) {
    if (!text) return "";

    // Escape HTML tags (to avoid injection)
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Convert URLs into anchor tags
    const withLinks = escaped.replace(
      /(https?:\/\/[^\s]+|www\.[^\s]+)/g,
      (url) => {
        const href = url.startsWith("http") ? url : `https://${url}`;
        return `<a href="${href}" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">${url}</a>`;
      }
    );

    // Convert new lines into <br />
    return withLinks.replace(/\n/g, "<br />");
  }

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
            <p
              className="text-gray-600 text-sm whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: formatDescriptionWithLinks(task.description),
              }}
            ></p>
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
                    Task Type
                  </label>
                  <p className="text-gray-800">
                    {" "}
                    {task.userType === "Core"
                      ? "Core 250"
                      : task.userType === "Premium"
                        ? "Core 50"
                        : task.userType === "All"
                          ? "All"
                          : task.userType}
                  </p>
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
                {task.startDate}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                End Date
              </label>
              <p className="text-gray-800">{task.endDate}</p>
            </div>
            {/* <div>
              <label className="block text-gray-700 font-medium mb-1">
                Reference Link
              </label>
              <p className="text-gray-800">{task.referenceLink}</p>
            </div> */}
          </div>

          {/* Videos */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
              <h4 className="text-lg font-semibold text-gray-900">
                🎞️ Submitted Videos
              </h4>
              {(userRole === "Admin" || userRole === "Client") &&
                videos.length > 0 && (
                  <button
                    onClick={exportToExcel}
                    disabled={exportLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {exportLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Export Excel
                      </>
                    )}
                  </button>
                )}
            </div>

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
                        href={`${Frontend_URL}/dashboard?tab=reels&video_id=${video.Video_ID}`}
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
