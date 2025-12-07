import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppScreen, DonationStats } from './types';
import { generateThankYouMessage } from './services/geminiService';
import { submitToGoogleSheet } from './services/googleSheetService';
import Snowfall from './components/Snowfall';
import Header from './components/Header';

// Icons
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.ATTRACT);
  
  // Form State
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [wish, setWish] = useState('');
  
  const [aiResponse, setAiResponse] = useState('');
  // Simulate a starting donation amount (e.g., 5.2 Million)
  const [stats, setStats] = useState<DonationStats>({
    totalDonated: 5240000,
    messageCount: 5240
  });

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_TIMEOUT = 60000; // 60 seconds reset

  const resetToAttract = useCallback(() => {
    setScreen(AppScreen.ATTRACT);
    setName('');
    setContactNumber('');
    setWish('');
    setAiResponse('');
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (screen !== AppScreen.ATTRACT) {
      idleTimerRef.current = setTimeout(resetToAttract, IDLE_TIMEOUT);
    }
  }, [screen, resetToAttract]);

  useEffect(() => {
    window.addEventListener('touchstart', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);

    return () => {
      window.removeEventListener('touchstart', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleStart = () => {
    setScreen(AppScreen.COMPOSE);
  };

  const isFormValid = name.trim() && contactNumber.trim() && wish.trim();

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setScreen(AppScreen.PROCESSING);
    
    const submissionData = {
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      message: wish.trim(),
      timestamp: Date.now()
    };

    try {
      // Execute all async operations in parallel:
      // 1. Generate AI Thank You Message
      // 2. Submit Data to Google Sheets
      // 3. Minimum UX delay (2s)
      const [aiResult] = await Promise.all([
        generateThankYouMessage(wish),
        submitToGoogleSheet(submissionData),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      setAiResponse(aiResult);
      
      // Update local stats
      setStats(prev => ({
        totalDonated: prev.totalDonated + 1000,
        messageCount: prev.messageCount + 1
      }));
      
      setScreen(AppScreen.SUCCESS);
    } catch (e) {
        // Fallback in case of error
        setAiResponse("Thank you for your warmth and generosity.");
        setScreen(AppScreen.SUCCESS);
    }
  };

  const handleNewWish = () => {
    setScreen(AppScreen.ATTRACT);
    setName('');
    setContactNumber('');
    setWish('');
    setAiResponse('');
  };

  // --------------------------------------------------------------------------
  // Render Screens
  // --------------------------------------------------------------------------

  // 1. ATTRACT SCREEN
  if (screen === AppScreen.ATTRACT) {
    return (
      <div className="relative h-screen w-full bg-gradient-to-b from-combank-dark to-combank-blue text-white overflow-hidden flex flex-col items-center justify-center p-8">
        <Snowfall />
        <Header />
        
        <div className="z-10 flex flex-col items-center text-center max-w-4xl animate-float">
          <div className="mb-6 p-4 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 shadow-[0_0_50px_rgba(255,204,0,0.3)]">
            <HeartIcon />
            <span className="text-combank-yellow font-bold tracking-wider text-sm md:text-base uppercase ml-2">Share Hope this Christmas</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-xl leading-tight">
            Wish for the <span className="text-combank-yellow italic">Nation</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl leading-relaxed">
            Send a heartfelt message to the families affected by the floods. For every wish you send, <strong className="text-combank-yellow">Commercial Bank donates Rs. 1,000</strong> towards relief efforts.
          </p>

          <button 
            onClick={handleStart}
            className="group relative bg-combank-yellow text-combank-dark font-bold text-2xl py-6 px-16 rounded-full shadow-[0_10px_30px_rgba(255,204,0,0.4)] hover:shadow-[0_20px_50px_rgba(255,204,0,0.6)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
          >
            <span className="flex items-center">
              Send a Wish
              <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        <div className="absolute bottom-12 z-10 w-full max-w-md">
           {/* Donation Counter Removed from here if previously present, logic handled in components/DonationCounter.tsx but component usage was removed in Attract? No, user only asked to remove from Success. Keeping here if user wants. Code shows it is here. */}
           {/* Wait, the previous request removed it from Success screen, but the provided file content in prompt shows it in Attract screen. I will keep it in Attract screen as per provided content unless asked otherwise. */}
           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center shadow-lg transform transition-all duration-500 hover:scale-105">
              <p className="text-combank-yellow uppercase tracking-widest text-xs font-semibold mb-1">Total Pledged So Far</p>
              <div className="text-3xl md:text-5xl font-bold text-white font-serif drop-shadow-md">
                {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(stats.totalDonated)}
              </div>
            </div>
        </div>
      </div>
    );
  }

  // 2. COMPOSE SCREEN
  if (screen === AppScreen.COMPOSE) {
    return (
      <div className="relative h-screen w-full bg-gradient-to-br from-combank-dark to-combank-blue text-white overflow-hidden flex flex-col">
        <Snowfall />
        <Header />
        
        <div className="z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-5xl mx-auto">
          <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center text-white">Your Message of Hope</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: John Doe"
                  className="w-full bg-black/20 text-white placeholder-blue-200/30 border-2 border-white/10 rounded-xl p-4 text-xl focus:outline-none focus:border-combank-yellow focus:ring-2 focus:ring-combank-yellow/20 transition-all"
                />
              </div>

              {/* Contact Field */}
              <div className="space-y-2">
                <label className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Contact Number</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Ex: 077 123 4567"
                  className="w-full bg-black/20 text-white placeholder-blue-200/30 border-2 border-white/10 rounded-xl p-4 text-xl focus:outline-none focus:border-combank-yellow focus:ring-2 focus:ring-combank-yellow/20 transition-all"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2 mb-8">
              <label className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Your Wish</label>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="May this season bring you strength and comfort..."
                className="w-full h-32 md:h-40 bg-black/20 text-white placeholder-blue-200/30 border-2 border-white/10 rounded-xl p-4 text-xl md:text-2xl font-serif focus:outline-none focus:border-combank-yellow focus:ring-2 focus:ring-combank-yellow/20 transition-all resize-none"
              />
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`
                  flex items-center justify-center
                  bg-combank-yellow text-combank-dark 
                  font-bold text-xl md:text-2xl py-5 px-12 rounded-full 
                  shadow-lg transition-all duration-300 w-full md:w-auto
                  ${!isFormValid ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 hover:shadow-combank-yellow/50'}
                `}
              >
                Send Wish & Donate Rs. 1,000 <HeartIcon />
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setScreen(AppScreen.ATTRACT)}
            className="mt-6 text-blue-200 hover:text-white underline decoration-blue-400/50 underline-offset-4"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // 3. PROCESSING SCREEN
  if (screen === AppScreen.PROCESSING) {
    return (
      <div className="relative h-screen w-full bg-gradient-to-br from-combank-dark to-combank-blue flex items-center justify-center">
        <Snowfall />
        <div className="z-10 text-center p-8">
           <div className="relative w-24 h-24 mx-auto mb-8">
             <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-combank-yellow rounded-full border-t-transparent animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <HeartIcon />
             </div>
           </div>
           <h2 className="text-3xl font-serif text-white font-bold mb-2">Sending your love...</h2>
           <p className="text-blue-200">Processing donation</p>
        </div>
      </div>
    );
  }

  // 4. SUCCESS SCREEN
  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-combank-dark to-combank-blue text-white overflow-hidden flex flex-col items-center justify-center p-6">
      <Snowfall />
      <Header />

      <div className="z-10 w-full max-w-3xl text-center">
        {/* Animated Checkmark/Heart */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full shadow-[0_0_40px_rgba(22,91,51,0.6)] animate-bounce">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-4xl md:text-6xl font-serif font-bold text-combank-yellow mb-4 drop-shadow-lg">
          Thank You!
        </h2>
        
        <p className="text-2xl md:text-3xl text-white mb-8">
          Rs. 1,000 has been donated on your behalf.
        </p>

        {/* AI Generated Personalized Response */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl mb-12 transform transition-all hover:bg-white/15">
          <p className="text-xl md:text-2xl italic font-serif leading-relaxed text-blue-100">
            "{aiResponse}"
          </p>
          <div className="mt-4 flex justify-center opacity-70">
            <img 
               src="https://www.combank.lk/assets/images/logo/newlogo.svg" 
               alt="Commercial Bank" 
               className="h-6 filter grayscale brightness-200" 
            />
          </div>
        </div>

        <button 
          onClick={handleNewWish}
          className="bg-transparent border-2 border-combank-yellow text-combank-yellow hover:bg-combank-yellow hover:text-combank-dark font-bold text-xl py-4 px-10 rounded-full transition-all duration-300"
        >
          Send Another Wish
        </button>
      </div>
    </div>
  );
};

export default App;