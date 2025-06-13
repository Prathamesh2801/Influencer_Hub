import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Users,
  Shield,
  User,
} from "lucide-react";
import {
  deleteCredentials,
  getAllCredentials,
  updatePassword,
} from "../../api/SuperAdmin/Credentials";
import { WrenchScrewdriverIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "../helper/ConfirmModal";
import EditPasswordModal from "../helper/EditPasswordModal";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper();

export default function CredentialRecords() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchCredentials() {
      try {
        setLoading(true);
        const response = await getAllCredentials();

        if (response.data.Status && response.data.Data) {
          setData(response.data.Data);
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        setError("Failed to fetch credentials");
        console.error("Error fetching credentials:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCredentials();
  }, []);

  const handleDeleteConfirmed = async () => {
    setShowDeleteModal(false);
    const username = pendingDelete;

    toast.promise(
      deleteCredentials(username)
        .then((res) => {
          console.log("Delete response:", res);

          if (res.data.Status) {
            setData((prev) =>
              prev.filter((user) => user.Username !== username)
            );
            return res.data.Message || "User deleted successfully";
          } else {
            throw new Error(res.data.Message || "Failed to delete user");
          }
        })
        .catch((error) => {
          console.error("Delete error:", error);

          const serverMsg =
            error?.response?.data?.Message || error.message || "Unknown error";

          // Return as Error object so toast.promise can use .message
          throw new Error(serverMsg);
        }),
      {
        loading: "Deleting...",
        success: (msg) => msg,
        error: (err) => err.message || "Failed to delete!",
      }
    );

    setPendingDelete(null);
  };

  // Define table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor("Username", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-semibold text-[#E4007C] hover:text-[#F06292] transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <User className="w-4 h-4" />
            Username
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
        ),
        cell: ({ getValue }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {getValue().charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-900">{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("role", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 font-semibold text-[#E4007C] hover:text-[#F06292] transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Shield className="w-4 h-4" />
            Role
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
        ),
        cell: ({ getValue }) => {
          const role = getValue();
          const roleStyles = {
            "Super Admin": "bg-red-100 text-red-800 border-red-200",
            Admin: "bg-yellow-100 text-yellow-800 border-yellow-200",
            Client: "bg-green-100 text-green-800 border-green-200",
          };

          return (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                roleStyles[role] || "bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {role}
            </span>
          );
        },
      }),
      columnHelper.accessor("action", {
        header: () => (
          <div className="flex items-center gap-2 font-semibold text-[#E4007C]">
            <WrenchScrewdriverIcon className="w-4 h-4" />
            Actions
          </div>
        ),
        cell: ({ row }) => {
          const username = row.original.Username;

          return (
            <div className="flex items-center  gap-10">

            <button
              onClick={() => {
                setSelectedUser(username);
                setShowEditModal(true);
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Change Password"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setPendingDelete(username);
                setShowDeleteModal(true);
              }}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Delete User"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            </div>
          );
        },
      }),
    ],
    []
  );

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading credentials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600 mb-4">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-red-800 font-semibold text-lg mb-2">
          Error Loading Data
        </p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-[#F06292]" />
          <h1 className="text-2xl font-bold text-[#E4007C]">
            Credential Records
          </h1>
        </div>
        <p className="text-[#F06292]">Manage and view all user credentials</p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border  border-[#E4007C] rounded-lg focus:ring-1 outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-[#E4007C] rounded-lg px-3 py-2 text-sm focus:ring-1 outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-scroll sm:overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#FFC3E2]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-medium text-[#E4007C] uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr  >
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No credentials found
                    </p>
                    <p className="text-gray-400">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors even:bg-[#FFF1F7]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPendingDelete(null);
        }}
        onConfirm={handleDeleteConfirmed}
        username={pendingDelete}
      />
      <EditPasswordModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}        onConfirm={async (newPassword) => {
          try {
            const response = await updatePassword(selectedUser, newPassword);
            if (response.data.Status) {
              toast.success(response.data.Message || "Password updated successfully");
              setShowEditModal(false);
              setSelectedUser(null);
            } else {
              throw new Error(response.data.Message || "Failed to update password");
            }
          } catch (err) {
            toast.error(err.message || "Failed to update password");
            console.error("Password update error:", err);
          }
        }}
        username={selectedUser}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from(
              { length: Math.min(5, table.getPageCount()) },
              (_, i) => {
                const pageIndex =
                  Math.max(
                    0,
                    Math.min(
                      table.getPageCount() - 5,
                      table.getState().pagination.pageIndex - 2
                    )
                  ) + i;
                return (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pageIndex === table.getState().pagination.pageIndex
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                );
              }
            )}
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
