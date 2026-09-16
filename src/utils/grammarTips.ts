import { Word, ContextualGrammarTip } from '../types';

/**
 * Generates a specific, pedagogical grammar order tip when a sequence is invalidated
 * by attempting to place `candidate` after `prevWords`.
 */
export function generateGrammarOrderTip(
  prevWords: Word[],
  candidate: Word,
  rawToken?: string,
  position?: number
): ContextualGrammarTip {
  const pos = position ?? (prevWords.length + 1);

  // CASE 1: Sequence starts incorrectly (position 1)
  if (prevWords.length === 0) {
    // 1.1 Modal / Question particles at the beginning
    if (candidate.id === 'ma' || candidate.id === 'ba_part') {
      return {
        title: 'Partícula Modal no Início da Frase',
        ruleName: 'Posição Final de Partículas Modais',
        explanation: `A partícula "${candidate.label}" (${candidate.hanzi}) é estritamente uma partícula final de frase (sentence-final particle). Ela nunca pode abrir uma oração no mandarim.`,
        solutionTip: 'Inicie a frase com o sujeito (ex: 你 nǐ, 我 wǒ, 他 tā) e reserve a partícula somente para o final.',
        exampleCorrect: '你好吗？ (nǐ hǎo ma?) — Como vai você?',
        exampleIncorrect: `*${candidate.label} ...`,
        offendingWord: candidate,
        position: pos,
      };
    }

    // 1.2 Adverbs at the beginning without context
    if (['hen', 'bu', 'mei', 'ye', 'dou', 'zhi', 'yidian'].includes(candidate.id)) {
      return {
        title: 'Advérbio no Início da Frase',
        ruleName: 'Estrutura Sujeito + Advérbio + Predicado',
        explanation: `Advérbios de grau ou negação como "${candidate.label}" (${candidate.hanzi}) devem se posicionar entre o sujeito e o predicado (Sujeito + Advérbio + Verbo/Adjetivo). Eles não devem abrir orações soltas.`,
        solutionTip: 'Insira primeiro um pronome ou sujeito (ex: 我 wǒ, 你 nǐ, 他 tā) antes do advérbio.',
        exampleCorrect: '我很好 (wǒ hěn hǎo) — Eu estou muito bem',
        exampleIncorrect: `*${candidate.label} ...`,
        offendingWord: candidate,
        position: pos,
      };
    }

    // 1.3 Standalone classifiers
    if (candidate.category === 'classifier') {
      return {
        title: 'Classificador sem Numeral ou Demonstrativo',
        ruleName: 'Estrutura de Classificador (量词 liàngcí)',
        explanation: `Classificadores como "${candidate.label}" (${candidate.hanzi}) não podem iniciar uma oração sozinhos. No mandarim, eles sempre exigem um número (一, 四, 几) ou pronome demonstrativo (这, 那) antecedente.`,
        solutionTip: 'Coloque um número ou demonstrativo antes do classificador (ex: 这个 zhè ge, 一个 yí gè).',
        exampleCorrect: '这个人 (zhè ge rén) / 四个人 (sì gè rén)',
        exampleIncorrect: `*${candidate.label} ...`,
        offendingWord: candidate,
        position: pos,
      };
    }

    // 1.4 Suffixes
    if (candidate.category === 'suffix') {
      return {
        title: 'Sufixo sem Palavra Base',
        ruleName: 'Regra de Sufixos Derivacionais',
        explanation: `O sufixo "${candidate.label}" (${candidate.hanzi}) precisa ser anexado à sua palavra base (como um país, pronome ou substantivo). Ele não tem existência sintática isolada no início.`,
        solutionTip: 'Coloque o país ou pronome primeiro (ex: 巴西 bāxī + 人 rén -> 巴西人 bāxī rén).',
        exampleCorrect: '中国人 (zhōngguó rén) — Pessoa chinesa',
        exampleIncorrect: `*${candidate.label} ...`,
        offendingWord: candidate,
        position: pos,
      };
    }

    // 1.5 Conjunction 'he'
    if (candidate.id === 'he_conj') {
      return {
        title: 'Conjunção 和 (hé) no Início da Frase',
        ruleName: 'Conjunção Aditiva Nominal',
        explanation: `A conjunção "和" (hé - e) serve para unir dois termos nominais (A 和 B). Ela não deve iniciar uma frase isoladamente no chinês padrão.`,
        solutionTip: 'Insira o primeiro substantivo ou pronome antes de 和 (ex: 我和你 wǒ hé nǐ).',
        exampleCorrect: '我和你 (wǒ hé nǐ) — Eu e você',
        exampleIncorrect: '*和 ...',
        offendingWord: candidate,
        position: pos,
      };
    }

    // 1.6 Possessive 'de'
    if (candidate.id === 'de') {
      return {
        title: 'Partícula de Posse 的 (de) Solta',
        ruleName: 'Estrutura Possuidor + 的 + Elemento',
        explanation: `A partícula estrutural "的" (de) exige um possuidor ou modificador à sua esquerda (ex: 我的 wǒ de = meu; 妈妈的 māma de = da mãe).`,
        solutionTip: 'Insira o dono ou elemento qualificador antes de 的.',
        exampleCorrect: '我的朋友 (wǒ de péngyou) — Meu amigo',
        exampleIncorrect: '*的 ...',
        offendingWord: candidate,
        position: pos,
      };
    }

    // Generic Position 1 error
    return {
      title: 'Início Incorreto de Frase',
      ruleName: 'Estrutura Básica do Mandarim (SVO)',
      explanation: `A oração não pode iniciar com a palavra "${candidate.label}" (${candidate.hanzi} - ${candidate.translation}). No mandarim, inicie pelo sujeito (pronome, membro da família, substantivo) ou por uma fórmula de cortesia/saudação.`,
      solutionTip: 'Comece com um pronome (我, 你, 他, 她), substantivo ou saudação (你好).',
      exampleCorrect: '我... (wǒ...) / 你好 (nǐ hǎo)',
      exampleIncorrect: `*${candidate.label} ...`,
      offendingWord: candidate,
      position: pos,
    };
  }

  const prevWord = prevWords[prevWords.length - 1];
  const hasQuestionInSeq = prevWords.some(w => 
    ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji', 'duoda', 'weishenme'].includes(w.id)
  );

  // CASE 2: Classical Negation Errors
  // 2.1 "bu" + "you" -> MUST BE "mei you"
  if (prevWord.id === 'bu' && candidate.id === 'you_verb') {
    return {
      title: 'Negação Incorreta com 有 (yǒu)',
      ruleName: 'Regra Exclusiva de 没有 (méiyǒu)',
      explanation: 'Em mandarim, o verbo "有" (yǒu - ter/haver) nunca aceita a negação com "不" (bù). A forma "*不有" (*bù yǒu) não existe na gramática chinesa.',
      solutionTip: 'Substitua "不" por "没" (méi) para expressar "não ter": use sempre "没有" (méiyǒu).',
      exampleCorrect: '我没有工作 (wǒ méi yǒu gōngzuò)',
      exampleIncorrect: '*我不有工作 (*wǒ bù yǒu gōngzuò)',
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // 2.2 "mei" + "shi" -> MUST BE "bu shi"
  if (prevWord.id === 'mei' && candidate.id === 'shi') {
    return {
      title: 'Negação Incorreta com 是 (shì)',
      ruleName: 'Regra de 不是 (bú shì)',
      explanation: 'O verbo de ligação "是" (shì - ser) deve ser negado estritamente com "不" (bù), gerando "不是" (bú shì). O advérbio "没" (méi) é exclusivo do verbo "有" e de ações concluídas.',
      solutionTip: 'Use "不是" (bú shì) para dizer "não ser" ou "não é".',
      exampleCorrect: '我不是学生 (wǒ bú shì xuésheng)',
      exampleIncorrect: '*我没是学生 (*wǒ méi shì xuésheng)',
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 3: Degree Adverbs (e.g. 很 hěn) Placed AFTER Adjectives or Verbs
  if (candidate.id === 'hen' || candidate.id === 'yidian' || candidate.id === 'henduo') {
    if (prevWord.category === 'adjective' || prevWord.category === 'verb') {
      return {
        title: 'Posição Invertida do Advérbio de Grau',
        ruleName: 'Advérbios Precedem o Adjetivo ou Verbo (很 + Adj)',
        explanation: `Advérbios de intensidade como "${candidate.label}" (${candidate.hanzi} - muito) devem obrigatoriamente anteceder o adjetivo ou verbo que qualificam. Eles nunca são posicionados após o termo que qualificam.`,
        solutionTip: `Inverta a ordem: coloque "${candidate.label}" antes de "${prevWord.label}" (ex: ${candidate.label} ${prevWord.label}).`,
        exampleCorrect: `很${prevWord.hanzi} (hěn ${prevWord.label})`,
        exampleIncorrect: `*${prevWord.hanzi}${candidate.hanzi} (*${prevWord.label} ${candidate.label})`,
        offendingWord: candidate,
        previousWord: prevWord,
        position: pos,
      };
    }
  }

  // CASE 4: Using 是 (shì) with Adjectives (*wo shi mang, *ta shi piaoliang)
  if (prevWord.id === 'shi' && candidate.category === 'adjective') {
    return {
      title: 'Uso Incorreto de 是 (shì) com Adjetivo',
      ruleName: 'Adjetivos Predicativos (Dispensam 是)',
      explanation: 'Em chinês, os adjetivos já funcionam como verbos estativos de estado. Não se utiliza o verbo "是" (shì) para ligar o sujeito a um adjetivo simples.',
      solutionTip: 'Substitua o verbo "是" por "很" (hěn) para formar "Sujeito + 很 + Adjetivo".',
      exampleCorrect: `他很${candidate.hanzi} (tā hěn ${candidate.label})`,
      exampleIncorrect: `*他是${candidate.hanzi} (*tā shì ${candidate.label})`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 5: Double Question with 吗 (ma) when sentence already has an interrogative pronoun
  if (candidate.id === 'ma' && hasQuestionInSeq) {
    const qWord = prevWords.find(w => 
      ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji', 'duoda', 'weishenme'].includes(w.id)
    );
    const qName = qWord ? `${qWord.label} (${qWord.hanzi})` : 'uma palavra interrogativa';

    return {
      title: 'Dupla Pergunta Proibida',
      ruleName: 'Redundância com Partícula 吗 (ma)',
      explanation: `A frase já possui ${qName}. No mandarim, perguntas abertas com pronomes interrogativos não aceitam a partícula "吗" (ma) simultaneamente.`,
      solutionTip: 'Remova a partícula "吗" ao final. A pergunta já está completa graças ao pronome interrogativo.',
      exampleCorrect: '你叫什么名字？ (nǐ jiào shénme míngzi?)',
      exampleIncorrect: '*你叫什么名字吗？ (*nǐ jiào shénme míngzi ma?)',
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 6: Premature Modal Particles (ma, ba) in the middle of a sentence
  if (candidate.id === 'ma' || candidate.id === 'ba_part') {
    return {
      title: 'Partícula Modal no Meio da Frase',
      ruleName: 'Posição Restrita ao Final Absoluto',
      explanation: `A partícula "${candidate.label}" (${candidate.hanzi}) encerra a oração completa. Ela não pode aparecer após termos intermediários como preposições ou verbos incompletos.`,
      solutionTip: 'Adicione o complemento ou objeto antes de inserir a partícula modal ao final.',
      exampleCorrect: '你喝茶吗？ (nǐ hē chá ma?)',
      exampleIncorrect: `*... ${prevWord.label} ${candidate.label} ...`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 7: Directional Verb 去 (qù) and Destination
  // 7.1 Destination placed BEFORE 去
  if (['chaoshi', 'xuexiao', 'daxue', 'jia'].includes(prevWord.id) && candidate.id === 'qu_verb') {
    return {
      title: 'Ordem Invertida: Destino e Verbo 去 (qù)',
      ruleName: 'Verbo de Movimento Antes do Destino (去 + Lugar)',
      explanation: 'No mandarim, o verbo direcional "去" (qù - ir) deve vir antes do local de destino (去 + Local). Não se coloca o destino antes do verbo de deslocamento.',
      solutionTip: `Inverta a ordem: use "去 ${prevWord.label}" (去${prevWord.hanzi} qù ${prevWord.label}).`,
      exampleCorrect: `去${prevWord.hanzi} (qù ${prevWord.label})`,
      exampleIncorrect: `*${prevWord.hanzi}去 (*${prevWord.label} qù)`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // 7.2 Incompatible element after 去
  if (prevWord.id === 'qu_verb' && candidate.category !== 'country' && !['chaoshi', 'xuexiao', 'daxue', 'jia', 'difang', 'nali', 'nar', 'shenme', 'ba_part', 'ma'].includes(candidate.id)) {
    return {
      title: 'Regência Incompatível após 去 (qù)',
      ruleName: 'Exigência de Destino ou Ação',
      explanation: `O verbo "去" (qù - ir) exige como complemento um destino físico (escola, supermercado, país) ou uma ação subsequente de propósito. A palavra "${candidate.label}" (${candidate.hanzi}) não funciona como destino.`,
      solutionTip: 'Adicione um local após "去" (ex: 去学校 qù xuéxiào, 去中国 qù zhōngguó).',
      exampleCorrect: '去学校 (qù xuéxiào) — Ir à escola',
      exampleIncorrect: `*去 ${candidate.label}`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 8: Quantifiers and Classifiers (量词 liàngcí)
  // 8.1 Number placed AFTER noun (*ren si ge)
  if ((prevWord.category === 'noun' || prevWord.category === 'family') && candidate.category === 'number') {
    return {
      title: 'Inversão entre Substantivo e Numeral',
      ruleName: 'Ordem Numeral + Classificador + Substantivo',
      explanation: 'No mandarim, a quantidade e o classificador devem vir estritamente ANTES do substantivo (Número + Classificador + Substantivo), nunca depois.',
      solutionTip: `Inverta a posição: coloque o número "${candidate.label}" e o classificador "个" antes de "${prevWord.label}".`,
      exampleCorrect: `四个人 (sì gè rén) / ${candidate.hanzi}个人`,
      exampleIncorrect: `*${prevWord.hanzi}${candidate.hanzi} (*${prevWord.label} ${candidate.label})`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // 8.2 Missing classifier between Number and Noun (*si ren, *liang didi)
  if (prevWord.category === 'number' && (candidate.category === 'noun' || candidate.category === 'family') && !['ren', 'xuesheng'].includes(candidate.id)) {
    return {
      title: 'Falta de Classificador (量词)',
      ruleName: 'Número Exige Classificador Antes do Substantivo',
      explanation: `No mandarim padrão, não se conecta um numeral diretamente a "${candidate.label}" (${candidate.hanzi}). É obrigatório utilizar um classificador intermediário (como 个 gè para itens/pessoas ou 口 kǒu para família).`,
      solutionTip: `Insira o classificador "个" (gè) ou "口" (kǒu) entre o número "${prevWord.label}" e "${candidate.label}".`,
      exampleCorrect: `${prevWord.hanzi}个${candidate.hanzi} (${prevWord.label} gè ${candidate.label})`,
      exampleIncorrect: `*${prevWord.hanzi}${candidate.hanzi} (*${prevWord.label} ${candidate.label})`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // 8.3 Age classifier 岁 (suì) without preceding number
  if (candidate.id === 'sui' && prevWord.category !== 'number' && prevWord.id !== 'ji') {
    return {
      title: 'Classificador de Idade 岁 (suì) Deslocado',
      ruleName: 'Idade: Número/几 + 岁 (suì)',
      explanation: 'A palavra "岁" (suì - anos de idade) mede a idade cronológica e deve suceder imediatamente um numeral (ex: 五十九岁 wǔshíjiǔ suì) ou o pronome de quantidade "几" (jǐ suì - quantos anos?).',
      solutionTip: 'Insira o número da idade logo antes de "岁".',
      exampleCorrect: '五十九岁 (wǔshíjiǔ suì) / 几岁？ (jǐ suì?)',
      exampleIncorrect: `*${prevWord.label} sui`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 9: Preposition Placement (gei, zai)
  if (prevWord.category === 'preposition' && candidate.category !== 'pronoun' && candidate.category !== 'family' && candidate.category !== 'noun' && candidate.category !== 'country') {
    return {
      title: 'Complemento de Preposição Obrigatório',
      ruleName: 'Preposição + Destinatário/Local + Ação',
      explanation: `Preposições como "${prevWord.label}" (${prevWord.hanzi}) exigem seu objeto nominal (pessoa ou local) antes de avançar para a ação principal. Não se pode inserir "${candidate.label}" diretamente.`,
      solutionTip: `Adicione o receptor ou local após "${prevWord.label}" (ex: ${prevWord.label} 你 nǐ / ${prevWord.label} 中国 zhōngguó).`,
      exampleCorrect: `${prevWord.hanzi}你... (${prevWord.label} nǐ...)`,
      exampleIncorrect: `*${prevWord.label} ${candidate.label}`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 10: Conjunction 和 (hé) Restrictions
  if (candidate.id === 'he_conj' && (prevWord.category === 'verb' || prevWord.category === 'adverb' || prevWord.category === 'preposition')) {
    return {
      title: 'Uso Inadequado de 和 (hé) com Verbos',
      ruleName: '和 Conecta Exclusivamente Substantivos e Pronomes',
      explanation: 'A conjunção "和" (hé - e) conecta apenas termos nominais (ex: 爸爸和妈妈 bàba hé māma). Para encadear verbos ou orações, o mandarim dispensa o uso de 和, utilizando justaposição ou advérbios.',
      solutionTip: 'Não use 和 entre verbos. Coloque as ações em sequência direta ou use 也 (yě).',
      exampleCorrect: '我去学校看书 (wǒ qù xuéxiào kàn shū)',
      exampleIncorrect: `*... ${prevWord.label} he ...`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 11: Plural Suffix 们 (men)
  if (candidate.id === 'men' && prevWord.category !== 'pronoun' && !['pengyou', 'xuesheng', 'laoshi', 'tongxue'].includes(prevWord.id)) {
    return {
      title: 'Sufixo de Plural 们 (men) Inválido',
      ruleName: 'Restrição de 们 a Pessoas e Pronomes',
      explanation: 'O sufixo "们" (men) só pode ser anexado a pronomes pessoais (我, 你, 他, 她) ou certos termos humanos (朋友, 学生). Ele não pode suceder verbos, coisas inanimadas ou adjetivos.',
      solutionTip: 'Fixe "们" diretamente a um pronome de pessoa (ex: 我们 wǒmen, 你们 nǐmen).',
      exampleCorrect: '我们 (wǒmen) / 他们 (tāmen) / 朋友们 (péngyoumen)',
      exampleIncorrect: `*${prevWord.label} men`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 12: Why/Because clauses (weishenme, yinwei)
  if (prevWord.id === 'weishenme' && !['pronoun', 'family', 'verb'].includes(candidate.category) && candidate.id !== 'bu') {
    return {
      title: 'Construção com 为什么 (wèishénme)',
      ruleName: 'Por que? + Sujeito ou Ação',
      explanation: 'A expressão interrogativa "为什么" (wèishénme - por que) deve ser sucedida pelo sujeito (你, 他) ou diretamente pelo verbo de ação/vontade (想, 学习).',
      solutionTip: 'Insira o pronome ou verbo de intenção após 为什么 (ex: 为什么想... / 你为什么...).',
      exampleCorrect: '你为什么想学习汉语？ (nǐ wèishénme xiǎng xuéxí hànyǔ?)',
      exampleIncorrect: `*weishenme ${candidate.label}`,
      offendingWord: candidate,
      previousWord: prevWord,
      position: pos,
    };
  }

  // CASE 13: General Category Transition Error
  return {
    title: `Ordem Incompatível: ${prevWord.label} + ${candidate.label}`,
    ruleName: 'Sequência Sintática em Mandarim',
    explanation: `No mandarim, após "${prevWord.label}" (${prevWord.hanzi} - categoria: ${prevWord.category}), a palavra "${candidate.label}" (${candidate.hanzi} - categoria: ${candidate.category}) não pode ser inserida nesta posição.`,
    solutionTip: `Siga a estrutura canônica Sujeito + Advérbio + Verbo + Objeto (SVO) ou consulte os termos sugeridos para a posição ${pos}.`,
    exampleCorrect: 'Sujeito + Verbo + Objeto',
    exampleIncorrect: `*${prevWord.label} ${candidate.label}`,
    offendingWord: candidate,
    previousWord: prevWord,
    position: pos,
  };
}
