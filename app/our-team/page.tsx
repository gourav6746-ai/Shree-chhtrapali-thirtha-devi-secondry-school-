'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Globe, Search, Award, HelpCircle, Phone, Mail, Sparkles, BookOpen } from 'lucide-react';

// ==========================================
// OFFICIAL SCHOOL LOGO SVG COMPONENT
// ==========================================
function SchoolLogo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={className}
    >
      {/* 1. Outermost Rings */}
      <circle cx="100" cy="100" r="95" stroke="#0f2e82" strokeWidth="2.5" fill="white" />
      <circle cx="100" cy="100" r="90" stroke="#0f2e82" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="66" stroke="#0f2e82" strokeWidth="1.5" fill="none" />
      
      {/* 2. Text Paths */}
      {/* Top curved path (Clockwise from 9 to 3 o'clock over the top) */}
      <path id="top-curve" d="M 22,100 A 78,78 0 0,1 178,100" fill="none" stroke="none" />
      {/* Bottom curved path (Clockwise from 3 to 9 o'clock under the bottom) */}
      <path id="bottom-curve" d="M 178,100 A 78,78 0 0,1 22,100" fill="none" stroke="none" />
      
      {/* Top Text: श्री छत्रपाली तीर्था देवी माध्यमिक विद्यालय */}
      <text className="fill-[#0f2e82] font-semibold text-[11px] select-none">
        <textPath href="#top-curve" startOffset="50%" textAnchor="middle" letterSpacing="0.2">
          श्री छत्रपाली तीर्था देवी माध्यमिक विद्यालय
        </textPath>
      </text>
      
      {/* Bottom Text: मायादेवी १ पकडी क.ब */}
      <text className="fill-[#0f2e82] font-semibold text-[11.5px] select-none">
        <textPath href="#bottom-curve" startOffset="50%" textAnchor="middle" letterSpacing="0.3">
          मायादेवी १ पकडी क.ब
        </textPath>
      </text>

      {/* 3. Stars on left and right */}
      <text x="36" y="114" fill="#0f2e82" fontSize="12" textAnchor="middle" className="select-none">★</text>
      <text x="164" y="114" fill="#0f2e82" fontSize="12" textAnchor="middle" className="select-none">★</text>
      
      {/* 4. Overlapping triangles (Star of David) */}
      {/* Center is at (100, 100), radius of hexagram is 32 */}
      {/* Triangle 1 (Upward): top (100, 68), bottom-right (127.7, 116), bottom-left (72.3, 116) */}
      <polygon points="100,66 128.5,115 71.5,115" stroke="#0f2e82" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Triangle 2 (Downward): bottom (100, 134), top-left (71.5, 85), top-right (128.5, 85) */}
      <polygon points="100,134 71.5,85 128.5,85" stroke="#0f2e82" strokeWidth="2" fill="none" strokeLinejoin="round" />
      
      {/* 5. Center Book inside the hexagram (Centered at 100, 100) */}
      {/* Inner space is bounded from y=85 to y=115. Center of star is 100, 100. */}
      <path 
        d="M 100,92 Q 92,88 84,91 L 84,107 Q 92,104 100,108 Q 108,104 116,107 L 116,91 Q 108,88 100,92 Z" 
        stroke="#0f2e82" 
        strokeWidth="1.8" 
        fill="none" 
        strokeLinejoin="round" 
      />
      <line x1="100" y1="92" x2="100" y2="108" stroke="#0f2e82" strokeWidth="1.8" />
      
      {/* 6. Year below the book (२०१६) inside the circle */}
      <text x="100" y="148" fill="#0f2e82" fontSize="10.5" fontWeight="bold" textAnchor="middle" className="select-none font-sans">
        २०१६
      </text>
    </svg>
  );
}

// Roster Dataset for Shree Chhatrapali Tirthadevi Secondary School
const completeTeam = [
  // 1. Leadership
  {
    id: 1,
    category: 'admin',
    nameEn: 'Mr. Narendra Bahadur Kurmi',
    nameNp: ' नरेन्द्र बहादुर कुर्मी',
    roleEn: 'Principal',
    roleNp: 'प्रधानाध्यापक',
    subjectEn: 'science and technology',
    subjectNp: ' विज्ञान तथा प्रविधि',
    experienceEn: '25+ Years in Pedagogy',
    experienceNp: '२५ वर्ष भन्दा बढी शिक्षण तथा नेतृत्व अनुभव',
    email: 'narendrakurmi.scts@gmail.com',
    image: 'https://i.ibb.co/Rpx5J006/file-0000000066287207849b2ea5cd08ecaa.png',
  },
  {
    id: 2,
    category: 'admin',
    nameEn: 'Mr. Binod Kumar Gupta',
    nameNp: 'श्री बिनोड कुमार गुप्ता',
    roleEn: 'Vice Principal & Secondary Coordinator',
    roleNp: 'सहायक प्रधानाध्यापक तथा माध्यमिक तह संयोजक',
    subjectEn: 'Educational Psychology & Administration',
    subjectNp: 'शिक्षाशास्त्र, शैक्षिक मनोविज्ञान र संयोजना',
    experienceEn: '18 Years of Excellence',
    experienceNp: '१८ वर्षको गौरवमय प्राध्यापन यात्रा',
    email: 'binodgupta.scts@gmail.com',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    color: 'border-[#1a2744]',
  },
  
  // 2. Academic Teachers
  {
    id: 3,
    category: 'faculty',
    nameEn: 'Mr Gyanendar bahadur kurmi',
    nameNp: 'श्री ज्ञाननेन्द्र बहादुर कुर्मी',
    roleEn: 'Senior Lecturer',
    roleNp: 'वरिष्ठ माध्यमिक शिक्षक',
    subjectEn: 'social study ',
    subjectNp: ' सामाजिक अध्ययन',
    experienceEn: '15 Years',
    experienceNp: '१५ वर्ष अध्यापन अनुभव',
    email: 'Gyannendar@gmail.com',
    image: 'https://i.ibb.co/v6FFccBz/file-00000000b1a87208a9b4d9049ab95765.png',
    color: 'border-emerald-600',
  },
  {
    id: 4,
    category: 'faculty',
    nameEn: 'Mr chiran poudel',
    nameNp: 'श्री चिरान पौडेल',
    subjectEn: 'ENGLISH',
    subjectNp: ' अङग्रेजी',
    experienceEn: '12 Years',
    experienceNp: '१२ वर्ष व्यावसायिक प्राध्यापन',
    email: 'churan@gmail.com',
    image: 'https://i.ibb.co/qPhyzRX/IMG-20260623-073332.png',
    color: 'border-teal-600',
  },
  {
    id: 5,
    category: 'faculty',
    nameEn: 'Mrs. Goma Devi Paudel',
    nameNp: 'श्रीमती गोमा देवी पौडेल',
    roleEn: 'Senior Science Teacher',
    roleNp: 'वरिष्ठ विज्ञान शिक्षिका',
    subjectEn: 'General Science, Biology & Laboratory Works',
    subjectNp: 'सामान्य विज्ञान, जीवविज्ञान तथा प्रयोगात्मक विज्ञान',
    experienceEn: '14 Years',
    experienceNp: '१४ वर्ष विज्ञान शिक्षण',
    email: 'goma.science@gmail.com',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
    color: 'border-rose-600',
  },
  {
    id: 6,
    category: 'faculty',
    nameEn: 'Mr. Ramesh Pokhrel',
    nameNp: 'श्री रमेश पोखरेल',
    roleEn: 'IT Supervisor & Computer Science Faculty',
    roleNp: 'कम्प्युटर विज्ञान प्राध्यापक तथा आई.टी प्रमुख',
    subjectEn: 'Computer Science, Coding & System Admin',
    subjectNp: 'कम्प्युटर विज्ञान, कोडिङ र डिजिटल साक्षरता',
    experienceEn: '8 Years',
    experienceNp: '८ वर्ष सूचना प्रविधि परामर्शदाता',
    email: 'ramesh.tech@gmail.com',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    color: 'border-cyan-600',
  },
  {
    id: 7,
    category: 'faculty',
    nameEn: 'Mr. Deepesh Gyawali',
    nameNp: 'श्री दीपेश ज्ञवाली',
    roleEn: 'Mathematics & STEM Department Lead',
    roleNp: 'गणित तथा विज्ञान प्रविधि विभाग प्रमुख',
    subjectEn: 'Pure Mathematics, Statistics',
    subjectNp: 'कम्पल्सरी म्याथम्याटिक्स, ऐच्छिक गणित तथा तथ्याङ्कशास्त्र',
    experienceEn: '11 Years',
    experienceNp: '११ वर्ष गणित विषय अनुसन्धान',
    email: 'deepesh.math@gmail.com',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    color: 'border-amber-600',
  },
  {
    id: 8,
    category: 'faculty',
    nameEn: 'Mrs. Sunita Thapa',
    nameNp: 'श्रीमती सुनीता थापा',
    roleEn: 'Primary and Pre-Primary Coordinator',
    roleNp: 'प्राथमिक तह र प्रारम्भिक वाल विकास संयोजक',
    subjectEn: 'Child Psychology, Creative Art Activities',
    subjectNp: 'बाल मनोविज्ञान, बाल्यावस्था विकास र मनोरञ्जनात्मक कला',
    experienceEn: '9 Years',
    experienceNp: '९ वर्ष बाल शिक्षा परामर्श',
    email: 'sunita.primary@gmail.com',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    color: 'border-purple-600',
  },

  // 3. Support & Administrative Officers
  {
    id: 9,
    category: 'support',
    nameEn: 'Mr. Hari Prasad Mishra',
    nameNp: 'श्री हरी प्रसाद मिश्रा',
    roleEn: 'Administrative Officer & Chief Accountant',
    roleNp: 'प्रशासकीय अधिकृत तथा मुख्य लेखापाल',
    subjectEn: 'Office Ledgers, Financial Record Audit',
    subjectNp: 'कार्यालय वित्त व्यवस्थापन, विद्यालय बजेट तथा लेखा विवरण',
    experienceEn: '16 Years',
    experienceNp: '१६ वर्ष प्रशासकीय वित्तीय व्यवस्थापन र सेवा',
    email: 'accounting.scts@gmail.com',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    color: 'border-slate-500',
  },
  {
    id: 10,
    category: 'support',
    nameEn: 'Mrs. Laxmi Shrestha',
    nameNp: 'श्रीमती लक्ष्मी श्रेष्ठ',
    roleEn: 'Chief Librarian & Resource Organizer',
    roleNp: 'मुख्य पुस्तकालयाध्यक्ष तथा स्रोत व्यवस्थापक',
    subjectEn: 'Digital Cataloguing, Literary Resources',
    subjectNp: 'बाल पुस्तकालय व्यवस्थापन, डिजिटल पुस्तक अभिलेखीकरण र अध्ययन प्रोत्साहन',
    experienceEn: '10 Years',
    experienceNp: '१० वर्ष बौद्धिक पुस्तकालय सेवा',
    email: 'library.scts@gmail.com',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    color: 'border-indigo-600',
  },

  // 4. Honored Retired / Legacy Educators
  {
    id: 11,
    category: 'retired',
    nameEn: 'Mr. Dev Narayan Yadav',
    nameNp: 'श्री देव नारायण यादव',
    roleEn: 'Former Principal (Retired 2079 BS)',
    roleNp: 'पूर्व प्रधानाध्यापक (२०७९ सालमा निवृत्त)',
    subjectEn: '35 Years of Exemplary Leadership & SCTS Pioneer',
    subjectNp: '३५ वर्ष अनवरत शिक्षा सेवा र विद्यालयका संस्थापक मेरुदण्ड',
    experienceEn: 'Advisor Emeritus',
    experienceNp: 'वरिष्ठ शैक्षिक सल्लाहकार समिति प्रमुख',
    email: 'devnarayan.legacy@gmail.com',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    color: 'border-[#c9a227]',
    legacy: true
  },
  {
    id: 12,
    category: 'retired',
    nameEn: 'Mr. Krishna Bahadur Thapa',
    nameNp: 'श्री कृष्ण बहादुर थापा',
    roleEn: 'Former Senior Nepali & Sanskrit Teacher',
    roleNp: 'पूर्व वरिष्ठ नेपाली तथा संस्कृत भाषा शिक्षक',
    subjectEn: 'Language Heritage & Classical Literature Studies',
    subjectNp: 'शास्त्रीय नेपाली साहित्य, पौराणिक संस्कृत भाषा र दर्शन अध्यापन',
    experienceEn: 'Retired 2080 BS',
    experienceNp: 'साहित्यिक योगदान र २०८० मा सेवानिवृत्त',
    email: 'krishna.thapa@gmail.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
    color: 'border-[#1a2744]',
    legacy: true
  },
  {
    id: 13,
    category: 'retired',
    nameEn: 'Mrs. Radha Devi Chhetri',
    nameNp: 'श्रीमती राधा देवी क्षेत्री',
    roleEn: 'Former Senior Primary Faculty (Retired 2078 BS)',
    roleNp: 'पूर्व वरिष्ठ प्राथमिक शिक्षिका (२०७८ सालमा निवृत्त)',
    subjectEn: 'Foundational Literacy, Social values',
    subjectNp: 'प्रारम्भिक अक्षर ज्ञान, चरित्र निर्माण तथा बाल सामाजिकीकरण',
    experienceEn: '28 Years of Dedicated Teaching',
    experienceNp: '२८ वर्ष समर्पित अक्षर योगदान अभियान',
    email: 'radha.chhetri@gmail.com',
    image: 'https://images.unsplash.com/photo-1472417583565-62e7bdeda450?w=600&auto=format&fit=crop&q=80',
    color: 'border-[#c9a227]',
    legacy: true
  }
];

export default function OurTeamPage() {
  const [lang, setLang] = useState<'en' | 'np'>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('scts-language');
      if (savedLang === 'en' || savedLang === 'np') {
        return savedLang;
      }
    }
    return 'en';
  });
  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'faculty' | 'support' | 'retired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLang = (target: 'en' | 'np') => {
    setLang(target);
    localStorage.setItem('scts-language', target);
  };

  // Filter & Search Logic
  const filteredTeam = completeTeam.filter(member => {
    const matchesTab = activeTab === 'all' || member.category === activeTab;
    const nameMatch = (member.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       member.nameNp.includes(searchQuery));
    const subjectMatch = (member.subjectEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.subjectNp.includes(searchQuery));
    const roleMatch = (member.roleEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        member.roleNp.includes(searchQuery));
    
    return matchesTab && (nameMatch || subjectMatch || roleMatch);
  });

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-[#2d2d2d] selection:bg-[#c9a227]/30 flex flex-col font-sans">
      
      {/* ────────────────────────────────────────────────────────
          1. REGAL HEADER BRANDING (At the very top)
          ──────────────────────────────────────────────────────── */}
      <header className="bg-gradient-to-b from-white via-[#fdfcf9] to-[#f9f7f2] border-b border-gray-200 py-6 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden select-none">
        {/* Subtle background decoration curves */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-[#0f2e82]/5 rounded-br-full pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#c9a227]/5 rounded-bl-full pointer-events-none"></div>
        
        {/* School Name in Nepali & English - SABSE UPPER (At the very top) */}
        <div className="flex flex-col items-center gap-1.5 z-10">
          {/* Highly polished Nepali Devanagari heading */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-serif tracking-wide leading-tight drop-shadow-sm select-none">
            <span className="text-[#0f2e82]">श्री छत्रपाली तीर्था देवी </span>
            <span className="text-[#c9a227]">माध्यमिक विद्यालय</span>
          </h1>
          
          {/* Subheading English with elegant serif lettering */}
          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-wide font-sans select-none leading-none mt-1">
            <span className="text-[#0f2e82]">Shree Chhatrapali Tirthadevi </span>
            <span className="text-[#c9a227]">Secondary School</span>
          </h2>
          
          {/* Metadata tagline */}
          <div className="flex items-center gap-2 mt-1 px-3 py-0.5 rounded-full bg-[#0f2e82]/5 text-[10px] sm:text-[11px] font-mono tracking-wider text-[#0f2e82]/90 uppercase font-medium">
            <span>Mayadevi-1, Pakadi, Kapilvastu, Nepal</span>
            <span className="text-gray-300">•</span>
            <span className="text-[#c9a227]">Estd: 2016 VS</span>
          </div>
        </div>

        {/* Central Logo - Underneath the topmost name */}
        <div className="mt-5 hover:scale-105 transition-transform duration-300 z-10 filter drop-shadow-md">
          <SchoolLogo className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" />
        </div>
      </header>
      
      {/* ────────────────────────────────────────────────────────
          2. STICKY NAVIGATION BAR & BILINGUAL TOGGLE
          ──────────────────────────────────────────────────────── */}
      <nav id="header-nav" className="sticky top-0 z-45 bg-[#1a2744] shadow-md py-3 text-white transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <SchoolLogo className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wide font-serif text-[#c9a227]">
                {lang === 'en' ? 'Shree Chhatrapali Tirthadevi' : 'श्री छत्रपाली तीर्थादेवी'}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-300 leading-none">
                {lang === 'en' ? 'Secondary School' : 'माध्यमिक विद्यालय'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-gray-700 hover:bg-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Back to Home' : 'मुख्यगृह'}</span>
            </Link>

            {/* Language Ribbon */}
            <div className="border-l border-gray-600 pl-3 hidden sm:flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#c9a227]" />
              <button 
                onClick={() => toggleLang('en')} 
                className={`text-[11px] font-bold tracking-widest uppercase transition-all px-1.5 py-0.5 rounded ${lang === 'en' ? 'text-[#c9a227] bg-[#c9a227]/10' : 'text-gray-400 hover:text-white'}`}
              >
                EN
              </button>
              <span className="text-gray-600 text-xs">|</span>
              <button 
                onClick={() => toggleLang('np')} 
                className={`text-[11px] font-bold tracking-widest uppercase transition-all px-1.5 py-0.5 rounded ${lang === 'np' ? 'text-[#c9a227] bg-[#c9a227]/10' : 'text-gray-400 hover:text-white'}`}
              >
                नेपाली
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ────────────────────────────────────────────────────────
          2. MAJESTIC HERO SECTION
          ──────────────────────────────────────────────────────── */}
      <header className="relative bg-[#10192e] py-16 sm:py-20 text-white overflow-hidden text-center">
        {/* Dynamic decorative backdrop circles */}
        <div className="absolute inset-0 z-0 opacity-15" style={{
          backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
        <div className="absolute -top-12 left-1/4 w-72 h-72 bg-[#c9a227]/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-16 right-1/4 w-80 h-80 bg-blue-900/40 rounded-full blur-[90px]"></div>

        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a227]/20 border border-[#c9a227]/40 text-[#c9a227] text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'SCTS Pillars of Excellence' : 'एस.सी.टी.एस. शिक्षाका मुख्य खम्बाहरू'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4">
            {lang === 'en' ? 'Meet Our Distinguished Faculty' : 'हाम्रा आदरणीय शिक्षक तथा प्रशासक टोली'}
          </h1>
          <p className="text-gray-300 font-light max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {lang === 'en' 
              ? 'Our passionate educators, dynamic support officers, and legendary retired figures dedicated to fostering academic leadership in Pakadi, Kapilvastu.'
              : 'मायादेवी गाउँपालिका, पकडी कपिलवस्तु क्षेत्रमा ३ दशक देखि समृद्ध र गुणस्तरीय सिकाई प्रदान गर्दै आइरहेका कुशल शिक्षक, सहयोगी कर्मचारी र हाम्रा गौरवशाली सेवानिवृत्त संकाय।'
            }
          </p>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
          3. REAL-TIME FILTERS AND SEARCH COMPONENT
          ──────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 py-4 lg:py-6 lg:sticky lg:top-[61px] relative z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            
            {/* Filter buttons with luxury golden style tab layout */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 font-sans cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#1a2744] text-white shadow-md shadow-gray-200'
                    : 'bg-[#f4f1ea] hover:bg-[#eae6db] text-[#2d2d2d]'
                }`}
              >
                {lang === 'en' ? 'All Team (सबै टोली)' : 'सम्पूर्ण टोली'}
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 font-sans cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#1a2744] text-white shadow-md shadow-gray-200'
                    : 'bg-[#f4f1ea] hover:bg-[#eae6db] text-[#2d2d2d]'
                }`}
              >
                {lang === 'en' ? 'Leadership (प्रशासन)' : 'प्रशासक र नेतृत्व'}
              </button>
              <button
                onClick={() => setActiveTab('faculty')}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 font-sans cursor-pointer ${
                  activeTab === 'faculty'
                    ? 'bg-[#1a2744] text-white shadow-md shadow-gray-200'
                    : 'bg-[#f4f1ea] hover:bg-[#eae6db] text-[#2d2d2d]'
                }`}
              >
                {lang === 'en' ? 'Teachers (शिक्षकहरू)' : 'विषयगत अध्यापकहरू'}
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 font-sans cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-[#1a2744] text-white shadow-md shadow-gray-200'
                    : 'bg-[#f4f1ea] hover:bg-[#eae6db] text-[#2d2d2d]'
                }`}
              >
                {lang === 'en' ? 'Staff (सहयोगी कर्मचारी)' : 'कार्यालय तथा सहयोगी'}
              </button>
              <button
                onClick={() => setActiveTab('retired')}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 font-sans cursor-pointer ${
                  activeTab === 'retired'
                    ? 'bg-[#c9a227] text-white shadow-md shadow-gray-200'
                    : 'bg-[#f4f1ea] hover:bg-[#eae6db] text-[#2d2d2d]'
                }`}
              >
                {lang === 'en' ? 'Honorary Retired (सेवानिवृत्त)' : 'सम्मानित पूर्व शिक्षक'}
              </button>
            </div>

            {/* Premium Bilingual Search Input bar */}
            <div className="relative w-full lg:w-80 shrink-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#c9a227]" />
              </span>
              <input
                type="text"
                placeholder={lang === 'en' ? 'Search by name, role or subject...' : 'नाम वा विषयबाट खोज्नुहोस्...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full bg-[#fcfbf9] text-sm text-[#2d2d2d] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/40 focus:border-[#c9a227] transition-all duration-200"
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. TEAM GRID WITH LEFT & RIGHT SMOOTH ENTRANCE INTERPOLATING ANIMATION
          ──────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Results Info and count helper */}
        <div className="mb-8 flex items-center justify-between text-xs tracking-wider text-gray-500 uppercase font-sans">
          <span>
            {lang === 'en' ? 'Showing ' : 'प्रदर्शित सङ्ख्या: '} 
            <strong className="text-[#1a2744] font-bold font-mono">{filteredTeam.length}</strong>
            {lang === 'en' ? ' Members' : ' जना'}
          </span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[#c9a227] hover:underline normal-case"
            >
              {lang === 'en' ? 'Clear filter' : 'Filter हटाउनुहोस्'}
            </button>
          )}
        </div>

        {/* Dynamic animated Grid matching the smooth left/right scroll transitions */}
        {filteredTeam.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredTeam.map((member, idx) => {
                // Determine layout scroll path index for alternating left and right motion animations!
                const isEven = idx % 2 === 0;

                return (
                  <motion.div
                    key={member.id}
                    layoutId={`member-card-${member.id}`}
                    initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ type: "spring", stiffness: 60, damping: 15, delay: idx % 4 * 0.05 }}
                    className={`bg-white rounded-2xl shadow-md border-l-8 hover:shadow-xl transition-all duration-300 p-5 sm:p-6 lg:p-7 relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center sm:items-start ${member.color} group`}
                  >
                    {/* Retro luxury backdrop details */}
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-3xl opacity-60 pointer-events-none group-hover:bg-[#c9a227]/5 transition-colors duration-500"></div>
                    
                    {/* Interactive high quality photograph container */}
                    <div className="relative w-32 h-32 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl overflow-hidden shadow-inner shrink-0 bg-gray-100 flex items-center justify-center border border-gray-200">
                      <img 
                        src={member.image} 
                        alt={member.nameEn} 
                        className="w-full h-full object-cover transform transition-transform duration-[4000ms] group-hover:scale-110 filter brightness-[0.98] contrast-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                      {/* Optional retired badge overlay */}
                      {member.legacy && (
                        <div className="absolute inset-x-0 bottom-0 py-0.5 bg-[#c9a227]/90 text-white text-[9px] uppercase font-bold tracking-widest text-center shadow-lg">
                          {lang === 'en' ? 'Legacy' : 'सेवानिवृत्त'}
                        </div>
                      )}
                    </div>

                    {/* Roster textual details with dual language */}
                    <div className="flex-1 flex flex-col justify-between h-full text-center sm:text-left w-full h-full min-h-[128px]">
                      <div>
                        {/* Interactive Sparkle tag optionally */}
                        <div className="flex items-center justify-center sm:justify-start gap-1 pb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${member.legacy ? 'bg-amber-100/80 text-amber-800' : 'bg-blue-50 text-blue-700'}`}>
                            {lang === 'en' ? member.roleEn : member.roleNp}
                          </span>
                          {member.legacy && (
                            <Award className="w-3.5 h-3.5 text-[#c9a227]" />
                          )}
                        </div>

                        <h3 className="text-xl sm:text-lg md:text-xl font-bold text-[#1a2744] font-serif tracking-tight mt-1">
                          {lang === 'en' ? member.nameEn : member.nameNp}
                        </h3>

                        <p className="text-sm font-medium text-gray-700 mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
                          <BookOpen className="w-3.5 h-3.5 text-[#c9a227] shrink-0" />
                          <span>{lang === 'en' ? member.subjectEn : member.subjectNp}</span>
                        </p>

                        <div className="text-xs text-gray-500 mt-2 italic font-sans flex items-center justify-center sm:justify-start gap-1">
                          <span>{lang === 'en' ? 'Track: ' : 'अनुभव: '}</span>
                          <span className="font-medium text-gray-600 font-sans">{lang === 'en' ? member.experienceEn : member.experienceNp}</span>
                        </div>
                      </div>

                      {/* Contact row link helper */}
                      <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-center sm:justify-between flex-wrap gap-2">
                        <a 
                          href={`mailto:${member.email}`}
                          className="text-xs text-gray-400 hover:text-[#c9a227] flex items-center gap-1 transition-colors group-hover:text-gray-600"
                        >
                          <Mail className="w-3 h-3 text-[#c9a227]" />
                          <span className="font-mono">{member.email}</span>
                        </a>
                        
                        <span className="text-[10px] text-gray-300 select-none uppercase font-semibold hidden md:inline">
                          SCTS • PILOT
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty Search Fallback */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center max-w-md mx-auto"
          >
            <div className="w-12 h-12 rounded-full bg-[#c9a227]/10 flex items-center justify-center mx-auto text-[#c9a227] mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1a2744] font-serif">
              {lang === 'en' ? 'No Team Member Found' : 'कुनै शिक्षक भेटिएन'}
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              {lang === 'en' 
                ? 'Try matching your spelling, selecting a different tab, or clearing the search box query.'
                : 'कृपया आफ्नो हिज्जे जाँच गर्नुहोस् वा फरक वर्ग छनोट गरी पुन: प्रयास गर्नुहोस्।'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
              className="mt-4 px-4 py-1.5 rounded-full bg-[#1a2744] hover:bg-[#c9a227] text-white text-xs font-semibold tracking-wider uppercase shadow-md transition-colors"
            >
              {lang === 'en' ? 'Reset Search' : 'पूर्ववत गर्नुहोस्'}
            </button>
          </motion.div>
        )}
      </main>

      {/* ────────────────────────────────────────────────────────
          5. MAJESTIC TRUST RATING / RETIRED STATEMENT BANNER
          ──────────────────────────────────────────────────────── */}
      <section className="bg-[#10192e] py-16 text-white border-t-2 border-[#c9a227]/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #f9f7f2 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Award className="w-12 h-12 text-[#c9a227] mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-serif text-[#c9a227] font-semibold mb-3">
            {lang === 'en' ? 'In Honor of Our Retired Legends' : 'निवृत्त गुरुवर्ग प्रति सादर सम्मान'}
          </h2>
          <p className="text-gray-300 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Our secondary school owes its glorious foundations to the retired mentors who gave their youth to shape multiple generations of scholars. If you are an alumnus or legacy faculty, we welcome you to submit historic memoirs.'
              : 'छत्रपाली तीर्थादेशका वर्तमान खम्बाहरू विगतका गुरुहरूको त्याग र तपस्या माथि उभिएका छन्। सेवानिवृत्त शिक्षकहरूको बौद्धिक योगदान र निरन्तर सम्झनाको लागि हामी सदैव नतमस्तक छौं।'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="tel:+97776540111" 
              className="text-xs bg-[#c9a227] hover:bg-[#b08c20] text-white font-bold tracking-wider uppercase px-4 py-2 rounded-full shadow-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Contact Alumni' : 'अल्मुनाई सम्पर्क'}</span>
            </a>
            <a 
              href="mailto:alumni.scts@gmail.com" 
              className="text-xs border border-gray-600 hover:border-white text-gray-200 hover:text-white font-semibold tracking-wider uppercase px-4 py-2 rounded-full transition-colors inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Share Memoirs' : 'संस्मरण पठाउनुहोस्'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          6. MATCHING SCTS FOOTER COMPONENT
          ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0a101d] text-gray-400 py-10 border-t border-gray-900 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif text-[#c9a227] text-sm font-semibold mb-2">
            Shree Chhatrapali Tirthadevi Secondary School
          </p>
          <p className="mb-4">
            {lang === 'en' 
              ? 'Pakadi, Maya-Devi Rural Municipality, Kapilvastu, Lumbini Zone, Nepal' 
              : 'पकडी, मायादेवी गाउँपालिका, कपिलवस्तु, लुम्बिनी प्रदेश, नेपाल'}
          </p>
          <div className="w-24 h-[1px] bg-[#c9a227]/30 mx-auto mb-4"></div>
          <p>
            &copy; {new Date().getFullYear()} SCTS. All rights reserved. Created in honoring local public values.
          </p>
        </div>
      </footer>

    </div>
  );
}
