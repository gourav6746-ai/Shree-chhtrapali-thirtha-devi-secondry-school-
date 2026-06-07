'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  auth, 
  db, 
  OperationType, 
  handleFirestoreError 
} from '../../lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  Image as ImageIcon, 
  Award, 
  PhoneCall, 
  Home, 
  ShieldAlert, 
  LogOut, 
  LogIn, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  ArrowLeft, 
  Check, 
  Menu, 
  X, 
  Sparkles, 
  RefreshCw, 
  Upload, 
  ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Bootstrapped Admin check
const BOOTSTRAPPED_EMAIL = 'gourav6746@gmail.com';

export default function AdminPage() {
  // Authentication & Role states
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isEditorUser, setIsEditorUser] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'team' | 'news' | 'notices' | 'gallery' | 'achievements' | 'contact' | 'homepage' | 'roles'
  >('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Firestore collections data
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [newsEvents, setNewsEvents] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [homepageContent, setHomepageContent] = useState<any>(null);
  const [adminRoles, setAdminRoles] = useState<any[]>([]);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal / Form Management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formType, setFormType] = useState<
    'team' | 'news' | 'notices' | 'gallery' | 'achievements' | 'contact' | 'homepage' | 'roles' | null
  >(null);

  // Connection validation indicator
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Initial Auth hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Evaluate role
        try {
          if (currentUser.email === BOOTSTRAPPED_EMAIL) {
            setIsAdminUser(true);
            setIsEditorUser(true);
          } else {
            const adminDocRef = doc(db, 'admins', currentUser.uid);
            const adminDoc = await getDoc(adminDocRef);
            if (adminDoc.exists()) {
              const roleData = adminDoc.data();
              setIsAdminUser(roleData.role === 'admin');
              setIsEditorUser(roleData.role === 'admin' || roleData.role === 'editor');
            } else {
              setIsAdminUser(false);
              setIsEditorUser(false);
            }
          }
          setConnectionStatus('connected');
        } catch (err) {
          console.error("Auth check failed:", err);
          setConnectionStatus('error');
        }
      } else {
        setIsAdminUser(false);
        setIsEditorUser(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listeners to Firestore databases
  useEffect(() => {
    if (!user || !isEditorUser) return;

    // Listen to Team Members
    const qTeam = query(collection(db, 'team_members'), orderBy('order', 'asc'));
    const unsubTeam = onSnapshot(qTeam, (snap) => {
      const items = snap.docs.map(doc => doc.data());
      setTeamMembers(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'team_members'));

    // Listen to News & Events
    const unsubNews = onSnapshot(collection(db, 'news_and_events'), (snap) => {
      const items = snap.docs.map(doc => doc.data());
      setNewsEvents(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'news_and_events'));

    // Listen to Notices
    const unsubNotices = onSnapshot(collection(db, 'notices'), (snap) => {
      const items = snap.docs.map(doc => doc.data());
      setNotices(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'notices'));

    // Listen to Gallery
    const unsubGallery = onSnapshot(collection(db, 'gallery_images'), (snap) => {
      const items = snap.docs.map(doc => doc.data());
      setGalleryImages(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'gallery_images'));

    // Listen to Achievements
    const unsubAch = onSnapshot(collection(db, 'achievements'), (snap) => {
      const items = snap.docs.map(doc => doc.data());
      setAchievements(items);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'achievements'));

    // Listen to Contacts Singleton
    const unsubContact = onSnapshot(doc(db, 'contact_configurations', 'main'), (snap) => {
      if (snap.exists()) setContactInfo(snap.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, 'contact_configurations/main'));

    // Listen to Homepage Singleton
    const unsubHome = onSnapshot(doc(db, 'homepage_configurations', 'hero'), (snap) => {
      if (snap.exists()) setHomepageContent(snap.data());
    }, (err) => handleFirestoreError(err, OperationType.GET, 'homepage_configurations/hero'));

    // Listen to Admins
    let unsubAdmins = () => {};
    if (isAdminUser || user.email === BOOTSTRAPPED_EMAIL) {
      unsubAdmins = onSnapshot(collection(db, 'admins'), (snap) => {
        const items = snap.docs.map(doc => doc.data());
        setAdminRoles(items);
      }, (err) => {
        console.warn("Unauthorized to view full admin list directly. That is normal for editors.");
      });
    }

    return () => {
      unsubTeam();
      unsubNews();
      unsubNotices();
      unsubGallery();
      unsubAch();
      unsubContact();
      unsubHome();
      unsubAdmins();
    };
  }, [user, isEditorUser, isAdminUser]);

  // Auth Operations
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Convert File to Base64 String for local uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) {
      alert("Image size must be smaller than 800KB for direct storage.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev: any) => ({
        ...prev,
        src: reader.result, // base64 string
        image: reader.result // fallback for profile image
      }));
    };
    reader.readAsDataURL(file);
  };

  // Pre-populate Form for creating or editing
  const openForm = (type: typeof formType, item: any = null) => {
    setFormType(type);
    setEditId(item ? item.id || item.uid : null);
    
    if (item) {
      setFormData({ ...item });
    } else {
      // Default empty structures based on collection schema
      if (type === 'team') {
        setFormData({
          id: 'team_' + Date.now(),
          category: 'faculty',
          nameEn: '',
          nameNp: '',
          roleEn: '',
          roleNp: '',
          subjectEn: '',
          subjectNp: '',
          experienceEn: '',
          experienceNp: '',
          email: '',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
          color: 'border-[#1a2744]',
          order: teamMembers.length + 1
        });
      } else if (type === 'news') {
        setFormData({
          id: 'news_' + Date.now(),
          titleEn: '',
          titleNp: '',
          descEn: '',
          descNp: '',
          dateEn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' BS',
          dateNp: '२०८१ BS',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80',
          type: 'news'
        });
      } else if (type === 'notices') {
        setFormData({
          id: 'notice_' + Date.now(),
          titleEn: '',
          titleNp: '',
          descEn: '',
          descNp: '',
          dateEn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' BS',
          dateNp: '२०८१ BS',
          isNew: true
        });
      } else if (type === 'gallery') {
        setFormData({
          id: 'gallery_' + Date.now(),
          src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
          titleEn: '',
          titleNp: '',
          descEn: '',
          descNp: '',
          order: galleryImages.length + 1
        });
      } else if (type === 'achievements') {
        setFormData({
          id: 'ach_' + Date.now(),
          titleEn: '',
          titleNp: '',
          descEn: '',
          descNp: '',
          value: '',
          icon: 'Award',
          order: achievements.length + 1
        });
      } else if (type === 'contact') {
        setFormData(contactInfo || {
          id: 'main',
          phone1: '+977-1234567',
          phone2: '',
          email: 'info.scts@gmail.com',
          addressEn: 'Mayadevi-1, Pakadi, Kapilvastu, Nepal',
          addressNp: 'मायादेवी-१, पकडी, कपिलवस्तु, नेपाल',
          facebookUrl: 'https://facebook.com',
          youtubeUrl: 'https://youtube.com',
          twitterUrl: 'https://twitter.com'
        });
      } else if (type === 'homepage') {
        setFormData(homepageContent || {
          id: 'hero',
          welcomeTitleEn: 'Shree Chhatrapali Tirthadevi Secondary School',
          welcomeTitleNp: 'श्री छत्रपाली तीर्थादेवी माध्यमिक विद्यालय',
          welcomeSubtitleEn: 'Empowering generations through transformative education, structural character-building, and localized societal welfare.',
          welcomeSubtitleNp: 'नवीनतम सिकाई प्रविधि र गुणस्तरीय शिक्षा ढाँचाको माध्यमबाट नयाँ पुस्ताको सशक्तिकरण।',
          principalQuoteEn: 'Education is the key to unlocking the true potential of our students and fostering regional excellence.',
          principalQuoteNp: 'गुणस्तरीय शिक्षाले नै हाम्रा विद्यार्थीहरूको साँचो क्षमता उजागर गर्न र क्षेत्रीय उत्कृष्टताको विकास गर्न मद्दत पुग्दछ।',
          principalNameEn: 'Mr. Ram Prasad Sharma',
          principalNameNp: 'श्री राम प्रसाद शर्मा',
          welcomeIntroductionEn: 'Our secondary school stands as an educational beacon in Pakadi, Kapilvastu, dedicated to modern standards.',
          welcomeIntroductionNp: 'हाम्रो माध्यमिक विद्यालय पकडी, कपिलवस्तु क्षेत्रमा आधुनिक र वैज्ञानिक शिक्षा प्रदान गर्ने एउटा विशिष्ट शैक्षिक संस्था हो।'
        });
      } else if (type === 'roles') {
        setFormData({
          uid: '',
          email: '',
          role: 'editor'
        });
      }
    }
    
    setIsFormOpen(true);
  };

  // Submit / Save Form
  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formType) return;
    setSubmitting(true);

    try {
      let collName = '';
      const submissions = { ...formData };
      let docId = editId || submissions.id || submissions.uid;

      if (formType === 'team') {
        collName = 'team_members';
        submissions.order = parseInt(submissions.order) || teamMembers.length + 1;
      } else if (formType === 'news') {
        collName = 'news_and_events';
      } else if (formType === 'notices') {
        collName = 'notices';
      } else if (formType === 'gallery') {
        collName = 'gallery_images';
        submissions.order = parseInt(submissions.order) || galleryImages.length + 1;
      } else if (formType === 'achievements') {
        collName = 'achievements';
        submissions.order = parseInt(submissions.order) || achievements.length + 1;
      } else if (formType === 'contact') {
        collName = 'contact_configurations';
        docId = 'main';
        submissions.id = 'main';
      } else if (formType === 'homepage') {
        collName = 'homepage_configurations';
        docId = 'hero';
        submissions.id = 'hero';
      } else if (formType === 'roles') {
        collName = 'admins';
        docId = submissions.uid;
      }

      await setDoc(doc(db, collName, docId), submissions);
      setIsFormOpen(false);
      setFormData({});
      setEditId(null);
    } catch (err) {
      console.error("Form save failed:", err);
      alert("Error saving: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Record
  const deleteRecord = async (type: typeof formType, id: string) => {
    if (!confirm("Are you sure you want to delete this record? This action is irreversible.")) return;

    let collName = '';
    if (type === 'team') collName = 'team_members';
    else if (type === 'news') collName = 'news_and_events';
    else if (type === 'notices') collName = 'notices';
    else if (type === 'gallery') collName = 'gallery_images';
    else if (type === 'achievements') collName = 'achievements';
    else if (type === 'roles') collName = 'admins';

    if (!collName) return;

    try {
      await deleteDoc(doc(db, collName, id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting record.");
    }
  };

  // Seeding Sample Data Utility
  const seedDatabase = async () => {
    if (!confirm("This will initialize all Firestore collections with the school's sample dataset (notices, team members, news and singletons). Proceed?")) return;
    setSubmitting(true);

    try {
      // 1. Team Members
      const sampleTeam = [
        {
          id: 'tm_1',
          category: 'admin',
          nameEn: 'Mr. Ram Prasad Sharma',
          nameNp: 'श्री राम प्रसाद शर्मा',
          roleEn: 'Principal',
          roleNp: 'प्रधानाध्यापक',
          subjectEn: 'School Administration & Policy Guidance',
          subjectNp: 'विद्यालय प्रशासन तथा शैक्षिक नीति निर्देशिका',
          experienceEn: '25+ Years in Pedagogy',
          experienceNp: '२५ वर्ष भन्दा बढी शिक्षण तथा नेतृत्व अनुभव',
          email: 'principal.scts@gmail.com',
          image: 'https://images.unsplash.com/photo-1547037579-f0fc020ac3be?w=600&auto=format&fit=crop&q=80',
          color: 'border-[#c9a227]',
          order: 1
        },
        {
          id: 'tm_2',
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
          order: 2
        },
        {
          id: 'tm_3',
          category: 'faculty',
          nameEn: 'Mrs. Sita Ghalan',
          nameNp: 'श्रीमती सीता घलान',
          roleEn: 'Senior Lecturer',
          roleNp: 'वरिष्ठ माध्यमिक शिक्षक',
          subjectEn: 'English Language & Modern Literature',
          subjectNp: 'अंग्रेजी भाषा तथा आधुनिक अंग्रेजी साहित्य',
          experienceEn: '15 Years',
          experienceNp: '१५ वर्ष अध्यापन अनुभव',
          email: 'sita.ghalan@gmail.com',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
          color: 'border-emerald-600',
          order: 3
        },
        {
          id: 'tm_4',
          category: 'faculty',
          nameEn: 'Mr. Manoj Chaudhary',
          nameNp: 'श्री मनोज चौधरी',
          roleEn: 'Faculty Head — Commerce & Management',
          roleNp: 'संकाय प्रमुख — वाणिज्य र व्यवस्थापन',
          subjectEn: 'Accountancy, Finance & Business Studies',
          subjectNp: 'लेखा, वित्तीय विश्लेषण र व्यवसाय अध्ययन',
          experienceEn: '12 Years',
          experienceNp: '१२ वर्ष व्यावसायिक प्राध्यापन',
          email: 'manoj.mgmt@gmail.com',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
          color: 'border-teal-600',
          order: 4
        }
      ];

      for (const m of sampleTeam) {
        await setDoc(doc(db, 'team_members', m.id), m);
      }

      // 2. Notices
      const sampleNotices = [
        {
          id: 'nt_1',
          titleEn: 'Admission Open for 2081-82 Academic Session',
          titleNp: 'शैक्षिक सत्र २०८१-८२ को लागि नयाँ विद्यार्थी भर्ना खुल्यो!',
          descEn: 'Admissions are officially open for Primary, Secondary (Grade 6-9), and Plus Two Management & Education faculties. Please collect registration forms from the admin office.',
          descNp: 'प्राथमिक तह, माध्यमिक तह (कक्षा ६-९) र कक्षा ११ व्यवस्थापन तथा शिक्षा संकाय दुवैमा शैक्षिक सत्र २०८१-८१ का लागि फारम वितरण सुरु भएको छ। समयमै भर्ना आरक्षित गराउनुहोला।',
          dateEn: 'Falgun 15, 2081 BS',
          dateNp: '१५ फागुन २०८१',
          isNew: true
        },
        {
          id: 'nt_2',
          titleEn: 'Plus Two National board (+2) Result Published',
          titleNp: 'कक्षा १२ (+२) संकायको गौरवमय नतिजा प्रकाशन सम्बन्धमा',
          descEn: 'The National Examination Board (NEB) class 12 results are published. All students can check their marksheets at the school administrative counter.',
          descNp: 'व्यवस्थापन तथा शिक्षा संकाय अन्तर्गत परीक्षाको अन्तिम ग्रेड-सिट र परीक्षाफल विवरण प्रकाशन भएको छ। आफ्नो मार्कसिट विवरण प्रशासकीय कक्षमा बुझ्न सूचित गरिन्छ।',
          dateEn: 'Magh 28, 2081 BS',
          dateNp: '२८ माघ २०८१',
          isNew: false
        }
      ];

      for (const n of sampleNotices) {
        await setDoc(doc(db, 'notices', n.id), n);
      }

      // 3. News
      const sampleNews = [
        {
          id: 'nw_1',
          titleEn: 'Annual Sports Day & Extracurricular Carnival',
          titleNp: 'वार्षिक खेलकुद सप्ताह - भव्य आयोजन चैत १५ गते',
          descEn: 'The most anticipated school sports carnival is scheduled from Chaitra 15, featuring competitive football, volleyball, high-jump, and athletic tournaments.',
          descNp: 'छात्र-छात्राको सर्वाङ्गीण विकासका लागि वार्षिक खेलकुद हप्ता चैत १५ देखि सुरु हुनेछ। इच्छुक प्रतिस्पर्धी विद्यार्थीले आफ्नो नाम खेल शिक्षक रमेश पोखरेललाई दर्ता गराउनुहोला।',
          dateEn: 'Magh 10, 2081 BS',
          dateNp: '१० माघ २०८१',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80',
          type: 'event'
        }
      ];

      for (const nw of sampleNews) {
        await setDoc(doc(db, 'news_and_events', nw.id), nw);
      }

      // 4. Contact Singleton
      await setDoc(doc(db, 'contact_configurations', 'main'), {
        id: 'main',
        phone1: '+977-7650050',
        phone2: '+977-985700000',
        email: 'info.chhatrapali@gmail.com',
        addressEn: 'Mayadevi-1, Pakadi, Kapilvastu, Nepal',
        addressNp: 'मायादेवी-१, पकडी, कपिलवस्तु, नेपाल',
        facebookUrl: 'https://facebook.com/scts',
        youtubeUrl: 'https://youtube.com/scts',
        twitterUrl: 'https://twitter.com/scts'
      });

      // 5. Homepage Content
      await setDoc(doc(db, 'homepage_configurations', 'hero'), {
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

      // 6. Gallery Items
      const sampleGallery = [
        {
          id: 'gal_1',
          src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
          titleEn: 'Main School Block & Welcome Gathering',
          titleNp: 'मुख्य विद्यालय भवन र स्वागत जमघट',
          descEn: 'SCTS high-fidelity secondary facade building showcasing student assemblies, teacher board, and local administrative blocks.',
          descNp: 'विद्यार्थी र शिक्षकहरूको वृहत् उपस्थितिसहितको विद्यालयको मुख्य र सुविधायुक्त भवन।'
        },
        {
          id: 'gal_2',
          src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=80',
          titleEn: 'Determining Students of Shree Chhatrapali School',
          titleNp: 'भविष्यका खम्बा - विद्यालयका अनुशासित छात्राहरू',
          descEn: 'Dedicated senior wing students posing happily inside the campus in their official custom white-and-navy stripe uniform.',
          descNp: 'अनुशासित र लगनशील विद्यार्थीहरू विद्यालय परिसरमा गर्वका साथ आफ्नो परिचय पत्र र शैक्षिक सामग्री प्रस्तुत गर्दै।'
        }
      ];

      for (const g of sampleGallery) {
        await setDoc(doc(db, 'gallery_images', g.id), g);
      }

      // 7. Mini achievements stats
      const sampleAchievements = [
        {
          id: 'ac_1',
          titleEn: 'Distinction Rate',
          titleNp: 'उत्कृष्ट जीपीए दर',
          value: '94%',
          descEn: 'Plus Two high performers scoring above A grade',
          descNp: 'माध्यमिक र प्लस टु मा उत्कृष्ट नतिजा हासिल गर्ने अनुपात',
          icon: 'Award',
          order: 1
        },
        {
          id: 'ac_2',
          titleEn: 'Active Alumni Network',
          titleNp: 'सक्रिय भूतपूर्व विद्यार्थी',
          value: '3500+',
          descEn: 'Leading in engineering, bureaucracy and medical domains',
          descNp: 'देश तथा विदेशका प्रतिष्ठित क्षेत्रमा आवद्ध विद्यार्थीहरू',
          icon: 'Users',
          order: 2
        }
      ];

      for (const a of sampleAchievements) {
        await setDoc(doc(db, 'achievements', a.id), a);
      }

      alert("Sample datasets successfully seeded! The public channels will instantly update.");
    } catch (err) {
      console.error("Seeding error:", err);
      alert("Seeding failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  // Rendering loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col justify-center items-center text-white">
        <RefreshCw className="w-10 h-10 animate-spin text-[#c9a227] mb-4" />
        <p className="text-sm font-mono tracking-wider text-gray-400 uppercase">Verifying Admin Access Credentials...</p>
      </div>
    );
  }

  // Rendering sign-in screen if unauthenticated
  if (!user || !isEditorUser) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#111827] via-[#1f2937] to-[#111827] flex flex-col justify-center items-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl flex flex-col items-center select-none"
        >
          {/* SCTS Crest placeholder */}
          <div className="w-16 h-16 rounded-full bg-[#1a2744] flex items-center justify-center border border-[#c9a227]/40 mb-4 shadow-lg text-[#c9a227] font-extrabold text-xl font-serif">
            SCTS
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-white text-center font-serif leading-tight">
            SCTS Administrative portal
          </h1>
          <p className="text-xs text-gray-400 text-center tracking-wide uppercase mt-1 mb-8">
            Shree Chhatrapali Tirthadevi Secondary School
          </p>

          {user && !isEditorUser ? (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 mb-6">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-rose-300">Access Restricted</span>
                  <span className="text-[11px] text-gray-300 leading-snug mt-0.5">
                    Your account <strong className="text-white">{user.email}</strong> is not listed as an administrator or editor in SCTS databases. Please request access from the principal.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-300 text-center mb-8 leading-relaxed">
              Verify your identity via certified Google Workspace Credentials to enter the dashboard.
            </p>
          )}

          <div className="w-full flex flex-col gap-3">
            {user && !isEditorUser ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 text-white rounded-xl font-medium text-sm border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
                Sign Out / Use Another Account
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white text-[#111827] rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all transform hover:scale-[1.02] shadow-md cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-gray-500" />
                Authenticate via Google Auth
              </button>
            )}

            <Link href="/" className="text-center text-xs text-gray-400 hover:text-[#c9a227] mt-3 transition-colors">
              ← Return back to Public Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filter and search lists securely
  const getFilteredItems = (type: typeof activeTab) => {
    let raw: any[] = [];
    if (type === 'team') raw = teamMembers;
    else if (type === 'news') raw = newsEvents;
    else if (type === 'notices') raw = notices;
    else if (type === 'gallery') raw = galleryImages;
    else if (type === 'achievements') raw = achievements;
    else if (type === 'roles') raw = adminRoles;

    return raw.filter(item => {
      const nameMatch = 
        (item.nameEn && item.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.nameNp && item.nameNp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.titleEn && item.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.titleNp && item.titleNp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.roleEn && item.roleEn.toLowerCase().includes(searchQuery.toLowerCase()));

      let catMatch = true;
      if (type === 'team' && filterCategory !== 'all') {
        catMatch = item.category === filterCategory;
      }
      if (type === 'news' && filterCategory !== 'all') {
        catMatch = item.type === filterCategory;
      }

      return nameMatch && catMatch;
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'team', label: 'Teachers & Staff', icon: Users },
    { id: 'news', label: 'News & Events', icon: FileText },
    { id: 'notices', label: 'School Notices', icon: Bell },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'contact', label: 'Contact Settings', icon: PhoneCall },
    { id: 'homepage', label: 'Homepage Content', icon: Home },
    ...(isAdminUser || user.email === BOOTSTRAPPED_EMAIL ? [{ id: 'roles', label: 'Admin Roles', icon: ShieldCheck }] : [])
  ] as const;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top Banner Control Panel Header */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
              SCTS
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">Admin System</h1>
              <p className="text-[10px] text-gray-400 tracking-wider font-mono">SCTS • Pakadi Nepal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Database active indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            FIRESTORE CONNECTED
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-slate-300 font-medium">{user.email}</span>
            <span className="bg-amber-500/10 text-[#c9a227] px-2 py-0.5 rounded border border-amber-500/30 font-mono text-[10px] uppercase font-bold">
              {user.email === BOOTSTRAPPED_EMAIL ? 'Super Admin' : isAdminUser ? 'Admin' : 'Editor'}
            </span>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              title="Logout Administrative Access"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Left Drawer Navigation menu */}
        <aside className={`
          fixed inset-y-0 left-0 pt-[57px] bg-slate-950 border-r border-slate-800 w-64 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:pt-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full py-4 flex flex-col justify-between">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                      setSearchQuery('');
                      setFilterCategory('all');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      active 
                        ? 'bg-[#c9a227] text-slate-950 shadow-md font-medium' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-800 text-center">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#c9a227] font-medium transition-colors"
                title="Return to School Main Page"
              >
                <ArrowLeft className="w-3 h-3" />
                Go to Public Website
              </Link>
            </div>
          </div>
        </aside>

        {/* Dynamic Panel Content Canvas */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              
              {/* Core TAB 1: Overviews/Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white font-serif tracking-tight">SCTS School Portal Console</h2>
                      <p className="text-xs text-slate-400 mt-1">Configure and manage Shree Chhatrapali Tirthadevi Secondary School dataset collections dynamically.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={seedDatabase}
                        disabled={submitting}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-[#c9a227]/10 hover:bg-[#c9a227]/20 border border-[#c9a227]/30 text-[#c9a227] disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Seed Default Data
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Stats boxes */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Teachers & Staff', value: teamMembers.length, color: 'text-[#c9a227]', icon: Users },
                      { label: 'School Notices', value: notices.length, color: 'text-indigo-400', icon: Bell },
                      { label: 'News & Events', value: newsEvents.length, color: 'text-emerald-400', icon: FileText },
                      { label: 'Gallery Images', value: galleryImages.length, color: 'text-teal-400', icon: ImageIcon },
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-sm">
                          <div className="flex justify-between items-start text-slate-500">
                            <span className="text-[10px] uppercase font-bold tracking-wider">{stat.label}</span>
                            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                          </div>
                          <p className={`text-2xl font-extrabold mt-1.5 ${stat.color}`}>{stat.value}</p>
                          <span className="text-[9px] text-slate-500 italic block mt-1">Live Firestore Docs</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Operational guidelines info box */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#c9a227]" />
                      Real-time Sync Invariant
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All changes saved in this portal are immediately piped dynamically using native Firebase Firestore listeners. Every operational edit automatically updates public portals (such as the main landing marquee, staff registries, and photo slides) in real-time. Feel free to seed the database initially to test fallback behaviors.
                    </p>
                  </div>
                </div>
              )}

              {/* Core TAB 2-9: Standard collection grid panels */}
              {activeTab !== 'dashboard' && activeTab !== 'contact' && activeTab !== 'homepage' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold font-serif capitalize text-white flex items-center gap-2">
                        {activeTab === 'team' && 'Teachers & Staff Members'}
                        {activeTab === 'news' && 'News & Activity Events'}
                        {activeTab === 'notices' && 'Administrative Notices'}
                        {activeTab === 'gallery' && 'Photogallery Curations'}
                        {activeTab === 'achievements' && 'School Milestones & Stats'}
                        {activeTab === 'roles' && 'Authorized Access roles'}
                      </h2>
                      <p className="text-xs text-slate-400">Total counted entries: {getFilteredItems(activeTab).length}</p>
                    </div>

                    <button
                      onClick={() => openForm(activeTab as any)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#c9a227] hover:bg-[#b08d20] text-slate-950 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add New Entry
                    </button>
                  </div>

                  {/* Filters / Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search standard properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#c9a227]"
                      />
                    </div>
                    
                    {activeTab === 'team' && (
                      <div className="flex items-center gap-2 min-w-[150px]">
                        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                        >
                          <option value="all">All Categories</option>
                          <option value="admin">Leadership (Admin)</option>
                          <option value="faculty">Academic Teachers</option>
                          <option value="support">Staff & Support</option>
                          <option value="retired">Honorary Retired</option>
                        </select>
                      </div>
                    )}

                    {activeTab === 'news' && (
                      <div className="flex items-center gap-2 min-w-[150px]">
                        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                        >
                          <option value="all">All Types</option>
                          <option value="news">News Posts</option>
                          <option value="event">Activity Events</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Listing elements */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    {getFilteredItems(activeTab).length === 0 ? (
                      <div className="py-12 text-center">
                        <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">No record entries found.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-bold">
                              <th className="py-3 px-4">Primary Title / Name</th>
                              <th className="py-3 px-4">Secondary (Nepali)</th>
                              <th className="py-3 px-4">Additional Details</th>
                              <th className="py-3 px-4 text-right">Administrative Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredItems(activeTab).map((item, idx) => (
                              <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-900/20 text-slate-300">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    {(item.image || item.src) && (
                                      <img 
                                        src={item.image || item.src} 
                                        alt="" 
                                        className="w-8 h-8 rounded object-cover shrink-0 border border-slate-800"
                                      />
                                    )}
                                    <div className="flex flex-col">
                                      <span className="font-bold text-white text-[13px]">
                                        {item.nameEn || item.titleEn || item.email}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-mono tracking-tight font-medium mt-0.5">
                                        ID: {item.id || item.uid}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-[12px] font-medium text-slate-400">
                                  {item.nameNp || item.titleNp || '-'}
                                </td>
                                <td className="py-3 px-4 text-[11px] text-slate-400 space-y-0.5">
                                  {activeTab === 'team' && (
                                    <>
                                      <div><span className="text-slate-600">Category:</span> {item.category}</div>
                                      <div><span className="text-slate-600">Role:</span> {item.roleEn}</div>
                                      <div><span className="text-slate-600">Sorting Order:</span> {item.order}</div>
                                    </>
                                  )}
                                  {activeTab === 'news' && (
                                    <>
                                      <div><span className="text-slate-600">Type:</span> {item.type}</div>
                                      <div><span className="text-slate-600">Date NP:</span> {item.dateNp}</div>
                                    </>
                                  )}
                                  {activeTab === 'notices' && (
                                    <>
                                      <div><span className="text-slate-600">Badging:</span> {item.isNew ? '⚡ New Notice' : 'Standard'}</div>
                                      <div><span className="text-slate-600 font-medium">Brief:</span> {item.descEn ? item.descEn.substring(0, 50) + '...' : ''}</div>
                                    </>
                                  )}
                                  {activeTab === 'gallery' && (
                                    <>
                                      <div><span className="text-slate-600">Order:</span> {item.order}</div>
                                    </>
                                  )}
                                  {activeTab === 'achievements' && (
                                    <>
                                      <div><span className="text-slate-600 font-bold">Metric:</span> {item.value}</div>
                                      <div><span className="text-slate-600">Icon Component:</span> {item.icon}</div>
                                    </>
                                  )}
                                  {activeTab === 'roles' && (
                                    <>
                                      <div><span className="text-slate-600 font-extrabold uppercase">Access:</span> {item.role === 'admin' ? '🔥 Admin' : '✏️ Editor'}</div>
                                    </>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="inline-flex gap-2">
                                    <button
                                      onClick={() => openForm(activeTab as any, item)}
                                      className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-[#c9a227] text-slate-400 hover:text-[#c9a227] transition-all cursor-pointer"
                                      title="Edit Record"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => deleteRecord(activeTab as any, item.id || item.uid)}
                                      className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-red-500 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                                      title="Delete Record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Singleton TAB: Contact configuration */}
              {activeTab === 'contact' && (
                <div className="max-w-2xl bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold font-serif text-white">Public Contact Information Registers</h2>
                    <p className="text-xs text-slate-400">Configure phone registries, coordinates, and social parameters globally.</p>
                  </div>

                  <form onSubmit={saveForm} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Primary Phone Line (En)</label>
                        <input
                          type="text"
                          required
                          value={formData.phone1 || ''}
                          onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c9a227]"
                          placeholder="+977-1234567"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Backup Phone Line (Optional)</label>
                        <input
                          type="text"
                          value={formData.phone2 || ''}
                          onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c9a227]"
                          placeholder="+977-985700000"
                        />
                      </div>
                      
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Official School Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c9a227]"
                          placeholder="info.chhatrapali@gmail.com"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Physical Address (English)</label>
                        <input
                          type="text"
                          required
                          value={formData.addressEn || ''}
                          onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c9a227]"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Physical Address (Nepali)</label>
                        <input
                          type="text"
                          required
                          value={formData.addressNp || ''}
                          onChange={(e) => setFormData({ ...formData, addressNp: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c9a227]"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Facebook Page Link</label>
                        <input
                          type="text"
                          value={formData.facebookUrl || ''}
                          onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c9a227]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => openForm('contact')}
                        className="px-4 py-2 bg-[#c9a227] hover:bg-[#b08d20] text-slate-950 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer"
                      >
                        Adjust & Edit Contact Registers
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Singleton TAB: Homepage Content configuration */}
              {activeTab === 'homepage' && (
                <div className="max-w-2xl bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold font-serif text-white">Homepage Welcome Content</h2>
                    <p className="text-xs text-slate-400">Manage headline and principal message content globally.</p>
                  </div>

                  <form onSubmit={saveForm} className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">School Welcome Title (En)</label>
                        <textarea
                          rows={2}
                          value={formData.welcomeTitleEn || ''}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => openForm('homepage')}
                        className="px-4 py-2 bg-[#c9a227] hover:bg-[#b08d20] text-slate-950 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer"
                      >
                        Adjust & Edit Homepage Parameters
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* CORE MODAL FORM FOR ALL COLLECTION OPERATIONS */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm tracking-tight text-white font-serif">
                {editId ? 'Edit Configuration' : 'Create New Document Log'} — {formType?.toUpperCase()}
              </h3>
              <button 
                onClick={() => { setIsFormOpen(false); setFormData({}); }}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={saveForm} className="flex-1 overflow-y-auto max-h-[70vh] p-5 space-y-4">
              
              {/* Form Category: Team Members schema */}
              {formType === 'team' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Category Department</label>
                      <select
                        value={formData.category || 'faculty'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="admin">Leadership (Admin)</option>
                        <option value="faculty">Academic Teachers</option>
                        <option value="support">Staff & Support</option>
                        <option value="retired">Honorary Retired</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Order placement (Int)</label>
                      <input
                        type="number"
                        required
                        value={formData.order || ''}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Full Name (English)</label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn || ''}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="e.g. Mr. Ram Chandra"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Full Name (Nepali Devanagari)</label>
                    <input
                      type="text"
                      required
                      value={formData.nameNp || ''}
                      onChange={(e) => setFormData({ ...formData, nameNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="उदा: श्री राम चन्द्र"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Role Title (English)</label>
                    <input
                      type="text"
                      required
                      value={formData.roleEn || ''}
                      onChange={(e) => setFormData({ ...formData, roleEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="e.g. Senior Lecturer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Role Title (Nepali)</label>
                    <input
                      type="text"
                      required
                      value={formData.roleNp || ''}
                      onChange={(e) => setFormData({ ...formData, roleNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="उदा: वरिष्ठ शिक्षक"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Subject/Department (English)</label>
                    <input
                      type="text"
                      value={formData.subjectEn || ''}
                      onChange={(e) => setFormData({ ...formData, subjectEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="e.g. English Literature"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Subject/Department (Nepali)</label>
                    <input
                      type="text"
                      value={formData.subjectNp || ''}
                      onChange={(e) => setFormData({ ...formData, subjectNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Email Address</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Border Accent style</label>
                      <input
                        type="text"
                        value={formData.color || 'border-[#1a2744]'}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Staff Photograph (URL or Direct Upload)</label>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white mb-2"
                      placeholder="Image URL"
                    />
                    
                    <div className="flex items-center gap-3">
                      <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs cursor-pointer select-none">
                        <Upload className="w-3.5 h-3.5" />
                        Local Photo Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                      </label>
                      {formData.image && (
                        <span className="text-[10px] text-emerald-400 underline truncate max-w-[200px]">Successfully attached</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Category: News and Events */}
              {formType === 'news' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Entry Category Type</label>
                    <select
                      value={formData.type || 'news'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="news">News Post</option>
                      <option value="event">Activity Event</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Entry Title (English)</label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Entry Title (Nepali)</label>
                    <input
                      type="text"
                      required
                      value={formData.titleNp || ''}
                      onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Full Description (English)</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.descEn || ''}
                      onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Full Description (Nepali)</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.descNp || ''}
                      onChange={(e) => setFormData({ ...formData, descNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Display Date (En)</label>
                      <input
                        type="text"
                        value={formData.dateEn || ''}
                        onChange={(e) => setFormData({ ...formData, dateEn: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        placeholder="Falgun 10, 2081 BS"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Display Date (Np)</label>
                      <input
                        type="text"
                        value={formData.dateNp || ''}
                        onChange={(e) => setFormData({ ...formData, dateNp: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        placeholder="१० फागुन २०८१"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-medium">Featured Banner Photograph (URL or Upload)</label>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white mb-2"
                    />
                    <label className="flex w-fit items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs cursor-pointer select-none">
                      <Upload className="w-3.5 h-3.5" />
                      Local Banner Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Form Category: Notices */}
              {formType === 'notices' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Notice Title (English)</label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Notice Title (Nepali)</label>
                    <input
                      type="text"
                      required
                      value={formData.titleNp || ''}
                      onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Notice Body / Desc (English)</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.descEn || ''}
                      onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Notice Body / Desc (Nepali)</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.descNp || ''}
                      onChange={(e) => setFormData({ ...formData, descNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Notice Date (English)</label>
                      <input
                        type="text"
                        required
                        value={formData.dateEn || ''}
                        onChange={(e) => setFormData({ ...formData, dateEn: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Notice Date (Nepali)</label>
                      <input
                        type="text"
                        required
                        value={formData.dateNp || ''}
                        onChange={(e) => setFormData({ ...formData, dateNp: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="isNew"
                      checked={formData.isNew || false}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 accent-[#c9a227]"
                    />
                    <label htmlFor="isNew" className="text-xs text-slate-300 font-semibold select-none">
                      Highlight notice with bright NEW badge
                    </label>
                  </div>
                </div>
              )}

              {/* Form Category: Gallery curations */}
              {formType === 'gallery' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Sorting Order index</label>
                    <input
                      type="number"
                      required
                      value={formData.order || ''}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Curation Title (English)</label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Curation Title (Nepali Devanagari)</label>
                    <input
                      type="text"
                      required
                      value={formData.titleNp || ''}
                      onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Short Subtitle (English)</label>
                    <input
                      type="text"
                      value={formData.descEn || ''}
                      onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Short Subtitle (Nepali)</label>
                    <input
                      type="text"
                      value={formData.descNp || ''}
                      onChange={(e) => setFormData({ ...formData, descNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Select Photo Asset (URL or Upload)</label>
                    <input
                      type="text"
                      required
                      value={formData.src || ''}
                      onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white mb-2"
                    />
                    <label className="flex w-fit items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs cursor-pointer select-none">
                      <Upload className="w-3.5 h-3.5" />
                      Local Photo Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Form Category: Achievements milestones */}
              {formType === 'achievements' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Metric Value (e.g. 100%, 500+, 15+)</label>
                    <input
                      type="text"
                      required
                      value={formData.value || ''}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="e.g. 98%"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Milestone Title (English)</label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="e.g. Literacy rate"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Milestone Title (Nepali)</label>
                    <input
                      type="text"
                      required
                      value={formData.titleNp || ''}
                      onChange={(e) => setFormData({ ...formData, titleNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Lucide icon string name</label>
                    <input
                      type="text"
                      value={formData.icon || 'Award'}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="Award, Users, BookOpen etc."
                    />
                  </div>
                </div>
              )}

              {/* Form Category: Contact Configurations singleton singleton */}
              {formType === 'contact' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Phone Registers 1</label>
                      <input
                        type="text"
                        required
                        value={formData.phone1 || ''}
                        onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Phone Registers 2</label>
                      <input
                        type="text"
                        value={formData.phone2 || ''}
                        onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Admin Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Address text (En)</label>
                    <input
                      type="text"
                      required
                      value={formData.addressEn || ''}
                      onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Address text (Np)</label>
                    <input
                      type="text"
                      required
                      value={formData.addressNp || ''}
                      onChange={(e) => setFormData({ ...formData, addressNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Facebook URL</label>
                    <input
                      type="text"
                      value={formData.facebookUrl || ''}
                      onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Form Category: Homepage Content configurations configurations singleton */}
              {formType === 'homepage' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Welcome Title (English)</label>
                    <input
                      type="text"
                      required
                      value={formData.welcomeTitleEn || ''}
                      onChange={(e) => setFormData({ ...formData, welcomeTitleEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Welcome Title (Nepali)</label>
                    <input
                      type="text"
                      required
                      value={formData.welcomeTitleNp || ''}
                      onChange={(e) => setFormData({ ...formData, welcomeTitleNp: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Welcome Subtitle (English)</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.welcomeSubtitleEn || ''}
                      onChange={(e) => setFormData({ ...formData, welcomeSubtitleEn: e.target.value })}
                      className="w-full bg-[#1b253b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Welcome Subtitle (Nepali)</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.welcomeSubtitleNp || ''}
                      onChange={(e) => setFormData({ ...formData, welcomeSubtitleNp: e.target.value })}
                      className="w-full bg-[#1b253b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Principal quote (English)</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.principalQuoteEn || ''}
                      onChange={(e) => setFormData({ ...formData, principalQuoteEn: e.target.value })}
                      className="w-full bg-[#1b253b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Principal quote (Nepali)</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.principalQuoteNp || ''}
                      onChange={(e) => setFormData({ ...formData, principalQuoteNp: e.target.value })}
                      className="w-full bg-[#1b253b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Form Category: Admin Credentials credentials */}
              {formType === 'roles' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">User Firebase UID</label>
                    <input
                      type="text"
                      required
                      disabled={!!editId}
                      value={formData.uid || ''}
                      onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="Paste User UID (e.g. zN72yWh...)"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Email Address</label>
                    <input
                      type="email"
                      required
                      disabled={!!editId}
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      placeholder="authorized@gmail.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Role Privilege Level</label>
                    <select
                      value={formData.role || 'editor'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="editor">Editor (Can edit data but not roles)</option>
                      <option value="admin">Admin (Can edit everything & roles)</option>
                    </select>
                  </div>
                </div>
              )}

            </form>

            <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setIsFormOpen(false); setFormData({}); }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveForm}
                disabled={submitting}
                className="flex items-center gap-1 bg-[#c9a227] hover:bg-[#b08d20] text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
