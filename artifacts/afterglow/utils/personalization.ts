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
import { getContentBundle, applyVars } from "./dbContent";

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
  return Math.max(54, Math.min(92, base + s));
}

export interface EnergyBars {
  closeness: number; attraction: number; communication: number;
  reconnection: number; tension: number;
  trust: number; positivity: number;
  message: string; date: string;
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
  // Trust: how reliably you two show up for each other (Tara = longevity, Vashya = dependability, Graha Maitri = mental alignment)
  const trustBase         = Math.round(kootaPct(guna,"Tara")*40 + kootaPct(guna,"Vashya")*35 + kootaPct(guna,"Graha Maitri")*25);
  // Positivity: overall emotional optimism in the connection (guna health + absence of doshas)
  const positivityBase    = Math.min(85, Math.round((guna.total / 36) * 60 + (guna.nadiDosha ? 0 : 20) + (guna.mangalDosha ? 0 : 20)));

  const today = new Date();
  const daySeed  = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  const baseSeed = daySeed * 31 + (reading.user.nakshatra * 7 + reading.partner.nakshatra * 13);

  const closeness     = dailyMod(closenessBase,    baseSeed);
  const attraction    = dailyMod(attractionBase,   baseSeed + 1);
  const communication = dailyMod(commBase,         baseSeed + 2);
  const reconnection  = dailyMod(reconnectionBase, baseSeed + 3);
  const tension       = Math.min(85, dailyMod(tensionBase, baseSeed + 4));
  const trust         = dailyMod(trustBase,        baseSeed + 5);
  const positivity    = dailyMod(positivityBase,   baseSeed + 6);

  const moonU = RASHIS[reading.user.moonRashi].en;
  const moonP = RASHIS[reading.partner.moonRashi].en;
  const dc    = DASHA_CHAPTERS[userDasha];

  const MESSAGES = [
    tension > 65  ? `Your ${moonU} moon and their ${moonP} moon are in friction today. Pause before reacting — the tension is real but temporary.` : null,
    closeness > 72? `${moonU} and ${moonP} are in resonance today. Something wants to be felt or said — don't hold it back.` : null,
    reconnection > 70 ? `Your ${dc?.theme ?? "current"} period is pulling you toward resolution. The window is open if you choose it.` : null,
    communication > 70 ? `Your ${moonU} moon finds its voice today. An honest exchange now will carry further than you expect.` : null,
    `A quieter day in the energy between you — ${moonP} moon is processing inward. Give it space.`,
  ].filter(Boolean) as string[];

  // Try DB bundle for energy message
  const bundle = getContentBundle();
  const dbMsg  = (() => {
    if (!bundle?.energyMessages?.length) return null;
    const condTag = tension > 65 ? "condition:high_tension" : closeness > 72 ? "condition:high_closeness" : "universal";
    const pool = bundle.energyMessages.filter((i) => (i.tags as string[]).includes(condTag) || (i.tags as string[]).includes("universal"));
    const src = pool.length ? pool : bundle.energyMessages;
    return applyVars(src[baseSeed % src.length].body, { um: moonU, pm: moonP });
  })();

  const message = dbMsg ?? MESSAGES[0] ?? MESSAGES[MESSAGES.length - 1];
  const date    = today.toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" });
  return { closeness, attraction, communication, reconnection, tension, trust, positivity, message, date };
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
    `Your ${RASHIS[moonRashiIdx].en} moon needs ${mp.need ?? mp.needsToHear} today. Ask yourself if you're asking for it clearly.`,
    mp.emotion ? `You ${mp.emotion}. Notice when that pattern shows up with them today.` : mp.blindspot,
    relFocus[relType],
    mp.give ? `You ${mp.give}. That's your love language — is it landing the way you intend?` : mp.insight,
    dc.gift,
    mp.needsToHear,
  ];

  const today = new Date();
  const seed  = `${userName}-focus-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  // Try DB bundle first
  const bundle = getContentBundle();
  if (bundle?.dailyFocus?.length) {
    const item = bundle.dailyFocus[hash(seed) % bundle.dailyFocus.length];
    return applyVars(item.body, { u: userName });
  }

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

// ─── Shared DB resolvers ──────────────────────────────────────────────────────
function resolveKootaNarrative(name: string) {
  const bundle = getContentBundle();
  if (bundle?.kootaNarratives?.length) {
    const item = bundle.kootaNarratives.find((i) => (i.meta as any)?.kootaName === name);
    if (item) return item.meta as any;
  }
  return KOOTA_NARRATIVES[name];
}

function resolveMoonProfileGlobal(idx: number) {
  const bundle = getContentBundle();
  if (bundle?.moonProfiles?.length) {
    const item = bundle.moonProfiles.find((i) => (i.meta as any)?.moonRashiIdx === idx);
    if (item) return item.meta as any;
  }
  return MOON_PROFILES_DEEP[idx] ?? MOON_PROFILES_DEEP[0];
}

function resolveNakProfileGlobal(idx: number) {
  const bundle = getContentBundle();
  if (bundle?.nakshatraProfiles?.length) {
    const item = bundle.nakshatraProfiles.find((i) => (i.meta as any)?.nakshatraIdx === idx);
    if (item) return item.meta as any;
  }
  return NAKSHATRA_PROFILES[idx] ?? NAKSHATRA_PROFILES[0];
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
  const uNP   = resolveNakProfileGlobal(user.nakshatra);
  const pNP   = resolveNakProfileGlobal(partner.nakshatra);
  const uMP   = resolveMoonProfileGlobal(user.moonRashi);
  const pMP   = resolveMoonProfileGlobal(partner.moonRashi);
  const dc    = DASHA_CHAPTERS[user.dasha.current]    ?? DASHA_CHAPTERS["Chandra"];

  const sk = sortedKootas(guna);
  const strongestKoota = sk[sk.length - 1];
  const weakestKoota   = sk[0];

  const gmPct = kootaPct(guna, "Graha Maitri");
  const emotionalText = gmPct >= 0.7
    ? `Your ${uMoon.en} and ${partner.name}'s ${pMoon.en} emotional styles naturally click — you get each other's logic without having to explain yourself. That's actually rare and worth protecting.`
    : gmPct <= 0.3
    ? `Your ${uMoon.en} and ${pMoon.en} emotional styles work very differently. You can read the same situation in completely different ways. This is manageable — but you have to talk about it.`
    : `Your ${uMoon.en} emotional style meets ${partner.name}'s ${pMoon.en} — ${uMoon.element} meeting ${pMoon.element}. The chemistry is ${uMoon.element === pMoon.element ? "natural" : "complementary"}.`;

  const ganaPct = kootaPct(guna, "Gana");
  const commText = ganaPct <= 0.3
    ? `You handle stressful situations in very different ways. Under pressure, one person moves closer, one pulls away. Without naming this pattern, it becomes the thing that keeps coming up in every argument.`
    : `Your emotional styles are ${uNak.gana === pNak.gana ? "naturally aligned" : "workably complementary"} — you tend to handle the hard moments in ways that don't make things worse for each other.`;

  const bhakootNarrative = resolveKootaNarrative("Bhakoot");
  const bhakootPct = kootaPct(guna, "Bhakoot");
  const attachText = bhakootPct === 0 ? bhakootNarrative.weakText : bhakootNarrative.strongText;

  const nadiNarrative = resolveKootaNarrative("Nadi");
  const tensionText = guna.nadiDosha ? nadiNarrative.weakText : nadiNarrative.strongText;

  const ltText = guna.total >= 24
    ? `At ${guna.total}/36, your compatibility is genuinely strong. The foundation is there — the only question is what you build on it.`
    : guna.total >= 18
    ? `At ${guna.total}/36, this connection can work. The area with friction isn't a stop sign — it's just where you both need to pay more attention.`
    : `At ${guna.total}/36, there is real friction in a few key areas. Not impossible — but it does require both people to be very honest with themselves.`;

  const addictiveText = kootaPct(guna,"Yoni") >= 0.6
    ? `${uNP.strength}. The physical and emotional pull between you is built into how your personalities interact — it's not imagined, and it's not accidental.`
    : `${uNP.trap}. The pull you feel is real — but it's worth understanding whether it's coming from genuine compatibility or from a pattern that predates this person.`;

  const hiddenText = weakestKoota
    ? `The hidden pattern: ${resolveKootaNarrative(weakestKoota.name)?.weakText ?? "an underlying friction that surfaces as something else"}. ${resolveKootaNarrative(weakestKoota.name)?.fix ?? ""}`
    : `The profile shows no major structural friction. The tension in this connection comes from individual patterns and wounds, not incompatibility — harder to see, and fully workable.`;

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
  const uNP   = resolveNakProfileGlobal(user.nakshatra);
  const pNP   = resolveNakProfileGlobal(partner.nakshatra);
  const uMP   = resolveMoonProfileGlobal(user.moonRashi);

  switch (featureKey) {
    case "falls-harder":
      return kootaPct(guna,"Yoni") > 0.6
        ? `${userName} — ${uNP.pattern}. The initial pull here is fast and mutual, but ${userName}'s ${uMoon.en} emotional style tends to internalise it sooner.`
        : `${partnerName} likely fell first, even if they showed it last. ${pNP.pattern} — and a ${pMoon.en} emotional style holds that quietly.`;

    case "attached-first":
      return `${userName} attaches through ${uNP.craving}. ${partnerName} attaches through ${pNP.craving}. Different entry points into the same kind of need — which is why the pull between you runs deep.`;

    case "dependency-index":
      return guna.nadiDosha
        ? `Your emotional energy types are wired similarly. Being around them feels familiar in a way that's hard to articulate — and that familiarity is exactly what makes it hard to leave.`
        : `Your ${uMoon.en} emotional style processes connection through ${uMoon.element.toLowerCase()} energy — ${uNP.pattern}. The dependency isn't weakness here. It's how you're built to attach.`;

    case "ghosting-probability":
      return kootaScore(guna,"Bhakoot") === 0
        ? `Emotional withdrawal is ${partnerName}'s default response when overwhelmed — they pull back before they pull away completely. ${resolveKootaNarrative("Bhakoot")?.weakText ?? ""}`
        : `${pNP.pattern}. Low ghosting probability — this personality type tends to linger rather than disappear. What's more likely is inconsistency, not a clean exit.`;

    case "reunion-potential":
      return guna.total >= 24
        ? `At ${guna.total}/36, the emotional pull between you doesn't dissolve cleanly. The thread stays. Whether reunion becomes right depends on what both people actually do differently in the gap.`
        : `Reunion is possible but not guaranteed. The next window, if it comes, requires something genuinely specific to have changed in both of you — not just time passing.`;

    case "toxic-or-soulmate":
      return guna.nadiDosha || kootaScore(guna,"Bhakoot") === 0
        ? `Both. The structural tension in this connection creates the intensity that makes it feel significant. The most important relationships aren't always the most comfortable — they're the ones that crack something open. This one is doing that.`
        : `Closer to soulmate — ${guna.total}/36 and ${uNak.gana === pNak.gana ? "similar emotional instincts" : "complementary emotional instincts"} means the pull between you is recognition, not just chemistry.`;

    case "cant-let-go":
      return `${uNP.pattern}. You can't let go because part of you correctly identified something real. The connection left a specific imprint — and your emotional style holds that kind of thing longer than most. ${uMP.insight}`;

    case "red-flags":
      return kootaScore(guna,"Gana") < 3
        ? `${resolveKootaNarrative("Gana")?.weakText ?? ""} ${resolveKootaNarrative("Gana")?.fix ?? ""}`
        : `${pNP.shadow}. When that shows up as inconsistency or distance, it's worth naming honestly: is this their capacity limit, or a pattern that's asking you to pay attention?`;

    case "green-flags":
      return (() => {
        const sk = sortedKootas(guna);
        const best = sk[sk.length - 1];
        return best
          ? `Your strongest area of natural compatibility: ${resolveKootaNarrative(best.name)?.strongText ?? "a genuine foundation where things flow without effort"}. That's not luck — it's real.`
          : `The green flag isn't in a specific score — it's in the fact that ${pNP.strength}, and you're drawn to exactly that quality.`;
      })();

    case "pulling-back":
      return `${pNP.pattern}. What pulls you back is the specific impression they left — ${pNP.craving} — which resonated with something you were looking for. The pull is real. So is the question of what to do with it.`;

    default:
      return `${uNP.craving} meets ${pNP.craving}. The connection between you has a specific shape — understanding that shape is how you navigate it honestly.`;
  }
}

// ─── Personalised Hero Reading ───────────────────────────────────────────────

export interface PersonalizedHero {
  headline: string;
  moonTag: string;
  insight: string;
  action: string;
}

type ElementKey =
  | "Fire_Fire" | "Fire_Earth" | "Fire_Air" | "Fire_Water"
  | "Earth_Earth" | "Earth_Air" | "Earth_Water"
  | "Air_Air" | "Air_Water"
  | "Water_Water";

function elementKey(eU: string, eP: string): ElementKey {
  const pairs: Record<string, ElementKey> = {
    "Fire_Fire":   "Fire_Fire",   "Earth_Earth": "Earth_Earth",
    "Air_Air":     "Air_Air",     "Water_Water": "Water_Water",
    "Fire_Earth":  "Fire_Earth",  "Earth_Fire":  "Fire_Earth",
    "Fire_Air":    "Fire_Air",    "Air_Fire":    "Fire_Air",
    "Fire_Water":  "Fire_Water",  "Water_Fire":  "Fire_Water",
    "Earth_Air":   "Earth_Air",   "Air_Earth":   "Earth_Air",
    "Earth_Water": "Earth_Water", "Water_Earth": "Earth_Water",
    "Air_Water":   "Air_Water",   "Water_Air":   "Air_Water",
  };
  return pairs[`${eU}_${eP}`] ?? "Fire_Water";
}

type HeroVariant = {
  insight: string;
  action: string;
};

function buildHeroPool(
  userName: string,
  partnerName: string,
  userMoon: string,
  partnerMoon: string,
  elemKey: ElementKey,
  relType: RelationshipType,
  gunaTotal: number,
): HeroVariant[] {
  // ── Fire + Fire ─────────────────────────────────────────────────────────────
  const FF: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are both Fire — meaning you're two people who lead, not follow. The situationship stalls because neither of you will admit first that you want more. That's not mystery. That's a standoff.`, action: `Be the one who names it, just once. Their reaction tells you everything.` },
      { insight: `${userName}, two Fire moons in a situationship is a slow burn that risks scorching both of you. ${partnerName}'s ${partnerMoon} moon craves heat but flinches from being owned. You do too. Neither of you is wrong — but someone has to stop performing and start talking.`, action: `Drop the performance for one conversation. Say what you actually want.` },
      { insight: `${userName}, your ${userMoon} moon is competitive even in love. ${partnerName}'s ${partnerMoon} moon is exactly the same. The tension between you isn't chemistry — it's two people waiting to see who cares more. Neither of you should be waiting.`, action: `Stop tracking the score. Show up without keeping count today.` },
      { insight: `${userName}, Fire meets Fire here and the result is either a wildfire or nothing at all. ${partnerName}'s ${partnerMoon} moon isn't holding back — they're protecting themselves the same way you are. The situationship is both of your doing.`, action: `Let your guard down first. One honest moment changes the whole energy.` },
    ],
    crush: [
      { insight: `${userName}, your ${userMoon} moon wants to conquer and ${partnerName}'s ${partnerMoon} moon is the same. If you're waiting for them to make the first move, you could wait a long time. Fire moons don't chase — they attract.`, action: `Send the message you've been drafting in your head.` },
      { insight: `${userName}, the attraction between ${userMoon} and ${partnerMoon} moons is real and mutual — Fire recognises Fire. ${partnerName} has noticed you. What they're watching for is whether you'll act on it.`, action: `Make your presence felt. Show up somewhere they'll be.` },
      { insight: `${userName}, two Fire moons in a crush dynamic means the tension is palpable to everyone except the two of you. ${partnerName} is as interested as you are, just as proud. Someone has to blink first.`, action: `Blink first. Confidence is attractive, and so is honesty.` },
      { insight: `${userName}, your ${userMoon} moon reads situations fast and ${partnerName}'s ${partnerMoon} moon knows it. They're waiting to see what you do with what you already know. Fire moons respond to boldness, not subtlety.`, action: `Be direct with ${partnerName}. Ask them out, plainly.` },
    ],
    relationship: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are both Fire — you both lead, both need space, and both hate being told what to do. The relationship works when you're on the same team. Right now, check: are you competing or collaborating?`, action: `Pick one thing to do together today, not against each other.` },
      { insight: `${userName}, Fire plus Fire in a relationship is extraordinary chemistry and extraordinary volatility. ${partnerName}'s ${partnerMoon} moon needs autonomy as much as yours does. The love is real — what requires work is giving each other room to burn separately.`, action: `Give ${partnerName} one hour of uninterrupted space today, no guilt.` },
      { insight: `${userName}, your ${userMoon} moon can outshine ${partnerName}'s ${partnerMoon} moon without meaning to. Both of you need to feel seen. The question isn't who loves whom more — it's whether you're celebrating each other or competing with each other.`, action: `Say something genuinely admiring about ${partnerName} today.` },
      { insight: `${userName}, two Fire moons in a relationship means the warmth is constant but so is the risk of burning out. ${partnerName}'s ${partnerMoon} moon runs hot when they feel unseen. Don't assume they know you see them — say it.`, action: `Tell ${partnerName} specifically what you love about them right now.` },
    ],
    ex: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon both burned bright — and that's exactly why the ending hurt so much. Fire moons don't do moderate anything, including endings. What you're feeling isn't weakness. It's proof of what was real.`, action: `Stop replaying the ending. Write down what you actually learned from it.` },
      { insight: `${userName}, the pull you feel toward ${partnerName} is ${userMoon} moon chasing the heat it already knows. ${partnerMoon} moon feels it too — Fire moons leave marks. But returning to familiar fire isn't the same as returning to something better.`, action: `Ask yourself honestly: is it them you miss, or the feeling?` },
      { insight: `${userName}, two Fire moons post-breakup is volatile. The anger and the longing coexist because they're the same energy. ${partnerName}'s ${partnerMoon} moon is just as stirred up as yours. Don't mistake activation for readiness.`, action: `Channel the energy into something that's yours alone today.` },
      { insight: `${userName}, your ${userMoon} moon isn't built to quietly accept an ending. Neither is ${partnerName}'s ${partnerMoon} moon. The fact that this still burns doesn't mean you should go back — it means you haven't fully reclaimed yourself yet.`, action: `Do one thing today that reminds you who you are without ${partnerName}.` },
    ],
  };

  // ── Fire + Earth ─────────────────────────────────────────────────────────────
  const FEarth: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, your ${userMoon} moon moves fast and ${partnerName}'s ${partnerMoon} moon moves slow. That's not incompatibility — it's friction. You interpret their caution as disinterest. They interpret your urgency as pressure. Neither of you is reading it right.`, action: `Slow down to ${partnerName}'s pace for just today. Notice what you see.` },
      { insight: `${userName}, Fire moon meets Earth moon in a situationship and the result is that you're pushing for answers ${partnerName} isn't ready to give. ${partnerMoon} moon doesn't move until they're certain. Your ${userMoon} moon moves before they're certain. That gap is the whole problem.`, action: `Stop asking "what are we?" — let them come to you with an answer.` },
      { insight: `${userName}, your ${userMoon} moon is picking up real warmth from ${partnerName}. Their ${partnerMoon} moon isn't cold — it's cautious. Earth moons show love through reliability, not declarations. The question is whether you can value consistency the same way you value spark.`, action: `Notice what ${partnerName} does, not just what they say.` },
      { insight: `${userName}, your ${userMoon} moon wants things to catch fire and ${partnerName}'s ${partnerMoon} moon is waiting to be sure the foundation is solid. That timing gap is real. You can accelerate it by making ${partnerName} feel safe, not by pushing harder.`, action: `Create one moment of zero pressure with ${partnerName} today.` },
    ],
    crush: [
      { insight: `${userName}, your ${userMoon} moon is drawn to ${partnerName}'s ${partnerMoon} moon because Earth grounds Fire in a way Fire can't ground itself. They're not playing hard to get — they're genuinely assessing. Show them you're consistent, not just interested.`, action: `Follow through on something small you said you'd do for ${partnerName}.` },
      { insight: `${userName}, Fire moon crushing on an Earth moon: you're attracted to their steadiness and they're quietly drawn to your energy. ${partnerName}'s ${partnerMoon} moon won't be swept off their feet — they need to trust you first.`, action: `Be someone ${partnerName} can rely on, even in a small way today.` },
      { insight: `${userName}, your ${userMoon} moon wants to move fast and ${partnerName}'s ${partnerMoon} moon wants to move right. Match their pace and you'll get further than pushing. Earth moons remember the person who didn't rush them.`, action: `Show up without an agenda when you're around ${partnerName} today.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon notices everything — your follow-through, your consistency, whether you say what you mean. Your ${userMoon} moon's spontaneity is attractive, but what will actually win them over is reliability.`, action: `Check in on ${partnerName} simply, without expecting anything back.` },
    ],
    relationship: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon have a productive friction. You spark ideas and they build them. You feel things intensely and they process them steadily. When you respect that difference instead of fighting it, this relationship is extraordinary.`, action: `Let ${partnerName} take their time on something today without rushing them.` },
      { insight: `${userName}, your ${userMoon} moon can read ${partnerName}'s ${partnerMoon} moon quietness as withdrawal. It isn't. Earth moons go inward to process, not to pull away. The worst thing you can do is chase them when they need stillness.`, action: `Give ${partnerName} quiet today. Let them come back to you.` },
      { insight: `${userName}, Fire and Earth in a relationship: you bring the heat, ${partnerName} brings the ground. When that dynamic is balanced it's one of the most durable combinations in any chart. When it's off-balance, you feel unseen and they feel overwhelmed.`, action: `Name one thing ${partnerName} does that grounds you. Tell them.` },
      { insight: `${userName}, your ${userMoon} moon is expressive and ${partnerName}'s ${partnerMoon} moon keeps a lot inside. The disparity isn't a problem — it becomes a problem when you stop asking and start assuming. ${partnerMoon} moon has more going on than they show.`, action: `Ask ${partnerName} one real question today and actually listen to the answer.` },
    ],
    ex: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon had a fundamental tension: you wanted fire to spread and they wanted fire to be contained. Neither was wrong. The ending wasn't a failure — it was two different needs reaching their limit.`, action: `Write down what you needed that wasn't met. Stop assigning blame.` },
      { insight: `${userName}, you miss ${partnerName}'s ${partnerMoon} moon steadiness — the way Earth grounded your Fire. That's real. But missing it doesn't mean the relationship was right for where you both are now. Grief and regret aren't the same thing.`, action: `Identify one trait you want to find in someone who's actually right for you.` },
      { insight: `${userName}, your ${userMoon} moon is still circling ${partnerName} because Earth moons leave an imprint — they're reliable even in memory. But ${partnerName}'s ${partnerMoon} moon has already begun the slow, quiet process of rebuilding. You should do the same.`, action: `Start one small thing today that is entirely yours, post-${partnerName}.` },
      { insight: `${userName}, the Fire-Earth dynamic with ${partnerName} was real chemistry that required real work. You may have moved too fast for their ${partnerMoon} moon, or they may have moved too slow for yours. Either way, the lesson is about pacing, not about love.`, action: `Be honest with yourself about whose pace you were on, and why.` },
    ],
  };

  // ── Fire + Air ───────────────────────────────────────────────────────────────
  const FAir: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are both high-energy — you create sparks, they fan them. The situationship continues because it's exciting and neither of you wants to turn it into something ordinary. But "exciting" and "real" aren't opposites.`, action: `Have one conversation with ${partnerName} that goes deeper than banter.` },
      { insight: `${userName}, Fire and Air in a situationship is the most fun and the least stable. ${partnerName}'s ${partnerMoon} moon is brilliant at keeping things light because commitment feels like a cage to Air moons. Your ${userMoon} moon wants more fire, not less. That tension is coming to a head.`, action: `Say plainly what you want, and let ${partnerName} respond honestly.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon have been circling each other at a safe altitude. Air feeds Fire but stays unburned. You need to come down from the intellectual to the emotional — both of you.`, action: `Skip the witty exchange. Say something real to ${partnerName} today.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon talks everything into perspective and out of urgency. Your ${userMoon} moon feels the urgency. The situationship works for ${partnerName} right now because they've rationalised it. You haven't. That's the difference.`, action: `Stop accepting their rationalisations. Name what you actually want.` },
    ],
    crush: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are a natural match — they think, you feel, and the combination is magnetic. The crush is mutual, even if ${partnerName} hasn't said it. Air moons express interest through engagement, not declaration.`, action: `Pay attention to how much ${partnerName} engages with you. That's your answer.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon is attracted to your ${userMoon} energy — your directness, your warmth, the way you commit to things. They won't say it in a straight line, but they're circling back to you. Notice it.`, action: `Respond to the next thing ${partnerName} says with full attention, no distractions.` },
      { insight: `${userName}, Fire and Air moons in a crush dynamic: the chemistry is obvious to everyone watching. ${partnerName}'s ${partnerMoon} moon has already filed you under "interesting" — they're deciding if you're safe to want. Make yourself easy to want.`, action: `Be warm and uncomplicated the next time you see ${partnerName}.` },
      { insight: `${userName}, your ${userMoon} moon is intense in ways ${partnerName}'s ${partnerMoon} moon finds compelling and slightly terrifying. Air moons want to understand everything before they commit. Give them enough to think about, not enough to analyse you away.`, action: `Share something real but not overwhelming with ${partnerName} today.` },
    ],
    relationship: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon have one of the most naturally compatible dynamics — Air feeds your Fire and your Fire keeps Air from drifting. What erodes this is when ${partnerName}'s ${partnerMoon} moon intellectualises what you need felt.`, action: `Tell ${partnerName} when you need to be felt, not fixed.` },
      { insight: `${userName}, Fire and Air in a relationship creates constant forward motion. The risk is that you both move so fast you skip the stillness. ${partnerName}'s ${partnerMoon} moon needs novelty; your ${userMoon} moon needs depth. Check that you're getting both.`, action: `Slow down today. Have a conversation that goes somewhere real.` },
      { insight: `${userName}, your ${userMoon} moon gets frustrated when ${partnerName}'s ${partnerMoon} moon talks around emotion instead of into it. That's Air moon processing — they're not dismissing you, they're mapping it. Let them map, then ask them to feel it with you.`, action: `When ${partnerName} analyses something, say "how does it make you feel?" and wait.` },
      { insight: `${userName}, you and ${partnerName} work because you light each other up. The maintenance this relationship needs is making sure neither of you mistakes ease for depth. Fire and Air can get very comfortable at the surface.`, action: `Go one layer deeper with ${partnerName} than usual today.` },
    ],
    ex: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon had real electricity. The problem with Fire-Air endings is that ${partnerName} intellectualised the breakup into something that made sense to them — but your ${userMoon} moon is still on fire about it.`, action: `Stop trying to make it make sense. Let it be what it was.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon has moved the story along — Air moons don't linger in feeling. Your ${userMoon} moon is still burning because Fire moons feel endings fully. You're not behind. You're just different.`, action: `Let yourself finish grieving at your own pace, not theirs.` },
      { insight: `${userName}, the Air-Fire dynamic with ${partnerName} was fun until it wasn't. Air moon detachment lands differently on a Fire moon — like being dropped mid-flight. What you're processing is real. What you shouldn't do is reach out hoping for the warmth that's no longer on offer.`, action: `Resist reaching out today. See how you feel by evening.` },
      { insight: `${userName}, your ${userMoon} moon still talks to ${partnerName}'s ${partnerMoon} moon in your head — playing arguments, replaying conversations. That's Fire-Air chemistry refusing to end cleanly. Give it a final word in your journal, not in a message.`, action: `Write the unsent message. Don't send it.` },
    ],
  };

  // ── Fire + Water ─────────────────────────────────────────────────────────────
  const FWater: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, your ${userMoon} moon is direct and ${partnerName}'s ${partnerMoon} moon is everything that's unsaid. The situationship exists in that gap — you can't read them clearly and they can't say things plainly. That's not bad energy, it's a Water moon protecting itself.`, action: `Ask ${partnerName} one direct question and sit with their answer without pushing.` },
      { insight: `${userName}, Fire moon and Water moon in a situationship: you bring heat, they bring depth, and the combination is intoxicating but unstable. ${partnerName}'s ${partnerMoon} moon is picking up on everything you're not saying. They know more than you think.`, action: `Say the thing you've been keeping to yourself. It's already known.` },
      { insight: `${userName}, your ${userMoon} moon is reading ${partnerName}'s ${partnerMoon} moon as distant or inconsistent. Water moons go tidal — they pull close, they pull back, and it doesn't always mean something changed. Don't mistake the tide for rejection.`, action: `Stop tracking the pattern. Meet ${partnerName} where they are today.` },
      { insight: `${userName}, the hot-and-cold you're experiencing with ${partnerName} is textbook Water moon behaviour — they feel everything and share very little. Your ${userMoon} moon's directness makes them feel exposed. Slow down and let them feel safe.`, action: `Create no-pressure space with ${partnerName} today. Don't ask for anything.` },
    ],
    crush: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon is one of the most emotionally charged combinations in any chart. The attraction is deep and quiet on their side. ${partnerName} is watching how you handle emotion — that's what matters to Water moons.`, action: `Show ${partnerName} emotional depth, not just enthusiasm.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon has already decided how they feel about you — Water moons are intuitive and fast. What they haven't decided is whether it's safe to act on it. Make yourself feel safe, not impressive.`, action: `Be consistent with ${partnerName}. Show up the same way every time.` },
      { insight: `${userName}, your ${userMoon} moon is drawn to the mystery of ${partnerName}'s ${partnerMoon} moon. That mystery is real — Water moons keep their inner world private until they trust completely. The way to earn that trust is patience, not pursuit.`, action: `Take one step back today. Let ${partnerName} come toward you.` },
      { insight: `${userName}, Fire and Water in a crush is magnetic but requires translation. You express attraction directly; ${partnerName}'s ${partnerMoon} moon expresses it through care, presence, small things. Read what they do, not just what they say.`, action: `Notice the small things ${partnerName} does. Those are the declarations.` },
    ],
    relationship: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are opposites in the best and hardest way. You bring heat to their depth; they bring depth to your heat. When this is working, it's profound. When it's not, Fire feels extinguished and Water feels evaporated.`, action: `Tell ${partnerName} one thing you genuinely admire about how they feel things.` },
      { insight: `${userName}, your ${userMoon} moon's directness can overwhelm ${partnerName}'s ${partnerMoon} moon without you meaning it to. Water moons absorb everything. Make sure what you're putting into the space between you is something worth absorbing.`, action: `Be gentle today. Not quiet — gentle. There's a difference.` },
      { insight: `${userName}, Fire and Water in a relationship generates enormous intimacy when both people are in it. The problem arises when ${partnerName}'s ${partnerMoon} moon retreats inward and your ${userMoon} moon reads it as rejection. It's not. It's how they recharge.`, action: `Ask ${partnerName} if they need space or connection right now. Accept the answer.` },
      { insight: `${userName}, your ${userMoon} moon needs warmth returned. ${partnerName}'s ${partnerMoon} moon gives warmth through depth, care, and presence — not always through words or reciprocal heat. Learn each other's language here. It's worth it.`, action: `Notice how ${partnerName} shows love today, not how you wish they would.` },
    ],
    ex: [
      { insight: `${userName}, Fire and Water endings are rarely clean. ${partnerName}'s ${partnerMoon} moon felt everything and showed very little — which means you may not know how deep the grief went on their side. Your ${userMoon} moon ran hot in the relationship and still does. Both feelings are valid.`, action: `Stop trying to decipher what ${partnerName} felt. Focus on what you feel.` },
      { insight: `${userName}, your ${userMoon} moon is still reaching for the depth ${partnerName}'s ${partnerMoon} moon offered. That was real. But Water moons, once they decide it's over, build walls that Fire cannot burn through. Respect the wall.`, action: `Redirect the energy you'd spend on ${partnerName} toward something that builds you up.` },
      { insight: `${userName}, the intensity with ${partnerName} was real — Fire-Water chemistry is among the most consuming. The ending hurts because it felt like a loss of something fated, not just chosen. It was both. And now the work is choosing yourself.`, action: `Do one thing today that is purely, selfishly for your own healing.` },
      { insight: `${userName}, your ${userMoon} moon is replaying moments with ${partnerName}'s ${partnerMoon} moon trying to find where it went wrong. Water moons don't break because of single moments — they break slowly, quietly, after many unspoken things. The "where" isn't one place.`, action: `Let go of finding the moment. The whole story mattered.` },
    ],
  };

  // ── Earth + Earth ─────────────────────────────────────────────────────────────
  const EE: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are both Earth — you both move slowly, value security, and resist naming things until you're sure. The situationship exists because you're both waiting for certainty that neither of you will create until you risk something.`, action: `Be the one who risks something small today. Earth moons respect that.` },
      { insight: `${userName}, two Earth moons in a situationship is two people building the same wall and calling it caution. ${partnerName}'s ${partnerMoon} moon is not uninterested — they're protecting themselves the same way you are. One of you has to acknowledge the obvious.`, action: `Acknowledge what this actually is when you see ${partnerName} next.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon have been circling the same decision for a while. Earth moons don't like being rushed but they like ambiguity even less. The ambiguity you're both tolerating has a cost.`, action: `Put a quiet deadline on your own patience. Not theirs — yours.` },
      { insight: `${userName}, the slow burn with ${partnerName} is real Earth moon courtship — methodical, careful, respectful. That's not nothing. But there comes a point where deliberate becomes avoidant. You're close to that point.`, action: `Take one concrete step toward clarity with ${partnerName} today.` },
    ],
    crush: [
      { insight: `${userName}, Earth moon crushing on Earth moon is the most understated attraction in the zodiac. ${partnerName}'s ${partnerMoon} moon knows you're interested and is interested back — but both of you will wait forever for the other to move first.`, action: `Make one small, clear move toward ${partnerName} today. Clarity is kind.` },
      { insight: `${userName}, you and ${partnerName} both prefer to be certain before you act. In a crush, that certainty never arrives — someone has to create it. ${partnerName}'s ${partnerMoon} moon will deeply respect being chosen, not just waited on.`, action: `Choose ${partnerName} openly. Do something that makes your interest clear.` },
      { insight: `${userName}, your ${userMoon} moon is building a very stable case for ${partnerName} in your head. ${partnerName}'s ${partnerMoon} moon is doing the same. This mutual, quiet assessment could go on indefinitely unless someone acts.`, action: `Act today. Earth moons reward consistency and courage in equal measure.` },
      { insight: `${userName}, Earth moon to Earth moon: the connection between you and ${partnerName} has substance to it — it isn't just chemistry. That's rare. Don't let the same caution that protects you keep you from something genuinely good.`, action: `Reach out to ${partnerName} simply: no overthinking, no agenda.` },
    ],
    relationship: [
      { insight: `${userName}, two Earth moons in a relationship is one of the most stable foundations there is — and one of the most vulnerable to complacency. You and ${partnerName} build trust slowly and it holds. The risk is mistaking comfort for connection.`, action: `Introduce something new into your routine with ${partnerName} today.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon don't need drama to love each other — which is a gift. What you do need is to keep choosing each other actively, not just habitually. Commitment and presence aren't the same.`, action: `Do one thing with ${partnerName} today that is a choice, not just a habit.` },
      { insight: `${userName}, Earth and Earth in a relationship can go very deep or stay very surface — both without realising it. Your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are both capable of profound intimacy. Are you actually there, or are you comfortable?`, action: `Ask ${partnerName} something you've never asked them before.` },
      { insight: `${userName}, you and ${partnerName} build things together well. The love is expressed through acts, reliability, presence. Make sure the reliability hasn't replaced the tenderness. Earth moons need to feel safe and wanted, not just stable.`, action: `Be tender with ${partnerName} today, not just dependable.` },
    ],
    ex: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon built something real. Earth moon endings carry tremendous grief because so much was invested — not just emotionally, but practically, over time. The loss is proportional to the depth.`, action: `Acknowledge how much you built. Then acknowledge it's okay that it's over.` },
      { insight: `${userName}, two Earth moons post-breakup don't bounce back fast. ${partnerName}'s ${partnerMoon} moon is processing in the slow, thorough way Earth moons do. So are you. That's not failure — it's integrity.`, action: `Give yourself permission to grieve at exactly the pace you're going.` },
      { insight: `${userName}, you miss ${partnerName}'s ${partnerMoon} moon steadiness — the security of knowing they were there. Earth moon grief looks a lot like numbness before it looks like sadness. Don't skip it.`, action: `Feel what you're actually feeling today, not what you think you should.` },
      { insight: `${userName}, the question with ${partnerName} isn't whether it was good — it clearly was. The question is whether what made it good is still possible, for both of you, now. Your ${userMoon} moon already knows the answer.`, action: `Trust what you already know, even if it's not what you want to know.` },
    ],
  };

  // ── Earth + Air ──────────────────────────────────────────────────────────────
  const EAir: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, your ${userMoon} moon wants to know where this is going and ${partnerName}'s ${partnerMoon} moon prefers to keep things open-ended. That's not cruelty — it's genuinely how Air moons process intimacy. The question is whether "open-ended" works for you, honestly.`, action: `Be honest with yourself about what you actually need from this.` },
      { insight: `${userName}, Earth meets Air in a situationship and the tension is about pace. Your ${userMoon} moon builds; ${partnerName}'s ${partnerMoon} moon explores. Neither mode is wrong, but they don't automatically align. You need to name the mismatch.`, action: `Tell ${partnerName} what you need, not what you think they can handle.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon keeps the situation stimulating and undefined. Your ${userMoon} moon is running out of patience for undefined. The situationship is lasting because you haven't set a limit for yourself.`, action: `Decide today what your actual limit is. You don't have to announce it — just know it.` },
      { insight: `${userName}, Air moon unpredictability is landing on your ${userMoon} moon as inconsistency. ${partnerName} isn't unreliable by intention — they're just genuinely in motion. The question is whether you can build something with someone who's still figuring out their direction.`, action: `Ask ${partnerName} directly what they're actually looking for right now.` },
    ],
    crush: [
      { insight: `${userName}, your ${userMoon} moon is attracted to ${partnerName}'s ${partnerMoon} moon because Air brings lightness to Earth's seriousness. They make things feel possible. ${partnerName} is drawn to your groundedness for the same reason — you make them feel like things can last.`, action: `Be the anchor in a moment where ${partnerName} needs steadiness today.` },
      { insight: `${userName}, Earth and Air in a crush: you offer ${partnerName}'s ${partnerMoon} moon something they secretly want — rootedness, follow-through, someone who means what they say. Show that side of yourself, not just the interested side.`, action: `Do one thing today that shows ${partnerName} you follow through.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon can be hard to read because Air moons are interested in everyone. Look for whether they return to you — that's the signal. Your ${userMoon} moon wants certainty, but with Air moons, pattern is the certainty.`, action: `Notice if ${partnerName} keeps coming back to you. Count the returns, not the absences.` },
      { insight: `${userName}, your ${userMoon} moon has been carefully building a picture of ${partnerName}. What you've seen is real. ${partnerName}'s ${partnerMoon} moon is quick-moving but they respect people who know their own mind. Be decisive.`, action: `Make your interest clear in a simple, direct way today.` },
    ],
    relationship: [
      { insight: `${userName}, Earth and Air in a relationship is the combination that builds things and explores them at the same time. Your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon balance each other if you let them. The friction comes when you need roots and they need wings simultaneously.`, action: `Find one thing you can build together that also has room for ${partnerName}'s freedom.` },
      { insight: `${userName}, your ${userMoon} moon needs reliability from ${partnerName}'s ${partnerMoon} moon. ${partnerName} gives it differently — through ideas, engagement, attention — not always through consistency of schedule. Learn to recognise their version of showing up.`, action: `Name one way ${partnerName} shows up that you usually overlook.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon can seem distant when they're actually just in their head. Your ${userMoon} moon reads absence as withdrawal. Ask before you assume — it's almost always thinking, not leaving.`, action: `Next time ${partnerName} seems distant, ask where their mind is before assuming the worst.` },
      { insight: `${userName}, Earth and Air relationships last when both people understand they aren't trying to make the other person more like them. Your stability is the gift. ${partnerName}'s curiosity is the gift. Appreciate what you don't have.`, action: `Tell ${partnerName} something specific you appreciate about how differently they see the world.` },
    ],
    ex: [
      { insight: `${userName}, your ${userMoon} moon invested in ${partnerName}'s ${partnerMoon} moon with real depth — Earth moons don't do shallow investment. The ending is hard because ${partnerName}'s Air moon may have moved on faster than their behaviour suggested. That disparity is real and worth naming.`, action: `Name the disparity to yourself. You don't have to accept the timeline they set.` },
      { insight: `${userName}, Earth moon processing an Air moon loss is slow and Air moon is already onto the next thought. Don't compare your timeline to ${partnerName}'s. You grieve in proportion to what you gave.`, action: `Grieve at your pace. Don't rush to be "over it" because they seem fine.` },
      { insight: `${userName}, you miss the lightness ${partnerName}'s ${partnerMoon} moon brought to your ${userMoon} seriousness. That's real. But what you should be building toward is someone who brings lightness and also stays. Those aren't mutually exclusive.`, action: `Write down what you'd keep from this relationship and what you'd do differently.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon was never going to stay planted the way your ${userMoon} moon needed. That's not a flaw in either of you — it's a fundamental difference in what "home" means. Your ${userMoon} moon deserves someone who wants to come home.`, action: `Get clear on what home looks like for you. Build toward that.` },
    ],
  };

  // ── Earth + Water ─────────────────────────────────────────────────────────────
  const EWater: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, Earth and Water is one of the most naturally nurturing combinations — and one of the most enabling in a situationship. Your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon both avoid confrontation. That's why this hasn't been named.`, action: `Name it today. One of you has to, and it might as well be you.` },
      { insight: `${userName}, your ${userMoon} moon is providing ${partnerName}'s ${partnerMoon} moon with a stability they find deeply comforting. That's beautiful — and it means ${partnerName} may have less urgency to define things. You're already giving them what they need. Are you getting what you need?`, action: `Honestly ask yourself: is this situationship meeting your needs, or only theirs?` },
      { insight: `${userName}, Water moon meets Earth moon in a situationship: ${partnerName} feels safe with you and you're probably the only person they let close right now. That's intimacy. Whether it's the intimacy you want is the question.`, action: `Tell ${partnerName} what you need from this, not just what you're willing to give.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon have built a quiet, real closeness. Earth and Water both cherish emotional safety above everything. The problem is that "safe" can become a reason to avoid growth. This is that moment.`, action: `Push past the comfortable. Say one thing that needs saying.` },
    ],
    crush: [
      { insight: `${userName}, your ${userMoon} moon is one of the few things that genuinely comforts ${partnerName}'s ${partnerMoon} moon. Water moons are drawn to Earth for the same reason water carves valleys — they find their level. ${partnerName} feels more like themselves around you.`, action: `Be exactly who you are around ${partnerName} today. No performance.` },
      { insight: `${userName}, Earth and Water in a crush dynamic: you're probably already more than a crush to ${partnerName}'s ${partnerMoon} moon. Water moons don't let just anyone in. The question is who says something first.`, action: `Say something first. You have more information than you think.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon is drawn to your groundedness and you're drawn to their emotional depth. That's not surface attraction — it's recognition. Don't talk yourself out of it.`, action: `Stop second-guessing. Make a move toward ${partnerName} today.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon speak the same emotional language — care expressed through action, not performance. ${partnerName} has noticed. They're waiting to see if it's consistent.`, action: `Be consistent. Show up for ${partnerName} in a small, real way today.` },
    ],
    relationship: [
      { insight: `${userName}, Earth and Water in a relationship is the most genuinely nurturing combination. Your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon both give in ways that actually land. The risk is that you're both so focused on the other's wellbeing that neither asks for their own needs to be met.`, action: `Ask ${partnerName} what they need today. Then tell them what you need.` },
      { insight: `${userName}, your ${userMoon} moon's steadiness is a profound gift to ${partnerName}'s ${partnerMoon} moon. ${partnerName}'s emotional depth is a profound gift to you. The question isn't whether you're compatible — it's whether you're still choosing each other consciously.`, action: `Choose ${partnerName} consciously today. Say or do something that makes it clear.` },
      { insight: `${userName}, Earth and Water run the risk of becoming a care-giving dynamic where both people put the relationship first and themselves last. Make sure you have something that's just yours — and make sure ${partnerName} does too.`, action: `Encourage ${partnerName} to do one thing just for themselves today.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon have a quiet depth that most relationships never reach. Don't take it for granted. Water moons need to be reminded they're precious, not just stable.`, action: `Remind ${partnerName} today that you see them, not just the relationship.` },
    ],
    ex: [
      { insight: `${userName}, Earth and Water breakups tend to be the quietest and the hardest. ${partnerName}'s ${partnerMoon} moon pulled back slowly over time; your ${userMoon} moon held on past the point of certainty. Both are understandable. The gap between what you hoped for and what happened is where the grief lives.`, action: `Sit with the gap today. Don't fill it with hope or anger — just feel it.` },
      { insight: `${userName}, you miss the emotional depth ${partnerName}'s ${partnerMoon} moon brought — the sense of being truly understood. Earth moons don't find that easily. But the loss of one deep connection doesn't mean the next one isn't out there.`, action: `Write down what emotional depth looks like to you. You'll need this.` },
      { insight: `${userName}, your ${userMoon} moon nurtured ${partnerName}'s ${partnerMoon} moon in ways they may not have fully articulated. That investment was real. The return on it is the capacity you've built to love that way. Take it with you.`, action: `Recognise what you learned about loving someone. That doesn't leave with ${partnerName}.` },
      { insight: `${userName}, Water moon endings tend to arrive before they're announced. ${partnerName}'s ${partnerMoon} moon decided and grieved privately long before it became visible. What you're processing now is likely real on both sides, just at different timings.`, action: `Stop trying to sync timelines with ${partnerName}. Your grief is yours.` },
    ],
  };

  // ── Air + Air ────────────────────────────────────────────────────────────────
  const AA: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, two Air moons in a situationship is two people who have talked about everything except the actual thing. ${partnerName}'s ${partnerMoon} moon and your ${userMoon} moon can intellectualise intimacy into something that never quite lands. Stop discussing and start deciding.`, action: `Have one conversation with ${partnerName} where no topic is deflected.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are both brilliant at keeping options open. The situationship suits both of you — and that's the problem. Neither of you is uncomfortable enough to demand more. Are you actually happy with this?`, action: `Ask yourself honestly if "comfortable" is enough. Then ask ${partnerName}.` },
      { insight: `${userName}, Air moon to Air moon: you've both rationalised this situation beautifully. You've got reasons for why it works, reasons for why a label isn't necessary, reasons for the pace. The question is whether the reasons are true or just clever.`, action: `Challenge your own reasoning today. Is this actually what you want?` },
      { insight: `${userName}, two Air moons drift toward each other and apart with equal ease. ${partnerName}'s ${partnerMoon} moon is drawn to yours — but drawn isn't decided. Make a decision and communicate it clearly.`, action: `Communicate one clear thing to ${partnerName} today. Not layered. Clear.` },
    ],
    crush: [
      { insight: `${userName}, Air moon crushing on Air moon is the most mentally stimulating attraction — and the hardest to escalate. You and ${partnerName} can talk for hours and never say what you mean. Someone has to break from cleverness into honesty.`, action: `Say something to ${partnerName} that doesn't have a retreat built into it.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon have been exchanging signals in a language only you two understand. That's Air moon attraction — all reference, all subtext. But subtext isn't a relationship. Make it text.`, action: `Be explicit about your interest. Just once. See what ${partnerName} does with it.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon finds you genuinely fascinating — Air moons are hard to impress and you've managed it. What they need now is evidence that you'll still be interesting when it's real and slightly uncomfortable.`, action: `Be real with ${partnerName} today, not just interesting.` },
      { insight: `${userName}, you and ${partnerName} are orbiting each other at the same altitude. At some point, one of you has to come down. Air moons land when they feel intellectually and emotionally met. You meet each other — act on it.`, action: `Ask ${partnerName} to do something specific with you. Make it a plan, not a concept.` },
    ],
    relationship: [
      { insight: `${userName}, two Air moons in a relationship have the best conversations of anyone they know — and sometimes use those conversations to avoid the harder emotional work. ${partnerName}'s ${partnerMoon} moon and your ${userMoon} moon are both capable of depth. Go there.`, action: `Have a conversation today that isn't about ideas — just about how you both actually feel.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon need intellectual stimulation to stay engaged — that's not a flaw, it's your love language. Make sure you're still genuinely curious about each other, not just comfortable.`, action: `Ask ${partnerName} something about their inner world you haven't asked before.` },
      { insight: `${userName}, Air and Air in a relationship can drift into parallel orbits — present, engaged, but not actually close. Check in: are you two in the relationship, or just around it?`, action: `Be physically and emotionally present with ${partnerName} for one uninterrupted hour today.` },
      { insight: `${userName}, you and ${partnerName} communicate well by almost any standard — but Air moons can use fluency to stay at a safe distance. Real intimacy with ${partnerName}'s ${partnerMoon} moon means being willing to be uncertain in front of them.`, action: `Share something unresolved or uncertain with ${partnerName}. Not polished — raw.` },
    ],
    ex: [
      { insight: `${userName}, Air moon endings are the most cerebral and the most unresolved. ${partnerName}'s ${partnerMoon} moon has already constructed a narrative about what happened. So have you. Both narratives are incomplete.`, action: `Release the need to have the final, correct version of what happened.` },
      { insight: `${userName}, you and ${partnerName} probably talked the relationship into and out of existence multiple times. Air moons can think their way out of anything, including something good. Grieve without analysing every decision point.`, action: `Feel it today without explaining it to yourself.` },
      { insight: `${userName}, your ${userMoon} moon is still running conversations with ${partnerName}'s ${partnerMoon} moon in your head — making arguments, finding the right words. That's Air moon grief. The argument you win in your head doesn't change anything real.`, action: `Stop the internal debate. Write one sentence that ends it and let it sit.` },
      { insight: `${userName}, two Air moons post-breakup: you've probably both moved on mentally before emotionally. Check that you've actually processed this, not just explained it. Your ${userMoon} moon deserves more than a well-reasoned acceptance.`, action: `Ask yourself: have I actually felt this, or just understood it?` },
    ],
  };

  // ── Air + Water ──────────────────────────────────────────────────────────────
  const AWater: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, your ${userMoon} moon is in your head and ${partnerName}'s ${partnerMoon} moon is in their feelings — you're both avoiding the middle ground where those two things have to meet. The situationship lives in that avoidance. Someone has to bridge it.`, action: `Bridge it today. Say something that's both honest and emotionally real.` },
      { insight: `${userName}, Air moon and Water moon in a situationship creates a specific dynamic: you analyse what ${partnerName} feels without feeling it yourself, and ${partnerName} feels without being able to articulate it. That gap keeps the situation ambiguous.`, action: `Stop analysing ${partnerName}'s feelings. Ask them directly.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon is more invested than they're showing. Water moons protect what they care about by going quiet. Your ${userMoon} moon is reading the quiet as low interest. It's probably the opposite.`, action: `Create a safe space for ${partnerName} to say what they're actually feeling.` },
      { insight: `${userName}, your ${userMoon} moon keeps the situation alive with ideas, plans, and possibility. ${partnerName}'s ${partnerMoon} moon stays because of feeling. Those are different reasons. Make sure you're actually on the same page about what this is.`, action: `Ask ${partnerName} why they're still in this. Listen for feelings, not plans.` },
    ],
    crush: [
      { insight: `${userName}, your ${userMoon} moon is drawn to ${partnerName}'s ${partnerMoon} moon because Water offers emotional depth that Air craves but struggles to create alone. ${partnerName} is drawn to your clarity and movement. This is real mutual attraction.`, action: `Let your interest be visible to ${partnerName} today. Drop the ambiguity.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon can feel what you feel before you've said it — Water moons are intuitive. They already know. They're waiting to see if you'll be honest about it.`, action: `Be honest about it. ${partnerName} already knows anyway.` },
      { insight: `${userName}, Air moon and Water moon attraction is the "can't explain it" kind — because the explanation would be in two different languages. ${partnerName} feels something real. You think something real. Put them together.`, action: `Say the thought and the feeling in the same sentence to ${partnerName}.` },
      { insight: `${userName}, your ${userMoon} moon's lightness is exactly what ${partnerName}'s ${partnerMoon} moon finds refreshing. You make their emotional world feel less heavy. That's a gift to them — let it be the thing that moves you toward each other.`, action: `Be the lightness ${partnerName} needs today, intentionally.` },
    ],
    relationship: [
      { insight: `${userName}, Air and Water in a relationship: you provide the perspective that gets ${partnerName}'s ${partnerMoon} moon out of emotional spirals; ${partnerName} provides the emotional depth that keeps your ${userMoon} moon from floating away. This works when both gifts are honoured.`, action: `Honour ${partnerName}'s emotional depth today, not just manage it.` },
      { insight: `${userName}, your ${userMoon} moon can sometimes feel to ${partnerName}'s ${partnerMoon} moon like they're being "solved" rather than loved. Air moons process through thinking; Water moons need presence. Make sure your engagement is warmth, not analysis.`, action: `When ${partnerName} shares something emotional today, just be with it. Don't fix it.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon needs to know you feel things, not just understand them. Show vulnerability today — not as a tactic, as a truth.`, action: `Share something you're genuinely uncertain or scared about with ${partnerName}.` },
      { insight: `${userName}, Air and Water relationships are at their best when both people stop trying to convert each other — you stop making ${partnerName} feel less, they stop making you feel cold. Meet in the middle.`, action: `Find the middle today: something felt and thought, together.` },
    ],
    ex: [
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon parted with unfinished business on both sides. You have the words for it; ${partnerName} has the feeling of it. That's why it feels incomplete — it exists in two languages that never fully translated.`, action: `Write your version. Don't send it. Let the incompleteness be okay.` },
      { insight: `${userName}, Air moon grief is thought-based; ${partnerName}'s ${partnerMoon} moon grief is somatic. You're processing in a fundamentally different way and timeline. Don't measure your healing against theirs.`, action: `Process in your language — think it through, write it down, talk it out. That's valid.` },
      { insight: `${userName}, you gave ${partnerName}'s ${partnerMoon} moon something real — lightness, perspective, clarity. They gave your ${userMoon} moon something real — depth, feeling, presence. The exchange was genuine. The ending doesn't cancel it.`, action: `Let the good have been good. Stop rewriting it.` },
      { insight: `${userName}, your ${userMoon} moon has already begun rationalising the relationship into a clean story. ${partnerName}'s ${partnerMoon} moon is still feeling it. Your healing is ahead of schedule in one dimension and behind in another. Check both.`, action: `Check the emotional layer today, not just the cognitive one.` },
    ],
  };

  // ── Water + Water ─────────────────────────────────────────────────────────────
  const WW: Record<RelationshipType, HeroVariant[]> = {
    situationship: [
      { insight: `${userName}, two Water moons in a situationship: both of you feel everything and say almost nothing directly. ${partnerName}'s ${partnerMoon} moon and your ${userMoon} moon have built tremendous emotional intimacy and then refused to name it. The silence isn't mysterious anymore — it's a choice.`, action: `Break the silence. Say one true thing to ${partnerName} today.` },
      { insight: `${userName}, your ${userMoon} moon knows exactly how ${partnerName}'s ${partnerMoon} moon feels — Water moons read each other precisely. The situationship continues because saying it out loud makes it real and real means it could end. That fear is valid. It's also keeping you stuck.`, action: `Risk the real. Say what you both already know.` },
      { insight: `${userName}, two Water moons will protect each other's feelings at the cost of their own truth. You're both being "kind" in a way that's actually unkind — sparing feelings by withholding what needs to be said.`, action: `Be actually kind today: say the real thing gently.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are so tuned in to each other that the situationship has its own emotional ecosystem. It can sustain itself almost indefinitely. But ecosystems without a foundation eventually shift. Make the foundation.`, action: `Ask ${partnerName} what they want. Be ready to answer the same question.` },
    ],
    crush: [
      { insight: `${userName}, Water moon to Water moon is the most intuitive attraction — both of you already know. ${partnerName}'s ${partnerMoon} moon has felt your ${userMoon} moon's interest and is feeling something back. This is one of the rare crushes where "wait for a sign" is the wrong advice.`, action: `Act on what you already sense. Say something real today.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are in a mutual, quiet state of intensity. Water moons fall deep before they say anything. ${partnerName} is already somewhere significant with this. Be the one who names it.`, action: `Name it. Gently, but clearly.` },
      { insight: `${userName}, two Water moons circling each other in a crush dynamic build incredible tension over time. At some point the tension has to go somewhere. Make it go toward honesty.`, action: `Move toward ${partnerName} today with one honest admission.` },
      { insight: `${userName}, ${partnerName}'s ${partnerMoon} moon can read your ${userMoon} moon's hesitation as clearly as they can read your interest. They're not uncertain about you — they're waiting to see if you're certain about them. Be certain.`, action: `Be certain today. Even if it's terrifying.` },
    ],
    relationship: [
      { insight: `${userName}, two Water moons in a relationship is a depth that can be transcendent or consuming. You and ${partnerName} feel everything together — the beauty and the fear. The maintenance this requires is making sure the depth doesn't become enmeshment.`, action: `Do one thing today that is entirely, separately yours.` },
      { insight: `${userName}, your ${userMoon} moon and ${partnerName}'s ${partnerMoon} moon are so attuned to each other that you sometimes absorb each other's emotions without labelling them. Whose feeling is it right now? Make sure you know.`, action: `Check in with yourself: what are you feeling that is actually yours, not ${partnerName}'s?` },
      { insight: `${userName}, Water moon to Water moon: the love is real and deep and you both know it. The work is staying individuals inside the intimacy. Depth without boundaries becomes dissolution.`, action: `Name one boundary that keeps you yourself inside this relationship. Honour it today.` },
      { insight: `${userName}, you and ${partnerName} are capable of profound emotional attunement — but Water moons can also become each other's greatest anxiety source when things are off. Check the temperature between you today. It's finer than you think.`, action: `Have a gentle, honest temperature check with ${partnerName}. Five minutes, no agenda.` },
    ],
    ex: [
      { insight: `${userName}, Water moon to Water moon endings are the longest. ${partnerName}'s ${partnerMoon} moon has been carrying this loss as long as yours has — even if they don't show it. The grief is mutual, quiet, and enormous. Honour it.`, action: `Give the grief its full weight today. Don't minimise it.` },
      { insight: `${userName}, your ${userMoon} moon absorbed so much of ${partnerName}'s ${partnerMoon} moon that part of the grief is disentangling what's yours from what was theirs. That work is necessary and worth doing.`, action: `Identify one feeling today and ask: is this mine, or did I absorb it from ${partnerName}?` },
      { insight: `${userName}, two Water moons after a breakup: you both know everything, feel everything, and still don't say it. The unspoken between you and ${partnerName} will take longer to resolve than the spoken parts. Be patient with yourself.`, action: `Don't rush the unspoken toward resolution. Let it surface slowly.` },
      { insight: `${userName}, the connection with ${partnerName}'s ${partnerMoon} moon was probably the most emotionally real thing you've had. Losing it doesn't mean you were wrong to invest. It means you know what real feels like. Carry that knowledge forward.`, action: `Write down what real feels like to you. This is the compass for what comes next.` },
    ],
  };

  const pools: Record<ElementKey, Record<RelationshipType, HeroVariant[]>> = {
    Fire_Fire:   FF,
    Fire_Earth:  FEarth,
    Fire_Air:    FAir,
    Fire_Water:  FWater,
    Earth_Earth: EE,
    Earth_Air:   EAir,
    Earth_Water: EWater,
    Air_Air:     AA,
    Air_Water:   AWater,
    Water_Water: WW,
  };

  return pools[elemKey][relType];
}

export function getPersonalizedHero(
  userName: string,
  partnerName: string,
  reading: AstrologyReading,
  relType: RelationshipType,
): PersonalizedHero {
  const uRashi = RASHIS[reading.user.moonRashi];
  const pRashi = RASHIS[reading.partner.moonRashi];
  const eKey   = elementKey(uRashi.element, pRashi.element);
  const seed   = `hero-${userName}-${partnerName}-${eKey}-${relType}-${todayKey()}`;

  // Try DB bundle first — hero_card items tagged with element_combo and rel_type
  const bundle = getContentBundle();
  if (bundle?.heroCards?.length) {
    const matching = bundle.heroCards.filter((item) => {
      const tags = item.tags as string[];
      return tags.includes(`element_combo:${eKey}`) && tags.includes(`rel_type:${relType}`);
    });
    const pool = matching.length ? matching : bundle.heroCards;
    const item = pool[hash(seed) % pool.length];
    const meta = item.meta as Record<string, string> | null ?? {};
    const vars = { u: userName, p: partnerName, um: uRashi.en, pm: pRashi.en };
    return {
      headline: meta.headline ?? "Today's read",
      moonTag:  meta.moonTag  ?? `${uRashi.element} · ${pRashi.element}`,
      insight:  applyVars(item.body, vars),
      action:   applyVars(meta.action ?? "", vars),
    };
  }

  // Local fallback
  const headline = `Today's read`;
  const moonTag  = `${uRashi.element} · ${pRashi.element}`;
  const variants = buildHeroPool(userName, partnerName, uRashi.en, pRashi.en, eKey, relType, reading.guna.total);
  const variant  = pick(variants, seed);
  return { headline, moonTag, insight: variant.insight, action: variant.action };
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
  // category values are shown to users — keep them plain English
  type Card = { q: string; category: string; icon: string; w: number };
  const pool: Card[] = [
    { q: "What does this connection need from me right now?",                                                                                      category: "right now",   icon: "⟡", w: 10 },
    { q: "What am I actually looking for in this connection?",                                                                                     category: "needs",       icon: "✦", w: 9  },
    { q: rtd?.keyQuestion ?? "What does the future hold for us?",                                                                                  category: "core",        icon: "◉", w: 9  },
    { q: weakest && weakest.score / weakest.max < 0.3 ? "Why do we keep clashing over the same thing?" : "Why does this connection feel this way?",category: "friction",    icon: "◈", w: weakest && weakest.score / weakest.max < 0.3 ? 9 : 5 },
    { q: "What does our compatibility say about how we feel around each other?",                                                                   category: "chemistry",   icon: "🌙", w: 8 },
    ...(guna.mangalDosha ? [{ q: "Why does this feel so intense and sometimes unsafe?",                    category: "intensity", icon: "◎", w: 9 }] : []),
    ...(guna.nadiDosha   ? [{ q: "Why do I feel drained even when I love them?",                           category: "energy",    icon: "◈", w: 9 }] : []),
    ...(kootaScore(guna,"Bhakoot") === 0 ? [{ q: "Why does this feel like one step forward, two steps back?", category: "push-pull", icon: "🌙", w: 10 }] : []),
    ...(relType === "ex"           ? [{ q: "Do they still think about this connection?",         category: "feelings", icon: "✦", w: 9 }, { q: "Is there a real chance we could work now?",  category: "reunion",  icon: "◎", w: 8 }] : []),
    ...(relType === "crush"        ? [{ q: "Do they feel what I feel, or is this one-sided?",   category: "one-sided",icon: "◈", w: 9 }, { q: "Should I say something or wait for a sign?", category: "timing",   icon: "⟡", w: 8 }] : []),
    ...(relType === "situationship"? [{ q: "Why won't they define what this is?",                category: "labels",   icon: "◉", w: 9 }, { q: "Am I reading too much into this?",            category: "clarity",  icon: "✧", w: 7 }] : []),
    { q: "What's the real reason I can't let go?",    category: "healing",    icon: "⟡", w: 5 },
    { q: "Are we actually compatible?",               category: "compatible", icon: "◈", w: 4 },
    { q: "What does the future hold for us?",         category: "future",     icon: "✧", w: 4 },
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
  const uMoon  = RASHIS[user.moonRashi].en;   // English name
  const dc     = DASHA_CHAPTERS[dasha];

  type Chip = { text: string; w: number };
  const pool: Chip[] = [
    { text: dc?.headline ? "Why does this period of my life make love feel so heavy?" : "What is this connection teaching me?", w: 10 },
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

// ─── Right Now Between You Two ────────────────────────────────────────────────
// The "how did it know?" card. Returns two hyper-specific statements — one about
// what the user is probably doing/feeling right now, one about the partner.
// Content is indexed by moon element × relationship type, picked by day seed.

export interface TodayBetweenYou {
  userMoment: string;
  partnerSignal: string;
}

export function getTodayBetweenYou(
  reading: AstrologyReading,
  relType: RelationshipType,
  userName: string,
  partnerName: string,
): TodayBetweenYou {
  const uMoon = RASHIS[reading.user.moonRashi];
  const pMoon = RASHIS[reading.partner.moonRashi];
  const u = userName;
  const p = partnerName;
  const um = uMoon.en;
  const pm = pMoon.en;

  // ── User moment pools (what the user is carrying/doing right now) ─────────
  const userPools: Record<string, Record<RelationshipType, string[]>> = {
    Fire: {
      crush: [
        `${u}, your ${um} moon already knows what it wants. The pause right now isn't uncertainty — it's you deciding whether to act on something you've already decided.`,
        `${u}, you've played out how to say it at least four times today. Your ${um} moon is ready. The only part you haven't figured out is how to start.`,
        `${u}, your ${um} moon picks up interest fast and you've picked something up from ${p}. You're not overthinking — you're delaying something you should probably do today.`,
        `${u}, the restraint your ${um} moon is showing right now is costing you energy. It's worth asking yourself whether the wait is actually necessary, or just familiar.`,
      ],
      situationship: [
        `${u}, your ${um} moon has a natural ceiling for ambiguity and you're close to it. What you're feeling as frustration is actually clarity — you know what you want, you just haven't said it.`,
        `${u}, you've been more patient than your ${um} moon is built for. The irritation underneath isn't irrational. It's your system telling you something needs to change.`,
        `${u}, you've rehearsed the defining conversation enough times to give it word for word. What's stopping you isn't lack of words — it's fear of what ${p} might say back.`,
        `${u}, your ${um} moon is getting tired of performing calm about something that isn't calm. The "it's fine" is wearing thin, and ${p} probably senses it.`,
      ],
      relationship: [
        `${u}, something small happened recently that's still sitting in you. Your ${um} moon doesn't process silently for long. ${p} probably senses something's off.`,
        `${u}, your ${um} moon needs things to feel like they're moving. If the relationship has felt static lately, that restlessness is information — not something to suppress.`,
        `${u}, you've been carrying something this week without naming it. That's not sustainable for your ${um} moon. Today is a reasonable day to just say the thing.`,
        `${u}, your ${um} moon is direct about almost everything except the specific thing that's actually bothering you right now. Say the specific thing.`,
      ],
      ex: [
        `${u}, your ${um} moon processes by moving and you've been moving. At some point, moving becomes avoiding. It's worth checking which one this is right now.`,
        `${u}, the impulse to reach out to ${p} is stronger today. Your ${um} moon acts before it thinks sometimes — make sure this is the thinking kind before you do anything.`,
        `${u}, you've been running some version of "what if" about ${p} since the ending. Your ${um} moon wants resolution. Reaching out won't give you that — it'll just restart the loop.`,
        `${u}, the heat of the ending is still in your ${um} moon. That's real. The question is whether what you'd return to would actually be different, or just familiar.`,
      ],
    },
    Earth: {
      crush: [
        `${u}, your ${um} moon has been collecting evidence about ${p} quietly. You have enough. The block right now isn't information — it's the risk of being wrong.`,
        `${u}, you've built a thorough internal case about ${p}. Your ${um} moon doesn't move without certainty. The problem is that certainty doesn't arrive before you act — it arrives because you act.`,
        `${u}, your ${um} moon is waiting for a sign that this is safe before it moves. ${p} might be waiting for the same sign from you. Someone has to go first.`,
        `${u}, the caution your ${um} moon brings to everything is real. It's also possible that what you're protecting yourself from here isn't as likely as you're treating it.`,
      ],
      situationship: [
        `${u}, your ${um} moon has been accommodating uncertainty longer than it's designed to. You're not someone who thrives in ambiguity — you're someone who tolerates it when they have to. You've been tolerating it.`,
        `${u}, you've analyzed this from every angle and reached the same conclusion each time. Your ${um} moon knows what it needs. You just haven't asked for it directly yet.`,
        `${u}, your ${um} moon needs something to build on. Right now with ${p} there's nothing solid to build on. That's not a small thing for you — it's the thing.`,
        `${u}, the patience your ${um} moon is showing is real. What's also real is that your patience has a limit, and you're closer to it than you're admitting to yourself.`,
      ],
      relationship: [
        `${u}, your ${um} moon notices when things shift, even slightly. Something has shifted this week and you haven't spoken it to ${p} yet.`,
        `${u}, you've been tracking something in the relationship that you haven't named directly. Your ${um} moon runs on what it observes — what's the observation actually telling you?`,
        `${u}, your ${um} moon can go quiet when it's processing something difficult. ${p} might be reading that quiet as withdrawal. It might be worth explaining.`,
        `${u}, there's a specific thing you've been thinking about this week that you haven't said to ${p}. Your ${um} moon holds things carefully — sometimes too carefully.`,
      ],
      ex: [
        `${u}, your ${um} moon is doing the practical parts of moving on. The emotional part is a few weeks behind that, and that's exactly how your moon sign processes things — thoroughly, in order.`,
        `${u}, your ${um} moon doesn't release things quickly or easily. The fact that you're still processing ${p} isn't weakness — it's the depth you bring to everything.`,
        `${u}, you've been rebuilding slowly and methodically since the ending. That's right for your ${um} moon. Don't let anyone — including yourself — rush this.`,
        `${u}, your ${um} moon will get through this. It processes at its own pace and it does it completely. You're in the middle of that process right now and it's working.`,
      ],
    },
    Air: {
      crush: [
        `${u}, your ${um} moon has been reading ${p}'s messages for things that may or may not be there. The analysis won't give you certainty — only a direct conversation will.`,
        `${u}, you've had the conversation you need to have with ${p} approximately fifty times in your head. The words are already there. What's missing is the decision to use them.`,
        `${u}, your ${um} moon creates meaning first and then looks for evidence. Be honest with yourself about whether what you're reading from ${p} is what's there, or what you want to be there.`,
        `${u}, your ${um} moon knows exactly what it thinks about ${p}. What it's less clear on is what it feels. Right now the feeling is the more important of the two.`,
      ],
      situationship: [
        `${u}, your ${um} moon can talk itself into and out of anything. Check that you're not using your own clarity as a way to avoid the one conversation that would actually give you clarity.`,
        `${u}, you've got a very articulate internal understanding of why this situationship is what it is. You're also aware that understanding it doesn't change it. Something else has to change it.`,
        `${u}, your ${um} moon has been explaining this arrangement to yourself in ways that make sense. Check that "makes sense" hasn't quietly become a substitute for "what I actually want."`,
        `${u}, the conversation you need to have with ${p} is one your ${um} moon has already run through every possible outcome of. You know how to say it. You just haven't decided to.`,
      ],
      relationship: [
        `${u}, your ${um} moon has been rationalizing something instead of feeling it. There's a specific thing you've been explaining away that deserves to actually be felt.`,
        `${u}, something happened recently that you've analyzed thoroughly and discussed very little. Your ${um} moon is good at understanding things — right now it needs to express them.`,
        `${u}, you've been in your head about ${p} this week more than usual. Your ${um} moon sometimes processes distance intellectually rather than just closing the distance directly.`,
        `${u}, your ${um} moon can make almost anything make sense. The question today is not whether it makes sense — it's whether it feels right.`,
      ],
      ex: [
        `${u}, your ${um} moon has constructed a clean narrative about why the ending with ${p} was right. Check whether you're processing or just explaining — they're different.`,
        `${u}, you've thought through every angle of the ending. Your ${um} moon is good at conclusions. What it's less practiced at is grief. Give the grief its turn today.`,
        `${u}, your ${um} moon is probably three weeks ahead emotionally. The part of you that still misses ${p} is real and it doesn't need an explanation — it needs to be acknowledged.`,
        `${u}, you've been on the intellectual side of this for a while. Make sure the emotional layer has actually had its turn and isn't just buried under analysis.`,
      ],
    },
    Water: {
      crush: [
        `${u}, your ${um} moon already knows how ${p} feels. You've picked it up without them saying anything. You're just not sure yet what to do with what you know.`,
        `${u}, your ${um} moon has been absorbing ${p}'s energy without naming it. What you've been feeling around them isn't vague — it's data. Trust it.`,
        `${u}, you've sensed something real here and you've been quietly talking yourself out of trusting it. Your ${um} moon's instincts have context your logic doesn't. Listen to them.`,
        `${u}, your ${um} moon is picking up on things ${p} hasn't said yet. The question isn't whether the feeling is right — it's whether you're brave enough to name it first.`,
      ],
      situationship: [
        `${u}, your ${um} moon has been absorbing the ambiguity in this situation and calling it patience. It's not really patience — it's you carrying something that should be shared, not held.`,
        `${u}, your ${um} moon feels everything and holds most of it. This situationship with ${p} is costing you more than you're showing. You don't have to keep absorbing it alone.`,
        `${u}, your ${um} moon knows the difference between someone who's figuring things out and someone who's comfortable keeping you waiting. Which one is this?`,
        `${u}, you've been reading ${p}'s signals carefully. Your ${um} moon doesn't misread people easily. Trust what you've read. Stop needing more evidence.`,
      ],
      relationship: [
        `${u}, there's something between you and ${p} that hasn't been said out loud yet. Your ${um} moon has been holding it. Today is a reasonable day to stop holding it.`,
        `${u}, your ${um} moon has picked up a shift in the energy this week. Something is different and you haven't named what it is — to yourself or to ${p}.`,
        `${u}, you've been holding something for ${p} emotionally this week. Your ${um} moon does this automatically. Make sure you're also holding something for yourself.`,
        `${u}, your ${um} moon is so attuned to ${p} that it's sometimes hard to know where you end and they begin. Check in today: what are you feeling that's actually yours?`,
      ],
      ex: [
        `${u}, the grief comes in waves and your ${um} moon stays in each one until it's done. That's right. Don't rush it and don't apologize to anyone for it.`,
        `${u}, your ${um} moon is still carrying ${p} in ways that aren't visible on the outside. That's how Water moons grieve — quietly and completely.`,
        `${u}, you've been checking in on ${p} from a distance — their profile, what mutual people say, small signals. Your ${um} moon is still monitoring something it's not ready to release. Notice that.`,
        `${u}, your ${um} moon processes through feeling, not through deciding. You haven't fully felt this ending yet. When you do, you'll know. You're not there yet, and that's okay.`,
      ],
    },
  };

  // ── Partner signal pools (what's happening with them right now) ───────────
  const partnerPools: Record<string, Record<RelationshipType, string[]>> = {
    Fire: {
      crush: [
        `${p}'s ${pm} moon has noticed you. Fire moons act on what they want — if they haven't acted yet, there's a reason. It could be timing, or it could be waiting to see if the interest is mutual.`,
        `${p}'s ${pm} moon moves toward what it wants once it's confident. Right now they're calibrating. The clearest signal you can give is showing up without ambiguity.`,
        `${p}'s ${pm} moon is drawn to momentum and directness. Show that you know what you want and watch what happens.`,
        `${p}'s ${pm} moon is deciding. Fire moons move fast once they decide — the pause means they're still weighing something, not that they're uninterested.`,
      ],
      situationship: [
        `${p}'s ${pm} moon doesn't do indefinite. They have a natural time limit on undefined things and they won't feel guilty about moving on when it expires. The clock is running.`,
        `${p}'s ${pm} moon is interested but not invested right now. Those are different states. The gap between them is exactly where this situationship lives.`,
        `${p}'s ${pm} moon is comfortable right now — which is part of the problem. Comfortable doesn't create urgency to define things. Only discomfort does.`,
        `${p}'s ${pm} moon is in a holding pattern. Fire moons don't hold forever. Watch which direction they move when the pattern breaks.`,
      ],
      relationship: [
        `${p}'s ${pm} moon needs to feel like you're fully present with them right now. Something has made them feel like part of you is somewhere else this week.`,
        `${p}'s ${pm} moon runs on reciprocity — they show up fully when they feel met. If they've seemed less present lately, check whether they feel seen right now.`,
        `${p}'s ${pm} moon is carrying something they haven't said yet. Fire moons act when they're ready — give them space to get there without pushing.`,
        `${p}'s ${pm} moon needs acknowledgment, not big gestures — specific ones. One thing you notice about them today will land more than you think.`,
      ],
      ex: [
        `${p}'s ${pm} moon has moved the energy somewhere else — work, something new, people who are available. That's how Fire moons survive endings. It doesn't mean what it looks like.`,
        `${p}'s ${pm} moon doesn't linger in endings the way yours might. That doesn't make the connection less real — it makes them different in how they process it.`,
        `${p}'s ${pm} moon will reach back out if and when it decides to. If it hasn't, that's information. Let that be the answer for right now.`,
        `${p}'s ${pm} moon has filed the ending and moved on externally. Their internal processing is harder to see. Don't assume "looks fine" means "is fine."`,
      ],
    },
    Earth: {
      crush: [
        `${p}'s ${pm} moon is paying close attention to whether you follow through on small things. They're not testing you deliberately — they're building a picture of whether you're consistent.`,
        `${p}'s ${pm} moon moves slowly and deliberately. The fact that they keep engaging with you means something — Earth moons don't give sustained attention to things that don't matter.`,
        `${p}'s ${pm} moon notices what you do far more than what you say. Show up in a small, real way today and it will register more than you think.`,
        `${p}'s ${pm} moon doesn't rush attraction. The slow pace isn't cold — it's how they decide whether something is worth investing in.`,
      ],
      situationship: [
        `${p}'s ${pm} moon is comfortable in this arrangement in a way that may not be serving you. They're not pushing for more because you're already meeting their needs. Are your needs being met?`,
        `${p}'s ${pm} moon doesn't change things that feel stable. The situationship is stable for them right now. That's actually the issue.`,
        `${p}'s ${pm} moon is quietly assessing whether what you two have is worth defining. That assessment is ongoing. You can influence it by being direct about what you want.`,
        `${p}'s ${pm} moon takes time to commit because they take it seriously. They need more consistency, more time, or a direct conversation — probably all three.`,
      ],
      relationship: [
        `${p}'s ${pm} moon goes quiet when they're processing something they don't know how to say. The quietness this week isn't distance — something is building.`,
        `${p}'s ${pm} moon expresses care through reliability and presence, not declarations. Notice what they're doing, not just what they're saying.`,
        `${p}'s ${pm} moon needs things to feel solid. If anything has felt unsettled between you recently, it registers more deeply for them than it might for you.`,
        `${p}'s ${pm} moon holds things inside before saying them. If they seem like they have something on their mind, they do. Ask directly.`,
      ],
      ex: [
        `${p}'s ${pm} moon is doing the slow, thorough work of rebuilding. They're probably further along in that process than their behavior suggests.`,
        `${p}'s ${pm} moon processes endings carefully and completely. They're not over it — but they're working through it in the methodical way Earth moons do everything.`,
        `${p}'s ${pm} moon won't reach back out impulsively. If they do, it will be because they've decided to — deliberately, not on a whim.`,
        `${p}'s ${pm} moon is building toward something different now. Slowly, quietly — the same way they do everything. The trajectory is away from what was.`,
      ],
    },
    Air: {
      crush: [
        `${p}'s ${pm} moon engages with things it finds genuinely interesting. The fact that they keep coming back to you is the signal — Air moons disengage from things that don't hold them.`,
        `${p}'s ${pm} moon is interested but processing it intellectually before feeling it. That's how they work. Give them something real to think about, not just something charming.`,
        `${p}'s ${pm} moon is figuring out whether you're consistent or just compelling. Compelling is easy for Air moons to walk away from. Consistent is not.`,
        `${p}'s ${pm} moon is drawn to you. What they're deciding is whether you'll still be interesting when things get real. Show them a real version of yourself today.`,
      ],
      situationship: [
        `${p}'s ${pm} moon has rationalized this arrangement into something that works for them. They're probably not experiencing the ambiguity the same way you are. That matters.`,
        `${p}'s ${pm} moon stays in situations that are stimulating. You're stimulating. Stimulation and readiness to commit are different things — know which one you're dealing with.`,
        `${p}'s ${pm} moon keeps things open because Air moons are made for possibility, not definition. The lack of definition is working for them. Whether it works for you is a separate question.`,
        `${p}'s ${pm} moon isn't unavailable — they're just not being pushed toward clarity. A direct question gets a direct answer with Air moons. Ask it.`,
      ],
      relationship: [
        `${p}'s ${pm} moon is in their head right now — not away from you, but inside a thought process they haven't brought you into yet. Ask where they actually are.`,
        `${p}'s ${pm} moon processes things verbally or through writing. If they've been quiet, there's something they're working out alone first. Give room, then ask.`,
        `${p}'s ${pm} moon expresses care through attention and engagement. If they seem less present, notice whether they're engaging less, or just differently.`,
        `${p}'s ${pm} moon needs the relationship to feel like it's still moving and alive. Check whether you've both settled into routine — they feel that shift first.`,
      ],
      ex: [
        `${p}'s ${pm} moon has moved the story forward in their head. They've found the narrative version of the ending that makes sense to them. The emotional chapter may still be open even if the cognitive one is closed.`,
        `${p}'s ${pm} moon is probably analyzing you less than you imagine. Air moons move to the next interesting thing. That's not cruelty — it's how they're built to cope.`,
        `${p}'s ${pm} moon has told itself a version of what happened that made it make sense. They're not wrong. They're just telling the story in a different language than you are.`,
        `${p}'s ${pm} moon is not unreachable — Air moons stay connected to the idea of people long after things end. Being an idea in their head isn't the same as a real option.`,
      ],
    },
    Water: {
      crush: [
        `${p}'s ${pm} moon is picking up on everything you're not saying. They already know more about how you feel than you've told them. What they're deciding is what to do with it.`,
        `${p}'s ${pm} moon doesn't let just anyone in. The fact that they're still engaged with you means something passed their instinctive filter. That's not nothing.`,
        `${p}'s ${pm} moon feels things deeply and shares almost none of it. The quiet isn't disinterest — it's protection. What earns their trust isn't intensity. It's consistency over time.`,
        `${p}'s ${pm} moon reads energy before it reads words. What they're picking up from how you're showing up right now matters more than what you've said.`,
      ],
      situationship: [
        `${p}'s ${pm} moon is more invested in this than they're showing. Water moons protect what they care about by going quiet about it. The quietness is the tell, not evidence of absence.`,
        `${p}'s ${pm} moon is feeling things they haven't said. That's different from not feeling things. The silence is loaded, not empty.`,
        `${p}'s ${pm} moon is waiting to feel safe enough to name what this is. Safety for them comes from consistency, not declarations. Show up the same way, repeatedly.`,
        `${p}'s ${pm} moon is absorbing everything about how you're showing up. Every small thing registers. The pattern you're creating right now matters more than any single moment.`,
      ],
      relationship: [
        `${p}'s ${pm} moon has been absorbing something this week they haven't processed out loud yet. Ask them what's going on — not "are you okay" but something more specific.`,
        `${p}'s ${pm} moon holds its inner world carefully. If they seem withdrawn, something real is happening underneath. Don't mistake the surface for the full picture.`,
        `${p}'s ${pm} moon needs to feel genuinely seen right now — not just loved in general, but noticed specifically. Name one specific thing about them today.`,
        `${p}'s ${pm} moon goes tidal sometimes — close and then distant, without it meaning something changed. Check before you conclude the distance is about you.`,
      ],
      ex: [
        `${p}'s ${pm} moon is still carrying this quietly. Water moons don't put things down easily. They look okay. They're not fully okay.`,
        `${p}'s ${pm} moon has been grieving this privately in the way Water moons do — completely, without showing it. That doesn't mean they've moved on.`,
        `${p}'s ${pm} moon absorbs endings as completely as it absorbs connections. The ending with you is still in them — it just lives somewhere you can't see from here.`,
        `${p}'s ${pm} moon will reach back out if and when they feel safe enough to. Water moons don't reach back impulsively — they reach back when the feeling becomes too heavy to hold alone.`,
      ],
    },
  };

  const uElement = uMoon.element;
  const pElement = pMoon.element;
  const userSeed    = `rightnow-u-${userName}-${uElement}-${relType}-${todayKey()}`;
  const partnerSeed = `rightnow-p-${partnerName}-${pElement}-${relType}-${todayKey()}`;
  const vars        = { u: userName, p: partnerName, um: uMoon.en, pm: pMoon.en };

  // Try DB bundle first — right_now items tagged by element + rel_type
  const bundle = getContentBundle();
  if (bundle?.rightNow?.length) {
    const matchTag = `element:${uElement}`;
    const relTag   = `rel_type:${relType}`;
    const userItems = bundle.rightNow.filter((i) => {
      const tags = i.tags as string[];
      return (tags.includes(matchTag) || tags.includes("universal")) && (tags.includes(relTag) || tags.includes("universal")) && !(i.meta as any)?.isPartner;
    });
    const partnerItems = bundle.rightNow.filter((i) => {
      const tags = i.tags as string[];
      return (tags.includes(`partner_element:${pElement}`) || tags.includes("universal")) && (tags.includes(relTag) || tags.includes("universal")) && !!(i.meta as any)?.isPartner;
    });
    const uPool = userItems.length    ? userItems    : bundle.rightNow;
    const pPool = partnerItems.length ? partnerItems : bundle.rightNow;
    return {
      userMoment:    applyVars(uPool[hash(userSeed)    % uPool.length].body, vars),
      partnerSignal: applyVars(pPool[hash(partnerSeed) % pPool.length].body, vars),
    };
  }

  // Local fallback
  const userPool    = (userPools[uElement]    ?? userPools.Water)[relType];
  const partnerPool = (partnerPools[pElement] ?? partnerPools.Water)[relType];
  return {
    userMoment:    pick(userPool,    userSeed),
    partnerSignal: pick(partnerPool, partnerSeed),
  };
}
