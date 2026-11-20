import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { demoCargos, demoPeople } from '@/features/seed/demoSeed'
import { SupportForm } from './SupportForm'

const meta = {
  title: 'Molecules/SupportForm',
  component: SupportForm,
  tags: ['autodocs'],
  args: { people: demoPeople, cargos: demoCargos, onSubmit: fn(() => null) },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Cadastro de um apoio (mentoria) numa sprint: quem apoia, quem é apoiado (só do mesmo tipo, QA ou não-QA) e a % sobre a carga do apoiado, com atalhos Leve/Médio/Intenso.

\`\`\`tsx
<SupportForm people={alocados} cargos={cargos} onSubmit={(draft) => adicionar({ ...draft, sprintId })} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SupportForm>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.selectOptions(canvas.getByLabelText('Quem apoia'), 'demo-ana')
    await userEvent.selectOptions(canvas.getByLabelText('Apoiado'), 'demo-bruno')
    await userEvent.click(canvas.getByRole('button', { name: 'Adicionar apoio' }))
    await expect(args.onSubmit).toHaveBeenCalled()
  },
}
