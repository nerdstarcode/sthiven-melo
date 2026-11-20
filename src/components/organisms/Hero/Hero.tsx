import { motion, type Variants } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedText } from '@/components/atoms/AnimatedText'
import { Container } from '@/components/atoms/Container'
import { LinkArrow } from '@/components/atoms/Icon'
import { CONTACT_MAILTO, RESUME_PATH } from '@/constants/social'
import { useTranslation } from '@/i18n'
import profilePic from '@p/developer-pic-1.png'

const MotionImage = motion.create(Image)

const slideIn: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, staggerChildren: 0.08 } },
}

/** Seção inicial da home: ilustração, título, apresentação, currículo e contato. */
export function Hero() {
  const t = useTranslation('home')

  return (
    <div className='flex min-h-screen w-full items-center text-zinc-400'>
      <Container className='pt-4 md:pt-0'>
        <div className='grid w-full grid-cols-1 place-items-center items-center justify-between gap-10 lg:grid-cols-2'>
          <aside className='order-1 flex w-full justify-center lg:order-none'>
            <MotionImage
              variants={slideIn}
              initial='initial'
              animate='animate'
              whileHover={{ scale: 1.03, rotate: -1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              priority
              src={profilePic}
              alt={t.profileAlt}
              className='h-auto w-2/3 max-w-xs rounded-3xl shadow-[0_0_40px_rgba(88,230,217,0.35)] md:max-w-md lg:max-w-full'
            />
          </aside>
          <section className='flex w-full max-w-2xl flex-col gap-6'>
            <header className='flex'>
              <AnimatedText
                Tag='h1'
                text={t.title}
                className='text-left text-3xl! sm:text-4xl! md:text-5xl! lg:text-6xl!'
              />
            </header>
            <p className='my-4 text-justify text-base leading-relaxed font-medium whitespace-pre-line md:text-lg'>
              {t.describe}
            </p>
            <footer className='mt-2 flex flex-wrap items-center gap-4 sm:gap-6'>
              <Link
                href={RESUME_PATH}
                target='_blank'
                className='flex items-center rounded-lg border border-solid border-transparent bg-dark px-6 py-3 text-base font-semibold text-light transition-all duration-200 hover:border-dark hover:bg-light hover:text-black sm:text-lg'
              >
                {t.resume}
                <LinkArrow aria-hidden className='ml-2 w-5 sm:w-6' />
              </Link>
              <Link
                href={CONTACT_MAILTO}
                className='text-base font-medium text-light capitalize underline underline-offset-4 transition-colors hover:text-primary sm:text-lg'
              >
                {t.contact}
              </Link>
            </footer>
          </section>
        </div>
      </Container>
    </div>
  )
}

export default Hero
