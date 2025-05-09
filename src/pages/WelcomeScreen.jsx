import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login/user');
    }, 7000); // ← هنا عدلنا المدة إلى 7 ثواني
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-4 w-fit"
        >
          <Wrench size={48} className="text-yellow-300" />
        </motion.div>

        <h1 className="text-4xl font-extrabold mb-2">مرحباً بك في <span className="text-yellow-300">Fast Fix</span></h1>
        <p className="text-lg font-medium text-white/90">تقدر تحجز موعد صيانة في لحظات</p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;