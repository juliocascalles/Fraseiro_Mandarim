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
  },

  // 13. 看 (kàn) - 🫡
  {
    id: 'fc_kan',
    hanzi: '看',
    pinyin: 'kàn',
    pinyinRaw: 'kan',
    translation: 'ver / olhar',
    emoji: '🫡',
    hintPhrase: 'A mão cobre o sol para poder VER melhor, como uma viseira.',
    hskLevel: 'HSK 1',
    category: 'Verbo de Percepção',
    visualDescription: 'A mão curvada (⺪/手) colocada sobre o olho (目) serve como uma viseira de guarda-sol para ver e focar o olhar.',
    mnemonicStory: 'Olhe a composição do ideograma 看: na parte superior está uma mão (radical 手/⺪) curvada sobre a fronte, e na parte inferior está o olho (目). É o gesto de levar a mão à testa como uma viseira contra a luz do sol para poder enxergar e VER melhor ao longe: 看 (kàn)!',
    distractorPinyins: ['tīng', 'shuō', 'xiǎng'],
    distractorOptions: [
      { pinyin: 'tīng', translation: 'ouvir / escutar', pinyinRaw: 'ting' },
      { pinyin: 'shuō', translation: 'falar / dizer', pinyinRaw: 'shuo' },
      { pinyin: 'xiǎng', translation: 'pensar / desejar', pinyinRaw: 'xiang' },
    ],
    components: [
      {
        part: '⺪ (手)',
        pinyin: 'shǒu',
        name: 'Mão como Viseira',
        meaning: 'Mão sobre a testa fazendo sombra',
        visualRole: 'A mão em concha cobrindo o sol',
        color: 'from-amber-500 to-orange-500'
      },
      {
        part: '目',
        pinyin: 'mù',
        name: 'Olho',
        meaning: 'O olho atento fitando o horizonte',
        visualRole: 'O olho mirando sob a viseira',
        color: 'from-blue-500 to-indigo-600'
      }
    ],
    exampleSentence: {
      hanzi: '我看了一本很有意思的书。',
      pinyin: 'Wǒ kànle yì běn hěn yǒu yìsi de shū.',
      portuguese: 'Eu li / vi um livro muito interessante.'
    },
    retentionTip: 'Mão sobre o olho como viseira (🫡) = ver / olhar (kàn)!',
    etymologyNote: 'Na etimologia clássica: 手 (mão) + 目 (olho) = olhar colocando a mão sobre os olhos.'
  },

  // 14. 我 (wǒ) - 👤 = Eu
  {
    id: 'fc_wo',
    hanzi: '我',
    pinyin: 'wǒ',
    pinyinRaw: 'wo',
    translation: 'eu',
    emoji: '👤',
    hintPhrase: 'Uma pessoa (👤) empunhando uma lâmina/lança para defender sua própria vida e identidade: "Eu"!',
    hskLevel: 'HSK 1',
    category: 'Pronome Pessoal',
    visualDescription: 'Silhueta de uma pessoa (👤) com uma lança defensiva erguida: representa a identidade própria, Eu.',
    mnemonicStory: 'O ideograma 我 era originalmente o desenho de uma antiga arma de mão (uma alabarda/lança). Quem empunha a arma para proteger sua integridade e declarar sua presença? "Eu"! O traço inclinado à esquerda é a mão firme e o lado direito é a lâmina guardando a própria pessoa: 我 (wǒ)!',
    distractorPinyins: ['nǐ', 'tā', 'men'],
    distractorOptions: [
      { pinyin: 'nǐ', translation: 'você', pinyinRaw: 'ni' },
      { pinyin: 'tā', translation: 'ele / ela', pinyinRaw: 'ta' },
      { pinyin: 'men', translation: 'sufixo de plural', pinyinRaw: 'men' },
    ],
    components: [
      {
        part: '扌/手',
        pinyin: 'shǒu',
        name: 'Mão Protetora',
        meaning: 'Mão empunhando a defesa',
        visualRole: 'A mão que se protege',
        color: 'from-amber-500 to-orange-500'
      },
      {
        part: '戈',
        pinyin: 'gē',
        name: 'Lança / Alabarda',
        meaning: 'Arma antiga que defende o território próprio',
        visualRole: 'A lâmina que delimita o Eu',
        color: 'from-rose-500 to-red-600'
      }
    ],
    exampleSentence: {
      hanzi: '我是巴西人。',
      pinyin: 'Wǒ shì Bāxīrén.',
      portuguese: 'Eu sou brasileiro.'
    },
    retentionTip: 'Pessoa com lança se defendendo (👤) = Eu (wǒ)!',
    etymologyNote: 'Na escrita dos oráculos, representava uma arma de defesa individual, que passou a significar a primeira pessoa "eu".'
  },

  // 15. 你 (nǐ) - 👉 = Você
  {
    id: 'fc_ni',
    hanzi: '你',
    pinyin: 'nǐ',
    pinyinRaw: 'ni',
    translation: 'você',
    emoji: '👉',
    hintPhrase: 'Uma pessoa (亻) apontando o dedo (👉) em direção ao seu interlocutor: "Você"!',
    hskLevel: 'HSK 1',
    category: 'Pronome Pessoal',
    visualDescription: 'O radical de pessoa em pé (亻) ao lado de 尔, indicando e apontando o dedo diretamente para você (👉).',
    mnemonicStory: 'À esquerda vemos a silhueta de uma pessoa em pé (亻); à direita está 尔 (aproximação e direcionamento). É o gesto de dirigir a palavra e apontar o dedo para quem está logo à sua frente: você: 你 (nǐ)!',
    distractorPinyins: ['wǒ', 'tā', 'nín'],
    distractorOptions: [
      { pinyin: 'wǒ', translation: 'eu', pinyinRaw: 'wo' },
      { pinyin: 'tā', translation: 'ele / ela', pinyinRaw: 'ta' },
      { pinyin: 'nín', translation: 'o senhor / a senhora (formal)', pinyinRaw: 'nin' },
    ],
    components: [
      {
        part: '亻',
        pinyin: 'rén',
        name: 'Pessoa em Pé',
        meaning: 'Ser humano dialogando',
        visualRole: 'A pessoa interlocutora',
        color: 'from-blue-500 to-indigo-600'
      },
      {
        part: '尔',
        pinyin: 'ěr',
        name: 'Aproximação',
        meaning: 'Direcionar a atenção a alguém',
        visualRole: 'O dedo apontando para quem ouve',
        color: 'from-emerald-500 to-teal-600'
      }
    ],
    exampleSentence: {
      hanzi: '你好！很高兴认识你。',
      pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.',
      portuguese: 'Olá! Muito prazer em te conhecer.'
    },
    retentionTip: 'Pessoa apontando o dedo (👉) = Você (nǐ)!',
    etymologyNote: 'Formado pelo radical 亻 (pessoa) + o fonético 尔 (ěr, arcaico para tu/você).'
  },

  // 16. 水 (shuǐ) - 💧 = Água
  {
    id: 'fc_shui',
    hanzi: '水',
    pinyin: 'shuǐ',
    pinyinRaw: 'shui',
    translation: 'água',
    emoji: '💧',
    hintPhrase: 'Uma corrente central fluindo com gotas e borrifos d’água (💧) caindo de cada lado.',
    hskLevel: 'HSK 1',
    category: 'Substantivo',
    visualDescription: 'O curso vertical de um riacho com respingos e gotículas de água fresca (💧) de ambos os lados.',
    mnemonicStory: 'Nos ideogramas mais antigos, 水 era o desenho estilizado de um riacho correndo no centro, rodeado por pequenas gotículas de água borrifando dos lados. O fluido essencial de toda a vida: água: 水 (shuǐ)!',
    distractorPinyins: ['chá', 'bīng', 'huǒ'],
    distractorOptions: [
      { pinyin: 'chá', translation: 'chá', pinyinRaw: 'cha' },
      { pinyin: 'bīng', translation: 'gelo', pinyinRaw: 'bing' },
      { pinyin: 'huǒ', translation: 'fogo', pinyinRaw: 'huo' },
    ],
    components: [
      {
        part: '亅',
        pinyin: 'jué',
        name: 'Corrente Central',
        meaning: 'O leito do rio descendo com força',
        visualRole: 'O fluxo principal da água',
        color: 'from-cyan-500 to-blue-600'
      },
      {
        part: '㇇/㇏',
        pinyin: 'diǎn/piě',
        name: 'Gotículas de Água',
        meaning: 'Respingos e borrifos fluindo',
        visualRole: 'As gotas saltando das margens',
        color: 'from-sky-400 to-blue-500'
      }
    ],
    exampleSentence: {
      hanzi: '我想喝一杯水。',
      pinyin: 'Wǒ xiǎng hē yì bēi shuǐ.',
      portuguese: 'Eu gostaria de beber um copo d’água.'
    },
    retentionTip: 'Riacho ondulado com gotas (💧) = Água (shuǐ)!',
    etymologyNote: 'Pictograma original de um riacho sinuoso com respingos de água nas duas margens.'
  },

  // 17. 茶 (chá) - 🍵 = Chá
  {
    id: 'fc_cha',
    hanzi: '茶',
    pinyin: 'chá',
    pinyinRaw: 'cha',
    translation: 'chá',
    emoji: '🍵',
    hintPhrase: 'Folhas de erva no topo (艹), pessoa apreciando sob o abrigo (人), e ramos da planta na base (木) (🍵).',
    hskLevel: 'HSK 1',
    category: 'Substantivo',
    visualDescription: 'A planta de folhas medicinais (艹) colhida por uma pessoa (人) dos galhos de um arbusto (木) em uma tigela de chá (🍵).',
    mnemonicStory: 'Observe as camadas de cima para baixo: no topo estão as folhas de erva verde (radical 艹); no meio está uma pessoa (人) abrigada desfrutando o aroma; na base está o tronco do arbusto de camélia (木). Da folha colhida até a infusão perfumada: chá: 茶 (chá)!',
    distractorPinyins: ['kāfēi', 'shuǐ', 'jiǔ'],
    distractorOptions: [
      { pinyin: 'kāfēi', translation: 'café', pinyinRaw: 'kafei' },
      { pinyin: 'shuǐ', translation: 'água', pinyinRaw: 'shui' },
      { pinyin: 'jiǔ', translation: 'bebida / vinho', pinyinRaw: 'jiu' },
    ],
    components: [
      {
        part: '艹',
        pinyin: 'cǎo',
        name: 'Folhas de Erva',
        meaning: 'Brotos e folhas verdes de chá',
        visualRole: 'As folhas aromáticas em infusão',
        color: 'from-emerald-500 to-green-600'
      },
      {
        part: '人',
        pinyin: 'rén',
        name: 'Pessoa',
        meaning: 'O apreciador que prepara o chá',
        visualRole: 'A pessoa desfrutando a bebida',
        color: 'from-amber-600 to-yellow-600'
      },
      {
        part: '木',
        pinyin: 'mù',
        name: 'Madeira / Arbusto',
        meaning: 'A árvore viva que produz os brotos',
        visualRole: 'O ramo fértil de chá',
        color: 'from-amber-800 to-yellow-800'
      }
    ],
    exampleSentence: {
      hanzi: '中国人很喜欢喝绿茶。',
      pinyin: 'Zhōngguórén hěn xǐhuan hē lǜchá.',
      portuguese: 'Os chineses gostam muito de beber chá verde.'
    },
    retentionTip: 'Ervas + pessoa + ramos (🍵) = Chá (chá)!',
    etymologyNote: 'Derivado do caractere antigo 荼 (erva amarga), simplificado na dinastia Tang para representar o chá cultivado.'
  },

  // 18. 吃 (chī) - 🍎 = Comer
  {
    id: 'fc_chi',
    hanzi: '吃',
    pinyin: 'chī',
    pinyinRaw: 'chi',
    translation: 'comer',
    emoji: '🍎',
    hintPhrase: 'A boca aberta (口) pronta para morder uma maçã saborosa (🍎) ou saborear uma refeição.',
    hskLevel: 'HSK 1',
    category: 'Verbo de Ação',
    visualDescription: 'Uma boca bem aberta (口) ao lado do gesto de mastigar e engolir alimentos saborosos (🍎).',
    mnemonicStory: 'À esquerda vemos a boca aberta (口); à direita temos 乞 (pedir / aspirar), indicando o anseio biológico por nutrição. Abrir a boca para morder uma bela maçã e engolir comida: comer: 吃 (chī)!',
    distractorPinyins: ['hē', 'kàn', 'mǎi'],
    distractorOptions: [
      { pinyin: 'hē', translation: 'beber', pinyinRaw: 'he' },
      { pinyin: 'kàn', translation: 'olhar / ver', pinyinRaw: 'kan' },
      { pinyin: 'mǎi', translation: 'comprar', pinyinRaw: 'mai' },
    ],
    components: [
      {
        part: '口',
        pinyin: 'kǒu',
        name: 'Boca',
        meaning: 'Abertura para mastigar e saborear',
        visualRole: 'A boca aberta para morder',
        color: 'from-red-500 to-rose-600'
      },
      {
        part: '乞',
        pinyin: 'qǐ',
        name: 'Apetite / Anseio',
        meaning: 'Desejo de receber alimento',
        visualRole: 'A comida sendo engolida',
        color: 'from-amber-500 to-orange-500'
      }
    ],
    exampleSentence: {
      hanzi: '我们一起吃午饭吧。',
      pinyin: 'Wǒmen yìqǐ chī wǔfàn ba.',
      portuguese: 'Vamos almoçar juntos.'
    },
    retentionTip: 'Boca aberta na maçã (🍎) = Comer (chī)!',
    etymologyNote: 'Originalmente 吃 significava gaguejar; com o tempo substituiu o caractere arcaico 喫 como verbo principal para comer.'
  },

  // 19. 喝 (hē) - 🥤 = Beber
  {
    id: 'fc_he',
    hanzi: '喝',
    pinyin: 'hē',
    pinyinRaw: 'he',
    translation: 'beber',
    emoji: '🥤',
    hintPhrase: 'A boca (口) matando a sede sob o sol ardente (日) com um copo refrescante (🥤).',
    hskLevel: 'HSK 1',
    category: 'Verbo de Ação',
    visualDescription: 'A boca (口) com sede sob o calor do sol (日), sugando bebida gelada pelo canudo (🥤).',
    mnemonicStory: 'À esquerda está o radical de boca (口); à direita encontramos o sol ardente (日) e alguém suando de calor que precisa de líquido para se reidratar. Abrir a boca para sorver e matar a sede: beber: 喝 (hē)!',
    distractorPinyins: ['chī', 'shuō', 'xiě'],
    distractorOptions: [
      { pinyin: 'chī', translation: 'comer', pinyinRaw: 'chi' },
      { pinyin: 'shuō', translation: 'falar', pinyinRaw: 'shuo' },
      { pinyin: 'xiě', translation: 'escrever', pinyinRaw: 'xie' },
    ],
    components: [
      {
        part: '口',
        pinyin: 'kǒu',
        name: 'Boca',
        meaning: 'Lábios que sugam a bebida',
        visualRole: 'A boca ingerindo líquido',
        color: 'from-blue-500 to-indigo-600'
      },
      {
        part: '日',
        pinyin: 'rì',
        name: 'Sol Ardente',
        meaning: 'Calor do meio-dia dando sede',
        visualRole: 'O sol que provoca a sede',
        color: 'from-amber-500 to-orange-500'
      },
      {
        part: '匃',
        pinyin: 'gài',
        name: 'Sede / Alívio',
        meaning: 'Procura por alívio da sede',
        visualRole: 'O copo refrescante saciando a sede',
        color: 'from-cyan-500 to-teal-500'
      }
    ],
    exampleSentence: {
      hanzi: '天气很热，多喝点水吧。',
      pinyin: 'Tiānqì hěn rè, duō hē diǎn shuǐ ba.',
      portuguese: 'O tempo está muito quente, beba mais água.'
    },
    retentionTip: 'Boca matando a sede do sol (🥤) = Beber (hē)!',
    etymologyNote: 'Radical 口 (boca) + 曷 (hé, fonético indicando anseio ardente por bebida).'
  },

  // 20. 猫 (māo) - 🐱 = Gato
  {
    id: 'fc_mao',
    hanzi: '猫',
    pinyin: 'māo',
    pinyinRaw: 'mao',
    translation: 'gato',
    emoji: '🐱',
    hintPhrase: 'Animal ágil (犭) protegendo os brotos do campo (苗) miando "māo" (🐱).',
    hskLevel: 'HSK 1',
    category: 'Substantivo',
    visualDescription: 'O radical de animal com patas ágeis (犭) ao lado de 苗 (broto verde nos campos), o felino que caça roedores e faz "māo" (🐱).',
    mnemonicStory: 'À esquerda temos o radical de animal quadrúpede ágil (犭); à direita está 苗 (brotos e campos de cultivo). O gato foi adotado na China para caçar roedores que ameaçavam as colheitas dos campos, e seu nome "māo" soa como um perfeito miado de felino: gato: 猫 (māo)!',
    distractorPinyins: ['gǒu', 'niǎo', 'yú'],
    distractorOptions: [
      { pinyin: 'gǒu', translation: 'cachorro', pinyinRaw: 'gou' },
      { pinyin: 'niǎo', translation: 'pássaro', pinyinRaw: 'niao' },
      { pinyin: 'yú', translation: 'peixe', pinyinRaw: 'yu' },
    ],
    components: [
      {
        part: '犭',
        pinyin: 'quǎn',
        name: 'Animal de Caça',
        meaning: 'Patas ágeis e cauda flexível',
        visualRole: 'O corpo ágil do felino',
        color: 'from-amber-500 to-orange-600'
      },
      {
        part: '苗',
        pinyin: 'miáo',
        name: 'Broto no Campo',
        meaning: 'As plantações protegidas pelo gato',
        visualRole: 'O campo que o gato patrulha',
        color: 'from-emerald-500 to-green-600'
      }
    ],
    exampleSentence: {
      hanzi: '这只黑猫在睡觉。',
      pinyin: 'Zhè zhī hēi māo zài shuìjiào.',
      portuguese: 'Este gato preto está dormindo.'
    },
    retentionTip: 'Animal nos brotos que mia māo (🐱) = Gato (māo)!',
    etymologyNote: 'Composto fono-semântico: 犭 (animal) + 苗 (miáo, fonético evocando o som do miado).'
  },

  // 21. 狗 (gǒu) - 🐶 = Cachorro
  {
    id: 'fc_gou',
    hanzi: '狗',
    pinyin: 'gǒu',
    pinyinRaw: 'gou',
    translation: 'cachorro',
    emoji: '🐶',
    hintPhrase: 'Animal quadrúpede fiel (犭) vigiando a porta em guarda protetora (句) (🐶).',
    hskLevel: 'HSK 1',
    category: 'Substantivo',
    visualDescription: 'O radical de animal de patas (犭) ao lado de 句, o cão guardião leal de orelhas atentas abanando o rabo (🐶).',
    mnemonicStory: 'À esquerda vemos o radical de animal com patas e cauda (犭); à direita temos 句 (que traz a ideia de recolher/proteger com o focinho). O amigo fiel de quatro patas que guarda a casa e abana o rabo com lealdade: cachorro / cão: 狗 (gǒu)!',
    distractorPinyins: ['māo', 'mǎ', 'zhū'],
    distractorOptions: [
      { pinyin: 'māo', translation: 'gato', pinyinRaw: 'mao' },
      { pinyin: 'mǎ', translation: 'cavalo', pinyinRaw: 'ma' },
      { pinyin: 'zhū', translation: 'porco', pinyinRaw: 'zhu' },
    ],
    components: [
      {
        part: '犭',
        pinyin: 'quǎn',
        name: 'Animal de Quatro Patas',
        meaning: 'Silhueta canina leal',
        visualRole: 'O animal de pata leal',
        color: 'from-amber-600 to-yellow-600'
      },
      {
        part: '句',
        pinyin: 'jù',
        name: 'Guarda e Alerta',
        meaning: 'Focinho e latido de guarda',
        visualRole: 'O focinho atento protegendo a casa',
        color: 'from-orange-500 to-red-500'
      }
    ],
    exampleSentence: {
      hanzi: '那只小狗非常可爱。',
      pinyin: 'Nà zhī xiǎo gǒu fēicháng kě\'ài.',
      portuguese: 'Aquele cachorrinho é extremamente fofo.'
    },
    retentionTip: 'Animal leal com focinho atento (🐶) = Cachorro (gǒu)!',
    etymologyNote: 'Composto fono-semântico: 犭 (canídeo) + 句 (gōu, fonético arcaico para filhote de cão).'
  },

  // 22. 不 (bù) - ❌ = Não (usado para negar ações no presente/futuro)
  {
    id: 'fc_bu',
    hanzi: '不',
    pinyin: 'bù',
    pinyinRaw: 'bu',
    translation: 'não (presente/futuro)',
    emoji: '❌',
    hintPhrase: 'Um traço de teto bloqueando a subida com pernas divergentes: o "X" de bloqueio (❌) para negar ações no presente/futuro.',
    hskLevel: 'HSK 1',
    category: 'Advérbio de Negação',
    visualDescription: 'Uma barra superior intransponível com traços que barram a passagem formando uma cruz de proibição (❌).',
    mnemonicStory: 'Imagine um pássaro tentando voar até o céu, mas batendo direto numa tampa horizontal intransponível: NÃO pode passar! É a palavra fundamental para negar intenções, vontades ou ações no presente e no futuro: não: 不 (bù)!',
    distractorPinyins: ['méi', 'bié', 'shì'],
    distractorOptions: [
      { pinyin: 'méi', translation: 'não / não ter (passado)', pinyinRaw: 'mei' },
      { pinyin: 'bié', translation: 'não faça (imperativo)', pinyinRaw: 'bie' },
      { pinyin: 'shì', translation: 'ser / sim', pinyinRaw: 'shi' },
    ],
    components: [
      {
        part: '一',
        pinyin: 'yī',
        name: 'Barreira Superior',
        meaning: 'Linha que veta a passagem',
        visualRole: 'O teto de bloqueio intransponível',
        color: 'from-rose-500 to-red-600'
      },
      {
        part: '𠂉/丨',
        pinyin: 'shù',
        name: 'Braços de Bloqueio',
        meaning: 'A cruz que cancela a ação',
        visualRole: 'O "X" que nega o movimento',
        color: 'from-red-600 to-rose-700'
      }
    ],
    exampleSentence: {
      hanzi: '我不是老师，我是学生。',
      pinyin: 'Wǒ bú shì lǎoshī, wǒ shì xuésheng.',
      portuguese: 'Eu não sou professor, sou estudante.'
    },
    retentionTip: 'Barreira cortando a ação (❌) = Não no presente/futuro (bù)!',
    etymologyNote: 'Pictograma original de um cálice de flor fechado, que por empréstimo fonético se tornou a negação universal 不.'
  },

  // 23. 没 (méi) - 🕳️ = Não / Não ter (usado para passado ou com o verbo 有)
  {
    id: 'fc_mei',
    hanzi: '没',
    pinyin: 'méi',
    pinyinRaw: 'mei',
    translation: 'não / não ter (passado/com 有)',
    emoji: '🕳️',
    hintPhrase: 'Três gotas d’água (氵) sumindo em um redemoinho vazio (🕳️): nada sobrou, "não ter" ou algo que "não ocorreu".',
    hskLevel: 'HSK 1',
    category: 'Advérbio / Verbo Negativo',
    visualDescription: 'Gotículas de água (氵) afundando num abismo sem fundo, deixando tudo vazio (🕳️): negação de existência (没有) ou de ações passadas.',
    mnemonicStory: 'À esquerda estão as gotas d’água (氵); à direita está uma mão submergindo no vazio. Originalmente significava sumir ou afundar na água. Se afundou e sumiu, agora NÃO TEM MAIS nada ou a ação no passado NÃO ACONTECEU: 没 (méi)!',
    distractorPinyins: ['bù', 'yǒu', 'wú'],
    distractorOptions: [
      { pinyin: 'bù', translation: 'não (presente / intenção)', pinyinRaw: 'bu' },
      { pinyin: 'yǒu', translation: 'ter / haver', pinyinRaw: 'you' },
      { pinyin: 'wú', translation: 'ausência (formal)', pinyinRaw: 'wu' },
    ],
    components: [
      {
        part: '氵',
        pinyin: 'shuǐ',
        name: 'Três Gotas',
        meaning: 'Água que afunda e escorre',
        visualRole: 'O líquido que some no abismo',
        color: 'from-blue-500 to-cyan-600'
      },
      {
        part: '殳',
        pinyin: 'shū',
        name: 'Gesto de Afundar',
        meaning: 'Mão submergindo nas profundezas',
        visualRole: 'O vazio sem fundo onde nada sobrou',
        color: 'from-slate-600 to-slate-800'
      }
    ],
    exampleSentence: {
      hanzi: '我今天没有去上班。',
      pinyin: 'Wǒ jīntiān méiyǒu qù shàngbān.',
      portuguese: 'Eu não fui trabalhar hoje.'
    },
    retentionTip: 'Água escorrendo para o vazio (🕳️) = Não ter / Não no passado (méi)!',
    etymologyNote: 'Radical 氵 (água) + 殳 (bater/afundar). Significado original: submergir na água até desaparecer.'
  },

  // 24. 很 (hěn) - 📈 = Muito (geralmente usado antes de adjetivos)
  {
    id: 'fc_hen',
    hanzi: '很',
    pinyin: 'hěn',
    pinyinRaw: 'hen',
    translation: 'muito (antes de adjetivos)',
    emoji: '📈',
    hintPhrase: 'Passos marchando na estrada (彳) subindo uma colina íngreme (艮), elevando o nível de intensidade (📈): muito!',
    hskLevel: 'HSK 1',
    category: 'Advérbio de Grau',
    visualDescription: 'Passo em marcha (彳) subindo o gráfico de intensidade (📈) até o topo do adjetivo.',
    mnemonicStory: 'O lado esquerdo traz o radical de passos firmes na estrada (彳); o lado direito é 艮 (olhar firme e resoluto). Indica passos que foram muito longe, elevando o nível da qualidade: muito bom (很好), muito grande (很大): muito: 很 (hěn)!',
    distractorPinyins: ['tài', 'dōu', 'fēicháng'],
    distractorOptions: [
      { pinyin: 'tài', translation: 'demais / excessivamente', pinyinRaw: 'tai' },
      { pinyin: 'dōu', translation: 'todos / tudo', pinyinRaw: 'dou' },
      { pinyin: 'fēicháng', translation: 'extremamente', pinyinRaw: 'feichang' },
    ],
    components: [
      {
        part: '彳',
        pinyin: 'chì',
        name: 'Passos na Estrada',
        meaning: 'Avanço contínuo e determinado',
        visualRole: 'Os passos marchando colina acima',
        color: 'from-indigo-500 to-blue-600'
      },
      {
        part: '艮',
        pinyin: 'gèn',
        name: 'Limite Superior',
        meaning: 'O topo elevado da intensidade',
        visualRole: 'O topo do gráfico de elevação',
        color: 'from-emerald-500 to-teal-600'
      }
    ],
    exampleSentence: {
      hanzi: '今天我很高兴。',
      pinyin: 'Jīntiān wǒ hěn gāoxìng.',
      portuguese: 'Hoje eu estou muito feliz.'
    },
    retentionTip: 'Passos subindo a escala (📈) = Muito (hěn)!',
    etymologyNote: 'Radical 彳 (passo) + 艮 (olhar firme). Na gramática chinesa conecta o sujeito aos adjetivos.'
  },

  // 25. 太 (tài) - 💥 = Demais / Excessivamente (ex: 太好了 - bom demais)
  {
    id: 'fc_tai',
    hanzi: '太',
    pinyin: 'tài',
    pinyinRaw: 'tai',
    translation: 'demais / excessivamente',
    emoji: '💥',
    hintPhrase: 'O ideograma de "Grande" (大) com um pingo extra de energia explosiva (丶) transbordando (💥): grande demais!',
    hskLevel: 'HSK 1',
    category: 'Advérbio de Intensidade',
    visualDescription: 'Uma pessoa de braços abertos "Grande" (大) com uma gota faiscante extra que explode de intensidade (💥): excessivo, demais!',
    mnemonicStory: 'Você já conhece o ideograma 大 (dà = grande, uma pessoa com braços e pernas abertos). Agora acrescente um ponto faiscante entre as pernas (丶): a grandeza transbordou os limites, tornou-se algo superlativo e explosivo! Ex: 太好了 (tài hǎo le - bom demais!): 太 (tài)!',
    distractorPinyins: ['hěn', 'dà', 'duō'],
    distractorOptions: [
      { pinyin: 'hěn', translation: 'muito', pinyinRaw: 'hen' },
      { pinyin: 'dà', translation: 'grande', pinyinRaw: 'da' },
      { pinyin: 'duō', translation: 'muito / quantidade', pinyinRaw: 'duo' },
    ],
    components: [
      {
        part: '大',
        pinyin: 'dà',
        name: 'Grande',
        meaning: 'Pessoa com braços abertos em extensão',
        visualRole: 'A base ampla e espaçosa',
        color: 'from-amber-500 to-orange-500'
      },
      {
        part: '丶',
        pinyin: 'diǎn',
        name: 'Gota Explosiva Extra',
        meaning: 'O pingo que faz a medida transbordar',
        visualRole: 'A faísca que explode os limites',
        color: 'from-red-500 to-rose-600'
      }
    ],
    exampleSentence: {
      hanzi: '太好了，我们一起去吧！',
      pinyin: 'Tài hǎo le, wǒmen yìqǐ qù ba!',
      portuguese: 'Bom demais, vamos juntos!'
    },
    retentionTip: 'Grande com um ponto que explode (💥) = Demais / Excessivamente (tài)!',
    etymologyNote: 'Variante intensificada de 大 (grande) com a adição do diacrítico 丶 para denotar grandeza extrema.'
  },

  // 26. 都 (dōu) - 👥 = Tudo / Todos
  {
    id: 'fc_dou',
    hanzi: '都',
    pinyin: 'dōu',
    pinyinRaw: 'dou',
    translation: 'tudo / todos',
    emoji: '👥',
    hintPhrase: 'Pessoas reunidas (者) na muralha da cidade (阝), congregando todo o povo junto (👥): todos!',
    hskLevel: 'HSK 1',
    category: 'Advérbio de Totalidade',
    visualDescription: 'A reunião de indivíduos com o radical de muralha de cidade (阝): toda a comunidade unida em conjunto (👥).',
    mnemonicStory: 'À esquerda temos 者 (as pessoas congregadas); à direita temos 阝 (a muralha de uma grande cidade/distrito). Representa a metrópole onde todos os cidadãos se unem sem deixar ninguém de fora: todos / tudo: 都 (dōu)!',
    distractorPinyins: ['yě', 'hěn', 'zhǐ'],
    distractorOptions: [
      { pinyin: 'yě', translation: 'também', pinyinRaw: 'ye' },
      { pinyin: 'hěn', translation: 'muito', pinyinRaw: 'hen' },
      { pinyin: 'zhǐ', translation: 'apenas / somente', pinyinRaw: 'zhi' },
    ],
    components: [
      {
        part: '者',
        pinyin: 'zhě',
        name: 'Pessoas Congregadas',
        meaning: 'Cidadãos reunidos em assembleia',
        visualRole: 'A multidão reunida',
        color: 'from-blue-500 to-indigo-600'
      },
      {
        part: '阝',
        pinyin: 'yì',
        name: 'Muralha da Cidade',
        meaning: 'O distrito urbano coletivo',
        visualRole: 'O espaço onde todos cabem juntos',
        color: 'from-purple-500 to-pink-600'
      }
    ],
    exampleSentence: {
      hanzi: '他们都是我的好朋友。',
      pinyin: 'Tāmen dōu shì wǒ de hǎo péngyou.',
      portuguese: 'Eles todos são meus bons amigos.'
    },
    retentionTip: 'Multidão dentro da cidade (👥) = Todos / Tudo (dōu)!',
    etymologyNote: 'Originalmente capital/cidade onde todos se juntam (pronunciado dū); como advérbio universal significa todos (dōu).'
  },

  // 27. 今天 (jīntiān) - 📍 = Hoje
  {
    id: 'fc_jintian',
    hanzi: '今天',
    pinyin: 'jīntiān',
    pinyinRaw: 'jintian',
    translation: 'hoje',
    emoji: '📍',
    hintPhrase: 'O teto acolhendo o presente momento (今) no grande céu do dia (天): fixando o pino no dia atual (📍)!',
    hskLevel: 'HSK 1',
    category: 'Substantivo de Tempo',
    visualDescription: '今 (o momento presente abrigado) junto a 天 (o dia sob o firmamento): o pino apontando para o HOJE (📍).',
    mnemonicStory: '今 significa o momento presente que estamos vivenciando agora sob o teto do mundo; 天 representa o céu aberto e o ciclo diário. O dia que estamos vivendo exatamente neste exato instante: hoje: 今天 (jīntiān)!',
    distractorPinyins: ['míngtiān', 'zuótiān', 'xiànzài'],
    distractorOptions: [
      { pinyin: 'míngtiān', translation: 'amanhã', pinyinRaw: 'mingtian' },
      { pinyin: 'zuótiān', translation: 'ontem', pinyinRaw: 'zuotian' },
      { pinyin: 'xiànzài', translation: 'agora', pinyinRaw: 'xianzai' },
    ],
    components: [
      {
        part: '今',
        pinyin: 'jīn',
        name: 'O Agora',
        meaning: 'O instante presente abrigado',
        visualRole: 'O momento que está acontecendo agora',
        color: 'from-amber-500 to-orange-500'
      },
      {
        part: '天',
        pinyin: 'tiān',
        name: 'Céu / Dia',
        meaning: 'O firmamento de 24 horas',
        visualRole: 'A luz do dia sobre nós',
        color: 'from-sky-500 to-blue-600'
      }
    ],
    exampleSentence: {
      hanzi: '今天星期六，我不用上班。',
      pinyin: 'Jīntiān xīngqīliù, wǒ bú yòng shàngbān.',
      portuguese: 'Hoje é sábado, não preciso trabalhar.'
    },
    retentionTip: 'O agora + o dia celeste (📍) = Hoje (jīntiān)!',
    etymologyNote: '今 (jīn, no presente) + 天 (tiān, dia celestial) = o dia presente.'
  },

  // 28. 明天 (míngtiān) - 🌅 = Amanhã
  {
    id: 'fc_mingtian',
    hanzi: '明天',
    pinyin: 'míngtiān',
    pinyinRaw: 'mingtian',
    translation: 'amanhã',
    emoji: '🌅',
    hintPhrase: 'O sol (日) e a lua (月) iluminando o céu (天): o amanhecer do novo dia brilhante que virá (🌅)!',
    hskLevel: 'HSK 1',
    category: 'Substantivo de Tempo',
    visualDescription: 'Sol (日) + Lua (月) formam o brilho da aurora (明) que abre o novo dia (天) de amanhã (🌅).',
    mnemonicStory: 'O sol se põe, a lua atravessa a noite, e no encontro da claridade cósmica surge o caractere 明 (brilhante / amanhecer). Junto com 天 (dia), representa o próximo dia ensolarado que virá com o novo nascer do sol: amanhã: 明天 (míngtiān)!',
    distractorPinyins: ['jīntiān', 'zuótiān', 'hòutiān'],
    distractorOptions: [
      { pinyin: 'jīntiān', translation: 'hoje', pinyinRaw: 'jintian' },
      { pinyin: 'zuótiān', translation: 'ontem', pinyinRaw: 'zuotian' },
      { pinyin: 'hòutiān', translation: 'depois de amanhã', pinyinRaw: 'houtian' },
    ],
    components: [
      {
        part: '日',
        pinyin: 'rì',
        name: 'Sol',
        meaning: 'Luz brilhante da manhã',
        visualRole: 'O astro que desperta a aurora',
        color: 'from-amber-400 to-yellow-500'
      },
      {
        part: '月',
        pinyin: 'yuè',
        name: 'Lua',
        meaning: 'A noite que dá lugar ao novo ciclo',
        visualRole: 'O astro noturno que completa o ciclo',
        color: 'from-blue-400 to-indigo-500'
      },
      {
        part: '天',
        pinyin: 'tiān',
        name: 'Céu / Dia',
        meaning: 'O próximo dia inteiro',
        visualRole: 'O firmamento do novo dia',
        color: 'from-sky-500 to-blue-600'
      }
    ],
    exampleSentence: {
      hanzi: '明天我们去看电影吧。',
      pinyin: 'Míngtiān wǒmen qù kàn diànyǐng ba.',
      portuguese: 'Amanhã vamos assistir a um filme.'
    },
    retentionTip: 'Sol + Lua + Dia (🌅) = Amanhã (míngtiān)!',
    etymologyNote: '明 (brilhante, junção de sol e lua) + 天 (dia) = o dia brilhante do porvir.'
  },

  // 29. 昨天 (zuótiān) - ⏳ = Ontem
  {
    id: 'fc_zuotian',
    hanzi: '昨天',
    pinyin: 'zuótiān',
    pinyinRaw: 'zuotian',
    translation: 'ontem',
    emoji: '⏳',
    hintPhrase: 'O sol (日) que já passou e ficou no passado (乍) na ampulheta do tempo (⏳): ontem!',
    hskLevel: 'HSK 1',
    category: 'Substantivo de Tempo',
    visualDescription: 'O sol do dia (日) ao lado de 乍 (passado repentino): os grãos da ampulheta que já caíram no dia anterior (⏳).',
    mnemonicStory: 'À esquerda temos o disco do sol (日); à direita está 乍 (que indica algo que acabou de acontecer e passou). O ciclo solar que já escorreu pelo vidro da ampulheta do tempo e já ficou para trás: ontem: 昨天 (zuótiān)!',
    distractorPinyins: ['jīntiān', 'míngtiān', 'qiántiān'],
    distractorOptions: [
      { pinyin: 'jīntiān', translation: 'hoje', pinyinRaw: 'jintian' },
      { pinyin: 'míngtiān', translation: 'amanhã', pinyinRaw: 'mingtian' },
      { pinyin: 'qiántiān', translation: 'anteontem', pinyinRaw: 'qiantian' },
    ],
    components: [
      {
        part: '日',
        pinyin: 'rì',
        name: 'Sol Passado',
        meaning: 'O ciclo do sol que já se pôs',
        visualRole: 'O sol do dia antecedente',
        color: 'from-amber-500 to-orange-500'
      },
      {
        part: '乍',
        pinyin: 'zhà',
        name: 'Passado',
        meaning: 'Algo que já findou no tempo',
        visualRole: 'A areia escorrida da ampulheta',
        color: 'from-stone-500 to-slate-600'
      },
      {
        part: '天',
        pinyin: 'tiān',
        name: 'Dia',
        meaning: 'O ciclo de 24 horas transcorrido',
        visualRole: 'O dia que ficou na memória',
        color: 'from-sky-500 to-blue-600'
      }
    ],
    exampleSentence: {
      hanzi: '昨天晚上下了一场大雨。',
      pinyin: 'Zuótiān wǎnshang xiàle yì cháng dàyǔ.',
      portuguese: 'Ontem à noite caiu uma grande chuva.'
    },
    retentionTip: 'Sol escorrido na ampulheta (⏳) = Ontem (zuótiān)!',
    etymologyNote: '昨 (sol + 乍 como fonético e indicando passado) + 天 (dia) = o dia que passou.'
  },

  // 30. 星期 (xīngqī) - 📅 = semana
  {
    id: 'fc_xingqi',
    hanzi: '星期',
    pinyin: 'xīngqī',
    pinyinRaw: 'xingqi',
    translation: 'semana',
    emoji: '📅',
    hintPhrase: 'As estrelas (星) e os ciclos da lua (期) medidos na folha do calendário semanal (📅)!',
    hskLevel: 'HSK 1',
    category: 'Substantivo de Tempo',
    visualDescription: 'A contagem dos astros estelares (星) através dos períodos lunares (期): o ciclo de 7 dias do calendário (📅).',
    mnemonicStory: '星 é estrela (sol 日 + vida 生); 期 é o período medido pelo ciclo da lua (月). Os astrônomos organizavam as semanas observando os ciclos dos corpos celestes no firmamento: ciclo de 7 dias / semana: 星期 (xīngqī)!',
    distractorPinyins: ['yuè', 'nián', 'tiān'],
    distractorOptions: [
      { pinyin: 'yuè', translation: 'mês', pinyinRaw: 'yue' },
      { pinyin: 'nián', translation: 'ano', pinyinRaw: 'nian' },
      { pinyin: 'tiān', translation: 'dia', pinyinRaw: 'tian' },
    ],
    components: [
      {
        part: '星',
        pinyin: 'xīng',
        name: 'Estrela',
        meaning: 'Corpo celeste marcando o tempo',
        visualRole: 'Os astros do firmamento',
        color: 'from-yellow-400 to-amber-500'
      },
      {
        part: '期',
        pinyin: 'qī',
        name: 'Período Lunar',
        meaning: 'Intervalo de tempo delimitado',
        visualRole: 'A grade de dias no calendário',
        color: 'from-blue-500 to-indigo-600'
      }
    ],
    exampleSentence: {
      hanzi: '一个星期有七天。',
      pinyin: 'Yí ge xīngqī yǒu qī tiān.',
      portuguese: 'Uma semana tem sete dias.'
    },
    retentionTip: 'Estrelas no ciclo lunar (📅) = Semana (xīngqī)!',
    etymologyNote: 'Literalmente "período das estrelas", criado para traduzir o ciclo de sete dias da semana astrológica.'
  },

  // 31. 天气 (tiānqì) - 🌤️ = Clima / Tempo
  {
    id: 'fc_tianqi',
    hanzi: '天气',
    pinyin: 'tiānqì',
    pinyinRaw: 'tianqi',
    translation: 'clima / tempo',
    emoji: '🌤️',
    hintPhrase: 'O grande céu (天) onde as correntes de ar e vapor (气) dançam sob o sol entre nuvens (🌤️).',
    hskLevel: 'HSK 1',
    category: 'Substantivo',
    visualDescription: 'O firmamento celeste (天) respirando suas correntes de vento e energia atmosférica (气): o clima do dia (🌤️).',
    mnemonicStory: '天 é a abóbada do céu cobrindo toda a terra; 气 representa o vapor que se eleva e as correntes de ar atmosférico. A respiração contínua do céu que dita se temos frio, calor, vento ou brisa: tempo atmosférico / clima: 天气 (tiānqì)!',
    distractorPinyins: ['shíjiān', 'kōngqì', 'jìjié'],
    distractorOptions: [
      { pinyin: 'shíjiān', translation: 'tempo (horas / relógio)', pinyinRaw: 'shijian' },
      { pinyin: 'kōngqì', translation: 'ar', pinyinRaw: 'kongqi' },
      { pinyin: 'jìjié', translation: 'estação do ano', pinyinRaw: 'jijie' },
    ],
    components: [
      {
        part: '天',
        pinyin: 'tiān',
        name: 'Céu',
        meaning: 'O grande firmamento',
        visualRole: 'A atmosfera aberta',
        color: 'from-sky-500 to-blue-600'
      },
      {
        part: '气',
        pinyin: 'qì',
        name: 'Vapor / Ar',
        meaning: 'Correntes de ar e nuvens ondulantes',
        visualRole: 'As correntes de vento e umidade',
        color: 'from-teal-400 to-cyan-500'
      }
    ],
    exampleSentence: {
      hanzi: '北京今天天气真好。',
      pinyin: 'Běijīng jīntiān tiānqì zhēn hǎo.',
      portuguese: 'O tempo em Pequim está realmente bom hoje.'
    },
    retentionTip: 'Céu + correntes de ar (🌤️) = Clima / Tempo (tiānqì)!',
    etymologyNote: '天 (céu) + 气 (energia/vapor primordial da atmosfera) = condição climática.'
  },

  // 32. 下雨 (xiàyǔ) - 🌧️ = Chover / Chuvoso (lit: cair chuva)
  {
    id: 'fc_xiayu',
    hanzi: '下雨',
    pinyin: 'xiàyǔ',
    pinyinRaw: 'xiayu',
    translation: 'chover / chuvoso (cair chuva)',
    emoji: '🌧️',
    hintPhrase: 'Cair para baixo (下) a água do céu com a nuvem e 4 gotas pingando (雨) da nuvem chuvosa (🌧️).',
    hskLevel: 'HSK 1',
    category: 'Fenômeno Climático',
    visualDescription: 'A seta indicando para baixo (下) e a nuvem com 4 gotas despencando do céu (雨): chover (🌧️).',
    mnemonicStory: '下 significa "descer / cair para baixo"; 雨 é o pictograma milenar de uma nuvem densa no alto do céu com quatro gotas de chuva despencando vertiginosamente. Precipitação de água caindo do firmamento: chover: 下雨 (xiàyǔ)!',
    distractorPinyins: ['xiàxuě', 'guāfēng', 'qíngtiān'],
    distractorOptions: [
      { pinyin: 'xiàxuě', translation: 'nevar / cair neve', pinyinRaw: 'xiaxue' },
      { pinyin: 'guāfēng', translation: 'ventar', pinyinRaw: 'guafeng' },
      { pinyin: 'qíngtiān', translation: 'dia ensolarado', pinyinRaw: 'qingtian' },
    ],
    components: [
      {
        part: '下',
        pinyin: 'xià',
        name: 'Descer',
        meaning: 'Movimento de queda em direção ao solo',
        visualRole: 'A direção descendente das gotas',
        color: 'from-blue-600 to-indigo-700'
      },
      {
        part: '雨',
        pinyin: 'yǔ',
        name: 'Nuvem com Chuva',
        meaning: 'Pictograma da nuvem e gotas de água',
        visualRole: 'A nuvem cinzenta despejando água',
        color: 'from-cyan-500 to-blue-500'
      }
    ],
    exampleSentence: {
      hanzi: '外面下雨了，带把雨伞吧。',
      pinyin: 'Wàimiàn xiàyǔ le, dài bǎ yǔsǎn ba.',
      portuguese: 'Está chovendo lá fora, leve um guarda-chuva.'
    },
    retentionTip: 'Cair para baixo + nuvem com gotas (🌧️) = Chover (xiàyǔ)!',
    etymologyNote: '下 (descer) + 雨 (pictograma oracular de nuvem e gotas caindo) = cair chuva.'
  },

  // 33. 下雪 (xiàxuě) - ❄️ = Nevar / Nevoso (lit: cair neve)
  {
    id: 'fc_xiaxue',
    hanzi: '下雪',
    pinyin: 'xiàxuě',
    pinyinRaw: 'xiaxue',
    translation: 'nevar / nevoso (cair neve)',
    emoji: '❄️',
    hintPhrase: 'Cair para baixo (下) os flocos da nuvem (雨) varridos pela mão com vassoura (彐) como gelo (❄️).',
    hskLevel: 'HSK 1',
    category: 'Fenômeno Climático',
    visualDescription: 'A seta descendo (下) e a precipitação congelada da nuvem (雨) que se varre com as mãos (彐): cristais de neve (❄️).',
    mnemonicStory: '下 é a ação de descer; no ideograma 雪 temos no topo a chuva do céu (雨) e embaixo uma mão segurando uma vassoura (彐) limpando o tapete de flocos brancos acumulados. Quando gotas congeladas caem em flocos de cristal: nevar: 下雪 (xiàxuě)!',
    distractorPinyins: ['xiàyǔ', 'dǎléi', 'yīntiān'],
    distractorOptions: [
      { pinyin: 'xiàyǔ', translation: 'chover / cair chuva', pinyinRaw: 'xiayu' },
      { pinyin: 'dǎléi', translation: 'trovejar', pinyinRaw: 'dalei' },
      { pinyin: 'yīntiān', translation: 'dia nublado', pinyinRaw: 'yintian' },
    ],
    components: [
      {
        part: '下',
        pinyin: 'xià',
        name: 'Descer',
        meaning: 'Queda suave dos céus',
        visualRole: 'A descida serena dos flocos',
        color: 'from-slate-400 to-slate-600'
      },
      {
        part: '雨',
        pinyin: 'yǔ',
        name: 'Precipitação Celeste',
        meaning: 'Água que vem das nuvens altas',
        visualRole: 'O teto de nuvem fria',
        color: 'from-sky-400 to-cyan-500'
      },
      {
        part: '彐',
        pinyin: 'jì',
        name: 'Mão com Vassoura',
        meaning: 'Varrer a neve macia acumulada',
        visualRole: 'A limpeza dos flocos de gelo branco',
        color: 'from-indigo-300 to-blue-400'
      }
    ],
    exampleSentence: {
      hanzi: '哈尔滨冬天常常下雪。',
      pinyin: "Hā'ěrbīn dōngtiān chángcháng xiàxuě.",
      portuguese: 'No inverno de Harbin neva com frequência.'
    },
    retentionTip: 'Cair chuva congelada varrida (❄️) = Nevar (xiàxuě)!',
    etymologyNote: '下 (cair) + 雪 (chuva 雨 + vassoura 彐 para varrer a neve) = nevar.'
  },

  // 34. 热 (rè) - 🥵 = Quente / Calor
  {
    id: 'fc_re',
    hanzi: '热',
    pinyin: 'rè',
    pinyinRaw: 're',
    translation: 'quente / calor',
    emoji: '🥵',
    hintPhrase: 'Quatro labaredas de fogo vivo na base (灬) esquentando a terra e fazendo suar (🥵): quente!',
    hskLevel: 'HSK 1',
    category: 'Adjetivo',
    visualDescription: 'Os quatro pontos na base são labaredas de fogo vivo (灬) assando e aquecendo tudo com calor escaldante (🥵).',
    mnemonicStory: 'Olhe a base inferior do caractere: aqueles quatro pontinhos (灬) são o radical de fogo aceso (火)! Em cima está a terra plantada sendo intensamente aquecida pelas chamas. A temperatura elevada que queima, ferve e faz transpirar: quente / calor: 热 (rè)!',
    distractorPinyins: ['lěng', 'wēn', 'liáng'],
    distractorOptions: [
      { pinyin: 'lěng', translation: 'frio', pinyinRaw: 'leng' },
      { pinyin: 'wēn', translation: 'morno', pinyinRaw: 'wen' },
      { pinyin: 'liáng', translation: 'fresco', pinyinRaw: 'liang' },
    ],
    components: [
      {
        part: '执',
        pinyin: 'zhí',
        name: 'Terra Aquecida',
        meaning: 'Matéria exposta à alta caloria',
        visualRole: 'O objeto em ponto de fervura',
        color: 'from-amber-500 to-orange-600'
      },
      {
        part: '灬',
        pinyin: 'huǒ',
        name: 'Quatro Chamas de Fogo',
        meaning: 'Labaredas ardentes emitindo calor',
        visualRole: 'O fogo aceso esquentando tudo embaixo',
        color: 'from-red-500 to-rose-600'
      }
    ],
    exampleSentence: {
      hanzi: '夏天的时候天气非常热。',
      pinyin: 'Xiàtiān de shíhou tiānqì fēicháng rè.',
      portuguese: 'No verão o clima é extremamente quente.'
    },
    retentionTip: 'Quatro chamas de fogo na base (🥵) = Quente / Calor (rè)!',
    etymologyNote: 'Na forma antiga, uma pessoa segurando uma planta sobre as quatro labaredas de fogo (灬).'
  },

  // 35. 冷 (lěng) - 🥶 = Frio
  {
    id: 'fc_leng',
    hanzi: '冷',
    pinyin: 'lěng',
    pinyinRaw: 'leng',
    translation: 'frio',
    emoji: '🥶',
    hintPhrase: 'Os dois traços de gelo congelado à esquerda (冫) fazendo o corpo tiritar de tremedeira (🥶): frio!',
    hskLevel: 'HSK 1',
    category: 'Adjetivo',
    visualDescription: 'Os dois pingos de gelo pontiagudo (冫) ao lado da silhueta encolhida contra o vento gelado (🥶).',
    mnemonicStory: 'À esquerda vemos duas gotículas pontiagudas: é o radical de estalactite e gelo (冫)! À direita está 令 (sopro frio e cortante). Quando o ar gélido e as pedras de gelo tocam o corpo, os dentes batem e tiritamos: frio: 冷 (lěng)!',
    distractorPinyins: ['rè', 'nuǎnhuo', 'bīng'],
    distractorOptions: [
      { pinyin: 'rè', translation: 'quente / calor', pinyinRaw: 're' },
      { pinyin: 'nuǎnhuo', translation: 'quentinho / confortável', pinyinRaw: 'nuanhuo' },
      { pinyin: 'bīng', translation: 'gelo', pinyinRaw: 'bing' },
    ],
    components: [
      {
        part: '冫',
        pinyin: 'bīng',
        name: 'Radical de Gelo',
        meaning: 'Estalactites e cristais gelados',
        visualRole: 'O gelo cortante da esquerda',
        color: 'from-cyan-400 to-blue-500'
      },
      {
        part: '令',
        pinyin: 'lìng',
        name: 'Sopro Gélido',
        meaning: 'A rajada de vento que faz tremer',
        visualRole: 'O corpo encolhido de frio',
        color: 'from-indigo-400 to-slate-600'
      }
    ],
    exampleSentence: {
      hanzi: '今天太冷了，多穿件衣服。',
      pinyin: 'Jīntiān tài lěng le, duō chuān jiàn yīfu.',
      portuguese: 'Hoje está frio demais, vista mais uma roupa.'
    },
    retentionTip: 'Dois pingos de gelo tiritante (🥶) = Frio (lěng)!',
    etymologyNote: 'Radical 冫 (gelo) + 令 (lìng, fonético evocando o vento cortante de inverno).'
  },

  // 36. 晴天 (qíngtiān) - ☀️ = Dia ensolarado / Tempo limpo
  {
    id: 'fc_qingtian',
    hanzi: '晴天',
    pinyin: 'qíngtiān',
    pinyinRaw: 'qingtian',
    translation: 'dia ensolarado / tempo limpo',
    emoji: '☀️',
    hintPhrase: 'O sol radiante (日) brilhando num céu límpido de azul puro (青) sob o firmamento do dia (天) (☀️)!',
    hskLevel: 'HSK 1',
    category: 'Substantivo Climático',
    visualDescription: 'O disco solar luminoso (日) reinando sobre o azul puro da natureza (青) num esplêndido dia ensolarado (☀️).',
    mnemonicStory: '晴 traz à esquerda o astro rei solar (日) e à direita 青 (a cor azul e verde mais pura da natureza). Quando o sol brilha no horizonte sem nuvens para cobrir sua luz radiante, o céu fica todo azul: dia ensolarado / tempo limpo: 晴天 (qíngtiān)!',
    distractorPinyins: ['yīntiān', 'xiàyǔ', 'guāfēng'],
    distractorOptions: [
      { pinyin: 'yīntiān', translation: 'dia nublado / tempo fechado', pinyinRaw: 'yintian' },
      { pinyin: 'xiàyǔ', translation: 'chover', pinyinRaw: 'xiayu' },
      { pinyin: 'guāfēng', translation: 'ventania', pinyinRaw: 'guafeng' },
    ],
    components: [
      {
        part: '日',
        pinyin: 'rì',
        name: 'Sol Radiante',
        meaning: 'A luz que ilumina o mundo',
        visualRole: 'O disco de sol reluzente',
        color: 'from-amber-400 to-yellow-500'
      },
      {
        part: '青',
        pinyin: 'qīng',
        name: 'Azul Puro',
        meaning: 'A clareza limpa do céu aberto',
        visualRole: 'O firmamento azul desobstruído',
        color: 'from-sky-400 to-blue-500'
      },
      {
        part: '天',
        pinyin: 'tiān',
        name: 'Dia',
        meaning: 'O dia inteiro iluminado',
        visualRole: 'A luz que preenche a paisagem',
        color: 'from-blue-500 to-indigo-600'
      }
    ],
    exampleSentence: {
      hanzi: '今天是个晴天，阳光很好。',
      pinyin: 'Jīntiān shì ge qíngtiān, yángguāng hěn hǎo.',
      portuguese: 'Hoje é um dia ensolarado, a luz do sol está ótima.'
    },
    retentionTip: 'Sol + Céu azul límpido (☀️) = Dia ensolarado (qíngtiān)!',
    etymologyNote: '晴 (sol 日 + pureza 青) + 天 (dia) = dia sem nuvens com sol brilhante.'
  },

  // 37. 阴天 (yīntiān) - ☁️ = Dia nublado / Tempo fechado
  {
    id: 'fc_yintian',
    hanzi: '阴天',
    pinyin: 'yīntiān',
    pinyinRaw: 'yintian',
    translation: 'dia nublado / tempo fechado',
    emoji: '☁️',
    hintPhrase: 'A vertente na sombra da colina (阝) com nuvens densas cobrindo o céu (天) (☁️): dia nublado!',
    hskLevel: 'HSK 1',
    category: 'Substantivo Climático',
    visualDescription: 'A encosta na sombra (阝) com o princípio Yin (阴) cobrindo a luz do céu (天) com nuvens cinzentas (☁️).',
    mnemonicStory: '阴 representa o princípio de Yin — a sombra, a penumbra e o lado oculto da montanha (radical 阝) protegido do sol direto. Quando o firmamento inteiro se enche de nuvens densas e a luz solar fica bloqueada: dia nublado / tempo fechado: 阴天 (yīntiān)!',
    distractorPinyins: ['qíngtiān', 'xiàxuě', 'tiānqì'],
    distractorOptions: [
      { pinyin: 'qíngtiān', translation: 'dia ensolarado / tempo limpo', pinyinRaw: 'qingtian' },
      { pinyin: 'xiàxuě', translation: 'nevar', pinyinRaw: 'xiaxue' },
      { pinyin: 'tiānqì', translation: 'clima / tempo em geral', pinyinRaw: 'tianqi' },
    ],
    components: [
      {
        part: '阝',
        pinyin: 'fù',
        name: 'Encosta da Colina',
        meaning: 'A vertente que projeta sombra',
        visualRole: 'A barreira que esconde a luz do sol',
        color: 'from-slate-500 to-slate-700'
      },
      {
        part: '月/云',
        pinyin: 'yún',
        name: 'Sombra e Penumbra',
        meaning: 'O manto cinza das nuvens',
        visualRole: 'As nuvens espessas tapando o céu',
        color: 'from-stone-400 to-slate-500'
      },
      {
        part: '天',
        pinyin: 'tiān',
        name: 'Céu / Dia',
        meaning: 'A abóbada celeste encoberta',
        visualRole: 'O dia cinzento e fresco',
        color: 'from-blue-400 to-slate-500'
      }
    ],
    exampleSentence: {
      hanzi: '今天是阴天，没有太阳。',
      pinyin: 'Jīntiān shì yīntiān, méiyǒu tàiyáng.',
      portuguese: 'Hoje é um dia nublado, não tem sol.'
    },
    retentionTip: 'Sombra da colina sobre o céu (☁️) = Dia nublado (yīntiān)!',
    etymologyNote: '阴 (lado sombrio/yin da montanha) + 天 (dia) = dia encoberto por nuvens.'
  }
];

