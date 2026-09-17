import React from 'react';

export type Category = 
  | 'pronoun' 
  | 'plural' 
  | 'adverb' 
  | 'verb' 
  | 'country' 
  | 'suffix' 
  | 'noun' 
  | 'family'
  | 'classifier'
  | 'question' 
  | 'guo' 
  | 'possessive' 
  | 'thing'
  | 'adjective'
  | 'number'
  | 'preposition'
  | 'etiquette'
  | 'conjunction'
  | 'particle';

export type HskLevel = 'HSK 1' | 'HSK 2';

export interface Word {
  id: string;
  label: string;
  hanzi: string;
  translation: string;
  category: Category;
  icon: React.ElementType;
  hskLevel?: HskLevel;
  requiresGuo?: boolean;
}

export interface DidYouMeanPart {
  text: string;
  isChanged: boolean;
  word?: Word | null;
}

export interface DidYouMeanResult {
  hasCorrections: boolean;
  originalQuery?: string;
  suggestedText: string;
  parts: DidYouMeanPart[];
  suggestedWords: Word[];
}

export interface ContextualGrammarTip {
  title: string;
  ruleName: string;
  explanation: string;
  solutionTip: string;
  exampleCorrect?: string;
  exampleIncorrect?: string;
  offendingWord?: Word | null;
  previousWord?: Word | null;
  position?: number;
}

export interface PhraseValidationStep {
  token: string;
  word: Word | null;
  status: 'valid' | 'invalid_grammar' | 'unknown_word' | 'unprocessed';
  errorMessage?: string;
  ruleHint?: string;
  grammarTip?: ContextualGrammarTip | null;
  position: number;
}

export interface PhraseValidationReport {
  rawInput: string;
  steps: PhraseValidationStep[];
  success: boolean;
  stoppedAtIndex: number | null;
  errorReason?: string;
  validWords: Word[];
  isCompleteSentence: boolean;
  suggestion?: DidYouMeanResult | null;
  contextualGrammarTip?: ContextualGrammarTip | null;
}

export type ChallengeCategory = 
  | 'greetings' 
  | 'family_age' 
  | 'origin_location' 
  | 'daily_actions' 
  | 'shopping_prices' 
  | 'invitations_impressions'
  | 'abilities_politeness'
  | 'weather_climate'
  | 'quantities_comparison'
  | 'intentions_feelings'
  | 'causes_reasons';

export interface PracticeChallenge {
  id: string;
  portuguese: string;
  contextHint?: string;
  targetPinyinList: string[]; // List of acceptable pinyin sequences (normalized)
  targetHanzi: string;
  targetHanziList?: string[]; // Optional alternative acceptable Hanzi sequences
  hskLevel: HskLevel;
  category: ChallengeCategory;
  categoryName: string;
  grammarNote: string;
  suggestedFirstWordIds?: string[];
}

export type QuizQuestionType = 'fill_blank' | 'order_words';

export interface QuizOption {
  id: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  isCorrect: boolean;
  explanation?: string;
  grammarTip?: ContextualGrammarTip;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  portuguese: string;
  categoryName: string;
  hskLevel: HskLevel;
  grammarRuleTitle: string;
  grammarExplanation: string;
  // For 'fill_blank'
  prefixHanzi?: string;
  suffixHanzi?: string;
  fullHanzi: string;
  fullPinyin: string;
  blankPinyinHint?: string;
  options?: QuizOption[];
  correctAnswerId?: string;
  // For 'order_words'
  wordsToOrder?: Word[];
  correctSequenceHanzi?: string;
}

export interface QuizStats {
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  currentStreak: number;
  bestStreak: number;
  score: number;
}

export interface DialogueCharacter {
  id: string;
  name: string;
  hanziName: string;
  role: string;
  avatarEmoji: string;
  description: string;
}

export interface DialogueMessage {
  id: string;
  sender: 'character' | 'user';
  characterName?: string;
  hanzi: string;
  pinyin: string;
  portuguese: string;
  timestamp: string;
  feedback?: {
    isSuccess: boolean;
    comment: string;
    ruleTitle?: string;
  };
}

export interface DialogueStep {
  id: string;
  stepNumber: number;
  title: string;
  promptGoal: string; // The challenge/mission for the user
  characterPromptHanzi: string;
  characterPromptPinyin: string;
  characterPromptPortuguese: string;
  characterSpeakerName?: string; // in case character changes (e.g. waiter vs friend)
  expectedKeywords?: string[]; // pinyin or Hanzi
  suggestedAnswers: Array<{
    hanzi: string;
    pinyin: string;
    portuguese: string;
    explanation?: string;
  }>;
  recommendedWords: string[]; // word labels or IDs for quick builder chips
  characterSuccessReplyHanzi: string;
  characterSuccessReplyPinyin: string;
  characterSuccessReplyPortuguese: string;
}

export interface DialogueScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconEmoji: string;
  category: 'restaurant' | 'job_interview' | 'shopping' | 'social';
  difficulty: 'Iniciante (HSK 1)' | 'Intermediário (HSK 1-2)';
  character: DialogueCharacter;
  secondaryCharacter?: DialogueCharacter;
  steps: DialogueStep[];
}

// Types for Bate-papo (Community Chat)
export interface ChatPhraseData {
  hanzi: string;
  pinyin: string;
  portuguese: string;
  words?: Word[];
  isValidGrammar: boolean;
  grammarNotes?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  roomId: string;
  timestamp: string;
  phrase: ChatPhraseData;
  textMessage?: string;
  likes?: number;
}

// Types for Pronunciation Test
export interface PronunciationWordMatch {
  word: Word;
  matchedText: string;
  isRecognized: boolean;
  pinyin: string;
}

export interface PronunciationEvaluation {
  rawTranscript: string;
  recognizedWords: PronunciationWordMatch[];
  unknownTokens: string[];
  isValidGrammar: boolean;
  grammarDiagnostic: {
    title: string;
    description: string;
    orderFollowed: boolean;
    missingElements?: string[];
  };
  score: number; // 0 to 100
  fluencyFeedback: string;
  targetComparison?: {
    targetHanzi: string;
    targetPinyin: string;
    isExactMatch: boolean;
    accuracyPercent: number;
  };
}

// Types for Hanzi Practice Canvas
export interface HanziStrokeStep {
  strokeNumber: number;
  name: string; // e.g. "横 (Héng)", "竖 (Shù)"
  type: 'heng' | 'shu' | 'pie' | 'na' | 'dian' | 'ti' | 'zhe' | 'gou';
  description: string;
  directionGuide: string;
}

export interface HanziCharacter {
  id: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  radical: string;
  radicalMeaning: string;
  strokeCount: number;
  hskLevel: HskLevel;
  category: string;
  strokeOrderRule: string; // e.g. "先横后竖，从上到下"
  strokes: HanziStrokeStep[];
  compoundWords?: Array<{
    hanzi: string;
    pinyin: string;
    portuguese: string;
  }>;
}


