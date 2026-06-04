// ─── Lumble Personalization Engine ───────────────────────────────────────────
// All content selection is deterministic: same inputs → same output, always.
// Uses content-library.ts for all human-facing copy.

import { AstrologyReading, NAKSHATRAS, RASHIS } from "./astrology";
import { RelationshipType } from "@/context/AppContext";
import {
  DASHA_CHAPTERS,
  GENERIC_REFLECTIONS,
  DAILY_REFLECTIONS,
  KOOTA_NARRATIVES,
  MOON_PROFILES_DEEP,
  NAKSHATRA_PROFILES,
  REL_TYPE_DYNAMICS,
} from "./content-library";

// ─── Stable deterministic helpers ────────────────────────────────────────────

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Picks a single item from an array using a stable seed string. Never uses Math.random(). */
function pick<T>(arr: T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}

/** Today's date key — same across the whole day, changes at midnight. */
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// ─── Koota helpers ─────────────────────────────────────────────────────────────

function kootaScore(guna: AstrologyReading["guna"], name: string): number {
  return guna.breakdown.find((k) => k.name === name)?.score ?? 0;
}
function kootaMax(guna: AstrologyReading["guna"], name: string): number {
  return guna.breakdown.find((k) => k.name === name)?.max ?? 1;
}
function kootaPct(guna: AstrologyReading["guna"], name: string): number {
  const m = kootaMax(guna, name);
  return m > 0 ? kootaScore(guna, name) / m : 0;
}

// Stable sort: sort by (score/max) asc then name for tie-breaking
function sortedKootas(guna: AstrologyReading["guna"]) {
  return [...guna.breakdown].sort((a, b) => {
    const diff = (a.score / a.max) - (b.score / b.max);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });
}

// ─── Daily energy bars ────────────────────────────────────────────────────────

function dailyMod(base: number, seed: number): number {
  const s = ((seed * 1664525 + 1013904223) & 0x7fffffff) % 37 - 18;
  return Math.max(15, Math.min(99, base + s));
}

export interface EnergyBars {
  closeness: number; attraction: number; communication: number;
  reconnection: number; tension: number; message: string; date: string;
}

export function getDailyEnergyPersonalized(
  reading: AstrologyReading,
  userDasha: string,
): EnergyBars {
  const { guna } = reading;

  const closenessBase     = Math.round(kootaPct(guna,"Graha Maitri")*50 + kootaPct(guna,"Bhakoot")*30 + kootaPct(guna,"Gana")*20);
  const attractionBase    = Math.round(kootaPct(guna,"Yoni")*55 + kootaPct(guna,"Vashya")*25 + kootaPct(guna,"Varna")*20);
  const commBase          = Math.round(kootaPct(guna,"Gana")*45 + kootaPct(guna,"Graha Maitri")*35 + kootaPct(guna,"Tara")*20);
  const reconnectionBase  = ({ Shukra:80,Chandra:75,Brihaspati:70,Surya:60,Mangal:55,Budh:55,Rahu:45,Shani:40,Ketu:30 }[userDasha] ?? 55);
  const tensionBase       = Math.min(80, Math.round(
    (guna.nadiDosha ? 30 : 0) + (guna.mangalDosha ? 20 : 0) +
    (kootaScore(guna,"Bhakoot") === 0 ? 25 : 0) + (kootaScore(guna,"Gana") < 3 ? 20 : 0)
  ));

  const today = new Date();
  const daySeed  = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  const baseSeed = daySeed * 31 + (reading.user.nakshatra * 7 + reading.partner.nakshatra * 13);

  const closeness     = dailyMod(closenessBase,    baseSeed);
  const attraction    = dailyMod(attractionBase,   baseSeed + 1);
  const communication = dailyMod(commBase,         baseSeed + 2);
  const reconnection  = dailyMod(reconnectionBase, baseSeed + 3);
  const tension       = Math.min(85, dailyMod(tensionBase, baseSeed + 4));

  const moonU = RASHIS[reading.user.moonRashi].name;
  const moonP = RASHIS[reading.partner.moonRashi].name;
  const dc    = DASHA_CHAPTERS[userDasha];

  const MESSAGES = [
    tension > 65  ? `Your ${moonU} moon and their ${moonP} moon are in friction today. Pause before reacting — the tension is real but temporary.` : null,
    closeness > 72? `${moonU} and ${moonP} are in resonance today. Something wants to be felt or said — don't hold it back.` : null,
    reconnection > 70 ? `Your ${dc?.theme ?? "current"} period is pulling you toward resolution. The window is open if you choose it.` : null,
    communication > 70 ? `Your ${moonU} moon finds its voice today. An honest exchange now will carry further than you expect.` : null,
    `A quieter day in the energy between you — ${moonP} moon is processing inward. Give it space.`,
  ].filter(Boolean) as string[];

  const message = MESSAGES[0] ?? MESSAGES[MESSAGES.length - 1];
  const date    = today.toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" });
  return { closeness, attraction, communication, reconnection, tension, message, date };
}

// ─── Daily quote category ─────────────────────────────────────────────────────

export function getPersonalizedQuoteCategory(moonRashiIdx: number, dashaLord: string): string {
  const dc   = DASHA_CHAPTERS[dashaLord];
  const mp   = MOON_PROFILES_DEEP[moonRashiIdx];
  const day  = new Date().getDay();
  return day % 2 === 0 ? (dc?.quoteCategory ?? dc?.theme ?? "love") : (mp?.quoteCategory ?? "love");
}

// ─── Daily focus ──────────────────────────────────────────────────────────────

export function getPersonalizedFocus(
  userName: string,
  moonRashiIdx: number,
  dashaLord: string,
  relType: RelationshipType,
): string {
  const mp  = MOON_PROFILES_DEEP[moonRashiIdx];
  const dc  = DASHA_CHAPTERS[dashaLord];
  if (!mp || !dc) return "Be present with what is, not what you wish were different.";

  const relFocus: Record<RelationshipType, string> = {
    crush:         "You haven't said what's true yet — that's where the real work is.",
    situationship: "The label question is less important than the pattern question.",
    relationship:  "The daily choice to stay present is the whole thing.",
    ex:            "Healing doesn't require forgetting — it requires understanding.",
  };

  const pool = [
    dc.lessonForLove,
    `Your ${RASHIS[moonRashiIdx].name} moon needs ${mp.need ?? mp.needsToHear} today. Ask yourself if you're asking for it clearly.`,
    mp.emotion ? `You ${mp.emotion}. Notice when that pattern shows up with them today.` : mp.blindspot,
    relFocus[relType],
    mp.give ? `You ${mp.give}. That's your love language — is it landing the way you intend?` : mp.insight,
    dc.gift,
    mp.needsToHear,
  ];

  const today = new Date();
  const seed  = `${userName}-focus-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  return pick(pool, seed);
}

// ─── Daily reflection (home screen message) ───────────────────────────────────

export function getDailyReflection(
  moonRashiIdx: number,
  relType: RelationshipType,
): string {
  const key = `${moonRashiIdx}-${relType}`;
  const pool = DAILY_REFLECTIONS[key] ?? GENERIC_REFLECTIONS;
  const today = new Date();
  const seed  = `reflection-${moonRashiIdx}-${relType}-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  return pick(pool, seed);
}

// ─── Compatibility section texts ─────────────────────────────────────────────

export function getCompatibilityTexts(
  reading: AstrologyReading,
  relType: RelationshipType,
): Record<string, string> {
  const { guna, user, partner } = reading;
  const uMoon = RASHIS[user.moonRashi];
  const pMoon = RASHIS[partner.moonRashi];
  const uNak  = NAKSHATRAS[user.nakshatra];
  const pNak  = NAKSHATRAS[partner.nakshatra];
  const uNP   = NAKSHATRA_PROFILES[user.nakshatra]    ?? NAKSHATRA_PROFILES[0];
  const pNP   = NAKSHATRA_PROFILES[partner.nakshatra] ?? NAKSHATRA_PROFILES[0];
  const uMP   = MOON_PROFILES_DEEP[user.moonRashi]    ?? MOON_PROFILES_DEEP[0];
  const pMP   = MOON_PROFILES_DEEP[partner.moonRashi] ?? MOON_PROFILES_DEEP[0];
  const dc    = DASHA_CHAPTERS[user.dasha.current]    ?? DASHA_CHAPTERS["Chandra"];

  const sk = sortedKootas(guna);
  const strongestKoota = sk[sk.length - 1];
  const weakestKoota   = sk[0];

  const gmPct = kootaPct(guna, "Graha Maitri");
  const emotionalText = gmPct >= 0.7
    ? `Your ${uMoon.name} moon and ${partner.name}'s ${pMoon.name} moon share sign lords that favour each other — emotional understanding arrives before words do. This is rare and worth protecting.`
    : gmPct <= 0.3
    ? `Your ${uMoon.name} and ${pMoon.name} moons operate on different emotional frequencies. You interpret the same silence very differently. The gap is workable — but it requires naming.`
    : `Your ${uMoon.name} moon meets ${partner.name}'s ${pMoon.name} moon — ${uMoon.element} meeting ${pMoon.element}. The chemistry is ${uMoon.element === pMoon.element ? "natural" : "complementary"}.`;

  const ganaPct = kootaPct(guna, "Gana");
  const commText = ganaPct <= 0.3
    ? `${uNak.gana} Gana meets ${pNak.gana} Gana — you approach life's challenges from fundamentally different emotional instincts. Without naming this, it becomes the unnamed thing that keeps coming up.`
    : `Your ${uNak.gana} and ${partner.name}'s ${pNak.gana} Gana create a ${uNak.gana === pNak.gana ? "naturally aligned" : "workably complementary"} dynamic.`;

  const bhakootNarrative = KOOTA_NARRATIVES["Bhakoot"];
  const bhakootPct = kootaPct(guna, "Bhakoot");
  const attachText = bhakootPct === 0 ? bhakootNarrative.weakText : bhakootNarrative.strongText;

  const nadiNarrative = KOOTA_NARRATIVES["Nadi"];
  const tensionText = guna.nadiDosha ? nadiNarrative.weakText : nadiNarrative.strongText;

  const ltText = guna.total >= 24
    ? `At ${guna.total}/36, your Guna Milan score lands in genuinely strong territory. The foundation exists — what you build on it is the only question.`
    : guna.total >= 18
    ? `At ${guna.total}/36, this connection is workable. The friction area in ${weakestKoota?.name ?? "certain kootas"} is not a stop sign — it's specifically where to invest attention.`
    : `At ${guna.total}/36, the charts flag real friction in ${sk.slice(0,2).map(k=>k.name).join(" and ")}. Not impossible — but requiring extraordinary self-awareness from both people.`;

  const yoniNarrative = KOOTA_NARRATIVES["Yoni"];
  const addictiveText = kootaPct(guna,"Yoni") >= 0.6
    ? `${uNak.name} ${yoniNarrative.strongText.toLowerCase().slice(0,60)}… ${uNP.strength}. The intensity you feel has an astrological basis — it's not imagined.`
    : `${uNak.name} ${uNak.yoni} Yoni meets ${pNak.name} ${pNak.yoni} Yoni — ${uNak.yoni === pNak.yoni ? "the same animal energy, which creates magnetic recognition" : "different animal energies that create a specific charge"}. ${uNP.trap}`;

  const hiddenText = weakestKoota
    ? `The hidden pattern is in the ${weakestKoota.name} koota: ${KOOTA_NARRATIVES[weakestKoota.name]?.weakText ?? "an underlying friction that surfaces as something else"}. ${KOOTA_NARRATIVES[weakestKoota.name]?.fix ?? ""}`
    : `The Ashtakoot breakdown shows no major dosha patterns. The friction in this connection comes from individual wounds, not cosmic incompatibility — harder to see, and fully workable.`;

  return {
    "Emotional Chemistry":         emotionalText,
    "Communication Energy":        commText,
    "Attachment Dynamics":         attachText,
    "Emotional Tension":           tensionText,
    "Long-Term Potential":         ltText,
    "Why This Feels Addictive":    addictiveText,
    "Hidden Relationship Pattern": hiddenText,
  };
}

// ─── Feature card texts ───────────────────────────────────────────────────────

export function getPersonalizedFeatureText(
  featureKey: string,
  reading: AstrologyReading,
  userName: string,
  partnerName: string,
): string {
  const { guna, user, partner } = reading;
  const uNak  = NAKSHATRAS[user.nakshatra];
  const pNak  = NAKSHATRAS[partner.nakshatra];
  const uMoon = RASHIS[user.moonRashi];
  const pMoon = RASHIS[partner.moonRashi];
  const uNP   = NAKSHATRA_PROFILES[user.nakshatra]    ?? NAKSHATRA_PROFILES[0];
  const pNP   = NAKSHATRA_PROFILES[partner.nakshatra] ?? NAKSHATRA_PROFILES[0];
  const uMP   = MOON_PROFILES_DEEP[user.moonRashi]    ?? MOON_PROFILES_DEEP[0];

  switch (featureKey) {
    case "falls-harder":
      return kootaPct(guna,"Yoni") > 0.6
        ? `${userName} — ${uNak.name} ${uNP.pattern}. The Yoni compatibility here means the initial fall is fast and mutual, but ${userName}'s ${uMoon.name} moon internalises it faster.`
        : `${partnerName} likely fell first, even if they showed it last. ${pNak.name} ${pNP.pattern} — and ${pMoon.name} moon holds that quietly.`;

    case "attached-first":
      return `${uNak.name} (${userName}) attaches through ${uNak.deity} energy — ${uNak.symbol}. ${pNak.name} (${partnerName}) attaches through ${pNak.deity}. ${uNP.craving} — different doors into the same room.`;

    case "dependency-index":
      return guna.nadiDosha
        ? `The Nadi Dosha means your nervous systems are wired similarly. Being around them feels like being around yourself — and that familiarity is exactly what makes it hard to leave.`
        : `Your ${uMoon.name} moon processes connection through ${uMoon.element.toLowerCase()} — ${uNP.pattern}. Dependency isn't weakness here. It's architecture.`;

    case "ghosting-probability":
      return kootaScore(guna,"Bhakoot") === 0
        ? `The 6-8 Bhakoot distance means emotional withdrawal is ${partnerName}'s default circuit breaker when overwhelmed. ${KOOTA_NARRATIVES["Bhakoot"].weakText}`
        : `${pNak.name} ${pNP.pattern}. Low ghosting probability — ${pNak.lord}-ruled nakshatras tend to linger. What's more likely is inconsistency, not disappearance.`;

    case "reunion-potential":
      return guna.total >= 24
        ? `At ${guna.total}/36, the karmic pull between ${uNak.name} and ${pNak.name} doesn't dissolve cleanly. The thread stays. Whether reunion becomes right depends on what both people learn in the gap.`
        : `Reunion is possible but not written. The ${kootaScore(guna,"Bhakoot") === 0 ? "Bhakoot friction" : "current timing"} means the next window, if it comes, requires something genuinely different from both of you.`;

    case "toxic-or-soulmate":
      return guna.nadiDosha || kootaScore(guna,"Bhakoot") === 0
        ? `Both. The ${guna.nadiDosha ? "Nadi Dosha" : "Bhakoot distance"} creates the intensity that makes this feel fated. Soulmates in Vedic astrology aren't always comfortable — they crack you open. This connection is doing that.`
        : `Closer to soulmate — ${guna.total}/36 and ${uNak.gana === pNak.gana ? "matching Gana" : "complementary Gana"} means this isn't karmic friction. It's karmic recognition.`;

    case "cant-let-go":
      return `${uNak.name} ${uNP.pattern}. The bond between ${uNak.name} and ${pNak.name} — ${uNak.lord} meets ${pNak.lord} — creates a specific imprint. You can't let go because part of you correctly identified something real. ${uMP.insight}`;

    case "red-flags":
      return kootaScore(guna,"Gana") < 3
        ? `${pNak.gana} Gana meeting ${uNak.gana} Gana — ${KOOTA_NARRATIVES["Gana"].weakText} ${KOOTA_NARRATIVES["Gana"].fix}`
        : `${pNak.name} ${pNP.shadow}. When that shows up as inconsistency, it's worth naming: is this their capacity limit, or a signal about fit?`;

    case "green-flags":
      return (() => {
        const sk = sortedKootas(guna);
        const best = sk[sk.length - 1];
        return best
          ? `The ${best.name} koota between you scores high — ${KOOTA_NARRATIVES[best.name]?.strongText ?? "natural compatibility"}. That's not luck — it's a genuine foundation in the charts.`
          : `The green flag isn't in a specific score — it's in the fact that ${pNak.name} ${pNP.strength}, and you're drawn to exactly that quality.`;
      })();

    case "pulling-back":
      return `${pNak.name} ${pNP.pattern}. What pulls you back is the specific frequency of that nakshatra — ${pNak.lord}-ruled energy leaves an impression that ${uNak.name} ${uNak.lord}-ruled people feel acutely. The pull is real. So is the question of what to do with it.`;

    default:
      return `${uNak.name} and ${pNak.name} — ${uNak.lord} meets ${pNak.lord}. ${uNP.craving} The connection has a specific astrological signature unique to the two of you.`;
  }
}

// ─── Personalised suggestion cards ───────────────────────────────────────────

export function getPersonalizedSuggestions(
  reading: AstrologyReading,
  relType: RelationshipType,
): { q: string; category: string; icon: string }[] {
  const { guna, user, partner } = reading;
  const uMoon  = RASHIS[user.moonRashi].name;
  const uNak   = NAKSHATRAS[user.nakshatra].name;
  const pNak   = NAKSHATRAS[partner.nakshatra].name;
  const dc     = DASHA_CHAPTERS[user.dasha.current];
  const rtd    = REL_TYPE_DYNAMICS[relType];
  const sk     = sortedKootas(guna);
  const weakest = sk[0];

  // Build candidate pool with deterministic weights
  type Card = { q: string; category: string; icon: string; w: number };
  const pool: Card[] = [
    { q: (dc?.theme ?? dc?.headline) ? `Why does my ${user.dasha.current} period feel heavy in this connection?` : "What does this connection need from me right now?", category: "dasha", icon: "⟡", w: 10 },
    { q: `My ${uMoon} moon needs something they're not giving — what is it?`, category: "needs", icon: "✦", w: 9 },
    { q: rtd?.keyQuestion ?? "What does the future hold for us?", category: "core", icon: "◉", w: 9 },
    { q: weakest && weakest.score / weakest.max < 0.3 ? "Why do we keep clashing over the same thing?" : "Why does this connection feel this way?", category: "friction", icon: "◈", w: weakest && weakest.score / weakest.max < 0.3 ? 9 : 5 },
    { q: `${uNak} meets ${pNak} — what does that mean for how we feel?`, category: "nakshatra", icon: "🌙", w: 8 },
    ...(guna.mangalDosha ? [{ q: "Why does this feel so intense and sometimes unsafe?", category: "dosha", icon: "◎", w: 9 }] : []),
    ...(guna.nadiDosha   ? [{ q: "Why do I feel drained even when I love them?",         category: "nadi",  icon: "◈", w: 9 }] : []),
    ...(kootaScore(guna,"Bhakoot") === 0 ? [{ q: "Why does this feel like one step forward, two steps back?", category: "bhakoot", icon: "🌙", w: 10 }] : []),
    ...(relType === "ex"           ? [{ q: "Do they still think about this connection?", category: "ex",    icon: "✦", w: 9 }, { q: "Is there a real chance we could work now?", category: "reunion", icon: "◎", w: 8 }] : []),
    ...(relType === "crush"        ? [{ q: "Do they feel what I feel, or is this one-sided?", category: "crush", icon: "◈", w: 9 }, { q: "Should I say something or wait for a sign?", category: "timing", icon: "⟡", w: 8 }] : []),
    ...(relType === "situationship"? [{ q: "Why won't they define what this is?", category: "labels", icon: "◉", w: 9 }, { q: "Am I reading too much into this?", category: "clarity", icon: "✧", w: 7 }] : []),
    { q: "What's the real reason I can't let go?",    category: "healing", icon: "⟡", w: 5 },
    { q: "Are we actually compatible?",               category: "insight", icon: "◈", w: 4 },
    { q: "What does the future hold for us?",         category: "future",  icon: "✧", w: 4 },
  ];

  // Stable sort: by weight desc, then by question text for tie-breaking (no Math.random)
  const sorted = [...pool].sort((a, b) => {
    const diff = b.w - a.w;
    return diff !== 0 ? diff : a.q.localeCompare(b.q);
  });

  // Deduplicate by category, take 6
  const seen = new Set<string>();
  return sorted
    .filter((c) => { if (seen.has(c.category)) return false; seen.add(c.category); return true; })
    .slice(0, 6)
    .map(({ q, category, icon }) => ({ q, category, icon }));
}

// ─── Quick chips ──────────────────────────────────────────────────────────────

export function getPersonalizedChips(
  reading: AstrologyReading,
  relType: RelationshipType,
): string[] {
  const { guna, user } = reading;
  const dasha  = user.dasha.current;
  const uMoon  = RASHIS[user.moonRashi].name;
  const dc     = DASHA_CHAPTERS[dasha];

  type Chip = { text: string; w: number };
  const pool: Chip[] = [
    { text: (dc?.theme ?? dc?.headline) ? `Why does my ${dasha} dasha make this so difficult?` : "What is this connection teaching me?", w: 10 },
    { text: `Why does my ${uMoon} moon make this harder?`, w: 8 },
    { text: guna.nadiDosha ? "Why do I feel drained even when I love them?" : "Why does this feel so easy sometimes?", w: 8 },
    { text: kootaScore(guna,"Bhakoot") === 0 ? "Why one step forward, two steps back?" : "Will this actually last?", w: 7 },
    ...(relType === "ex"           ? [{ text: "Do they miss me?",           w: 9 }] : []),
    ...(relType === "crush"        ? [{ text: "Do they feel it too?",       w: 9 }] : []),
    ...(relType === "situationship"? [{ text: "Are we more than this?",     w: 9 }] : []),
    ...(relType === "relationship" ? [{ text: "How do we get back to how it was?", w: 8 }] : []),
    { text: "Should I reach out?",              w: 5 },
    { text: "Is the timing finally right?",     w: 5 },
    { text: "What are they thinking right now?",w: 5 },
  ];

  return [...pool]
    .sort((a, b) => b.w - a.w || a.text.localeCompare(b.text))
    .slice(0, 5)
    .map((c) => c.text);
}
