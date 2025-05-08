
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="bg-muted/70 backdrop-blur-sm text-muted-foreground py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">FastFix</h3>
            <p className="text-sm">
              Connecting you with skilled technicians for quick and reliable home appliance repairs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/login/user" className="hover:text-primary transition-colors">User Login</Link></li>
              <li><Link to="/login/technician" className="hover:text-primary transition-colors">Technician Login</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us (Coming Soon)</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ (Coming Soon)</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us (Coming Soon)</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy (Coming Soon)</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service (Coming Soon)</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {currentYear} FastFix. All rights reserved.</p>
          <div className="mt-4 sm:mt-0">
            <Link to="/login/admin" className="flex items-center hover:text-primary transition-colors">
              <Shield size={16} className="mr-1" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
  