import Link from 'next/link'
import { CircularText } from '@/components/atoms/Icon'
import { CONTACT_MAILTO } from '@/constants/social'
import { useTranslation } from '@/i18n'

/** Selo circular fixo no canto inferior esquerdo com link de contato por e-mail. */
export function HireMe() {
  const t = useTranslation('hireMe')

  return (
    <article className='fixed bottom-4 left-4 flex items-center justify-center overflow-hidden'>
      <div className='relative flex h-auto w-48 items-center justify-center'>
        <CircularText aria-hidden className='animate-spin-slow fill-light' />
        <Link
          href={CONTACT_MAILTO}
          className='absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-solid border-dark bg-zinc-800 font-semibold text-light shadow-md hover:bg-black'
        >
          {t.contact}
        </Link>
      </div>
    </article>
  )
}

export default HireMe
