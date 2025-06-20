import { useState, useEffect } from "react";
import {
  fetchProfileData,
  updateProfileData,
} from "../../api/ProfileAPI/ProfileAPI";
import { toast } from "react-hot-toast";

export default function ProfileSection() {
  const username = localStorage.getItem("Username");

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    instaId: "",
    profileImage: null,
  });

  // State for UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetchProfileData();

        if (response.Status && response.Data) {
          const data = response.Data;
          setFormData({
            name: data.Name || "",
            email: data.Email || "",
            city: data.City || "",
            instaId: data.Insta_id || "",
            profileImage: null,
          });
          setProfileImageUrl(data.Profile_Picture || "");
          setPreviewImage(data.Profile_Picture || "");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateProfileData(
        formData.name,
        formData.email,
        formData.city,
        formData.instaId,
        formData.profileImage
      );

      if (response.Status) {
        setSuccess(response?.Message || "Profile updated successfully!");
        toast.success(response?.Message || "Profile updated successfully!", {
          duration: 2000,
        });
        // Update profile image URL if new image was uploaded
        if (response.Data?.Profile_Picture) {
          setProfileImageUrl(response.Data.Profile_Picture);
          setPreviewImage(response.Data.Profile_Picture);
        }
        // Clear the file input
        setFormData((prev) => ({
          ...prev,
          profileImage: null,
        }));
      } else {
        setError(response?.Message || "Failed to update profile");
        toast.error(response?.Message || "Failed to update profile", {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response.data.Message ||
          "Failed to update profile. Please try again.",
        {
          duration: 2000,
        }
      );
      setError(
        error.response.data.Message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form to original values
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E80071] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-[#E80071] overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-16 w-16 md:h-20 md:w-20 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653Z"
                    />
                  </svg>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#E80071] text-white p-2 rounded-full shadow-lg hover:bg-[#EF3F8F] transition-colors cursor-pointer">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <h1 className="text-2xl font-bold text-[#E80071] mt-4">
              Edit Profile
            </h1>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username || ""}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instaId"
                  value={formData.instaId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#E80071] focus:ring-1 focus:ring-[#E80071]"
                  placeholder="@insta_handle"
                />
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h2 className="text-lg font-semibold text-[#D53C2F]">
                Personal Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#E80071] focus:ring-1 focus:ring-[#E80071]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#E80071] focus:ring-1 focus:ring-[#E80071]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#E80071] focus:ring-1 focus:ring-[#E80071]"
                  placeholder="Enter your city"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl border border-[#E80071] text-[#E80071] font-medium hover:bg-[#E80071] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-xl bg-[#E80071] text-white font-medium hover:bg-[#EF3F8F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
