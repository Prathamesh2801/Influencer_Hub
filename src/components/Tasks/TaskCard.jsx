import {
  PlusIcon,
  PlayIcon,
  CalendarIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  UserGroupIcon,
  EyeIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CloudArrowUpIcon,
  PauseCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function TaskCard({
  task,
  userRole,
  onTaskClick,
  onEditTask,
  onViewTask,
  onConfirmDelete,
}) {
  const progress = (task.uploadedVideos / task.totalVideos) * 100;
  const isCompleted = task.status === "completed";
  const isOverdue = new Date(task.endDate) < new Date() && !isCompleted;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "ongoing":
        return "text-yellow-700 bg-yellow-100";
      case "upcoming":
        return "text-blue-600 bg-blue-100";
      case "overdue":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-gray-600 bg-gray-200";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "ongoing":
        return <PlayIcon className="w-5 h-5 text-yellow-500" />;
      case "upcoming":
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case "overdue":
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case "pending":
        return <PauseCircleIcon className="w-5 h-5 text-gray-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusRing = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "ring-2 ring-green-200";
      case "ongoing":
        return "ring-2 ring-yellow-200";
      case "upcoming":
        return "ring-2 ring-blue-200";
      case "overdue":
        return "ring-2 ring-red-300";
      case "pending":
        return "ring-2 ring-gray-300";
      default:
        return "";
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onConfirmDelete(task.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEditTask(task);
  };

  const handleView = (e) => {
    e.stopPropagation();
    onViewTask(task);
  };

  // const handleUpload = (e) => {
  //   e.stopPropagation();
  //   onTaskClick(task);
  // };
  // In TaskCard component, update/replace the handleUpload function
  const handleRepostClick = (e) => {
    e.stopPropagation();
    // Transform task data into video format expected by RepostModal
    const videoData = {
      id: task.id,
      // taskid: task.Task_ID,
      title: task.title,
      description: task.description,
      // Add any other required fields that RepostModal expects
    };
    onTaskClick(videoData);
  };

  return (
    <div
      className={`
  bg-white rounded-xl shadow-lg border border-gray-200 p-6
  transform transition-all duration-300 hover:scale-105 hover:shadow-xl
  ${getStatusRing(task.status)}
`}
    >
      <div className="flex justify-between items-start mb-4">
        {/* Left side: Status + Icon */}
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>

        {/* Right side: Task ID */}
        <span
          title={task.id}
          className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium border border-pink-300 shadow-sm truncate"
        >
          🆔 {task.id}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
     

      <div className="space-y-3">
        {userRole == "creator" && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VideoCameraIcon className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">
                  {task.uploadedVideos}/{task.totalVideos} videos
                </span>
              </div>
              <div className="flex items-center gap-1">
                {isCompleted && (
                  <TrophyIcon className="w-4 h-4 text-yellow-500" />
                )}
                {progress >= 50 && !isCompleted && (
                  <FireIcon className="w-4 h-4 text-orange-500" />
                )}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isCompleted ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(task.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Due: {new Date(task.endDate).toLocaleDateString()}</span>
            {isOverdue && (
              <span className="text-red-500 font-medium">OVERDUE</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">
            Created by {task.createdBy}
          </span>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <UserGroupIcon className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {userRole === "admin" && (
            <>
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <PencilIcon className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={handleView}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <EyeIcon className="w-3 h-3" />
                View
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="w-3 h-3" />
                Delete
              </button>
            </>
          )}
          {userRole === "creator" && (
            <>
              {!isOverdue && task.uploadedVideos < task.totalVideos && (
                <button
                  onClick={handleRepostClick}
                  disabled={isOverdue}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CloudArrowUpIcon className="w-4 h-4" />
                  Upload Video
                </button>
              )}
              <button
                onClick={handleView}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <EyeIcon className="w-3 h-3" />
                View
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}