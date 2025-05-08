
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('fastfix-language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('fastfix-language', language);
    // In a real app, you'd trigger a reload of translations or update a global i18n instance.
    // For now, we just store it. Components will need to use this context to render text.
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  
  // Example translation function (very basic)
  // In a real app, use a library like react-i18next
  const t = (key) => {
    const translations = {
      en: {
        home: "Home",
        userLogin: "User Login",
        techLogin: "Technician Login",
        adminLogin: "Admin Login",
        bookService: "Book a Service",
        appName: "FastFix",
        logout: "Logout",
        loginRegister: "Login/Register",
        userPortal: "User Portal",
        techPortal: "Technician Portal",
        myDashboard: "My Dashboard",
        techDashboard: "Technician Dashboard",
        adminDashboard: "Admin Dashboard",
        applicationStatus: "Application Status",
        english: "English",
        arabic: "Arabic",
        language: "Language",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        fastFixYourHome: "FastFix: Your Home, Fixed Fast.",
        reliableTech: "Reliable and professional technicians at your doorstep. Book appliance repairs, maintenance, and installations with ease.",
        findTech: "Find a Technician",
        howItWorks: "How It Works",
        step1Title: "1. Request Service",
        step1Desc: "Login, describe your issue, and pick a time. A small travel fee applies.",
        step2Title: "2. Get Matched",
        step2Desc: "A skilled technician accepts your job and heads your way. Track them in real-time!",
        step3Title: "3. Problem Solved!",
        step3Desc: "Your appliance is fixed. Rate your technician to help others.",
        joinFastFix: "Join FastFix Today!",
        joinDesc: "Are you a customer needing a repair, or a skilled technician looking for work?",
        needRepair: "I Need a Repair",
        iamTech: "I'm a Technician",
        greetingUser: "Hi, {name}!",
        greetingTech: "Tech: {name}",
        greetingAdmin: "Admin: {name}",
      },
      ar: {
        home: "الرئيسية",
        userLogin: "دخول المستخدم",
        techLogin: "دخول الفني",
        adminLogin: "دخول المسؤول",
        bookService: "احجز خدمة",
        appName: "فاست فيكس",
        logout: "تسجيل الخروج",
        loginRegister: "دخول/تسجيل",
        userPortal: "بوابة المستخدم",
        techPortal: "بوابة الفني",
        myDashboard: "لوحة التحكم",
        techDashboard: "لوحة تحكم الفني",
        adminDashboard: "لوحة تحكم المسؤول",
        applicationStatus: "حالة الطلب",
        english: "الإنجليزية",
        arabic: "العربية",
        language: "اللغة",
        theme: "السمة",
        light: "فاتح",
        dark: "داكن",
        fastFixYourHome: "فاست فيكس: بيتك، يصلح بسرعة.",
        reliableTech: "فنيون موثوقون ومحترفون على عتبة داركم. احجز إصلاحات الأجهزة والصيانة والتركيبات بسهولة.",
        findTech: "ابحث عن فني",
        howItWorks: "كيف يعمل",
        step1Title: "١. اطلب خدمة",
        step1Desc: "سجل الدخول، صف مشكلتك، واختر الوقت. تطبق رسوم انتقال بسيطة.",
        step2Title: "٢. احصل على فني",
        step2Desc: "فني ماهر يقبل عملك ويتوجه إليك. تتبعه في الوقت الفعلي!",
        step3Title: "٣. تم حل المشكلة!",
        step3Desc: "تم إصلاح جهازك. قيم الفني لمساعدة الآخرين.",
        joinFastFix: "انضم إلى فاست فيكس اليوم!",
        joinDesc: "هل أنت عميل بحاجة إلى إصلاح، أم فني ماهر تبحث عن عمل؟",
        needRepair: "أحتاج إلى إصلاح",
        iamTech: "أنا فني",
        greetingUser: "مرحباً، {name}!",
        greetingTech: "فني: {name}",
        greetingAdmin: "مسؤول: {name}",
      }
    };
    return translations[language]?.[key] || key;
  };


  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
  