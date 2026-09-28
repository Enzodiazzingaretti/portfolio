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

  "ctrl-z": {
    role: "Design e desenvolvimento",
    blocks: [
      {
        type: "text",
        title: "O ponto de partida",
        paragraphs: [
          "CTRL.Z é a Brenda Hetcer, DJ de música urbana de Mendoza. Todo o material dela estava num PDF de uma página só, de 1290\u00a0×\u00a05230\u00a0px, quase todo imagem e texto vetorizado: extrair o texto devolvia 467 bytes, só os links.",
          "Renderizei o PDF em fatias para conseguir lê-lo e tirei as 18 imagens que ele tinha dentro, na resolução original. Essas imagens são as fotos do site, e o diagrama do rider saiu do mesmo PDF renderizado no triplo da escala.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "cover", alt: "Capa do press kit de CTRL.Z: o logo cromado sobre uma foto em verde-oliva." }],
        caption: "A capa: verde-oliva e musgo, títulos cromados e as fotos com a mesma cor do PDF dela.",
      },
      {
        type: "decisions",
        title: "Decisões",
        items: [
          {
            title: "Redesenhar em vez de clonar",
            text: "Meu modelo de press kit pressupõe techno, três idiomas, sets do SoundCloud, vídeos do YouTube e uma seção pessoal. A Brenda toca reggaeton, RKT, cumbia e trap e se apresenta na Argentina; o SoundCloud dela não expõe os IDs das faixas e o PDF não conta nada pessoal. Clonada, a página ficava meio vazia ou cheia de texto inventado. Montei a estrutura para o material que existia: capa, gêneros, bio, com quem ela dividiu palco, palcos, fotos de imprensa, rider, hospitalidade e booking, num idioma só.",
            discarded: "Clonar e desligar as seções que sobravam: ficava uma página curta com a estética de outro artista.",
          },
          {
            title: "Nenhum dado inventado",
            text: "Um produtor usa o press kit para decidir se vai contratá-la. O rider e a hospitalidade são literais do PDF. Dos quatro números em destaque, 2017 vem do PDF; os 9+ anos, 8+ cidades e 18+ palcos eu contei a partir da bio dela. A quantidade de shows não aparece porque não havia de onde tirá-la.",
          },
          {
            title: "Um painel que existe, mas não aparece",
            text: "Construí o painel inteiro e testei, mas entreguei desligado, caso seja usado mais adiante: adicionar depois custa mais do que deixar pronto, e assim o conteúdo já nasceu editável. Duas barreiras independentes o separam do público: nenhum link no site, e sem as variáveis de ambiente o login com senha não existe: o único caminho que sobra pede um token do GitHub, e esse token só eu tenho. Além disso, noindex e robots.txt.",
            discarded: "Deixá-lo ativo com senha: ela não ia usar, e um painel ativo é superfície de ataque e mais uma senha para perder.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "rider", alt: "Seção de rider técnico: duas opções de cabine e o diagrama com os equipamentos." },
          { key: "mobile", alt: "A capa do press kit num celular." },
        ],
        caption: "O rider, com as duas opções de cabine como aparecem no PDF dela, e a capa no celular.",
      },
      {
        type: "text",
        title: "Como funciona",
        paragraphs: [
          "Sem framework: HTML, CSS e JavaScript, mais funções serverless da Vercel para o painel. O conteúdo existe duas vezes de propósito: escrito no HTML, para buscadores e para quem está sem JavaScript, e repetido num `content.json` que o painel pode reescrever.",
          "Nos textos, `*assim*` vira negrito e HTML não é aceito: tudo entra como texto puro, então nada do que se escreve no painel consegue injetar tags. A política de segurança de conteúdo só permite os scripts do próprio site (`script-src 'self'`), sem código inline.",
        ],
      },
      {
        type: "list",
        title: "O que apareceu nos testes",
        items: [
          "Verificando o site, as animações de entrada não disparavam. A causa era o ambiente de teste, mas revelou um problema real: `.reveal { opacity: 0 }` deixava a página em branco se o JavaScript não rodasse, justo num HTML escrito para funcionar sem ele. A solução foi o `boot.js`, uma única instrução no head que marca que há JavaScript antes da primeira renderização; o CSS só esconde sob `.js`. Fica num arquivo separado porque a CSP não aceita scripts inline.",
          "O projeto trazia um `.htaccess` herdado do modelo. É do Apache, a Vercel ignora, e a CSP dele ainda citava SoundCloud, EmailJS e jsdelivr, que este site não usa. Apaguei: a configuração real fica no `vercel.json`.",
          "Testei o painel de ponta a ponta contra uma API simulada com o mesmo contrato HTTP: login com senha certa e errada, as cinco abas, editar, reordenar e apagar, upload de imagens, publicar, e 401 nas três rotas sem sessão.",
        ],
      },
      {
        type: "stats",
        title: "Em números",
        items: [
          { value: "1290\u00a0×\u00a05230", label: "pixels do PDF de origem, numa página só" },
          { value: "18", label: "imagens recuperadas do PDF na resolução original" },
          { value: "5", label: "abas do painel: artista, textos, listas, imagens e seções" },
          { value: "2", label: "barreiras entre o painel e o público" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "photos", alt: "Faixa de fotos de imprensa de CTRL.Z tocando." }],
        caption: "As fotos de imprensa abrem num visualizador, e logo abaixo está o pacote completo para baixar.",
      },
      {
        type: "text",
        title: "O que levo disso",
        paragraphs: [
          "O modelo serve como base de arquitetura, não como site pronto para entregar. Com o próximo artista, a pergunta não vai ser o que mudar no clone, e sim que material ele tem e que estrutura esse material pede.",
        ],
      },
    ],
  },
};
