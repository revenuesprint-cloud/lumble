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
  "You have a rare connection. Even silence between you feels comfortable. Your hearts seem to find each other without trying.",
  "There is a natural pull between you two. Your emotions match in a way that feels almost magical. People around you can feel it too.",
  "You understand each other on a deep level, even without many words. This kind of connection is something most people spend their whole life looking for.",
  "When your feelings meet, something electric happens. The way you both feel things deeply makes the bond between you very strong.",
  "Your connection goes beyond just being attracted to each other. There is a real emotional bond here that keeps drawing you back.",
];

const communicationTexts = [
  "One of you leads with feelings and the other with logic. This can create small misunderstandings, but when you are on the same page, your conversations go very deep.",
  "You communicate in waves. Sometimes you understand each other perfectly. Other times you miss each other completely. Learning to slow down will help a lot.",
  "What one of you cannot say out loud, the other can feel. This unspoken understanding is a rare gift. Use it well.",
  "You both say a lot without using many words. This creates depth in your conversations. But it also means you can sometimes misread each other.",
  "Tone and timing matter more to you both than the exact words used. This makes your conversations rich but also easy to overthink.",
];

const attachmentTexts = [
  "One of you reaches out when things feel uncertain. The other pulls back. This creates a push and pull pattern that can feel exciting and frustrating at the same time.",
  "Your ways of getting attached are different. One moves closer, the other creates distance, then it switches. This cycle makes the connection feel intense.",
  "You are both independent in your own ways. But with each other, old insecurities come up. This can feel scary or it can feel like you are finally being truly seen.",
  "There is an anxious and avoidant pattern here. The moments of closeness feel so good because of all the uncertainty before them.",
  "You both get deeply attached but quietly. You build emotional investment without admitting it, until it becomes impossible to ignore.",
];

const tensionTexts = [
  "The tension between you is not conflict. It is unfinished conversation. There are things that have not been said yet that carry a lot of weight.",
  "There is something unresolved between you that keeps coming up in unexpected moments. It is not negative. It just needs to be spoken.",
  "Your tension actually pushes you both to grow. Even when it feels uncomfortable, the friction is a sign of how much you both care.",
  "What sits unspoken between you is the most powerful thing in this connection. It will not go away on its own. It needs honest words.",
  "You are both in a constant emotional negotiation. Not hostile, just two people trying to find their balance. This process is part of the bond.",
];

const longTermTexts = [
  "This connection has unusual staying power. Not because things are always easy, but because the emotional pull between you survives the hard times.",
  "For the long run, this connection will ask both of you to grow in ways that feel uncomfortable. The couples who do that together become something rare.",
  "There is real compatibility here under the surface. Once you both stop being guarded, what you can build together is something meaningful.",
  "This connection can last. But it needs emotional honesty that neither of you may be used to giving. The potential is real. So is the work required.",
  "Lasting potential is high but depends on one thing: will you both choose to be present and vulnerable, or will you choose comfort and distance? The choice is always yours.",
];

const addictiveTexts = [
  "The addictive feeling comes from emotional unpredictability. They make you feel truly seen but not consistently. That inconsistency keeps you wanting more of those good moments.",
  "You are drawn back because of those moments when everything clicked. Those moments were real. The hope of getting them back is very powerful.",
  "What pulls you is the feeling of being fully known by someone. That feeling is rare. Even a small taste of it creates a strong craving.",
  "This feels hard to stop because it gives you exactly what you are wired to want: deep connection mixed with uncertainty. That combination is very hard to walk away from.",
  "You keep returning because in this connection, you find a version of yourself that you only access here. Leaving does not just mean leaving them.",
];

const hiddenPatternTexts = [
  "The hidden pattern: you are both emotionally cautious in different ways. One withdraws, the other over gives. Both patterns feel justified from the inside, which is why the cycle continues.",
  "Underneath everything, there is a pattern of testing going on. Small actions designed to see if the other person will stay. When they do, it creates relief but not real resolution.",
  "Both of you hold onto the version of each other you first met. The gap between that image and who you are now creates ongoing emotional work for both of you.",
  "There is a pattern of breaking and repairing that keeps you both bonded. The making up feels so good that it creates tolerance for the breaking. Both of you know this cycle.",
  "The pattern underneath: both of you have more capacity for this connection than you show. The holding back creates a tension that loops forever. Always close, never quite there.",
];

// ─── Viral Features ──────────────────────────────────────────────────────────

const viralFeatures = {
  "falls-harder": {
    title: "Who Falls Harder?",
    icon: "heart",
    locked: false,
    results: [
      (u: string, p: string) => `${u} falls harder and faster. There is a deep emotional investment that runs deeper than they show. ${p} catches feelings too, but takes longer to admit it.`,
      (u: string, p: string) => `${p} is the one who falls harder, even if they would never say it out loud. ${u} feels deeply but has some walls that slow the fall.`,
      (u: string, _p: string) => `${u} falls harder at the start, with a lot of openness and intensity. As time passes, this flips. The slower person becomes the stronger anchor.`,
    ],
  },
  "attached-first": {
    title: "Who Gets Attached First?",
    icon: "link",
    locked: false,
    results: [
      (u: string, p: string) => `${u} got attached first. Not because they are more vulnerable, but because they are more honest about it. ${p} got attached shortly after, they just did not use that word.`,
      (u: string, p: string) => `${p} got attached first. There was a specific moment they may remember clearly. For ${u}, it happened slowly and then all at once.`,
      (u: string, p: string) => `Both of you got attached at the same moment but called it something different. ${u} called it interest. ${p} called it enjoying the time. It was the same thing.`,
    ],
  },
  "dependency-index": {
    title: "Emotional Dependency Index",
    icon: "activity",
    locked: false,
    results: [
      (_u: string, p: string) => `Your emotional dependency is high. You have woven ${p} into your inner world. They affect your mood, your energy, and your sense of what is possible.`,
      (u: string, _p: string) => `${u}'s attachment runs through the mind, not just the heart. Constant replaying, analysing, reading into signals. This is deep mental bonding.`,
      (_u: string, _p: string) => `The dependency here is mutual but uneven. One is more emotionally dependent. The other is more situationally dependent. Together they have created a feedback loop.`,
    ],
  },
  "ghosting-probability": {
    title: "Ghosting Probability",
    icon: "eye-off",
    locked: true,
    results: [
      (_u: string, p: string) => `The chance of being ghosted is lower than you fear. ${p} has avoidant tendencies but not disappearing ones. What looks like pulling away is usually just processing.`,
      (_u: string, p: string) => `There is a moderate chance of emotional withdrawal, not full ghosting. ${p} retreats when overwhelmed. It can feel like disappearing but it is not abandonment.`,
      (_u: string, _p: string) => `The chance of full ghosting is low. This connection carries too much emotional weight for that. What is more likely is inconsistency, which can feel just as bad.`,
    ],
  },
  "reunion-potential": {
    title: "Reunion Potential",
    icon: "refresh-cw",
    locked: true,
    results: [
      (_u: string, _p: string) => `Reunion potential is high. Not because nothing went wrong, but because the emotional foundation was real. Real things do not just disappear. They wait.`,
      (u: string, p: string) => `If ${u} and ${p} came back together, it would not be the same as before. It would be the next version of this. Whether better or worse depends on what each person has learned.`,
      (_u: string, _p: string) => `The pull toward each other has not fully gone away. A reunion is possible, but it needs a conversation that has not happened yet. Until then, the door stays open.`,
    ],
  },
  "toxic-or-soulmate": {
    title: "Toxic or Soulmate?",
    icon: "zap",
    locked: true,
    results: [
      (_u: string, _p: string) => `Neither fully. This connection lives in the space where intensity and pain look the same. What feels like a soulmate and what feels like poison can come from the exact same source.`,
      (_u: string, _p: string) => `The answer changes depending on which version of you is asking. At your best, this is a soulmate connection. At your most hurt, it activates patterns that damage you. Both are true.`,
      (_u: string, _p: string) => `Soulmate, but not in a comfortable way. Real soulmates arrive to open you up, not to make you comfortable. This connection is doing exactly that.`,
    ],
  },
  "cant-let-go": {
    title: "Why You Can't Let Go",
    icon: "anchor",
    locked: false,
    results: [
      (_u: string, p: string) => `You cannot let go because ${p} represents the kind of love you always wanted. It was not always there, but you saw it clearly enough to believe in it. That glimpse is the hook.`,
      (_u: string, _p: string) => `You cannot let go because you have not finished learning what this relationship is here to teach you. That is not weakness. That is unfinished work.`,
      (u: string, _p: string) => `${u} stays because leaving would mean accepting that intensity does not equal the right match. That is a hard truth. It feels easier to wait for the intensity to become stability.`,
    ],
  },
  "red-flags": {
    title: "Emotional Red Flags",
    icon: "flag",
    locked: false,
    results: [
      (_u: string, p: string) => `${p} has a pattern of being emotionally inconsistent. Fully present one moment, completely unavailable the next. This is not cruelty. It is unhealed avoidance. But it costs you your peace.`,
      (_u: string, _p: string) => `The red flag here is not a single action. It is a pattern. The cycle of closeness and distance has happened enough times to be a habit, not an accident.`,
      (_u: string, _p: string) => `The main flag is emotional confusion. When someone makes you question your own sense of what is real, that is a signal. Trust what you consistently feel, not what you are told to ignore.`,
    ],
  },
  "green-flags": {
    title: "Emotional Green Flags",
    icon: "check-circle",
    locked: false,
    results: [
      (u: string, p: string) => `${p} consistently remembers things about ${u} that matter. This is a big green flag. It shows genuine emotional attention, not performance.`,
      (_u: string, _p: string) => `The biggest green flag is this: they have made you feel safe being honest about things you normally hide. Safety to be yourself is the rarest gift in a relationship.`,
      (u: string, p: string) => `${u} and ${p} both move toward fixing things rather than away from discomfort. That direction, toward instead of away, is the foundation of real intimacy.`,
    ],
  },
  "pulling-back": {
    title: "What Keeps Pulling You Back",
    icon: "repeat",
    locked: false,
    results: [
      (_u: string, _p: string) => `You keep returning to the feeling of being fully seen. Even briefly. That feeling does not happen with everyone. When it does, it creates a gravity that logic cannot override.`,
      (_u: string, p: string) => `${p} shows up, in moments, as exactly the person you need. Those moments are real. They are also rare enough to create a strong pull.`,
      (_u: string, _p: string) => `The feeling between you is unique to this pairing. You may have tried to find it elsewhere and it was not quite the same. That uniqueness is what keeps pulling you back.`,
    ],
  },
};

// ─── Daily Energy ────────────────────────────────────────────────────────────

const dailyEnergyMessages: Record<string, string[]> = {
  high: [
    "The emotional connection between you feels strong today. Something is trying to come to the surface.",
    "Today there is an unusual openness between your energies. If there is something unsaid, today is a good day to say it.",
    "There is a strong pull between you today. You may find yourself thinking about them more than usual.",
  ],
  medium: [
    "The energy between you is steady today, present but quiet. A good day to simply be together.",
    "There is a calm feeling today. Not dramatic, but stable. Stability in a connection is something to appreciate.",
    "Today feels thoughtful. You may find yourself going back to memories or patterns in this connection.",
  ],
  low: [
    "There may be some emotional space today, not distance, just breathing room. Let it be.",
    "Today suggests a day of reflection rather than reaching out. Sometimes space is part of the rhythm.",
    "The energy feels quieter between you today. This is not a sign of something wrong. It is a natural pause.",
  ],
  tension: [
    "There is some unresolved tension today. Something between you wants to be acknowledged, not necessarily resolved yet.",
    "Today there may be some friction in how you read each other's signals. Pause before reacting to anything.",
    "There is an emotional charge between you today. It feels like a mix of anticipation and nervousness at the same time.",
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
      label: "Attachment Style",
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
      label: "Future Potential",
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
      label: "Hidden Pattern",
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
    "When someone pulls away, it is rarely about you. It is almost always about how much they can handle emotionally at that moment. Pulling back is usually a way to calm down, not a rejection. The real question is: is this space temporary, or is it becoming a pattern?",
    "They pulled away because getting close triggered something in them, maybe an old fear or a feeling of too much. This is not about you being wrong or too intense. It is about them reaching their emotional limit. Most people who pull away have not fully processed what they feel yet.",
  ],
  "move-on": [
    "You cannot move on yet because part of you is still waiting for the version of this that you believed was possible. That version felt real, and it may have been for a moment. Moving on means accepting that the potential you saw was real, but the timing or circumstances did not allow it. That is a real loss and it is okay to grieve.",
    "Moving on is harder when the connection was genuine, even if it was incomplete. You are not stuck because you are weak. You are stuck because something real happened here, and real things leave real marks. Moving forward does not mean erasing what was real. It means building your life alongside it.",
  ],
  "think-about-me": [
    "Based on the emotional depth of this connection, yes, they think about you. Connections like this do not live in only one person. What they do with those thoughts is a different question, and only they can answer that.",
    "They think about you the way we all think about unfinished things. Not always consciously, but consistently. Something about your connection created an impression that does not easily fade.",
  ],
  addictive: [
    "This relationship feels addictive because it gives you two very powerful things at the same time: deep connection and emotional uncertainty. Your mind keeps looking for resolution, and it keeps mistaking that search for love.",
    "The addiction is really attachment, but the kind with enough inconsistency to keep you searching. You are not addicted to them. You are addicted to the version of this that felt completely right, even if it only appeared sometimes.",
  ],
  misunderstand: [
    "You misunderstand each other because your communication styles work at different emotional levels. You lead with feelings and they lead with meaning. Both are honest ways of talking, but they can sound like different languages until you slow down enough to really listen.",
    "The misunderstandings happen because you are both trying to protect something while also trying to connect. Protection and openness want opposite things. Learning to name what you are protecting changes everything.",
  ],
  default: [
    "What you are feeling makes complete sense given how complex this connection is. There is no clean answer, but there is clarity available. It usually comes when you stop trying to understand them and start listening to yourself.",
    "The fact that you are asking this question means you are already doing the most important work: paying attention. Most people avoid this. You are already further ahead than it feels.",
    "This is one of those things with no quick answer. But your gut feeling about it is probably more accurate than you are allowing yourself to believe. Trust that first instinct.",
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
    crush: " With a crush, this stage before clarity is often the most emotionally powerful.",
    situationship: " In a situationship especially, the lack of a label makes every feeling much stronger.",
    relationship: " In an established relationship, these patterns become the invisible shape of everyday life.",
    ex: " With an ex, memory rewrites the past and makes returning feel safer than it may actually be.",
  };

  return text + suffix[relationshipType];
}
