
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [admin, setAdmin] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('fastfix-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedTechnician = localStorage.getItem('fastfix-technician');
    if (storedTechnician) {
      setTechnician(JSON.parse(storedTechnician));
    }
    const storedAdmin = localStorage.getItem('fastfix-admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const loginUser = (userData) => {
    const mockUser = { 
      id: 'user123', 
      email: userData.email, 
      name: 'Test User', 
      walletBalance: parseFloat(localStorage.getItem('fastfix-user-user123-walletBalance')) || 200 
    };
    localStorage.setItem('fastfix-user', JSON.stringify(mockUser));
    setUser(mockUser);
    toast({ title: "User Login Successful", description: `Welcome back, ${mockUser.name}!` });
    return mockUser;
  };

  const registerUser = (userData) => {
    const userId = `user-${Date.now()}`;
    const newUser = { 
      id: userId, 
      email: userData.email, 
      name: userData.name || 'New User',
      walletBalance: 0
    };
    localStorage.setItem('fastfix-user', JSON.stringify(newUser));
    localStorage.setItem(`fastfix-user-${userId}-walletBalance`, '0');
    setUser(newUser);
    toast({ title: "User Registration Successful", description: `Welcome, ${newUser.name}!` });
    return newUser;
  };

  const logoutUser = () => {
    localStorage.removeItem('fastfix-user');
    setUser(null);
    toast({ title: "User Logout Successful" });
  };

  const updateUserWallet = (userId, amount) => {
    setUser(prevUser => {
      if (prevUser && prevUser.id === userId) {
        const newBalance = (prevUser.walletBalance || 0) + amount;
        const updatedUser = { ...prevUser, walletBalance: newBalance };
        localStorage.setItem('fastfix-user', JSON.stringify(updatedUser));
        localStorage.setItem(`fastfix-user-${userId}-walletBalance`, newBalance.toString());
        toast({ title: "Wallet Updated", description: `Your new balance is EGP ${newBalance.toFixed(2)}`});
        return updatedUser;
      }
      return prevUser;
    });
  };

  const loginTechnician = (techData) => {
    let storedTech = localStorage.getItem(`fastfix-technician-account-${techData.email}`);
    let techDetails;

    if (storedTech) {
        techDetails = JSON.parse(storedTech);
        if (techDetails.password !== techData.password) { // Plain text password check (unsafe, for demo only)
            toast({ title: "Login Failed", description: "Invalid credentials", variant: "destructive" });
            return null;
        }
    } else { // Fallback for initial mock technician
        if (techData.email === 'tech@example.com' && techData.password === 'password') {
             techDetails = { 
                id: 'tech456', 
                email: techData.email, 
                name: 'Test Technician', 
                expertise: 'Electronics',
                walletBalance: parseFloat(localStorage.getItem('fastfix-technician-tech456-walletBalance')) || 500,
                approved: true 
            };
            localStorage.setItem('fastfix-technician', JSON.stringify(techDetails)); // This is the active technician
        } else {
            toast({ title: "Login Failed", description: "Invalid credentials", variant: "destructive" });
            return null;
        }
    }
    
    setTechnician(techDetails);
    localStorage.setItem('fastfix-technician', JSON.stringify(techDetails)); // Set as active technician
    toast({ title: "Technician Login Successful", description: `Welcome back, ${techDetails.name}!` });
    return techDetails;
  };

  const registerTechnician = (techData) => {
    const techId = `tech-${Date.now()}`;
    const newTechnician = { 
      id: techId, 
      email: techData.email, 
      name: techData.name || 'New Technician', 
      expertise: techData.expertise || 'General',
      walletBalance: 0,
      address: techData.address,
      mobile: techData.mobile,
      documents: techData.documents, 
      approved: false,
      password: techData.password // Store password (unsafe, for demo only)
    };
    // Store the full technician account details separately for "DB"
    localStorage.setItem(`fastfix-technician-account-${techData.email}`, JSON.stringify(newTechnician));
    // Store wallet balance separately
    localStorage.setItem(`fastfix-technician-${techId}-walletBalance`, '0');
    
    // This sets the currently active technician in app state
    setTechnician(newTechnician); 
    localStorage.setItem('fastfix-technician', JSON.stringify(newTechnician));

    // Add to a list of all technicians for admin panel (simulated)
    let allTechnicians = JSON.parse(localStorage.getItem('fastfix-all-technicians')) || [];
    allTechnicians.push(newTechnician);
    localStorage.setItem('fastfix-all-technicians', JSON.stringify(allTechnicians));

    toast({ title: "Technician Registration Submitted", description: `Welcome, ${newTechnician.name}! Your application is under review.` });
    return newTechnician;
  };

  const logoutTechnician = () => {
    localStorage.removeItem('fastfix-technician');
    setTechnician(null);
    toast({ title: "Technician Logout Successful" });
  };
  
  const updateTechnicianWallet = (techId, amount) => {
    setTechnician(prevTechnician => {
      if (prevTechnician && prevTechnician.id === techId) {
        const newBalance = (prevTechnician.walletBalance || 0) + amount;
        const updatedTechnician = { ...prevTechnician, walletBalance: newBalance };
        localStorage.setItem('fastfix-technician', JSON.stringify(updatedTechnician)); // Active technician
        localStorage.setItem(`fastfix-technician-${techId}-walletBalance`, newBalance.toString());

        // Update in "all technicians" list as well
        let allTechnicians = JSON.parse(localStorage.getItem('fastfix-all-technicians')) || [];
        allTechnicians = allTechnicians.map(t => t.id === techId ? updatedTechnician : t);
        localStorage.setItem('fastfix-all-technicians', JSON.stringify(allTechnicians));
        
        // Update the specific account entry if it exists
        const techAccount = JSON.parse(localStorage.getItem(`fastfix-technician-account-${updatedTechnician.email}`));
        if (techAccount) {
            localStorage.setItem(`fastfix-technician-account-${updatedTechnician.email}`, JSON.stringify(updatedTechnician));
        }

        toast({ title: "Technician Wallet Updated", description: `Your new balance is EGP ${newBalance.toFixed(2)}`});
        return updatedTechnician;
      }
      return prevTechnician;
    });
  };

  const loginAdmin = (adminData) => {
    if (adminData.email === 'admin@fastfix.com' && adminData.password === 'admin123') {
      const adminDetails = { id: 'admin001', email: adminData.email, name: 'Admin User' };
      localStorage.setItem('fastfix-admin', JSON.stringify(adminDetails));
      setAdmin(adminDetails);
      toast({ title: "Admin Login Successful", description: "Welcome, Admin!" });
      return adminDetails;
    }
    toast({ title: "Admin Login Failed", description: "Invalid credentials", variant: "destructive" });
    return null;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('fastfix-admin');
    setAdmin(null);
    toast({ title: "Admin Logout Successful" });
  };
  
  const approveTechnicianApplication = (techId) => {
    let allTechnicians = JSON.parse(localStorage.getItem('fastfix-all-technicians')) || [];
    let techToUpdate = null;
    allTechnicians = allTechnicians.map(t => {
        if (t.id === techId) {
            techToUpdate = { ...t, approved: true };
            return techToUpdate;
        }
        return t;
    });
    localStorage.setItem('fastfix-all-technicians', JSON.stringify(allTechnicians));

    if (techToUpdate) {
        localStorage.setItem(`fastfix-technician-account-${techToUpdate.email}`, JSON.stringify(techToUpdate));
        // If this technician is the currently logged-in one, update their state
        if (technician && technician.id === techId) {
            setTechnician(techToUpdate);
            localStorage.setItem('fastfix-technician', JSON.stringify(techToUpdate));
        }
        toast({ title: "Technician Approved", description: `${techToUpdate.name}'s application has been approved.` });
    }
  };

  const rejectTechnicianApplication = (techId) => {
    let allTechnicians = JSON.parse(localStorage.getItem('fastfix-all-technicians')) || [];
    let techToUpdate = null;
    allTechnicians = allTechnicians.map(t => {
        if (t.id === techId) {
            techToUpdate = { ...t, approved: 'rejected' }; // Mark as rejected
            return techToUpdate;
        }
        return t;
    });
    localStorage.setItem('fastfix-all-technicians', JSON.stringify(allTechnicians));
    if (techToUpdate) {
        localStorage.setItem(`fastfix-technician-account-${techToUpdate.email}`, JSON.stringify(techToUpdate));
         if (technician && technician.id === techId) {
            setTechnician(techToUpdate); // Update state if it's the current tech
            localStorage.setItem('fastfix-technician', JSON.stringify(techToUpdate));
        }
        toast({ title: "Technician Rejected", description: `${techToUpdate.name}'s application has been rejected.` });
    }
  };


  const isAuthenticated = user !== null || technician !== null || admin !== null;
  const isUser = user !== null;
  const isTechnician = technician !== null;
  const isAdmin = admin !== null;


  return (
    <AuthContext.Provider value={{ 
      user, 
      technician, 
      admin,
      loginUser, 
      registerUser,
      logoutUser, 
      updateUserWallet,
      loginTechnician, 
      registerTechnician,
      logoutTechnician,
      updateTechnicianWallet,
      loginAdmin,
      logoutAdmin,
      approveTechnicianApplication,
      rejectTechnicianApplication,
      isAuthenticated,
      isUser,
      isTechnician,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
  