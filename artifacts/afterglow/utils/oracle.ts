// ─── Lumble Oracle ────────────────────────────────────────────────────────────
// Fully deterministic: same inputs → same response, always.
// Responses drawn from content-library.ts, filled with real kundli data.

import { getAstrologyReading, NAKSHATRAS, RASHIS } from "./astrology";
import {
  DASHA_CHAPTERS,
  KOOTA_NARRATIVES,
  MOON_PROFILES_DEEP,
  NAKSHATRA_PROFILES,
  ORACLE_LIBRARY,
} from "./content-library";

// ─── Stable seeded hash ───────────────────────────────────────────────────────

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}

// ─── Intent detection ─────────────────────────────────────────────────────────

type Intent =
  | "misses_me" | "loves_me" | "come_back" | "should_text" | "why_left"
  | "why_fight" | "compatible" | "move_on" | "future" | "addicted"
  | "confused" | "red_flag" | "timing" | "general";

const INTENT_PATTERNS: [Intent, RegExp][] = [
  ["misses_me",   /miss|think about me|thinking of me|remember me|does (he|she|they) think/i],
  ["loves_me",    /love me|still feel|have feeling|care about me|in love/i],
  ["come_back",   /come back|get back|return|reconcile|second chance|try again/i],
  ["should_text", /should i text|should i reach|should i message|reach out|contact|call them/i],
  ["why_left",    /why did (he|she|they) leave|why did (he|she|they) go|why did (he|she|they) pull|pulled away|disappeared|ghost/i],
  ["why_fight",   /why do we (fight|argue|clash|bicker)|conflict|fight all the time|misunderstand/i],
  ["compatible",  /compatible|right for me|meant to be|soulmate|the one|good match/i],
  ["move_on",     /move on|get over|let go|forget|heal|closure|stuck/i],
  ["future",      /future|will it work|will we last|long term|forever|end up|outcome/i],
  ["addicted",    /addicted|can.t stop thinking|obsessed|can.t let go|hooked/i],
  ["confused",    /confused|don.t understand|make sense|what does it mean|mixed signal/i],
  ["red_flag",    /red flag|warning|toxic|manipulat|gasligh|narcissist/i],
  ["timing",      /right time|wrong time|timing|too soon|too late|not ready/i],
];

function detectIntent(text: string): Intent {
  for (const [intent, pattern] of INTENT_PATTERNS) {
    if (pattern.test(text)) return intent;
  }
  return "general";
}

// ─── Template filling ─────────────────────────────────────────────────────────

function fillTemplate(template: string, ctx: Record<string, string>): string {
  let out = template;
  for (const [key, val] of Object.entries(ctx)) {
    out = out.split(`{{${key}}}`).join(val);
  }
  return out.replace(/\{\{[^}]+\}\}/g, "");
}

// ─── Moon style lookup ─────────────────────────────────────────────────────────

const MOON_STYLES: Record<string, string> = {
  Mesha:"quick action and direct expression", Vrishabha:"slow, tactile reassurance",
  Mithuna:"talking through it", Karka:"withdrawal and inner processing",
  Simha:"creative expression and being seen", Kanya:"analysis and problem-solving",
  Tula:"seeking balance and mirroring others", Vrishchika:"deep intensity and silence",
  Dhanu:"reframing through philosophy", Makara:"containment and practical action",
  Kumbha:"intellectual detachment", Meena:"emotional merging and intuition",
};

const LAGNA_LOVE: Record<string, string> = {
  Mesha:"you love with urgency and directness", Vrishabha:"you love through consistency and loyalty",
  Mithuna:"you love through words and mental connection", Karka:"you love through nurturing and safety",
  Simha:"you love with generosity and need to be seen", Kanya:"you love through acts of service",
  Tula:"you love through partnership and harmony", Vrishchika:"you love with total intensity",
  Dhanu:"you love through shared expansion", Makara:"you love through commitment and action",
  Kumbha:"you love through friendship and vision", Meena:"you love by dissolving boundaries",
};

// ─── Build oracle context from kundli data ────────────────────────────────────

function buildContext(
  userName: string,
  userBirthDate: string,
  partnerName: string,
  partnerBirthDate: string,
  relationshipType: string,
): Record<string, string> {
  const reading = getAstrologyReading(userName, userBirthDate, partnerName, partnerBirthDate);
  const { user, partner, guna } = reading;

  const uRashi  = RASHIS[user.moonRashi];
  const pRashi  = RASHIS[partner.moonRashi];
  const uLagna  = RASHIS[user.lagnaRashi];
  const pLagna  = RASHIS[partner.lagnaRashi];
  const uNak    = NAKSHATRAS[user.nakshatra];
  const pNak    = NAKSHATRAS[partner.nakshatra];
  const dasha   = user.dasha.current;
  const dc      = DASHA_CHAPTERS[dasha] ?? DASHA_CHAPTERS["Chandra"];
  const uMP     = MOON_PROFILES_DEEP[user.moonRashi]    ?? MOON_PROFILES_DEEP[0];
  const pMP     = MOON_PROFILES_DEEP[partner.moonRashi] ?? MOON_PROFILES_DEEP[0];
  const uNP     = NAKSHATRA_PROFILES[user.nakshatra]    ?? NAKSHATRA_PROFILES[0];
  const pNP     = NAKSHATRA_PROFILES[partner.nakshatra] ?? NAKSHATRA_PROFILES[0];

  // Sort kootas stably (by score desc, then by name for tie-break)
  const sorted = [...guna.breakdown].sort((a, b) => {
    const diff = (b.score / b.max) - (a.score / a.max);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });
  const strongKoota = sorted[0];
  const weakKoota   = sorted[sorted.length - 1];
  const bhakoot     = guna.breakdown.find((k) => k.name === "Bhakoot");
  const gmK         = guna.breakdown.find((k) => k.name === "Graha Maitri");
  const nadiK       = guna.breakdown.find((k) => k.name === "Nadi");
  const ganaK       = guna.breakdown.find((k) => k.name === "Gana");

  const gunaVerdict = guna.total >= 28 ? "exceptional resonance across most kootas"
    : guna.total >= 21 ? "solid alignment with some intentional areas"
    : guna.total >= 18 ? "workable — with focused attention on friction areas"
    : "significant friction in several kootas, requiring self-awareness from both people";

  return {
    u:                  userName,
    p:                  partnerName,
    uMoon:              uRashi.name,
    pMoon:              pRashi.name,
    uLagna:             uLagna.name,
    pLagna:             pLagna.name,
    uNak:               uNak.name,
    pNak:               pNak.name,
    uNakLord:           uNak.lord,
    pNakLord:           pNak.lord,
    uNakDeity:          uNak.deity,
    pNakDeity:          pNak.deity,
    uNakGana:           uNak.gana,
    pNakGana:           pNak.gana,
    uNakPattern:        uNP.pattern,
    pNakPattern:        pNP.pattern,
    uNakStrength:       uNP.strength,
    pNakStrength:       pNP.strength,
    uNakShadow:         uNP.shadow,
    pNakShadow:         pNP.shadow,
    uNakCraving:        uNP.craving,
    pNakCraving:        pNP.craving,
    uNakTrap:           uNP.trap,
    pNakTrap:           pNP.trap,
    uMoonStyle:         MOON_STYLES[uRashi.name]  ?? "emotional depth",
    pMoonStyle:         MOON_STYLES[pRashi.name]  ?? "quiet intensity",
    uMoonNeed:          uMP.need ?? uMP.needsToHear,
    uMoonFear:          uMP.fear,
    uMoonInsight:       uMP.insight,
    uMoonWound:         uMP.coreWound,
    pMoonInsight:       pMP.insight,
    lagnaLoveStyle:     LAGNA_LOVE[uLagna.name]   ?? "deep emotional commitment",
    lagunaNeed:         uMP.need ?? uMP.needsToHear,
    lagnaBlindspot:     uMP.blindspot,
    dasha:              dasha,
    dashaTheme:         dc.theme ?? dc.headline,
    dashaGift:          dc.gift,
    dashaChallenge:     dc.challenge,
    dashaWarning:       dc.warning,
    dashaPhase:         dc.headline,
    dashaOracleContext: dc.oracleContext,
    dashaFuture:        dc.relationshipEffect,
    dashaLessonForLove: dc.lessonForLove,
    guna:               String(guna.total),
    gunaVerdict:        gunaVerdict,
    gunaFutureText:     gunaVerdict,
    gunaShapeText:      gunaVerdict,
    scoreContext:       `${guna.total}/36`,
    relType:            relationshipType,
    lord1:              uRashi.lord,
    lord2:              pRashi.lord,
    strongKoota:        strongKoota?.name ?? "",
    strongKootaText:    strongKoota ? (KOOTA_NARRATIVES[strongKoota.name]?.strongText ?? "") : "",
    weakKoota:          weakKoota?.name ?? "",
    weakKootaText:      weakKoota ? (KOOTA_NARRATIVES[weakKoota.name]?.weakText ?? "") : "",
    weakKootaNarrative: weakKoota ? (KOOTA_NARRATIVES[weakKoota.name]?.weakText ?? "") : "",
    weakKootaFix:       weakKoota ? (KOOTA_NARRATIVES[weakKoota.name]?.fix ?? "") : "",
    bhakootScore:       String(bhakoot?.score ?? ""),
    grahaMaitriText:    gmK ? `a score of ${gmK.score}/${gmK.max} in mental compatibility` : "reasonable mental alignment",
    nadiGanaText:       `${nadiK && nadiK.score === nadiK.max ? "no Nadi friction" : "Nadi friction present"} and ${ganaK && ganaK.score >= 4 ? "compatible Gana" : "Gana that requires work"}`,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getOracleResponse(
  userMessage: string,
  userName: string,
  userBirthDate: string,
  partnerName: string,
  partnerBirthDate: string,
  relationshipType: string,
): string {
  const intent    = detectIntent(userMessage);
  const templates = ORACLE_LIBRARY[intent] ?? ORACLE_LIBRARY["general"];
  const ctx       = buildContext(userName, userBirthDate, partnerName, partnerBirthDate, relationshipType);

  // Fully deterministic: intent + both nakshatras + dasha + message-length bucket
  const lenBucket = Math.min(5, Math.floor(userMessage.length / 30));
  const seed      = `${intent}:${ctx.uNak}:${ctx.pNak}:${ctx.dasha}:${lenBucket}`;
  return fillTemplate(pick(templates, seed), ctx);
}
