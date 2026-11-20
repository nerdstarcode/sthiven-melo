import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { resetDemoData } from '@/features/seed/demoSeed'
import { useTranslation } from '@/i18n'

export interface ResetDemoButtonProps {
  /** Chamado depois de restaurar. Padrão: recarrega a página para todas as telas relerem os dados. */
  onReset?: () => void
  /** Confirmação antes de apagar. Padrão: `window.confirm`. */
  confirm?: (message: string) => boolean
}

/** Apaga os dados dos apps no navegador (menos o token do Azure) e volta para a demonstração. */
export function ResetDemoButton({
  onReset = () => window.location.reload(),
  confirm = (message) => window.confirm(message),
}: ResetDemoButtonProps) {
  const t = useTranslation('apps')

  return (
    <Button
      variant='secondary'
      size='sm'
      title={t.common.demoNotice}
      onClick={() => {
        if (!confirm(t.common.resetDemoConfirm)) return
        resetDemoData()
        onReset()
      }}
    >
      <RotateCcw size={14} aria-hidden /> {t.common.resetDemo}
    </Button>
  )
}

export default ResetDemoButton
