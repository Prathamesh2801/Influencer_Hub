import { useNavigate, useSearchParams } from "react-router-dom";
import CreateNewCredentials from "./CreateNewCredentials";
import CredentialRecords from "./CredentialRecords";

export default function CredentialSection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get("view") || "display";

  // Handle navigation between event views
  const toggleEventView = () => {
    const newView = currentView === "display" ? "create" : "display";
    navigate(`/dashboard?tab=credentials&view=${newView}`);
  };

  return (
    <div>
      {/* Button to toggle between views */}
      <div className="border-b  border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-6">
        <h3 className="text-xl font-bold text-[#E4007C]">
          {currentView === "create"
            ? "Create New Credential"
            : currentView === "viewCredential"
            ? "View Event Details"
            : "All Records"}
        </h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={toggleEventView}
            className="inline-flex items-center rounded-2xl bg-[#E4007C] px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-gradient-to-br from-[#E80071] via-[#EF3F8F] to-[#D53C2F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {currentView === "display"
              ? "Create New Credential"
              : currentView === "viewCredential"
              ? "Back to Credentials"
              : "Display All Credentials"}
          </button>
        </div>
      </div>

      {/* Render the appropriate component based on the currentView */}
      {currentView === "create" ? (
        <CreateNewCredentials />
      ) : (
        <CredentialRecords />
      )}
    </div>
  );
}
