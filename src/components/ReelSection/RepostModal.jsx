import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

import { repostVideo } from "../../api/Reel Section/RepostVideoAPI";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

export default function RepostModal({
  video,
  isOpen,
  onClose,
  onSuccess,
  taskId = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [socialUrl, setSocialUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const isUpload = !video; // If no video prop is passed, it's an upload
  console.log("Modal type:", isUpload ? "Upload" : "Repost", { taskId });

  const validateAspectRatio = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        URL.revokeObjectURL(video.src);
        const aspectRatio = video.videoWidth / video.videoHeight;
        console.log(
          "Video Dimensions:",
          video.videoWidth,
          video.videoHeight,
          "Aspect Ratio:",
          aspectRatio.toFixed(2)
        );

        // Check if aspect ratio is roughly 9:16 (0.56)
        const isCorrectRatio = Math.abs(aspectRatio - 9 / 16) < 0.05;
        isCorrectRatio
          ? resolve(true)
          : reject("Aspect ratio must be 9:16 (portrait)");
      };

      video.onerror = function () {
        reject("Could not load the video file.");
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (
        file.type === "video/mp4" ||
        file.type === "video/mov" ||
        file.type === "video/avi"
      ) {
        if (file.size <= 20 * 1024 * 1024) {
          validateAspectRatio(file)
            .then(() => {
              setSelectedFile(file);
            })
            .catch((error) => {
              toast.error(error);
              fileInputRef.current.value = "";
            });
        } else {
          toast.error("File size must be less than 20MB");
          fileInputRef.current.value = "";
        }
      } else {
        toast.error("Please select a valid video file (MP4, MOV, AVI)");
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      console.log("Dropped file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (
        file.type === "video/mp4" ||
        file.type === "video/mov" ||
        file.type === "video/avi"
      ) {
        if (file.size <= 20 * 1024 * 1024) {
          validateAspectRatio(file)
            .then(() => {
              setSelectedFile(file);
            })
            .catch((error) => {
              toast.error(error);
            });
        } else {
          toast.error("File size must be less than 20MB");
        }
      } else {
        toast.error("Please select a valid video file (MP4, MOV, AVI)");
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      console.log("No file selected");
      toast.error("Please select a video file");
      return;
    }

    console.log("Starting upload process:", {
      isUpload,
      videoId: video?.Video_ID,
      fileName: selectedFile.name,
    });

    try {
      setUploading(true);
      // If video prop exists, it's a repost. Otherwise, it's a new upload
      console.log("Calling repostVideo API with:", {
        videoId: video?.Video_ID,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });
      const response = await repostVideo(
        video?.Video_ID,
        selectedFile,
        socialUrl,
        taskId
      );
      console.log("API Response:", response);

      if (response?.data?.Status) {
        // console.log('Upload successful:', response.data);
        toast.success(
          isUpload
            ? "Video uploaded successfully"
            : "Video reposted successfully"
        );
        if (onSuccess) {
          onSuccess(response.data.Data);
        }
        onClose();
      } else {
        console.error("API Error Response:", response?.data);
        toast.error(
          response?.response?.data?.Message ||
            `Failed to ${isUpload ? "upload" : "repost"} video`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isUpload ? "uploading" : "reposting"} video:`,
        error,
        "\nError response:",
        error.response
      );
      toast.error(`Failed to ${isUpload ? "upload" : "repost"} video`);
    } finally {
      console.log("Upload process completed");
      setUploading(false);
    }
  };

  // Reset the form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setSocialUrl("");
      setIsDragging(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isUpload ? "Video Upload" : "Repost Video"}
          </h2>
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
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-pink-400 bg-pink-50"
                  : "border-pink-300 bg-pink-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    Drag & drop your video here
                  </p>
                  <p className="text-gray-500 mb-4">or</p>
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="px-6 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition-colors font-medium"
                    disabled={uploading}
                  >
                    Browse Files
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Supported formats: MP4, MOV, AVI (Max 20MB)
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="video/mp4,video/mov,video/avi"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </div>
          ) : (
            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CloudArrowUpIcon className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploading}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Media URL{" "}
              <span className="text-blue-400">( Optional )</span>
            </label>
            <input
              type="url"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=example"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              disabled={uploading}
            />
            <p className="text-xs text-gray-400 mt-1">
              You can paste a YouTube, Instagram, or any valid social media
              video URL.
            </p>
          </div> */}

          <div className="flex justify-end space-x-3 mt-6">
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
              className="px-4 py-2 bg-[#E4007C] text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                <span>{isUpload ? "Upload Video" : "Upload New Version"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
