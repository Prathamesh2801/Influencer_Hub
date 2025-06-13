import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UserIcon,
  XMarkIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const NotificationPermissionDialog = ({ isOpen, onClose, onGrant }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <BellIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Enable Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Stay updated with important alerts
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-6">
            We'd like to send you notifications for important updates, new content, and system alerts. 
            You can change this setting anytime in your browser preferences.
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={onGrant}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#E80071] to-[#D53C2F] rounded-lg hover:from-[#D1006A] hover:to-[#C2351E] transition-all"
            >
              Enable Notifications
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};