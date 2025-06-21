import { useState, useRef, useEffect } from "react";
import { XIcon, UploadIcon, TrashIcon, ImageIcon } from "lucide-react";
import { getInsightImages } from "../../api/InsightsAPI/getInsights";
import { uploadInsightImages } from "../../api/InsightsAPI/createInsights";

export default function AnalyticsModal({ video, isOpen, onClose }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const maxImages = 3;
  const userRole = localStorage.getItem("Role");

  useEffect(() => {
    if (isOpen && video?.Video_ID) {
      getInsightImages(video.Video_ID)
        .then((res) => {
          if (res?.Status && Array.isArray(res?.Data?.images)) {
            const imagePreviews = res.Data.images.map((url, index) => ({
              id: Date.now() + index,
              preview: url,
              name: `Image ${index + 1}`,
              size: 0,
              file: null, // Because we don't have original File object
            }));
            setUploadedImages(imagePreviews);
          }
        })
        .catch((err) => console.error("Insight GET failed:", err));
    }
  }, [isOpen, video]);
  // Handle file selection
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (file) =>
        file.type.startsWith("image/") &&
        uploadedImages.length + fileArray.length <= maxImages
    );

    validFiles.forEach((file) => {
      if (uploadedImages.length < maxImages) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
          };
          setUploadedImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Remove image
  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle submit (placeholder for API integration)
  const handleSubmit = async () => {
    if (!video?.Video_ID) return;

    const [img1, img2, img3] = uploadedImages.map((img) => img.file);

    try {
      const res = await uploadInsightImages(video.Video_ID, img1, img2, img3);
      if (res.Status) {
        alert("Images uploaded successfully!");
        onClose(); // or optionally reload images
      } else {
        alert("Upload failed: " + res.Message);
      }
    } catch (err) {
      console.error("Insight POST failed:", err);
    }
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Analytics Upload
              </h2>
              <p className="text-sm text-gray-600">
                Upload analytics images for Video ID: {video.Video_ID}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Upload Area */}
            {userRole === "Creator" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upload Images
                  </h3>
                  <span className="text-sm text-gray-500">
                    {uploadedImages.length}/{maxImages} images uploaded
                  </span>
                </div>

                {/* Drag and Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : uploadedImages.length >= maxImages
                      ? "border-gray-200 bg-gray-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                    disabled={uploadedImages.length >= maxImages}
                  />

                  {uploadedImages.length < maxImages ? (
                    <div className="space-y-4">
                      <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop your images here, or{" "}
                          <button
                            onClick={handleFileInputClick}
                            className="text-blue-600 hover:text-blue-700 underline"
                          >
                            browse
                          </button>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB each. Maximum {maxImages}{" "}
                          images.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-lg font-medium text-gray-500">
                        Maximum images reached
                      </p>
                      <p className="text-sm text-gray-400">
                        Remove an image to upload more
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Uploaded Images
                </h3>

                {/* Desktop Grid View */}
                <div className="hidden md:grid md:grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {userRole === "Creator" && (
                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile List View */}
                <div className="md:hidden space-y-3">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                      {userRole === "Creator" && (
                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Information */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-900">Video Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Video ID:</span>
                  <span className="ml-2 font-mono text-gray-900">
                    {video.Video_ID}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Task ID:</span>
                  <span className="ml-2 font-mono text-gray-900">
                    {video.Task_ID}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Creator:</span>
                  <span className="ml-2 text-gray-900">{video.Username}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 text-gray-900">
                    {video.Status === 0
                      ? "Pending"
                      : video.Status === 1
                      ? "Review"
                      : video.Status === 2
                      ? "Approved"
                      : "Rejected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {userRole === "Creator" && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {uploadedImages.length > 0 && (
                <span>
                  {uploadedImages.length} image
                  {uploadedImages.length !== 1 ? "s" : ""} ready to upload
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploadedImages.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Analytics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
