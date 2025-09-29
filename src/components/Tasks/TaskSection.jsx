import { useState, useEffect } from "react";
import {
  PlusIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  TrophyIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";
import { getAllTask, getSpecificTask } from "../../api/TaskApi/UserSideTaskApi";
import { deleteTask } from "../../api/TaskApi/AdminTaskApi";
import ConfirmModal from "../helper/ConfirmModal";

import TaskViewModal from "./TaskViewModal";
import TaskCard from "./TaskCard";
import TaskCreationModal from "./TaskCreationModal";
import RepostModal from "../ReelSection/RepostModal";
import testBG from "../../assets/img/reelsBanner3.png";
import TaskLogo from "../../assets/img/utils/Your Task Hub.png";
// Main TaskSection Component

export default function TaskSection() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [repostVideo, setRepostVideo] = useState(null);

  // New state for filtering and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 9;

  // Update handleTaskClick function
  const handleTaskClick = (taskData) => {
    setRepostVideo(taskData.id);
    // console.log("test", taskData.id);
    setIsRepostModalOpen(true);
  };

  // Add handleRepostSuccess function
  const handleRepostSuccess = async () => {
    setIsRepostModalOpen(false);
    await fetchTasks(); // Refresh the tasks list
    toast.success("Video uploaded successfully!");
  };

  // Update the useEffect for filtering tasks
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
    } else {
      const searchTerm = searchQuery.toLowerCase();
      const filtered = tasks.filter((task) => {
        // Convert all searchable fields to strings and check if they include the search term
        return (
          task.id.toString().toLowerCase().includes(searchTerm) ||
          task.title.toLowerCase().includes(searchTerm) ||
          task.startDate.toLowerCase().includes(searchTerm) ||
          task.endDate.toLowerCase().includes(searchTerm) ||
          task.status.toLowerCase().includes(searchTerm) ||
          task.createdBy.toLowerCase().includes(searchTerm) ||
          task.userType.toLowerCase().includes(searchTerm)
        );
      });
      setFilteredTasks(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [tasks, searchQuery]);




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
        uploadedVideos: task.total_uploaded_video,
        startDate: task.Task_StartDate,
        endDate: task.Task_EndDate,
        status: task.Status?.toLowerCase() || "pending",
        createdBy: task.Created_By,
        referenceLink: task.Reference_Link,
        userType: task.User_Type,
      }));

      // console.log("Formatted Task : ", formattedTasks);
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
      toast.error(error.response?.data?.Message || "Failed to Delete Task");
      console.error(error);
    }
  };

  const handleEditTask = async (task) => {
    try {
      // console.log("Editing ...");
      // console.log("Task ID : ", task.id);
      const response = await getSpecificTask(task.id);
      const taskData = response?.data?.Data?.tasks[0] || task;
      // console.log("Edit res : ", taskData);

      setEditingTask(taskData);
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch task details:", error);
      setEditingTask(task);
      setIsCreateModalOpen(true);
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingTask(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = tasks.length;


  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);


  return (
    <div
      className="relative min-h-screen  p-4 sm:p-6"
      style={{ background: `url(${testBG}) center/contain ` }}
    >
      <Toaster position="top-right" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-600 bg-opacity-20 z-0 pointer-events-none" />
      {/* Header */}
      <div className="relative max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          {/* <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#E80071] mb-2">
              Task Dashboard
            </h1>
            <p className="text-sm sm:text-lg text-gray-600">
              Welcome back! You're logged in as{" "}
              <span className="font-semibold capitalize text-[#EF3F8F]">
                {userRole}
              </span>
            </p>
          </div> */}
          <img src={TaskLogo} alt="" className="h-full p-2 md:h-24" />

          {/* Search and Create Button Container */}
          <div className="relative flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#E80071]" />
              </div>
              <input
                type="text"
                placeholder="Search tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-pink-200 rounded-xl leading-5 bg-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-[#E80071] focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon className="h-4 w-4 text-[#E80071] hover:text-[#EF3F8F]" />
                </button>
              )}
            </div>

            {/* Create Task Button */}
            {userRole === "admin" && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#2d827b] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-[#316964] transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base whitespace-nowrap"
              >
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Task
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              {filteredTasks.length > 0
                ? `Found ${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""
                } matching "${searchQuery}"`
                : `No tasks found matching "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <VideoCameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-md sm:text-lg text-gray-600">Total Tasks</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {totalTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-md sm:text-lg text-gray-600">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-md sm:text-lg text-gray-600">Success Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {currentTasks.map(
            (task) =>
              task.status !== "overdue" && (
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
              )
          )}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <VideoCameraIcon className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
              {searchQuery
                ? `No tasks match your search "${searchQuery}". Try adjusting your search terms.`
                : userRole === "admin"
                  ? "Create your first task to get started!"
                  : "No tasks available at the moment."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Info */}
              <div className="text-md bg-white p-2 border border-blue-600 rounded-md font-semibold text-gray-800 order-2 sm:order-1">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} tasks
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 order-1 sm:order-2">
                {/* Prev (common) */}
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                {/* Desktop / Tablet: full numeric control (hidden on mobile) */}
                <div className="hidden sm:flex items-center gap-1">
                  {/* First */}
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    First
                  </button>

                  {/* Sliding window of page numbers (max 7 visible) */}
                  {(() => {
                    const pageCount = totalPages;
                    const windowSize = Math.min(7, pageCount);
                    const currentIndex = currentPage - 1;
                    let start = Math.max(0, Math.min(currentIndex - Math.floor(windowSize / 2), pageCount - windowSize));
                    return Array.from({ length: windowSize }, (_, i) => {
                      const pageIndex = start + i;
                      const pageNum = pageIndex + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}

                  {/* Ellipsis + last if many pages */}
                  {totalPages > 7 && (
                    <>
                      <span className="px-2 text-sm text-gray-500">…</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Last */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Last
                  </button>
                </div>

                {/* Mobile compact control (visible on xs only) */}
                <div className="flex sm:hidden items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                    <select
                      value={currentPage}
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                      className="mt-1 p-2 text-sm border border-gray-300 rounded-md"
                      aria-label="Jump to page"
                    >
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <option key={idx} value={idx + 1}>
                          {idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Next (common) */}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
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
