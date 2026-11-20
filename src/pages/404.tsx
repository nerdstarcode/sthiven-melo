import Image from 'next/image'
import { useTranslation } from '@/i18n'
import notFoundIllustration from '@p/404.svg'

export default function NotFound() {
  const t = useTranslation('notFound')

  return (
    <div className='flex min-h-full w-full flex-col items-center justify-center'>
      <Image
        priority
        src={notFoundIllustration}
        alt={t.alt}
        className='h-full rounded-2xl bg-center object-cover object-center'
      />
      <h2 className='group flex cursor-alias flex-col text-center select-none'>
        <span className='animate-jump-in text-7xl text-purple-600 animate-delay-300 animate-once'>
          <span className='block animate-wiggle animate-infinite'>404</span>
        </span>
        <span className='glowing animate-jump-in text-purple-800 animate-delay-700 animate-ease-in animate-once group-hover:text-purple-500 group-hover:drop-shadow-2xl'>
          {t.title}
        </span>
      </h2>
    </div>
  )
}
