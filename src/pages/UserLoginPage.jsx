import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';  // خاصية الترجمة

const phrases = [
  "الثقة أساس كل تعامل.",
  "نخدمك باحترافية وأمانة.",
  "جودة تليق بثقتك."
];

const UserLoginPage = () => {
  const { t, i18n } = useTranslation();  // إضافة الترجمة
  const navigate = useNavigate();
  const { loginUser, registerUser } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 8000); // كل 8 ثواني
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      loginUser({ email: loginEmail, password: loginPassword });
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      registerUser({ name: registerName, email: registerEmail, password: registerPassword });
      navigate('/');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // تغيير اللغة
  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen py-12 px-4 bg-gradient-to-tr from-[#0d1f2d] to-[#1f2937]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-lg bg-white/10 border border-white/10 relative">
        {/* رفع الجملة فوق البوكس */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={phrases[currentPhraseIndex]}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6 }}
              className="text-white text-xl font-semibold tracking-wide flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-6 h-6 text-green-400" />
              <span>{phrases[currentPhraseIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <CardHeader className="text-center mt-16">
          <CardTitle className="text-3xl text-white">{t("user_portal")}</CardTitle>  {/* ترجمات */}
          <CardDescription className="text-gray-300">{t("access_account")}</CardDescription>  {/* ترجمات */}
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("login")}</TabsTrigger>  {/* ترجمات */}
              <TabsTrigger value="register">{t("register")}</TabsTrigger>  {/* ترجمات */}
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white">{t("email")}</Label>  {/* ترجمات */}
                  <Input id="login-email" type="email" placeholder={t("email_placeholder")} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white">{t("password")}</Label>  {/* ترجمات */}
                  <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3">
                  <LogIn className="mr-2 h-5 w-5" /> {t("sign_in")}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-white">{t("full_name")}</Label>  {/* ترجمات */}
                  <Input id="register-name" placeholder="John Doe" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-white">{t("email")}</Label>  {/* ترجمات */}
                  <Input id="register-email" type="email" placeholder={t("email_placeholder")} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-white">{t("password")}</Label>  {/* ترجمات */}
                  <Input id="register-password" type="password" placeholder="••••••••" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                  <UserPlus className="mr-2 h-5 w-5" /> {t("create_account")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        {/* إضافة زر تغيير اللغة */}
        <div className="absolute bottom-4 right-4">
          <Button onClick={() => handleChangeLanguage('en')} className="mr-2 bg-blue-500 text-white">{t("english")}</Button>
          <Button onClick={() => handleChangeLanguage('ar')} className="bg-green-500 text-white">{t("arabic")}</Button>
        </div>
        
      </Card>
    </motion.div>
  );
};

export default UserLoginPage;