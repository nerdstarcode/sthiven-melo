import Link from 'next/link'
import { Container } from '@/components/atoms/Container'
import { CONTACT_MAILTO } from '@/constants/social'
import { useTranslation } from '@/i18n'

export function Footer() {
  const t = useTranslation('footer')
  const year = new Date().getFullYear()

  return (
    <footer className='w-full border-t-2 border-solid border-dark text-lg font-medium'>
      <Container className='flex flex-col items-center justify-between gap-4 py-8! text-sm sm:text-lg md:flex-row md:text-xs'>
        <span>
          {year}&copy; {t.rights}
        </span>
        <div className='flex items-center'>
          {t.builtWith} <span className='px-1 text-2xl text-primary'>&#9825;</span> {t.by}&nbsp;
          <Link href='/' className='underline underline-offset-2'>
            NerdStarCode
          </Link>
        </div>
        <Link href={CONTACT_MAILTO}>{t.sayHello}</Link>
      </Container>
    </footer>
  )
}

export default Footer
