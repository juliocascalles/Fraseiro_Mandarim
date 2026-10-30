export interface ColorItem {
  pinyin: string;
  hanzi: string;
  backgroundPosX: number;
  traducao: string;
  traducaoFeminina?: string;
  demanda: number;
}

export interface ClothItem {
  pinyin: string;
  hanzi: string;
  backgroundPosY: number;
  price: number;
  traducao: string;
  palavraFeminina: boolean;
  desconto: number;
}

export const colors: ColorItem[] = [
  {
    pinyin: "lan se",
    hanzi: "蓝色",
    backgroundPosX: 0,
    traducao: "azul",
    demanda: -2
  },
  {
    pinyin: "lu se",
    hanzi: "绿色",
    backgroundPosX: 18,
    traducao: "verde",
    demanda: -5
  },
  {
    pinyin: "huang se",
    hanzi: "黄色",
    backgroundPosX: 35,
    traducao: "amarelo",
    traducaoFeminina: "amarela",
    demanda: 5
  },
  {
    pinyin: "cheng se",
    hanzi: "橙色",
    backgroundPosX: 52,
    traducao: "laranja",
    demanda: 3
  },
  {
    pinyin: "hong se",
    hanzi: "红色",
    backgroundPosX: 69,
    traducao: "vermelho",
    traducaoFeminina: "vermelha",
    demanda: 8
  },
  {
    pinyin: "fen se",
    hanzi: "粉色",
    backgroundPosX: 85,
    traducao: "rosa",
    demanda: 1
  },
  {
    pinyin: "zi se",
    hanzi: "紫色",
    backgroundPosX: 100.5,
    traducao: "roxo",
    traducaoFeminina: "roxa",
    demanda: 0
  }
];

export const clothes: ClothItem[] = [
  {
    pinyin: "wai tao",
    hanzi: "外套",
    backgroundPosY: 0,
    price: 175,
    traducao: "casaco",
    palavraFeminina: false,
    desconto: 25
  },
  {
    pinyin: "duan xiu",
    hanzi: "短袖",
    backgroundPosY: 15,
    price: 33,
    traducao: "camiseta",
    palavraFeminina: true,
    desconto: 5
  },
  {
    pinyin: "bei xin",
    hanzi: "背心",
    backgroundPosY: 30,
    price: 49,
    traducao: "colete",
    palavraFeminina: false,
    desconto: 7
  },
  {
    pinyin: "qun zi",
    hanzi: "裙子",
    backgroundPosY: 44,
    price: 38,
    traducao: "saia",
    palavraFeminina: true,
    desconto: 6
  },
  {
    pinyin: "duan ku",
    hanzi: "短裤",
    backgroundPosY: 59,
    price: 45,
    traducao: "shorts",
    palavraFeminina: false,
    desconto: 7
  },
  {
    pinyin: "lian yi qun",
    hanzi: "连衣裙",
    backgroundPosY: 73,
    price: 120,
    traducao: "vestido",
    palavraFeminina: false,
    desconto: 20
  },
  {
    pinyin: "chenshan",
    hanzi: "衬衫",
    backgroundPosY: 87,
    price: 66,
    traducao: "camisa",
    palavraFeminina: true,
    desconto: 10
  },
  {
    pinyin: "ku zi",
    hanzi: "长裤",
    backgroundPosY: 100,
    price: 74,
    traducao: "calça",
    palavraFeminina: true,
    desconto: 12
  }
];

export function nomeRoupaTraduzida(
  roupa: ClothItem,
  cor: ColorItem
): string {
  const corTraduzida = (roupa.palavraFeminina && cor.traducaoFeminina)
    ? cor.traducaoFeminina
    : cor.traducao;

  return `${roupa.traducao} ${corTraduzida}`;
}

export function nomeRoupaEmChines(
  roupa: ClothItem,
  cor: ColorItem,
  pinyin: boolean
): string {
  if (pinyin) {
    return `${cor.pinyin} de ${roupa.pinyin}`;
  }
  return `${cor.hanzi} 的 ${roupa.hanzi}`;
}

// Alias com acento conforme mencionado na especificação
export const nomeRoupaEmChinês = nomeRoupaEmChines;

/**
 * Calcula o preço final do produto somando o preço base da roupa com a demanda da cor.
 * Ex: Vermelho (+8), Amarelo (+5), Verde (-5), Azul (-2), etc.
 */
export function precoFinal(
  roupa: ClothItem,
  cor: ColorItem
): number {
  return roupa.price + (cor.demanda || 0);
}

/**
 * Calcula o preço com o desconto da peça subtraído após o cliente pechinchar ("tai gui le").
 */
export function precoComDesconto(
  roupa: ClothItem,
  cor: ColorItem
): number {
  const final = precoFinal(roupa, cor);
  const desc = roupa.desconto || 5;
  return Math.max(1, final - desc);
}
