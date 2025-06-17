// Remove the imports and use direct importScripts
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyC9AopJqvy6xh8tTzjprSHldUKZkpKwXvw",
  authDomain: "influencerhub-24ac7.firebaseapp.com",
  projectId: "influencerhub-24ac7",
  storageBucket: "influencerhub-24ac7.firebasestorage.app",
  messagingSenderId: "1074407246164",
  appId: "1:1074407246164:web:f1df82a0abb681a5caa0c1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});