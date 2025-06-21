import { PlayIcon } from "@heroicons/react/24/solid";

export default function VideoCard({ video, onClick }) {
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
          controls={false}
          playsInline
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = 1; // Move to 1s for a better frame
          }}
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