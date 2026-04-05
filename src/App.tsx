/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Moon, 
  Sun, 
  Zap, 
  ShieldCheck, 
  Clock, 
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { generateImage } from './lib/gemini';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await generateImage(prompt);
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substring(7),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
      };
      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.slice(0, 20)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const examplePrompts = [
    "A futuristic cyberpunk city with neon lights and flying cars",
    "A majestic dragon perched on a snowy mountain peak",
    "An ethereal forest with glowing mushrooms and fireflies",
    "A cute robot drinking coffee in a cozy cafe",
    "A vibrant oil painting of a sunset over the ocean"
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">AI Image Gen</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#tool" className="hover:text-brand-400 transition-colors">Generator</a>
              <a href="#features" className="hover:text-brand-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-brand-400 transition-colors">How it Works</a>
              <a href="#blog" className="hover:text-brand-400 transition-colors">Blog</a>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                <a href="#tool" className="block py-2 hover:text-brand-400" onClick={() => setIsMenuOpen(false)}>Generator</a>
                <a href="#features" className="block py-2 hover:text-brand-400" onClick={() => setIsMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="block py-2 hover:text-brand-400" onClick={() => setIsMenuOpen(false)}>How it Works</a>
                <a href="#blog" className="block py-2 hover:text-brand-400" onClick={() => setIsMenuOpen(false)}>Blog</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-tight">
                Free AI <span className="gradient-text">Text to Image</span> Generator
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                Convert your imagination into stunning visuals instantly. Our advanced AI creates high-quality art from your text prompts for free.
              </p>
            </motion.div>

            {/* Generator Tool Box */}
            <motion.div 
              id="tool"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-3xl mx-auto glass rounded-3xl p-6 md:p-8 shadow-2xl relative"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to see..."
                    className="w-full h-32 md:h-auto md:min-h-[100px] bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                    {prompt.length} characters
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="gradient-bg hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-brand-500/25 min-w-[160px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Generated Gallery Section */}
        <AnimatePresence>
          {generatedImages.length > 0 && (
            <section className="py-20 bg-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-display font-bold mb-12 text-center">Your Creations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {generatedImages.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-3xl overflow-hidden group"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={img.url} 
                          alt={img.prompt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            onClick={() => downloadImage(img.url, img.prompt)}
                            className="p-3 bg-white text-black rounded-full hover:bg-brand-500 hover:text-white transition-all transform hover:scale-110"
                            title="Download Image"
                          >
                            <Download className="w-6 h-6" />
                          </button>
                          <button 
                            onClick={() => copyToClipboard(img.prompt)}
                            className="p-3 bg-white text-black rounded-full hover:bg-brand-500 hover:text-white transition-all transform hover:scale-110"
                            title="Copy Prompt"
                          >
                            <Copy className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-slate-400 line-clamp-2 italic">"{img.prompt}"</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <section id="features" className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-display font-bold mb-4">Why Choose Our AI Generator?</h2>
              <p className="text-slate-400">The most powerful and user-friendly AI art tool on the web.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <ImageIcon />, title: "High Quality AI Images", desc: "Generate stunning 1K resolution images with incredible detail and artistic flair." },
                { icon: <Zap />, title: "Unlimited Generation", desc: "No credits, no limits. Create as many images as your imagination allows." },
                { icon: <Clock />, title: "Fast & Free Tool", desc: "Get your results in seconds. Completely free to use for everyone, forever." },
                { icon: <ShieldCheck />, title: "No Login Required", desc: "Start creating immediately. We don't ask for your email or personal data." }
              ].map((feature, i) => (
                <div key={i} className="glass p-8 rounded-3xl hover:border-brand-500/50 transition-all group">
                  <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <h2 className="text-4xl font-display font-bold mb-8">How to Create AI Art in Seconds</h2>
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Write your text prompt", desc: "Describe the image you want to create in detail. Use adjectives and styles for better results." },
                    { step: "02", title: "Click Generate Image", desc: "Our advanced AI model processes your text and visualizes it into a unique piece of art." },
                    { step: "03", title: "Download your AI image", desc: "Save your creation to your device instantly in high resolution and share it with the world." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="text-4xl font-display font-black text-brand-500/20">{item.step}</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-12 gradient-bg text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all">
                  Start Creating Now <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 relative">
                <div className="glass p-4 rounded-[40px] rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl bg-brand-500/10 flex items-center justify-center aspect-square">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-brand-500 mx-auto mb-4 animate-pulse" />
                    <p className="font-display font-bold text-slate-500">Your Art Here</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl animate-bounce shadow-xl hidden md:block">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500" />
                    <span className="font-bold">Image Generated!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="max-w-md text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="font-display font-bold text-lg">AI Image Gen</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                The world's most accessible AI text to image generator. Empowering creativity through advanced artificial intelligence.
              </p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="p-3 glass rounded-xl hover:text-brand-400 transition-colors hover:scale-110 transform"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-3 glass rounded-xl hover:text-brand-400 transition-colors hover:scale-110 transform"><Github className="w-5 h-5" /></a>
              <a href="#" className="p-3 glass rounded-xl hover:text-brand-400 transition-colors hover:scale-110 transform"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 text-center md:text-left">
            <p>© 2026 AI Text to Image Generator. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-400">Privacy Policy</a>
              <a href="#" className="hover:text-brand-400">Terms of Service</a>
              <a href="#" className="hover:text-brand-400">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
