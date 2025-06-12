import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  getAllNotifications,
  getSpecificNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../../api/NotificationSection/NotificationAPI";
import ConfirmModal from "../helper/ConfirmModal";

// Helper function to format timestamp to relative time
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMs = now - notificationTime;

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${diffInDays} days ago`;
  }
};

export default function NotificationSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications();

      if (response.data.Status && response.data.Data) {
        setNotifications(response.data.Data);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (err) {
      setError("Error fetching notifications: " + err.message);
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ title: "", message: "" });
    setSelectedNotification(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (notification) => {
    try {
      setFormLoading(true);
      const response = await getSpecificNotifications(notification.id);

      if (response.data.Status && response.data.Data) {
        const specificNotification = response.data.Data;
        setModalMode("edit");
        setSelectedNotification(specificNotification);
        setFormData({
          title: specificNotification.title || "",
          message: specificNotification.message || "",
        });
        setIsModalOpen(true);
      } else {
        toast.error("Failed to fetch notification details");
      }
    } catch (err) {
      toast.error("Error fetching notification details");
      console.error("Error fetching notification details:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
    setFormData({ title: "", message: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setFormLoading(true);

      if (modalMode === "create") {
        const response = await createNotification(
          formData.title,
          formData.message
        );
        if (response.data.Status) {
          toast.success(
            response.data.Message || "Notification created successfully"
          );
          fetchNotifications();
          closeModal();
        } else {
          toast.error(response.data.Message || "Failed to create notification");
        }
      } else if (modalMode === "edit") {
        const response = await updateNotification(
          selectedNotification.id,
          formData.title,
          formData.message
        );
        if (response.Status) {
          toast.success(
            response.Message || "Notification updated successfully"
          );
          fetchNotifications();
          closeModal();
        } else {
          toast.error(response.Message || "Failed to update notification");
        }
      }
    } catch (err) {
      toast.error("An error occurred while saving the notification");
      console.error("Error saving notification:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedNotification) return;

    try {
      setFormLoading(true);
      const response = await deleteNotification(selectedNotification.id);

      if (response.data.Status) {
        toast.success(
          response.data.Message || "Notification deleted successfully"
        );
        fetchNotifications();
        closeModal();
      } else {
        toast.error(response.data.Message || "Failed to delete notification");
      }
    } catch (err) {
      toast.error("Error deleting notification");
      console.error("Error deleting notification:", err);
    } finally {
      setFormLoading(false);
      setShowDeleteModal(false);
      setSelectedNotification(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;

    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={fetchNotifications}
          className="mt-2 text-red-700 hover:text-red-900 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Stay updated with your latest activities, feedback, and program
            updates.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Create Notification
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No notifications available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            return (
              <div
                key={notification.id}
                onClick={() => openEditModal(notification)}
                className="bg-pink-50 hover:cursor-pointer border border-pink-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-pink-700">
                    {notification.title}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatTimeAgo(notification.created_at)}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {notification.message}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created by: {notification.created_by}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            ></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    {modalMode === "create"
                      ? "Create New Notification"
                      : "Edit Notification"}
                  </h3>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Enter notification title"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Enter notification message"
                      />
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {modalMode === "create"
                              ? "Creating..."
                              : "Updating..."}
                          </div>
                        ) : (
                          <>
                            {modalMode === "create" ? (
                              <>
                                <PlusIcon
                                  className="-ml-0.5 mr-1.5 h-5 w-5"
                                  aria-hidden="true"
                                />
                                Create
                              </>
                            ) : (
                              <>
                                <PencilIcon
                                  className="-ml-0.5 mr-1.5 h-5 w-5"
                                  aria-hidden="true"
                                />
                                Update
                              </>
                            )}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={closeModal}
                        disabled={formLoading}
                      >
                        Cancel
                      </button>
                    </div>

                    {modalMode === "edit" && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={formLoading}
                          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {formLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Deleting...
                            </div>
                          ) : (
                            <>
                              <TrashIcon
                                className="-ml-0.5 mr-1.5 h-5 w-5"
                                aria-hidden="true"
                              />
                              Delete Notification
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setPendingDelete(null);
            }}
            onConfirm={handleDeleteConfirmed}
            username={"Notification"}
          />
        </div>
      )}
    </>
  );
}
