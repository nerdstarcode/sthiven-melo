# Think: repaginar /projects com alocação, pessoas, níveis e skills (2026-11-20)


**Resumo:** substituir o conteúdo atual de `/projects` no portfólio (grade de cards em `ProjectsGrid`) por funcionalidades trazidas do `location-overview` (Vite + React 19, dados em localStorage, sem backend próprio): criação e visualização de alocações (Pessoa × Squad × Sprint × %), cadastro de pessoas e de níveis (capacidade/máximo de pontos por dia). Somar um vínculo novo entre pessoas e hard/soft skills, e um overview das skills de cada projeto. Hoje o location-overview não tem a entidade "Projeto" (o papel é feito pelo Squad) nem nenhum conceito de skills.

## Perguntas e decisões
### Q1. Destino da vitrine atual
- **Tipo:** Regra de negócio
- **Pergunta:** Trocar a vitrine de /projects pela ferramenta de gestão, ou manter a vitrine e pôr a ferramenta em outro lugar?
- **Resposta recomendada:** Manter a vitrine e criar a ferramenta numa rota nova.
- **Decisão:** Os projetos da vitrine viram dados da ferramenta: passam a ser entidades "Projeto", com pessoas e skills ligadas a eles.
- **Depende de:** —
- **Revisado:** /projects vira uma vitrine de apps. Cada card é um projeto: Location Overview (app interno), Skills Template (app interno), Fichas de RPG (link externo fictício) e os projetos antigos (link para o GitHub). Motivo: o usuário esclareceu que "projetos" são funcionalidades do site ou de outros sites que ele criou.

### Q2. Projeto × Squad
- **Tipo:** Regra de negócio
- **Pergunta:** Projeto substitui Squad, fica acima dele ou os dois são independentes?
- **Resposta recomendada:** Projeto substitui Squad.
- **Decisão:** Projeto substitui Squad. Alocação = Pessoa × Projeto × Sprint × %.
- **Depende de:** Q1
- **Revisado:** O Squad volta a existir dentro do app Location Overview. Alocação = Pessoa × Squad × Sprint × %, como no original. Motivo: revisão de Q1.

### Q3. Unidade de tempo da alocação
- **Tipo:** Regra de negócio
- **Pergunta:** A alocação é por Sprint, por período (início/fim) ou sem tempo?
- **Resposta recomendada:** Período com início e fim.
- **Decisão:** Manter Sprints, trazendo também o cadastro de Sprints. Dias alocados = % × dias úteis da sprint.
- **Depende de:** Q2

### Q4. Persistência
- **Tipo:** Recurso técnico
- **Pergunta:** Onde ficam os dados: localStorage, backend real, ou estático com edição local?
- **Resposta recomendada:** localStorage com seed.
- **Decisão:** localStorage com seed a partir dos projetos da vitrine, mais um botão de resetar.
- **Depende de:** Q1

### Q5. Modelo de skills
- **Tipo:** Regra de negócio
- **Pergunta:** Como representar hard e soft skills?
- **Resposta recomendada:** Catálogo de skills + proficiência de 1 a 5 por pessoa.
- **Decisão:** Catálogo de skills + proficiência de 1 a 5. Skill { nome, tipo hard|soft, categoria? }, PessoaSkill { pessoa, skill, nível }.
- **Depende de:** —

### Q6. Fonte do overview de skills do projeto
- **Tipo:** Regra de negócio
- **Pergunta:** O overview mostra skills requeridas, disponíveis ou só tags?
- **Resposta recomendada:** Requeridas × disponíveis.
- **Decisão:** Requeridas × disponíveis. O projeto declara { skill, nível mínimo }, e as disponíveis vêm das pessoas alocadas na sprint selecionada. Mostra cobertura e gaps, separando hard e soft.
- **Depende de:** Q2, Q3, Q5
- **Revisado:** A ser rediscutido. O overview de skills por "projeto" passa a ser por Squad dentro do Location Overview? Ver Q15.

### Q7. Regra de cobertura
- **Tipo:** Regra de negócio
- **Pergunta:** Quando uma skill requerida conta como coberta?
- **Resposta recomendada:** Pelo maior nível entre as pessoas alocadas: ≥ mínimo é coberta, abaixo é parcial, ninguém é gap.
- **Decisão:** Como recomendado. A % de alocação não pondera.
- **Depende de:** Q6

### Q8. Recorte do que vem do location-overview
- **Tipo:** Regra de negócio (escopo)
- **Pergunta:** O que vem e o que fica de fora?
- **Resposta recomendada:** Só o núcleo (Projetos, Alocações, Pessoas, Níveis/Cargos, Sprints, Skills).
- **Decisão:**
  - Vem o núcleo, mais o Backup JSON, os gráficos e a integração com o Azure DevOps.
  - A alocação trazida é a da aba Squads (`AllocationsOverview`), e não o fluxo de planilha (`AllocationTable`). O import de xlsx fica de fora.
- **Depende de:** Q2

### Q9. Azure DevOps num site público
- **Tipo:** Recurso técnico + Regra de negócio
- **Pergunta:** Como lidar com o token do Azure DevOps?
- **Resposta recomendada:** PAT do visitante, guardado no browser, com chamadas diretas.
- **Decisão:** Igual ao location-overview (PAT do visitante no navegador). A tela de configuração informa os escopos mínimos e recomenda um token só de leitura (Work Items: Read, Project and Team: Read; ajustar aos endpoints realmente usados).
- **Depende de:** Q8

### Q10. Vínculo Projeto ↔ Azure
- **Tipo:** Regra de negócio
- **Pergunta:** Como o Projeto local se liga ao Azure?
- **Resposta recomendada:** Vínculo opcional + aliases.
- **Decisão:** Projeto { azureProject?, azureTeam?, aliases[] }. Sprints importáveis das iterações do time ou cadastradas à mão.
- **Depende de:** Q3, Q9
- **Revisado:** O vínculo com o Azure volta a ser por Squad (aliases), como no location-overview. Motivo: revisão de Q2.

### Q11. Rotas
- **Tipo:** Recurso técnico
- **Pergunta:** Como organizar as rotas e a navegação?
- **Resposta recomendada:** Hub /projects + subrotas.
- **Decisão:** Hub com abas: /projects (visão geral), /projects/[id], /projects/alocacoes, /projects/pessoas, /projects/skills, /projects/niveis, /projects/sprints, /projects/azure. A NavBar não muda.
- **Depende de:** Q1
- **Revisado:** A ser rediscutido: rotas de cada app (ver Q14).

### Q12. Estratégia de porte
- **Tipo:** Recurso técnico
- **Pergunta:** Como portar o código do location-overview?
- **Resposta recomendada:** Copiar a camada lib/ com os testes e adaptar a UI ao padrão do portfólio.
- **Decisão:** Como recomendado. Trazer lib/ (storage, cálculos, Azure) com Squad → Projeto, e reescrever os componentes com i18n, story e teste. Átomos novos: Button, Input, Select, Modal, DataTable (TanStack).
- **Depende de:** Q8

### Q13. Seed de pessoas
- **Tipo:** Regra de negócio
- **Pergunta:** Quem aparece na seed pública?
- **Resposta recomendada:** Você + pessoas fictícias.
- **Decisão:** Você (Sthiven, com suas skills reais) + 3 ou 4 pessoas fictícias marcadas como exemplo. Nenhum dado real de terceiros.
- **Depende de:** Q4

### Q14. Skills compartilhadas entre apps
- **Tipo:** Regra de negócio
- **Pergunta:** As skills e as pessoas são compartilhadas entre o Skills Template e o Location Overview?
- **Resposta recomendada:** Compartilhado.
- **Decisão:** Um único catálogo de skills e um único cadastro de Pessoas. O Skills Template edita e exibe o perfil, e o Location Overview usa esse perfil na cobertura por squad.
- **Depende de:** Q1 (revisado), Q5

### Q15. Overview de skills (revisão de Q6)
- **Tipo:** Regra de negócio
- **Pergunta:** Onde aparece a cobertura de skills, agora que o Squad voltou?
- **Resposta recomendada:** O squad declara as skills requeridas, e os cards de projeto mostram as skills usadas como tags.
- **Decisão:** Como recomendado. Cobertura por squad e sprint com a regra de Q7. Os cards da vitrine mostram tags hard e soft.
- **Depende de:** Q2 (revisado), Q7, Q14

### Q16. Rotas dos apps (revisão de Q11)
- **Tipo:** Recurso técnico
- **Pergunta:** Como organizar as rotas dos apps internos?
- **Resposta recomendada:** /projects/<app>/...
- **Decisão:** /projects (vitrine), /projects/location-overview/{squads, alocacoes, pessoas, niveis, sprints, azure, dashboard} e /projects/skills-template. Os apps internos têm uma sidebar própria dentro do layout do portfólio. Projetos externos abrem em nova aba.
- **Depende de:** Q1 (revisado)

### Q17. Visibilidade do Skills Template
- **Tipo:** Regra de negócio
- **Pergunta:** O Skills Template é público ou mostra só o perfil do Sthiven?
- **Resposta recomendada:** —
- **Decisão:** Público. Cada visitante monta o próprio perfil, e o perfil do Sthiven vem como padrão (seed).
- **Depende de:** Q4, Q14

### Q18. Projeto Fichas de RPG
- **Tipo:** Regra de negócio
- **Pergunta:** Qual é a URL externa das Fichas de RPG?
- **Resposta recomendada:** —
- **Decisão:** O site não existe. Fica como projeto fictício na vitrine, sem link ativo (card marcado como "em breve"/exemplo).
- **Depende de:** Q1 (revisado)

### Q19. Escopos do PAT
- **Tipo:** Recurso técnico
- **Pergunta:** Quais escopos o PAT precisa?
- **Resposta recomendada:** Levantar no porte, a partir dos endpoints de `lib/azure/api.ts`.
- **Decisão:** OK. Definir durante o porte, sempre só leitura.
- **Depende de:** Q9

## Índice: Regras de negócio
- /projects é uma vitrine de apps: internos (Location Overview, Skills Template), externos (Fichas de RPG) e os antigos com link para o GitHub (Q1 revisado)
- Location Overview mantém Squads. Alocação = Pessoa × Squad × Sprint × %, com no máximo 100% por pessoa por sprint (Q2 revisado, Q3)
- Skills: catálogo { nome, hard|soft, categoria? } e proficiência de 1 a 5 (Q5)
- Pessoas e skills compartilhadas entre os apps. O Skills Template edita e exibe o perfil (Q14)
- O squad declara skills requeridas. Cobertura por sprint pelo maior nível: coberta, parcial ou gap (Q7, Q15)
- Os cards da vitrine mostram tags de hard e soft skills (Q15)
- Escopo do Location Overview: núcleo + backup JSON + gráficos + Azure. Sem import de xlsx (Q8)
- Azure: PAT do visitante, só leitura, com os escopos explicados. Vínculo por squad via aliases (Q9, Q10 revisado)
- Seed: Sthiven + 3 ou 4 pessoas fictícias (Q13)
- Skills Template público: cada visitante monta o próprio perfil, com o do Sthiven como padrão (Q17)
- Fichas de RPG: card fictício, sem link ativo (Q18)

## Índice: Recursos técnicos
- localStorage com seed e botão de reset, sem backend (Q4)
- Token Azure no localStorage, com fetch direto do browser (Q9)
- Rotas /projects/<app>/..., com sidebar por app (Q16)
- Portar lib/ com os testes e reescrever a UI com i18n, stories e testes. Átomos novos: Button, Input, Select, Modal, DataTable (Q12)
- ECharts carregado só nas rotas dos apps (Q8)

## Perguntas em aberto
- Nenhuma. Os escopos do PAT serão definidos durante o porte (Q19).
