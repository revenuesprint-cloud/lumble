// ─── Vedic Astrology Engine ──────────────────────────────────────────────────
// Calculations derived from birth date/time using standard astronomical
// formulae (Jean Meeus, "Astronomical Algorithms"). Planetary positions use
// mean orbital elements from the J2000.0 epoch with Lahiri ayanamsa.

export const RASHIS = [
  { name: "Mesha",      en: "Aries",       symbol: "♈", lord: "Mangal",     element: "Fire",  quality: "Cardinal", color: "#E85C7A" },
  { name: "Vrishabha",  en: "Taurus",      symbol: "♉", lord: "Shukra",     element: "Earth", quality: "Fixed",    color: "#52C8B8" },
  { name: "Mithuna",    en: "Gemini",       symbol: "♊", lord: "Budh",       element: "Air",   quality: "Mutable",  color: "#F5A623" },
  { name: "Karka",      en: "Cancer",       symbol: "♋", lord: "Chandra",    element: "Water", quality: "Cardinal", color: "#7C52C8" },
  { name: "Simha",      en: "Leo",          symbol: "♌", lord: "Surya",      element: "Fire",  quality: "Fixed",    color: "#E85C7A" },
  { name: "Kanya",      en: "Virgo",        symbol: "♍", lord: "Budh",       element: "Earth", quality: "Mutable",  color: "#52C8B8" },
  { name: "Tula",       en: "Libra",        symbol: "♎", lord: "Shukra",     element: "Air",   quality: "Cardinal", color: "#F5A623" },
  { name: "Vrishchika", en: "Scorpio",      symbol: "♏", lord: "Mangal",     element: "Water", quality: "Fixed",    color: "#B855E0" },
  { name: "Dhanu",      en: "Sagittarius",  symbol: "♐", lord: "Brihaspati", element: "Fire",  quality: "Mutable",  color: "#F5A623" },
  { name: "Makara",     en: "Capricorn",    symbol: "♑", lord: "Shani",      element: "Earth", quality: "Cardinal", color: "#7C52C8" },
  { name: "Kumbha",     en: "Aquarius",     symbol: "♒", lord: "Shani",      element: "Air",   quality: "Fixed",    color: "#52C8B8" },
  { name: "Meena",      en: "Pisces",       symbol: "♓", lord: "Brihaspati", element: "Water", quality: "Mutable",  color: "#B855E0" },
];

export const NAKSHATRAS = [
  { name: "Ashwini",       lord: "Ketu",       deity: "Ashwini Kumaras", yoni: "Horse",    gana: "Deva",     symbol: "Horse head" },
  { name: "Bharani",       lord: "Shukra",     deity: "Yama",            yoni: "Elephant", gana: "Manushya", symbol: "Yoni" },
  { name: "Krittika",      lord: "Surya",      deity: "Agni",            yoni: "Sheep",    gana: "Rakshasa", symbol: "Flame" },
  { name: "Rohini",        lord: "Chandra",    deity: "Brahma",          yoni: "Serpent",  gana: "Manushya", symbol: "Cart" },
  { name: "Mrigashira",    lord: "Mangal",     deity: "Soma",            yoni: "Serpent",  gana: "Deva",     symbol: "Deer head" },
  { name: "Ardra",         lord: "Rahu",       deity: "Rudra",           yoni: "Dog",      gana: "Manushya", symbol: "Teardrop" },
  { name: "Punarvasu",     lord: "Brihaspati", deity: "Aditi",           yoni: "Cat",      gana: "Deva",     symbol: "Quiver" },
  { name: "Pushya",        lord: "Shani",      deity: "Brihaspati",      yoni: "Sheep",    gana: "Deva",     symbol: "Flower" },
  { name: "Ashlesha",      lord: "Budh",       deity: "Nagas",           yoni: "Cat",      gana: "Rakshasa", symbol: "Coiled serpent" },
  { name: "Magha",         lord: "Ketu",       deity: "Pitris",          yoni: "Rat",      gana: "Rakshasa", symbol: "Throne" },
  { name: "Purva Phalguni",lord: "Shukra",     deity: "Bhaga",           yoni: "Rat",      gana: "Manushya", symbol: "Hammock" },
  { name: "Uttara Phalguni",lord:"Surya",      deity: "Aryaman",         yoni: "Cow",      gana: "Manushya", symbol: "Bed" },
  { name: "Hasta",         lord: "Chandra",    deity: "Savitar",         yoni: "Buffalo",  gana: "Deva",     symbol: "Palm" },
  { name: "Chitra",        lord: "Mangal",     deity: "Vishwakarma",     yoni: "Tiger",    gana: "Rakshasa", symbol: "Pearl" },
  { name: "Swati",         lord: "Rahu",       deity: "Vayu",            yoni: "Buffalo",  gana: "Deva",     symbol: "Young shoot" },
  { name: "Vishakha",      lord: "Brihaspati", deity: "Indragni",        yoni: "Tiger",    gana: "Rakshasa", symbol: "Triumphal arch" },
  { name: "Anuradha",      lord: "Shani",      deity: "Mitra",           yoni: "Hare",     gana: "Deva",     symbol: "Lotus" },
  { name: "Jyeshtha",      lord: "Budh",       deity: "Indra",           yoni: "Hare",     gana: "Rakshasa", symbol: "Earring" },
  { name: "Mula",          lord: "Ketu",       deity: "Nirriti",         yoni: "Dog",      gana: "Rakshasa", symbol: "Tied roots" },
  { name: "Purva Ashadha", lord: "Shukra",     deity: "Apas",            yoni: "Monkey",   gana: "Manushya", symbol: "Elephant tusk" },
  { name: "Uttara Ashadha",lord: "Surya",      deity: "Vishwedevas",     yoni: "Mongoose", gana: "Manushya", symbol: "Elephant tusk" },
  { name: "Shravana",      lord: "Chandra",    deity: "Vishnu",          yoni: "Monkey",   gana: "Deva",     symbol: "Ear / footstep" },
  { name: "Dhanishtha",    lord: "Mangal",     deity: "Vasus",           yoni: "Lion",     gana: "Rakshasa", symbol: "Drum" },
  { name: "Shatabhisha",   lord: "Rahu",       deity: "Varuna",          yoni: "Horse",    gana: "Rakshasa", symbol: "Circle" },
  { name: "Purva Bhadra",  lord: "Brihaspati", deity: "Aja Ekapad",      yoni: "Lion",     gana: "Manushya", symbol: "Front legs of cot" },
  { name: "Uttara Bhadra", lord: "Shani",      deity: "Ahirbudhnya",     yoni: "Cow",      gana: "Manushya", symbol: "Back legs of cot" },
  { name: "Revati",        lord: "Budh",       deity: "Pushan",          yoni: "Elephant", gana: "Deva",     symbol: "Fish / drum" },
];

// Vimshottari Dasha years — sum = 120
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Shukra: 20, Surya: 6, Chandra: 10,
  Mangal: 7, Rahu: 18, Brihaspati: 16, Shani: 19, Budh: 17,
};
const TOTAL_DASHA_YEARS = 120;

const DASHA_ORDER = ["Ketu","Shukra","Surya","Chandra","Mangal","Rahu","Brihaspati","Shani","Budh"];

export const PLANETS_META: Record<string, { name: string; symbol: string; color: string; en: string }> = {
  Surya:      { name: "Surya",      en: "Sun",     symbol: "☉", color: "#F5A623" },
  Chandra:    { name: "Chandra",    en: "Moon",    symbol: "☽", color: "#C9BFDF" },
  Mangal:     { name: "Mangal",     en: "Mars",    symbol: "♂", color: "#E85C7A" },
  Budh:       { name: "Budh",       en: "Mercury", symbol: "☿", color: "#52C8B8" },
  Brihaspati: { name: "Brihaspati", en: "Jupiter", symbol: "♃", color: "#F5A623" },
  Shukra:     { name: "Shukra",     en: "Venus",   symbol: "♀", color: "#B855E0" },
  Shani:      { name: "Shani",      en: "Saturn",  symbol: "♄", color: "#7C52C8" },
  Rahu:       { name: "Rahu",       en: "N.Node",  symbol: "☊", color: "#F0EBF8" },
  Ketu:       { name: "Ketu",       en: "S.Node",  symbol: "☋", color: "rgba(240,235,248,0.5)" },
};

// ─── Core helpers ─────────────────────────────────────────────────────────────

function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  const A = Math.floor((14 - m) / 12);
  const yy = y + 4800 - A;
  const mm = m + 12 * A - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
    Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function j2000(date: Date): number {
  return toJulianDay(date) - 2451545.0;
}

function norm360(d: number): number {
  return ((d % 360) + 360) % 360;
}

// Lahiri ayanamsa: 23.856° at J2000.0, rate 50.29"/yr = 1.3969°/century
function ayanamsa(T: number): number {
  return 23.856 + 1.3969 * T;
}

// ─── Sun longitude ─────────────────────────────────────────────────────────────

function sunLongitudeSidereal(T: number): number {
  const L0 = norm360(280.46646 + 36000.76983 * T);
  const M  = norm360(357.52911 + 35999.05029 * T) * (Math.PI / 180);
  const C  = (1.914602 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M);
  return norm360(L0 + C - ayanamsa(T));
}

// ─── Moon longitude ────────────────────────────────────────────────────────────

function moonLongitudeSidereal(T: number): number {
  const L  = norm360(218.3165 + 481267.8813 * T);
  const M  = norm360(357.5291 + 35999.0503  * T) * (Math.PI / 180);
  const Mm = norm360(134.9634 + 477198.8676 * T) * (Math.PI / 180);
  const D  = norm360(297.8502 + 445267.1115 * T) * (Math.PI / 180);
  const F  = norm360( 93.2721 + 483202.0175 * T) * (Math.PI / 180);
  const corr =
    6.289 * Math.sin(Mm)
    - 1.274 * Math.sin(2 * D - Mm)
    + 0.658 * Math.sin(2 * D)
    - 0.214 * Math.sin(2 * Mm)
    - 0.186 * Math.sin(M)
    - 0.114 * Math.sin(2 * F);
  return norm360(L + corr - ayanamsa(T));
}

// ─── Ascendant (sidereal) ──────────────────────────────────────────────────────
// Requires birth time for accuracy; defaults to 6 AM local (sunrise proxy)

function ascendantSidereal(T: number, birthHourUTC: number): number {
  // Greenwich Mean Sidereal Time at 0h UT
  const D = j2000FromT(T); // days from J2000
  const GMST = norm360(100.4606184 + 36000.7700536 * T + 0.000387933 * T * T
    + 360.98564724 * (D - Math.floor(D)));
  const LST = norm360(GMST + birthHourUTC * 15); // 15°/hr
  const eps = (23.4393 - 0.013 * T) * (Math.PI / 180);
  const lstR = LST * (Math.PI / 180);
  // Standard ascendant formula (latitude assumed 23° N — South Asia)
  const latR = 23.0 * (Math.PI / 180);
  const asc = Math.atan2(Math.cos(lstR), -(Math.sin(lstR) * Math.cos(eps) + Math.tan(latR) * Math.sin(eps)));
  const tropical = norm360(asc * (180 / Math.PI));
  return norm360(tropical - ayanamsa(T));
}

// Helper: T from j2000 days (inverse)
function j2000FromT(T: number): number {
  return T * 36525;
}

// ─── Planetary mean longitudes (sidereal) ──────────────────────────────────────

function planetaryPositions(T: number): Record<string, number> {
  const ay = ayanamsa(T);
  const sid = (tropical: number) => norm360(tropical - ay);

  // Sun's mean tropical longitude (for elongation calc)
  const sunL = norm360(280.46646 + 36000.76983 * T);

  return {
    Surya:      sid(norm360(280.46646 + 36000.76983 * T)),
    Chandra:    moonLongitudeSidereal(T),
    Mangal:     sid(norm360(355.433  + 19140.300  * T)),
    Budh:       sid(norm360(252.251  + 149472.675 * T)),
    Brihaspati: sid(norm360( 34.351  +  3034.906  * T)),
    Shukra:     sid(norm360(181.979  + 58517.815  * T)),
    Shani:      sid(norm360( 50.078  +  1222.114  * T)),
    // Rahu moves retrograde ~19.34°/century; Ketu = Rahu + 180°
    Rahu:       norm360(norm360(125.045 - 1934.136 * T) - ay),
    Ketu:       norm360(norm360(125.045 - 1934.136 * T) - ay + 180),
    _sunL: sunL, // internal: Sun tropical longitude for retrograde calc
  } as Record<string, number>;
}

// ─── Retrograde detection ──────────────────────────────────────────────────────
// Outer planets: retrograde near opposition to Sun (elongation ≈ 180°).
// Inner planets: retrograde near inferior conjunction (elongation ≈ 0°).
// Rahu/Ketu are always retrograde in Vedic tradition.

function isRetrograde(key: string, T: number, sunMeanLong: number): boolean {
  switch (key) {
    case "Rahu": case "Ketu": return true;
    case "Surya": case "Chandra": return false;
    case "Mangal": {
      const elong = norm360(norm360(355.433 + 19140.300 * T) - sunMeanLong);
      return elong > 128 && elong < 232; // retrograde ~2 months around opposition
    }
    case "Budh": {
      const elong = norm360(norm360(252.251 + 149472.675 * T) - sunMeanLong);
      return elong < 22 || elong > 338; // retrograde ~3 weeks near inferior conj.
    }
    case "Brihaspati": {
      const elong = norm360(norm360(34.351 + 3034.906 * T) - sunMeanLong);
      return elong > 115 && elong < 245;
    }
    case "Shukra": {
      const elong = norm360(norm360(181.979 + 58517.815 * T) - sunMeanLong);
      return elong < 16 || elong > 344;
    }
    case "Shani": {
      const elong = norm360(norm360(50.078 + 1222.114 * T) - sunMeanLong);
      return elong > 110 && elong < 250;
    }
    default: return false;
  }
}

// ─── Rashi / Nakshatra helpers ─────────────────────────────────────────────────

function rashiFromDeg(deg: number): { index: number; degrees: number } {
  const d = norm360(deg);
  return { index: Math.floor(d / 30) % 12, degrees: d % 30 };
}

function nakshatraFromDeg(moonDeg: number): { index: number; pada: number; degrees: number } {
  const d    = norm360(moonDeg);
  const span = 360 / 27;
  const index = Math.floor(d / span) % 27;
  const degInNak = d % span;
  const pada  = Math.floor(degInNak / (span / 4)) + 1;
  return { index, pada, degrees: degInNak };
}

// ─── Vimshottari Dasha ──────────────────────────────────────────────────────────

function calcDasha(moonDeg: number, birthDate: Date): {
  current: string; years: number; antardasha: string; elapsed: string; remaining: string;
} {
  const { index, degrees } = nakshatraFromDeg(moonDeg);
  const lord       = NAKSHATRAS[index].lord;
  const lordIdx    = DASHA_ORDER.indexOf(lord);
  const dashaYrs   = DASHA_YEARS[lord];
  const naksSpan   = 360 / 27;
  // Fraction of nakshatra elapsed → years elapsed in current birth-dasha
  const fracElapsed  = degrees / naksSpan;
  const birthDashaElapsed = fracElapsed * dashaYrs;
  const birthDashaRemaining = dashaYrs - birthDashaElapsed;

  // Age in years
  const ageYrs = (Date.now() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000);

  // Walk through dasha sequence to find the active dasha
  let accumulated = birthDashaRemaining;
  let currentDasha = lord;
  let currentYears = dashaYrs;
  let elapsedInCurrent = birthDashaElapsed;
  let dashaIdx = (lordIdx + 1) % 9;

  if (ageYrs >= birthDashaRemaining) {
    let age = birthDashaRemaining;
    for (let i = 0; i < 100; i++) {
      const dl = DASHA_ORDER[dashaIdx % 9];
      const dy = DASHA_YEARS[dl];
      if (age + dy > ageYrs) {
        currentDasha  = dl;
        currentYears  = dy;
        elapsedInCurrent = ageYrs - age;
        break;
      }
      age += dy;
      dashaIdx++;
    }
  }

  // Antardasha: proportional to each planet's dasha years within the maha dasha
  const currentLordIdx = DASHA_ORDER.indexOf(currentDasha);
  let antardasha = currentDasha;
  let accAntar = 0;
  for (let i = 0; i < 9; i++) {
    const antarPlanet = DASHA_ORDER[(currentLordIdx + i) % 9];
    const antarLen = (currentYears * DASHA_YEARS[antarPlanet]) / TOTAL_DASHA_YEARS;
    if (accAntar + antarLen > elapsedInCurrent) {
      antardasha = antarPlanet;
      break;
    }
    accAntar += antarLen;
  }

  const remainingYrs = currentYears - elapsedInCurrent;
  const eY = Math.floor(elapsedInCurrent);
  const eM = Math.floor((elapsedInCurrent - eY) * 12);
  const rY = Math.floor(remainingYrs);
  const rM = Math.floor((remainingYrs - rY) * 12);

  return {
    current: currentDasha,
    years: currentYears,
    antardasha,
    elapsed:   eY > 0 ? `${eY}y ${eM}m` : `${eM}m`,
    remaining: rY > 0 ? `${rY}y ${rM}m` : `${rM}m`,
  };
}

// ─── Guna Milan (Ashtakoot) ───────────────────────────────────────────────────

const VARNA: Record<string, number> = {
  Mesha: 2, Vrishabha: 0, Mithuna: 3, Karka: 1,
  Simha: 2, Kanya: 3, Tula: 3, Vrishchika: 1,
  Dhanu: 2, Makara: 0, Kumbha: 3, Meena: 1,
};

const YONI_ANIMAL = [
  "Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Sheep",
  "Cat","Rat","Rat","Cow","Buffalo","Tiger","Buffalo","Tiger",
  "Hare","Hare","Dog","Monkey","Mongoose","Monkey","Lion","Horse",
  "Lion","Cow","Elephant",
];
const YONI_GENDER = [
  "M","F","F","F","M","F","F","M","M","F","M","F","F","F","M","M","M","F","M","M","F","F","M","F","M","F","F",
];

const FRIENDLY_YONI: Record<string, string[]> = {
  Horse:["Horse"], Elephant:["Elephant"], Sheep:["Sheep"],
  Serpent:["Serpent"], Dog:["Dog"], Cat:["Cat"],
  Rat:["Rat"], Cow:["Cow","Buffalo"], Buffalo:["Buffalo","Cow"],
  Tiger:["Tiger"], Hare:["Hare"], Monkey:["Monkey"], Lion:["Lion"], Mongoose:[],
};
const ENEMY_YONI: Record<string, string[]> = {
  Horse:["Buffalo"], Elephant:["Lion"], Sheep:["Monkey"],
  Serpent:["Mongoose"], Dog:["Hare"], Cat:["Rat"],
  Rat:["Cat"], Cow:["Tiger"], Buffalo:["Horse"],
  Tiger:["Cow"], Hare:["Dog"], Monkey:["Sheep"],
  Lion:["Elephant"], Mongoose:["Serpent"],
};

const GANA: Record<string, number> = { Deva: 0, Manushya: 1, Rakshasa: 2 };

// Nadi (0=Adi/Vata, 1=Madhya/Pitta, 2=Antya/Kapha) indexed by nakshatra
const NADI = [0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2];

// Mangal dosha houses (0-indexed from lagna): 1st(0), 2nd(1), 4th(3), 7th(6), 8th(7), 12th(11)
const MANGAL_DOSHA_HOUSES = [0, 1, 3, 6, 7, 11];

function calcGunaScore(
  nak1: number, nak2: number,
  rashi1: number, rashi2: number,
  lagna1: number, marsRashi1: number,
): {
  total: number; max: number;
  breakdown: { name: string; score: number; max: number; description: string }[];
  mangalDosha: boolean; nadiDosha: boolean;
} {
  const nk1 = NAKSHATRAS[nak1];
  const nk2 = NAKSHATRAS[nak2];
  const r1  = RASHIS[rashi1];
  const r2  = RASHIS[rashi2];

  // 1. Varna (1pt) — caste compatibility
  const v1 = VARNA[r1.name];
  const v2 = VARNA[r2.name];
  const varnaScore = v1 >= v2 ? 1 : 0;

  // 2. Vashya (2pts) — attraction / influence
  const vashyaMap: Record<string, string[]> = {
    Mesha:["Simha","Vrishchika"], Vrishabha:["Karka","Tula"],
    Mithuna:["Kanya"], Karka:["Vrishchika","Dhanu"],
    Simha:["Tula"], Kanya:["Mithuna","Makara"],
    Tula:["Makara","Mithuna"], Vrishchika:["Karka"],
    Dhanu:["Meena"], Makara:["Mesha","Kumbha"],
    Kumbha:["Makara"], Meena:["Makara"],
  };
  const vashya1 = (vashyaMap[r1.name] || []).includes(r2.name);
  const vashya2 = (vashyaMap[r2.name] || []).includes(r1.name);
  const vashyaScore = vashya1 && vashya2 ? 2 : vashya1 || vashya2 ? 1 : 0;

  // 3. Tara (3pts) — birth star compatibility
  const t12 = ((nak2 - nak1 + 27) % 27) % 9;
  const t21 = ((nak1 - nak2 + 27) % 27) % 9;
  const goodTaras = [1, 3, 5, 7]; // Sampat, Kshema, Sadhana, Mitra
  const taraScore = goodTaras.includes(t12 + 1) && goodTaras.includes(t21 + 1) ? 3
    : goodTaras.includes(t12 + 1) || goodTaras.includes(t21 + 1) ? 1.5 : 0;

  // 4. Yoni (4pts) — sexual / intimate compatibility
  const y1 = YONI_ANIMAL[nak1];
  const y2 = YONI_ANIMAL[nak2];
  const g1 = YONI_GENDER[nak1];
  const g2 = YONI_GENDER[nak2];
  let yoniScore = 0;
  if (y1 === y2 && g1 !== g2) yoniScore = 4;
  else if (y1 === y2) yoniScore = 3;
  else if ((FRIENDLY_YONI[y1] || []).includes(y2)) yoniScore = 2;
  else if (!(ENEMY_YONI[y1] || []).includes(y2) && !(ENEMY_YONI[y2] || []).includes(y1)) yoniScore = 1;

  // 5. Graha Maitri (5pts) — mental compatibility via sign lords
  const planetFriends: Record<string, string[]> = {
    Surya:      ["Chandra","Mangal","Brihaspati"],
    Chandra:    ["Surya","Budh"],
    Mangal:     ["Surya","Chandra","Brihaspati"],
    Budh:       ["Surya","Shukra"],
    Brihaspati: ["Surya","Chandra","Mangal"],
    Shukra:     ["Budh","Shani"],
    Shani:      ["Budh","Shukra"],
  };
  const lord1 = r1.lord;
  const lord2 = r2.lord;
  const mf1 = (planetFriends[lord1] || []).includes(lord2);
  const mf2 = (planetFriends[lord2] || []).includes(lord1);
  const grahaMaitriScore = mf1 && mf2 ? 5 : mf1 || mf2 ? 3 : lord1 === lord2 ? 4 : 1;

  // 6. Gana (6pts) — temperament compatibility
  const gana1 = GANA[nk1.gana];
  const gana2 = GANA[nk2.gana];
  const ganaScore = gana1 === gana2 ? 6
    : (gana1 === 0 && gana2 === 1) || (gana1 === 1 && gana2 === 0) ? 5
    : (gana1 === 0 && gana2 === 2) || (gana1 === 2 && gana2 === 0) ? 1
    : 0;

  // 7. Bhakoot (7pts) — moon sign distance
  const diff  = ((rashi2 - rashi1 + 12) % 12) + 1;
  const diff2 = ((rashi1 - rashi2 + 12) % 12) + 1;
  const badBhakoots = [6, 8, 12];
  const bhakootScore = badBhakoots.includes(diff) || badBhakoots.includes(diff2) ? 0 : 7;

  // 8. Nadi (8pts) — physiological compatibility
  const nadi1 = NADI[nak1];
  const nadi2 = NADI[nak2];
  const nadiDosha = nadi1 === nadi2;
  const nadiScore = nadiDosha ? 0 : 8;

  // Mangal dosha: Mars in houses 1,2,4,7,8,12 from lagna
  const marsHouseFromLagna = (marsRashi1 - lagna1 + 12) % 12;
  const mangalDosha = MANGAL_DOSHA_HOUSES.includes(marsHouseFromLagna);

  const total = varnaScore + vashyaScore + taraScore + yoniScore +
    grahaMaitriScore + ganaScore + bhakootScore + nadiScore;

  const nadiLabels  = ["Adi (Vata)", "Madhya (Pitta)", "Antya (Kapha)"];
  const varnaLabels = ["Shudra", "Vaishya", "Kshatriya", "Brahmin"];

  return {
    total: Math.round(total),
    max: 36,
    mangalDosha,
    nadiDosha,
    breakdown: [
      { name: "Varna",        score: varnaScore,              max: 1, description: `${varnaLabels[v1]} + ${varnaLabels[v2]}` },
      { name: "Vashya",       score: Math.round(vashyaScore), max: 2, description: `${r1.name} → ${r2.name}` },
      { name: "Tara",         score: Math.round(taraScore),   max: 3, description: `Nakshatra interval: ${t12 + 1} / ${t21 + 1}` },
      { name: "Yoni",         score: Math.round(yoniScore),   max: 4, description: `${y1} (${g1 === "M" ? "♂" : "♀"}) + ${y2} (${g2 === "M" ? "♂" : "♀"})` },
      { name: "Graha Maitri", score: Math.round(grahaMaitriScore), max: 5, description: `${lord1} + ${lord2}` },
      { name: "Gana",         score: Math.round(ganaScore),   max: 6, description: `${nk1.gana} + ${nk2.gana}` },
      { name: "Bhakoot",      score: Math.round(bhakootScore),max: 7, description: `Rashi distance: ${diff}` },
      { name: "Nadi",         score: Math.round(nadiScore),   max: 8, description: `${nadiLabels[nadi1]} + ${nadiLabels[nadi2]}` },
    ],
  };
}

// ─── Build Kundli ──────────────────────────────────────────────────────────────

export interface KundliData {
  name: string;
  birthDate: string;
  sunRashi: number;
  moonRashi: number;
  lagnaRashi: number;
  nakshatra: number;
  nakshatraPada: number;
  nakshatraDeg: number;
  planets: Record<string, { rashi: number; degrees: number; retrograde: boolean }>;
  dasha: ReturnType<typeof calcDasha>;
}

export interface AstrologyReading {
  user: KundliData;
  partner: KundliData;
  guna: ReturnType<typeof calcGunaScore>;
  compatibility: string;
}

function buildKundli(name: string, birthDateStr: string, birthTimeStr?: string): KundliData {
  // Always parse the calendar date in UTC to avoid timezone day-shift bugs.
  // Handles both "YYYY-MM-DD" and full ISO strings (takes the date portion only).
  const dateOnly = birthDateStr.slice(0, 10);
  const birthDate = new Date(dateOnly + "T00:00:00.000Z");

  // Parse optional birth time (format "HH:MM" or "H:MM AM/PM")
  let birthHourUTC = 6; // default: 6 AM local approximation
  if (birthTimeStr) {
    const parts = birthTimeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (parts) {
      let h = parseInt(parts[1], 10);
      const m = parseInt(parts[2], 10);
      const ampm = parts[3]?.toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      birthHourUTC = h + m / 60;
    }
  }

  const T = j2000(birthDate) / 36525;
  const sunDeg  = sunLongitudeSidereal(T);
  const moonDeg = moonLongitudeSidereal(T);
  const lagnaDeg = ascendantSidereal(T, birthHourUTC);

  const positions = planetaryPositions(T);
  const sunMeanL  = (positions as any)._sunL as number ?? 0;
  const nakResult = nakshatraFromDeg(moonDeg);

  const planets: Record<string, { rashi: number; degrees: number; retrograde: boolean }> = {};
  for (const [key, deg] of Object.entries(positions)) {
    if (key.startsWith("_")) continue; // skip internal fields
    const { index, degrees } = rashiFromDeg(deg);
    planets[key] = {
      rashi: index,
      degrees,
      retrograde: isRetrograde(key, T, sunMeanL),
    };
  }

  return {
    name,
    birthDate: birthDateStr,
    sunRashi:     rashiFromDeg(sunDeg).index,
    moonRashi:    rashiFromDeg(moonDeg).index,
    lagnaRashi:   rashiFromDeg(lagnaDeg).index,
    nakshatra:    nakResult.index,
    nakshatraPada: nakResult.pada,
    nakshatraDeg: nakResult.degrees,
    planets,
    dasha: calcDasha(moonDeg, birthDate),
  };
}

// ─── Compatibility verdict ─────────────────────────────────────────────────────

function compatibilityVerdict(score: number, u: string, p: string): string {
  if (score >= 28) return `${u} and ${p} have a very strong match (${score}/36). Your stars are well aligned. You understand each other naturally and share similar values.`;
  if (score >= 21) return `${u} and ${p} have a good match (${score}/36). Most things line up well. The few rough spots can be worked through with open communication.`;
  if (score >= 18) return `${u} and ${p} have an average match (${score}/36). This connection can work well with some effort. Focus on the areas where you differ most.`;
  return `${u} and ${p} have a challenging match (${score}/36). This does not mean love is impossible. It means you both need to put in more effort and understanding.`;
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function getAstrologyReading(
  userName: string, userBirthDate: string,
  partnerName: string, partnerBirthDate: string,
  userBirthTime?: string, partnerBirthTime?: string,
): AstrologyReading {
  const user    = buildKundli(userName,    userBirthDate,    userBirthTime);
  const partner = buildKundli(partnerName, partnerBirthDate, partnerBirthTime);
  const guna = calcGunaScore(
    user.nakshatra, partner.nakshatra,
    user.moonRashi, partner.moonRashi,
    user.lagnaRashi, user.planets.Mangal?.rashi ?? 0,
  );
  return { user, partner, guna, compatibility: compatibilityVerdict(guna.total, userName, partnerName) };
}
