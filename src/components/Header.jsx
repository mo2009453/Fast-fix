
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wrench, LogIn, LogOut, User, Briefcase, LayoutDashboard, ShoppingBag, Shield, Sun, Moon, Languages } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";


const Header = () => {
  const { user, technician, admin, logoutUser, logoutTechnician, logoutAdmin, isAuthenticated, isUser, isTechnician, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (user) logoutUser();
    if (technician) logoutTechnician();
    if (admin) logoutAdmin();
    navigate('/');
  };

  const getGreeting = () => {
    let name = "";
    if (user) name = user.name.split(' ')[0];
    if (technician) name = technician.name.split(' ')[0];
    if (admin) name = admin.name;
    
    if (user) return t('greetingUser').replace('{name}', name);
    if (technician) return t('greetingTech').replace('{name}', name);
    if (admin) return t('greetingAdmin').replace('{name}', name);
    return "";
  }

  return (
    <motion.header 
      className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-40"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 15 }}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Wrench className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-gradient-primary">{t('appName')}</span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/">{t('home')}</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={language} onValueChange={changeLanguage}>
                <DropdownMenuRadioItem value="en">{t('english')}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ar">{t('arabic')}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t('theme')}>
            {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2 sm:px-3">
                  {isUser && <User className="mr-0 sm:mr-2 h-5 w-5" />}
                  {isTechnician && <Briefcase className="mr-0 sm:mr-2 h-5 w-5" />}
                  {isAdmin && <Shield className="mr-0 sm:mr-2 h-5 w-5" />}
                  <span className="hidden sm:inline">{getGreeting()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.name || technician?.name || admin?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {isUser && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/user/dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>{t('myDashboard')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/book-service')}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>{t('bookService')}</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  {isTechnician && technician.approved === true && (
                    <DropdownMenuItem onClick={() => navigate('/technician/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('techDashboard')}</span>
                    </DropdownMenuItem>
                  )}
                   {isTechnician && technician.approved === false && (
                    <DropdownMenuItem onClick={() => navigate('/technician/pending-approval')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('applicationStatus')}</span>
                    </DropdownMenuItem>
                  )}
                  {isTechnician && technician.approved === 'rejected' && (
                    <DropdownMenuItem onClick={() => navigate('/technician/application-rejected')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('applicationStatus')}</span>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                     <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('adminDashboard')}</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-2 sm:px-3">
                  <LogIn className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">{t('loginRegister')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Access Your Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/login/user')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('userPortal')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/login/technician')}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>{t('techPortal')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
           {isUser && (
            <Button onClick={() => navigate('/book-service')} className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:inline-flex">
              {t('bookService')}
            </Button>
           )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
  