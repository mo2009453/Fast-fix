
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, ListOrdered, Wallet, UserCheck2, AlertTriangle } from 'lucide-react';

const MIN_BALANCE_TO_ACCEPT = 50; // EGP, example minimum balance
const COMMISSION_RATE = 0.15; // 15%

const TechnicianDashboardPage = () => {
  const { technician, updateTechnicianWallet } = useAuth();
  const navigate = useNavigate();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [loadAmount, setLoadAmount] = useState(100);

  useEffect(() => {
    if (technician) {
      const allBookings = JSON.parse(localStorage.getItem('fastfix-bookings')) || [];
      const relevantJobs = allBookings.filter(job => job.status === 'pending_technician_assignment' || (job.status === 'technician_assigned' && job.technicianId === technician.id) );
      setAvailableJobs(relevantJobs.filter(job => job.status === 'pending_technician_assignment'));
      setAcceptedJobs(relevantJobs.filter(job => job.status === 'technician_assigned' && job.technicianId === technician.id));
    } else {
      navigate('/login/technician');
    }
  }, [technician, navigate]);

  const handleAcceptJob = (jobId) => {
    if (!technician) return;

    if (technician.walletBalance < MIN_BALANCE_TO_ACCEPT) {
      alert(`Your wallet balance (EGP ${technician.walletBalance.toFixed(2)}) is below the minimum required (EGP ${MIN_BALANCE_TO_ACCEPT.toFixed(2)}) to accept new jobs. Please load your wallet.`);
      return;
    }
    
    const jobToEndorse = availableJobs.find(job => job.timestamp+job.userId === jobId); 
    if(!jobToEndorse) return;

    const commission = (jobToEndorse.travelFeePaid || 0) * COMMISSION_RATE; 
    
    updateTechnicianWallet(technician.id, -commission);

    const allBookings = JSON.parse(localStorage.getItem('fastfix-bookings')) || [];
    const updatedBookings = allBookings.map(job => {
      if (job.timestamp+job.userId === jobId) {
        return { ...job, status: 'technician_assigned', technicianId: technician.id, commissionDeducted: commission };
      }
      return job;
    });
    localStorage.setItem('fastfix-bookings', JSON.stringify(updatedBookings));

    setAvailableJobs(prev => prev.filter(job => job.timestamp+job.userId !== jobId));
    setAcceptedJobs(prev => [...prev, { ...jobToEndorse, status: 'technician_assigned', technicianId: technician.id, commissionDeducted: commission }]);

    alert(`Job accepted! EGP ${commission.toFixed(2)} (15% commission) has been deducted from your wallet.`);
  };

  const handleCompleteJob = (jobId) => {
     const jobToComplete = acceptedJobs.find(job => job.timestamp+job.userId === jobId);
     if(!jobToComplete) return;

     const allBookings = JSON.parse(localStorage.getItem('fastfix-bookings')) || [];
     const updatedBookings = allBookings.map(job => {
        if (job.timestamp+job.userId === jobId) {
            return { ...job, status: 'completed_by_technician' };
        }
        return job;
     });
     localStorage.setItem('fastfix-bookings', JSON.stringify(updatedBookings));
     setAcceptedJobs(prev => prev.filter(job => job.timestamp+job.userId !== jobId));
     alert('Job marked as completed! User will be notified to confirm.');
  };


  const handleLoadWallet = () => {
    if(loadAmount <=0) {
        alert("Please enter a positive amount to load.");
        return;
    }
    updateTechnicianWallet(technician.id, parseFloat(loadAmount));
    setLoadAmount(100);
  };

  if (!technician) {
    return <div className="text-center py-10">Loading technician data...</div>;
  }
  if (!technician.approved) {
    return <Navigate to="/technician/pending-approval" replace />;
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl shadow-lg glass-effect">
        <UserCheck2 className="mx-auto h-24 w-24 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-gradient-primary">Technician Dashboard</h1>
        <p className="text-xl text-muted-foreground">Welcome, {technician.name}! Manage your jobs and earnings.</p>
        <p className="text-sm text-muted-foreground">Expertise: {technician.expertise}</p>
      </section>

      {technician.walletBalance < MIN_BALANCE_TO_ACCEPT && (
        <div className="p-4 border border-red-500 bg-red-500/10 rounded-md flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div>
              <h4 className="font-semibold text-red-700">Low Wallet Balance</h4>
              <p className="text-sm text-red-600">
                Your wallet balance is EGP {technician.walletBalance.toFixed(2)}. You need at least EGP {MIN_BALANCE_TO_ACCEPT.toFixed(2)} to accept new service requests. Please load your wallet.
              </p>
            </div>
          </div>
      )}


      <div className="grid md:grid-cols-3 gap-8">
        <motion.div initial={{x: -50, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:0.2, duration:0.5}} className="md:col-span-1">
          <Card className="shadow-xl glass-effect h-full">
            <CardHeader>
              <CardTitle className="flex items-center"><Wallet className="mr-2 h-6 w-6 text-primary"/> Your Wallet</CardTitle>
              <CardDescription>Balance: <span className="font-bold text-lg text-primary">EGP {technician.walletBalance?.toFixed(2) || '0.00'}</span></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <Label htmlFor="loadAmountTech">Amount to Load (EGP)</Label>
                <Input id="loadAmountTech" type="number" value={loadAmount} onChange={(e) => setLoadAmount(parseFloat(e.target.value))} placeholder="Enter amount" min="1" />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleLoadWallet} className="w-full bg-accent hover:bg-accent/90">Load Balance</Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div initial={{y: 50, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.4, duration:0.5}} className="md:col-span-2">
          <Card className="shadow-xl glass-effect h-full">
            <CardHeader>
              <CardTitle className="flex items-center"><ListOrdered className="mr-2 h-6 w-6 text-primary"/>Available Service Requests</CardTitle>
              <CardDescription>Browse and accept new jobs. A 15% commission applies upon acceptance.</CardDescription>
            </CardHeader>
            <CardContent>
              {availableJobs.length > 0 ? (
                <ul className="space-y-4 max-h-96 overflow-y-auto">
                  {availableJobs.map((job) => (
                    <li key={job.timestamp+job.userId} className="p-4 border rounded-md bg-background/50 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-primary">{job.deviceType}</h3>
                      <p className="text-sm text-muted-foreground">{job.problemDescription}</p>
                      <p className="text-xs text-muted-foreground mt-1">Preferred Date: {job.preferredDate} at {job.preferredTime}</p>
                      <p className="text-xs text-muted-foreground">Estimated Earning (after commission): EGP {(job.travelFeePaid * (1-COMMISSION_RATE)).toFixed(2)} (Base: EGP {job.travelFeePaid.toFixed(2)})</p>
                      <Button 
                        onClick={() => handleAcceptJob(job.timestamp+job.userId)} 
                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
                        disabled={technician.walletBalance < MIN_BALANCE_TO_ACCEPT}
                      >
                        Accept Job
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No new service requests available for your expertise right now. Check back later!</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6, duration:0.5}}>
        <Card className="shadow-xl glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center"><Briefcase className="mr-2 h-6 w-6 text-primary"/>Your Accepted Jobs</CardTitle>
              <CardDescription>Manage your ongoing service requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {acceptedJobs.length > 0 ? (
                <ul className="space-y-4">
                  {acceptedJobs.map((job) => (
                    <li key={job.timestamp+job.userId} className="p-4 border rounded-md bg-background/50">
                      <h3 className="font-semibold text-primary">{job.deviceType}</h3>
                      <p className="text-sm text-muted-foreground">{job.problemDescription}</p>
                      <p className="text-xs text-muted-foreground mt-1">Date: {job.preferredDate} at {job.preferredTime}</p>
                      <p className="text-xs text-muted-foreground">Commission Paid: EGP {job.commissionDeducted?.toFixed(2)}</p>
                      <Button onClick={() => alert('Map/Navigation to customer location: Coming Soon!')} variant="outline" className="mt-2 mr-2">Navigate to Customer</Button>
                      <Button onClick={() => handleCompleteJob(job.timestamp+job.userId)} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">Mark as Completed</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">You have no active jobs.</p>
              )}
            </CardContent>
          </Card>
      </motion.div>

    </motion.div>
  );
};

export default TechnicianDashboardPage;
  