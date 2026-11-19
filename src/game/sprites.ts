// Crisp pixel-art matrices baked once to offscreen canvases

type PaletteMap = Record<string, string>;

const SPRITE_PALETTE: PaletteMap = {
  '.': '',
  K: '#1a1116', // Deep dark pixel outline
  W: '#f7f3e8', // Cream white & eye catchlight
  S: '#d8d0ba', // Cream shadow
  R: '#ff3d36', // Red jacket
  D: '#b5221c', // Dark red jacket shade
  G: '#ffd147', // Gold 4-point star, halo & horn wrap
  A: '#d48b17', // Amber gold shadow
  M: '#38e59b', // Mint
  B: '#56c2ff', // Glass / cyan highlight
  C: '#9ad9ff', // Clear glass rim
  H: '#2a2e45', // Dark shoe/skirt trim
  F: '#ffe5d9', // Chibi skin tone
  P: '#f7dc88', // Honey-blond hair matching reference
  O: '#d8ab46', // Warm blond hair shade
  Z: '#4f2518', // Deep chestnut-brown upper iris & dark horn
  X: '#b85a32', // Warm caramel-amber lower iris & horn highlight
  Q: '#f4b5b8', // Soft rosy cheek blush
  U: '#7c3229', // Smug :3 / w cat-smile
  J: '#6b3e26', // Rich chocolate milk
  L: '#8f5638', // Chocolate milk highlight
  T: '#d99b52', // Golden donut dough
  E: '#a66b2b', // Donut shadow
  I: '#ff77a8', // Pink donut glaze
  N: '#ff4788', // Deep pink glaze shade
  Y: '#ff9636', // Heat spark orange
  V: '#b066ff', // Tangled thread purple
};

// Reworked Yuu-chan Mascot (22x26) matching oc6_dcf59cc2.png reference:
// Split 3-diamond halo, gold-wrapped dark brown horns, blond ahoge & side tufts,
// big round black doe eyes with white catchlights, :3 smile, red jacket.
const YUU_FRAME_1 = [
  '..........KK..........',
  '.......KKKGGKKK.......',
  '.KK...KGGKGGKGGK...KK.',
  '.KZK.KGG.KKKK.GGK.KZK.',
  'KKZKKGG...KK...GGKKZKK',
  'KZZKGG..KKPPKK..GGKZZK',
  'KGZKK.KKPPPPPPKK.KKZGK',
  'KGGK.KPPPPPPPPPPK.KGGK',
  'KZZKKPPPPPOOPPPPPKKZZK',
  '.KKKPPPOPPPPPPOPPPKKK.',
  'KPPPPPPPFPPPPFPPPPPPPK',
  '.KPPPFKWKKFFKWKKFPPPK.',
  '.KPPPFKKKKFFKKKKFPPPK.',
  '.KPOFFFKKFFFFKKFFOPPK.',
  '..KPOFQQUFUUFUQQFOPK..',
  '..KPKKFFFFFFFFFFKKPK..',
  '..KPKRRRRWWWWRRRRKPK..',
  '.KPKRRRRRWWWWRRRRRKPK.',
  '.KPKRRRRKWWWWKRRRRKPK.',
  '..KKDDDDKKKKKKDDDDKK..',
  '.....KHHHHHHHHHHK.....',
  '.....KHHHKKKKHHHK.....',
  '......KWWK..KWWK......',
  '......KHHK..KRRK......',
  '......KKKK..KHHK......',
  '............KKKK......',
];

const YUU_FRAME_2 = [
  '..........KK..........',
  '.......KKKGGKKK.......',
  '.KK...KGGKGGKGGK...KK.',
  '.KZK.KGG.KKKK.GGK.KZK.',
  'KKZKKGG...KK...GGKKZKK',
  'KZZKGG..KKPPKK..GGKZZK',
  'KGZKK.KKPPPPPPKK.KKZGK',
  'KGGK.KPPPPPPPPPPK.KGGK',
  'KZZKKPPPPPOOPPPPPKKZZK',
  '.KKKPPPOPPPPPPOPPPKKK.',
  'KPPPPPPPFPPPPFPPPPPPPK',
  '.KPPPFKWKKFFKWKKFPPPK.',
  '.KPPPFKKKKFFKKKKFPPPK.',
  '.KPOFFFKKFFFFKKFFOPPK.',
  '..KPOFQQUFUUFUQQFOPK..',
  '..KPKKFFFFFFFFFFKKPK..',
  '..KPKRRRRWWWWRRRRKPK..',
  '.KPKRRRRRWWWWRRRRRKPK.',
  '.KPKRRRRKWWWWKRRRRKPK.',
  '..KKDDDDKKKKKKDDDDKK..',
  '.....KHHHHHHHHHHK.....',
  '.....KHHHKKKKHHHK.....',
  '......KWWK..KWWK......',
  '......KRRK..KHHK......',
  '......KHHK..KKKK......',
  '......KKKK............',
];

// Folded Screenprinted Tee (12x12)
const TEE_SPRITE = [
  '............',
  '..KKK..KKK..',
  '.KWWKKKKWWK.',
  'KWWWWWWWWWWK',
  'KWWWSRRWSWWK',
  'KWWWRRRRWWWK',
  '.KKWWWWWWKK.',
  '..KWWWWWWK..',
  '..KWWSSWWK..',
  '..KWWWWWWK..',
  '..KSSSSSSK..',
  '..KKKKKKKK..',
];

// Glass of Chocolate Milk (12x12)
const MILK_SPRITE = [
  '.......KK...',
  '......KRRK..',
  '..KKKKKWKK..',
  '.KCCCCCCCCK.',
  '.KCLLLLLLCK.',
  '.KCJJJJJJCK.',
  '.KCJJLLJJCK.',
  '.KCJJJJJJCK.',
  '.KCJJJJJJCK.',
  '..KCJJJJCK..',
  '..KCCCCCCK..',
  '..KKKKKKKK..',
];

// Pink Glazed Donut with Sprinkles (12x12)
const DONUT_SPRITE = [
  '............',
  '...KKKKKK...',
  '..KIIIIIIK..',
  '.KIIWIIIGIK.',
  'KIIIBKKIIIIN',
  'KIIIKTTKIIIN',
  'KTTNKKKKNTTT',
  'KTTTTNNTTTTK',
  '.KTTTTTTTTK.',
  '..KTEEEETK..',
  '...KKKKKK...',
  '............',
];

// AMAZING Pickup: Golden 4-Point Star (14x14)
const STAR_SPRITE = [
  '......KK......',
  '.....KGGK.....',
  '.....KWGK.....',
  '....KGWGGK....',
  '...KGGWWGGK...',
  '.KKGGWWWWGGKK.',
  'KGGWWWWWWWWGGK',
  'KAAWWWWWWWWAAK',
  '.KKAAWWWWAAKK.',
  '...KAAWWAAK...',
  '....KAAGAK....',
  '.....KAGK.....',
  '.....KAAK.....',
  '......KK......',
];

// OBVIOUS BAD Pickup #1: Red-X Hazard Crate (12x12)
const CRATE_SPRITE = [
  'KKKKKKKKKKKK',
  'KRRRRRRRRRRK',
  'KRRTTTTTTRRK',
  'KRTKRRRTKTRK',
  'KRTTKRRTKTRK',
  'KRTTTKKTTTRK',
  'KRTTTKKTTTRK',
  'KRTTKRRTKTRK',
  'KRTKRRRTKTRK',
  'KRREEEEEERRK',
  'KRRRRRRRRRRK',
  'KKKKKKKKKKKK',
];

// OBVIOUS BAD Pickup #2: Red-Hot Rogue Heat-Press (12x12)
const HEATPRESS_SPRITE = [
  '....KKKK....',
  '...KRRRRK...',
  '..KRRRRRRK..',
  '.KKKKKKKKKK.',
  'KRRRRRRRRRRK',
  'KHHHHHHHHHHK',
  'KYYYYYYYYYYK',
  'KRRRRYYRRRRK',
  'KKKKKKKKKKKK',
  '.KR.KY.KY.K.',
  '............',
  '............',
];

// OBVIOUS BAD Pickup #3: Spiky Crimson/Purple Tangled Thread Bomb (12x12)
const SPOOL_SPRITE = [
  '..KK....KK..',
  '.KRRK..KRRK.',
  '..KKKKKKKK..',
  '.KVVRRRRVVK.',
  'KVVRRKKRRVVK',
  'KVVRRRRRRVVK',
  'KVVRVVVVVRVK',
  '.KVVRRRRVVK.',
  '..KKKKKKKK..',
  '.KRRK..KRRK.',
  '..KK....KK.',
  '............',
];

export type SpriteKey =
  | 'yuu1'
  | 'yuu2'
  | 'tee'
  | 'milk'
  | 'donut'
  | 'star'
  | 'crate'
  | 'heatpress'
  | 'spool';

const SPRITE_DEFS: Record<SpriteKey, string[]> = {
  yuu1: YUU_FRAME_1,
  yuu2: YUU_FRAME_2,
  tee: TEE_SPRITE,
  milk: MILK_SPRITE,
  donut: DONUT_SPRITE,
  star: STAR_SPRITE,
  crate: CRATE_SPRITE,
  heatpress: HEATPRESS_SPRITE,
  spool: SPOOL_SPRITE,
};

const spriteCache = new Map<SpriteKey, HTMLCanvasElement>();

export function getPixelSprite(key: SpriteKey): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const cached = spriteCache.get(key);
  if (cached) return cached;

  const grid = SPRITE_DEFS[key];
  const h = grid.length;
  const w = grid[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  for (let y = 0; y < h; y++) {
    const row = grid[y];
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      const color = SPRITE_PALETTE[ch];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  spriteCache.set(key, canvas);
  return canvas;
}
