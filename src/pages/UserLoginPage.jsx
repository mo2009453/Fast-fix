import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ShieldCheck, BadgeCheck, ThumbsUp } from 'lucide-react';

const motivationalQuotes = [
  {
    text: "نحن نؤمن أن الثقة أساس كل علاقة ناجحة.",
    icon: ShieldCheck
  },
  {
    text: "الاحتراف هو وعدنا، والجودة هي التزامنا.",
    icon: BadgeCheck
  },
  {
    text: "الأمانة ليست خيارًا، بل أسلوب حياة.",
    icon: ThumbsUp
  }
];

const UserLoginPage = () => {
  const navigate = useNavigate();
  const { loginUser, registerUser } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % motivationalQuotes.length);
    }, 7000); // 7 ثواني
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

  const CurrentIcon = motivationalQuotes[quoteIndex].icon;

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <div className="absolute top-20 text-center px-4">
        <motion.div
          key={quoteIndex}
          className="flex items-center justify-center space-x-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <CurrentIcon className="w-8 h-8 text-emerald-400 drop-shadow" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
            {motivationalQuotes[quoteIndex].text}
          </h2>
        </motion.div>
      </div>

      <motion.div
        className="z-10 w-full max-w-md shadow-2xl glass-effect"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white">User Portal</CardTitle>
            <CardDescription className="text-gray-300">Access your account or create a new one.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="login" className="text-white"><LogIn className="mr-2 h-4 w-4" />Login</TabsTrigger>
                <TabsTrigger value="register" className="text-white"><UserPlus className="mr-2 h-4 w-4" />Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <Input id="login-email" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Password</Label>
                    <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                    <LogIn className="mr-2 h-5 w-5" /> Sign In
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register" className="mt-6">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-white">Full Name</Label>
                    <Input id="register-name" placeholder="John Doe" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white">Email</Label>
                    <Input id="register-email" type="email" placeholder="you@example.com" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white">Password</Label>
                    <Input id="register-password" type="password" placeholder="••••••••" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3">
                    <UserPlus className="mr-2 h-5 w-5" /> Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserLoginPage;