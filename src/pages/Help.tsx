import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Phone, Mail, MessageCircle, Book, Video, Users } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: "How do I check real-time crop prices?",
      answer: "Go to the 'Prices' section from the main menu. You can view current market prices for all oilseed crops, filter by location, and set price alerts for your preferred crops."
    },
    {
      question: "How can I connect with FPOs in my area?",
      answer: "Visit the 'FPOs' section to find Farmer Producer Organizations near you. You can filter by location, crops, and services offered. Click on any FPO to view detailed information and contact them directly."
    },
    {
      question: "What government schemes are available for oilseed farmers?",
      answer: "Check the 'Schemes' section for comprehensive information about government schemes like NMEO-OS, subsidies, and support programs. You can also apply for eligible schemes directly through the app."
    },
    {
      question: "How do I set up price alerts?",
      answer: "In the 'Prices' section, click on any crop and select 'Set Alert'. Choose your target price and conditions (above/below). You'll receive notifications when the price reaches your target."
    },
    {
      question: "Can I use the app offline?",
      answer: "Yes! The app works offline with cached data. You can view previously loaded prices, FPO information, and schemes even without internet connection. Data will sync when you're back online."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to 'Profile' from the menu, then click 'Edit Profile'. You can update your personal information, farm details, and preferences. Don't forget to save your changes."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support bank transfers, UPI, digital wallets, and major payment gateways like Razorpay and PayU. All transactions are secured with bank-level encryption."
    },
    {
      question: "How do I enable biometric login?",
      answer: "Go to Settings > Security & Privacy and enable 'Biometric Login'. Your device must support fingerprint or face recognition for this feature to work."
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">❓ Help & Support</h1>
          <p className="text-muted-foreground">Get help and find answers to your questions</p>
        </div>
        
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help topics..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Help */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Help</CardTitle>
            <CardDescription>Common actions and features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  📊
                </div>
                <h3 className="font-medium mb-2">Check Prices</h3>
                <p className="text-sm text-muted-foreground">View real-time market prices for oilseed crops</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🏢
                </div>
                <h3 className="font-medium mb-2">Find FPOs</h3>
                <p className="text-sm text-muted-foreground">Connect with Farmer Producer Organizations</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  📋
                </div>
                <h3 className="font-medium mb-2">Apply for Schemes</h3>
                <p className="text-sm text-muted-foreground">Explore government schemes and subsidies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get in touch with our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 9 AM - 6 PM</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Call +91-1800-XXX-XXXX
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Email support@krishishift.com
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">Instant help available</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Quick support via WhatsApp</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Message on WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
            <CardDescription>Guides and tutorials to help you get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <Book className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-medium mb-2">User Guide</h3>
                <p className="text-sm text-muted-foreground mb-3">Complete guide to using Krishi Shift</p>
                <Button variant="outline" size="sm">Download PDF</Button>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <Video className="h-8 w-8 mx-auto mb-3 text-red-600" />
                <h3 className="font-medium mb-2">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground mb-3">Step-by-step video guides</p>
                <Button variant="outline" size="sm">Watch Videos</Button>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-medium mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground mb-3">Connect with other farmers</p>
                <Button variant="outline" size="sm">Join Forum</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>App Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">v2.1.0</div>
                <div className="text-sm text-muted-foreground">App Version</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-purple-600">4.8★</div>
                <div className="text-sm text-muted-foreground">App Rating</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;