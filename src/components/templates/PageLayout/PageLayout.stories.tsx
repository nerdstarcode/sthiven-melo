import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { Hero } from '@/components/organisms/Hero'
import { PageLayout } from './PageLayout'

const meta = {
  title: 'Templates/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  args: { children: <Hero /> },
  parameters: {
    layout: 'fullscreen',
    nextjs: { router: { pathname: '/' } },
    docs: {
      description: {
        component: `Casca de todas as páginas, aplicada em \`pages/_app.tsx\`: \`NavBar\`, o conteúdo da página dentro de \`<main>\` (o único \`main\` do documento), \`Footer\` e, no mobile, a barra inferior com a \`Logo\`. Os providers (tema, idioma, área) continuam no \`_app\`.

\`\`\`tsx
<PageLayout className={montserrat.variable}>
  <Component {...pageProps} />
</PageLayout>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof PageLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Home: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(canvas.getByRole('button', { name: 'Abrir menu' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Diga olá!' })).toBeInTheDocument()
  },
}

export const ConteudoSimples: Story = {
  args: { children: <p className='p-32 text-zinc-200'>Conteúdo da página</p> },
}
