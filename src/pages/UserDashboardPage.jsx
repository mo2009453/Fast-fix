
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ListChecks, Wallet, UserCircle, MapPin as MapPinIcon } from 'lucide-react';

const UserDashboardPage = () => {
  const { user, updateUserWallet } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadAmount, setLoadAmount] = useState(100);

  useEffect(() => {
    if (user) {
      const storedBookings = JSON.parse(localStorage.getItem('fastfix-bookings')) || [];
      setBookings(storedBookings.filter(b => b.userId === user.id).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } else {
      navigate('/login/user');
    }
  }, [user, navigate]);

  const handleLoadWallet = () => {
     if(loadAmount <=0) {
        alert("Please enter a positive amount to load.");
        return;
    }
    updateUserWallet(user.id, parseFloat(loadAmount));
    setLoadAmount(100);
  };

  if (!user) {
    return <div className="text-center py-10">Loading user data...</div>;
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl shadow-lg glass-effect">
        <UserCircle className="mx-auto h-24 w-24 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-gradient-primary">Welcome, {user.name}!</h1>
        <p className="text-xl text-muted-foreground">Manage your service requests and wallet.</p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{x: -50, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:0.2, duration:0.5}}>
        <Card className="shadow-xl glass-effect h-full">
          <CardHeader>
            <CardTitle className="flex items-center"><Wallet className="mr-2 h-6 w-6 text-primary"/> Your Wallet</CardTitle>
            <CardDescription>Current Balance: <span className="font-bold text-lg text-primary">EGP {user.walletBalance?.toFixed(2) || '0.00'}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loadAmount">Amount to Load (EGP)</Label>
              <Input id="loadAmount" type="number" value={loadAmount} onChange={(e) => setLoadAmount(parseFloat(e.target.value))} placeholder="Enter amount" min="1" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLoadWallet} className="w-full bg-accent hover:bg-accent/90">Load Balance</Button>
          </CardFooter>
        </Card>
        </motion.div>

        <motion.div initial={{x: 50, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:0.4, duration:0.5}}>
        <Card className="shadow-xl glass-effect h-full">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-6 w-6 text-primary"/>Recent Bookings</CardTitle>
            <CardDescription>View your past and current service requests.</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {bookings.map((booking, index) => (
                  <li key={index} className="p-4 border rounded-md bg-background/50 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-primary">{booking.deviceType}</h3>
                        <p className="text-sm text-muted-foreground">{booking.problemDescription.substring(0,50)}...</p>
                      </div>
                       <span className={`text-xs font-semibold px-2 py-1 rounded-full ${booking.status === 'completed' || booking.status === 'completed_by_technician' ? 'bg-green-200 text-green-800' : booking.status === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                        {booking.status.replace(/_/g, ' ').toUpperCase()}
                       </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Booked on: {new Date(booking.timestamp).toLocaleDateString()} at {booking.preferredTime}</p>
                    <p className="text-xs text-muted-foreground">Travel Fee Paid: EGP {booking.travelFeePaid.toFixed(2)}</p>
                    {booking.status === 'technician_assigned' && (
                        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => alert('Real-time tracking feature coming soon!')}>
                            <MapPinIcon className="mr-2 h-4 w-4" /> Track Technician
                        </Button>
                    )}
                    {booking.status === 'completed_by_technician' && (
                         <Button variant="default" size="sm" className="mt-2 w-full bg-green-600 hover:bg-green-700" onClick={() => alert('Rating feature coming soon!')}>
                            Rate Technician
                        </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">You have no bookings yet.</p>
            )}
          </CardContent>
          <CardFooter>
             <Button onClick={() => navigate('/book-service')} className="w-full bg-primary hover:bg-primary/90">Book New Service</Button>
          </CardFooter>
        </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserDashboardPage;
  