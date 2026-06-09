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

  // ── Moon rashi (always shown, high relevance) ─────────────────────────────

  const rashiTraits: Record<string, { needs: string; fear: string; shadow: string; element: string }> = {
    Mesha:      { needs: "autonomy and respect",     fear: "being controlled",       shadow: "impulsivity",        element: "Fire"  },
    Vrishabha:  { needs: "stability and comfort",    fear: "sudden change",          shadow: "possessiveness",     element: "Earth" },
    Mithuna:    { needs: "variety and stimulation",  fear: "boredom",                shadow: "inconsistency",      element: "Air"   },
    Karka:      { needs: "emotional security",       fear: "abandonment",            shadow: "over sensitivity",   element: "Water" },
    Simha:      { needs: "recognition and loyalty",  fear: "being ignored",          shadow: "ego",                element: "Fire"  },
    Kanya:      { needs: "order and reliability",    fear: "chaos and failure",      shadow: "criticism",          element: "Earth" },
    Tula:       { needs: "harmony and fairness",     fear: "conflict and rejection", shadow: "indecision",         element: "Air"   },
    Vrishchika: { needs: "depth and transformation", fear: "betrayal",               shadow: "suspicion",          element: "Water" },
    Dhanu:      { needs: "freedom and meaning",      fear: "restriction",            shadow: "restlessness",       element: "Fire"  },
    Makara:     { needs: "achievement and respect",  fear: "failure",                shadow: "emotional coldness", element: "Earth" },
    Kumbha:     { needs: "intellectual freedom",     fear: "conformity",             shadow: "detachment",         element: "Air"   },
    Meena:      { needs: "transcendence and empathy",fear: "boundaries",             shadow: "escapism",           element: "Water" },
  };

  const rt = rashiTraits[a.userMoonRashi];
  if (rt) {
    push({
      title: `Your need for ${rt.needs} going unmet in this relationship`,
      description: `You need ${rt.needs} more than most people realize, and when that need goes unmet for too long, it quietly turns into ${rt.shadow} and builds into resentment that is hard to explain. Your ${a.userMoonRashi} moon makes this one of your core emotional requirements, not just a preference. Saying what you need directly to your partner before the frustration builds is the single most effective thing you can do here.`,
      category: "Emotional Needs", severity: "moderate",
      tags: [`moon_rashi:${a.userMoonRashi}`, "universal"],
      score: 3,
      solutions: [
        { title: `Name the need directly`, description: `Instead of hoping they figure it out, say clearly: "I need ${rt.needs} right now." It feels vulnerable, but it works every time and it removes the guessing that causes most of the frustration.`, type: "communication", isPremium: false },
        { title: `${a.userMoonRashiLord} strengthening practice`, description: `Your moon is ruled by ${a.userMoonRashiLord}. Chanting its Beej mantra on its ruling day can ease the emotional intensity that builds when this need goes unmet.`, type: "ritual", isPremium: true },
      ],
    });

    push({
      title: `Your core fear of ${rt.fear} showing up in arguments`,
      description: `When arguments happen between you, something older than the current disagreement is usually getting activated. Your deepest fear is ${rt.fear}, and when a conflict accidentally touches that fear, the topic of the argument becomes almost irrelevant. Your ${a.userMoonRashi} moon means this fear runs deep and shapes your reactions before you consciously choose them. In a calm moment outside of any conflict, telling your partner what actually scares you when things get heated will change how they show up for you.`,
      category: "Conflict", severity: "moderate",
      tags: [`moon_rashi:${a.userMoonRashi}`],
      score: 3,
      solutions: [
        { title: "Name the fear, not just the argument", description: `In a calm moment, tell your partner: "When we fight about X, what I am really scared of underneath is ${rt.fear}." This one sentence reframes how they respond to you.`, type: "communication", isPremium: false },
        { title: "Fear awareness journal", description: "Write about moments this week where this fear arose. Seeing the pattern clearly reduces how much unconscious control it has over your reactions.", type: "practical", isPremium: false },
      ],
    });

    push({
      title: `Your ${rt.shadow} tendency surfacing and creating distance`,
      description: `Under pressure, you sometimes shift into a version of yourself that your partner sees more clearly than you do. That shadow tendency is ${rt.shadow}, and the tricky part is that it almost always feels completely justified from the inside even when it is causing real damage on the outside. Your ${a.userMoonRashi} moon means this is a recurring pattern worth addressing, not a character flaw. Ask your partner when this tends to show up for them and treat their answer as useful information rather than an attack.`,
      category: "Shadow Work", severity: "moderate",
      tags: [`moon_rashi:${a.userMoonRashi}`],
      score: 2,
      solutions: [
        { title: `Notice the pattern before it peaks`, description: `When you feel ${rt.shadow} rising, name it to yourself: "This is my ${a.userMoonRashi} shadow coming up, not the whole truth of the situation." Naming it gives you a beat of choice.`, type: "spiritual", isPremium: false },
        { title: "Ask for honest feedback", description: "Ask your partner: 'When do I seem most [shadow trait] to you?' Their answer is specific information you can actually use, not a judgment.", type: "communication", isPremium: false },
      ],
    });
  }

  // ── Nakshatra (high relevance) ─────────────────────────────────────────────

  const ganaChallenge: Record<string, { tone: string; challenge: string }> = {
    Deva:     { tone: "idealistic",  challenge: "can feel too otherworldly for partners who are grounded in practical reality" },
    Manushya: { tone: "balanced",    challenge: "can get stuck in the mundane and lose the larger meaning of the relationship" },
    Rakshasa: { tone: "intense",     challenge: "can overwhelm partners who need more gentleness and breathing room" },
  };
  const gc = ganaChallenge[a.userGana];

  push({
    title: `Your ${a.userNakshatra} birth star energy creating friction in how you connect`,
    description: `You have a naturally ${gc?.tone ?? "complex"} way of approaching the world, and in close relationships that ${gc?.challenge ?? "creates unique tensions that need to be understood"}. Your ${a.userNakshatra} birth star gives you specific relational qualities that work beautifully when understood and create friction when they go unexplained. Your current ${a.userDashaLord} life phase is amplifying this tendency right now. Telling your partner plainly what you are like and what you need removes a lot of the guesswork that causes conflict.`,
    category: "Temperament", severity: "moderate",
    tags: [`nakshatra:${a.userNakshatra}`, `gana:${a.userGana}`],
    score: 2,
    solutions: [
      { title: "Explain your nature, do not apologise for it", description: `Tell your partner: "I am ${gc?.tone ?? "complex"} by nature, and here is what that means for how I love." When they understand this as a feature rather than a flaw, a lot of conflict simply disappears.`, type: "communication", isPremium: false },
      { title: `${a.nakshatraGod} blessing practice`, description: `Offering prayers to ${a.nakshatraGod}, the deity of the ${a.userNakshatra} birth star, brings support to this area of your relationship.`, type: "ritual", isPremium: true },
    ],
  });

  // ── Dasha lord (high relevance) ────────────────────────────────────────────

  const dashaThemes: Record<string, { keyword: string; relChallenge: string }> = {
    Ketu:       { keyword: "detachment",    relChallenge: "emotional disconnection and pulling away from the relationship spiritually" },
    Shukra:     { keyword: "pleasure",      relChallenge: "overindulgence or sudden loss of romantic interest" },
    Surya:      { keyword: "authority",     relChallenge: "ego conflicts and difficulty yielding in disagreements" },
    Chandra:    { keyword: "emotion",       relChallenge: "mood instability and emotional flooding affecting day to day life" },
    Mangal:     { keyword: "action",        relChallenge: "impulsiveness and impatience causing regrettable decisions" },
    Rahu:       { keyword: "obsession",     relChallenge: "unhealthy attachment patterns or sudden destabilising events" },
    Brihaspati: { keyword: "wisdom",        relChallenge: "over moralising or expecting too much spiritual alignment from a partner" },
    Shani:      { keyword: "karma",         relChallenge: "feeling burdened, delays in relationship milestones, and karmic lessons surfacing" },
    Budh:       { keyword: "analysis",      relChallenge: "overthinking love and analysis paralysis preventing emotional presence" },
  };

  const dt = dashaThemes[a.userDashaLord];
  if (dt) {
    push({
      title: `Your current life phase bringing ${dt.keyword} energy into this relationship`,
      description: `Something has been shifting in how you show up in this relationship lately, and your current life phase explains a significant part of it. Right now you are moving through a period shaped by ${dt.keyword}, which tends to bring ${dt.relChallenge}. This is a temporary phase governed by your ${a.userDashaLord} planetary cycle, but its effects on your relationship are real and worth naming directly. Telling your partner what you are going through right now removes a lot of the confusion from both sides.`,
      category: "Dasha Timing", severity: "moderate",
      tags: [`dasha:${a.userDashaLord}`],
      score: 2,
      solutions: [
        { title: "Tell your partner about your current phase", description: `Say to them: "I am in a ${a.userDashaLord} phase right now which tends to bring ${dt.keyword} into my life. Here is what that actually looks like for me." This gives them real context.`, type: "communication", isPremium: false },
        { title: `${a.userDashaLord} calming practice`, description: `Find the mantra and day of the week associated with ${a.userDashaLord} and do a simple weekly practice. Even 10 minutes a week helps ground this energy during the phase.`, type: "ritual", isPremium: false },
      ],
    });
  }

  // ── Dosha challenges ────────────────────────────────────────────────────────

  if (a.mangalDosha) {
    push({
      title: "Conflict between you escalating faster than it should",
      description: "Arguments between you tend to get intense quickly, and both of you probably notice this even when you cannot explain why it keeps happening. This pattern has real roots in your birth chart. Your Mars placement creates extra intensity and heat in how you handle closeness and disagreement. That is not a curse, but it does need active management rather than hoping each situation will just be different. Building a clear plan for slowing down before conflict peaks works far better than trying to handle it in the moment.",
      category: "Dosha", severity: "severe",
      tags: ["dosha:mangal"],
      score: 4,
      solutions: [
        { title: "Channel that energy into something you build together", description: "Mars energy needs a challenge to channel into. Direct it toward shared goals, fitness, or building something together. This converts aggression into forward momentum.", type: "practical", isPremium: false },
        { title: "Kuja Dosha calming puja", description: "A Mangal Shanti puja done on a Tuesday can reduce the impact of this placement on your relationship dynamic.", type: "ritual", isPremium: true },
        { title: "Pause before responding in any heated moment", description: "The Mars instinct is to react immediately. Committing to a 10 second pause before responding breaks the automatic pattern that causes most of the escalation.", type: "practical", isPremium: false },
      ],
    });
  }

  if (a.nadiDosha) {
    push({
      title: "Running out of capacity to support each other at the same time",
      description: "You and your partner share very similar emotional and physical rhythms, which means when stress hits one of you, it tends to hit both at roughly the same time. This creates periods where neither person has the capacity to support the other and both feel depleted simultaneously. In Vedic astrology this pattern comes from sharing the same Nadi energy type. The practical response is building proactive recovery into your relationship rather than waiting until both of you are running on empty.",
      category: "Dosha", severity: "moderate",
      tags: ["dosha:nadi"],
      score: 4,
      solutions: [
        { title: "Nadi Nirvana puja", description: "A Nadi Nirvana puja with Mahamrityunjaya mantra recited 1008 times is the classical remedy for this pattern.", type: "ritual", isPremium: true },
        { title: "Build in shared recovery time", description: "Identify the stress triggers you both share and manage them early rather than letting them stack. When you are both low, bring in external support rather than trying to carry each other.", type: "practical", isPremium: false },
      ],
    });
  }

  if (a.bhakootDosha) {
    push({
      title: "Getting on the same emotional page taking more work than it should",
      description: "Getting in sync emotionally takes more effort in this relationship than it seems like it should, and financial disagreements tend to surface even when money is not really the underlying issue. These patterns have a specific origin in how your moon signs relate to each other, a Bhakoot challenge in Vedic compatibility. The practical fix is creating shared rituals that keep you emotionally aligned, weekly check-ins, joint goals, and small acts of giving that build positive momentum rather than waiting for alignment to happen naturally.",
      category: "Dosha", severity: "moderate",
      tags: ["dosha:bhakoot"],
      score: 4,
      solutions: [
        { title: "Give to charity together regularly", description: "Giving to a cause together, especially on Mondays, is a traditional Bhakoot remedy. It builds shared positive energy for the relationship.", type: "ritual", isPremium: false },
        { title: "Chandra puja for moon harmony", description: "Monthly Purnima offerings of white flowers and milk to Chandra help harmonise the moon-sign friction over time.", type: "ritual", isPremium: true },
      ],
    });
  }

  if (a.yoniEnemy) {
    push({
      title: "Physical and intimate closeness requiring more intentional effort",
      description: "Closeness between you requires more deliberate effort than it does in some other pairings, and that gap can feel personal when it is actually structural. Your birth nakshatras create a natural friction in intimate bonding according to Vedic compatibility analysis. The way through is building strong emotional connection as the primary foundation rather than the other way around. Physical ease and closeness improve naturally when emotional safety is genuinely high.",
      category: "Intimate Compatibility", severity: "moderate",
      tags: ["yoni:enemy"],
      score: 3,
      solutions: [
        { title: "Build emotional intimacy first", description: "When intimate compatibility is challenging, deepening emotional connection compensates substantially. Physical closeness improves naturally when emotional safety is high. Start there deliberately.", type: "practical", isPremium: false },
        { title: "Yoni dosha remediation", description: "A Jyotishi can recommend specific remedies for your exact nakshatra combination.", type: "professional", isPremium: true },
      ],
    });
  }

  // ── Guna score ─────────────────────────────────────────────────────────────

  if (a.gunaScore < 18) {
    push({
      title: `Significant friction across multiple areas of compatibility`,
      description: `This relationship faces more friction across more areas than most, and both of you probably feel that even when you cannot pinpoint exactly where it is coming from. Your combined birth chart score points to genuine challenges that need honest attention rather than hope that things will smooth out on their own. That does not make love impossible here. It means this specific relationship requires more deliberate work, more honest conversations, and more active tending than a higher-scoring pairing would need. Knowing that is actually useful.`,
      category: "Compatibility", severity: "severe",
      tags: ["guna:low"],
      score: 4,
      solutions: [
        { title: "Review your full compatibility breakdown", description: "Identify which specific dimensions score low (Varna, Gana, Bhakoot, Nadi, etc.) and focus your attention on those specific areas rather than trying to work on everything at once.", type: "practical", isPremium: false },
        { title: "Consult a qualified Jyotishi", description: "A professional astrologer can identify which doshas are most significant for your specific chart combination and recommend targeted combined remedies.", type: "professional", isPremium: true },
      ],
    });
  } else if (a.gunaScore < 28) {
    push({
      title: `Some areas of this relationship needing more attention than others`,
      description: `Some things between you flow naturally and others require real work, and you probably already have a sense of which is which even if you have not named it directly. Your chart compatibility sits in a range that means genuine potential exists here alongside some real friction points. Knowing which specific areas need the most attention saves a lot of energy being spent on the wrong things.`,
      category: "Compatibility", severity: "mild",
      tags: ["guna:medium"],
      score: 2,
      solutions: [
        { title: "Focus on the low-scoring compatibility areas", description: "Review your compatibility breakdown. The low-scoring dimensions, not the ones that score well, are where to direct your attention and conversation.", type: "practical", isPremium: false },
      ],
    });
  }

  // ── Elemental conflict ─────────────────────────────────────────────────────

  if (a.userElement !== a.partnerElement) {
    const elementConflicts: Record<string, { desc: string }> = {
      "Fire_Water":  { desc: "Fire needs space to move and Water needs depth and security. Each can inadvertently extinguish or overwhelm the other when these needs are not being consciously balanced." },
      "Water_Fire":  { desc: "Fire needs space to move and Water needs depth and security. Each can inadvertently extinguish or overwhelm the other when these needs are not being consciously balanced." },
      "Fire_Earth":  { desc: "Fire wants to leap and Earth wants to build slowly and deliberately. Fire can find Earth too cautious and Earth can find Fire too impulsive. Understanding this as a difference in pace rather than a difference in values changes how you talk about it." },
      "Earth_Fire":  { desc: "Fire wants to leap and Earth wants to build slowly and deliberately. Fire can find Earth too cautious and Earth can find Fire too impulsive. Understanding this as a difference in pace rather than a difference in values changes how you talk about it." },
      "Fire_Air":    { desc: "Air fuels Fire's intensity but may feel overwhelmed by the heat it creates over time. Fire feels seen by Air's mental engagement but frustrated when Air intellectualises rather than feeling." },
      "Air_Fire":    { desc: "Air fuels Fire's intensity but may feel overwhelmed by the heat it creates over time. Fire feels seen by Air's mental engagement but frustrated when Air intellectualises rather than feeling." },
      "Water_Earth": { desc: "Water and Earth can be a very good match but can tip into over dependence when neither person challenges the other to grow. Water can become overwhelming and Earth can become too rigid. Small doses of friction are healthy here." },
      "Earth_Water": { desc: "Water and Earth can be a very good match but can tip into over dependence when neither person challenges the other to grow. Water can become overwhelming and Earth can become too rigid. Small doses of friction are healthy here." },
      "Water_Air":   { desc: "Water goes deep into feeling and Air prefers to engage from a place of thought. What feels intimate to Water can feel overwhelming to Air. What feels clear to Air can feel cold to Water. This difference needs to be talked about openly." },
      "Air_Water":   { desc: "Water goes deep into feeling and Air prefers to engage from a place of thought. What feels intimate to Water can feel overwhelming to Air. What feels clear to Air can feel cold to Water. This difference needs to be talked about openly." },
      "Earth_Air":   { desc: "Earth is tangible and methodical. Air is conceptual and quick. They can feel like they are operating on different timelines and in different worlds. The common ground is usually in shared projects rather than shared feelings." },
      "Air_Earth":   { desc: "Earth is tangible and methodical. Air is conceptual and quick. They can feel like they are operating on different timelines and in different worlds. The common ground is usually in shared projects rather than shared feelings." },
    };
    const key = `${a.userElement}_${a.partnerElement}`;
    const ec = elementConflicts[key];
    if (ec) {
      push({
        title: `${a.userElement} and ${a.partnerElement} energy: naturally different pace and style`,
        description: ec.desc,
        category: "Elemental Compatibility", severity: "mild",
        tags: [`element_conflict:${[a.userElement, a.partnerElement].sort().join("_")}`],
        score: 2,
        solutions: [
          { title: "Learn about your elemental differences as a shared pattern", description: `${a.userElement} and ${a.partnerElement} energies have natural friction points. When you understand them as something you both navigate together rather than personal flaws, a lot of the heat goes out of the recurring arguments.`, type: "practical", isPremium: false },
          { title: "Use the complementarity deliberately", description: `${a.userElement} brings what ${a.partnerElement} lacks and vice versa. Frame your differences as balance rather than opposition and look for decisions where that balance produces a better outcome than either of you would reach alone.`, type: "communication", isPremium: false },
        ],
      });
    }
  }

  // ── Gana combination ────────────────────────────────────────────────────────

  if (a.userGana !== a.partnerGana) {
    const ganaMix: Record<string, string> = {
      "Deva_Rakshasa":     "This is one of the more challenging personality type combinations. The gentler, idealistic Deva can feel overwhelmed by Rakshasa intensity. The Rakshasa may feel that their depth is not being fully met. Understanding this as a built-in temperament difference rather than a compatibility failure is the first step to working with it.",
      "Rakshasa_Deva":     "This is one of the more challenging personality type combinations. The gentler, idealistic Deva can feel overwhelmed by Rakshasa intensity. The Rakshasa may feel that their depth is not being fully met. Understanding this as a built-in temperament difference rather than a compatibility failure is the first step to working with it.",
      "Deva_Manushya":     "The idealistic Deva may feel misunderstood by the practical Manushya. The Manushya may struggle to meet the Deva's higher spiritual expectations. Each has something real to offer the other when the difference is understood as complementary rather than incompatible.",
      "Manushya_Deva":     "The idealistic Deva may feel misunderstood by the practical Manushya. The Manushya may struggle to meet the Deva's higher spiritual expectations. Each has something real to offer the other when the difference is understood as complementary rather than incompatible.",
      "Manushya_Rakshasa": "The Rakshasa's strong intensity can overwhelm the balanced Manushya. The Manushya brings a calming presence that the Rakshasa genuinely needs but may resist. Finding the rhythm between intensity and calm is what makes this pairing work.",
      "Rakshasa_Manushya": "The Rakshasa's strong intensity can overwhelm the balanced Manushya. The Manushya brings a calming presence that the Rakshasa genuinely needs but may resist. Finding the rhythm between intensity and calm is what makes this pairing work.",
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
          { title: "Understand each other's temperament archetype", description: `${a.userGana} and ${a.partnerGana} each have valid needs. Understanding what each truly requires removes the sting of incompatibility and turns it into something you can work with deliberately.`, type: "communication", isPremium: false },
          { title: "Navagraha puja for temperament harmony", description: "A combined Navagraha puja helps harmonise differing gana energies over time.", type: "ritual", isPremium: true },
        ],
      });
    }
  }

  // ── Relationship type ───────────────────────────────────────────────────────

  const relTypeProblems: Record<string, { title: string; description: string; severity: Challenge["severity"]; solutions: ChallengeSolution[] }[]> = {
    crush: [
      {
        title: "Not knowing where you stand and what to do about it",
        description: "Not knowing where you stand is one of the most uncomfortable places to be, and the longer it goes without any clarity the harder it gets. Part of what makes a crush feel so powerful is that you are partly responding to a version of this person you have built in your imagination. The real person and the imagined version sometimes match and sometimes do not. Make one move this week toward getting real information rather than spending more time in the uncertainty.",
        severity: "mild",
        solutions: [
          { title: "Make one move to get real information", description: "Not to confess everything. Just to have a real conversation with them where you are actually present. Real information, even if it is ambiguous, is better than more guessing.", type: "practical", isPremium: false },
          { title: "Set a decision timeline for yourself", description: "Give yourself a defined window to either act or redirect your energy. Indefinite ambiguity is more painful than a clear answer either way.", type: "practical", isPremium: false },
        ],
      },
    ],
    situationship: [
      {
        title: "Emotional investment without a defined structure",
        description: "This kind of connection lives in the uncomfortable space between just friends and an actual relationship, and that space is usually comfortable for one person and quietly painful for the other. Undefined connections tend to stay undefined because one side is getting what they need without having to commit to anything formal. You deserve to know what this actually is. Having that conversation feels vulnerable, but staying in the ambiguity costs more than the conversation does.",
        severity: "moderate",
        solutions: [
          { title: "Have the defining conversation", description: "Say clearly: 'I need to know what this is. I am not asking for a forever commitment. I just need to know if we are building toward something.' Knowing is always better than guessing.", type: "communication", isPremium: false },
          { title: "Set an internal deadline", description: "If they cannot define the relationship within a timeframe you set privately, that itself is your answer. Use that information.", type: "practical", isPremium: false },
        ],
      },
    ],
    relationship: [
      {
        title: "Complacency replacing the active choice to love each other",
        description: "Early in a relationship, effort happens naturally because everything is new. Over time, habit takes over and the same actions that once felt like genuine choice start to feel automatic. That is not a crisis. It is what happens when novelty wears off. The fix is small, deliberate choices that remind you both that this is a relationship you are actively choosing, not just one you are in by default. One small daily act of choosing your partner, any act, changes the feeling of a relationship.",
        severity: "mild",
        solutions: [
          { title: "Annual relationship review", description: "Once a year: what is working, what needs to change, what are our goals for this relationship in the next twelve months? Structured but genuinely meaningful.", type: "practical", isPremium: false },
          { title: "Bring back an early ritual", description: "Something you did in the first three months that you have stopped doing. A specific walk, meal, playlist. Bring it back without making a big deal of it.", type: "practical", isPremium: false },
        ],
      },
    ],
    ex: [
      {
        title: "Not being able to fully move forward after the relationship ended",
        description: "The feelings and patterns built around this relationship do not switch off cleanly when it ends, and trying to rush through that process usually means carrying the unresolved parts into the next chapter without realizing it. What you are dealing with is a real loss and it deserves to be properly felt, not bypassed. Setting clear space from this person for a defined period gives your system the reset it needs rather than keeping you cycling between the past and the present.",
        severity: "moderate",
        solutions: [
          { title: "Set a no contact period with a clear end date", description: "30 to 90 days of no contact is usually what it takes to break a strong emotional attachment. Give it a clear end date so it feels like a season with an ending, not an endless rule.", type: "practical", isPremium: false },
          { title: "Grieve it fully and specifically", description: "Allow yourself to properly mourn what you lost, what you hoped for, and the version of yourself that existed in that relationship. Skipping this means carrying it.", type: "practical", isPremium: false },
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
      title: "One person going quiet without explaining why",
      description: "One of you goes cold and distant without saying why, and the person left behind starts replaying every recent interaction trying to figure out what they did wrong. Both of you end up alone in this even though you are in the same relationship. The pattern is not about the silence itself but about what the silence means to the person on the receiving end. Agreeing in advance on what emotional withdrawal looks like for each of you, and what you each need during it, converts a confusing and painful pattern into something both of you can actually navigate.",
      category: "Communication", severity: "moderate" as const,
      solutions: [
        { title: "Agree on a signal phrase before it happens again", description: "Before the next time it comes up, agree on a phrase like 'I need quiet time' that means I am retreating but I am not angry at you specifically. This one phrase removes most of the damage.", type: "communication" as const, isPremium: false },
        { title: "Set a check-in window", description: "When one partner withdraws, agree on a specific time to reconnect and talk. Even a text saying I will be ready to talk tomorrow evening removes the uncertainty.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "Unspoken expectations leading to repeated disappointment",
      description: "You expect your partner to know what you need without you saying it. When they miss what seems obvious to you, it feels like evidence that they do not care. From their side, they feel like they can never get it right without knowing the rules. This dynamic makes both people miserable and it is entirely fixable with one change. Make requests instead of holding expectations. Tell your partner what you need specifically and give them the actual chance to show up for it.",
      category: "Communication", severity: "moderate" as const,
      solutions: [
        { title: "Make requests, not assumptions", description: "Replace 'they should know by now' with an explicit request. 'I would love it if you called me after big meetings' works better than hoping they guess correctly.", type: "communication" as const, isPremium: false },
        { title: "Weekly needs exchange", description: "Each week, share one thing you need more of and one thing you need less of. One each, to avoid overwhelm. Small and specific works better than general and comprehensive.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "Love that felt easy at the start now taking real effort",
      description: "In the beginning everything came naturally. Now even small moments of genuine connection require effort and both of you wonder if you have lost something that cannot come back. You have not lost it. Effortful love is different from effortless love but it is not less real or less valuable. The question is whether both of you are still actively choosing each other or coasting on the habit of being together. One deliberate act of choosing your partner each day changes the entire feeling of a relationship.",
      category: "Attachment", severity: "mild" as const,
      solutions: [
        { title: "Recreate an early ritual deliberately", description: "Think of something specific you did in the first three months that you have stopped doing. A walk, a meal, a playlist. Bring it back without making a ceremony of it.", type: "practical" as const, isPremium: false },
        { title: "Venus strengthening on Fridays", description: "Offering white flowers to water on Fridays and wearing white or pink invites Venus energy to refresh the romantic bond.", type: "ritual" as const, isPremium: true },
      ],
    },
    {
      title: "Arguments starting small and escalating fast",
      description: "A small disagreement becomes a big fight before either of you understands what happened. You end up exhausted and neither one quite knows what the argument was actually about. Escalation has a biological trigger, a moment when adrenaline takes over and the rational brain goes offline. The only effective intervention is before that moment arrives, not during it. Agree in advance on a pause signal that either person can call, no questions, no negotiation, just stop.",
      category: "Conflict", severity: "moderate" as const,
      solutions: [
        { title: "Label the escalation out loud when it starts", description: "When the argument begins escalating, say: 'This is escalating. Can we slow down?' Just naming it interrupts the automatic cycle.", type: "communication" as const, isPremium: false },
        { title: "20 minute pause agreement", description: "Agree in advance that when voices rise, either person can call a 20 minute pause. The pause is not abandonment. It is giving each other space to calm down and come back actually able to talk.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "Your efforts going unnoticed and unacknowledged",
      description: "You show up. You cook, plan, listen, remember things, and do the small daily acts of care. Almost none of it gets named. Over time that invisibility turns into quiet resentment even though the person on the receiving end probably does appreciate you, they just have not learned to say it. Appreciation does not happen automatically. It is a practice that needs to be started. Both of you can begin naming specific things you notice rather than waiting for the other person to guess what lands as meaningful.",
      category: "Appreciation", severity: "moderate" as const,
      solutions: [
        { title: "Name what you notice out loud", description: "Both partners practice saying specifically what they silently appreciate: 'I noticed you made my coffee the way I like it today.' Specific is what actually lands.", type: "communication" as const, isPremium: false },
        { title: "One specific thing each evening", description: "Each evening, name one specific thing your partner did that day. Not 'you are great' but 'you picked up my medicine without being asked.' That level of specificity is what actually feels like being seen.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "The same argument coming back again and again",
      description: "You resolve something and weeks later the same wound reopens. Neither of you knows how to fully close the loop. Repeating cycles almost always have an unspoken need at the center that has not been fully addressed. The topic of the recurring argument is almost never the actual issue. Finding what specific need is underneath it, and naming that instead, is usually what finally breaks the pattern.",
      category: "Patterns", severity: "moderate" as const,
      solutions: [
        { title: "Name the loop as a shared pattern", description: "Together, write down the recurring argument cycle and what it actually feels like from each side. Naming it as a shared pattern rather than each other's fault is the beginning of breaking it.", type: "communication" as const, isPremium: false },
        { title: "Saturday Saturn practice to break repeating patterns", description: "Light a ghee lamp on Saturday evenings and recite 'Om Shanaishcharaya Namah' 19 times. This is a traditional practice to help break repeating karmic cycles.", type: "ritual" as const, isPremium: true },
      ],
    },
    {
      title: "Feeling lonely even when you are together",
      description: "You share a space but feel completely alone in it. Your partner is physically there but emotionally somewhere far away. This particular gap is sometimes harder to deal with than actual solitude because it includes the added weight of disappointment. This kind of distance accumulates quietly and is almost always a sign that connection has been replaced by coexistence without either person fully noticing. Saying out loud that you feel lonely in the relationship, as terrifying as that sounds, is almost always what opens the door.",
      category: "Emotional Distance", severity: "severe" as const,
      solutions: [
        { title: "Name it out loud", description: "Saying 'I sometimes feel lonely even when we are together' is terrifying but almost always opens a door. The unspoken loneliness is the actual problem, not the distance itself.", type: "communication" as const, isPremium: false },
        { title: "Daily 10 minute connection ritual", description: "No phones, no screens. Just 10 minutes of actual conversation after the day ends. Mundane but genuinely powerful over time.", type: "practical" as const, isPremium: false },
      ],
    },
    {
      title: "One person carrying most of the emotional work",
      description: "One partner consistently reaches out, checks in, processes feelings, and keeps the emotional thread of the relationship alive. The other receives but rarely initiates. Over time the person doing more starts feeling resentful even when they do not say so, and the person doing less starts feeling vaguely guilty even without naming it. This imbalance needs to be named calmly and treated as something to address together rather than a failing to assign blame for.",
      category: "Balance", severity: "moderate" as const,
      solutions: [
        { title: "Rotate who initiates the check-in", description: "Alternate who initiates the weekly emotional check-in. Making it explicit that both partners share this responsibility removes the silent resentment from the person who always goes first.", type: "practical" as const, isPremium: false },
        { title: "Name the imbalance without blame", description: "Say: 'I notice I am doing most of the emotional reaching out between us. Can we talk about that?' Use I notice rather than you never.", type: "communication" as const, isPremium: false },
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
