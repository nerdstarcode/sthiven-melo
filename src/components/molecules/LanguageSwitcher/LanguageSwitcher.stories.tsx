import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { LanguageSwitcher } from './LanguageSwitcher'

const meta = {
  title: 'Molecules/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  args: { language: 'pt', onChange: fn() },
  parameters: {
    docs: {
      description: {
        component: `Seletor de idioma (PT/EN/ES). Sem props, lê e grava no \`LanguageContext\`, que persiste a escolha no \`localStorage\`. Usado na \`NavBar\` (desktop) e no \`MobileMenu\`.

\`\`\`tsx
<LanguageSwitcher />                      // ligado ao contexto
<LanguageSwitcher language='en' onChange={setLang} />  // controlado
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Portugues: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'pt' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'es' }))
    await expect(args.onChange).toHaveBeenCalledWith('es')
  },
}

export const Ingles: Story = { args: { language: 'en' } }

export const LigadoAoContexto: Story = {
  args: { language: undefined, onChange: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'en' }))
    await expect(canvas.getByRole('button', { name: 'en' })).toHaveAttribute('aria-pressed', 'true')
  },
}
