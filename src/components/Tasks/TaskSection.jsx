import { useState, useEffect } from "react";
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
import { Toaster, toast } from "react-hot-toast";
import { getAllTask, getSpecificTask } from "../../api/TaskApi/UserSideTaskApi";
import {
  createTask,
  updateTask,
  deleteTask,
} from "../../api/TaskApi/AdminTaskApi";
import ConfirmModal from "../helper/ConfirmModal";
import RepostModal from "../SA/RepostModal";
import TaskViewModal from "./TaskViewModal";

// Task Creation Modal Component
function TaskCreationModal({
  isOpen,
  onClose,
  onCreateTask,
  onUpdateTask,
  editingTask,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalVideos: 1,
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingTask && isOpen) {
      // Pre-populate form with editing task data

      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        // Convert "2025-06-17 15:29:00" -> "2025-06-17T15:29"
        return dateString.replace(" ", "T").slice(0, 16);
      };

      setFormData({
        title: editingTask.Task_Title || "",
        description: editingTask.Task_Description || "",
        totalVideos: editingTask.Total_Video || 1,
        startDate: formatDateForInput(editingTask.Task_StartDate),
        endDate: formatDateForInput(editingTask.Task_EndDate),
      });
    } else if (!editingTask && isOpen) {
      // Reset form for new task
      setFormData({
        title: "",
        description: "",
        totalVideos: 1,
        startDate: "",
        endDate: "",
      });
    }
  }, [editingTask, isOpen]);

  const formatDateTime = (datetime) => {
    // Converts '2025-06-17T13:30' => '2025-06-17 13:30:00'
    return datetime.replace("T", " ") + ":00";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Format datetime values
      const formattedStart = formatDateTime(formData.startDate);
      const formattedEnd = formatDateTime(formData.endDate);

      if (editingTask) {
        // Update existing task
        await updateTask(
          editingTask.Task_ID,
          formData.title,
          formData.description,
          formattedStart,
          formattedEnd,
          formData.totalVideos
        );

        const updatedTask = {
          ...editingTask,
          title: formData.title,
          description: formData.description,
          totalVideos: formData.totalVideos,
          startDate: formattedStart,
          endDate: formattedEnd,
        };

        onUpdateTask(updatedTask);
        toast.success("Task updated successfully!");
      } else {
        // Create new task
        const response = await createTask(
          formData.title,
          formData.description,
          formattedStart,
          formattedEnd,
          formData.totalVideos
        );

        const taskID = response?.data?.Task_ID || Date.now();

        const newTask = {
          id: taskID,
          ...formData,
          startDate: formattedStart,
          endDate: formattedEnd,
          uploadedVideos: 0,
          status: "pending",
          priority: "medium",
          createdBy: "admin",
        };

        onCreateTask(newTask);
        toast.success("Task created successfully!");
      }

      setFormData({
        title: "",
        description: "",
        totalVideos: 1,
        startDate: "",
        endDate: "",
      });

      onClose();
    } catch (error) {
      toast.error(
        editingTask ? "Failed to update task" : "Failed to create task"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the task"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Videos *
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalVideos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalVideos: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading
                  ? "Saving..."
                  : editingTask
                  ? "Update Task"
                  : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Task View Modal Component

// Task Card Component
function TaskCard({
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
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          {/* <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority.toUpperCase()}
          </span> */}

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>
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
              {!isOverdue && (
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

// // Video Upload Modal Component
// function VideoUploadModal({ isOpen, onClose, task, onUploadVideo }) {
//   const [videoTitle, setVideoTitle] = useState("");

//   const handleUpload = () => {
//     if (!videoTitle.trim()) {
//       toast.error("Please enter a video title");
//       return;
//     }

//     onUploadVideo(task.id, videoTitle);
//     setVideoTitle("");
//     toast.success("Video uploaded successfully!");
//     onClose();
//   };

//   if (!isOpen || !task) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Upload Video</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <XMarkIcon className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="mb-4">
//           <h3 className="font-semibold text-gray-900">{task.title}</h3>
//           <p className="text-sm text-gray-600">
//             Progress: {task.uploadedVideos}/{task.totalVideos} videos
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Video Title
//             </label>
//             <input
//               type="text"
//               value={videoTitle}
//               onChange={(e) => setVideoTitle(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter video title"
//             />
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleUpload}
//               className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Upload Video
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Main TaskSection Component

export default function TaskSection() {
  const [tasks, setTasks] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [repostVideo, setRepostVideo] = useState(null);

  // Remove isUploadModalOpen and add isRepostModalOpen
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Update handleTaskClick function
  const handleTaskClick = (taskData) => {
    // setSelectedVideo(taskData.id);
    setRepostVideo(taskData.id);
    console.log("test", taskData.id);

    setIsRepostModalOpen(true);
  };

  // Add handleRepostSuccess function
  const handleRepostSuccess = async () => {
    setIsRepostModalOpen(false);
    await fetchTasks(); // Refresh the tasks list
    toast.success("Video uploaded successfully!");
  };

  // Fetch tasks from API
  async function fetchTasks() {
    try {
      const res = await getAllTask();
      const data = res?.data?.Data?.tasks || [];

      // Transform API data to match UI structure
      const formattedTasks = data.map((task) => ({
        id: task.Task_ID,
        title: task.Task_Title,
        description: task.Task_Description,
        totalVideos: parseInt(task.Total_Video),
        uploadedVideos: task.total_uploaded_video, // Until you fetch actual count
        startDate: task.Task_StartDate,
        endDate: task.Task_EndDate,
        status: task.Status?.toLowerCase() || "pending", // Or derive from task data
        //  priority: "medium", // Add logic if available
        createdBy: task.Created_By,
      }));

      console.log("Formatted Task : ", formattedTasks);
      setTasks(formattedTasks);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  }
  useEffect(() => {
    const role = localStorage.getItem("Role") || "viewer";
    setUserRole(role.toLowerCase());

    fetchTasks();
  }, []);

  const handleCreateTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = async (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
    await fetchTasks();
  };

  const onConfirmDelete = (taskId) => {
    setPendingDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (pendingDelete) {
      await handleDeleteTask(pendingDelete);
      setShowDeleteModal(false);
      setPendingDelete(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  const handleEditTask = async (task) => {
    try {
      console.log("Editing ...");
      // Fetch specific task data for editing
      console.log("Task ID : ", task.id);
      const response = await getSpecificTask(task.id);
      const taskData = response?.data?.Data?.tasks[0] || task;
      console.log("Edit res : ", taskData);

      setEditingTask(taskData);
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch task details:", error);
      // Fallback to existing task data
      setEditingTask(task);
      setIsCreateModalOpen(true);
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  // const handleTaskClick = (task) => {
  //   setSelectedTask(task);
  //   setIsUploadModalOpen(true);
  // };

  const handleUploadVideo = (taskId, videoTitle) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newUploadedVideos = task.uploadedVideos + 1;
          return {
            ...task,
            uploadedVideos: newUploadedVideos,
            status:
              newUploadedVideos >= task.totalVideos
                ? "completed"
                : "in-progress",
          };
        }
        return task;
      })
    );
  };

  // const handleRepostSuccess = () => {
  //   setIsRepostModalOpen(false);
  //   fetchTasks(); // Refresh task list if needed
  //   toast.success("Video reposted successfully");
  // };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingTask(null);
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Task Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! You're logged in as{" "}
              <span className="font-semibold capitalize">{userRole}</span>
            </p>
          </div>

          {userRole === "admin" && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              Create Task
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <VideoCameraIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Feed */}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              userRole={userRole}
              onTaskClick={handleTaskClick}
              onEditTask={handleEditTask}
              onViewTask={handleViewTask}
              onDeleteTask={handleDeleteTask}
              onConfirmDelete={onConfirmDelete}
            />
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <VideoCameraIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500">
              {userRole === "admin"
                ? "Create your first task to get started!"
                : "No tasks available at the moment."}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}

      <TaskCreationModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        editingTask={editingTask}
      />
      <RepostModal
        taskId={repostVideo}
        isOpen={isRepostModalOpen}
        onClose={() => setIsRepostModalOpen(false)}
        onSuccess={handleRepostSuccess}
      />

      <TaskViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        task={selectedTask}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPendingDelete(null);
        }}
        onConfirm={handleDeleteConfirmed}
        username={pendingDelete}
      />
    </div>
  );
}
