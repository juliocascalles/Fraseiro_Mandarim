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
