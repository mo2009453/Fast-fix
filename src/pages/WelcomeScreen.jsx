import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login/user'); // بعد 5 ثواني يتم تحويل المستخدم
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
    >
      <div className="text-center p-8 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold mb-4">مرحباً بك في Fast Fix</h1>
        <p className="text-xl">تقدر تحجز موعد صيانة في لحظات</p>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;