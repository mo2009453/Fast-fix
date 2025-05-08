
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Briefcase, UploadCloud, Camera } from 'lucide-react';

const TechnicianLoginPage = () => {
  const navigate = useNavigate();
  const { loginTechnician, registerTechnician } = useAuth();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [expertise, setExpertise] = useState('');
  const [skillsTestAnswer, setSkillsTestAnswer] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');

  const [photo, setPhoto] = useState(null);
  const [nationalIdFront, setNationalIdFront] = useState(null);
  const [nationalIdBack, setNationalIdBack] = useState(null);
  const [criminalRecord, setCriminalRecord] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);


  const handleLogin = (e) => {
    e.preventDefault();
    try {
      const tech = loginTechnician({ email: loginEmail, password: loginPassword });
      if (tech) {
        if (tech.approved) {
          navigate('/technician/dashboard');
        } else {
          navigate('/technician/pending-approval');
        }
      }
    } catch (error) {
      toast({ title: "Login Failed", description: error.message || "Invalid credentials", variant: "destructive" });
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        toast({ title: "Camera Error", description: "Could not access camera. Please ensure permissions are granted.", variant: "destructive"});
        setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPhoto(dataUrl); // Store as data URL or convert to File object
        
        video.srcObject.getTracks().forEach(track => track.stop());
        setShowCamera(false);
        toast({title: "Photo Captured!", description: "Your photo has been captured successfully."});
    }
  };


  const handleRegister = (e) => {
    e.preventDefault();
    let skillTestPassed = true;
    if (expertise === 'electronics' && skillsTestAnswer.toLowerCase() !== 'ohm') {
       toast({ title: "Skill Test Failed", description: 'Incorrect answer for electronics skill test. Expected "ohm".', variant: "destructive" });
       skillTestPassed = false;
    } else if (expertise === 'plumbing' && skillsTestAnswer.toLowerCase() !== 'p-trap') {
       toast({ title: "Skill Test Failed", description: 'Incorrect answer for plumbing skill test. Expected "p-trap".', variant: "destructive" });
       skillTestPassed = false;
    } else if (expertise === 'appliances' && skillsTestAnswer.toLowerCase() !== 'compressor') {
       toast({ title: "Skill Test Failed", description: 'Incorrect answer for large appliances skill test. Expected "compressor".', variant: "destructive" });
       skillTestPassed = false;
    } else if (expertise === 'hvac' && skillsTestAnswer.toLowerCase() !== 'refrigerant') {
       toast({ title: "Skill Test Failed", description: 'Incorrect answer for HVAC skill test. Expected "refrigerant".', variant: "destructive" });
       skillTestPassed = false;
    }

    if (!skillTestPassed) return;

    if (!photo || !nationalIdFront || !nationalIdBack || !criminalRecord) {
        toast({ title: "Missing Documents", description: "Please upload all required documents.", variant: "destructive" });
        return;
    }
    
    const documents = {
        photo: photo ? 'photo_uploaded.png' : null, 
        nationalIdFront: nationalIdFront ? nationalIdFront.name : null,
        nationalIdBack: nationalIdBack ? nationalIdBack.name : null,
        criminalRecord: criminalRecord ? criminalRecord.name : null,
    };


    try {
      registerTechnician({ 
        name: registerName, 
        email: registerEmail, 
        password: registerPassword, 
        expertise,
        address,
        mobile,
        documents 
      });
      navigate('/technician/pending-approval');
    } catch (error) {
      toast({ title: "Registration Failed", description: error.message || "Could not complete registration.", variant: "destructive" });
    }
  };
  
  const skillTestQuestion = () => {
    if (expertise === 'electronics') return "Q: What is the unit of electrical resistance?";
    if (expertise === 'plumbing') return "Q: What common plumbing component prevents sewer gases from entering a building?";
    if (expertise === 'appliances') return "Q: What key component is responsible for cooling in a refrigerator?";
    if (expertise === 'hvac') return "Q: What substance is commonly used in air conditioning systems to transfer heat?";
    return "Please select an expertise to see the skill question.";
  };

  const FileInput = ({ id, label, onChange, file, icon }) => (
    <div className="space-y-1">
      <Label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
        {icon}
        <span>{label}</span>
        {file && <span className="text-xs text-green-600 ml-2">(Selected: {typeof file === 'string' ? 'Captured Photo' : file.name})</span>}
      </Label>
      {id !== 'tech-photo-capture' && <Input id={id} type="file" onChange={(e) => onChange(e.target.files[0])} className="border-dashed" accept="image/*,.pdf" />}
    </div>
  );


  return (
    <motion.div 
      className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-lg shadow-2xl glass-effect">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gradient-primary">Technician Portal</CardTitle>
          <CardDescription>Manage your services or join our professional team.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login"><LogIn className="mr-2 h-4 w-4" />Login</TabsTrigger>
              <TabsTrigger value="register"><UserPlus className="mr-2 h-4 w-4" />Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tech-login-email">Email</Label>
                  <Input id="tech-login-email" type="email" placeholder="tech@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-login-password">Password</Label>
                  <Input id="tech-login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="tech-register-name">Full Name</Label>
                    <Input id="tech-register-name" placeholder="Tech Expert" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="tech-register-mobile">Mobile Number</Label>
                    <Input id="tech-register-mobile" type="tel" placeholder="01xxxxxxxxx" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-register-email">Email</Label>
                  <Input id="tech-register-email" type="email" placeholder="tech@example.com" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-register-password">Password</Label>
                  <Input id="tech-register-password" type="password" placeholder="••••••••" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-register-address">Full Address</Label>
                  <Input id="tech-register-address" placeholder="Building, Street, Area, City" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expertise">Area of Expertise</Label>
                  <Select onValueChange={setExpertise} value={expertise}>
                    <SelectTrigger id="expertise">
                      <SelectValue placeholder="Select expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics (AC, TV, etc.)</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="appliances">Large Appliances (Fridge, Washer)</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="other">Other (Specify if approved)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {expertise && (
                  <div className="space-y-2 p-4 border border-dashed rounded-md bg-muted/50">
                    <Label htmlFor="skills-test" className="font-semibold">Basic Skills Test:</Label>
                    <p className="text-sm text-muted-foreground">{skillTestQuestion()}</p>
                    <Input id="skills-test" placeholder="Your answer (one word)" value={skillsTestAnswer} onChange={(e) => setSkillsTestAnswer(e.target.value)} required />
                  </div>
                )}

                <Card className="p-4 bg-muted/30">
                  <CardHeader className="p-2">
                    <CardTitle className="text-lg">Document Upload</CardTitle>
                    <CardDescription className="text-xs">All documents are required for approval.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="tech-photo-capture" className="flex items-center space-x-2">
                        <Camera className="h-5 w-5 text-primary" />
                        <span>Recent Photo (Live Capture)</span>
                        {photo && <span className="text-xs text-green-600 ml-2">(Photo Captured)</span>}
                      </Label>
                      {!showCamera && !photo && <Button type="button" variant="outline" onClick={startCamera} className="w-full"><Camera className="mr-2 h-4 w-4"/>Open Camera</Button>}
                      {showCamera && (
                        <div className="flex flex-col items-center">
                           <video ref={videoRef} autoPlay className="w-full rounded-md border max-h-60"></video>
                           <Button type="button" onClick={capturePhoto} className="mt-2 bg-green-500 hover:bg-green-600">Capture Photo</Button>
                        </div>
                      )}
                       {photo && <img-replace src={photo} alt="Captured technician photo" className="mt-2 w-32 h-32 object-cover rounded-md border" />}
                       <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>

                    <FileInput id="national-id-front" label="National ID (Front)" onChange={setNationalIdFront} file={nationalIdFront} icon={<UploadCloud className="h-5 w-5 text-primary"/>}/>
                    <FileInput id="national-id-back" label="National ID (Back)" onChange={setNationalIdBack} file={nationalIdBack} icon={<UploadCloud className="h-5 w-5 text-primary"/>}/>
                    <FileInput id="criminal-record" label="Criminal Record Certificate" onChange={setCriminalRecord} file={criminalRecord} icon={<UploadCloud className="h-5 w-5 text-primary"/>}/>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" 
                  disabled={!expertise || !skillsTestAnswer || !photo || !nationalIdFront || !nationalIdBack || !criminalRecord }
                >
                  <UserPlus className="mr-2 h-5 w-5" /> Create Technician Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TechnicianLoginPage;
  