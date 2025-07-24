import "react-toastify/dist/ReactToastify.css";

import { XMarkIcon } from "@heroicons/react/24/outline";

export default function FilterSection({
  filters,
  setFilters,
  coordinators,
  totalVideos,
  filteredCount,
  role,
  onUploadClick,
}) {
  return (
    <div className="bg-[#CCAFFD] border border-[#6f61ab]  rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
          {/* Search Input */}
          {role !== "Creator" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Creator
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-[#6f61ab] outline-none p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by username..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
              />
            </div>
          )}

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full rounded-md border border-[#6f61ab] p-2 outline-none text-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Status</option>
              <option value="0">Pending</option>
              <option value="1">Review</option>
              <option value="2">Approved</option>
              <option value="3">Rejected</option>
              <option value="4">Completed</option>
            </select>
          </div>

          {/* Search Task ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Task ID
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-[#6f61ab] outline-none p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task ID..."
              value={filters.taskId}
              onChange={(e) =>
                setFilters({ ...filters, taskId: e.target.value })
              }
            />
          </div>

          {/* Coordinator Filter */}
          {role !== "Creator" && role !== "Co-ordinator" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coordinator
              </label>
              <select
                className="w-full rounded-md border border-[#6f61ab] p-2 outline-none text-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.coordinator}
                onChange={(e) =>
                  setFilters({ ...filters, coordinator: e.target.value })
                }
              >
                {coordinators.map((coord) => (
                  <option key={coord} value={coord}>
                    {coord === "all" ? "All Coordinators" : coord}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User Type Filter (Admin only) */}
          {role === "Admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <select
                className="w-full rounded-md border border-[#6f61ab] p-2 outline-none text-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.userType}
                onChange={(e) =>
                  setFilters({ ...filters, userType: e.target.value })
                }
              >
                <option value="all">All Users</option>
                <option value="Core">Core 250</option>
                <option value="Premium">Core 50</option>
              </select>
            </div>
          )}

          {/* Active VideoId Filter Tag */}
          {filters.VideoId && role == "Creator" && (
            <div className="flex items-center mb-4 space-x-2">
              <span className="px-3 py-1 bg-[#EDE9FE] rounded-full text-sm font-medium">
                Video ID: {filters.VideoId}
              </span>
              <button
                onClick={() => setFilters({ ...filters, VideoId: "" })}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex ">
        <div className="text-sm  text-black font-semibold">
          Showing {filteredCount} out of {totalVideos} videos
          {filters.searchQuery && ` matching "${filters.searchQuery}"`}
        </div>
      </div>
    </div>
  );
}
