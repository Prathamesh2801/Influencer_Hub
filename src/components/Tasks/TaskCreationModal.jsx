import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { createTask, updateTask } from "../../api/TaskApi/AdminTaskApi";

// Task Creation Modal Component
export default function TaskCreationModal({
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
    referenceLink: "",
    creatorType: "",
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
        referenceLink: editingTask.Reference_Link || "",
        creatorType: editingTask.User_Type || "",
      });
    } else if (!editingTask && isOpen) {
      // Reset form for new task
      setFormData({
        title: "",
        description: "",
        totalVideos: 1,
        startDate: "",
        endDate: "",
        referenceLink: "",
        creatorType: "",
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
          formData.totalVideos,
          formData.referenceLink,
          formData.creatorType
        );

        const updatedTask = {
          ...editingTask,
          title: formData.title,
          description: formData.description,
          totalVideos: formData.totalVideos,
          referenceLink: formData.referenceLink,
          creatorType: formData.creatorType,
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
          formData.totalVideos,
          formData.referenceLink,
          formData.creatorType
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
        referenceLink: "",
        creatorType: "",
        startDate: "",
        endDate: "",
      });

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.Message || "Error Creating or Updating  Task"
      );

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCoreChecked =
    formData.creatorType === "Core" || formData.creatorType === "All";
  const isPremiumChecked =
    formData.creatorType === "Premium" || formData.creatorType === "All";

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Link
              </label>
              <input
                type="url"
                value={formData.referenceLink}
                onChange={(e) =>
                  setFormData({ ...formData, referenceLink: e.target.value })
                }
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creator Type
              </label>
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isCoreChecked}
                    onChange={(e) => {
                      const premium = isPremiumChecked;
                      const core = e.target.checked;

                      let newType = "";
                      if (core && premium) newType = "All";
                      else if (core) newType = "Core";
                      else if (premium) newType = "Premium";
                      else newType = "";

                      setFormData({ ...formData, creatorType: newType });
                    }}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Core</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isPremiumChecked}
                    onChange={(e) => {
                      const core = isCoreChecked;
                      const premium = e.target.checked;

                      let newType = "";
                      if (core && premium) newType = "All";
                      else if (core) newType = "Core";
                      else if (premium) newType = "Premium";
                      else newType = "";

                      setFormData({ ...formData, creatorType: newType });
                    }}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Premium</span>
                </label>
              </div>
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
