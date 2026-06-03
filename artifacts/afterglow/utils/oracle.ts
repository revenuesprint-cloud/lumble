// ─── Afterglow Guidance Oracle ────────────────────────────────────────────────
// Fully local, zero-API. Matches user questions to intent categories,
// then fills response templates with real astrological data so every
// answer feels specific and personal.

import { getAstrologyReading } from "./astrology";

// ─── Seeded hash for deterministic pick within a category ────────────────────

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}

// ─── Intent detection ────────────────────────────────────────────────────────

type Intent =
  | "misses_me"
  | "loves_me"
  | "come_back"
  | "should_text"
  | "why_left"
  | "why_fight"
  | "compatible"
  | "move_on"
  | "future"
  | "addicted"
  | "confused"
  | "red_flag"
  | "timing"
  | "general";

const INTENT_PATTERNS: [Intent, RegExp][] = [
  ["misses_me",  /miss|think about me|thinking of me|remember me|does (he|she|they) think/i],
  ["loves_me",   /love me|still feel|have feeling|care about me|in love/i],
  ["come_back",  /come back|get back|return|reconcile|second chance|try again/i],
  ["should_text",/should i text|should i reach|should i message|reach out|contact|call them/i],
  ["why_left",   /why did (he|she|they) leave|why did (he|she|they) go|why did (he|she|they) pull|pulled away|disappeared|ghost/i],
  ["why_fight",  /why do we (fight|argue|clash|bicker)|conflict|fight all the time|misunderstand/i],
  ["compatible", /compatible|right for me|meant to be|soulmate|the one|good match/i],
  ["move_on",    /move on|get over|let go|forget|heal|closure|stuck/i],
  ["future",     /future|will it work|will we last|long term|forever|end up|outcome/i],
  ["addicted",   /addicted|can.t stop thinking|obsessed|toxic|can.t let go|hooked/i],
  ["confused",   /confused|don.t understand|make sense|what does it mean|mixed signal/i],
  ["red_flag",   /red flag|warning|toxic|manipulat|gasligh|narcissist/i],
  ["timing",     /right time|wrong time|timing|too soon|too late|not ready/i],
];

function detectIntent(text: string): Intent {
  for (const [intent, pattern] of INTENT_PATTERNS) {
    if (pattern.test(text)) return intent;
  }
  return "general";
}

// ─── Response templates per intent ───────────────────────────────────────────
// {{u}} = user name  {{p}} = partner name  {{uMoon}} = user moon sign
// {{pMoon}} = partner moon sign  {{uNak}} = user nakshatra
// {{pNak}} = partner nakshatra  {{dasha}} = user dasha lord
// {{guna}} = guna score  {{relType}} = relationship type
// {{uLagna}} = user lagna  {{pLagna}} = partner lagna

const RESPONSES: Record<Intent, string[]> = {

  misses_me: [
    "The charts tell a nuanced story here. {{p}}'s {{pNak}} nakshatra belongs to a deeply nostalgic energy — people with this birth star don't let go of meaningful connections easily. The emotional imprint you left doesn't fade on a {{pMoon}} moon. But missing someone and being ready are two different things. The question isn't whether they miss you. It's whether that missing is directing them toward growth — or keeping them comfortable in ambiguity.",
    "Vedic astrology looks at the 12th house for hidden emotions — what we feel but don't say. Without knowing {{p}}'s birth time precisely, I can still read their {{pNak}} nakshatra, whose ruling deity governs memory and attachment. What I see: the emotional bond between you isn't erased. But a {{pMoon}} moon processes feeling privately. They likely think about you more than they show. The harder truth is — awareness without action means nothing.",
    "Your {{uMoon}} moon makes you someone who's deeply felt by others, often more than you know. The connection you shared with {{p}} activated something real in their chart — {{pNak}} nakshatras form strong impressions. Do they miss you? Probably. But right now you're in your {{dasha}} mahadasha, which is about reclaiming your own center. That might matter more than their answer.",
    "I see this question a lot, and the astrological truth is rarely simple. {{p}} has a {{pMoon}} moon — that energy holds on. Their {{pNak}} nakshatra is associated with loyalty and long memories. So yes, some part of them likely still carries this. But here's what the stars are actually asking you: why does knowing that matter so much right now? Your energy — not their memory of you — is where your real answer lives.",
  ],

  loves_me: [
    "The {{guna}}/36 compatibility between you and {{p}} isn't just a number — it maps where love flows easily and where it gets tangled. Venus in {{p}}'s chart sits in {{pMoon}} rashi, which is a placement that bonds deeply but protects itself fiercely. They likely feel more than they say. The question is whether their way of loving matches what you need to feel loved — because love that doesn't reach you isn't enough.",
    "Astrology can tell you someone's emotional blueprint, not their current choice. {{p}}'s {{pNak}} nakshatra has a ruling deity associated with deep devotion — it's not a cold placement. But your {{uMoon}} moon needs to feel that devotion expressed, not just stored. If you're asking this question, something in how they show up isn't landing. That gap is worth naming.",
    "Your {{uLagna}} lagna and {{p}}'s {{pLagna}} lagna create a specific relational dynamic. The {{pMoon}} moon energy {{p}} carries is one that loves in quiet, consistent ways — not grand gestures. If you've been waiting for something dramatic, it may never come. But if you look at the small ways they've shown up — that's often where the real answer is hiding.",
    "Love in Vedic astrology lives in the 5th and 7th houses. The Guna score of {{guna}}/36 between you two signals strong emotional resonance — particularly in the Graha Maitri koota, which governs mental and emotional friendship. But feelings aren't the same as commitment. What does {{p}} actually do with what they feel? That's where your real answer is.",
  ],

  come_back: [
    "Timing in Vedic astrology is governed by dashas — planetary periods that shift your inner priorities. You're currently in your {{dasha}} mahadasha. This is a period that often brings back what was left unresolved — not to restart it, but to finally understand it. Whether {{p}} comes back or not, this dasha is asking you to decide what kind of love you actually want to build. That clarity is the real prize.",
    "The {{guna}}/36 score between you and {{p}} shows {{#high}}a genuinely rare astrological bond{{/high}}{{#low}}real friction in core compatibility areas{{/low}}. Reconnection is written in charts where the moon signs continue to pull at each other — and {{pMoon}} moon does carry lingering attachment energy. But the universe rarely brings something back exactly as it was. If they return, it would need to be a different version of the connection. Are you ready to let the old version go?",
    "Return depends on two things in astrology: their current dasha energy, and unresolved karma between charts. {{p}}'s {{pNak}} nakshatra has a mythic pattern of leaving and circling back — it's in the nature of that star. But the real question isn't about them. Your {{dasha}} period is one of {{dashaTheme}}. Building something new in that energy — with or without {{p}} — is where your power is right now.",
    "I won't tell you they'll definitely come back. What I can tell you is this: the Bhakoot compatibility between your moon signs suggests an emotional tether that doesn't sever cleanly. People don't just walk away from {{guna}}/36 connections without feeling it. But whether they act on it depends on where they are in their own dasha cycle — and that's outside your control. What's inside your control: how you use this time.",
  ],

  should_text: [
    "Here's the astrological read: you're in {{dasha}} mahadasha right now — a period that governs {{dashaTheme}}. Acting from fear (that they'll forget you, that the window will close) tends to produce outcomes that don't hold. Acting from clarity — knowing exactly what you want to say and why — is different. If you have to ask whether to text, you likely haven't found that clarity yet. When you have it, you won't need to ask.",
    "The {{uMoon}} moon in your chart makes you someone who processes emotion through connection — reaching out feels natural, even necessary. But your {{uNak}} nakshatra's wisdom is about knowing when action serves the situation and when it serves the anxiety. Right now, the honest answer is: what would you actually say? And is that what you want them to hear?",
    "{{p}}'s {{pNak}} nakshatra responds to directness — not testing the waters. If you reach out, say something real or don't say anything. 'Hey' texts from a {{pMoon}} moon perspective register as noise. But a genuine, clear message? That lands. The question isn't whether to text — it's whether you're ready to be that direct.",
    "Astrologically, Venus governs how we initiate in love — and your Venus placement suggests you lead with warmth, not strategy. If texting {{p}} comes from a real feeling (not checking if they respond), do it. If it comes from needing reassurance, know that reassurance from someone else is a temporary fix. The peace you're looking for has to come from you first.",
  ],

  why_left: [
    "{{p}}'s {{pNak}} nakshatra — ruled by {{pNakLord}} — is associated with transformation and abrupt change. Sometimes people with this nakshatra pull away not because the connection wasn't real, but because it triggered something in them they weren't ready to face. Your {{uLagna}} energy is intense and perceptive — that's beautiful, but it can also feel threatening to someone who hasn't done their own inner work. Their leaving often says more about their readiness than your worth.",
    "The honest astrological read: the tension areas in your {{guna}}/36 compatibility — particularly the Bhakoot and Gana factors — create a dynamic where one person tends to retreat when things get real. {{p}}'s {{pMoon}} moon handles vulnerability by creating distance. This isn't about you doing something wrong. It's about a gap in how you two process emotional intimacy.",
    "Pulling away is rarely about the surface reason given. In your charts, {{p}}'s {{pLagna}} lagna creates a specific pattern around intimacy — they get close, then need space to recalibrate. Your {{uNak}} nakshatra energy is one that demands presence and honesty. That combination can feel overwhelming for someone who hasn't figured out how to stay. It's not a flaw in either of you — it's a friction that needed more self-awareness to navigate.",
    "Saturn teaches through absence. In your current {{dasha}} mahadasha, endings often arrive as teachers, not punishments. What did this connection show you about what you need? About what you won't accept? {{p}} pulling away was a moment in both of your journeys — not the final word on who you are or what you deserve. The chart doesn't end here.",
  ],

  why_fight: [
    "Your {{uMoon}} moon and {{p}}'s {{pMoon}} moon create a specific emotional friction point. {{uMoon}} processes feeling through {{uMoonStyle}}, while {{pMoon}} defaults to {{pMoonStyle}}. When stress hits, you both escalate in opposite directions — which feels like fighting but is actually two different self-protection styles colliding. Understanding this doesn't fix it. But naming it changes the conversation.",
    "Mars governs how we fight — and the Mars interaction between your charts ({{uNak}} vs {{pNak}} nakshatra energy) creates a pattern where small misunderstandings quickly become symbolic battles. Neither of you is actually fighting about what you're fighting about. The surface argument is usually a stand-in for a deeper unmet need. What is the recurring fight actually about for you?",
    "The Gana compatibility between your nakshatras affects how you approach conflict. {{uNak}} is {{uGana}} gana; {{pNak}} is {{pGana}} gana. When these energies clash, one person tends to over-explain while the other shuts down. The solution isn't winning arguments — it's learning each other's emotional language. That's a choice, not a compatibility verdict.",
    "Conflict in a {{relType}} dynamic often signals unspoken expectation. What you fight about is rarely the real issue — it's the shorthand for 'I need you to understand something I haven't said clearly.' Your {{uLagna}} lagna makes you someone who wants alignment, not just agreement. {{p}}'s {{pMoon}} moon tends to hear criticism even in neutral statements. Slowing down — saying less, not more — often breaks the cycle faster.",
  ],

  compatible: [
    "Your Guna Milan score is {{guna}} out of 36. Anything above 18 is considered workable; above 24 is considered good; above 28 is considered exceptional. Your score places you in the {{gunaVerdict}} range. But here's what numbers don't capture: compatibility isn't about matching — it's about whether both people are willing to do the work to bridge where they differ. {{guna}}/36 with two self-aware people beats 36/36 with two people who refuse to grow.",
    "Astrologically, your {{uMoon}} moon in {{uMoon}} rashi and {{p}}'s {{pMoon}} moon in {{pMoon}} rashi create a specific relational rhythm. The question isn't 'are we compatible' — it's 'what does this connection require of us?' Your charts show strong resonance in emotional depth and communication energy. The friction areas — which every couple has — are around pacing and emotional expression. That's workable.",
    "Compatible doesn't mean easy. It means built for something real. The {{guna}}/36 score between you reflects strong cosmic resonance across most of the 8 kootas — but the Nadi and Bhakoot factors deserve attention. These areas predict where two people will most likely get stuck. The stars aren't saying don't — they're saying go in with eyes open. That's different.",
    "The most compatible charts I've seen still have friction — because the friction is where the growth lives. What your {{guna}}/36 score tells me is that you and {{p}} share a genuine emotional basis (Graha Maitri) and similar life purpose energy (Gana). Those two are the hardest to fake. The rest — communication, pacing, love languages — those are learnable. The foundation matters more.",
  ],

  move_on: [
    "Healing isn't linear, and astrology doesn't rush it. Your {{dasha}} mahadasha is a {{dashaTheme}} period — which means this phase has a purpose beyond just getting over {{p}}. Something is being cleared, refined, or completed in you. The question isn't 'how do I stop thinking about them.' It's 'what is this experience teaching me that I couldn't have learned any other way?'",
    "Your {{uNak}} nakshatra — ruled by {{uNakLord}} — is associated with deep emotional bonds that don't sever easily. The intensity with which you feel this connection is a function of your chart, not a weakness. But that same depth is what will eventually land you in something far more reciprocal. Right now the work is distinguishing between the bond itself and the person. The bond is yours. They were just the vessel for it.",
    "Letting go in Vedic astrology is associated with the 12th house — the house of release, dissolution, and spiritual surrender. Your {{uMoon}} moon in {{uMoon}} rashi needs to process grief through {{uMoonStyle}}, not around it. Give yourself the full weight of what this was. People heal faster when they stop trying to speed up the grief and start letting it mean what it means.",
    "Moving on doesn't mean forgetting. It means the memory no longer dictates your present. Your current {{dasha}} dasha is clearing the emotional ground for what comes next — and what comes next in your chart is genuinely good. But it requires space. Creating distance from {{p}} isn't giving up on love — it's creating the conditions for love to find you in a form that actually works.",
  ],

  future: [
    "Future in Vedic astrology is read through dashas — planetary periods that shift the themes of your life. You're currently in your {{dasha}} mahadasha, which governs {{dashaTheme}}. This period {{dashaFuture}}. The relationship question you're asking exists inside that larger arc. If this connection is meant to unfold, it will find its opening here. If it doesn't, what opens instead may be better suited to where you're actually going.",
    "I'm going to be honest: no astrology reading can tell you 'it will work out' with certainty. What I can tell you is that your chart — particularly your {{uLagna}} lagna and current dasha — is moving toward a phase of greater emotional clarity. Connections that belong in your next chapter tend to stabilize around that shift. Connections that don't tend to resolve themselves before it.",
    "The {{guna}}/36 score between you and {{p}} gives us a structural read on long-term potential. {{gunaFuture}} But ultimately, the future of any connection depends on two choices, made daily: to show up honestly, and to keep growing. The charts can tell you where the energy supports you — they can't make the choice for you.",
    "Your {{uNak}} nakshatra's dasha lord right now is {{dasha}}, which is a period associated with {{dashaTheme}}. Relationships that begin or deepen in this dasha tend to carry a specific quality — {{dashaMeaning}}. Whether that applies to {{p}} or someone else, the energy of this period is drawing in connection that matches where you're genuinely headed.",
  ],

  addicted: [
    "What you're describing has a specific astrological signature. Your {{uMoon}} moon in {{uMoon}} rashi forms a strong energetic pull toward {{pMoon}} moon energy — particularly when Rahu is involved in the composite picture. Rahu-influenced connections feel magnetic, fated, and impossible to release — because Rahu activates desire, not discernment. The intensity is real. But intensity and alignment are different things.",
    "{{uNak}} nakshatra people form deep imprints — connections that feel written in. What you're calling addiction is actually your nervous system having learned {{p}}'s energy as a baseline. It can unlearn it. But it requires building a new baseline — routines, people, and experiences that remind you of who you are outside of this dynamic. The withdrawal is real. So is what's on the other side.",
    "The magnetic pull you're describing often shows up in charts where the nodes — Rahu and Ketu — are involved across two people's Moons or Lagnas. This creates a sense of fated-ness that can feel like love but is actually more like karma — an old pattern that needs completing, not repeating. The question worth sitting with: is this pull toward {{p}} specifically, or toward the feeling they gave you?",
    "Your {{dasha}} mahadasha is asking you to reckon with exactly this — the attachments that feel necessary but aren't nourishing. {{dasha}} as a dasha lord governs {{dashaTheme}}. The 'addiction' you're feeling is your psyche trying to resolve something unfinished. The resolution doesn't require {{p}}. It requires understanding what you were really looking for in them.",
  ],

  confused: [
    "Confusion often means you already know the answer, but it conflicts with what you want the answer to be. Your {{uMoon}} moon in {{uMoon}} rashi is highly intuitive — you pick up on things before you can name them. When you're confused about {{p}}, pay attention to what your gut said first, before the explanations started. That first read is usually the accurate one.",
    "Mixed signals from {{p}} usually mean they are genuinely mixed internally. {{pMoon}} moon people experience ambivalence acutely — they can want you and not be ready at the same time. Both things are true. The confusion isn't in their signal; it's in trying to get one clear answer from someone who hasn't resolved the question themselves. You deserve someone who's figured out what they want.",
    "Your {{uNak}} nakshatra gives you strong perceptive abilities — you sense more than you're being told. The fact that you're confused usually means the information you've been given doesn't match the information you've felt. Trust the felt data. Someone who is clear about you doesn't leave you with this many questions.",
    "In Vedic astrology, the 7th house governs partnership clarity. When that house is active under a certain dasha — which yours is right now — the confusion is actually part of a clarification process. You're not lost. You're in the middle of figuring out what you actually want, which looks like confusion from the inside. Keep asking the questions. The answer is forming.",
  ],

  red_flag: [
    "I hear this concern, and I want to take it seriously. Patterns that feel off usually are off — your {{uMoon}} moon makes you someone who senses emotional safety (or its absence) accurately. Astrology doesn't override your lived experience. If something feels harmful, the chart data doesn't change that. What specifically are you noticing?",
    "Your {{uNak}} nakshatra is associated with sharp discernment — you read between lines well. When you're naming something as a red flag, that's not overthinking. It's your chart doing its job. The harder question is whether you're willing to act on what you're seeing — or whether the pull to stay is louder than the signal to protect yourself.",
    "Sometimes we want astrology to tell us we're wrong about what we're sensing. But the {{uMoon}} moon doesn't manufacture alarm where there's none. If {{p}}'s behavior is leaving you uncertain about your own reality, that's not a compatibility problem — that's a safety signal. The chart can't override that. And it wouldn't want to.",
    "I want to be honest with you: no compatibility score justifies staying in something that harms you. A {{guna}}/36 bond can be genuinely strong and still be wrong for you right now. Sometimes the most astrologically significant relationship we have is the one that teaches us exactly what we won't accept. That lesson is worth more than the connection.",
  ],

  timing: [
    "Timing in Vedic astrology is one of the most sophisticated tools we have. Your current {{dasha}} mahadasha — ruling planet {{dasha}} — governs a {{dashaTheme}} phase in your life. Relationships that begin or evolve during this period carry the signature of that energy. If this feels too soon or too late, the dasha is telling you something real. The right timing isn't just calendar dates — it's internal readiness.",
    "The {{uNak}} nakshatra you were born under has a specific rhythm — a cycle of openings and contractions. Right now, based on your dasha position, you're in {{dashaPhase}}. Forcing a connection forward in a contraction phase tends to produce strain, not depth. Trusting the pause doesn't mean giving up — it means not spending energy that belongs to your next opening.",
    "Here's what I know about timing: 'too late' is rarely actually too late for something meant to happen. 'Too soon' usually means there's growth that hasn't occurred yet on one or both sides. Your {{dasha}} dasha is {{dashaTheme}} — which suggests this period is about {{dashaMeaning}}. The timing question isn't about {{p}}'s schedule. It's about whether you're building toward something or just waiting.",
    "{{p}}'s {{pNak}} nakshatra has a natural rhythm of retreating before returning — it's a star associated with cycles, not straight lines. If the timing between you keeps missing, it may not be permanent misalignment — it may be two people on slightly different cycles trying to synchronize. The question is whether both of you are willing to do the work in the gap.",
  ],

  general: [
    "Your {{uMoon}} moon in {{uMoon}} rashi is where your emotional truth lives — and it's worth listening to right now. The {{dasha}} mahadasha you're moving through has a way of bringing unresolved questions to the surface, not to overwhelm you, but to finally clarify them. What does your gut say about this situation? Start there.",
    "Every chart has what's called a yoga — a combination of planets that defines a person's strongest theme. Yours shows someone with significant emotional depth and perception. You tend to know more than you let yourself admit. The question is always whether you're willing to act on what you already know.",
    "The {{guna}}/36 score between you and {{p}} reflects real data — but data without interpretation is just numbers. What I'd ask you to focus on is this: does this connection bring out the version of you that you're proud of? Or does it pull you into a smaller, more anxious version of yourself? That answer matters more than any chart.",
    "Relationship clarity in Vedic astrology often comes through the 4th house — the house of inner peace. When a connection disturbs your 4th house energy, you feel it as constant mental noise. When it nourishes it, there's a quiet sense of rightness even through difficulty. How does your connection with {{p}} feel in that inner space?",
    "Your {{uLagna}} lagna gives you a specific lens through which you interpret love — {{lagnaLoveSyle}}. This is your natural relationship default. Whether it's working for you in the current dynamic with {{p}} is the real question. Sometimes we confuse our natural style for a fixed truth, when it's actually just a starting point.",
  ],
};

// ─── Dasha themes ────────────────────────────────────────────────────────────

const DASHA_THEMES: Record<string, { theme: string; meaning: string; future: string; phase: string }> = {
  Surya:      { theme: "identity, confidence, and self-recognition", meaning: "clarity about who you truly are",          future: "brings visibility and recognition to what you've been building",                             phase: "a period of personal clarification" },
  Chandra:    { theme: "emotional depth, home, and inner security",  meaning: "creating safety from within",             future: "heightens emotional receptivity — both to what nourishes and what drains",                   phase: "a highly intuitive, emotionally open window" },
  Mangal:     { theme: "courage, action, and cutting through",       meaning: "acting on what you've been hesitating on", future: "demands directness — indecision becomes increasingly uncomfortable",                         phase: "a high-energy period that rewards bold choices" },
  Budh:       { theme: "communication, analysis, and discernment",  meaning: "seeing clearly without the emotional noise","future": "sharpens your ability to tell the difference between what's real and what you're projecting", phase: "an analytical phase — you're meant to think, not just feel" },
  Brihaspati: { theme: "expansion, wisdom, and belief",             meaning: "growing beyond the version of you that stayed too small", future: "opens doors that felt locked — particularly around love and learning", phase: "a growth phase that rewards faith over fear" },
  Shukra:     { theme: "love, beauty, pleasure, and connection",    meaning: "what you truly desire in a partner",       future: "is one of the most relationship-oriented dashas there is — what you build in it tends to last", phase: "a period deeply aligned with romantic and creative energy" },
  Shani:      { theme: "discipline, patience, and long-term structure", meaning: "separating what's real from what's convenient", future: "rewards slow, deliberate building — and gradually removes what wasn't truly yours anyway", phase: "a structuring phase — things that last are being established" },
  Rahu:       { theme: "obsession, ambition, and karmic acceleration", meaning: "facing your deepest desires without filters", future: "intensifies everything — including whatever connection you're in or seeking",            phase: "a high-intensity period where karmic themes surface rapidly" },
  Ketu:       { theme: "release, detachment, and spiritual insight",  meaning: "letting go of identities that no longer serve you", future: "tends to remove what's not essential and deepen what is", phase: "a quieting phase — meaning often comes through what you release" },
};

// Moon style by rashi
const MOON_STYLES: Record<string, string> = {
  Mesha: "quick action and direct expression", Vrishabha: "slow, tactile reassurance",
  Mithuna: "talking through it", Karka: "withdrawal and inner processing",
  Simha: "creative expression and being seen", Kanya: "analysis and problem-solving",
  Tula: "seeking balance and mirroring others", Vrishchika: "deep intensity and silence",
  Dhanu: "reframing through philosophy", Makara: "containment and practical action",
  Kumbha: "intellectual detachment", Meena: "emotional merging and intuition",
};

// Lagna love style
const LAGNA_LOVE: Record<string, string> = {
  Mesha:      "you love with urgency and directness, which can feel intense to slower signs",
  Vrishabha:  "you love through consistency, touch, and devotion — loyalty is your love language",
  Mithuna:    "you love through words, ideas, and mental connection — boredom is your real enemy",
  Karka:      "you love through nurturing and creating safety — you feel everything deeply",
  Simha:      "you love with loyalty and generosity — you need to be seen and appreciated in return",
  Kanya:      "you love through acts of service and quality — you notice every detail about the people you care for",
  Tula:       "you love through partnership and harmony — you're drawn to beauty and mutual growth",
  Vrishchika: "you love with total intensity — halfway isn't in your vocabulary",
  Dhanu:      "you love through shared adventure and expansion — freedom and growth matter to you",
  Makara:     "you love through commitment and protection — you show up through actions, not words",
  Kumbha:     "you love through friendship and vision — you need intellectual compatibility as much as emotional",
  Meena:      "you love by dissolving boundaries — you feel others' emotions as your own",
};

// Guna verdicts
function gunaVerdict(score: number): string {
  if (score >= 28) return "exceptional";
  if (score >= 21) return "good";
  if (score >= 18) return "average";
  return "challenging";
}

function gunaFuture(score: number): string {
  if (score >= 28) return "At {{guna}}/36, your charts show rare natural resonance across most of the 8 compatibility factors.";
  if (score >= 21) return "At {{guna}}/36, your charts show solid natural alignment with some intentional areas.";
  if (score >= 18) return "At {{guna}}/36, your charts work — but require conscious effort in the friction areas.";
  return "At {{guna}}/36, your charts flag significant friction — not impossible, but requiring exceptional self-awareness from both people.";
}

// ─── Template fill ────────────────────────────────────────────────────────────

import { NAKSHATRAS, RASHIS, getAstrologyReading as getReading } from "./astrology";

function fillTemplate(template: string, ctx: Record<string, string>): string {
  let out = template;
  for (const [key, val] of Object.entries(ctx)) {
    out = out.replaceAll(`{{${key}}}`, val);
  }
  // Remove any unfilled {{...}} placeholders
  out = out.replace(/\{\{[^}]+\}\}/g, "");
  return out;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getOracleResponse(
  userMessage: string,
  userName: string,
  userBirthDate: string,
  partnerName: string,
  partnerBirthDate: string,
  relationshipType: string
): string {
  const intent = detectIntent(userMessage);
  const templates = RESPONSES[intent];

  // Build context from real astrological data
  const reading = getAstrologyReading(userName, userBirthDate, partnerName, partnerBirthDate);
  const { user, partner, guna } = reading;

  const uRashi = RASHIS[user.moonRashi];
  const pRashi = RASHIS[partner.moonRashi];
  const uLagna = RASHIS[user.lagnaRashi];
  const pLagna = RASHIS[partner.lagnaRashi];
  const uNak = NAKSHATRAS[user.nakshatra];
  const pNak = NAKSHATRAS[partner.nakshatra];
  const dasha = user.dasha;
  const dashaData = DASHA_THEMES[dasha.current] || DASHA_THEMES["Chandra"];

  const ctx: Record<string, string> = {
    u: userName,
    p: partnerName,
    uMoon: uRashi.name,
    pMoon: pRashi.name,
    uLagna: uLagna.name,
    pLagna: pLagna.name,
    uNak: uNak.name,
    pNak: pNak.name,
    uNakLord: uNak.lord,
    pNakLord: pNak.lord,
    uGana: uNak.gana,
    pGana: pNak.gana,
    dasha: dasha.current,
    dashaTheme: dashaData.theme,
    dashaMeaning: dashaData.meaning,
    dashaFuture: dashaData.future,
    dashaPhase: dashaData.phase,
    guna: String(guna.total),
    gunaVerdict: gunaVerdict(guna.total),
    gunaFuture: gunaFuture(guna.total).replace("{{guna}}", String(guna.total)),
    relType: relationshipType,
    uMoonStyle: MOON_STYLES[uRashi.name] || "emotional depth",
    pMoonStyle: MOON_STYLES[pRashi.name] || "quiet intensity",
    lagnaLoveSyle: LAGNA_LOVE[uLagna.name] || "deep emotional commitment",
  };

  // Deterministic seed: intent + user + partner + message-length bucket
  const seed = `${intent}:${userName}:${partnerName}:${userMessage.length}`;
  const template = pick(templates, seed);
  return fillTemplate(template, ctx);
}
