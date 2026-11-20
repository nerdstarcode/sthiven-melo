import { useRouter } from 'next/router'
import { SkillsTemplate } from '@/components/organisms/SkillsTemplate'
import { SkillsTemplateLayout, skillsTemplateHref } from '@/features/skills/SkillsTemplateLayout'

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) || undefined

/** Skills Template: perfil de skills público. O perfil aberto fica na URL (`?perfil=`). */
export default function SkillsTemplatePage() {
  const router = useRouter()

  return (
    <SkillsTemplateLayout>
      <SkillsTemplate
        personId={first(router.query.perfil)}
        onSelectPerson={(id) =>
          router.push(skillsTemplateHref(id), undefined, { shallow: true, scroll: false })
        }
      />
    </SkillsTemplateLayout>
  )
}
