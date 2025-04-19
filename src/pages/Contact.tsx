
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import SocialLinks from '@/components/contact/SocialLinks';

const Contact: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Связаться с нами</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              У вас есть вопросы или предложения? Заполните форму ниже, и наша команда свяжется с вами в ближайшее время
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div 
              className="lg:col-span-2 order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContactForm />
            </motion.div>
            
            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContactInfo />
            </motion.div>
          </div>
          
          <SocialLinks />
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
