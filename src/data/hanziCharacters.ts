import { HanziCharacter } from '../types';

export const HANZI_CHARACTERS: HanziCharacter[] = [
  {
    id: 'ni',
    hanzi: '你',
    pinyin: 'nǐ',
    translation: 'você',
    radical: '亻 (rénzìpáng - radical de pessoa)',
    radicalMeaning: 'Pessoa humana / Indivíduo',
    strokeCount: 7,
    hskLevel: 'HSK 1',
    category: 'Pronomes',
    strokeOrderRule: '从左到右 (Da esquerda para a direita): Primeiro o radical de pessoa亻, depois a parte direita 尔.',
    strokes: [
      { strokeNumber: 1, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado para a esquerda no radical', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 2, name: '竖 (Shù)', type: 'shu', description: 'Traço vertical do radical亻', directionGuide: 'De cima para baixo no meio da inclinação' },
      { strokeNumber: 3, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado superior à direita', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 4, name: '横撇/横钩 (Héngpiě)', type: 'zhe', description: 'Traço horizontal com dobra/gancho', directionGuide: 'Da esquerda para a direita e dobra para baixo' },
      { strokeNumber: 5, name: '竖钩 (Shùgōu)', type: 'gou', description: 'Traço vertical com gancho central', directionGuide: 'De cima para baixo com gancho para a esquerda' },
      { strokeNumber: 6, name: '撇 (Piě)', type: 'pie', description: 'Ponto ou traço inclinado à esquerda', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 7, name: '点 (Diǎn)', type: 'dian', description: 'Ponto final de equilíbrio à direita', directionGuide: 'Ponto firme para a direita' },
    ],
    compoundWords: [
      { hanzi: '你好', pinyin: 'nǐ hǎo', portuguese: 'Olá / Tudo bem' },
      { hanzi: '你们', pinyin: 'nǐmen', portuguese: 'Vocês' },
      { hanzi: '你的', pinyin: 'nǐ de', portuguese: 'Seu / Sua' }
    ]
  },
  {
    id: 'hao',
    hanzi: '好',
    pinyin: 'hǎo',
    translation: 'bom / bem',
    radical: '女 (nǚzìpáng - radical de mulher)',
    radicalMeaning: 'Mulher / Feminino (Mulher + Filho = Bom)',
    strokeCount: 6,
    hskLevel: 'HSK 1',
    category: 'Adjetivos',
    strokeOrderRule: '从左到右 (Da esquerda para a direita): Primeiro o radical de mulher 女 à esquerda, depois o filho 子 à direita.',
    strokes: [
      { strokeNumber: 1, name: '撇点 (Piědiǎn)', type: 'zhe', description: 'Inclinado para a esquerda virando ponto', directionGuide: 'De cima para esquerda e depois desce em ponto' },
      { strokeNumber: 2, name: '撇 (Piě)', type: 'pie', description: 'Segundo traço inclinado cruzando o anterior', directionGuide: 'De cima para baixo à esquerda' },
      { strokeNumber: 3, name: '提/横 (Tí/Héng)', type: 'ti', description: 'Traço horizontal ascendente que fecha o radical', directionGuide: 'Da esquerda para a direita subindo levemente' },
      { strokeNumber: 4, name: '横撇 (Héngpiě)', type: 'zhe', description: 'Horizontal superior com curva do filho 子', directionGuide: 'Horizontal e dobra para dentro' },
      { strokeNumber: 5, name: '弯钩 (Wāngōu)', type: 'gou', description: 'Traço curvado com gancho final para cima', directionGuide: 'Curva suave de cima para baixo com gancho' },
      { strokeNumber: 6, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal longo central', directionGuide: 'Firme da esquerda para a direita cortando' },
    ],
    compoundWords: [
      { hanzi: '好人', pinyin: 'hǎo rén', portuguese: 'Pessoa boa' },
      { hanzi: '好吃', pinyin: 'hǎochī', portuguese: 'Gostoso / Delicioso' },
      { hanzi: '好看', pinyin: 'hǎokàn', portuguese: 'Bonito(a) de se ver' }
    ]
  },
  {
    id: 'wo',
    hanzi: '我',
    pinyin: 'wǒ',
    translation: 'eu / mim',
    radical: '戈 (gē - arma antiga / lança)',
    radicalMeaning: 'Identidade / Defesa',
    strokeCount: 7,
    hskLevel: 'HSK 1',
    category: 'Pronomes',
    strokeOrderRule: '从上到下，从左到右 (De cima para baixo, da esquerda para a direita).',
    strokes: [
      { strokeNumber: 1, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado superior esquerdo curto', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 2, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal levemente inclinado', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 3, name: '竖钩 (Shùgōu)', type: 'gou', description: 'Traço vertical com gancho à esquerda', directionGuide: 'De cima para baixo com gancho' },
      { strokeNumber: 4, name: '提 (Tí)', type: 'ti', description: 'Traço ascendente saindo da esquerda', directionGuide: 'De baixo para cima à direita' },
      { strokeNumber: 5, name: '斜钩 (Xiégōu)', type: 'gou', description: 'Traço longo inclinado com gancho na ponta', directionGuide: 'Arco elegante da esquerda superior para direita inferior' },
      { strokeNumber: 6, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado curto sob a cruz', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 7, name: '点 (Diǎn)', type: 'dian', description: 'Ponto final superior direito', directionGuide: 'Ponto no topo à direita' },
    ],
    compoundWords: [
      { hanzi: '我们', pinyin: 'wǒmen', portuguese: 'Nós / A gente' },
      { hanzi: '我的', pinyin: 'wǒ de', portuguese: 'Meu / Minha' },
      { hanzi: '我家', pinyin: 'wǒ jiā', portuguese: 'Minha família / Minha casa' }
    ]
  },
  {
    id: 'shi',
    hanzi: '是',
    pinyin: 'shì',
    translation: 'ser / é / sim',
    radical: '日 (rì - sol / dia)',
    radicalMeaning: 'Sol / Clareza / Verbo fundamental',
    strokeCount: 9,
    hskLevel: 'HSK 1',
    category: 'Verbos',
    strokeOrderRule: '从上到下 (De cima para baixo): Primeiro o sol 日 no topo, depois a parte inferior 疋.',
    strokes: [
      { strokeNumber: 1, name: '竖 (Shù)', type: 'shu', description: 'Vertical esquerda do sol 日', directionGuide: 'De cima para baixo' },
      { strokeNumber: 2, name: '横折 (Héngzhé)', type: 'zhe', description: 'Horizontal superior virando vertical', directionGuide: 'Direita e desce formando o retângulo' },
      { strokeNumber: 3, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal interno do sol', directionGuide: 'Da esquerda para a direita no meio' },
      { strokeNumber: 4, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal que fecha o sol', directionGuide: 'Fecha a base do retângulo' },
      { strokeNumber: 5, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal longo intermediário', directionGuide: 'Longo da esquerda para a direita' },
      { strokeNumber: 6, name: '竖 (Shù)', type: 'shu', description: 'Traço vertical central curto', directionGuide: 'De cima para baixo no centro' },
      { strokeNumber: 7, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal esquerdo curto', directionGuide: 'Horizontal menor' },
      { strokeNumber: 8, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado descendente esquerdo', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 9, name: '捺 (Nà)', type: 'na', description: 'Traço longo descendente à direita com base firme', directionGuide: 'De cima para baixo à direita expandindo' },
    ],
    compoundWords: [
      { hanzi: '不是', pinyin: 'bù shì', portuguese: 'Não é / Não ser' },
      { hanzi: '可是', pinyin: 'kěshì', portuguese: 'Mas / Porém' },
      { hanzi: '是不是', pinyin: 'shì bu shì', portuguese: 'É ou não é?' }
    ]
  },
  {
    id: 'zhong',
    hanzi: '中',
    pinyin: 'zhōng',
    translation: 'meio / centro / China',
    radical: '丨 (gùn - traço vertical)',
    radicalMeaning: 'Centro / Flecha no alvo',
    strokeCount: 4,
    hskLevel: 'HSK 1',
    category: 'Substantivos',
    strokeOrderRule: '先外后里最后贯穿 (Primeiro a caixa 口, por último o traço vertical penetrante no centro 丨).',
    strokes: [
      { strokeNumber: 1, name: '竖 (Shù)', type: 'shu', description: 'Vertical esquerda do retângulo', directionGuide: 'De cima para baixo' },
      { strokeNumber: 2, name: '横折 (Héngzhé)', type: 'zhe', description: 'Horizontal superior e dobra vertical', directionGuide: 'Da esquerda para a direita e desce' },
      { strokeNumber: 3, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal que fecha o retângulo', directionGuide: 'Da esquerda para a direita na base' },
      { strokeNumber: 4, name: '竖 (Shù)', type: 'shu', description: 'Traço vertical longo que corta exatamente pelo centro', directionGuide: 'De cima até embaixo direto pelo meio' },
    ],
    compoundWords: [
      { hanzi: '中国', pinyin: 'Zhōngguó', portuguese: 'China' },
      { hanzi: '中文', pinyin: 'Zhōngwén', portuguese: 'Língua Chinesa' },
      { hanzi: '中午', pinyin: 'zhōngwǔ', portuguese: 'Meio-dia' }
    ]
  },
  {
    id: 'guo',
    hanzi: '国',
    pinyin: 'guó',
    translation: 'país / nação',
    radical: '囗 (wéizìkuāng - cercado)',
    radicalMeaning: 'Fronteira / Cercado que protege o tesouro de jade 玉',
    strokeCount: 8,
    hskLevel: 'HSK 1',
    category: 'Substantivos',
    strokeOrderRule: '先外后里再封口 (Primeiro o exterior, depois o interior 玉, fecha a porta por último).',
    strokes: [
      { strokeNumber: 1, name: '竖 (Shù)', type: 'shu', description: 'Traço vertical esquerdo da moldura', directionGuide: 'De cima para baixo' },
      { strokeNumber: 2, name: '横折 (Héngzhé)', type: 'zhe', description: 'Horizontal superior virando vertical', directionGuide: 'Direita e desce reto' },
      { strokeNumber: 3, name: '横 (Héng)', type: 'heng', description: 'Primeiro traço horizontal do jade 玉', directionGuide: 'Horizontal curto no topo interior' },
      { strokeNumber: 4, name: '竖 (Shù)', type: 'shu', description: 'Traço vertical central do jade', directionGuide: 'De cima para baixo no centro do jade' },
      { strokeNumber: 5, name: '横 (Héng)', type: 'heng', description: 'Segundo traço horizontal do jade', directionGuide: 'Horizontal no meio' },
      { strokeNumber: 6, name: '提/横 (Tí/Héng)', type: 'heng', description: 'Traço horizontal base do jade', directionGuide: 'Horizontal inferior do jade' },
      { strokeNumber: 7, name: '点 (Diǎn)', type: 'dian', description: 'Ponto precioso do jade 玉', directionGuide: 'Ponto inferior direito do jade' },
      { strokeNumber: 8, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal que fecha o cercado por baixo', directionGuide: 'Da esquerda para a direita selando a base' },
    ],
    compoundWords: [
      { hanzi: '国家', pinyin: 'guójiā', portuguese: 'País / Nação' },
      { hanzi: '外国人', pinyin: 'wàiguó rén', portuguese: 'Estrangeiro' },
      { hanzi: '英国', pinyin: 'Yīngguó', portuguese: 'Inglaterra' }
    ]
  },
  {
    id: 'ren',
    hanzi: '人',
    pinyin: 'rén',
    translation: 'pessoa / ser humano',
    radical: '人 (rén - pessoa)',
    radicalMeaning: 'Ser humano caminhando sobre duas pernas',
    strokeCount: 2,
    hskLevel: 'HSK 1',
    category: 'Substantivos',
    strokeOrderRule: '先撇后捺 (Primeiro a perna esquerda撇, depois a perna direita捺 apoiando).',
    strokes: [
      { strokeNumber: 1, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado da perna esquerda', directionGuide: 'Do topo para a esquerda em curva descendente' },
      { strokeNumber: 2, name: '捺 (Nà)', type: 'na', description: 'Traço inclinado da perna direita com apoio firme', directionGuide: 'Começa encostando no primeiro traço e desce para a direita' },
    ],
    compoundWords: [
      { hanzi: '大人', pinyin: 'dàrén', portuguese: 'Adulto' },
      { hanzi: '巴西人', pinyin: 'bāxī rén', portuguese: 'Brasileiro(a)' },
      { hanzi: '男人', pinyin: 'nánrén', portuguese: 'Homem' }
    ]
  },
  {
    id: 'da',
    hanzi: '大',
    pinyin: 'dà',
    translation: 'grande',
    radical: '大 (dà - grande)',
    radicalMeaning: 'Pessoa de braços e pernas abertos',
    strokeCount: 3,
    hskLevel: 'HSK 1',
    category: 'Adjetivos',
    strokeOrderRule: '先横后撇捺 (Primeiro os braços abertos 横, depois o corpo e pernas 撇 e 捺).',
    strokes: [
      { strokeNumber: 1, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal dos braços estendidos', directionGuide: 'Da esquerda para a direita no topo' },
      { strokeNumber: 2, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado descendente para a esquerda', directionGuide: 'Cruza o centro da linha horizontal descendo para a esquerda' },
      { strokeNumber: 3, name: '捺 (Nà)', type: 'na', description: 'Traço inclinado descendente para a direita', directionGuide: 'Parte do centro e desce com base larga para a direita' },
    ],
    compoundWords: [
      { hanzi: '大学', pinyin: 'dàxué', portuguese: 'Universidade' },
      { hanzi: '大家', pinyin: 'dàjiā', portuguese: 'Todos / Pessoal' },
      { hanzi: '多大', pinyin: 'duō dà', portuguese: 'Que idade? / Quão grande?' }
    ]
  },
  {
    id: 'xiao',
    hanzi: '小',
    pinyin: 'xiǎo',
    translation: 'pequeno',
    radical: '小 (xiǎo - pequeno)',
    radicalMeaning: 'Divisão em pequenas partes',
    strokeCount: 3,
    hskLevel: 'HSK 1',
    category: 'Adjetivos',
    strokeOrderRule: '先中间后两边 (Primeiro o centro vertical com gancho, depois os dois pontos laterais).',
    strokes: [
      { strokeNumber: 1, name: '竖钩 (Shùgōu)', type: 'gou', description: 'Traço vertical central com gancho à esquerda', directionGuide: 'De cima para baixo direto no centro com gancho' },
      { strokeNumber: 2, name: '撇 (Piě)', type: 'pie', description: 'Ponto inclinado à esquerda', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 3, name: '点 (Diǎn)', type: 'dian', description: 'Ponto equilibrador à direita', directionGuide: 'Ponto suave para a direita' },
    ],
    compoundWords: [
      { hanzi: '小姐', pinyin: 'xiǎojiě', portuguese: 'Senhorita' },
      { hanzi: '小猫', pinyin: 'xiǎomāo', portuguese: 'Gatinho' },
      { hanzi: '小时', pinyin: 'xiǎoshí', portuguese: 'Hora (duração)' }
    ]
  },
  {
    id: 'chi',
    hanzi: '吃',
    pinyin: 'chī',
    translation: 'comer',
    radical: '口 (kǒuzìpáng - boca)',
    radicalMeaning: 'Ações relacionadas à boca e ingestão',
    strokeCount: 6,
    hskLevel: 'HSK 1',
    category: 'Verbos',
    strokeOrderRule: '从左到右 (Primeiro a boca 口 à esquerda, depois a parte direita 乞).',
    strokes: [
      { strokeNumber: 1, name: '竖 (Shù)', type: 'shu', description: 'Vertical esquerda da boca 口', directionGuide: 'De cima para baixo' },
      { strokeNumber: 2, name: '横折 (Héngzhé)', type: 'zhe', description: 'Horizontal e dobra da boca', directionGuide: 'Direita e desce' },
      { strokeNumber: 3, name: '横 (Héng)', type: 'heng', description: 'Fecha a boca 口', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 4, name: '撇 (Piě)', type: 'pie', description: 'Inclinado superior direito', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 5, name: '横折 (Héngzhé)', type: 'zhe', description: 'Traço horizontal com dobra', directionGuide: 'Horizontal e desce' },
      { strokeNumber: 6, name: '竖弯钩 (Shùwāngōu)', type: 'gou', description: 'Traço vertical com curva arredondada e gancho para cima', directionGuide: 'Desce, faz curva na base e sobe em gancho' },
    ],
    compoundWords: [
      { hanzi: '吃饭', pinyin: 'chīfàn', portuguese: 'Fazer refeição / Comer' },
      { hanzi: '好吃', pinyin: 'hǎochī', portuguese: 'Delicioso / Gostoso' },
      { hanzi: '想吃', pinyin: 'xiǎng chī', portuguese: 'Querer comer' }
    ]
  },
  {
    id: 'he',
    hanzi: '喝',
    pinyin: 'hē',
    translation: 'beber',
    radical: '口 (kǒuzìpáng - boca)',
    radicalMeaning: 'Ingestão líquida pela boca',
    strokeCount: 12,
    hskLevel: 'HSK 1',
    category: 'Verbos',
    strokeOrderRule: '从左到右，从上到下 (Primeiro o radical de boca 口, depois a estrutura superior e inferior direita).',
    strokes: [
      { strokeNumber: 1, name: '竖 (Shù)', type: 'shu', description: 'Vertical da boca', directionGuide: 'De cima para baixo' },
      { strokeNumber: 2, name: '横折 (Héngzhé)', type: 'zhe', description: 'Horizontal e dobra da boca', directionGuide: 'Direita e desce' },
      { strokeNumber: 3, name: '横 (Héng)', type: 'heng', description: 'Fecha a boca', directionGuide: 'Esquerda para a direita' },
      { strokeNumber: 4, name: '日 - 竖 (Shù)', type: 'shu', description: 'Vertical do sol superior', directionGuide: 'De cima para baixo' },
      { strokeNumber: 5, name: '日 - 横折 (Héngzhé)', type: 'zhe', description: 'Dobra do sol', directionGuide: 'Direita e desce' },
      { strokeNumber: 6, name: '日 - 横 (Héng)', type: 'heng', description: 'Meio do sol', directionGuide: 'Horizontal' },
      { strokeNumber: 7, name: '日 - 横 (Héng)', type: 'heng', description: 'Fecha o sol', directionGuide: 'Horizontal' },
      { strokeNumber: 8, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado esquerdo inferior', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 9, name: '横折钩 (Héngzhégōu)', type: 'gou', description: 'Horizontal com gancho envolvente', directionGuide: 'Horizontal, dobra para baixo com gancho' },
      { strokeNumber: 10, name: '人 - 撇 (Piě)', type: 'pie', description: 'Inclinado do homem interior', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 11, name: '竖 (Shù)', type: 'shu', description: 'Vertical interior', directionGuide: 'De cima para baixo' },
      { strokeNumber: 12, name: '竖折/提 (Shùzhé)', type: 'zhe', description: 'Finalização da base', directionGuide: 'Desce e sobe suavemente' },
    ],
    compoundWords: [
      { hanzi: '喝水', pinyin: 'hē shuǐ', portuguese: 'Beber água' },
      { hanzi: '喝茶', pinyin: 'hē chá', portuguese: 'Beber chá' },
      { hanzi: '好喝', pinyin: 'hǎohē', portuguese: 'Bom de beber' }
    ]
  },
  {
    id: 'cha',
    hanzi: '茶',
    pinyin: 'chá',
    translation: 'chá',
    radical: '艹 (cǎozìtóu - radical de planta/erva)',
    radicalMeaning: 'Ervas e folhas da natureza',
    strokeCount: 9,
    hskLevel: 'HSK 1',
    category: 'Coisas',
    strokeOrderRule: '从上到下 (De cima para baixo): Folhas no topo 艹, pessoa no meio 人, tronco de madeira na base 木.',
    strokes: [
      { strokeNumber: 1, name: '横 (Héng)', type: 'heng', description: 'Horizontal da coroa de folhas', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 2, name: '竖 (Shù)', type: 'shu', description: 'Vertical esquerda da planta', directionGuide: 'De cima para baixo' },
      { strokeNumber: 3, name: '竖 (Shù)', type: 'shu', description: 'Vertical direita da planta', directionGuide: 'De cima para baixo' },
      { strokeNumber: 4, name: '撇 (Piě)', type: 'pie', description: 'Inclinado do homem no meio 人', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 5, name: '捺 (Nà)', type: 'na', description: 'Traço descendente direito do homem', directionGuide: 'De cima para a direita' },
      { strokeNumber: 6, name: '横 (Héng)', type: 'heng', description: 'Horizontal do galho inferior', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 7, name: '竖钩 (Shùgōu)', type: 'gou', description: 'Tronco vertical central com gancho', directionGuide: 'De cima para baixo no centro' },
      { strokeNumber: 8, name: '撇 (Piě)', type: 'pie', description: 'Raiz esquerda da árvore', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 9, name: '点 (Diǎn)', type: 'dian', description: 'Raiz direita em ponto', directionGuide: 'Ponto descendente à direita' },
    ],
    compoundWords: [
      { hanzi: '绿茶', pinyin: 'lǜchá', portuguese: 'Chá verde' },
      { hanzi: '红茶', pinyin: 'hóngchá', portuguese: 'Chá preto' },
      { hanzi: '茶馆', pinyin: 'cháguǎn', portuguese: 'Casa de chá' }
    ]
  },
  {
    id: 'shui',
    hanzi: '水',
    pinyin: 'shuǐ',
    translation: 'água',
    radical: '水 (shuǐ - água)',
    radicalMeaning: 'Água corrente / Fluxo de rio',
    strokeCount: 4,
    hskLevel: 'HSK 1',
    category: 'Coisas',
    strokeOrderRule: '先中间后两边 (Primeiro o fluxo central 竖钩, depois o lado esquerdo 横撇, e o lado direito 撇 e 捺).',
    strokes: [
      { strokeNumber: 1, name: '竖钩 (Shùgōu)', type: 'gou', description: 'Corrente central da água com gancho', directionGuide: 'Direto de cima para baixo no centro com gancho para a esquerda' },
      { strokeNumber: 2, name: '横撇 (Héngpiě)', type: 'zhe', description: 'Onda esquerda: horizontal com curva', directionGuide: 'Horizontal para a direita e dobra descendo para a esquerda' },
      { strokeNumber: 3, name: '撇 (Piě)', type: 'pie', description: 'Gota superior direita', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 4, name: '捺 (Nà)', type: 'na', description: 'Fluxo descendente direito', directionGuide: 'Começa no meio e desce suave para a direita' },
    ],
    compoundWords: [
      { hanzi: '水果', pinyin: 'shuǐguǒ', portuguese: 'Fruta' },
      { hanzi: '开水', pinyin: 'kāishuǐ', portuguese: 'Água fervida' },
      { hanzi: '雨水', pinyin: 'yǔshuǐ', portuguese: 'Água da chuva' }
    ]
  },
  {
    id: 'jia',
    hanzi: '家',
    pinyin: 'jiā',
    translation: 'família / casa / lar',
    radical: '宀 (bǎogàitóu - teto / telhado)',
    radicalMeaning: 'Telhado protegendo o porco/sustento (宀 + 豕 = Lar)',
    strokeCount: 10,
    hskLevel: 'HSK 1',
    category: 'Família',
    strokeOrderRule: '从上到下 (De cima para baixo): Primeiro o telhado 宀, depois o sustento 豕 no interior.',
    strokes: [
      { strokeNumber: 1, name: '点 (Diǎn)', type: 'dian', description: 'Ponto no topo do telhado', directionGuide: 'Ponto no topo central' },
      { strokeNumber: 2, name: '点 (Diǎn)', type: 'dian', description: 'Ponto esquerdo do telhado', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 3, name: '横钩 (Hénggōu)', type: 'gou', description: 'Traço horizontal do telhado com gancho', directionGuide: 'Horizontal longo com gancho na ponta direita' },
      { strokeNumber: 4, name: '横 (Héng)', type: 'heng', description: 'Primeiro traço sob o telhado', directionGuide: 'Horizontal curto' },
      { strokeNumber: 5, name: '撇 (Piě)', type: 'pie', description: 'Inclinado esquerdo da espinha', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 6, name: '弯钩 (Wāngōu)', type: 'gou', description: 'Espinha dorsal curvada com gancho', directionGuide: 'Curva central de cima para baixo' },
      { strokeNumber: 7, name: '撇 (Piě)', type: 'pie', description: 'Pata esquerda superior', directionGuide: 'Inclinado curto à esquerda' },
      { strokeNumber: 8, name: '撇 (Piě)', type: 'pie', description: 'Pata esquerda inferior', directionGuide: 'Inclinado mais longo à esquerda' },
      { strokeNumber: 9, name: '撇 (Piě)', type: 'pie', description: 'Traço direito intermediário', directionGuide: 'Inclinado suave' },
      { strokeNumber: 10, name: '捺 (Nà)', type: 'na', description: 'Pata traseira direita firme', directionGuide: 'Descendente para a direita' },
    ],
    compoundWords: [
      { hanzi: '家人', pinyin: 'jiārén', portuguese: 'Familiares' },
      { hanzi: '回家', pinyin: 'huíjiā', portuguese: 'Voltar para casa' },
      { hanzi: '国家', pinyin: 'guójiā', portuguese: 'País / Nação' }
    ]
  },
  {
    id: 'qian',
    hanzi: '钱',
    pinyin: 'qián',
    translation: 'dinheiro / moeda',
    radical: '钅 (jīnzìpáng - metal / ouro)',
    radicalMeaning: 'Metal / Moeda cunhada',
    strokeCount: 10,
    hskLevel: 'HSK 2',
    category: 'Coisas',
    strokeOrderRule: '从左到右 (Primeiro o metal 钅 à esquerda, depois o valor à direita 戋).',
    strokes: [
      { strokeNumber: 1, name: '撇 (Piě)', type: 'pie', description: 'Inclinado superior do metal', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 2, name: '横 (Héng)', type: 'heng', description: 'Primeiro traço horizontal', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 3, name: '横 (Héng)', type: 'heng', description: 'Segundo traço horizontal', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 4, name: '竖提 (Shùtí)', type: 'ti', description: 'Vertical com subida em traço ascendente', directionGuide: 'Desce e sobe afiado para a direita' },
      { strokeNumber: 5, name: '横 (Héng)', type: 'heng', description: 'Horizontal do lado direito', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 6, name: '斜钩 (Xiégōu)', type: 'gou', description: 'Traço longo arqueado com gancho', directionGuide: 'Arco descendente com gancho para cima' },
      { strokeNumber: 7, name: '撇 (Piě)', type: 'pie', description: 'Inclinado interior', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 8, name: '点 (Diǎn)', type: 'dian', description: 'Ponto superior direito', directionGuide: 'Ponto no topo à direita' },
      { strokeNumber: 9, name: '横 (Héng)', type: 'heng', description: 'Horizontal inferior', directionGuide: 'Horizontal curto' },
      { strokeNumber: 10, name: '撇 (Piě)', type: 'pie', description: 'Traço final inferior', directionGuide: 'Inclinado suave' },
    ],
    compoundWords: [
      { hanzi: '多少钱', pinyin: 'duōshao qián', portuguese: 'Quanto custa?' },
      { hanzi: '有钱', pinyin: 'yǒu qián', portuguese: 'Ter dinheiro / Rico' },
      { hanzi: '花钱', pinyin: 'huā qián', portuguese: 'Gastar dinheiro' }
    ]
  },
  {
    id: 'shi_num',
    hanzi: '十',
    pinyin: 'shí',
    translation: 'dez (10)',
    radical: '十 (shí - dez)',
    radicalMeaning: 'Totalidade e completude / Cruz cardinal',
    strokeCount: 2,
    hskLevel: 'HSK 1',
    category: 'Números',
    strokeOrderRule: '先横后竖 (Primeiro o traço horizontal 横, depois o traço vertical 竖 cortando).',
    strokes: [
      { strokeNumber: 1, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal equilibrado', directionGuide: 'Firme da esquerda para a direita no meio' },
      { strokeNumber: 2, name: '竖 (Shù)', type: 'shu', description: 'Traço vertical cortando perfeitamente ao centro', directionGuide: 'De cima para baixo cortando a linha horizontal' },
    ],
    compoundWords: [
      { hanzi: '十一', pinyin: 'shíyī', portuguese: 'Onze (11)' },
      { hanzi: '二十', pinyin: 'èrshí', portuguese: 'Vinte (20)' },
      { hanzi: '十块', pinyin: 'shí kuài', portuguese: 'Dez yuans' }
    ]
  },
  {
    id: 'qian_num',
    hanzi: '千',
    pinyin: 'qiān',
    translation: 'mil (1.000)',
    radical: '十 (shí - dez)',
    radicalMeaning: 'Milhar / Grande quantidade',
    strokeCount: 3,
    hskLevel: 'HSK 2',
    category: 'Números',
    strokeOrderRule: '从上到下 (De cima para baixo): Primeiro a inclinação superior 撇, depois a barra 横, e por fim a haste vertical 竖.',
    strokes: [
      { strokeNumber: 1, name: '撇 (Piě)', type: 'pie', description: 'Traço curto inclinado no topo', directionGuide: 'De cima para a esquerda' },
      { strokeNumber: 2, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal no meio', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 3, name: '竖 (Shù)', type: 'shu', description: 'Traço vertical cortando ao centro', directionGuide: 'De cima para baixo firme' },
    ],
    compoundWords: [
      { hanzi: '一千', pinyin: 'yī qiān', portuguese: 'Mil (1.000)' },
      { hanzi: '二千', pinyin: 'èr qiān', portuguese: 'Dois mil (2.000)' },
      { hanzi: '三千', pinyin: 'sān qiān', portuguese: 'Três mil (3.000)' }
    ]
  },
  {
    id: 'wan_num',
    hanzi: '万',
    pinyin: 'wàn',
    translation: 'dez mil (10.000 / wan)',
    radical: '一 (yī - um) / 勹',
    radicalMeaning: 'Miríade / Dez mil / Inumerável',
    strokeCount: 3,
    hskLevel: 'HSK 2',
    category: 'Números',
    strokeOrderRule: '先横后折再撇: Primeiro o traço horizontal superior 横, em seguida o gancho curvado 横折钩, e por fim o traço inclinado à esquerda 撇.',
    strokes: [
      { strokeNumber: 1, name: '横 (Héng)', type: 'heng', description: 'Traço horizontal superior', directionGuide: 'Da esquerda para a direita' },
      { strokeNumber: 2, name: '横折钩 (Héngzhégōu)', type: 'gou', description: 'Traço horizontal com descida e gancho', directionGuide: 'Horizontal, dobra para baixo e gancho à esquerda' },
      { strokeNumber: 3, name: '撇 (Piě)', type: 'pie', description: 'Traço inclinado cruzando à esquerda', directionGuide: 'De cima para baixo à esquerda suave' },
    ],
    compoundWords: [
      { hanzi: '一万', pinyin: 'yī wàn', portuguese: 'Dez mil (10.000)' },
      { hanzi: '两万', pinyin: 'liǎng wàn', portuguese: 'Vinte mil (20.000)' },
      { hanzi: '万岁', pinyin: 'wàn suì', portuguese: 'Viva! / Longa vida' }
    ]
  }
];
