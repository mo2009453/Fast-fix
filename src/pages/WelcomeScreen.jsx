import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login/user'); // التحويل لصفحة تسجيل الدخول بعد 3 ثواني
    }, 3000);

    return () => clearTimeout(timer); // تنظيف التايمر عند الخروج
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4">مرحباً بك في Fast Fix</h1>
        <p className="text-lg">تقدر تحجز موعد صيانة في لحظات</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;