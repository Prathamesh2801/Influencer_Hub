"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  BellAlertIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  getAllNotifications,
  getSpecificNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../../api/NotificationSection/NotificationAPI";
import ConfirmModal from "../helper/ConfirmModal";
import bgBanner from "../../assets/img/reelsBanner3.png";
import notifyLogo from "../../assets/img/utils/What’s New 2.png";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 6 notifications per page

  const role = localStorage.getItem("Role");
  const currentUsername = localStorage.getItem("Username");

  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    userTypes: {
      core: false,
      premium: false,
    },
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Calculate pagination values
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  // Reset to first page when notifications change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [notifications.length, totalPages, currentPage]);

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
    setFormData({
      title: "",
      message: "",
      userTypes: {
        core: false,
        premium: false,
      },
    });
    setSelectedNotification(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (notification) => {
    try {
      setFormLoading(true);
      const response = await getSpecificNotifications(notification.id);

      if (response.data.Status && response.data.Data) {
        const specificNotification = response.data.Data;
        const userTypes = {
          core:
            specificNotification.user_type === "Core" ||
            specificNotification.user_type === "All",
          premium:
            specificNotification.user_type === "Premium" ||
            specificNotification.user_type === "All",
        };

        setModalMode("edit");
        setSelectedNotification(specificNotification);
        setFormData({
          title: specificNotification.title || "",
          message: specificNotification.message || "",
          userTypes,
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
    setFormData({
      title: "",
      message: "",
      userTypes: {
        core: false,
        premium: false,
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      userTypes: {
        ...prev.userTypes,
        [type]: !prev.userTypes[type],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    let userType = "";
    if (formData.userTypes.core && formData.userTypes.premium) {
      userType = "All";
    } else if (formData.userTypes.core) {
      userType = "Core";
    } else if (formData.userTypes.premium) {
      userType = "Premium";
    }

    try {
      setFormLoading(true);

      if (modalMode === "create") {
        const response = await createNotification(
          formData.title,
          formData.message,
          userType
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
          formData.message,
          userType
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
      toast.error(
        err.response.data.Message ||
          "An error occurred while saving the notification"
      );
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
  const handleDelete = async () => {
    if (!selectedNotification) return;
    setShowDeleteModal(true);
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
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
    <div
      className="relative   min-h-screen"
      style={{ background: `url(${bgBanner}) center/contain` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-600 bg-opacity-20 z-0" />
      <div className=" relative  mx-5">
        <div className=" sm:flex sm:items-center sm:justify-between mb-8 ">
          {/* <div className="sm:flex-auto">
          <h1 className="text-3xl mt-10 font-bold text-[#E4007C]">Notifications</h1>
          <p className="mt-2 text-md text-[#FF2D99]">
            Stay updated with your latest activities, feedback, and program
            updates.
          </p>
        </div> */}
          <div className="flex items-center justify-center md:justify-start p-4">
            <img src={notifyLogo} alt="" className="w-56 " />
          </div>

          {(role === "Admin" || role === "Client") && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-[#FF2D99] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Create Notification
              </button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <BellAlertIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Notification yet
            </h3>
            <p className="text-gray-500">
              No Notifications available at the moment.
            </p>
          </div>
        ) : (
          <>
            {/* Notifications Grid */}
            <div className="space-y-4 mb-8">
              {currentNotifications.map((notification) => {
                console.log("Notification Structure : ", notification);
                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (
                        notification.created_by?.toLowerCase() ===
                        currentUsername?.toLowerCase()
                      ) {
                        openEditModal(notification);
                      } else {
                        console.log(
                          "You are not allowed to edit this notification."
                        );
                      }
                    }}
                    className="bg-pink-50 hover:cursor-pointer border border-pink-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-pink-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-pink-700 pr-4">
                        {notification.title}
                      </h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>

                    <p
                      className="text-gray-700 mb-3 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatDescriptionWithLinks(
                          notification.message
                        ),
                      }}
                    ></p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Created by: {notification.created_by}
                      </span>
                      {notification.user_type && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          {notification.user_type === "Core"
                            ? "Core 250"
                            : notification.user_type === "Premium"
                            ? "Core 50"
                            : notification.user_type === "All"
                            ? "All"
                            : notification.user_type}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, notifications.length)} of{" "}
                  {notifications.length} notifications
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-pink-600 bg-white border border-pink-300 rounded-md hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                          currentPage === pageNum
                            ? "bg-pink-500 text-white hover:bg-pink-600"
                            : "text-pink-600 bg-white border border-pink-300 hover:bg-pink-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Page Indicator */}
                  <div className="sm:hidden flex items-center px-3 py-2 text-sm font-medium text-pink-600 bg-white border border-pink-300 rounded-md">
                    {currentPage} of {totalPages}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-pink-600 bg-white border border-pink-300 rounded-md hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed w-full inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            ></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all my-8 w-full max-w-lg p-6">
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
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 outline-none focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 px-3"
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
                        className="mt-2 block w-full rounded-md outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Enter notification message"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                        Creator Type
                      </label>
                      <div className="space-y-2 grid grid-cols-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="core"
                            checked={formData.userTypes.core}
                            onChange={() => handleCheckboxChange("core")}
                            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                          />
                          <label
                            htmlFor="core"
                            className="ml-2 text-sm text-gray-900"
                          >
                            Core 250
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="premium"
                            checked={formData.userTypes.premium}
                            onChange={() => handleCheckboxChange("premium")}
                            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                          />
                          <label
                            htmlFor="premium"
                            className="ml-2 text-sm text-gray-900"
                          >
                            Core 50
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-flow-row-dense grid-cols-2 gap-3">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="inline-flex w-full items-center justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                  className="-ml-0.5 mr-1.5 h-4 w-4"
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
                        className="inline-flex w-full justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
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
              setSelectedNotification(null);
            }}
            onConfirm={handleDeleteConfirmed}
            username={"Notification"}
          />
        </div>
      )}
    </div>
  );
}
