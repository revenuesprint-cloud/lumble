import { RelationshipType } from "@/context/AppContext";

function dateToNum(dateStr: string): number {
  const d = new Date(dateStr);
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededRng(seed: number) {
  let s = Math.abs(seed) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s) / 0xffffffff;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function score(rng: () => number, min = 62, max = 97): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// ─── Text libraries ─────────────────────────────────────────────────────────

const emotionalChemistryTexts = [
  "You share a rare emotional frequency — the kind that makes silence feel like conversation. Your energies pull toward each other instinctively, often before your minds catch up.",
  "There's a gravitational pull here that neither of you fully controls. Your emotional rhythms sync in ways that feel almost uncanny, like you've known each other in a different time.",
  "You speak each other's emotional language fluently, even when you're not speaking at all. This depth of feeling recognition is something most people search a lifetime for.",
  "Your emotional worlds overlap in the most magnetic places — where their sensitivity meets your intensity, something almost electric is created.",
  "The chemistry between you is complex — not simple attraction, but an entangled emotional resonance. When you're connected, it's unmistakably felt by everyone around you.",
];

const communicationTexts = [
  "You tend to lead with emotion while they lead with logic, creating beautiful tension in how you exchange meaning. When aligned, your conversations go deeper than most relationships ever reach.",
  "There's a push-pull in how you communicate — moments of stunning understanding followed by frustrating disconnect. This friction, paradoxically, is what keeps things interesting.",
  "Your communication styles are complementary in the most surprising way. What you leave unsaid, they hear. What they don't know how to express, you feel intuitively.",
  "You both communicate in layers — the words you use rarely say everything. This creates depth, but also the risk of misreading each other. Clarifying without explaining everything is your art.",
  "Words matter less between you than tone and timing. You're both attuned to emotional subtext, which makes your exchanges rich — but also vulnerable to overthinking.",
];

const attachmentTexts = [
  "You seek emotional reassurance while they emotionally withdraw during conflict, creating a magnetic push-pull dynamic that feels simultaneously frustrating and addictive.",
  "Your attachment styles dance around each other — one reaches, the other distances, then reverses. This cycle creates intense emotional peaks that make the connection feel irreplaceable.",
  "You're both emotionally self-sufficient in different ways, but with each other, old vulnerabilities surface. This can feel destabilizing — or like finally being truly seen.",
  "There's an anxious-avoidant undertone to how you bond. The moments of closeness feel extraordinary precisely because of the uncertainty that precedes them.",
  "You attach deeply and quietly — building emotional investments that neither of you fully acknowledges until they're undeniable. This slow bond is also the hardest to break.",
];

const tensionTexts = [
  "The tension between you isn't conflict — it's unresolved desire. There are conversations you haven't had yet that hold enormous weight. When they happen, everything shifts.",
  "There's an emotional charge between you that doesn't fully discharge. You carry a low hum of something unresolved that surfaces in unexpected moments and private thoughts.",
  "Your tension is creative, not destructive — it pushes you both toward growth, even when it's uncomfortable. The friction is actually a signal of how much you care.",
  "What sits between you unspoken is the most powerful thing in this dynamic. The tension is real, and it won't dissolve on its own — it needs truth to transform.",
  "There's an underlying emotional negotiation always happening with you two. Not hostile — more like two forces trying to find their equilibrium. The process is part of the connection.",
];

const longTermTexts = [
  "The foundation here has unusual durability — not because things are always easy, but because the emotional pull persists through difficulty. That persistence means something.",
  "Long-term, this connection asks you both to grow in uncomfortable directions. The ones who do that together become genuinely rare. You have the potential to be one of those pairs.",
  "There's genuine compatibility beneath the surface complexity. If you can move through the emotional patterns that keep you both guarded, what you could build together is significant.",
  "This connection has staying power, but it requires emotional honesty neither of you may be used to offering. The potential is real — so is the work.",
  "Long-term potential is high — but conditional. It depends on whether you both choose presence over comfort and vulnerability over distance. The capacity is there. The choice is ongoing.",
];

const addictiveTexts = [
  "The addictive quality here comes from emotional unpredictability — they make you feel seen in a way that isn't consistent. That inconsistency keeps you returning, hoping for more of the version that felt like everything.",
  "You're addicted to the emotional version of them that shows up during moments of genuine connection — and the hope of recreating those moments is powerful. That's not weakness; that's chemistry.",
  "What pulls you back is the feeling of being fully known — rare enough that even partial experiences of it create craving. This isn't toxic; it's recognition hunger.",
  "The dynamic feels addictive because emotionally, it delivers exactly what you're wired to seek: intensity + uncertainty + moments of deep resonance. That combination is neurologically compelling.",
  "You keep returning because somewhere in this connection is a version of yourself you only access here. That's what makes it hard to walk away — it's not just them you'd be leaving.",
];

const hiddenPatternTexts = [
  "The hidden pattern: you're both emotionally avoidant in different directions. One avoids by withdrawing, one by over-giving. The cycle sustains itself because both patterns feel justified from the inside.",
  "Beneath the surface, there's a pattern of emotional testing happening — small acts designed to see if the other person will stay. When they do, it creates relief but not resolution.",
  "The hidden dynamic is that you both idealize the version of each other you first encountered, and the distance between that image and reality creates ongoing emotional work.",
  "There's a recurring pattern of emotional rupture and repair that keeps both of you bonded. The repair phase feels so good that it unconsciously creates tolerance for the rupture.",
  "The pattern underneath everything: both of you have more capacity for this connection than you let on. The holding back creates a tension that loops — always close, never quite arrived.",
];

// ─── Viral Features ──────────────────────────────────────────────────────────

const viralFeatures = {
  "falls-harder": {
    title: "Who Falls Harder?",
    icon: "heart",
    locked: false,
    results: [
      (u: string, p: string) => `${u} falls harder — and faster. There's an emotional investment pattern here that runs deeper than they show. ${p} catches feelings, but takes longer to let them land.`,
      (u: string, p: string) => `${p} is the one who falls harder, even if they'd never admit it. ${u} feels deeply, but has unconscious defenses that slow the fall.`,
      (u: string, _p: string) => `${u} falls harder in the beginning — intensity and openness. As time passes, the dynamic inverts. The initial force fades and the slower builder becomes the stronger anchor.`,
    ],
  },
  "attached-first": {
    title: "Who Gets Attached First?",
    icon: "link",
    locked: false,
    results: [
      (u: string, p: string) => `${u} attached first — not because they're more vulnerable, but because they're more honest about it. ${p} was attached shortly after, they just didn't call it that.`,
      (u: string, p: string) => `${p} attached first. There was a specific moment — they may remember it exactly. For ${u}, it was gradual and then undeniable.`,
      (u: string, p: string) => `Both of you got attached at the same moment but called it something different. ${u} called it 'interest.' ${p} called it 'enjoying the time.' It was the same thing.`,
    ],
  },
  "dependency-index": {
    title: "Emotional Dependency Index",
    icon: "activity",
    locked: false,
    results: [
      (_u: string, p: string) => `Your emotional dependency index is elevated. You've woven them into your internal emotional landscape — ${p} affects your mood, your energy, your sense of possibility.`,
      (u: string, _p: string) => `${u}'s dependency runs through the mind, not just the heart — constant replay, analysis, interpretation of signals. This is cognitive bonding, and it runs deep.`,
      (_u: string, _p: string) => `The dependency here is mutual but asymmetric. One is emotionally dependent; the other is situationally dependent. Together, they've created a feedback loop.`,
    ],
  },
  "ghosting-probability": {
    title: "Ghosting Probability",
    icon: "eye-off",
    locked: true,
    results: [
      (_u: string, p: string) => `The ghosting probability is lower than you fear. ${p} has avoidant tendencies but not disappearing ones. What looks like pulling away is usually processing.`,
      (_u: string, p: string) => `There's a moderate chance of emotional withdrawal — not ghosting, but distance. ${p} retreats when overwhelmed, which can feel like disappearing. It's not abandonment; it's regulation.`,
      (_u: string, _p: string) => `The likelihood of full ghosting is low — this connection has too much emotional weight for that. What's more likely is inconsistency, which may feel worse.`,
    ],
  },
  "reunion-potential": {
    title: "Reunion Potential",
    icon: "refresh-cw",
    locked: true,
    results: [
      (_u: string, _p: string) => `Reunion potential is high — not because nothing went wrong, but because the emotional foundation was real. Those don't disappear. They wait.`,
      (u: string, p: string) => `If ${u} and ${p} reunited, it wouldn't be the same dynamic — it would be the evolved version. Whether that's better depends entirely on what each of you has learned.`,
      (_u: string, _p: string) => `The pull toward each other has not fully released. Reunion is possible, but it requires a conversation that hasn't happened yet. Until then, the door stays ajar.`,
    ],
  },
  "toxic-or-soulmate": {
    title: "Toxic or Soulmate?",
    icon: "zap",
    locked: true,
    results: [
      (_u: string, _p: string) => `Neither purely. This connection lives in the space where intensity becomes hard to distinguish from toxicity. What feels like poison and what feels like soul recognition can originate from the same place.`,
      (_u: string, _p: string) => `The answer changes depending on which version of you is asking. At your highest, this is a soulmate connection. At your most wounded, it activates patterns that damage you. Both are true.`,
      (_u: string, _p: string) => `Soulmate — but not in the comfortable sense. Soulmates, at their truest, arrive to crack you open, not comfort you. This connection is doing exactly that.`,
    ],
  },
  "cant-let-go": {
    title: "Why You Can't Let Go",
    icon: "anchor",
    locked: false,
    results: [
      (_u: string, p: string) => `You can't let go because ${p} represents the version of love you've always wanted — not always delivered, but convincingly glimpsed. That glimpse is the hook.`,
      (_u: string, _p: string) => `You can't let go because you're not done learning what this relationship is here to teach you. That's not weakness — it's unfinished emotional work.`,
      (u: string, _p: string) => `${u} stays because leaving would mean accepting that intensity doesn't equal compatibility. That's a hard truth. It's easier to wait for the intensity to become something stable.`,
    ],
  },
  "red-flags": {
    title: "Emotional Red Flags",
    icon: "flag",
    locked: false,
    results: [
      (_u: string, p: string) => `${p} has a pattern of emotional inconsistency — fully present one moment, unreachable the next. This isn't malice; it's unhealed avoidance. But it costs you regulation.`,
      (_u: string, _p: string) => `The red flag here isn't behavior — it's pattern. The cycle of closeness-distance-closeness has repeated enough times to be a design, not an accident.`,
      (_u: string, _p: string) => `Emotional ambiguity is the main flag. When someone makes you question your own perception of what's happening, that's a signal. Trust what you consistently feel, not what you're told to dismiss.`,
    ],
  },
  "green-flags": {
    title: "Emotional Green Flags",
    icon: "check-circle",
    locked: false,
    results: [
      (u: string, p: string) => `${p} consistently remembers things about ${u} that matter. This is a significant green flag — it signals emotional attentiveness, not performance.`,
      (_u: string, _p: string) => `The biggest green flag: they've made you feel safe being honest about things you usually hide. Safety to be authentic is the rarest offering in relationships.`,
      (u: string, p: string) => `${u} and ${p} both move toward resolution rather than away from discomfort. That orientation — toward rather than away — is the foundation of real intimacy.`,
    ],
  },
  "pulling-back": {
    title: "What Keeps Pulling You Back",
    icon: "repeat",
    locked: false,
    results: [
      (_u: string, _p: string) => `You keep returning to the feeling of being fully seen — even briefly. That feeling doesn't happen with everyone. When it does, it creates a gravity that doesn't respect logic or timing.`,
      (_u: string, p: string) => `${p} shows up, in moments, as exactly the person you need them to be. Those moments are real. They're also rare enough to create a powerful scarcity effect.`,
      (_u: string, _p: string) => `The emotional frequency between you is unique to this pairing. You've tried to replicate it elsewhere, consciously or not, and it hasn't quite happened. That uniqueness is the pull.`,
    ],
  },
};

// ─── Daily Energy ────────────────────────────────────────────────────────────

const dailyEnergyMessages: Record<string, string[]> = {
  high: [
    "The emotional connection between you feels amplified today — something is trying to surface.",
    "Today carries an unusual openness between your energies. If there's something unsaid, now is when it wants to be heard.",
    "A strong pull exists in the space between you today. You may find yourself thinking about them more than usual.",
  ],
  medium: [
    "The emotional current between you is steady today — present but quiet. A good day to simply let things be.",
    "There's a calm resonance today. Not dramatic, but stable. Stability in connection is underrated.",
    "Today's energy is contemplative — you may find yourself revisiting memories or patterns in this connection.",
  ],
  low: [
    "There may be some emotional distance today — not disconnection, but space. Let it breathe.",
    "Today suggests a day of emotional processing rather than reaching. Sometimes distance is part of the pattern.",
    "The energy feels quieter between you today. This isn't a signal of change — it's a natural ebb.",
  ],
  tension: [
    "There's unresolved emotional tension today. Something between you wants acknowledgment, not resolution yet.",
    "Today there may be friction in how you interpret each other's signals. Pause before reacting to anything.",
    "A charged emotional undercurrent exists today — the kind that feels like anticipation and anxiety at once.",
  ],
};

// ─── Main exports ────────────────────────────────────────────────────────────

export interface CompatibilitySection {
  label: string;
  score: number;
  text: string;
  color: string;
}

export interface CompatibilityData {
  overall: number;
  sections: CompatibilitySection[];
  partnerName: string;
  userName: string;
  relationshipType: RelationshipType;
}

export function calculateCompatibility(
  userBirthDate: string,
  partnerBirthDate: string,
  userName: string,
  partnerName: string,
  relationshipType: RelationshipType
): CompatibilityData {
  const seed = dateToNum(userBirthDate) * 31 + dateToNum(partnerBirthDate) * 17;
  const rng = seededRng(seed);

  const emotionalScore = score(rng, 64, 97);
  const commScore = score(rng, 58, 95);
  const attachScore = score(rng, 55, 92);
  const tensionScore = score(rng, 48, 88);
  const ltScore = score(rng, 60, 96);
  const addictiveScore = score(rng, 70, 99);
  const patternScore = score(rng, 62, 94);

  const overall = Math.round(
    (emotionalScore + commScore + attachScore + ltScore + addictiveScore) / 5
  );

  const sections: CompatibilitySection[] = [
    {
      label: "Emotional Chemistry",
      score: emotionalScore,
      text: pick(emotionalChemistryTexts, seededRng(seed + 1)),
      color: "#E85C7A",
    },
    {
      label: "Communication Energy",
      score: commScore,
      text: pick(communicationTexts, seededRng(seed + 2)),
      color: "#B855E0",
    },
    {
      label: "Attachment Dynamics",
      score: attachScore,
      text: pick(attachmentTexts, seededRng(seed + 3)),
      color: "#7C52C8",
    },
    {
      label: "Emotional Tension",
      score: tensionScore,
      text: pick(tensionTexts, seededRng(seed + 4)),
      color: "#F5A623",
    },
    {
      label: "Long-Term Potential",
      score: ltScore,
      text: pick(longTermTexts, seededRng(seed + 5)),
      color: "#52C8B8",
    },
    {
      label: "Why This Feels Addictive",
      score: addictiveScore,
      text: pick(addictiveTexts, seededRng(seed + 6)),
      color: "#E85C7A",
    },
    {
      label: "Hidden Relationship Pattern",
      score: patternScore,
      text: pick(hiddenPatternTexts, seededRng(seed + 7)),
      color: "#B855E0",
    },
  ];

  return {
    overall,
    sections,
    partnerName,
    userName,
    relationshipType,
  };
}

export interface DailyEnergy {
  closeness: number;
  attraction: number;
  communication: number;
  reconnection: number;
  tension: number;
  message: string;
  date: string;
}

export function getDailyEnergy(
  userBirthDate: string,
  partnerBirthDate: string
): DailyEnergy {
  const today = new Date();
  const dayNum =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const baseSeed =
    dateToNum(userBirthDate) * 31 + dateToNum(partnerBirthDate) * 17;
  const seed = baseSeed * 7 + dayNum * 3;
  const rng = seededRng(seed);

  const closeness = score(rng, 40, 98);
  const attraction = score(rng, 45, 99);
  const communication = score(rng, 35, 95);
  const reconnection = score(rng, 30, 90);
  const tension = score(rng, 20, 85);

  const avgHigh = (closeness + attraction + communication) / 3;
  let messageKey: string;
  if (tension > 70) messageKey = "tension";
  else if (avgHigh > 75) messageKey = "high";
  else if (avgHigh > 55) messageKey = "medium";
  else messageKey = "low";

  const message = pick(dailyEnergyMessages[messageKey], seededRng(seed + 99));

  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return {
    closeness,
    attraction,
    communication,
    reconnection,
    tension,
    message,
    date: dateStr,
  };
}

export interface ViralFeatureResult {
  key: string;
  title: string;
  icon: string;
  locked: boolean;
  score: number;
  text: string;
}

export function getAllViralFeatures(
  userBirthDate: string,
  partnerBirthDate: string,
  userName: string,
  partnerName: string
): ViralFeatureResult[] {
  const seed = dateToNum(userBirthDate) * 31 + dateToNum(partnerBirthDate) * 17;

  return Object.entries(viralFeatures).map(([key, feature], i) => {
    const rng = seededRng(seed + i * 13);
    const s = score(rng, 55, 99);
    const textFn = pick(feature.results, seededRng(seed + i * 7 + 5));
    const text = textFn(userName, partnerName);
    return {
      key,
      title: feature.title,
      icon: feature.icon,
      locked: feature.locked,
      score: s,
      text,
    };
  });
}

export interface GuidanceResponse {
  text: string;
}

const guidanceResponses: Record<string, string[]> = {
  withdraw: [
    "When someone pulls away, it's rarely about you — it's almost always about their internal emotional capacity at that moment. Withdrawal is usually self-regulation, not rejection. What looks like distance is often someone trying to find their footing again. The question worth sitting with: is the space temporary, or is it a pattern?",
    "They pulled away because closeness triggered something — old fear, old pain, or a felt sense of 'too much.' This isn't about you being wrong or too intense. It's about them reaching their emotional threshold. Most people who pull away haven't fully processed what they feel yet.",
  ],
  "move-on": [
    "You can't move on yet because part of you is still waiting for the version of this that you believed was possible. That version felt real — maybe it was, for a moment. Moving on means accepting that the potential you saw may have been accurate, but circumstances didn't allow it. That's a loss worth grieving.",
    "Moving on is harder when the connection was real, even if it was incomplete. You're not stuck because you're weak — you're stuck because something genuine happened here, and genuine things leave real marks. The path forward isn't erasing what was real. It's building something alongside it.",
  ],
  "think-about-me": [
    "Based on the emotional weight of this connection, yes — they think about you. Connections of this depth don't live only in one person. What they do with those thoughts is a different question, and one only they can answer.",
    "They think about you in the way we all think about unresolved things — not always consciously, but persistently. Something about your dynamic created imprints that don't easily quiet.",
  ],
  addictive: [
    "This relationship feels addictive because it delivers the two most neurologically compelling experiences simultaneously: intense connection and emotional uncertainty. Your brain can't stop seeking resolution, and it keeps mistaking the seeking for love.",
    "The addiction is really attachment — but the kind with enough inconsistency to keep the seeking alive. You're not addicted to them. You're addicted to the version of this that felt absolutely right, even if it only appeared in flashes.",
  ],
  misunderstand: [
    "You misunderstand each other because your communication styles operate at different emotional frequencies. You lead with feeling; they lead with meaning. Both are valid forms of honesty, but they often sound like different languages until you slow down enough to translate.",
    "The misunderstandings happen because you're both protecting something while trying to connect — and protection and openness want opposite things. Learning to name what you're protecting changes everything.",
  ],
  default: [
    "What you're feeling makes sense given the emotional complexity of this connection. There's no clean answer, but there is clarity available — it usually comes when you stop trying to decode them and start listening to yourself.",
    "The fact that you're asking this question means you're already doing the most important emotional work: paying attention. Most people avoid this. You're already further along than it feels.",
    "This is one of those things that has no quick answer — but your instinct about it is likely more accurate than you're letting yourself believe. Trust that first reading.",
  ],
};

export function getGuidanceResponse(question: string, partnerName: string, relationshipType: RelationshipType): string {
  const q = question.toLowerCase();
  let category = "default";

  if (q.includes("pull away") || q.includes("pulled away") || q.includes("distant") || q.includes("withdraw")) {
    category = "withdraw";
  } else if (q.includes("move on") || q.includes("can't forget") || q.includes("let go") || q.includes("get over")) {
    category = "move-on";
  } else if (q.includes("think about me") || q.includes("thinks about") || q.includes("miss me") || q.includes("misses")) {
    category = "think-about-me";
  } else if (q.includes("addictive") || q.includes("can't stop") || q.includes("obsess") || q.includes("keep coming back")) {
    category = "addictive";
  } else if (q.includes("misunderstand") || q.includes("communicate") || q.includes("don't understand") || q.includes("wrong")) {
    category = "misunderstand";
  }

  const options = guidanceResponses[category];
  const seed = question.length * 31 + partnerName.length * 17;
  const rng = seededRng(seed);
  let text = pick(options, rng);

  text = text.replace(/\{partner\}/g, partnerName);

  const suffix: Record<RelationshipType, string> = {
    crush: ` With a crush, this stage — before clarity — is often the most emotionally formative.`,
    situationship: ` In a situationship especially, the absence of a label amplifies every feeling.`,
    relationship: ` In an established relationship, these patterns become the invisible architecture of daily life.`,
    ex: ` With an ex, memory edits the past and makes returning feel safer than it may be.`,
  };

  return text + suffix[relationshipType];
}
