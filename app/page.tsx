'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Award, 
  Phone, 
  MapPin, 
  Menu, 
  X, 
  Globe, 
  FlaskConical, 
  Laptop, 
  Library, 
  Music, 
  Calendar, 
  ArrowUpRight, 
  Check, 
  Mail, 
  MessageSquare,
  ChevronRight,
  Sparkles,
  School,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  Building,
  DollarSign,
  GraduationCap
} from 'lucide-react';

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

// Language definitions
type Language = 'en' | 'np';

// School Information Datastore
const schoolInfo = {
  phone: '+977-9706711866',
  whatsappUrl: 'https://wa.me/9779706711866',
  locationEn: 'Pakadi, Mayadevi Rural Municipality-1, Kapilvastu, Nepal',
  locationNp: 'पकडी, मायादेवी गाउँपालिका-१, कपिलवस्तु, नेपाल',
  locationDetailsEn: 'Approx. 10 km east of Taulihwa headquarters',
  locationDetailsNp: 'तौलिहवा सदरमुकामबाट करिब १० कि.मी. पूर्व',
  affiliationEn: 'Affiliated with National Examination Board (NEB) & Ministry of Education, Nepal',
  affiliationNp: 'नेपाल सरकार शिक्षा मन्त्रालय र राष्ट्रिय परीक्षा बोर्ड (NEB) बाट सम्बन्धन प्राप्त',
};

// Program data in both languages
const programsList = [
  {
    id: 'primary',
    titleEn: 'Primary Education',
    titleNp: 'आधारभूत प्राथमिक शिक्षा',
    levelEn: 'Nursery to Grade 5',
    levelNp: 'शिशु कक्षा देखि कक्षा ५',
    descEn: 'Comprehensive foundational learning targeting cognitive developments, social values, and primary skills with safe spaces.',
    descNp: 'साना बालबालिकाहरूको संज्ञानात्मक विकास, सामाजिक मूल्य र आधारभूत सिप सुदृढ बनाउने बालमैत्री र सुरक्षित पठनपाठन।',
    icon: School,
    color: 'from-[#1a2744] to-[#253965]',
  },
  {
    id: 'secondary',
    titleEn: 'Secondary Education',
    titleNp: 'माध्यमिक शिक्षा (SEE)',
    levelEn: 'Grade 6 to Grade 10',
    levelNp: 'कक्षा ६ देखि कक्षा १० सम्म',
    descEn: 'Rigorous academic curriculum aligned with NEB standards to prepare students for Secondary Education Examination (SEE).',
    descNp: 'राष्ट्रिय पाठ्यक्रम र एन.ई.बी. मापदण्ड अनुसार गुणस्तरीय र प्रयोगात्मक सिकाई, जसले एस.ई.ई. परीक्षामा उत्कृष्ट नतिजा दिलाउँछ।',
    icon: BookOpen,
    color: 'from-[#c9a227] to-[#e0b93c]',
  },
  {
    id: 'plus2_mgmt',
    titleEn: 'Ten Plus Two (+2) — Management',
    titleNp: 'उच्च माध्यमिक (+२) — व्यवस्थापन',
    levelEn: 'Grade 11 & 12 • Management Faculty',
    levelNp: 'कक्षा ११ र १२ • व्यवस्थापन संकाय',
    descEn: 'Practical business education covering Accountancy, Business Studies, Economics, and Computer Applications to raise future leaders.',
    descNp: 'लेखाविधि, व्यवसाय अध्ययन, अर्थशास्त्र र कम्प्युटर प्रविधिको व्यावहारिक ज्ञान प्रदान गरी कर्पोरेट र उद्यमशीलताको क्षेत्रमा सक्षम बनाउने संकाय।',
    icon: Laptop,
    color: 'from-[#1a2744] to-[#c9a227]',
  },
  {
    id: 'plus2_edu',
    titleEn: 'Ten Plus Two (+2) — Education',
    titleNp: 'उच्च माध्यमिक (+२) — शिक्षा शास्त्र',
    levelEn: 'Grade 11 & 12 • Education Faculty',
    levelNp: 'कक्षा ११ र १२ • शिक्षा संकाय',
    descEn: 'Focuses on pedagogical methodologies, child psychology, school leadership, and educational theory to shape tomorrow’s educators.',
    descNp: 'शिक्षण विधि, बाल मनोविज्ञान, शैक्षिक नेतृत्व र नवीनतम सिद्धान्तको गहिरो प्रशिक्षण दिएर मुलुकका लागि योग्य र दक्ष शिक्षक जनशक्ति उत्पादन गर्ने संकाय।',
    icon: GraduationCap,
    color: 'from-[#2a3c5a] to-[#a0821d]',
  }
];

// Facilities with localized labels and descriptions
const facilitiesList = [
  {
    id: 1,
    titleEn: 'Science Laboratory',
    titleNp: 'विज्ञान प्रयोगशाला',
    descEn: 'Highly equipped Physics, Chemistry, and Biology laboratories supporting practical board experiments.',
    descNp: 'भौतिक विज्ञान, रसायन विज्ञान र जीव विज्ञानका अलग्गै सुविधायुक्त आधुनिक उपकरणहरूले सुसज्जित प्रयोगाशाला।',
    icon: FlaskConical,
  },
  {
    id: 2,
    titleEn: 'Computer Laboratory',
    titleNp: 'कम्प्युटर प्रयोगशाला',
    descEn: 'Modern computer systems with stable internet connectivity enabling crucial digital literacy and IT skills.',
    descNp: 'सफा र आधुनिक कम्प्युटरहरू भएको कोठा, जहाँ उच्च गतिको इन्टरनेट मार्फत प्रविधि र सफ्टवेयरको ज्ञान दिइन्छ।',
    icon: Laptop,
  },
  {
    id: 3,
    titleEn: 'School Library',
    titleNp: 'पुस्तकालय',
    descEn: 'Hundreds of textbooks, encyclopedias, reference guides, national journals, and creative literature novels.',
    descNp: 'हजारौं पाठ्यक्रम, सन्दर्भ सामग्री, ज्ञानवर्द्धक र साहित्यिक पुस्तकहरूको विशाल संग्रह भएको शान्त पुस्तकालय।',
    icon: Library,
  },
  {
    id: 4,
    titleEn: 'Multimedia & Conference Hall',
    titleNp: 'मल्टिमिडिया र सभाहल',
    descEn: 'A modern audio-visual room setup dedicated to slide presentations, seminar forums, and educational screening.',
    descNp: 'प्रोजेक्टर, ध्वनि प्रणाली र मल्टिमिडिया सुविधा भएको कोठा, जहाँ शैक्षिक भिडियो र प्रस्तुतीकरण देखाइन्छ।',
    icon: BlockIconPlace, 
  },
  {
    id: 5,
    titleEn: 'Sports & Athletics',
    titleNp: 'खेलकुद र शारीरिक व्यायाम',
    descEn: 'Spacious fields and playgrounds alongside equipment for regional football, volleyball, and athlete tracks.',
    descNp: 'खेल मैदान र विभिन्न इन्डोर-आउटडोर विधा (भलिबल, फुटबल, कराँते) का लागि खेल सामग्रीको राम्रो व्यवस्था।',
    icon: School,
  },
  {
    id: 6,
    titleEn: 'Music & Cultural Clubs',
    titleNp: 'संगीत र नृत्य क्लब',
    descEn: 'Dedicated clubs supporting students to nurture creative performing arts and traditional Nepali dances.',
    descNp: 'सांस्कृतिक झाँकी, आधुनिक संगीत र परम्परागत नेपाली लोकनृत्य सिकाउँदै प्रतिभाशाली कलाको विकास गराइने क्लब।',
    icon: Music,
  },
  {
    id: 7,
    titleEn: 'Affordable Fee Structure',
    titleNp: 'मध्यम तथा सुलभ शुल्क',
    descEn: 'Offering quality high-tier academic programs with a minimal, community-friendly overhead cost structure.',
    descNp: 'सबै वर्ग र समुदायका परिवारहरूका लागि सहज र अत्यन्त सुलभ लागतको पारदर्शी शैक्षिक बजेट संरचना।',
    icon: DollarSign,
  },
  {
    id: 8,
    titleEn: 'Scholarship Schemes',
    titleNp: 'विशेष छात्रवृत्ति योजना',
    descEn: 'Dedicated scholarships safeguarding merit academic achievers, underprivileged youth, and talented girl students.',
    descNp: 'जेहेन्दार, पिछडिएका र विपन्न समुदायका बालबालिकाहरूका लागि विभिन्न नि:शुल्क तथा अर्ध-नि:शुल्क छात्रवृत्तिको सुविधा।',
    icon: Award,
  }
];

// Fallback dummy icon replacement for layout flexibility
function BlockIconPlace(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  );
}

// Authentic Photogallery mapping to high-quality curated educational images
const galleryImages = [
  {
    id: 1,
    src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAE-rRHSfz26OhyVKeIrgHSbYOcjK9ImPxCQv2JMX2CHY9Pw1MTViaZwY4wUVPyabldkKs3Ian6YYXgKc5pIBafI5E-NavfTyAQRnUqq4-rhmrlLezWg7X99B4y2uHUmM36FHxk=s1464-w784-h1464-rw',
    titleEn: 'Main School Block & Welcome Gathering',
    titleNp: 'मुख्य विद्यालय भवन र स्वागत जमघट',
    descEn: 'SCTS high-fidelity secondary facade building showcasing student assemblies, teacher board, and local administrative blocks.',
    descNp: 'विद्यार्थी र शिक्षकहरूको वृहत् उपस्थितिसहितको विद्यालयको मुख्य र सुविधायुक्त ' + 'ECD-BLOCK' + ' भवन।',
  },
  {
    id: 2,
    src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEx5kSy2EbN8hEfvF8DIlhZjdN9ADE4wBjUU3P6oCoRaHIOzFQ7Yg0d3rW6T5YR-0H1M6Ntz4vlRRfkNH30GkA48ml_q6HVNtwLaUCbDbN-RXmd5DjOmlUc_8goJgglES8tnU67=s1464-w784-h1464-rw',
    titleEn: 'Campus Courtyard & Peaceful Assembly Grounds',
    titleNp: 'विद्यालय शैक्षिक परिसर र शान्त आँगन',
    descEn: 'A balanced wide-angle of the secondary wing block with parked bicycles, indicating safe, sustainable, and clean transportation.',
    descNp: 'हाम्रो विशाल र खुला खेल मैदानको पृष्ठभूमिमा शान्त मन्दिर र हरियाली शैक्षिक चौरको अर्को भव्य दृश्य।',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=80',
    titleEn: 'Determining Students of Shree Chhatrapali School',
    titleNp: 'भविष्यका खम्बा - विद्यालयका अनुशासित छात्राहरू',
    descEn: 'Dedicated senior wing students posing happily inside the campus in their official custom white-and-navy stripe uniform.',
    descNp: 'अनुशासित र लगनशील विद्यार्थीहरू विद्यालय परिसरमा गर्वका साथ आफ्नो परिचय पत्र र शैक्षिक सामग्री प्रस्तुत गर्दै।',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1000&auto=format&fit=crop&q=80',
    titleEn: 'Interactive Lectures & Classroom Engagement',
    titleNp: 'कक्षाकोठामा रमाइलो शैक्षिक अन्तरक्रिया र सिकाई',
    descEn: 'Faculties interactively conducting self-learning and posing a cheerful portrait and healthy discussions with student groups.',
    descNp: 'शिक्षकहरूको प्रत्यक्ष सानिध्य, हँसिला र लगनशील विद्यार्थीहरूसँग अध्ययनको क्रममा लिइएको एउटा रमाइलो क्लोज-अप दृश्य।',
  },
  {
    id: 5,
    src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFJtjrpnajK17t3V31Y8Ux7DF6lyaiH27stiyw7ewRSPQZqU02dwYtB3qv8DWCYXs3oAqtd3qZvG3t42IIXrhHkP6Ea9iFKZbL3x-h-9oJgIjq57uygqc-jqofJmelACkJQn4fv=s1464-w784-h1464-rw',
    titleEn: 'Principal Address & Special Guest Assembly',
    titleNp: 'प्रधानाध्यापकको मार्गदर्शन र अन्तरक्रिया सभा',
    descEn: 'School administrative panel and guest speakers delivering moral lessons and motivating guidelines on assembly stages.',
    descNp: 'प्रधानाध्यापक रामप्रसाद शर्मा र अन्य विशिष्ट शिक्षकद्वारा खेलमैदानमा विद्यार्थीहरूलाई व्यावहारिक शिक्षा र नैतिकता सिकाउँदै।',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80',
    titleEn: 'SCTS Parent-Teacher Consultative Assembly',
    titleNp: 'वृहत् अभिभावक-शिक्षक सुझाव तथा अन्तरक्रिया भेला',
    descEn: 'Conducting community interaction assembly meetings on fields to reinforce policies, quality parameters, and future development steps.',
    descNp: 'सामुदायिक सद्भाव सुदृढ बनाउन र शिक्षाको गुणस्तर बढाउन आयोजित अभिभावक तथा प्रबुद्ध नागरिकहरूको सहभागिता सभा।',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80',
    titleEn: 'Academic Enrollment Rally & Literacy Drive',
    titleNp: 'नयाँ विद्यार्थी भर्ना अभियान २०७६',
    descEn: 'Dedicated school educators, principal, and social contributors holding campaigns and banners in Pakadi Kapilvastu.',
    descNp: 'मायादेवी गाउँपालिका क्षेत्रमा सम्पूर्ण घरधुरीका बालबालिकालाई विद्यालय आउन प्रेरित गर्दै निकालिएको चेतनामूलक र्‍याली।',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80',
    titleEn: 'Bicycle Lots & Green Secondary Campus Facade',
    titleNp: 'माध्यमिक ब्लक र साइकल स्ट्यान्डको बाहिरी दृश्य',
    descEn: 'Wide exterior perspective of the original administrative layout showing local Kapilvastu student mobility and clean spaces.',
    descNp: 'विद्यार्थीहरूले पार्क गरेका अनगिन्ती साइकलहरूको बीचबाट देखिने कक्षा कोठाहरूको सफा र उज्यालो शैक्षिक भवन।',
  }
];

// Realistic Staff members with Devanagari details
const staffList = [
  {
    id: 1,
    nameEn: 'Mr.Narendra Bahadur Kurmi',
    nameNp: 'श्री नरेन्द्र बाहदुर कुर्मी',
    roleEn: 'Principal',
    roleNp: 'प्रधानाध्यापक',
    subjectEn: 'School Administration & Policy',
    subjectNp: 'विद्यालय प्रशासन तथा नेतृत्व',
    initials: 'RPS',
    color: 'bg-[#1a2744]',
  },
  {
    id: 2,
    nameEn: 'Mr ',
    nameNp: 'श्री बिजय कुर्मी',
    leEn: '',
    roleNp: '',
    subjectEn: 'English Language & Literature',
    subjectNp: 'अंग्रेजी भाषा तथा साहित्य',
    initials: 'SG',
    color: 'bg-[#c9a227]',
  },
  {
    id: 3,
    nameEn: 'Mr. Manoj Chaudhary',
    nameNp: 'श्री मनोज चौधरी',
    roleEn: 'Faculty Head — Management',
    roleNp: 'संकाय प्रमुख — व्यवस्थापन',
    subjectEn: 'Accountancy, Finance & Business Studies',
    subjectNp: 'लेखा, वित्त तथा व्यवसाय अध्ययन',
    initials: 'MC',
    color: 'bg-emerald-700',
  },
  {
    id: 4,
    nameEn: 'Mrs. Goma Devi Paudel',
    nameNp: 'श्रीमती गोमा देवी पौडेल',
    roleEn: 'Secondary Coordinator',
    roleNp: 'माध्यमिक तह संयोजक',
    subjectEn: 'General Science & Biology',
    subjectNp: 'विज्ञान तथा जीवविज्ञान',
    initials: 'GDP',
    color: 'bg-rose-700',
  },
  {
    id: 5,
    nameEn: 'Mr. Binod Kumar Gupta',
    nameNp: 'श्री बिनोड कुमार गुप्ता',
    roleEn: 'Senior Lecturer — Education Faculty',
    roleNp: 'वरिष्ठ शिक्षक — शिक्षा संकाय',
    subjectEn: 'Educational Psychology & Pedagogy',
    subjectNp: 'शिक्षाशास्त्र, पाठ्यक्रम र मनोविज्ञान',
    initials: 'BKG',
    color: 'bg-indigo-700',
  },
  {
    id: 6,
    nameEn: 'Mr. Ramesh Pokhrel',
    nameNp: 'श्री रमेश पोखरेल',
    roleEn: 'IT Supervisor & Instructor',
    roleNp: 'सूचना प्रविधि प्रमुख',
    subjectEn: 'Computer Science & Lab Practical Work',
    subjectNp: 'कम्प्युटर विज्ञान र प्रयोगात्मक कार्य',
    initials: 'RP',
    color: 'bg-teal-700',
  }
];

// Notice board items with Nepali dates (BS Calendar)
const noticesList = [
  {
    id: 1,
    titleEn: 'Admission Open for 2081-82 Academic Session',
    titleNp: 'शैक्षिक सत्र २०८१-८२ को लागि नयाँ विद्यार्थी भर्ना खुल्यो!',
    descEn: 'Admissions are officially open for Primary, Secondary (Grade 6-9), and Plus Two Management & Education faculties. Please collect registration forms from the admin office.',
    descNp: 'प्राथमिक तह, माध्यमिक तह (कक्षा ६-९) र कक्षा ११ व्यवस्थापन तथा शिक्षा संकाय दुवैमा शैक्षिक सत्र २०८१-८१ का लागि फारम वितरण सुरु भएको छ। समयमै भर्ना आरक्षित गराउनुहोला।',
    dateEn: 'Falgun 15, 2081 BS',
    dateNp: '१५ फागुन २०८१',
    isNew: true,
  },
  {
    id: 2,
    titleEn: 'Plus Two National board (+2) Result Published',
    titleNp: 'कक्षा १२ (+२) संकायको गौरवमय नतिजा प्रकाशन सम्बन्धमा',
    descEn: 'The National Examination Board (NEB) class 12 results are published. All students can check their marksheets at the school administrative counter.',
    descNp: 'व्यवस्थापन तथा शिक्षा संकाय अन्तर्गत परीक्षाको अन्तिम ग्रेड-सिट र परीक्षाफल विवरण प्रकाशन भएको छ। आफ्नो मार्कसिट विवरण प्रशासकीय कक्षमा बुझ्न सूचित गरिन्छ।',
    dateEn: 'Magh 28, 2081 BS',
    dateNp: '२८ माघ २०८१',
    isNew: false,
  },
  {
    id: 3,
    titleEn: 'Annual Sports Day & Extracurricular Carnival',
    titleNp: 'वार्षिक खेलकुद सप्ताह - भव्य आयोजना चैत १५ गते',
    descEn: 'The most anticipated school sports carnival is scheduled from Chaitra 15, featuring competitive football, volleyball, high-jump, and athletic tournaments.',
    descNp: 'छात्र-छात्राको सर्वाङ्गीण विकासका लागि वार्षिक खेलकुद हप्ता चैत १५ देखि सुरु हुनेछ। इच्छुक प्रतिस्पर्धी विद्यार्थीले आफ्नो नाम खेल शिक्षक रमेश पोखरेललाई दर्ता गराउनुहोला।',
    dateEn: 'Magh 10, 2081 BS',
    dateNp: '१० माघ २०८१',
    isNew: false,
  },
  {
    id: 4,
    titleEn: 'Merit & Need-Based Scholarship Form Deadline',
    titleNp: 'जेहेन्दार तथा लक्षित छात्रवृत्ति आवेदन फारम बुझाउने मिति',
    descEn: 'Eligible underprivileged, female, and meritorious students must submit their complete documentation for full fee waivers by Falgun 30 explicitly.',
    descNp: 'गरिब, अल्पसंख्यक, अपाङ्गता भएका र शैक्षिक रूपमा उत्कृष्ट विद्यार्थीले विशेष छात्रवृत्तिका लागि बुझाउनुपर्ने सिफारिस तथा कागजातहरू फागुन ३० गतेभित्र बुझाउनुहोला।',
    dateEn: 'Poush 25, 2081 BS',
    dateNp: '२५ पुस २०८१',
    isNew: false,
  },
];

export default function SchoolHomePage() {
  const [lang, setLang] = useState<Language>('en');
  const [navOpen, setNavOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Form submission state
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    program: 'general',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Monitor Scroll for Navbar Shrink Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor Scroll Reveal Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [lang]); // Trigger fresh observer on language translation switch

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', phone: '', program: 'general', message: '' });
      setFormSubmitted(false);
    }, 5000);
  };

  const handleNextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
    }
  };

  const handlePrevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  // Image load error fallback handler
  const handleFeaturedImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: number) => {
    e.currentTarget.onerror = null; // Prevent infinite event loops
    const backupUrls = [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80', // School facade
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80', // School brick building
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=80', // Group of students
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1000&auto=format&fit=crop&q=80', // Learning interaction
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80', // Meeting presentation
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80', // Community conference
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80', // Education books
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80'  // Student group
    ];
    e.currentTarget.src = backupUrls[(id - 1) % backupUrls.length];
  };

  return (
    <div id="school-portal" className="min-h-screen flex flex-col font-sans select-none selection:bg-[#c9a227] selection:text-white">
      
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
          1. NAVBAR & BILINGUAL TOGGLE
          ──────────────────────────────────────────────────────── */}
      <nav 
        id="navbar-section"
        className="sticky top-0 w-full z-40 bg-[#1a2744] shadow-md py-3 text-white transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Compact Left Navigation Brand */}
          <a href="#school-portal" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <SchoolLogo className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm" />
            <div className="flex flex-col select-none">
              <span className="text-base lg:text-xl font-bold tracking-wide font-serif text-[#c9a227]">
                {lang === 'en' ? 'Shree Chhatrapali Tirthadevi' : 'श्री छत्रपाली तीर्थादेवी'}
              </span>
              span className="text-xs lg:text-sm uppercase tracking-wider text-gray-300 leading-none">
                {lang === 'en' ? 'Secondary School' : 'माध्यमिक विद्यालय'}
              </span>
            </div>
          </a>

          {/* Nav links - Desktop */}
          <div className="hidden lg:flex items-center gap-7">
            <a href="#school-portal" className="text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors">
              {lang === 'en' ? 'Home' : 'गृहपृष्ठ'}
            </a>
            <a href="#about-section" className="text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors">
              {lang === 'en' ? 'About' : 'सम्बन्धमा'}
            </a>
            <a href="#programs-section" className="text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors">
              {lang === 'en' ? 'Programs' : 'कार्यक्रमहरु'}
            </a>
            <a href="#facilities-section" className="text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors">
              {lang === 'en' ? 'Facilities' : 'सुविधाहरू'}
            </a>
            <a href="#gallery-section" className="text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors">
              {lang === 'en' ? 'Gallery' : 'तस्वीरहरू'}
            </a>
            <Link href="/our-team" className="text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors">
              {lang === 'en' ? 'Staff' : 'शिक्षकहरू'}
            </Link>
            <a href="#notices-section" className="text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors flex items-center gap-1">
              {lang === 'en' ? 'Notices' : 'सूचना'}
              <span className="animate-pulse w-1.5 h-1.5 bg-[#c9a227] rounded-full"></span>
            </a>
            <a href="#contact-section" className="text-xs uppercase tracking-wider text-gray-200 hover:text-[#c9a227] font-medium transition-colors">
              {lang === 'en' ? 'Contact' : 'सम्पर्क'}
            </a>

            {/* Language Switch Ribbon */}
            <div className="border-l border-gray-600 h-5 pl-4 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#c9a227]" />
              <button 
                onClick={() => setLang('en')} 
                className={`text-[11px] font-bold tracking-widest uppercase transition-all ${lang === 'en' ? 'text-[#c9a227]' : 'text-gray-400 hover:text-white'}`}
              >
                EN
              </button>
              <span className="text-gray-600">|</span>
              <button 
                onClick={() => setLang('np')} 
                className={`text-[11px] font-bold tracking-widest uppercase transition-all ${lang === 'np' ? 'text-[#c9a227]' : 'text-gray-400 hover:text-white'}`}
              >
                नेपाली
              </button>
            </div>
          </div>

          {/* Hamburger & Lang selector trigger for Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Quick lang selector for phone */}
            <button 
              onClick={() => setLang(lang === 'en' ? 'np' : 'en')}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#c9a227] text-white text-xs font-semibold"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'en' ? 'नेपाली' : 'EN'}</span>
            </button>
            
            <button 
              onClick={() => setNavOpen(!navOpen)}
              className="p-1 rounded text-white focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            >
              {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {navOpen && (
          <div className="lg:hidden bg-[#16213a]/98 border-t border-gray-800 transition-all duration-300">
            <div className="flex flex-col px-4 py-5 gap-3">
              <a 
                href="#hero-container" 
                onClick={() => setNavOpen(false)} 
                className="text-sm font-medium tracking-wide py-2 border-b border-gray-800 text-gray-200 hover:text-[#c9a227]"
              >
                {lang === 'en' ? 'Home' : 'गृहपृष्ठ'}
              </a>
              <a 
                href="#about-section" 
                onClick={() => setNavOpen(false)} 
                className="text-sm font-medium tracking-wide py-2 border-b border-gray-800 text-gray-200 hover:text-[#c9a227]"
              >
                {lang === 'en' ? 'About SCTS' : 'हाम्रो बारेमा'}
              </a>
              <a 
                href="#programs-section" 
                onClick={() => setNavOpen(false)} 
                className="text-sm font-medium tracking-wide py-2 border-b border-gray-800 text-gray-200 hover:text-[#c9a227]"
              >
                {lang === 'en' ? 'Programs Offered' : 'शैक्षिक कार्यक्रमहरू'}
              </a>
              <a 
                href="#facilities-section" 
                onClick={() => setNavOpen(false)} 
                className="text-sm font-medium tracking-wide py-2 border-b border-gray-800 text-gray-200 hover:text-[#c9a227]"
              >
                {lang === 'en' ? 'Facilities & Infrastructure' : 'विद्यालयका सुविधाहरू'}
              </a>
              <a 
                href="#gallery-section" 
                onClick={() => setNavOpen(false)} 
                className="text-sm font-medium tracking-wide py-2 border-b border-gray-800 text-gray-200 hover:text-[#c9a227]"
              >
                {lang === 'en' ? 'Photo Gallery' : 'तस्वीर सङ्ग्रह'}
              </a>
              <Link 
                href="/our-team" 
                onClick={() => setNavOpen(false)} 
                className="text-sm font-medium tracking-wide py-2 border-b border-gray-800 text-gray-200 hover:text-[#c9a227]"
              >
                {lang === 'en' ? 'Our Faculty Staff' : 'हाम्रो शिक्षक टोली'}
              </Link>
              <a 
                href="#notices-section" 
                onClick={() => setNavOpen(false)} 
                className="text-sm font-medium tracking-wide py-2 border-b border-gray-800 text-gray-200 hover:text-[#c9a227] flex items-center justify-between"
              >
                <span>{lang === 'en' ? 'Notices & Board' : 'सूचना पाटी'}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#c9a227] text-white text-[10px] uppercase font-bold tracking-widest">Live</span>
              </a>
              <a 
                href="#contact-section" 
                onClick={() => setNavOpen(false)} 
                className="text-sm font-medium tracking-wide py-2 text-gray-200 hover:text-[#c9a227]"
              >
                {lang === 'en' ? 'Contact Directory' : 'सम्पर्क ठेगाना'}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ────────────────────────────────────────────────────────
          2. HERO SECTION
          ──────────────────────────────────────────────────────── */}
      <section 
        id="hero-container" 
        className="relative pt-24 overflow-hidden min-h-[92vh] flex items-center bg-[#0d1424]"
      >
        {/* Real school assembly background image with dimming filter for elite text contrast */}
        <div className="absolute inset-0 z-0 animate-fade-in duration-1000">
          <img 
            src="/school_hero_bg.png" 
            alt="Shree Chhatrapali School Assembly Background" 
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) contrast(1.15) saturate(0.9)' }}
            referrerPolicy="no-referrer"
          />
          {/* Edge/overlay darkness vignette to guarantee maximum text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10192e] via-transparent to-[#10192e]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#10192e]/85 via-[#1a2744]/40 to-transparent"></div>
        </div>

        {/* Animated radial grid and particle dots layer */}
        <div className="absolute inset-0 opacity-15 z-0" style={{
          backgroundImage: 'radial-gradient(circle, #c9a227 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>

        {/* Ambient warm glow lights - subtle gold & soft blue, strict NO purple */}
        <div className="absolute top-1/4 right-[5%] w-80 h-80 rounded-full bg-[#c9a227]/10 blur-[90px] z-0"></div>
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-[#1a2744]/40 blur-[100px] z-0"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Slogans and Call to actions */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              
              {/* Top tiny crest sticker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c9a227]/10 border border-[#c9a227]/25 rounded-full text-xs text-[#c9a227] font-semibold tracking-wider uppercase animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Government Approved Affiliations' : 'नेपाल सरकार सम्बन्धन प्राप्त'}</span>
              </div>
              
              {/* Massive school names */}
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-semibold leading-tight tracking-tight">
                  {lang === 'en' ? 'Shree Chhatrapali' : 'श्री छत्रपाली'}
                </h1>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white font-medium italic text-[#c9a227] leading-none mb-1">
                  {lang === 'en' ? 'Tirthadevi Secondary School' : 'तीर्थादेवी माध्यमिक विद्यालय'}
                </h2>
                <div className="w-20 h-1 bg-[#c9a227] my-3 rounded-full"></div>
              </div>

              {/* Tagline bilingual representation */}
              <p className="text-base md:text-lg text-gray-300 font-sans max-w-2xl leading-relaxed">
                <strong className="text-white block text-lg font-medium mb-1.5 md:mb-2">
                  {lang === 'en' 
                    ? 'Empowering Minds, Building Futures' 
                    : 'ज्ञानले जीवन उज्यालो पार्छ र भविष्य निर्माण गर्छ।'}
                </strong>
                {lang === 'en'
                  ? 'Fostering inclusive values, holistic personality growths, and sound academic structures in Pakadi, Kapilvastu, Nepal since several decades.'
                  : 'हामी यस कपिलवस्तु मायादेवी क्षेत्रका बालबालिकाहरूको सर्वाङ्गीण बौद्धिक, मानसिक र शारीरिक विकासका लागि निरन्तर प्रतिबद्ध छौं।'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4 w-full sm:w-auto">
                <a 
                  href="#contact-section" 
                  className="w-full sm:w-auto text-center px-7 py-3.5 bg-[#c9a227] hover:bg-[#b08d20] text-[#1a2744] font-bold text-sm tracking-uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#1a2744]" />
                  <span>{lang === 'en' ? 'Apply for Admission' : 'भर्ना आवेदन फारम'}</span>
                </a>
                
                <a 
                  href="#about-section" 
                  className="w-full sm:w-auto text-center px-7 py-3.5 bg-transparent border-2 border-gray-400 hover:border-[#c9a227] hover:text-[#c9a227] text-white font-semibold text-sm tracking-uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>{lang === 'en' ? 'Learn More' : 'थप अन्वेषण गर्नुहोस'}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-gray-800 w-full max-w-xl">
                <div>
                  <h4 className="text-[#c9a227] font-serif text-2xl font-bold">Kapilvastu</h4>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">{lang === 'en' ? 'Pakadi Location' : 'कपिलवस्तु पकडी'}</p>
                </div>
                <div>
                  <h4 className="text-[#c9a227] font-serif text-2xl font-bold">NEB & govt</h4>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">{lang === 'en' ? 'Full Affiliation' : 'आधिकारिक मान्यता'}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h4 className="text-[#c9a227] font-serif text-2xl font-bold">4 Faculties</h4>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">{lang === 'en' ? 'Comprehensive Scope' : 'एकेडेमिक स्तर'}</p>
                </div>
              </div>
            </div>

            {/* Left Image box representing real classes / school view in parallax container */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[420px] lg:max-w-none rounded-2xl border-4 border-[#c9a227]/20 p-2 overflow-hidden shadow-2xl bg-[#16213a]">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80"
                    alt="Shree Chhatrapali Tirthadevi Secondary School Building"
                    className="object-cover w-full h-full transform transition-transform duration-[6000ms] group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleFeaturedImageError(e, 1)}
                  />
                  {/* Subtle dark gradient overlay inside picture banner */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[10px] uppercase text-[#c9a227] tracking-wider font-bold mb-1">
                      {lang === 'en' ? 'Academic Hub' : 'हाम्रो मूल केन्द्र'}
                    </span>
                    <h3 className="text-lg md:text-xl font-serif text-white font-semibold">
                      {lang === 'en' ? 'Main ECD Academic Block' : 'मुख्य माध्यमिक शैक्षिक भवन'}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {lang === 'en' ? 'Pakadi, Kapilvastu, Lumbini Province' : 'मायादेवी गाउँपालिका, कपिलवस्तु पकडी'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Backing decorative shapes */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#c9a227]/10 -z-10 rounded-xl border border-[#c9a227]/10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#1a2744]/40 -z-10 rounded-full blur-xl"></div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          GOLD DIVIDER 1
          ──────────────────────────────────────────────────────── */}
      <div className="gold-divider"></div>

      {/* ────────────────────────────────────────────────────────
          3. ABOUT SECTION
          ──────────────────────────────────────────────────────── */}
      <section 
        id="about-section" 
        className="py-16 md:py-24 bg-[#f9f7f2] scroll-reveal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Side columns: badges, quick affiliations facts */}
            <div className="lg:col-span-5 flex flex-col gap-8 md:sticky md:top-28">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c9a227]">
                  {lang === 'en' ? 'About Our School' : 'हाम्रो गौरवमय परिचय'}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-[#1a2744] font-semibold tracking-tight">
                  {lang === 'en' ? 'A Legacy of Excellence' : 'उच्च गुणस्तर, सुलभ पहुँच'}
                </h2>
                <div className="w-16 h-1 bg-[#c9a227] mt-1"></div>
              </div>

              {/* School badge certificates */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-2 mb-1">
                  {schoolInfo.affiliationEn}
                </h4>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                    NEB
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-[#1a2744]">
                      {lang === 'en' ? 'National Examination Board' : 'राष्ट्रिय परीक्षा बोर्ड (NEB)'}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {lang === 'en' ? 'Approved center for Secondary & Plus Two (+2)' : 'माध्यमिक र उच्च माध्यमिक स्तर सम्बन्धन'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                    MOE
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-[#1a2744]">
                      {lang === 'en' ? 'Ministry of Education, Nepal' : 'शिक्षा मन्त्रालय, नेपाल सरकार'}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {lang === 'en' ? 'Registered and verified public community provider' : 'सम्बन्धित स्थानीय तह मायादेवी-१ बाट स्वीकृत'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image highlight representing local school context */}
              <div className="relative rounded-xl overflow-hidden shadow-md group aspect-[16/9]">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80" 
                  alt="Students playing on field of Shree Chhatrapali"
                  className="object-cover w-full h-full transform transition-transform duration-[4000ms] group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleFeaturedImageError(e, 5)}
                />
                <div className="absolute inset-0 bg-[#1a2744]/20 flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-white uppercase tracking-widest px-3 py-1.5 bg-[#1a2744]/80 rounded-full backdrop-blur-sm">
                    {lang === 'en' ? 'Academic Courtyard' : 'विद्यालयको भित्री चौर परिसर'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main paragraph, values, mission blocks */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-6">
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1a2744]">
                  {lang === 'en' ? 'Welcome to SCTS Pakadi' : 'श्री छत्रपाली तीर्थादेवी मा.वि. पकडीमा स्वागत छ'}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {lang === 'en' 
                    ? 'Established to provide premium yet affordable secondary education to pupils of Kapilvastu, Shree Chhatrapali Tirthadevi Secondary School represents a dream of literacy, modern competence, and moral integration. Nestled approx 10 km east of the historic headquarters of Taulihwa, we believe in bridging physical laboratories with classical morals.'
                    : 'मायादेवी गाउँपालिका वडा नं १ पकडी, कपिलवस्तु स्थित यस श्री छत्रपाली तीर्थादेवी माध्यमिक विद्यालयले यस भेगका हजारौं बालबालिकाहरूको उज्यालो भविष्य निर्माण गरिरहेको छ। तौलिहवा सदरमुकामभन्दा करिब १० कि.मी. पूर्व अवस्थित यस विद्यालयले सैद्धान्तिक ज्ञानका साथै कम्प्युटर तथा विज्ञानको प्रयोगात्मक रुप सिकाउँदै आएको छ।'}
                </p>
              </div>

              {/* Mission & Vision Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mission Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a2744]/15 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#1a2744]" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#1a2744]">
                    {lang === 'en' ? 'Our Mission' : 'हाम्रो मिशन (ध्येय)'}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === 'en'
                      ? 'To cultivate absolute academic potential, moral parameters, and creative individual expression by maintaining modern classes, friendly teachers, and rich libraries.'
                      : 'विद्यार्थीहरूमा नैतिक अनुशासन, व्यावहारिक सीप र प्रयोगात्मक विज्ञान प्रविधिको विकास गरी समाजका लागि उपयोगी र विनम्र जनशक्ति निर्माण गर्नु हाम्रो ध्येय हो।'}
                  </p>
                </div>

                {/* Vision Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c9a227]/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#c9a227]" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#1a2744]">
                    {lang === 'en' ? 'Our Vision' : 'हाम्रो परिकल्पना (भिजन)'}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === 'en'
                      ? 'To emerge as an ideal hub of secondary learning in Kapilvastu, raising capable national assets who value cultural roots while mastering future technologies.'
                      : 'एक आधुनिक र मर्यादित नमुना विद्यालयको रुपमा स्थापित हुँदै, राष्ट्रिय स्वाभिमान बोकेर अन्तर्राष्ट्रिय मञ्चमा प्रतिस्पर्धा गर्न सक्ने सक्षम युवा उत्पादन गर्नु हो।'}
                  </p>
                </div>

              </div>

              {/* Bullet checklist of goals */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
                  {lang === 'en' ? 'Why Chhatrapali Tirthadevi?' : 'हाम्रो विद्यालय रोज्नुपर्ने कारणहरू'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-650">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span>{lang === 'en' ? 'NEB +2 Management Faculty Stream' : '१२ सम्म व्यवस्थापन संकायको उत्तम अवसर'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span>{lang === 'en' ? 'Qualified & Dedicated Faculty Panel' : 'दक्ष, अनुभवी र सहयोगी शिक्षक टोली'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span>{lang === 'en' ? 'Bilingual Teaching (Nep & Eng)' : 'अंग्रेजी र नेपाली दुवै माध्यमबाट अध्ययन'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span>{lang === 'en' ? 'Affordable Fee Model with Waivers' : 'जेहेन्दार तथा विपन्नका लागि छात्रवृत्ति'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span>{lang === 'en' ? 'Computers and Science Laboratories' : 'सम्पन्न विज्ञान र कम्प्युटर ल्याब सुविधाहरू'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span>{lang === 'en' ? 'Active Extracurricular Sports Weeks' : 'कला, नृत्य र वार्षिक खेलकुद हप्ता'}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          GOLD DIVIDER 2
          ──────────────────────────────────────────────────────── */}
      <div className="gold-divider"></div>

      {/* ────────────────────────────────────────────────────────
          4. PROGRAMS SECTION
          ──────────────────────────────────────────────────────── */}
      <section 
        id="programs-section" 
        className="py-16 md:py-24 bg-white scroll-reveal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">
              {lang === 'en' ? 'Our Curriculums' : 'हाम्रा शैक्षिक कार्यक्रमहरू'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2744] font-semibold tracking-tight">
              {lang === 'en' ? 'Diverse Academic Faculties Offered' : 'प्राथमिक तह देखि प्लस टु संकाय सम्म'}
            </h2>
            <div className="w-20 h-1 bg-[#c9a227]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programsList.map((prog) => {
              const IconComp = prog.icon;
              return (
                <div 
                  key={prog.id}
                  className="bg-[#f9f7f2] rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="flex flex-col gap-4">
                    {/* Top graphic block */}
                    <div className="w-12 h-12 rounded-lg bg-[#1a2744]/10 text-[#1a2744] group-hover:bg-[#c9a227] group-hover:text-[#1a2744] transition-all flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#c9a227] font-semibold">
                        {lang === 'en' ? prog.levelEn : prog.levelNp}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#1a2744]">
                        {lang === 'en' ? prog.titleEn : prog.titleNp}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-200/50 pt-3">
                      {lang === 'en' ? prog.descEn : prog.descNp}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-[#1a2744] transition-all">
                      {lang === 'en' ? 'Affiliated' : 'नेपाल सरकार स्वीकृत'}
                    </span>
                    <a href="#contact-section" className="text-[#1a2744] group-hover:text-[#c9a227] transition-colors p-1">
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sincere message banner for the principal */}
          <div className="mt-12 bg-gradient-to-r from-[#1a2744] to-[#121c32] p-8 rounded-xl border border-[#c9a227]/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 text-white text-center md:text-left">
              <h4 className="font-serif text-lg md:text-xl font-bold">
                {lang === 'en' ? 'Seeking Admissions for Next Academic Cycle?' : 'पढाइ थप उत्कृष्ट बनाउने उपयुक्त अवसर!'}
              </h4>
              <p className="text-xs md:text-sm text-gray-300">
                {lang === 'en' 
                  ? 'Registration is totally moderate and secure. Feel free to obtain the admission booklets and syllabuses.'
                  : 'हाम्रो मध्यम भर्ना शुल्क र छात्रवृत्ति फारमहरू अहिले खुला छन्। विस्तृत विवरण बुझ्न आजै हामीलाई सम्पर्क गर्नुहोला।'}
              </p>
            </div>
            <a 
              href="#contact-section"
              className="px-6 py-3 bg-[#c9a227] hover:bg-gold text-[#1a2744] font-bold text-xs tracking-wider uppercase rounded-lg shadow-md transition-all shrink-0"
            >
              {lang === 'en' ? 'Contact Registrar' : 'विस्तृत सोधपुछ प्रविष्टि'}
            </a>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          GOLD DIVIDER 3
          ──────────────────────────────────────────────────────── */}
      <div className="gold-divider"></div>

      {/* ────────────────────────────────────────────────────────
          5. FACILITIES SECTION
          ──────────────────────────────────────────────────────── */}
      <section 
        id="facilities-section" 
        className="py-16 md:py-24 bg-[#f9f7f2] scroll-reveal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">
              {lang === 'en' ? 'Infrastructure & Safety' : 'विद्यालयका भौतिक विकासहरू'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2744] font-semibold tracking-tight">
              {lang === 'en' ? 'Facilities That Direct Learning' : 'हाम्रा आधुनिक सुविधाहरू तथा सुलभ शिक्षण'}
            </h2>
            <div className="w-20 h-1 bg-[#c9a227]"></div>
          </div>

          {/* Grid Layout of Facilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilitiesList.map((fac) => {
              const IconComponent = fac.icon;
              return (
                <div 
                  key={fac.id}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1a2744]/10 text-[#1a2744] flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-[#1a2744]" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-base font-bold text-[#1a2744] leading-tight">
                      {lang === 'en' ? fac.titleEn : fac.titleNp}
                    </h3>
                    <span className="text-[10px] text-[#c9a227] font-semibold uppercase tracking-wider block">
                      {lang === 'en' ? fac.titleNp : fac.titleEn}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 leading-normal border-t border-gray-100 pt-2.5">
                    {lang === 'en' ? fac.descEn : fac.descNp}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          GOLD DIVIDER 4
          ──────────────────────────────────────────────────────── */}
      <div className="gold-divider"></div>

      {/* ────────────────────────────────────────────────────────
          6. PHOTO GALLERY SECTION (MASONRY & LIGHTBOX)
          ──────────────────────────────────────────────────────── */}
      <section 
        id="gallery-section" 
        className="py-16 md:py-24 bg-white scroll-reveal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">
              {lang === 'en' ? 'Our Campus & Activities' : 'तस्वीर सङ्ग्रह'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2744] font-semibold tracking-tight">
              {lang === 'en' ? 'A Visual Tour of SCTS Community' : 'हाम्रो विद्यालयका विभिन्न गतिविधि र चौर'}
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-gray-500">
              {lang === 'en' 
                ? 'Check real photographs collected from sports days, morning addresses, and laboratory interactions. Click any image to enlarge.'
                : 'खेलकुद सप्ताह, बिहानी सभा र कक्षाकोठा भित्र विद्यार्थी र शिक्षकहरूबीचको अन्तरक्रियात्मक गतिविधिहरू। तस्वीरमा क्लिक गर्नुहोस्।'}
            </p>
            <div className="w-20 h-1 bg-[#c9a227] mt-2"></div>
          </div>

          {/* Masonry/Grid of images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => {
              return (
                <div 
                  key={image.id}
                  onClick={() => setLightboxIndex(index)}
                  className="bg-[#f9f7f2] rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-300 group relative aspect-[4/3]"
                >
                  <img 
                    src={image.src} 
                    alt={image.titleEn}
                    className="object-cover w-full h-full transform transition-transform duration-[4000ms] group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleFeaturedImageError(e, image.id)}
                  />
                  
                  {/* Subtle hover gradient frame representation */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10192e]/90 via-[#10192e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[9px] uppercase tracking-widest text-[#c9a227] font-bold">
                      {lang === 'en' ? 'SCTS Gallery • Touch to view' : 'क्लिक गरेर विस्तृतमा हेर्नुहोस'}
                    </span>
                    <h4 className="text-xs font-serif text-white font-bold leading-tight mt-1">
                      {lang === 'en' ? image.titleEn : image.titleNp}
                    </h4>
                    <p className="text-[10px] text-gray-300 line-clamp-1">
                      {lang === 'en' ? image.descEn : image.descNp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-gray-400 italic">
            * Note: These are official visual photographs of Chhatrapali Tirthadevi Secondary School, Pakadi, Kapilvastu, Nepal.
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          7. TEACHERS / STAFF SECTION PREVIEW
          ──────────────────────────────────────────────────────── */}
      <section 
        id="staff-section" 
        className="py-16 md:py-24 bg-gradient-to-b from-[#f9f7f2] via-white to-[#f4f1ea] scroll-reveal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">
              {lang === 'en' ? 'Our Pillars of Knowledge' : 'हाम्रो शैक्षिक नेतृत्व र गौरव'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2744] font-semibold tracking-tight">
              {lang === 'en' ? 'Meet the Minds Guiding Shree Chhatrapali' : 'भविष्य कोर्ने शिक्षक, सहयोगी र सेवानिवृत्त टोली'}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xl mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Under the administration of expert educational leaders, we offer competitive coaching accompanied by experienced subject mentors.'
                : 'दक्ष तथा कुशल शिक्षक वर्ग र कुशल कार्यालय कर्मचारीहरूको संयुक्त प्रयासमा हामी पकडी कपिलवस्तु क्षेत्रमा शिक्षाको गुणस्तर उच्च राख्न सदैव तत्पर छौं।'}
            </p>
            <div className="w-20 h-1 bg-[#c9a227] mt-3"></div>
          </div>

          {/* Core Spotlight Features (3 Key Leaders) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Leader 1 - Principal */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute right-0 top-0 w-16 h-16 bg-[#c9a227]/5 rounded-bl-3xl"></div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1a2744]/10 text-[#1a2744]">
                  {lang === 'en' ? 'Principal & Administrator' : 'प्रधानाध्यापक तथा नेतृत्व'}
                </span>
                <h3 className="font-serif text-[18px] font-bold text-[#1a2744] mt-3 leading-snug">
                  {lang === 'en' ? 'Mr. Ram Prasad Sharma' : 'श्री राम प्रसाद शर्मा'}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  {lang === 'en' ? 'School Administration & Policy' : 'विद्यालय प्रशासन तथा नेतृत्व'}
                </p>
                <div className="w-10 h-[1.5px] bg-[#c9a227]/50 my-3"></div>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  {lang === 'en'
                    ? '"Committing to fostering inclusive values, academic records, and secure student tracks since inception."'
                    : '"शुरुवातदेखि नै समावेशी मूल्य मान्यता, शैक्षिक रेकर्ड र सुरक्षित विद्यार्थी ट्र्याकहरू बढाउन प्रतिबद्ध छौं।"'}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs font-medium text-[#c9a227] flex items-center justify-between">
                <span>RPS • SCTS</span>
                <span className="font-mono">principal.scts@gmail.com</span>
              </div>
            </div>

            {/* Leader 2 - Vice Coordinator */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute right-0 top-0 w-16 h-16 bg-[#1a2744]/5 rounded-bl-3xl"></div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {lang === 'en' ? 'Senior Lecturer' : 'वरिष्ठ माध्यमिक शिक्षक'}
                </span>
                <h3 className="font-serif text-[18px] font-bold text-[#1a2744] mt-3 leading-snug">
                  {lang === 'en' ? 'Mrs. Sita Ghalan' : 'श्रीमती सीता घलान'}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  {lang === 'en' ? 'English Language & Literature' : 'अंग्रेजी भाषा तथा साहित्य'}
                </p>
                <div className="w-10 h-[1.5px] bg-[#c9a227]/50 my-3"></div>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  {lang === 'en'
                    ? '"Empowering local girls and underprivileged youth to communicate with absolute confidence globally."'
                    : '"स्थानीय बालिकाहरू र पिछडिएका युवाहरूलाई विश्वव्यापी रूपमा पूर्ण आत्मविश्वासका साथ सञ्चार गर्न सशक्त बनाउने..."'}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs font-medium text-emerald-700 flex items-center justify-between">
                <span>SG • SCTS</span>
                <span className="font-mono">sita.ghalan@gmail.com</span>
              </div>
            </div>

            {/* Leader 3 - Honored Retired Legend */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-[#c9a227]/30 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute right-0 top-0 w-16 h-16 bg-[#c9a227]/10 rounded-bl-3xl"></div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-[#c9a227]">
                    {lang === 'en' ? 'Honored Veteran Founder' : 'परम आदरणीय संस्थापक'}
                  </span>
                  <span className="text-xs">🏆</span>
                </div>
                <h3 className="font-serif text-[18px] font-bold text-[#1a2744] mt-3 leading-snug">
                  {lang === 'en' ? 'Mr. Dev Narayan Yadav' : 'श्री देव नारायण यादव'}
                </h3>
                <p className="text-xs text-amber-700 font-sans mt-0.5 font-bold">
                  {lang === 'en' ? 'Former Principal — Legacy Advisor' : 'पूर्व प्रधानाध्यापक — अनवरत सल्लाहकार'}
                </p>
                <div className="w-10 h-[1.5px] bg-[#c9a227]/50 my-3"></div>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  {lang === 'en'
                    ? '"SCTS owes its legendary 35+ years foundation to his structural blueprints and heart-led public service efforts."'
                    : '"३ दशक लामो योगदान र उत्कृष्ट सामुदायिक चेतनाका मुख्य उत्प्रेरक व्यक्तित्व। हामी उहाँको नीतिप्रति कृतज्ञ छौं।"'}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs font-medium text-[#c9a227] flex items-center justify-between">
                <span>LEGACY LEAD</span>
                <span className="font-mono">devnarayan@gmail.com</span>
              </div>
            </div>

          </div>

          {/* BEAUTIFUL LUXURY CTA BOX POINTING TO NEW ANIMATED TEAM PAGE */}
          <div className="mt-12 text-center bg-gradient-to-r from-[#10192e] via-[#16213a] to-[#0a101d] rounded-2xl p-6 sm:p-8 border border-[#c9a227]/30 shadow-xl max-w-4xl mx-auto text-white overflow-hidden relative">
            <div className="absolute -right-16 -bottom-16 w-44 h-44 rounded-full bg-[#c9a227]/10 blur-[40px]"></div>
            <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full bg-[#112240]/40 blur-[30px]"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-serif text-[#c9a227] font-semibold mb-2">
                {lang === 'en' ? 'Explore Complete 13+ Staff & Retired Teachers' : 'सम्पूर्ण १३+ शिक्षक, कर्मचारी तथा पूर्व शिक्षक सङ्ग्रह'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-light mb-6 max-w-2xl mx-auto">
                {lang === 'en' 
                  ? 'We have launched our dynamic and interactive staff portal! Click below to view administrative desks, teachers, support staff, and historic educators with smooth left-to-right animated transitions.'
                  : 'हाम्रो नयाँ डिजिटल शिक्षक शैक्षिक प्रोफाइल विवरण अनलाइन भएको छ। बायाँ तथा दायाँबाट सहजै सर्दै आउने जादुमयी आधुनिक एनिमेसन र फिल्टर सुविधाहरू भएको पेज हेर्नुहोस्।'}
              </p>
              <Link 
                href="/our-team" 
                className="inline-flex items-center gap-2 bg-[#c9a227] hover:bg-[#b08c20] text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                <span>{lang === 'en' ? 'Meet All Teachers & Staff Portal' : 'शिक्षक सङ्ग्रह र सेवानिवृत्त कोठा प्रस्थान गर्नुहोस्'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          GOLD DIVIDER 5
          ──────────────────────────────────────────────────────── */}
      <div className="gold-divider"></div>

      {/* ────────────────────────────────────────────────────────
          8. NOTICE BOARD (ANNOUNCEMENTS SECTION)
          ──────────────────────────────────────────────────────── */}
      <section 
        id="notices-section" 
        className="py-16 md:py-24 bg-white scroll-reveal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side: Notice board sticker display */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#c9a227] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-650 inline-block animate-pulse"></span>
                  {lang === 'en' ? 'Announcements & News' : 'ताजा सूचना तथा घोषणाहरू'}
                </span>
                <h2 className="text-3xl font-serif text-[#1a2744] font-semibold tracking-tight leading-tight">
                  {lang === 'en' ? 'Stay Updated with Notice Board' : 'हाम्रो प्रत्यक्ष विद्यालय सूचना बोर्ड'}
                </h2>
                <div className="w-16 h-1 bg-[#c9a227] mt-1"></div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {lang === 'en' 
                  ? 'All crucial updates related to admission calendars, SEE grades release, sports days, and fee structures are regularly updated here by SCTS administration.'
                  : 'परीक्षा नतिजा, बिदाको निर्णय, नयाँ भर्ना आह्वान, तथा विद्यालय सुधार योजनासँग सम्बन्धित सम्पूर्ण निर्णयहरू नियमित रूपमा यहाँ प्रकाशन गरिन्छ।'}
              </p>

              {/* Pin notice badge box */}
              <div className="bg-[#f9f7f2] p-5 rounded-xl border border-dashed border-[#c9a227]/40 flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#c9a227] block">
                  {lang === 'en' ? 'Helpline Admissions' : 'भर्ना आवेदन सहयोग कक्ष'}
                </span>
                <p className="text-xs font-serif text-[#1a2744] font-bold">
                  {lang === 'en' ? 'Office Time: 10:00 AM — 4:00 PM' : 'कार्यालय समय: बिहान १० देखि अपरान्ह ४ सम्म'}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-[#1a2744]" />
                  <span>+977-76-691017</span>
                </div>
              </div>
            </div>

            {/* Right side: List of notices */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {noticesList.map((notice) => {
                return (
                  <div 
                    key={notice.id}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-5 items-start relative overflow-hidden"
                  >
                    {/* Top sticker badge if it's a "NEW" announcement */}
                    {notice.isNew && (
                      <div className="absolute top-0 right-0">
                        <span className="bg-[#c9a227] text-[#1a2744] font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 block rounded-bl-lg shadow-sm">
                          {lang === 'en' ? 'NEW' : 'नयाँ'}
                        </span>
                      </div>
                    )}

                    {/* Date stamp Badge representing BS system */}
                    <div className="px-4 py-3 bg-[#1a2744]/10 rounded-lg text-[#1a2744] flex flex-col items-center justify-center shrink-0 min-w-[100px] border border-gray-100">
                      <Calendar className="w-4 h-4 text-[#1a2744] mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-center">
                        {lang === 'en' ? notice.dateEn : notice.dateNp}
                      </span>
                    </div>

                    {/* Description Details */}
                    <div className="flex flex-col gap-1.5 md:pt-1">
                      <h3 className="font-serif text-base md:text-lg font-bold text-[#1a2744] leading-snug">
                        {lang === 'en' ? notice.titleEn : notice.titleNp}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {lang === 'en' ? notice.descEn : notice.descNp}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          GOLD DIVIDER 6
          ──────────────────────────────────────────────────────── */}
      <div className="gold-divider"></div>

      {/* ────────────────────────────────────────────────────────
          9. CONTACT SECTION & GOOGLE MAPS & WHATSAPP
          ──────────────────────────────────────────────────────── */}
      <section 
        id="contact-section" 
        className="py-16 md:py-24 bg-[#f9f7f2] scroll-reveal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a227]">
              {lang === 'en' ? 'Connect with SCTS' : 'शैक्षिक सम्पर्क फारम'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2744] font-semibold tracking-tight">
              {lang === 'en' ? 'Admissions & Queries Desk' : 'सूचना सोधपुछ प्रविष्टि तथा सम्पर्क'}
            </h2>
            <div className="w-20 h-1 bg-[#c9a227]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Direct info, phone, and maps */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-6">
                <h3 className="font-serif text-lg font-bold text-[#1a2744]">
                  {lang === 'en' ? 'Direct Campus Directory' : 'विद्यालय मूल कार्यालय'}
                </h3>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a2744]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#1a2744]" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                      {lang === 'en' ? 'Location Address' : 'विद्यालयको ठेगाना'}
                    </h4>
                    <p className="text-sm font-semibold text-[#1a2744] mt-0.5">
                      {lang === 'en' ? schoolInfo.locationEn : schoolInfo.locationNp}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lang === 'en' ? schoolInfo.locationDetailsEn : schoolInfo.locationDetailsNp}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a2744]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#1a2744]" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                      {lang === 'en' ? 'Phone Helpline' : 'फोन तथा सोधपुछ नम्बर'}
                    </h4>
                    <p className="text-sm font-bold text-[#1a2744] mt-0.5">
                      {schoolInfo.phone}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lang === 'en' ? 'Working Days (Sun — Fri)' : 'सम्पर्क समय: आइतबार देखि शुक्रबार'}
                    </p>
                  </div>
                </div>

                {/* Direct WhatsApp Action Button */}
                <a 
                  href={schoolInfo.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-3 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>{lang === 'en' ? 'Chat on WhatsApp' : 'व्हाट्सएपमा च्याट गर्नुहोस'}</span>
                </a>
              </div>

              {/* Google Maps Kapilvastu Placeholders embedded container */}
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 aspect-video bg-gray-150 relative">
                {/* Embedded static iframe fallback */}
                <iframe 
                  title="Shree Chhatrapali Tirthadevi Secondary School coordinates"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14168.049439603332!2d83.109315!3d27.56234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996ecd1b2ffffff%3A0xe5a3637e954ef84!2sPakadi!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp" 
                  className="w-full h-full border-0" 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                
                {/* Visual marker stick overlay */}
                <div className="absolute bottom-3 left-3 bg-[#1a2744] text-white p-2 text-[10px] rounded shadow-md pointer-events-none border border-[#c9a227]/30">
                  {lang === 'en' ? 'Pakadi, Mayadevi Municipality' : 'मायादेवी गाउँपालिका, पकडी कपिलवस्तु'}
                </div>
              </div>

            </div>

            {/* Right Column: Dynamic submission form and validation response */}
            <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-serif text-lg md:text-xl font-bold text-[#1a2744] mb-1.5">
                {lang === 'en' ? 'Send an Online Inquiry' : 'सोधपुछ वा भर्ना फारम'}
              </h3>
              <p className="text-xs text-gray-550 mb-6">
                {lang === 'en' 
                  ? 'Submit your basic profile and our administrative panel will contact you back immediately.'
                  : 'कृपया आफ्नो आवश्यक विवरण भर्नुहोला, हाम्रो शैक्षिक प्रशासनले तपाईंसँग सिधै जोडिने प्रयास गर्नेछ।'}
              </p>

              {formSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-emerald-800">
                      {lang === 'en' ? 'Inquiry Submitted!' : 'सोधपुछ बुझाइयो!'}
                    </h4>
                    <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                      {lang === 'en'
                        ? 'Thank you! Your academic query has been submitted safely. We will get back to you shortly.'
                        : 'हाम्रो विद्यालय सोधपुछ प्राप्त भएको छ। विवरणको मूल्यांकन गरी हामी छिट्टै तपाईंको फोनमा सम्पर्क गर्नेछौं।'}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      {lang === 'en' ? 'Your Full Name' : 'तपाईंको पूरा नाम (अनिवार्य)'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder={lang === 'en' ? 'E.g., Gourav Prasad Sharma' : 'उदा: गौरव प्रसाद शर्मा'}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c9a227] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        {lang === 'en' ? 'Phone Number' : 'सम्पर्क फोन नम्बर (अनिवार्य)'}
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="E.g., +977-98XXXXXXXX"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c9a227] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        {lang === 'en' ? 'Interested Faculty Program' : 'चासो भएको संकाय/स्तर'}
                      </label>
                      <select 
                        value={formState.program}
                        onChange={(e) => setFormState({ ...formState, program: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c9a227] text-xs bg-white"
                      >
                        <option value="general">{lang === 'en' ? 'General Query' : 'सामान्य जानकारी'}</option>
                        <option value="primary">{lang === 'en' ? 'Primary Education' : 'प्राथमिक तह'}</option>
                        <option value="secondary">{lang === 'en' ? 'Secondary (Grade SEE)' : 'माध्यमिक तह (SEE)'}</option>
                        <option value="plus2_mgmt">{lang === 'en' ? '+2 Management Faculty' : '+२ व्यवस्थापन संकाय'}</option>
                        <option value="plus2_edu">{lang === 'en' ? '+2 Education Faculty' : '+२ शिक्षा संकाय'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      {lang === 'en' ? 'Message / Query Detail' : 'थप सन्देश र टिप्पणीहरू'}
                    </label>
                    <textarea 
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder={lang === 'en' ? 'Type your specific questions about hostels, scholarship schemes, or fee parameters here...' : 'विद्यालय प्रशासनलाई पत्र लेख्नुहोस्...'}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#c9a227] text-xs resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full text-center py-3.5 bg-[#1a2744] hover:bg-[#203157] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    {lang === 'en' ? 'Send Message via SCTS Admin' : 'विद्यालय प्रशासन सोधपुछ फारम बुझाउनुहोस'}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          10. FOOTER SECTION
          ──────────────────────────────────────────────────────── */}
      <footer 
        id="footer-section"
        className="bg-[#10192e] text-white pt-16 pb-8 border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Column 1: School Brand and Initials */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#c9a227] bg-white flex items-center justify-center font-bold text-[#1a2744] text-sm shadow-sm shrink-0">
                  SCTS
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide font-serif text-[#c9a227]">
                    Shree Chhatrapali School
                  </span>
                  <span className="text-[10px] text-gray-400">
                    श्री छत्रपाली तीर्थादेवी मा.वि.
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                {lang === 'en' 
                  ? 'Representing standard public-trust community secondary school. Centering modern labs, affordable fee structure, and competitive +2 faculties.'
                  : 'मायादेवी गाउँपालिका क्षेत्रको अग्रणी सार्वजनिक विद्यालय। उत्कृष्ट कम्प्युटर र विज्ञान प्रविधिसहित देशकै नमूना उच्च माध्यमिक शिक्षालय।'}
              </p>
            </div>

            {/* Column 2: Quick Links Navigation Map */}
            <div className="flex flex-col gap-3">
              <h4 className="font-serif text-[#c9a227] font-semibold text-sm uppercase tracking-wider">
                {lang === 'en' ? 'Quick Links Map' : 'साइट नेभिगेसन नक्सा'}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <a href="#hero-container" className="hover:text-white transition-colors">{lang === 'en' ? 'Home' : 'गृहपृष्ठ'}</a>
                <a href="#about-section" className="hover:text-white transition-colors">{lang === 'en' ? 'About' : 'सम्बन्धमा'}</a>
                <a href="#programs-section" className="hover:text-white transition-colors">{lang === 'en' ? 'Programs' : 'कार्यक्रम'}</a>
                <a href="#facilities-section" className="hover:text-white transition-colors">{lang === 'en' ? 'Facilities' : 'सुविधाहरू'}</a>
                <a href="#gallery-section" className="hover:text-white transition-colors">{lang === 'en' ? 'Gallery' : 'तस्वीरहरू'}</a>
                <Link href="/our-team" className="hover:text-[#c9a227] text-white transition-colors">{lang === 'en' ? 'Staff ↗' : 'शिक्षकहरू ↗'}</Link>
                <a href="#notices-section" className="hover:text-white transition-colors">{lang === 'en' ? 'Notices' : 'सूचना'}</a>
                <a href="#contact-section" className="hover:text-white transition-colors">{lang === 'en' ? 'Contact' : 'सम्पर्क'}</a>
              </div>
            </div>

            {/* Column 3: Location Coordinates details */}
            <div className="flex flex-col gap-3">
              <h4 className="font-serif text-[#c9a227] font-semibold text-sm uppercase tracking-wider">
                {lang === 'en' ? 'Affiliations Recognition' : 'विद्यालयको मान्यता'}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {lang === 'en'
                  ? 'Affiliated with the Ministry of Education, Nepal & National Examination Board (NEB). Committing to the regional development goals of Lumbini Province.'
                  : 'नेपाल सरकार शिक्षा मन्त्रालय र राष्ट्रिय परीक्षा बोर्ड (NEB) बाट सम्बन्धन प्राप्त सामुदायिक माध्यम विद्यालय। सुलभ र वैज्ञानिक पाठ्यक्रमको उत्कृष्ट केन्द्र।'}
              </p>
            </div>

            {/* Column 4: Contact helpline block */}
            <div className="flex flex-col gap-3.5">
              <h4 className="font-serif text-[#c9a227] font-semibold text-sm uppercase tracking-wider">
                {lang === 'en' ? 'SCTS Contact Desk' : 'सिधा संवाद विवरण'}
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#c9a227]" />
                  <span>+977-76-691017</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#c9a227] shrink-0" />
                  <span>{lang === 'en' ? 'Pakadi, Kapilvastu, Nepal' : 'पकडी, कपिलवस्तु, नेपाल'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#c9a227]" />
                  <span>info@shreechhatrapalischool.edu.np</span>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>
              {lang === 'en'
                ? '© Copyright 2081 BS / 2024 - 2026 AD • Shree Chhatrapali Tirthadevi Secondary School. All rights reserved.'
                : '© सर्वाधिकार सुरक्षित २०८१ BS / २०२४ - २०२६ AD • श्री छत्रपाली तीर्थादेवी माध्यमिक विद्यालय। वेबसाइट विकास।'
              }
            </p>
            <p className="text-gray-600">
              {lang === 'en' ? 'Affiliated with NEB & MoE, Nepal' : 'शिक्षा मन्त्रालय र एन.ई.बी, स्वीकृत विवरण'}
            </p>
          </div>

        </div>
      </footer>

      {/* ────────────────────────────────────────────────────────
          STATEFUL LIGHTBOX DISPLAY SYSTEM
          ──────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-8 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top header navigation inside overlay */}
          <div className="flex items-center justify-between text-white w-full max-w-7xl mx-auto pt-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#c9a227] uppercase tracking-widest font-bold">
                {lang === 'en' ? 'SCTS Photo Viewer' : 'छत्रपाली रमाइलो तस्वीर सञ्जाल'}
              </span>
              <span className="text-xs uppercase text-gray-400 mt-0.5">
                {lightboxIndex + 1} / {galleryImages.length}
              </span>
            </div>
            
            <button 
              onClick={() => setLightboxIndex(null)}
              className="p-2 text-gray-400 hover:text-white focus:outline-none transition-colors border border-gray-700/60 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Core image display container */}
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto my-auto relative">
            
            {/* Prev Image Arrow button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full focus:outline-none transition-all hidden md:block"
            >
              <ArrowLeft className="w-8 h-8" />
            </button>

            {/* Expansive viewport Image frame */}
            <div 
              className="max-h-[70vh] max-w-[90%] md:max-w-[75%] mx-auto relative rounded-xl overflow-hidden shadow-2xl border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={galleryImages[lightboxIndex].src} 
                alt={galleryImages[lightboxIndex].titleEn}
                className="max-h-[70vh] object-contain w-full select-none"
                referrerPolicy="no-referrer"
                onError={(e) => handleFeaturedImageError(e, galleryImages[lightboxIndex].id)}
              />
            </div>

            {/* Next Image Arrow button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full focus:outline-none transition-all hidden md:block"
            >
              <ArrowRight className="w-8 h-8" />
            </button>
          </div>

          {/* Custom localized captions footer */}
          <div 
            className="w-full max-w-4xl mx-auto bg-gray-900/85 backdrop-blur-sm p-5 rounded-xl border border-gray-800 text-center text-white mb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#c9a227]">
              {lang === 'en' ? galleryImages[lightboxIndex].titleEn : galleryImages[lightboxIndex].titleNp}
            </h3>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              {lang === 'en' ? galleryImages[lightboxIndex].descEn : galleryImages[lightboxIndex].descNp}
            </p>
            
            {/* Mobile swipe touch indicator guidelines */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-4">
              <button 
                onClick={handlePrevPhoto} 
                className="px-3 py-1.5 bg-white/10 text-white rounded text-xs"
              >
                {lang === 'en' ? 'Prev' : 'अघिल्लो'}
              </button>
              <button 
                onClick={handleNextPhoto} 
                className="px-3 py-1.5 bg-white/10 text-white rounded text-xs"
              >
                {lang === 'en' ? 'Next' : 'पछिल्लो'}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
