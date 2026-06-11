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
  "You both sense something deeper in this connection than either of you has fully said out loud. Calling it just chemistry undersells what is actually happening here. Your moon placements create an emotional pull that does not show up in most pairings. Have the conversation you have been postponing about what you actually want from each other.",
  "There is a shorthand between you that took almost no time to build, and that kind of understanding is genuinely rare. Most people spend years getting to where you already are. Your birth chart compatibility shows strong emotional resonance between your natures. The risk is using that closeness as a way to avoid being more specific about where this is actually going.",
  "The pull you feel toward this person is real and specific to this pairing. You have probably looked for something like it elsewhere and found it does not easily replicate. Your chart placements create an emotional resonance that is stronger than average for this type of connection. That specificity deserves a direct conversation rather than more time passing.",
  "You have both felt the weight of this connection but may not have said the same thing to each other about it. The intensity is there and you both know it. Your planetary positions show emotional natures that interact in a way that creates unusual closeness. What that closeness needs now is honesty about what you both actually want.",
  "Something about this connection feels irreplaceable even when the situation is frustrating. You may have tried to logic your way out of the feeling and found that it does not work that way. Your moon signs create a specific pull that is built into how your energies work together. Use that as a reason to be more direct with each other, not less.",
];

const communicationTexts = [
  "One of you processes feelings out loud and the other thinks everything through before speaking, and that difference creates friction when something important needs to be said. Your birth chart planets ruling communication have different natures, which is why timing feels so off sometimes. Before the next important conversation, agree on pace instead of figuring it out mid-discussion.",
  "You communicate easily when things are light and get stuck when things actually matter, which is exactly the wrong way around. Your moon elements create different emotional processing speeds between you. Pick one conversation you have been avoiding and have it this week, even if the timing does not feel perfect.",
  "There is a gap between what gets said and what actually lands, and both of you feel it even if you have not named it. Your planetary placements create a natural friction in how meaning travels between you. The shortcut is asking each other to say the actual thing instead of the easier version of it.",
  "The best conversations between you happen when neither of you is trying to manage how you come across. Your charts show different communication styles that make performance the automatic default even when you do not mean it to be. Try talking without a hidden agenda once this week and notice how different it feels.",
  "What does not get said between you carries more weight than what does, and both of you sense this. Your birth placements create a pattern of circling the real thing rather than going directly to it. Whoever goes first into an honest exchange changes the whole dynamic permanently.",
];

const attachmentTexts = [
  "One of you moves closer when things feel good and the other pulls back when things get real, then it switches. This creates a push and pull rhythm that can feel exciting but keeps both of you slightly off balance. Your moon sign natures create naturally different attachment speeds. The way out is naming this loop when you both can see it clearly rather than from inside it.",
  "You are both more attached than either of you has actually admitted out loud. The gap between what you feel and what you show is where most of the confusion in this connection lives. Your chart compatibility shows a strong emotional bond that neither of you is fully acknowledging. Name what you actually feel to each other, not just what feels safe to say.",
  "There is a cycle of closeness followed by distance that has become the architecture of how this connection works. The moments of genuine closeness feel so good precisely because of the uncertainty that surrounds them. Your moon placements create different comfort levels with emotional vulnerability. One of you needs to break the cycle by staying present when the instinct is to pull back.",
  "Both of you invest deeply but show it in completely different ways. One goes in fast and then gets scared. The other holds back and then cannot leave. You keep arriving at the same place on different schedules. Your birth natures create this one-step gap. Naming the pattern directly is more useful than waiting for the timing to line up on its own.",
  "The attachment between you is already more significant than either of you has acknowledged. What happens when that gets said out loud will tell you more about this connection than months of the current pattern. Your chart placements show a depth of emotional entanglement that is looking for honesty to resolve into something clearer.",
];

const tensionTexts = [
  "The tension between you is not the actual problem. It is where two or three specific unspoken things are living right now. Your moon signs process conflict differently, which is part of why resolution keeps feeling just out of reach. Both of you know what needs to be said. One of you needs to say it in a calm moment rather than in the middle of a fight.",
  "Something sits unresolved between you and surfaces in moments you do not expect. Not always as conflict, just as weight. Your birth placements create a pattern where unresolved tension accumulates quietly rather than releasing. A direct conversation addresses this faster than more time will.",
  "The friction between you is only useful if it is moving you both toward something. Your chart compatibility shows an area of natural tension that needs active attention rather than passive hope. Identify specifically what keeps resurfacing and agree to address it as a shared issue rather than each other's fault.",
  "Most tension in a close connection is one person waiting for the other to acknowledge something they both know is there. Your moon elements create different thresholds for when discomfort needs to be named. Identify exactly what needs acknowledging in this connection and name it. The tension changes shape entirely when it gets spoken aloud.",
  "Both of you are more invested in this than you are showing each other. The tension is the gap between what you feel and what you will admit. Your planetary placements create this specific pattern of holding back the most important part. Every time that gap does not close, it gets a little wider. This is a good moment to close it.",
];

const longTermTexts = [
  "This connection has real staying power, not because it is easy, but because the emotional pull between you survives difficult moments. Your chart compatibility shows a strong alignment that indicates long-term potential when both people are honest with each other. What you do with that potential is the actual question.",
  "Long-term potential is genuinely present in this pairing. Your birth chart compatibility points to a strong foundation when both people choose depth over comfort. The capability for something real is here. The question is whether you are both willing to use it at the same time and in the same direction.",
  "For this to become what it could be, one of you has to go first into the vulnerable conversation. Your charts show a connection that deepens significantly when emotional honesty is chosen over emotional safety. Whoever makes that move changes the dynamic permanently. That is the whole point.",
  "This could become something that matters in a lasting way. What it requires is both of you choosing the uncomfortable honest thing over the comfortable vague thing at the exact moment those two feel different. Your chart placements show the raw material for that is genuinely here. Your next step is acting like it.",
  "The foundation for something real exists in this pairing. Your birth chart compatibility indicates long-term resonance when both people lean in rather than wait. What it needs is both of you deciding that the discomfort of honesty costs less than the slow erosion of staying unclear about what you actually want.",
];

const addictiveTexts = [
  "What makes this hard to step away from is specific. You found someone who makes you feel genuinely known, not just liked or desired, actually known. That does not happen often. Your chart placements show a deep emotional recognition between your natures that is rare. The pull is real. The question is whether this connection is sustainable or just intense, because those are very different things.",
  "You keep coming back because of the moments when everything clicked. Those moments were real. Your birth chart shows an unusual compatibility in how your emotional natures interact, which is what makes those moments possible. The question worth asking is whether the connection as a whole supports those moments or only produces them occasionally.",
  "You return because this connection reaches something in you that most people do not get close to. Your planetary placements show a depth of compatibility that creates that specific feeling of being fully met. That depth is real. Knowing whether it is sustainable requires a more honest conversation than you have had yet.",
  "The pull back to this connection is emotional recognition, the feeling of being seen by someone in a way that is complete. Your chart compatibility shows your emotional wiring creates exactly that for each other. Once you have had that experience, ordinary connection can feel like it is missing something. Worth knowing whether you are attached to this person or to that feeling.",
  "The hardest truth about this pull is that you may be attached to the version of yourself that exists in this connection, not just to the person. Your moon signs interact in a way that brings out specific parts of each of you. That version of you is what you are not ready to lose. Whether you can find that without this specific person is the real question.",
];

const hiddenPatternTexts = [
  "The pattern underneath everything is that both of you are more afraid of getting exactly what you want than of not getting it. Your birth placements show a shadow dynamic that runs beneath the surface of this connection. The distance, the ambiguity, the cycles, all of it is protecting both of you from something you actually want. Name that fear to yourself first, then to each other.",
  "There is a testing pattern running in this connection. Small actions, small withdrawals, all designed to find out if the other person will stay. Your chart compatibility shows a trust dynamic that requires active building rather than passive waiting. The test never officially ends because neither of you has decided it is safe to stop running it. That is the loop you are in.",
  "Both of you are holding back the most important part of what you feel. Your moon signs create a pattern where the part that stays hidden is actually the part that would change everything if it came out. That is the piece worth examining. Who goes first into saying the fuller version of what is true for them?",
  "The pattern no one is naming is that both of you have built walls that look like preferences. I need space. I am not ready. Your planetary placements can create emotional defenses that wear more acceptable labels. Those are not preferences. They are protection wearing a costume. The real thing is underneath. Finding it requires one person to speak plainly.",
  "The real hidden pattern here is that both of you are waiting for the other person to make it safe enough to want this fully. Your charts show a connection that is asking for one person to go first into genuine openness without a guarantee that it will be met. That is the only move that actually changes anything.",
];

// ─── Viral Features ──────────────────────────────────────────────────────────

const viralFeatures = {
  "falls-harder": {
    title: "Who Falls Harder?",
    icon: "heart",
    locked: false,
    results: [
      (u: string, p: string) => `${u} falls harder. Not because they are more vulnerable, but because they are less defended. The way ${u} processes connection means they feel the weight of it before they have words for it. ${p} catches feelings too. By the time ${p} admits it, ${u} is already all in. That timing gap is worth understanding before it creates confusion between you.`,
      (u: string, p: string) => `${p} falls harder. They just hide it better. There is a specific way ${p} behaves around ${u}, not what they say but what they actually do, that makes this clear. The intensity is there. The acknowledgment is not yet. ${u} can either wait for ${p} to catch up or create the space for that conversation to happen.`,
      (u: string, _p: string) => `${u} falls first and falls deeper. The person who falls slower often ends up with more influence over how things develop, without meaning to. That dynamic is already playing out in how small decisions get made between you. Naming this dynamic directly instead of feeling it silently changes how it moves.`,
    ],
  },
  "attached-first": {
    title: "Who Gets Attached First?",
    icon: "link",
    locked: false,
    results: [
      (u: string, p: string) => `${u} got attached first. Not because they are more sensitive, but because they pay closer attention. ${p} got there shortly after but filed it under a different name and waited longer to say it. That asymmetry, one person knowing the exact moment, the other not, is still quietly shaping how this connection moves.`,
      (u: string, p: string) => `${p} got attached first. There was probably a specific moment they remember clearly that ${u} does not. That gap is still present in how each of you thinks about this connection. Getting on the same page about when things shifted matters more than you might think.`,
      (u: string, p: string) => `Both got attached at almost the same moment but gave it different names. ${u} called it interest. ${p} called it enjoying the time. It was the same thing in two different languages. You are actually more aligned in this than either of you has fully acknowledged.`,
    ],
  },
  "dependency-index": {
    title: "Emotional Dependency Index",
    icon: "activity",
    locked: false,
    results: [
      (_u: string, p: string) => `The dependency is high and it is not one-sided. You have woven ${p} into the way you process your own emotional state. Their mood moves yours. Their silence changes your day. That is not weakness. That is entanglement. Knowing the difference between deep connection and entanglement is the most useful thing you can do with this information.`,
      (u: string, _p: string) => `${u}'s dependency runs through the mind first, replaying interactions, reading between lines, analyzing what things meant. This is deep bonding wearing the clothes of obsession. The line between them is thinner than most people admit. Channeling that mental energy into direct conversation is more productive than letting it loop.`,
      (_u: string, _p: string) => `The dependency is not equal but it is mutual. One person is more emotionally dependent. The other is more dependent on the dynamic itself, on having this available. Together they have created something that sustains itself without either person consciously choosing it. Making that choice consciously, one way or another, is the next step.`,
    ],
  },
  "ghosting-probability": {
    title: "Ghosting Probability",
    icon: "eye-off",
    locked: true,
    results: [
      (_u: string, p: string) => `The chance of being ghosted is lower than the fear suggests. ${p} has avoidant tendencies, not disappearing ones. What looks like pulling away is almost always internal processing. The distinction matters a lot for how you respond to it. Reacting to avoidance as if it is abandonment accelerates the very thing you are afraid of.`,
      (_u: string, p: string) => `There is a moderate risk of emotional withdrawal, not full exit. ${p} goes quiet when overwhelmed and it can feel identical to disappearing, but it is not. Knowing the difference changes everything about how you handle the next silence. Giving space without interpreting it as rejection breaks the cycle.`,
      (_u: string, _p: string) => `Full ghosting is unlikely. This connection carries too much emotional weight for a clean disappearance. What is more probable is inconsistency, which can feel worse than ghosting because it does not give you permission to stop hoping. Asking for clarity directly is the only way to resolve that uncertainty.`,
    ],
  },
  "reunion-potential": {
    title: "Reunion Potential",
    icon: "refresh-cw",
    locked: true,
    results: [
      (_u: string, _p: string) => `Reunion potential is real. Not because nothing went wrong, but because what was genuine between you does not simply stop being genuine when the relationship does. The question worth answering first is whether you would be returning to something or rebuilding something. Those are very different conversations and they require very different honesty.`,
      (u: string, p: string) => `If ${u} and ${p} came back together, it would not be the same thing. It would be the next version of it. Whether that version is better depends entirely on what each person actually did with the time apart, not on what feelings remained. Feelings alone are not evidence that a reunion would work. Genuine change on both sides is.`,
      (_u: string, _p: string) => `The pull toward each other has not dissolved. A reunion is possible, but there is a specific conversation that has not happened yet. Until it does, any return lands at the same starting point as before and creates the same patterns. Having that conversation first, even if it is uncomfortable, is what makes a reunion mean something different.`,
    ],
  },
  "toxic-or-soulmate": {
    title: "Toxic or Soulmate?",
    icon: "zap",
    locked: true,
    results: [
      (_u: string, _p: string) => `Neither fully and both partly. This connection lives where intensity and damage are hard to tell apart. What feels like a soulmate dynamic and what activates old wounds can come from the exact same source. That is the complication worth sitting with. The question is not which one it is. The question is what you are going to do with that understanding.`,
      (_u: string, _p: string) => `The answer changes depending on which version of you is asking. At your clearest, this is a soulmate dynamic. At your most defended, it activates patterns that cost you. Both readings are accurate. The goal is not to pick one label but to be honest about which version is running the show right now and whether you want that to change.`,
      (_u: string, _p: string) => `Soulmate, but not in the comfortable sense. Real connections like this do not arrive to make you comfortable. They arrive to open something up that needed opening. This one is doing that. Whether it feels beautiful or painful right now depends entirely on where you are. The depth itself is not the problem. What you do with it is.`,
    ],
  },
  "cant-let-go": {
    title: "Why You Can't Let Go",
    icon: "anchor",
    locked: false,
    results: [
      (_u: string, p: string) => `You cannot let go because ${p} showed you a version of love that felt like what you had always been looking for. It was not always there, but you saw it clearly enough to believe in it. That glimpse is the hook and it is a real one. The question is not whether the connection was real. It was. The question is whether it is enough on its own to build something on.`,
      (_u: string, _p: string) => `You cannot let go because leaving would require accepting something uncomfortable, that intensity does not automatically equal the right match. Staying is how you avoid that conclusion. At some point the question has to get answered directly. Giving yourself a clear window to get honest about this, rather than leaving it open ended, is the most useful thing you can do.`,
      (u: string, _p: string) => `${u} cannot leave because this connection reaches a part of them that most connections do not get close to. Leaving does not just mean losing the person. It means losing access to that version of themselves. That is the real attachment. Understanding this, really understanding it, is what gives you the power to make a conscious choice rather than staying by default.`,
    ],
  },
  "red-flags": {
    title: "Emotional Red Flags",
    icon: "flag",
    locked: false,
    results: [
      (_u: string, p: string) => `${p} is emotionally inconsistent in a specific way. Fully present when things feel easy, significantly less available when things get uncertain. That is not cruelty. It is unresolved avoidance. The impact on you is the same regardless of the intention behind it. Naming this pattern directly, outside of a conflict moment, is the only thing that has a chance of changing it.`,
      (_u: string, _p: string) => `The red flag is not a single moment. It is the pattern. The cycle of closeness and withdrawal has repeated enough times to stop being an accident. It has become the architecture of how this connection works. Patterns do not change without being named. Naming it together, as a shared dynamic rather than anyone's fault, is where change actually starts.`,
      (_u: string, _p: string) => `The main signal is that something in this connection makes you regularly question your own read on reality. When you consistently have to recalibrate what is true, that recalibration is the data. Trust the pattern you observe over time, not the individual explanation given in the moment. Your gut has been tracking something real.`,
    ],
  },
  "green-flags": {
    title: "Emotional Green Flags",
    icon: "check-circle",
    locked: false,
    results: [
      (u: string, p: string) => `${p} remembers the small things about ${u}, specific things that were not worth mentioning twice. That is real attention, not performance. It is one of the rarest things in any connection and one of the most meaningful signals of genuine investment. That kind of attention does not just happen. It means you matter in a way that is worth acknowledging directly.`,
      (_u: string, _p: string) => `The biggest green flag here is that somewhere in this connection, you became able to say something you normally keep hidden. Safety to be fully yourself without editing or performance is genuinely rare. If this connection gave you that, even briefly, that matters more than almost anything else. It tells you something real about what is possible here.`,
      (u: string, p: string) => `${u} and ${p} both move toward difficulty rather than away from it when they are at their best. That direction, toward the uncomfortable thing instead of around it, is the actual foundation of intimacy. It is less common than people think and it is the one thing that actually makes a relationship grow rather than just continue.`,
    ],
  },
  "pulling-back": {
    title: "What Keeps Pulling You Back",
    icon: "repeat",
    locked: false,
    results: [
      (_u: string, _p: string) => `You return because of the feeling of being actually seen, not just liked or desired, but seen. That does not happen with most people. When it does, it creates a pull that outlasts the logic for staying away. The question is not whether the pull is real. It is. The question is what it is pointing toward and whether you are willing to have the conversation that actually answers that.`,
      (_u: string, p: string) => `${p} shows up, in specific moments, as exactly the person you have been looking for. Those moments are real. They are also rare enough to make every absence feel like a temporary interruption rather than a pattern. That framing is worth questioning. Is this an interrupted story or a repeating cycle? The answer changes what the right move is.`,
      (_u: string, _p: string) => `The pull is specific to this pairing, the exact combination of this person and this version of you. You may have looked for it elsewhere and found something close but not quite the same. That specificity is real. The question is whether specificity alone is enough to build something on, and that question only gets answered by having a direct conversation about what you both actually want.`,
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

  const emotionalScore = score(rng, 62, 96);
  const commScore      = score(rng, 58, 94);
  const attachScore    = score(rng, 57, 93);
  const tensionScore   = score(rng, 54, 90);
  const ltScore        = score(rng, 60, 95);
  const addictiveScore = score(rng, 65, 97);
  const patternScore   = score(rng, 58, 94);

  const overall = Math.round(
    (emotionalScore + commScore + attachScore + ltScore + addictiveScore) / 5
  );

  // Section labels MUST match the kootaMap keys in compatibility.tsx exactly
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
    "When someone pulls away, it is rarely about you. It is almost always about how much they can handle emotionally at that moment. Pulling back is usually a way to calm down, not a rejection. The real question is whether this space is temporary or becoming a pattern.",
    "They pulled away because getting close triggered something in them, maybe an old fear or a feeling of too much too fast. This is not about you being wrong or too intense. It is about them reaching their emotional limit. Most people who pull away have not fully processed what they feel yet.",
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
