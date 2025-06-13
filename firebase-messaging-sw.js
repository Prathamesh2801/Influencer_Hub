importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyC9AopJqvy6xh8tTzjprSHldUKZkpKwXvw",
  authDomain: "influencerhub-24ac7.firebaseapp.com",
  projectId: "influencerhub-24ac7",
  storageBucket: "influencerhub-24ac7.firebasestorage.app",
  messagingSenderId: "1074407246164",
  appId: "1:1074407246164:web:f1df82a0abb681a5caa0c1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const { title, body, image, icon } = payload.notification;

  const notificationTitle = title || "New Notification";
  const notificationOptions = {
    body: body || "",
    icon: icon || "/logo.png", // fallback icon
    image: image || undefined,
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
