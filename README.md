# DesafioIOA

Repositório destinado à solução proposta pela equipe V12 à IOA.

## Protótipo web — IOA | ITC São Luís (Maranhão)

Protótipo navegável em **HTML5, CSS3 e JavaScript puro** (sem frameworks, backend ou banco de dados) com três frentes comerciais: **Cursos**, **Serviços** e **Espaços**.

## Como executar

### Opção 1 — Docker (recomendado)

Requer apenas o [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Compose). Nada mais precisa ser instalado na máquina.

```bash
git clone https://github.com/AnaBacelar27/DesafioIOA.git
cd DesafioIOA
docker compose up -d --build
```

Acesse http://localhost:8080. Comandos úteis:

| Ação | Comando |
|---|---|
| Ver se está rodando | `docker compose ps` |
| Ver logs | `docker compose logs -f site` |
| Parar | `docker compose down` |
| Atualizar após `git pull` | `docker compose up -d --build` |
| Modo desenvolvimento (edita e recarrega, sem rebuild) | `docker compose --profile dev up dev` → http://localhost:8081 |

A imagem usa `nginx:1.27-alpine` (versão fixa) e copia apenas os arquivos do site, então todos rodam exatamente o mesmo ambiente. Se a porta 8080 estiver ocupada, troque `"8080:80"` em `docker-compose.yml`.

### Opção 2 — Sem Docker

Não há etapa de build. Abra `index.html` direto no navegador ou sirva a pasta:

```bash
python3 -m http.server 8080
```

Em ambos os casos a internet só é necessária para a fonte Quicksand (Google Fonts), o mapa do Google e os links externos.

## Estrutura

```text
DesafioIOA/
├── Dockerfile                 Imagem Nginx com o site
├── docker-compose.yml         Serviços site (8080) e dev (8081)
├── docker/nginx.conf          Configuração do servidor
├── index.html                 Início (landing page)
├── pages/
│   ├── cursos.html            Catálogo: busca, filtros, ordenação
│   ├── curso-detalhes.html    ?id=<curso> — página individual + inscrição
│   ├── servicos.html          Catálogo, tabela de preços, fluxo de triagem
│   ├── servico-detalhes.html  ?id=<serviço> — detalhe + agendamento
│   ├── espacos.html           Infraestrutura, galeria, catálogo de salas
│   ├── sala-detalhes.html     ?id=<sala> — galeria, recursos, valores, reserva
│   ├── sobre.html             Rede IOA e unidade São Luís
│   └── contato.html           Canais, formulário, mapa, redes
├── css/
│   ├── global.css             Tokens (cores, tipografia, espaçamento), base
│   ├── components.css         Botões, navbar, cards, lotação, modal, lightbox, formulários, footer
│   ├── pages.css              Layouts específicos de cada página
│   └── responsive.css         Breakpoints 1200 / 1024 / 720 / 400 px
├── js/
│   ├── data.js                Dados e configuração (substituível por API)
│   ├── main.js                Núcleo: ícones, API simulada, header/footer, cards, modal, lightbox, toast, home
│   ├── forms.js               Validação, formulário de reserva e de contato
│   ├── cursos.js              Catálogo, filtros, página do curso, inscrição em 3 etapas
│   ├── servicos.js            Catálogo, detalhe, agendamento via Google Agenda
│   └── espacos.js             Galeria, catálogo e página das salas
└── assets/
    ├── images/                Fotografias oficiais (site redeioa.com.br)
    ├── logos/                 Logomarcas extraídas do manual oficial (cor e versão branca)
    └── icons/                 Favicon oficial
```

## Identidade visual aplicada

| Elemento | Origem |
|---|---|
| Logomarcas IOA \| ITC, IOA e ITC "São Luís – MA" | Manual de marca (PDF do Google Drive) — extraídas em vetor/alta resolução, sem redesenho |
| Grafite `#2B2B2A` | Fundo das versões negativas no manual |
| Dourado `#A7832E` / `#C7A24C` | Cores primárias do site redeioa.com.br |
| Areia `#E3D8C1`, marfim `#F9F7F3` | Tons de apoio do site oficial |
| Verde ITC `#389D5A → #307A4B` | Símbolo ITC (uso restrito a elementos de saúde/ITC) |
| Tipografia Quicksand | Fonte do site oficial redeioa.com.br |
| Recorte curvo da foto + linhas finas douradas | Banner oficial da unidade São Luís |

**Limitação:** o manual recebido contém **apenas as versões da logomarca** (13 páginas). Ele não especifica paleta, tipografia, áreas de proteção nem padrões gráficos — esses itens foram derivados do site oficial e precisam de validação da marca.

## Funcionalidades implementadas

- Navbar sticky com estado de rolagem, link ativo e menu mobile (hambúrguer, Esc fecha, trava de rolagem).
- Header e footer como componentes compartilhados (injetados por `main.js`).
- **Cursos:** busca com tolerância a acentos, filtro por categoria (chips), modalidade, período (mês), faixa de preço e disponibilidade; ordenação; contador de resultados; estado vazio; filtros refletidos na URL.
- **Lotação dinâmica:** barra calculada por `preenchidas / capacidade` com as 5 faixas da SPEC (configuráveis em `data.js → config.lotacao.faixas`), além dos estados "encerradas" e "em breve".
- **Página do curso:** apresentação, indicadores, descrição, aprendizado, ementa em accordion, docente, materiais, certificação, caixa de inscrição fixa (barra inferior no mobile), cursos relacionados.
- **Inscrição simulada** em 3 etapas (dados → pagamento → confirmação), com validação e protocolo de demonstração. Nenhum pagamento é processado e a lotação não muda.
- **Serviços (Seja um paciente):** tratamentos odontológicos filtráveis por especialidade, tipos de preço (gratuito, a partir de, por sessão, sob orçamento), tabela de preços, página de detalhe e modal de triagem que abre o **Google Agenda** em nova aba.
- **Espaços:** galeria com lightbox (teclado, setas, swipe), catálogo de salas, página de sala com galeria, recursos, tabela de valores e reserva.
- **Reserva:** campos obrigatórios, e-mail/telefone (máscara), data não pode ser passada nem domingo, término posterior ao início, horário dentro do funcionamento oficial, participantes ≤ capacidade; resumo com valor estimado. Disponibilidade nunca é confirmada.
- **Contato:** formulário validado com confirmação simulada, mapa oficial, WhatsApp, telefone e redes da Rede IOA.
- Acessibilidade básica: link "pular para o conteúdo", foco visível, `aria-*` em menu, accordion, barra de progresso e modais (focus trap), `prefers-reduced-motion`.

## Dados que precisam ser substituídos por informações oficiais

Tudo o que estiver marcado no site com o selo **"Demo" / "Demonstrativo"**:

1. **Cursos** (`js/data.js → cursos`): 9 cursos demonstrativos, todos da área da saúde (odontologia), com categorias por especialidade (Anatomia, HOF, Endodontia, Implantodontia, Periodontia, Dentística, Ortodontia, Odontopediatria). Datas, horários, cargas horárias, preços, vagas, ementas, materiais e certificação são fictícios.
2. **Docentes** (`professores`): os 6 perfis são **fictícios** (sem foto, com iniciais). Substituir por nome, currículo, fotografia autorizada e LinkedIn reais.
3. **Serviços / Seja um paciente** (`servicos`): 8 tratamentos odontológicos voltados à captação de pacientes-modelo para as aulas práticas (avaliação, periodontia, dentística, endodontia, implantes, ortodontia, HOF, odontopediatria). Valores, condições e modelo de atendimento supervisionado precisam ser confirmados.
4. **Salas** (`salas`): capacidade, metragem, equipamentos, recursos e preços. Apenas o Laboratório ITC e a Clínica IOA têm fotografia oficial; as demais aparecem como "foto pendente".
5. **Link do Google Agenda:** preencher `config.agenda.urlPadrao` ou `agendaUrl` de cada serviço com a página de agendamento oficial. Sem isso, o protótipo abre um evento-modelo do Google Agenda (demonstração).
6. **Conteúdo institucional** (página Sobre): história, números e parcerias da Rede IOA (marcados como "pendente" — nada foi inventado).
7. **Textos legais:** condições de inscrição, política de privacidade e termos.
8. **Fotografias:** apenas 3 fotos oficiais estavam disponíveis publicamente (fachada, clínica, laboratório), em baixa resolução (~720 px). Recomenda-se um banco de imagens em alta da unidade, docentes e alunos.

**Dados oficiais já utilizados** (fonte: página da unidade em redeioa.com.br): endereço, telefone, link do WhatsApp, horários de atendimento, mapa e redes sociais da Rede IOA.

## Limitações de integração

- Não há backend: inscrições, reservas e mensagens são **simuladas** no navegador e nada é armazenado ou enviado.
- Não há gateway de pagamento: `config.pagamento` está preparado para receber gateway/checkout.
- A agenda não é consultada: o protótipo não verifica conflitos de horário.
- A lotação é estática (dados de exemplo).

## Preparação para evolução

Todas as páginas consomem dados via `IOA.api` (em `main.js`), que retorna *Promises* — basta trocar a implementação por `fetch()` para uma API real (painel administrativo, cadastro de cursos, controle de lotação, gestão de reservas, integração com Google Calendar etc.).
