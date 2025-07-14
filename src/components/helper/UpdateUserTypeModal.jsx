import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getAllCredentials } from "../../api/SuperAdmin/Credentials";

export default function UpdateUserTypeModal({
  isOpen,
  onClose,
  onConfirm,
  username,
}) {
  const [userType, setUserType] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [coordinatorList, setCoordinatorList] = useState([]);
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setUserType("");
      setCoordinatorName("");
      setSearchTerm("");
      setDropdownOpen(false);
      setError("");
      setCoordinatorList([]);
      setFilteredCoordinators([]);
    }
  }, [isOpen]);

  // Fetch coordinators when userType changes
  useEffect(() => {
    if (userType && (userType === "Premium" || userType === "Core")) {
      fetchCoordinators(userType);
    }
  }, [userType]);

  // Filter coordinators based on search term
  useEffect(() => {
    if (searchTerm && searchTerm !== coordinatorName) {
      const filtered = coordinatorList.filter((coord) =>
        coord.Username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoordinators(filtered);
      setDropdownOpen(true);
    } else {
      setFilteredCoordinators(coordinatorList);
      setDropdownOpen(false);
    }
  }, [searchTerm, coordinatorName, coordinatorList]);

  const fetchCoordinators = async (selectedUserType) => {
    try {
      setLoading(true);
      const response = await getAllCredentials(
        "Co-ordinator",
        selectedUserType
      );

      if (response.data.Status && response.data.Data) {
        setCoordinatorList(response.data.Data);
        setFilteredCoordinators(response.data.Data);
      } else {
        setCoordinatorList([]);
        setFilteredCoordinators([]);
      }
    } catch (err) {
      console.error("Error fetching coordinators:", err);
      setError("Failed to fetch coordinators");
      setCoordinatorList([]);
      setFilteredCoordinators([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!userType) {
      setError("Please select a user type");
      return;
    }

    if (!coordinatorName) {
      setError("Please select a coordinator");
      return;
    }

    onConfirm({
      userType,
      coordinatorName,
    });

    // Reset form
    setUserType("");
    setCoordinatorName("");
    setSearchTerm("");
    setDropdownOpen(false);
    setError("");
  };

  const handleCoordinatorSelect = (coordinator) => {
    setCoordinatorName(coordinator.Username);
    setSearchTerm(coordinator.Username);
    setDropdownOpen(false); // Hide dropdown after selection
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-semibold leading-6 text-gray-900"
              >
                Update User Type for {username}
              </Dialog.Title>

              <div className="mt-4">
                <div className="space-y-4">
                  {/* User Type Dropdown */}
                  <div>
                    <label
                      htmlFor="userType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      User Type
                    </label>
                    <select
                      id="userType"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select User Type</option>
                      <option value="Premium">Core 50</option>
                      <option value="Core">Core 250</option>
                    </select>
                  </div>

                  {/* Coordinator Search */}
                  {userType && (
                    <div>
                      <label
                        htmlFor="coordinator"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Coordinator
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="coordinator"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setDropdownOpen(true);
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder={
                            loading
                              ? "Loading coordinators..."
                              : "Search coordinators..."
                          }
                          disabled={loading}
                        />

                        {/* Coordinator Dropdown */}
                        {dropdownOpen && filteredCoordinators.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                            {filteredCoordinators.map((coordinator) => (
                              <button
                                key={coordinator.Username}
                                type="button"
                                onClick={() =>
                                  handleCoordinatorSelect(coordinator)
                                }
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                {coordinator.Username}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* No results message */}
                        {dropdownOpen &&
                          filteredCoordinators.length === 0 &&
                          !loading && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                              <p className="text-sm text-gray-500">
                                No coordinators found
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => {
                    setUserType("");
                    setCoordinatorName("");
                    setSearchTerm("");
                    setDropdownOpen(false);
                    setError("");
                    onClose();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Update User Type
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
