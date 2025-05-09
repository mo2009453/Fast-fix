import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login/user');
    }, 7000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      
      {/* أشكال متحركة في الخلفية */}
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-2xl bottom-20 right-10 animate-ping"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-6 w-fit"
        >
          <Wrench size={60} className="text-yellow-400 drop-shadow-xl" />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-sm">
          مرحباً بك في <span className="text-yellow-400">Fast Fix</span>
        </h1>
        <p className="text-lg text-gray-300">تقدر تحجز موعد صيانة في لحظات</p>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;