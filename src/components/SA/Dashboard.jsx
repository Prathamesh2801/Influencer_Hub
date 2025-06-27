"use client";

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
  DocumentDuplicateIcon,
  HomeIcon,
  XMarkIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  WifiIcon,
  RectangleStackIcon,
  ChatBubbleLeftEllipsisIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import Logo from "../../assets/img/logo4.png";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import CredentialSection from "./CredentialSection";

import { LogOutIcon, UsersIcon, Download, X, Share } from "lucide-react";
import LeaderBoardRecords from "../LeaderBoard/LeaderBoardRecords";
import NotificationSection from "../Notifications/NotificationSection";
import { messaging, getToken, onMessage } from "../../config/firebaseConfig";
import { NotificationPermissionDialog } from "../Notifications/NotificationPermissionDialog";
import { Toast } from "../Notifications/Toast";
import { v4 as uuidv4 } from "uuid";
import { fetchAllReels } from "../../api/SuperAdmin/FetchAllReels";
import TaskSection from "../Tasks/TaskSection";
import ProfileSection from "../ProfileSection/ProfileSection";
import ReelsSection from "../ReelSection/ReelsSection";
import Home from "../Home/Home";
import FaqSection from "../FAQ/FaqSection";

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

  // PWA Install States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [installPromptAnimation, setInstallPromptAnimation] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const addToast = (type, title, message) => {
    const id = uuidv4();
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Enhanced browser and device detection
  useEffect(() => {
    const detectBrowserAndDevice = () => {
      const userAgent = navigator.userAgent;
      const vendor = navigator.vendor || "";

      // Detect iOS
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      setIsIOS(isIOSDevice);

      // Detect Safari (including iOS Safari)
      const isSafariBrowser =
        /Safari/.test(userAgent) &&
        /Apple Computer/.test(vendor) &&
        !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);
      setIsSafari(isSafariBrowser);

      console.log("Browser detection:", { isIOSDevice, isSafariBrowser });
    };

    detectBrowserAndDevice();
  }, []);

  // Enhanced standalone detection for all platforms
  useEffect(() => {
    const checkStandalone = () => {
      // Multiple ways to detect standalone mode
      const standaloneChecks = [
        // Standard PWA standalone detection
        window.matchMedia("(display-mode: standalone)").matches,
        // iOS Safari standalone
        window.navigator.standalone === true,
        // Android Chrome standalone
        document.referrer.includes("android-app://"),
        // Check if launched from home screen (iOS)
        window.location.search.includes("homescreen=1"),
        // Additional iOS check
        isIOS && window.screen.height === window.innerHeight,
      ];

      const isStandaloneMode = standaloneChecks.some((check) => check === true);

      // Additional check for Safari on iOS - if the status bar is hidden, likely standalone
      if (isSafari && isIOS && !isStandaloneMode) {
        const isLikelyStandalone =
          window.navigator.standalone ||
          window.screen.availHeight - window.innerHeight < 50;
        setIsStandalone(isLikelyStandalone);
      } else {
        setIsStandalone(isStandaloneMode);
      }

      console.log("Standalone detection:", {
        isStandaloneMode,
        checks: standaloneChecks,
        navigator_standalone: window.navigator.standalone,
        display_mode: window.matchMedia("(display-mode: standalone)").matches,
      });
    };

    checkStandalone();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => {
      console.log("Display mode changed");
      checkStandalone();
    };

    mediaQuery.addEventListener("change", handleChange);

    // Also check when page becomes visible (user returns from home screen)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(checkStandalone, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSafari, isIOS]);

  // PWA install prompt handling - Enhanced for all browsers
  useEffect(() => {
    // Don't show install prompts if already in standalone mode
    if (isStandalone) {
      console.log("App is in standalone mode, not showing install prompts");
      setShowInstallPrompt(false);
      setCanInstall(false);
      return;
    }

    let installPromptTimeout;

    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);

      // Show install prompt after a delay for browsers with native support
      installPromptTimeout = setTimeout(() => {
        checkAndShowInstallPrompt("native");
      }, 3000);
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      setCanInstall(false);
      setIsStandalone(true);
      localStorage.setItem("pwa_installed", "true");
      localStorage.setItem("install_prompt_shown", "false"); // Reset for next time
      addToast(
        "success",
        "App Installed",
        "App has been added to your home screen!"
      );
    };

    // Add listeners for all browsers
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Enhanced fallback for all browsers (not just Safari)
    const fallbackTimeout = setTimeout(() => {
      checkBrowserSupport();
    }, 4000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (installPromptTimeout) {
        clearTimeout(installPromptTimeout);
      }
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
    };
  }, [isStandalone]);

  const checkBrowserSupport = async () => {
    // Don't show if already in standalone mode
    if (isStandalone) {
      console.log("App is standalone, skipping browser support check");
      return;
    }

    const isInstalled = localStorage.getItem("pwa_installed");
    const promptCount = Number.parseInt(
      localStorage.getItem("install_prompt_count") || "0"
    );

    console.log("Browser support check:", {
      isInstalled,
      promptCount,
    });

    // Only check if installed or max attempts reached
    if (isInstalled === "true" || promptCount >= 3) {
      console.log("Skipping prompt - installed or too many attempts");
      return;
    }

    // Detect browser capabilities
    const userAgent = navigator.userAgent;
    const isChrome =
      /Chrome/.test(userAgent) &&
      /Google Inc/.test(navigator.vendor) &&
      !/Edg/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isOpera = /OPR/.test(userAgent);
    const isSamsungBrowser = /SamsungBrowser/.test(userAgent);

    console.log("Browser detection:", {
      isChrome,
      isEdge,
      isFirefox,
      isOpera,
      isSamsungBrowser,
      isSafari,
      isIOS,
      userAgent: userAgent.substring(0, 100) + "...",
    });

    // Show prompt for PWA-capable browsers
    if (
      isChrome ||
      isEdge ||
      isFirefox ||
      isOpera ||
      isSamsungBrowser ||
      isSafari ||
      isIOS
    ) {
      console.log("Browser supports PWA, showing install prompt");
      setCanInstall(true);

      // Shorter delay for better user experience
      setTimeout(() => {
        checkAndShowInstallPrompt("fallback");
      }, 1000);
    } else {
      console.log("Browser may not support PWA installation");
    }
  };

  const checkAndShowInstallPrompt = async (source = "unknown") => {
    console.log(`checkAndShowInstallPrompt called from: ${source}`);

    // Double-check standalone status before showing prompt
    if (isStandalone) {
      console.log("App is standalone, not showing install prompt");
      return;
    }

    try {
      const promptCount = Number.parseInt(
        localStorage.getItem("install_prompt_count") || "0"
      );

      console.log("Prompt check conditions:", {
        promptCount,
        maxAttempts: 5,
        source,
      });

      // Only check max attempts
      if (promptCount >= 5) {
        console.log("Max prompt attempts reached");
        return;
      }

      console.log("Showing install prompt");

      // Show the prompt
      setShowInstallPrompt(true);
      setInstallPromptAnimation(true);

      // Track prompt shown
      localStorage.setItem("install_prompt_shown", "true");
      localStorage.setItem(
        "install_prompt_count",
        (promptCount + 1).toString()
      );

      console.log("Install prompt displayed, updated localStorage");
    } catch (error) {
      console.error("Error checking install prompt status:", error);
    }
  };

  const handleInstallApp = async () => {
    console.log("handleInstallApp called", {
      deferredPrompt: !!deferredPrompt,
      isSafari,
      isIOS,
    });

    try {
      if (deferredPrompt && !isSafari && !isIOS) {
        // Native browser install prompt (Chrome, Edge, etc.)
        console.log("Using native install prompt");

        const promptResult = deferredPrompt.prompt();
        console.log("Prompt triggered");

        const choiceResult = await deferredPrompt.userChoice;
        console.log("User choice:", choiceResult.outcome);

        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
          localStorage.setItem("pwa_installed", "true");
          localStorage.removeItem("install_prompt_count"); // Reset counter on successful install
          addToast(
            "success",
            "Installing App",
            "App is being added to your home screen..."
          );
        } else {
          console.log("User dismissed the install prompt");
          addToast(
            "info",
            "Install Cancelled",
            "You can install the app later from the browser menu"
          );
        }

        setDeferredPrompt(null);
      } else if (isSafari || isIOS) {
        // Safari/iOS specific instructions
        console.log("Showing Safari install instructions");
        addToast(
          "info",
          "Install Instructions",
          `Tap the Share button ${String.fromCharCode(
            0x2b06
          )} then select "Add to Home Screen"`
        );
      } else {
        // Fallback for other browsers that might support PWA
        console.log("Showing generic install instructions");
        addToast(
          "info",
          "Install Instructions",
          "Look for 'Install app' or 'Add to Home Screen' in your browser menu (⋮ or ⋯)"
        );
      }

      handleDismissPrompt();
    } catch (error) {
      console.error("Error during installation:", error);
      addToast(
        "error",
        "Install Error",
        "Failed to install the app. Please try using your browser menu."
      );
      handleDismissPrompt();
    }
  };

  const handleDismissPrompt = async () => {
    console.log("Dismissing install prompt");

    try {
      const dismissCount = Number.parseInt(
        localStorage.getItem("install_dismiss_count") || "0"
      );
      localStorage.setItem(
        "install_dismiss_count",
        (dismissCount + 1).toString()
      );

      setInstallPromptAnimation(false);
      setTimeout(() => {
        setShowInstallPrompt(false);
      }, 300);

      console.log("Install prompt dismissed");
    } catch (error) {
      console.error("Error handling dismiss:", error);
    }
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
      // console.log("FCM Token:", token);
      await fetchAllReels(token);
      setFcmToken(token);
      localStorage.setItem("fcmToken", token);

      // addToast(
      //   "info",
      //   "FCM Token Generated",
      //   "Push notifications are now active"
      // );
    } catch (error) {
      console.error("FCM token error:", error);
      // addToast(
      //     "error",
      //     error.response?.data?.Message,
      //     "Failed to Fetch Data"
      //   );
    }
  };

  const showNotificationToast = (notification) => {
    addToast("info", notification.title, notification.body);
  };

  useEffect(() => {
    // Check notification permission on component mount
    const timer = setTimeout(() => {
      checkNotificationPermission();
    }, 2000);

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
      href: "#/dashboard?tab=home",
      icon: HomeIcon,
      current: activeTab === "home",
    },
    {
      name: "Reels",
      href: "#/dashboard?tab=reels",
      icon: VideoCameraIcon,
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
      name: "Task Section",
      href: "#/dashboard?tab=task",
      icon: RectangleStackIcon,
      current: activeTab === "task",
    },

    {
      name: "LeaderBoard",
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
    {
      name: "FAQ",
      href: "#/dashboard?tab=faq",
      icon: ChatBubbleLeftEllipsisIcon,
      current: activeTab === "faq",
    },
  ];

  const handleRedirectProfile = () => {
    navigate("/dashboard?tab=profile");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    addToast("info", "Logged Out", "You have been successfully logged out");
  };

  const userNavigation = [
    {
      name: "Profile",
      icon: UsersIcon,
      onClick: handleRedirectProfile,
    },
    {
      name: "Sign out",
      icon: LogOutIcon,
      onClick: handleLogout,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "reels":
        return <ReelsSection />;
      case "task":
        return <TaskSection />;
      case "credentials":
        return <CredentialSection />;
      case "leaderboard":
        return <LeaderBoardRecords />;
      case "notifications":
        return <NotificationSection />;
      case "profile":
        return <ProfileSection />;
      case "faq":
        return <FaqSection />;
      default:
        return <Home />;
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

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-[#fdcaf7] to-[#E80071] px-6 pb-4">
                <div className="flex mt-5 h-16 shrink-0 items-center">
                  <img
                    alt={"Your Company"}
                    src={Logo || "/placeholder.svg"}
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
                                    : "text-white ",
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
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 pb-4 bg-gradient-to-b from-[#fdcaf7] to-[#E80071] ">
            <div className="flex h-16 shrink-0 items-center mt-5">
              <img
                alt="Your Company"
                src={Logo || "/placeholder.svg"}
                className="h-8 w-auto"
              />
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

                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5 max-w-[180px] sm:max-w-[220px]">
                    <span className="sr-only">Open user menu</span>

                    <UsersIcon
                      className="text-[#E4007C] hover:text-gray-500"
                      size={25}
                    />

                    <span className="ml-2 flex items-center space-x-2 overflow-hidden">
                      <span
                        aria-hidden="true"
                        className="text-sm leading-6 font-semibold text-[#E4007C] truncate"
                      >
                        {username}
                      </span>

                      <ChevronDownIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-400"
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

          <main className="md:py-2 md:px-4 ">{renderContent()}</main>
        </div>
      </div>

      {/* PWA Install Prompt Modal - Only show if not in standalone mode */}
      {showInstallPrompt && !isStandalone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className={`
              bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out
              ${
                installPromptAnimation
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0"
              }
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E80071] to-[#EF3F8F] rounded-xl flex items-center justify-center shadow-lg">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Install App
                  </h3>
                  <p className="text-sm text-gray-500">Add to Home Screen</p>
                </div>
              </div>
              <button
                onClick={handleDismissPrompt}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-2">
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Install this app on your device for a better experience with
                faster loading, push notifications, and offline access.
              </p>

              {/* Safari-specific instructions */}
              {(isSafari || isIOS) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Share className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Safari Installation Steps:
                      </p>
                      <ol className="text-xs text-blue-800 space-y-1">
                        <li>1. Tap the Share button (⬆️) in Safari</li>
                        <li>2. Scroll down and tap "Add to Home Screen"</li>
                        <li>3. Tap "Add" to confirm</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <BoltIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Faster loading times
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BellIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Push notifications
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <WifiIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Works offline
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 p-6 pt-2 border-t border-gray-100">
              <button
                onClick={handleDismissPrompt}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleInstallApp}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#E80071] to-[#EF3F8F] hover:from-[#D1006A] hover:to-[#E03688] rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isSafari || isIOS ? (
                  <>
                    <Share className="w-4 h-4" />
                    <span>Install Guide</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Add to Home</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
