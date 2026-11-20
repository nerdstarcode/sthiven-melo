# Convenções do projeto

- Next.js 15 **Pages Router**: não use `'use client'` nem APIs do App Router.
- Atomic Design em `src/components/{atoms,molecules,organisms,templates}/<Nome>/` com `Nome.tsx` (export nomeado + default), `Nome.stories.tsx`, `Nome.test.tsx` e `index.ts`.
- Páginas (`src/pages`) só compõem organisms. Conteúdo fica em `src/data`, textos em `src/i18n/dictionaries.ts` (pt/en/es), URLs e constantes em `src/constants`.
- Componentes que leem contexto usam `useContext(Ctx)` direto com props opcionais de override (`prop ?? ctx?.valor ?? padrão`). Nunca usam o hook que lança erro.
- Estilo: Tailwind 4 (tokens em `@theme`, em `src/styles/globals.css`), `twMerge` para mesclar `className`, aspas simples e sem ponto e vírgula (Prettier).
- Stories: Storybook 10 (`@storybook/nextjs-vite`), CSF3, `tags: ['autodocs']`, descrição em PT, utilitários de `storybook/test`, ao menos um `play`.
- Testes: Vitest + Testing Library + user-event, `describe`/`it` em PT, `renderWithProviders` de `src/test/utils.tsx`.
- Verificação: `npm run test:run`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`.
- No Windows, rode comandos a partir de `C:\` (maiúsculo). Com `c:\`, o React/Vitest é carregado duas vezes.
