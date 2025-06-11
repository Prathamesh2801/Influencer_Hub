import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { repostVideo } from "../../api/Reel Section/RepostVideoAPI";

export default function RepostModal({ video, isOpen, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "video/mp4") {
        setSelectedFile(file);
      } else {
        toast.error("Please select an MP4 video file");
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a video file");
      return;
    }

    try {
      setUploading(true);
      const response = await repostVideo(video.Video_ID, selectedFile);

      if (response?.data?.Status) {
        toast.success("Video reposted successfully");
        if (onSuccess) {
          onSuccess(response.data.Data);
        }
        onClose();
      } else {
        toast.error(response?.data?.Message || "Failed to repost video");
      }
    } catch (error) {
      console.error("Error reposting video:", error);
      toast.error("Failed to repost video");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Repost Video</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Video
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              disabled={uploading}
            />
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected file: {selectedFile.name}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {uploading ? (
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
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload Video</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
