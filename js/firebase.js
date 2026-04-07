// firebase.js
// استيراد الوظائف المطلوبة من Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// إعدادات Firebase الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyD3PGZ-Z9pag2oypm_WgHGMjtd8l2V0GEk",
  authDomain: "sawaed-dbkm.firebaseapp.com",
  projectId: "sawaed-dbkm",
  storageBucket: "sawaed-dbkm.firebasestorage.app",
  messagingSenderId: "71570133695",
  appId: "1:71570133695:web:ce289c2654a1c7d9246c0a",
  measurementId: "G-KP9SNK87BQ"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تهيئة الخدمات التي قد تحتاجها
const analytics = getAnalytics(app);      // للتحليلات (اختياري)
const db = getFirestore(app);             // قاعدة البيانات
const auth = getAuth(app);                // المصادقة وتسجيل الدخول
const storage = getStorage(app);          // تخزين الملفات

// تصدير الخدمات لاستخدامها في أي مكان في مشروعك
export { app, analytics, db, auth, storage };