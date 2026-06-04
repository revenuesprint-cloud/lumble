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
      description: `With the Moon in ${a.userMoonRashi}, your emotional core needs ${rt.needs}. When this need is not met, usually because it is never spoken out loud, it shows up as ${rt.shadow} and quiet resentment.`,
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
      description: `The fear of ${rt.fear} is at the root of how ${a.userMoonRashi} Moon people react in arguments. When this fear gets triggered, the fight stops being about the topic. It becomes about the fear. Your partner cannot see this, which makes it harder to resolve.`,
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
    title: `${a.userNakshatra} birth star energy creating friction in the relationship`,
    description: `Born under ${a.userNakshatra}, you carry ${gc?.tone ?? "complex"} energy. In close relationships this ${gc?.challenge ?? "creates unique tensions"}. Your current ${a.userDashaLord} phase makes this even stronger.`,
    category: "Temperament", severity: "moderate",
    tags: [`nakshatra:${a.userNakshatra}`, `gana:${a.userGana}`],
    score: 2,
    solutions: [
      { title: "Explain your nature, do not apologise for it", description: `Tell your partner: "I am ${gc?.tone ?? "complex"} by nature. This is what that means for how I love." When they understand this, a lot of conflict disappears.`, type: "communication", isPremium: false },
      { title: `${a.nakshatraGod} blessing ritual`, description: `Offering prayers to ${a.nakshatraGod}, the deity of the ${a.userNakshatra} birth star, brings divine support to this area of your relationship.`, type: "ritual", isPremium: true },
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
      title: `${a.userDashaLord} life phase bringing ${dt.keyword} energy into the relationship`,
      description: `You are currently in your ${a.userDashaLord} life phase. The main theme of this phase is ${dt.keyword}, and it is affecting your relationships too. The main challenge it brings: ${dt.relChallenge}.`,
      category: "Dasha Timing", severity: "moderate",
      tags: [`dasha:${a.userDashaLord}`],
      score: 2,
      solutions: [
        { title: "Tell your partner about your current life phase", description: `Say to them: "I am in a ${a.userDashaLord} phase right now which tends to bring ${dt.keyword} into my life." This gives them context to understand your current behavior.`, type: "communication", isPremium: false },
        { title: `${a.userDashaLord} calming practice`, description: `Find the mantra and day of the week associated with ${a.userDashaLord} and do a simple weekly practice. Even 10 minutes a week helps during this phase.`, type: "ritual", isPremium: false },
      ],
    });
  }

  // ── Dosha challenges ────────────────────────────────────────────────────────

  if (a.mangalDosha) {
    push({
      title: "Mangal dosha creating conflict-prone patterns in this relationship",
      description: "Mars (Mangal) is placed in a sensitive house in your chart. This brings a lot of intensity and heat into how you handle conflict and close relationships. This is not a curse. But it does need to be managed carefully.",
      category: "Dosha", severity: "severe",
      tags: ["dosha:mangal"],
      score: 4,
      solutions: [
        { title: "Direct Mars energy into something positive", description: "Mars energy needs a challenge. Put it into shared goals, fitness, or building something together. This turns aggression into positive energy.", type: "practical", isPremium: false },
        { title: "Kuja Dosha Nivaran puja", description: "A Mangal Shanti puja done on a Tuesday can reduce the impact of this placement on your relationship.", type: "ritual", isPremium: true },
        { title: "Pause 10 seconds before responding in a fight", description: "The Mars instinct is to react immediately. Committing to a 10 second pause before responding breaks this automatic pattern.", type: "practical", isPremium: false },
      ],
    });
  }

  if (a.nadiDosha) {
    push({
      title: "Nadi dosha: both partners share the same energy type",
      description: "Both of you share the same Nadi, which is your body energy type. Traditional Vedic astrology considers this an important factor that can affect your health and compatibility over time.",
      category: "Dosha", severity: "moderate",
      tags: ["dosha:nadi"],
      score: 4,
      solutions: [
        { title: "Nadi dosha puja", description: "A Nadi Nirvana puja with Mahamrityunjaya mantra (1008 recitations) is the classical remedy for this dosha.", type: "ritual", isPremium: true },
        { title: "Health awareness practice", description: "Couples with Nadi dosha do better with proactive health care. Notice the stress triggers you both share and manage them early before they build up.", type: "practical", isPremium: false },
      ],
    });
  }

  if (a.bhakootDosha) {
    push({
      title: "Bhakoot dosha: your moon signs are in a challenging position",
      description: "Your moon signs are in a difficult Bhakoot position. This can show up as money disagreements, health issues, and difficulty getting on the same emotional page as each other.",
      category: "Dosha", severity: "moderate",
      tags: ["dosha:bhakoot"],
      score: 4,
      solutions: [
        { title: "Donate together regularly", description: "Giving to charity together, especially on Mondays, is a traditional Bhakoot remedy. It builds positive energy for the relationship.", type: "ritual", isPremium: false },
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
      title: `Low compatibility score (${a.gunaScore}/36): this relationship needs extra effort`,
      description: `A score below 18 means there is significant friction across several areas of your star chart compatibility. This does not make love impossible. It does mean this relationship needs more effort and awareness than most.`,
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
      title: `Medium compatibility score (${a.gunaScore}/36): some areas need attention`,
      description: `Your star chart score is in the middle range. Some things match well between you. Others need real work. Knowing which areas to focus on saves a lot of wasted energy.`,
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
      "Water_Earth": { desc: "Water and Earth can be a very good match but can tip into over dependence on each other. Water can become overwhelming and Earth can become too rigid." },
      "Earth_Water": { desc: "Water and Earth can be a very good match but can tip into over dependence on each other. Water can become overwhelming and Earth can become too rigid." },
      "Water_Air":   { desc: "Water goes deep into emotion; Air prefers intellectual distance. What feels intimate to Water feels overwhelming to Air." },
      "Air_Water":   { desc: "Water goes deep into emotion; Air prefers intellectual distance. What feels intimate to Water feels overwhelming to Air." },
      "Earth_Air":   { desc: "Earth is tangible and slow. Air is conceptual and quick. They can feel like they're living in different worlds." },
      "Air_Earth":   { desc: "Earth is tangible and slow. Air is conceptual and quick. They can feel like they're living in different worlds." },
    };
    const key = `${a.userElement}_${a.partnerElement}`;
    const ec = elementConflicts[key];
    if (ec) {
      push({
        title: `${a.userElement} and ${a.partnerElement} energy: different pace and style`,
        description: ec.desc,
        category: "Elemental Compatibility", severity: "mild",
        tags: [`element_conflict:${[a.userElement, a.partnerElement].sort().join("_")}`],
        score: 2,
        solutions: [
          { title: "Learn about your elemental differences", description: `${a.userElement} and ${a.partnerElement} energies have natural friction points. When you understand them as a shared pattern rather than personal flaws, a lot of the heat goes out of arguments.`, type: "practical", isPremium: false },
          { title: "Use the complementarity", description: `${a.userElement} brings what ${a.partnerElement} lacks and vice versa. Frame your differences as balance rather than opposition.`, type: "communication", isPremium: false },
        ],
      });
    }
  }

  // ── Gana combination ────────────────────────────────────────────────────────

  if (a.userGana !== a.partnerGana) {
    const ganaMix: Record<string, string> = {
      "Deva_Rakshasa":     "This is the most challenging personality type combination. The gentle, idealistic Deva can feel overwhelmed by Rakshasa intensity. The Rakshasa may feel that their depth is not being met.",
      "Rakshasa_Deva":     "This is the most challenging personality type combination. The gentle, idealistic Deva can feel overwhelmed by Rakshasa intensity. The Rakshasa may feel that their depth is not being met.",
      "Deva_Manushya":     "The idealistic Deva may feel misunderstood by the practical Manushya. The Manushya may struggle to meet the Deva's high spiritual expectations.",
      "Manushya_Deva":     "The idealistic Deva may feel misunderstood by the practical Manushya. The Manushya may struggle to meet the Deva's high spiritual expectations.",
      "Manushya_Rakshasa": "The Rakshasa's strong intensity can overwhelm the balanced Manushya. The Manushya brings a calming presence that the Rakshasa needs but may resist.",
      "Rakshasa_Manushya": "The Rakshasa's strong intensity can overwhelm the balanced Manushya. The Manushya brings a calming presence that the Rakshasa needs but may resist.",
    };
    const combo = `${a.userGana}_${a.partnerGana}`;
    const gd = ganaMix[combo];
    if (gd) {
      push({
        title: `${a.userGana} and ${a.partnerGana} personality types creating friction`,
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
        title: "Not knowing if your feelings are returned",
        description: "The crush phase is full of uncertainty. You are partly responding to a version of them that you have created in your head. The real person and the imagined person are not always the same.",
        severity: "mild",
        solutions: [
          { title: "Make one move to get real information", description: "Not to confess. Just to have a real conversation with them. Real information is better than guessing.", type: "practical", isPremium: false },
          { title: "Set a decision timeline", description: "Give yourself a defined window to either act or redirect your energy. Indefinite ambiguity is more painful than a clear no.", type: "practical", isPremium: false },
        ],
      },
    ],
    situationship: [
      {
        title: "Emotional investment without a defined structure",
        description: "This kind of connection lives in the uncomfortable space between just friends and an actual relationship. The lack of definition is often intentional on one side. They get the connection without the responsibility.",
        severity: "moderate",
        solutions: [
          { title: "Have the defining conversation", description: "Say clearly: 'I need to know what this is. I am not asking for a forever commitment. I just need to know if we are building toward something.' Knowing is always better than guessing.", type: "communication", isPremium: false },
          { title: "Set an internal deadline", description: "If they can't define the relationship within a timeframe you set privately, that itself is information about what they want.", type: "practical", isPremium: false },
        ],
      },
    ],
    relationship: [
      {
        title: "Complacency eroding active love",
        description: "Commitment removed the uncertainty of early love and with it, some of the effort too. The relationship now runs on habit rather than choice. This is very common and very fixable.",
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
        description: "The feelings and patterns built around this relationship take time to fade. Most people rush through the grieving and carry the pain into their next chapter without realising it.",
        severity: "moderate",
        solutions: [
          { title: "Set a no contact period with a clear end date", description: "30 to 90 days of no contact is usually what it takes to break a strong emotional attachment. Give it a clear end date so it feels less like forever.", type: "practical", isPremium: false },
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
      title: "Love felt easy at the start. Now it takes real effort.",
      description: "In the beginning everything came naturally. Now even small moments of connection need effort. You both wonder if you have lost something that cannot come back.",
      category: "Attachment", severity: "mild" as const,
      solutions: [
        { title: "Recreate an early ritual", description: "Think of something you did in the first 3 months that you've stopped doing. A specific walk, a meal, a playlist. Bring it back.", type: "practical" as const, isPremium: false },
        { title: "Venus strengthening on Fridays", description: "Offer white flowers to water on Fridays and wear white or pink. This invites Venus energy to refresh the romantic bond.", type: "ritual" as const, isPremium: true },
      ],
    },
    {
      title: "Arguments that start small and escalate fast",
      description: "A disagreement about something trivial explodes into a fight about deeper issues. Proportionality is lost and both partners are left exhausted.",
      category: "Conflict", severity: "moderate" as const,
      solutions: [
        { title: "Label the escalation out loud", description: "When the argument starts escalating, say: 'This is escalating. Can we slow down?' Just naming it interrupts the adrenaline cycle.", type: "communication" as const, isPremium: false },
        { title: "20 minute pause rule", description: "Agree in advance: when voices rise, either person can call a 20 minute pause. The pause is not abandonment. It is giving each other space to calm down.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "Feeling taken for granted",
      description: "Your efforts go unnoticed. You cook, plan, listen, show up. None of it gets commented on. Over time this invisibility turns into quiet resentment.",
      category: "Appreciation", severity: "moderate" as const,
      solutions: [
        { title: "Verbalize what you notice", description: "Both partners practice saying out loud what they silently appreciate: 'I noticed you made my coffee the way I like it today.'", type: "communication" as const, isPremium: false },
        { title: "Specific daily gratitude exchange", description: "Each evening, name one specific thing your partner did that day. Specific is better than general. Not 'you are great' but 'you picked up my medicine without being asked.'", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "The relationship feels stuck in a loop",
      description: "The same arguments keep cycling back. You resolve something, then weeks later the same wound reopens. Neither of you knows how to fully close the loop.",
      category: "Patterns", severity: "moderate" as const,
      solutions: [
        { title: "Name the loop as a shared pattern", description: "Together, write down the recurring argument cycle. Naming it as a shared pattern (not each other's fault) is the first step to breaking it.", type: "communication" as const, isPremium: false },
        { title: "Saturday Saturn ritual to break repetitive patterns", description: "Light a ghee lamp on Saturday evenings and recite 'Om Shanaishcharaya Namah' 19 times. This is a traditional practice to help break repeating patterns.", type: "ritual" as const, isPremium: true },
      ],
    },
    {
      title: "Loneliness even when together",
      description: "You share a space but feel completely alone in it. Your partner is physically there but emotionally far away. This gap is sometimes harder to deal with than being actually alone.",
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
        { title: "Name the imbalance calmly", description: "Say 'I notice I am doing most of the emotional reaching out. Can we talk about that?' Use 'I notice', not 'you never'.", type: "communication" as const, isPremium: false },
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
