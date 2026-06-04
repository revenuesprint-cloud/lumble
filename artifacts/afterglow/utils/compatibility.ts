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
  "The emotional pull here is real — and it runs deeper than either of you has fully admitted. Deep chemistry without direction tends to become the hardest kind to walk away from. That's not a compliment. It's a warning and an opportunity at the same time.",
  "Something clicks between you that doesn't click with most people. When something rare happens, it gets mistaken for a sign. It might be a sign. It might also just be chemistry. The question worth sitting with: which one is it for you?",
  "You understand each other in ways that don't require explanation. That kind of shorthand takes years with most people. Here it was there almost immediately. That's worth paying attention to — but it isn't the same as compatibility.",
  "The emotional frequency between you is unusually matched — which means the highs hit differently, and so do the lows. This connection will teach you something significant. The only question is whether you're paying attention to what it's actually teaching.",
  "There's a specific kind of connection where the chemistry is unmistakable but the dynamic is unresolved. This is that. The chemistry is real. What it means — that requires a harder conversation than either of you has had yet.",
];

const communicationTexts = [
  "One of you leads with feeling, the other with logic. That gap isn't the problem — it becomes the problem when one person keeps having to translate and the other keeps not noticing that they're the one who should be.",
  "You communicate well when things are good and poorly when things matter most. That's exactly backwards from what actually counts. How you talk to each other when something is hard is the only measure that tells you anything real.",
  "There's an unspoken shorthand between you. It works until it doesn't — and when it breaks down, neither of you is sure what happened. That gap gets wider every time it doesn't get named directly.",
  "Your best conversations happen when neither of you is performing. The problem is that performance has become the default in this connection. What it would look like to drop it completely — that's worth finding out.",
  "What doesn't get said between you carries more weight than what does. Both of you know this. The question is which of you goes first into what's actually true — and what happens when they do.",
];

const attachmentTexts = [
  "One of you moves closer. The other pulls back. Then it switches. This isn't chemistry — it's two attachment styles running on different timelines, creating a loop that feels like electricity but is really two people trying not to get hurt first.",
  "You're both more attached than either of you has said out loud. The gap between what you feel and what you show is where most of the confusion in this connection lives — and where most of the distance gets manufactured.",
  "There's an anxious-avoidant pattern at work here. The moments of closeness feel extraordinary precisely because of the uncertainty before them. Your system has learned to call that cycle love. That equation is worth examining.",
  "Both of you invest deeply but show it differently. One goes in fast and then gets scared. The other holds back and then can't leave. You keep arriving at the same place on different schedules. That one-step gap is the whole story.",
  "The attachment is already more significant than either of you has acknowledged. What happens when that gets named out loud will tell you more about this connection than months of the current pattern.",
];

const tensionTexts = [
  "The tension isn't the problem — it's the symptom. There are two or three specific things that haven't been said between you, and the tension is where they're living right now. Both of you know what they are. One of you needs to say them.",
  "Something sits unresolved and surfaces in unexpected moments. Not always as conflict — just as weight. That kind of weight doesn't come from nowhere. It needs a direct conversation, not more time.",
  "The friction is only useful if it's moving you toward something. Right now it's more likely being used as a reason to maintain distance that would be harder to justify without it. That's worth noticing.",
  "Most tension in a connection is one person waiting for the other to acknowledge something. Identify exactly what needs acknowledging here. The tension changes shape entirely when it gets named — almost always for the better.",
  "Both of you are more in this than you're showing each other. The tension is the gap between what you feel and what you'll admit to. Every time that gap doesn't close, it gets fractionally larger. This is one of those moments.",
];

const longTermTexts = [
  "This connection has real staying power — not because it's easy, but because the emotional pull survives hard moments. That's rarer than it sounds. Most connections don't have it. This one does. What you do with that is the question.",
  "Long-term potential is genuinely here. What it requires: a degree of honesty that neither of you is fully used to offering. The capability exists. The question is whether you're both willing to use it at the same time.",
  "For this to last, one of you has to go first — into vulnerability, into naming what's been hovering. Whoever does it will change the dynamic permanently. It won't go back to how it was before. That's the point.",
  "This could become something significant. What it requires is both people choosing depth over comfort at the exact moment those two things start to feel different. That moment is either approaching or already here.",
  "The raw material for something real is present. What it needs is both of you deciding that the discomfort of honesty is less costly than the slow erosion of staying vague. That decision tends to only get made once.",
];

const addictiveTexts = [
  "What makes this hard to step away from is specific: you found someone who makes you feel known — not just liked, actually known. That doesn't happen often. Once it does, the mind doesn't release it easily. That's what you're caught in, not necessarily the person.",
  "The addiction is to those moments when everything clicked. They were real. The problem: chasing them means tolerating significant uncertainty in between. Your system has learned to call that cycle love. It's worth asking whether it is.",
  "You return because this connection reaches something in you that most people don't get close to. That depth is real. The question is whether it's sustainable or just intense — those are very different things with very different futures.",
  "The pull back is emotional recognition — the feeling of being fully seen by someone. Once you've had that, ordinary connection feels like not quite enough. You may be more attached to that feeling than to this specific person. Worth knowing.",
  "The hardest truth here: you're not just attached to them. You're attached to the version of yourself that exists in this connection. That person is what you're not ready to lose. The question is whether you can find them without this.",
];

const hiddenPatternTexts = [
  "The pattern underneath everything: both of you are more afraid of getting what you want than of not getting it. That fear is what's actually running the show. The distance, the ambiguity, the cycles — all of it is in service of that fear.",
  "There's a testing pattern here. Small actions, small withdrawals — all designed to find out if the other person will stay. The test never officially ends because neither of you has decided it's safe to stop running it. That's the loop.",
  "Both of you are holding back about 30% of what you actually feel. That 30% is the most important part. It's also the part that, when it finally comes out, changes everything. The question is who's willing to go there first.",
  "The pattern no one is naming: you've both built walls that look like preferences. 'I need space.' 'I'm not ready.' Those aren't preferences — they're defences wearing a more acceptable label. The real thing is underneath.",
  "The real hidden pattern: you're both waiting for the other person to make it safe to want this fully. That's not going to happen on its own. Someone has to make it safe by wanting it first, out loud, without a guarantee. That's the only move that changes anything.",
];

// ─── Viral Features ──────────────────────────────────────────────────────────

const viralFeatures = {
  "falls-harder": {
    title: "Who Falls Harder?",
    icon: "heart",
    locked: false,
    results: [
      (u: string, p: string) => `${u} falls harder. Not because they're more vulnerable — because they're less defended. The way ${u} processes connection means they feel the weight of it before they have words for it. ${p} catches feelings too. By the time ${p} admits it, ${u} is already all in.`,
      (u: string, p: string) => `${p} falls harder. They just hide it better. There's a specific way ${p} behaves around ${u} — not what they say, what they actually do — that makes this clear. The intensity is there. The acknowledgment isn't yet.`,
      (u: string, _p: string) => `${u} falls first and falls deeper. The twist: the one who falls slower often ends up with more influence over how things develop, without meaning to. That dynamic is already playing out in how small decisions get made between you.`,
    ],
  },
  "attached-first": {
    title: "Who Gets Attached First?",
    icon: "link",
    locked: false,
    results: [
      (u: string, p: string) => `${u} got attached first. Not because they're more sensitive — because they pay closer attention. ${p} got there shortly after, they just filed it under a different name and waited longer to say it.`,
      (u: string, p: string) => `${p} got attached first. There was probably a specific moment they remember clearly that ${u} doesn't. That asymmetry — one person knowing the exact moment, the other not — is still quietly shaping how this connection moves.`,
      (u: string, p: string) => `Both got attached at almost the same moment but gave it different names. ${u} called it interest. ${p} called it enjoying the time. It was the same thing in two different languages.`,
    ],
  },
  "dependency-index": {
    title: "Emotional Dependency Index",
    icon: "activity",
    locked: false,
    results: [
      (_u: string, p: string) => `The dependency is high — and it's not one-sided. You've woven ${p} into the way you process your own emotional state. Their mood moves yours. Their silence changes your day. That's not weakness. That's entanglement. Knowing the difference matters.`,
      (u: string, _p: string) => `${u}'s dependency runs through the mind first: replaying interactions, reading between lines, analysing what things meant. This is deep bonding wearing the clothes of obsession. The line between them is thinner than most people admit.`,
      (_u: string, _p: string) => `The dependency is asymmetric but mutual. One person is more emotionally dependent; the other is more dependent on the dynamic itself — on having this available. Together they've created something that sustains itself without either person choosing it consciously.`,
    ],
  },
  "ghosting-probability": {
    title: "Ghosting Probability",
    icon: "eye-off",
    locked: true,
    results: [
      (_u: string, p: string) => `The chance of being ghosted is lower than the fear suggests. ${p} has avoidant tendencies, not disappearing ones. What looks like pulling away is almost always internal processing. The distinction matters a lot for how you respond to it.`,
      (_u: string, p: string) => `Moderate risk of emotional withdrawal, not full exit. ${p} goes quiet when overwhelmed — it can feel identical to disappearing, but it isn't. Knowing the difference changes everything about how you handle the next silence.`,
      (_u: string, _p: string) => `Full ghosting is unlikely. This connection carries too much emotional weight for a clean disappearance. What's more probable is inconsistency — which can feel worse than ghosting because it doesn't give you permission to stop hoping.`,
    ],
  },
  "reunion-potential": {
    title: "Reunion Potential",
    icon: "refresh-cw",
    locked: true,
    results: [
      (_u: string, _p: string) => `Reunion potential is real. Not because nothing went wrong, but because what was genuine between you doesn't simply stop being genuine when the relationship does. The question worth answering first: would you be returning to something, or rebuilding something? Those are very different conversations.`,
      (u: string, p: string) => `If ${u} and ${p} came back together, it wouldn't be the same thing — it would be the next version of it. Whether that version is better depends entirely on what each person actually did with the time apart, not on what feelings remained.`,
      (_u: string, _p: string) => `The pull toward each other hasn't dissolved. A reunion is possible, but there's a specific conversation that hasn't happened yet — and until it does, any return lands at the same starting point as before.`,
    ],
  },
  "toxic-or-soulmate": {
    title: "Toxic or Soulmate?",
    icon: "zap",
    locked: true,
    results: [
      (_u: string, _p: string) => `Neither fully — and both partly. This connection lives where intensity and damage are hard to tell apart. What feels like a soulmate dynamic and what activates old wounds can come from the exact same source. That's the complication worth sitting with.`,
      (_u: string, _p: string) => `The answer changes depending on which version of you is asking. At your clearest, this is a soulmate dynamic. At your most defended or hurt, it activates patterns that cost you. Both readings are accurate. Both are yours to understand.`,
      (_u: string, _p: string) => `Soulmate — but not in the comfortable sense. Real soulmate connections don't arrive to make you comfortable. They arrive to open something up that needed opening. This one is doing that. Whether it feels beautiful or painful right now depends entirely on where you are.`,
    ],
  },
  "cant-let-go": {
    title: "Why You Can't Let Go",
    icon: "anchor",
    locked: false,
    results: [
      (_u: string, p: string) => `You can't let go because ${p} showed you a version of love that felt like what you'd always been looking for. It wasn't always there, but you saw it clearly enough to believe in it. That glimpse is the hook — and it's a real one. The question is what you do with a real hook.`,
      (_u: string, _p: string) => `You can't let go because leaving would require accepting something uncomfortable: that intensity doesn't equal the right match. Staying is how you avoid that conclusion. It won't work indefinitely. At some point the question has to get answered.`,
      (u: string, _p: string) => `${u} can't leave because this connection reaches a part of them that most connections don't get close to. Leaving doesn't just mean losing the person — it means losing access to that version of themselves. That's the real attachment. It's also the thing worth examining.`,
    ],
  },
  "red-flags": {
    title: "Emotional Red Flags",
    icon: "flag",
    locked: false,
    results: [
      (_u: string, p: string) => `${p} is emotionally inconsistent in a specific way: fully present when things feel easy, significantly less available when things get uncertain. That's not cruelty — it's unresolved avoidance. But the impact on you is the same regardless of the intention behind it.`,
      (_u: string, _p: string) => `The red flag isn't a single moment. It's the pattern. The cycle of closeness and withdrawal has repeated enough times to stop being an accident — it's become the architecture of how this connection works. Patterns don't change without being named directly.`,
      (_u: string, _p: string) => `The main signal: something in this connection makes you regularly question your own read on reality. When you consistently have to recalibrate what's true, that recalibration is the data. Trust the pattern you observe over time — not the individual explanation given in the moment.`,
    ],
  },
  "green-flags": {
    title: "Emotional Green Flags",
    icon: "check-circle",
    locked: false,
    results: [
      (u: string, p: string) => `${p} remembers the small things about ${u} — specific things that weren't worth mentioning twice. That's real attention, not performance. It's one of the rarest things in any connection and one of the most meaningful signals of genuine investment.`,
      (_u: string, _p: string) => `The biggest green flag here: somewhere in this connection, you became able to say something you normally keep hidden. Safety to be fully yourself — without editing or performance — is genuinely rare. If this gave you that, even briefly, that matters more than almost anything else.`,
      (u: string, p: string) => `${u} and ${p} both move toward difficulty rather than away from it when they're at their best. That direction — toward the uncomfortable thing instead of around it — is the actual foundation of intimacy. It's less common than people think.`,
    ],
  },
  "pulling-back": {
    title: "What Keeps Pulling You Back",
    icon: "repeat",
    locked: false,
    results: [
      (_u: string, _p: string) => `You return because of the feeling of being actually seen — not just liked or desired, but seen. That doesn't happen with most people. When it does, it creates a pull that outlasts the logic for staying away. The question isn't whether the pull is real. It is. The question is what it's pointing toward.`,
      (_u: string, p: string) => `${p} shows up, in specific moments, as exactly the person you've been looking for. Those moments are real. They're also rare enough to make every absence feel like a temporary interruption rather than a pattern. That framing is worth questioning.`,
      (_u: string, _p: string) => `The pull is specific to this pairing — the exact combination of this person and this version of you. You may have looked for it elsewhere and found something close but not quite the same. That specificity is real. The question is whether specificity is enough on its own.`,
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
