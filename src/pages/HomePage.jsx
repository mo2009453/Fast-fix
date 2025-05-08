
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Wrench, MapPin, Search, User, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated, isUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleBookServiceClick = () => {
    if (isAuthenticated && isUser) {
      navigate('/book-service');
    } else if (isAuthenticated && !isUser) {
      alert("Technicians cannot book services. Please use a user account.");
      navigate('/technician/dashboard');
    }
    else {
      navigate('/login/user');
    }
  };

  return (
    <div className="space-y-12">
      <motion.section 
        className="text-center py-16 md:py-24 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-xl shadow-lg glass-effect"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient-primary">{t('appName')}</span>: {t('fastFixYourHome')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            {t('reliableTech')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300"
              onClick={handleBookServiceClick}
            >
              <Zap className="mr-2 h-5 w-5" /> {t('bookService')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="shadow-lg transform hover:scale-105 transition-transform duration-300"
              onClick={() => alert("Technician search feature coming soon!")}
            >
              <Search className="mr-2 h-5 w-5" /> {t('findTech')}
            </Button>
          </div>
        </motion.div>
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <img    
            class="w-full max-w-3xl mx-auto rounded-lg shadow-2xl" 
            alt="Happy family using fixed home appliances"
            src="https://images.unsplash.com/photo-1616521865612-fd15a0bac3a2" />
        </motion.div>
      </motion.section>

      <motion.section 
        className="py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-10">{t('howItWorks')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <MapPin className="h-10 w-10 text-primary" />, title: t('step1Title'), description: t('step1Desc') },
            { icon: <Wrench className="h-10 w-10 text-primary" />, title: t('step2Title'), description: t('step2Desc') },
            { icon: <Zap className="h-10 w-10 text-primary" />, title: t('step3Title'), description: t('step3Desc') },
          ].map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="text-center h-full hover:shadow-xl transition-shadow duration-300 glass-effect">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    {step.icon}
                  </div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {!isAuthenticated && (
        <motion.section 
          className="py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto shadow-2xl glass-effect">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-gradient-primary">{t('joinFastFix')}</CardTitle>
              <CardDescription className="text-center">
                {t('joinDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button onClick={() => navigate('/login/user')} size="lg" className="w-full py-8 text-lg bg-primary hover:bg-primary/80">
                <User className="mr-3 h-6 w-6" /> {t('needRepair')}
              </Button>
              <Button onClick={() => navigate('/login/technician')} size="lg" variant="outline" className="w-full py-8 text-lg border-primary text-primary hover:bg-primary/10">
                <Briefcase className="mr-3 h-6 w-6" /> {t('iamTech')}
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </div>
  );
};

export default HomePage;
  