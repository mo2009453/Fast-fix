
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Users, Briefcase, DollarSign, Settings, CheckCircle, XCircle, Eye, Map } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboardPage = () => {
  const { admin, approveTechnicianApplication, rejectTechnicianApplication } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [commissionRate, setCommissionRate] = useState(0.15); 

  useEffect(() => {
    if (admin) {
      const storedUsers = JSON.parse(localStorage.getItem('fastfix-all-users')) || []; 
      const storedTechnicians = JSON.parse(localStorage.getItem('fastfix-all-technicians')) || [];
      const storedBookings = JSON.parse(localStorage.getItem('fastfix-bookings')) || [];
      
      setUsers(storedUsers); 
      setTechnicians(storedTechnicians);
      setBookings(storedBookings);
    }
  }, [admin]);

  const handleApproveTechnician = (techId) => {
    approveTechnicianApplication(techId);
    setTechnicians(prev => prev.map(t => t.id === techId ? {...t, approved: true} : t));
  };

  const handleRejectTechnician = (techId) => {
    rejectTechnicianApplication(techId);
     setTechnicians(prev => prev.map(t => t.id === techId ? {...t, approved: 'rejected'} : t));
  };
  
  const handleCommissionChange = (newRate) => {
    if (newRate >= 0 && newRate <= 1) {
        localStorage.setItem('fastfix-commission-rate', newRate.toString());
        setCommissionRate(newRate);
        toast({ title: "Commission Rate Updated", description: `New rate is ${(newRate * 100).toFixed(0)}%` });
    } else {
        toast({ title: "Invalid Rate", description: "Commission rate must be between 0 and 1 (e.g., 0.15 for 15%).", variant: "destructive" });
    }
  };

  useEffect(() => {
    const storedRate = localStorage.getItem('fastfix-commission-rate');
    if (storedRate) {
        setCommissionRate(parseFloat(storedRate));
    }
  }, []);


  if (!admin) {
    return <div className="text-center py-10">Access Denied. Redirecting...</div>; 
  }

  const getStatusBadge = (status) => {
    if (status === true) return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Approved</span>;
    if (status === 'rejected') return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Rejected</span>;
    return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>;
  };
  
  const getBookingStatusBadge = (status) => {
    switch (status) {
        case 'pending_technician_assignment': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending Assignment</span>;
        case 'technician_assigned': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">Technician Assigned</span>;
        case 'completed_by_technician': return <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-200 rounded-full">Pending User Confirmation</span>;
        case 'completed': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Completed</span>;
        case 'cancelled': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Cancelled</span>;
        default: return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">{status}</span>;
    }
  };


  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl shadow-lg glass-effect">
        <Settings className="mx-auto h-20 w-20 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-gradient-primary">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">Manage FastFix Platform Operations.</p>
      </section>

      <Tabs defaultValue="technicians" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="technicians"><Briefcase className="mr-2 h-4 w-4" />Technicians</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
          <TabsTrigger value="bookings"><DollarSign className="mr-2 h-4 w-4" />Service Requests</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Platform Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="technicians" className="mt-6">
          <Card className="shadow-xl glass-effect">
            <CardHeader>
              <CardTitle>Technician Management</CardTitle>
              <CardDescription>View, approve, or reject technician applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Wallet (EGP)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicians.map((tech) => (
                    <TableRow key={tech.id}>
                      <TableCell>{tech.name}</TableCell>
                      <TableCell>{tech.email}</TableCell>
                      <TableCell>{tech.expertise}</TableCell>
                      <TableCell>{getStatusBadge(tech.approved)}</TableCell>
                      <TableCell>{tech.walletBalance?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => alert(`Viewing documents for ${tech.name}. Photo: ${tech.documents?.photo}, ID Front: ${tech.documents?.nationalIdFront}, ID Back: ${tech.documents?.nationalIdBack}, Criminal Record: ${tech.documents?.criminalRecord}`)}><Eye className="h-4 w-4"/></Button>
                        {tech.approved === false && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleApproveTechnician(tech.id)}><CheckCircle className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRejectTechnician(tech.id)}><XCircle className="h-4 w-4"/></Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                 <TableCaption>{technicians.length === 0 ? "No technicians registered yet." : `Total technicians: ${technicians.length}`}</TableCaption>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="shadow-xl glass-effect">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View registered users and their activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features (viewing all users, their wallet balances, etc.) will be available after Supabase integration. Currently, only the logged-in user's data is directly accessible in localStorage for their session.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          <Card className="shadow-xl glass-effect">
            <CardHeader>
              <CardTitle>Service Request Monitoring</CardTitle>
              <CardDescription>Track all service requests on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Technician ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.timestamp + booking.userId}>
                      <TableCell>{booking.userId.substring(0,10)}...</TableCell>
                      <TableCell>{booking.deviceType}</TableCell>
                      <TableCell>{booking.preferredDate}</TableCell>
                      <TableCell>{booking.preferredTime}</TableCell>
                      <TableCell>{getBookingStatusBadge(booking.status)}</TableCell>
                      <TableCell>{booking.technicianId ? `${booking.technicianId.substring(0,10)}...` : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => alert('Technician route tracking coming soon!')}><Map className="h-4 w-4"/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>{bookings.length === 0 ? "No service requests yet." : `Total service requests: ${bookings.length}`}</TableCaption>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
            <Card className="shadow-xl glass-effect">
                <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Manage global settings for FastFix.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="commissionRate" className="text-base">Technician Commission Rate (%)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                            <Input 
                                id="commissionRate" 
                                type="number" 
                                value={(commissionRate * 100).toFixed(0)} 
                                onChange={(e) => handleCommissionChange(parseFloat(e.target.value) / 100)} 
                                className="max-w-xs"
                                step="1"
                                min="0"
                                max="100"
                            />
                            <span>%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Set the percentage deducted from technician earnings for each service.</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Gateway Integration</CardTitle>
                            <CardDescription>Connect and manage payment methods.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">Integration for Vodafone Cash, InstaPay, and other local methods will be configured here once available.</p>
                            <Button variant="outline" disabled>Configure Vodafone Cash (Coming Soon)</Button>
                            <Button variant="outline" className="ml-2" disabled>Configure InstaPay (Coming Soon)</Button>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </motion.div>
  );
};

export default AdminDashboardPage;
  