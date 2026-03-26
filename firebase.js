// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyA4ax1cmN5dqND4Jyzt9RKVTopEF8DA-h8",
    authDomain: "st-marys-assessment-port-f13d8.firebaseapp.com",
    projectId: "st-marys-assessment-port-f13d8",
    storageBucket: "st-marys-assessment-port-f13d8.firebasestorage.app",
    messagingSenderId: "641013997334",
    appId: "1:641013997334:web:31b60d368e4a8965afba37",
    measurementId: "G-X91VKJCP5T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);