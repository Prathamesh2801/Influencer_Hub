import { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { getAllCredentials, AuthLogin } from "../../api/SuperAdmin/Credentials";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateNewCredentials() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Admin",
    userType: "",
    coordinator: "",
  });

  const [showUserType, setShowUserType] = useState(false);
  const [showCoordinator, setShowCoordinator] = useState(false);
  const [coordinators, setCoordinators] = useState([]);
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch coordinators on component mount
  useEffect(() => {
    const loadCoordinators = async () => {
      try {
        setIsLoading(true);
        const response = await getAllCredentials("Co-ordinator");

        if (response && response.data) {
          console.log("Coordinators loaded:", response.data);
          // Extract coordinator usernames from the response
          const coordinatorUsernames = response.data.Data.map(
            (coordinator) => coordinator.Username || coordinator.username
          );
          setCoordinators(coordinatorUsernames);
        }
      } catch (error) {
        console.error("Failed to load coordinators:", error);
        // toast.error("Failed to load coordinators");
        toast.error(err.response.data.Message || "Failed to load coordinators");
      } finally {
        setIsLoading(false);
      }
    };
    loadCoordinators();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      // const needsUserType = value === "Creator" || value === "Co‑ordinator";
      const needsUserType = value === "Creator" || value === "Co-ordinator";
      setShowUserType(needsUserType);
      setShowCoordinator(value === "Creator");
      setShowCoordinator(false);
      setFormData({
        ...formData,
        [name]: value,
        userType: "",
        coordinator: "", // Reset coordinator when role changes
      });
      setFilteredCoordinators([]);
      setIsSearching(false);
    } else if (name === "coordinator") {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Implement fuzzy search for Coordinator
      if (value.trim() === "") {
        setFilteredCoordinators([]);
        setIsSearching(false);
      } else {
        const filtered = coordinators.filter((coordinator) =>
          coordinator.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCoordinators(filtered);
        setIsSearching(true);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle coordinator selection from dropdown
  const handleCoordinatorSelect = (coordinator) => {
    setFormData({
      ...formData,
      coordinator,
    });
    setIsSearching(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (formData.role === "Creator" && !formData.coordinator.trim()) {
      toast.error("Coordinator is required for Creator role");
      return;
    }

    try {
      const response = await AuthLogin(
        formData.username,
        formData.password,
        formData.role,
        // only Creators (or Coordinators?) need a co-ordinator param
        formData.role === "Creator" ? formData.coordinator : null,
        // always send userType when role is Creator or Co-ordinator
        formData.role === "Creator" || formData.role === "Co-ordinator"
          ? formData.userType
          : null
      );

      if (response.status === 200 || response.data) {
        toast.success("Credential created successfully!");

        // Reset form
        setFormData({
          username: "",
          password: "",
          role: "Admin",
          coordinator: "",
        });
        setShowCoordinator(false);
        setFilteredCoordinators([]);
        setIsSearching(false);

        // Navigate back to credentials list
        setTimeout(() => {
          navigate("/dashboard?tab=credentials&view=display");
        }, 500);
      } else {
        toast.error(
          response?.response?.data?.message ||
            response?.response?.data?.Message ||
            "Failed to create credential "
        );
        // toast.error("Failed to create credential");
      }
    } catch (error) {
      console.error("Error creating credential:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.Message ||
          "Failed to create credential "
      );
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      username: "",
      password: "",
      role: "Admin",
      coordinator: "",
    });
    setShowCoordinator(false);
    setFilteredCoordinators([]);
    setIsSearching(false);

    // Navigate back to credentials list
    setTimeout(() => {
      navigate("/dashboard?tab=credentials&view=display");
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-bold text-[#E4007C]">Profile</h2>
          <p className="mt-1 text-6 text-[#F06292]">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-6 font-bold text-[#E4007C]"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#E4007C]">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base  placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="password"
                className="block text-6 font-bold text-[#E4007C]"
              >
                Password
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#E4007C]">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your Password"
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base  placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="role"
                className="block text-6 font-bold text-[#E4007C]"
              >
                Role
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[#E4007C] sm:text-sm/6"
                >
                  <option value="Admin">Admin</option>
                  <option value="Client">Client</option>
                  <option value="Co-ordinator">Co-ordinator</option>
                  <option value="Creator">Creator</option>
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>

            {showUserType && (
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-[#E4007C]">
                  User Type
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={async (e) => {
                    const ut = e.target.value;
                    setFormData((f) => ({ ...f, userType: ut }));
                    // fetch coordinators filtered by type:
                    setIsLoading(true);
                    const res = await getAllCredentials("Co-ordinator", ut);
                    const names = res.data.Data.map(
                      (c) => c.Username || c.username
                    );
                    setCoordinators(names);
                    setShowCoordinator(true);
                    setIsLoading(false);
                  }}
                  className="mt-2 w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select user type…</option>
                  <option value="Core">Core</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            )}

            {showCoordinator && formData.userType && (
              <div className="sm:col-span-4">
                <label
                  htmlFor="coordinator"
                  className="block text-sm/6 font-medium text-[#E4007C]"
                >
                  Coordinator
                </label>
                <div className="mt-2 relative">
                  <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#E4007C]">
                    <input
                      id="coordinator"
                      name="coordinator"
                      type="text"
                      value={formData.coordinator}
                      onChange={handleInputChange}
                      placeholder="Search for coordinator"
                      autoComplete="off"
                      className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-[#E4007C] placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      required
                    />
                  </div>

                  {/* Fuzzy search dropdown */}
                  {isSearching && filteredCoordinators.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <ul className="py-1">
                        {filteredCoordinators.map((coordinator, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 cursor-pointer"
                            onClick={() => handleCoordinatorSelect(coordinator)}
                          >
                            {coordinator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isSearching &&
                    filteredCoordinators.length === 0 &&
                    formData.coordinator.trim() !== "" && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
                        <p className="text-sm text-gray-500">
                          No matching coordinators found
                        </p>
                      </div>
                    )}

                  {isLoading && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
                      <p className="text-sm text-gray-500">
                        Loading coordinators...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={handleCancel}
          className="text-sm/6 font-semibold text-[#E4007C]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-[#E4007C] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#F06292] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
