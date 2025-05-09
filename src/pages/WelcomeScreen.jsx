// WelcomeScreen.jsx
import React from 'react';

export default function WelcomeScreen({ onLogin, onSignup }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-white text-center p-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">مرحباً بك في Fast Fix</h1>
      <p className="text-lg text-gray-700 mb-8">تقدر تحجز موعد صيانة في لحظات</p>

      <div className="flex gap-4">
        <button
          onClick={onLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          تسجيل الدخول
        </button>
        <button
          onClick={onSignup}
          className="bg-gray-200 text-blue-700 px-6 py-2 rounded-xl shadow hover:bg-gray-300"
        >
          إنشاء حساب
        </button>
      </div>
    </div>
  );
}