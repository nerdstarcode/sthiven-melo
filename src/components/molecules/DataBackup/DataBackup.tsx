import { Download, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { exportAllData, importAllData } from '@/features/location-overview/lib/backupStorage'
import { format, useTranslation } from '@/i18n'

export interface DataBackupProps {
  /** Depois de importar (padrão: recarrega a página para as telas lerem os dados novos). */
  onImported?: () => void
}

function download(fileName: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

/** Exporta/importa todos os dados dos apps em JSON (o token do Azure fica de fora). */
export function DataBackup({ onImported = () => window.location.reload() }: DataBackupProps) {
  const t = useTranslation('apps')
  const input = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<{ ok: boolean; message: string }>()

  const exportFile = () => {
    const date = new Date().toISOString().slice(0, 10)
    download(`location-overview-${date}.json`, JSON.stringify(exportAllData(), null, 2))
  }

  const importFile = async (file: File | undefined) => {
    if (!file) return
    try {
      importAllData(JSON.parse(await file.text()))
      setStatus({ ok: true, message: t.backup.imported })
      onImported()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setStatus({ ok: false, message: format(t.backup.invalid, { message }) })
    } finally {
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-2' title={t.backup.hint}>
      <Button variant='secondary' size='sm' onClick={exportFile}>
        <Download size={14} aria-hidden /> {t.backup.export}
      </Button>
      <Button variant='secondary' size='sm' onClick={() => input.current?.click()}>
        <Upload size={14} aria-hidden /> {t.backup.import}
      </Button>
      <input
        ref={input}
        type='file'
        accept='application/json,.json'
        className='hidden'
        aria-label={t.backup.import}
        onChange={(e) => importFile(e.target.files?.[0])}
      />
      {status && (
        <p role={status.ok ? 'status' : 'alert'} className={status.ok ? 'text-xs text-fg' : 'text-xs text-danger'}>
          {status.message}
        </p>
      )}
    </div>
  )
}

export default DataBackup
