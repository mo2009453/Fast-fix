
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from '@/pages/HomePage';
import UserLoginPage from '@/pages/UserLoginPage';
import TechnicianLoginPage from '@/pages/TechnicianLoginPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import ServiceBookingPage from '@/pages/ServiceBookingPage';
import UserDashboardPage from '@/pages/UserDashboardPage'; 
import TechnicianDashboardPage from '@/pages/TechnicianDashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


const PageLayout = ({ children }) => {
  const location = useLocation(); 
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const ProtectedRoute = ({ children, role }) => {
  const { user, technician, admin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    let loginPath = '/login/user';
    if (role === 'technician') loginPath = '/login/technician';
    if (role === 'admin') loginPath = '/login/admin';
    return <Navigate to={loginPath} replace />;
  }

  if (role === 'user' && !user) {
    return <Navigate to="/login/user" replace />;
  }
  if (role === 'technician' && !technician) {
    return <Navigate to="/login/technician" replace />;
  }
  if (role === 'admin' && !admin) {
    return <Navigate to="/login/admin" replace />;
  }
  
  if (role === 'technician' && technician && technician.approved === false) { 
     return <Navigate to="/technician/pending-approval" replace />;
  }
   if (role === 'technician' && technician && technician.approved === 'rejected') {
     return <Navigate to="/technician/application-rejected" replace />;
  }


  return children;
};

const AppContent = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
        <Route path="/login/user" element={<PageLayout><UserLoginPage /></PageLayout>} />
        <Route path="/login/technician" element={<PageLayout><TechnicianLoginPage /></PageLayout>} />
        <Route path="/login/admin" element={<PageLayout><AdminLoginPage /></PageLayout>} />
        
        <Route 
          path="/book-service" 
          element={
            <ProtectedRoute role="user">
              <PageLayout><ServiceBookingPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/dashboard" 
          element={
            <ProtectedRoute role="user">
              <PageLayout><UserDashboardPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/technician/dashboard" 
          element={
            <ProtectedRoute role="technician">
              <PageLayout><TechnicianDashboardPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute role="admin">
              <PageLayout><AdminDashboardPage /></PageLayout>
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/technician/pending-approval" 
          element={<PageLayout><TechnicianPendingApprovalPage /></PageLayout>} 
        />
        <Route 
          path="/technician/application-rejected" 
          element={<PageLayout><TechnicianApplicationRejectedPage /></PageLayout>} 
        />


      </Routes>
    </AnimatePresence>
  );
};

const TechnicianPendingApprovalPage = () => (
  <div className="text-center py-20">
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="max-w-lg mx-auto glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-primary">Application Submitted</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Thank you for registering! Your application and documents are currently under review by our admin team. 
            You will be notified once your account is approved. This may take 24-48 hours.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

const TechnicianApplicationRejectedPage = () => (
  <div className="text-center py-20">
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="max-w-lg mx-auto glass-effect border-destructive">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">Application Status: Rejected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            We regret to inform you that your technician application has been rejected at this time. 
            Please contact support if you believe this is an error or for more information.
          </p>
           <Button variant="link" className="mt-4" onClick={() => alert('Contact support: support@fastfix.com')}>Contact Support</Button>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);


function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/50">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <AppContent />
              </main>
              <Footer />
              <Toaster />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
  