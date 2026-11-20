# NerdStarCode: portfólio

Portfólio pessoal de Sthiven Melo.

**Stack:** Next.js 15 (Pages Router) · React 19 · TypeScript · Tailwind CSS 4 · motion · three.js · Storybook 10 · Vitest + Testing Library.

## Scripts

| Comando                   | O que faz                                       |
| ------------------------- | ----------------------------------------------- |
| `npm run dev`             | servidor de desenvolvimento                     |
| `npm run build` / `start` | build e servidor de produção                    |
| `npm run lint`            | ESLint (flat config, `eslint-config-next`)      |
| `npm run typecheck`       | `tsc --noEmit`                                  |
| `npm run format`          | Prettier (+ ordenação de classes Tailwind)      |
| `npm test` / `test:run`   | Vitest em watch / execução única                |
| `npm run storybook`       | Storybook em http://localhost:6006              |
| `npm run build-storybook` | Storybook estático em `storybook-static/`       |

> **Windows:** rode os comandos a partir de `C:\...` (drive em maiúscula). Abrir o terminal em
> `c:\...` faz o Node carregar React/Vitest duas vezes e quebra build e testes.

## Estrutura

```
src/
  components/
    atoms/       peças sem estado (Icon, NavLink, Container, AnimatedText…)
    molecules/   composições pequenas (LanguageSwitcher, ProjectCard, ExperienceItem…)
    organisms/   seções com estado/efeitos (NavBar, MobileMenu, Hero, ProjectsGrid…)
    templates/   PageLayout (NavBar + main + Footer)
  constants/     URLs, áreas de atuação, chaves de storage, navegação
  contexts/      Language, Theme e Work (área selecionada na home)
  data/          conteúdo do site (projetos, experiências, skills, ferramentas)
  i18n/          dicionários pt/en/es + useTranslation / useLocalize
  pages/         rotas: só compõem organisms com dados
  styles/        globals.css (tokens Tailwind em @theme)
  test/          setup do Vitest, helpers e o runner das stories
```

## Como criar um componente

1. Escolha o tier: sem estado → atom; composição pequena/um callback → molecule; estado, efeitos ou várias moléculas → organism.
2. Crie `src/components/<tier>/<Nome>/` com `Nome.tsx`, `Nome.stories.tsx`, `Nome.test.tsx` e `index.ts`.
3. Textos visíveis vão em `src/i18n/dictionaries.ts`; conteúdo, em `src/data`.
4. Se depender de contexto, aceite props opcionais com prioridade sobre o contexto.
5. Story CSF3 com `tags: ['autodocs']`, descrição em português citando onde é usado e um `play`.
6. Rode `npm run test:run`: além dos testes unitários, `src/test/stories.test.tsx` executa todas as stories e seus `play`.
   Stories que precisam de navegador real (WebGL etc.) levam a tag `browser-only`.
