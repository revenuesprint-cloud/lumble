import { db, problemsTable } from "../index.js";

export interface SeedSolution {
  title: string;
  description: string;
  type: "practical" | "communication" | "spiritual" | "ritual" | "professional";
  isPremium: boolean;
}

export interface SeedProblem {
  title: string;
  description: string;
  category: string;
  severity: "mild" | "moderate" | "severe";
  tags: string[];
  solutions: SeedSolution[];
  sortOrder: number;
}

// ─── Universal Problems (200) ─────────────────────────────────────────────────

const universal: SeedProblem[] = [
  {
    title: "Emotional withdrawal without explanation",
    description: "One partner suddenly goes cold and distant without saying why. The other is left analyzing every recent interaction, wondering what they did wrong.",
    category: "Communication", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Agree on a signal phrase", description: "Before it happens again, agree on a phrase like 'I need quiet time' that means 'I'm retreating but not angry at you.'", type: "communication", isPremium: false },
      { title: "Set a reconnect window", description: "When one partner withdraws, agree on a specific time. 24 hours. to check in and talk.", type: "practical", isPremium: false },
      { title: "Grounding breath ritual", description: "When you feel the urge to withdraw, take 9 deep breaths before deciding to go silent. This interrupts the reactive pattern.", type: "spiritual", isPremium: false },
    ],
    sortOrder: 1,
  },
  {
    title: "The relationship feels stuck in a loop",
    description: "The same arguments keep cycling back. You resolve something, then weeks later the same wound reopens. Neither of you knows how to fully close the loop.",
    category: "Patterns", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Name the loop explicitly", description: "Together, write down the recurring argument cycle. Naming it as a shared pattern (not each other's fault) is the first step to breaking it.", type: "communication", isPremium: false },
      { title: "Change one variable", description: "When the argument starts, change your physical location. go outside, sit on the floor. A new environment breaks the neurological pattern.", type: "practical", isPremium: false },
      { title: "Planetary cycle remediation", description: "Light a ghee lamp on Saturday evenings while reciting 'Om Shanaishcharaya Namah' 19 times to break karmic repetition loops.", type: "ritual", isPremium: true },
    ],
    sortOrder: 2,
  },
  {
    title: "Love felt effortless early on, now it takes work",
    description: "In the beginning everything flowed naturally. Now even small connection requires effort, and you both wonder if you've lost something permanent.",
    category: "Attachment", severity: "mild", tags: ["universal"],
    solutions: [
      { title: "Recreate an early ritual", description: "Think of something you did in the first 3 months that you've stopped doing. specific walk, a meal, a playlist. Bring it back.", type: "practical", isPremium: false },
      { title: "Curiosity over comfort", description: "Once a week, ask your partner a question you genuinely don't know the answer to. Familiarity breeds assumption; curiosity breeds connection.", type: "communication", isPremium: false },
      { title: "Venus strengthening practice", description: "On Fridays, wear white or pink and offer white flowers to water. invites Shukra's energy to refresh the romantic bond.", type: "ritual", isPremium: true },
    ],
    sortOrder: 3,
  },
  {
    title: "One person does most of the emotional labor",
    description: "One partner is consistently the one who initiates conversations, checks in, and processes feelings while the other remains passive. Resentment quietly builds.",
    category: "Balance", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Rotate the check-in role", description: "Alternate who initiates the weekly emotional check-in. The rotation makes it explicit that both partners are responsible.", type: "practical", isPremium: false },
      { title: "Name the imbalance calmly", description: "Say 'I notice I'm doing most of the emotional reaching out. Can we talk about that?' Use 'I notice' not 'you never.'", type: "communication", isPremium: false },
      { title: "Couples counseling", description: "A therapist creates a neutral space where the less expressive partner can develop emotional vocabulary without feeling attacked.", type: "professional", isPremium: true },
    ],
    sortOrder: 4,
  },
  {
    title: "Fear of being truly known and rejected",
    description: "You hold back your real thoughts, past, or insecurities because part of you believes if they truly knew you, they would leave. This keeps you from real intimacy.",
    category: "Vulnerability", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Share one small truth per week", description: "Vulnerability builds in layers. Share one slightly uncomfortable truth per week. something small but real. Watch how they respond.", type: "communication", isPremium: false },
      { title: "Journal the feared revelation", description: "Write down what you're most afraid to tell them. Often the act of writing reveals the fear is bigger than the actual secret.", type: "practical", isPremium: false },
      { title: "Gayatri mantra for self-acceptance", description: "Recite the Gayatri mantra 108 times at dawn for 21 days to dissolve the belief that your true self is unworthy of love.", type: "ritual", isPremium: true },
    ],
    sortOrder: 5,
  },
  {
    title: "Unspoken expectations leading to constant disappointment",
    description: "You expect your partner to know what you need without you saying it. When they miss the mark, you feel unloved. They feel like they can never win.",
    category: "Communication", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Make requests, not assumptions", description: "Replace 'they should know by now' with an explicit request. 'I'd love it if you called me after big meetings' is more effective than expecting them to guess.", type: "communication", isPremium: false },
      { title: "Weekly needs audit", description: "Each Sunday, each of you shares one thing you need more of and one thing you need less of. Keep it to one each to avoid overwhelm.", type: "practical", isPremium: false },
    ],
    sortOrder: 6,
  },
  {
    title: "Phone and screen time eroding presence",
    description: "One or both partners are frequently on their phone while together. The person present feels invisible. Digital distraction has become the third party in the relationship.",
    category: "Presence", severity: "mild", tags: ["universal"],
    solutions: [
      { title: "Phone-free meals", description: "Establish one meal per day with zero phones. silenced, actually in another room. Even 20 minutes of undivided attention rebuilds connection.", type: "practical", isPremium: false },
      { title: "Name what you're avoiding", description: "Constant phone use is often an avoidance mechanism. Ask yourself honestly: what am I escaping when I pick up my phone around them?", type: "communication", isPremium: false },
    ],
    sortOrder: 7,
  },
  {
    title: "Feeling taken for granted",
    description: "Your efforts go unacknowledged. You cook, plan, listen, show up. it passes without comment. Over time the invisibility turns into resentment.",
    category: "Appreciation", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Verbalize what you notice", description: "Both partners should practice saying out loud the things they silently appreciate: 'I noticed you made my coffee the way I like it today.'", type: "communication", isPremium: false },
      { title: "Gratitude exchange ritual", description: "Each evening, name one specific thing your partner did that day that you're grateful for. Specificity matters. 'you're great' but 'you picked up my medicine without being asked.'", type: "practical", isPremium: false },
    ],
    sortOrder: 8,
  },
  {
    title: "Jealousy triggered by social media",
    description: "Likes, follows, and DMs from strangers create suspicion and arguments. What starts as a harmless scroll becomes an audit of who your partner is interacting with.",
    category: "Trust", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Articulate the underlying fear", description: "Jealousy is a symptom. The real issue is usually 'I'm afraid I'm not enough' or 'I fear being replaced.' Name that fear directly in a calm moment.", type: "communication", isPremium: false },
      { title: "Mutual social media agreements", description: "Not restrictions. agreements. Discuss together what feels comfortable around online friendships with exes, flirty interactions, etc.", type: "practical", isPremium: false },
    ],
    sortOrder: 9,
  },
  {
    title: "Arguments that start small and escalate fast",
    description: "A disagreement about something trivial. dishes, a forgotten task. explodes into a fight about deeper relationship issues. Proportionality is lost.",
    category: "Conflict", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Stop and label the escalation", description: "When the argument starts escalating, say: 'This is escalating. Can we slow down?' Just naming it out loud interrupts the adrenaline cycle.", type: "communication", isPremium: false },
      { title: "20-minute pause rule", description: "Agree in advance that when voices rise, either person can call a 20-minute pause. The pause is not abandonment. it's regulation.", type: "practical", isPremium: false },
      { title: "Anger pacification mantra", description: "When you feel rage rising, silently repeat 'Om Shantih Shantih Shantih' three times before responding. This activates the parasympathetic nervous system.", type: "spiritual", isPremium: false },
    ],
    sortOrder: 10,
  },
  {
    title: "Physical intimacy feels routine and disconnected",
    description: "The physical side of the relationship still exists but has become mechanical. There's touch without presence, closeness without real connection.",
    category: "Intimacy", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Non-sexual touch first", description: "Spend 10 minutes just holding each other without any expectation of it leading anywhere. Presence without agenda rebuilds intimacy.", type: "practical", isPremium: false },
      { title: "Verbalize desire", description: "Tell your partner what you want, slowly and specifically. Many couples have never spoken their desires aloud. act itself is intimate.", type: "communication", isPremium: false },
      { title: "Venus and Moon ritual", description: "On Monday nights (Chandra's day), light rose-scented incense together and spend 10 minutes in eye contact. This reactivates lunar bonding energy.", type: "ritual", isPremium: true },
    ],
    sortOrder: 11,
  },
  {
    title: "Different definitions of quality time",
    description: "One partner feels connected through activities (going out, adventures) while the other needs quiet togetherness (staying home, slow mornings). Neither way is right, but the gap creates loneliness.",
    category: "Compatibility", severity: "mild", tags: ["universal"],
    solutions: [
      { title: "Alternate QT preferences weekly", description: "One week is your partner's type of quality time; the next is yours. Making it explicit removes the guessing game.", type: "practical", isPremium: false },
      { title: "Describe 'ideal Saturday'", description: "Both partners write down their ideal Saturday with no obligations. Compare. This conversation reveals more about QT needs than any fight ever will.", type: "communication", isPremium: false },
    ],
    sortOrder: 12,
  },
  {
    title: "Not knowing whether to stay or leave",
    description: "You feel both trapped and afraid to lose them. Neither fully committed nor fully gone, you exist in a painful limbo that drains energy from both of you.",
    category: "Commitment", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "The 5-year question", description: "Ask yourself: 'If nothing changes in 5 years, am I okay with this life?' Your answer should inform your decision more than how you feel today.", type: "practical", isPremium: false },
      { title: "Therapy for clarity", description: "Ambivalence often signals unprocessed personal patterns, not just relationship problems. A therapist helps you distinguish the two.", type: "professional", isPremium: true },
    ],
    sortOrder: 13,
  },
  {
    title: "Difficulty apologizing genuinely",
    description: "Apologies happen but they're loaded with buts, deflections, or counter-accusations. 'I'm sorry you feel that way' instead of 'I'm sorry I hurt you.' The wound stays open.",
    category: "Conflict", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "The three-part apology", description: "A real apology has three parts: (1) what you did, (2) why it hurt them, (3) what you'll do differently. Practice this structure.", type: "communication", isPremium: false },
      { title: "Ego dissolution practice", description: "The inability to apologize is rooted in ego protection. Daily Surya Namaskar (sun salutation) practice builds the humility that makes genuine apology possible.", type: "spiritual", isPremium: false },
    ],
    sortOrder: 14,
  },
  {
    title: "Growing in different directions",
    description: "You've both changed, but not in sync. Interests, values, and life visions that once aligned now point in different directions. You wonder if you still know each other.",
    category: "Compatibility", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Share your current vision", description: "Separately write where you want to be in 3 years: professionally, personally, geographically. Share without judgment. Gaps are not death sentences.", type: "communication", isPremium: false },
      { title: "Find the overlapping thread", description: "Even in divergence, there are usually shared values. Find the one thing you still both deeply care about and let that be the anchor.", type: "practical", isPremium: false },
    ],
    sortOrder: 15,
  },
  {
    title: "One partner avoids serious conversations",
    description: "Any time you try to have a real conversation about the relationship, feelings, or future, one partner deflects with humor, changes the topic, or leaves the room.",
    category: "Communication", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Schedule the conversation", description: "Rather than ambushing them with big talks, schedule them: 'Can we have a 20-minute talk Sunday evening?' This removes the element of surprise that triggers avoidance.", type: "practical", isPremium: false },
      { title: "Ask about avoidance gently", description: "Say: 'I notice when I bring up feelings you change the subject. I'm curious what happens for you in those moments.' Curiosity disarms defense.", type: "communication", isPremium: false },
    ],
    sortOrder: 16,
  },
  {
    title: "Interference from family members",
    description: "In-laws, parents, or relatives actively influence the relationship. offering unsolicited advice, taking sides, or making decisions that affect the couple without consent.",
    category: "Boundaries", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Unified front rule", description: "Agree that when family members criticize one partner, the other defends them. privately disagreeing. A united front with family is non-negotiable.", type: "practical", isPremium: false },
      { title: "Define family boundaries together", description: "Create explicit agreements about what family members have access to: which decisions they're consulted on, which conversations are private.", type: "communication", isPremium: false },
    ],
    sortOrder: 17,
  },
  {
    title: "Comparing the relationship to others",
    description: "Social media, friends, and family relationships become measuring sticks. 'Why don't we do what they do?' comparisons create pressure and undermine your unique dynamic.",
    category: "Expectations", severity: "mild", tags: ["universal"],
    solutions: [
      { title: "Define your relationship on your terms", description: "Write a list together of 5 things that make your relationship yours. better or worse, just distinctly yours. Return to this list when comparison creeps in.", type: "practical", isPremium: false },
    ],
    sortOrder: 18,
  },
  {
    title: "Loneliness even when together",
    description: "You share a space but feel profoundly alone in it. Your partner is physically present but emotionally unreachable, and the gap is sometimes harder to bear than actual solitude.",
    category: "Emotional Distance", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Name it out loud", description: "Saying 'I sometimes feel lonely even when we're together' is terrifying but almost always opens a door. The unspoken loneliness is the problem.", type: "communication", isPremium: false },
      { title: "Daily 10-minute connection ritual", description: "No phones, no TV. Just 10 minutes of actual conversation or eye contact after work. Mundane but powerful.", type: "practical", isPremium: false },
    ],
    sortOrder: 19,
  },
  {
    title: "Trust damaged but not fully broken",
    description: "Something happened. lie, a flirtation, a broken promise. cracked trust without ending the relationship. You want to move on but the wound keeps reopening.",
    category: "Trust", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Transparency as the new baseline", description: "The person who broke trust should, for a defined period, offer information proactively, not because they're under surveillance but because it rebuilds credibility.", type: "practical", isPremium: false },
      { title: "Couples therapy for betrayal processing", description: "Betrayal trauma has specific patterns. A therapist trained in EFT or Gottman Method can guide this more effectively than conversation alone.", type: "professional", isPremium: true },
    ],
    sortOrder: 20,
  },
  {
    title: "One partner feels like a parent in the relationship",
    description: "One person handles responsibilities, makes decisions, and manages the logistics of life while the other remains passive. The dynamic kills romantic energy.",
    category: "Balance", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Transfer one full responsibility", description: "Identify one area the responsible partner handles entirely. Fully hand it over. with supervision. The goal is adult-to-adult equality.", type: "practical", isPremium: false },
    ],
    sortOrder: 21,
  },
  {
    title: "Difficulty expressing needs without feeling needy",
    description: "You silence your needs because asking for things feels like being 'too much.' Then resentment builds from unmet needs. The silence feels safer than the asking, but it isn't.",
    category: "Vulnerability", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Reframe needs as information", description: "Needs are not demands. they're information your partner needs to love you well. Practice saying 'I need X' as a neutral statement, not a complaint.", type: "communication", isPremium: false },
      { title: "Self-worth affirmation ritual", description: "Write 'My needs are valid' on a paper and keep it visible for 21 days. Simple but addresses the root belief.", type: "spiritual", isPremium: false },
    ],
    sortOrder: 22,
  },
  {
    title: "Sex and romance decreasing over time",
    description: "The frequency and quality of physical intimacy has dropped significantly. Both partners notice it but neither knows how to bring it up without the other person feeling criticized.",
    category: "Intimacy", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Desire conversation outside the bedroom", description: "Have the 'our intimacy has changed' conversation during a walk or drive. in the bedroom. Neutral setting removes performance anxiety.", type: "communication", isPremium: false },
      { title: "Remove outcome pressure", description: "Plan intimacy-adjacent time (massage, bathing together) with no expectation that it leads to sex. Removing pressure often restores natural desire.", type: "practical", isPremium: false },
    ],
    sortOrder: 23,
  },
  {
    title: "Financial stress spilling into the relationship",
    description: "Money anxiety creates arguments, resentment, and power imbalances. Financial stress is one of the leading causes of relationship breakdown and it's rarely about the money itself.",
    category: "External Stress", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Separate the stress from the person", description: "When money stress rises, explicitly say 'I'm stressed about money, not about you.' This prevents the displaced anger that poisons relationships.", type: "communication", isPremium: false },
      { title: "Monthly money date", description: "A monthly 30-minute structured conversation about finances. budget, goals, concerns. removes the chaos from financial discussions.", type: "practical", isPremium: false },
    ],
    sortOrder: 24,
  },
  {
    title: "Using the relationship to avoid self-work",
    description: "One or both partners use the relationship as a refuge from personal growth. Relying on each other for emotional regulation that should come from within creates codependency.",
    category: "Codependency", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Identify your solo practices", description: "Each partner lists one personal practice. exercise, journaling, meditation. is theirs alone and non-negotiable. Individuation within relationship.", type: "practical", isPremium: false },
      { title: "Individual therapy", description: "Separate therapy alongside couple work addresses the personal patterns each person brings to the dynamic.", type: "professional", isPremium: true },
    ],
    sortOrder: 25,
  },
  {
    title: "Inability to forgive past mistakes",
    description: "Old wounds are weaponized in new arguments. Past mistakes are held onto not because they haven't been addressed, but because releasing them feels like losing leverage.",
    category: "Forgiveness", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Distinguish forgiveness from trust", description: "Forgiveness is releasing your own resentment. it's for you, not them. Trust is rebuilt over time through action. They are separate processes.", type: "communication", isPremium: false },
      { title: "Write and release ritual", description: "Write everything you haven't forgiven on paper, then burn it ceremonially. Announce to your partner that you're choosing to release it. Symbolic but powerful.", type: "ritual", isPremium: false },
    ],
    sortOrder: 26,
  },
  {
    title: "Constant criticism disguised as jokes",
    description: "Teasing crosses a line when it consistently targets the same insecurities. 'I'm just joking' becomes cover for genuine contempt, which is the single biggest predictor of relationship breakdown.",
    category: "Respect", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Identify the one thing that isn't funny", description: "Everyone has an insecurity that's off-limits as a joke. Name it directly: 'When you joke about X, even playfully, I feel humiliated.' Make it explicit.", type: "communication", isPremium: false },
      { title: "Contempt audit", description: "Gottman research: for every critical comment, you need 5 positive ones to maintain the relationship's health. Track your ratio for a week.", type: "practical", isPremium: false },
    ],
    sortOrder: 27,
  },
  {
    title: "Carrying the weight of past relationship trauma",
    description: "What happened in previous relationships. betrayal, abandonment, abuse. is bleeding into this one. You're punishing your current partner for what a past person did.",
    category: "Healing", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Name your triggers explicitly", description: "Tell your partner: 'When you do X, it triggers something from my past. It's not about you, but it affects me.' This prevents them from walking invisible minefields.", type: "communication", isPremium: false },
      { title: "Trauma-informed therapy", description: "Past relationship trauma requires specific processing. EMDR, somatic therapy, or trauma-focused CBT. General talk therapy may not be enough.", type: "professional", isPremium: true },
    ],
    sortOrder: 28,
  },
  {
    title: "The relationship feels like work, not joy",
    description: "Maintaining the relationship requires constant effort, compromise, and management. The joy and ease that were once natural have been replaced by obligation and effort.",
    category: "Sustainability", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Identify the last time it felt easy", description: "Think back to a moment in the recent past when it felt effortless. What was different? What was present then that's missing now?", type: "communication", isPremium: false },
      { title: "Protect non-serious time", description: "Schedule time together with a rule: no relationship talk allowed. Just play, humor, and lightness. Not everything needs to be processed.", type: "practical", isPremium: false },
    ],
    sortOrder: 29,
  },
  {
    title: "Feeling more like roommates than partners",
    description: "Life logistics. household, finances, schedules. have taken over completely. You coexist efficiently but the romantic, emotional dimension of the relationship has quietly disappeared.",
    category: "Connection", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Weekly date with no life-talk rule", description: "One night a week, go out or stay in but agree no discussing logistics, kids, money, or schedules. Talk like you did when you were getting to know each other.", type: "practical", isPremium: false },
      { title: "Touch throughout the day", description: "Intentional non-sexual touch during daily life. hand on the shoulder passing by, a forehead kiss. rebuilds the physical language that roommates don't have.", type: "practical", isPremium: false },
    ],
    sortOrder: 30,
  },
  // 31-200 universal problems (covering the full relational spectrum)
  {
    title: "Dismissal of each other's emotional needs",
    description: "When one partner expresses distress, the other minimizes it: 'You're overreacting,' 'It's not a big deal.' This chronic dismissal makes the emotional partner feel invisible and crazy.",
    category: "Emotional Validation", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Reflect before fixing", description: "When your partner shares distress, resist the urge to fix or minimize. First reflect back: 'That sounds really frustrating.' Validation before solution.", type: "communication", isPremium: false },
      { title: "Ask 'what do you need right now?'", description: "Often people just need to be heard, not fixed. Asking this question removes the guesswork and puts agency back with the person in distress.", type: "communication", isPremium: false },
    ],
    sortOrder: 31,
  },
  {
    title: "Passive aggression instead of direct communication",
    description: "Frustration gets expressed through cold shoulders, pointed silences, sarcastic remarks, and 'forgetting' things rather than through direct conversation. Both partners know what's happening but neither names it.",
    category: "Communication", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Name the feeling behind the behavior", description: "When you catch yourself being passive-aggressive, ask: what am I actually feeling? Anger? Hurt? Resentment? Name that thing directly instead.", type: "communication", isPremium: false },
    ],
    sortOrder: 32,
  },
  {
    title: "Struggling to maintain individual identity",
    description: "You've merged so completely that you've lost the sense of who you are outside the relationship. Friends notice you only ever speak in 'we'. your separate dreams and interests have quietly vanished.",
    category: "Identity", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "One solo activity per week minimum", description: "Each partner maintains at least one regular activity that's purely their own. class, a friendship, a hobby. the other doesn't participate in.", type: "practical", isPremium: false },
      { title: "Revisit pre-relationship passions", description: "What did you love before this relationship? Music, painting, a sport? Reconnecting to pre-relationship identity strengthens the relationship paradoxically.", type: "practical", isPremium: false },
    ],
    sortOrder: 33,
  },
  {
    title: "Anxiety about the future of the relationship",
    description: "Constant low-level worry: Are we okay? Do they still love me? Are we going to make it? This anxiety exhausts you and gets projected onto your partner as clingy or controlling behavior.",
    category: "Anxiety", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Distinguish past evidence from present reality", description: "List three recent things your partner did that showed they're still invested. Anxiety thrives on worst-case scenarios; evidence dismantles them.", type: "practical", isPremium: false },
      { title: "Share the anxiety, not the behavior it produces", description: "Tell your partner you're feeling anxious about the relationship instead of acting out the anxiety through questioning and checking.", type: "communication", isPremium: false },
    ],
    sortOrder: 34,
  },
  {
    title: "Stonewalling during conflict",
    description: "One partner shuts completely down during disagreements. no response, no eye contact, physical removal. For the other partner this feels like abandonment and escalates the panic.",
    category: "Conflict", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Physiological self-soothing first", description: "Stonewalling happens when the nervous system is flooded. Agree that either partner can call a 30-minute break to walk, breathe, and regulate before continuing.", type: "practical", isPremium: false },
      { title: "Signal that you're overwhelmed, not done", description: "Say 'I'm overwhelmed right now and need to pause. I'm not abandoning this conversation' rather than just shutting down silently.", type: "communication", isPremium: false },
    ],
    sortOrder: 35,
  },
  {
    title: "Attraction to other people creating guilt",
    description: "You find someone outside the relationship attractive and the guilt about it. rather than the attraction itself. becomes a problem. Unspoken, it creates distance.",
    category: "Honesty", severity: "mild", tags: ["universal"],
    solutions: [
      { title: "Understand that attraction is not betrayal", description: "Noticing attractiveness is a biological response, not a moral failing. The choice is what you do with it. Normalizing this internally reduces the shame spiral.", type: "practical", isPremium: false },
    ],
    sortOrder: 36,
  },
  {
    title: "One partner sacrificing too much",
    description: "Career opportunities declined, friendships abandoned, personal dreams shelved. all for the relationship. The sacrificing partner has silently accumulated a debt that will eventually be collected.",
    category: "Balance", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Audit the sacrifice", description: "List the things you've given up. Which are genuine choices you'd make again? Which are resentments in disguise? The distinction matters.", type: "practical", isPremium: false },
      { title: "Reclaim one surrendered thing", description: "Choose one thing you gave up that you still want. Tell your partner you want to reclaim it. A partner who loves you should welcome this.", type: "communication", isPremium: false },
    ],
    sortOrder: 37,
  },
  {
    title: "Boredom mistaken for incompatibility",
    description: "The relationship feels flat and predictable. You wonder if you've outgrown it or simply need novelty. The boredom is real but the conclusion. you should leave. may not be accurate.",
    category: "Vitality", severity: "mild", tags: ["universal"],
    solutions: [
      { title: "Inject controlled novelty", description: "Do one thing together monthly that neither of you has done before. Novel experiences stimulate the same neurological pathways as early-stage romance.", type: "practical", isPremium: false },
    ],
    sortOrder: 38,
  },
  {
    title: "Difficulty handling partner's stress",
    description: "When your partner is stressed, anxious, or angry about life, their emotional state destabilizes you. You either absorb it completely or shut down to protect yourself. Neither helps.",
    category: "Emotional Regulation", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Distinguish their stress from your responsibility", description: "You can be compassionate toward your partner's stress without taking ownership of it. 'I see you're stressed. What would be helpful?' not 'What can I do to fix this?'", type: "communication", isPremium: false },
    ],
    sortOrder: 39,
  },
  {
    title: "Feeling invisible in the relationship",
    description: "Your opinions, preferences, and feelings consistently get overridden. Your needs are secondary. Over time this erodes self-esteem and breeds a quiet, persistent rage.",
    category: "Respect", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Identify one standing preference", description: "Choose one recurring situation where your preference is always ignored. Make it the hill you stand on. kindly but firmly. Practice advocating for yourself there.", type: "communication", isPremium: false },
      { title: "Relationship equality audit", description: "For one week, track how often your vs. their preferences win on small decisions. If the imbalance is clear, bring data to the conversation.", type: "practical", isPremium: false },
    ],
    sortOrder: 40,
  },
  {
    title: "Mismatched energy and life pace",
    description: "One partner is high-energy, socially active, and ambitious while the other is slower, more introverted, and values stillness. The pacing difference creates constant friction.",
    category: "Compatibility", severity: "mild", tags: ["universal"],
    solutions: [
      { title: "Celebrate the difference", description: "The slower partner grounds the energetic one; the energetic one pulls the slower one forward. Framed as a feature, not a bug, this difference becomes complementary.", type: "communication", isPremium: false },
    ],
    sortOrder: 41,
  },
  {
    title: "Avoiding conflict to preserve peace",
    description: "One or both partners avoid any disagreement to maintain surface-level harmony. Problems accumulate unaddressed until they erupt. larger and more destructive than if handled early.",
    category: "Conflict Avoidance", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Reframe conflict as connection", description: "Conflict handled well is a tool for getting to know each other more deeply. The goal is not to avoid conflict but to do it safely.", type: "communication", isPremium: false },
      { title: "Practice on small things", description: "Disagree on small, low-stakes things first: where to eat, what to watch. This builds the conflict-tolerance muscle for bigger issues.", type: "practical", isPremium: false },
    ],
    sortOrder: 42,
  },
  {
    title: "Loss of friendship as the foundation",
    description: "Early in the relationship you were also best friends. Now the friendship has been swallowed by the logistics of being a couple. Partners who lose their friendship lose the relationship's most durable core.",
    category: "Connection", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Talk like friends, not partners", description: "Set aside one conversation a week that has nothing to do with the relationship. sharing things about your lives, interests, and thoughts as you would with a close friend.", type: "practical", isPremium: false },
    ],
    sortOrder: 43,
  },
  {
    title: "Unhealed childhood wounds shaping adult love",
    description: "Patterns from early family dynamics. anxious attachment, fear of abandonment, emotional unavailability. are replaying in this relationship without either partner fully understanding why.",
    category: "Healing", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Identify your family-of-origin pattern", description: "Ask: 'What did love look like in my childhood home? What was the model for romantic relationships I grew up watching?' The answers explain a lot.", type: "practical", isPremium: false },
      { title: "Attachment style therapy", description: "A therapist specializing in attachment theory can map how your early experiences are creating your current relationship patterns.", type: "professional", isPremium: true },
    ],
    sortOrder: 44,
  },
  {
    title: "Competing for authority and control",
    description: "Every decision becomes a power struggle, not because either partner is malicious but because both need to feel like they matter. The relationship becomes a negotiation table rather than a partnership.",
    category: "Power", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Divide domains of authority", description: "Rather than negotiating every decision together, divide domains: one person is the final word on finances, the other on social plans, for example. Reduces friction.", type: "practical", isPremium: false },
    ],
    sortOrder: 45,
  },
  {
    title: "Not feeling safe to show anger",
    description: "One partner's anger is explosive or unpredictable, so the other has learned to suppress theirs entirely. Suppressed anger doesn't disappear. becomes depression, distance, or resentment.",
    category: "Safety", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Establish anger safety rules together", description: "Agree: no yelling, no name-calling, no bringing up the past, no threatening to leave. Both partners agree to these rules as a foundation for safety.", type: "communication", isPremium: false },
      { title: "Individual anger management work", description: "The partner with explosive anger should address this in individual therapy or anger management work, not because they're bad, but because love requires safety.", type: "professional", isPremium: true },
    ],
    sortOrder: 46,
  },
  {
    title: "Inability to be vulnerable first",
    description: "Both partners are waiting for the other to be vulnerable first. Neither wants to risk going first. This standoff keeps emotional depth perpetually out of reach.",
    category: "Vulnerability", severity: "moderate", tags: ["universal"],
    solutions: [
      { title: "Go first, once", description: "Someone has to go first. Share something genuinely uncomfortable. devastating, but real. The act of going first almost always invites reciprocity.", type: "communication", isPremium: false },
    ],
    sortOrder: 47,
  },
  {
    title: "Major life decisions becoming relationship crises",
    description: "Career changes, moving cities, having children. major life decisions trigger disproportionate relationship crises because they expose unspoken expectations and divergent visions.",
    category: "Life Direction", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Values mapping before the decision", description: "Before any major decision, both partners write their top 5 values and their non-negotiables. Having this on paper means the decision-making conversation is informed, not reactive.", type: "practical", isPremium: false },
    ],
    sortOrder: 48,
  },
  {
    title: "Feeling responsible for partner's happiness",
    description: "You feel that your partner's mood, contentment, and wellbeing are your responsibility. When they're unhappy, it's a failure on your part. This belief is exhausting and ultimately impossible to fulfill.",
    category: "Codependency", severity: "severe", tags: ["universal"],
    solutions: [
      { title: "Distinguish supportive from responsible", description: "You can support your partner's happiness without being responsible for it. 'I'm here to support you' is sustainable. 'I must make you happy' is not.", type: "communication", isPremium: false },
    ],
    sortOrder: 49,
  },
  {
    title: "Love languages that don't overlap",
    description: "You show love through acts of service; they receive love through words of affirmation. Neither feels properly loved despite both trying because they're speaking different emotional dialects.",
    category: "Compatibility", severity: "mild", tags: ["universal"],
    solutions: [
      { title: "Learn each other's primary language", description: "Ask directly: 'What makes you feel most loved?' and 'What do I do that makes you feel least loved?' This is data you can act on immediately.", type: "communication", isPremium: false },
      { title: "Practice your partner's language", description: "Once a week, express love in their language specifically. if it doesn't come naturally to you. The effort itself is felt.", type: "practical", isPremium: false },
    ],
    sortOrder: 50,
  },
  // 51-200. extended universal bank
  ...Array.from({ length: 150 }, (_, i): SeedProblem => {
    const titles = [
      "Withholding affection as punishment", "Unrealistic expectations of constant happiness", "Struggling with partner's mental health",
      "Hiding parts of your life from your partner", "Relationship anxiety triggering hypervigilance", "Inability to accept criticism",
      "Over-relying on a partner for entertainment", "Chronic lateness causing resentment", "Different sleep schedules eroding connection",
      "Difficulty making decisions together", "One partner monopolising social plans", "Fear of conflict creating false agreement",
      "Intimacy avoidance after vulnerability backfired", "Needing constant reassurance", "Competing with partner's friendships",
      "Weaponising past apologies", "Dismissing partner's achievements", "Comparing partner to an idealised version",
      "Difficulty with partner's family culture", "Social anxiety affecting couple activities", "One partner's ambition overshadowing the relationship",
      "Using children or pets to avoid couple issues", "Difficulty forgiving small daily frustrations", "Expecting partner to read body language",
      "Overexplaining instead of simply apologising", "Pursuing 'fairness' over connection", "Relationship drift during life transitions",
      "Difficulty celebrating partner's success", "Controlling what partner eats or wears", "Spending habits creating unspoken judgment",
      "Perfectionism preventing partnership", "Inability to enjoy the present relationship", "Partner feeling unsupported in grief",
      "Withholding intimacy during disagreements", "Chronic complaining without action", "Competitive suffering in arguments",
      "Minimising partner's physical pain", "Unsolicited advice creating distance", "Not celebrating relationship milestones",
      "Different religious or spiritual beliefs", "Managing different family expectations of the relationship", "One partner's addiction affecting closeness",
      "Criticism of parenting style causing division", "Different approaches to health and body", "Overthinking compatibility",
      "Demanding change without modelling it", "Refusing to acknowledge relationship patterns", "Keeping score of favours",
      "Long working hours leaving no couple time", "Needing to 'win' the last word in arguments",
      "Difficulty transitioning from single to couple identity", "Overextending to family at cost of relationship",
      "Feeling shame about the relationship", "Hiding relationship from social media", "Mismatched levels of introversion",
      "Different approaches to conflict in front of others", "Feeling suffocated by constant checking-in", "Physical space issues in shared living",
      "Different levels of emotional intelligence", "Partner minimising spiritual needs", "Unequal investment in relationship growth",
      "Insecurity about physical appearance affecting intimacy", "Different approaches to friendship maintenance", "Chronic tardiness in emotional processing",
      "Dismissing partner's instincts or intuitions", "Not taking partner's career stress seriously", "Expecting partner to justify friendships",
      "Refusing to seek help for relationship issues", "Imbalanced social media presence of the relationship", "Disagreeing on pet ownership",
      "Different risk tolerances creating friction", "Difficulty supporting partner through illness", "Over-reliance on friends for relationship advice",
      "Partner's past relationships creating jealousy", "Refusing to discuss future plans", "Using the relationship as social validation",
      "Chronic low-grade resentment", "One partner taking up more emotional bandwidth", "Difficulty staying present in intimacy",
      "Unspoken rivalry in achievements", "Difficulty asking for help within the relationship", "Refusing to accommodate partner's needs when stressed",
      "Making major purchases without discussion", "Dismissing partner's need for alone time", "Different values around charity and giving",
      "Holding grudges from early in the relationship", "Inability to separate work stress from home life",
      "Different parenting philosophy before having children", "Managing grief of a lost relationship identity", "Feeling trapped by the relationship's public image",
      "Expecting partner to fix loneliness", "Oversharing relationship problems with family", "Using humour to deflect from real issues",
      "Fear of repeating parents' relationship mistakes", "Difficulty ending unhealthy sub-relationships", "One partner's friendships feeling threatening",
      "Difficulty with disagreements about travel", "Chronic disappointment without voicing expectations", "Different comfort levels with physical affection in public",
      "Struggling with partner's career change", "Insecurity driving negative assumptions", "Difficulty respecting partner's need for routine",
      "Using the relationship as escape from personal problems", "Refusing to make plans for the future together", "Partner minimising emotional experiences",
      "Difficulty with partner's social anxiety", "Withholding important personal history", "Different needs for verbal vs physical affection",
      "Partner regularly choosing others over you", "Comparing your relationship to your parents'", "Lack of shared friends as isolation factor",
      "Unsatisfying resolutions after conflict", "Different definitions of loyalty", "Feeling punished for being vulnerable",
      "Difficulty maintaining energy for the relationship during illness", "Partner's unhealthy coping mechanisms affecting the relationship",
      "Dismissing partner's career ambitions", "Difficulty with partner's depression", "Feeling like the relationship is on trial",
      "One partner growing spiritually while the other doesn't", "Resenting partner for being more successful", "Different timelines for life milestones",
      "Difficulty rebuilding intimacy after a health crisis", "Unresolved resentment from early relationship fights", "Partner failing to show up for important moments",
      "Using busyness as emotional distance", "Emotional unavailability disguised as strength", "Difficulty ending the relationship despite unhappiness",
      "Different expectations around gift-giving", "Feeling unheard repeatedly across different topics", "Partner trivialising your friendships",
      "Managing jealousy of partner's past experiences", "Different definitions of emotional support", "Relationship suffering from burnout",
      "Inability to ask for more", "Difficulty trusting after personal betrayal", "Chronic feelings of longing even when together",
      "One partner's trauma response triggering the other", "Inability to plan without arguing", "Dependency disguised as love",
    ];
    const descs = [
      "This pattern gradually erodes the safety and joy within the relationship. Without naming it, both partners adapt around the problem rather than resolving it, creating long-term disconnection.",
      "Unaddressed, this becomes a layer of silent resentment that accumulates over time. Small grievances grow when they're never spoken or resolved.",
      "This dynamic is common but rarely discussed openly. The partner experiencing it often doesn't have the language to describe what's happening, making it hard to ask for what they need.",
      "The relationship requires both partners to show up fully. When one retreats into this pattern consistently, the other begins to feel they're building something alone.",
      "External stressors don't stay outside the relationship. This challenge requires deliberate boundaries between external pressure and relationship space.",
    ];
    const solutionSets: SeedSolution[][] = [
      [
        { title: "Name the pattern in a calm moment", description: "Choose a time when you're both relaxed to name what you've observed: 'I notice we have a pattern where...' Neutral framing gets further than accusation.", type: "communication", isPremium: false },
        { title: "Agree on one concrete change", description: "From the conversation, choose one specific, observable change. 'For the next two weeks, we'll both...' Progress builds trust.", type: "practical", isPremium: false },
      ],
      [
        { title: "Write about it first", description: "Before a conversation, write what you want to say. The act of writing clarifies your thoughts and reduces emotional reactivity when you speak.", type: "practical", isPremium: false },
        { title: "Couples therapy session", description: "One or two sessions with a therapist can break patterns that feel stuck. It's not an admission of failure. it's an investment.", type: "professional", isPremium: true },
      ],
      [
        { title: "Commitment over comfort", description: "Resolving this pattern requires temporary discomfort. Commit to having the difficult conversation rather than the comfortable avoidance.", type: "communication", isPremium: false },
        { title: "Shani remediation for karmic patterns", description: "Saturn rules discipline and long-standing karmic patterns. Lighting a mustard oil lamp on Saturdays while setting a relationship intention can help dissolve stubborn dynamics.", type: "ritual", isPremium: true },
      ],
    ];
    return {
      title: titles[i % titles.length],
      description: descs[i % descs.length],
      category: ["Communication", "Patterns", "Boundaries", "Emotional Needs", "Compatibility", "Healing", "Balance", "Intimacy", "Trust"][i % 9],
      severity: (["mild", "moderate", "moderate", "severe", "mild"] as const)[i % 5],
      tags: ["universal"],
      solutions: solutionSets[i % solutionSets.length],
      sortOrder: 51 + i,
    };
  }),
];

// ─── Moon Rashi Problems (96 = 12 rashis × 8) ───────────────────────────────

type RashiInfo = { name: string; element: string; lord: string; en: string };
const rashiList: RashiInfo[] = [
  { name: "Mesha",      element: "Fire",  lord: "Mangal",     en: "Aries" },
  { name: "Vrishabha",  element: "Earth", lord: "Shukra",     en: "Taurus" },
  { name: "Mithuna",    element: "Air",   lord: "Budh",       en: "Gemini" },
  { name: "Karka",      element: "Water", lord: "Chandra",    en: "Cancer" },
  { name: "Simha",      element: "Fire",  lord: "Surya",      en: "Leo" },
  { name: "Kanya",      element: "Earth", lord: "Budh",       en: "Virgo" },
  { name: "Tula",       element: "Air",   lord: "Shukra",     en: "Libra" },
  { name: "Vrishchika", element: "Water", lord: "Mangal",     en: "Scorpio" },
  { name: "Dhanu",      element: "Fire",  lord: "Brihaspati", en: "Sagittarius" },
  { name: "Makara",     element: "Earth", lord: "Shani",      en: "Capricorn" },
  { name: "Kumbha",     element: "Air",   lord: "Shani",      en: "Aquarius" },
  { name: "Meena",      element: "Water", lord: "Brihaspati", en: "Pisces" },
];

const rashiTraits: Record<string, { needs: string; fear: string; strength: string; shadow: string }> = {
  Mesha:      { needs: "autonomy and respect",   fear: "being controlled",      strength: "directness",    shadow: "impulsivity" },
  Vrishabha:  { needs: "stability and comfort",  fear: "sudden change",         strength: "loyalty",       shadow: "possessiveness" },
  Mithuna:    { needs: "variety and stimulation",fear: "boredom",               strength: "adaptability",  shadow: "inconsistency" },
  Karka:      { needs: "emotional security",     fear: "abandonment",           strength: "nurturing",     shadow: "over-sensitivity" },
  Simha:      { needs: "recognition and loyalty",fear: "being ignored",         strength: "warmth",        shadow: "ego" },
  Kanya:      { needs: "order and reliability",  fear: "chaos and failure",     strength: "dependability", shadow: "criticism" },
  Tula:       { needs: "harmony and fairness",   fear: "conflict and rejection",strength: "diplomacy",     shadow: "indecision" },
  Vrishchika: { needs: "depth and transformation",fear: "betrayal",             strength: "intensity",     shadow: "suspicion" },
  Dhanu:      { needs: "freedom and meaning",    fear: "restriction",           strength: "vision",        shadow: "restlessness" },
  Makara:     { needs: "achievement and respect",fear: "failure and dependency",strength: "discipline",    shadow: "emotional coldness" },
  Kumbha:     { needs: "intellectual freedom",   fear: "conformity",            strength: "originality",   shadow: "detachment" },
  Meena:      { needs: "transcendence and empathy",fear: "boundaries and cruelty",strength: "compassion",  shadow: "escapism" },
};

function makeRashiProblems(rashi: RashiInfo, startIndex: number): SeedProblem[] {
  const t = rashiTraits[rashi.name];
  return [
    {
      title: `${rashi.name} Moon's need for ${t.needs} creating tension`,
      description: `With the Moon in ${rashi.name}, the emotional core is driven by a deep need for ${t.needs}. In close relationships this need is rarely communicated directly, yet when unmet it produces ${t.shadow} and emotional distance. Partners who don't share this need often feel the pressure without understanding its source.`,
      category: "Emotional Needs", severity: "moderate", tags: [`moon_rashi:${rashi.name}`, "universal"],
      solutions: [
        { title: `Articulate the ${t.needs} need directly`, description: `Rather than letting unmet needs create resentment, practice saying 'I need ${t.needs} right now' as a clean, specific request.`, type: "communication", isPremium: false },
        { title: `${rashi.lord} strengthening practice`, description: `Strengthen your ruling planet ${rashi.lord} through its associated color, gemstone, or mantra to bring emotional balance.`, type: "spiritual", isPremium: true },
      ],
      sortOrder: startIndex,
    },
    {
      title: `${rashi.name} Moon's core fear of ${t.fear} showing up in the relationship`,
      description: `People with ${rashi.name} Moon carry a core fear of ${t.fear}. This fear doesn't announce itself clearly. shows up as controlling behavior, emotional withdrawal, or testing the partner's commitment in indirect ways.`,
      category: "Anxiety", severity: "moderate", tags: [`moon_rashi:${rashi.name}`, "universal"],
      solutions: [
        { title: "Name the fear to your partner", description: `Telling your partner 'My deepest fear in relationships is ${t.fear}' gives them the information they need to be truly reassuring.`, type: "communication", isPremium: false },
        { title: "Fear journal practice", description: "Write about instances where this fear arose this week. Pattern recognition reduces the fear's unconscious power.", type: "practical", isPremium: false },
      ],
      sortOrder: startIndex + 1,
    },
    {
      title: `${rashi.name} Moon's ${t.shadow} damaging closeness`,
      description: `The shadow side of ${rashi.name} Moon energy is ${t.shadow}. Under stress this tendency intensifies, and while it's a coping mechanism, it consistently damages intimacy. The partner on the receiving end often doesn't understand they're triggering a Moon-level wound.`,
      category: "Shadow Work", severity: "moderate", tags: [`moon_rashi:${rashi.name}`],
      solutions: [
        { title: "Catch the shadow early", description: `When you notice ${t.shadow} rising, name it to yourself before it escalates: 'This is my ${rashi.name} shadow speaking.' Naming it reduces its power.`, type: "communication", isPremium: false },
        { title: "Moon day fasting", description: "Fasting on Mondays (Chandra's day) for lunar balance reduces emotional reactivity driven by unregulated Moon energy.", type: "ritual", isPremium: false },
      ],
      sortOrder: startIndex + 2,
    },
    {
      title: `${rashi.en} energy creating mismatched emotional tempo`,
      description: `${rashi.name} is a ${rashi.element} sign, and emotionally you move at the pace of ${rashi.element}. Partners of different elements experience your emotional tempo as too fast, too slow, too intense, or too detached. this pacing mismatch creates chronic friction.`,
      category: "Compatibility", severity: "mild", tags: [`moon_rashi:${rashi.name}`, `element:${rashi.element}`],
      solutions: [
        { title: "Explain your natural tempo", description: `Tell your partner: 'I process emotions like a ${rashi.element} sign. here's what that looks like for me.' Normalizing the difference reduces conflict.`, type: "communication", isPremium: false },
      ],
      sortOrder: startIndex + 3,
    },
    {
      title: `Relationship strain from ${rashi.name} Moon's ${rashi.lord} rulership`,
      description: `Your Moon is ruled by ${rashi.lord}, which colors your emotional needs with that planet's energy. During challenging transits of ${rashi.lord}, emotional needs intensify in ways that can overwhelm the relationship without either partner understanding the astrological timing.`,
      category: "Astrological Timing", severity: "mild", tags: [`moon_rashi:${rashi.name}`, `lord:${rashi.lord}`],
      solutions: [
        { title: "Track emotional patterns by lunar cycle", description: "Keep a simple mood journal for one month. You may notice predictable emotional patterns aligned with the Moon's cycle.", type: "practical", isPremium: false },
        { title: `${rashi.lord} strengthening remedies`, description: `Wearing ${rashi.lord}'s associated color on its designated day and chanting its Beej mantra helps stabilize emotional patterns.`, type: "ritual", isPremium: true },
      ],
      sortOrder: startIndex + 4,
    },
    {
      title: `${rashi.name} Moon's strength. ${t.strength}. becoming a burden`,
      description: `Your greatest emotional strength, ${t.strength}, becomes a problem when applied rigidly. What works for you individually can feel overwhelming or suffocating to a partner who has different emotional wiring.`,
      category: "Strengths Becoming Weaknesses", severity: "mild", tags: [`moon_rashi:${rashi.name}`],
      solutions: [
        { title: "Ask if your strength is landing as intended", description: `Ask your partner: 'When I show up with my ${t.strength}, how does it actually feel to you?' Their answer may surprise you.`, type: "communication", isPremium: false },
      ],
      sortOrder: startIndex + 5,
    },
    {
      title: `${rashi.name} Moon's response to conflict with ${rashi.element} intensity`,
      description: `In conflict, ${rashi.name} Moon individuals tend to respond with ${rashi.element} energy. ${rashi.element === "Fire" ? "heat and urgency" : rashi.element === "Water" ? "flooding and withdrawal" : rashi.element === "Earth" ? "stubbornness and silence" : "rationalization and distance"}. This response pattern, unless understood, escalates rather than resolves disagreements.`,
      category: "Conflict", severity: "moderate", tags: [`moon_rashi:${rashi.name}`, `element:${rashi.element}`],
      solutions: [
        { title: "Cool the elemental response", description: `${rashi.element === "Fire" ? "When heated, drink cold water and sit down before responding." : rashi.element === "Water" ? "When flooding, name your emotion out loud to bring it into the rational mind." : rashi.element === "Earth" ? "When going silent, give a time-stamped promise to return: 'I'll talk in an hour.'" : "When rationalizing, try to feel where the emotion is in your body before speaking."}`, type: "practical", isPremium: false },
      ],
      sortOrder: startIndex + 6,
    },
    {
      title: `Unspoken ${rashi.name} Moon expectations in the relationship`,
      description: `${rashi.name} Moon people have deep, often unconscious expectations of partners based on their core need for ${t.needs}. These expectations are so fundamental they're rarely spoken. means partners can fail them without ever knowing the standard they were being held to.`,
      category: "Expectations", severity: "moderate", tags: [`moon_rashi:${rashi.name}`, "universal"],
      solutions: [
        { title: "Make the implicit explicit", description: "Write down your top 5 unspoken expectations of a partner. Share them. You can't negotiate what's never been named.", type: "communication", isPremium: false },
      ],
      sortOrder: startIndex + 7,
    },
  ];
}

const moonRashiProblems: SeedProblem[] = rashiList.flatMap((r, i) => makeRashiProblems(r, 300 + i * 8));

// ─── Nakshatra Problems (135 = 27 × 5) ───────────────────────────────────────

type NakInfo = { name: string; lord: string; gana: string; yoni: string; deity: string };
const nakList: NakInfo[] = [
  { name: "Ashwini",        lord: "Ketu",       gana: "Deva",     yoni: "Horse",    deity: "Ashwini Kumaras" },
  { name: "Bharani",        lord: "Shukra",     gana: "Manushya", yoni: "Elephant", deity: "Yama" },
  { name: "Krittika",       lord: "Surya",      gana: "Rakshasa", yoni: "Sheep",    deity: "Agni" },
  { name: "Rohini",         lord: "Chandra",    gana: "Manushya", yoni: "Serpent",  deity: "Brahma" },
  { name: "Mrigashira",     lord: "Mangal",     gana: "Deva",     yoni: "Serpent",  deity: "Soma" },
  { name: "Ardra",          lord: "Rahu",       gana: "Manushya", yoni: "Dog",      deity: "Rudra" },
  { name: "Punarvasu",      lord: "Brihaspati", gana: "Deva",     yoni: "Cat",      deity: "Aditi" },
  { name: "Pushya",         lord: "Shani",      gana: "Deva",     yoni: "Sheep",    deity: "Brihaspati" },
  { name: "Ashlesha",       lord: "Budh",       gana: "Rakshasa", yoni: "Cat",      deity: "Nagas" },
  { name: "Magha",          lord: "Ketu",       gana: "Rakshasa", yoni: "Rat",      deity: "Pitris" },
  { name: "Purva Phalguni", lord: "Shukra",     gana: "Manushya", yoni: "Rat",      deity: "Bhaga" },
  { name: "Uttara Phalguni",lord: "Surya",      gana: "Manushya", yoni: "Cow",      deity: "Aryaman" },
  { name: "Hasta",          lord: "Chandra",    gana: "Deva",     yoni: "Buffalo",  deity: "Savitar" },
  { name: "Chitra",         lord: "Mangal",     gana: "Rakshasa", yoni: "Tiger",    deity: "Vishwakarma" },
  { name: "Swati",          lord: "Rahu",       gana: "Deva",     yoni: "Buffalo",  deity: "Vayu" },
  { name: "Vishakha",       lord: "Brihaspati", gana: "Rakshasa", yoni: "Tiger",    deity: "Indragni" },
  { name: "Anuradha",       lord: "Shani",      gana: "Deva",     yoni: "Hare",     deity: "Mitra" },
  { name: "Jyeshtha",       lord: "Budh",       gana: "Rakshasa", yoni: "Hare",     deity: "Indra" },
  { name: "Mula",           lord: "Ketu",       gana: "Rakshasa", yoni: "Dog",      deity: "Nirriti" },
  { name: "Purva Ashadha",  lord: "Shukra",     gana: "Manushya", yoni: "Monkey",   deity: "Apas" },
  { name: "Uttara Ashadha", lord: "Surya",      gana: "Manushya", yoni: "Mongoose", deity: "Vishwedevas" },
  { name: "Shravana",       lord: "Chandra",    gana: "Deva",     yoni: "Monkey",   deity: "Vishnu" },
  { name: "Dhanishtha",     lord: "Mangal",     gana: "Rakshasa", yoni: "Lion",     deity: "Vasus" },
  { name: "Shatabhisha",    lord: "Rahu",       gana: "Rakshasa", yoni: "Horse",    deity: "Varuna" },
  { name: "Purva Bhadra",   lord: "Brihaspati", gana: "Manushya", yoni: "Lion",     deity: "Aja Ekapad" },
  { name: "Uttara Bhadra",  lord: "Shani",      gana: "Manushya", yoni: "Cow",      deity: "Ahirbudhnya" },
  { name: "Revati",         lord: "Budh",       gana: "Deva",     yoni: "Elephant", deity: "Pushan" },
];

const ganaQualities: Record<string, { tone: string; challenge: string }> = {
  Deva:     { tone: "idealistic and spiritually inclined", challenge: "may seem too otherworldly to practically-minded partners" },
  Manushya: { tone: "balanced between spiritual and material", challenge: "may struggle with partners at either extreme" },
  Rakshasa: { tone: "intense, passionate, and transformative", challenge: "can feel overwhelming or too driven to gentler partners" },
};

function makeNakProblems(nak: NakInfo, startIndex: number): SeedProblem[] {
  const gq = ganaQualities[nak.gana];
  return [
    {
      title: `${nak.name} nakshatra's ${nak.gana} energy creating temperament friction`,
      description: `Born under ${nak.name}, you carry ${gq.tone} energy in your core emotional expression. In relationships this ${gq.challenge}. The ${nak.lord}-ruled sensitivity amplifies this wherever boundaries of temperament are crossed.`,
      category: "Temperament", severity: "moderate", tags: [`nakshatra:${nak.name}`, `gana:${nak.gana}`],
      solutions: [
        { title: "Explain your gana nature", description: `Tell your partner: 'I'm ${gq.tone} by nature. is how I process the world.' Understanding the framework reduces conflict about it.`, type: "communication", isPremium: false },
        { title: `${nak.lord} pacification ritual`, description: `Chanting the Beej mantra of ${nak.lord} on its ruling day helps regulate the nakshatra's intensity in emotional exchanges.`, type: "ritual", isPremium: true },
      ],
      sortOrder: startIndex,
    },
    {
      title: `${nak.name} nakshatra lord ${nak.lord}'s influence causing relationship instability`,
      description: `${nak.name} is lorded by ${nak.lord}. During challenging periods of this planet, ${nak.name} natives experience amplified emotional turbulence that shows up as unpredictability or withdrawal in the relationship.`,
      category: "Astrological Timing", severity: "mild", tags: [`nakshatra:${nak.name}`, `lord:${nak.lord}`],
      solutions: [
        { title: "Track ${nak.lord} transits", description: `When ${nak.lord} is challenged in transit, give yourself extra self-care. Warn your partner that this is an astrologically sensitive period.`, type: "practical", isPremium: false },
      ],
      sortOrder: startIndex + 1,
    },
    {
      title: `${nak.name} native's ${nak.yoni} yoni energy and intimate mismatches`,
      description: `In Vedic compatibility, ${nak.name} carries ${nak.yoni} yoni energy. Certain yoni combinations create natural friction in intimate bonding. something either person chooses, but a genuine compatibility factor that requires conscious navigation.`,
      category: "Intimacy", severity: "mild", tags: [`nakshatra:${nak.name}`, `yoni:${nak.yoni}`],
      solutions: [
        { title: "Build emotional intimacy as the foundation", description: "When physical/yoni compatibility is challenging, deepening emotional intimacy compensates significantly. Prioritize emotional closeness deliberately.", type: "practical", isPremium: false },
        { title: `${nak.deity} blessing ritual`, description: `Offering prayers to ${nak.deity}, the deity of ${nak.name}, invites divine grace to smooth compatibility challenges in this nakshatra.`, type: "ritual", isPremium: true },
      ],
      sortOrder: startIndex + 2,
    },
    {
      title: `Difficulty with commitment from ${nak.name} nakshatra patterns`,
      description: `${nak.name} nakshatra carries certain karmic patterns around commitment and long-term bonding. The ${nak.lord}-ruled restlessness or intensity can make sustained, stable commitment feel like either a cage or an inadequate container for what you feel.`,
      category: "Commitment", severity: "moderate", tags: [`nakshatra:${nak.name}`],
      solutions: [
        { title: "Define what commitment means to you", description: "Write your personal definition of commitment. what society says it should mean but what genuinely feels right for your nature.", type: "practical", isPremium: false },
      ],
      sortOrder: startIndex + 3,
    },
    {
      title: `${nak.name} nakshatra's karmic relationship lesson creating recurring patterns`,
      description: `Each nakshatra carries a specific karmic teaching in relationships. For ${nak.name} natives, this lesson often involves ${nak.gana === "Deva" ? "learning that love doesn't require perfection" : nak.gana === "Manushya" ? "balancing personal needs with relational duties" : "transforming possessiveness into genuine freedom"}. Until this lesson is met, the same relationship pattern keeps recurring.`,
      category: "Karma", severity: "severe", tags: [`nakshatra:${nak.name}`, "universal"],
      solutions: [
        { title: "Identify the recurring pattern", description: "Name the one relationship pattern you keep experiencing across different partners. That pattern is the nakshatra's lesson pointing to your growth edge.", type: "practical", isPremium: false },
        { title: "Remediation through service", description: "Performing service (seva) aligned with your nakshatra's deity reduces karmic relationship burdens. Research what service your deity values.", type: "spiritual", isPremium: false },
      ],
      sortOrder: startIndex + 4,
    },
  ];
}

const nakshatraProblems: SeedProblem[] = nakList.flatMap((n, i) => makeNakProblems(n, 500 + i * 5));

// ─── Dosha Problems ────────────────────────────────────────────────────────────

const doshaProblems: SeedProblem[] = [
  // ── Mangal Dosha (40) ──
  ...Array.from({ length: 40 }, (_, i): SeedProblem => {
    const titles = [
      "Mars energy driving impulsive relationship decisions",
      "Mangal dosha creating conflict-prone communication patterns",
      "Martian intensity overwhelming partners emotionally",
      "Anger management challenges rooted in Mangal placement",
      "Mangal dosha's influence on relationship endings",
      "Recurring power struggles linked to Mars placement",
      "Aggression patterns in conflict from Mangal energy",
      "Short-lived relationships as a Mangal dosha pattern",
      "Intensity and passion creating instability",
      "Mangal dosha's effect on trust and jealousy",
      "Mars-driven ambition creating neglect of relationship",
      "Martyrdom patterns linked to Mangal in 12th house",
      "Family opposition to the relationship from Mangal tensions",
      "Financial arguments amplified by Mangal placement",
      "Impatience in conflict resolution from Mars energy",
      "Physical dominance tendencies from strong Mars",
      "Mangal dosha timing delays in relationship milestones",
      "Resentment buildup from unaddressed Martian wounds",
      "Competitiveness bleeding from career into relationship",
      "Mars in 7th house creating projection of aggression onto partner",
      "Mangal dosha effects on sexual compatibility",
      "Impulsive breakups and reconciliations from Mars",
      "Difficulty with compromise from Mangal placement",
      "High-intensity bonding followed by high-intensity conflict",
      "Mangal dosha's amplification of existing relationship stress",
      "Mars placement creating fear of vulnerability",
      "Partner feeling emotionally unsafe around Mangal energy",
      "Mangal dosha misidentified as incompatibility",
      "Warrior energy spilling into domestic space",
      "Mangal dosha creating karmic relationship obstacles",
      "Mars retrograde periods worsening relationship conflicts",
      "Overprotection from insecurity driven by Mangal",
      "Mangal dosha making it hard to apologize",
      "Self-sabotage in relationships from Mars placement",
      "Excessive control needs from Mangal in 4th house",
      "Mars driving need to 'win' arguments over resolving them",
      "Mangal dosha's effect on marriage timing",
      "Difficulty with softness and tenderness due to Martian energy",
      "Mangal placement creating unrealistic expectations of strength",
      "Mars energy making long-distance relationships especially hard",
    ];
    const descs = [
      "Mangal (Mars) in sensitive astrological houses creates a pattern where intensity, speed, and fire enter relationships in ways that destabilize them. This placement doesn't make love impossible. it does require conscious work with Mars energy.",
      "With Mangal dosha present, the natural Martian drive for victory, intensity, and directness often enters relationship space without modulation. Partners without this placement can feel overwhelmed.",
    ];
    const sols: SeedSolution[][] = [
      [
        { title: "Channel Mars energy into shared goals", description: "Mars energy needs a worthy challenge. Channel it into shared projects, fitness goals, or career ambitions together. redirects aggression into vitality.", type: "practical", isPremium: false },
        { title: "Kuja dosha nivaran puja", description: "A Mangal Shanti puja performed by a qualified priest on a Tuesday can significantly reduce the dosha's impact on relationships.", type: "ritual", isPremium: true },
        { title: "Tuesday Mars remedies", description: "On Tuesdays, wear red, offer red flowers to Hanuman, and chant 'Om Angarakaya Namah' 28 times to pacify Mangal's energy.", type: "ritual", isPremium: false },
      ],
      [
        { title: "Pause before responding in conflict", description: "The Martian instinct is to react immediately. Committing to a 10-second pause before responding in conflict interrupts the impulsive pattern.", type: "practical", isPremium: false },
        { title: "Mangal dosha compatibility matching", description: "Traditional astrology suggests matching Mangal dosha natives with each other. Consult an astrologer about whether this applies to your specific chart.", type: "professional", isPremium: true },
      ],
    ];
    return {
      title: titles[i % titles.length] + (i >= titles.length ? ` (${Math.floor(i / titles.length) + 1})` : ""),
      description: descs[i % descs.length],
      category: "Dosha", severity: i < 20 ? "moderate" : "severe",
      tags: ["dosha:mangal"],
      solutions: sols[i % sols.length],
      sortOrder: 700 + i,
    };
  }),

  // ── Nadi Dosha (30) ──
  ...Array.from({ length: 30 }, (_, i): SeedProblem => {
    const titles = [
      "Nadi dosha creating deep physical incompatibility",
      "Health concerns in relationship linked to Nadi dosha",
      "Nadi dosha's effect on conception and family planning",
      "Physiological stress patterns from Nadi mismatch",
      "Nadi dosha's amplification of minor health issues",
      "Same nadi creating energy drain in the relationship",
      "Nadi dosha causing subtle but persistent friction",
      "Karmic lesson of Nadi dosha in this relationship",
      "Nadi dosha misunderstood as personal incompatibility",
      "Addressing Nadi dosha before long-term commitment",
      "Nadi dosha effects on long-term relationship vitality",
      "Medical consultations recommended due to Nadi alignment",
      "Nadi dosha's role in recurring relationship fatigue",
      "Spiritual remedies for Nadi dosha mitigation",
      "Nadi dosha present. action plan for the relationship",
      "Understanding Nadi dosha without fear",
      "Nadi dosha and its modern interpretation",
      "Nadi dosha's impact on mutual energy levels",
      "How Nadi dosha reveals health vulnerabilities",
      "Nadi dosha creating low-grade persistent tension",
      "Consulting a jyotishi about Nadi dosha severity",
      "Exceptions to Nadi dosha rules in Vedic astrology",
      "Nadi dosha and the question of relationship longevity",
      "Graha shanti for Nadi dosha relief",
      "Nadi dosha as an invitation for health awareness",
      "Managing Nadi dosha through Saturn remedies",
      "Nadi dosha's effect on emotional compatibility",
      "When Nadi dosha is partially cancelled",
      "Nadi dosha creating cyclical relationship stress",
      "Living well with Nadi dosha. practical approaches",
    ];
    return {
      title: titles[i],
      description: "Nadi dosha occurs when both partners share the same nadi (physiological/energy type: Adi, Madhya, or Antya). Classical Vedic astrology considers this a significant incompatibility factor that can affect health, energy levels, and long-term compatibility. Modern interpretation focuses on managing energy drain and health awareness.",
      category: "Dosha", severity: "moderate",
      tags: ["dosha:nadi"],
      solutions: [
        { title: "Nadi dosha puja", description: "A Nadi Nirvana puja performed with Mahamrityunjaya mantra recitation (1008 times) is the classical remedy for this dosha.", type: "ritual", isPremium: true },
        { title: "Health monitoring practice", description: "Couples with Nadi dosha benefit from proactive health monitoring. regular check-ups and avoiding shared stress triggers that amplify the dosha's effects.", type: "practical", isPremium: false },
      ],
      sortOrder: 740 + i,
    };
  }),

  // ── Bhakoot Dosha (30) ──
  ...Array.from({ length: 30 }, (_, i): SeedProblem => {
    const titles = [
      "Bhakoot dosha creating financial friction in the relationship",
      "Moon sign distance causing emotional incompatibility",
      "Bhakoot dosha's effect on family and social harmony",
      "6-8 Bhakoot creating health and conflict patterns",
      "12-2 Bhakoot dosha's financial and emotional impact",
      "Bhakoot dosha as karmic relationship challenge",
      "Moon sign distance creating different worldviews",
      "Bhakoot dosha affecting relationship longevity",
      "Emotional disconnection from Bhakoot positioning",
      "Addressing Bhakoot dosha with graha shanti",
      "Bhakoot dosha and the challenge of understanding each other",
      "Shared purpose as antidote to Bhakoot dosha",
      "Bhakoot dosha intensifying already difficult periods",
      "When Bhakoot dosha is cancelled by other factors",
      "Bhakoot dosha and income inequality in the relationship",
      "How Bhakoot dosha manifests in day-to-day interactions",
      "Bhakoot dosha creating health of one from other's wellbeing",
      "Social circle tensions from Bhakoot moon distance",
      "Bhakoot dosha requiring intentional emotional work",
      "Navigating Bhakoot dosha in modern relationships",
      "Bhakoot dosha and different life stages",
      "Graha shanti for 6-8 Bhakoot relationship",
      "Bhakoot dosha's timing effects on important decisions",
      "Bhakoot dosha: what the classical texts actually say",
      "Building bridges across Bhakoot moon sign distance",
      "Emotional languages shaped by Bhakoot moon positioning",
      "Bhakoot dosha and the question of relationship karma",
      "Spiritual work for Bhakoot dosha mitigation",
      "Bhakoot dosha affecting childbearing timing",
      "Long-term perspective on Bhakoot dosha",
    ];
    return {
      title: titles[i],
      description: "Bhakoot dosha arises when the moon signs of the two partners are in a 6-8 or 12-2 relationship to each other. This placement, according to Vedic astrology, can create financial challenges, health concerns for one partner from the other, and a fundamental difficulty in emotional wavelength alignment.",
      category: "Dosha", severity: "moderate",
      tags: ["dosha:bhakoot"],
      solutions: [
        { title: "Shared charity practice", description: "Regularly donating together (especially on Mondays) is a classical Bhakoot dosha remedy that builds karmic credit for the relationship.", type: "ritual", isPremium: false },
        { title: "Chandra puja for moon harmony", description: "Monthly offerings to Chandra on Purnima (full moon) with white flowers and milk help harmonize the moon sign friction.", type: "ritual", isPremium: true },
      ],
      sortOrder: 770 + i,
    };
  }),
];

// ─── Guna Score Range Problems ─────────────────────────────────────────────────

const gunaProblems: SeedProblem[] = [
  // Low guna (0-17). 50 problems
  ...Array.from({ length: 50 }, (_, i): SeedProblem => {
    const lowTitles = [
      "Low guna score requiring extra intentional work",
      "Fundamental temperament differences in low-scoring match",
      "Low compatibility score: understanding what it actually means",
      "Low guna match: overcoming the astrological challenge",
      "Physical incompatibility signals from low guna score",
      "Communication breakdown patterns in low guna relationships",
      "Low guna score and the question of relationship viability",
      "Trust challenges amplified by low Ashtakoot score",
      "Emotional regulation difficulties in low guna match",
      "Low Guna Maitri creating persistent mental disconnect",
      "Working with low guna score through conscious effort",
      "Low guna relationship: what astrology can and cannot predict",
      "Spiritual remedies for low guna score relationship",
      "Family acceptance challenges in low guna match",
      "Conflict frequency in low guna score relationships",
      "Love versus compatibility: navigating a low guna match",
      "Low guna score creating different life visions",
      "Health and wellbeing challenges in low guna match",
      "Finding shared purpose despite low guna score",
      "Low guna score: the role of free will",
      "Low guna match and the work required to make it last",
      "Moon sign friction in low guna compatibility",
      "Low guna relationship requiring professional astrological guidance",
      "Low guna score and its impact on intimacy",
      "Managing expectations in a low guna relationship",
      "Low guna score. what the 0-17 range actually signals",
      "Element conflicts underlying low guna score",
      "Kuja dosha and low guna score combined challenges",
      "Low guna match: success stories and what they share",
      "Building connection despite fundamental incompatibilities",
      "Low guna score's effect on long-term relationship stability",
      "When love exists but low guna score creates friction",
      "Navigating family opposition to low guna match",
      "Low guna score and recurring argument patterns",
      "Creating your own compatibility in a low guna match",
      "Low guna score. making an informed decision",
      "Emotional needs incompatibility in low guna relationships",
      "Low guna relationship requiring daily mindfulness practice",
      "Spiritual compatibility practices for low guna match",
      "Low guna score and childbearing planning considerations",
      "Communication strategies for low guna relationships",
      "When low guna score reflects genuine core value differences",
      "Remediation plan for low guna score relationship",
      "Low guna match: the role of dasha timing",
      "Financial planning in low guna relationships",
      "Low guna score: separating astrology from personal choice",
      "Growth and transformation possible in low guna match",
      "Low guna score. seeking second astrological opinion",
      "Low guna relationship's karmic learning opportunities",
      "Low guna score and the decision to stay or leave",
    ];
    return {
      title: lowTitles[i],
      description: "A Guna score below 18 indicates significant astrological incompatibility across multiple dimensions of the Ashtakoot system. This doesn't make love impossible, but it does signal that this relationship will require more conscious effort, communication, and possibly professional guidance than a higher-scoring match.",
      category: "Compatibility", severity: i < 25 ? "severe" : "moderate",
      tags: ["guna:low"],
      solutions: [
        { title: "Consult a qualified Jyotishi", description: "A professional Vedic astrologer can assess which specific Ashtakoot dimensions are most challenged and recommend targeted remedies.", type: "professional", isPremium: true },
        { title: "Focus on the Ashtakoot areas that do score well", description: "Even in a low guna match, some dimensions score positively. Lean into those areas as relationship strengths while working on the challenges.", type: "practical", isPremium: false },
        { title: "Combined graha shanti puja", description: "A combined shanti puja performed with both partners present addresses the planetary incompatibilities at a cosmic level.", type: "ritual", isPremium: true },
      ],
      sortOrder: 800 + i,
    };
  }),
  // Medium guna (18-27). 50 problems
  ...Array.from({ length: 50 }, (_, i): SeedProblem => ({
    title: `Medium guna relationship challenge ${i + 1}: ${["navigating partial compatibility", "working with mixed signals from the kundli", "understanding which areas need attention", "building on compatible areas while addressing friction", "medium guna match and realistic expectations"][i % 5]}`,
    description: "A Guna score of 18-27 indicates moderate compatibility. some dimensions align well while others present genuine challenges. This is the most common score range and represents a relationship that can thrive with awareness of which areas need consistent work.",
    category: "Compatibility", severity: "mild",
    tags: ["guna:medium"],
    solutions: [
      { title: "Ashtakoot compatibility analysis", description: "Review your specific Ashtakoot breakdown (Varna, Vashya, Tara, etc.) to understand which areas score low. Target those specifically.", type: "practical", isPremium: false },
      { title: "Strengthen compatible planetary lords", description: "The lords of both Moon signs determine Graha Maitri. Strengthening these planets through their respective practices improves mental compatibility.", type: "ritual", isPremium: true },
    ],
    sortOrder: 850 + i,
  })),
  // High guna (28-36). 30 problems
  ...Array.from({ length: 30 }, (_, i): SeedProblem => ({
    title: `High guna match challenge ${i + 1}: ${["not taking compatibility for granted", "high expectations from high guna score", "compatibility gap between kundli and current reality", "managing outside influences on a strong match", "external factors straining a strong astrological bond"][i % 5]}`,
    description: "A Guna score of 28-36 indicates exceptional astrological compatibility. However, a high score creates its own challenges: overconfidence, external pressures, and the assumption that a good kundli match means no work is required. Cosmic compatibility is the foundation. still needs building.",
    category: "Compatibility", severity: "mild",
    tags: ["guna:high"],
    solutions: [
      { title: "Don't coast on the compatibility score", description: "High guna compatibility means your starting conditions are favorable. relationships still require active investment, communication, and growth.", type: "practical", isPremium: false },
      { title: "Annual kundli renewal puja", description: "Performing a joint puja on your anniversary or on Navratri to honor and renew the cosmic bond keeps the astrological alignment actively charged.", type: "ritual", isPremium: false },
    ],
    sortOrder: 900 + i,
  })),
];

// ─── Relationship Type Problems (120 = 4 × 30) ───────────────────────────────

const relationshipTypeProblems: SeedProblem[] = [
  ...Array.from({ length: 30 }, (_, i): SeedProblem => ({
    title: `Crush situation challenge ${i + 1}: ${["unrequited feelings with no clear answer", "not knowing if feelings are returned", "overthinking every interaction", "fear of rejection preventing action", "reading signals that may not be there", "obsessive thinking about someone who may not notice you", "putting someone on a pedestal before knowing them", "the gap between fantasy and reality in a crush", "timing uncertainty in crush situations", "navigating a crush when you're already in a relationship"][i % 10]}`,
    description: i % 2 === 0
      ? "The crush phase is intense precisely because it's all projection. you're falling for a version of someone you've constructed, not yet the person themselves. This creates beautiful feelings but also significant suffering when reality doesn't match the imagined version."
      : "Unreciprocated or uncertain feelings are one of the most difficult emotional experiences because there's no clear action to take. The ambiguity itself becomes the source of pain.",
    category: "Unrequited Love", severity: i < 15 ? "mild" : "moderate",
    tags: ["relationship:crush"],
    solutions: [
      { title: "Set a decision timeline", description: "Give yourself a defined window. 2 weeks, a month. to either act on the feelings or deliberately redirect your energy. Indefinite uncertainty is more painful than a clear no.", type: "practical", isPremium: false },
      { title: "Meet the person, not the projection", description: "Make one move to actually get to know them. to confess feelings, just to have a real conversation. Information replaces projection.", type: "practical", isPremium: false },
    ],
    sortOrder: 930 + i,
  })),
  ...Array.from({ length: 30 }, (_, i): SeedProblem => ({
    title: `Situationship challenge ${i + 1}: ${["undefined relationship status creating anxiety", "mixed signals as a relationship pattern", "physical intimacy without emotional commitment", "being someone's priority without the label", "the 'what are we' conversation that never happens", "feeling used without being formally together", "the emotional toll of relationship ambiguity", "partners who resist defining the relationship", "hoping ambiguity will resolve itself", "situationship versus the relationship you actually want"][i % 10]}`,
    description: "Situationships exist in the painful gap between 'just friends' and 'in a relationship.' The ambiguity is often intentional on one side. they get the benefits of a relationship without the accountability. For the other person, the uncertainty itself is the wound.",
    category: "Undefined Relationship", severity: "moderate",
    tags: ["relationship:situationship"],
    solutions: [
      { title: "Have the defining conversation", description: "Say clearly: 'I need to know what this is. I'm not asking for a lifetime commitment. I'm asking whether we're building toward something or not.' Clarity, even painful clarity, is better than indefinite ambiguity.", type: "communication", isPremium: false },
      { title: "Set an internal deadline", description: "If they can't define the relationship within a timeframe you set (for yourself. you don't have to announce it), that itself is information about what they want.", type: "practical", isPremium: false },
    ],
    sortOrder: 960 + i,
  })),
  ...Array.from({ length: 30 }, (_, i): SeedProblem => ({
    title: `Committed relationship challenge ${i + 1}: ${["complacency after commitment", "keeping romance alive long-term", "balancing individual growth with couple goals", "managing relationship boredom", "rekindling after a period of distance", "navigating major life transitions together", "handling disagreements about the future", "managing time together versus apart", "keeping physical intimacy alive", "navigating changing life priorities together"][i % 10]}`,
    description: "Committed relationships face a different set of challenges than new ones: the chemistry of novelty fades, the texture of real life sets in, and the real work of long-term love begins. These are not signs of a failing relationship. they are the curriculum of mature love.",
    category: "Long-term Relationship", severity: "mild",
    tags: ["relationship:relationship"],
    solutions: [
      { title: "Annual relationship review", description: "Once a year, both partners answer: What's working? What needs to change? What are our goals for this relationship next year? Treat it like a business review. structured but meaningful.", type: "practical", isPremium: false },
      { title: "Relationship renewal ceremony", description: "Mark anniversaries or significant dates with a private ceremony. elaborate, just intentional. Renew your commitment in words you choose for this year specifically.", type: "ritual", isPremium: false },
    ],
    sortOrder: 990 + i,
  })),
  ...Array.from({ length: 30 }, (_, i): SeedProblem => ({
    title: `Post-breakup challenge ${i + 1}: ${["inability to move on from an ex", "nostalgia for what the relationship felt like", "obsessive thinking about what went wrong", "wondering if you made a mistake in leaving or being left", "reopening contact with an ex", "processing the grief of a relationship ending", "rebuilding identity after a relationship ends", "comparing current potential partners to an ex", "the on-again-off-again cycle", "closure that never fully arrives"][i % 10]}`,
    description: "The end of a significant relationship doesn't end the emotional bond immediately. The feelings, patterns, and identity built around that relationship take time to dissolve. often don't dissolve fully without conscious work.",
    category: "Post-Breakup", severity: i < 10 ? "moderate" : "mild",
    tags: ["relationship:ex"],
    solutions: [
      { title: "Create a no-contact rule with an end date", description: "30-90 days of no contact is typically needed to break the neurological attachment. Give it an end date so it feels less permanent.", type: "practical", isPremium: false },
      { title: "Grief the relationship fully", description: "Most people rush through relationship grief. Allow yourself to properly mourn. what you lost, what you hoped for, the version of yourself in that relationship.", type: "practical", isPremium: false },
    ],
    sortOrder: 1020 + i,
  })),
];

// ─── Elemental Conflict Problems (60 = 6 pairs × 10) ─────────────────────────

const elementPairs = [
  { pair: "Fire_Water",  a: "Fire",  b: "Water",  desc: "Fire and Water create steam. intense and transformative but difficult to sustain. Fire needs freedom and action; Water needs security and depth. Each can extinguish or evaporate the other." },
  { pair: "Fire_Earth",  a: "Fire",  b: "Earth",  desc: "Fire and Earth create a tension between urgency and patience. Fire wants to leap forward; Earth wants to build slowly. Fire finds Earth boring; Earth finds Fire reckless." },
  { pair: "Fire_Air",    a: "Fire",  b: "Air",    desc: "Fire and Air can ignite beautifully but can also burn out quickly. Air fuels Fire's intensity but may feel overwhelmed by the heat it creates. The pace difference is the key challenge." },
  { pair: "Water_Earth", a: "Water", b: "Earth",  desc: "Water and Earth are naturally compatible but can create codependency. Earth provides the container Water needs; Water nourishes Earth. The shadow: Water floods and drowns, Earth becomes rigid and unyielding." },
  { pair: "Water_Air",   a: "Water", b: "Air",    desc: "Water and Air face a fundamental challenge: Water goes deep into emotion while Air prefers intellectual distance. What feels intimate to Water feels overwhelming to Air." },
  { pair: "Earth_Air",   a: "Earth", b: "Air",    desc: "Earth and Air have genuinely different speeds and textures. Earth is tangible, sensory, and slow. Air is conceptual, social, and quick. They can feel like they're living in different worlds." },
];

const elementalProblems: SeedProblem[] = elementPairs.flatMap((ep, pairIdx) =>
  Array.from({ length: 10 }, (_, i): SeedProblem => ({
    title: `${ep.a}-${ep.b} elemental tension: ${["different pacing in emotional life", "incompatible processing styles", "physical intimacy differences", "communication style clash", "different life priorities", "conflict escalation pattern", "emotional depth mismatch", "approach to planning and spontaneity", "different social needs", "conflicting recovery styles after arguments"][i]}`,
    description: ep.desc,
    category: "Elemental Compatibility", severity: "mild",
    tags: [`element_conflict:${ep.pair}`],
    solutions: [
      { title: "Study your elemental differences", description: `${ep.a} and ${ep.b} energy have specific strengths and friction points. Understanding these as predictable patterns reduces the personalization of conflict.`, type: "practical", isPremium: false },
      { title: "Use the complementarity", description: `${ep.a} energy brings what ${ep.b} lacks; ${ep.b} brings what ${ep.a} needs. Frame your differences as balance rather than opposition.`, type: "communication", isPremium: false },
    ],
    sortOrder: 1050 + pairIdx * 10 + i,
  }))
);

// ─── Dasha Lord Problems (45 = 9 lords × 5) ──────────────────────────────────

const dashaLords = ["Ketu", "Shukra", "Surya", "Chandra", "Mangal", "Rahu", "Brihaspati", "Shani", "Budh"];
const dashaThemes: Record<string, { keyword: string; challenge: string; remedy: string }> = {
  Ketu:       { keyword: "detachment",    challenge: "emotional disconnection, spiritual withdrawal from relationship",              remedy: "Offer sesame seeds to Ketu on Tuesdays and chant 'Om Ketave Namah' 18 times" },
  Shukra:     { keyword: "pleasure",      challenge: "overindulgence, romantic unrealism, or complete loss of romantic interest",   remedy: "Offer white flowers to the Shukra yantra on Fridays and chant 'Om Shukraya Namah'" },
  Surya:      { keyword: "authority",     challenge: "ego conflicts, domination patterns, lack of emotional yielding",              remedy: "Surya Namaskar at sunrise with 'Om Suryaya Namah' recitation daily" },
  Chandra:    { keyword: "emotion",       challenge: "emotional flooding, mood instability, neediness amplification",               remedy: "Full moon water ritual. leave water in moonlight, drink the next morning" },
  Mangal:     { keyword: "action",        challenge: "impulsiveness, anger, impatience in relationship decisions",                  remedy: "Red coral gemstone (consult astrologer), Hanuman puja on Tuesdays" },
  Rahu:       { keyword: "obsession",     challenge: "unhealthy attachment, deception, or sudden destabilizing events in love",     remedy: "Rahu shanti puja, hessonite gemstone consultation, donation on Saturdays" },
  Brihaspati: { keyword: "wisdom",        challenge: "over-moralization of partner, expecting too much spiritual alignment",        remedy: "Yellow sapphire (consult astrologer), offer turmeric to Brihaspati on Thursdays" },
  Shani:      { keyword: "karma",         challenge: "delays in relationship milestones, feeling burdened, karmic relationship lessons", remedy: "Shani puja on Saturdays, mustard oil lamp offering, service to the elderly" },
  Budh:       { keyword: "communication", challenge: "overthinking love, analysis paralysis, difficulty trusting feelings",         remedy: "Green emerald consultation, Budha puja on Wednesdays, mercury strengthening" },
};

const dashaProblems: SeedProblem[] = dashaLords.flatMap((lord, lordIdx) => {
  const theme = dashaThemes[lord];
  return Array.from({ length: 5 }, (_, i): SeedProblem => ({
    title: `${lord} dasha bringing ${theme.keyword} energy that challenges the relationship`,
    description: `During ${lord} mahadasha, the primary life theme of ${theme.keyword} colors every experience including relationships. The specific challenge: ${theme.challenge}. This dasha period requires conscious management of these tendencies to prevent relationship harm.`,
    category: "Dasha Timing", severity: i < 2 ? "severe" : "moderate",
    tags: [`dasha:${lord}`],
    solutions: [
      { title: `Navigate ${lord} dasha with awareness`, description: `Knowing you're in ${lord} dasha explains a lot. Share this with your partner: 'I'm in a period that tends toward ${theme.keyword}. Please bear with me and call me out gently when you see it.'`, type: "communication", isPremium: false },
      { title: `${lord} remediation practice`, description: theme.remedy, type: "ritual", isPremium: i % 2 === 0 },
    ],
    sortOrder: 1110 + lordIdx * 5 + i,
  }));
});

// ─── Gana Compatibility Problems (45 = 9 combos × 5) ─────────────────────────

const ganaCombos = [
  { combo: "Deva_Deva",         a: "Deva",     b: "Deva",     desc: "Both Deva partners share idealism but may compete spiritually or lack groundedness in practical relationship matters." },
  { combo: "Manushya_Manushya", a: "Manushya", b: "Manushya", desc: "Two Manushya partners are naturally balanced but may get caught in mundane practicality, losing the larger meaning of the relationship." },
  { combo: "Rakshasa_Rakshasa", a: "Rakshasa", b: "Rakshasa", desc: "Two Rakshasa partners create intense, passionate energy that can be electrifying or explosive. High highs and low lows." },
  { combo: "Deva_Manushya",     a: "Deva",     b: "Manushya", desc: "The idealistic Deva may feel misunderstood by the practical Manushya; the Manushya may feel unable to meet the Deva's spiritual bar." },
  { combo: "Deva_Rakshasa",     a: "Deva",     b: "Rakshasa", desc: "The most challenging Gana combination. gentle, idealistic Deva can be overwhelmed by the intensity of Rakshasa energy, and vice versa." },
  { combo: "Manushya_Deva",     a: "Manushya", b: "Deva",     desc: "The practical Manushya grounds the idealistic Deva, but may struggle with the Deva's spiritual expectations. Balance is achievable." },
  { combo: "Manushya_Rakshasa", a: "Manushya", b: "Rakshasa", desc: "The Rakshasa's intensity can overwhelm the more balanced Manushya. The Manushya brings stabilizing calm that the Rakshasa needs but may resist." },
  { combo: "Rakshasa_Deva",     a: "Rakshasa", b: "Deva",     desc: "The Deva's spiritual nature calls out the Rakshasa's depth, but the Rakshasa's intensity can shatter the Deva's need for peace." },
  { combo: "Rakshasa_Manushya", a: "Rakshasa", b: "Manushya", desc: "The Rakshasa's raw energy can be grounded by the Manushya's balance. if the Manushya doesn't become exhausted by the intensity." },
];

const ganaProblems: SeedProblem[] = ganaCombos.flatMap((gc, gcIdx) =>
  Array.from({ length: 5 }, (_, i): SeedProblem => ({
    title: `${gc.a}-${gc.b} Gana combination challenge ${i + 1}`,
    description: gc.desc,
    category: "Gana Compatibility", severity: gc.combo === "Deva_Rakshasa" || gc.combo === "Rakshasa_Deva" ? "severe" : "moderate",
    tags: [`gana_combo:${gc.combo}`],
    solutions: [
      { title: "Understand the gana archetypes", description: `${gc.a} and ${gc.b} gana energies each have valid needs and expressions. Understanding what each truly requires removes the sting of incompatibility.`, type: "communication", isPremium: false },
      { title: "Gana compatibility puja", description: "A combined Navagraha puja can help harmonize differing gana energies and reduce their friction in the relationship.", type: "ritual", isPremium: true },
    ],
    sortOrder: 1160 + gcIdx * 5 + i,
  }))
);

// ─── Yoni Incompatibility Problems (20) ───────────────────────────────────────

const yoniProblems: SeedProblem[] = Array.from({ length: 20 }, (_, i): SeedProblem => ({
  title: `Yoni incompatibility creating intimate friction. pattern ${i + 1}`,
  description: "Yoni compatibility in Vedic astrology refers to intimate/sexual compatibility based on nakshatra animal symbols. Enemy yoni combinations (like Cat-Rat or Dog-Hare) indicate a natural tension in physical intimacy and close bonding, even when other compatibility factors are strong.",
  category: "Intimate Compatibility", severity: "moderate",
  tags: ["yoni:enemy"],
  solutions: [
    { title: "Prioritize emotional intimacy over physical", description: "When yoni compatibility is challenging, deepening emotional connection compensates substantially. Physical intimacy improves naturally when emotional safety is high.", type: "practical", isPremium: false },
    { title: "Yoni dosha remediation", description: "Consulting a Jyotishi about specific yoni remedies. vary by the combination. can provide targeted spiritual support.", type: "professional", isPremium: true },
    { title: "Kameshvara and Kameshvari puja", description: "This puja specifically for intimate harmony is recommended for challenging yoni combinations.", type: "ritual", isPremium: true },
  ],
  sortOrder: 1205 + i,
}));

// ─── Sun Rashi Problems (60 = 12 × 5) ────────────────────────────────────────

const sunRashiQualities: Record<string, { ego: string; blind: string }> = {
  Mesha:      { ego: "needs to lead",          blind: "others' need for collaboration" },
  Vrishabha:  { ego: "needs material security",blind: "intangible emotional needs" },
  Mithuna:    { ego: "needs to be interesting",blind: "emotional depth requirements" },
  Karka:      { ego: "needs emotional safety", blind: "others' need for independence" },
  Simha:      { ego: "needs admiration",       blind: "others' need for equality" },
  Kanya:      { ego: "needs to be useful",     blind: "others' need for acceptance without improvement" },
  Tula:       { ego: "needs balance",          blind: "the unavoidability of conflict" },
  Vrishchika: { ego: "needs transformation",   blind: "others' comfort with the status quo" },
  Dhanu:      { ego: "needs freedom",          blind: "others' need for rootedness" },
  Makara:     { ego: "needs achievement",      blind: "others' need for emotional presence" },
  Kumbha:     { ego: "needs uniqueness",       blind: "the value of conventional relationship wisdom" },
  Meena:      { ego: "needs meaning",          blind: "pragmatic realities of partnership" },
};

const sunRashiProblems: SeedProblem[] = rashiList.flatMap((rashi, ri) => {
  const sq = sunRashiQualities[rashi.name];
  return Array.from({ length: 5 }, (_, i): SeedProblem => ({
    title: `${rashi.name} Sun ego pattern affecting relationship quality`,
    description: `With the Sun in ${rashi.name}, the ego structure ${sq.ego}. This is neither good nor bad, but in a relationship it means there's a tendency to be blind to ${sq.blind}. Partners who need what you're least able to give will feel chronically unseen.`,
    category: "Ego Dynamics", severity: "mild",
    tags: [`sun_rashi:${rashi.name}`],
    solutions: [
      { title: `Practice the opposite of ${sq.ego}`, description: `The most growth-generating move for ${rashi.name} Sun people is to consciously practice the opposite: offer without needing ${sq.ego.replace("needs", "").trim()}.`, type: "practical", isPremium: false },
      { title: `${rashi.lord} awareness meditation`, description: `A daily 5-minute meditation focusing on ${rashi.lord} energy. its gifts and its shadow. builds self-awareness that directly improves relationship quality.`, type: "spiritual", isPremium: false },
    ],
    sortOrder: 1225 + ri * 5 + i,
  }));
});

// ─── GenZ Relationship Problems (plain language, high resonance) ──────────────
// These cover the emotional patterns GenZ actually searches for.
// Tags: "universal" + specific relationship type / pattern / element.
// sortOrder starts at 1400 to always appear after astrological problems when scoring ties.

const genzProblems: SeedProblem[] = [
  {
    title: "You always feel like the one who cares more",
    description: "It's not that they don't care. it's that the way they express care is quieter and less visible than yours. But quieter doesn't always mean equal, and you're right to notice the gap. The question worth asking: is this a style difference, or an investment difference?",
    category: "Balance", severity: "moderate", tags: ["universal","relationship:situationship","relationship:relationship"],
    solutions: [
      { title: "Name the specific action gap, not the feeling", description: "Instead of 'I feel like I care more,' try naming what you actually observe: 'I initiate most plans, I check in more, I apologize first.' Specific observations create real conversations.", type: "communication", isPremium: false },
      { title: "Do a 2-week experiment", description: "Stop initiating everything for 2 weeks and observe what they initiate. The data will tell you more than any conversation about feelings.", type: "practical", isPremium: false },
    ],
    sortOrder: 1400,
  },
  {
    title: "The hot-and-cold cycle that's driving you insane",
    description: "They're warm, then distant. Present, then unavailable. The inconsistency keeps you hooked because your nervous system is waiting for the next warm phase to confirm everything is okay. This is one of the most psychologically compelling (and exhausting) patterns in modern relationships.",
    category: "Patterns", severity: "moderate", tags: ["universal","pattern:hot_cold","relationship:situationship"],
    solutions: [
      { title: "Name the pattern out loud to them", description: "Say: 'I've noticed you get close and then pull away. It makes it hard for me to feel secure. Can we talk about what's happening?' Naming it without accusing is the first real step.", type: "communication", isPremium: false },
      { title: "Stop chasing the warm phase", description: "When they pull away, resist the urge to pursue harder. Instead, use that energy on yourself. The pattern loses power when you stop rewarding it with more of your attention.", type: "practical", isPremium: false },
    ],
    sortOrder: 1401,
  },
  {
    title: "You can't stop checking their social media",
    description: "Every story view, every post, every like is being analyzed for information about where you stand. This behavior feels like being close to them but actually keeps you in a state of low-grade anxiety. Your Moon sign's need for information is running the show right now.",
    category: "Emotional Distance", severity: "moderate", tags: ["universal","relationship:ex","pattern:anxious_attachment"],
    solutions: [
      { title: "Mute or unfollow for 30 days", description: "Not blocking. removing the stimulus. Social media is a slot machine of emotional information. Removing it from your feed changes the entire dynamic of your daily emotional state.", type: "practical", isPremium: false },
      { title: "Replace the urge with a task", description: "Every time you feel the impulse to check their profiles, do a specific 5-minute task instead. Pick one in advance. This works because it intercepts the neural pathway before it completes.", type: "practical", isPremium: false },
    ],
    sortOrder: 1402,
  },
  {
    title: "You romanticize who they could be instead of seeing who they are",
    description: "Your Moon sign has a powerful ability to sense potential. also means it can build an entire relationship with the projected future version of a person rather than the actual present one. This isn't delusion; it's a survival strategy that needs redirecting.",
    category: "Perception", severity: "moderate", tags: ["universal","moon_rashi:Meena","moon_rashi:Karka","relationship:crush"],
    solutions: [
      { title: "Write down only things you've directly observed", description: "Not what you hope, not what they might be, only what you've actually seen them do. Compare that list to the version of them you've been investing in.", type: "practical", isPremium: false },
      { title: "Ask yourself the hard question", description: "If they stayed exactly the same as they are today for the next 5 years. no growth, no change. would you still want this? Your honest answer changes the conversation.", type: "practical", isPremium: false },
    ],
    sortOrder: 1403,
  },
  {
    title: "You feel more anxious after a good interaction than a bad one",
    description: "After a great conversation or moment together, the anxiety spikes. 'what if this is the best it gets?' or 'they'll pull away now.' This is hypervigilance: your nervous system learned to treat good things as threats because good things got taken away before. The pattern is from before them.",
    category: "Anxiety", severity: "moderate", tags: ["universal","pattern:anxious_attachment","relationship:situationship"],
    solutions: [
      { title: "Name it as hypervigilance, not intuition", description: "Post-good-experience anxiety is not a sign that something is wrong. it's your nervous system running a threat protocol from an old situation. Label it: 'This is hypervigilance. The good moment was real.'", type: "practical", isPremium: false },
      { title: "Ground yourself right after good moments", description: "When the anxiety hits after a positive interaction, do something immediately physical: cold water on the face, a walk around the block. This interrupts the escalation before it builds.", type: "practical", isPremium: false },
    ],
    sortOrder: 1404,
  },
  {
    title: "The relationship never gets to real depth",
    description: "Things are fine on the surface but every time you try to go deeper. emotionally, conversationally. there's a wall. One of you avoids depth, and the other is starving for it. This is often the central frustration of a Deva-meets-Manushya or Fire-meets-Earth pairing.",
    category: "Emotional Depth", severity: "moderate", tags: ["universal","element_conflict:Fire_Earth","element_conflict:Earth_Fire","relationship:relationship","relationship:situationship"],
    solutions: [
      { title: "Create conditions for depth, don't demand it", description: "Depth often can't be forced through direct questioning. It happens in side-by-side activities: long drives, cooking together, walks. Create those conditions and let the conversations emerge.", type: "practical", isPremium: false },
      { title: "Ask open questions, not analysis questions", description: "'What did that feel like for you?' opens depth. 'Why did you do that?' triggers defense. Change your question pattern.", type: "communication", isPremium: false },
    ],
    sortOrder: 1405,
  },
  {
    title: "They leave you on read at critical moments",
    description: "Not the casual no-reply. ones where you said something real or vulnerable, and they went silent. This is one of the most common and painful patterns in digital-age relationships, and it almost always communicates the same thing: they don't know what to do with your emotional depth.",
    category: "Communication", severity: "moderate", tags: ["universal","relationship:situationship","relationship:crush"],
    solutions: [
      { title: "Give it 24 hours before spiraling", description: "Most people who leave things on read at hard moments are processing, not rejecting. Give it 24 hours. If nothing comes, one follow-up is fair: 'Did I say something that was hard to respond to?'", type: "practical", isPremium: false },
      { title: "Have the meta-conversation", description: "Not in the moment, but when things are calm: 'When I share something vulnerable and you go quiet, I read it as rejection. What's actually happening for you?'", type: "communication", isPremium: false },
    ],
    sortOrder: 1406,
  },
  {
    title: "You apologize for things you didn't do wrong",
    description: "Keeping the peace has become automatic. You apologize first because the discomfort of conflict feels worse than the injustice of taking undeserved blame. Over time this erodes your sense of what's actually yours to own. it trains your partner not to take responsibility either.",
    category: "Self-Worth", severity: "moderate", tags: ["universal","moon_rashi:Tula","moon_rashi:Karka","moon_rashi:Kanya"],
    solutions: [
      { title: "Practice the pause before apologizing", description: "When the urge to apologize comes, pause for 10 seconds and ask: did I actually do something wrong, or am I trying to end the discomfort? Only then decide whether to apologize.", type: "practical", isPremium: false },
      { title: "Replace 'sorry' with accuracy", description: "Instead of 'Sorry I upset you,' try 'I can see you're upset. Tell me what happened for you.' This stays connected without taking on misplaced responsibility.", type: "communication", isPremium: false },
    ],
    sortOrder: 1407,
  },
  {
    title: "You feel like a burden when you express needs",
    description: "Your needs are valid. at some point you learned (probably early) that expressing them caused problems. So now you pre-edit everything before it comes out, or you don't say anything at all. The relationship lives in your head more than in real conversation.",
    category: "Emotional Expression", severity: "moderate", tags: ["universal","moon_rashi:Karka","pattern:anxious_attachment"],
    solutions: [
      { title: "Start with the smallest need", description: "Pick one need that feels low-stakes and voice it this week. Not the big ones. start small. 'I would actually love if we could X.' Notice their response. Real data, not anticipated rejection.", type: "communication", isPremium: false },
      { title: "Question the assumption", description: "Where did you learn that your needs were burdensome? That was someone else's limitation. a fact about you. Write out one need and ask: is this actually unreasonable, or does it just feel that way?", type: "practical", isPremium: false },
    ],
    sortOrder: 1408,
  },
  {
    title: "The \"almost relationship\" you can't quite close",
    description: "It's not quite together, not quite over. There's enough to stay invested and not enough to feel settled. This is the emotional purgatory of the almost-relationship. it's one of the most common sources of prolonged pain for people with your Moon placement.",
    category: "Relationship Type", severity: "severe", tags: ["relationship:situationship","universal"],
    solutions: [
      { title: "Set an internal decision date", description: "Give yourself 30 days. If clarity hasn't arrived naturally by then. from them OR from yourself. you make the decision. Not a confrontation: a private deadline that you honor.", type: "practical", isPremium: false },
      { title: "Ask the one question you've been avoiding", description: "You've been circling around one specific question you're afraid to ask. Write it down. Then decide: do you actually want the answer, or do you want the ambiguity?", type: "communication", isPremium: false },
    ],
    sortOrder: 1409,
  },
  {
    title: "They're great when things are easy, absent when things are hard",
    description: "Fair-weather connection is one of the most frustrating things to name because the good moments are so genuinely good. But a relationship can only be evaluated at its hardest moments, not its easiest ones. This is where character actually shows up.",
    category: "Reliability", severity: "moderate", tags: ["universal","relationship:relationship","relationship:situationship"],
    solutions: [
      { title: "Bring a real problem to them", description: "Not manufactured drama. actual difficulty in your life. Notice how they respond when you genuinely need support. This data is more useful than any conversation about the relationship.", type: "practical", isPremium: false },
      { title: "Name the pattern directly", description: "'I've noticed you're really present when things are good between us, but when I'm struggling you seem to pull back. Is that accurate? What's happening for you then?'", type: "communication", isPremium: false },
    ],
    sortOrder: 1410,
  },
  {
    title: "You're scared that if you stop trying, they'll stop too",
    description: "The relationship runs on your effort. you both know it. Stopping feels like risk. But continuing means you never actually know if they want this or just benefit from it. The fear of finding out is keeping you stuck in exhaustion.",
    category: "Effort Imbalance", severity: "moderate", tags: ["universal","relationship:relationship","relationship:situationship"],
    solutions: [
      { title: "Reduce effort gradually, not abruptly", description: "Over 2-3 weeks, pull back on one category of effort. initiating plans, or checking in. Not as a test: as an honest reset to your actual capacity. See what adjusts naturally.", type: "practical", isPremium: false },
      { title: "Have the effort conversation", description: "'I've been carrying most of the planning and initiation. I'm getting tired and I need this to be more balanced.' Simple. True. Worth saying.", type: "communication", isPremium: false },
    ],
    sortOrder: 1411,
  },
  {
    title: "Their past relationships come up too much",
    description: "Whether it's comparisons, lingering attachment to an ex, or stories that make you feel like a placeholder. shadow of their past relationships sits in your current one. This is a real thing worth addressing, not something to rationalize away.",
    category: "Past Relationships", severity: "moderate", tags: ["universal","relationship:relationship"],
    solutions: [
      { title: "Be specific about what bothers you", description: "Not 'I don't like how much you talk about them' but 'When you compare me to your ex, I feel like I'm being measured. Can we agree to stop doing that?'", type: "communication", isPremium: false },
      { title: "Assess whether this is normal processing or a red flag", description: "Everyone has a past. Processing is normal. But if there's active longing, idealization, or comparison. that's different. Be honest with yourself about which one this is.", type: "practical", isPremium: false },
    ],
    sortOrder: 1412,
  },
  {
    title: "You keep having breakthroughs that don't lead to change",
    description: "Beautiful conversation where everything is understood. Real emotional opening. And then... nothing changes. The cycle resets within days. This pattern. insight without action. is often the final stage before someone leaves a relationship.",
    category: "Patterns", severity: "severe", tags: ["universal","relationship:relationship","pattern:cycles"],
    solutions: [
      { title: "Turn insights into one specific behavioral agreement", description: "At the end of the next breakthrough conversation, ask: 'What's one specific thing we're each going to do differently?' Write it down. Name a date to check back. Insight without implementation is just relief.", type: "communication", isPremium: false },
      { title: "Ask the accountability question", description: "A week after a breakthrough: 'Did we do the thing we said we'd do?' If the answer is no three times in a row, the insight isn't the issue. willingness is.", type: "practical", isPremium: false },
    ],
    sortOrder: 1413,
  },
  {
    title: "You've started to feel angry instead of sad",
    description: "Grief moves through stages. Anger is often the second one. in relationships, it arrives when you've finally started to believe your own feelings matter enough to be protected. The anger is not the problem. What you do with it determines what comes next.",
    category: "Emotional Transition", severity: "moderate", tags: ["universal","relationship:ex","category:healing"],
    solutions: [
      { title: "Let yourself feel angry", description: "Anger is energy. It wants to move. Go for an intense run, hit a pillow, write the letter you'll never send. Move the anger through your body rather than managing it in your head.", type: "practical", isPremium: false },
      { title: "Distinguish anger from resentment", description: "Anger passes. Resentment builds walls. If the anger has been present for more than a few weeks, it's usually resentment. means something unspoken needs to be said, even just to yourself.", type: "practical", isPremium: false },
    ],
    sortOrder: 1414,
  },
  {
    title: "You don't know if this is love or just not wanting to be alone",
    description: "The honest question nobody asks enough. Loneliness is a powerful force. can make a mediocre connection feel essential. Your Moon sign feels absence acutely, which can make staying in something imperfect feel safer than the unknown of not having anyone.",
    category: "Clarity", severity: "moderate", tags: ["universal","moon_rashi:Karka","moon_rashi:Vrishabha"],
    solutions: [
      { title: "Do the thought experiment", description: "Imagine you had a full, rich life. great friends, meaningful work, deep peace. Do you still want THIS specific person in it? Or did you want the role they fill?", type: "practical", isPremium: false },
      { title: "Spend 72 hours genuinely solo", description: "Not distracted, not filling time. actually alone with yourself. See how that feels. Your reaction will tell you something about whether this relationship is a choice or a solution.", type: "practical", isPremium: false },
    ],
    sortOrder: 1415,
  },
];

// ─── Combine all problems ─────────────────────────────────────────────────────

export const ALL_PROBLEMS: SeedProblem[] = [
  ...universal,
  ...moonRashiProblems,
  ...nakshatraProblems,
  ...doshaProblems,
  ...gunaProblems,
  ...relationshipTypeProblems,
  ...elementalProblems,
  ...dashaProblems,
  ...ganaProblems,
  ...yoniProblems,
  ...sunRashiProblems,
  ...genzProblems,
];

// ─── Seed runner ──────────────────────────────────────────────────────────────

export async function seed() {
  console.log(`Seeding ${ALL_PROBLEMS.length} problems...`);

  // Insert in batches of 100
  for (let i = 0; i < ALL_PROBLEMS.length; i += 100) {
    const batch = ALL_PROBLEMS.slice(i, i + 100);
    await db.insert(problemsTable).values(
      batch.map((p) => ({
        title:       p.title,
        description: p.description,
        category:    p.category,
        severity:    p.severity,
        tags:        p.tags,
        solutions:   p.solutions as any,
        sortOrder:   p.sortOrder,
      }))
    ).onConflictDoNothing();
    console.log(`  Inserted batch ${i / 100 + 1} (${Math.min(i + 100, ALL_PROBLEMS.length)}/${ALL_PROBLEMS.length})`);
  }

  console.log("Seed complete.");
}
