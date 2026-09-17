import { DialogueScenario } from '../types';

export const DIALOGUE_SCENARIOS: DialogueScenario[] = [
  {
    id: 'restaurant',
    title: 'Noite no Restaurante Chinês',
    subtitle: 'Convidar amigo, interagir com garçom, pedir pratos e checar o preço',
    description: 'Você vai convidar seu amigo Wang Ming para jantar, chegar ao restaurante, cumprimentar o atendente, pedir bebidas, dizer o que gosta de comer e perguntar o preço da conta.',
    iconEmoji: '🍜',
    category: 'restaurant',
    difficulty: 'Iniciante (HSK 1)',
    character: {
      id: 'wang_ming',
      name: 'Wang Ming',
      hanziName: '王明',
      role: 'Amigo Chinês',
      avatarEmoji: '👦🏻',
      description: 'Seu amigo de Pequim que adora experimentar bons pratos chineses e sempre o ajuda a praticar mandarim.',
    },
    secondaryCharacter: {
      id: 'fuwuyuan',
      name: 'Fúwùyuán',
      hanziName: '服务员',
      role: 'Atendente do Restaurante',
      avatarEmoji: '🤵🏻',
      description: 'Garçom atencioso e educado do restaurante tradicional chinês.',
    },
    steps: [
      {
        id: 'rest_step_1',
        stepNumber: 1,
        title: 'O Convite para Jantar',
        promptGoal: 'Convide Wang Ming para comer ou sugira ir a um restaurante chinês juntos.',
        characterPromptHanzi: '你好！今天晚上你想去哪里吃饭？',
        characterPromptPinyin: 'Nǐ hǎo! Jīntiān wǎnshang nǐ xiǎng qù nǎlǐ chīfàn?',
        characterPromptPortuguese: 'Olá! Onde você gostaria de ir comer hoje à noite?',
        characterSpeakerName: 'Wang Ming (王明)',
        expectedKeywords: ['qu', 'chifan', 'canguan', 'zhongguo', 'ba', 'chi', 'women', 'xiang'],
        recommendedWords: ['women', 'qu', 'zhongguo', 'canguan', 'chifan', 'ba', 'xiang'],
        suggestedAnswers: [
          {
            hanzi: '我们去中国餐馆吃饭吧！',
            pinyin: 'wǒmen qù zhōngguó cānguǎn chīfàn ba!',
            portuguese: 'Vamos comer em um restaurante chinês!',
            explanation: 'Uso perfeito da partícula sugestiva 吧 (ba) para convidar.'
          },
          {
            hanzi: '我想去餐馆吃饭。',
            pinyin: 'wǒ xiǎng qù cānguǎn chīfàn.',
            portuguese: 'Eu quero ir ao restaurante comer.',
            explanation: 'Uso do verbo auxiliar 想 (xiǎng) indicando intenção.'
          },
          {
            hanzi: '我们去吃中国菜，好吗？',
            pinyin: 'wǒmen qù chī zhōngguó cài, hǎo ma?',
            portuguese: 'Vamos comer comida chinesa, tudo bem?',
            explanation: 'Pergunta polida com 好吗 (hǎo ma).'
          }
        ],
        characterSuccessReplyHanzi: '太好了！我也很想吃中国菜，那家餐馆很不错，我们走吧！',
        characterSuccessReplyPinyin: 'Tài hǎo le! Wǒ yě hěn xiǎng chī zhōngguó cài, nà jiā cānguǎn hěn bùcuò, wǒmen zǒu ba!',
        characterSuccessReplyPortuguese: 'Excelente! Eu também quero muito comer comida chinesa, aquele restaurante é ótimo, vamos lá!'
      },
      {
        id: 'rest_step_2',
        stepNumber: 2,
        title: 'Chegando lá: Cumprimentar o Atendente e Pedir Bebidas',
        promptGoal: 'Cumprimente o atendente e peça o que você quer beber (chá, café ou água).',
        characterPromptHanzi: '欢迎光临！两位请进，请坐！请问你们想喝什么？',
        characterPromptPinyin: 'Huānyíng guānglín! Liǎng wèi qǐng jìn, qǐng zuò! Qǐngwèn nǐmen xiǎng hē shénme?',
        characterPromptPortuguese: 'Sejam bem-vindos! Os dois por favor entrem e sentem-se! Por favor, o que vocês gostariam de beber?',
        characterSpeakerName: 'Fúwùyuán (服务员)',
        expectedKeywords: ['he', 'cha', 'shui', 'kafei', 'xiang', 'qing', 'wo'],
        recommendedWords: ['wo', 'xiang', 'he', 'cha', 'shui', 'kafei', 'qing', 'gei'],
        suggestedAnswers: [
          {
            hanzi: '你好！我想喝茶。',
            pinyin: 'nǐ hǎo! wǒ xiǎng hē chá.',
            portuguese: 'Olá! Eu quero tomar chá.',
            explanation: 'Direto, educado e canônico com 想喝茶.'
          },
          {
            hanzi: '请给我们两杯茶。',
            pinyin: 'qǐng gěi wǒmen liǎng bēi chá.',
            portuguese: 'Por favor nos dê dois copos de chá.',
            explanation: 'Frase cortês com classificador 杯 (bēi) e 两 (liǎng).'
          },
          {
            hanzi: '服务员，你好！我想喝水。',
            pinyin: 'fúwùyuán, nǐ hǎo! wǒ xiǎng hē shuǐ.',
            portuguese: 'Garçom, olá! Eu quero beber água.',
            explanation: 'Cumprimento direto ao atendente com pedido de água.'
          }
        ],
        characterSuccessReplyHanzi: '好的，请稍等！这是热茶。你们看看想吃什么？',
        characterSuccessReplyPinyin: 'Hǎo de, qǐng shāo děng! Zhè shì rè chá. Nǐmen kànkan xiǎng chī shénme?',
        characterSuccessReplyPortuguese: 'Certo, por favor aguardem um instante! Aqui está o chá quente. Vejam o que gostariam de comer!'
      },
      {
        id: 'rest_step_3',
        stepNumber: 3,
        title: 'Escolhendo os Pratos: Dizer o que Gosta de Comer',
        promptGoal: 'Diga a Wang Ming o que você gosta de comer (comida chinesa, arroz, carnes, legumes ou peixe).',
        characterPromptHanzi: '这家店的中国菜很有名！你平时喜欢吃什么菜？',
        characterPromptPinyin: 'Zhè jiā diàn de zhōngguó cài hěn yǒumíng! Nǐ píngshí xǐhuan chī shénme cài?',
        characterPromptPortuguese: 'A comida chinesa desta casa é muito famosa! O que você normalmente gosta de comer?',
        characterSpeakerName: 'Wang Ming (王明)',
        expectedKeywords: ['xihuan', 'chi', 'cai', 'zhongguo', 'mifan', 'rou', 'yu', 'wo'],
        recommendedWords: ['wo', 'xihuan', 'chi', 'zhongguo', 'cai', 'mifan', 'hen', 'ye'],
        suggestedAnswers: [
          {
            hanzi: '我很喜欢吃中国菜和米饭。',
            pinyin: 'wǒ hěn xǐhuan chī zhōngguó cài hé mǐfàn.',
            portuguese: 'Eu gosto muito de comer comida chinesa e arroz.',
            explanation: 'Expressão de apreço com 很喜欢 (hěn xǐhuan) e conjunção 和 (hé).'
          },
          {
            hanzi: '我喜欢吃鱼，也喜欢吃菜。',
            pinyin: 'wǒ xǐhuan chī yú, yě xǐhuan chī cài.',
            portuguese: 'Eu gosto de comer peixe, e também gosto de comer legumes/verduras.',
            explanation: 'Uso do advérbio 也 (yě) antes do segundo predicado verbal.'
          },
          {
            hanzi: '我想吃牛肉，不吃猪肉。',
            pinyin: 'wǒ xiǎng chī niúròu, bù chī zhūròu.',
            portuguese: 'Eu quero comer carne bovina, não como carne de porco.',
            explanation: 'Uso de 不 (bù) para negação no presente de hábitos alimentares.'
          }
        ],
        characterSuccessReplyHanzi: '明白了！那我们点一个特色菜和两碗米饭，味道非常棒！',
        characterSuccessReplyPinyin: 'Míngbai le! Nà wǒmen diǎn yī ge tèsè cài hé liǎng wǎn mǐfàn, wèidao fēicháng bàng!',
        characterSuccessReplyPortuguese: 'Entendido! Então vamos pedir um prato especial e duas tigelas de arroz, o sabor é incrível!'
      },
      {
        id: 'rest_step_4',
        stepNumber: 4,
        title: 'Perguntando o Preço ao Atendente',
        promptGoal: 'Chame o garçom e pergunte o preço de um prato ou da conta total usando 多少钱 (duōshao qián).',
        characterPromptHanzi: '菜上齐了，味道怎么样？请问还需要点什么吗？',
        characterPromptPinyin: 'Cài shàng qí le, wèidao zěnmeyàng? Qǐngwèn hái xūyào diǎn shénme ma?',
        characterPromptPortuguese: 'Todos os pratos foram servidos, como está o sabor? Por favor, precisam de mais alguma coisa?',
        characterSpeakerName: 'Fúwùyuán (服务员)',
        expectedKeywords: ['duoshao', 'qian', 'zhe', 'ge', 'qingwen', 'kuai'],
        recommendedWords: ['qingwen', 'zhe', 'ge', 'duoshao', 'qian', 'fuwuyuan', 'yi', 'gong'],
        suggestedAnswers: [
          {
            hanzi: '服务员，请问这个多少钱？',
            pinyin: 'fúwùyuán, qǐngwèn zhè ge duōshao qián?',
            portuguese: 'Garçom, com licença, quanto custa este aqui?',
            explanation: 'A expressão clássica de pergunta de preços: 这个多少钱？'
          },
          {
            hanzi: '一共多少钱？',
            pinyin: 'yīgòng duōshao qián?',
            portuguese: 'Quanto é tudo junto / qual o total?',
            explanation: '一共 (yīgòng) significa no total.'
          },
          {
            hanzi: '请问茶多少钱？',
            pinyin: 'qǐngwèn chá duōshao qián?',
            portuguese: 'Por favor, quanto custa o chá?',
            explanation: 'Pergunta polida com 请问 (qǐngwèn).'
          }
        ],
        characterSuccessReplyHanzi: '这个菜三十块钱，茶是免费送的，一共八十块钱！',
        characterSuccessReplyPinyin: 'Zhè ge cài sānshí kuài qián, chá shì miǎnfèi sòng de, yīgòng bāshí kuài qián!',
        characterSuccessReplyPortuguese: 'Este prato custa 30 yuan (kuai), o chá é cortesia da casa, no total dá 80 yuan!'
      },
      {
        id: 'rest_step_5',
        stepNumber: 5,
        title: 'Elogiando a Refeição e Finalizando',
        promptGoal: 'Elogie a comida dizendo que é muito saborosa (好吃 / hǎochī) ou que você gostou muito.',
        characterPromptHanzi: '今天的菜真的很地道！中国菜很好吃吧？你吃饱了吗？',
        characterPromptPinyin: 'Jīntiān de cài zhēn de hěn dìdào! Zhōngguó cài hěn hǎochī ba? Nǐ chī bǎo le ma?',
        characterPromptPortuguese: 'Os pratos de hoje estavam realmente autênticos! Comida chinesa é muito gostosa, né? Você ficou satisfeito?',
        characterSpeakerName: 'Wang Ming (王明)',
        expectedKeywords: ['hen', 'haochi', 'xihuan', 'xiexie', 'chi', 'tai', 'le'],
        recommendedWords: ['zhongguo', 'cai', 'hen', 'haochi', 'wo', 'hen', 'xihuan', 'xiexie'],
        suggestedAnswers: [
          {
            hanzi: '中国菜很好吃，我很喜欢！',
            pinyin: 'zhōngguó cài hěn hǎochī, wǒ hěn xǐhuan!',
            portuguese: 'A comida chinesa é muito gostosa, eu gostei muito!',
            explanation: '好吃 (hǎochī) é o termo perfeito para comidas deliciosas.'
          },
          {
            hanzi: '太好吃了！谢谢你。',
            pinyin: 'tài hǎochī le! xièxie nǐ.',
            portuguese: 'Estava gostoso demais! Obrigado a você.',
            explanation: 'A estrutura enfática 太...了 (tài...le).'
          },
          {
            hanzi: '我也觉得很好吃，下次我们再来！',
            pinyin: 'wǒ yě juéde hěn hǎochī, xià cì wǒmen zài lái!',
            portuguese: 'Eu também achei muito gostoso, na próxima vez voltaremos!',
            explanation: 'Excelente expressão natural para combinar a próxima visita.'
          }
        ],
        characterSuccessReplyHanzi: '哈哈，太棒了！下次我再带你去尝尝别的特色菜。我们走吧！',
        characterSuccessReplyPinyin: 'Hāhā, tài bàng le! Xià cì wǒ zài dài nǐ qù chángchang bié de tèsè cài. Wǒmen zǒu ba!',
        characterSuccessReplyPortuguese: 'Haha, maravilhoso! Da próxima vez vou levar você para provar outros pratos típicos. Vamos lá!'
      }
    ]
  },
  {
    id: 'job_interview',
    title: 'Entrevista de Emprego (中国公司面试)',
    subtitle: 'Apresentar-se, falar da família, dos estudos e do emprego anterior',
    description: 'Você está participando de uma entrevista formal de emprego em uma empresa chinesa multinacional com o Gerente Zhang. Fale sobre sua origem, sua família, seus estudos e sua experiência profissional anterior.',
    iconEmoji: '💼',
    category: 'job_interview',
    difficulty: 'Intermediário (HSK 1-2)',
    character: {
      id: 'zhang_jingli',
      name: 'Zhang Jingli',
      hanziName: '张经理',
      role: 'Gerente de Contratação e RH',
      avatarEmoji: '👨🏻‍💼',
      description: 'Gerente experiente e profissional da empresa chinesa, interessado em saber sobre suas habilidades e histórico.',
    },
    steps: [
      {
        id: 'job_step_1',
        stepNumber: 1,
        title: 'Apresentação Pessoal Inicial',
        promptGoal: 'Cumprimente formalmente o entrevistador, diga seu nome e sua nacionalidade (ex: sou brasileiro).',
        characterPromptHanzi: '您好！请坐。我是人事部的张经理。请简单介绍一下你自己。',
        characterPromptPinyin: 'Nín hǎo! Qǐng zuò. Wǒ shì rénshìbù de Zhāng jīnglǐ. Qǐng jiǎndān jièshào yīxià nǐ zìjǐ.',
        characterPromptPortuguese: 'Olá (formal)! Por favor, sente-se. Sou o Gerente Zhang do departamento de RH. Por favor, apresente-se brevemente.',
        characterSpeakerName: 'Zhang Jingli (张经理)',
        expectedKeywords: ['nin', 'hao', 'wo', 'shi', 'baxi', 'ren', 'jiao', 'mingzi'],
        recommendedWords: ['nin', 'hao', 'wo', 'shi', 'baxi', 'ren', 'wo', 'jiao'],
        suggestedAnswers: [
          {
            hanzi: '张经理您好！我叫胡里奥，我是巴西人。',
            pinyin: "Zhāng jīnglǐ nín hǎo! wǒ jiào Húlǐ'ào, wǒ shì bāxī rén.",
            portuguese: 'Olá Gerente Zhang! Meu nome é Julio, sou brasileiro.',
            explanation: 'Cumprimento respeitoso com 您好 (nín hǎo) e apresentação clara de nacionalidade.'
          },
          {
            hanzi: '您好！我是巴西人，很高兴认识您。',
            pinyin: 'nín hǎo! wǒ shì bāxī rén, hěn gāoxìng rènshi nín.',
            portuguese: 'Olá! Sou brasileiro, é um prazer conhecê-lo.',
            explanation: 'Frase formal de etiqueta em entrevistas de emprego.'
          },
          {
            hanzi: '您好，我叫卢卡斯，我在学习汉语。',
            pinyin: 'nín hǎo, wǒ jiào Lúkǎsī, wǒ zài xuéxí hànyǔ.',
            portuguese: 'Olá, meu nome é Lucas, estou estudando chinês.',
            explanation: 'Demonstração proativa de estudo do idioma.'
          }
        ],
        characterSuccessReplyHanzi: '很好，欢迎你来我们公司面试！你的汉语发音很清楚。',
        characterSuccessReplyPinyin: 'Hěn hǎo, huānyíng nǐ lái wǒmen gōngsī miànshì! Nǐ de hànyǔ fāyīn hěn qīngchu.',
        characterSuccessReplyPortuguese: 'Muito bem, seja bem-vindo à entrevista na nossa empresa! Sua pronúncia de chinês é bem clara.'
      },
      {
        id: 'job_step_2',
        stepNumber: 2,
        title: 'Falando sobre sua Família',
        promptGoal: 'Responda dizendo quantas pessoas há na sua família usando 有几口人 / 家 (jiā) e mencione membros da família.',
        characterPromptHanzi: '我想了解一下你的生活背景。你家里有几口人？他们都在哪里？',
        characterPromptPinyin: 'Wǒ xiǎng liǎojiě yīxià nǐ de shēnghuó bèijǐng. Nǐ jiā li yǒu jǐ kǒu rén? Tāmen dōu zài nǎlǐ?',
        characterPromptPortuguese: 'Gostaria de entender um pouco do seu histórico de vida. Quantas pessoas há na sua família? Onde eles estão?',
        characterSpeakerName: 'Zhang Jingli (张经理)',
        expectedKeywords: ['jia', 'you', 'kou', 'ren', 'baba', 'mama', 'wo', 'gege', 'jiejie'],
        recommendedWords: ['wo', 'jia', 'you', 'si', 'san', 'wu', 'kou', 'ren', 'baba', 'mama', 'he'],
        suggestedAnswers: [
          {
            hanzi: '我家有四口人：爸爸、妈妈、妹妹和我。',
            pinyin: 'wǒ jiā yǒu sì kǒu rén: bàba, māma, mèimei hé wǒ.',
            portuguese: 'Minha família tem quatro pessoas: papai, mamãe, irmã mais nova e eu.',
            explanation: 'Uso canônico do classificador 口 (kǒu) específico para membros da família.'
          },
          {
            hanzi: '我家有三口人，他们都在巴西。',
            pinyin: 'wǒ jiā yǒu sān kǒu rén, tāmen dōu zài bāxī.',
            portuguese: 'Minha família tem três pessoas, todos eles estão no Brasil.',
            explanation: 'Uso do advérbio 都 (dōu) e do verbo locativo 在 (zài).'
          },
          {
            hanzi: '我家有五口人，我们很幸福。',
            pinyin: 'wǒ jiā yǒu wǔ kǒu rén, wǒmen hěn xìngfú.',
            portuguese: 'Minha família tem cinco pessoas, somos muito felizes.',
            explanation: 'Resposta calorosa e natural.'
          }
        ],
        characterSuccessReplyHanzi: '家庭很和睦，非常好！稳定的家庭对工作很有帮助。',
        characterSuccessReplyPinyin: 'Jiātíng hěn hémù, fēicháng hǎo! Wěndìng de jiātíng duì gōngzuò hěn yǒu bāngzhù.',
        characterSuccessReplyPortuguese: 'Uma família muito harmoniosa, ótimo! Uma família estável ajuda muito na carreira profissional.'
      },
      {
        id: 'job_step_3',
        stepNumber: 3,
        title: 'Seus Estudos e Formação Acadêmica',
        promptGoal: 'Fale sobre seus estudos, onde você estudou (na universidade / escola) e seu aprendizado de línguas.',
        characterPromptHanzi: '你在哪里学习？你的专业是什么？学习汉语多久了？',
        characterPromptPinyin: 'Nǐ zài nǎlǐ xuéxí? Nǐ de zhuānyè shì shénme? Xuéxí hànyǔ duōjiǔ le?',
        characterPromptPortuguese: 'Onde você estudou? Qual é a sua especialidade? Há quanto tempo estuda mandarim?',
        characterSpeakerName: 'Zhang Jingli (张经理)',
        expectedKeywords: ['zai', 'daxue', 'xuexiao', 'xuexi', 'hanyu', 'nian', 'wo'],
        recommendedWords: ['wo', 'zai', 'daxue', 'xuexi', 'hanyu', 'xuexiao', 'hen', 'xihuan'],
        suggestedAnswers: [
          {
            hanzi: '我在大学学习，我也很努力学习汉语。',
            pinyin: 'wǒ zài dàxué xuéxí, wǒ yě hěn nǔlì xuéxí hànyǔ.',
            portuguese: 'Eu estudei na universidade, e também estudo chinês com muita dedicação.',
            explanation: 'Estrutura 在 + Local + Verbo de ação.'
          },
          {
            hanzi: '我在巴西的大学学习，学习汉语一年了。',
            pinyin: 'wǒ zài bāxī de dàxué xuéxí, xuéxí hànyǔ yī nián le.',
            portuguese: 'Eu estudei em uma universidade no Brasil, e estudo chinês há um ano.',
            explanation: 'Expressão de duração com 一年了 (yī nián le).'
          },
          {
            hanzi: '我喜欢学习新东西，我在学校读过书。',
            pinyin: 'wǒ xǐhuan xuéxí xīn dōngxi, wǒ zài xuéxiào dú guo shū.',
            portuguese: 'Eu gosto de aprender coisas novas, estudei na escola/faculdade.',
            explanation: 'Uso da partícula aspectual 过 (guo) indicando experiência passada.'
          }
        ],
        characterSuccessReplyHanzi: '有很好的大学背景，并且愿意持续学习，这是我们非常看重的品质。',
        characterSuccessReplyPinyin: 'Yǒu hěn hǎo de dàxué bèijǐng, bìngqiě yuànyì chíxù xuéxí, zhè shì wǒmen fēicháng kànzhòng de pǐnzhì.',
        characterSuccessReplyPortuguese: 'Ter uma boa formação universitária e disposição para aprender continuamente são qualidades que valorizamos muito.'
      },
      {
        id: 'job_step_4',
        stepNumber: 4,
        title: 'Seu Último Emprego e Experiência',
        promptGoal: 'Fale sobre seu trabalho anterior ou sua experiência profissional (ex: trabalhei numa empresa, o trabalho era bom).',
        characterPromptHanzi: '请告诉我，你以前在哪里工作？你的上一个工作怎么样？',
        characterPromptPinyin: 'Qǐng gàosu wǒ, nǐ yǐqián zài nǎlǐ gōngzuò? Nǐ de shàng yī ge gōngzuò zěnmeyàng?',
        characterPromptPortuguese: 'Por favor me diga, onde você trabalhava antes? Como era seu trabalho anterior?',
        characterSpeakerName: 'Zhang Jingli (张经理)',
        expectedKeywords: ['gongzuo', 'gongsi', 'zai', 'hen', 'hao', 'wo', 'de'],
        recommendedWords: ['wo', 'zai', 'gongsi', 'gongzuo', 'wo', 'de', 'gongzuo', 'hen', 'hao'],
        suggestedAnswers: [
          {
            hanzi: '我以前在一个大公司工作，我的工作很好。',
            pinyin: 'wǒ yǐqián zài yī ge dà gōngsī gōngzuò, wǒ de gōngzuò hěn hǎo.',
            portuguese: 'Antes eu trabalhava em uma grande empresa, meu trabalho era muito bom.',
            explanation: 'Uso do advérbio de tempo 以前 (yǐqián) e 在 + 公司 + 工作.'
          },
          {
            hanzi: '我在中国公司工作过，我很喜欢那里的同事。',
            pinyin: 'wǒ zài zhōngguó gōngsī gōngzuò guo, wǒ hěn xǐhuan nàlǐ de tóngshì.',
            portuguese: 'Já trabalhei em uma empresa chinesa, gostava muito dos colegas de lá.',
            explanation: 'Experiência prévia com 工作过 (gōngzuò guo).'
          },
          {
            hanzi: '我的工作经验很多，每天都很努力工作。',
            pinyin: 'wǒ de gōngzuò jīngyàn hěn duō, měitiān dōu hěn nǔlì gōngzuò.',
            portuguese: 'Tenho bastante experiência profissional, trabalhava com muito empenho todos os dias.',
            explanation: 'Uso de 每天都 (měitiān dōu) para enfatizar constância.'
          }
        ],
        characterSuccessReplyHanzi: '有相关的工作经验非常好，这能让你更快适应我们的团队。',
        characterSuccessReplyPinyin: 'Yǒu xiāngguān de gōngzuò jīngyàn fēicháng hǎo, zhè néng ràng nǐ gèng kuài shìyìng wǒmen de tuánduì.',
        characterSuccessReplyPortuguese: 'Ter experiência de trabalho na área é excelente, isso permitirá que você se adapte mais rápido à nossa equipe.'
      },
      {
        id: 'job_step_5',
        stepNumber: 5,
        title: 'Motivação: Por que quer trabalhar nesta empresa',
        promptGoal: 'Explique por que quer trabalhar nesta empresa usando 因为 (yīnwèi) ou expressando seu desejo com 想 (xiǎng).',
        characterPromptHanzi: '最后，你为什么想来我们公司工作？你未来的目标是什么？',
        characterPromptPinyin: 'Zuìhòu, nǐ wèishénme xiǎng lái wǒmen gōngsī gōngzuò? Nǐ wèilái de mùbiāo shì shénme?',
        characterPromptPortuguese: 'Por último, por que você quer vir trabalhar em nossa empresa? Qual é o seu objetivo futuro?',
        characterSpeakerName: 'Zhang Jingli (张经理)',
        expectedKeywords: ['yinwei', 'xiang', 'gongsi', 'gongzuo', 'zhongguo', 'xihuan', 'wo'],
        recommendedWords: ['yinwei', 'wo', 'xiang', 'zai', 'zhongguo', 'gongsi', 'gongzuo', 'xihuan'],
        suggestedAnswers: [
          {
            hanzi: '因为我想在中国公司工作，我非常喜欢中国文化。',
            pinyin: 'yīnwèi wǒ xiǎng zài zhōngguó gōngsī gōngzuò, wǒ fēicháng xǐhuan zhōngguó wénhuà.',
            portuguese: 'Porque eu quero trabalhar em uma empresa chinesa, eu gosto muito da cultura chinesa.',
            explanation: 'Conjunção causal 因为 (yīnwèi) respondendo à pergunta com 为什么 (wèishénme).'
          },
          {
            hanzi: '因为你们公司很好，我想学习更多东西。',
            pinyin: 'yīnwèi nǐmen gōngsī hěn hǎo, wǒ xiǎng xuéxí gèng duō dōngxi.',
            portuguese: 'Porque a empresa de vocês é excelente, e eu quero aprender ainda mais.',
            explanation: 'Excelente justificativa com foco em crescimento profissional.'
          },
          {
            hanzi: '我想和中国同事一起工作，做好这个工作。',
            pinyin: 'wǒ xiǎng hé zhōngguó tóngshì yīqǐ gōngzuò, zuò hǎo zhè ge gōngzuò.',
            portuguese: 'Eu quero trabalhar junto com colegas chineses e desempenhar bem esta função.',
            explanation: 'Estrutura 和...一起 (hé...yīqǐ) expressando trabalho em equipe.'
          }
        ],
        characterSuccessReplyHanzi: '非常棒的回答！感谢你今天的面试，我们会在下周通知你录用结果。祝你今天愉快！',
        characterSuccessReplyPinyin: 'Fēicháng bàng de huídá! Gǎnxiè nǐ jīntiān de miànshì, wǒmen huì zài xià zhōu tōngzhī nǐ lùyòng jiéguǒ. Zhù nǐ jīntiān yúkuài!',
        characterSuccessReplyPortuguese: 'Excelente resposta! Muito obrigado pela entrevista de hoje, entraremos em contato na próxima semana com o resultado. Tenha um ótimo dia!'
      }
    ]
  },
  {
    id: 'shopping',
    title: 'Compras na Feira e Supermercado (超市与市场买东西)',
    subtitle: 'Convidar para ir às compras, procurar frutas, pechinchar e pagar',
    description: 'Acompanhe a vendedora Li Ayi na feira e no supermercado: convide para ir ao mercado, pergunte onde estão as frutas, negocie preços dizendo se está caro ou barato e conclua a compra.',
    iconEmoji: '🛍️',
    category: 'shopping',
    difficulty: 'Iniciante (HSK 1)',
    character: {
      id: 'li_ayi',
      name: 'Li Ayi',
      hanziName: '李阿姨',
      role: 'Vendedora do Mercado',
      avatarEmoji: '👵🏻',
      description: 'Dona de banca simpática e comunicativa que vende frutas frescas e produtos do dia a dia.',
    },
    steps: [
      {
        id: 'shop_step_1',
        stepNumber: 1,
        title: 'Convidar para ir ao Supermercado',
        promptGoal: 'Convide alguém para ir ao supermercado ou loja fazer compras usando 我们去 (wǒmen qù) e 吧 (ba).',
        characterPromptHanzi: '家里没有水果和茶了，今天天气很好，我们要做什么？',
        characterPromptPinyin: 'Jiā li méiyǒu shuǐguǒ hé chá le, jīntiān tiānqì hěn hǎo, wǒmen yào zuò shénme?',
        characterPromptPortuguese: 'Não tem mais frutas e chá em casa, hoje o tempo está ótimo, o que vamos fazer?',
        characterSpeakerName: 'Li Ayi (李阿姨)',
        expectedKeywords: ['women', 'qu', 'chaoshi', 'mai', 'dongxi', 'ba', 'shangdian'],
        recommendedWords: ['women', 'qu', 'chaoshi', 'mai', 'dongxi', 'ba', 'shangdian'],
        suggestedAnswers: [
          {
            hanzi: '我们去超市买东西吧！',
            pinyin: 'wǒmen qù chāoshì mǎi dōngxi ba!',
            portuguese: 'Vamos ao supermercado fazer compras!',
            explanation: 'Uso de 买东西 (mǎi dōngxi - fazer compras) e 吧 (ba).'
          },
          {
            hanzi: '我们去商店买水果。',
            pinyin: 'wǒmen qù shāngdiàn mǎi shuǐguǒ.',
            portuguese: 'Vamos à loja comprar frutas.',
            explanation: 'Objetivo claro com 买水果 (comprar frutas).'
          }
        ],
        characterSuccessReplyHanzi: '好主意！超市的水果非常新鲜，我们现在就去！',
        characterSuccessReplyPinyin: 'Hǎo zhǔyi! Chāoshì de shuǐguǒ fēicháng xīnxiān, wǒmen xiànzài jiù qù!',
        characterSuccessReplyPortuguese: 'Boa ideia! As frutas do supermercado são muito frescas, vamos agora mesmo!'
      },
      {
        id: 'shop_step_2',
        stepNumber: 2,
        title: 'Perguntando onde estão os produtos',
        promptGoal: 'Pergunte à vendedora onde ficam as maçãs ou o chá usando 在哪里 (zài nǎlǐ).',
        characterPromptHanzi: '你好小伙子！想买点什么？今天刚到了很多新鲜的水果和好茶。',
        characterPromptPinyin: 'Nǐ hǎo xiǎohuǒzi! Xiǎng mǎi diǎn shénme? Jīntiān gāng dào le hěn duō xīnxiān de shuǐguǒ hé hǎo chá.',
        characterPromptPortuguese: 'Olá jovem! O que você gostaria de comprar? Hoje acabaram de chegar muitas frutas frescas e chás bons.',
        characterSpeakerName: 'Li Ayi (李阿姨)',
        expectedKeywords: ['qingwen', 'pingguo', 'cha', 'zai', 'nali', 'wo', 'xiang', 'mai'],
        recommendedWords: ['qingwen', 'pingguo', 'zai', 'nali', 'wo', 'xiang', 'mai', 'cha'],
        suggestedAnswers: [
          {
            hanzi: '请问，苹果在哪里？我想买苹果。',
            pinyin: 'qǐngwèn, píngguǒ zài nǎlǐ? wǒ xiǎng mǎi píngguǒ.',
            portuguese: 'Com licença, onde estão as maçãs? Eu quero comprar maçãs.',
            explanation: 'A pergunta de localização com 在哪里 (zài nǎlǐ).'
          },
          {
            hanzi: '阿姨好！请问中国茶在哪里？',
            pinyin: 'āyí hǎo! qǐngwèn zhōngguó chá zài nǎlǐ?',
            portuguese: 'Olá titia/senhora! Por favor, onde fica o chá chinês?',
            explanation: 'Tratamento carinhoso com 阿姨 (āyí).'
          }
        ],
        characterSuccessReplyHanzi: '苹果在左边，这儿还有红苹果和绿苹果，茶在前面，随你挑选！',
        characterSuccessReplyPinyin: 'Píngguǒ zài zuǒbian, zhèr hái yǒu hóng píngguǒ hé lǜ píngguǒ, chá zài qiánmian, suí nǐ tiāoxuǎn!',
        characterSuccessReplyPortuguese: 'As maçãs ficam à esquerda, aqui tem maçãs vermelhas e verdes, e o chá fica logo em frente, fique à vontade para escolher!'
      },
      {
        id: 'shop_step_3',
        stepNumber: 3,
        title: 'Perguntando o Preço e Avaliando (Caro ou Barato)',
        promptGoal: 'Pergunte o preço (多少钱) e comente que está barato (很便宜) ou caro (太贵了).',
        characterPromptHanzi: '这些红苹果个头大又甜，你要几个？看看喜欢不？',
        characterPromptPinyin: 'Zhèxiē hóng píngguǒ gètóu dà yòu tián, nǐ yào jǐ ge? Kànkan xǐhuan bu?',
        characterPromptPortuguese: 'Estas maçãs vermelhas são grandes e bem doces, quantas você quer? Veja se você gosta!',
        characterSpeakerName: 'Li Ayi (李阿姨)',
        expectedKeywords: ['duoshao', 'qian', 'kuai', 'pianyi', 'gui', 'zhe', 'ge'],
        recommendedWords: ['zhe', 'ge', 'duoshao', 'qian', 'tai', 'gui', 'le', 'hen', 'pianyi'],
        suggestedAnswers: [
          {
            hanzi: '请问这个苹果多少钱一斤？太贵了吗？',
            pinyin: 'qǐngwèn zhè ge píngguǒ duōshao qián yī jīn? tài guì le ma?',
            portuguese: 'Por favor, quanto custa esta maçã por meio quilo? É muito cara?',
            explanation: 'Pergunta de preço com 多少钱.'
          },
          {
            hanzi: '这个多少钱？五块钱很便宜！',
            pinyin: 'zhè ge duōshao qián? wǔ kuài qián hěn piányi!',
            portuguese: 'Quanto custa este aqui? Cinco kuai é muito barato!',
            explanation: 'Uso do adjetivo 便宜 (piányi - barato).'
          }
        ],
        characterSuccessReplyHanzi: '一斤只要五块钱，不贵，真的很便宜！我再给你挑两个最大的。',
        characterSuccessReplyPinyin: 'Yī jīn zhǐ yào wǔ kuài qián, bù guì, zhēn de hěn piányi! Wǒ zài gěi nǐ tiāo liǎng ge zuì dà de.',
        characterSuccessReplyPortuguese: 'Meio quilo são só 5 kuai, não é caro, é muito barato mesmo! Vou escolher mais duas das maiores para você.'
      },
      {
        id: 'shop_step_4',
        stepNumber: 4,
        title: 'Finalizando a Compra e Agradecendo',
        promptGoal: 'Diga que vai comprar esses produtos e agradeça cordialmente.',
        characterPromptHanzi: '一共是十五块钱。小伙子，还要别的吗？',
        characterPromptPinyin: 'Yīgòng shì shíwǔ kuài qián. Xiǎohuǒzi, hái yào bié de ma?',
        characterPromptPortuguese: 'No total dá 15 kuai (yuan). Jovem, precisa de mais alguma coisa?',
        characterSpeakerName: 'Li Ayi (李阿姨)',
        expectedKeywords: ['mai', 'xiexie', 'bu', 'yao', 'le', 'gei', 'nin', 'qian'],
        recommendedWords: ['wo', 'mai', 'zhe', 'ge', 'xiexie', 'bu', 'yao', 'le'],
        suggestedAnswers: [
          {
            hanzi: '我买这些，谢谢阿姨！',
            pinyin: 'wǒ mǎi zhèxiē, xièxie āyí!',
            portuguese: 'Vou comprar estes aqui, obrigado titia!',
            explanation: 'Uso de 这些 (zhèxiē - estes) e agradecimento afetuoso.'
          },
          {
            hanzi: '不要别的了，给你钱，谢谢！',
            pinyin: 'bù yào bié de le, gěi nǐ qián, xièxie!',
            portuguese: 'Não preciso de mais nada, aqui está o dinheiro, obrigado!',
            explanation: 'Expressão prática para concluir o pagamento.'
          }
        ],
        characterSuccessReplyHanzi: '收你十五块，慢走啊，常来买水果！再见！',
        characterSuccessReplyPinyin: 'Shōu nǐ shíwǔ kuài, màn zǒu a, cháng lái mǎi shuǐguǒ! Zàijiàn!',
        characterSuccessReplyPortuguese: 'Recebidos 15 kuai, vá com cuidado, volte sempre para comprar frutas! Até logo!'
      }
    ]
  },
  {
    id: 'social_friendship',
    title: 'Conhecendo uma Amiga e Convidando para Café (结交新朋友)',
    subtitle: 'Apresentar-se, falar de hobbies, animais de estimação e convidar para café',
    description: 'Pratique uma conversa espontânea com Xiao Lin na universidade: pergunte de onde ela é, fale sobre sua família e animais de estimação (gato/cachorro), e convide-a para tomar um chá ou café.',
    iconEmoji: '☕',
    category: 'social',
    difficulty: 'Iniciante (HSK 1)',
    character: {
      id: 'xiao_lin',
      name: 'Xiao Lin',
      hanziName: '小林',
      role: 'Colega de Intercâmbio',
      avatarEmoji: '👧🏻',
      description: 'Estudante amigável e curiosa sobre o Brasil, adora animais e conversar em cafeterias.',
    },
    steps: [
      {
        id: 'soc_step_1',
        stepNumber: 1,
        title: 'Primeiro Contato: Nome e Origem',
        promptGoal: 'Cumprimente Xiao Lin, diga de onde você é (Brasil) e pergunte o nome ou de onde ela é.',
        characterPromptHanzi: '你好！我经常在图书馆看见你。你也是这里的学生吗？你叫什么名字？',
        characterPromptPinyin: 'Nǐ hǎo! Wǒ jīngcháng zài túshūguǎn kànjiàn nǐ. Nǐ yě shì zhèlǐ de xuésheng ma? Nǐ jiào shénme míngzi?',
        characterPromptPortuguese: 'Olá! Eu costumo ver você na biblioteca. Você também é estudante aqui? Qual é o seu nome?',
        characterSpeakerName: 'Xiao Lin (小林)',
        expectedKeywords: ['ni', 'hao', 'wo', 'jiao', 'shi', 'baxi', 'ren', 'ni', 'ne'],
        recommendedWords: ['ni', 'hao', 'wo', 'jiao', 'wo', 'shi', 'baxi', 'ren', 'ni', 'ne'],
        suggestedAnswers: [
          {
            hanzi: '你好！我叫胡里奥，我是巴西人。你呢？',
            pinyin: "nǐ hǎo! wǒ jiào Húlǐ'ào, wǒ shì bāxī rén. nǐ ne?",
            portuguese: 'Olá! Meu nome é Julio, sou brasileiro. E você?',
            explanation: 'Uso da partícula elíptica 你呢？ (Nǐ ne? - E você?).'
          },
          {
            hanzi: '你好，我是巴西留学生，很高兴认识你！',
            pinyin: 'nǐ hǎo, wǒ shì bāxī liúxuéshēng, hěn gāoxìng rènshi nǐ!',
            portuguese: 'Olá, sou estudante estrangeiro do Brasil, muito prazer em conhecê-la!',
            explanation: 'Expressão de cortesia 很高兴认识你.'
          }
        ],
        characterSuccessReplyHanzi: '巴西！哇，太酷了！我叫林静，我是北京人，很高兴认识你！',
        characterSuccessReplyPinyin: 'Bāxī! Wā, tài kù le! Wǒ jiào Lín Jìng, wǒ shì Běijīng rén, hěn gāoxìng rènshi nǐ!',
        characterSuccessReplyPortuguese: 'Brasil! Uau, que legal! Meu nome é Lin Jing, sou de Pequim, é um prazer conhecê-lo!'
      },
      {
        id: 'soc_step_2',
        stepNumber: 2,
        title: 'Falando sobre Animais de Estimação e Gostos',
        promptGoal: 'Diga se você tem um gato ou cachorro e comente se é fofo (可爱的猫 / 狗).',
        characterPromptHanzi: '听说巴西有很多热带动物！你平时喜欢小动物吗？你家里有宠物吗？',
        characterPromptPinyin: 'Tīngshuō bāxī yǒu hěn duō rèdài dòngwù! Nǐ píngshí xǐhuan xiǎo dòngwù ma? Nǐ jiā li yǒu chǒngwù ma?',
        characterPromptPortuguese: 'Ouvi dizer que o Brasil tem muitos animais tropicais! Você gosta de animaizinhos? Tem animal de estimação em casa?',
        characterSpeakerName: 'Xiao Lin (小林)',
        expectedKeywords: ['you', 'mao', 'gou', 'keai', 'wo', 'hen', 'xihuan'],
        recommendedWords: ['wo', 'you', 'yi', 'zhi', 'mao', 'gou', 'hen', 'keai', 'xihuan'],
        suggestedAnswers: [
          {
            hanzi: '我有一只猫，我的猫很可爱！',
            pinyin: "wǒ yǒu yī zhī māo, wǒ de māo hěn kě'ài!",
            portuguese: 'Eu tenho um gato, meu gato é muito fofo!',
            explanation: "Classificador de pequenos animais 只 (zhī) e adjetivo 可爱 (kě'ài)."
          },
          {
            hanzi: '我很喜欢狗，我有一只大狗。',
            pinyin: 'wǒ hěn xǐhuan gǒu, wǒ yǒu yī zhī dà gǒu.',
            portuguese: 'Eu gosto muito de cachorro, tenho um cachorro grande.',
            explanation: 'Uso de 大狗 (dà gǒu).'
          }
        ],
        characterSuccessReplyHanzi: '真可爱！我也超喜欢猫咪，我家也有一只白色的小猫！',
        characterSuccessReplyPinyin: "Zhēn kě'ài! Wǒ yě chāo xǐhuan māomī, wǒ jiā yě yǒu yī zhī báisè de xiǎomāo!",
        characterSuccessReplyPortuguese: 'Que fofo! Eu também adoro gatinhos, lá em casa também tem um gatinho branco!'
      },
      {
        id: 'soc_step_3',
        stepNumber: 3,
        title: 'Convidar para Tomar um Café ou Chá',
        promptGoal: 'Convide Xiao Lin para tomar um café ou chá juntos usando 我们去 (wǒmen qù) ou 请喝茶 (qǐng hē chá).',
        characterPromptHanzi: '我们聊得真开心！现在正好下午三点了，你口渴吗？',
        characterPromptPinyin: 'Wǒmen liáo de zhēn kāixīn! Xiànzài zhènghǎo xiàwǔ sān diǎn le, nǐ kǒukě ma?',
        characterPromptPortuguese: 'Nossa conversa está muito boa! Agora são três horas da tarde em ponto, você está com sede?',
        characterSpeakerName: 'Xiao Lin (小林)',
        expectedKeywords: ['women', 'qu', 'he', 'kafei', 'cha', 'ba', 'qing'],
        recommendedWords: ['women', 'qu', 'he', 'kafei', 'cha', 'ba', 'qing', 'wo'],
        suggestedAnswers: [
          {
            hanzi: '我们去喝咖啡吧！我请你。',
            pinyin: 'wǒmen qù hē kāfēi ba! wǒ qǐng nǐ.',
            portuguese: 'Vamos tomar um café! Eu convido você (é por minha conta).',
            explanation: 'A expressão carinhosa 我请你 (wǒ qǐng nǐ - eu pago / convido).'
          },
          {
            hanzi: '我们一起去喝茶，好吗？',
            pinyin: 'wǒmen yīqǐ qù hē chá, hǎo ma?',
            portuguese: 'Vamos juntos tomar um chá, tudo bem?',
            explanation: 'Uso de 一起 (yīqǐ - juntos).'
          }
        ],
        characterSuccessReplyHanzi: '好啊！学校旁边正好有一家新开的咖啡馆，环境很好，我们走吧！',
        characterSuccessReplyPinyin: 'Hǎo a! Xuéxiào pángbiān zhènghǎo yǒu yī jiā xīn kāi de kāfēiguǎn, huánjìng hěn hǎo, wǒmen zǒu ba!',
        characterSuccessReplyPortuguese: 'Combinado! Perto da universidade acabou de abrir um café novo, o ambiente é ótimo, vamos lá!'
      }
    ]
  }
];
