
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { CalendarPlus as CalendarIcon, ChevronRight, Wallet, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const TRAVEL_FEE = 100; // EGP

const ServiceBookingPage = () => {
  const navigate = useNavigate();
  const { user, updateUserWallet } = useAuth();
  const { toast } = useToast();
  
  const [deviceType, setDeviceType] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(null);
  const [preferredTime, setPreferredTime] = useState('');
  const [loadAmount, setLoadAmount] = useState(TRAVEL_FEE); // Default to travel fee

  useEffect(() => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to book a service.", variant: "destructive" });
      navigate('/login/user');
    }
  }, [user, navigate, toast]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!user) return;

    if (user.walletBalance < TRAVEL_FEE) {
      toast({
        title: "Insufficient Balance",
        description: `Please load at least EGP ${TRAVEL_FEE.toFixed(2)} to cover the travel fee.`,
        variant: "destructive",
      });
      return;
    }

    if (!deviceType || !problemDescription || !preferredDate || !preferredTime) {
        toast({ title: "Missing Information", description: "Please fill all fields to book a service.", variant: "destructive" });
        return;
    }

    updateUserWallet(user.id, -TRAVEL_FEE);

    const bookingDetails = {
      userId: user.id,
      deviceType,
      problemDescription,
      preferredDate: format(preferredDate, "PPP"),
      preferredTime,
      status: 'pending_technician_assignment',
      timestamp: new Date().toISOString(),
      travelFeePaid: TRAVEL_FEE
    };
    const bookings = JSON.parse(localStorage.getItem('fastfix-bookings')) || [];
    bookings.push(bookingDetails);
    localStorage.setItem('fastfix-bookings', JSON.stringify(bookings));

    toast({ title: "Service Booked!", description: "A technician will be assigned shortly. Travel fee has been deducted." });
    navigate('/user/dashboard'); 
  };

  const handleLoadWallet = () => {
    if(loadAmount <=0) {
        toast({title: "Invalid Amount", description: "Please enter a positive amount to load.", variant: "destructive"});
        return;
    }
    updateUserWallet(user.id, parseFloat(loadAmount));
    setLoadAmount(TRAVEL_FEE); 
  };

  if (!user) {
    return <div className="text-center py-10">Redirecting to login...</div>; 
  }

  const timeSlots = ["09:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00", "15:00 - 17:00", "17:00 - 19:00"];

  return (
    <motion.div 
      className="max-w-3xl mx-auto py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-2xl glass-effect">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-gradient-primary">Book a Service</CardTitle>
          <CardDescription className="text-center">
            Tell us about the issue and schedule a visit. Current Wallet Balance: <span className="font-bold text-primary">EGP {user.walletBalance?.toFixed(2) || '0.00'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="p-4 border border-yellow-500 bg-yellow-500/10 rounded-md flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-700">Important: Travel Fee</h4>
              <p className="text-sm text-yellow-600">
                A non-refundable travel fee of <span className="font-bold">EGP {TRAVEL_FEE.toFixed(2)}</span> will be deducted from your wallet upon booking confirmation. Please ensure you have sufficient balance.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <Label htmlFor="deviceType" className="text-lg">Device Type (e.g., Washing Machine, AC)</Label>
              <Input id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)} placeholder="Samsung Front Load Washer" required />
            </div>

            <div>
              <Label htmlFor="problemDescription" className="text-lg">Problem Description</Label>
              <Textarea id="problemDescription" value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} placeholder="Describe the issue in detail (e.g., not spinning, making loud noises)" rows={4} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="preferredDate" className="text-lg">Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !preferredDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {preferredDate ? format(preferredDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={preferredDate}
                      onSelect={setPreferredDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="preferredTime" className="text-lg">Preferred Time Slot</Label>
                <Select onValueChange={setPreferredTime} value={preferredTime}>
                  <SelectTrigger id="preferredTime">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={user.walletBalance < TRAVEL_FEE}>
                  Confirm Booking <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Service Request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    A travel fee of EGP {TRAVEL_FEE.toFixed(2)} will be charged. 
                    Device: {deviceType || "N/A"}. 
                    Date: {preferredDate ? format(preferredDate, "PPP") : "N/A"}. 
                    Time: {preferredTime || "N/A"}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBooking}>Proceed to Book</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
             {user.walletBalance < TRAVEL_FEE && (
                <p className="text-sm text-destructive text-center">Your balance is too low. Please load your wallet.</p>
            )}
          </form>

          <Card className="mt-10 glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center"><Wallet className="mr-2 h-6 w-6 text-primary"/> Manage Your Wallet</CardTitle>
              <CardDescription>Current Balance: EGP {user.walletBalance?.toFixed(2) || '0.00'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="loadAmount">Amount to Load (EGP)</Label>
                <Input id="loadAmount" type="number" value={loadAmount} onChange={(e) => setLoadAmount(parseFloat(e.target.value))} placeholder={`Min EGP ${TRAVEL_FEE}`} min={TRAVEL_FEE.toString()} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLoadWallet} className="w-full bg-accent hover:bg-accent/90">Load Balance</Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceBookingPage;
  