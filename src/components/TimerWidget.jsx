import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@contexts/ThemeContext'
import { useI18n } from '@contexts/I18nContext'

const TimerWidget = () => {
  const { currentTime, countdown, settings, formatTime, formatDateTime } = useTheme()
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-3 text-sm"
    >
      {/* Current Time */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {t('settings.currentTime')}
        </div>
        <div className="font-mono font-semibold text-neon-blue">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Separator */}
      <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>

      {/* Countdown */}
      {settings.autoSwitch && (
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t('settings.nextSwitch')}
          </div>
          <div className="font-mono font-semibold text-neon-purple">
            {countdown}
          </div>
        </div>
      )}

      {/* Timezone indicator */}
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {settings.timezone.split('/').pop()}
      </div>
    </motion.div>
  )
}

export default TimerWidget
