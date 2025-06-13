import { useState, useEffect } from "react";
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
import Logo from "../../assets/img/logo.png";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import CredentialSection from "./CredentialSection";

import ReelsSection from "./ReelsSection";
import { LogOutIcon, UsersIcon } from "lucide-react";
import LeaderBoardRecords from "../LeaderBoard/LeaderBoardRecords";
import NotificationSection from "../Notifications/NotificationSection";
import { messaging, getToken, onMessage } from "../../config/firebaseConfig";
import { NotificationPermissionDialog } from "../Notifications/NotificationPermissionDialog";
import { Toast } from "../Notifications/Toast";
import { v4 as uuidv4 } from 'uuid';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get("tab") || "reels";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem("Role");
  const username = localStorage.getItem("Username");
  const navigate = useNavigate();
  const [fcmToken, setFcmToken] = useState("");
  const [toasts, setToasts] = useState([]);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const addToast = (type, title, message) => {
    const id = uuidv4();
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const checkNotificationPermission = () => {
    if (typeof Notification === "undefined") {
      addToast(
        "error",
        "Not Supported",
        "Notifications are not supported in this browser"
      );
      return;
    }

    const permission = Notification.permission;
    setNotificationPermission(permission);

    if (permission === "default") {
      setShowPermissionDialog(true);
    } else if (permission === "denied") {
      addToast(
        "warning",
        "Notifications Blocked",
        "Please enable notifications in your browser settings"
      );
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setShowPermissionDialog(false);

      if (permission === "granted") {
        addToast(
          "success",
          "Notifications Enabled",
          "You will now receive push notifications"
        );
        initializeFCM();
      } else if (permission === "denied") {
        addToast(
          "error",
          "Notifications Denied",
          "You have denied notification permissions"
        );
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      addToast(
        "error",
        "Permission Error",
        "Failed to request notification permission"
      );
      setShowPermissionDialog(false);
    }
  };

  const initializeFCM = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey:
          "BG1OVKCIK8kznhlzxPYPKJmhY3t1jQeMnryB99bo_8xEZNlol0jb86ZzUCV-rg-jPqx6Ge4Pkz4MxBAJpDUwH4A",
      });
      console.log("FCM Token:", token);
      setFcmToken(token);
      localStorage.setItem("fcmToken", token);

      addToast(
        "info",
        "FCM Token Generated",
        "Push notifications are now active"
      );
    } catch (error) {
      console.error("FCM token error:", error);
      addToast("error", "FCM Error", "Failed to initialize push notifications");
    }
  };

  const showNotificationToast = (notification) => {
    addToast("info", notification.title, notification.body);
  };

  useEffect(() => {
    // Check notification permission on component mount
    const timer = setTimeout(() => {
      checkNotificationPermission();
    }, 2000); // Wait 2 seconds before checking

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notificationPermission === "granted" && !fcmToken) {
      initializeFCM();
    }
  }, [notificationPermission, fcmToken]);

  useEffect(() => {
    if (notificationPermission === "granted") {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground Notification: ", payload);
        showNotificationToast(payload.notification);
      });

      return () => unsubscribe();
    }
  }, [notificationPermission]);

  const navigation = [
    {
      name: "Home",
      href: "#/dashboard?tab=reels",
      icon: HomeIcon,
      current: activeTab === "reels",
    },
    ...(role === "Admin"
      ? [
          {
            name: "Credentials",
            href: "#/dashboard?tab=credentials",
            icon: DocumentDuplicateIcon,
            current: activeTab === "credentials",
          },
        ]
      : []),
    {
      name: "Scoreboard",
      href: "#/dashboard?tab=leaderboard",
      icon: ChartBarIcon,
      current: activeTab === "leaderboard",
    },
    {
      name: "Notifications",
      href: "#/dashboard?tab=notifications",
      icon: BellIcon,
      current: activeTab === "notifications",
    },
  ];

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    navigate("/login"); // Navigate to login page
    addToast("info", "Logged Out", "You have been successfully logged out");
  };

  const userNavigation = [
    {
      name: "Sign out",
      icon: LogOutIcon,
      onClick: handleLogout,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "reels":
        return <ReelsSection />;
      case "credentials":
        return <CredentialSection />;
      case "leaderboard":
        return <LeaderBoardRecords />;
      case "notifications":
        return <NotificationSection />;
      default:
        return <ReelsSection />;
    }
  };

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0 data-[enter]:opacity-100 data-[leave]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition-transform duration-300 ease-in-out data-[closed]:-translate-x-full data-[enter]:translate-x-0 data-[leave]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 transition-opacity duration-300 ease-in-out data-[closed]:opacity-0 data-[enter]:opacity-100 data-[leave]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-[#E80071] via-[#EF3F8F] to-[#D53C2F] px-6 pb-4">
                <div className="flex mt-5 h-16 shrink-0 items-center">
                  <img
                    alt={"Your Company"}
                    src={Logo}
                    className="h-10 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                item.current
                                  ? "bg-gray-50 text-[#E4007C]"
                                  : "text-white hover:bg-gray-50 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? "text-[#E4007C]"
                                    : "text-white group-hover:text-indigo-600",
                                  "h-6 w-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 pb-4 bg-gradient-to-b from-[#E80071] via-[#EF3F8F] to-[#D53C2F]">
            <div className="flex h-16 shrink-0 items-center mt-5">
              <img alt="Your Company" src={Logo} className="h-10 w-auto" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-2">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-[#E4007C]"
                              : "text-white hover:bg-white/20 hover:text-white hover:backdrop-blur-md hover:shadow-md hover:border hover:border-white/30",
                            "group flex gap-x-3 rounded-lg p-2 text-sm leading-6 font-semibold transition duration-300 ease-in-out"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current ? "text-[#E4007C]" : "text-white",
                              "h-6 w-6 shrink-0"
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-200 lg:hidden"
            />

            <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-[#E4007C] hover:text-gray-500"
                  onClick={() => {
                    navigate("/dashboard?tab=notifications");
                  }}
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <UsersIcon
                      className="text-[#E4007C] hover:text-gray-500"
                      size={25}
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm leading-6 font-semibold text-[#E4007C]"
                      >
                        {username}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <button
                          onClick={item.onClick}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100 data-[focus]:bg-gray-100"
                        >
                          <item.icon className="h-4 w-4 text-red-500" />
                          {item.name}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{renderContent()}</div>
          </main>
        </div>
      </div>
      {/* Notification Permission Dialog */}
      <NotificationPermissionDialog
        isOpen={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
        onGrant={requestNotificationPermission}
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
