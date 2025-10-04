import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DEFAULT_SETTINGS = {
  theme: 'system', // 'light', 'dark', 'system'
  autoSwitch: true,
  manualTimeOverride: null, // { time: '12:00', timezone: 'America/New_York' }
  timezone: 'America/New_York',
  dayStart: '07:00',
  nightStart: '18:00',
  enableCursor: false,
  enableSounds: false
}

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextSwitchTime, setNextSwitchTime] = useState(null)
  const [countdown, setCountdown] = useState('')

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('nasa-explorer-theme-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (error) {
        console.error('Error loading theme settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('nasa-explorer-theme-settings', JSON.stringify(settings))
  }, [settings])

  // Get effective site time (manual override or browser time)
  const getEffectiveSiteTime = useCallback(() => {
    if (settings.manualTimeOverride) {
      const today = new Date()
      const [hours, minutes] = settings.manualTimeOverride.time.split(':').map(Number)
      const manualTime = new Date(today)
      manualTime.setHours(hours, minutes, 0, 0)
      return manualTime
    }
    return new Date()
  }, [settings.manualTimeOverride])

  // Calculate next theme switch time
  const calculateNextSwitchTime = useCallback(() => {
    const now = getEffectiveSiteTime()
    const [dayStartHour, dayStartMin] = settings.dayStart.split(':').map(Number)
    const [nightStartHour, nightStartMin] = settings.nightStart.split(':').map(Number)
    
    const dayStart = new Date(now)
    dayStart.setHours(dayStartHour, dayStartMin, 0, 0)
    
    const nightStart = new Date(now)
    nightStart.setHours(nightStartHour, nightStartMin, 0, 0)
    
    // If it's currently day time, next switch is to night
    if (now >= dayStart && now < nightStart) {
      return nightStart
    } else {
      // If it's night time, next switch is to day (next day)
      const nextDayStart = new Date(dayStart)
      nextDayStart.setDate(nextDayStart.getDate() + 1)
      return nextDayStart
    }
  }, [settings.dayStart, settings.nightStart, getEffectiveSiteTime])

  // Determine theme based on time and settings
  const determineTheme = useCallback(() => {
    if (settings.theme === 'light') return 'light'
    if (settings.theme === 'dark') return 'dark'
    
    if (settings.autoSwitch) {
      const now = getEffectiveSiteTime()
      const [dayStartHour, dayStartMin] = settings.dayStart.split(':').map(Number)
      const [nightStartHour, nightStartMin] = settings.nightStart.split(':').map(Number)
      
      const dayStart = new Date(now)
      dayStart.setHours(dayStartHour, dayStartMin, 0, 0)
      
      const nightStart = new Date(now)
      nightStart.setHours(nightStartHour, nightStartMin, 0, 0)
      
      // If current time is between day start and night start, it's day time
      if (now >= dayStart && now < nightStart) {
        return 'light'
      } else {
        return 'dark'
      }
    }
    
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [settings, getEffectiveSiteTime])

  // Update theme
  const updateTheme = useCallback(() => {
    const newTheme = determineTheme()
    setCurrentTheme(newTheme)
    
    if (settings.autoSwitch) {
      const nextSwitch = calculateNextSwitchTime()
      setNextSwitchTime(nextSwitch)
    }
  }, [determineTheme, settings.autoSwitch, calculateNextSwitchTime])

  // Update theme on mount and when settings change
  useEffect(() => {
    updateTheme()
  }, [updateTheme])

  // Countdown timer
  useEffect(() => {
    if (!settings.autoSwitch || !nextSwitchTime) {
      setCountdown('')
      return
    }

    const updateCountdown = () => {
      const now = getEffectiveSiteTime()
      const diff = nextSwitchTime.getTime() - now.getTime()
      
      if (diff <= 0) {
        updateTheme()
        return
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [nextSwitchTime, settings.autoSwitch, getEffectiveSiteTime, updateTheme])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(currentTheme)
  }, [currentTheme])

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getEffectiveSiteTime())
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [getEffectiveSiteTime])

  // Update settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  // Apply theme now based on current settings
  const applyThemeNow = () => {
    updateTheme()
  }

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format date and time
  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const value = {
    currentTheme,
    currentTime,
    nextSwitchTime,
    countdown,
    settings,
    updateSettings,
    resetSettings,
    applyThemeNow,
    formatTime,
    formatDateTime
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
