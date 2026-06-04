// ─── Lumble Content Library ───────────────────────────────────────────────────
// All user-facing content is hardcoded here and selected deterministically
// by the personalization engine based on real Kundli signals.
// Same inputs → same outputs, always.

// ─── Moon sign deep profiles ──────────────────────────────────────────────────
// Indexed 0–11: Mesha … Meena

export interface MoonProfile {
  coreWound: string;
  fear: string;
  blindspot: string;
  attachment: string;
  dealbreaker: string;
  getHooked: string;
  redFlag: string;
  needsToHear: string;
  insight: string;
  solution: string;
  insecurityHook: string;
  // Short descriptors used by oracle & personalization engine (optional — fall back to profile fields)
  emotion?: string;
  need?: string;
  give?: string;
  quoteCategory?: string;
}

export const MOON_PROFILES_DEEP: Record<number, MoonProfile> = {
  // 0 Mesha
  0: {
    emotion:"acts first, feels later", need:"to be chased back", give:"passion and urgency", quoteCategory:"growth",
    coreWound:     "They loved someone who never matched their energy and concluded it was their fault for being too much.",
    fear:          "Being ignored. Not the relationship ending — being treated like they don't matter while it's still alive.",
    blindspot:     "They chase people who are unavailable and call it passion. They mistake anxiety for attraction.",
    attachment:    "Anxious-activated. They move fast, commit hard, and interpret distance as rejection before it is one.",
    dealbreaker:   "Being made to wait without explanation. Silence from someone they've given everything to.",
    getHooked:     "By someone who challenges them intellectually and then goes just slightly cold. The chase becomes the point.",
    redFlag:       "They ignore how someone treats them under pressure because the good moments feel so good.",
    needsToHear:   "Your intensity is not the problem. The wrong person made it a problem.",
    insight:       "You move fast because you feel deeply. But you often decide someone is the one before you've seen them when things go wrong.",
    solution:      "Watch how they behave in the first disagreement. That moment tells you more than six months of good times.",
    insecurityHook:"You keep asking if you were too much — but the real question is whether they were enough.",
  },
  // 1 Vrishabha
  1: {
    coreWound:     "They stayed loyal to someone who used their stability as a safety net while keeping options open.",
    fear:          "Being replaced quietly. Not a dramatic ending — just being slowly phased out while they kept showing up.",
    blindspot:     "They confuse comfort for compatibility. If it feels safe and familiar, they stay longer than they should.",
    attachment:    "Secure-but-slow. They need time to open, and once open, they do not leave easily. This is both their strength and their trap.",
    dealbreaker:   "Dishonesty. Not the dramatic lie — the small, ongoing inconsistencies that they notice but are told they're imagining.",
    getHooked:     "By someone who feels like home from the beginning. Warmth, physicality, and presence pull them in completely.",
    redFlag:       "They give people the benefit of the doubt past the point where the data is clear.",
    needsToHear:   "Loyalty is a gift. But giving it to someone who hasn't earned it isn't love — it's hope.",
    insight:       "You don't leave when you should because leaving means admitting the investment was wrong. Sunk cost is your blind spot.",
    solution:      "Ask yourself: if you'd just met this person today, would you choose them? The gap between that answer and what you're doing is the information.",
    insecurityHook:"You've been so consistent for them. The question you won't ask is: have they been consistent for you?",
  },
  // 2 Mithuna
  2: {
    coreWound:     "They were misunderstood by someone they thought really got them — and they haven't fully trusted that anyone can since.",
    fear:          "Being known and then found boring. Or worse: being known and then found too complicated.",
    blindspot:     "They use analysis to avoid feeling. When something hurts, they intellectualise it rather than sit inside it.",
    attachment:    "Ambivalent. They want closeness but create distance when it gets too real. Push-pull is their default rhythm.",
    dealbreaker:   "Emotional rigidity. Someone who can't update their view of them as they grow.",
    getHooked:     "By someone who can match them intellectually and then surprises them emotionally. The combination is rare — and addictive.",
    redFlag:       "They stay in connections where they're doing all the emotional labour because the conversation is stimulating.",
    needsToHear:   "You're not too complicated. You just haven't found someone with the patience to read you properly yet.",
    insight:       "You talk about your feelings so fluently that people assume you've processed them. You often haven't.",
    solution:      "Sit with the feeling before you explain it. The explanation is defence. The feeling is the truth.",
    insecurityHook:"You keep wondering if they're losing interest — but ask yourself if you've let them actually see you yet.",
  },
  // 3 Karka
  3: {
    coreWound:     "They gave someone their full emotional world and that person didn't protect it. Exposure followed by abandonment.",
    fear:          "Being emotionally naked and then left. Having someone see all of them and then choose to go.",
    blindspot:     "They absorb other people's emotions as their own and can't tell where they end and the other person begins.",
    attachment:    "Deeply anxious. They love in waves — intensely present, then retreating to protect themselves, then feeling guilty for retreating.",
    dealbreaker:   "Emotional unavailability. They can handle conflict. They cannot handle someone who refuses to feel.",
    getHooked:     "By someone who needs them. Being needed activates their deepest comfort mechanism — even when the person is wrong for them.",
    redFlag:       "They mistake someone needing them for someone loving them. These are different things.",
    needsToHear:   "You are not responsible for regulating other people's emotions. That was never the agreement.",
    insight:       "You became the caretaker because it felt safer than being taken care of. Vulnerability goes both directions.",
    solution:      "Let someone take care of you once, even when it's uncomfortable. Their response to that moment is the real data.",
    insecurityHook:"You've been so available for them. The question you're afraid to ask is: would they do the same for you?",
  },
  // 4 Simha
  4: {
    coreWound:     "They loved someone who took their warmth, their generosity, their full presence — and still looked elsewhere.",
    fear:          "Being ordinary in someone's eyes. Being loved, but not being the person they're proudest of.",
    blindspot:     "They perform strength so well that people don't know when they're actually struggling. Then they feel alone in it.",
    attachment:    "Proud-but-loyal. They need to be chosen publicly, consistently, and with genuine enthusiasm. Anything less reads as rejection.",
    dealbreaker:   "Being dismissed or minimised. Having their feelings treated as dramatic when they're real.",
    getHooked:     "By someone who makes them feel like the most interesting person in the room — especially if that person is also a little elusive.",
    redFlag:       "They stay with people who are impressive on the outside but don't actually see them.",
    needsToHear:   "You don't have to be performing to deserve love. You were enough before you became impressive.",
    insight:       "The attention you seek from them is really the acceptance you've been trying to find for yourself.",
    solution:      "Ask: does this person see me when I'm not my best self? That's the only version of being seen that matters.",
    insecurityHook:"You've been so generous with them. The question you avoid is: do they actually see you, or just what you give?",
  },
  // 5 Kanya
  5: {
    coreWound:     "They gave everything perfectly and it still wasn't enough. So now they give more perfectly. And it's still not enough.",
    fear:          "Being loved imperfectly. Accepting love that has flaws in it — because what if the flaws mean it's not real?",
    blindspot:     "They use criticism of the relationship as a way to not feel how much they actually care. Analysis as armour.",
    attachment:    "Anxious-perfectionist. They improve the relationship the way they improve themselves — by cataloguing what's wrong.",
    dealbreaker:   "Inconsistency without explanation. They can handle imperfection if it's honest. They cannot handle gaps in the story.",
    getHooked:     "By someone who appears to need improving. The project gives them a reason to stay close without being vulnerable.",
    redFlag:       "They stay in situations that don't work because they believe if they just do one more thing right, it will.",
    needsToHear:   "You are not a rough draft. You don't have to earn love by being better.",
    insight:       "You see their flaws clearly but stay. The question isn't whether you can improve this — it's whether you should.",
    solution:      "Write down the three things you're trying to fix about this connection. Then ask: is any of this actually fixable, or are you just busy?",
    insecurityHook:"You've been trying to get this right for so long. But what if the problem isn't your effort — it's the math?",
  },
  // 6 Tula
  6: {
    coreWound:     "They kept the peace so well that they lost themselves entirely in the process. And nobody noticed because the peace looked so beautiful.",
    fear:          "Being responsible for the end. Walking away and having it be their fault.",
    blindspot:     "They see both sides of everything so clearly that they can't decide which side they're actually on.",
    attachment:    "Harmonious-codependent. They shape-shift to fit whoever they're with. This feels like love. It's also erasure.",
    dealbreaker:   "Being made to choose between themselves and the relationship. But they'll avoid this moment for as long as possible.",
    getHooked:     "By someone who is decisive and pulls them in a clear direction. The relief of someone else choosing is enormous.",
    redFlag:       "They stay in relationships long after their needs have been dismissed, because leaving feels like giving up on beauty.",
    needsToHear:   "You are allowed to want what you want. Having preferences is not the same as being difficult.",
    insight:       "The harmony you create often has nothing under it. You've been maintaining a surface while your actual needs go unmet.",
    solution:      "Say one thing you actually want this week without softening it. Watch what happens. That reaction is the information.",
    insecurityHook:"You've been so understanding of everyone else. Has anyone been that understanding of you?",
  },
  // 7 Vrishchika
  7: {
    coreWound:     "They trusted someone completely, and that person used what they'd shared against them. Now trust is treated like a weapon they might hand over.",
    fear:          "Betrayal from inside the relationship. Not from outside forces — from the one person they'd lowered their defences for.",
    blindspot:     "They can see through everyone else's patterns but are often the last to see what's happening to them.",
    attachment:    "Secure on the surface, volcanic underneath. They test people because they need to know someone can survive their full reality.",
    dealbreaker:   "Deception. Any deception. Including the small ones that 'don't really count.'",
    getHooked:     "By someone who can handle their intensity without flinching. Finding someone unafraid of them is rare. When it happens, it's everything.",
    redFlag:       "They mistake emotional intensity for compatibility. If something brings out their depth, they call it love — even when it's pain.",
    needsToHear:   "You are not too intense. You are calibrated for depth. Most people just aren't built for it.",
    insight:       "You protect yourself so well that sometimes the person you're protecting yourself from is the one who would have stayed.",
    solution:      "Show them one thing you haven't shown anyone else. Their response to that specific vulnerability is the only data that matters.",
    insecurityHook:"You keep wondering if they'd stay if they really knew you. But have you let them close enough to try?",
  },
  // 8 Dhanu
  8: {
    coreWound:     "They loved someone who made them feel small for wanting more — more space, more meaning, more honesty. They've been trying to untangle 'wanting too much' ever since.",
    fear:          "Losing themselves in someone else. Becoming the version of themselves that stopped growing.",
    blindspot:     "They confuse physical/emotional distance with personal freedom. They leave before things get hard rather than growing through it.",
    attachment:    "Avoidant-idealist. They fall for the idea of a person and then panic when the reality shows up.",
    dealbreaker:   "Being asked to shrink. Having someone be threatened by their ambition or their need for freedom.",
    getHooked:     "By someone who gives them the sense that the world is bigger with them in it. Inspiration is the aphrodisiac.",
    redFlag:       "They romanticise potential and call it love, then leave when the potential doesn't materialise.",
    needsToHear:   "Depth doesn't have to mean trapped. You can build something lasting and still be free inside it.",
    insight:       "The next connection you leave because it 'felt limiting' — ask whether the limiting was real or whether you were just afraid of what comes after the beginning.",
    solution:      "Stay through one uncomfortable moment you'd normally escape from. That's where the real version of this exists.",
    insecurityHook:"You keep leaving before things get hard. What if the thing you're running from is actually the thing?",
  },
  // 9 Makara
  9: {
    coreWound:     "They gave everything to something that was never going to work and refused to admit it because they'd already paid so much in.",
    fear:          "Failure. Specifically: investing completely in something and having to admit it was the wrong investment.",
    blindspot:     "They mistake endurance for love. Staying is not the same as choosing.",
    attachment:    "Avoidant-ambitious. They love through acts, not words. They show up. They fix things. They will not say what they feel until they're sure it's safe.",
    dealbreaker:   "Instability. Chaos. Someone who can't be relied on structurally. Even if they love them.",
    getHooked:     "By someone who is working toward something real. Shared ambition and reliability feel like love to them.",
    redFlag:       "They stay with people who don't match them emotionally because they match them logistically.",
    needsToHear:   "You don't have to earn love by being useful. You deserve to be wanted for reasons that have nothing to do with what you provide.",
    insight:       "The relationship you've stayed in longest — ask yourself: are you there because it's right, or because you've built something and leaving means losing the investment?",
    solution:      "Say the one thing you've been calculating whether to say. The calculation is the problem. Just say it.",
    insecurityHook:"You've built so much with them. But building together is not the same as being built for each other.",
  },
  // 10 Kumbha
  10: {
    coreWound:     "They were misunderstood by nearly everyone who mattered and started to believe being known was impossible.",
    fear:          "Being with someone who doesn't actually see them — just a curated version they allowed forward.",
    blindspot:     "They intellectualise emotion so fluently that they can argue themselves out of feelings that are entirely valid.",
    attachment:    "Detached-intense. They appear unbothered. They are not unbothered. They just rarely show the part that's involved.",
    dealbreaker:   "Conformity. Someone who wants them to be more normal. More predictable. Less.",
    getHooked:     "By someone they can't fully figure out. The mystery of another unclassifiable person is intoxicating.",
    redFlag:       "They stay in their head so long the other person has moved on emotionally while they were still analysing.",
    needsToHear:   "Being different is not the same as being difficult. The right person will not need you to be less.",
    insight:       "You've made emotional unavailability into a philosophy. But what you're really doing is protecting yourself from something that already hurt.",
    solution:      "Once this week, respond from feeling before you respond from analysis. Even if it's awkward. Especially if it's awkward.",
    insecurityHook:"You keep watching from the outside wondering if they really want you. What would happen if you stepped inside and asked?",
  },
  // 11 Meena
  11: {
    coreWound:     "They loved someone so completely that they disappeared into them. When it ended, they didn't know who they were anymore.",
    fear:          "Being alone with themselves after a connection ends. The silence is too loud.",
    blindspot:     "They romanticise people so thoroughly that they fall in love with who someone could be rather than who they are.",
    attachment:    "Deeply merged. They experience connection at a spiritual level. When it's mutual, it's extraordinary. When it's not, they don't notice for too long.",
    dealbreaker:   "Cruelty. Any form of it. Especially the casual kind that the person doesn't even register as cruelty.",
    getHooked:     "By someone who feels like recognition — like they've known them before in another life. The uncanny sense of familiarity is the strongest pull.",
    redFlag:       "They stay because they can feel the connection's potential and they can't distinguish that from the connection's reality.",
    needsToHear:   "The love you feel for them is real. The version of them you're in love with might not be.",
    insight:       "You have the deepest capacity for love of any sign. The question is whether what you're pouring it into is a vessel or a drain.",
    solution:      "Write down who they actually are — not who you hope they are, not who they show up as on the good days, but the pattern of behaviour over time. Read it back.",
    insecurityHook:"You feel things others can't even articulate. The tragedy would be spending that depth on someone who can't receive it.",
  },
};

// ─── Nakshatra love fingerprints ──────────────────────────────────────────────

export interface NakshatraProfile {
  pattern:   string;   // recurring behaviour in love
  craving:   string;   // what they're actually looking for
  trap:      string;   // where they consistently get stuck
  strength:  string;   // what they bring that's rare
  shadow:    string;   // what they deny about how they love
}

export const NAKSHATRA_PROFILES: Record<number, NakshatraProfile> = {
  0:  { pattern: "falls fast, heals fast, repeats the cycle", craving: "someone who can match their speed without flinching", trap: "choosing excitement over stability every time", strength: "the ability to begin again without carrying the weight of what ended", shadow: "they leave before they can be left" },
  1:  { pattern: "bonds once and carries it forever, even when they pretend not to", craving: "to be loved the way they love — completely, even past reason", trap: "loyalty to people who have already checked out", strength: "a depth of devotion that most people only read about", shadow: "they grieve connections they'd never go back to" },
  2:  { pattern: "burns through connections that don't challenge them", craving: "transformation — to be changed by someone", trap: "confusing destruction with depth", strength: "passion that genuinely reshapes what it touches", shadow: "they create conflict to feel alive in the relationship" },
  3:  { pattern: "roots quietly and deeply, rarely shows how attached they've become", craving: "safety and constancy — someone whose presence feels like ground", trap: "staying in stable but loveless situations because leaving feels like uprooting", strength: "the ability to build something lasting if the foundation is right", shadow: "they settle for security and call it love" },
  4:  { pattern: "pursues beauty in all its forms and loves whoever represents it at the time", craving: "sensory and emotional richness in one person", trap: "falling in love with aesthetics and confusing them for substance", strength: "they bring beauty into every connection they enter", shadow: "they confuse how someone makes them feel for who that someone is" },
  5:  { pattern: "storms into people's lives and exits the same way", craving: "someone who understands pain intuitively without needing to be explained to", trap: "forming trauma bonds and calling them destiny", strength: "emotional honesty that strips everything to its truth", shadow: "they seek partners who carry similar wounds and wonder why it hurts" },
  6:  { pattern: "returns. always returns to what feels like home", craving: "the feeling of being safe with someone who is also an adventure", trap: "returning to connections long after the returning makes sense", strength: "resilience — their love survives things that would end others", shadow: "they call going back 'knowing what they want'" },
  7:  { pattern: "nurtures so relentlessly that they forget to have needs of their own", craving: "someone who sees through their caretaking and takes care of them back", trap: "giving so much there's nothing left to receive", strength: "they create the conditions for real intimacy", shadow: "they're so focused on the other person that they lose themselves quietly" },
  8:  { pattern: "reads between every line, picks up everything unsaid, and says nothing", craving: "someone they can lower their defences for completely", trap: "their perception creates suspicion — they see too much and trust too little", strength: "they know what's really happening before it surfaces", shadow: "their insight keeps them from being surprised and also from being open" },
  9:  { pattern: "carries past wounds into every new connection and calls it pattern recognition", craving: "to be chosen after earning it — to have someone stay knowing everything", trap: "their dignity becomes distance", strength: "they love with discipline and intentionality — when they choose you, they mean it", shadow: "they withhold love as a form of protection" },
  10: { pattern: "loves in waves — present, then absent, present, then absent", craving: "a love that makes sense, that has logic under the feeling", trap: "they leave when the feeling outpaces the logic", strength: "precision — they don't love carelessly, which means it means something when they do", shadow: "they use analysis to avoid the feeling they're actually in" },
  11: { pattern: "holds everyone they love in extraordinary tenderness, even people who have hurt them", craving: "a love that is also a spiritual practice", trap: "confusing devotion with sacrifice", strength: "they transform whatever they touch with genuine care", shadow: "they are better at giving love than asking for it to be right" },
  12: { pattern: "organises their entire emotional life around the relationship — for better or worse", craving: "partnership in the real sense: someone to build a life with", trap: "making someone their entire world and then wondering why the world feels unstable", strength: "they are fully present — no half-measures, no hedging", shadow: "they manage their fear of abandonment through control" },
  13: { pattern: "builds toward perfection or walks away — no middle state", craving: "someone who matches their standards without being told what those standards are", trap: "the standard becomes a wall that no one can get over", strength: "they create extraordinary things with the right person", shadow: "they weaponise the standard to avoid vulnerability" },
  14: { pattern: "moves through the world and its people like wind — touching everything, held by nothing", craving: "someone who gives them space and still stays", trap: "they create space until the space swallows the connection", strength: "they never cling. this is a gift and also a loss", shadow: "they call avoidance freedom" },
  15: { pattern: "outlasts almost everyone — in love and in grieving", craving: "loyalty that matches theirs", trap: "they endure past the point of return and call it strength", strength: "commitment that doesn't waver", shadow: "they stay because leaving feels like defeat" },
  16: { pattern: "loves devotionally, often past the point where devotion is returned", craving: "reciprocity — to feel that their love is also someone else's religion", trap: "they give everything and are confused when it isn't everything in return", strength: "the depth of their love is rarely encountered", shadow: "devotion becomes martyrdom" },
  17: { pattern: "protects their inner world intensely — loves the few they let in completely", craving: "to be seen without performing, to be known without explaining", trap: "they mistake distance for safety and wonder why they're lonely", strength: "when they trust, the trust is total and real", shadow: "they protect themselves from the very thing they're aching for" },
  18: { pattern: "pulls everything apart to understand it and puts it back together changed", craving: "a love that can survive honesty, including the honest parts that hurt", trap: "they mistake intensity for truth and crisis for intimacy", strength: "radical honesty that creates real change", shadow: "they create the rupture they're afraid of" },
  19: { pattern: "seeks the horizon — in people as in everything", craving: "expansion, discovery, a love that makes the world larger", trap: "adventure over depth — they move on before things get real", strength: "they bring freedom into connection", shadow: "they call running 'not being held back'" },
  20: { pattern: "sets impossible targets and meets most of them, including in love", craving: "a partner who is an equal in the truest sense", trap: "they schedule love and wonder why it feels efficient instead of alive", strength: "they build things that last", shadow: "they love with strategy because vulnerability feels like losing" },
  21: { pattern: "listens until they know exactly who you are, then keeps that knowledge close", craving: "to feel truly heard by someone who doesn't need them to be anything other than what they are", trap: "they give others full attention and wonder why no one gives them the same", strength: "profound emotional memory — they don't forget what matters", shadow: "they make others feel known without knowing themselves" },
  22: { pattern: "vibrates at a frequency most can't tune into — the rare one who can becomes everything", craving: "resonance — to feel genuinely understood at a level most connections don't reach", trap: "the standard of resonance is so high that most connections are dismissed before they've had a chance", strength: "when they bond, it's at a frequency that doesn't break easily", shadow: "they're lonely and call it being selective" },
  23: { pattern: "cycles through attachment and detachment in patterns that seem random but aren't", craving: "freedom within commitment — the paradox of staying while not being held", trap: "they run from the closeness they seek", strength: "they can hold love lightly, which sometimes is what it needs", shadow: "inconsistency as self-protection" },
  24: { pattern: "loves unconventionally and refuses to do it any other way", craving: "someone who sees the world differently and wants to build something unique inside that shared vision", trap: "they choose people who are interesting over people who are right for them", strength: "they create extraordinary connections when they find someone who can match them", shadow: "they mistake unusual for compatible" },
  25: { pattern: "withdraws to process then returns changed — the cycle is their love language", craving: "a partner who can be with them in silence without reading it as rejection", trap: "they withdraw too long and the connection dies in the gap", strength: "their love deepens with time in ways that surprise even them", shadow: "they need solitude to love well and lose people who need presence" },
  26: { pattern: "guides every person they love toward something — including themselves", craving: "a love that is also a destination, that leads somewhere real", trap: "they nurture others' growth while neglecting their own", strength: "they make people feel seen and pointed toward their best selves", shadow: "they love people for who they could be, not who they are" },
};

// ─── Dasha relationship chapters ─────────────────────────────────────────────

export interface DashaChapter {
  headline:          string;
  theme?:            string;   // single-word theme (identity / love / action …)
  quoteCategory?:    string;   // which quote pool fits this dasha
  relationshipEffect:string;
  challenge:         string;   // the hard part
  gift:              string;   // what it offers
  warning:           string;   // what to avoid
  lessonForLove:     string;   // the thing to learn
  oracleContext:     string;   // how the oracle references this
}

export const DASHA_CHAPTERS: Record<string, DashaChapter> = {
  Surya: { theme:"identity", quoteCategory:"self",
    headline:          "A period of identity — who you are in love, not just whether you're loved.",
    relationshipEffect:"Relationships face a reckoning: do they serve who you are becoming, or who you used to be? Ego and love compete loudly.",
    challenge:         "You may need to be right more than you need to be close. This breaks things.",
    gift:              "Clarity about what you actually want — possibly for the first time.",
    warning:           "Don't mistake the clarity for permission to be careless with someone who has been loyal.",
    lessonForLove:     "A relationship that can't survive your full self was never going to survive anyway.",
    oracleContext:     "in your Surya mahadasha, identity is the theme — who you are in love, not just whether you're loved",
  },
  Chandra: { theme:"emotion", quoteCategory:"intuition",
    headline:          "A period of deep feeling — everything in love is amplified, including the fear.",
    relationshipEffect:"Emotional life intensifies completely. You feel more, need more, absorb more. The connection becomes either nourishing or draining at an extreme.",
    challenge:         "Emotional overwhelm creates reactions that look like overreaction but aren't.",
    gift:              "Intuition about this connection is at its sharpest. What your gut says right now is worth listening to.",
    warning:           "Don't make permanent decisions from temporary emotional flooding.",
    lessonForLove:     "What you feel is real data, even when it's inconvenient.",
    oracleContext:     "in your Chandra mahadasha, emotional truth is surfacing — the question is what to do with it",
  },
  Mangal: { theme:"action", quoteCategory:"growth",
    headline:          "A period of action — what you've been sitting with needs to become a decision.",
    relationshipEffect:"Patience runs thin. Things that have been unresolved start requiring resolution. Conflict is more likely — and so is breakthrough.",
    challenge:         "Impatience creates friction. You want answers now. The other person may not be ready.",
    gift:              "The courage to name what you actually want, out loud, directly.",
    warning:           "Aggression isn't the same as honesty. Know the difference.",
    lessonForLove:     "Saying the hard thing with care is the only kind of honesty that builds something.",
    oracleContext:     "in your Mangal mahadasha, action is being called for — what you've been circling needs a direct response",
  },
  Budh: { theme:"discernment", quoteCategory:"communication",
    headline:          "A period of discernment — you see the dynamic more clearly now. Trust that.",
    relationshipEffect:"Your perception of the relationship sharpens considerably. You can see patterns you couldn't before. This is both useful and uncomfortable.",
    challenge:         "Overthinking becomes the primary way you avoid doing anything.",
    gift:              "Ability to see the relationship as it actually is, not as you need it to be.",
    warning:           "Analysis without action is just anxiety with better vocabulary.",
    lessonForLove:     "Clarity is only useful if you act on it.",
    oracleContext:     "in your Budh mahadasha, you can see this pattern clearly — the question is whether you'll act on what you see",
  },
  Brihaspati: { theme:"expansion", quoteCategory:"growth",
    headline:          "A period of expansion — this connection either grows with you or gets left behind.",
    relationshipEffect:"You're growing, and you're becoming aware of whether this connection is growing with you. Relationships that are too small for who you're becoming feel suffocating.",
    challenge:         "Outgrowing someone you genuinely love. Having to choose between growth and loyalty.",
    gift:              "Wisdom about what love should actually feel like, versus what you've been accepting.",
    warning:           "Don't mistake restlessness for incompatibility. Sometimes you're growing, not leaving.",
    lessonForLove:     "A love that doesn't expand you is contracting you.",
    oracleContext:     "in your Brihaspati mahadasha, you're being asked to grow — and the relationship has to answer whether it's coming with you",
  },
  Shukra: { theme:"love", quoteCategory:"love",
    headline:          "A period of love — the most relationship-active of all dashas. What happens now tends to last.",
    relationshipEffect:"The highest potential for deep connection. New love that forms in this period has unusual staying power. Existing connections either deepen significantly or clarify as wrong.",
    challenge:         "The desire to romanticise overrides the ability to see clearly.",
    gift:              "This is the dasha built for love. What you build in it has foundation.",
    warning:           "This period amplifies everything — including the wrong connections. Beauty is not the same as right.",
    lessonForLove:     "The connection you're in during this dasha will teach you more about love than anything before.",
    oracleContext:     "in your Shukra mahadasha, the universe is pointing you toward love — the question is whether you're choosing the right direction to look",
  },
  Shani: { theme:"structure", quoteCategory:"patience",
    headline:          "A period of structure — what's real survives. What isn't, won't.",
    relationshipEffect:"This phase removes what was never solid. This is painful and necessary. Connections that make it through this period are genuinely built to last.",
    challenge:         "Everything in love feels effortful. Distance can feel like loss when it's actually just pace.",
    gift:              "What's still standing at the end of this period is the real thing.",
    warning:           "Don't interpret the difficulty as incompatibility. This period tests — it doesn't condemn.",
    lessonForLove:     "Easy isn't the standard. Solid is the standard.",
    oracleContext:     "in your Shani mahadasha, love is being tested for what's real — what endures this period was always meant to",
  },
  Rahu: { theme:"obsession", quoteCategory:"intuition",
    headline:          "A period of intensity — everything feels more charged and significant than usual. Some of it is real. Some of it is the intensity itself.",
    relationshipEffect:"Connections that form or intensify during this phase feel magnetic and hard to release. The intensity is real. But intensity and alignment are different things.",
    challenge:         "The addictive quality of connection in this period — whether it's healthy or not.",
    gift:              "Breaking patterns that have followed you through multiple relationships.",
    warning:           "Love that starts in this phase is often exactly what you needed to experience and exactly what you shouldn't stay in forever.",
    lessonForLove:     "The most intense thing you've ever felt isn't always the most right.",
    oracleContext:     "in your Rahu mahadasha, what you're feeling has a karmic charge — the question is whether the karma is being resolved or repeated",
  },
  Ketu: { theme:"release", quoteCategory:"healing",
    headline:          "A period of release — something has to go. The question is whether you'll let it go willingly.",
    relationshipEffect:"This phase strips away what's not essential. Connections without a genuine foundation tend to dissolve. This is painful and also right.",
    challenge:         "The dissolution feels like failure. It isn't. It's refinement.",
    gift:              "What you release in this period creates space for something finally aligned.",
    warning:           "Don't hold on to what's leaving just because letting go feels like giving up.",
    lessonForLove:     "Some connections are meant to teach you what you're not, so you can find what you are.",
    oracleContext:     "in your Ketu mahadasha, release is the lesson — what's leaving was always meant to, even if it doesn't feel that way",
  },
};

// ─── Koota breakdown narratives ───────────────────────────────────────────────

export interface KootaNarrative {
  label:      string;
  weakText:   string;
  strongText: string;
  fix:        string;   // what helps compensate for weakness
}

export const KOOTA_NARRATIVES: Record<string, KootaNarrative> = {
  Varna: {
    label:      "Varna — life priorities",
    weakText:   "Your default life priorities sit at different levels. This shows up as one person always feeling like the other doesn't take the important things seriously enough — or takes them too seriously.",
    strongText: "Your life priorities are aligned at a foundational level. You move in the same direction without having to negotiate it.",
    fix:        "Explicitly agree on what matters most — not what should matter, but what actually does. The gap is usually about values that were never spoken.",
  },
  Vashya: {
    label:      "Vashya — influence balance",
    weakText:   "Influence flows unevenly between you. One person consistently has more pull, and the other adjusts more. This creates invisible resentment on both sides.",
    strongText: "The influence between you flows mutually. Neither person is consistently bending toward the other — the balance is felt even when it isn't named.",
    fix:        "Name who adjusts more often. Not to blame — to make it visible so both people can choose it consciously.",
  },
  Tara: {
    label:      "Tara — readiness timing",
    weakText:   "Your emotional readiness tends to be out of sync. One of you is ready for what the other isn't — and it keeps switching. You arrive at the same place at different times.",
    strongText: "Your emotional readiness tends to align. When you're both ready for something, you tend to be ready at the same time. This is rarer than it sounds.",
    fix:        "When the timing feels off, name it. 'I'm ready for this, are you?' The friction here is about readiness, not compatibility.",
  },
  Yoni: {
    label:      "Yoni — intimate compatibility",
    weakText:   "Your intimate compatibility requires more conscious effort. The natural frequency between you in close contact is slightly discordant — manageable but present.",
    strongText: "Your intimate compatibility is built in. Physical and energetic closeness between you is natural, not constructed.",
    fix:        "Build physical rituals that aren't goal-oriented. Proximity without agenda reduces the friction in this area.",
  },
  "Graha Maitri": {
    label:      "Graha Maitri — mental compatibility",
    weakText:   "Your mental styles don't naturally align. This means mental understanding takes effort — you process information in ways that feel slightly foreign to each other.",
    strongText: "Your mental styles are naturally compatible. You understand each other's logic without needing to translate it.",
    fix:        "When you feel misunderstood, slow down and describe how you reached the conclusion, not just what the conclusion is. The gap is in the process, not the intent.",
  },
  Gana: {
    label:      "Gana — temperament",
    weakText:   "Your fundamental temperaments are different. Under stress, you escalate in opposite directions — one withdraws, one pursues. Neither response is wrong. Together, they create the push-pull.",
    strongText: "Your temperaments match. You approach life's emotional challenges with the same basic instincts. This doesn't mean you never conflict — it means conflict feels navigable.",
    fix:        "Agree in advance on a signal for 'I need space' that isn't the same as 'I'm pulling away.' The confusion between these is where Gana friction lives.",
  },
  Bhakoot: {
    label:      "Bhakoot — emotional current",
    weakText:   "There's a structural push-pull in your connection. One person feels closer at exactly the moment the other needs space. This cycle doesn't have a clear cause — which makes it maddening.",
    strongText: "No push-pull friction. The emotional current between you flows without the structural pattern that creates the classic 'one step forward, two steps back' dynamic.",
    fix:        "When the push-pull starts, name the pattern specifically: 'We're in the cycle again.' Naming it creates enough distance from the pattern to interrupt it.",
  },
  Nadi: {
    label:      "Nadi — energy compatibility",
    weakText:   "You share a similar emotional energy type, which creates strong resonance but also, over time, energy depletion. You may feel drained by each other in ways you can't explain.",
    strongText: "Your emotional energy types complement each other naturally — neither person is competing with the same frequency.",
    fix:        "Build deliberate restoration time both together and separately. Couples with similar energy types need more solo recharge time than others.",
  },
};

// ─── Relationship type dynamics ───────────────────────────────────────────────

export interface RelTypeDynamic {
  headline:     string;
  reality:      string;   // what's actually happening in this dynamic
  mainFear:     string;   // what both people are afraid of
  mainTrap:     string;   // where this type usually gets stuck
  whenItWorks:  string;
  whenItDoesnt: string;
  keyQuestion:  string;   // the question that determines everything
}

export const REL_TYPE_DYNAMICS: Record<string, RelTypeDynamic> = {
  crush: {
    headline:     "Everything is potential. Nothing is confirmed. That gap is where it lives.",
    reality:      "A crush exists almost entirely in projection. What you're in love with is partly them and partly who you've decided they are based on limited data. Both can be true and both matter.",
    mainFear:     "That saying something will end the possibility. That the version in your head is better than the version in reality.",
    mainTrap:     "Staying in the crush phase indefinitely because possibility feels better than risk.",
    whenItWorks:  "When both people are in the same phase of feeling — sensing each other without naming it, building toward honesty.",
    whenItDoesnt: "When one person is all-in emotionally and the other is just enjoying being admired.",
    keyQuestion:  "Is what you feel for who they actually are, or for who you've imagined them to be?",
  },
  situationship: {
    headline:     "The label is being withheld. The feelings are not.",
    reality:      "A situationship exists because at least one person is getting the benefits of a relationship without the responsibility of one. The question is always which one — and whether you're the one getting less.",
    mainFear:     "That asking for clarity will end it. That naming it kills it. That the other person doesn't feel the same and will leave if they're asked directly.",
    mainTrap:     "Staying in ambiguity because ambiguity is a form of hope. If nothing is defined, nothing is over.",
    whenItWorks:  "When both people genuinely need time to know what they want and are honest about being in that process.",
    whenItDoesnt: "When one person knows they don't want commitment and hasn't said so. Usually: when you know.",
    keyQuestion:  "If nothing changed in the next 6 months — no label, no commitment — would you stay? Your honest answer is the answer.",
  },
  relationship: {
    headline:     "You chose each other. The question is whether you keep choosing.",
    reality:      "The beginning was different. What exists now is a choice that has to be remade, continuously, in small ways and occasionally in large ones. The romance that stays isn't accidental — it's tended.",
    mainFear:     "That you've both changed and the people you've become might not be as compatible as the people you were.",
    mainTrap:     "Coasting — assuming the choice was made and doesn't need to be renewed.",
    whenItWorks:  "When both people prioritise the version of themselves that's growing, and build together from that place.",
    whenItDoesnt: "When the relationship becomes the identity instead of the partnership. When who you are outside of it is unclear.",
    keyQuestion:  "Are you choosing this person, or are you choosing the comfort of what you've built together? There's a difference.",
  },
  ex: {
    headline:     "It ended. The feelings didn't. That's not a contradiction — it's just grief.",
    reality:      "The attachment doesn't end when the relationship does. The brain treats loss the same way whether it's a person or a pattern. What you miss might be them — or it might be the version of yourself that existed in that connection.",
    mainFear:     "That it was the one and you let it go. Or that it was never right and you wasted the years.",
    mainTrap:     "Returning out of familiarity rather than genuine alignment. Going back because forward feels unknown.",
    whenItWorks:  "When both people have genuinely changed, know specifically how, and have that conversation honestly.",
    whenItDoesnt: "When returning means going back to the same dynamic with the same unspoken agreement to not change it.",
    keyQuestion:  "If you went back right now, what would actually be different? Not hoped — different. Name it specifically.",
  },
};

// ─── Oracle response library ──────────────────────────────────────────────────
// 8+ responses per intent, all hardcoded, selected deterministically by
// hash(intent + userNakshatra + partnerNakshatra + messageLengthBucket)

export const ORACLE_LIBRARY: Record<string, string[]> = {
  misses_me: [
    "{{p}}'s emotional pattern is one that {{pNakPattern}}. That kind of attachment doesn't switch off cleanly. Something of you is still present in them — but carrying someone and being ready to act on it are two different things. The more useful question: what would you do with a yes? Because what you'd do reveals something about where you actually are right now — not just where they are.",
    "{{p}} has a {{pMoon}} emotional style, which means they process through {{pMoonStyle}}. Memory and attachment work quietly in people like that. They're probably carrying something real. But there's a deeper question underneath this one that's worth asking me directly — something about why this question matters to you right now, and what you're actually hoping to hear.",
    "Your compatibility tells a story: {{gunaVerdict}}. That kind of connection doesn't disappear completely. Something persists. But here's what matters more — the question of whether they miss you is keeping you from the more important question of what you want to build next.",
    "You have a way of forming emotional impressions on people — {{uNakPattern}}. The connection you had with {{p}} left marks they may not be fully conscious of. But missing someone and being ready to do something about it are two different things. Only one of them is in your control.",
    "{{p}}'s emotional style — processing through {{pMoonStyle}} — means attachment tends to stay below the surface long after the visible connection ends. Something probably remains. But the phase you're in right now — {{dashaPhase}} — is less interested in that question than in what you're going to do with the answer.",
    "Your compatibility profile shows {{gunaVerdict}}. When real resonance exists between two people, it doesn't just vanish. But here's the honest read: the question of whether they miss you is often a way of staying close to something that's already past. What would moving forward actually look like for you?",
    "{{p}}'s emotional pattern tends to {{pNakPattern}}. That kind of attachment outlasts the explicit relationship. Do they miss you? Something persists. But the more important question — the one your current phase of life is asking — is what you want to build next.",
    "The connection between you and {{p}} was real. Real things leave traces. A {{pMoon}} emotional style tends to hold what was genuine quietly, without announcing it. The question isn't just whether they miss you — it's whether you're using that question to stay close to something that's already ended.",
  ],
  loves_me: [
    "Your compatibility shows {{gunaVerdict}}. That's genuine emotional resonance — not projection. But compatibility maps potential, not decisions. {{p}} has the emotional capacity for deep feeling. Whether they're acting from that place right now is a choice that belongs entirely to them. What you can trust: you're not imagining the connection.",
    "{{p}}'s {{pMoon}} emotional style means they tend to feel more than they say, and they express more through behaviour than words. If you're looking for declarations, you might be looking in the wrong direction. Look at what they do when you need something. Look at how they show up when it's inconvenient. That's where this personality type actually speaks — and there's a specific pattern in how {{p}} shows up that's worth looking at more closely.",
    "Your emotional style — {{uMoonStyle}} — and {{p}}'s — {{pMoonStyle}} — are both carrying something. The foundation underneath the feeling is {{gunaVerdict}}. The question you're actually asking is: is what I feel anchored in something real, or am I building on sand? The ground exists. But there's something about how you two handle the places where the ground isn't solid that tells the real story — ask me about that.",
    "You have a strong instinct for reading emotional truth. What that instinct is saying right now — before the doubt, before the second-guessing — is usually accurate. A {{pMoon}} emotional style doesn't perform caring that isn't there. It performs the opposite: it hides caring that is. If something real is present, it shows up as consistency in small things, not grand statements.",
    "{{p}}'s emotional pattern tends toward {{pNakPattern}}. That kind of attachment isn't casual. If you've seen that pattern from them — if the signature matches what you've actually observed — that's your answer. Your compatibility profile gives you the fingerprint. You have to match it to what you've seen.",
    "Your current phase — {{dashaPhase}} — shapes what you're able to receive right now. There's a difference between someone loving you and you being in a place to fully feel it. Both things can be true simultaneously. Something real exists between you. Your capacity to receive it is also part of the equation.",
    "Your compatibility profile shows {{gunaVerdict}} — the emotional resonance between you is genuine. You have a real foundation. What you don't have clarity on is whether {{p}} is in that same place right now — and that question is about their choices and readiness, not about the connection's reality.",
    "{{p}}'s pattern in love is {{pNakPattern}}. That pattern tends toward {{pNakCraving}}. You're asking if love is there — and the honest answer is: the emotional capacity is. The willingness to act on it is a separate question entirely. One thing your own emotional instincts know: you can tell the difference between someone who feels something and someone who shows up for it. Trust that.",
  ],
  come_back: [
    "Whether someone returns isn't about timing alone — it's about both people having done something genuinely different with what they learned, and being honest about what that is. Your current phase — {{dashaPhase}} — is relevant here. The door hasn't sealed. Whether it opens depends on choices belonging to both of you. What's in your control: being clear about what a return would need to actually be different.",
    "{{p}}'s emotional pattern is {{pNakPattern}}. That pattern has a specific relationship with return — there's often a tendency to go back to what felt real, sometimes past the point where it makes sense. The question isn't whether they'll come back. It's: if they did, what would need to be specifically different? Write that down. That list is also a map of something important about what you actually need — not just from {{p}}, but in general.",
    "Your compatibility shows {{gunaVerdict}}. At that level, endings rarely feel complete — because they aren't, entirely. The connection persists. But that isn't an instruction — it's an invitation to do something different with what was left unresolved. There's a specific thing that was never resolved between you that matters more than whether reunion happens. Ask me what I think it is.",
    "{{p}}'s {{pMoon}} emotional style tends to process through {{pMoonStyle}}. When it comes to return, that style usually needs space to move forward on its own — not pursuit. The better question: what would you need to see from them, specifically? Your clarity about that is more magnetic than anything else you could do.",
    "Your current phase — {{dashaPhase}} — is the context you're bringing to this. What this phase supports: {{dashaGift}}. Return rarely works if it goes back to the same dynamic. The question both people have to answer honestly: what has actually changed, and can you name it specifically?",
    "The emotional weight between you doesn't clear completely when a relationship ends. That weight is real. What it doesn't tell you is the timeline or who makes the decision. Your own emotional pattern — {{uNakPattern}} — is worth understanding here. How does that pattern interact with a potential return?",
    "Return requires two things: both people having done something different with what they learned, and the honesty to name specifically what that is. The resonance exists — it didn't disappear when the relationship paused. What you're both deciding is whether to pick up the connection with new hands. Neither choice is wrong. Only one is honest about what's actually changed.",
    "{{p}}'s {{pMoon}} emotional style processes return through action — they move toward or don't, and the ambiguity you're living in now is itself information. When someone with that style wants to come back, you feel it in their initiation, not their absence. What you're experiencing right now — what specific behaviour — is the actual data. Not what you hope it means. What it actually is.",
  ],
  should_text: [
    "The honest answer depends on what you'd say. Your emotional style — {{uMoonStyle}} — means an opener without real content won't feel resolved for either of you. {{p}}'s pattern is {{pNakPattern}}, and that doesn't respond well to ambiguity. If you reach out, say the real thing. Your current phase is asking for directness — this is one place to practise it.",
    "Reaching out from fear — that the window will close, that they'll forget — tends to produce outcomes that don't hold. Reaching out from clarity — knowing what you want to say and why — is different. The question isn't whether to text. It's whether you've found the sentence that's actually true. When you have it, you won't need to ask.",
    "{{p}}'s emotional pattern — {{pNakPattern}} — responds to honesty and directness. Their strength is {{pNakStrength}}. What doesn't land: testing messages designed to get a reaction rather than start a real conversation. If what you want to say is real, say it plainly. The straightforward version always lands better than the calculated one. And there's something specific about how {{p}} receives directness that might surprise you — ask me.",
    "You process connection through {{uMoonStyle}}. Reaching out is natural to you — it's how you close an emotional loop. But {{p}} processes through {{pMoonStyle}}. A message that feels complete to you might land differently for them. The right text isn't about what relieves your anxiety — it's about what opens a real conversation. There's also something about the timing here that matters more than the words. Worth asking about.",
    "You're circling this question because you already know what you want to say but haven't given yourself permission to say it. Your current phase — {{dashaPhase}} — is asking you to act from truth rather than strategy. The test isn't whether to reach out. It's whether you can say the thing directly. If you know what you'd actually say, that's the message.",
    "There's no perfect moment for a text. What there is: the moment when what you'd say is true without being designed to produce a specific response. Your emotional pattern — {{uNakPattern}} — includes a relationship with directness. This is an opportunity to use it. Not the clever message. Not the one that gives you deniability. The honest one.",
    "{{p}}'s pattern is {{pNakPattern}}. What lands with them is realness, not strategy. If you're still asking whether you should text, you're probably still in the strategic version of it. The moment you know exactly what you want to say without needing to calculate the response — that's when reaching out makes sense. What would you say if you knew they'd receive it exactly as you meant it?",
    "Your current phase — {{dashaPhase}} — has a specific relationship with how you initiate. What it supports: clear, direct action from knowing what you want. What it doesn't support: testing the waters in ways that leave you more uncertain than before. Write the message you actually want to send. Read it back. Ask: is this true, or is this a way to feel closer to the answer without asking the actual question?",
  ],
  why_left: [
    "{{p}}'s emotional pattern is {{pNakPattern}}. When someone with that pattern pulls away, it's rarely about the surface reason — it's usually about something in the dynamic triggering an older response, one that predates you. Your instincts probably sensed this. The question that matters more: what did this pulling away teach you about what you need? Because there's something specific there that keeps repeating across connections — and it has a pattern worth naming.",
    "{{p}}'s {{pMoon}} style processes emotional overload through {{pMoonStyle}}. Withdrawal is often that style's version of self-regulation — not rejection, but retreat. The problem is it registers as rejection to someone wired for emotional presence. The gap between what they were doing and what you experienced is where most of the pain lives. There's also something about your own pattern in this — how you typically respond to distance — that shapes what comes next. That part is worth examining.",
    "Your emotional stress responses differ. Under pressure, one person moves toward, one moves away — neither response is wrong, but together, when left unnamed, they create a push-pull that exhausts both people. It may not be that they stopped feeling. It may be that the pattern became too heavy without the language to name it.",
    "The departure happened at the level of behaviour. What drove it happened at the level of internal pattern. {{p}}'s {{pMoon}} style — processing through {{pMoonStyle}} — would have pulled away long before any visible signal. What you're probably replaying is looking for the moment you missed. It wasn't a moment. It was a pattern running underneath. Your instincts sensed it. Trust that reading.",
    "{{p}}'s shadow in love is {{pNakShadow}}. That shadow isn't an excuse — it's context. They were probably doing the most emotionally sophisticated thing they were capable of at the time. That may not have been enough. You deserve someone capable of staying through what they started. That's not a small thing to ask for, and it wasn't wrong to ask for it.",
    "Your emotional pattern — {{uNakPattern}} — tends to process loss in a specific way. Your current phase is {{dashaPhase}}. What this phase is asking of you: not to understand the departure completely, but to extract what it clarified about what you actually need. The clarity from someone leaving is often more useful than the clarity from someone staying who shouldn't.",
    "Something real existed between you — {{gunaVerdict}}. Real things leave residue. The question of why they left has multiple layers: the reason they gave, the one they believed, and the deeper pattern. The pattern version: there was invisible tension neither person fully named. Unnamed patterns tend to express themselves as distance.",
    "{{p}}'s pattern in relationships includes {{pNakShadow}} — they were probably managing something that felt too big to name. That doesn't make the departure okay. It makes it explicable. The more useful question: what did the way they left clarify about what you need to ask for more directly in the next connection?",
  ],
  why_fight: [
    "The recurring fight is almost always a surface version of something neither person is saying directly. Your emotional style — {{uMoonStyle}} — and {{p}}'s — {{pMoonStyle}} — respond to stress differently. Under pressure, you're both trying to protect yourself using different instincts. The fight isn't really about the fight. Name specifically what's underneath it.",
    "You process emotion through {{uMoonStyle}}. {{p}} processes through {{pMoonStyle}}. When something important needs to be communicated and both styles activate simultaneously, you're speaking different languages at the same volume. The conflict isn't actually disagreement — it's a translation failure. The fix is slower and harder than winning the argument. And there's a specific thing that keeps getting lost in that translation — worth asking me what it is.",
    "Your emotional styles — {{uMoonStyle}} meeting {{pMoonStyle}} — create a specific kind of friction when things go wrong. Small misalignments become symbolic. You're probably not fighting about what you're fighting about. The surface conflict is a stand-in for something that hasn't been said directly. There's actually a recurring trigger in how you two fight that most people in this dynamic don't see until someone points it out.",
    "The emotional push-pull in your connection — where one person moves closer as the other creates space — is a real structural pattern, not a personal attack. When a disagreement hits that pattern, it amplifies into something that feels much bigger. Knowing that doesn't make it less frustrating, but it changes who the enemy is. The pattern is the enemy, not each other.",
    "Your compatibility highlights a specific area that needs attention: {{weakKootaFix}}. The recurring argument probably has a recurring underlying subject. What is the one thing neither of you has said directly? That's what the fights are about. Saying it once, outside of a fight, makes the fights less necessary.",
    "Your current phase — {{dashaPhase}} — is amplifying the unspoken thing underneath. The conflict that keeps recurring is a symptom of something neither of you has named. Ask: what is the thing we keep not saying? Name it once, directly, when you're not in the middle of a fight.",
    "{{p}}'s {{pMoon}} style tends to hear criticism in neutral statements. Your {{uMoon}} style expresses feeling through {{uMoonStyle}}. The combination means your most neutral expression sometimes lands as critique to them, and their self-protection reads as coldness to you. You're both responding accurately — just to a slightly different version of what the other person meant.",
    "The conflict pattern between you tends to go like this: one person says something true but imperfectly. The other hears the imperfection rather than the truth. Then the conversation becomes about the imperfection instead of what needed to be said. The fix is one person saying: 'I heard what you meant, not just what you said.' That single sentence usually breaks the cycle.",
  ],
  compatible: [
    "Your overall compatibility: {{gunaVerdict}}. The summary matters less than the specifics — where things flow naturally is where to build from, where they require effort is where to pay attention. Compatibility isn't a score — it's information about where to invest. There's one area in particular where your profiles create an unexpected dynamic that most people in this kind of connection don't notice until it's already cost them something.",
    "Compatible doesn't mean easy. Your compatibility profile shows {{gunaVerdict}} — genuine emotional resonance in the areas that matter most for lasting connection. The friction areas are real too. There's one specific friction area between you that tends to show up in a disguised form — it looks like something else until you know what to look for. Ask me about it.",
    "Your strongest compatibility factor: {{strongKootaText}}. Your biggest friction area: {{weakKootaText}}. The friction area is where most of the unanswered questions live. What specifically is happening there right now?",
    "Compatible means being built for something real together — if both people do the work of understanding the specific shape of what they have. Your shape is {{gunaVerdict}}. The question to ask isn't 'are we compatible' — it's 'are we choosing each other in the ways this shape requires?' That answer tells you more than any number.",
    "Compatibility profiles are designed to show you where to pay attention, not whether to continue. The raw material is there. The question worth sitting with is: are you both actively choosing this? Are you working with the friction areas or hoping they'll resolve on their own? Compatibility is potential. The relationship is the choice.",
    "Your compatibility gives you a map: {{strongKootaText}} is where you have natural flow. The area that needs more attention: {{weakKootaFix}}. This is the map. What you do with it is yours.",
    "The most compatible people still have friction — because friction is where growth lives. You have a genuine foundation. Where things flow well: {{strongKootaText}}. Where they need more work: {{weakKootaText}}. This is your map. Are you using it?",
    "Compatible in the deepest sense means: built for something real, if both people understand the specific shape of what they have. Your compatibility shows {{gunaVerdict}}. Genuine resonance exists, and both of you are in phases of life that are either supporting or testing that resonance. The readiness is part of the equation too.",
  ],
  move_on: [
    "Your {{uMoon}} emotional style processes grief through {{uMoonStyle}}. That means the path through this isn't around it — it's through it. Your current phase — {{dashaPhase}} — isn't asking you to hurry. It's asking you to be honest about what you're actually grieving. And there's something specific you're grieving that isn't quite what you think it is — worth finding out.",
    "Your emotional pattern — {{uNakPattern}}. That pattern in grief tends to hold on past the useful point. The attachment is real. So is the question: are you holding on to them, or to the version of yourself that existed in that connection? Those are different griefs. The answer changes everything about what moving on actually requires from you.",
    "Something real was there between you — {{gunaVerdict}}. Real things don't disappear when they end — they transform. The question 'how do I move on' is often really 'how do I stop feeling this.' The answer to the second question is: you don't, at first. The feeling means it was real. You move forward with it, not past it.",
    "Your emotional pattern — {{uNakPattern}} — means this isn't about weakness. It's about how deeply you form attachments. The work isn't to stop feeling. It's to stop measuring your progress by whether you've stopped feeling. Forward and not-feeling are different destinations. One is possible. The other takes the time it takes.",
    "Moving on requires building, not just releasing. Your current phase — {{dashaPhase}} — is asking you to direct your energy somewhere new. The attachment to what ended is partly about having nowhere new to put it. When energy has direction, grief changes shape. Not disappears — changes shape.",
    "Your {{uMoon}} style needs {{uMoonNeed}} in order to heal. If this connection wasn't providing that, part of the grief is for what you were hoping it would be — not just what it was. Your current phase: {{dashaPhase}}. What it asks: not that you stop missing them, but that you stop organising your present around their absence.",
    "You don't move on by deciding to. You do it by building enough in the present that the past stops being the loudest thing. Your current phase is {{dashaPhase}}. The question isn't 'am I over them.' The question is: what am I building right now? When the answer to that gets interesting enough, the first question starts to matter less.",
    "Your current phase — {{dashaPhase}} — has something to offer: {{dashaGift}}. Moving on asks you to direct that gift somewhere. The connection was real. The grief is appropriate. But at some point, the energy you're putting into the past belongs to the next chapter. What would that next chapter actually look like?",
  ],
  future: [
    "Your current phase — {{dashaPhase}} — shapes what's available to you right now. Connections that deepen in this kind of period tend to carry more weight and more permanence. Whether that applies to {{p}} specifically depends on choices being made right now — most of them quietly, in small moments. There's one in particular that matters more than the rest.",
    "Your compatibility shows {{gunaVerdict}}. That's the read on long-term potential. But compatibility is a map, not the destination. The future depends on two ongoing choices: both people showing up honestly, and both people growing. There's a specific pattern in how you two handle growth — or avoid it — that determines which version of this future you actually get.",
    "Your {{uMoon}} style processes the future through {{uMoonStyle}} — which means you're probably imagining many versions of it right now. The honest answer: the version that becomes real is the one you build directly and honestly from today. The one you wait for someone else to create has a much lower probability.",
    "The future isn't written, it's decided. What the picture shows is the energy available to you. Your current phase: {{dashaPhase}}. {{p}}'s life is running a parallel story. Where those stories intersect depends on choices being made now. What's in your hands: what you're building in yourself. That's the variable you control entirely.",
    "The question about the future is often a way of avoiding the question about the present. Your current phase — {{dashaPhase}} — is building toward something. The most useful thing you can do for the future is be precise about what you want — not aspirationally, but practically. What would you need to see from {{p}} specifically?",
    "Something real exists between you and {{p}} — {{gunaVerdict}}. Real material waits for the right conditions. The future isn't about whether the material is there. It's about whether the conditions are being built. Your current phase describes what conditions you're capable of creating right now. That's where the future actually comes from.",
    "The phase you're in — {{dashaPhase}} — has a lesson for love built into it: {{dashaLessonForLove}}. That lesson is directly relevant to the future you're asking about. The future of this connection depends on both people applying that kind of honesty — not waiting for circumstance to solve what only directness can.",
    "Your choices are the boat; the current phase is the river. Where you steer depends on what you decide about {{p}}, about yourself, about what you're willing to ask for directly. The answer isn't hidden. It's reflected back from the most honest version of you.",
  ],
  addicted: [
    "What you're describing is real. Your {{uMoon}} emotional style forms a strong pull toward {{p}}'s energy — and when that connection breaks, your system treats the absence as deprivation. This is neurologically real, not a character flaw. The question worth sitting with: is the intensity coming from genuine resonance, or from a pattern this connection triggers that predates {{p}}? The answer is probably more revealing than the question about them.",
    "Your emotional pattern — {{uNakPattern}}. That's the architecture of this attachment. You form imprints that don't release easily. What you're calling addiction is your system having learned {{p}}'s presence as a baseline. The body keeps seeking what it learned to expect. There's also something specific about what {{p}} activated in you — a particular need — that's worth identifying, because that's the thing that actually needs addressing.",
    "The magnetic pull you're describing often lives in connections where an unfinished emotional pattern gets activated. The intensity is real, but the pull isn't necessarily toward the person. It's toward resolution of a pattern that may predate them. The question worth asking: what would finally feeling this as resolved actually look like?",
    "Your current phase — {{dashaPhase}} — is asking you not to stop feeling the pull, but to examine what the pull is actually toward. Sometimes it's toward {{p}} specifically. Often it's toward the feeling they provided — certainty, intensity, being chosen. Those are different things. Knowing which one this is changes how you move.",
    "The intensity of what you feel isn't a measure of the connection's worth. Your compatibility profile shows {{gunaVerdict}} — real material. But real material can exist in something that was right for one period and not for the next. Your current phase is asking you to distinguish between what was genuinely true and what you've built around it since.",
    "{{p}}'s emotional style processed your connection through {{pMoonStyle}}. When that stopped being directed at you, your system kept looking for the resolution that didn't come. The loop is the addiction — it's not really about {{p}} anymore. It's about the unresolved loop. The resolution doesn't require them. It requires you deciding what it would mean for it to be complete.",
    "Your emotional pattern — {{uNakPattern}}. The same capacity that makes this hurt this much is the capacity that makes you capable of extraordinary love. The work isn't to reduce the capacity. It's to direct it toward something that can receive it fully.",
    "The connection activated something that runs deep in you. Your emotional style — {{uMoonStyle}} — means you process this kind of thing exactly like this. What would help: understanding the specific pattern rather than fighting the feeling. What pattern did this connection trigger that predates {{p}}? That's where the real work lives.",
  ],
  confused: [
    "Your {{uMoon}} emotional style is highly intuitive — you sense what's true before you can name it. When you're confused about {{p}}, pay attention to what you felt before the explanations started. That first read is usually accurate. Confusion often means: you know the answer, but the answer conflicts with what you want the answer to be. The first read you had — before the second-guessing — is worth asking me about directly.",
    "Mixed signals from {{p}} usually mean they're genuinely mixed internally. A {{pMoon}} emotional style can want you and not be ready simultaneously — both things true at once. The confusion isn't in their signal; it's in trying to get a single clear answer from someone who hasn't resolved the question themselves. There's a specific reason {{p}} hasn't resolved it yet that has nothing to do with how they feel about you — and understanding it changes everything.",
    "The confusion is information. Your emotional pattern gives you strong perceptive ability — {{uNakStrength}}. When what you feel doesn't match what you're being told, that gap is the actual data. Not the words. The gap. Your capacity for clarity right now is high. The confusion isn't a failure of perception — it's the signal that something important is being left unsaid.",
    "{{p}}'s emotional pattern is {{pNakPattern}}. That looks like mixed signals from the outside — but it's actually internal conflict they haven't named yet. You deserve someone who's done enough internal work to be clear about where they stand. The question is whether you're willing to ask for that directly.",
    "You read situations accurately. When you're confused, it's usually because the situation is genuinely contradictory — not because your perception is failing. {{p}}'s {{pMoon}} style processes things through {{pMoonStyle}}, which can appear ambiguous from outside. What would clarify it: a direct question, asked once, with genuine patience for the real answer.",
    "The confusion lives in the gap between what {{p}} is showing and what they're saying. Your emotional instincts read that gap accurately. The confusion isn't really yours — it's theirs. They haven't decided. And you've been trying to resolve their indecision by reading the signals more carefully. You can't. Only they can. The question is whether you're willing to name that directly.",
    "You're not lost. You're in the middle of figuring out what you actually want. That looks like confusion from the inside. Keep asking the questions — the answer is forming. What would you need to see from {{p}} to feel clear?",
    "Your {{uMoon}} style needs {{uMoonNeed}}. Part of the confusion might be about whether this connection provides that — and whether you feel allowed to ask for it. Your current phase — {{dashaPhase}} — often clears when the real question gets asked out loud, even just to yourself. What's the thing you're not quite saying yet?",
  ],
  red_flag: [
    "I hear this and want to take it seriously. Your {{uMoon}} emotional style senses safety — or its absence — with genuine accuracy. When that part of you registers alarm, it's not overthinking. It's pattern recognition working correctly. What specifically are you noticing? Not what you're afraid it means — what are you actually observing consistently over time? That specific pattern has a name. Ask me what it is.",
    "Your emotional pattern gives you {{uNakStrength}}. When you're naming something as a red flag, that's your instincts doing their job. The harder question is whether you're willing to act on what you're seeing. The pull to stay, to explain it away — those are real. So is the signal. Both things can be true. And there's something specific about why this pattern is hard to act on for someone with your emotional style — worth understanding before you decide what to do.",
    "{{p}}'s emotional shadow is {{pNakShadow}}. When does that shadow show up? What does it look like when it's present? That specific observation is more useful than any general read. Your own instincts pick up these signals accurately — trust what you're registering.",
    "No compatibility score justifies staying in something that consistently harms you. Real resonance can exist in something that still isn't right for you. Sometimes the most significant connection teaches you exactly what you won't accept. That lesson, arrived at honestly, is worth more than any measure of chemistry.",
    "Your emotional pattern gives you {{uNakStrength}}. That means you read the unsaid things correctly. When something feels wrong, it usually is. The question isn't whether the concern is valid — your instincts don't manufacture alarm where there's none. The question is what you're going to do with the information you're already receiving.",
    "Your instinct is data. Your {{uMoon}} emotional style processes safety and danger at a frequency most people don't consciously register. When it registers something as not-safe, that's not a trigger — that's accuracy. The question: what would you tell your closest friend if they described what you're living right now?",
    "The red flag is almost never in the dramatic moments. It's in the pattern of small things you've explained away — each one individually reasonable, together forming a picture. Your emotional pattern — {{uNakPattern}} — means you're probably carrying more of this than you've said out loud. What's the specific thing you're not naming yet?",
    "Your current phase — {{dashaPhase}} — has a specific relationship with seeing what's real versus what you want to be real. The question right now isn't just about {{p}} — it's about whether you're willing to use the clarity available to you. The answer is there. The question is whether you're looking at it directly.",
  ],
  timing: [
    "Your current phase — {{dashaPhase}} — has a specific relationship with readiness. If this feels too soon or too late, that feeling is telling you something real. The right timing isn't just about external circumstances — it's about internal readiness meeting external opportunity. What's your actual readiness right now? Not the readiness you think you should have — the real one. Because there's something specific you're not ready for yet that's shaping this whole question.",
    "Your emotional pattern moves in cycles — periods of opening and periods of consolidation. Right now, you're in: {{dashaPhase}}. Forcing a connection forward during a consolidation phase tends to produce strain, not depth. There's also something about {{p}}'s current timing — where they are in their own cycle — that intersects with yours in a specific way. That intersection is the thing worth understanding.",
    "'Too late' is rarely actually too late for something meant to happen. 'Too soon' usually means there's growth that hasn't completed yet — in you, in them, or in the connection. Your current phase is {{dashaPhase}}. What this period is building toward is what eventually makes the timing right. The question isn't when. It's whether.",
    "{{p}}'s emotional pattern — {{pNakPattern}} — has a natural rhythm. If the timing between you keeps missing, it may not be permanent misalignment — it may be two people on slightly different cycles trying to synchronise. The question is whether both people are willing to do the work in the gap. Your current phase gives you a specific resource: {{dashaGift}}. That's relevant to this timing question.",
    "Timing is really about readiness. Your readiness in your current phase — {{dashaPhase}} — is the variable. What are you actually ready for right now? Not what you want to be ready for. What you genuinely are ready for.",
    "You sense timing clearly. If something feels off, it probably is — and the source is usually readiness, not circumstance. What you're sensing might be about the timing of this specific move. Or it might be about something you haven't finished building in yourself yet. Which one is it?",
    "Your current phase — {{dashaPhase}} — is the context here. The timing question you're asking has an answer inside that phase. Not 'is it too late' but 'what does this phase support?' Right now, it supports: {{dashaGift}}. Work within that.",
    "Your {{uMoon}} style processes timing through {{uMoonStyle}}. The question worth asking: is the timing you're waiting for external — something {{p}} needs to do — or internal — something you need to be ready for? Your current phase — {{dashaPhase}} — is building internal readiness. What would that readiness actually feel like?",
  ],
  general: [
    "Your {{uMoon}} emotional style is where your truth lives — and right now it's processing something that deserves attention. Your current phase — {{dashaPhase}} — tends to surface things that have been building underneath. What does your gut say about this situation, before the rationalisation starts? Because that first instinct — before you talked yourself out of it — is usually the most accurate thing you know. What was it?",
    "Your compatibility with {{p}} shows {{gunaVerdict}}. The friction area — {{weakKootaText}} — is where most of the unanswered questions live. Not where the love isn't, but where it needs something specific to move through. There's a pattern in how that friction shows up between you that most people don't see clearly until it's pointed out. Ask me to describe it.",
    "Your emotional pattern — {{uNakPattern}} — is showing up in this question. Whatever it's about on the surface, it's also about that pattern. Your current phase is {{dashaPhase}}. The connection between this phase and this question probably isn't coincidental.",
    "You already know more about this than the question implies. Your {{uMoon}} emotional style doesn't ask questions it doesn't already have a feeling about. The question is a way of getting permission to act on what you already sense. What does your first read say, before anything gets complicated?",
    "Your current phase — {{dashaPhase}} — is the lens through which you're seeing this. What does this look like outside of that lens? Imagine the version of you five years from now looking back — what would they say is the most important thing to pay attention to right now?",
    "Your compatibility shows a strength in {{strongKootaText}} and a friction area around {{weakKootaText}}. The strength gives you something to build from. The friction is where most of the unanswered questions live. What specifically is happening in that friction area right now?",
    "Your love style is {{lagnaLoveStyle}}. That's both your gift and your blindspot in this situation. The gift: {{lagunaNeed}}. The blindspot: {{lagnaBlindspot}}. Which one is running right now?",
    "Something real exists between you and {{p}} — {{gunaVerdict}} — and something about it isn't fully resolved. Your current phase — {{dashaPhase}} — is one where that resolution is available. Not by waiting. By asking the question you've been building up to. What is it?",
  ],
};

// ─── Daily reflection messages (for home screen) ──────────────────────────────
// Selected by: moonRashi + dasha + relationshipType + dayOfYear

export const DAILY_REFLECTIONS: Record<string, string[]> = {
  // keyed by "moonRashiIdx-relType" → array of messages, rotated by dayOfYear
  "0-crush": ["Your Aries emotional style is impulsive today — resist sending something before the right words arrive.", "The urgency you feel right now is real. So is the value of waiting one more day.", "Aries energy moves fast when it feels something. Today, let the feeling land before you act on it."],
  "0-situationship": ["Your Aries energy wants answers today. The ambiguity is not about you — it's about their readiness.", "The impatience is the signal, not the problem. What are you actually asking for here?", "With an Aries emotional style in a situationship: you already know what you want. The only question is whether you'll ask for it."],
  "0-relationship": ["Something needs to be said out loud today. Your Aries energy won't be patient much longer.", "The directness you've been softening needs to come out today — cleanly, not as attack.", "Aries partnership energy: choose honesty over harmony today. The harmony will come after."],
  "0-ex": ["Your Aries instinct wants to reach out. Ask yourself: is this coming from clarity or restlessness?", "The pull you feel today is real. So is the question of what reaching out would actually accomplish.", "Aries energy returns when it's decided. The question is whether you've decided or whether you're still deciding."],
  "3-crush": ["Your Cancer emotional style is absorbing their energy today — make sure what you're feeling is yours, not a mirror of theirs.", "The warmth you feel toward them is real. The question is whether they're creating safety, or you're creating it for them.", "Cancer energy falls quietly and deeply. Today, notice whether the falling is mutual."],
  "3-situationship": ["Your Cancer emotional style needs safety that this structure isn't providing. Today, name that to yourself.", "The ambiguity isn't comfortable for you — it was never going to be. Your needs are valid.", "With a Cancer emotional style in a situationship: you deserve someone who matches your emotional availability. Today, assess honestly."],
  "3-relationship": ["Your Cancer emotional style is carrying something today. The caretaking impulse is there — but what do you need?", "The love you give is enormous. Today, let someone give it back to you without deflecting.", "Cancer energy today: your emotional attunement is high. Use it to receive, not just to give."],
  "3-ex": ["Cancer emotional energy holds on long after it should. Today, ask what staying connected to this grief is protecting you from.", "The nostalgia is real. The question is whether you're missing them or missing a version of yourself.", "Cancer energy grieves fully. Today, let yourself feel it — and let yourself also put one thing down."],
  "7-crush": ["Your Scorpio emotional style is reading between every line today. What is the data actually showing, past the interpretation?", "The intensity of what you feel for them is real. Today, separate the intensity from the certainty.", "Scorpio energy in a crush: you're sensing more than they've shown you. Name what you actually know vs what you sense."],
  "7-situationship": ["Your Scorpio emotional style detects inconsistency before it's visible. What specifically have you noticed?", "The ambiguity feels like a violation to a Scorpio emotional style. Today, name what you actually need.", "Scorpio energy today: the patterns you're seeing are real. Trust them."],
  "7-relationship": ["Your Scorpio emotional style needs depth, not just presence. Is the connection deep enough today?", "The intensity between you — is it energy, or is it unresolved tension? Today, decide which.", "Scorpio energy in a relationship: something is being kept back. Today is the day to bring it forward."],
  "7-ex": ["Scorpio emotional energy doesn't easily release betrayals — or genuine connections. Which category is this in, honestly?", "Your Scorpio instincts are still processing. That's allowed. Today, ask: what specifically hasn't been resolved?", "The intensity you still feel is real data. Today, sit with what it's actually about."],
};

// Generic daily reflections when specific key not found
export const GENERIC_REFLECTIONS: string[] = [
  "Today's question worth sitting with: is what you're doing in this connection coming from clarity, or from fear of what happens if you stop? Those two things feel almost identical from the inside — but they lead to completely different places.",
  "The thing you've been avoiding saying is the thing that would most change this. That's not a coincidence — it's exactly why you're avoiding it.",
  "Notice how you feel for the hour after you think about them. Not during the thinking — after it. That residue is more honest than the thought itself.",
  "The version of this connection you're holding onto in your head: when did it stop matching the one that's actually happening? That gap has a specific point where it started. Find it.",
  "What would you tell someone you love if they described your exact situation to you right now? You have the answer. The only question is why you're not applying it to yourself.",
  "There's something in this connection that keeps requiring you to shrink something real about yourself to make the dynamic work. Whatever that is — locate it today, and name it.",
  "The pattern you keep running into with them isn't bad luck. It has a shape. Once you can see the shape clearly, you get to decide whether you keep fitting into it.",
  "How they treat you when something is inconvenient for them is the most accurate data you have about who they are. Not the good moments — the inconvenient ones. Look at that directly.",
  "You already know what you need from this. The question you keep skipping: are you willing to ask for it clearly, and actually accept whatever the honest answer is?",
  "The conversation you keep not having is costing you more than having it would. At some point the price of avoidance exceeds the price of honesty. You may already be past that point.",
];
