import { SkillBubble } from '@/components/atoms/SkillBubble'
import { skills as defaultSkills, type SkillPosition } from '@/data/skills'
import { useTranslation } from '@/i18n'

export interface SkillsCloudProps {
  skills?: SkillPosition[]
}

/** Seção "Skills" (âncora `#skills`): bolhas espalhadas sobre um fundo circular. */
export function SkillsCloud({ skills = defaultSkills }: SkillsCloudProps) {
  const t = useTranslation('about')

  return (
    <section id='skills'>
      <h2 className='mb-8 w-full text-center text-4xl font-bold sm:text-6xl lg:text-8xl'>
        {t.skillsTitle}
      </h2>
      <div className='relative flex h-[26rem] w-full items-center justify-center overflow-hidden rounded-full bg-circularDark sm:h-[32rem] lg:h-screen'>
        {skills.map((skill) => (
          <SkillBubble key={skill.name} name={skill.name} x={skill.x} y={skill.y} />
        ))}
      </div>
    </section>
  )
}

export default SkillsCloud
