import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, Tag, Image, User, Link, X } from "lucide-react";
import {
  addHomePageSection,
  getAllHomeCreatives,
  removeHomePageSection,
} from "../../api/Creatives/CreativesApi";
import { API_URL } from "../../../config";
import toast from "react-hot-toast";
import bgbanner from "../../assets/img/reelsBanner3.png";
import creativeHeader from "../../assets/img/utils/Creative Hub.png";

const CreativesSection = () => {
  const [creativeData, setCreativeData] = useState({
    Notification: [],
    Banner: [],
    Spotlight: [],
    Advertisement: [],
  });

  const [loading, setLoading] = useState(true);

  async function getHomeData() {
    try {
      const response = await getAllHomeCreatives();
      if (response?.Status) {
        setCreativeData(response.Data);
        // console.log("Homepage Data:", response.Data);
      } else {
        console.error("Failed to fetch home data", response?.Message);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    }
  }

  useEffect(() => {
    getHomeData().finally(() => setLoading(false));
  }, []);

  const [activeTab, setActiveTab] = useState("highlights");
  const [newItemForm, setNewItemForm] = useState({});

  // File handling
  const handleFileUpload = (file, type) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItemForm({
          ...newItemForm,
          [type]: file,
          [`${type}Preview`]: e.target.result,
          [`${type}Name`]: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Highlights Management
  const addHighlight = async () => {
    if (newItemForm.text?.trim()) {
      const formData = new FormData();
      formData.append("section", "Notification");
      formData.append("text", newItemForm.text.trim());

      try {
        const response = await addHomePageSection(formData);
        if (response?.Status) {
          toast.success(response.Message || "Highlight added successfully!");
          getHomeData();
          setNewItemForm({});
        } else {
          toast.error(response.Message || "Failed to add highlight");
        }
      } catch (error) {
        console.error("Error adding highlight:", error);
      }
    }
  };

  const deleteHighlight = async (index) => {
    try {
      const response = await removeHomePageSection("Notification", index);
      if (response?.Status) {
        toast.success(response.Message || "Highlight deleted successfully!");
        getHomeData();
        setNewItemForm({});
      } else {
        toast.error(response.Message || "Failed to delete highlight");
      }
    } catch (error) {
      console.error("Error deleting highlight:", error);
    }
  };

  // Hero Banners Management
  const addHeroBanner = async () => {
    // console.log("Adding Hero Banner with form data:", newItemForm);
    if (newItemForm.image) {
      const formData = new FormData();
      formData.append("section", "Banner");
      formData.append("image", newItemForm.image);
      formData.append("text", newItemForm.text.trim());
      try {
        const response = await addHomePageSection(formData);
        if (response?.Status) {
          toast.success("Banner added successfully!");
          getHomeData(); // Refresh list
          setNewItemForm({});
        } else {
          toast.error("Failed to add banner  ");
        }
      } catch (error) {
        console.error("Error adding banner:", error);
      }
    }
  };

  const deleteHeroBanner = async (index) => {
    try {
      const response = await removeHomePageSection("Banner", index);
      if (response?.Status) {
        toast.success(response.Message || "Highlight deleted successfully!");
        getHomeData();
        setNewItemForm({});
      } else {
        toast.error(response.Message || "Failed to delete highlight");
      }
    } catch (error) {
      console.error("Error deleting highlight:", error);
    }
  };

  const addCreator = async () => {
    if (newItemForm.username?.trim() && newItemForm.video) {
      const formData = new FormData();
      formData.append("section", "Spotlight");
      formData.append("username", newItemForm.username.trim());
      formData.append("link", newItemForm.href?.trim() || "#");
      formData.append("video", newItemForm.video);

      try {
        const response = await addHomePageSection(formData);
        if (response?.Status) {
          toast.success(response.Message || "Creator added successfully");
          getHomeData();
          setNewItemForm({});
        } else {
          toast.error(response?.Message || "Failed to add creator");
        }
      } catch (error) {
        console.error("Error adding creator:", error);
      }
    }
  };

  const deleteCreator = async (index) => {
    try {
      const response = await removeHomePageSection("Spotlight", index);
      if (response?.Status) {
        toast.success(response.Message || "Spotlight deleted successfully!");
        getHomeData();
        setNewItemForm({});
      } else {
        toast.error(response.Message || "Failed to delete Spotlight");
      }
    } catch (error) {
      console.error("Error deleting highlight:", error);
    }
  };

  // Hot Products Management
  const addHotProduct = async () => {
    if (newItemForm.image && newItemForm.title?.trim()) {
      const formData = new FormData();
      formData.append("section", "Advertisement");
      formData.append("image", newItemForm.image);
      formData.append("title", newItemForm.title.trim());
      formData.append("link", newItemForm.href?.trim() || "#");

      try {
        const response = await addHomePageSection(formData);
        if (response?.Status) {
          toast.success(response.Message || "Product added successfully");
          getHomeData();
          setNewItemForm({});
        } else {
          toast.error(response?.Message || "Failed to add product");
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  const deleteHotProduct = async (index) => {
    try {
      const response = await removeHomePageSection("Advertisement", index);
      if (response?.Status) {
        toast.success(response.Message || "Highlight deleted successfully!");
        getHomeData();
        setNewItemForm({});
      } else {
        toast.error(response.Message || "Failed to delete highlight");
      }
    } catch (error) {
      console.error("Error deleting highlight:", error);
    }
  };

  const TabButton = ({ tab, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
        activeTab === tab
          ? "bg-pink-500 text-white shadow-lg"
          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:block">{label}</span>
    </button>
  );

  return (
    <div
      className="relative min-h-screen bg-gray-50 p-3 sm:p-6"
      style={{ background: `url(${bgbanner}) center/contain` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-600 bg-opacity-20 z-0" />
      <div className=" relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center md:justify-start p-4">
            <img src={creativeHeader} alt="" className="h-24" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2">
          <TabButton tab="highlights" label="Highlights" icon={Tag} />
          <TabButton tab="heroBanners" label=" Banners" icon={Image} />
          <TabButton tab="creators" label="Spotlights" icon={User} />
          <TabButton tab="hotProducts" label="Hot Products" icon={Link} />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          {/* Highlights Section */}
          {activeTab === "highlights" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Highlights
                </h2>
                <span className="text-sm text-gray-500">
                  {creativeData.Notification.length} items
                </span>
              </div>

              {/* Add New Highlight */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Add New Highlight
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter highlight text..."
                    value={newItemForm.text || ""}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, text: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    onClick={addHighlight}
                    className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Highlights List */}
              <div className="space-y-3">
                {creativeData.Notification.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-gray-800 flex-1 mr-3">
                      {highlight}
                    </span>
                    <button
                      onClick={() => deleteHighlight(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hero Banners Section */}
          {activeTab === "heroBanners" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Hero Banners
                </h2>
                <span className="text-sm text-gray-500">
                  {creativeData.Banner.length} items
                </span>
              </div>

              {/* Add New Banner */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium text-gray-700 mb-4">
                  Add New Banner
                </h3>

                <div className="space-y-6">
                  {/* Banner Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Banner Image
                    </label>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <div className="lg:col-span-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e.target.files[0], "image")
                          }
                          className="hidden"
                          id="banner-upload"
                        />

                        <label
                          htmlFor="banner-upload"
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer w-full"
                        >
                          <Upload className="w-4 h-4" />
                          Browse Image
                        </label>

                        {newItemForm.imageName && (
                          <p className="text-sm text-gray-600 mt-2 text-center break-words">
                            {newItemForm.imageName}
                          </p>
                        )}
                      </div>

                      {newItemForm.imagePreview && (
                        <div className="lg:col-span-2">
                          <div className="border rounded-lg overflow-hidden bg-white">
                            <img
                              src={newItemForm.imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Banner Title / Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Banner Title / Text
                    </label>
                    <input
                      type="text"
                      placeholder="Enter banner title or short text"
                      value={newItemForm.text || ""}
                      onChange={(e) =>
                        setNewItemForm((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-start">
                    <button
                      onClick={addHeroBanner}
                      className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Add Banner
                    </button>
                  </div>
                </div>
              </div>

              {/* Banners Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creativeData.Banner.map((banner, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image + Title Section */}
                    <div className="bg-gray-100">
                      <img
                        src={API_URL + banner.image}
                        alt={banner.alt || "Hero banner image"}
                        className="w-full h-60 object-cover"
                      />
                      {banner.Text && (
                        <h3 className="text-center text-lg font-semibold text-gray-800 py-2">
                          {banner.Text}
                        </h3>
                      )}
                    </div>

                    {/* Delete Button Section */}
                    <div className="p-4">
                      <button
                        onClick={() => deleteHeroBanner(index)}
                        className="w-full px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creators Section */}
          {activeTab === "creators" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Spotlight
                </h2>
                <span className="text-sm text-gray-500">
                  {creativeData.Spotlight.length} items
                </span>
              </div>

              {/* Add New Creator */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium text-gray-700 mb-4">
                  Add New Creator
                </h3>
                <div className="space-y-6">
                  {/* Username and Link inputs */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Username (e.g., @username)..."
                        value={newItemForm.username || ""}
                        onChange={(e) =>
                          setNewItemForm({
                            ...newItemForm,
                            username: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Creator Link
                      </label>
                      <input
                        type="text"
                        placeholder="Creator link..."
                        value={newItemForm.href || ""}
                        onChange={(e) =>
                          setNewItemForm({ ...newItemForm, href: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Video File *
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleFileUpload(e.target.files[0], "video")
                        }
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer w-full sm:w-auto"
                      >
                        <Upload className="w-4 h-4" />
                        Browse Video
                      </label>
                      {newItemForm.videoName && (
                        <span className="text-sm text-gray-600 break-words">
                          {newItemForm.videoName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-start">
                    <button
                      onClick={addCreator}
                      className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Add Creator
                    </button>
                  </div>
                </div>
              </div>

              {/* Creators Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creativeData.Spotlight.map((creator, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-100 flex items-center justify-center">
                      <video
                        src={API_URL + creator.video}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-800 mb-1">
                        {creator.username}
                      </p>
                      <a
                        href={creator.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:underline break-words mb-4"
                      >
                        {creator.link || "View Profile"}
                      </a>
                      <button
                        onClick={() => deleteCreator(index)}
                        className="w-full px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hot Products Section */}
          {activeTab === "hotProducts" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Hot Products
                </h2>
                <span className="text-sm text-gray-500">
                  {creativeData.Advertisement.length} items
                </span>
              </div>

              {/* Add New Product */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium text-gray-700 mb-4">
                  Add New Product
                </h3>
                <div className="space-y-6">
                  {/* Product Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Product Image *
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      <div className="lg:col-span-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e.target.files[0], "image")
                          }
                          className="hidden"
                          id="product-upload"
                        />
                        <label
                          htmlFor="product-upload"
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer w-full"
                        >
                          <Upload className="w-4 h-4" />
                          Browse Image
                        </label>
                        {newItemForm.imageName && (
                          <p className="text-sm text-gray-600 mt-2 text-center break-words">
                            {newItemForm.imageName}
                          </p>
                        )}
                      </div>
                      {newItemForm.imagePreview && (
                        <div className="lg:col-span-2">
                          <div className="border rounded-lg overflow-hidden bg-white">
                            <img
                              src={newItemForm.imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Title and Link */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        placeholder="Product title..."
                        value={newItemForm.title || ""}
                        onChange={(e) =>
                          setNewItemForm({
                            ...newItemForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Link
                      </label>
                      <input
                        type="text"
                        placeholder="Product link..."
                        value={newItemForm.href || ""}
                        onChange={(e) =>
                          setNewItemForm({ ...newItemForm, href: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-start">
                    <button
                      onClick={addHotProduct}
                      className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Add Product
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creativeData.Advertisement.map((product, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <img
                        src={API_URL + product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-800 mb-1">
                        {product.title}
                      </p>

                      <p className="text-xs text-gray-500 mb-3 truncate">
                        {product.link || "No link provided"}
                      </p>
                      <button
                        onClick={() => deleteHotProduct(index)}
                        className="w-full px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativesSection;