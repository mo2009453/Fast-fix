import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';

const motivationalQuotes = [
  "نحن نؤمن أن الثقة أساس كل عمل ناجح.",
  "الاحتراف هو وعدنا، والجودة هي التزامنا.",
  "الأمانة ليست خيارًا، بل أسلوب حياة."
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
    }, 5000);
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

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white transition-all duration-500"
    >
      <div className="absolute top-20 text-center px-4">
        <motion.h2
          key={quoteIndex}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-white drop-shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {motivationalQuotes[quoteIndex]}
        </motion.h2>
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