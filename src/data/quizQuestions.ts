import { QuizQuestion, Word, HskLevel } from '../types';

export const CURATED_QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. Negação com "you" (有): méi vs bù
  {
    id: 'quiz_neg_you',
    type: 'fill_blank',
    portuguese: 'Eu não tenho trabalho / emprego.',
    categoryName: 'Negação & Verbos',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Regra de Negação com "yǒu" (有)',
    grammarExplanation: 'O verbo "yǒu" (有 - ter/haver) NUNCA aceita "bù" (不). A única negação gramatical permitida é "méi" (没), formando "méiyǒu" (没有).',
    prefixHanzi: '我',
    suffixHanzi: '有工作。',
    fullHanzi: '我没有工作。',
    fullPinyin: 'wǒ méi yǒu gōngzuò.',
    blankPinyinHint: 'méi',
    correctAnswerId: 'opt_mei',
    options: [
      {
        id: 'opt_mei',
        hanzi: '没',
        pinyin: 'méi',
        translation: 'não (para ter / passado)',
        isCorrect: true,
        explanation: 'Correto! "Yǒu" (有) só pode ser negado com "méi" (没). Dizer "bù yǒu" é um erro gramatical grave em mandarim.',
      },
      {
        id: 'opt_bu',
        hanzi: '不',
        pinyin: 'bù',
        translation: 'não (presente/futuro)',
        isCorrect: false,
        explanation: 'Incorreto! "Bù" (不) nega verbos de ação regulares e o verbo "shì" (是), mas JAMAIS pode ser combinado com "yǒu" (有). O correto é "méi yǒu" (没有).',
        grammarTip: {
          title: 'Ordem de Negação com 有 (yǒu)',
          ruleName: 'Incompatibilidade de 不 com 有',
          explanation: 'O verbo "yǒu" (有 - ter/haver) rejeita o advérbio "bù" (不). Para negar posse ou existência em chinês, a única forma correta é "méi yǒu" (没有).',
          solutionTip: 'Substitua "bù" por "méi" (没).',
          exampleCorrect: '我 没有 工作 (wǒ méi yǒu gōngzuò)',
          exampleIncorrect: '我 不 有 工作 (wǒ bù yǒu gōngzuò)',
        },
      },
      {
        id: 'opt_shi',
        hanzi: '是',
        pinyin: 'shì',
        translation: 'ser',
        isCorrect: false,
        explanation: 'Incorreto! "Shì" (是) é o verbo "ser". Colocá-lo aqui formaria "wǒ shì yǒu gōngzuò", o que não expressa uma negação.',
      },
      {
        id: 'opt_ye',
        hanzi: '也',
        pinyin: 'yě',
        translation: 'também',
        isCorrect: false,
        explanation: 'Incorreto! "Yě" (也) significa "também" e indicaria afirmação, não expressando "não tenho trabalho".',
      },
    ],
  },

  // 2. Classificador para membros da família: kǒu vs gè
  {
    id: 'quiz_class_kou',
    type: 'fill_blank',
    portuguese: 'Minha família tem quatro pessoas.',
    categoryName: 'Classificadores & Família',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Classificador Familiar "kǒu" (口)',
    grammarExplanation: 'Em mandarim, ao contar membros da família com o substantivo "rén" (人), o classificador tradicionalmente exigido é "kǒu" (口 - boca a alimentar), não números soltos.',
    prefixHanzi: '我家有四',
    suffixHanzi: '人。',
    fullHanzi: '我家有四口人。',
    fullPinyin: 'wǒ jiā yǒu sì kǒu rén.',
    blankPinyinHint: 'kǒu',
    correctAnswerId: 'opt_kou',
    options: [
      {
        id: 'opt_kou',
        hanzi: '口',
        pinyin: 'kǒu',
        translation: 'boca (classificador para família)',
        isCorrect: true,
        explanation: 'Exato! A fórmula padrão em chinês para membros da família é [Número] + 口 (kǒu) + 人 (rén).',
      },
      {
        id: 'opt_ge',
        hanzi: '个',
        pinyin: 'gè',
        translation: 'unidade (classificador genérico)',
        isCorrect: false,
        explanation: 'Incorreto no contexto tradicional familiar! Embora "gè" seja o classificador genérico, o padrão obrigatório ensinado no HSK para contar pessoas da própria casa/família é "kǒu" (口).',
        grammarTip: {
          title: 'Classificador de Membros da Família',
          ruleName: 'Numeral + 口 (kǒu) + 人 (rén)',
          explanation: 'Para contar integrantes de um núcleo familiar (jiā - 家), utiliza-se o classificador específico "kǒu" (口), originado da ideia de "bocas a alimentar".',
          solutionTip: 'Use "kǒu" quando a frase envolver "jiā" (casa/família) e contagem de pessoas.',
          exampleCorrect: '我家有四 口 人 (wǒ jiā yǒu sì kǒu rén)',
          exampleIncorrect: '我家有四 个 人 (em contexto familiar estrito HSK)',
        },
      },
      {
        id: 'opt_sui',
        hanzi: '岁',
        pinyin: 'suì',
        translation: 'anos de idade',
        isCorrect: false,
        explanation: 'Incorreto! "Suì" (岁) indica idade (anos de vida), não quantidade de pessoas em um lar.',
      },
      {
        id: 'opt_hen',
        hanzi: '很',
        pinyin: 'hěn',
        translation: 'muito',
        isCorrect: false,
        explanation: 'Incorreto! "Hěn" é um advérbio de grau e não pode ficar entre um numeral e um substantivo.',
      },
    ],
  },

  // 3. Posição da Partícula Interrogativa "ma" (吗)
  {
    id: 'quiz_part_ma',
    type: 'fill_blank',
    portuguese: 'Você é professor?',
    categoryName: 'Perguntas & Partículas',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Posição Final da Partícula Interrogativa "ma" (吗)',
    grammarExplanation: 'A partícula interrogativa "ma" (吗) transforma qualquer oração afirmativa em uma pergunta de sim/não. Ela se posiciona ESTRITAMENTE no final absoluto da frase.',
    prefixHanzi: '你是老师',
    suffixHanzi: '？',
    fullHanzi: '你是老师吗？',
    fullPinyin: 'nǐ shì lǎoshī ma?',
    blankPinyinHint: 'ma',
    correctAnswerId: 'opt_ma',
    options: [
      {
        id: 'opt_ma',
        hanzi: '吗',
        pinyin: 'ma',
        translation: 'partícula de pergunta sim/não',
        isCorrect: true,
        explanation: 'Perfeito! "Nǐ shì lǎoshī" (Você é professor) + "ma" (吗) ao final cria a pergunta "Você é professor?".',
      },
      {
        id: 'opt_shenme',
        hanzi: '什么',
        pinyin: 'shénme',
        translation: 'o quê / qual',
        isCorrect: false,
        explanation: 'Incorreto! "Shénme" (什么) é um pronome interrogativo de conteúdo e não pode ser colocado sozinho no final de uma frase que já tem objeto.',
        grammarTip: {
          title: 'Partícula Interrogativa no Fim da Frase',
          ruleName: 'Afirmação + 吗 (ma) = Pergunta Sim/Não',
          explanation: 'Para perguntas fechadas (resposta sim/não), acrescente "ma" (吗) ao final. Não use pronomes interrogativos como "shénme" quando o verbo e objeto já estão completos.',
          solutionTip: 'Adicione "ma" no final da oração afirmativa.',
          exampleCorrect: '你是老师 吗？ (nǐ shì lǎoshī ma?)',
          exampleIncorrect: '你是老师 什么？ (nǐ shì lǎoshī shénme?)',
        },
      },
      {
        id: 'opt_ba',
        hanzi: '吧',
        pinyin: 'ba',
        translation: 'sugestão / suposição (né?)',
        isCorrect: false,
        explanation: 'Incorreto! "Ba" (吧) serve para convites ou confirmação retórica ("Você é professor, né?"), enquanto a frase pede uma pergunta direta neutra.',
      },
      {
        id: 'opt_de',
        hanzi: '的',
        pinyin: 'de',
        translation: 'partícula de posse',
        isCorrect: false,
        explanation: 'Incorreto! "De" (的) indica posse ou relação modificadora, deixando a frase incompleta sem substantivo posterior.',
      },
    ],
  },

  // 4. Posição de Advérbios de Tempo/Inclusão: yě (也) antes do verbo
  {
    id: 'quiz_adv_ye',
    type: 'fill_blank',
    portuguese: 'Meu pai também gosta de café.',
    categoryName: 'Advérbios & Posição Sintática',
    hskLevel: 'HSK 2',
    grammarRuleTitle: 'Posição do Advérbio "yě" (也 - também)',
    grammarExplanation: 'Em mandarim, os advérbios (como "yě", "dōu", "hěn") SEMPRE precedem o verbo ou predicado. Eles NUNCA são colocados no final da oração como no português.',
    prefixHanzi: '我爸爸',
    suffixHanzi: '喜欢咖啡。',
    fullHanzi: '我爸爸也喜欢咖啡。',
    fullPinyin: 'wǒ bàba yě xǐhuan kāfēi.',
    blankPinyinHint: 'yě',
    correctAnswerId: 'opt_ye',
    options: [
      {
        id: 'opt_ye',
        hanzi: '也',
        pinyin: 'yě',
        translation: 'também (antes do verbo)',
        isCorrect: true,
        explanation: 'Exato! "Yě" (也) deve vir imediatamente antes do verbo "xǐhuan" (喜欢). No mandarim: Sujeito + yě + Verbo + Objeto.',
      },
      {
        id: 'opt_dou',
        hanzi: '都',
        pinyin: 'dōu',
        translation: 'todos (exige sujeito no plural)',
        isCorrect: false,
        explanation: 'Incorreto! "Dōu" (都) significa "todos" e exige que o sujeito seja plural (ex: "eles", "nós", "meus pais"). "Wǒ bàba" é singular.',
        grammarTip: {
          title: 'Advérbios 都 (dōu) vs 也 (yě)',
          ruleName: 'Concordância de Pluralidade com 都',
          explanation: '"Dōu" (都) resume um conjunto de pessoas ou elementos plurais. Para sujeitos singulares como "meu pai", usa-se "yě" (也 - também).',
          solutionTip: 'Use "yě" (也) para "também" com sujeito no singular.',
          exampleCorrect: '我爸爸 也 喜欢咖啡 (wǒ bàba yě xǐhuan kāfēi)',
          exampleIncorrect: '我爸爸 都 喜欢咖啡 (sujeito singular não aceita 都 sozinho)',
        },
      },
      {
        id: 'opt_kou',
        hanzi: '口',
        pinyin: 'kǒu',
        translation: 'classificador',
        isCorrect: false,
        explanation: 'Incorreto! "Kǒu" é um classificador de membros de família e só pode ser usado após um numeral.',
      },
      {
        id: 'opt_ma',
        hanzi: '吗',
        pinyin: 'ma',
        translation: 'partícula de pergunta',
        isCorrect: false,
        explanation: 'Incorreto! "Ma" (吗) só pode aparecer no final de perguntas, nunca entre o sujeito e o verbo.',
      },
    ],
  },

  // 5. Predicado Adjetival: adjetivos não usam "shì" (是), usam "hěn" (很)
  {
    id: 'quiz_adj_hen',
    type: 'fill_blank',
    portuguese: 'Eu estou muito bem.',
    categoryName: 'Predicado Adjetival',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Predicado Adjetival sem o verbo "shì" (是)',
    grammarExplanation: 'Em mandarim, adjetivos não necessitam do verbo de ligação "shì" (是). Em vez disso, são conectados ao sujeito por um advérbio de grau como "hěn" (很). Dizer "wǒ shì hǎo" é incorreto.',
    prefixHanzi: '我',
    suffixHanzi: '好。',
    fullHanzi: '我很好。',
    fullPinyin: 'wǒ hěn hǎo.',
    blankPinyinHint: 'hěn',
    correctAnswerId: 'opt_hen',
    options: [
      {
        id: 'opt_hen',
        hanzi: '很',
        pinyin: 'hěn',
        translation: 'muito (ligador adjetival)',
        isCorrect: true,
        explanation: 'Excelente! A estrutura [Sujeito + 很 + Adjetivo] é a forma padrão afirmativa de expressar estados e qualidades em mandarim.',
      },
      {
        id: 'opt_shi',
        hanzi: '是',
        pinyin: 'shì',
        translation: 'ser',
        isCorrect: false,
        explanation: 'Erro comum! Em chinês, adjetivos funcionam como verbos estativos e NUNCA recebem o verbo "shì" (是). Dizer "wǒ shì hǎo" é errado.',
        grammarTip: {
          title: 'Predicados Adjetivais no Mandarim',
          ruleName: 'Proibição de 是 (shì) antes de Adjetivos Simples',
          explanation: 'Adjetivos predicativos em mandarim não aceitam o verbo de ligação "shì". Para dizer que alguém "é" ou "está" [adjetivo], ligue o sujeito ao adjetivo usando o advérbio "hěn" (很).',
          solutionTip: 'Substitua "shì" pelo advérbio "hěn" (很).',
          exampleCorrect: '我 很 好 (wǒ hěn hǎo)',
          exampleIncorrect: '我 是 好 (wǒ shì hǎo)',
        },
      },
      {
        id: 'opt_zai',
        hanzi: '在',
        pinyin: 'zài',
        translation: 'estar em (localização)',
        isCorrect: false,
        explanation: 'Incorreto! "Zài" (在) indica localização física ("estar em um lugar") ou ação em andamento, não qualidade.',
      },
      {
        id: 'opt_you',
        hanzi: '有',
        pinyin: 'yǒu',
        translation: 'ter / haver',
        isCorrect: false,
        explanation: 'Incorreto! "Yǒu" indica posse ou existência ("eu tenho"), não estado.',
      },
    ],
  },

  // 6. Numeral com Classificador: liǎng (两) vs èr (二)
  {
    id: 'quiz_num_liang',
    type: 'fill_blank',
    portuguese: 'Eu tenho dois irmãos mais novos.',
    categoryName: 'Numerais & Classificadores',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Uso de "liǎng" (两) antes de Classificadores',
    grammarExplanation: 'Para indicar a quantidade de dois objetos ou pessoas antes de um classificador, usa-se obrigatoriamente "liǎng" (两). "Èr" (二) é reservado para contagem pura (1, 2, 3) ou números de telefone/séries.',
    prefixHanzi: '我有',
    suffixHanzi: '个弟弟。',
    fullHanzi: '我有两个弟弟。',
    fullPinyin: 'wǒ yǒu liǎng gè dìdi.',
    blankPinyinHint: 'liǎng',
    correctAnswerId: 'opt_liang',
    options: [
      {
        id: 'opt_liang',
        hanzi: '两',
        pinyin: 'liǎng',
        translation: 'dois (com classificadores)',
        isCorrect: true,
        explanation: 'Perfeito! Sempre que houver um classificador (como "gè"), o número 2 passa a ser "liǎng" (两).',
      },
      {
        id: 'opt_er',
        hanzi: '二',
        pinyin: 'èr',
        translation: 'dois (contagem ordinal/dígito)',
        isCorrect: false,
        explanation: 'Incorreto! "Èr" (二) só é usado na contagem numérica abstrata (yī, èr, sān...) ou em datas/números de telefone. Diante de classificador, usa-se "liǎng" (两).',
        grammarTip: {
          title: 'Distinção entre 两 (liǎng) e 二 (èr)',
          ruleName: '两 + Classificador + Substantivo',
          explanation: 'Para quantificar "dois" diante de qualquer classificador (gè, kǒu, suì, etc.), a gramática chinesa exige estritamente "liǎng" (两). "Èr" (二) causará estranheza.',
          solutionTip: 'Use "liǎng" (两) sempre que estiver contando coisas ou pessoas.',
          exampleCorrect: '我有 两 个弟弟 (wǒ yǒu liǎng gè dìdi)',
          exampleIncorrect: '我有 二 个弟弟 (wǒ yǒu èr gè dìdi)',
        },
      },
      {
        id: 'opt_ji',
        hanzi: '几',
        pinyin: 'jǐ',
        translation: 'quantos? (pergunta)',
        isCorrect: false,
        explanation: 'Incorreto! "Jǐ" é uma palavra interrogativa ("quantos?"), mas a frase é uma afirmação.',
      },
      {
        id: 'opt_kou',
        hanzi: '口',
        pinyin: 'kǒu',
        translation: 'classificador',
        isCorrect: false,
        explanation: 'Incorreto! O classificador "gè" já está presente na frase; aqui precisamos do numeral "dois".',
      },
    ],
  },

  // 7. Partícula de Sugestão e Convite "ba" (吧)
  {
    id: 'quiz_part_ba',
    type: 'fill_blank',
    portuguese: 'Vamos ao supermercado!',
    categoryName: 'Partículas Modais & Convites',
    hskLevel: 'HSK 2',
    grammarRuleTitle: 'Partícula Modal de Sugestão "ba" (吧)',
    grammarExplanation: 'A partícula "ba" (吧) é colocada no final da frase para indicar uma proposta suave, convite amigável ou sugestão ("vamos...", "que tal...").',
    prefixHanzi: '我们去超市',
    suffixHanzi: '！',
    fullHanzi: '我们去超市吧！',
    fullPinyin: 'wǒmen qù chāoshì ba!',
    blankPinyinHint: 'ba',
    correctAnswerId: 'opt_ba',
    options: [
      {
        id: 'opt_ba',
        hanzi: '吧',
        pinyin: 'ba',
        translation: 'partícula de sugestão / convite',
        isCorrect: true,
        explanation: 'Correto! [Frase + 吧] suaviza a sentença e cria o sentido de "vamos fazer tal coisa!".',
      },
      {
        id: 'opt_ma',
        hanzi: '吗',
        pinyin: 'ma',
        translation: 'partícula de pergunta sim/não',
        isCorrect: false,
        explanation: 'Incorreto! "Ma" (吗) transformaria a frase em uma pergunta neutra ("Nós vamos ao supermercado?"), não em um convite animado ("Vamos ao supermercado!").',
      },
      {
        id: 'opt_ne',
        hanzi: '呢',
        pinyin: 'ne',
        translation: 'e...? (pergunta de retorno/andamento)',
        isCorrect: false,
        explanation: 'Incorreto! "Ne" (呢) indica perguntas de retorno ("e nós?") ou ação em progresso, não convites.',
      },
      {
        id: 'opt_de',
        hanzi: '的',
        pinyin: 'de',
        translation: 'partícula de posse',
        isCorrect: false,
        explanation: 'Incorreto! "De" no final tornaria a frase incompleta sem substantivo.',
      },
    ],
  },

  // 8. Locativo com zài (在): Sujeito + zài + Lugar
  {
    id: 'quiz_loc_zai',
    type: 'fill_blank',
    portuguese: 'Onde você está?',
    categoryName: 'Locativos & Posição',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Verbo de Localização "zài" (在)',
    grammarExplanation: 'Para indicar a localização onde alguém ou algo se encontra, o verbo próprio é "zài" (在 - estar em). Ele precede o lugar ou o pronome interrogativo locativo "nǎlǐ" (哪里).',
    prefixHanzi: '你',
    suffixHanzi: '哪里？',
    fullHanzi: '你在哪里？',
    fullPinyin: 'nǐ zài nǎlǐ?',
    blankPinyinHint: 'zài',
    correctAnswerId: 'opt_zai',
    options: [
      {
        id: 'opt_zai',
        hanzi: '在',
        pinyin: 'zài',
        translation: 'estar em (localização)',
        isCorrect: true,
        explanation: 'Exato! "Zài" (在) expressa estar em determinado local: [Sujeito + 在 + Lugar/哪里].',
      },
      {
        id: 'opt_shi',
        hanzi: '是',
        pinyin: 'shì',
        translation: 'ser',
        isCorrect: false,
        explanation: 'Incorreto! "Shì" (是) expressa identidade ("ser algo/alguém"), não localização física no espaço.',
        grammarTip: {
          title: 'Verbo de Localização vs Identidade',
          ruleName: '在 (zài) para Locativos vs 是 (shì) para Identidade',
          explanation: 'Em mandarim, não se utiliza "shì" para perguntar onde alguém está. O verbo exato de localização física é "zài" (在).',
          solutionTip: 'Use "zài" (在) antes de "nǎlǐ" (哪里 - onde).',
          exampleCorrect: '你 在 哪里？ (nǐ zài nǎlǐ?)',
          exampleIncorrect: '你 是 哪里？ (nǐ shì nǎlǐ?)',
        },
      },
      {
        id: 'opt_you',
        hanzi: '有',
        pinyin: 'yǒu',
        translation: 'ter / haver',
        isCorrect: false,
        explanation: 'Incorreto! "Yǒu" indica posse de objetos ou existência impessoal, não a localização de uma pessoa.',
      },
      {
        id: 'opt_qu',
        hanzi: '去',
        pinyin: 'qù',
        translation: 'ir',
        isCorrect: false,
        explanation: 'Incorreto! "Qù" significa "ir" (deslocamento para um destino), enquanto a frase pergunta onde a pessoa se encontra no momento.',
      },
    ],
  },

  // 9. Conjunção "hé" (和) apenas entre substantivos/pronomes
  {
    id: 'quiz_conj_he',
    type: 'fill_blank',
    portuguese: 'Meu pai e minha mãe estão ambos muito bem.',
    categoryName: 'Conjunções & Coordenação',
    hskLevel: 'HSK 2',
    grammarRuleTitle: 'Conjunção "hé" (和 - e)',
    grammarExplanation: 'A conjunção "hé" (和) liga exclusivamente substantivos, pronomes ou termos nominais. Ela não pode ser usada para ligar orações inteiras com verbos.',
    prefixHanzi: '爸爸',
    suffixHanzi: '妈妈都很好。',
    fullHanzi: '爸爸和妈妈都很好。',
    fullPinyin: 'bàba hé māma dōu hěn hǎo.',
    blankPinyinHint: 'hé',
    correctAnswerId: 'opt_he',
    options: [
      {
        id: 'opt_he',
        hanzi: '和',
        pinyin: 'hé',
        translation: 'e (conjunção entre substantivos)',
        isCorrect: true,
        explanation: 'Correto! "Hé" (和) é a conjunção ideal para ligar os dois termos nominais: "bàba" (pai) e "māma" (mãe).',
      },
      {
        id: 'opt_ye',
        hanzi: '也',
        pinyin: 'yě',
        translation: 'também (advérbio)',
        isCorrect: false,
        explanation: 'Incorreto! "Yě" é um advérbio que fica antes de predicados, não uma conjunção entre dois sujeitos coordenados.',
      },
      {
        id: 'opt_dou',
        hanzi: '都',
        pinyin: 'dōu',
        translation: 'todos',
        isCorrect: false,
        explanation: 'Incorreto! "Dōu" (都) já está presente após "māma" para resumir os dois sujeitos.',
      },
      {
        id: 'opt_de',
        hanzi: '的',
        pinyin: 'de',
        translation: 'partícula de posse',
        isCorrect: false,
        explanation: 'Incorreto! "Bàba de māma" significaria "a mãe do pai" (avó paterna), alterando completamente o sentido de "pai e mãe".',
      },
    ],
  },

  // 10. Pergunta de Por quê: wèishénme (为什么)
  {
    id: 'quiz_quest_weishenme',
    type: 'fill_blank',
    portuguese: 'Por que você estuda chinês?',
    categoryName: 'Perguntas de Motivação',
    hskLevel: 'HSK 2',
    grammarRuleTitle: 'Posição de "wèishénme" (为什么 - por quê)',
    grammarExplanation: '"Wèishénme" (为什么) é o pronome interrogativo de causa/motivo. Costuma vir entre o sujeito e o verbo ou no início imediato da pergunta.',
    prefixHanzi: '你',
    suffixHanzi: '学习汉语？',
    fullHanzi: '你为什么学习汉语？',
    fullPinyin: 'nǐ wèishénme xuéxí hànyǔ?',
    blankPinyinHint: 'wèishénme',
    correctAnswerId: 'opt_wei',
    options: [
      {
        id: 'opt_wei',
        hanzi: '为什么',
        pinyin: 'wèishénme',
        translation: 'por quê? (pergunta)',
        isCorrect: true,
        explanation: 'Perfeito! "Wèishénme" (为什么) pergunta o motivo ou causa: [Você + por quê + estuda chinês?].',
      },
      {
        id: 'opt_yin',
        hanzi: '因为',
        pinyin: 'yīnwèi',
        translation: 'porque / pois (resposta)',
        isCorrect: false,
        explanation: 'Incorreto! "Yīnwèi" (因为) é a conjunção de resposta ("porque..."), nunca a palavra interrogativa da pergunta.',
        grammarTip: {
          title: 'Pergunta vs Resposta de Causa',
          ruleName: '为什么 (Pergunta) vs 因为 (Resposta)',
          explanation: 'Use "wèishénme" (为什么) para formular a pergunta "por quê?". Guarde "yīnwèi" (因为) para introduzir a justificativa na resposta.',
          solutionTip: 'Em perguntas, utilize sempre "wèishénme".',
          exampleCorrect: '你 为什么 学习汉语？ (nǐ wèishénme xuéxí hànyǔ?)',
          exampleIncorrect: '你 因为 学习汉语？ (yīnwèi não é pronome de pergunta)',
        },
      },
      {
        id: 'opt_shen',
        hanzi: '什么',
        pinyin: 'shénme',
        translation: 'o quê / qual',
        isCorrect: false,
        explanation: 'Incorreto! "Shénme" significa "o quê" (objeto). Colocá-lo aqui criaria uma sentença sem sentido gramatical com "xuéxí hànyǔ".',
      },
      {
        id: 'opt_ji',
        hanzi: '几',
        pinyin: 'jǐ',
        translation: 'quantos?',
        isCorrect: false,
        explanation: 'Incorreto! "Jǐ" pergunta quantidades numéricas pequenas, não o motivo de uma ação.',
      },
    ],
  },

  // 11. Pergunta de Preço com duōshao (多少)
  {
    id: 'quiz_price_duoshao',
    type: 'fill_blank',
    portuguese: 'Quanto custa este aqui? (quanto dinheiro)',
    categoryName: 'Compras & Preços',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Pergunta de Preço "duōshao qián" (多少钱)',
    grammarExplanation: 'A fórmula fixa e mais universal do mandarim para perguntar o valor de algo é [Elemento] + "duōshao qián" (多少钱 - quanto dinheiro).',
    prefixHanzi: '这个',
    suffixHanzi: '钱？',
    fullHanzi: '这个多少钱？',
    fullPinyin: 'zhège duōshao qián?',
    blankPinyinHint: 'duōshao',
    correctAnswerId: 'opt_duoshao',
    options: [
      {
        id: 'opt_duoshao',
        hanzi: '多少',
        pinyin: 'duōshao',
        translation: 'quanto? (quantidades / preço)',
        isCorrect: true,
        explanation: 'Exato! "Zhège duōshao qián?" é a clássica expressão do mandarim para "Quanto custa isto?".',
      },
      {
        id: 'opt_duoda',
        hanzi: '多大',
        pinyin: 'duōdà',
        translation: 'qual a idade? / quão grande?',
        isCorrect: false,
        explanation: 'Incorreto! "Duōdà" pergunta a idade de pessoas ("quantos anos?") ou o tamanho de objetos, não o preço.',
      },
      {
        id: 'opt_ji',
        hanzi: '几',
        pinyin: 'jǐ',
        translation: 'quantos? (exige classificador e números pequenos)',
        isCorrect: false,
        explanation: 'Incorreto! "Jǐ" normalmente pergunta contagens pequenas e exigiria classificador monetário (ex: jǐ kuài qián), enquanto "duōshao" é a forma direta universal.',
      },
      {
        id: 'opt_shenme',
        hanzi: '什么',
        pinyin: 'shénme',
        translation: 'o quê / qual',
        isCorrect: false,
        explanation: 'Incorreto! "Shénme qián" não é uma fórmula válida para perguntar o valor no mandarim.',
      },
    ],
  },

  // 12. Pergunta Recíproca com "ne" (呢)
  {
    id: 'quiz_part_ne',
    type: 'fill_blank',
    portuguese: 'Eu estou muito bem, e você?',
    categoryName: 'Perguntas Recíprocas & Diálogo',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Partícula de Retorno Recíproco "ne" (呢)',
    grammarExplanation: 'Para devolver uma pergunta sobre o mesmo assunto ao interlocutor ("e você?", "e o seu livro?"), utiliza-se [Pronome/Substantivo] + "ne" (呢).',
    prefixHanzi: '我很好，你',
    suffixHanzi: '？',
    fullHanzi: '我很好，你呢？',
    fullPinyin: 'wǒ hěn hǎo, nǐ ne?',
    blankPinyinHint: 'ne',
    correctAnswerId: 'opt_ne',
    options: [
      {
        id: 'opt_ne',
        hanzi: '呢',
        pinyin: 'ne',
        translation: 'e...? (pergunta de retorno elíptica)',
        isCorrect: true,
        explanation: 'Perfeito! "Nǐ ne?" (你呢？) significa exatamente "E você?", reaproveitando o contexto anterior.',
      },
      {
        id: 'opt_ma',
        hanzi: '吗',
        pinyin: 'ma',
        translation: 'partícula de pergunta de sim/não',
        isCorrect: false,
        explanation: 'Incorreto! "Ma" (吗) não pode ser anexada a um pronome isolado sem predicado (não existe "nǐ ma"). O correto seria "nǐ hǎo ma?".',
        grammarTip: {
          title: 'Partícula 呢 (ne) vs 吗 (ma)',
          ruleName: 'Pronome + 呢 para "E você?"',
          explanation: 'Para perguntas elípticas como "e você?", usa-se exclusivamente a partícula "ne" (你呢？). A partícula "ma" exige uma oração completa com verbo ou adjetivo (你也是吗？ / 你好吗？).',
          solutionTip: 'Use "ne" (呢) após um nome ou pronome solto.',
          exampleCorrect: '我很好，你 呢？ (wǒ hěn hǎo, nǐ ne?)',
          exampleIncorrect: '我很好，你 吗？ (gramaticalmente incompleto sem predicado)',
        },
      },
      {
        id: 'opt_ba',
        hanzi: '吧',
        pinyin: 'ba',
        translation: 'partícula de convite',
        isCorrect: false,
        explanation: 'Incorreto! "Ba" é usada para convites ou sugestões, não para perguntas recíprocas.',
      },
      {
        id: 'opt_de',
        hanzi: '的',
        pinyin: 'de',
        translation: 'partícula de posse',
        isCorrect: false,
        explanation: 'Incorreto! "Nǐ de?" significaria "O seu?", indicando posse sobre algum objeto.',
      },
    ],
  },

  // 13. Ordenação: Negação antes do verbo (Sujeito + 不 + Verbo + Objeto)
  {
    id: 'quiz_ord_1',
    type: 'order_words',
    portuguese: 'Eu não bebo café.',
    categoryName: 'Ordenação Gramatical',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Ordem de Negação: Sujeito + 不 + Verbo + Objeto',
    grammarExplanation: 'Em mandarim, o advérbio de negação "bù" (不) fica sempre antes do verbo transitivo ("hē" - beber), nunca após o verbo ou no fim da oração.',
    fullHanzi: '我不喝咖啡。',
    fullPinyin: 'wǒ bù hē kāfēi.',
    correctSequenceHanzi: '我不喝咖啡',
  },

  // 14. Ordenação: Pergunta sim/não (Sujeito + Verbo + Objeto + 吗)
  {
    id: 'quiz_ord_2',
    type: 'order_words',
    portuguese: 'Você é brasileiro(a)?',
    categoryName: 'Ordenação Gramatical',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Ordem Interrogativa com 吗 (ma)',
    grammarExplanation: 'Forme a oração afirmativa em ordem direta (你 是 巴西人) e anexe a partícula interrogativa "ma" (吗) ao final absoluto.',
    fullHanzi: '你是巴西人吗？',
    fullPinyin: 'nǐ shì bāxī rén ma?',
    correctSequenceHanzi: '你是巴西人吗',
  },

  // 15. Ordenação: Advérbio de inclusão "dōu" (Sujeito Plural + 都 + Verbo + Objeto)
  {
    id: 'quiz_ord_3',
    type: 'order_words',
    portuguese: 'Todos nós gostamos de chá.',
    categoryName: 'Ordenação Gramatical',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Posição do Advérbio "dōu" (都 - todos)',
    grammarExplanation: 'O advérbio "dōu" (都) resume o sujeito plural anterior ("wǒmen" - nós) e deve preceder imediatamente o verbo "xǐhuan" (喜欢).',
    fullHanzi: '我们都喜欢茶。',
    fullPinyin: 'wǒmen dōu xǐhuan chá.',
    correctSequenceHanzi: '我们都喜欢茶',
  },

  // 16. Ordenação: Idade com liǎng e suì (Sujeito + 两 + 岁)
  {
    id: 'quiz_ord_4',
    type: 'order_words',
    portuguese: 'Minha filha tem dois anos de idade.',
    categoryName: 'Ordenação Gramatical',
    hskLevel: 'HSK 1',
    grammarRuleTitle: 'Estrutura de Idade: Sujeito + [Número] + 岁 (suì)',
    grammarExplanation: 'Para expressar idade em mandarim, o numeral e o classificador "suì" formam o predicado diretamente após o sujeito, sem necessidade do verbo "ter". Usa-se "liǎng" para o número dois.',
    fullHanzi: '我女儿两岁。',
    fullPinyin: "wǒ nǚ'ér liǎng suì.",
    correctSequenceHanzi: '我女儿两岁',
  },

  // 17. Ordenação: Verbo de movimento "qù" (Sujeito + 去 + Destino + 吧)
  {
    id: 'quiz_ord_5',
    type: 'order_words',
    portuguese: 'Vamos à China!',
    categoryName: 'Ordenação Gramatical',
    hskLevel: 'HSK 2',
    grammarRuleTitle: 'Verbo de Direção + Partícula Modal "ba"',
    grammarExplanation: 'A ordem canônica é Sujeito (wǒmen) + Verbo de movimento (qù) + Destino (zhōngguó) + Partícula de sugestão (ba) ao final.',
    fullHanzi: '我们去中国吧！',
    fullPinyin: 'wǒmen qù zhōngguó ba!',
    correctSequenceHanzi: '我们去中国吧',
  },
];

/**
 * Shuffles an array in place with Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Gets a random question, optionally filtering by level or type
 */
export function getRandomQuizQuestion(
  hskFilter?: HskLevel | 'ALL',
  typeFilter?: 'ALL' | 'fill_blank' | 'order_words',
  excludeIds?: string[]
): QuizQuestion {
  let pool = CURATED_QUIZ_QUESTIONS;

  if (hskFilter && hskFilter !== 'ALL') {
    pool = pool.filter(q => q.hskLevel === hskFilter);
  }

  if (typeFilter && typeFilter !== 'ALL') {
    pool = pool.filter(q => q.type === typeFilter);
  }

  if (excludeIds && excludeIds.length > 0 && pool.length > excludeIds.length) {
    const filtered = pool.filter(q => !excludeIds.includes(q.id));
    if (filtered.length > 0) {
      pool = filtered;
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const selected = { ...pool[randomIndex] };

  // Randomize options for fill_blank questions so the correct answer isn't always in the same slot
  if (selected.options) {
    selected.options = shuffleArray(selected.options);
  }

  return selected;
}
