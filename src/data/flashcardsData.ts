import { HanziVisualFlashcard } from '../types';

export const HANZI_VISUAL_FLASHCARDS: HanziVisualFlashcard[] = [
  // 1. 知道 (zhīdào) - 🏹🧠
  {
    id: 'fc_zhidao',
    hanzi: '知道',
    pinyin: 'zhīdào',
    pinyinRaw: 'zhidao',
    translation: 'saber',
    emoji: '🏹🧠',
    hintPhrase: 'A ideia que parece uma flecha indo para o cérebro, ou seja é fácil de entender',
    hskLevel: 'HSK 1',
    category: 'Verbo',
    visualDescription: 'Uma flecha (矢) voando direto em direção à mente e ao cérebro (道).',
    mnemonicStory: 'O lado esquerdo parece uma flecha afiada disparada direto em direção à mente e ao cérebro: quando a ideia entra sem desvios na cabeça, você compreende imediatamente — você SABE!',
    distractorPinyins: ['kànjiàn', 'rènshi', 'xiǎngdào'],
    distractorOptions: [
      { pinyin: 'kànjiàn', translation: 'ver / enxergar', pinyinRaw: 'kanjian' },
      { pinyin: 'rènshi', translation: 'conhecer', pinyinRaw: 'renshi' },
      { pinyin: 'xiǎngdào', translation: 'lembrar-se / pensar em', pinyinRaw: 'xiangdao' },
    ],
    components: [
      {
        part: '矢',
        pinyin: 'shǐ',
        name: 'Flecha',
        meaning: 'Dardo / flecha veloz',
        visualRole: 'A flecha do pensamento atingindo o alvo',
        color: 'from-amber-500 to-orange-500'
      },
      {
        part: '口',
        pinyin: 'kǒu',
        name: 'Boca',
        meaning: 'Abertura para articular palavras',
        visualRole: 'A boca expressando o fato sabido',
        color: 'from-blue-500 to-indigo-500'
      },
      {
        part: '首',
        pinyin: 'shǒu',
        name: 'Cabeça / Mente',
        meaning: 'O cérebro que raciocina e guia',
        visualRole: 'O cérebro processando a informação',
        color: 'from-emerald-500 to-teal-500'
      },
      {
        part: '辶',
        pinyin: 'chuò',
        name: 'Caminho',
        meaning: 'Trajeto e percurso',
        visualRole: 'O caminho do entendimento claro',
        color: 'from-purple-500 to-pink-500'
      }
    ],
    exampleSentence: {
      hanzi: '我知道这个词的意思。',
      pinyin: 'Wǒ zhīdào zhège cí de yìsi.',
      portuguese: 'Eu sei o significado desta palavra.'
    },
    retentionTip: 'Flecha na mente (🏹🧠) = fácil de entender = saber (zhīdào)!',
    etymologyNote: '知 (flecha + boca) + 道 (caminho da mente) = saber o caminho e os fatos com clareza.'
  },

  // 2. 行 (xíng) - ✅
  {
    id: 'fc_xing',
    hanzi: '行',
    pinyin: 'xíng',
    pinyinRaw: 'xing',
    translation: 'permitir / ok',
    emoji: '✅',
    hintPhrase: 'Parece uma marca de `check` , ou seja está tudo OK',
    hskLevel: 'HSK 2',
    category: 'Verbo de Permissão',
    visualDescription: 'O traço angular esquerdo e a descida lembram a silhueta de uma marca de check verde.',
    mnemonicStory: 'Olhe a curvatura e a dinâmica dos traços: o ideograma lembra o desenho de um vistoso símbolo de check (✅). Quando algo recebe um check de aprovação, significa que a passagem está liberada, está autorizado, tudo bem, tudo OK!',
    distractorPinyins: ['kěyǐ', 'hǎo de', 'bùxíng'],
    distractorOptions: [
      { pinyin: 'kěyǐ', translation: 'poder', pinyinRaw: 'keyi' },
      { pinyin: 'hǎo de', translation: 'está bem / de acordo', pinyinRaw: 'hao de' },
      { pinyin: 'bùxíng', translation: 'não pode / proibido', pinyinRaw: 'buxing' },
    ],
    components: [
      {
        part: '彳',
        pinyin: 'chì',
        name: 'Passo Esquerdo',
        meaning: 'Início do passo desimpedido',
        visualRole: 'A subida e descida do traço de check',
        color: 'from-emerald-500 to-green-600'
      },
      {
        part: '亍',
        pinyin: 'chù',
        name: 'Passo Direito',
        meaning: 'Passo firme completando a marcha',
        visualRole: 'A finalização do check de permissão',
        color: 'from-blue-500 to-cyan-600'
      }
    ],
    exampleSentence: {
      hanzi: '我看一下行不行？行！',
      pinyin: 'Wǒ kàn yíxià xíng bu xíng? Xíng!',
      portuguese: 'Estou dando uma olhadinha. Tudo bem? Tudo bem!'
    },
    retentionTip: 'Formato de check (✅) = aprovado, tudo OK, permitir (xíng)!',
    etymologyNote: '行 representava uma encruzilhada livre onde o tráfego pode fluir com aprovação.'
  },

  // 3. 照片 (zhàopiàn) - 📷
  {
    id: 'fc_zhaopian',
    hanzi: '照片',
    pinyin: 'zhàopiàn',
    pinyinRaw: 'zhaopian',
    translation: 'fotografia',
    emoji: '📷',
    hintPhrase: 'O caractere parece uma câmera fotográfica',
    hskLevel: 'HSK 2',
    category: 'Substantivo',
    visualDescription: 'O corpo quadrado no topo com a lente central e o feixe luminoso embaixo lembram o visor e corpo de uma câmera fotográfica.',
    mnemonicStory: 'O ideograma 照 tem o retângulo superior como o visor da câmera, a moldura central como a lente objetiva e os 4 pontinhos inferiores como o flash luminoso disparando para congelar a cena num filme fotográfico plano (片). Parece uma câmera fotográfica clássica tirando uma foto!',
    distractorPinyins: ['shǒujī', 'diànyǐng', 'huàr'],
    distractorOptions: [
      { pinyin: 'shǒujī', translation: 'celular', pinyinRaw: 'shouji' },
      { pinyin: 'diànyǐng', translation: 'filme / cinema', pinyinRaw: 'dianying' },
      { pinyin: 'huàr', translation: 'pintura / quadro', pinyinRaw: 'huar' },
    ],
    components: [
      {
        part: '日',
        pinyin: 'rì',
        name: 'Visor / Sol',
        meaning: 'Luz superior e visor da câmera',
        visualRole: 'O visor retangular por onde o fotógrafo enquadra',
        color: 'from-amber-400 to-yellow-500'
      },
      {
        part: '灬',
        pinyin: 'huǒ',
        name: 'Flash / Fogo',
        meaning: '4 pontinhos de luz intensa',
        visualRole: 'O feixe luminoso do flash fotográfico',
        color: 'from-rose-500 to-red-600'
      },
      {
        part: '片',
        pinyin: 'piàn',
        name: 'Filme / Lâmina',
        meaning: 'Película retangular fina e plana',
        visualRole: 'A folha de foto impressa',
        color: 'from-indigo-500 to-violet-600'
      }
    ],
    exampleSentence: {
      hanzi: '这是一张中国朋友的照片。',
      pinyin: 'Zhè shì yì zhāng Zhōngguó péngyou de zhàopiàn.',
      portuguese: 'Esta é uma foto de um amigo chinês.'
    },
    retentionTip: 'Caractere em forma de câmera (📷) disparando flash = fotografia (zhàopiàn)!',
    etymologyNote: 'Classificador de 照片 é 张 (zhāng - folha/superfície plana).'
  },

  // 4. 笔 (bǐ) - ✍🏼
  {
    id: 'fc_bi',
    hanzi: '笔',
    pinyin: 'bǐ',
    pinyinRaw: 'bi',
    translation: 'caneta',
    emoji: '✍🏼',
    hintPhrase: 'O movimento lembra uma mão escrevendo',
    hskLevel: 'HSK 1',
    category: 'Substantivo',
    visualDescription: 'A inclinação dos traços superiores e o gancho inferior lembram os dedos e a ponta traçando no papel.',
    mnemonicStory: 'Ao traçar 笔, o gesto superior inclinado e o gancho final de descida imitam o movimento exato e elegante de uma mão escrevendo caracteres chineses com caneta ou pincel. É a mão em ação!',
    distractorPinyins: ['shū', 'běn', 'zhǐ'],
    distractorOptions: [
      { pinyin: 'shū', translation: 'livro', pinyinRaw: 'shu' },
      { pinyin: 'běn', translation: 'caderno / exemplar', pinyinRaw: 'ben' },
      { pinyin: 'zhǐ', translation: 'papel', pinyinRaw: 'zhi' },
    ],
    components: [
      {
        part: '⺮ (竹)',
        pinyin: 'zhú',
        name: 'Bambu',
        meaning: 'Cabo cilíndrico de escrita',
        visualRole: 'O corpo da caneta apoiado entre os dedos',
        color: 'from-emerald-500 to-green-600'
      },
      {
        part: '毛',
        pinyin: 'máo',
        name: 'Ponta / Pêlos',
        meaning: 'Cerdas que tocam o papel',
        visualRole: 'A ponta com tinta que escreve na folha',
        color: 'from-amber-600 to-yellow-700'
      }
    ],
    exampleSentence: {
      hanzi: '我们用这支黑色的笔写字。',
      pinyin: 'Wǒmen yòng zhè zhī hēisè de bǐ xiězì.',
      portuguese: 'Nós usamos esta caneta preta para escrever ideogramas.'
    },
    retentionTip: 'Movimento da mão escrevendo (✍🏼) = caneta (bǐ)! Classificador: 支 (zhī).',
    etymologyNote: 'Bambu (⺮) no topo + Cerdas de pêlo (毛) na base = caneta/pincel.'
  },

  // 5. 地图 (dìtú) - 🗺️
  {
    id: 'fc_ditu',
    hanzi: '地图',
    pinyin: 'dìtú',
    pinyinRaw: 'ditu',
    translation: 'mapa',
    emoji: '🗺️',
    hintPhrase: 'Duas partes quadradas do caractere lembram as páginas dobradas do mapa. O prefixo significa terra e o sufixo significa desenho [mas também lembra 国 de país]',
    hskLevel: 'HSK 2',
    category: 'Substantivo',
    visualDescription: 'As molduras quadradas dobradas lembram as páginas retangulares desdobráveis com demarcação geográfica.',
    mnemonicStory: 'Veja como os formatos quadrados (especialmente o cercado fechado 囗 de 图) parecem as dobras e folhas quadradas de um mapa de bolso quando desdobrado. O prefixo 地 significa solo/terra, e o sufixo 图 significa planta/desenho (que também lembra 国 de país). O desenho dobrado da terra de um país: um MAPA!',
    distractorPinyins: ['dìfang', 'guójiā', 'túshū'],
    distractorOptions: [
      { pinyin: 'dìfang', translation: 'lugar / local', pinyinRaw: 'difang' },
      { pinyin: 'guójiā', translation: 'país / nação', pinyinRaw: 'guojia' },
      { pinyin: 'túshū', translation: 'livros / atlas', pinyinRaw: 'tushu' },
    ],
    components: [
      {
        part: '土 (地)',
        pinyin: 'tǔ',
        name: 'Prefixo Terra',
        meaning: 'Solo, território e relevo',
        visualRole: 'A terra física representada',
        color: 'from-amber-700 to-amber-900'
      },
      {
        part: '囗 (图)',
        pinyin: 'wéi',
        name: 'Páginas Dobradas / Fronteiras',
        meaning: 'Bordas quadradas do papel do mapa',
        visualRole: 'As dobras retangulares do mapa de papel',
        color: 'from-blue-600 to-indigo-700'
      }
    ],
    exampleSentence: {
      hanzi: '我们买了一张中国地图。',
      pinyin: 'Wǒmen mǎile yì zhāng Zhōngguó dìtú.',
      portuguese: 'Nós compramos um mapa da China.'
    },
    retentionTip: 'Quadrados dobrados (🗺️) de terra (地) e desenho (图) = mapa (dìtú)!',
    etymologyNote: 'Classificador: 张 (zhāng), pois mapas são folhas planas desdobráveis.'
  },

  // 6. 词典 (cídiǎn) - 🏷️📔
  {
    id: 'fc_cidian',
    hanzi: '词典',
    pinyin: 'cídiǎn',
    pinyinRaw: 'cidian',
    translation: 'dicionário',
    emoji: '🏷️📔',
    hintPhrase: 'O prefixo significa `palavra`, o sufixo é mais ou menos como uma tabela ou índice de referência para uma coleção',
    hskLevel: 'HSK 2',
    category: 'Substantivo',
    visualDescription: 'A etiqueta de fala 讠ao lado de uma tabela com estante e índice de referência de obras.',
    mnemonicStory: 'O lado esquerdo traz o radical 讠, que é uma etiqueta/símbolo de palavra falada. O lado direito 典 parece uma estante com prateleiras e gavetas organizadas em forma de tabela de índice para uma grande coleção de palavras. É a coleção indexada de palavras: o DICIONÁRIO!',
    distractorPinyins: ['kèběn', 'gùshi', 'shēngcí'],
    distractorOptions: [
      { pinyin: 'kèběn', translation: 'livro didático', pinyinRaw: 'keben' },
      { pinyin: 'gùshi', translation: 'história / conto', pinyinRaw: 'gushi' },
      { pinyin: 'shēngcí', translation: 'vocabulário novo', pinyinRaw: 'shengci' },
    ],
    components: [
      {
        part: '讠(言)',
        pinyin: 'yán',
        name: 'Prefixo Palavra',
        meaning: 'Fala, vocábulo, etiqueta de linguagem',
        visualRole: 'A palavra etiquetada',
        color: 'from-blue-500 to-cyan-600'
      },
      {
        part: '典',
        pinyin: 'diǎn',
        name: 'Tabela / Índice de Coleção',
        meaning: 'Cânone com rolos de texto sobre suporte',
        visualRole: 'O índice tabelado em formato de livro de referência',
        color: 'from-amber-600 to-rose-600'
      }
    ],
    exampleSentence: {
      hanzi: '这是一本很有用的汉葡词典。',
      pinyin: 'Zhè shì yì běn hěn yǒuyòng de Hàn-Pú cídiǎn.',
      portuguese: 'Este é um dicionário chinês-português muito útil.'
    },
    retentionTip: 'Etiqueta de palavras (🏷️) + Índice/tabela solene (📔) = dicionário (cídiǎn)!',
    etymologyNote: 'Classificador: 本 (běn), próprio para livros e volumes encadernados.'
  },

  // 7. 真 (zhēn) - 👑
  {
    id: 'fc_zhen',
    hanzi: '真',
    pinyin: 'zhēn',
    pinyinRaw: 'zhen',
    translation: 'realmente',
    emoji: '👑',
    hintPhrase: 'Lembra uma corôa de um rei',
    hskLevel: 'HSK 2',
    category: 'Advérbio',
    visualDescription: 'A ponta superior em cruz e a base com pilares simétricos desenham a armação de uma coroa real.',
    mnemonicStory: 'O topo com cruz e a base com pilares simétricos formam o desenho exato de uma coroa de rei (👑). A coroa é a marca máxima da autoridade real autêntica e genuína: o que o rei decreta com sua coroa é de verdade, REALMENTE autêntico!',
    distractorPinyins: ['hěn', 'fēicháng', 'dàgài'],
    distractorOptions: [
      { pinyin: 'hěn', translation: 'muito', pinyinRaw: 'hen' },
      { pinyin: 'fēicháng', translation: 'extremamente', pinyinRaw: 'feichang' },
      { pinyin: 'dàgài', translation: 'provavelmente', pinyinRaw: 'dagai' },
    ],
    components: [
      {
        part: '十 (coroa)',
        pinyin: 'shí',
        name: 'Ponta da Coroa',
        meaning: 'Pico real adornado',
        visualRole: 'As pontas douradas da coroa',
        color: 'from-amber-400 to-yellow-500'
      },
      {
        part: '目 (centro)',
        pinyin: 'mù',
        name: 'Olho Real',
        meaning: 'Olhar do soberano sem ilusões',
        visualRole: 'A joia central incrustada na coroa',
        color: 'from-indigo-500 to-blue-600'
      },
      {
        part: '八 (base)',
        pinyin: 'bā',
        name: 'Aro da Coroa',
        meaning: 'Suporte nobre firme',
        visualRole: 'A base sólida que assenta sobre a cabeça',
        color: 'from-emerald-600 to-teal-700'
      }
    ],
    exampleSentence: {
      hanzi: '饺子真好吃！',
      pinyin: 'Jiǎozi zhēn hǎochī!',
      portuguese: 'Os guiozas são realmente deliciosos!'
    },
    retentionTip: 'Formato de coroa de rei (👑) = autoridade autêntica, de verdade, realmente (zhēn)!',
    etymologyNote: 'Na filosofia antiga, 真 representava a essência primordial e pura da verdade.'
  },

  // 8. 要 (yào) - 🎁
  {
    id: 'fc_yao',
    hanzi: '要',
    pinyin: 'yào',
    pinyinRaw: 'yao',
    translation: 'querer',
    emoji: '🎁',
    hintPhrase: 'Tem o formato de um presente porque representa o desejo',
    hskLevel: 'HSK 1',
    category: 'Verbo Modal',
    visualDescription: 'A tampa dividida em forma de laço e o suporte inferior lembram um pacote embrulhado com fita.',
    mnemonicStory: 'A caixa superior com divisória parece a tampa amarrada de um presente com fita (🎁), e a base é o apoio da caixa embrulhada. O que um presente representa no coração humano? O DESEJO ardente de receber algo: "Eu quero, eu preciso desse presente agora!": 要 (yào)!',
    distractorPinyins: ['xiǎng', 'xǐhuan', 'kěyǐ'],
    distractorOptions: [
      { pinyin: 'xiǎng', translation: 'gostaria / pensar', pinyinRaw: 'xiang' },
      { pinyin: 'xǐhuan', translation: 'gostar', pinyinRaw: 'xihuan' },
      { pinyin: 'kěyǐ', translation: 'poder / permissão', pinyinRaw: 'keyi' },
    ],
    components: [
      {
        part: '西 (laço/caixa)',
        pinyin: 'xī',
        name: 'Caixa de Presente',
        meaning: 'Tampa com laço amarrado',
        visualRole: 'O pacote do presente desejado',
        color: 'from-rose-500 to-pink-600'
      },
      {
        part: '女 (base)',
        pinyin: 'nǚ',
        name: 'Suporte',
        meaning: 'A pessoa que deseja o presente',
        visualRole: 'As mãos ansiosas para segurar o presente',
        color: 'from-purple-500 to-indigo-600'
      }
    ],
    exampleSentence: {
      hanzi: '我要一杯热咖啡，谢谢！',
      pinyin: 'Wǒ yào yì bēi rè kāfēi, xièxie!',
      portuguese: 'Eu quero uma xícara de café quente, obrigado!'
    },
    retentionTip: 'Formato de presente (🎁) = representa o desejo = querer / precisar (yào)!',
    etymologyNote: 'Diferente de 想 (vontade suave no coração), 要 é o desejo direto de obter algo concreto.'
  },

  // 9. 谁 (shéi) - 🧑🏼‍🍼
  {
    id: 'fc_shei',
    hanzi: '谁',
    pinyin: 'shéi',
    pinyinRaw: 'shei',
    translation: 'quem',
    emoji: '🧑🏼‍🍼',
    hintPhrase: 'Não há uma relação do hanzi diretamente com o significado, então podemos usar um pai falando com um bebê no colo [como se ele estivesse perguntando `Quem é o papai?`]',
    hskLevel: 'HSK 1',
    category: 'Pronome Interrogativo',
    visualDescription: 'O radical de fala 讠mostra um adulto carinhoso falando bem de perto com o bebezinho no colo 隹.',
    mnemonicStory: 'Imagine um pai segurando carinhosamente seu bebê no colo com a mamadeira (🧑🏼‍🍼) e aproximando a boca (radical de fala 讠) para perguntar com sorriso brincalhão ao bebezinho: "Diga lá, QUEM é o papai? QUEM é esse bebê lindo?". Toda vez que você vê 谁, lembre-se da pergunta de carinho: QUEM?',
    distractorPinyins: ['shénme', 'nǎr', 'zěnmeyàng'],
    distractorOptions: [
      { pinyin: 'shénme', translation: 'o que / que', pinyinRaw: 'shenme' },
      { pinyin: 'nǎr', translation: 'onde / aonde', pinyinRaw: 'nar' },
      { pinyin: 'zěnmeyàng', translation: 'como está / que tal', pinyinRaw: 'zenmeyang' },
    ],
    components: [
      {
        part: '讠(言)',
        pinyin: 'yán',
        name: 'A Fala do Pai',
        meaning: 'Palavras de pergunta em tom carinhoso',
        visualRole: 'A voz do pai perguntando com sorriso',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        part: '隹',
        pinyin: 'zhuī',
        name: 'O Bebê no Colo',
        meaning: 'Pequena criatura acolhida',
        visualRole: 'O neném curioso olhando para o pai',
        color: 'from-amber-500 to-orange-500'
      }
    ],
    exampleSentence: {
      hanzi: '他是谁？这支钢笔是谁的？',
      pinyin: 'Tā shì shéi? Zhè zhī gāngbǐ shì shéi de?',
      portuguese: 'Quem é ele? De quem é esta caneta?'
    },
    retentionTip: 'Pai falando com o bebê no colo (🧑🏼‍🍼) perguntando "Quem é o papai?" = quem (shéi)!',
    etymologyNote: 'Pronuncia-se comumente "shéi" em Pequim e no norte da China, e "shuí" no sul.'
  },

  // 10. 非常 (fēicháng) - 🙇🏼‍♂️
  {
    id: 'fc_feichang',
    hanzi: '非常',
    pinyin: 'fēicháng',
    pinyinRaw: 'feichang',
    translation: 'extremamente',
    emoji: '🙇🏼‍♂️',
    hintPhrase: 'O desenho simboliza algo realmente digno de reverência, ou seja algo EXTREMAMENTE significativo',
    hskLevel: 'HSK 2',
    category: 'Advérbio de Intensidade',
    visualDescription: 'A postura solene dos traços simétricos lembra uma pessoa curvada em reverência perante algo grandioso.',
    mnemonicStory: 'A simetria imponente e os traços veneráveis dos caracteres parecem uma pessoa se curvando numa reverência formal profunda (🙇🏼‍♂️). Quando alguém faz essa reverência solene, é porque está diante de algo sagrado, algo fora de série, EXTREMAMENTE significativo e extraordinário: 非常 (fēicháng)!',
    distractorPinyins: ['hěnduō', 'bǐjiào', 'tèbié'],
    distractorOptions: [
      { pinyin: 'hěnduō', translation: 'muitos / bastante', pinyinRaw: 'henduo' },
      { pinyin: 'bǐjiào', translation: 'relativamente', pinyinRaw: 'bijiao' },
      { pinyin: 'tèbié', translation: 'especialmente', pinyinRaw: 'tebie' },
    ],
    components: [
      {
        part: '非',
        pinyin: 'fēi',
        name: 'Extraordinário',
        meaning: 'Fora do comum, que transcende a média',
        visualRole: 'A grandeza que se destaca',
        color: 'from-rose-500 to-red-600'
      },
      {
        part: '常',
        pinyin: 'cháng',
        name: 'Cotidiano Superado',
        meaning: 'A rotina comum que é elevada pela reverência',
        visualRole: 'A inclinação respeitosa que rompe o banal',
        color: 'from-indigo-500 to-blue-600'
      }
    ],
    exampleSentence: {
      hanzi: '学中文非常有意思，也很有用。',
      pinyin: 'Xué Zhōngwén fēicháng yǒu yìsi, yě hěn yǒuyòng.',
      portuguese: 'Aprender chinês é extraordinariamente interessante e também muito útil.'
    },
    retentionTip: 'Postura de reverência (🙇🏼‍♂️) a algo grandioso = extremamente / fora do comum (fēicháng)!',
    etymologyNote: 'Literalmente: 非 (não) + 常 (comum) = não comum = extremamente extraordinário.'
  },

  // 11. 玩儿 (wánr / wan'r) - 🛝
  {
    id: 'fc_wanr',
    hanzi: '玩儿',
    pinyin: 'wánr',
    pinyinRaw: "wan'r",
    translation: 'brincar',
    emoji: '🛝',
    hintPhrase: 'Aqui vamos usar a imaginação e enxergar um escorregador no sufixo para lembrar da ideia de BRINCAR',
    hskLevel: 'HSK 2',
    category: 'Verbo de Lazer',
    visualDescription: 'O sufixo 儿 tem duas pernas curvas inclinadas que parecem a rampa curva e a escada de um escorregador.',
    mnemonicStory: 'Use a sua imaginação e olhe para o sufixo 儿: você enxerga perfeitamente a descida de um escorregador infantil (🛝) com suas duas perninhas de apoio! No topo de 玩 estão as peças de brinquedo e na base do escorregador a criançada deslizando e dando risada. Escorregador no sufixo = ideia pura de BRINCAR e se divertir: 玩儿 (wánr)!',
    distractorPinyins: ['pǎobù', 'yóuyǒng', 'chīfàn'],
    distractorOptions: [
      { pinyin: 'pǎobù', translation: 'correr', pinyinRaw: 'paobu' },
      { pinyin: 'yóuyǒng', translation: 'nadar', pinyinRaw: 'youyong' },
      { pinyin: 'chīfàn', translation: 'comer / almoçar', pinyinRaw: 'chifan' },
    ],
    components: [
      {
        part: '王 (玉)',
        pinyin: 'yù',
        name: 'Jade Brilhante',
        meaning: 'Pedrinhas preciosas lisas para brincar',
        visualRole: 'O brinquedo seguro nas mãos',
        color: 'from-emerald-500 to-teal-600'
      },
      {
        part: '元',
        pinyin: 'yuán',
        name: 'Criança Alegre',
        meaning: 'Alegria e vitalidade juvenil',
        visualRole: 'A criança animada no topo da rampa',
        color: 'from-amber-500 to-orange-500'
      },
      {
        part: '儿 (escorregador)',
        pinyin: 'ér',
        name: 'Escorregador',
        meaning: 'Rampa curva com perninhas',
        visualRole: 'O escorregador infantil do parquinho',
        color: 'from-pink-500 to-rose-500'
      }
    ],
    exampleSentence: {
      hanzi: '你想去哪儿玩儿？他喜欢玩儿。',
      pinyin: 'Nǐ xiǎng qù nǎr wánr? Tā xǐhuan wánr.',
      portuguese: 'Onde você quer ir se divertir? Ele gosta de brincar / curtir.'
    },
    retentionTip: 'Escorregador infantil no sufixo 儿 (🛝) = brincar / divertir-se (wánr / wan\'r)!',
    etymologyNote: 'O sufixo "er" 儿 dá o charme acolhedor e rotacizado típico do mandarim de Pequim.'
  },

  // 12. 比较 (bǐjiào) - ⚖️
  {
    id: 'fc_bijiao',
    hanzi: '比较',
    pinyin: 'bǐjiào',
    pinyinRaw: 'bijiao',
    translation: 'relativamente',
    emoji: '⚖️',
    hintPhrase: 'O formato de balança do sufixo nos ajuda a lembrar de comparação',
    hskLevel: 'HSK 2',
    category: 'Advérbio / Verbo',
    visualDescription: 'O sufixo 较 traz o eixo central e os pratos distribuídos de cada lado que desenham uma balança.',
    mnemonicStory: 'Olhe a estrutura do caractere 较: ele tem um eixo vertical central com duas hastes e pratos distribuídos de cada lado, lembrando perfeitamente uma balança de precisão (⚖️). Para que serve uma balança? Para pesar dois itens e COMPARAR qual é mais pesado ou mais leve: comparativamente, relativamente: 比较 (bǐjiào)!',
    distractorPinyins: ['yīyàng', 'chàbuduō', 'gèngjiā'],
    distractorOptions: [
      { pinyin: 'yīyàng', translation: 'igual / idêntico', pinyinRaw: 'yiyang' },
      { pinyin: 'chàbuduō', translation: 'quase igual', pinyinRaw: 'chabuduo' },
      { pinyin: 'gèngjiā', translation: 'ainda mais', pinyinRaw: 'gengjia' },
    ],
    components: [
      {
        part: '比',
        pinyin: 'bǐ',
        name: 'Pessoas Emparelhadas',
        meaning: 'Duas silhuetas lado a lado',
        visualRole: 'A aferição de alturas',
        color: 'from-blue-500 to-indigo-600'
      },
      {
        part: '较 (balança)',
        pinyin: 'jiào',
        name: 'Formato de Balança',
        meaning: 'Dois pratos pesando em equilíbrio',
        visualRole: 'Os dois pratos da balança comparando pesos',
        color: 'from-amber-500 to-yellow-600'
      }
    ],
    exampleSentence: {
      hanzi: '今天比较冷，我想喝一杯热茶。',
      pinyin: 'Jīntiān bǐjiào lěng, wǒ xiǎng hē yì bēi rè chá.',
      portuguese: 'Hoje está relativamente frio, gostaria de tomar um chá quente.'
    },
    retentionTip: 'Formato de balança no sufixo (⚖️) = pesar dois lados = comparação, relativamente (bǐjiào)!',
    etymologyNote: '比 compara diretamente A e B (A 比 B); 比较 atua como "relativamente" ou verbo comparar.'
  }
];
