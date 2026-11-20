import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ProficiencyRating } from './ProficiencyRating'

const meta = {
  title: 'Molecules/ProficiencyRating',
  component: ProficiencyRating,
  tags: ['autodocs'],
  args: { value: 3, label: 'React' },
  parameters: {
    docs: {
      description: {
        component: `Nível de proficiência de 1 a 5 em blocos. Com \`onChange\`, vira um radio group editável (perfil no Skills Template). Sem \`onChange\`, é só leitura (\`role="meter"\`). \`minLevel\` destaca o mínimo exigido pela squad.

\`\`\`tsx
<ProficiencyRating label={skill.name} value={level} onChange={(l) => setPersonSkill(id, skill.id, l)} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ProficiencyRating>

export default meta
type Story = StoryObj<typeof meta>

export const SomenteLeitura: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('meter', { name: 'React' })).toHaveAttribute(
      'aria-valuenow',
      '3',
    )
  },
}

export const ComMinimo: Story = { args: { value: 2, minLevel: 4 } }

export const Editavel: Story = {
  args: { onChange: fn() },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    return (
      <ProficiencyRating
        {...args}
        value={value}
        onChange={(level) => {
          setValue(level)
          args.onChange?.(level)
        }}
      />
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: 'React: 5' }))
    await expect(args.onChange).toHaveBeenCalledWith(5)
    await expect(canvas.getByRole('radio', { name: 'React: 5' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  },
}
