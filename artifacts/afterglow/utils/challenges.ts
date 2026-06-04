// Challenges & Remedies — local generation + API enrichment
import { RASHIS, NAKSHATRAS, type AstrologyReading } from "./astrology";

export interface ChallengeSolution {
  title: string;
  description: string;
  type: "practical" | "communication" | "spiritual" | "ritual" | "professional";
  isPremium: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "mild" | "moderate" | "severe";
  tags: string[];
  solutions: ChallengeSolution[];
  sort_order: number;
  match_score: number;
}

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

// ─── Attribute extraction ──────────────────────────────────────────────────────

export function extractKundliAttributes(reading: AstrologyReading, relationshipType: string) {
  const u = reading.user;
  const p = reading.partner;
  const guna = reading.guna;

  const userMoonRashi   = RASHIS[u.moonRashi].name;
  const userSunRashi    = RASHIS[u.sunRashi].name;
  const userNakshatra   = NAKSHATRAS[u.nakshatra].name;
  const userGana        = NAKSHATRAS[u.nakshatra].gana;
  const userElement     = RASHIS[u.moonRashi].element;
  const userDashaLord   = u.dasha.current;

  const partnerMoonRashi = RASHIS[p.moonRashi].name;
  const partnerNakshatra = NAKSHATRAS[p.nakshatra].name;
  const partnerGana      = NAKSHATRAS[p.nakshatra].gana;
  const partnerElement   = RASHIS[p.moonRashi].element;

  const mangalDosha  = guna.mangalDosha;
  const nadiDosha    = guna.nadiDosha;
  const bhakootScore = guna.breakdown.find((b) => b.name === "Bhakoot")?.score ?? 7;
  const bhakootDosha = bhakootScore === 0;
  const yoniScore    = guna.breakdown.find((b) => b.name === "Yoni")?.score ?? 4;
  const yoniEnemy    = yoniScore === 0;
  const gunaScore    = guna.total;

  return {
    userMoonRashi, userSunRashi, userNakshatra, userGana, userElement, userDashaLord,
    partnerMoonRashi, partnerNakshatra, partnerGana, partnerElement,
    mangalDosha, nadiDosha, bhakootDosha, gunaScore, relationshipType, yoniEnemy,
    userMoonRashiElement: RASHIS[u.moonRashi].element,
    userMoonRashiLord: RASHIS[u.moonRashi].lord,
    nakshatraGod: NAKSHATRAS[u.nakshatra].deity,
  };
}

type Attrs = ReturnType<typeof extractKundliAttributes>;

// ─── Local challenge generator ─────────────────────────────────────────────────
// Produces 40-60 personalised challenges instantly, with no network call.
// Uses the same categories and tag taxonomy as the DB seed.

export function generateLocalChallenges(reading: AstrologyReading, relationshipType: string): Challenge[] {
  const a = extractKundliAttributes(reading, relationshipType);
  const results: Challenge[] = [];
  let order = 0;
  const id = () => `local_${order}`;

  const push = (c: Omit<Challenge, "id" | "sort_order" | "match_score"> & { score?: number }) => {
    results.push({ ...c, id: id(), sort_order: order++, match_score: c.score ?? 1 });
  };

  // ── Moon rashi (always shown — high relevance) ─────────────────────────────

  const rashiTraits: Record<string, { needs: string; fear: string; shadow: string; element: string }> = {
    Mesha:      { needs: "autonomy and respect",     fear: "being controlled",       shadow: "impulsivity",         element: "Fire"  },
    Vrishabha:  { needs: "stability and comfort",    fear: "sudden change",          shadow: "possessiveness",      element: "Earth" },
    Mithuna:    { needs: "variety and stimulation",  fear: "boredom",                shadow: "inconsistency",       element: "Air"   },
    Karka:      { needs: "emotional security",       fear: "abandonment",            shadow: "over-sensitivity",    element: "Water" },
    Simha:      { needs: "recognition and loyalty",  fear: "being ignored",          shadow: "ego",                 element: "Fire"  },
    Kanya:      { needs: "order and reliability",    fear: "chaos and failure",      shadow: "criticism",           element: "Earth" },
    Tula:       { needs: "harmony and fairness",     fear: "conflict and rejection", shadow: "indecision",          element: "Air"   },
    Vrishchika: { needs: "depth and transformation", fear: "betrayal",               shadow: "suspicion",           element: "Water" },
    Dhanu:      { needs: "freedom and meaning",      fear: "restriction",            shadow: "restlessness",        element: "Fire"  },
    Makara:     { needs: "achievement and respect",  fear: "failure",                shadow: "emotional coldness",  element: "Earth" },
    Kumbha:     { needs: "intellectual freedom",     fear: "conformity",             shadow: "detachment",          element: "Air"   },
    Meena:      { needs: "transcendence and empathy",fear: "boundaries",             shadow: "escapism",            element: "Water" },
  };

  const rt = rashiTraits[a.userMoonRashi];
  if (rt) {
    push({
      title: `${a.userMoonRashi} Moon's need for ${rt.needs} going unmet`,
      description: `With the Moon in ${a.userMoonRashi}, your emotional core runs on a deep need for ${rt.needs}. When this need is consistently unmet — often because it's never spoken — it shows up as ${rt.shadow} and quiet resentment.`,
      category: "Emotional Needs", severity: "moderate",
      tags: [`moon_rashi:${a.userMoonRashi}`, "universal"],
      score: 3,
      solutions: [
        { title: `Name the need directly`, description: `Instead of hoping they figure it out, say clearly: "I need ${rt.needs} right now." It feels vulnerable, but it works.`, type: "communication", isPremium: false },
        { title: `${a.userMoonRashiLord} strengthening`, description: `Your Moon is ruled by ${a.userMoonRashiLord}. Chanting its Beej mantra on its ruling day can ease the emotional intensity.`, type: "ritual", isPremium: true },
      ],
    });

    push({
      title: `${a.userMoonRashi} Moon's core fear of ${rt.fear} surfacing in arguments`,
      description: `The fear of ${rt.fear} is at the root of how ${a.userMoonRashi} Moon people respond in conflict. Arguments that trigger this fear stop being about the topic and become about the fear itself — which your partner can't see.`,
      category: "Conflict", severity: "moderate",
      tags: [`moon_rashi:${a.userMoonRashi}`],
      score: 3,
      solutions: [
        { title: "Name the fear, not just the argument", description: `In a calm moment, tell your partner: "When we fight about X, what I'm really scared of is ${rt.fear}." This single sentence can reframe how they show up.`, type: "communication", isPremium: false },
        { title: "Fear journal", description: "Write about instances this week where this fear arose. Pattern recognition reduces its unconscious control.", type: "practical", isPremium: false },
      ],
    });

    push({
      title: `${rt.shadow} showing up and damaging closeness`,
      description: `The shadow side of ${a.userMoonRashi} Moon is ${rt.shadow}. Under stress this tendency intensifies and is often invisible to you while being painfully visible to your partner.`,
      category: "Shadow Work", severity: "moderate",
      tags: [`moon_rashi:${a.userMoonRashi}`],
      score: 2,
      solutions: [
        { title: `Catch ${rt.shadow} early`, description: `When you feel it rising, name it to yourself: "This is my ${a.userMoonRashi} shadow, not the truth." Naming it reduces its grip.`, type: "spiritual", isPremium: false },
        { title: "Ask for feedback", description: "Ask your partner: 'When do I seem most [shadow trait] to you?' Their answer is information, not an attack.", type: "communication", isPremium: false },
      ],
    });
  }

  // ── Nakshatra (high relevance) ─────────────────────────────────────────────

  const ganaChallenge: Record<string, { tone: string; challenge: string }> = {
    Deva:     { tone: "idealistic",  challenge: "can feel too otherworldly for partners grounded in practical reality" },
    Manushya: { tone: "balanced",    challenge: "can get stuck in the mundane and lose the larger meaning of the relationship" },
    Rakshasa: { tone: "intense",     challenge: "can overwhelm partners who need more gentleness and space" },
  };
  const gc = ganaChallenge[a.userGana];

  push({
    title: `${a.userNakshatra} nakshatra's ${a.userGana} temperament creating friction`,
    description: `Born under ${a.userNakshatra}, you carry ${gc?.tone ?? "complex"} energy. In relationships this ${gc?.challenge ?? "creates unique tensions"}. The ${a.userDashaLord}-flavored sensitivity amplifies this in close quarters.`,
    category: "Temperament", severity: "moderate",
    tags: [`nakshatra:${a.userNakshatra}`, `gana:${a.userGana}`],
    score: 2,
    solutions: [
      { title: "Explain your nature, don't apologise for it", description: `Tell your partner: "I'm ${gc?.tone ?? "complex"} by nature. Here's what that actually means for how I love." Understanding removes a lot of conflict.`, type: "communication", isPremium: false },
      { title: `${a.nakshatraGod} blessing ritual`, description: `Offering prayers to ${a.nakshatraGod}, the presiding deity of ${a.userNakshatra} nakshatra, invites grace into the relationship dimension of this nakshatra's energy.`, type: "ritual", isPremium: true },
    ],
  });

  // ── Dasha lord (high relevance) ────────────────────────────────────────────

  const dashaThemes: Record<string, { keyword: string; relChallenge: string }> = {
    Ketu:       { keyword: "detachment",    relChallenge: "emotional disconnection, pulling away spiritually from the relationship" },
    Shukra:     { keyword: "pleasure",      relChallenge: "overindulgence or sudden loss of romantic interest" },
    Surya:      { keyword: "authority",     relChallenge: "ego conflicts and difficulty yielding in disagreements" },
    Chandra:    { keyword: "emotion",       relChallenge: "mood instability and emotional flooding affecting day-to-day life" },
    Mangal:     { keyword: "action",        relChallenge: "impulsiveness and impatience causing regrettable decisions" },
    Rahu:       { keyword: "obsession",     relChallenge: "unhealthy attachment patterns or sudden destabilising events" },
    Brihaspati: { keyword: "wisdom",        relChallenge: "over-moralising or expecting too much spiritual alignment from a partner" },
    Shani:      { keyword: "karma",         relChallenge: "feeling burdened, delays in relationship milestones, karmic lessons surfacing" },
    Budh:       { keyword: "analysis",      relChallenge: "overthinking love and analysis paralysis preventing emotional presence" },
  };

  const dt = dashaThemes[a.userDashaLord];
  if (dt) {
    push({
      title: `${a.userDashaLord} mahadasha bringing ${dt.keyword} energy into the relationship`,
      description: `You're currently in ${a.userDashaLord} dasha, and its primary theme of ${dt.keyword} is colouring every experience. The specific relationship challenge this period brings: ${dt.relChallenge}.`,
      category: "Dasha Timing", severity: "moderate",
      tags: [`dasha:${a.userDashaLord}`],
      score: 2,
      solutions: [
        { title: "Tell your partner about your dasha", description: `Sharing "I'm in a ${a.userDashaLord} period that tends toward ${dt.keyword}" gives them context to understand your current patterns.`, type: "communication", isPremium: false },
        { title: `${a.userDashaLord} pacification practice`, description: `Research the specific mantra, colour, and day associated with ${a.userDashaLord} and build a simple weekly practice around it during this dasha period.`, type: "ritual", isPremium: false },
      ],
    });
  }

  // ── Dosha challenges ────────────────────────────────────────────────────────

  if (a.mangalDosha) {
    push({
      title: "Mangal dosha creating conflict-prone patterns in this relationship",
      description: "Mangal (Mars) in a sensitive house in your chart introduces intensity and fire into the way you engage in conflict and close relationships. This isn't a curse — but it does require conscious management of Martian energy.",
      category: "Dosha", severity: "severe",
      tags: ["dosha:mangal"],
      score: 4,
      solutions: [
        { title: "Channel Mars energy outward", description: "Mars energy needs a worthy challenge. Direct it into shared goals, fitness, or ambitious projects — this converts aggression into vitality.", type: "practical", isPremium: false },
        { title: "Kuja Dosha Nivaran puja", description: "A Mangal Shanti puja performed on a Tuesday can significantly reduce the dosha's relational impact.", type: "ritual", isPremium: true },
        { title: "10-second pause before responding in conflict", description: "The Martian instinct is immediate reaction. A committed 10-second pause before responding interrupts the pattern.", type: "practical", isPremium: false },
      ],
    });
  }

  if (a.nadiDosha) {
    push({
      title: "Nadi dosha — same physiological energy type creating subtle friction",
      description: "Both partners share the same Nadi (physiological energy type). Classical Vedic astrology considers this a significant factor affecting long-term compatibility and health vitality within the relationship.",
      category: "Dosha", severity: "moderate",
      tags: ["dosha:nadi"],
      score: 4,
      solutions: [
        { title: "Nadi dosha puja", description: "A Nadi Nirvana puja with Mahamrityunjaya mantra (1008 recitations) is the classical remedy for this dosha.", type: "ritual", isPremium: true },
        { title: "Health monitoring practice", description: "Couples with Nadi dosha benefit from proactive health awareness — notice shared stress triggers and manage them before they compound.", type: "practical", isPremium: false },
      ],
    });
  }

  if (a.bhakootDosha) {
    push({
      title: "Bhakoot dosha — moon sign distance creating emotional disconnection",
      description: "Your moon signs are in a challenging Bhakoot position (6-8 or 12-2 relationship). This can manifest as financial friction, health concerns, and difficulty finding emotional wavelength alignment.",
      category: "Dosha", severity: "moderate",
      tags: ["dosha:bhakoot"],
      score: 4,
      solutions: [
        { title: "Shared charity practice", description: "Donating together regularly (especially on Mondays) is a classical Bhakoot remedy — it builds karmic credit for the relationship.", type: "ritual", isPremium: false },
        { title: "Chandra puja for moon harmony", description: "Monthly Purnima offerings of white flowers and milk to Chandra help harmonise the moon-sign friction.", type: "ritual", isPremium: true },
      ],
    });
  }

  if (a.yoniEnemy) {
    push({
      title: "Yoni incompatibility creating friction in intimate bonding",
      description: "Your nakshatras carry enemy yoni animals in the Vedic compatibility system. This indicates a natural tension in physical and intimate closeness that requires deliberate emotional bridging.",
      category: "Intimate Compatibility", severity: "moderate",
      tags: ["yoni:enemy"],
      score: 3,
      solutions: [
        { title: "Prioritise emotional intimacy first", description: "When yoni compatibility is challenging, deepening emotional connection compensates substantially. Physical closeness improves naturally when emotional safety is high.", type: "practical", isPremium: false },
        { title: "Yoni dosha remediation", description: "A Jyotishi can recommend specific remedies for your exact yoni combination.", type: "professional", isPremium: true },
      ],
    });
  }

  // ── Guna score ─────────────────────────────────────────────────────────────

  if (a.gunaScore < 18) {
    push({
      title: `Low Guna score (${a.gunaScore}/36) — fundamental compatibility work needed`,
      description: `A score below 18 indicates significant astrological friction across multiple Ashtakoot dimensions. This doesn't make love impossible, but it does mean this relationship requires more conscious effort than a higher-scoring match.`,
      category: "Compatibility", severity: "severe",
      tags: ["guna:low"],
      score: 4,
      solutions: [
        { title: "Review your Ashtakoot breakdown", description: "Identify which specific dimensions score low (Varna, Gana, Bhakoot, Nadi, etc.) and focus your attention on those areas specifically.", type: "practical", isPremium: false },
        { title: "Consult a qualified Jyotishi", description: "A professional astrologer can identify which doshas are most significant and recommend targeted combined remedies.", type: "professional", isPremium: true },
      ],
    });
  } else if (a.gunaScore < 28) {
    push({
      title: `Medium Guna score (${a.gunaScore}/36) — mixed compatibility requiring targeted work`,
      description: `Your Ashtakoot score is in the moderate range. Some dimensions align well; others present genuine challenges. Knowing which is which is the key to not wasting energy on the wrong problems.`,
      category: "Compatibility", severity: "mild",
      tags: ["guna:medium"],
      score: 2,
      solutions: [
        { title: "Focus on low-scoring Ashtakoot areas", description: "Review your compatibility breakdown. The low-scoring dimensions (not the ones that score well) are where to direct your attention.", type: "practical", isPremium: false },
      ],
    });
  }

  // ── Elemental conflict ─────────────────────────────────────────────────────

  if (a.userElement !== a.partnerElement) {
    const elementConflicts: Record<string, { desc: string }> = {
      "Fire_Water":  { desc: "Fire needs freedom and action; Water needs depth and security. Each can extinguish or evaporate the other if unchecked." },
      "Water_Fire":  { desc: "Fire needs freedom and action; Water needs depth and security. Each can extinguish or evaporate the other if unchecked." },
      "Fire_Earth":  { desc: "Fire wants to leap; Earth wants to build slowly. Fire finds Earth boring; Earth finds Fire reckless." },
      "Earth_Fire":  { desc: "Fire wants to leap; Earth wants to build slowly. Fire finds Earth boring; Earth finds Fire reckless." },
      "Fire_Air":    { desc: "Air fuels Fire's intensity but may feel overwhelmed by the heat it creates." },
      "Air_Fire":    { desc: "Air fuels Fire's intensity but may feel overwhelmed by the heat it creates." },
      "Water_Earth": { desc: "Water and Earth can be deeply compatible but slip into codependency — Water floods, Earth goes rigid." },
      "Earth_Water": { desc: "Water and Earth can be deeply compatible but slip into codependency — Water floods, Earth goes rigid." },
      "Water_Air":   { desc: "Water goes deep into emotion; Air prefers intellectual distance. What feels intimate to Water feels overwhelming to Air." },
      "Air_Water":   { desc: "Water goes deep into emotion; Air prefers intellectual distance. What feels intimate to Water feels overwhelming to Air." },
      "Earth_Air":   { desc: "Earth is tangible and slow. Air is conceptual and quick. They can feel like they're living in different worlds." },
      "Air_Earth":   { desc: "Earth is tangible and slow. Air is conceptual and quick. They can feel like they're living in different worlds." },
    };
    const key = `${a.userElement}_${a.partnerElement}`;
    const ec = elementConflicts[key];
    if (ec) {
      push({
        title: `${a.userElement}–${a.partnerElement} elemental tension causing pacing differences`,
        description: ec.desc,
        category: "Elemental Compatibility", severity: "mild",
        tags: [`element_conflict:${[a.userElement, a.partnerElement].sort().join("_")}`],
        score: 2,
        solutions: [
          { title: "Study your elemental differences", description: `${a.userElement} and ${a.partnerElement} energies have predictable friction points. Understanding them as a pattern — not personal flaws — removes a lot of heat from conflict.`, type: "practical", isPremium: false },
          { title: "Use the complementarity", description: `${a.userElement} brings what ${a.partnerElement} lacks and vice versa. Frame your differences as balance rather than opposition.`, type: "communication", isPremium: false },
        ],
      });
    }
  }

  // ── Gana combination ────────────────────────────────────────────────────────

  if (a.userGana !== a.partnerGana) {
    const ganaMix: Record<string, string> = {
      "Deva_Rakshasa":     "The most challenging Gana combination — the gentle, idealistic Deva can feel overwhelmed by Rakshasa intensity, and the Rakshasa may feel their depth is met with avoidance.",
      "Rakshasa_Deva":     "The most challenging Gana combination — the gentle, idealistic Deva can feel overwhelmed by Rakshasa intensity, and the Rakshasa may feel their depth is met with avoidance.",
      "Deva_Manushya":     "The idealistic Deva may feel misunderstood by the practically-minded Manushya; the Manushya may struggle to meet the Deva's spiritual expectations.",
      "Manushya_Deva":     "The idealistic Deva may feel misunderstood by the practically-minded Manushya; the Manushya may struggle to meet the Deva's spiritual expectations.",
      "Manushya_Rakshasa": "The Rakshasa's intensity can overwhelm the balanced Manushya. The Manushya brings stabilising calm the Rakshasa needs but may resist.",
      "Rakshasa_Manushya": "The Rakshasa's intensity can overwhelm the balanced Manushya. The Manushya brings stabilising calm the Rakshasa needs but may resist.",
    };
    const combo = `${a.userGana}_${a.partnerGana}`;
    const gd = ganaMix[combo];
    if (gd) {
      push({
        title: `${a.userGana}–${a.partnerGana} Gana combination creating temperament clash`,
        description: gd,
        category: "Gana Compatibility", severity: a.userGana === "Deva" && a.partnerGana === "Rakshasa" ? "severe" : "moderate",
        tags: [`gana_combo:${[a.userGana, a.partnerGana].sort().join("_")}`],
        score: 3,
        solutions: [
          { title: "Understand each other's gana archetype", description: `${a.userGana} and ${a.partnerGana} each have valid needs. Understanding what each truly requires removes the sting of incompatibility.`, type: "communication", isPremium: false },
          { title: "Navagraha puja for gana harmony", description: "A combined Navagraha puja helps harmonise differing gana energies.", type: "ritual", isPremium: true },
        ],
      });
    }
  }

  // ── Relationship type ───────────────────────────────────────────────────────

  const relTypeProblems: Record<string, { title: string; description: string; severity: Challenge["severity"]; solutions: ChallengeSolution[] }[]> = {
    crush: [
      {
        title: "Not knowing if feelings are returned",
        description: "The crush phase is defined by uncertainty. You're responding to a version of them you've partly constructed — the real person and the imagined person are still the same image.",
        severity: "mild",
        solutions: [
          { title: "Make one move to get real information", description: "Not to confess — just to have a real conversation. Information replaces projection.", type: "practical", isPremium: false },
          { title: "Set a decision timeline", description: "Give yourself a defined window to either act or redirect your energy. Indefinite ambiguity is more painful than a clear no.", type: "practical", isPremium: false },
        ],
      },
    ],
    situationship: [
      {
        title: "Emotional investment without a defined structure",
        description: "Situationships exist in the painful gap between 'just friends' and 'in a relationship.' The ambiguity is often intentional on one side — they get connection without accountability.",
        severity: "moderate",
        solutions: [
          { title: "Have the defining conversation", description: "Say clearly: 'I need to know what this is. I'm not asking for a lifetime — just whether we're building toward something.' Clarity, even painful clarity, is better than ambiguity.", type: "communication", isPremium: false },
          { title: "Set an internal deadline", description: "If they can't define the relationship within a timeframe you set privately, that itself is information about what they want.", type: "practical", isPremium: false },
        ],
      },
    ],
    relationship: [
      {
        title: "Complacency eroding active love",
        description: "Commitment solved the uncertainty of early love — and in doing so, removed some of the effort. The relationship now runs on inertia rather than intention.",
        severity: "mild",
        solutions: [
          { title: "Annual relationship review", description: "Once a year: what's working, what needs to change, what are our goals for this relationship next year? Structured but meaningful.", type: "practical", isPremium: false },
          { title: "Recreate an early ritual", description: "Something you did in the first 3 months you've stopped doing. A specific walk, meal, playlist. Bring it back.", type: "practical", isPremium: false },
        ],
      },
    ],
    ex: [
      {
        title: "Inability to fully move on after the relationship ended",
        description: "The feelings, patterns, and identity built around this relationship take time to dissolve. Most people rush through this grief and end up carrying it into the next chapter.",
        severity: "moderate",
        solutions: [
          { title: "Create a no-contact rule with an end date", description: "30-90 days of no contact is typically needed to break the neurological attachment. Give it an end date so it feels less permanent.", type: "practical", isPremium: false },
          { title: "Grieve it fully", description: "Allow yourself to properly mourn what you lost, what you hoped for, the version of yourself in that relationship. Skipping this means carrying it.", type: "practical", isPremium: false },
        ],
      },
    ],
  };

  const relProblems = relTypeProblems[a.relationshipType] ?? [];
  relProblems.forEach((rp) => {
    push({
      title: rp.title,
      description: rp.description,
      category: "Relationship Type",
      severity: rp.severity,
      tags: [`relationship:${a.relationshipType}`],
      score: 2,
      solutions: rp.solutions,
    });
  });

  // ── High-relevance universal problems (everyone gets these) ────────────────

  const universals = [
    {
      title: "Emotional withdrawal without explanation",
      description: "One partner suddenly goes cold and distant without saying why. The other is left analysing every recent interaction, wondering what they did wrong.",
      category: "Communication", severity: "moderate" as const,
      solutions: [
        { title: "Agree on a signal phrase", description: "Before it happens again, agree on a phrase like 'I need quiet time' that means 'I'm retreating but not angry at you.'", type: "communication" as const, isPremium: false },
        { title: "Set a reconnect window", description: "When one partner withdraws, agree on a specific time to check in and talk.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "Unspoken expectations leading to constant disappointment",
      description: "You expect your partner to know what you need without you saying it. When they miss the mark, you feel unloved. They feel like they can never win.",
      category: "Communication", severity: "moderate" as const,
      solutions: [
        { title: "Make requests, not assumptions", description: "Replace 'they should know by now' with an explicit request. 'I'd love it if you called me after big meetings' works better than hoping they guess.", type: "communication" as const, isPremium: false },
        { title: "Weekly needs audit", description: "Each Sunday, share one thing you need more of and one thing you need less of. One each, to avoid overwhelm.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "Love felt effortless early on — now it takes work",
      description: "In the beginning everything flowed naturally. Now even small connection requires effort, and you both wonder if you've lost something permanent.",
      category: "Attachment", severity: "mild" as const,
      solutions: [
        { title: "Recreate an early ritual", description: "Think of something you did in the first 3 months that you've stopped doing. A specific walk, a meal, a playlist. Bring it back.", type: "practical" as const, isPremium: false },
        { title: "Venus strengthening on Fridays", description: "Offer white flowers to water on Fridays and wear white or pink — this invites Shukra's energy to refresh the romantic bond.", type: "ritual" as const, isPremium: true },
      ],
    },
    {
      title: "Arguments that start small and escalate fast",
      description: "A disagreement about something trivial explodes into a fight about deeper issues. Proportionality is lost and both partners are left exhausted.",
      category: "Conflict", severity: "moderate" as const,
      solutions: [
        { title: "Label the escalation out loud", description: "When the argument starts escalating, say: 'This is escalating. Can we slow down?' Just naming it interrupts the adrenaline cycle.", type: "communication" as const, isPremium: false },
        { title: "20-minute pause rule", description: "Agree in advance: when voices rise, either person can call a 20-minute pause. The pause is not abandonment — it's regulation.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "Feeling taken for granted",
      description: "Your efforts go unacknowledged. You cook, plan, listen, show up — and it passes without comment. Over time the invisibility turns into resentment.",
      category: "Appreciation", severity: "moderate" as const,
      solutions: [
        { title: "Verbalize what you notice", description: "Both partners practice saying out loud what they silently appreciate: 'I noticed you made my coffee the way I like it today.'", type: "communication" as const, isPremium: false },
        { title: "Specific daily gratitude exchange", description: "Each evening, name one specific thing your partner did that day. Specificity matters — not 'you're great' but 'you picked up my medicine without being asked.'", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "The relationship feels stuck in a loop",
      description: "The same arguments keep cycling back. You resolve something, then weeks later the same wound reopens. Neither of you knows how to fully close the loop.",
      category: "Patterns", severity: "moderate" as const,
      solutions: [
        { title: "Name the loop as a shared pattern", description: "Together, write down the recurring argument cycle. Naming it as a shared pattern (not each other's fault) is the first step to breaking it.", type: "communication" as const, isPremium: false },
        { title: "Saturday Shani ritual for karmic loops", description: "Light a ghee lamp on Saturday evenings while reciting 'Om Shanaishcharaya Namah' 19 times to break karmic repetition patterns.", type: "ritual" as const, isPremium: true },
      ],
    },
    {
      title: "Loneliness even when together",
      description: "You share a space but feel profoundly alone in it. Your partner is physically present but emotionally unreachable, and the gap is sometimes harder to bear than actual solitude.",
      category: "Emotional Distance", severity: "severe" as const,
      solutions: [
        { title: "Name it out loud", description: "Saying 'I sometimes feel lonely even when we're together' is terrifying but almost always opens a door. The unspoken loneliness is the problem.", type: "communication" as const, isPremium: false },
        { title: "Daily 10-minute connection ritual", description: "No phones, no TV. Just 10 minutes of actual conversation after work. Mundane but powerful.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "One person doing most of the emotional labour",
      description: "One partner consistently initiates conversations, checks in, and processes feelings while the other remains passive. Resentment quietly builds on both sides.",
      category: "Balance", severity: "moderate" as const,
      solutions: [
        { title: "Rotate the check-in role", description: "Alternate who initiates the weekly emotional check-in. The rotation makes it explicit that both partners share this responsibility.", type: "practical" as const, isPremium: false },
        { title: "Name the imbalance calmly", description: "Say 'I notice I'm doing most of the emotional reaching out. Can we talk about that?' Use 'I notice' — not 'you never.'", type: "communication" as const, isPremium: false },
      ],
    },
  ];

  universals.forEach((u) => {
    push({ ...u, tags: ["universal"], score: 1 });
  });

  // Sort: match_score DESC, sort_order ASC (matches the DB query logic)
  results.sort((a, b) => b.match_score - a.match_score || a.sort_order - b.sort_order);

  return results;
}

// ─── API fetch (enriches local results when server is available) ───────────────

export async function fetchChallenges(
  reading: AstrologyReading,
  relationshipType: string,
): Promise<{ challenges: Challenge[]; source: "api" | "local" }> {
  // Always generate local challenges first
  const local = generateLocalChallenges(reading, relationshipType);

  if (!API_URL) return { challenges: local, source: "local" };

  const attrs = extractKundliAttributes(reading, relationshipType);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_URL}/api/problems/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attrs),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return { challenges: local, source: "local" };
    const data = await res.json();
    const apiChallenges = (data.problems ?? []) as Challenge[];
    if (apiChallenges.length > 0) return { challenges: apiChallenges, source: "api" };
    return { challenges: local, source: "local" };
  } catch {
    return { challenges: local, source: "local" };
  }
}
