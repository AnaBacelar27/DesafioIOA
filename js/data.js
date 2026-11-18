/* ==========================================================================
   IOA | ITC São Luís — Camada de dados do protótipo
   --------------------------------------------------------------------------
   Todos os registros abaixo são DEMONSTRATIVOS (flag `demo: true`), exceto os
   marcados como `oficial`. Substitua por dados reais ou conecte a uma API —
   o acesso das páginas passa por `IOA.api` (js/main.js), que retorna Promises.
   ========================================================================== */

window.IOA_DATA = (function () {
  "use strict";

  /* ------------------------------------------------------------------
     Configuração geral (editável)
     ------------------------------------------------------------------ */
  const config = {
    unidade: {
      nome: "IOA | ITC São Luís",
      nomeCompleto: "Instituto Orofacial das Américas | Instituto de Treinamento em Cadáveres — São Luís/MA",
      // Fonte: redeioa.com.br/unidades/nordeste/s-o-luis-ioa-itc.html (oficial)
      endereco: "R. Carutapera, 5 – Jardim Renascença",
      cidade: "São Luís – MA",
      cep: "65075-670",
      telefone: "(98) 9 9144-1868",
      telefoneHref: "tel:+5598991441868",
      whatsapp:
        "https://api.whatsapp.com/send?phone=559891441868&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20cursos%20que%20vi%20no%20site!",
      horarios: [
        { dias: "Segunda a sexta", horas: "08:00 às 18:00" },
        { dias: "Sábados", horas: "08:00 às 13:00" }
      ],
      // Horário de funcionamento usado na validação de reservas (0 = domingo)
      funcionamento: {
        1: ["08:00", "18:00"],
        2: ["08:00", "18:00"],
        3: ["08:00", "18:00"],
        4: ["08:00", "18:00"],
        5: ["08:00", "18:00"],
        6: ["08:00", "13:00"]
      },
      mapaEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.0192250774808!2d-44.28592722527221!3d-2.5005504974780393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f68d3034f8c251%3A0x4e011bddd727af08!2zSU9BIElUQyBTw6NvIEx1w61z!5e0!3m2!1spt-BR!2sbr!4v1725907490504!5m2!1spt-BR!2sbr",
      mapaLink: "https://www.google.com/maps/search/?api=1&query=IOA+ITC+S%C3%A3o+Lu%C3%ADs+R.+Carutapera+5",
      redes: [
        { nome: "Instagram", url: "https://www.instagram.com/redeioa", icone: "instagram" },
        { nome: "LinkedIn", url: "https://www.linkedin.com/company/redeioaoficial/", icone: "linkedin" },
        { nome: "YouTube", url: "https://www.youtube.com/@redeioa", icone: "youtube" },
        { nome: "TikTok", url: "https://www.tiktok.com/@redeioa", icone: "tiktok" }
      ],
      siteRede: "https://redeioa.com.br/",
      paginaUnidade: "https://redeioa.com.br/unidades/nordeste/s-o-luis-ioa-itc.html"
    },

    /* Faixas de lotação — limites superiores em % (configuráveis) */
    lotacao: {
      faixas: [
        { ate: 30, chave: "open", rotulo: "Inscrições em andamento" },
        { ate: 70, chave: "filling", rotulo: "Vagas sendo preenchidas" },
        { ate: 90, chave: "last", rotulo: "Últimas vagas" },
        { ate: 99.99, chave: "almost", rotulo: "Quase esgotado" },
        { ate: 100, chave: "sold", rotulo: "Esgotado" }
      ]
    },

    /* Agendamento de triagem (Google Agenda)
       - Se o serviço tiver `agendaUrl`, ela é usada (ex.: página de agendamento
         do Google Agenda: https://calendar.app.google/XXXX).
       - Senão, usa `agenda.urlPadrao`.
       - Se ambas estiverem vazias, o protótipo gera um link de evento-modelo do
         Google Agenda (demonstração). */
    agenda: {
      urlPadrao: "",
      duracaoTriagemMin: 30
    },

    /* Pagamento — placeholder para futura integração com gateway */
    pagamento: {
      gateway: null, // ex.: "pagarme" | "mercadopago" | "stripe"
      checkoutUrl: null,
      jurosParcelamento: 0 // demonstrativo: parcelamento sem juros
    },

    // Especialidades da área da saúde (alinhadas ao portfólio da Rede IOA)
    categorias: [
      "Anatomia",
      "Harmonização Orofacial",
      "Endodontia",
      "Implantodontia",
      "Periodontia",
      "Dentística",
      "Ortodontia",
      "Odontopediatria"
    ],
    modalidades: ["Presencial", "Híbrido"]
  };

  /* ------------------------------------------------------------------
     Docentes — PERFIS FICTÍCIOS (não representam integrantes reais)
     ------------------------------------------------------------------ */
  const professores = [
    {
      "id": "docente-anatomia",
      "demo": true,
      "nome": "Rafael Montenegro Sá",
      "iniciais": "RS",
      "titulo": "Docente demonstrativo — Anatomia",
      "formacao": "Mestrado em Ciências Morfológicas (exemplo)",
      "especializacoes": [
        "Anatomia de cabeça e pescoço",
        "Cirurgia bucomaxilofacial"
      ],
      "experiencia": "Trajetória fictícia em ensino de anatomia aplicada e treinamentos práticos em laboratório.",
      "bio": "Perfil criado apenas para demonstrar a seção de docentes. Substituir por currículo oficial, fotografia autorizada e links reais.",
      "linkedin": ""
    },
    {
      "id": "docente-hof",
      "demo": true,
      "nome": "Camila Ribeiro Duarte",
      "iniciais": "CD",
      "titulo": "Docente demonstrativa — Harmonização Orofacial",
      "formacao": "Especialização em Harmonização Orofacial (exemplo)",
      "especializacoes": [
        "Toxina botulínica",
        "Preenchedores faciais"
      ],
      "experiencia": "Atuação clínica fictícia e condução de turmas práticas supervisionadas.",
      "bio": "Perfil criado apenas para demonstrar a seção de docentes. Substituir por currículo oficial, fotografia autorizada e links reais.",
      "linkedin": ""
    },
    {
      "id": "docente-implanto",
      "demo": true,
      "nome": "Lucas Pereira Castelo",
      "iniciais": "LC",
      "titulo": "Docente demonstrativo — Implantodontia",
      "formacao": "Mestrado em Implantodontia (exemplo)",
      "especializacoes": [
        "Cirurgia guiada",
        "Reabilitação oral"
      ],
      "experiencia": "Trajetória fictícia em cirurgia de implantes e reabilitação.",
      "bio": "Perfil criado apenas para demonstrar a seção de docentes. Substituir por currículo oficial, fotografia autorizada e links reais.",
      "linkedin": ""
    },
    {
      "id": "docente-endo",
      "demo": true,
      "nome": "Marina Albuquerque Lima",
      "iniciais": "ML",
      "titulo": "Docente demonstrativa — Endodontia",
      "formacao": "Doutorado em Endodontia (exemplo)",
      "especializacoes": [
        "Endodontia mecanizada",
        "Retratamento endodôntico"
      ],
      "experiencia": "Experiência fictícia em clínica e docência em Endodontia.",
      "bio": "Perfil criado apenas para demonstrar a seção de docentes. Substituir por currículo oficial, fotografia autorizada e links reais.",
      "linkedin": ""
    },
    {
      "id": "docente-perio",
      "demo": true,
      "nome": "Eduardo Furtado Neves",
      "iniciais": "EN",
      "titulo": "Docente demonstrativo — Periodontia e Dentística",
      "formacao": "Mestrado em Periodontia (exemplo)",
      "especializacoes": [
        "Cirurgia plástica periodontal",
        "Dentística estética"
      ],
      "experiencia": "Atuação fictícia em periodontia clínica e estética do sorriso.",
      "bio": "Perfil criado apenas para demonstrar a seção de docentes. Substituir por currículo oficial, fotografia autorizada e links reais.",
      "linkedin": ""
    },
    {
      "id": "docente-orto",
      "demo": true,
      "nome": "Juliana Costa Viana",
      "iniciais": "JV",
      "titulo": "Docente demonstrativa — Ortodontia e Odontopediatria",
      "formacao": "Especialização em Ortodontia (exemplo)",
      "especializacoes": [
        "Ortodontia corretiva",
        "Ortopedia funcional",
        "Odontopediatria"
      ],
      "experiencia": "Trajetória fictícia em atendimento ortodôntico de crianças e adultos.",
      "bio": "Perfil criado apenas para demonstrar a seção de docentes. Substituir por currículo oficial, fotografia autorizada e links reais.",
      "linkedin": ""
    }
  ];

  /* ------------------------------------------------------------------
     Imagens
     ------------------------------------------------------------------ */
  const IMG = {
    fachada: { src: "assets/images/fachada-ioa-itc-sao-luis.jpg", alt: "Fachada iluminada do IOA | ITC São Luís", oficial: true },
    clinica: { src: "assets/images/clinica-ioa-sao-luis.jpg", alt: "Clínica do IOA São Luís com cadeiras odontológicas", oficial: true },
    laboratorio: { src: "assets/images/laboratorio-itc-sao-luis.jpg", alt: "Laboratório do ITC São Luís com mesas em aço inox e focos cirúrgicos", oficial: true },
    banner: { src: "assets/images/banner-oficial-sao-luis.jpg", alt: "Banner institucional IOA | ITC São Luís", oficial: true }
  };

  /* ------------------------------------------------------------------
     Cursos — DEMONSTRATIVOS (área da saúde / odontologia)
     `vagas` e `preco` são simulados e não representam disponibilidade real.
     ------------------------------------------------------------------ */
  const cursos = [
    {
      "id": "anatomia-da-face-dissecacao",
      "destaque": true,
      "titulo": "Anatomia da Face com Dissecação",
      "categoria": "Anatomia",
      "modalidade": "Presencial",
      "cargaHoraria": 40,
      "dataInicio": "2027-01-22",
      "dataFim": "2027-01-24",
      "horario": "Sexta a domingo, 08:00 às 18:00",
      "local": "Laboratório ITC — São Luís",
      "preco": 3200,
      "parcelas": 10,
      "vagas": {
        "capacidade": 20,
        "preenchidas": 17
      },
      "status": "abertas",
      "imagem": IMG.laboratorio,
      "icone": "microscope",
      "resumo": "Imersão prática em anatomia de cabeça e pescoço com estudo em peças anatômicas no laboratório do ITC.",
      "sobre": "Programa intensivo que integra revisão teórica e prática de dissecação, com foco nas estruturas relevantes para procedimentos estéticos, cirúrgicos e reabilitadores da face.",
      "problema": "A segurança de procedimentos na face depende de conhecimento anatômico tridimensional — algo difícil de desenvolver apenas com livros e imagens.",
      "publico": "Cirurgiões-dentistas, médicos e profissionais habilitados que atuam ou pretendem atuar na região orofacial.",
      "prerequisitos": "Graduação na área da saúde com habilitação para procedimentos na face.",
      "conhecimentos": [
        "Planos e camadas da face",
        "Vascularização e inervação",
        "Zonas de risco",
        "Correlação clínica"
      ],
      "aprendizado": [
        "Identificar camadas, planos e compartimentos de gordura da face",
        "Reconhecer trajetos vasculares e nervosos e suas variações",
        "Mapear zonas de risco para procedimentos injetáveis e cirúrgicos",
        "Correlacionar anatomia com indicações clínicas",
        "Planejar procedimentos com maior previsibilidade e segurança"
      ],
      "ementa": [
        {
          "titulo": "Revisão anatômica aplicada",
          "horas": 8,
          "descricao": "Bases teóricas para a prática.",
          "conteudos": [
            "Osteologia facial",
            "Músculos da mímica",
            "Compartimentos de gordura"
          ]
        },
        {
          "titulo": "Vascularização e inervação",
          "horas": 8,
          "descricao": "Estruturas nobres e variações.",
          "conteudos": [
            "Artérias faciais",
            "Drenagem venosa",
            "Nervo facial e trigêmeo"
          ]
        },
        {
          "titulo": "Dissecação guiada",
          "horas": 18,
          "descricao": "Prática em laboratório.",
          "conteudos": [
            "Terço superior",
            "Terço médio",
            "Terço inferior e pescoço"
          ]
        },
        {
          "titulo": "Correlação clínica",
          "horas": 6,
          "descricao": "Discussão de casos.",
          "conteudos": [
            "Zonas de risco",
            "Prevenção de intercorrências",
            "Planejamento"
          ]
        }
      ],
      "professorId": "docente-anatomia",
      "materiais": [
        {
          "nome": "Peças anatômicas",
          "icone": "microscope"
        },
        {
          "nome": "Instrumental de dissecação",
          "icone": "flask"
        },
        {
          "nome": "EPIs completos",
          "icone": "shield-check"
        },
        {
          "nome": "Atlas e apostila",
          "icone": "book-open"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência integral nas atividades práticas.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    },
    {
      "id": "imersao-harmonizacao-orofacial",
      "destaque": true,
      "titulo": "Imersão em Harmonização Orofacial",
      "categoria": "Harmonização Orofacial",
      "modalidade": "Presencial",
      "cargaHoraria": 32,
      "dataInicio": "2027-02-12",
      "dataFim": "2027-02-14",
      "horario": "Sexta a domingo, 08:00 às 17:00",
      "local": "Clínica IOA — São Luís",
      "preco": 4800,
      "parcelas": 12,
      "vagas": {
        "capacidade": 16,
        "preenchidas": 15
      },
      "status": "abertas",
      "imagem": IMG.clinica,
      "icone": "sparkles",
      "resumo": "Treinamento intensivo com fundamentos, planejamento e prática clínica supervisionada em harmonização orofacial.",
      "sobre": "Imersão voltada à construção de raciocínio clínico e técnica em procedimentos de harmonização orofacial, com etapas teóricas e atendimentos supervisionados a pacientes.",
      "problema": "Profissionais precisam de prática supervisionada e protocolos seguros para iniciar ou aprimorar a atuação em HOF.",
      "publico": "Cirurgiões-dentistas habilitados que desejam iniciar ou aprimorar a prática em HOF.",
      "prerequisitos": "Graduação em Odontologia e registro ativo no conselho profissional.",
      "conhecimentos": [
        "Análise facial",
        "Toxina botulínica",
        "Preenchedores",
        "Gestão de intercorrências"
      ],
      "aprendizado": [
        "Realizar análise facial e planejamento individualizado",
        "Aplicar protocolos de toxina botulínica com segurança",
        "Indicar e aplicar preenchedores em regiões selecionadas",
        "Prevenir e manejar intercorrências",
        "Documentar casos com fotografia clínica padronizada"
      ],
      "ementa": [
        {
          "titulo": "Análise e planejamento facial",
          "horas": 6,
          "descricao": "Diagnóstico e indicação.",
          "conteudos": [
            "Proporções faciais",
            "Envelhecimento",
            "Consentimento informado"
          ]
        },
        {
          "titulo": "Toxina botulínica",
          "horas": 10,
          "descricao": "Teoria e prática supervisionada.",
          "conteudos": [
            "Farmacologia",
            "Pontos de aplicação",
            "Atendimentos"
          ]
        },
        {
          "titulo": "Preenchedores",
          "horas": 12,
          "descricao": "Teoria e prática supervisionada.",
          "conteudos": [
            "Tipos de ácido hialurônico",
            "Técnicas de aplicação",
            "Atendimentos"
          ]
        },
        {
          "titulo": "Intercorrências e documentação",
          "horas": 4,
          "descricao": "Segurança do paciente.",
          "conteudos": [
            "Protocolos de emergência",
            "Fotografia clínica",
            "Prontuário"
          ]
        }
      ],
      "professorId": "docente-hof",
      "materiais": [
        {
          "nome": "Consultórios equipados",
          "icone": "stethoscope"
        },
        {
          "nome": "Insumos para prática",
          "icone": "flask"
        },
        {
          "nome": "Fotografia clínica",
          "icone": "camera"
        },
        {
          "nome": "Apostila",
          "icone": "book-open"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência mínima de 90% e participação nos atendimentos.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    },
    {
      "id": "aperfeicoamento-endodontia",
      "destaque": true,
      "titulo": "Aperfeiçoamento em Endodontia Mecanizada",
      "categoria": "Endodontia",
      "modalidade": "Presencial",
      "cargaHoraria": 48,
      "dataInicio": "2026-12-04",
      "dataFim": "2027-02-06",
      "horario": "Um fim de semana por mês, 08:00 às 17:00",
      "local": "Clínica IOA — São Luís",
      "preco": 3900,
      "parcelas": 12,
      "vagas": {
        "capacidade": 20,
        "preenchidas": 12
      },
      "status": "abertas",
      "imagem": null,
      "icone": "shield-check",
      "resumo": "Domine os sistemas mecanizados e conduza tratamentos de canal com mais previsibilidade, com prática clínica em pacientes.",
      "sobre": "Curso de aperfeiçoamento com aulas teóricas, treino em laboratório e atendimento supervisionado de pacientes, abordando diagnóstico, preparo mecanizado, irrigação e obturação.",
      "problema": "O tratamento endodôntico exige técnica refinada e domínio de instrumentos modernos para reduzir falhas e tempo clínico.",
      "publico": "Cirurgiões-dentistas clínicos gerais que desejam aprimorar a prática endodôntica.",
      "prerequisitos": "Graduação em Odontologia e registro ativo no conselho profissional.",
      "conhecimentos": [
        "Diagnóstico pulpar",
        "Instrumentação mecanizada",
        "Irrigação",
        "Obturação"
      ],
      "aprendizado": [
        "Realizar diagnóstico diferencial das alterações pulpares",
        "Planejar o acesso e a exploração dos canais",
        "Utilizar sistemas rotatórios e reciprocantes com segurança",
        "Executar protocolos de irrigação e obturação",
        "Conduzir atendimentos de pacientes sob supervisão"
      ],
      "ementa": [
        {
          "titulo": "Diagnóstico e planejamento",
          "horas": 8,
          "descricao": "Bases clínicas e radiográficas.",
          "conteudos": [
            "Semiologia",
            "Radiografia periapical",
            "Anatomia interna"
          ]
        },
        {
          "titulo": "Instrumentação mecanizada",
          "horas": 16,
          "descricao": "Sistemas e protocolos.",
          "conteudos": [
            "Rotatórios",
            "Reciprocantes",
            "Treino em dentes artificiais"
          ]
        },
        {
          "titulo": "Irrigação e obturação",
          "horas": 8,
          "descricao": "Desinfecção e selamento.",
          "conteudos": [
            "Soluções irrigadoras",
            "Técnicas de obturação"
          ]
        },
        {
          "titulo": "Clínica supervisionada",
          "horas": 16,
          "descricao": "Atendimento de pacientes.",
          "conteudos": [
            "Casos clínicos",
            "Acompanhamento"
          ]
        }
      ],
      "professorId": "docente-endo",
      "materiais": [
        {
          "nome": "Motor endodôntico",
          "icone": "stethoscope"
        },
        {
          "nome": "Limas mecanizadas",
          "icone": "flask"
        },
        {
          "nome": "Localizador apical",
          "icone": "target"
        },
        {
          "nome": "Apostila",
          "icone": "book-open"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência mínima de 75% e casos clínicos concluídos.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    },
    {
      "id": "cirurgia-guiada-implantodontia",
      "destaque": true,
      "titulo": "Cirurgia Guiada em Implantodontia",
      "categoria": "Implantodontia",
      "modalidade": "Presencial",
      "cargaHoraria": 60,
      "dataInicio": "2027-04-24",
      "dataFim": "2027-06-26",
      "horario": "Um fim de semana por mês",
      "local": "Clínica IOA e Laboratório ITC — São Luís",
      "preco": 6900,
      "parcelas": 12,
      "vagas": {
        "capacidade": 12,
        "preenchidas": 4
      },
      "status": "abertas",
      "imagem": IMG.clinica,
      "icone": "stethoscope",
      "resumo": "Planejamento e execução de cirurgias guiadas de implantes, com prática supervisionada em pacientes.",
      "sobre": "Programa modular que combina planejamento cirúrgico, guias e prática supervisionada em pacientes selecionados na triagem da unidade.",
      "problema": "A cirurgia guiada aumenta a previsibilidade, mas exige domínio de planejamento e protocolos específicos.",
      "publico": "Cirurgiões-dentistas com experiência em implantodontia.",
      "prerequisitos": "Graduação em Odontologia e experiência prévia em cirurgia de implantes.",
      "conhecimentos": [
        "Planejamento reverso",
        "Guias cirúrgicos",
        "Protocolos cirúrgicos",
        "Prótese sobre implante"
      ],
      "aprendizado": [
        "Planejar implantes a partir de exames de imagem",
        "Validar guias cirúrgicos",
        "Executar protocolos de cirurgia guiada",
        "Integrar planejamento protético e cirúrgico"
      ],
      "ementa": [
        {
          "titulo": "Diagnóstico e planejamento",
          "horas": 16,
          "descricao": "Exames e planejamento reverso.",
          "conteudos": [
            "Tomografia",
            "Planejamento protético"
          ]
        },
        {
          "titulo": "Guias cirúrgicos",
          "horas": 12,
          "descricao": "Tipos e validação.",
          "conteudos": [
            "Tipos de guia",
            "Validação clínica"
          ]
        },
        {
          "titulo": "Prática supervisionada",
          "horas": 32,
          "descricao": "Atendimento de pacientes.",
          "conteudos": [
            "Cirurgias guiadas",
            "Acompanhamento"
          ]
        }
      ],
      "professorId": "docente-implanto",
      "materiais": [
        {
          "nome": "Kit de cirurgia guiada",
          "icone": "flask"
        },
        {
          "nome": "Motor cirúrgico",
          "icone": "stethoscope"
        },
        {
          "nome": "Exames de imagem",
          "icone": "image"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência mínima de 90% e casos concluídos.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    },
    {
      "id": "imersao-periodontia",
      "destaque": false,
      "titulo": "Imersão em Periodontia e Cirurgia Plástica Periodontal",
      "categoria": "Periodontia",
      "modalidade": "Presencial",
      "cargaHoraria": 24,
      "dataInicio": "2027-03-12",
      "dataFim": "2027-03-14",
      "horario": "Sexta a domingo, 08:00 às 17:00",
      "local": "Clínica IOA — São Luís",
      "preco": 2600,
      "parcelas": 10,
      "vagas": {
        "capacidade": 16,
        "preenchidas": 4
      },
      "status": "abertas",
      "imagem": null,
      "icone": "smile",
      "resumo": "Técnicas de tratamento periodontal e cirurgias plásticas para saúde e estética gengival.",
      "sobre": "Imersão prática com treino em modelos e atendimento supervisionado de pacientes com necessidades periodontais.",
      "problema": "Doenças periodontais são altamente prevalentes e o tratamento adequado exige diagnóstico preciso e técnica cirúrgica.",
      "publico": "Cirurgiões-dentistas que desejam ampliar a atuação em periodontia.",
      "prerequisitos": "Graduação em Odontologia.",
      "conhecimentos": [
        "Diagnóstico periodontal",
        "Raspagem",
        "Recobrimento radicular",
        "Aumento de coroa"
      ],
      "aprendizado": [
        "Classificar as doenças periodontais",
        "Executar raspagem e alisamento radicular",
        "Indicar e realizar recobrimentos radiculares",
        "Planejar aumento de coroa clínica"
      ],
      "ementa": [
        {
          "titulo": "Diagnóstico periodontal",
          "horas": 6,
          "descricao": "Classificação e exame.",
          "conteudos": [
            "Periograma",
            "Classificação atual"
          ]
        },
        {
          "titulo": "Terapia não cirúrgica",
          "horas": 6,
          "descricao": "Controle da doença.",
          "conteudos": [
            "Raspagem",
            "Manutenção"
          ]
        },
        {
          "titulo": "Cirurgia plástica periodontal",
          "horas": 12,
          "descricao": "Treino e clínica.",
          "conteudos": [
            "Recobrimento radicular",
            "Aumento de coroa",
            "Atendimentos"
          ]
        }
      ],
      "professorId": "docente-perio",
      "materiais": [
        {
          "nome": "Instrumental periodontal",
          "icone": "flask"
        },
        {
          "nome": "Microcirurgia",
          "icone": "microscope"
        },
        {
          "nome": "Apostila",
          "icone": "book-open"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência integral.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    },
    {
      "id": "imersao-dentistica-estetica",
      "destaque": false,
      "titulo": "Imersão em Dentística Estética",
      "categoria": "Dentística",
      "modalidade": "Presencial",
      "cargaHoraria": 24,
      "dataInicio": "2027-03-26",
      "dataFim": "2027-03-28",
      "horario": "Sexta a domingo, 08:00 às 17:00",
      "local": "Clínica IOA — São Luís",
      "preco": 2200,
      "parcelas": 10,
      "vagas": {
        "capacidade": 20,
        "preenchidas": 9
      },
      "status": "abertas",
      "imagem": null,
      "icone": "sparkles",
      "resumo": "Restaurações em resina, clareamento e protocolos estéticos com prática em pacientes.",
      "sobre": "Curso prático sobre seleção de cor, estratificação em resina composta, clareamento e acabamento, com atendimentos supervisionados.",
      "problema": "Pacientes buscam resultados estéticos naturais e duradouros, que dependem de técnica e planejamento.",
      "publico": "Cirurgiões-dentistas clínicos gerais.",
      "prerequisitos": "Graduação em Odontologia.",
      "conhecimentos": [
        "Seleção de cor",
        "Estratificação",
        "Clareamento",
        "Acabamento e polimento"
      ],
      "aprendizado": [
        "Selecionar cor e materiais adequados",
        "Realizar restaurações estratificadas",
        "Indicar protocolos de clareamento",
        "Executar acabamento e polimento"
      ],
      "ementa": [
        {
          "titulo": "Planejamento estético",
          "horas": 6,
          "descricao": "Análise do sorriso.",
          "conteudos": [
            "Proporções",
            "Seleção de cor"
          ]
        },
        {
          "titulo": "Restaurações diretas",
          "horas": 12,
          "descricao": "Treino e clínica.",
          "conteudos": [
            "Estratificação",
            "Dentes anteriores e posteriores"
          ]
        },
        {
          "titulo": "Clareamento e acabamento",
          "horas": 6,
          "descricao": "Protocolos.",
          "conteudos": [
            "Clareamento",
            "Polimento"
          ]
        }
      ],
      "professorId": "docente-perio",
      "materiais": [
        {
          "nome": "Resinas compostas",
          "icone": "flask"
        },
        {
          "nome": "Fotopolimerizador",
          "icone": "sparkles"
        },
        {
          "nome": "Fotografia clínica",
          "icone": "camera"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência integral.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    },
    {
      "id": "aperfeicoamento-ortodontia",
      "destaque": false,
      "titulo": "Aperfeiçoamento em Ortodontia",
      "categoria": "Ortodontia",
      "modalidade": "Presencial",
      "cargaHoraria": 120,
      "dataInicio": "2027-02-26",
      "dataFim": "2027-12-10",
      "horario": "Mensal, sexta e sábado",
      "local": "Clínica IOA — São Luís",
      "preco": 9600,
      "parcelas": 12,
      "vagas": {
        "capacidade": 24,
        "preenchidas": 24
      },
      "status": "abertas",
      "imagem": null,
      "icone": "smile",
      "resumo": "Formação clínica em ortodontia corretiva com atendimento mensal de pacientes.",
      "sobre": "Programa de longa duração com diagnóstico, planejamento, instalação de aparelhos e manutenções supervisionadas em pacientes.",
      "problema": "O tratamento ortodôntico exige acompanhamento contínuo e domínio de diagnóstico e biomecânica.",
      "publico": "Cirurgiões-dentistas que desejam atuar em ortodontia.",
      "prerequisitos": "Graduação em Odontologia.",
      "conhecimentos": [
        "Cefalometria",
        "Biomecânica",
        "Montagem de aparelhos",
        "Manutenções"
      ],
      "aprendizado": [
        "Realizar documentação e diagnóstico ortodôntico",
        "Planejar tratamentos corretivos",
        "Instalar e manter aparelhos fixos",
        "Acompanhar pacientes ao longo do tratamento"
      ],
      "ementa": [
        {
          "titulo": "Diagnóstico ortodôntico",
          "horas": 24,
          "descricao": "Documentação e análise.",
          "conteudos": [
            "Cefalometria",
            "Análise de modelos"
          ]
        },
        {
          "titulo": "Biomecânica",
          "horas": 32,
          "descricao": "Fundamentos.",
          "conteudos": [
            "Forças",
            "Fios e braquetes"
          ]
        },
        {
          "titulo": "Clínica supervisionada",
          "horas": 64,
          "descricao": "Atendimento mensal.",
          "conteudos": [
            "Instalação",
            "Manutenções"
          ]
        }
      ],
      "professorId": "docente-orto",
      "materiais": [
        {
          "nome": "Braquetes e fios",
          "icone": "flask"
        },
        {
          "nome": "Alicates ortodônticos",
          "icone": "stethoscope"
        },
        {
          "nome": "Documentação",
          "icone": "file-text"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência mínima de 75% e casos acompanhados.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    },
    {
      "id": "odontopediatria-clinica",
      "destaque": false,
      "titulo": "Odontopediatria Clínica",
      "categoria": "Odontopediatria",
      "modalidade": "Presencial",
      "cargaHoraria": 32,
      "dataInicio": "2027-05-14",
      "dataFim": "2027-06-12",
      "horario": "Sextas e sábados",
      "local": "Clínica IOA — São Luís",
      "preco": 2800,
      "parcelas": 10,
      "vagas": {
        "capacidade": 20,
        "preenchidas": 0
      },
      "status": "em-breve",
      "imagem": null,
      "icone": "users",
      "resumo": "Manejo comportamental, prevenção e tratamento odontológico de crianças.",
      "sobre": "Curso com fundamentos de odontopediatria e atendimento supervisionado de pacientes infantis.",
      "problema": "O atendimento infantil exige técnicas específicas de manejo e abordagem preventiva.",
      "publico": "Cirurgiões-dentistas que atendem ou desejam atender crianças.",
      "prerequisitos": "Graduação em Odontologia.",
      "conhecimentos": [
        "Manejo comportamental",
        "Prevenção",
        "Dentística infantil",
        "Traumatismos"
      ],
      "aprendizado": [
        "Aplicar técnicas de manejo comportamental",
        "Planejar programas preventivos",
        "Tratar cáries em dentes decíduos",
        "Conduzir urgências e traumatismos"
      ],
      "ementa": [
        {
          "titulo": "Fundamentos e manejo",
          "horas": 8,
          "descricao": "Abordagem da criança.",
          "conteudos": [
            "Desenvolvimento infantil",
            "Manejo comportamental"
          ]
        },
        {
          "titulo": "Prevenção e dentística",
          "horas": 12,
          "descricao": "Clínica infantil.",
          "conteudos": [
            "Flúor e selantes",
            "Restaurações"
          ]
        },
        {
          "titulo": "Clínica supervisionada",
          "horas": 12,
          "descricao": "Atendimentos.",
          "conteudos": [
            "Casos clínicos"
          ]
        }
      ],
      "professorId": "docente-orto",
      "materiais": [
        {
          "nome": "Consultórios equipados",
          "icone": "stethoscope"
        },
        {
          "nome": "Materiais preventivos",
          "icone": "shield-check"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência mínima de 75%.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    },
    {
      "id": "fotografia-clinica-odontologica",
      "destaque": false,
      "titulo": "Fotografia Clínica Odontológica",
      "categoria": "Dentística",
      "modalidade": "Presencial",
      "cargaHoraria": 16,
      "dataInicio": "2026-10-17",
      "dataFim": "2026-10-18",
      "horario": "Sábado e domingo, 08:00 às 17:00",
      "local": "Clínica IOA — São Luís",
      "preco": 980,
      "parcelas": 6,
      "vagas": {
        "capacidade": 18,
        "preenchidas": 14
      },
      "status": "encerradas",
      "imagem": null,
      "icone": "camera",
      "resumo": "Protocolos de fotografia intra e extraoral para documentação clínica e planejamento.",
      "sobre": "Curso prático de equipamento, iluminação e protocolos fotográficos para documentação clínica padronizada.",
      "problema": "Documentação fotográfica inconsistente prejudica o planejamento e o registro clínico.",
      "publico": "Cirurgiões-dentistas e equipes clínicas.",
      "prerequisitos": "Não há. Recomenda-se trazer câmera própria.",
      "conhecimentos": [
        "Configuração de câmera",
        "Iluminação",
        "Protocolos clínicos"
      ],
      "aprendizado": [
        "Configurar câmera e flash para fotografia clínica",
        "Executar protocolos fotográficos padronizados",
        "Organizar imagens para documentação"
      ],
      "ementa": [
        {
          "titulo": "Equipamento e configurações",
          "horas": 6,
          "descricao": "Câmera, lentes e flashes.",
          "conteudos": [
            "Exposição",
            "Macro",
            "Flash"
          ]
        },
        {
          "titulo": "Protocolos clínicos",
          "horas": 10,
          "descricao": "Prática em duplas.",
          "conteudos": [
            "Extraoral",
            "Intraoral"
          ]
        }
      ],
      "professorId": "docente-perio",
      "materiais": [
        {
          "nome": "Câmera fotográfica",
          "icone": "camera"
        },
        {
          "nome": "Afastadores e espelhos",
          "icone": "flask"
        }
      ],
      "certificacao": {
        "oferece": true,
        "criterios": "Frequência integral.",
        "emissor": "IOA | ITC São Luís (a confirmar)"
      },
      "demo": true
    }
  ];

  /* ------------------------------------------------------------------
     Serviços — ATENDIMENTO ODONTOLÓGICO PARA PACIENTES (DEMONSTRATIVO)
     Foco: captar pacientes-modelo para as atividades clínicas
     supervisionadas dos cursos. Valores e condições a confirmar.
     tipoPreco: "gratuito" | "fixo" | "inicial" | "sessao" | "orcamento"
     ------------------------------------------------------------------ */
  const servicos = [
    {
      id: "avaliacao-odontologica",
      demo: true,
      nome: "Avaliação Odontológica Inicial",
      categoria: "Avaliação",
      icone: "smile",
      resumo: "Primeiro passo para ser paciente: avaliação da saúde bucal e indicação do tratamento e do curso adequados.",
      descricao: "Na triagem, a equipe avalia sua saúde bucal, registra suas necessidades e verifica se o seu caso se encaixa nas turmas práticas em andamento. Os atendimentos são realizados por cirurgiões-dentistas em formação, sob supervisão de professores.",
      beneficios: ["Diagnóstico da sua saúde bucal", "Indicação do tratamento adequado", "Encaminhamento para a turma prática compatível"],
      incluso: ["Exame clínico", "Orientações de saúde bucal", "Indicação de plano de tratamento"],
      prazo: "Cerca de 30 minutos",
      publico: "Adultos e crianças (acompanhadas)",
      especialidade: "Clínica geral",
      tipoPreco: "gratuito",
      preco: 0,
      agendaUrl: "",
      etapas: ["Agende a triagem", "Avaliação clínica", "Indicação de tratamento", "Convite para a turma prática"]
    },
    {
      id: "limpeza-periodontia",
      demo: true,
      nome: "Limpeza e Tratamento de Gengiva",
      categoria: "Periodontia",
      icone: "sparkles",
      resumo: "Profilaxia, raspagem e tratamento de gengivas inflamadas ou com sangramento.",
      descricao: "Tratamento periodontal realizado nas turmas práticas de Periodontia, com remoção de placa e tártaro, orientação de higiene e acompanhamento.",
      beneficios: ["Gengivas saudáveis", "Prevenção da perda dentária", "Hálito mais fresco"],
      incluso: ["Profilaxia", "Raspagem supra e subgengival (quando indicada)", "Orientação de higiene"],
      prazo: "1 a 4 sessões",
      publico: "Pacientes com sangramento, tártaro ou inflamação gengival",
      especialidade: "Periodontia",
      tipoPreco: "sessao",
      preco: 60,
      agendaUrl: "",
      etapas: ["Triagem", "Avaliação periodontal", "Sessões de tratamento", "Manutenção"]
    },
    {
      id: "restauracoes-esteticas",
      demo: true,
      nome: "Restaurações e Estética Dental",
      categoria: "Dentística",
      icone: "smile",
      resumo: "Tratamento de cáries, troca de restaurações e procedimentos estéticos como clareamento e facetas.",
      descricao: "Atendimento nas turmas de Dentística para restaurar dentes com cárie ou fraturas e melhorar a estética do sorriso, conforme indicação clínica.",
      beneficios: ["Dentes restaurados", "Sorriso mais harmônico", "Materiais de qualidade"],
      incluso: ["Restaurações em resina", "Substituição de restaurações antigas", "Clareamento (quando indicado)"],
      prazo: "Conforme o caso",
      publico: "Pacientes com cáries, restaurações antigas ou desejo estético",
      especialidade: "Dentística",
      tipoPreco: "inicial",
      preco: 80,
      agendaUrl: "",
      etapas: ["Triagem", "Planejamento", "Sessões clínicas", "Revisão"]
    },
    {
      id: "tratamento-canal",
      demo: true,
      nome: "Tratamento de Canal",
      categoria: "Endodontia",
      icone: "shield-check",
      resumo: "Tratamento endodôntico para dentes com dor, infecção ou lesões profundas.",
      descricao: "Atendimento nas turmas de Endodontia, com diagnóstico por imagem e tratamento do canal para preservar o dente natural.",
      beneficios: ["Alívio da dor", "Preservação do dente natural", "Tecnologia de apoio"],
      incluso: ["Radiografias do dente", "Tratamento endodôntico", "Acompanhamento"],
      prazo: "1 a 3 sessões",
      publico: "Pacientes com indicação de tratamento de canal",
      especialidade: "Endodontia",
      tipoPreco: "inicial",
      preco: 250,
      agendaUrl: "",
      etapas: ["Triagem", "Diagnóstico por imagem", "Tratamento", "Restauração final"]
    },
    {
      id: "implantes-dentarios",
      demo: true,
      nome: "Implantes Dentários",
      categoria: "Implantodontia",
      icone: "stethoscope",
      resumo: "Reposição de dentes perdidos com implantes, realizada nas turmas de Implantodontia.",
      descricao: "Pacientes selecionados na triagem podem ser atendidos nas turmas de Implantodontia e Cirurgia Guiada, com planejamento, cirurgia e acompanhamento supervisionados.",
      beneficios: ["Reposição de dentes perdidos", "Mais conforto para mastigar", "Planejamento digital"],
      incluso: ["Avaliação e exames", "Planejamento", "Cirurgia de implante", "Acompanhamento pós-operatório"],
      prazo: "Conforme calendário do curso",
      publico: "Adultos com perda dentária e condições de saúde compatíveis",
      especialidade: "Implantodontia",
      tipoPreco: "orcamento",
      preco: null,
      agendaUrl: "",
      etapas: ["Triagem", "Exames e tomografia", "Planejamento", "Cirurgia e acompanhamento"]
    },
    {
      id: "aparelho-ortodontico",
      demo: true,
      nome: "Aparelho Ortodôntico",
      categoria: "Ortodontia",
      icone: "smile",
      resumo: "Correção do alinhamento dos dentes e da mordida, com acompanhamento mensal.",
      descricao: "Tratamento ortodôntico nas turmas de Ortodontia, com documentação, instalação do aparelho e manutenções periódicas.",
      beneficios: ["Dentes alinhados", "Mordida corrigida", "Acompanhamento contínuo"],
      incluso: ["Documentação ortodôntica", "Instalação do aparelho", "Manutenções mensais"],
      prazo: "Tratamento de longa duração",
      publico: "Adolescentes e adultos",
      especialidade: "Ortodontia",
      tipoPreco: "sessao",
      preco: 90,
      agendaUrl: "",
      etapas: ["Triagem", "Documentação", "Instalação", "Manutenções"]
    },
    {
      id: "harmonizacao-orofacial-pacientes",
      demo: true,
      nome: "Harmonização Orofacial",
      categoria: "Harmonização Orofacial",
      icone: "sparkles",
      resumo: "Procedimentos como toxina botulínica e preenchimento, realizados nas imersões de HOF.",
      descricao: "Pacientes avaliados na triagem podem participar das turmas práticas de Harmonização Orofacial, com análise facial e procedimentos supervisionados.",
      beneficios: ["Avaliação facial individual", "Procedimentos supervisionados", "Profissionais em especialização"],
      incluso: ["Análise facial", "Procedimento indicado", "Retorno de avaliação"],
      prazo: "Datas das imersões",
      publico: "Adultos com indicação para os procedimentos",
      especialidade: "Harmonização Orofacial",
      tipoPreco: "inicial",
      preco: 300,
      agendaUrl: "",
      etapas: ["Triagem", "Análise facial", "Procedimento na imersão", "Retorno"]
    },
    {
      id: "odontopediatria",
      demo: true,
      nome: "Odontopediatria",
      categoria: "Odontopediatria",
      icone: "users",
      resumo: "Atendimento odontológico para crianças, com prevenção e tratamento em ambiente acolhedor.",
      descricao: "Atendimento infantil nas turmas de Odontopediatria, com foco em prevenção, orientação aos pais e tratamento de cáries.",
      beneficios: ["Atendimento adaptado às crianças", "Prevenção desde cedo", "Orientação para a família"],
      incluso: ["Avaliação", "Aplicação de flúor", "Tratamento de cáries"],
      prazo: "Conforme o caso",
      publico: "Crianças acompanhadas pelos responsáveis",
      especialidade: "Odontopediatria",
      tipoPreco: "sessao",
      preco: 50,
      agendaUrl: "",
      etapas: ["Triagem", "Avaliação", "Tratamento", "Retornos preventivos"]
    }
  ];

  /* ------------------------------------------------------------------
     Espaços / salas — DEMONSTRATIVOS
     Capacidade, metragem, recursos e valores precisam ser confirmados.
     ------------------------------------------------------------------ */
  const salas = [
    {
      id: "laboratorio-itc",
      demo: true,
      nome: "Laboratório ITC",
      tipo: "Laboratório de treinamento",
      icone: "microscope",
      resumo: "Ambiente especializado com mesas em aço inox, focos de iluminação e monitores para treinamentos práticos.",
      descricao:
        "O laboratório do ITC é o ambiente de treinamento prático da unidade. A fotografia mostra mesas em aço inox, focos de iluminação articulados e monitores distribuídos pelo espaço. A utilização por terceiros depende de validação técnica e das normas do laboratório.",
      capacidade: 30,
      metragem: null,
      equipamentos: ["Mesas em aço inox", "Focos de iluminação articulados", "Monitores", "Cadeiras"],
      infraestrutura: ["Ar-condicionado", "Wi-Fi", "Apoio técnico"],
      modalidade: ["Período (manhã/tarde)", "Diária"],
      precos: [
        { rotulo: "Período (4h)", valor: null },
        { rotulo: "Diária (8h)", valor: null }
      ],
      precoHora: null,
      precoNota: "Sob consulta",
      fotos: [IMG.laboratorio],
      destaque: true
    },
    {
      id: "clinica-escola",
      demo: true,
      nome: "Clínica IOA",
      tipo: "Clínica para cursos práticos",
      icone: "stethoscope",
      resumo: "Clínica ampla com cadeiras odontológicas e divisórias, preparada para cursos com prática supervisionada.",
      descricao:
        "Ambiente clínico amplo com cadeiras odontológicas organizadas em boxes, monitores e iluminação ambiente. Indicado para cursos e treinamentos com atividade clínica, mediante validação da coordenação.",
      capacidade: 20,
      metragem: null,
      equipamentos: ["Cadeiras odontológicas", "Monitores", "Divisórias entre boxes"],
      infraestrutura: ["Ar-condicionado", "Wi-Fi", "Acessibilidade"],
      modalidade: ["Período (manhã/tarde)", "Diária"],
      precos: [
        { rotulo: "Período (4h)", valor: 1800 },
        { rotulo: "Diária (8h)", valor: 3200 }
      ],
      precoHora: 480,
      precoNota: "",
      fotos: [IMG.clinica],
      destaque: true
    },
    {
      id: "sala-aula-teorica",
      demo: true,
      nome: "Sala de Aula Teórica",
      tipo: "Sala de aula",
      icone: "graduation-cap",
      resumo: "Sala para aulas, palestras e workshops com recursos de apresentação.",
      descricao:
        "Espaço para aulas teóricas, palestras e workshops. Recursos, layout e capacidade devem ser confirmados com a unidade. Fotografias oficiais pendentes.",
      capacidade: 40,
      metragem: 60,
      equipamentos: ["Projetor ou TV", "Mesas e cadeiras", "Quadro branco", "Sistema de som"],
      infraestrutura: ["Ar-condicionado", "Wi-Fi", "Acessibilidade"],
      modalidade: ["Por hora", "Período (manhã/tarde)", "Diária"],
      precos: [
        { rotulo: "Hora", valor: 150 },
        { rotulo: "Período (4h)", valor: 520 },
        { rotulo: "Diária (8h)", valor: 950 }
      ],
      precoHora: 150,
      precoNota: "",
      fotos: [],
      destaque: true
    },
    {
      id: "sala-reuniao",
      demo: true,
      nome: "Sala de Reunião",
      tipo: "Sala de reunião",
      icone: "users",
      resumo: "Ambiente reservado para reuniões, entrevistas e atendimentos executivos.",
      descricao:
        "Sala reservada para reuniões de pequeno porte, entrevistas e apresentações. Recursos de videoconferência a confirmar com a unidade. Fotografias oficiais pendentes.",
      capacidade: 8,
      metragem: 20,
      equipamentos: ["Mesa de reunião", "TV para apresentação", "Videoconferência"],
      infraestrutura: ["Ar-condicionado", "Wi-Fi"],
      modalidade: ["Por hora", "Período (manhã/tarde)"],
      precos: [
        { rotulo: "Hora", valor: 90 },
        { rotulo: "Período (4h)", valor: 320 }
      ],
      precoHora: 90,
      precoNota: "",
      fotos: [],
      destaque: false
    },
    {
      id: "sala-multiuso",
      demo: true,
      nome: "Sala Multiuso",
      tipo: "Eventos e workshops",
      icone: "layers",
      resumo: "Espaço flexível para workshops, eventos corporativos e encontros profissionais.",
      descricao:
        "Ambiente com layout flexível para workshops, lançamentos e encontros profissionais. Capacidade e recursos dependem do formato e devem ser confirmados. Fotografias oficiais pendentes.",
      capacidade: 60,
      metragem: 90,
      equipamentos: ["Projetor", "Sistema de som", "Mesas e cadeiras móveis"],
      infraestrutura: ["Ar-condicionado", "Wi-Fi", "Acessibilidade", "Copa de apoio"],
      modalidade: ["Período (manhã/tarde)", "Diária"],
      precos: [
        { rotulo: "Período (4h)", valor: 780 },
        { rotulo: "Diária (8h)", valor: 1400 }
      ],
      precoHora: 220,
      precoNota: "",
      fotos: [],
      destaque: false
    }
  ];

  const finalidadesReserva = [
    "Curso ou treinamento",
    "Reunião corporativa",
    "Workshop ou palestra",
    "Evento profissional",
    "Atendimento / entrevistas",
    "Outra finalidade"
  ];

  return { config, professores, cursos, servicos, salas, finalidadesReserva, imagens: IMG };
})();
