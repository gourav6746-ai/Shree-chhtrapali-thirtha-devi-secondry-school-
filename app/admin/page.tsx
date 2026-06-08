'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  db, 
  handleFirestoreError, 
  OperationType 
} from '../../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDoc
} from 'firebase/firestore';
import { 
  Lock, 
  LogOut, 
  Users, 
  Bell as Notification, 
  Calendar, 
  Image as ImageIcon, 
  Award, 
  Phone, 
  Home, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  UserCheck, 
  Sparkles, 
  Loader2,
  FileText,
  ShieldCheck,
  Megaphone,
  Network
} from 'lucide-react';

export default function AdminPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'team' | 'notices' | 'news' | 'gallery' | 'achievements' | 'contact' | 'homepage'>('team');

  // Firestore dynamic lists
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [newsEvents, setNewsEvents] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [contactConfig, setContactConfig] = useState<any>({
    id: 'main',
    phone1: '+977-76-691017',
    phone2: '',
    email: 'info@shreechhatrapalischool.edu.np',
    addressEn: 'Mayadevi-1, Pakadi, Kapilvastu, Nepal',
    addressNp: 'मायादेवी-१, पकडी, कपिलवस्तु, नेपाल',
    facebookUrl: 'https://facebook.com',
    youtubeUrl: 'https://youtube.com',
    twitterUrl: 'https://twitter.com'
  });
  const [homepageConfig, setHomepageConfig] = useState<any>({
    id: 'hero',
    welcomeTitleEn: 'Shree Chhatrapali Tirthadevi Secondary School',
    welcomeTitleNp: 'श्री छत्रपाली तीर्थादेवी माध्यमिक विद्यालय',
    welcomeSubtitleEn: 'Empowering generations through transformative education, structural character-building, and localized societal welfare.',
    welcomeSubtitleNp: 'गुणस्तरीय शिक्षा, व्यावहारिक ज्ञान र अनुशासित जीवन शैली सहित विद्यार्थीहरूको उज्ज्वल भविष्य निर्माण गर्न कटिबद्ध।',
    principalQuoteEn: 'Education is the key to unlocking the true potential of our students and fostering regional excellence.',
    principalQuoteNp: 'गुणस्तरीय शिक्षाले नै हाम्रा विद्यार्थीहरूको साँचो क्षमता उजागर गर्न र क्षेत्रीय उत्कृष्टताको विकास गर्न मद्दत पुग्दछ।',
    principalNameEn: 'Mr. Ram Prasad Sharma',
    principalNameNp: 'श्री राम प्रसाद शर्मा',
    welcomeIntroductionEn: 'Our secondary school stands as an educational beacon in Pakadi, Kapilvastu, dedicated to modern standards.',
    welcomeIntroductionNp: 'पकडी, कपिलवस्तु अवस्थित यस श्री छत्रपाली तीर्थादेवी माध्यमिक विद्यालयले आफ्ना विद्यार्थीहरूलाई समयसापेक्ष उत्कृष्ट शिक्षा प्रदान गर्दै आइरहेको छ।'
  });

  // Modal and Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Status and Alerts
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const adminEmail = 'gourav6746@gmail.com';

  // Listen to Auth state change
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  // Listen to Firestore content when user is admin
  useEffect(() => {
    if (!user || user.email !== adminEmail) return;

    // Team Members
    const unsubTeam = onSnapshot(
      query(collection(db, 'team_members'), orderBy('order', 'asc')),
      (snap) => {
        setTeamMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'team_members')
    );

    // Notices
    const unsubNotices = onSnapshot(
      query(collection(db, 'notices'), orderBy('date', 'desc')),
      (snap) => {
        setNotices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'notices')
    );

    // News and Events
    const unsubNews = onSnapshot(
      query(collection(db, 'news_and_events'), orderBy('date', 'desc')),
      (snap) => {
        setNewsEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'news_and_events')
    );

    // Gallery
    const unsubGallery = onSnapshot(
      query(collection(db, 'gallery_images'), orderBy('order', 'asc')),
      (snap) => {
        setGalleryImages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'gallery_images')
    );

    // Achievements
    const unsubAchievements = onSnapshot(
      query(collection(db, 'achievements'), orderBy('order', 'asc')),
      (snap) => {
        setAchievements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'achievements')
    );

    // Contact configs
    const unsubContact = onSnapshot(
      doc(db, 'contact_configurations', 'main'),
      (snap) => {
        if (snap.exists()) {
          setContactConfig({ id: 'main', ...snap.data() });
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'contact_configurations/main')
    );

    // Homepage configs
    const unsubHero = onSnapshot(
      doc(db, 'homepage_configurations', 'hero'),
      (snap) => {
        if (snap.exists()) {
          setHomepageConfig({ id: 'hero', ...snap.data() });
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'homepage_configurations/hero')
    );

    return () => {
      unsubTeam();
      unsubNotices();
      unsubNews();
      unsubGallery();
      unsubAchievements();
      unsubContact();
      unsubHero();
    };
  }, [user]);

  // Google Login popup
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login Failed: ', err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clean states
      setUser(null);
    } catch (err) {
      console.error('Logout error: ', err);
    }
  };

  // Open Form and setup defaults
  const openForm = (type: 'create' | 'edit', initialData: any = null) => {
    setFormType(type);
    if (type === 'edit' && initialData) {
      setEditId(initialData.id);
      setFormData({ ...initialData });
    } else {
      setEditId(null);
      // Setup structural fields
      if (activeTab === 'team') {
        setFormData({
          nameEn: '',
          nameNp: '',
          roleEn: '',
          roleNp: '',
          category: 'faculty',
          order: teamMembers.length + 1,
          phone: '',
          email: '',
          image: ''
        });
      } else if (activeTab === 'notices') {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          titleEn: '',
          titleNp: '',
          descEn: '',
          descNp: '',
          date: today,
          isNew: true
        });
      } else if (activeTab === 'news') {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          titleEn: '',
          titleNp: '',
          descEn: '',
          descNp: '',
          date: today,
          image: ''
        });
      } else if (activeTab === 'gallery') {
        setFormData({
          titleEn: '',
          titleNp: '',
          descEn: '',
          descNp: '',
          src: '',
          order: galleryImages.length + 1
        });
      } else if (activeTab === 'achievements') {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          titleEn: '',
          titleNp: '',
          descEn: '',
          descNp: '',
          date: today,
          iconName: 'Award',
          order: achievements.length + 1
        });
      }
    }
    setIsFormOpen(true);
  };

  // Submit form payload to Firestore 
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let collectionName = '';
    let documentId = editId || `${activeTab}_${Date.now()}`;
    const finalPayload = { ...formData };

    switch (activeTab) {
      case 'team':
        collectionName = 'team_members';
        finalPayload.order = parseInt(formData.order) || teamMembers.length + 1;
        break;
      case 'notices':
        collectionName = 'notices';
        break;
      case 'news':
        collectionName = 'news_and_events';
        break;
      case 'gallery':
        collectionName = 'gallery_images';
        finalPayload.order = parseInt(formData.order) || galleryImages.length + 1;
        break;
      case 'achievements':
        collectionName = 'achievements';
        finalPayload.order = parseInt(formData.order) || achievements.length + 1;
        break;
    }

    try {
      // Direct Firestore setDoc
      await setDoc(doc(db, collectionName, documentId), finalPayload);
      setIsFormOpen(false);
      setFormData({});
      setEditId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${documentId}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete Action
  const handleDeleteItem = async (id: string) => {
    let collectionName = '';
    switch (activeTab) {
      case 'team': collectionName = 'team_members'; break;
      case 'notices': collectionName = 'notices'; break;
      case 'news': collectionName = 'news_and_events'; break;
      case 'gallery': collectionName = 'gallery_images'; break;
      case 'achievements': collectionName = 'achievements'; break;
    }

    try {
      await deleteDoc(doc(db, collectionName, id));
      setDeleteConfirmId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  // Special direct config updates for Contact and Homepage settings
  const handleConfigUpdate = async (type: 'contact' | 'homepage', payload: any) => {
    setSaving(true);
    const collectionName = type === 'contact' ? 'contact_configurations' : 'homepage_configurations';
    const docId = type === 'contact' ? 'main' : 'hero';
    try {
      await setDoc(doc(db, collectionName, docId), payload);
      alert('Settings updated successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${docId}`);
    } finally {
      setSaving(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 font-sans gap-4" id="loading-auth">
        <Loader2 className="w-8 h-8 animate-spin text-[#c9a227]" />
        <span className="text-sm font-medium tracking-wide">Securing connection...</span>
      </div>
    );
  }

  // Not logged in: Show elegant administrative login interface
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-[#c9a227]/30 selection:text-white" id="admin-login-view">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 flex flex-col relative overflow-hidden">
          
          {/* Subtle gold visual flair */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227]/5 rounded-full blur-3xl" />
          
          {/* Back button */}
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-[#c9a227] text-xs font-semibold gap-1.5 mb-6 self-start group transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Public Site
          </Link>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
              <Lock className="w-6 h-6" />
            </div>
            
            <h1 className="font-serif text-xl font-bold text-slate-100 tracking-tight leading-tight">
              Shree Chhatrapali Tirthadevi
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-1 mb-6">
              Administrative Command Center
            </p>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Welcome. This portal is restricted to authorized personnel only. Please sign in with Google to continue.
            </p>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#c9a227]/10"
              id="google-signin-btn"
            >
              {/* Google stylized G icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but email mismatch: Access Denied Page
  if (user && user.email !== adminEmail) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-rose-500/30 text-white" id="access-denied-view">
        <div className="w-full max-w-md bg-slate-900 border border-rose-900/30 rounded-2xl shadow-2xl p-8 flex flex-col relative overflow-hidden">
          
          {/* Edge warning accent */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-rose-500" />
          
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-rose-950/40 border border-rose-800/50 rounded-xl flex items-center justify-center mb-4 text-rose-500">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h1 className="font-serif text-xl font-bold text-rose-400 tracking-tight leading-tight">
              Access Denied
            </h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1 mb-6">
              Security Firewall Active
            </p>

            <p className="text-slate-300 text-sm leading-relaxed mb-2">
              Identity authenticated successfully as:
            </p>
            <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg mb-6 w-full text-center">
              <span className="font-mono text-xs text-slate-300 font-semibold">{user.email}</span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed mb-8">
              Your email is not authorized for administrative roles. ONLY the primary developer account (<span className="text-slate-300 font-medium">gourav6746@gmail.com</span>) has permission to mutate databases or views.
            </p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all border border-slate-700"
              id="mismatch-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Reauthenticate
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Active Admin Panel for gourav6746@gmail.com
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col flex-1 leading-relaxed selection:bg-[#c9a227]/30 selection:text-white" id="admin-dashboard-root">
      
      {/* Dynamic Upper Control HUD */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c9a227]/10 rounded-lg flex items-center justify-center border border-[#c9a227]/20 text-[#c9a227]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-lg font-bold text-slate-100">SCTS Admin Portal</h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Active System
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Authenticated: <span className="font-mono text-slate-300 font-semibold">{user.email}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/" className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-755 border border-slate-700 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            View Site
          </Link>
          <button 
            onClick={handleLogout}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500 hover:text-slate-950 text-rose-400 border border-rose-500/20 hover:border-transparent transition-all"
            id="dashboard-logout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Navigation Rail / Sidebar */}
        <nav className="w-full lg:w-64 bg-slate-900/40 lg:border-r border-slate-800 p-4 lg:p-6 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible">
          <span className="hidden lg:block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 px-3">
            Navigation Sections
          </span>
          
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${activeTab === 'team' ? 'bg-[#c9a227] text-slate-950' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4" />
            Teachers & Staff
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${activeTab === 'notices' ? 'bg-[#c9a227] text-slate-950' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <FileText className="w-4 h-4" />
            School Board Notices
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${activeTab === 'news' ? 'bg-[#c9a227] text-slate-950' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <Megaphone className="w-4 h-4" />
            News & Events
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${activeTab === 'gallery' ? 'bg-[#c9a227] text-slate-950' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <ImageIcon className="w-4 h-4" />
            Dynamic Photo Gallery
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${activeTab === 'achievements' ? 'bg-[#c9a227] text-slate-950' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <Award className="w-4 h-4" />
            Milestones & Honors
          </button>

          <div className="h-px bg-slate-800 my-2 hidden lg:block" />

          <span className="hidden lg:block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 px-3 mt-2">
            Configurations
          </span>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${activeTab === 'contact' ? 'bg-[#c9a227] text-slate-950' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <Phone className="w-4 h-4" />
            Contact Information
          </button>

          <button
            onClick={() => setActiveTab('homepage')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${activeTab === 'homepage' ? 'bg-[#c9a227] text-slate-950' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <Sparkles className="w-4 h-4" />
            Hero Homepage Strings
          </button>
        </nav>

        {/* Content Portal Frame */}
        <main className="flex-1 p-6 sm:p-8 bg-slate-955 overflow-y-auto max-w-6xl">
          
          {/* Main List Management Panels */}
          {activeTab === 'team' && (
            <div className="space-y-6" id="panel-team">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-100">School Faculty & Staff</h2>
                  <p className="text-xs text-slate-400">Instantly update administrative and teacher records on the Team page.</p>
                </div>
                <button 
                  onClick={() => openForm('create')}
                  className="inline-flex items-center gap-1.5 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 items-start relative">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-755">
                      {member.image ? (
                        <img src={member.image} alt={member.nameEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Users className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-16">
                      <h4 className="font-serif text-sm font-bold text-slate-100 truncate">{member.nameEn} <span className="font-sans text-[11px] text-[#c9a227] ml-1">({member.nameNp})</span></h4>
                      <p className="text-xs text-slate-400 truncate">{member.roleEn} ({member.category})</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide font-mono">Position Index: {member.order}</p>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <button 
                        onClick={() => openForm('edit', member)}
                        className="p-1 px-1.5 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition-colors text-[11px]"
                        title="Edit Item"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(member.id)}
                        className="p-1 px-1.5 text-rose-450 hover:bg-rose-500 hover:text-slate-950 bg-rose-500/10 rounded border border-rose-550/20 transition-all text-[11px]"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {teamMembers.length === 0 && (
                  <div className="col-span-full border border-dashed border-slate-800 py-12 text-center rounded-xl text-slate-500 text-xs">
                    No custom team members registered yet. Displaying static fallbacks on main site.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-6" id="panel-notices">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-100">School Notices & Announcements</h2>
                  <p className="text-xs text-slate-400">Post dynamic circulars, exam announcements, and localized admissions info.</p>
                </div>
                <button 
                  onClick={() => openForm('create')}
                  className="inline-flex items-center gap-1.5 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  Post Notice
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {notices.map(notice => (
                  <div key={notice.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-[#c9a227] bg-[#c9a227]/10 px-2 py-0.5 rounded border border-[#c9a227]/20">
                        {notice.date}
                      </span>
                      {notice.isNew && (
                        <span className="text-[9px] bg-red-650/20 border border-red-500/20 text-red-500 font-bold px-1.5 py-0.5 rounded">
                          LATEST
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-100 mt-2.5 max-w-[85%]">{notice.titleEn}</h3>
                    <p className="text-[11px] text-slate-400 font-medium ml-1">({notice.titleNp})</p>
                    <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800 line-clamp-2 leading-relaxed">{notice.descEn}</p>

                    <div className="absolute top-5 right-5 flex items-center gap-1.5">
                      <button 
                        onClick={() => openForm('edit', notice)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition-colors"
                        title="Edit Item"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(notice.id)}
                        className="p-1.5 text-rose-450 hover:bg-rose-500 hover:text-slate-950 bg-rose-500/10 rounded border border-rose-550/20 transition-all"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {notices.length === 0 && (
                  <div className="border border-dashed border-slate-800 py-12 text-center rounded-xl text-slate-500 text-xs">
                    No custom notices posted yet. Displaying static fallbacks on main site.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-6" id="panel-news">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-100">News & Seasonal Events</h2>
                  <p className="text-xs text-slate-400">Chronicle school milestones, sports wins, activities, and assemblies.</p>
                </div>
                <button 
                  onClick={() => openForm('create')}
                  className="inline-flex items-center gap-1.5 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsEvents.map(news => (
                  <div key={news.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col gap-3">
                    <div className="aspect-video w-full rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative">
                      {news.image ? (
                        <img src={news.image} alt={news.titleEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No media attached</div>
                      )}
                      <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-slate-900/90 text-[#c9a227] px-2 py-0.5 rounded border border-slate-800">
                        {news.date}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-100 leading-snug line-clamp-1">{news.titleEn}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{news.descEn}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2.5 border-t border-slate-800/80">
                      <button 
                        onClick={() => openForm('edit', news)}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800 rounded transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(news.id)}
                        className="flex-1 inline-flex items-center justify-center gap-0.5 py-1.5 text-[11px] font-semibold text-rose-400 hover:bg-rose-500 hover:text-slate-950 bg-rose-500/10 border border-rose-500/20 rounded transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {newsEvents.length === 0 && (
                  <div className="col-span-full border border-dashed border-slate-800 py-12 text-center rounded-xl text-slate-500 text-xs">
                    No custom news or events logged yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6" id="panel-gallery">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-100">Dynamic Photo Gallery</h2>
                  <p className="text-xs text-slate-400">Seamlessly add pictures to the beautiful media portal grid on the landing page.</p>
                </div>
                <button 
                  onClick={() => openForm('create')}
                  className="inline-flex items-center gap-1.5 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  Add Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map(img => (
                  <div key={img.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-4 relative group">
                    <div className="aspect-video w-full rounded-lg bg-slate-950 overflow-hidden relative border border-slate-800">
                      <img src={img.src} alt={img.titleEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-slate-900/90 text-slate-400 px-2 py-0.5 rounded">
                        Index: {img.order}
                      </span>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-serif text-xs font-bold text-slate-100 truncate">{img.titleEn}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{img.descEn}</p>
                    </div>

                    <div className="absolute top-6 right-6 flex items-center gap-1.5">
                      <button 
                        onClick={() => openForm('edit', img)}
                        className="p-1 px-1.5 text-slate-400 hover:text-white bg-slate-900/90 rounded border border-slate-700 hover:border-slate-500 transition-colors text-[10px]"
                        title="Edit Item"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(img.id)}
                        className="p-1 px-1.5 text-rose-450 hover:bg-rose-500 hover:text-slate-950 bg-slate-900/90 rounded border border-rose-500/30 transition-all text-[10px]"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {galleryImages.length === 0 && (
                  <div className="col-span-full border border-dashed border-slate-800 py-12 text-center rounded-xl text-slate-500 text-xs">
                    No custom photo elements defined. Displaying static fallbacks on main site.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6" id="panel-achievements">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-100">Milestones & Honors</h2>
                  <p className="text-xs text-slate-400">Display outstanding student achievements and official academic recognitions.</p>
                </div>
                <button 
                  onClick={() => openForm('create')}
                  className="inline-flex items-center gap-1.5 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  Add Milestone
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(ach => (
                  <div key={ach.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[#c9a227] flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-16">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{ach.date}</span>
                      <h4 className="font-serif text-sm font-bold text-slate-100 mt-1 leading-tight">{ach.titleEn}</h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ach.descEn}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1.5 lowercase">Sequence Order: {ach.order}</p>
                    </div>

                    <div className="absolute top-5 right-5 flex items-center gap-1.5">
                      <button 
                        onClick={() => openForm('edit', ach)}
                        className="p-1 px-1.5 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 text-[10px]"
                        title="Edit Item"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(ach.id)}
                        className="p-1 px-1.5 text-rose-450 hover:bg-rose-500 hover:text-slate-950 bg-rose-500/10 rounded border border-rose-550/20 transition-all text-[10px]"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="col-span-full border border-dashed border-slate-800 py-12 text-center rounded-xl text-slate-500 text-xs">
                    No custom milestones posted.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6" id="panel-contact">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-100">School Channels & Contact Info</h2>
                <p className="text-xs text-slate-400">Instantly update the phones, email, physical addresses, and social links displayed across the site.</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConfigUpdate('contact', contactConfig);
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-300 font-semibold">Primary Contact Phone</label>
                    <input 
                      type="text" 
                      value={contactConfig.phone1 || ''} 
                      onChange={(e) => setContactConfig({ ...contactConfig, phone1: e.target.value })}
                      className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-300 font-semibold">Secondary Contact Phone (Optional)</label>
                    <input 
                      type="text" 
                      value={contactConfig.phone2 || ''} 
                      onChange={(e) => setContactConfig({ ...contactConfig, phone2: e.target.value })}
                      className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-300 font-semibold">Official Contact Email</label>
                    <input 
                      type="email" 
                      value={contactConfig.email || ''} 
                      onChange={(e) => setContactConfig({ ...contactConfig, email: e.target.value })}
                      className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-300 font-semibold">Physical Location [English]</label>
                    <input 
                      type="text" 
                      value={contactConfig.addressEn || ''} 
                      onChange={(e) => setContactConfig({ ...contactConfig, addressEn: e.target.value })}
                      className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-slate-300 font-semibold">Physical Location [Nepali / नेपाली भाषा]</label>
                    <input 
                      type="text" 
                      value={contactConfig.addressNp || ''} 
                      onChange={(e) => setContactConfig({ ...contactConfig, addressNp: e.target.value })}
                      className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-300 font-semibold">Facebook URL</label>
                    <input 
                      type="url" 
                      value={contactConfig.facebookUrl || ''} 
                      onChange={(e) => setContactConfig({ ...contactConfig, facebookUrl: e.target.value })}
                      className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-300 font-semibold">YouTube Channel URL</label>
                    <input 
                      type="url" 
                      value={contactConfig.youtubeUrl || ''} 
                      onChange={(e) => setContactConfig({ ...contactConfig, youtubeUrl: e.target.value })}
                      className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 text-xs font-bold px-6 py-3 rounded-xl transition-transform hover:scale-[1.01]"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Configurations
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'homepage' && (
            <div className="space-y-6" id="panel-homepage">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-100">Hero Homepage Strings</h2>
                <p className="text-xs text-slate-400">Dynamically update the titles, subtitles, welcome statement, messages, and leadership quotes shown on the index screen.</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConfigUpdate('homepage', homepageConfig);
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6"
              >
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#c9a227] border-b border-slate-800 pb-2">Main Welcome Header</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-300 font-semibold">Dynamic School Name [English]</label>
                      <input 
                        type="text" 
                        value={homepageConfig.welcomeTitleEn || ''} 
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, welcomeTitleEn: e.target.value })}
                        className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-300 font-semibold">Dynamic School Name [Nepali]</label>
                      <input 
                        type="text" 
                        value={homepageConfig.welcomeTitleNp || ''} 
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, welcomeTitleNp: e.target.value })}
                        className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs text-slate-300 font-semibold">Dynamic Welcome Tagline [English]</label>
                      <textarea 
                        rows={2}
                        value={homepageConfig.welcomeSubtitleEn || ''} 
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, welcomeSubtitleEn: e.target.value })}
                        className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs text-slate-300 font-semibold">Dynamic Welcome Tagline [Nepali / नेपाली विवरण]</label>
                      <textarea 
                        rows={2}
                        value={homepageConfig.welcomeSubtitleNp || ''} 
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, welcomeSubtitleNp: e.target.value })}
                        className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#c9a227] pt-4 border-t border-slate-800/80 pb-2">Principal Message & Quote</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-300 font-semibold">Principal Name [English]</label>
                      <input 
                        type="text" 
                        value={homepageConfig.principalNameEn || ''} 
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, principalNameEn: e.target.value })}
                        className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-300 font-semibold">Principal Name [Nepali]</label>
                      <input 
                        type="text" 
                        value={homepageConfig.principalNameNp || ''} 
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, principalNameNp: e.target.value })}
                        className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs text-slate-300 font-semibold">Principal Banner Message [English]</label>
                      <textarea 
                        rows={3}
                        value={homepageConfig.principalQuoteEn || ''} 
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, principalQuoteEn: e.target.value })}
                        className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs text-slate-300 font-semibold">Principal Banner Message [Nepali / नेपाली विवरण]</label>
                      <textarea 
                        rows={3}
                        value={homepageConfig.principalQuoteNp || ''} 
                        onChange={(e) => setHomepageConfig({ ...homepageConfig, principalQuoteNp: e.target.value })}
                        className="bg-slate-950 border border-slate-800 focus:border-[#c9a227] hover:border-slate-700 transition-colors rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 text-xs font-bold px-6 py-3 rounded-xl transition-transform hover:scale-[1.01]"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Configurations
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ────────────────────────────────────────────────────────
          REACTIVE DIALOG: MULTIPURPOSE CRUD FORM OVERLAY
          ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
              id="multipurpose-form-modal"
            >
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 text-slate-450 hover:text-white p-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-755 transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="text-[#c9a227]" id="modal-title">
                  {formType === 'create' ? 'Post New Entry' : 'Edit Entry Data'}
                </span>
                <span className="text-xs uppercase bg-slate-850 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                  {activeTab}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 mb-6">Complete all standard elements before confirming submission.</p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* 1. Team form segments  */}
                {activeTab === 'team' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Full Name (English) *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.nameEn || ''} 
                          onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Full Name (Nepali) *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.nameNp || ''} 
                          onChange={(e) => setFormData({ ...formData, nameNp: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Official Title (English) *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Senior Faculty Mentor"
                          value={formData.roleEn || ''} 
                          onChange={(e) => setFormData({ ...formData, roleEn: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Official Title (Nepali) *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. वरिष्ठ शिक्षक"
                          value={formData.roleNp || ''} 
                          onChange={(e) => setFormData({ ...formData, roleNp: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Category *</label>
                        <select 
                          value={formData.category || 'faculty'} 
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors text-slate-300"
                        >
                          <option value="admin">Administration / Leadership</option>
                          <option value="faculty">Faculty / Teachers</option>
                          <option value="support">Support Staff</option>
                          <option value="retired">Retired / Alumni</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Position Sequence Index *</label>
                        <input 
                          type="number" 
                          required
                          value={formData.order || 1} 
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Contact Number</label>
                        <input 
                          type="text" 
                          placeholder="+977-98XXXXXXXX"
                          value={formData.phone || ''} 
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="member@gmail.com"
                          value={formData.email || ''} 
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Profile Image URL</label>
                        <input 
                          type="url" 
                          placeholder="https://images.unsplash.com/photo-..."
                          value={formData.image || ''} 
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Notices form segments */}
                {activeTab === 'notices' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Notice Header (English) *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.titleEn || ''} 
                          onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Notice Header (Nepali) *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.titleNp || ''} 
                          onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Publication Date *</label>
                        <input 
                          type="date" 
                          required
                          value={formData.date || ''} 
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors text-slate-300"
                        />
                      </div>
                      <div className="flex items-center gap-2.5 pt-6 pl-2">
                        <input 
                          type="checkbox" 
                          id="isNew"
                          checked={formData.isNew ?? true} 
                          onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                          className="w-4 h-4 accent-[#c9a227]"
                        />
                        <label htmlFor="isNew" className="text-xs text-slate-300 font-semibold select-none cursor-pointer">
                          Highlight as LATEST Notice
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350 font-semibold uppercase">Summary / Body (English) *</label>
                      <textarea 
                        rows={3}
                        required
                        value={formData.descEn || ''} 
                        onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350 font-semibold uppercase">Summary / Body (Nepali) *</label>
                      <textarea 
                        rows={3}
                        required
                        value={formData.descNp || ''} 
                        onChange={(e) => setFormData({ ...formData, descNp: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. News / Events form segments */}
                {activeTab === 'news' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Event Header (English) *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.titleEn || ''} 
                          onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Event Header (Nepali) *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.titleNp || ''} 
                          onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Event Date *</label>
                        <input 
                          type="date" 
                          required
                          value={formData.date || ''} 
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors text-slate-300"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Attached Photo URL (Unsplash/Img) *</label>
                        <input 
                          type="url" 
                          required
                          placeholder="https://images.unsplash.com/photo-..."
                          value={formData.image || ''} 
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350 font-semibold uppercase">Story Description (English) *</label>
                      <textarea 
                        rows={3}
                        required
                        value={formData.descEn || ''} 
                        onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350 font-semibold uppercase">Story Description (Nepali) *</label>
                      <textarea 
                        rows={3}
                        required
                        value={formData.descNp || ''} 
                        onChange={(e) => setFormData({ ...formData, descNp: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Gallery form segments */}
                {activeTab === 'gallery' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Photo Title [English] *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.titleEn || ''} 
                          onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Photo Title [Nepali] *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.titleNp || ''} 
                          onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">High-Res Image Source URL *</label>
                        <input 
                          type="url" 
                          required
                          placeholder="https://images.unsplash.com/photo-..."
                          value={formData.src || ''} 
                          onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Display Order Sequence *</label>
                        <input 
                          type="number" 
                          required
                          value={formData.order || 1} 
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350 font-semibold uppercase">Context Description [English]</label>
                      <input 
                        type="text" 
                        value={formData.descEn || ''} 
                        onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350 font-semibold uppercase">Context Description [Nepali / नेपाली भाषा विवरण]</label>
                      <input 
                        type="text" 
                        value={formData.descNp || ''} 
                        onChange={(e) => setFormData({ ...formData, descNp: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Achievements forms */}
                {activeTab === 'achievements' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Milestone Heading [English] *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.titleEn || ''} 
                          onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Milestone Heading [Nepali] *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.titleNp || ''} 
                          onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Date of Milestone *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 2025 AD"
                          required
                          value={formData.date || ''} 
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Lucide Icon Name *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Award / Trophy / GraduationCap"
                          value={formData.iconName || 'Award'} 
                          onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350 font-semibold uppercase">Display List Order *</label>
                        <input 
                          type="number" 
                          required
                          value={formData.order || 1} 
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350 font-semibold uppercase">Context Description [English] *</label>
                      <textarea 
                        rows={3}
                        required
                        value={formData.descEn || ''} 
                        onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350 font-semibold uppercase">Context Description [Nepali] *</label>
                      <textarea 
                        rows={3}
                        required
                        value={formData.descNp || ''} 
                        onChange={(e) => setFormData({ ...formData, descNp: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#c9a227] focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-800/65 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-755 border border-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="inline-flex items-center gap-1 bg-[#c9a227] hover:bg-[#b08c20] text-slate-950 text-xs font-bold px-5 py-2.5 rounded-lg transition-transform hover:scale-[1.01]"
                    id="modal-submit-btn"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Confirm Submission
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────
          CONFIRM DELETE MODEL DIALOG
          ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-rose-900/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative text-center"
              id="confirm-delete-modal"
            >
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-100">Confirm Deletion</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Are you absolutely sure you want to permanently erase this document record? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center gap-2.5">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-755 border border-slate-700 transition-colors"
                >
                  Keep Record
                </button>
                <button 
                  onClick={() => handleDeleteItem(deleteConfirmId)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-rose-500 text-slate-950 font-bold hover:bg-rose-600 transition-colors"
                  id="confirm-delete-action-btn"
                >
                  Erase Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
