import { useTranslation } from 'react-i18next'

export default function WebsitePageShell({ title, subtitle, icon, children, right }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm">{subtitle || t('nav.website')}</p>
          </div>
        </div>
        {right}
      </div>

      {children}
    </div>
  )
}











