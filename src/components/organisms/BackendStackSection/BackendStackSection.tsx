import Image from 'next/image'
import { backendStack, type Tool } from '@/data/tools'
import { useTranslation } from '@/i18n'
import backendIllustration from '@p/backend.svg'

export interface BackendStackSectionProps {
  stack?: Tool[]
}

/** Seção "Backend" da home: grade de logos da stack + ilustração + coluna de projetos. */
export function BackendStackSection({ stack = backendStack }: BackendStackSectionProps) {
  const t = useTranslation('home')

  return (
    <section className='grid min-h-screen flex-col place-items-center items-center justify-center text-center md:grid-cols-3'>
      <article className='grid animate-fade-up grid-cols-1 gap-4 animate-delay-500'>
        <header>
          <h2 className='text-4xl'>{t.stack}</h2>
        </header>
        <div className='grid grid-cols-3 place-items-center gap-4 sm:grid-cols-5'>
          {stack.map((tool) => (
            <Image key={tool.name} className='w-20' alt={tool.name} src={tool.image} />
          ))}
          <p className='col-span-3 sm:col-span-1'>{t.andMore}</p>
        </div>
      </article>
      <article className='animate-fade'>
        <Image alt='' src={backendIllustration} priority />
      </article>
      <article>
        <header>
          <h2 className='text-4xl'>{t.projects}</h2>
        </header>
      </article>
    </section>
  )
}

export default BackendStackSection
