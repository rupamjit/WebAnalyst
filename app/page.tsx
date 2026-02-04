"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PricingSection from "@/components/PricingSection";
import { 
  ArrowRight, 
  BarChart2, 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  MousePointer2, 
  Smartphone,
  Check,
  Github,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20 bg-primary/5 text-primary">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  WebAnalyst is now public
                </span>
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Privacy-first analytics for <br className="hidden md:block"/>
              <span className="text-primary">modern web apps</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
              variants={itemVariants}
            >
              Simple, lightweight, and GDPR-compliant web analytics. 
              Get real-time insights without compromising user privacy. 
              No cookies, no bloat.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
              variants={itemVariants}
            >
              <Button size="lg" className="h-12 px-8 text-base rounded-full gap-2 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Start tracking — Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm border-2 hover:bg-muted/50">
                  <Eye className="w-4 h-4 mr-2" />
                  View Live Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border/40 bg-muted/30 py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {["Privacy-first", "No cookies", "GDPR-ready", "Lightweight < 3kb", "Open Source", "Real-time"].map((item) => (
              <div key={item} className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm md:text-base font-medium group-hover:text-foreground transition-colors">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
           <motion.div 
             className="relative rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto p-[4px] bg-transparent"
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, ease: "easeOut" }}
           >
              {/* Moving Gradient Border */}
              <div className="absolute inset-[-100%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,theme(colors.primary.DEFAULT)_50%,transparent_100%)] opacity-70" />

              {/* Inner Content Container */}
              <div className="relative h-full w-full bg-card rounded-xl overflow-hidden">
              
              {/* Fake Dashboard Header */}
              <div className="border-b border-border p-4 flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground flex items-center gap-2 truncate">
                    <Lock className="w-3 h-3" />
                    webanalyst.com
                  </div>
                </div>
              </div>

              {/* Fake Dashboard Content */}
              <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Unique Visitors", value: "12,453", change: "+12%" },
                    { label: "Page Views", value: "45,231", change: "+8%" },
                    { label: "Bounce Rate", value: "42%", change: "-3%" },
                    { label: "Avg. Duration", value: "2m 14s", change: "+15%" },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      className="space-y-2 p-4 rounded-xl bg-muted/20 border border-border/50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <div className="flex items-end justify-between font-mono">
                         <span className="text-xl md:text-2xl font-bold">{stat.value}</span>
                         <span className={`text-xs mb-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="grid lg:grid-cols-3 gap-6 h-auto">
                   <div className="lg:col-span-2 p-6 rounded-xl border border-border/50 bg-gradient-to-b from-transparent to-muted/10 h-[300px] flex items-end justify-between gap-1 md:gap-2 relative">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                        <motion.div 
                          key={i} 
                          className="w-full bg-primary/10 rounded-t-sm relative group" 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.05 }}
                        >
                           <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border z-10">
                              {h * 12} visits
                           </div>
                        </motion.div>
                      ))}
                      <div className="absolute top-4 left-4 text-sm font-medium">Visitor Trends</div>
                   </div>
                   <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-border/50 h-full">
                         <h4 className="text-sm font-medium mb-4">Top Sources</h4>
                         <div className="space-y-3">
                            {[
                              { name: "Google", val: 45 },
                              { name: "Direct", val: 30 },
                              { name: "Twitter", val: 15 },
                              { name: "GitHub", val: 10 },
                            ].map((source, idx) => (
                              <motion.div 
                                key={source.name} 
                                className="space-y-1"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <div className="flex justify-between text-xs">
                                  <span>{source.name}</span>
                                  <span className="text-muted-foreground">{source.val}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                   <motion.div 
                                     className="h-full bg-primary/80 rounded-full" 
                                     initial={{ width: 0 }}
                                     whileInView={{ width: `${source.val}%` }}
                                     viewport={{ once: true }}
                                     transition={{ duration: 1, delay: 0.5 }}
                                   />
                                </div>
                              </motion.div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
               </div>
           </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
         <div className="container px-4 md:px-6 mx-auto space-y-12">
            <motion.div 
              className="text-center max-w-2xl mx-auto space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
               <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight sm:text-4xl">
                 Everything you need, nothing you don't
               </motion.h2>
               <motion.p variants={itemVariants} className="text-muted-foreground text-lg">
                 Built for developers who care about design, performance, and privacy.
               </motion.p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
               {[
                 {
                   icon: Zap,
                   title: "Real-time Insights",
                   desc: "See who is on your site right now. Live visitor count and active page tracking update instantly."
                 },
                 {
                   icon: Shield,
                   title: "Privacy First",
                   desc: "GDPR, CCPA, and PECR compliant by default. No IP storage, no cross-site tracking, no cookies."
                 },
                 {
                   icon: MousePointer2,
                   title: "Event Tracking",
                   desc: "Track custom events like button clicks, form submissions, and signups with a simple API."
                 },
                 {
                   icon: Smartphone,
                   title: "Device Analytics",
                   desc: "Understand your audience with detailed breakdowns of devices, browsers, and screen sizes."
                 },
                 {
                   icon: Globe,
                   title: "Global Traffic",
                   desc: "See exactly where your visitors are coming from with our interactive world map visualizations."
                 },
                 {
                   icon: Lock,
                   title: "Data Ownership",
                   desc: "Your data belongs to you. Export it anytime. We don't sell or share your data with third parties."
                 }
               ].map((feature, i) => (
                 <motion.div key={i} variants={itemVariants}>
                   <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow bg-background/50 backdrop-blur-sm">
                      <CardHeader>
                         <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                            <feature.icon className="w-6 h-6" />
                         </div>
                         <CardTitle className="text-xl">{feature.title}</CardTitle>
                         <CardDescription className="text-base pt-2">{feature.desc}</CardDescription>
                      </CardHeader>
                   </Card>
                 </motion.div>
               ))}
            </motion.div>
         </div>
      </section>

      {/* How it Works */}
      <section className="py-24 overflow-hidden">
         <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <motion.div 
                 className="space-y-8"
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
               >
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                     Up and running in under a minute
                  </h2>
                  <div className="space-y-8">
                     {[
                        { step: "01", title: "Add your domain", desc: "Register your website in the dashboard to generate a unique site ID." },
                        { step: "02", title: "Add the script", desc: "Copy and paste our lightweight tracking script into your website's <head>." },
                        { step: "03", title: "See data flow", desc: "Watch real-time analytics stream in instantly. No complex setup required." },
                     ].map((s, i) => (
                        <motion.div 
                          key={s.step} 
                          className="flex gap-4 group"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.2 }}
                        >
                           <div className="flex-shrink-0 w-12 h-12 rounded-full border border-primary/20 bg-primary/5 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                              {s.step}
                           </div>
                           <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{s.title}</h3>
                              <p className="text-muted-foreground">{s.desc}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
               
               <motion.div 
                 className="relative"
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
               >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                           <span className="text-sm font-medium">Installation</span>
                           <Badge variant="outline" className="font-mono text-xs">HTML</Badge>
                        </div>
                        <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto custom-scrollbar">
                           <p className="text-muted-foreground whitespace-pre">
                              &lt;script{'\n'}
                              {'  '}defer{'\n'}
                              {'  '}data-domain=&quot;yourdomain.com&quot;{'\n'}
                              {'  '}src=&quot;https://webanalyst.com/script.js&quot;{'\n'}
                              &gt;&lt;/script&gt;
                           </p>
                        </div>
                        <Button className="w-full group">
                           Copy to Clipboard
                           <Check className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Pricing */}
      <div className="bg-muted/30">
        <PricingSection />
      </div>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/5 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="container px-4 md:px-6 mx-auto text-center">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
             >
               <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  Ready to take control of your data?
               </h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                  Join thousands of developers building privacy-friendly web applications today.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-xl shadow-primary/20">
                     Get Started for Free
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full bg-background/50 backdrop-blur-sm">
                     View Live Demo
                  </Button>
               </div>
             </motion.div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-muted/20">
         <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-lg">
               <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <BarChart2 className="w-5 h-5" />
               </div>
               WebAnalyst
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
               <Link href="#" className="hover:text-foreground transition-colors">Documentation</Link>
               <Link href="#" className="hover:text-foreground transition-colors">Pricing</Link>
               <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
               <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
               <Github className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
               <span className="text-sm">© 2026 WebAnalyst Inc.</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
