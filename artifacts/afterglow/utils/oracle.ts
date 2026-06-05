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

// Keyed by English sign name (en field from RASHIS)
const MOON_STYLES: Record<string, string> = {
  Aries:"quick action and direct expression", Taurus:"slow, physical reassurance",
  Gemini:"talking through it", Cancer:"withdrawal and inner processing",
  Leo:"creative expression and being seen", Virgo:"analysis and problem-solving",
  Libra:"seeking balance and mirroring others", Scorpio:"deep intensity and silence",
  Sagittarius:"reframing through philosophy", Capricorn:"containment and practical action",
  Aquarius:"intellectual detachment", Pisces:"emotional merging and intuition",
};

const LAGNA_LOVE: Record<string, string> = {
  Aries:"you love with urgency and directness", Taurus:"you love through consistency and loyalty",
  Gemini:"you love through words and mental connection", Cancer:"you love through nurturing and safety",
  Leo:"you love with generosity and need to be seen", Virgo:"you love through acts of service",
  Libra:"you love through partnership and harmony", Scorpio:"you love with total intensity",
  Sagittarius:"you love through shared expansion", Capricorn:"you love through commitment and action",
  Aquarius:"you love through friendship and vision", Pisces:"you love by dissolving boundaries",
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

  const gunaVerdict = guna.total >= 28 ? "strong natural alignment on most factors"
    : guna.total >= 21 ? "solid foundation with some areas that need work"
    : guna.total >= 18 ? "workable — with honest attention to the friction points"
    : "real friction on several levels — awareness is what makes it workable";

  return {
    u:                  userName,
    p:                  partnerName,
    uMoon:              uRashi.en,      // English: "Scorpio" not "Vrishchika"
    pMoon:              pRashi.en,
    uLagna:             uLagna.en,
    pLagna:             pLagna.en,
    uNak:               uNak.name,      // Nakshatra names kept — they're credibility anchors
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

// ─── Follow-up suggestions per intent ────────────────────────────────────────

export const FOLLOW_UP_SUGGESTIONS: Partial<Record<Intent, string[]>> = {
  misses_me:   ["Do they actually want me or just the memory?",  "Should I reach out or wait?",              "Why can I not stop waiting for a sign?"],
  loves_me:    ["Am I just convenient for them?",                "Why does it feel one sided?",              "Do they see me or just what I give them?"],
  come_back:   ["How do I know if things actually changed?",     "Am I going back because I love them or because I am scared to move on?", "What does a real second chance actually require?"],
  should_text: ["What if reaching out makes me look desperate?", "Am I overthinking this or is my gut right?", "What do I actually want to say?"],
  why_left:    ["Was it something I did or who I am?",           "Am I always the one who gets left?",        "How do I stop replaying it?"],
  why_fight:   ["Are we fighting about the real thing?",         "Do they actually respect me?",             "Is this fixable or are we just not right?"],
  compatible:  ["Am I settling?",                                "Are we compatible or just attached?",       "Can real love feel this complicated?"],
  move_on:     ["Why does it still feel like grief?",            "Am I allowed to still miss them?",          "How do I stop checking their profile?"],
  future:      ["Am I wasting time on the wrong person?",        "Will someone actually choose me and stay?", "Is it naive to still have hope?"],
  addicted:    ["Is this love or am I just scared to be alone?", "Why do I always go back even when I know better?", "How do I break a pattern I have had my whole life?"],
  confused:    ["Am I reading too much into this?",              "Why are they so unclear?",                  "Do I even know what I want anymore?"],
  red_flag:    ["Am I being manipulated?",                       "Why do I keep making excuses for them?",    "Is what I feel real or just fear of being alone?"],
  timing:      ["How long is too long to wait?",                 "Am I being patient or just avoiding the truth?", "What if the timing is never right?"],
  general:     ["Am I enough for someone like them?",            "Why is love always this hard for me?",      "What do I actually deserve?"],
};

export function getIntentFromMessage(text: string): Intent {
  return detectIntent(text);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getOracleResponse(
  userMessage: string,
  userName: string,
  userBirthDate: string,
  partnerName: string,
  partnerBirthDate: string,
  relationshipType: string,
  turnCount: number = 0,
): string {
  const intent    = detectIntent(userMessage);
  const templates = ORACLE_LIBRARY[intent] ?? ORACLE_LIBRARY["general"];
  const ctx       = buildContext(userName, userBirthDate, partnerName, partnerBirthDate, relationshipType);

  // Include turn count so the same question asked multiple times gets a different template
  const lenBucket = Math.min(5, Math.floor(userMessage.length / 30));
  const seed      = `${intent}:${ctx.uNak}:${ctx.pNak}:${ctx.dasha}:${lenBucket}:${turnCount % templates.length}`;
  return fillTemplate(pick(templates, seed), ctx);
}
