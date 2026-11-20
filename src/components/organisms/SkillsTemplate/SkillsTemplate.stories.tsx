import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { SkillsTemplate } from './SkillsTemplate'

const meta = {
  title: 'Organisms/SkillsTemplate',
  component: SkillsTemplate,
  tags: ['autodocs'],
  args: { onSelectPerson: fn() },
  beforeEach: () => resetDemoData(),
  parameters: {
    docs: {
      description: {
        component: `App público Skills Template: o perfil do Sthiven abre por padrão e cada visitante cria o seu, do zero ou copiando as skills do perfil aberto. Edita os níveis no \`PersonSkillsEditor\` e resume num radar. As pessoas e o catálogo de skills são os mesmos do Location Overview.

\`\`\`tsx
<SkillsTemplate personId={query.perfil} onSelectPerson={(id) => router.push(...)} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SkillsTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const PerfilPadrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('heading', { name: 'Sthiven Melo' }),
    ).toBeInTheDocument()
  },
}

export const OutroPerfil: Story = { args: { personId: 'demo-diego' } }
