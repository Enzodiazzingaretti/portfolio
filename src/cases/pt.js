/**
 * Cases em português. Mesmos blocos, na mesma ordem, que es.js: um teste
 * falha se a estrutura se desalinhar entre os idiomas.
 */
export default {
  portfolio: {
    role: "Design e desenvolvimento",
    blocks: [
      {
        type: "text",
        title: "O ponto de partida",
        paragraphs: [
          "Era uma página só, com nove seções empilhadas: sobre mim, web, motion, 3D, flyers, logos, arquitetura, lab e contato, cada uma com seu título gigante. Além disso, rodavam ao mesmo tempo um shader de Three.js em tela cheia, granulado, um cursor próprio, um HUD e dois menus. A rolagem não acabava nunca e o trabalho ficava enterrado.",
          "Fui pelo caminho oposto: um hero animado com Three.js e, a partir dele, acesso direto a cada disciplina.",
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "hero",
            alt: "Home do portfólio: o nome à esquerda e, à direita, uma escultura desenhada com caracteres ASCII.",
          },
        ],
        caption: "O hero: a cena de Three.js reescrita como uma grade de caracteres.",
      },
      {
        type: "decisions",
        title: "Decisões",
        items: [
          {
            title: "Quatro rotas em vez de nove seções",
            text: "A home virou um hero mais um índice de quatro linhas, e cada disciplina ganhou sua URL: `/motion`, `/3d`, `/grafica` e `/web`. Sobre mim e Contato abrem num painel lateral a partir de qualquer categoria.",
            discarded:
              "Um overlay em tela cheia: mais fluido, mas sem links próprios, e num portfólio importa poder mandar alguém direto para `/3d`. Também agrupar o trabalho em três “mundos” conceituais: quem procura flyers não saberia onde olhar.",
          },
          {
            title: "Um só contexto WebGL para o site inteiro",
            text: "O fundo vive no shell, fora das rotas. Ao trocar de categoria ele não é destruído: o loop pausa e a cena escurece via CSS. E se alguém entra direto numa categoria, o three.js nem é baixado até a pessoa passar pela home.",
            discarded:
              "Recriar a cena em cada rota. Era mais simples de escrever, mas a escultura tem uns 46.000 triângulos e o tranco ao voltar para a home era visível.",
          },
          {
            title: "Um filtro ASCII escrito à mão",
            text: "A cena é desenhada num render target e um quad de tela cheia a reescreve como caracteres: cada célula tira a média da luminância com nove amostras e escolhe um glifo de um atlas gerado no navegador. Os caracteres são somados sobre a cena escurecida, então a forma continua legível por baixo.",
          },
          {
            title: "Níveis medidos para cada cena",
            text: "As três cenas do hero não se parecem: a escultura fica entre 0,27 e 0,60 de luminância e os filamentos orgânicos mal passam de 0,28. Cada uma tem seu ponto de preto e de branco, tirados da leitura do render target e da contagem de quais glifos saíam. A ordem também importou: cortando depois da curva de resposta, o interior da escultura se espremia nos últimos quatro glifos da rampa e virava uma mancha.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "ascii", alt: "Detalhe do hero: os caracteres que formam a escultura." },
          { key: "mobile", alt: "O hero num celular, com o enxame de partículas em caracteres." },
        ],
        caption: "De perto, cada caractere é uma célula que tira a média da luminância da cena. No celular o enxame cai de 16.000 para 6.000 partículas.",
      },
      {
        type: "list",
        title: "O que apareceu nos testes",
        intro: "Quase tudo o que importava apareceu usando a página:",
        items: [
          "Abrir qualquer peça dava tela preta. A animação de entrada da página mantinha um transform aplicado, e isso fazia da página o contêiner do modal: ele se centralizava numa caixa de 1.871\u00a0px de altura, fora da tela. O modal passou para um portal no body.",
          "A grade de `/motion` usava o vídeo original como capa: 17,2\u00a0MB ao abrir a página, com um arquivo de 28,7\u00a0MB. Agora cada capa é um corte de 8 segundos com pôster, e o original só é baixado ao abrir a peça.",
          "Ao trocar de categoria, a página abria na altura de rolagem da anterior. A biblioteca de rolagem suave engolia o `scrollTo` nativo, e isso só acontecia no site publicado.",
          "Na home, 24 elementos não chegavam ao contraste AA, com razões entre 2,1 e 2,5. Sobre este fundo preto, 45% de opacidade dá exatamente 4,5:1, e isso virou o piso para texto pequeno.",
          "Em telas de alta densidade, como as Retina, o canvas do hero aparecia com o dobro do tamanho e a cena saía cortada. Num monitor comum não se notava; apareceu ao capturar a página em 2x.",
        ],
      },
      {
        type: "stats",
        title: "Em números",
        items: [
          { value: "17,2 → 0,6\u00a0MB", label: "baixados ao abrir /motion" },
          { value: "28,7 → 1,1\u00a0MB", label: "o arquivo mais pesado da grade" },
          { value: "24 → 0", label: "elementos da home abaixo do contraste AA" },
          { value: "0\u00a0px", label: "de erro entre o cursor e o centro do enxame" },
        ],
      },
      {
        type: "decisions",
        title: "Também tem",
        items: [
          {
            title: "Um lab generativo",
            text: "Oito peças em canvas, cada uma de uma família de algoritmo diferente, com quatro controles ao vivo. No valor padrão, os controles mostram exatamente a obra que a semente define. Na reação-difusão de Gray-Scott, um slider cru de parâmetros era uma armadilha: quase todo o plano de parâmetros é morto, e com a difusão abaixo de 0,90x a simulação diverge para NaN e a grade fica preta até a próxima semente. Esse controle virou um ganho de render, que não consegue quebrar a equação, e até esse ganho precisou de teto: no máximo queimava 37,9% dos pixels; com o teto novo, 3,1%.",
          },
          {
            title: "Um painel sem banco de dados",
            text: "Textos e trabalhos são editados em `/admin`. Ao salvar, uma função serverless faz commit do conteúdo no repositório pela API do GitHub e a Vercel publica de novo. Senha com hash scrypt, cookie de sessão assinado com HMAC e uma lista fechada de arquivos que podem ser escritos.",
          },
          {
            title: "Testes e CI",
            text: "O Vitest confere se os três idiomas dizem a mesma coisa e se nenhuma peça aponta para um arquivo inexistente, e testa a autenticação do painel. Um desses testes pegou um bug real: a compressão de imagens podia ficar abaixo do piso de qualidade. Cada push roda lint, testes e build.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "lab",
            alt: "Comunión celular, uma das peças do lab: manchas vermelhas de reação-difusão sobre preto.",
          },
          {
            key: "lab2",
            alt: "Salmo de arena: grãos brancos que desenham as linhas nodais de uma placa vibrando.",
          },
        ],
        caption: "Duas das oito peças do lab: reação-difusão de Gray-Scott (Comunión celular) e figuras de Chladni (Salmo de arena).",
      },
      {
        type: "text",
        title: "O que levo disso",
        paragraphs: [
          "Os níveis do ASCII e as faixas do lab saem da leitura de pixels, não do olho. O outro lado é que não são eternos: se o material de uma cena ou de uma obra muda, é preciso medir de novo.",
        ],
      },
    ],
  },

  "tamara-gonzalez": {
    role: "Design e desenvolvimento",
    blocks: [
      {
        type: "text",
        title: "O ponto de partida",
        paragraphs: [
          "O primeiro briefing era um portfólio de marketing digital e community management, com projetos em formato de case e uma estética clara: rosa queimado e vidro. No meio do desenvolvimento, a Tamara trouxe uma nota escrita à mão e dois mockups de referência, e o projeto mudou de raiz. O que ela precisava era um perfil de artista visual: as tatuagens na frente, porque é o que mais vende e do que ela tem mais trabalho, e depois ilustração e pintura.",
          "O marketing não sumiu: virou um dos serviços dela.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "home", alt: "Home do portfólio de Tamara González: título em serifa e uma foto dela tatuando." }],
        caption: "O site no ar: base bordô quase preta, detalhes em rosa e a obra na frente.",
      },
      {
        type: "decisions",
        title: "Decisões",
        items: [
          {
            title: "Refazer no meio do caminho",
            text: "Mudei a estrutura e a pele. Os cases de marketing viraram galerias de trabalho, o rosa ficou como detalhe sobre um bordô quase preto, que era o que as referências dela pediam, e o formulário de contato foi trocado pelo WhatsApp, que é por onde os clientes realmente escrevem para ela. O Rabbit Studio, a marca de branding dela, foi para o rodapé com o logo do coelho.",
            discarded: "Manter o foco em marketing e a estética clara: a nota dela deixava claro que o produto era a obra.",
          },
          {
            title: "Simples primeiro, o avançado a um clique",
            text: "Quem usa o painel não programa. Ele abre no modo simples e guarda atrás de “Mostrar opções avançadas” tudo o que pode quebrar o site, e lembra a escolha. Repeti esse critério depois nos painéis de outros três sites, incluindo este.",
          },
          {
            title: "A obra organizada por projeto",
            text: "No começo a galeria era uma lista de imagens. Virou projetos, cada um com seu modal, e o painel foi reescrito na mesma leva para ela subir cada trabalho com todas as fotos e vídeos juntos. As imagens sobem em lote e são convertidas para WebP no navegador antes do upload.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "panel",
            alt: "O painel de administração no modo simples: sete seções recolhidas e o interruptor de opções avançadas.",
          },
        ],
        caption: "O painel no modo simples. O que pode quebrar o site espera atrás de um interruptor.",
      },
      {
        type: "text",
        title: "Como funciona",
        paragraphs: [
          "O site lê tudo de um `content.json`. Ao salvar, uma função serverless faz commit no repositório pela API do GitHub e a Vercel publica sozinha, de 30 a 60 segundos depois. Não há banco de dados: cada mudança fica registrada como um commit, com histórico.",
          "O login tem limite de tentativas e o upload confere o tipo real do arquivo pelos primeiros bytes, com teto de 2\u00a0MB. Para lotes grandes há também um script local, com sharp e ffmpeg, que processa pastas inteiras: uma subpasta por projeto, imagens em WebP de até 1600\u00a0px, miniaturas de 600\u00a0px e vídeos em MP4 sem áudio.",
        ],
      },
      {
        type: "list",
        title: "O que apareceu nos testes",
        items: [
          "O painel passava em todos os testes e em produção não carregava nada. A API lia o `content.json` da raiz do repositório, mas o site o serve de `public/`. Os testes simulavam o GitHub, então o descompasso de caminhos só apareceu contra o repositório real.",
          "A galeria não fechava: com React 19 em StrictMode, o AnimatePresence não desmontava o componente. Os testes passavam e no app ela ficava presa. Troquei por uma renderização condicional e perdi a animação de saída, que não fazia falta.",
        ],
      },
      {
        type: "stats",
        title: "Em números",
        items: [
          { value: "41", label: "testes com Vitest entre a API, o painel e os componentes" },
          { value: "375\u00a0px", label: "sem rolagem horizontal, nem no site nem no painel" },
          { value: "30–60\u00a0s", label: "entre salvar no painel e ver a mudança no ar" },
          { value: "3", label: "sites que herdaram este painel" },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gallery", alt: "Galeria de tatuagens: uma fileira de quatro projetos." },
          { key: "mobile", alt: "O site de Tamara González num celular." },
        ],
        caption: "A galeria de tatuagens e a home no celular.",
      },
      {
        type: "text",
        title: "O que levo disso",
        paragraphs: [
          "Um teste que simula o GitHub não testa os caminhos reais. Para isso é preciso rodar contra o repositório de verdade.",
        ],
      },
    ],
  },

  "andino-seguros": {
    role: "Design e desenvolvimento",
    blocks: [
      {
        type: "text",
        title: "O ponto de partida",
        paragraphs: [
          "Federico Andino é corretor de seguros em Mendoza e trabalha pelo WhatsApp. O site não precisava explicar seguros: precisava fazer com que alguém que chega pelo Instagram ou por uma busca termine escrevendo para ele, e que a mensagem chegue com os dados do risco, em vez de começar com «oi, qual é o seu carro?».",
          "Daí saíram os dois critérios que ordenam todo o resto: nenhuma consulta se perde, nem porque alguém fecha a aba nem porque um serviço falha; e mobile primeiro de verdade, porque o tráfego vem do Instagram, na rua e com dados móveis.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "home", alt: "Início do site da Andino Seguros: título em branco e laranja sobre azul-marinho, com os botões para cotar e para falar pelo WhatsApp." }],
        caption: "O azul carrega o peso; o laranja fica para o que é para tocar: cotar e escrever pelo WhatsApp.",
      },
      {
        type: "decisions",
        title: "Decisões",
        items: [
          {
            title: "A consulta é salva antes de abrir o WhatsApp",
            text: "O formulário envia os dados ao servidor, que valida de novo, salva a consulta e só então devolve o link do WhatsApp com a mensagem pronta. Se a mensagem fosse montada no navegador, quem abre o WhatsApp e não toca em enviar sumiria sem deixar rastro, e é justamente a pessoa a quem Federico gostaria de voltar a escrever. Se o banco falha, o WhatsApp abre do mesmo jeito: perde-se o registro, não a conversa.",
            discarded: "Montar a mensagem no navegador e abrir o WhatsApp direto: mais simples, e perde todos que não chegam a tocar em enviar.",
          },
          {
            title: "Um arquivo por seguro, um só formulário",
            text: "Cada seguro é um arquivo que declara seus campos, seu esquema Zod e como ele aparece na mensagem. Um único componente desenha todos sem saber nada de seguros. Começou com cinco e hoje são dez: somar um é um arquivo novo e uma linha no registro, e se faltar a linha, o TypeScript não compila.",
            discarded: "Quatro formulários escritos à mão: mais fáceis de ler no começo, mas o crescimento previsível do projeto era justamente somar seguros.",
          },
          {
            title: "Duas credenciais que não se misturam",
            text: "O site público escreve no banco com uma chave que só pode inserir: com RLS ativo, não lê, não edita e não apaga. Testei contra a API real: ler e apagar dão 401, inserir dá 201. O painel usa a única credencial que pode ler dados de clientes, fechada num módulo de servidor que só é usado depois de validar a sessão.",
          },
          {
            title: "Um painel na medida de quem usa",
            text: "Federico não é programador. Em vez de dar acesso à tabela do banco, montei um painel para ele: vê as consultas com os dados já traduzidos, escreve para cada pessoa pelo WhatsApp, marca quem já contatou e anota. A carteira é importada da planilha dele e agrupada por pessoa, não por apólice, porque quando um cliente liga ele quer ver tudo o que essa pessoa tem com ele.",
            discarded: "Convidá-lo para o Supabase: zero trabalho, mas ele veria uma tabela crua com acesso ao projeto inteiro.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "formulario", alt: "Formulário de seguro de carro no celular: documento, marca, modelo, ano e placa." },
          { key: "consulta", alt: "A mesma consulta no painel, com dados de teste: o veículo, a cobertura desejada e o botão para escrever pelo WhatsApp." },
        ],
        caption: "O formulário de carro no celular e a consulta como chega para Federico. No painel, dados de teste.",
      },
      {
        type: "text",
        title: "Como funciona",
        paragraphs: [
          "Next.js 16 com App Router e TypeScript, Tailwind CSS 4 e Zod, que valida no navegador e de novo no servidor. Os cards de seguros e as perguntas frequentes são editados no Sanity, com o Studio embutido no próprio site; o que nunca muda, como o registro profissional ou os textos legais, fica no código. Se o Sanity não responde, o site serve um conteúdo de reserva e não cai.",
          "O painel entra com senha: a sessão é um cookie assinado com HMAC e `httpOnly`, e o login aceita cinco tentativas a cada dez minutos por IP. Google Analytics e Meta Pixel não existem na página até a pessoa aceitar os cookies.",
        ],
      },
      {
        type: "list",
        title: "O que apareceu nos testes",
        items: [
          "O botão principal não passava no contraste: branco sobre o laranja da marca dá 3,0:1 e a WCAG AA pede 4,5:1. Escurecer o laranja chegava a 4,02. Resolveu o texto azul-marinho sobre o mesmo laranja: 5,89:1, sem mexer na cor da marca.",
          "O botão flutuante do WhatsApp ficava a 2 px do aviso de cookies: não se sobrepunham por sorte. Agora os dois ficam num contêiner em coluna e o espaçamento sai do `gap`. Testei duplicando o texto do aviso: passou de 162 para 231 px de altura e o espaçamento continuou em 12 px.",
          "O honeypot não funcionava: o esquema rejeitava o campo antes da checagem, devolvia 400 e avisava ao bot que ele tinha sido detectado. Agora responde normalmente e descarta o envio em silêncio.",
          "O site continuava mostrando o conteúdo de reserva com o Sanity já carregado. Não era o Sanity: era o cache de fetch do Next, que fica em disco e sobrevive ao reinício do servidor.",
        ],
      },
      {
        type: "stats",
        title: "Em números",
        items: [
          { value: "10", label: "formulários de seguro, desenhados por um único componente" },
          { value: "5,89:1", label: "de contraste no botão principal, que tinha 3,0:1" },
          { value: "9", label: "erros da primeira versão encontrados na verificação, não no desenvolvimento" },
          { value: "401", label: "o que o banco responde quando a chave pública tenta ler ou apagar; inserir dá 201" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "panel", alt: "Início do painel com dados de teste: consultas sem resposta, comissão a receber, clientes e apólices que vencem em 30 dias." }],
        caption: "O início do painel responde a «o que eu faço hoje?». Dados de teste: os reais não saem do painel.",
      },
      {
        type: "text",
        title: "O que levo disso",
        paragraphs: [
          "Num site de conversão, a decisão técnica que importa não é o framework: é a ordem das coisas. Salvar antes de redirecionar, redirecionar mesmo que o salvamento falhe e não animar o botão do qual tudo depende. Nenhuma das três aparece, e as três decidem se a consulta chega.",
        ],
      },
    ],
  },

  "press-kits": {
    role: "Design e desenvolvimento",
    blocks: [
      {
        type: "text",
        title: "O ponto de partida",
        paragraphs: [
          "Comecei pelo meu: um press kit web para mostrar meus sets como DJ, em três idiomas e com um painel para editar sem mexer no código. Depois vieram três artistas: CTRL.Z, DJ de música urbana de Mendoza; Gabi Raíz, DJ e produtor de Mendoza que vai do downtempo ao psychedelic trance; e Martina Høbelar, DJ e produtora de hard techno e schranz de Buenos Aires.",
          "Um produtor abre o press kit para decidir se contrata: quem é, o que toca, que equipamento pede e para onde escrever. Os quatro respondem exatamente isso, e nenhum se parece com outro.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "portadas", alt: "As capas dos quatro press kits: Kexxy, CTRL.Z, Gabi Raíz e Martina Høbelar." }],
        caption: "Kexxy, CTRL.Z, Gabi Raíz e Martina Høbelar: a mesma base, quatro estéticas.",
      },
      {
        type: "decisions",
        title: "Decisões",
        items: [
          {
            title: "Uma base de arquitetura, não um site para clonar",
            text: "Meu template pressupõe techno, três idiomas, sets do SoundCloud e uma seção pessoal. CTRL.Z toca reggaeton, RKT, cumbia e trap, e todo o material dela era um PDF de uma página só. Clonada, a página ficava meio vazia ou cheia de texto inventado, então refiz a estrutura para o material que existia. Desde então, cada press kit começa pela mesma pergunta: o que o artista tem e que estrutura esse material pede.",
            discarded: "Clonar e desligar as seções que sobravam: ficava uma página curta com a estética de outro artista.",
          },
          {
            title: "A estética sai do material",
            text: "Em CTRL.Z, o verde-oliva e os títulos cromados do PDF dela. Em Gabi Raíz, o azul-petróleo das fotos de estúdio, um vermelho que aparece uma vez só e as listras do logo, que seguem adiante e desenham a cordilheira atrás dele; no fim da página ela volta invertida, como raiz. Em Martina Høbelar, a sala no escuro, uma única tipografia condensada e o vermelho dela reservado para um led que marca o que está ativo.",
          },
          {
            title: "Nenhum dado inventado",
            text: "Um produtor usa o press kit para decidir. No de CTRL.Z, o rider e a hospitalidade são literais do PDF, e os números que calculei a partir da bio ficaram para ela confirmar. Com Gabi Raíz a regra foi explícita: o que ele não confirmou sai, mesmo que esteja num perfil público.",
          },
          {
            title: "Painel só se alguém for usar",
            text: "O meu tem um painel de dois níveis que salva as alterações no repositório pela API do GitHub. O de CTRL.Z eu construí, testei e entreguei desligado. Gabi Raíz e Martina Høbelar são uma página estática só, sem painel nem funções serverless.",
            discarded: "Um painel em todos, por via das dúvidas: um painel ativo é superfície de ataque e mais uma senha para perder.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gabiMobile", alt: "O press kit de Gabi Raíz no celular: o logo, a cordilheira de linhas e os botões para consultar uma data e ouvir um set." },
          { key: "martinaMobile", alt: "O press kit de Martina Høbelar no celular: o nome em tipografia condensada e os botões Ver sets e Booking." },
        ],
        caption: "No celular, cada capa leva ao mesmo: ouvir e consultar uma data.",
      },
      {
        type: "text",
        title: "Como funcionam",
        paragraphs: [
          "Sem framework nem etapa de build: HTML, CSS e JavaScript escritos à mão, na Vercel. O conteúdo fica no HTML, que é o que o Google e o WhatsApp leem e o que sobra se o JavaScript falhar. Nos três de clientes, a política de segurança de conteúdo só deixa carregar scripts próprios.",
          "Nos dois últimos, o booking não passa por nenhum servidor: com o que é preenchido, a página monta a consulta e abre no WhatsApp ou no e-mail de quem escreve. No da Martina, o assunto leva a data e o local, para que a caixa de bookings possa ser ordenada.",
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gabiBooking", alt: "Formulário de booking de Gabi Raíz: nome, produtora, data, cidade, formato e mensagem, com botões para enviar pelo WhatsApp ou por e-mail." },
          { key: "martinaBooking", alt: "Formulário de booking de Martina Høbelar: nome, data e local, mensagem e um único botão para enviar por e-mail." },
        ],
        caption: "Dois bookings sem servidor: o de Gabi abre o WhatsApp ou o e-mail; o de Martina, só o e-mail, com um assunto que dá para ordenar.",
      },
      {
        type: "list",
        title: "O que apareceu nos testes",
        items: [
          "Em CTRL.Z, as animações de entrada deixavam a página em branco se o JavaScript não rodasse: `.reveal { opacity: 0 }` num HTML escrito para funcionar sem ele. Resolveu o `boot.js`, uma única instrução no head que marca que há JavaScript antes da primeira pintura; o CSS só esconde sob `.js`.",
          "Em Gabi Raíz, a foto da bio não aparecia: com `clip-path` recortando o elemento inteiro, o navegador o considerava invisível, a imagem diferida nunca carregava e a entrada não disparava. Agora uma cortina a revela: um pseudo-elemento da cor do fundo que se desloca.",
          "Em Martina Høbelar, com a conexão do celular caindo, as miniaturas que falhavam ficavam quebradas: o navegador não as pede de novo sozinho. Cada imagem é tentada de novo até quatro vezes, e todas outra vez quando a conexão volta.",
        ],
      },
      {
        type: "stats",
        title: "Em números",
        items: [
          { value: "4", label: "press kits no ar, da mesma base" },
          { value: "18", label: "imagens recuperadas em resolução original do PDF de CTRL.Z" },
          { value: "8", label: "piscadas do led de Martina, no BPM do set escolhido" },
          { value: "44 px", label: "de altura mínima para botões e links no da Martina" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "martinaSets", alt: "Seção de sets de Martina Høbelar: o player e a lista de sets com os BPM; um led vermelho marca o escolhido." }],
        caption: "Os sets de Martina com os BPM. Ao escolher um, o led pisca oito vezes nesse andamento.",
      },
      {
        type: "text",
        title: "O que levo disso",
        paragraphs: [
          "O template serve como base de arquitetura, não como site pronto. Com cada artista a pergunta não é o que mudar no clone, e sim que material ele tem e que estrutura esse material pede.",
        ],
      },
    ],
  },
};
