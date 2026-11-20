import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { RequiredSkill } from '@/features/location-overview/lib/squadsStorage'
import { demoSkills, demoSquads } from '@/features/seed/demoSeed'
import { RequiredSkillsEditor } from './RequiredSkillsEditor'

const meta = {
  title: 'Molecules/RequiredSkillsEditor',
  component: RequiredSkillsEditor,
  tags: ['autodocs'],
  args: { value: demoSquads[0].requiredSkills!, skills: demoSkills, onChange: fn() },
  render: function Render(args) {
    const [value, setValue] = useState<RequiredSkill[]>(args.value)
    return (
      <div className='w-96'>
        <RequiredSkillsEditor
          {...args}
          value={value}
          onChange={(next) => {
            setValue(next)
            args.onChange(next)
          }}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        component: `Lista controlada de skills requeridas por uma squad, cada uma com o nível mínimo (1 a 5). Fica no formulário do \`SquadsManager\` e alimenta o \`SkillCoveragePanel\`.

\`\`\`tsx
<RequiredSkillsEditor skills={skills} value={draft.requiredSkills} onChange={setRequired} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof RequiredSkillsEditor>

export default meta
type Story = StoryObj<typeof meta>

export const SquadFrontendWeb: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: 'Nível mínimo React: 5' }))
    await expect(args.onChange).toHaveBeenCalled()
  },
}

export const Vazio: Story = { args: { value: [] } }
