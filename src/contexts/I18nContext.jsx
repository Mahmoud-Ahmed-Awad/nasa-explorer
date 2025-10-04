import React, { createContext, useContext, useState, useEffect } from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        missions: 'Missions',
        exoplanets: 'Exoplanets',
        satellites: 'Satellites',
        team: 'Team',
        dashboard: 'Dashboard',
        contact: 'Contact',
        ai: 'AI Assistant',
        settings: 'Settings'
      },
      
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        export: 'Export',
        import: 'Import',
        refresh: 'Refresh',
        retry: 'Retry'
      },
      
      // Theme
      theme: {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      },
      
      // Settings
      settings: {
        title: 'Settings',
        language: 'Language',
        theme: 'Theme',
        autoTheme: 'Auto Theme Switching',
        manualTime: 'Manual Time Override',
        dayStart: 'Day Start Time',
        nightStart: 'Night Start Time',
        currentTime: 'Current Time',
        nextSwitch: 'Next Switch',
        applyNow: 'Apply Theme Now',
        resetSettings: 'Reset to Defaults',
        enableCursor: 'Enable Spaceship Cursor',
        enableSounds: 'Enable Sound Effects'
      },
      
      // Home
      home: {
        title: 'Explore the Universe',
        subtitle: 'Discover NASA missions, exoplanets, and satellites with interactive 3D visualizations and real-time data.',
        getStarted: 'Get Started',
        exploreMissions: 'Explore Missions',
        viewExoplanets: 'View Exoplanets',
        trackSatellites: 'Track Satellites',
        features: {
          title: 'Explore the Cosmos',
          missions: 'Space Missions',
          missionsDesc: 'Discover NASA missions with detailed information and 3D models',
          exoplanets: 'Exoplanets',
          exoplanetsDesc: 'Explore planets beyond our solar system with interactive charts',
          satellites: 'Satellites',
          satellitesDesc: 'Track satellites in real-time with interactive maps',
          ai: 'AI Assistant',
          aiDesc: 'Get answers about space and NASA data with our AI assistant'
        }
      },
      
      // Missions
      missions: {
        title: 'Space Missions',
        subtitle: 'Explore NASA missions and their incredible achievements',
        filters: {
          year: 'Year',
          type: 'Type',
          status: 'Status'
        },
        details: {
          launchYear: 'Launch Year',
          launchDate: 'Launch Date',
          type: 'Type',
          duration: 'Duration',
          launchVehicle: 'Launch Vehicle',
          launchSite: 'Launch Site',
          cost: 'Cost'
        }
      },
      
      // Exoplanets
      exoplanets: {
        title: 'Exoplanets',
        subtitle: 'Discover planets beyond our solar system',
        filters: {
          mass: 'Mass (Earth masses)',
          radius: 'Radius (Earth radii)',
          distance: 'Distance (light years)'
        }
      },
      
      // Satellites
      satellites: {
        title: 'Satellites',
        subtitle: 'Track satellites in real-time',
        map: 'Map View',
        list: 'List View',
        details: {
          altitude: 'Altitude',
          period: 'Period',
          inclination: 'Inclination',
          velocity: 'Velocity'
        }
      },
      
      // Team
      team: {
        title: 'Our Team',
        subtitle: 'Meet the passionate individuals behind NASA Explorer'
      },
      
      // AI
      ai: {
        title: 'AI Assistant',
        subtitle: 'Ask questions about space, NASA missions, and astronomy',
        placeholder: 'Ask me anything about space...',
        send: 'Send',
        thinking: 'Thinking...',
        examples: {
          title: 'Example Questions',
          q1: 'Tell me about the James Webb Space Telescope',
          q2: 'What are the most interesting exoplanets discovered recently?',
          q3: 'How does the International Space Station work?'
        }
      },
      
      // Contact
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with our team',
        form: {
          name: 'Name',
          email: 'Email',
          subject: 'Subject',
          message: 'Message',
          send: 'Send Message'
        }
      }
    }
  },
  ar: {
    translation: {
      // Navigation
      nav: {
        home: 'الرئيسية',
        missions: 'المهام',
        exoplanets: 'الكواكب الخارجية',
        satellites: 'الأقمار الصناعية',
        team: 'الفريق',
        dashboard: 'لوحة التحكم',
        contact: 'اتصل بنا',
        ai: 'المساعد الذكي',
        settings: 'الإعدادات'
      },
      
      // Common
      common: {
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجح',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',
        view: 'عرض',
        close: 'إغلاق',
        back: 'رجوع',
        next: 'التالي',
        previous: 'السابق',
        search: 'بحث',
        filter: 'تصفية',
        sort: 'ترتيب',
        export: 'تصدير',
        import: 'استيراد',
        refresh: 'تحديث',
        retry: 'إعادة المحاولة'
      },
      
      // Theme
      theme: {
        light: 'فاتح',
        dark: 'داكن',
        system: 'النظام'
      },
      
      // Settings
      settings: {
        title: 'الإعدادات',
        language: 'اللغة',
        theme: 'المظهر',
        autoTheme: 'تبديل المظهر التلقائي',
        manualTime: 'تجاوز الوقت اليدوي',
        dayStart: 'وقت بداية النهار',
        nightStart: 'وقت بداية الليل',
        currentTime: 'الوقت الحالي',
        nextSwitch: 'التبديل التالي',
        applyNow: 'تطبيق المظهر الآن',
        resetSettings: 'إعادة تعيين الإعدادات',
        enableCursor: 'تفعيل مؤشر المركبة الفضائية',
        enableSounds: 'تفعيل المؤثرات الصوتية'
      },
      
      // Home
      home: {
        title: 'استكشف الكون',
        subtitle: 'اكتشف مهام ناسا والكواكب الخارجية والأقمار الصناعية مع التصورات ثلاثية الأبعاد التفاعلية والبيانات في الوقت الفعلي.',
        getStarted: 'ابدأ الآن',
        exploreMissions: 'استكشف المهام',
        viewExoplanets: 'عرض الكواكب الخارجية',
        trackSatellites: 'تتبع الأقمار الصناعية',
        features: {
          title: 'استكشف الكون',
          missions: 'مهام الفضاء',
          missionsDesc: 'اكتشف مهام ناسا مع معلومات مفصلة ونماذج ثلاثية الأبعاد',
          exoplanets: 'الكواكب الخارجية',
          exoplanetsDesc: 'استكشف الكواكب خارج نظامنا الشمسي مع الرسوم البيانية التفاعلية',
          satellites: 'الأقمار الصناعية',
          satellitesDesc: 'تتبع الأقمار الصناعية في الوقت الفعلي مع الخرائط التفاعلية',
          ai: 'المساعد الذكي',
          aiDesc: 'احصل على إجابات حول الفضاء وبيانات ناسا مع مساعدنا الذكي'
        }
      },
      
      // Missions
      missions: {
        title: 'مهام الفضاء',
        subtitle: 'استكشف مهام ناسا وإنجازاتها المذهلة',
        filters: {
          year: 'السنة',
          type: 'النوع',
          status: 'الحالة'
        },
        details: {
          launchYear: 'سنة الإطلاق',
          launchDate: 'تاريخ الإطلاق',
          type: 'النوع',
          duration: 'المدة',
          launchVehicle: 'مركبة الإطلاق',
          launchSite: 'موقع الإطلاق',
          cost: 'التكلفة'
        }
      },
      
      // Exoplanets
      exoplanets: {
        title: 'الكواكب الخارجية',
        subtitle: 'اكتشف الكواكب خارج نظامنا الشمسي',
        filters: {
          mass: 'الكتلة (كتلة أرضية)',
          radius: 'نصف القطر (نصف قطر أرضي)',
          distance: 'المسافة (سنوات ضوئية)'
        }
      },
      
      // Satellites
      satellites: {
        title: 'الأقمار الصناعية',
        subtitle: 'تتبع الأقمار الصناعية في الوقت الفعلي',
        map: 'عرض الخريطة',
        list: 'عرض القائمة',
        details: {
          altitude: 'الارتفاع',
          period: 'الفترة',
          inclination: 'الميل',
          velocity: 'السرعة'
        }
      },
      
      // Team
      team: {
        title: 'فريقنا',
        subtitle: 'تعرف على الأشخاص المتحمسين وراء مستكشف ناسا'
      },
      
      // AI
      ai: {
        title: 'المساعد الذكي',
        subtitle: 'اسأل أسئلة حول الفضاء ومهام ناسا وعلم الفلك',
        placeholder: 'اسألني أي شيء عن الفضاء...',
        send: 'إرسال',
        thinking: 'أفكر...',
        examples: {
          title: 'أسئلة مثال',
          q1: 'أخبرني عن تلسكوب جيمس ويب الفضائي',
          q2: 'ما هي أكثر الكواكب الخارجية إثارة للاهتمام التي تم اكتشافها مؤخراً؟',
          q3: 'كيف تعمل محطة الفضاء الدولية؟'
        }
      },
      
      // Contact
      contact: {
        title: 'اتصل بنا',
        subtitle: 'تواصل مع فريقنا',
        form: {
          name: 'الاسم',
          email: 'البريد الإلكتروني',
          subject: 'الموضوع',
          message: 'الرسالة',
          send: 'إرسال الرسالة'
        }
      }
    }
  }
}

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false
    }
  })

const I18nContext = createContext()

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setLanguage(lng)
  }

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng)
      // Update document direction for RTL support
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lng
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    // Set initial direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [language])

  const value = {
    language,
    changeLanguage,
    t: i18n.t
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export default i18n
