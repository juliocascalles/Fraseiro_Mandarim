/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  User, Users, MessageSquare, UserCheck, Globe, 
  Flag, Type, HelpCircle, Search, Info, PlusSquare, 
  RefreshCcw, XCircle, Target, FileText, GraduationCap, 
  Briefcase, Tag, Trash2, ArrowRight, Book, Cat, Dog, 
  Droplets, Coffee, CupSoda, Milk, Utensils, Soup,
  Sparkles, X, CheckCircle2, RefreshCw, ExternalLink,
  Home, Heart, Smile, AlertCircle, Play, CornerDownLeft,
  ListOrdered, PauseCircle, Award, BookOpen, Coins, Sun,
  Volume2, Compass, Layers, Shuffle, Plus, Mic, PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Word, HskLevel, PhraseValidationReport, PhraseValidationStep, DidYouMeanResult, DidYouMeanPart, ContextualGrammarTip } from './types';
import { DictionaryModal } from './components/DictionaryModal';
import { PracticeMode } from './components/PracticeMode';
import { QuizMode } from './components/QuizMode';
import { DialogueMode } from './components/DialogueMode';
import { PronunciationMode } from './components/PronunciationMode';
import { ChatMode } from './components/ChatMode';
import { HanziCanvasMode } from './components/HanziCanvasMode';
import { GrammarTipBalloon } from './components/GrammarTipBalloon';
import { generateGrammarOrderTip } from './utils/grammarTips';
import { speakMandarin } from './utils/speech';

// --- Data ---
const WORDS: Word[] = [
  // Pronouns
  { id: 'wo', label: 'wo', hanzi: '我', translation: 'eu', category: 'pronoun', icon: User, hskLevel: 'HSK 1' },
  { id: 'ni', label: 'ni', hanzi: '你', translation: 'você', category: 'pronoun', icon: User, hskLevel: 'HSK 1' },
  { id: 'nin', label: 'nín', hanzi: '您', translation: 'o senhor / a senhora (você formal)', category: 'pronoun', icon: UserCheck, hskLevel: 'HSK 1' },
  { id: 'ta', label: 'ta', hanzi: '他', translation: 'ele/ela', category: 'pronoun', icon: User, hskLevel: 'HSK 1' },
  { id: 'ta_female', label: 'ta', hanzi: '她', translation: 'ela', category: 'pronoun', icon: User, hskLevel: 'HSK 1' },
  { id: 'dajia', label: 'dàjiā', hanzi: '大家', translation: 'todos / todo mundo', category: 'pronoun', icon: Users, hskLevel: 'HSK 1' },
  { id: 'zhe', label: 'zhe', hanzi: '这', translation: 'este/isto', category: 'pronoun', icon: ArrowRight, hskLevel: 'HSK 1' },
  { id: 'na_dem', label: 'nà', hanzi: '那', translation: 'aquele', category: 'pronoun', icon: ArrowRight, hskLevel: 'HSK 1' },
  
  // Plural
  { id: 'men', label: 'men', hanzi: '们', translation: 'plural', category: 'plural', icon: Users, hskLevel: 'HSK 1' },
  
  // Possessive
  { id: 'de', label: 'de', hanzi: '的', translation: 'de (posse)', category: 'possessive', icon: Tag, hskLevel: 'HSK 1' },

  // Adverbs
  { id: 'dou', label: 'dou', hanzi: '都', translation: 'todos', category: 'adverb', icon: PlusSquare, hskLevel: 'HSK 1' },
  { id: 'ye', label: 'yê', hanzi: '也', translation: 'também (antes do verbo)', category: 'adverb', icon: RefreshCcw, hskLevel: 'HSK 2' },
  { id: 'bu', label: 'bù', hanzi: '不', translation: 'não (presente/futuro)', category: 'adverb', icon: XCircle, hskLevel: 'HSK 1' },
  { id: 'mei', label: 'méi', hanzi: '没', translation: 'não (ter/passado)', category: 'adverb', icon: XCircle, hskLevel: 'HSK 1' },
  { id: 'zhi', label: 'zhi', hanzi: '只', translation: 'apenas', category: 'adverb', icon: Target, hskLevel: 'HSK 2' },
  { id: 'hen', label: 'hen', hanzi: '很', translation: 'muito', category: 'adverb', icon: PlusSquare, hskLevel: 'HSK 1' },
  { id: 'henduo', label: 'hěnduō', hanzi: '很多', translation: 'muitos / bastante', category: 'adverb', icon: PlusSquare, hskLevel: 'HSK 1' },
  { id: 'henshao', label: 'hěnshǎo', hanzi: '很少', translation: 'poucos / raro', category: 'adverb', icon: Target, hskLevel: 'HSK 2' },
  { id: 'dagai', label: 'dàgài', hanzi: '大概', translation: 'aproximadamente / provável', category: 'adverb', icon: Sparkles, hskLevel: 'HSK 2' },
  { id: 'yidian', label: 'yìdiǎn', hanzi: '一点', translation: 'um pouco', category: 'adverb', icon: Sparkles, hskLevel: 'HSK 2' },
  
  // Prepositions
  { id: 'gei', label: 'gei', hanzi: '给', translation: 'para', category: 'preposition', icon: Tag, hskLevel: 'HSK 2' },

  // Conjunctions
  { id: 'he_conj', label: 'he', hanzi: '和', translation: 'e', category: 'conjunction', icon: PlusSquare, hskLevel: 'HSK 2' },
  { id: 'yinwei', label: 'yīnwèi', hanzi: '因为', translation: 'porque / pois (resposta)', category: 'conjunction', icon: Sparkles, hskLevel: 'HSK 2' },

  // Verbs & Auxiliary/Modal Verbs
  { id: 'shi', label: 'shi', hanzi: '是', translation: 'ser', category: 'verb', icon: UserCheck, hskLevel: 'HSK 1' },
  { id: 'you_verb', label: 'you', hanzi: '有', translation: 'ter/haver', category: 'verb', icon: PlusSquare, hskLevel: 'HSK 1' },
  { id: 'qu_verb', label: 'qù', hanzi: '去', translation: 'ir', category: 'verb', icon: ArrowRight, hskLevel: 'HSK 1' },
  { id: 'shuo', label: 'shuo', hanzi: '说', translation: 'falar', category: 'verb', icon: MessageSquare, hskLevel: 'HSK 1' },
  { id: 'jiao', label: 'jiao', hanzi: '叫', translation: 'chamar-se', category: 'verb', icon: Tag, hskLevel: 'HSK 1' },
  { id: 'xihuan', label: 'xihuan', hanzi: '喜欢', translation: 'gostar', category: 'verb', icon: Target, hskLevel: 'HSK 1' },
  { id: 'zai', label: 'zai', hanzi: '在', translation: 'estar/em (ou gerúndio)', category: 'verb', icon: Target, hskLevel: 'HSK 1' },
  { id: 'xiang', label: 'xiǎng', hanzi: '想', translation: 'querer / pensar / saudades', category: 'verb', icon: Heart, hskLevel: 'HSK 1' },
  { id: 'kan', label: 'kàn', hanzi: '看', translation: 'ler / ver / olhar', category: 'verb', icon: Book, hskLevel: 'HSK 1' },
  { id: 'xuexi', label: 'xuéxí', hanzi: '学习', translation: 'estudar / aprender', category: 'verb', icon: BookOpen, hskLevel: 'HSK 1' },
  { id: 'keyi', label: 'ke yi', hanzi: '可以', translation: 'poder (permissão)', category: 'verb', icon: UserCheck, hskLevel: 'HSK 2' },
  { id: 'hui', label: 'huì', hanzi: '会', translation: 'poder/saber (habilidade adquirida)', category: 'verb', icon: Award, hskLevel: 'HSK 1' },
  { id: 'da_call', label: 'da', hanzi: '打', translation: 'ligar', category: 'verb', icon: MessageSquare, hskLevel: 'HSK 2' },
  { id: 'fa_verb', label: 'fa', hanzi: '发', translation: 'enviar', category: 'verb', icon: PlusSquare, hskLevel: 'HSK 2' },
  { id: 'zhidao', label: 'zhidao', hanzi: '知道', translation: 'saber/conhecer', category: 'verb', icon: FileText, hskLevel: 'HSK 1' },
  { id: 'zuo', label: 'zuo', hanzi: '坐', translation: 'sentar', category: 'verb', icon: UserCheck, hskLevel: 'HSK 1' },
  { id: 'he', label: 'hé', hanzi: '喝', translation: 'beber', category: 'verb', icon: Coffee, hskLevel: 'HSK 1' },
  { id: 'jin', label: 'jin', hanzi: '进', translation: 'entrar', category: 'verb', icon: ArrowRight, hskLevel: 'HSK 2' },

  // Family & Home
  { id: 'jia', label: 'jia', hanzi: '家', translation: 'casa/família', category: 'family', icon: Home, hskLevel: 'HSK 1' },
  { id: 'baba', label: 'baba', hanzi: '爸爸', translation: 'pai', category: 'family', icon: User, hskLevel: 'HSK 1' },
  { id: 'mama', label: 'mama', hanzi: '妈妈', translation: 'mãe', category: 'family', icon: Heart, hskLevel: 'HSK 1' },
  { id: 'gege', label: 'gege', hanzi: '哥哥', translation: 'irmão mais velho', category: 'family', icon: Users, hskLevel: 'HSK 1' },
  { id: 'jiejie', label: 'jiejie', hanzi: '姐姐', translation: 'irmã mais velha', category: 'family', icon: Heart, hskLevel: 'HSK 1' },
  { id: 'didi', label: 'didi', hanzi: '弟弟', translation: 'irmão mais novo', category: 'family', icon: Smile, hskLevel: 'HSK 1' },
  { id: 'meimei', label: 'meimei', hanzi: '妹妹', translation: 'irmã mais nova', category: 'family', icon: Heart, hskLevel: 'HSK 1' },
  { id: 'yeye', label: 'yeye', hanzi: '爷爷', translation: 'avô', category: 'family', icon: UserCheck, hskLevel: 'HSK 2' },
  { id: 'nainai', label: 'nainai', hanzi: '奶奶', translation: 'avó', category: 'family', icon: Heart, hskLevel: 'HSK 2' },
  { id: 'nver', label: "nǚ'ér", hanzi: '女儿', translation: 'filha', category: 'family', icon: Heart, hskLevel: 'HSK 1' },
  { id: 'erzi', label: 'érzi', hanzi: '儿子', translation: 'filho', category: 'family', icon: Smile, hskLevel: 'HSK 1' },

  // Classifiers / Measure Words & Age Markers
  { id: 'kou', label: 'kou', hanzi: '口', translation: 'boca (membros)', category: 'classifier', icon: MessageSquare, hskLevel: 'HSK 1' },
  { id: 'ge_class', label: 'ge', hanzi: '个', translation: 'unidade (classif.)', category: 'classifier', icon: Tag, hskLevel: 'HSK 1' },
  { id: 'sui', label: 'suì', hanzi: '岁', translation: 'anos de idade', category: 'classifier', icon: Tag, hskLevel: 'HSK 1' },

  // Questions
  { id: 'ma', label: 'ma', hanzi: '吗', translation: '?', category: 'question', icon: HelpCircle, hskLevel: 'HSK 1' },
  { id: 'ji', label: 'ji', hanzi: '几', translation: 'quantos?', category: 'question', icon: HelpCircle, hskLevel: 'HSK 1' },
  { id: 'duoda', label: 'duōdà', hanzi: '多大', translation: 'quantos anos? / qual idade?', category: 'question', icon: HelpCircle, hskLevel: 'HSK 1' },
  { id: 'na', label: 'na', hanzi: '哪', translation: 'qual', category: 'question', icon: Search, hskLevel: 'HSK 1' },
  { id: 'shenme', label: 'shenme', hanzi: '什么', translation: 'o quê / qual', category: 'question', icon: Info, hskLevel: 'HSK 1' },
  { id: 'weishenme', label: 'wèishénme', hanzi: '为什么', translation: 'por quê? / por qual razão', category: 'question', icon: HelpCircle, hskLevel: 'HSK 2' },
  { id: 'duoshao', label: 'duōshao', hanzi: '多少', translation: 'quanto?', category: 'question', icon: HelpCircle, hskLevel: 'HSK 1' },
  { id: 'nali', label: 'nali', hanzi: '哪里', translation: 'onde?', category: 'question', icon: Search, hskLevel: 'HSK 1' },
  { id: 'zenmeyang', label: 'zenmeyang', hanzi: '怎么样', translation: 'como é...? / como está?', category: 'question', icon: HelpCircle, hskLevel: 'HSK 1' },
  { id: 'shei', label: 'shéi', hanzi: '谁', translation: 'quem', category: 'question', icon: HelpCircle, hskLevel: 'HSK 1' },

  // Sentence-Final Particles (Invitations, Suggestions, Impressions)
  { id: 'ba_part', label: 'ba', hanzi: '吧', translation: 'vamos... / né? (sugestão)', category: 'particle', icon: Sparkles, hskLevel: 'HSK 2' },

  // Countries
  { id: 'zhongguo', label: 'Zhōngguó', hanzi: '中国', translation: 'China (chinês)', category: 'country', icon: Globe, hskLevel: 'HSK 1' },
  { id: 'baxi', label: 'baxi', hanzi: '巴西', translation: 'Brasil', category: 'country', icon: Globe, hskLevel: 'HSK 1' },
  { id: 'jianada', label: 'jianada', hanzi: '加拿大', translation: 'Canadá', category: 'country', icon: Globe, hskLevel: 'HSK 2' },
  { id: 'putaoya', label: 'putaoya', hanzi: '葡萄牙', translation: 'Portugal', category: 'country', icon: Globe, hskLevel: 'HSK 2' },
  { id: 'fa', label: 'fa', hanzi: '法', translation: 'França', category: 'country', icon: Globe, requiresGuo: true, hskLevel: 'HSK 2' },
  { id: 'ying', label: 'ying', hanzi: '英', translation: 'Inglaterra', category: 'country', icon: Globe, requiresGuo: true, hskLevel: 'HSK 2' },

  // Gentilics parts
  { id: 'guo', label: 'guo', hanzi: '国', translation: 'país', category: 'guo', icon: Flag, hskLevel: 'HSK 1' },
  { id: 'yu', label: 'yu', hanzi: '语', translation: 'idioma', category: 'suffix', icon: Type, hskLevel: 'HSK 1' },
  { id: 'ren', label: 'ren', hanzi: '人', translation: 'pessoa', category: 'suffix', icon: Users, hskLevel: 'HSK 1' },

  // Nouns
  { id: 'jintian', label: 'jīntiān', hanzi: '今天', translation: 'hoje', category: 'noun', icon: Sun, hskLevel: 'HSK 1' },
  { id: 'yutian', label: 'yǔtiān', hanzi: '雨天', translation: 'dia chuvoso', category: 'noun', icon: Droplets, hskLevel: 'HSK 2' },
  { id: 'qingtian', label: 'qíngtiān', hanzi: '晴天', translation: 'dia ensolarado', category: 'noun', icon: Sun, hskLevel: 'HSK 2' },
  { id: 'gongsi', label: 'gōngsī', hanzi: '公司', translation: 'empresa / companhia', category: 'noun', icon: Briefcase, hskLevel: 'HSK 2' },
  { id: 'nar', label: 'nàr', hanzi: '那儿', translation: 'lá / ali', category: 'noun', icon: Compass, hskLevel: 'HSK 2' },
  { id: 'nali_there', label: 'nàli', hanzi: '那里', translation: 'lá / ali (sul)', category: 'noun', icon: Compass, hskLevel: 'HSK 2' },
  { id: 'hanyu', label: 'Hanyu', hanzi: '汉语', translation: 'mandarim (língua)', category: 'noun', icon: BookOpen, hskLevel: 'HSK 1' },
  { id: 'zaoshang', label: 'zǎoshang', hanzi: '早上', translation: 'manhã (cedo / bom dia)', category: 'noun', icon: Sun, hskLevel: 'HSK 2' },
  { id: 'difang', label: 'dìfang', hanzi: '地方', translation: 'lugar / localidade', category: 'noun', icon: Globe, hskLevel: 'HSK 2' },
  { id: 'chaoshi', label: 'chāoshì', hanzi: '超市', translation: 'supermercado', category: 'noun', icon: Briefcase, hskLevel: 'HSK 2' },
  { id: 'mingzi', label: 'ming zi', hanzi: '名字', translation: 'nome', category: 'noun', icon: FileText, hskLevel: 'HSK 1' },
  { id: 'tongxue', label: 'tongxue', hanzi: '同学', translation: 'colega', category: 'noun', icon: GraduationCap, hskLevel: 'HSK 1' },
  { id: 'laoshi', label: 'laoshi', hanzi: '老师', translation: 'professor', category: 'noun', icon: Briefcase, hskLevel: 'HSK 1' },
  { id: 'gongzuo', label: 'gongzuo', hanzi: '工作', translation: 'trabalho', category: 'noun', icon: Briefcase, hskLevel: 'HSK 1' },
  { id: 'pengyou', label: 'pengyou', hanzi: '朋友', translation: 'amigo(a)', category: 'noun', icon: Users, hskLevel: 'HSK 1' },
  { id: 'nan', label: 'nan', hanzi: '男', translation: 'masculino', category: 'noun', icon: User, hskLevel: 'HSK 1' },
  { id: 'nü', label: 'nü', hanzi: '女', translation: 'feminino', category: 'noun', icon: User, hskLevel: 'HSK 1' },
  { id: 'haoma', label: 'haoma', hanzi: '号码', translation: 'número', category: 'noun', icon: FileText, hskLevel: 'HSK 2' },
  { id: 'dianhua', label: 'dianhua', hanzi: '电话', translation: 'telefone', category: 'noun', icon: Briefcase, hskLevel: 'HSK 2' },
  { id: 'youjian', label: 'youjian', hanzi: '邮件', translation: 'email', category: 'noun', icon: FileText, hskLevel: 'HSK 2' },
  { id: 'xuesheng', label: 'xuesheng', hanzi: '学生', translation: 'estudante', category: 'noun', icon: GraduationCap, hskLevel: 'HSK 1' },
  { id: 'xuexiao', label: 'xuexiao', hanzi: '学校', translation: 'escola', category: 'noun', icon: Book, hskLevel: 'HSK 1' },
  { id: 'daxue', label: 'daxue', hanzi: '大学', translation: 'universidade', category: 'noun', icon: GraduationCap, hskLevel: 'HSK 1' },
  { id: 'Huawei', label: 'Huawei', hanzi: '华为', translation: 'Huawei', category: 'noun', icon: Briefcase, hskLevel: 'HSK 2' },

  // Things (Coisas)
  { id: 'shu', label: 'shu', hanzi: '书', translation: 'livro', category: 'thing', icon: Book, hskLevel: 'HSK 1' },
  { id: 'cai', label: 'cài', hanzi: '菜', translation: 'comida / prato / culinária', category: 'thing', icon: Utensils, hskLevel: 'HSK 1' },
  { id: 'mao', label: 'mao', hanzi: '猫', translation: 'gato', category: 'thing', icon: Cat, hskLevel: 'HSK 1' },
  { id: 'gou', label: 'gou', hanzi: '狗', translation: 'cachorro', category: 'thing', icon: Dog, hskLevel: 'HSK 1' },
  { id: 'shui', label: 'shuî', hanzi: '水', translation: 'água', category: 'thing', icon: Droplets, hskLevel: 'HSK 1' },
  { id: 'cha', label: 'cha', hanzi: '茶', translation: 'chá', category: 'thing', icon: CupSoda, hskLevel: 'HSK 1' },
  { id: 'kafei', label: 'kafei', hanzi: '咖啡', translation: 'café', category: 'thing', icon: Coffee, hskLevel: 'HSK 2' },
  { id: 'mifan', label: 'mifan', hanzi: '米饭', translation: 'arroz', category: 'thing', icon: Utensils, hskLevel: 'HSK 1' },
  { id: 'mianbao', label: 'mianbao', hanzi: '面包', translation: 'pão', category: 'thing', icon: Milk, hskLevel: 'HSK 2' },
  { id: 'tang', label: 'tang', hanzi: '汤', translation: 'sopa', category: 'thing', icon: Soup, hskLevel: 'HSK 2' },
  { id: 'qian', label: 'qián', hanzi: '钱', translation: 'dinheiro (preço)', category: 'thing', icon: Coins, hskLevel: 'HSK 2' },

  // Adjectives
  { id: 'hao', label: 'hǎo', hanzi: '好', translation: 'bom / bem (olá)', category: 'adjective', icon: Smile, hskLevel: 'HSK 1' },
  { id: 'keai', label: "kě'ài", hanzi: '可爱', translation: 'fofo / adorável / gracinha', category: 'adjective', icon: Heart, hskLevel: 'HSK 2' },
  { id: 'duo', label: 'duō', hanzi: '多', translation: 'muito / muitos', category: 'adjective', icon: PlusSquare, hskLevel: 'HSK 1' },
  { id: 'shao', label: 'shǎo', hanzi: '少', translation: 'pouco / poucos', category: 'adjective', icon: Target, hskLevel: 'HSK 1' },
  { id: 'da_adj', label: 'dà', hanzi: '大', translation: 'grande', category: 'adjective', icon: Tag, hskLevel: 'HSK 1' },
  { id: 'xiao', label: 'xiǎo', hanzi: '小', translation: 'pequeno', category: 'adjective', icon: Tag, hskLevel: 'HSK 1' },
  { id: 'gaoxing', label: 'gaoxing', hanzi: '高兴', translation: 'feliz', category: 'adjective', icon: UserCheck, hskLevel: 'HSK 1' },
  { id: 'mang', label: 'mang', hanzi: '忙', translation: 'ocupado', category: 'adjective', icon: Briefcase, hskLevel: 'HSK 1' },
  { id: 'lei', label: 'lei', hanzi: '累', translation: 'cansado', category: 'adjective', icon: Briefcase, hskLevel: 'HSK 2' },
  { id: 'congming', label: 'congming', hanzi: '聪明', translation: 'inteligente', category: 'adjective', icon: GraduationCap, hskLevel: 'HSK 2' },
  { id: 'piaoliang', label: 'piaoliang', hanzi: '漂亮', translation: 'bonito(a)', category: 'adjective', icon: Tag, hskLevel: 'HSK 2' },
  { id: 'shuai', label: 'shuai', hanzi: '帅', translation: 'bonito (homem)', category: 'adjective', icon: User, hskLevel: 'HSK 2' },

  // Numbers (0 to 9 + liang + tens + hundreds)
  { id: 'ling', label: 'ling', hanzi: '零', translation: '0', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'yi', label: 'yi', hanzi: '一', translation: '1', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'yao', label: 'yao', hanzi: '幺', translation: '1 (tel)', category: 'number', icon: Type, hskLevel: 'HSK 2' },
  { id: 'er', label: 'er', hanzi: '二', translation: '2 (dígito)', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'liang', label: 'liang', hanzi: '两', translation: '2 (quantidade)', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'san', label: 'san', hanzi: '三', translation: '3', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'si', label: 'si', hanzi: '四', translation: '4', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'wu', label: 'wu', hanzi: '五', translation: '5', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'liu', label: 'liu', hanzi: '六', translation: '6', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'qi', label: 'qi', hanzi: '七', translation: '7', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'ba', label: 'ba', hanzi: '八', translation: '8', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'jiu', label: 'jiu', hanzi: '九', translation: '9', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'shi_num', label: 'shí', hanzi: '十', translation: '10 / dezena', category: 'number', icon: Type, hskLevel: 'HSK 1' },
  { id: 'bai', label: 'bǎi', hanzi: '百', translation: '100 / centena', category: 'number', icon: Type, hskLevel: 'HSK 1' },

  // Etiquette
  { id: 'qing', label: 'qing', hanzi: '请', translation: 'por favor', category: 'etiquette', icon: UserCheck, hskLevel: 'HSK 1' },
  { id: 'xie_xie', label: 'xie xie', hanzi: '谢谢', translation: 'obrigado', category: 'etiquette', icon: UserCheck, hskLevel: 'HSK 1' },
  { id: 'zaijian', label: 'zài jiàn', hanzi: '再见', translation: 'tchau / até logo', category: 'etiquette', icon: Smile, hskLevel: 'HSK 1' },
];

// Map of multi-word / compound pinyins to dictionary ID
const COMPOUND_PINYIN_MAP: Record<string, string> = {
  'mei': 'mei',
  'hui': 'hui',
  'zao shang': 'zaoshang',
  'zaoshang': 'zaoshang',
  'da jia': 'dajia',
  'dajia': 'dajia',
  'zai jian': 'zaijian',
  'zaijian': 'zaijian',
  'nv er': 'nver',
  'nver': 'nver',
  "nv'er": 'nver',
  'nu er': 'nver',
  'nuer': 'nver',
  "nu'er": 'nver',
  'er zi': 'erzi',
  'erzi': 'erzi',
  'duo da': 'duoda',
  'duoda': 'duoda',
  'di fang': 'difang',
  'difang': 'difang',
  'chao shi': 'chaoshi',
  'chaoshi': 'chaoshi',
  'ke ai': 'keai',
  'keai': 'keai',
  "ke'ai": 'keai',
  'yi dian': 'yidian',
  'yidian': 'yidian',
  'yi dianr': 'yidian',
  'yidianr': 'yidian',
  'yi dian dian': 'yidian',
  'yidiandian': 'yidian',
  'han yu': 'hanyu',
  'hanyu': 'hanyu',
  'xie xie': 'xie_xie',
  'xiexie': 'xie_xie',
  'ke yi': 'keyi',
  'keyi': 'keyi',
  'duo shao': 'duoshao',
  'duoshao': 'duoshao',
  'ming zi': 'mingzi',
  'mingzi': 'mingzi',
  'tong xue': 'tongxue',
  'tongxue': 'tongxue',
  'lao shi': 'laoshi',
  'laoshi': 'laoshi',
  'peng you': 'pengyou',
  'pengyou': 'pengyou',
  'xue sheng': 'xuesheng',
  'xuesheng': 'xuesheng',
  'xue xiao': 'xuexiao',
  'xuexiao': 'xuexiao',
  'da xue': 'daxue',
  'daxue': 'daxue',
  'dian hua': 'dianhua',
  'dianhua': 'dianhua',
  'hao ma': 'haoma',
  'haoma': 'haoma',
  'you jian': 'youjian',
  'youjian': 'youjian',
  'gong zuo': 'gongzuo',
  'gongzuo': 'gongzuo',
  'jia na da': 'jianada',
  'jianada': 'jianada',
  'pu tao ya': 'putaoya',
  'putaoya': 'putaoya',
  'ba xi': 'baxi',
  'baxi': 'baxi',
  'gao xing': 'gaoxing',
  'gaoxing': 'gaoxing',
  'cong ming': 'congming',
  'congming': 'congming',
  'piao liang': 'piaoliang',
  'piaoliang': 'piaoliang',
  'mi fan': 'mifan',
  'mifan': 'mifan',
  'mian bao': 'mianbao',
  'mianbao': 'mianbao',
  'zhi dao': 'zhidao',
  'zhidao': 'zhidao',
  'zen me yang': 'zenmeyang',
  'zenme yang': 'zenmeyang',
  'zenmeyang': 'zenmeyang',
  'na li': 'nali',
  'nali': 'nali',
  'shen me': 'shenme',
  'shenme': 'shenme',
  'ba ba': 'baba',
  'baba': 'baba',
  'ma ma': 'mama',
  'mama': 'mama',
  'ge ge': 'gege',
  'gege': 'gege',
  'jie jie': 'jiejie',
  'jiejie': 'jiejie',
  'di di': 'didi',
  'didi': 'didi',
  'mei mei': 'meimei',
  'meimei': 'meimei',
  'ye ye': 'yeye',
  'yeye': 'yeye',
  'nai nai': 'nainai',
  'nainai': 'nainai',
  'jin tian': 'jintian',
  'jintian': 'jintian',
  'yu tian': 'yutian',
  'yutian': 'yutian',
  'qing tian': 'qingtian',
  'qingtian': 'qingtian',
  'zhong guo': 'zhongguo',
  'zhongguo': 'zhongguo',
  'gong si': 'gongsi',
  'gongsi': 'gongsi',
  'na r': 'nar',
  'nar': 'nar',
  'hen duo': 'henduo',
  'henduo': 'henduo',
  'hen shao': 'henshao',
  'henshao': 'henshao',
  'da gai': 'dagai',
  'dagai': 'dagai',
  'xue xi': 'xuexi',
  'xuexi': 'xuexi',
  'wei shen me': 'weishenme',
  'weishenme': 'weishenme',
  'wei she me': 'weishenme',
  'weisheme': 'weishenme',
  'yin wei': 'yinwei',
  'yinwei': 'yinwei',
};

// Helper for natural/fluent idiomatic translation of Mandarin phrases to Portuguese
function getNaturalTranslation(seq: Word[]): string {
  if (seq.length === 0) return '';
  
  const key = seq.map(w => {
    if (w.id === 'zaoshang') return 'zao shang';
    if (w.id === 'dajia') return 'da jia';
    if (w.id === 'zaijian') return 'zai jian';
    if (w.id === 'laoshi') return 'lao shi';
    if (w.id === 'tongxue') return 'tong xue';
    if (w.id === 'pengyou') return 'peng you';
    if (w.id === 'duoshao') return 'duo shao';
    if (w.id === 'zenmeyang') return 'zen me yang';
    if (w.id === 'kafei') return 'ka fei';
    if (w.id === 'xie_xie') return 'xie xie';
    if (w.id === 'nver') return 'nver';
    if (w.id === 'erzi') return 'erzi';
    if (w.id === 'duoda') return 'duoda';
    if (w.id === 'difang') return 'difang';
    if (w.id === 'chaoshi') return 'chaoshi';
    if (w.id === 'keai') return 'keai';
    if (w.id === 'ba_part') return 'ba';
    if (w.id === 'qu_verb') return 'qu';
    if (w.id === 'you_verb') return 'you';
    if (w.id === 'ta_female') return 'ta';
    if (w.id === 'shi_num') return 'shi';
    if (w.id === 'ge_class') return 'ge';
    if (w.id === 'na_dem') return 'na';
    if (w.id === 'nali_there') return 'nali';
    return w.id;
  }).join(' ');

  const IDIOMS: Record<string, string> = {
    'ni hao': 'Olá! / Oi!',
    'nin hao': 'Olá! (formal / com respeito)',
    'ni men hao': 'Olá a todos! / Olá a vocês!',
    'da jia hao': 'Olá a todos!',
    'zao shang hao': 'Bom dia!',
    'lao shi hao': 'Olá, professor(a)!',
    'tong xue hao': 'Olá, colegas/alunos!',
    'peng you hao': 'Olá, amigo(a)!',
    'ni hao ma': 'Como vai você? / Tudo bem?',
    'nin hao ma': 'Como vai o senhor/a senhora?',
    'ni men hao ma': 'Como vocês estão? / Tudo bem com vocês?',
    'wo hen hao': 'Eu estou muito bem.',
    'wo ye hen hao': 'Eu também estou muito bem.',
    'wo ye xihuan kafei': 'Eu também gosto de café.',
    'wo ye xihuan cha': 'Eu também gosto de chá.',
    'wo ye shi laoshi': 'Eu também sou professor(a).',
    'wo ye shi xuesheng': 'Eu também sou estudante/aluno(a).',
    'wo ye shi baxi ren': 'Eu também sou brasileiro(a).',
    'wo ye bu zhidao': 'Eu também não sei.',
    'bu hao': 'Não estou bem / Ruim.',
    'hao de': 'Certo / Está bem / Ok.',
    'hao bu hao': 'Que tal? / Está de acordo?',
    'xie xie': 'Obrigado(a)!',
    'xie xie ni': 'Obrigado a você!',
    'xie xie nin': 'Muito obrigado ao senhor/à senhora!',
    'xie xie da jia': 'Obrigado a todos!',
    'zai jian': 'Tchau! / Até logo!',
    'lao shi zai jian': 'Tchau, professor(a)! / Até logo!',
    'tong xue zai jian': 'Tchau, colegas! / Até logo!',
    'da jia zai jian': 'Tchau a todos! / Até logo!',
    'zai jian lao shi': 'Tchau, professor(a)!',
    'zai jian da jia': 'Tchau a todos!',
    'qing zuo': 'Por favor, sente-se.',
    'qing he cha': 'Por favor, tome um chá.',
    'qing he ka fei': 'Por favor, tome um café.',
    'qing he shui': 'Por favor, beba água.',
    'qing jin': 'Por favor, entre.',
    'qing shuo': 'Por favor, pode falar.',
    'duo shao qian': 'Quanto custa? / Qual o preço?',
    'zhe ge duo shao qian': 'Quanto custa este aqui?',
    'na ge duo shao qian': 'Quanto custa aquele lá?',
    'na_dem ge duo shao qian': 'Quanto custa aquele lá?',
    'ba xi zen me yang': 'Como é o Brasil?',
    'zhong guo zen me yang': 'Como é a China?',
    'ka fei zen me yang': 'Como está o café?',
    'cha zen me yang': 'Como está o chá?',
    'gong zuo zen me yang': 'Como está o trabalho?',
    'zhe ge zen me yang': 'Que tal este?',

    // Version 1.8.30 Idiomatic Translations:
    // Idade
    'wo nver liang sui': 'Minha filha tem 2 anos de idade.',
    'wo de nver liang sui': 'Minha filha tem 2 anos de idade.',
    'wo erzi liang sui': 'Meu filho tem 2 anos de idade.',
    'wo de erzi liang sui': 'Meu filho tem 2 anos de idade.',
    'wo nver san sui': 'Minha filha tem 3 anos de idade.',
    'wo erzi san sui': 'Meu filho tem 3 anos de idade.',
    'wo liang sui': 'Eu tenho 2 anos de idade.',
    'ta liang sui': 'Ele/Ela tem 2 anos de idade.',
    'ni shi duoda': 'Quantos anos você tem? / Qual a sua idade?',
    'ni duoda': 'Quantos anos você tem?',
    'nin duoda': 'Qual a idade do senhor/da senhora?',
    'ta duoda': 'Quantos anos ele/ela tem?',
    'ni nver duoda': 'Quantos anos tem sua filha?',
    'ni erzi duoda': 'Quantos anos tem seu filho?',
    'ni ji sui': 'Quantos anos você tem?',
    'ta ji sui': 'Quantos anos ele/ela tem?',
    'ni nver ji sui': 'Quantos anos tem sua filha?',
    'ni erzi ji sui': 'Quantos anos tem seu filho?',

    // Origem / Localidade
    'ni shi shenme difang ren': 'De que lugar você é? / De qual cidade ou região você é?',
    'nin shi shenme difang ren': 'De qual lugar o senhor/a senhora é?',
    'ta shi shenme difang ren': 'De que lugar ele/ela é?',
    'ni men shi shenme difang ren': 'De que lugar vocês são?',
    'shei shi shenme difang ren': 'Quem é de qual lugar?',
    'wo shi baxi ren': 'Eu sou brasileiro(a).',

    // Convidar e Partícula 'ba'
    'wo men qu chaoshi ba': 'Vamos ao supermercado!',
    'women qu chaoshi ba': 'Vamos ao supermercado!',
    'qu chaoshi ba': 'Vamos ao supermercado!',
    'wo men qu ba': 'Vamos!',
    'women qu ba': 'Vamos!',
    'qu ba': 'Vamos! / Pode ir!',
    'qing jin ba': 'Por favor, entre!',
    'qing zuo ba': 'Por favor, sente-se!',
    'qing he cha ba': 'Por favor, tome um chá!',
    'qing he ka fei ba': 'Por favor, tome um café!',
    'he ka fei ba': 'Vamos tomar um café!',
    'he cha ba': 'Vamos tomar um chá!',

    // Impressão compartilhada ('ba' = 'não é mesmo? / né?')
    'wo de mao hen keai ba': 'Meu gato não é uma gracinha? (Muito fofo, né?)',
    'wo de gou hen keai ba': 'Meu cachorro não é uma gracinha? (Muito fofo, né?)',
    'wo de nver hen keai ba': 'Minha filha é uma gracinha, não é mesmo?',
    'wo de erzi hen keai ba': 'Meu filho é uma gracinha, não é mesmo?',
    'ta hen keai ba': 'Ele(a) é uma gracinha, não é mesmo?',
    'ta hen piaoliang ba': 'Ela é muito bonita, não é mesmo?',
    'ta hen shuai ba': 'Ele é muito bonito, não é mesmo?',
    'zhe ge hen hao ba': 'Este aqui é muito bom, né?',

    // Version 1.2026.9.15 Idiomatic Translations:
    'wo wu shi jiu sui': 'Eu tenho 59 anos.',
    'wo shi wu shi jiu sui': 'Eu tenho 59 anos.',
    'wo ji wu shi jiu sui': 'Eu tenho 59 anos.',
    'wu shi jiu sui': '59 anos de idade.',
    'ni you ji ge zhongguo peng you': 'Quantos amigos chineses você tem?',
    'ni you ji ge zhongguo pengyou': 'Quantos amigos chineses você tem?',
    'jintian zen me yang': 'Como está hoje? / Como está o tempo hoje?',
    'jintian zenmeyang': 'Como está hoje? / Como está o tempo hoje?',
    'jintian shi yu tian': 'Hoje está chuvoso. / Hoje é um dia de chuva.',
    'jintian shi yutian': 'Hoje está chuvoso. / Hoje é um dia de chuva.',
    'jintian shi ge qing tian': 'Hoje está ensolarado. / Hoje é um dia de sol.',
    'jintian shi ge qingtian': 'Hoje está ensolarado. / Hoje é um dia de sol.',
    'jintian shi qing tian': 'Hoje está ensolarado.',
    'jintian shi qingtian': 'Hoje está ensolarado.',
    'ta you henduo peng you nar': 'Ela tem muitos amigos lá.',
    'ta you henduo pengyou nar': 'Ela tem muitos amigos lá.',
    'ta you henduo peng you nali': 'Ela tem muitos amigos lá.',
    'ta you henduo pengyou nali': 'Ela tem muitos amigos lá.',
    'ta you hen duo peng you nar': 'Ela tem muitos amigos lá.',
    'ta you hen duo pengyou nar': 'Ela tem muitos amigos lá.',
    'ta you hen duo peng you nali': 'Ela tem muitos amigos lá.',
    'ta you hen duo pengyou nali': 'Ela tem muitos amigos lá.',
    'wo de zhongguo peng you bu duo': 'Eu não tenho muitos amigos chineses. (Meus amigos chineses não são muitos)',
    'wo de zhongguo pengyou bu duo': 'Eu não tenho muitos amigos chineses. (Meus amigos chineses não são muitos)',
    'xuexiao dagai you yi bai xuesheng': 'A escola tem aproximadamente cem alunos.',
    'xuexiao dagai you yi bai ge xuesheng': 'A escola tem aproximadamente cem alunos.',
    'wo xiang ni': 'Eu acredito em você / Penso em você / Sinto sua falta.',
    'ta xiang qu zhongguo': 'Ela quer ir para a China.',
    'wo xiang wo mama de cai': 'Sinto falta da comida da minha mãe.',
    'wo xiang mama de cai': 'Sinto falta da comida da minha mãe.',
    'wo xiang ni shi baxi ren': 'Acho que você é brasileiro(a).',
    'ni zai xiang shenme': 'O que você está pensando?',
    'wo xiang qu xuexiao kan shu': 'Eu quero ir à escola para ler (livros).',
    'ni weishenme xiang xuexi hanyu': 'Por que você quer estudar chinês/mandarim?',
    'yinwei wo zai zhongguo gongsi': 'Porque estou (trabalhando) numa empresa chinesa.',
    'wo he cha': 'Eu tomo chá.',
    'wo xiang he cha': 'Eu quero tomar chá.',
    'wo bu he cha': 'Eu não tomo chá.',
    'wo ye he cha': 'Eu também tomo chá.',
    'wo he kafei': 'Eu tomo café.',
    'wo xiang he kafei': 'Eu quero tomar café.',
    'wo bu he kafei': 'Eu não tomo café.',
    'wo ye he kafei': 'Eu também tomo café.',
    'wo he shui': 'Eu bebo água.',
    'wo xiang he shui': 'Eu quero beber água.',
  };

  if (IDIOMS[key]) {
    return IDIOMS[key];
  }

  return seq.map(w => w.translation).join(' ');
}

// Helper to check if a sequence of words forms a valid/complete sentence
function checkIsValid(seq: Word[]): boolean {
  if (seq.length === 0) return false;
  const last = seq[seq.length - 1];

  // If ending in sentence particle 'ba_part' (吧)
  if (last.id === 'ba_part') {
    if (seq.length <= 1) return false;
    const subSeq = seq.slice(0, -1);
    if (checkIsValid(subSeq)) return true;
    const hasActionOrPlace = subSeq.some(w => w.category === 'verb' || w.category === 'adjective' || w.id === 'chaoshi' || w.id === 'difang');
    if (hasActionOrPlace) return true;
    return false;
  }

  // If ending in age marker 'sui' (岁)
  if (last.id === 'sui') {
    return seq.some(w => w.category === 'number' || w.id === 'ji' || w.id === 'liang');
  }

  // If ending in 'duoda' (多大)
  if (last.id === 'duoda') {
    return seq.some(w => w.category === 'pronoun' || w.category === 'family');
  }

  // If it ends with a question particle or question pronoun (except 'na' and 'ji')
  if (last.category === 'question' && last.id !== 'na' && last.id !== 'ji') return true;

  // Check if the sentence has an interrogative particle or word
  const hasQuestion = seq.some(w => ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji', 'ma', 'duoda'].includes(w.id));
  const verbExists = seq.some(w => w.category === 'verb');

  // If last is 'ren' (e.g. 'ni shi shenme difang ren', 'wo jia you si kou ren', 'wo shi baxi ren')
  if (last.id === 'ren') {
    return seq.some(w => w.id === 'difang' || w.category === 'country' || w.id === 'kou' || verbExists);
  }

  // If last is 'chaoshi' or 'difang'
  if (last.id === 'chaoshi') {
    return seq.some(w => w.id === 'qu_verb' || w.category === 'verb');
  }

  // If last is noun, country, suffix, adjective, number, thing, family
  if (['noun', 'country', 'suffix', 'adjective', 'number', 'thing', 'family'].includes(last.category)) {
    // Exception: standalone country names baxi, jianada, putaoya need a suffix or noun
    if (['baxi', 'jianada', 'putaoya'].includes(last.id)) return false;
    if (last.id === 'nan' || last.id === 'nü') return false;
    if (last.id === 'dianhua') return seq.some(w => w.id === 'da_call');

    // If last is family member or thing or noun, valid if there is a verb or adjective or question or negative mei
    if (['family', 'thing', 'noun'].includes(last.category)) {
      if (verbExists || seq.some(w => w.category === 'adjective' || w.id === 'mei') || hasQuestion) {
        return true;
      }
      return false;
    }

    if (last.category === 'adjective') return true;
    if (last.category === 'number') return true;
    return true;
  }

  // If ending in yidian (e.g. wo hui shuo yidian, wo zhidao yidian)
  if (last.id === 'yidian') {
    return verbExists;
  }

  // If it's a verb, but NOT transitive verbs requiring objects (unless negated or preceded by auxiliary verbs keyi/hui/qing in short dialogue)
  if (last.category === 'verb') {
    const isNegated = seq.some(w => w.id === 'bu' || w.id === 'mei');
    const isModalOrPolite = seq.some(w => ['keyi', 'hui', 'qing'].includes(w.id));
    if (last.id === 'zhidao') return true; // 'wo zhidao' or 'wo bu zhidao' is a complete valid clause
    if ((isNegated || isModalOrPolite) && ['shuo', 'he', 'xihuan', 'qu_verb'].includes(last.id)) return true; // 'ni keyi shuo', 'wo hui shuo', 'qing shuo', 'qu ba'
    if (['shi', 'jiao', 'zai', 'keyi', 'hui', 'da_call', 'fa_verb', 'you_verb', 'qu_verb'].includes(last.id)) {
      return false;
    }
    return true;
    // 'zuo' (sentar), 'jin' (entrar) are valid intransitive endings!
  }

  // If ending in etiquette like xie xie, zai jian, or affirmation like hao de
  if (last.category === 'etiquette' && (last.id === 'xie_xie' || last.id === 'zaijian')) return true;
  if (last.id === 'de' && seq.length === 2 && seq[0].id === 'hao') return true;

  // If ending in pronoun (as object of verb or polite expression, e.g. wo xiang ni, wo xihuan ni, xie xie ni, xie xie nin, xie xie dajia)
  if (last.category === 'pronoun') {
    if (seq.length > 1 && (verbExists || seq.some(w => w.id === 'xie_xie'))) return true;
  }

  return false;
}

// Pure function returning all allowed words for a given sequence
function getAvailableWordsForSequence(sequence: Word[]): Word[] {
  const getBaseWords = (): Word[] => {
    if (sequence.length === 0) {
      // Can start with pronoun, etiquette, shei, duoshao, family members, things, nouns, countries, conjunctions, numbers, or hao
      return WORDS.filter(w => 
        w.category === 'pronoun' || 
        w.category === 'etiquette' || 
        w.category === 'family' ||
        w.category === 'country' ||
        w.category === 'conjunction' ||
        w.category === 'number' ||
        w.id === 'shei' ||
        w.id === 'duoshao' ||
        w.id === 'weishenme' ||
        w.id === 'dagai' ||
        w.id === 'hao' ||
        w.category === 'thing' ||
        w.category === 'noun' ||
        w.id === 'qu_verb'
      );
    }

    const last = sequence[sequence.length - 1];
    const prev = sequence.length > 1 ? sequence[sequence.length - 2] : null;
    
    // Find active verb in the sequence
    const activeVerb = [...sequence].reverse().find(w => w.category === 'verb');
    const verbExists = sequence.some(w => w.category === 'verb');
    const hasQuestion = sequence.some(w => ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji', 'duoda', 'weishenme'].includes(w.id));

    // Case: Particle ba_part is sentence-final
    if (last.id === 'ba_part') {
      return [];
    }

    // Case: Age marker sui (岁)
    if (last.id === 'sui') {
      return WORDS.filter(w => w.id === 'ma' || w.id === 'ba_part');
    }

    // Case: duoda (多大)
    if (last.id === 'duoda') {
      return WORDS.filter(w => w.id === 'ma');
    }

    // Case: shei selected as subject
    if (last.id === 'shei' && !verbExists) {
      return WORDS.filter(w => w.category === 'verb' || w.category === 'adverb');
    }

    // Case: Etiquette selected
    if (last.category === 'etiquette') {
      if (last.id === 'qing') {
        return WORDS.filter(w => ['zuo', 'he', 'jin', 'shuo', 'keyi', 'qu_verb', 'kan'].includes(w.id));
      }
      if (last.id === 'xie_xie') {
        return WORDS.filter(w => w.category === 'pronoun' || w.category === 'family' || w.id === 'dajia');
      }
      if (last.id === 'zaijian') {
        return WORDS.filter(w => ['laoshi', 'tongxue', 'pengyou', 'dajia'].includes(w.id));
      }
      return [];
    }

    // Case: Preposition selected (ex: gei)
    if (last.category === 'preposition') {
      if (last.id === 'gei') {
        // Must be followed by recipient (pronoun, noun, family)
        return WORDS.filter(w => w.category === 'pronoun' || w.category === 'noun' || w.category === 'family');
      }
      return [];
    }

    // Case: Conjunction selected (ex: he_conj, yinwei)
    if (last.category === 'conjunction') {
      if (last.id === 'yinwei') {
        // yinwei (因为 - porque): seguido de sujeito (pronoun, noun, family) ou zai
        return WORDS.filter(w => ['pronoun', 'noun', 'family'].includes(w.category) || w.id === 'zai');
      }
      if (last.id === 'he_conj') {
        // Must be followed by pronoun, noun, family, thing, country
        return WORDS.filter(w => {
          if (['pronoun', 'noun', 'family', 'thing', 'country'].includes(w.category)) {
            return !['zhe', 'na_dem', 'nan', 'nü', 'dianhua', 'haoma', 'gongzuo'].includes(w.id);
          }
          return false;
        });
      }
      return [];
    }

    // Case: Pronoun selected (wo, ni, ta, ta_female, zhe, na_dem, dajia, nin)
    if (last.category === 'pronoun') {
      // If we just had a preposition like 'gei' + pronoun (ex: wo gei ni), we must follow with a verb
      if (prev?.category === 'preposition' && prev.id === 'gei') {
        return WORDS.filter(w => ['da_call', 'fa_verb', 'shuo'].includes(w.id));
      }

      // If a verb exists in the sequence (Pronoun as Object, or Embedded Clause Subject after xiang)
      if (verbExists) {
        // If preceded by xiang (ex: wo xiang ni... -> wo xiang ni shi baxi ren / wo xiang ni)
        if (prev?.id === 'xiang') {
          return WORDS.filter(w => {
            if (w.id === 'shi') return true;
            if (w.category === 'family' || w.category === 'possessive') return true;
            if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
            if (w.id === 'ba_part') return true;
            return false;
          });
        }

        if (activeVerb?.id === 'xihuan') {
          return WORDS.filter(w => {
            if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
            if (w.id === 'ba_part') return true;
            return false;
          });
        }
        
        return WORDS.filter(w => {
          if (['plural', 'possessive'].includes(w.category)) return true;
          if (w.category === 'family') return true;
          if (w.id === 'nar' || w.id === 'nali_there') return true;
          if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
          if (w.id === 'ba_part') return true;
          return false;
        });
      } else {
        // Pronoun as Subject:
        // Rule 1: Dispensa o possessivo "de" para elementos da família e casa (wo jia, wo baba, wo nver, etc.)
        return WORDS.filter(w => {
          // Can take family members directly or jia
          if (w.category === 'family') return true;
          // Can take plural (except for 'zhe' and 'na_dem')
          if (w.category === 'plural' && last.id !== 'zhe' && last.id !== 'na_dem') return true;
          if (['possessive', 'adverb', 'verb', 'adjective'].includes(w.category)) return true;
          if (['zenmeyang', 'duoda', 'ji', 'weishenme'].includes(w.id)) return true;
          if (w.id === 'zai') return true; // Gerund or location
          if (w.id === 'xiang') return true; // Want/think
          if (w.category === 'number') return true; // ex: wo liang sui
          if (w.category === 'preposition') return true; // ex: wo gei ...
          if (['zhe', 'na_dem'].includes(last.id)) {
            if (w.category === 'classifier' || w.category === 'thing' || w.category === 'noun' || w.id === 'duoshao') return true;
          }
          return false;
        });
      }
    }

    // Case: Family & Home selected (jia, baba, mama, gege, jiejie, didi, meimei, yeye, nainai, nver, erzi)
    if (last.category === 'family') {
      // If recipient after preposition 'gei' (ex: wo gei mama...)
      if (prev?.category === 'preposition' && prev.id === 'gei') {
        return WORDS.filter(w => ['da_call', 'fa_verb', 'shuo'].includes(w.id));
      }

      // If last is 'jia' (casa / família)
      if (last.id === 'jia') {
        return WORDS.filter(w => {
          if (w.category === 'verb') return true; // ex: you_verb, shi, zai
          if (w.category === 'adverb') return true; // ex: hen, dou, ye, bu
          if (w.category === 'possessive') return true; // ex: jia de...
          if (['zenmeyang', 'duoshao'].includes(w.id)) return true;
          return false;
        });
      }

      // Family member as object (after verb)
      if (verbExists) {
        return WORDS.filter(w => {
          if (w.category === 'plural' || w.category === 'possessive') return true;
          if (w.id === 'cai') return true; // e.g. wo xiang wo mama de cai -> de -> cai
          if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
          if (w.id === 'ba_part') return true;
          return false;
        });
      }

      // Family member as subject (before verb)
      return WORDS.filter(w => {
        if (w.category === 'plural' || w.category === 'possessive') return true;
        if (['adverb', 'verb', 'adjective', 'preposition'].includes(w.category)) return true;
        if (['zenmeyang', 'duoda', 'ji'].includes(w.id)) return true;
        if (w.category === 'number') return true; // ex: wo nver liang sui
        return false;
      });
    }

    // Case: Plural selected (men)
    if (last.category === 'plural') {
      if (verbExists) {
        return WORDS.filter(w => {
          if (w.category === 'possessive') return true;
          if (w.id === 'ma' && !hasQuestion && !sequence.some(s => s.id === 'ma')) return true;
          if (w.id === 'ba_part') return true;
          return false;
        });
      } else {
        return WORDS.filter(w => ['possessive', 'adverb', 'verb', 'adjective', 'preposition'].includes(w.category) || ['qu_verb'].includes(w.id));
      }
    }

    // Case: Possessive selected (de)
    if (last.category === 'possessive') {
      // Must be followed by noun, country, thing, family, or adjective (compound)
      return WORDS.filter(w => ['noun', 'country', 'thing', 'family', 'adjective'].includes(w.category));
    }

    // Case: Adverb selected (hen, bu, mei, dou, ye, zhi, yidian, henduo, henshao, dagai)
    if (last.category === 'adverb') {
      if (last.id === 'henduo' || last.id === 'henshao') {
        return WORDS.filter(w => {
          if (['noun', 'thing', 'family'].includes(w.category)) {
            return !['nan', 'nü', 'haoma', 'dianhua'].includes(w.id);
          }
          return false;
        });
      }
      if (last.id === 'dagai') {
        return WORDS.filter(w => w.category === 'verb' || w.category === 'number');
      }
      if (last.id === 'yidian') {
        // 'yidian' (一点 - um pouco): followed by nouns (hanyu, etc.), things (shui, cha, etc.), adjectives (mang, lei, etc.) or question particle ma
        return WORDS.filter(w => {
          if (w.id === 'hanyu') return true;
          if (['thing', 'noun', 'adjective'].includes(w.category)) {
            return !['nan', 'nü', 'haoma', 'dianhua'].includes(w.id);
          }
          if (w.id === 'ma' || w.id === 'ba_part') return true;
          return false;
        });
      }
      if (last.id === 'hen') {
        return WORDS.filter(w => w.category === 'adjective');
      }
      if (last.id === 'bu') {
        // In Mandarin, 'bu' cannot negate 'you' (ter/haver) -> must use 'mei' (没)
        return WORDS.filter(w => (w.category === 'verb' && w.id !== 'you_verb') || w.category === 'adjective');
      }
      if (last.id === 'mei') {
        // 'mei' (没) negates 'you' (ter/haver) and past actions, or directly precedes nouns/things in colloquial speech (e.g. wo mei gongzuo)
        return WORDS.filter(w => (w.category === 'verb' && w.id !== 'shi') || ['noun', 'thing', 'family'].includes(w.category));
      }
      return WORDS.filter(w => w.category === 'verb' || ['hen', 'bu', 'mei'].includes(w.id));
    }

    // Case: Verb selected
    if (last.category === 'verb') {
      if (last.id === 'qu_verb') {
        // 'qu' (去 - ir): followed by destinations (chaoshi, xuexiao, daxue, jia, difang, countries, nali, shenme, zhe, na_dem, nar, nali_there) or particle ba
        return WORDS.filter(w => {
          if (['chaoshi', 'xuexiao', 'daxue', 'jia', 'difang', 'nali', 'shenme', 'zhe', 'na_dem', 'ba_part', 'nar', 'nali_there'].includes(w.id)) return true;
          if (w.category === 'country') return true;
          if (w.id === 'ma') return true;
          return false;
        });
      }

      if (last.id === 'you_verb') {
        // you can take numbers, question particles (ji, shenme, duoshao), classifiers, family members, things, nouns, adverbs (henduo, henshao, dagai), or yidian
        return WORDS.filter(w => {
          if (w.id === 'yidian' || w.id === 'henduo' || w.id === 'henshao' || w.id === 'dagai') return true;
          if (['number', 'classifier', 'family', 'thing', 'noun'].includes(w.category)) return true;
          if (w.category === 'country') return true; // e.g. you zhongguo pengyou
          if (['ji', 'shenme', 'duoshao', 'shei'].includes(w.id)) return true;
          if (w.category === 'pronoun' && !['zhe', 'na_dem'].includes(w.id)) return true;
          return false;
        });
      }

      if (last.id === 'xiang') {
        // 'xiang' (想 - querer, pensar, acreditar, ter saudades):
        // 1. Querer fazer algo -> seguido de verbo (qu_verb, kan, xuexi, shuo, zuo, he, jin, da_call, fa_verb)
        // 2. Sentir saudades / pensar em alguém -> seguido de pronome (ni, wo, ta, ta_female) ou família (mama, etc.)
        // 3. Sentir falta de algo -> seguido de comida/coisas (cai, shu, etc.) ou possessivo (wo mama de cai)
        // 4. Achar/pensar -> seguido de pronome (ni) para oração subordinada (ni shi baxi ren)
        // 5. Pergunta -> zai xiang shenme
        return WORDS.filter(w => {
          if (['qu_verb', 'kan', 'xuexi', 'shuo', 'zuo', 'he', 'jin', 'da_call', 'fa_verb'].includes(w.id)) return true;
          if (['pronoun', 'family', 'thing', 'noun'].includes(w.category)) return true;
          if (w.id === 'shenme') return true;
          return false;
        });
      }

      if (last.id === 'kan') {
        return WORDS.filter(w => ['shu', 'ma', 'ba_part'].includes(w.id));
      }

      if (last.id === 'xuexi') {
        return WORDS.filter(w => ['hanyu', 'ma', 'ba_part'].includes(w.id));
      }

      if (last.id === 'xihuan') {
        const subjectPronoun = sequence.find(w => w.category === 'pronoun');
        return WORDS.filter(w => {
          if (['thing', 'family'].includes(w.category)) return true;
          if (w.category === 'question') return ['shei', 'shenme'].includes(w.id);
          if (w.category === 'pronoun' && w.id !== subjectPronoun?.id && w.id !== 'zhe') return true;
          return false;
        });
      }

      if (last.id === 'shuo') {
        return WORDS.filter(w => {
          if (w.id === 'hanyu' || w.id === 'yidian' || w.id === 'na' || w.id === 'shenme') return true;
          if (w.category === 'country') {
            return !['baxi', 'jianada'].includes(w.id);
          }
          if (w.category === 'pronoun') return true;
          if (w.id === 'ma' || w.id === 'ba_part') return true;
          return false;
        });
      }

      if (last.id === 'jiao') {
        return WORDS.filter(w => w.id === 'shenme' || w.category === 'noun' || w.category === 'pronoun');
      }

      if (last.id === 'zai') {
        // 'zai' (在 - gerúndio 'estar fazendo' OU preposição de lugar 'em'):
        // 1. Gerúndio: zai + xiang / kan / xuexi / gongzuo / shuo / da_call / he / zuo
        // 2. Lugar: zai + zhongguo / gongsi / xuexiao / daxue / chaoshi / jia / difang / nar / nali / países
        return WORDS.filter(w => {
          if (['xiang', 'kan', 'xuexi', 'gongzuo', 'shuo', 'da_call', 'he', 'zuo'].includes(w.id)) return true;
          if (['zhongguo', 'gongsi', 'xuexiao', 'daxue', 'chaoshi', 'jia', 'difang', 'nali', 'nar', 'nali_there'].includes(w.id)) return true;
          if (w.category === 'country') return true;
          return false;
        });
      }

      if (last.id === 'keyi') {
        // 'keyi' (可以 - poder / permissão): seguido de ações (shuo, zuo, he, jin, da_call, fa_verb, qu_verb, kan) ou preposição gei
        return WORDS.filter(w => ['shuo', 'zuo', 'he', 'jin', 'da_call', 'fa_verb', 'qu_verb', 'kan'].includes(w.id) || w.id === 'gei');
      }

      if (last.id === 'hui') {
        // 'hui' (会 - poder / saber como habilidade adquirida): seguido de ações (shuo, zuo, he, da_call, fa_verb, jin, kan)
        return WORDS.filter(w => ['shuo', 'zuo', 'he', 'da_call', 'fa_verb', 'jin', 'kan'].includes(w.id));
      }

      if (last.id === 'da_call') {
        return WORDS.filter(w => w.id === 'dianhua');
      }

      if (last.id === 'fa_verb') {
        return WORDS.filter(w => w.id === 'youjian');
      }

      if (last.id === 'zhidao') {
        return WORDS.filter(w => w.id === 'yidian' || ['noun', 'thing', 'pronoun', 'question', 'family'].includes(w.category));
      }

      if (last.id === 'he') {
        return WORDS.filter(w => ['shui', 'cha', 'kafei', 'tang', 'yidian'].includes(w.id));
      }

      // Default verb output (e.g. 'shi'): can follow with nouns, classifiers, countries, pronouns, family, questions, things, numbers, duoda
      return WORDS.filter(w => {
        if (last.id === 'shi' && w.id === 'ge_class') return true; // e.g. jintian shi ge qingtian
        if (['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji', 'duoda'].includes(w.id)) return true;
        if (['noun', 'country', 'pronoun', 'thing', 'family', 'number'].includes(w.category)) return true;
        return false;
      });
    }

    // Case: Question particles
    if (last.category === 'question') {
      if (last.id === 'weishenme') {
        // 'weishenme' (为什么 - por que?): seguido de sujeito (ni, wo, ta) ou verbo (xiang, xuexi, qu_verb) ou advérbio (bu)
        return WORDS.filter(w => ['pronoun', 'family'].includes(w.category) || ['xiang', 'xuexi', 'qu_verb', 'bu'].includes(w.id));
      }

      if (last.id === 'duoshao') {
        // 'duoshao' (多少 - quanto): followed by 'qian' (dinheiro / preço), 'ren', 'ge_class', 'kou', 'xuesheng', 'laoshi', things, nouns
        return WORDS.filter(w => ['qian', 'ren', 'ge_class', 'kou', 'xuesheng', 'laoshi', 'tongxue'].includes(w.id) || ['thing', 'noun'].includes(w.category));
      }

      if (last.id === 'ji') {
        // 'ji' is question particle for quantity (family/things < 10, or age 'ji sui', or 'ji ge')
        // Followed by: classifier (kou, ge_class, sui), family members directly, things, or nouns (ren, etc.)
        return WORDS.filter(w => {
          if (w.category === 'classifier') return true;
          if (w.category === 'family' && w.id !== 'jia') return true;
          if (['ren', 'pengyou', 'tongxue', 'xuesheng', 'laoshi'].includes(w.id)) return true;
          if (['shu', 'mao', 'gou'].includes(w.id)) return true;
          return false;
        });
      }

      if (last.id === 'na' || last.id === 'shenme') {
        return WORDS.filter(w => {
          if (last.id === 'na' && w.id === 'guo') return true;
          if (w.category === 'country' && activeVerb?.id === 'shuo') {
            return !['baxi', 'jianada'].includes(w.id);
          }
          if (last.id === 'shenme' && ['mingzi', 'gongzuo', 'difang'].includes(w.id)) return true;
          return ['noun', 'country', 'thing', 'family'].includes(w.category);
        });
      }
    }

    // Case: Classifiers (kou, ge_class, sui)
    if (last.category === 'classifier') {
      if (last.id === 'kou') {
        // kou -> ren (most common family measure: kou ren) or family members
        return WORDS.filter(w => w.id === 'ren' || (w.category === 'family' && w.id !== 'jia'));
      }
      if (last.id === 'ge_class') {
        // ge -> family members, nouns, things, country (e.g. ji ge zhongguo pengyou), qingtian (shi ge qingtian), suffix ren, question (duoshao, zenmeyang)
        return WORDS.filter(w => {
          if (w.id === 'duoshao' || w.id === 'zenmeyang') return true;
          if (w.category === 'family' && w.id !== 'jia') return true;
          if (w.category === 'country') return true; // e.g. ji ge zhongguo pengyou
          if (['noun', 'thing'].includes(w.category)) {
            return !['nan', 'nü', 'haoma', 'dianhua'].includes(w.id);
          }
          if (w.id === 'ren') return true;
          return false;
        });
      }
      if (last.id === 'sui') {
        return WORDS.filter(w => w.id === 'ma' || w.id === 'ba_part');
      }
    }

    // Case: Country selected
    if (last.category === 'country') {
      if (verbExists) {
        if (last.requiresGuo && activeVerb?.id === 'shi') {
          return WORDS.filter(w => w.id === 'guo' || w.id === 'ren');
        }
        
        return WORDS.filter(w => {
          if (['pengyou', 'gongsi', 'cai', 'xuesheng', 'laoshi'].includes(w.id)) return true; // e.g. you zhongguo pengyou, zai zhongguo gongsi
          if (w.category !== 'suffix') return false;
          const supportsLanguageSuffix = !['baxi', 'jianada', 'putaoya'].includes(last.id);

          if (activeVerb?.id === 'shuo') {
            return w.id === 'yu' && supportsLanguageSuffix;
          }
          if (activeVerb?.id === 'shi') {
            return w.id === 'ren';
          }
          return true;
        });
      } else {
        // Country as subject or topic (e.g. "baxi zenmeyang?", "zhongguo hen da", "baxi ren", "fayu", "zhongguo pengyou bu duo")
        return WORDS.filter(w => {
          if (['pengyou', 'gongsi', 'cai', 'xuesheng', 'laoshi'].includes(w.id)) return true;
          if (w.id === 'zenmeyang') return true;
          if (last.requiresGuo && w.id === 'guo') return true;
          if (w.id === 'ren') return true;
          const supportsLanguageSuffix = !['baxi', 'jianada', 'putaoya'].includes(last.id);
          if (w.id === 'yu' && supportsLanguageSuffix) return true;
          if (['adverb', 'verb', 'adjective', 'possessive'].includes(w.category)) return true;
          return false;
        });
      }
    }

    // Case: Guo selected
    if (last.category === 'guo') {
      if (verbExists) {
        return WORDS.filter(w => w.id === 'ren');
      } else {
        return WORDS.filter(w => {
          if (w.id === 'ren' || w.id === 'zenmeyang') return true;
          if (['adverb', 'verb', 'adjective', 'possessive'].includes(w.category)) return true;
          return false;
        });
      }
    }

    // Case: Suffix, Noun, Thing, Adjective, Number
    if (
      last.category === 'suffix' || 
      last.category === 'noun' || 
      last.category === 'thing' || 
      last.category === 'adjective' ||
      last.category === 'number'
    ) {
      // Sub-rules for nested noun compound combinations
      if (prev?.category === 'preposition' && prev.id === 'gei') {
        return WORDS.filter(w => ['da_call', 'fa_verb', 'shuo'].includes(w.id));
      }

      if (last.id === 'difang') {
        // 'difang' (地方 - lugar): can be followed by 'ren' (pessoa -> shenme difang ren), 'zenmeyang', 'adjective', 'ba_part', 'ma'
        return WORDS.filter(w => ['ren', 'zenmeyang', 'ba_part', 'ma', 'de'].includes(w.id) || w.category === 'adjective');
      }

      if (last.id === 'chaoshi' || last.id === 'xuexiao' || last.id === 'daxue') {
        // Destination followed by particle, question, or purpose action (e.g. qu xuexiao kan shu)
        return WORDS.filter(w => {
          if (['ba_part', 'ma', 'de', 'zenmeyang', 'he_conj'].includes(w.id)) return true;
          if (['kan', 'xuexi', 'shuo', 'zuo', 'he', 'you_verb', 'dagai'].includes(w.id)) return true;
          if (w.category === 'adverb') return true;
          return false;
        });
      }

      if (last.id === 'pengyou') {
        // pengyou followed by nar / nali_there (ta you henduo pengyou nar), or bu (wo de zhongguo pengyou bu duo), or he_conj, or particles
        return WORDS.filter(w => ['nar', 'nali_there', 'bu', 'he_conj', 'ma', 'ba_part', 'zenmeyang'].includes(w.id) || w.category === 'adjective');
      }

      if (last.id === 'nan' || last.id === 'nü') {
        return WORDS.filter(w => w.id === 'pengyou');
      }
      if (last.id === 'dianhua') {
        return WORDS.filter(w => w.id === 'haoma' || w.id === 'da_call');
      }
      if (last.id === 'haoma') {
        return WORDS.filter(w => w.id === 'duoshao' || w.category === 'number' || w.id === 'shi');
      }
      if (last.id === 'gongzuo') {
        return WORDS.filter(w => w.id === 'zenmeyang' || w.category === 'adjective' || w.category === 'verb');
      }

      // If number selected (e.g. si, liang, er, san, wu, shi_num, jiu, bai...):
      // Can be followed by tens/hundreds (shi_num, bai), classifier (sui, kou, ge_class), family members directly, things, nouns (ren, xuesheng), or digits
      if (last.category === 'number') {
        return WORDS.filter(w => {
          if (last.id === 'wu' && w.id === 'shi_num') return true;
          if (last.id === 'shi_num' && ['yi', 'er', 'san', 'si', 'wu', 'liu', 'qi', 'ba', 'jiu', 'sui', 'ge_class', 'xuesheng', 'ren'].includes(w.id)) return true;
          if (last.id === 'yi' && (w.id === 'bai' || w.category === 'classifier')) return true;
          if (last.id === 'bai' && ['xuesheng', 'ren', 'ge_class', 'sui'].includes(w.id)) return true;
          if (w.category === 'classifier') return true;
          if (w.category === 'family' && w.id !== 'jia') return true;
          if (['thing', 'number'].includes(w.category)) return true;
          if (['ren', 'pengyou', 'xuesheng', 'laoshi'].includes(w.id)) return true;
          if (w.id === 'ma' || w.id === 'ba_part') return true;
          return false;
        });
      }

      // Adjective endings
      if (last.category === 'adjective') {
        return WORDS.filter(w => {
          if (w.id === 'ma' || w.id === 'ba_part') return true;
          if (last.id === 'hao' && (w.id === 'de' || w.id === 'bu')) return true;
          return false;
        });
      }

      // General endings
      if (!verbExists && !hasQuestion) {
        return WORDS.filter(w => ['adverb', 'verb', 'adjective', 'question', 'possessive'].includes(w.category));
      }

      // Questions are final, but can have 'ma' or 'ba_part' if applicable
      const allowedEndings: Word[] = [];
      if (!hasQuestion && !sequence.some(w => w.id === 'ma')) {
        const maW = WORDS.find(w => w.id === 'ma');
        if (maW) allowedEndings.push(maW);
      }
      if (!hasQuestion && !sequence.some(w => w.id === 'ba_part')) {
        const baW = WORDS.find(w => w.id === 'ba_part');
        if (baW) allowedEndings.push(baW);
      }

      return allowedEndings;
    }

    return [];
  };

  const baseWords = getBaseWords();
  let finalWords = [...baseWords];

  // Leave question particle 'ma' and suggestion particle 'ba_part' available after complete sentence is formed
  if (checkIsValid(sequence)) {
    const hasQuestion = sequence.some(w => ['na', 'shenme', 'duoshao', 'nali', 'zenmeyang', 'shei', 'ji', 'duoda'].includes(w.id));
    const hasMa = sequence.some(w => w.id === 'ma');
    const hasBa = sequence.some(w => w.id === 'ba_part');
    if (!hasQuestion && !hasMa) {
      const maWord = WORDS.find(w => w.id === 'ma');
      if (maWord && !finalWords.some(w => w.id === 'ma')) {
        finalWords.push(maWord);
      }
    }
    if (!hasQuestion && !hasBa) {
      const baWord = WORDS.find(w => w.id === 'ba_part');
      if (baWord && !finalWords.some(w => w.id === 'ba_part')) {
        finalWords.push(baWord);
      }
    }
  }

  if (sequence.length > 0) {
    const last = sequence[sequence.length - 1];
    
    // Rule for adding 'he_conj' (conjunction "e")
    const nounCategories = ['suffix', 'noun', 'thing', 'country', 'pronoun', 'family'];
    const restrictedIds = ['zhe', 'na_dem', 'nan', 'nü', 'dianhua', 'haoma', 'gongzuo'];
    if (nounCategories.includes(last.category) && !restrictedIds.includes(last.id)) {
      const heConjWord = WORDS.find(w => w.id === 'he_conj');
      if (heConjWord && !finalWords.some(w => w.id === 'he_conj')) {
        finalWords.push(heConjWord);
      }
    }
  }

  return finalWords;
}

// Function to normalize pinyin / search text (remove diacritics, lowercase, strip punctuation)
function normalizePinyinText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate Levenshtein edit distance between two strings
function levenshteinDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const dp: number[][] = [];
  for (let i = 0; i <= al; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[al][bl];
}

// Find candidate words in vocabulary for a given token (exact match)
function findCandidatesForToken(rawToken: string): Word[] {
  const norm = normalizePinyinText(rawToken);
  if (!norm && !rawToken.trim()) return [];

  // 1. Check compound pinyin map
  const mappedId = COMPOUND_PINYIN_MAP[norm];
  if (mappedId) {
    const word = WORDS.find(w => w.id === mappedId);
    if (word) return [word];
  }

  // 2. Direct Hanzi match
  const hanziMatches = WORDS.filter(w => w.hanzi === rawToken.trim());
  if (hanziMatches.length > 0) return hanziMatches;

  // 3. Direct ID match
  const idMatches = WORDS.filter(w => w.id === norm);
  if (idMatches.length > 0) return idMatches;

  // 4. Normalized Label match
  const labelMatches = WORDS.filter(w => normalizePinyinText(w.label) === norm);
  if (labelMatches.length > 0) return labelMatches;

  // 5. Special aliases (nu/nv for nü)
  if (norm === 'nu' || norm === 'nv') {
    const nuWord = WORDS.find(w => w.id === 'nü');
    if (nuWord) return [nuWord];
  }

  // 6. Portuguese exact translation match
  const transMatches = WORDS.filter(w => normalizePinyinText(w.translation) === norm);
  if (transMatches.length > 0) return transMatches;

  return [];
}

// Find closest word in vocabulary for a given misspelled or approximate token
function findClosestWordForToken(
  rawToken: string,
  previousWords: Word[] = []
): { word: Word; score: number; pinyinKey: string } | null {
  const norm = normalizePinyinText(rawToken);
  if (!norm) return null;

  // Words that are grammatically allowed after previousWords (if provided)
  const allowed = previousWords.length > 0 ? getAvailableWordsForSequence(previousWords) : [];

  let bestMatch: { word: Word; score: number; pinyinKey: string } | null = null;
  let highestScore = -Infinity;

  for (const word of WORDS) {
    const wordPinyins = [
      normalizePinyinText(word.label),
      normalizePinyinText(word.id.replace(/_.*$/, '')),
    ];

    // Add compound pinyin keys
    for (const [mapKey, mappedId] of Object.entries(COMPOUND_PINYIN_MAP)) {
      if (mappedId === word.id) {
        wordPinyins.push(mapKey);
      }
    }

    const isGrammaticallyAllowed = allowed.some(aw => aw.id === word.id);

    for (const targetPinyin of wordPinyins) {
      if (!targetPinyin) continue;

      const dist = levenshteinDistance(norm, targetPinyin);
      const maxLen = Math.max(norm.length, targetPinyin.length);
      
      const maxAllowedDist = maxLen <= 3 ? 1 : maxLen <= 5 ? 2 : 3;
      if (dist > maxAllowedDist) continue;

      // Base score
      let score = 1 - (dist / maxLen);

      // Prefix match bonus (e.g. "xihua" -> "xihuan", "laosh" -> "laoshi")
      if (targetPinyin.startsWith(norm) || norm.startsWith(targetPinyin)) {
        score += 0.25;
      }

      // Substring bonus
      if (targetPinyin.includes(norm) || norm.includes(targetPinyin)) {
        score += 0.15;
      }

      // Vowel / diphthong similarity (e.g. "ko" vs "kou", "ho" vs "hao", "she" vs "shei", "laosh" vs "laoshi")
      if (
        (norm.endsWith('o') && targetPinyin.endsWith('ou')) ||
        (norm.endsWith('o') && targetPinyin.endsWith('ao')) ||
        (norm.endsWith('e') && targetPinyin.endsWith('ei')) ||
        (norm.endsWith('n') && targetPinyin.endsWith('ng')) ||
        (norm.startsWith('sh') && targetPinyin.startsWith('s')) ||
        (norm.startsWith('zh') && targetPinyin.startsWith('z')) ||
        (norm.startsWith('ch') && targetPinyin.startsWith('c'))
      ) {
        score += 0.25;
      }

      // Grammatical alignment bonus (e.g. after "si", measure word "kou" is expected)
      if (isGrammaticallyAllowed) {
        score += 0.40;
      }

      if (score > highestScore && score >= 0.45) {
        highestScore = score;
        bestMatch = {
          word,
          score,
          pinyinKey: targetPinyin,
        };
      }
    }

    // Check Portuguese translation similarity (e.g. "obrigdo" -> "obrigado")
    const normTrans = normalizePinyinText(word.translation);
    const transDist = levenshteinDistance(norm, normTrans);
    const transMaxLen = Math.max(norm.length, normTrans.length);
    if (transDist <= 2 && transMaxLen > 3) {
      let transScore = (1 - transDist / transMaxLen) + (isGrammaticallyAllowed ? 0.35 : 0);
      if (transScore > highestScore && transScore >= 0.5) {
        highestScore = transScore;
        bestMatch = {
          word,
          score: transScore,
          pinyinKey: word.label,
        };
      }
    }
  }

  return bestMatch;
}

// Generate "Did you mean" suggestion for search queries / full phrases
function getDidYouMeanSuggestion(input: string, currentActiveSequence: Word[] = []): DidYouMeanResult | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const tokens = tokenizePhraseInput(trimmed);
  if (tokens.length === 0) return null;

  const parts: DidYouMeanPart[] = [];
  const suggestedTokens: string[] = [];
  const suggestedWords: Word[] = [];
  let hasCorrections = false;
  let trackedSeq: Word[] = [...currentActiveSequence];

  // Case 1: Single token search
  if (tokens.length === 1) {
    const rawToken = tokens[0];
    const exactMatches = findCandidatesForToken(rawToken);

    // If exact match already exists in dictionary, no correction needed
    if (exactMatches.length > 0) {
      return null;
    }

    const closest = findClosestWordForToken(rawToken, currentActiveSequence);
    if (closest) {
      const suggestedPinyin = closest.pinyinKey || closest.word.label;
      return {
        originalQuery: input,
        suggestedText: suggestedPinyin,
        parts: [{
          text: suggestedPinyin.toUpperCase(),
          isChanged: true,
          word: closest.word,
        }],
        hasCorrections: true,
        suggestedWords: [closest.word],
      };
    }
    return null;
  }

  // Case 2: Multi-word phrase query (e.g. "wo jia you si ko ren", "wo bu you gongzuo")
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const exactMatches = findCandidatesForToken(token);

    if (exactMatches.length > 0) {
      // Valid word found
      const allowed = getAvailableWordsForSequence(trackedSeq);
      let validMatch = exactMatches.find(c => allowed.some(a => a.id === c.id));

      // Special Grammar Auto-Correction: "bu you" -> "mei you" (negating 'you' with 'mei')
      if (
        !validMatch &&
        exactMatches.some(c => c.id === 'you_verb') &&
        trackedSeq.length > 0 &&
        trackedSeq[trackedSeq.length - 1].id === 'bu'
      ) {
        const meiWord = WORDS.find(w => w.id === 'mei')!;
        trackedSeq[trackedSeq.length - 1] = meiWord;

        if (parts.length > 0) {
          parts[parts.length - 1] = {
            text: 'MEI',
            isChanged: true,
            word: meiWord,
          };
          suggestedTokens[suggestedTokens.length - 1] = 'mei';
        }
        hasCorrections = true;

        const updatedAllowed = getAvailableWordsForSequence(trackedSeq);
        validMatch = exactMatches.find(c => updatedAllowed.some(a => a.id === c.id)) || exactMatches[0];
      } else if (
        !validMatch &&
        exactMatches.some(c => c.id === 'shi') &&
        trackedSeq.length > 0 &&
        trackedSeq[trackedSeq.length - 1].id === 'mei'
      ) {
        // "mei shi" -> "bu shi"
        const buWord = WORDS.find(w => w.id === 'bu')!;
        trackedSeq[trackedSeq.length - 1] = buWord;

        if (parts.length > 0) {
          parts[parts.length - 1] = {
            text: 'BU',
            isChanged: true,
            word: buWord,
          };
          suggestedTokens[suggestedTokens.length - 1] = 'bu';
        }
        hasCorrections = true;

        const updatedAllowed = getAvailableWordsForSequence(trackedSeq);
        validMatch = exactMatches.find(c => updatedAllowed.some(a => a.id === c.id)) || exactMatches[0];
      }

      if (!validMatch) {
        validMatch = exactMatches[0];
      }

      trackedSeq.push(validMatch);
      suggestedWords.push(validMatch);
      suggestedTokens.push(token);
      parts.push({
        text: token,
        isChanged: false,
        word: validMatch,
      });
    } else {
      // Token is misspelled (e.g. "ko" in "wo jia you si ko ren")
      const closest = findClosestWordForToken(token, trackedSeq);
      if (closest) {
        hasCorrections = true;
        const replacementPinyin = closest.pinyinKey || closest.word.label;
        suggestedTokens.push(replacementPinyin);
        suggestedWords.push(closest.word);
        trackedSeq.push(closest.word);
        parts.push({
          text: replacementPinyin.toUpperCase(), // Highlight in UPPERCASE (e.g. KOU)
          isChanged: true,
          word: closest.word,
        });
      } else {
        // Unknown token without close match
        suggestedTokens.push(token);
        parts.push({
          text: token,
          isChanged: false,
        });
      }
    }
  }

  if (!hasCorrections) {
    return null;
  }

  const suggestedText = suggestedTokens.join(' ');
  return {
    originalQuery: input,
    suggestedText,
    parts,
    hasCorrections: true,
    suggestedWords,
  };
}

// Split input string into tokens (supporting Hanzi or Pinyin words)
function tokenizePhraseInput(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  // If input contains Chinese characters, greedily match against dictionary
  const hasChinese = /[\u4e00-\u9fa5]/.test(trimmed);
  if (hasChinese) {
    const hanziDict = [...WORDS].sort((a, b) => b.hanzi.length - a.hanzi.length);
    const tokens: string[] = [];
    let i = 0;
    while (i < trimmed.length) {
      if (/[ \t\n\r,，.。!！?？"']/.test(trimmed[i])) {
        i++;
        continue;
      }
      let matched = false;
      for (const w of hanziDict) {
        if (trimmed.startsWith(w.hanzi, i)) {
          tokens.push(w.hanzi);
          i += w.hanzi.length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        tokens.push(trimmed[i]);
        i++;
      }
    }
    return tokens;
  }

  // Latin / Pinyin tokenization
  const rawWords = trimmed
    .split(/[\s,，.。!！?？"'\-]+/)
    .map(w => w.trim())
    .filter(Boolean);

  const tokens: string[] = [];
  let i = 0;
  while (i < rawWords.length) {
    const norm = normalizePinyinText(rawWords[i]);

    // Handle compound negatives written without spaces (meiyou -> mei + you, buyou -> bu + you, buhui -> bu + hui, bukeyi -> bu + keyi)
    if (norm === 'meiyou') {
      tokens.push('mei', 'you');
      i++;
      continue;
    }
    if (norm === 'buyou') {
      tokens.push('bu', 'you');
      i++;
      continue;
    }
    if (norm === 'buhui') {
      tokens.push('bu', 'hui');
      i++;
      continue;
    }
    if (norm === 'bukeyi') {
      tokens.push('bu', 'keyi');
      i++;
      continue;
    }
    if (norm === 'zhege') {
      tokens.push('zhe', 'ge');
      i++;
      continue;
    }
    if (norm === 'nage') {
      tokens.push('na', 'ge');
      i++;
      continue;
    }
    if (norm === 'duoshaoqian') {
      tokens.push('duo shao', 'qian');
      i++;
      continue;
    }
    if (norm === 'nihao') {
      tokens.push('ni', 'hao');
      i++;
      continue;
    }
    if (norm === 'ninhao') {
      tokens.push('nin', 'hao');
      i++;
      continue;
    }
    if (norm === 'nimenhao') {
      tokens.push('ni', 'men', 'hao');
      i++;
      continue;
    }
    if (norm === 'henhao') {
      tokens.push('hen', 'hao');
      i++;
      continue;
    }
    if (norm === 'buhao') {
      tokens.push('bu', 'hao');
      i++;
      continue;
    }
    if (norm === 'haode') {
      tokens.push('hao', 'de');
      i++;
      continue;
    }
    if (norm === 'haobuhao') {
      tokens.push('hao', 'bu', 'hao');
      i++;
      continue;
    }
    if (norm === 'nihaoma') {
      tokens.push('ni', 'hao', 'ma');
      i++;
      continue;
    }
    if (norm === 'ninhaoma') {
      tokens.push('nin', 'hao', 'ma');
      i++;
      continue;
    }
    if (norm === 'zaoshanghao') {
      tokens.push('zaoshang', 'hao');
      i++;
      continue;
    }
    if (norm === 'dajiahao') {
      tokens.push('dajia', 'hao');
      i++;
      continue;
    }
    if (norm === 'zaijian') {
      tokens.push('zaijian');
      i++;
      continue;
    }
    if (norm === 'zaoshang') {
      tokens.push('zaoshang');
      i++;
      continue;
    }
    if (norm === 'dajia') {
      tokens.push('dajia');
      i++;
      continue;
    }
    if (norm === 'nver' || norm === 'nuer') {
      tokens.push('nver');
      i++;
      continue;
    }
    if (norm === 'erzi') {
      tokens.push('erzi');
      i++;
      continue;
    }
    if (norm === 'duoda') {
      tokens.push('duoda');
      i++;
      continue;
    }
    if (norm === 'difang') {
      tokens.push('difang');
      i++;
      continue;
    }
    if (norm === 'chaoshi') {
      tokens.push('chaoshi');
      i++;
      continue;
    }
    if (norm === 'keai') {
      tokens.push('keai');
      i++;
      continue;
    }

    // Try 3-word window
    if (i + 2 < rawWords.length) {
      const triKey = `${normalizePinyinText(rawWords[i])} ${normalizePinyinText(rawWords[i + 1])} ${normalizePinyinText(rawWords[i + 2])}`;
      if (COMPOUND_PINYIN_MAP[triKey]) {
        tokens.push(`${rawWords[i]} ${rawWords[i + 1]} ${rawWords[i + 2]}`);
        i += 3;
        continue;
      }
    }
    // Try 2-word window
    if (i + 1 < rawWords.length) {
      const biKey = `${normalizePinyinText(rawWords[i])} ${normalizePinyinText(rawWords[i + 1])}`;
      if (COMPOUND_PINYIN_MAP[biKey]) {
        tokens.push(`${rawWords[i]} ${rawWords[i + 1]}`);
        i += 2;
        continue;
      }
    }
    // Single word
    tokens.push(rawWords[i]);
    i++;
  }

  return tokens;
}

// Function to validate and assemble a full phrase token by token
function validateAndBuildPhrase(input: string): PhraseValidationReport {
  const tokens = tokenizePhraseInput(input);
  if (tokens.length === 0) {
    return {
      rawInput: input,
      steps: [],
      success: false,
      stoppedAtIndex: null,
      validWords: [],
      isCompleteSentence: false,
      suggestion: null,
    };
  }

  const steps: PhraseValidationStep[] = [];
  const currentSeq: Word[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const rawToken = tokens[i];
    const candidates = findCandidatesForToken(rawToken);

    if (candidates.length === 0) {
      // Word does not exist in dictionary - try to find closest match
      const closest = findClosestWordForToken(rawToken, currentSeq);
      const suggestionText = closest
        ? ` Você quis dizer "${closest.pinyinKey || closest.word.label}" (${closest.word.hanzi} - ${closest.word.translation})?`
        : '';

      steps.push({
        token: rawToken,
        word: closest ? closest.word : null,
        status: 'unknown_word',
        errorMessage: `A palavra "${rawToken}" (posição ${i + 1}) não foi encontrada no vocabulário.${suggestionText}`,
        ruleHint: closest
          ? `Sugestão: Substitua "${rawToken}" por "${closest.pinyinKey || closest.word.label}" (${closest.word.hanzi} - ${closest.word.translation}).`
          : 'Verifique a ortografia do pinyin, ideograma ou significado.',
        position: i + 1,
      });

      // Mark remaining tokens as unprocessed
      for (let j = i + 1; j < tokens.length; j++) {
        steps.push({
          token: tokens[j],
          word: null,
          status: 'unprocessed',
          position: j + 1,
        });
      }

      const suggestion = getDidYouMeanSuggestion(input, []);

      return {
        rawInput: input,
        steps,
        success: false,
        stoppedAtIndex: i,
        errorReason: `A palavra "${rawToken}" não foi encontrada no vocabulário.${suggestionText}`,
        validWords: currentSeq,
        isCompleteSentence: checkIsValid(currentSeq),
        suggestion,
      };
    }

    // Get available words for current sequence state
    const allowed = getAvailableWordsForSequence(currentSeq);
    
    // Check if any candidate is in allowed words
    const validCandidate = candidates.find(c => allowed.some(aw => aw.id === c.id));

    if (validCandidate) {
      // Step is grammatically valid!
      currentSeq.push(validCandidate);
      steps.push({
        token: rawToken,
        word: validCandidate,
        status: 'valid',
        position: i + 1,
      });
    } else {
      // Word exists, BUT cannot be placed in this grammatical position!
      const candidate = candidates[0];
      const grammarTip = generateGrammarOrderTip(currentSeq, candidate, rawToken, i + 1);

      steps.push({
        token: rawToken,
        word: candidate,
        status: 'invalid_grammar',
        errorMessage: 'A palavra existe, mas não pode ser inserida porque não está na ordem correta para formar uma frase.',
        ruleHint: grammarTip.explanation,
        grammarTip,
        position: i + 1,
      });

      // Mark remaining tokens as unprocessed
      for (let j = i + 1; j < tokens.length; j++) {
        steps.push({
          token: tokens[j],
          word: null,
          status: 'unprocessed',
          position: j + 1,
        });
      }

      const suggestion = getDidYouMeanSuggestion(input, []);

      return {
        rawInput: input,
        steps,
        success: false,
        stoppedAtIndex: i,
        errorReason: `${grammarTip.title}: ${grammarTip.ruleName}`,
        validWords: currentSeq,
        isCompleteSentence: checkIsValid(currentSeq),
        suggestion,
        contextualGrammarTip: grammarTip,
      };
    }
  }

  // All steps passed successfully!
  return {
    rawInput: input,
    steps,
    success: true,
    stoppedAtIndex: null,
    validWords: currentSeq,
    isCompleteSentence: checkIsValid(currentSeq),
    suggestion: null,
  };
}

// Function to validate a full sequence of words token by token from scratch
function validateWordSequence(seq: Word[]): { success: boolean; stoppedAtIndex: number | null; errorTip: ContextualGrammarTip | null } {
  if (seq.length === 0) return { success: true, stoppedAtIndex: null, errorTip: null };
  const currentSeq: Word[] = [];

  for (let i = 0; i < seq.length; i++) {
    const word = seq[i];
    const allowed = getAvailableWordsForSequence(currentSeq);
    const isAllowed = allowed.some(aw => aw.id === word.id);

    if (isAllowed) {
      currentSeq.push(word);
    } else {
      const tip = generateGrammarOrderTip(currentSeq, word, word.label, i + 1);
      return {
        success: false,
        stoppedAtIndex: i,
        errorTip: tip,
      };
    }
  }

  return { success: true, stoppedAtIndex: null, errorTip: null };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'builder' | 'practice' | 'quiz' | 'dialogue' | 'pronunciation' | 'chat' | 'hanzi'>('builder');
  const [isDictionaryOpen, setIsDictionaryOpen] = useState<boolean>(false);
  const [sequence, setSequence] = useState<Word[]>([]);
  const [insertIndex, setInsertIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [validationReport, setValidationReport] = useState<PhraseValidationReport | null>(null);
  const [activeGrammarTip, setActiveGrammarTip] = useState<ContextualGrammarTip | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Safely constrained active insertion index
  const activeInsertIndex = useMemo(() => {
    return Math.min(Math.max(0, insertIndex), sequence.length);
  }, [insertIndex, sequence.length]);

  const addWord = (word: Word) => {
    const targetIdx = activeInsertIndex;
    const newSeq = [
      ...sequence.slice(0, targetIdx),
      word,
      ...sequence.slice(targetIdx)
    ];
    setSequence(newSeq);
    setInsertIndex(targetIdx + 1);
    setSearchQuery('');
    setValidationReport(null);
    setActiveGrammarTip(null);
    
    // Focus search input on the next tick
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const removeWordAt = (index: number) => {
    const newSeq = sequence.filter((_, i) => i !== index);
    setSequence(newSeq);
    if (insertIndex > index) {
      setInsertIndex(Math.max(0, insertIndex - 1));
    } else if (insertIndex > newSeq.length) {
      setInsertIndex(newSeq.length);
    }
    setValidationReport(null);
    setActiveGrammarTip(null);
  };

  const removeLast = () => {
    if (sequence.length === 0) return;
    removeWordAt(sequence.length - 1);
  };

  const clearSequence = () => {
    setSequence([]);
    setInsertIndex(0);
    setValidationReport(null);
    setActiveGrammarTip(null);
  };

  // Available words for current sequence state and active insertion position
  const availableWords = useMemo(() => {
    if (activeInsertIndex === sequence.length) {
      return getAvailableWordsForSequence(sequence);
    }
    return WORDS.filter(word => {
      const candidate = [
        ...sequence.slice(0, activeInsertIndex),
        word,
        ...sequence.slice(activeInsertIndex)
      ];
      return validateWordSequence(candidate).success;
    });
  }, [sequence, activeInsertIndex]);

  // Helper to check if sequence forms a complete/valid clause
  const isValidSentence = useMemo(() => {
    return checkIsValid(sequence);
  }, [sequence]);

  // Tokens detected in search query
  const tokensInQuery = useMemo(() => {
    return tokenizePhraseInput(searchQuery);
  }, [searchQuery]);

  const isMultiWordQuery = tokensInQuery.length > 1;

  // "Did you mean" suggestion based on current search input
  const didYouMean = useMemo(() => {
    return getDidYouMeanSuggestion(searchQuery, sequence);
  }, [searchQuery, sequence]);

  // Handle phrase validation and assembly
  const handleValidateAndBuildPhrase = (inputToValidate?: string) => {
    const text = inputToValidate !== undefined ? inputToValidate : searchQuery;
    if (!text.trim()) return;

    const report = validateAndBuildPhrase(text);
    setValidationReport(report);

    if (report.validWords.length > 0) {
      setSequence(report.validWords);
      setInsertIndex(report.validWords.length);
    }
    
    if (report.success) {
      setSearchQuery('');
      setActiveGrammarTip(null);
    } else if (report.contextualGrammarTip) {
      setActiveGrammarTip(report.contextualGrammarTip);
    }
  };

  // Keyboard handler for search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isMultiWordQuery) {
        handleValidateAndBuildPhrase(searchQuery);
      } else if (filteredWords.length > 0) {
        addWord(filteredWords[0]);
      } else if (didYouMean && didYouMean.hasCorrections) {
        setSearchQuery(didYouMean.suggestedText);
        handleValidateAndBuildPhrase(didYouMean.suggestedText);
      } else if (searchQuery.trim()) {
        handleValidateAndBuildPhrase(searchQuery);
      }
    }
  };

  // Check if word is clickable (available to select)
  const isWordClickable = (word: Word) => {
    return availableWords.some(w => w.id === word.id);
  };

  // Filter words by search query and grammar availability for the palette
  const filteredWords = useMemo(() => {
    // Only show words that are currently available to select (grammatically allowed)
    let words = WORDS.filter(w => availableWords.some(aw => aw.id === w.id));

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const normQ = normalizePinyinText(searchQuery);
      words = words.filter(w => 
        normalizePinyinText(w.label).includes(normQ) || 
        normalizePinyinText(w.id).includes(normQ) ||
        w.hanzi.includes(q) || 
        normalizePinyinText(w.translation).includes(normQ)
      );
    }
    return words;
  }, [searchQuery, availableWords]);

  // All words matching the search query in the entire vocabulary
  const matchingDictionaryWords = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const normQ = normalizePinyinText(searchQuery);
    return WORDS.filter(w => 
      normalizePinyinText(w.label).includes(normQ) || 
      normalizePinyinText(w.id).includes(normQ) ||
      w.hanzi.includes(q) || 
      normalizePinyinText(w.translation).includes(normQ)
    );
  }, [searchQuery]);

  // Words matching search query that cannot be inserted at this grammatical position
  const unavailableMatchingWords = useMemo(() => {
    return matchingDictionaryWords.filter(w => !availableWords.some(aw => aw.id === w.id));
  }, [matchingDictionaryWords, availableWords]);

  // Get background color for categories
  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'pronoun': return 'bg-blue-50';
      case 'verb': return 'bg-green-50';
      case 'adverb': return 'bg-yellow-50';
      case 'question': return 'bg-purple-50';
      case 'noun': return 'bg-amber-50';
      case 'family': return 'bg-emerald-50';
      case 'classifier': return 'bg-amber-100';
      case 'country': return 'bg-teal-50';
      case 'plural': return 'bg-indigo-50';
      case 'possessive': return 'bg-rose-100';
      case 'thing': return 'bg-orange-50';
      case 'adjective': return 'bg-yellow-50';
      case 'number': return 'bg-cyan-50';
      case 'preposition': return 'bg-orange-100';
      case 'etiquette': return 'bg-sky-100';
      case 'conjunction': return 'bg-pink-100';
      case 'particle': return 'bg-purple-100';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      {/* Main App Container */}
      <div className="w-full max-w-4xl bg-white text-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 border border-slate-100">
        {/* Header with Navigation & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display uppercase tracking-tight">Fraseiro Mandarim</h1>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                  v1.2026.09.17
                </span>
              </div>
              <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">
                Sentencing Logic Engine & Practice Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center flex-wrap gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                id="tab-dialogue-btn"
                onClick={() => setActiveTab('dialogue')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'dialogue'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Diálogo</span>
              </button>

              <button
                id="tab-pronunciation-btn"
                onClick={() => setActiveTab('pronunciation')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pronunciation'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Teste de Pronúncia com reconhecimento de voz e checagem de regras gramaticais"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Pronúncia</span>
                <span className={`text-[8px] px-1 py-0.2 rounded-full font-bold uppercase ${
                  activeTab === 'pronunciation' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
                }`}>
                  Mic
                </span>
              </button>

              <button
                id="tab-chat-btn"
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bate-papo em tempo real: envie e receba frases construídas"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Bate-papo</span>
                <span className={`text-[8px] px-1 py-0.2 rounded-full font-bold uppercase ${
                  activeTab === 'chat' ? 'bg-indigo-700 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Live
                </span>
              </button>

              <button
                id="tab-hanzi-btn"
                onClick={() => setActiveTab('hanzi')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'hanzi'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Modo Hanzi: desenhe caracteres na grade e pratique a ordem dos traços"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Modo Hanzi</span>
                <span className={`text-[8px] px-1 py-0.2 rounded-full font-bold uppercase ${
                  activeTab === 'hanzi' ? 'bg-rose-700 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  Desenho
                </span>
              </button>

              <button
                id="tab-builder-btn"
                onClick={() => setActiveTab('builder')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'builder'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Construtor</span>
              </button>

              <button
                id="tab-practice-btn"
                onClick={() => setActiveTab('practice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'practice'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Prática</span>
              </button>

              <button
                id="tab-quiz-btn"
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Quiz</span>
              </button>
            </div>

            {/* Dictionary Modal Button */}
            <button
              id="open-dictionary-btn"
              onClick={() => setIsDictionaryOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs transition-all cursor-pointer"
              title="Abrir dicionário visual completo com filtros por categoria e nível HSK"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dicionário</span>
            </button>

            {/* Clear Sequence Button (only in builder mode) */}
            {activeTab === 'builder' && (
              <button 
                id="clear-sequence-btn"
                onClick={clearSequence}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Limpar frase atual"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* View Switch: Dialogue Mode, Pronunciation Mode, Chat Mode, Hanzi Mode, Quiz Mode, Practice Mode or Builder Mode */}
        {activeTab === 'dialogue' ? (
          <DialogueMode
            allWords={WORDS}
            getAvailableWords={getAvailableWordsForSequence}
            checkIsValidSentence={checkIsValid}
            getNaturalTranslation={getNaturalTranslation}
            validateAndBuildPhrase={validateAndBuildPhrase}
            onOpenDictionary={() => setIsDictionaryOpen(true)}
          />
        ) : activeTab === 'pronunciation' ? (
          <PronunciationMode
            allWords={WORDS}
            checkIsValidSentence={checkIsValid}
            getNaturalTranslation={getNaturalTranslation}
            builderPhrase={sequence.length > 0 ? {
              hanzi: sequence.map(w => w.hanzi).join(''),
              pinyin: sequence.map(w => w.label).join(' '),
              portuguese: getNaturalTranslation(sequence),
              words: sequence
            } : undefined}
            onSendToBuilder={(words) => {
              setSequence(words);
              setInsertIndex(words.length);
              setActiveTab('builder');
            }}
            onOpenDictionary={() => setIsDictionaryOpen(true)}
          />
        ) : activeTab === 'chat' ? (
          <ChatMode
            allWords={WORDS}
            builderPhrase={sequence.length > 0 ? {
              hanzi: sequence.map(w => w.hanzi).join(''),
              pinyin: sequence.map(w => w.label).join(' '),
              portuguese: getNaturalTranslation(sequence),
              words: sequence,
              isValid: isValidSentence
            } : undefined}
            onSendToBuilder={(words) => {
              setSequence(words);
              setInsertIndex(words.length);
              setActiveTab('builder');
            }}
            onOpenDictionary={() => setIsDictionaryOpen(true)}
            onNavigateToBuilder={() => setActiveTab('builder')}
          />
        ) : activeTab === 'hanzi' ? (
          <HanziCanvasMode
            allWords={WORDS}
            onOpenDictionary={() => setIsDictionaryOpen(true)}
            onSendToBuilder={(words) => {
              setSequence(words);
              setInsertIndex(words.length);
              setActiveTab('builder');
            }}
          />
        ) : activeTab === 'quiz' ? (
          <QuizMode
            allWords={WORDS}
            validateAndBuildPhrase={validateAndBuildPhrase}
            onOpenDictionary={() => setIsDictionaryOpen(true)}
          />
        ) : activeTab === 'practice' ? (
          <PracticeMode
            allWords={WORDS}
            getAvailableWords={getAvailableWordsForSequence}
            checkIsValidSentence={checkIsValid}
            getNaturalTranslation={getNaturalTranslation}
            validateAndBuildPhrase={validateAndBuildPhrase}
            onOpenDictionary={() => setIsDictionaryOpen(true)}
          />
        ) : (
          <>

        {/* Prominent Search & Sentence Input Bar Section */}
        <div className="bg-slate-50 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 border-2 border-slate-200/80 rounded-2xl p-5 flex flex-col gap-3 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Pesquisar Palavra ou Digitar Frase Completa
              </span>
            </div>
            {isMultiWordQuery && (
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Frase detectada ({tokensInQuery.length} palavras)
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ex: wo jia you si kou ren, ni hao, 我喜欢喝茶 ou busque palavras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-10 py-3 text-sm bg-white text-slate-800 rounded-xl border border-slate-200/80 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 font-medium shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Limpar texto"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {searchQuery.trim() && (
              <button
                onClick={() => handleValidateAndBuildPhrase(searchQuery)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isMultiWordQuery ? 'Montar e Validar' : 'Validar'}
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Pressione <strong>Enter</strong> para validar uma frase completa palavra por palavra ou selecionar termos.</span>
          </p>
        </div>

        {/* "Você quis dizer..." Suggestion Banner when typos are detected in the search/phrase */}
        {didYouMean && didYouMean.hasCorrections && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-50/95 via-sky-50/80 to-blue-50/95 border-2 border-indigo-200/90 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-wrap items-baseline gap-1.5 text-sm">
                <span className="text-slate-600 font-medium">Você quis dizer:</span>
                <button
                  onClick={() => {
                    setSearchQuery(didYouMean.suggestedText);
                    handleValidateAndBuildPhrase(didYouMean.suggestedText);
                  }}
                  className="inline-flex items-center gap-1 font-mono text-xs sm:text-sm font-semibold bg-white hover:bg-indigo-50/50 border border-indigo-200/80 px-2.5 py-1 rounded-xl shadow-xs hover:border-indigo-300 transition-all cursor-pointer group text-slate-800"
                  title="Clique para aplicar a frase sugerida e validar"
                >
                  <span className="text-slate-800">
                    {didYouMean.parts.map((part, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && ' '}
                        {part.isChanged ? (
                          <strong className="text-indigo-700 font-bold bg-indigo-100/90 px-1.5 py-0.5 rounded uppercase tracking-wider text-xs border border-indigo-200">
                            {part.text}
                          </strong>
                        ) : (
                          <span>{part.text}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </span>
                  <span className="text-slate-400 font-normal">?</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setSearchQuery(didYouMean.suggestedText);
                handleValidateAndBuildPhrase(didYouMean.suggestedText);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer shrink-0"
            >
              <span>Aplicar Sugestão</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Step-by-Step Sentence Validation Report Card */}
        {validationReport && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col gap-4 rounded-2xl p-5 border-2 shadow-md transition-all ${
              validationReport.success
                ? 'bg-emerald-50/90 border-emerald-300 text-slate-800'
                : 'bg-rose-50/90 border-rose-300 text-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    validationReport.success
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {validationReport.success ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Validação Passo a Passo
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        validationReport.success
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {validationReport.success
                        ? `${validationReport.steps.length} / ${validationReport.steps.length} Válidas`
                        : `Interrompido na Palavra ${validationReport.stoppedAtIndex! + 1}`}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {validationReport.success
                      ? 'Frase montada e validada com sucesso!'
                      : (validationReport.contextualGrammarTip?.title || validationReport.errorReason)}
                  </h3>

                  {!validationReport.success && !validationReport.contextualGrammarTip && validationReport.steps[validationReport.stoppedAtIndex!]?.ruleHint && (
                    <p className="text-xs text-rose-900 font-medium mt-1 leading-relaxed">
                      {validationReport.steps[validationReport.stoppedAtIndex!].ruleHint}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setValidationReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-colors cursor-pointer"
                title="Fechar relatório"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Word-by-Word Timeline / Stepper */}
            <div className="border-t border-black/10 pt-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Progresso Palavra por Palavra:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {validationReport.steps.map((step, idx) => {
                  const isSuccess = step.status === 'valid';
                  const isError = step.status === 'invalid_grammar' || step.status === 'unknown_word';
                  const isUnprocessed = step.status === 'unprocessed';

                  return (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                          isSuccess
                            ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950 shadow-sm'
                            : isError
                            ? 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-400/50 shadow-sm'
                            : 'bg-slate-100/80 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400">#{step.position}</span>
                            <span className="font-mono font-bold">{step.word ? step.word.label : step.token}</span>
                          </div>
                          {step.word && (
                            <span className="text-sm font-semibold text-slate-900 leading-tight">
                              {step.word.hanzi}
                            </span>
                          )}
                          {step.word && (
                            <span className="text-[10px] text-slate-500 truncate leading-none">
                              {step.word.translation}
                            </span>
                          )}
                        </div>

                        <div className="ml-1 shrink-0">
                          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {isError && <XCircle className="w-4 h-4 text-rose-600" />}
                          {isUnprocessed && <PauseCircle className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {idx < validationReport.steps.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contextual Grammar Help Balloon for Invalid Step */}
            {!validationReport.success && validationReport.contextualGrammarTip && (
              <div className="pt-1">
                <GrammarTipBalloon
                  tip={validationReport.contextualGrammarTip}
                  pointerPosition="top-left"
                  onClose={() => setValidationReport(null)}
                />
              </div>
            )}

            {/* Context action bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3">
              <span className="text-[11px] text-slate-600">
                {validationReport.success ? (
                  <span>A frase foi inserida na área ativa abaixo.</span>
                ) : (
                  <span>
                    A validação foi interrompida no erro. {validationReport.validWords.length > 0 ? 'A sequência válida inicial foi mantida.' : ''}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {!validationReport.success && validationReport.suggestion && validationReport.suggestion.hasCorrections && (
                  <button
                    onClick={() => {
                      setSearchQuery(validationReport.suggestion!.suggestedText);
                      handleValidateAndBuildPhrase(validationReport.suggestion!.suggestedText);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Corrigir e Montar</span>
                  </button>
                )}
                <button
                  onClick={() => setValidationReport(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-all cursor-pointer"
                >
                  Fechar Aviso
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Word Palette Board (Available words right below search bar) */}
        {filteredWords.length > 0 && (
          <div className="flex flex-col gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-slate-600 font-semibold">
                <PlusSquare className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Palavras Disponíveis</span>
                {sequence.length > 0 && activeInsertIndex < sequence.length && (
                  <span className="text-[11px] bg-indigo-100/80 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                    Inserir entre "{sequence[activeInsertIndex - 1]?.label || 'início'}" e "{sequence[activeInsertIndex]?.label || 'fim'}"
                  </span>
                )}
              </div>
              {searchQuery && unavailableMatchingWords.length > 0 && (
                <span className="text-[11px] text-amber-700 font-medium bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-lg">
                  {unavailableMatchingWords.length} indisponível(is) pela ordem gramatical
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[260px] overflow-y-auto pr-1">
              {filteredWords.map(word => {
                const Icon = word.icon;
                const clickable = isWordClickable(word);
                return (
                  <button
                    key={word.id}
                    onClick={() => {
                      if (clickable) {
                        addWord(word);
                      } else {
                        const candidate = [
                          ...sequence.slice(0, activeInsertIndex),
                          word,
                          ...sequence.slice(activeInsertIndex)
                        ];
                        const res = validateWordSequence(candidate);
                        if (res.errorTip) {
                          setActiveGrammarTip(res.errorTip);
                        } else {
                          const tip = generateGrammarOrderTip(sequence.slice(0, activeInsertIndex), word);
                          setActiveGrammarTip(tip);
                        }
                      }
                    }}
                    title={clickable ? 'Clique para inserir na frase' : 'Ordem gramatical inválida: clique para ver a dica de gramática'}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                      clickable 
                        ? `${getCategoryBg(word.category)} border-slate-200/80 text-slate-700 hover:scale-[102%] hover:shadow-md active:scale-95 cursor-pointer` 
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-amber-300 hover:bg-amber-50/40 opacity-70 cursor-pointer'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl ${clickable ? 'bg-white shadow-sm text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">{word.label}</span>
                      <span className="font-semibold text-sm truncate mt-0.5">{word.hanzi}</span>
                      <span className="text-[10px] text-slate-400 truncate leading-none mt-0.5">{word.translation}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback when search finds existing words that cannot be inserted at current grammar stage */}
        {searchQuery.trim() !== '' && filteredWords.length === 0 && matchingDictionaryWords.length > 0 && (
          <div className="flex flex-col gap-3.5 bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-5 shadow-sm text-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-amber-950">
                  A palavra existe, mas não pode ser inserida porque não está na ordem correta para formar uma frase.
                </p>
                <p className="text-xs text-amber-800/80 mt-1">
                  A estrutura gramatical do mandarim exige uma sequência ordenada (ex: Sujeito + Verbo + Objeto, ou Sujeito + Adjetivo). Siga a sequência gramatical para poder utilizá-la.
                </p>
              </div>
            </div>

            <div className="border-t border-amber-200/70 pt-3 flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Palavra(s) encontrada(s) no vocabulário:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {matchingDictionaryWords.map(word => {
                  const Icon = word.icon;
                  return (
                    <button
                      key={word.id}
                      type="button"
                      onClick={() => {
                        const candidate = [
                          ...sequence.slice(0, activeInsertIndex),
                          word,
                          ...sequence.slice(activeInsertIndex)
                        ];
                        const res = validateWordSequence(candidate);
                        if (res.errorTip) {
                          setActiveGrammarTip(res.errorTip);
                        } else {
                          const tip = generateGrammarOrderTip(sequence.slice(0, activeInsertIndex), word);
                          setActiveGrammarTip(tip);
                        }
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-amber-200 bg-white/90 hover:bg-amber-100/70 hover:border-amber-300 text-left transition-all cursor-pointer shadow-xs"
                      title="Clique para ver por que esta palavra não pode entrar nesta posição"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-amber-700 font-bold leading-none">{word.label}</span>
                        <span className="font-semibold text-sm truncate mt-0.5 text-slate-800">{word.hanzi}</span>
                        <span className="text-[10px] text-slate-500 truncate leading-none mt-0.5">{word.translation}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Feedback when searched word does not exist in vocabulary at all */}
        {searchQuery.trim() !== '' && filteredWords.length === 0 && matchingDictionaryWords.length === 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col items-center justify-center gap-1.5">
              <HelpCircle className="w-6 h-6 text-slate-400 mb-0.5" />
              <p className="text-sm font-medium text-slate-700">Nenhuma palavra encontrada para "{searchQuery}"</p>
              <p className="text-xs text-slate-400">Verifique a ortografia do pinyin, ideograma ou tradução em português.</p>
            </div>

            {didYouMean && didYouMean.suggestedWords.length > 0 && (
              <div className="w-full border-t border-slate-200/80 pt-3.5 flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Palavras aproximadas sugeridas:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {didYouMean.suggestedWords.map(word => {
                    const Icon = word.icon;
                    const clickable = isWordClickable(word);
                    return (
                      <button
                        key={word.id}
                        onClick={() => clickable && addWord(word)}
                        disabled={!clickable}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                          clickable
                            ? `${getCategoryBg(word.category)} border-indigo-200 text-slate-700 hover:scale-[102%] hover:shadow-md active:scale-95 cursor-pointer`
                            : 'bg-white/70 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                        }`}
                        title={clickable ? 'Clique para adicionar à frase' : 'Indisponível na posição gramatical atual'}
                      >
                        <div className={`p-1.5 rounded-lg ${clickable ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-600 font-bold leading-none">{word.label}</span>
                          <span className="font-semibold text-sm truncate mt-0.5 text-slate-900">{word.hanzi}</span>
                          <span className="text-[10px] text-slate-500 truncate leading-none mt-0.5">{word.translation}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Sequence Board */}
        <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100/80 min-h-[140px] flex flex-col justify-between relative overflow-hidden group">
          {sequence.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-indigo-400/60 mb-2 animate-pulse" />
              <p className="text-sm font-medium">Toque nas palavras acima para construir uma frase</p>
              <p className="text-xs text-slate-400/80 mt-1">A gramática mandarim será validada em tempo real</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Insertion Point Context Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${activeInsertIndex < sequence.length ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">
                      {activeInsertIndex === sequence.length ? (
                        <span>Ponto de inserção: <strong>final da frase</strong> (posição {sequence.length + 1})</span>
                      ) : (
                        <span className="text-indigo-700 font-bold">
                          Inserindo na posição {activeInsertIndex + 1}: entre "{sequence[activeInsertIndex - 1]?.label || 'início'}" e "{sequence[activeInsertIndex]?.label || 'fim'}"
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {activeInsertIndex === sequence.length
                        ? 'Clique nos botões "+" entre as palavras para inserir termos no meio da frase.'
                        : 'As palavras disponíveis acima foram filtradas para respeitar a gramática neste ponto.'}
                    </span>
                  </div>
                </div>

                {activeInsertIndex < sequence.length && (
                  <button
                    type="button"
                    onClick={() => setInsertIndex(sequence.length)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors cursor-pointer"
                    title="Mudar ponto de inserção para o final da frase"
                  >
                    <span>Ir para o final</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Words Sequence with Interleaved Insertion Slots */}
              <div className="flex flex-wrap gap-1.5 items-center py-1">
                <AnimatePresence mode="popLayout">
                  {/* Insertion Slot 0 (Start) */}
                  <div key="slot-0" className="flex items-center">
                    {activeInsertIndex === 0 ? (
                      <motion.button
                        type="button"
                        layout
                        onClick={() => setInsertIndex(0)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shadow-sm ring-2 ring-indigo-300 transition-all cursor-pointer z-10 shrink-0"
                        title="Inserindo no início da frase"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Inserir no início</span>
                      </motion.button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setInsertIndex(0)}
                        className="group/slot flex items-center justify-center w-5 h-8 rounded-md text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-dashed border-transparent hover:border-indigo-300 transition-all cursor-pointer shrink-0"
                        title="Clique para inserir no início da frase"
                      >
                        <Plus className="w-3.5 h-3.5 opacity-40 group-hover/slot:opacity-100" />
                      </button>
                    )}
                  </div>

                  {sequence.map((word, idx) => {
                    const isNextActive = activeInsertIndex === idx + 1;
                    return (
                      <React.Fragment key={`${word.id}-${idx}`}>
                        {/* Word Tile */}
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -15 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs cursor-pointer select-none transition-all ${getCategoryBg(word.category)} hover:shadow-md hover:scale-[102%]`}
                          onClick={() => setInsertIndex(idx + 1)}
                          title={`Palavra #${idx + 1}: ${word.label} (${word.translation}). Clique para posicionar o cursor após esta palavra.`}
                        >
                          <span className="font-mono text-[10px] text-slate-400 font-semibold">{word.label}</span>
                          <span className="font-semibold text-sm">{word.hanzi}</span>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWordAt(idx);
                            }}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors ml-0.5"
                            title={`Remover "${word.label}" da frase`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>

                        {/* Insertion Slot after word */}
                        <div key={`slot-${idx + 1}`} className="flex items-center">
                          {isNextActive ? (
                            <motion.button
                              type="button"
                              layout
                              onClick={() => setInsertIndex(idx + 1)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shadow-sm ring-2 ring-indigo-300 transition-all cursor-pointer z-10 shrink-0"
                              title={idx + 1 === sequence.length ? "Inserindo no final da frase" : `Inserindo entre "${word.label}" e "${sequence[idx + 1]?.label}"`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>{idx + 1 === sequence.length ? 'Inserir no final' : 'Inserir aqui'}</span>
                            </motion.button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setInsertIndex(idx + 1)}
                              className="group/slot flex items-center justify-center w-5 h-8 rounded-md text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-dashed border-transparent hover:border-indigo-300 transition-all cursor-pointer shrink-0"
                              title={idx + 1 === sequence.length ? "Clique para inserir no final da frase" : `Clique para inserir entre "${word.label}" e "${sequence[idx + 1]?.label}"`}
                            >
                              <Plus className="w-3.5 h-3.5 opacity-40 group-hover/slot:opacity-100" />
                            </button>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Contextual Grammar Help Balloon */}
          <AnimatePresence>
            {activeGrammarTip && (
              <div className="pt-3 border-t border-slate-200/80 mt-3">
                <GrammarTipBalloon
                  tip={activeGrammarTip}
                  pointerPosition="top-left"
                  onClose={() => setActiveGrammarTip(null)}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Live Validation Indicator */}
          {sequence.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100/80 pt-4 mt-4">
              <div className="flex items-center gap-2">
                {isValidSentence ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Gramática Correta
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 animate-pulse">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Frase Incompleta
                  </div>
                )}
              </div>

              <button 
                onClick={clearSequence}
                className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
                title="Limpar frase"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Translation Panel */}
        {sequence.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100/60 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-indigo-700">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-sans">Tradução</span>
              </div>
              
              <a
                href={`https://translate.google.com/?sl=zh-CN&tl=pt&text=${encodeURIComponent(sequence.map(w => w.hanzi).join(''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer font-sans"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir no Google Tradutor
              </a>
            </div>

            <div className="bg-white/80 rounded-xl p-4 border border-indigo-100/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Frase Gerada (Mandarim)</span>
                  <span className="text-xl font-semibold text-slate-800 leading-normal">
                    {sequence.map(w => w.hanzi).join('')}
                  </span>
                </div>
                <button
                  onClick={() => speakMandarin(sequence.map(w => w.hanzi).join(''))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-bold transition-all cursor-pointer"
                  title="Ouvir pronúncia da frase em mandarim"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Ouvir</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Pronúncia (Pinyin)</span>
                  <span className="font-mono text-xs text-indigo-600 font-semibold bg-indigo-50/50 px-2 py-1 rounded-lg inline-block">
                    {sequence.map(w => w.label).join(' ')}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Tradução Natural</span>
                  <span className="text-xs text-indigo-900 font-semibold bg-white px-2 py-1 rounded-lg border border-indigo-100 inline-block">
                    {getNaturalTranslation(sequence)}
                  </span>
                </div>
                
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-1">Tradução Literal</span>
                  <span className="text-xs text-slate-600 font-medium italic block py-1">
                    {sequence.map(w => w.translation).join(' ')}
                  </span>
                </div>
              </div>

              {/* Quick actions for newly added modes */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('pronunciation')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                  title="Praticar e testar a pronúncia desta frase no microfone"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Testar no Microfone</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  title="Enviar esta frase no bate-papo da comunidade"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Mandar no Bate-papo</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium italic">
              * Clique no botão "Ouvir" para escutar com a síntese de voz nativa ou use o Google Tradutor para mais detalhes.
            </p>
          </div>
        )}

        {/* Grammar Help Panel */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80 text-xs text-slate-500 flex flex-col gap-1.5">
          <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Dicas Rápidas de Gramática & Expressões:</span>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong className="text-indigo-600">Cumprimentos em Mandarim:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 mt-1.5 font-sans">
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">nǐ hǎo (你好)</strong>: Olá</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">nǐ hǎo ma? (你好吗？)</strong>: Como vai você?</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">wǒ hěn hǎo (我很好)</strong>: Estou muito bem</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">zǎoshang hǎo (早上好)</strong>: Bom dia</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">dàjiā hǎo (大家好)</strong>: Olá a todos!</div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/70"><strong className="text-indigo-700 font-mono text-[11px]">zài jiàn (再见)</strong>: Tchau / Até logo</div>
              </div>
            </li>
            <li><strong className="text-indigo-600">Posição do "ye" (也 - também):</strong> Em mandarim, <strong className="text-indigo-600">yě (也)</strong> é um advérbio e deve vir <strong>SEMPRE antes do verbo ou adjetivo</strong> (<em className="text-slate-600">Sujeito + 也 + Verbo/Adjetivo + Objeto</em>). Exemplo correto: <strong className="font-mono text-[11px] text-indigo-700">wǒ yě xǐhuan kāfēi (我也喜欢咖啡)</strong> = <em>Eu também gosto de café</em>, ou <strong className="font-mono text-[11px] text-indigo-700">wǒ yě hěn hǎo (我也很好)</strong> = <em>Eu também estou muito bem</em>. <strong>Nunca</strong> coloque <em>ye</em> no final da frase (ao contrário do português "eu gosto de café também" ou do inglês "too").</li>
            <li><strong className="text-indigo-600">Saudações e Qualidade ("hao"):</strong> A palavra <strong className="text-indigo-600">hǎo (好)</strong> significa "bom / bem" e forma cumprimentos e respostas como <strong className="font-mono text-[11px] text-indigo-700">nín hǎo (您好)</strong> = olá formal, <strong className="font-mono text-[11px] text-indigo-700">lǎoshī hǎo (老师好)</strong> = olá professor, <strong className="font-mono text-[11px] text-indigo-700">hěn hǎo (很好)</strong> = muito bem, <strong className="font-mono text-[11px] text-indigo-700">bù hǎo (不好)</strong> = não está bem/ruim, <strong className="font-mono text-[11px] text-indigo-700">hǎo de (好的)</strong> = ok/certo, e perguntas como <strong className="font-mono text-[11px] text-indigo-700">hǎo bù hǎo? (好不好？)</strong> = que tal / está de acordo?.</li>
            <li><strong className="text-indigo-600">Perguntar "Como é / Como está?" ("zenmeyang"):</strong> Use <strong className="text-indigo-600">zěnmeyàng (怎么样)</strong> após um tópico ou sujeito para perguntar sobre a qualidade, estado ou opinião a respeito de países, comidas, bebidas, trabalho ou pessoas (ex: <strong className="font-mono text-[11px] text-indigo-700">baxi zenmeyang?</strong> = como é o Brasil?, <strong className="font-mono text-[11px] text-indigo-700">kafei zenmeyang?</strong> = como está o café?, <strong className="font-mono text-[11px] text-indigo-700">cha zenmeyang?</strong> = como está o chá?, <strong className="font-mono text-[11px] text-indigo-700">gongzuo zenmeyang?</strong> = como está o trabalho?, <strong className="font-mono text-[11px] text-indigo-700">zhe ge zenmeyang?</strong> = que tal este?).</li>
            <li><strong className="text-indigo-600">Perguntar Preço ("duo shao qian"):</strong> Use <strong className="text-indigo-600">duōshao qián (多少钱)</strong> para perguntar o valor ou preço de itens ou demonstrativos (ex: <strong className="font-mono text-[11px] text-indigo-700">zhe ge duo shao qian?</strong> = quanto custa isto?, <strong className="font-mono text-[11px] text-indigo-700">kafei duo shao qian?</strong> = quanto custa o café?, <strong className="font-mono text-[11px] text-indigo-700">duo shao qian?</strong> = quanto custa?).</li>
            <li><strong className="text-indigo-600">Expressão "Um Pouco" ("yidian"):</strong> Use <strong className="text-indigo-600">yìdiǎn (一点)</strong> para expressar pequenas quantidades após verbos de ação ou antes de substantivos e adjetivos (ex: <strong className="font-mono text-[11px] text-indigo-700">wo hui shuo yidian Hanyu</strong> = eu falo um pouco de mandarim, <strong className="font-mono text-[11px] text-indigo-700">he yidian shui</strong> = beber um pouco d'água, <strong className="font-mono text-[11px] text-indigo-700">wo you yidian mang</strong> = estou um pouco ocupado).</li>
            <li><strong className="text-indigo-600">Poder/Capacidade ("keyi" vs "hui"):</strong> Use <strong className="text-indigo-600">keyi (可以)</strong> para <em>permissão, autorização ou possibilidade</em> (ex: <strong className="font-mono text-[11px] text-indigo-700">ni keyi shuo</strong> = você pode falar / tem permissão, <strong className="font-mono text-[11px] text-indigo-700">wo keyi jin ma?</strong> = posso entrar?). Use <strong className="text-indigo-600">hui (会)</strong> para <em>capacidade adquirida ou habilidade aprendida</em> através de estudo/treino (ex: <strong className="font-mono text-[11px] text-indigo-700">wo hui shuo Hanyu</strong> = eu sei/posso falar mandarim, <strong className="font-mono text-[11px] text-indigo-700">ni hui shuo Hanyu ma?</strong> = você sabe falar mandarim?).</li>
            <li><strong className="text-indigo-600">Negação ("bu" vs "mei"):</strong> Use <strong className="text-indigo-600">bu (不)</strong> para presente/futuro e com o verbo <em>shi</em> (<strong className="font-mono text-[11px] text-indigo-700">bu shi</strong>). Para o verbo <strong className="text-indigo-600">you (有 - ter/haver)</strong> e ações no passado, use sempre <strong className="text-indigo-600">mei (没)</strong> (ex: <strong className="font-mono text-[11px] text-indigo-700">wo mei you gongzuo</strong> = eu não tenho emprego, <strong className="font-mono text-[11px] text-indigo-700">wo mei shuo</strong> = eu não falei).</li>
            <li><strong className="text-indigo-600">Família & Posse:</strong> Membros da família e <strong className="text-indigo-600">jia (家 - casa/família)</strong> dispensam o possessivo <em>de</em> (ex: <strong className="font-mono text-[11px] text-indigo-700">wo jia</strong> = minha família/casa, <strong className="font-mono text-[11px] text-indigo-700">wo baba</strong> = meu pai).</li>
            <li><strong className="text-indigo-600">Membros da Família:</strong> Usa-se o classificador figurativo <strong className="text-indigo-600">kou (口 - bocas/membros)</strong> para contar pessoas na família (ex: <strong className="font-mono text-[11px] text-indigo-700">wo jia you si kou ren</strong> = minha família tem 4 pessoas).</li>
            <li><strong className="text-indigo-600">Perguntas de Quantidade:</strong> Use <strong className="text-indigo-600">ji (几)</strong> para perguntar quantidades (ex: <strong className="font-mono text-[11px] text-indigo-700">ni jia you ji kou ren?</strong> = quantas pessoas tem na sua família?).</li>
            <li><strong className="text-indigo-600">Quantidade vs Dígito:</strong> Use <strong className="text-indigo-600">liang (两)</strong> para quantidades de coisas/pessoas (ex: <strong className="font-mono text-[11px] text-indigo-700">wo you liang didi</strong> = tenho 2 irmãos mais novos) e <strong className="text-indigo-600">er (二)</strong> para dígitos.</li>
            <li><strong className="text-indigo-600">Perguntas de Sim/Não:</strong> Adicione a partícula <strong className="text-indigo-600">ma (吗)</strong> ao final da frase.</li>
            <li><strong className="text-indigo-600">Preposição gei:</strong> <strong className="text-indigo-600">gei (给 - para...)</strong> é colocada antes do destinatário e do verbo (ex: <strong className="font-mono text-[11px] text-indigo-700">wo gei ni da dianhua</strong>).</li>
            <li><strong className="text-indigo-600">Dizendo e Perguntando a Idade ("sui" & "duoda"):</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1.5 font-sans">
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70">
                  <strong className="text-indigo-700 font-mono text-[11px] block">wǒ nǚ'ér liǎng suì (我女儿两岁)</strong>
                  <span className="text-slate-600 text-[11px]">Minha filha tem 2 anos de idade (use <em className="text-indigo-600 font-semibold">suì 岁</em> para idade e <em className="text-indigo-600 font-semibold">liǎng 两</em> para 2).</span>
                </div>
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70">
                  <strong className="text-indigo-700 font-mono text-[11px] block">nǐ shì duōdà? / nǐ duōdà? (你是多大？)</strong>
                  <span className="text-slate-600 text-[11px]">Quantos anos você tem? / Qual a sua idade? (use <em className="text-indigo-600 font-semibold">duōdà 多大</em> para perguntar idade de adultos e jovens).</span>
                </div>
              </div>
            </li>
            <li><strong className="text-indigo-600">Perguntando a Cidade / Região de Origem ("difang"):</strong>
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70 mt-1.5">
                <strong className="text-indigo-700 font-mono text-[11px] block">nǐ shì shénme dìfang rén? (你是什​​么地方人？)</strong>
                <span className="text-slate-600 text-[11px]">De qual lugar (cidade, região, estado ou bairro) você é? (<em className="text-indigo-600 font-semibold">dìfang 地方</em> = lugar/região).</span>
              </div>
            </li>
            <li><strong className="text-indigo-600">Convidar, Propor e Compartilhar Impressões (Partícula "ba" - 吧):</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1.5 font-sans">
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70">
                  <strong className="text-indigo-700 font-mono text-[11px] block">wǒmen qù chāoshì ba (我们去超市吧)</strong>
                  <span className="text-slate-600 text-[11px]"><strong>Convite / Sugestão ("Let's..."):</strong> "Vamos ao supermercado!" (<em className="text-indigo-600 font-semibold">chāoshì 超市</em> = supermercado).</span>
                </div>
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70">
                  <strong className="text-indigo-700 font-mono text-[11px] block">wǒ de māo hěn kě'ài ba (我的猫很可爱吧)</strong>
                  <span className="text-slate-600 text-[11px]"><strong>Impressão compartilhada ("não é mesmo? / né?"):</strong> "Meu gato não é uma gracinha?" (<em className="text-indigo-600 font-semibold">kě'ài 可爱</em> = fofo/gracinha).</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        </>
        )}

        {/* Global Searchable Visual Dictionary Modal */}
        <DictionaryModal
          isOpen={isDictionaryOpen}
          onClose={() => setIsDictionaryOpen(false)}
          words={WORDS}
          onSelectWord={(w) => {
            addWord(w);
            setIsDictionaryOpen(false);
          }}
          availableWordIds={availableWords.map(w => w.id)}
        />
      </div>
    </div>
  );
}
