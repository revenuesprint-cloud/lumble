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
    relationshipEffect:"The highest potential for deep connection. New love formed in Shukra dasha has unusual staying power. Existing connections either deepen significantly or clarify as wrong.",
    challenge:         "The desire to romanticise overrides the ability to see clearly.",
    gift:              "This is the dasha built for love. What you build in it has foundation.",
    warning:           "Shukra amplifies everything — including the wrong connections. Beauty is not the same as right.",
    lessonForLove:     "The connection you're in during this dasha will teach you more about love than anything before.",
    oracleContext:     "in your Shukra mahadasha, the universe is pointing you toward love — the question is whether you're choosing the right direction to look",
  },
  Shani: { theme:"structure", quoteCategory:"patience",
    headline:          "A period of structure — what's real survives. What isn't, won't.",
    relationshipEffect:"Shani removes what was never solid. This is painful and necessary. Connections that make it through this period are genuinely built to last.",
    challenge:         "Everything in love feels effortful. Distance can feel like loss when it's actually just pace.",
    gift:              "What's still standing at the end of this period is the real thing.",
    warning:           "Don't interpret the difficulty as incompatibility. Shani tests, it doesn't condemn.",
    lessonForLove:     "Easy isn't the standard. Solid is the standard.",
    oracleContext:     "in your Shani mahadasha, love is being tested for what's real — what endures this period was always meant to",
  },
  Rahu: { theme:"obsession", quoteCategory:"intuition",
    headline:          "A period of intensity — this dasha makes everything feel fated. Some of it is. Some of it is obsession.",
    relationshipEffect:"Connections formed or intensified under Rahu feel magnetic, fated, and impossible to release. The intensity is real. But intensity and alignment are different things.",
    challenge:         "The addictive quality of connection in this period — whether it's healthy or not.",
    gift:              "Breaking patterns that have followed you through multiple relationships.",
    warning:           "Rahu-period love is often exactly what you needed to experience and exactly what you shouldn't stay in.",
    lessonForLove:     "The most intense thing you've ever felt isn't always the most right.",
    oracleContext:     "in your Rahu mahadasha, what you're feeling has a karmic charge — the question is whether the karma is being resolved or repeated",
  },
  Ketu: { theme:"release", quoteCategory:"healing",
    headline:          "A period of release — something has to go. The question is whether you'll let it go willingly.",
    relationshipEffect:"Ketu strips away what's not essential. Connections that don't have a soul-level basis tend to dissolve. This is painful and also right.",
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
    label:      "Tara — nakshatra timing",
    weakText:   "Your nakshatra timing is off. One of you is emotionally ready for what the other isn't — and it keeps switching. You arrive at the same place at different times.",
    strongText: "Your nakshatra timing aligns. When you're both ready for something, you tend to be ready at the same time. This is rarer than it sounds.",
    fix:        "When the timing feels off, name it. 'I'm ready for this, are you?' The nakshatra friction is about readiness, not compatibility.",
  },
  Yoni: {
    label:      "Yoni — intimate compatibility",
    weakText:   "Your intimate compatibility requires more conscious effort. The natural frequency between you in close contact is slightly discordant — manageable but present.",
    strongText: "Your intimate compatibility is built in. Physical and energetic closeness between you is natural, not constructed.",
    fix:        "Build physical rituals that aren't goal-oriented. Proximity without agenda reduces the friction this koota creates.",
  },
  "Graha Maitri": {
    label:      "Graha Maitri — mental compatibility",
    weakText:   "Your sign lords don't favour each other naturally. This means mental alignment takes effort — you process information in ways that feel slightly foreign to each other.",
    strongText: "Your sign lords are friendly. Mental compatibility is built into your charts — you understand each other's logic without a translator.",
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
    weakText:   "There's a 6-8 rashi distance that creates recurring emotional push-pull. One person feels closer at exactly the moment the other needs space. This cycle doesn't have a clear cause — which makes it maddening.",
    strongText: "No Bhakoot friction. The emotional current between you flows without the structural push-pull that creates the classic 'one step forward, two steps back' pattern.",
    fix:        "When the push-pull starts, name the pattern specifically: 'We're in the cycle again.' Naming it creates enough distance from the pattern to interrupt it.",
  },
  Nadi: {
    label:      "Nadi — energy compatibility",
    weakText:   "You share the same Nadi energy type. In the classical reading, this signals that your nervous systems are wired similarly — which creates resonance and also, over time, energy depletion. You may feel drained by each other in ways you can't explain.",
    strongText: "Your Nadi energies are different. One person's energy type naturally complements the other's — neither person is competing with the same frequency.",
    fix:        "Build deliberate restoration time both together and separately. Same-Nadi couples need more solo recharge time than other pairings.",
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
    "The astrological signature for emotional memory is in the 12th house and the Moon's nakshatra. {{pNak}} nakshatras don't release easily — the deity {{pNakDeity}} governs lasting emotional impressions. {{p}} has the architecture for holding on. But carrying something and being ready to act on it are different things. Right now, your question isn't really about them — it's about whether you're ready to move toward or away from what you felt.",
    "I can give you the honest reading: a {{pMoon}} moon processes memory through {{pMoonStyle}}. That means your presence in their life left marks they're probably not even consciously aware of. {{pNak}} nakshatras in particular are known for attachment that outlasts the explicit relationship. But here's what matters more — what would you do with a yes? That answer is where the real work is.",
    "The {{guna}}/36 between you includes a Graha Maitri score that reflects emotional familiarity — the kind that doesn't evaporate cleanly. A {{pMoon}} moon in particular will have residue from something real. The question worth sitting with: is what you're asking about them, or about whether you're allowed to still feel this?",
    "Your {{uNak}} nakshatra — ruled by {{uNakLord}} — forms emotional imprints that others feel even when they're not acknowledged. {{p}}'s {{pNak}} energy responded to that. Missing happens in the gap between what was and what isn't anymore. {{p}} is in that gap. Whether they act on it is a different question. What's in your control: what you do with the part of you that's still in it too.",
    "{{pNak}} nakshatras have a relationship with memory that runs deep. Their ruling deity {{pNakDeity}} governs bonds that outlast circumstances. Do they miss you? Something persists. But here's the harder truth your {{dasha}} mahadasha is pointing at: the question of whether they miss you is keeping you from the more important question of what you want to build next.",
    "In your Vimshottari sequence, you're in {{dasha}} — which is {{dashaOracleContext}}. That context shapes what you're bringing to this question. The answer about {{p}} is probably: yes, something remains. A {{pMoon}} moon doesn't simply clear its emotional registry. But the stars are less interested in that answer than in what you're going to do with the answer.",
    "{{p}}'s {{pNak}} nakshatra — with {{pNakLord}} as lord — creates attachment patterns that hold long after the visible connection ends. What the chart shows: the emotional weight isn't gone on their side. What the chart can't show: their readiness to do anything about it. Those are different questions, and only one of them is about you.",
    "The Guna score between you is {{guna}}/36. At that level, something real was built. Real things don't disappear when relationships end — they change form. A {{pMoon}} moon holds what was real quietly. The question isn't whether they miss you. It's whether you're using this question to stay close to something that's already past.",
  ],
  loves_me: [
    "Love in astrology lives in the 5th house and Venus's placement. What your Guna Milan shows — {{guna}}/36 — is genuine emotional resonance in multiple kootas. That's not nothing. But astrology maps potential, not decisions. {{p}} has the emotional structure for deep feeling. Whether they're acting from that place is a choice that belongs to them. What the chart can show you: you're not imagining the connection. What it can't show: whether they've decided to let it lead them.",
    "{{p}}'s {{pMoon}} moon in {{pMoon}} rashi processes love through {{pMoonStyle}}. That means they feel more than they say, and they say more through behaviour than words. If you're looking for declarations, you might be looking in the wrong direction. Look at what they do when you need something. Look at how they show up when it's inconvenient. That's where this moon sign speaks.",
    "Your {{uMoon}} moon and {{p}}'s {{pMoon}} moon — both processing, both carrying something. The {{guna}}/36 Graha Maitri between your sign lords reflects whether your minds are oriented the same way. That's the foundation under the feeling. The question you're actually asking is: is what I feel anchored in something real, or am I building on sand? The chart says the ground exists. What you build on it is still a choice.",
    "The {{uLagna}} lagna gives you an instinct for reading emotional truth. What that instinct is telling you right now — before the doubt, before the second-guessing — is usually the accurate read. A {{pMoon}} moon in {{pMoon}} rashi doesn't perform caring that isn't there. It performs the opposite: it hides caring that is. If something real is present, it's probably showing up as consistency in small things, not in grand statements.",
    "I'll tell you what {{pNak}} nakshatras do: they love through {{pNakDeity}}'s energy. That deity is not associated with casual attachment. The pattern that {{pNak}} brings into love is {{pNakPattern}}. If you've seen that pattern from them — if the signature matches — that's your answer. Astrology gives you the fingerprint. You have to match it to what you've seen.",
    "Your current {{dasha}} mahadasha is {{dashaOracleContext}}. That lens shapes what you're able to receive right now. There's a difference between someone loving you and you being in a place to feel it fully. The chart says both things can be true simultaneously. Something real exists between you. Your ability to receive it is also a factor.",
    "At {{guna}}/36, the emotional resonance between you is real. The Graha Maitri koota specifically measures mental and emotional friendship — the foundation under love. You have that. What you don't have clarity on is whether {{p}} is in that same place right now — and that question is about their dasha, their readiness, their choice. What you can trust: the connection isn't a projection.",
    "{{p}}'s {{pNak}} nakshatra carries the archetype of {{pNakProfile}}. That archetype in love tends toward {{pNakPattern}}. You're asking if love is there — and the honest answer from the chart is: the capacity is. The willingness to act on it is a separate calculation entirely. One thing your {{uMoon}} moon knows: you can tell the difference between someone who feels something and someone who shows up for it. Trust that.",
  ],
  come_back: [
    "Reunion in Vedic astrology isn't read from a single indicator — it's a combination of your current dasha, the unresolved karma between charts, and both people's readiness. Your {{dasha}} period is {{dashaOracleContext}}. That timing is relevant. What the stars can tell you: the door hasn't sealed. Whether it opens depends on choices that belong to both of you. What's in your control: being clear about what a return would require to be different — not hoped different, specifically different.",
    "{{p}}'s {{pNak}} nakshatra has a specific relationship with attachment and return. That nakshatra's lord is {{pNakLord}}, whose energy governs {{pNakDeity}}. There's a pattern in {{pNak}} of returning to what was real — sometimes past the point where returning makes sense, sometimes at exactly the right moment. The question isn't whether they'll come back. The question is: if they did, what would need to be different? Write that down. It's the only version of a return worth wanting.",
    "The {{guna}}/36 between you is a measure of karmic weight. At that score, endings rarely feel complete — because they aren't, entirely. The thread persists. But the thread being there isn't an instruction. It's an invitation to do something different with what was left unresolved. Your {{dasha}} period is asking a specific question: what do you want to build, with or without {{p}}? The answer to that question is what will determine whether return becomes something worth wanting.",
    "I want to be honest with you: return rarely works if it returns to the same dynamic. What {{pMoon}} moon energy needs in order to come back is usually space to come forward on their own — not pursuit. A {{pMoon}} moon that's been pushed toward something rarely stays. The better question: what would you need to see from them, not what they need to see from you. Your clarity about that is more magnetic than anything else you could do.",
    "Timing in Vedic astrology is governed by dashas — yours and theirs. You're in {{dasha}}, which is {{dashaOracleContext}}. {{p}}'s dasha position would tell a parallel story. What I can see from your chart: this period is not one for passive waiting. It's one for becoming clear. The connections that return in this kind of clarity are the ones that were always meant to. The ones that don't — that information is also the answer.",
    "The Bhakoot and Guna scores between you suggest emotional weight that doesn't clear completely. That weight is real. What it doesn't tell you is the timeline or the decision. What it does tell you: the reason this hasn't resolved is that it hasn't been meant to yet. Your {{uNak}} nakshatra in particular carries the pattern of {{uNakPattern}}. How that pattern interacts with a potential return is worth examining before the return happens.",
    "Return requires two things the chart can't fully see: both people having done something different with what they learned, and the honesty to name specifically what that is. What the chart shows: the resonance exists. The {{guna}}/36 didn't disappear because the relationship paused. What you're both deciding is whether to pick up the thread with new hands or leave it where it is. Neither is wrong. Only one is honest about what's changed.",
    "Your {{uMoon}} moon makes you someone who processes through the question of return. {{pMoon}} moon energy processes it through action — they either move toward or don't, and the ambiguity you're living in now is itself information. When a {{pMoon}} moon wants to return, you feel it in their initiation, not their absence. What you're experiencing right now — what specific behaviour — is the actual data. Not what you hope it means. What it actually is.",
  ],
  should_text: [
    "The honest answer is: it depends on what you would say. 'Hey' from a {{uMoon}} moon isn't what it looks like — it's an opener for something you haven't figured out how to say yet. {{p}}'s {{pNak}} nakshatra doesn't respond well to ambiguity. If you reach out, say the real thing or don't say anything. Your {{dasha}} period — {{dashaOracleContext}} — is asking for directness. This is one place to practice it.",
    "What the stars see: you're in {{dasha}}, which asks for {{dashaTheme}}. Reaching out from fear — that the window will close, that they'll forget you — tends to produce outcomes that don't hold. Reaching out from clarity — knowing what you want to say and why — is different. The question isn't whether to text. It's whether you've found the sentence that's actually true. When you have it, you won't need to ask.",
    "{{p}}'s {{pNak}} nakshatra responds to honesty and directness. That nakshatra's strength is {{pNakStrength}}. What it doesn't respond well to: testing messages, things designed to get a reaction rather than start a real conversation. If what you want to say is real, say it plainly. The chart supports that kind of reaching out. The chart doesn't support the calculated version.",
    "Your {{uMoon}} moon processes connection through {{uMoonStyle}}. Reaching out is natural to you — it's how you close the emotional loop. But {{p}}'s {{pMoon}} moon processes through {{pMoonStyle}}. A message that feels complete to you might land differently for them. The right text isn't about what relieves your anxiety. It's about what opens a real conversation. If you can write a message that's honest without being a transaction — send it.",
    "Here's what I see: you're circling this question because you already know what you want to say but haven't given yourself permission to say it. The {{dasha}} period you're in — {{dashaOracleContext}} — is asking you to act from truth rather than strategy. The test isn't whether to reach out. It's whether you can say the thing directly. If the answer to 'what would I actually say' is clear — that's the message.",
    "There's no astrologically perfect moment for a text. What there is: the moment when what you'd say is true without being designed to produce a specific response. Your {{uNak}} nakshatra — with {{uNakLord}} as ruler — has a relationship with directness. This is an opportunity to use it. Not the clever message. Not the one that gives you deniability. The honest one.",
    "{{p}} has a {{pNak}} nakshatra that {{pNakPattern}}. What lands with them is realness, not strategy. If you're asking should you text, you're probably not there yet — you're still in the strategic version of it. The moment you know exactly what you want to say without needing to calculate the response — that's when reaching out makes sense. What would you say if you knew they'd receive it exactly as you meant it?",
    "Your Vimshottari dasha is in {{dasha}} — {{dashaOracleContext}}. That period has a specific relationship with how you initiate. What it favours: clear, direct action from a place of knowing what you want. What it doesn't favour: testing the waters in ways that leave you more uncertain than before. Write the message you actually want to send. Read it back. Ask: is this true, or is this a way to feel closer to the answer without asking the actual question?",
  ],
  why_left: [
    "The honest astrological read: {{p}}'s {{pNak}} nakshatra has a specific relationship with distance. The ruling deity {{pNakDeity}} governs the archetype of {{pNakPattern}}. When a {{pNak}} person pulls away, it's rarely about the surface reason. It's usually about something in the dynamic triggering an older response — one that predates you. Your {{uLagna}} lagna, which reads people accurately, probably sensed this. The question that matters more: what did this pulling away teach you about what you need from a connection?",
    "{{p}}'s {{pMoon}} moon in {{pMoon}} rashi processes emotional overload through {{pMoonStyle}}. Withdrawal is often that moon sign's version of self-regulation — not rejection, but retreat. The problem: it registers as rejection to a {{uMoon}} moon that's wired for presence. The gap between what they were doing and what you experienced is where most of the pain lives. That gap doesn't make the pain less real. It makes it more navigable.",
    "The Guna breakdown between you includes the Gana score: {{uNakGana}} meets {{pNakGana}}. When Gana differs significantly, the way each person handles emotional stress diverges at exactly the moments when you need each other most. One pursues, one retreats. Neither is wrong. Together, they create the push-pull that can become why someone left — not because they stopped feeling, but because the pattern was exhausting for both people.",
    "Saturn — Shani — governs absence and distance. In your current {{dasha}} period, {{dashaOracleContext}}. The departure of someone isn't always about you. Sometimes it's about where they are in their own dasha, their own readiness, their own unresolved architecture. What the chart asks you: what did the way they left tell you about what you need to ask for more clearly in the next connection?",
    "I'll be direct about what I see: {{p}}'s {{pNak}} nakshatra carries the pattern of {{pNakShadow}}. That shadow isn't an excuse — it's context. They were probably doing the most emotionally sophisticated thing they were capable of. That may not have been enough. Your {{uNak}} nakshatra, ruled by {{uNakLord}}, deserves someone capable of staying through what they started. That's not a small thing to ask for, and it wasn't wrong to ask for it.",
    "The departure happened at the level of behaviour. What drove it happened at the level of internal pattern. {{p}}'s {{pMoon}} moon in {{pMoon}} — processing through {{pMoonStyle}} — would have pulled away long before any visible signal. What you're probably replaying is looking for the moment you missed. It wasn't a moment. It was a pattern that ran underneath. Your {{uMoon}} moon sensed it. Trust that reading.",
    "Your {{uNak}} nakshatra responds to loss through {{uNakPattern}}. What your current {{dasha}} period — {{dashaOracleContext}} — is asking you to do with this departure: not to understand it completely, but to extract what it clarified about what you actually need. The clarity gained from someone leaving is often more useful than the clarity gained from someone staying who shouldn't.",
    "Here's what the chart shows clearly: the {{guna}}/36 between you means something real existed. Real things leave residue. The question of why they left has multiple layers: the one they gave you, the one they believed themselves, and the one that lives in the chart. The chart version: the Gana, Bhakoot, or Nadi pattern between you was creating invisible tension neither person fully named. Unnamed patterns express themselves as departures.",
  ],
  why_fight: [
    "The Gana score between you is the astrological answer to this question. {{uNakGana}} Gana meets {{pNakGana}} Gana — your fundamental emotional temperaments operate from different instincts. Under stress, one person moves toward, one moves away. The fight is never really about the fight. It's about two self-protection patterns colliding without enough language for what they actually are. Naming the pattern specifically is what interrupts it.",
    "Your {{uMoon}} moon processes emotion through {{uMoonStyle}}. {{p}}'s {{pMoon}} moon processes it through {{pMoonStyle}}. When something important needs to be communicated and both styles activate simultaneously, you're both speaking different languages at the same volume. The conflict isn't really disagreement — it's translation failure. The fix is slower and harder than winning the argument.",
    "Mars — Mangal — governs how we fight. The Mars interaction between your charts creates a pattern where small misalignments become symbolic. You're not fighting about what you're fighting about. The surface conflict is a stand-in for something that hasn't been said directly. The question worth asking mid-fight: what is this actually about? The honest answer to that question ends more fights than any argument could.",
    "The Bhakoot distance in your charts — {{bhakootScore}}/7 — describes an emotional push-pull that doesn't have a clear cause. When one of you moves closer, the other tends to create space. That cycle, when it meets a disagreement, looks like fighting. But it's structural — built into the rashi distance — not personal. Knowing that doesn't make it less frustrating, but it changes who the enemy is. The pattern is the enemy, not each other.",
    "Your {{uNak}} nakshatra has {{uNakGana}} Gana. {{p}}'s {{pNak}} has {{pNakGana}} Gana. The sacred texts describe the Deva-Rakshasa Gana combination specifically as creating conflict without obvious cause — because the instinctual response to difficulty is different at a foundational level. One person's self-protection looks like attack to the other. Naming this specifically — 'we respond to stress differently, that's what's happening' — is the only thing that interrupts the cycle.",
    "The recurring argument is almost never about the recurring subject. Your {{dasha}} period — {{dashaOracleContext}} — is amplifying the unspoken thing underneath. What the chart asks: what is the actual thing neither of you is saying? Name it once, directly, outside of a fight. The fight usually exists to get close to that thing without having to say it. Saying it directly makes the fight unnecessary.",
    "{{pMoon}} moon energy in {{pMoon}} hears criticism in neutral statements. Your {{uMoon}} moon in {{uMoon}} expresses feeling through {{uMoonStyle}}. The combination means your most neutral expression sometimes lands as critique to them, and their self-protection sometimes reads as coldness to you. You're both responding to each other accurately — just to a version of what the other person is saying that isn't quite what was meant.",
    "The conflict pattern between {{uNak}} and {{pNak}} nakshatras tends to look like this: one person says something true but imperfectly. The other hears the imperfection rather than the truth. Then the conversation is about the imperfection instead of the thing that needed to be said. The fix is one person saying: 'I heard what you meant, not just what you said.' Usually that's the {{uNakGana}} gana person's job in this pairing.",
  ],
  compatible: [
    "Your Guna Milan score is {{guna}}/36. The breakdown is what matters more than the number. Your highest-scoring kootas are where love flows naturally. Your lowest are where it requires intentional effort. The chart doesn't tell you whether to stay — it tells you specifically where to invest. Compatibility isn't match — it's what you do with the information about where you're aligned and where you're not.",
    "Compatible doesn't mean easy. At {{guna}}/36, you have genuine cosmic resonance in several of the eight kootas — specifically in the areas that matter most for lasting connection. The friction areas are real too. What the score actually measures: how much raw material exists for a real relationship. What happens with that material is entirely your decision.",
    "The Graha Maitri between your sign lords — {{lord1}} and {{lord2}} — reflects mental and emotional friendship. That's the foundation under the love. At your score level, you have {{grahaMaitriText}}. The Nadi and Gana factors show {{nadiGanaText}}. Compatibility at this level is not a verdict. It's a description of where to be intentional.",
    "I'll say something direct: compatibility charts are designed to show you where to pay attention, not whether to continue. At {{guna}}/36, the raw material is there. The question worth sitting with is: are you both choosing this, actively? Are you showing up for the friction areas or hoping they'll resolve on their own? Compatibility is the potential. The relationship is the choice.",
    "Your {{uNak}} nakshatra and {{p}}'s {{pNak}} nakshatra — {{uNakLord}} meets {{pNakLord}} — create a specific relational signature. That signature describes how you challenge and support each other, where you naturally harmonise, and where you'll need to do the work. Compatibility in Vedic astrology isn't about matching; it's about understanding the specific shape of the connection so you can navigate it honestly.",
    "The most compatible charts I've seen still have friction — because the friction is where growth lives. At {{guna}}/36, you have a genuine foundation. Specifically, your {{strongKoota}} gives you {{strongKootaText}}. Your {{weakKoota}} requires more {{weakKootaFix}}. This is your map. What you do with it is yours.",
    "Here's what your {{guna}}/36 actually tells you: in the kootas that govern emotional depth, mental alignment, and long-term potential — the scores look like {{scoreContext}}. That's not nothing. The question to ask isn't 'are we compatible' — it's 'are we choosing each other in the ways that the chart shows we'd need to?' The answer to that question tells you more than any number.",
    "Compatible in the deepest sense means: built for something real, if both people do the work of understanding the specific shape of what they have. At {{guna}}/36, the shape is {{gunaShapeText}}. Your {{dasha}} period is {{dashaOracleContext}}. Both things are true: genuine resonance exists, and both of you are in dasha periods that are either supporting or testing that resonance. The timing is part of the equation.",
  ],
  move_on: [
    "Moving on in Vedic astrology is associated with the 12th house — release, dissolution, spiritual surrender. Your {{uMoon}} moon in {{uMoon}} rashi processes grief through {{uMoonStyle}}. That means the path through this isn't going around it — it's through it. Your current {{dasha}} period is {{dashaOracleContext}}. This context isn't asking you to hurry. It's asking you to be honest about what you're actually grieving.",
    "Your {{uNak}} nakshatra — ruled by {{uNakLord}} — {{uNakPattern}}. That pattern in grief tends to hold on past the useful point. The attachment is real. So is the question: are you holding on to them, or to the version of yourself that existed in that connection? Those are different griefs and they require different things.",
    "Here's what the chart shows: you're in {{dasha}}, which is {{dashaOracleContext}}. This period specifically asks for clarity about what you're releasing and why. Moving on doesn't mean the connection wasn't real. It means acknowledging that real things can also be over. Your {{uMoon}} moon sometimes conflates loving something with needing to hold onto it. You can love what was and still build what's next.",
    "The {{guna}}/36 between you means something real was there. Real things don't disappear when they end — they transform. The question of 'how do I move on' is often really 'how do I stop feeling this.' The answer to the second question is: you don't, at first. The feeling means it was real. You move forward with it, not past it. Your {{dasha}} period — {{dashaOracleContext}} — is the map for what forward looks like right now.",
    "I want to name something directly: your {{uNak}} nakshatra {{uNakPattern}}. That means this isn't about weakness — it's about how deeply {{uNak}} nakshatras form imprints. The work isn't to stop feeling. It's to stop measuring your progress by whether you've stopped feeling. Forward and not-feeling are different destinations. One is possible. The other takes the time it takes.",
    "Moving on has a specific Vedic astrology instruction: it requires building, not just releasing. Your {{dasha}} period — {{dashaOracleContext}} — is asking you to direct that building somewhere. The attachment to what ended is partially about having nowhere new to put the energy. When the energy has direction, the grief changes shape. Not disappears — changes shape.",
    "Your {{uMoon}} moon in {{uMoon}} needs {{uMoonNeed}} in order to heal. If this connection wasn't providing that, part of the grief is for what you were hoping it would be — not just what it was. Your current {{dasha}} is {{dashaOracleContext}}. That period has a specific relationship with release. What it asks: not that you stop missing them, but that you stop organising your present around their absence.",
    "Here's the thing {{uNak}} nakshatras need to hear about moving on: you don't do it by deciding to. You do it by building enough in the present that the past stops being the loudest thing. Your {{dasha}} period is {{dashaOracleContext}}. The question isn't 'am I over them.' The question is: what am I building right now? When the answer to that gets interesting enough, the first question starts to matter less.",
  ],
  future: [
    "Future in Vedic astrology is read through dashas. You're in {{dasha}} — {{dashaOracleContext}}. That period has a specific relationship with what it opens or closes. What I can tell you: this period is {{dashaTheme}}. Connections that deepen in this period tend to be {{dashaFuture}}. Whether that applies to {{p}} or someone else depends on choices being made now.",
    "The {{guna}}/36 gives a structural read on long-term potential. At your score, {{gunaFutureText}}. But the chart is the map, not the destination. The future of this connection depends on two ongoing choices: both people showing up honestly, and both people growing. The potential is there. The outcome is being decided continuously.",
    "Your {{uLagna}} lagna gives you a specific lens for the future — you tend to see possibility clearly and then want certainty about it. The chart can show you the territory. It can't walk the path for you. What's true: your current {{dasha}} is {{dashaOracleContext}}. That shapes what the next phase will be made of. Build from that clarity, and what comes next — with or without {{p}} — will have a better foundation.",
    "I'll be direct: the future isn't written, it's decided. What the chart shows is the energy available to you. You're in {{dasha}} — {{dashaOracleContext}}. {{p}}'s chart is running a parallel story. Where those stories intersect depends on choices being made now, mostly invisible ones. What's in your hands: what you're building in yourself. That's the one variable the chart says you control entirely.",
    "The {{uNak}} nakshatra you were born under has a specific cycle. You're currently in {{dasha}} mahadasha — {{dashaOracleContext}}. The next shift in your dasha will change the emotional terrain considerably. What happens in the current period is foundation for what becomes possible in the next. The most useful thing you can do for the future is be precise about what you want — not aspirationally, practically.",
    "Your Guna Milan score reflects that real material exists between you and {{p}}. Real material doesn't disappear — it waits for the right conditions. The future isn't about whether the material is there. It's about whether the conditions are being built. Your {{dasha}} period — {{dashaOracleContext}} — describes what conditions you're capable of building right now. That's where the future actually comes from.",
    "The question about the future is often a displacement of the question about the present. Your {{uMoon}} moon in {{uMoon}} processes the future through {{uMoonStyle}} — which means you're probably imagining many versions of it right now. The honest chart answer: the version that becomes real is the one you build directly and honestly from today. The one you wait for someone else to create has a much lower probability.",
    "Future readings in Vedic astrology carry one consistent message: the planetary periods are the river; your choices are the boat. You're in {{dasha}} — {{dashaOracleContext}}. That's the river right now. Where you steer depends on what you decide about {{p}}, about yourself, about what you're willing to ask for directly. The stars don't hide the answer. They reflect it back from the most honest version of you.",
  ],
  addicted: [
    "What you're describing has a specific astrological signature. Your {{uMoon}} moon in {{uMoon}} forms a strong energetic pull toward {{pMoon}} moon energy — especially when the Rahu node is involved. The connection feels magnetic and impossible to release because it activated something in you that runs very deep. The intensity is real. The question worth sitting with: is the intensity coming from resonance, or from the pattern the connection triggers?",
    "{{uNak}} nakshatra people form imprints that don't release easily. {{uNakPattern}}. What you're calling addiction is your nervous system having learned {{p}}'s energy as a baseline. The body treats the absence of that stimulus as deprivation. This is neurologically real, not a weakness. The work is building a new baseline — and that happens through replacing the pattern, not through willpower.",
    "The magnetic pull you're describing often shows up in charts where the nodes — Rahu and Ketu — are interacting across two people's Moons or Lagnas. This creates a felt sense of fate — like something unfinished. The intensity is real, but the pull isn't necessarily toward the person. It's toward resolution of a pattern that predates them. The question worth asking: what would finally feeling this as complete look like?",
    "Your {{dasha}} mahadasha is {{dashaOracleContext}}. This period has a specific relationship with attachment and release. What it's asking you: not to stop feeling the pull, but to examine what the pull is actually toward. Sometimes it's toward {{p}} specifically. Often it's toward the feeling — certainty, intensity, being chosen — that {{p}} provided. Those are different things. Knowing which one this is changes everything about how you move.",
    "The addiction is the brain trying to resolve something unfinished. {{p}}'s {{pNak}} nakshatra left an impression on your {{uNak}} nakshatra — the specific combination of {{uNakLord}} meeting {{pNakLord}} creates a particular resonance. That resonance doesn't disappear because the relationship changed. The body remembers it and mistakes the memory for present reality. The path through this is neither suppression nor pursuit — it's understanding what was real and what was the pattern.",
    "Your {{uMoon}} moon in {{uMoon}} processes connection through {{uMoonStyle}}. When the connection breaks, that moon sign continues to process — replaying, reinterpreting, looking for the resolution that didn't come. The loop is the addiction. It's not about {{p}} anymore — it's about the unresolved loop. The resolution doesn't require them. It requires you deciding what it would mean for it to be complete.",
    "The intensity of what you feel isn't a measure of the connection's worth. Your {{guna}}/36 reflects real material. But real material can exist in something that was right for one period and not for the next. Your current {{dasha}} — {{dashaOracleContext}} — is asking you to distinguish between what was genuinely true and what you've built around it since. The truth is smaller and more manageable than the story you've been living in.",
    "Here's what the chart shows: {{uNak}} nakshatras {{uNakPattern}}. That's the architecture of the addiction. It's not a flaw — it's the specific way you're built to attach. The same capacity that makes this hurt this much is the capacity that makes you capable of extraordinary love. The work isn't to reduce the capacity. It's to direct it toward something that receives it fully.",
  ],
  confused: [
    "Your {{uMoon}} moon in {{uMoon}} is highly intuitive — you sense what's true before you can name it. When you're confused about {{p}}, pay attention to what you felt before the explanations started. That first read is usually accurate. Confusion often means: you know the answer, but the answer conflicts with what you want the answer to be. Your {{dasha}} period — {{dashaOracleContext}} — is asking for honesty with yourself before honesty with them.",
    "Mixed signals from {{p}} usually mean they are genuinely mixed internally. {{pMoon}} moon people in {{pMoon}} experience ambivalence acutely — they can want you and not be ready simultaneously. Both things are true at the same time. The confusion isn't in their signal; it's in trying to get a single clear answer from someone who hasn't resolved the question themselves. Your {{uNak}} nakshatra senses more than you're being told. Trust that.",
    "The confusion is information. Your {{uNak}} nakshatra gives you strong perceptive abilities — {{uNakStrength}}. When what you feel doesn't match what you're being told, that gap is the data. Not the words. The gap. Your {{dasha}} period is {{dashaOracleContext}} — which means your capacity for clarity right now is high. The confusion isn't a failure of perception. It's the signal that the situation contains something unspoken.",
    "I want to be direct: when a {{pNak}} person sends mixed signals, it's almost always because they haven't resolved something internally — not because you're misreading them. {{pNak}} {{pNakPattern}}. That pattern looks like mixed signals from the outside. It's actually internal conflict they haven't named yet. You deserve someone who's done enough work to be clear. The question is whether you're willing to ask for that directly.",
    "Your {{uLagna}} lagna makes you someone who reads situations accurately. When you're confused, it's usually because the situation is genuinely contradictory — not because your perception is failing. {{p}}'s {{pMoon}} moon in {{pMoon}} processes through {{pMoonStyle}}. That processing style can look like mixed signals to an outside observer. What would clarify it: a direct question, asked once, with patience for the real answer.",
    "The confusion lives in the gap between what {{p}} is showing and what they're saying. Your {{uNak}} nakshatra reads that gap better than most. The confusion isn't yours — it's theirs. They haven't decided. And you've been interpreting their indecision as something you could resolve by reading the signals more carefully. You can't. Only they can resolve it. The question worth asking is whether you're willing to name that directly.",
    "In Vedic astrology, the 7th house governs partnership clarity. When that house is under the influence of the current dasha — {{dashaOracleContext}} — confusion is often a clarification process. You're not lost. You're in the middle of figuring out what you actually want. That looks like confusion from the inside. Keep asking the questions. The answer is forming.",
    "Your {{uMoon}} moon needs {{uMoonNeed}}. The confusion might be partly about whether this connection provides that — and whether you're allowed to ask for it. Your {{dasha}} period is {{dashaOracleContext}}. This period has a specific relationship with asking for what you actually need. The confusion often clears when the real question gets asked out loud, even just to yourself.",
  ],
  red_flag: [
    "I hear this concern and want to take it seriously. Your {{uMoon}} moon in {{uMoon}} senses emotional safety — or its absence — with genuine accuracy. When that moon sign registers alarm, it's not overthinking. It's pattern recognition operating correctly. The chart doesn't override your lived experience. What specifically are you noticing? Not what you're afraid it means — what are you actually observing?",
    "Your {{uNak}} nakshatra {{uNakStrength}}. When you're naming something as a red flag, that's not anxiety — that's your chart doing its job. The harder question is whether you're willing to act on what you're seeing. The pull to stay, to give another chance, to explain away — those are real. So is the signal. Both things can be true, and only one of them is reliable data.",
    "Something your {{uMoon}} moon knows: the contrast between how someone treats you when things are easy versus when they're under pressure tells you who they actually are. A {{pNak}} person who {{pNakShadow}} — when does that shadow show up? What does it look like when it's present? That specific observation is more useful than any general reading.",
    "I want to be honest with you: no Guna Milan score justifies staying in something that consistently harms you. At {{guna}}/36, real material exists. That doesn't change the signal you're picking up. Sometimes the most astrologically significant relationship teaches you exactly what you won't accept. That lesson, arrived at honestly, is worth more than any score.",
    "The {{uNak}} nakshatra you were born under has {{uNakStrength}}. That means you read the unsaid things correctly. When something feels wrong, it usually is. The question isn't whether the concern is valid — your {{uMoon}} moon doesn't manufacture alarm where there's none. The question is what you're going to do with the information that you're receiving.",
    "Your instinct is data. The {{uMoon}} moon in {{uMoon}} processes safety and danger at an emotional frequency most people don't consciously register. When it registers something as not-safe, that's not a trigger — that's accuracy. The question the chart is asking you: what would you tell your closest person if they described what you're living right now?",
    "The red flag is almost never in the dramatic moments. It's in the pattern of small things you've explained away, each one individually reasonable, together forming a picture. Your {{uNak}} nakshatra pattern of {{uNakPattern}} means you're probably carrying more of this than you've named. What's the specific thing you're not saying out loud yet?",
    "Here's what the chart sees: your {{dasha}} period is {{dashaOracleContext}}. This period has a specific relationship with seeing what's real versus what you want to be real. The red flag question during this dasha isn't just about {{p}} — it's about whether you're willing to use the clarity this period offers. The answer is available to you. The question is whether you're looking directly at it.",
  ],
  timing: [
    "Timing in Vedic astrology is one of its most sophisticated tools. You're in {{dasha}} mahadasha — {{dashaOracleContext}}. That period has a specific relationship with readiness. If this feels too soon or too late, the dasha is telling you something real. The right timing isn't just calendar dates — it's internal readiness meeting external circumstance. What's your actual readiness, not the readiness you think you should have?",
    "The {{uNak}} nakshatra you were born under has a specific rhythm — a cycle of openings and contractions. Right now, in your {{dasha}} period, you're in a {{dashaPhase}}. Forcing a connection forward in a contraction phase tends to produce strain, not depth. Trusting the pause doesn't mean giving up — it means not spending energy that belongs to your next opening on something that isn't ready yet.",
    "Here's what the chart says about timing: 'too late' is rarely actually too late for something meant to happen. 'Too soon' usually means there's growth that hasn't completed yet — in you, in them, or in the connection itself. Your {{dasha}} period is {{dashaOracleContext}}. What this period is building toward is what makes the timing eventually right. The question isn't when. It's whether.",
    "{{p}}'s {{pNak}} nakshatra has a natural rhythm of {{pNakPattern}}. If the timing between you keeps missing, it may not be permanent misalignment — it may be two people on slightly different cycles trying to synchronise. The question is whether both people are willing to do the work in the gap. Your {{dasha}} period gives you a specific resource right now: {{dashaGift}}. That resource is relevant to this timing question.",
    "The timing question is often a way of asking: is this still possible? And the honest answer from the chart is that possibility doesn't expire based on calendar. What expires is readiness. Your readiness in your current {{dasha}} period — {{dashaOracleContext}} — is the variable. What are you actually ready for right now? Not what you want to be ready for. What you are ready for.",
    "Timing in astrology is governed by the intersection of your dasha and the specific karma between charts. You're in {{dasha}}. {{p}}'s chart is running its own sequence. The window between those sequences — where both people are ready — is what timing actually refers to. What you're sensing about the timing being off or right is probably accurate. The question is whether what you're sensing is about the timing or about the readiness.",
    "The {{uNak}} nakshatra you were born under — with {{uNakLord}} as lord — has a cycle. Right now, in {{dasha}} mahadasha, that cycle is in {{dashaPhase}}. The timing question you're asking has an answer inside that phase. Not 'is it too late' but 'what does this phase support?' Your current dasha period supports: {{dashaGift}}. Work within that.",
    "Your {{uMoon}} moon in {{uMoon}} processes timing through {{uMoonStyle}}. That means what 'the right moment' looks like to you has a specific shape. The question worth asking: is the timing you're waiting for external — something they need to do — or internal — something you need to be ready for? Your {{dasha}} is {{dashaOracleContext}}. That context is building the internal readiness right now.",
  ],
  general: [
    "Your {{uMoon}} moon in {{uMoon}} is where your emotional truth lives — and right now it's processing something that deserves attention. The {{dasha}} mahadasha you're in — {{dashaOracleContext}} — has a specific way of surfacing unresolved questions. What does your gut say about this situation, before the rationalisation starts? Start there.",
    "The {{guna}}/36 between you and {{p}} reflects real resonance in certain areas and real friction in others. The friction areas — specifically {{weakKootaNarrative}} — are where the work is. Not where the love isn't, but where the love needs support to move through. What would addressing that friction directly look like?",
    "Your {{uNak}} nakshatra — ruled by {{uNakLord}} — {{uNakPattern}}. That pattern is showing up here. Whatever this question is about, it's also about that pattern. Your {{dasha}} period is {{dashaOracleContext}}. The connection between your current period and this question isn't coincidental.",
    "I want to say something that's actually useful: you already know more about this than the question implies. Your {{uMoon}} moon in {{uMoon}} doesn't ask questions it doesn't already have a feeling about. The question is a way of getting permission to act on what you already sense. What does your first read say, before anything gets complicated?",
    "Your current {{dasha}} period — {{dashaOracleContext}} — is the lens through which you're seeing this question. That lens is not neutral. What does this look like outside of the {{dasha}} frame? Imagining the version of you in five years looking back at this moment — what would that version say is the most important thing to pay attention to right now?",
    "The Guna breakdown between you shows {{strongKoota}} as a strength and {{weakKoota}} as a friction area. The strength gives you something to build from. The friction area is where most of the unanswered questions live. What specifically is happening in that friction area right now?",
    "Your {{uLagna}} lagna in {{uLagna}} rashi gives you a specific orientation toward love — {{lagnaLoveStyle}}. That orientation is both your gift and your blindspot in this situation. The gift: {{lagunaNeed}}. The blindspot: {{lagnaBlindspot}}. Which one is running right now?",
    "Here's what the chart says plainly: something real exists between you and {{p}}, and something about it isn't fully resolved. Your current {{dasha}} — {{dashaOracleContext}} — is the period in which that resolution is available. Not by waiting. By asking the question that you've been building up to. What is it?",
  ],
};

// ─── Daily reflection messages (for home screen) ──────────────────────────────
// Selected by: moonRashi + dasha + relationshipType + dayOfYear

export const DAILY_REFLECTIONS: Record<string, string[]> = {
  // keyed by "moonRashiIdx-relType" → array of messages, rotated by dayOfYear
  "0-crush": ["Your Mesha moon is impulsive today — resist sending something before the right words arrive.", "The urgency you feel right now is real. So is the value of waiting one more day.", "Mesha moons move fast when they feel something. Today, let the feeling land before you act on it."],
  "0-situationship": ["Your Mesha energy wants answers today. The ambiguity is not about you — it's about their readiness.", "The impatience is the signal, not the problem. What are you actually asking for here?", "Mesha moon in a situationship: you already know what you want. The only question is whether you'll ask for it."],
  "0-relationship": ["Something needs to be said out loud today. Your Mesha moon won't be patient much longer.", "The directness you've been softening needs to come out today — cleanly, not as attack.", "Mesha moon partnership energy: choose honesty over harmony today. The harmony will come after."],
  "0-ex": ["Your Mesha moon wants to reach out. Ask yourself: is this coming from clarity or restlessness?", "The pull you feel today is real. So is the question of what reaching out would actually accomplish.", "Mesha moons return when they've decided. The question is whether you've decided or whether you're still deciding."],
  "3-crush": ["Your Karka moon is absorbing their energy today — make sure what you're feeling is yours, not a mirror of theirs.", "The warmth you feel toward them is real. The question is whether they're creating safety, or you're creating it for them.", "Karka moons fall quietly and deeply. Today, notice whether the falling is mutual."],
  "3-situationship": ["Your Karka moon needs emotional safety that this structure isn't providing. Today, name that to yourself.", "The ambiguity isn't comfortable for you — it was never going to be. Your needs are valid.", "Karka moon in a situationship: you deserve someone who matches your emotional availability. Today, assess honestly."],
  "3-relationship": ["Your Karka moon is carrying something today. The caretaking impulse is there — but what do you need?", "The love you give is enormous. Today, let someone give it back to you without deflecting.", "Karka energy today: your emotional attunement is high. Use it to receive, not just to give."],
  "3-ex": ["Your Karka moon holds on long after it should. Today, ask what staying connected to this grief is protecting you from.", "The nostalgia is real. The question is whether you're missing them or missing a version of yourself.", "Karka moons grieve fully. Today, let yourself feel it — and let yourself also put one thing down."],
  "7-crush": ["Your Vrishchika moon is reading between every line today. What is the data actually showing, past the interpretation?", "The intensity of what you feel for them is real. Today, separate the intensity from the certainty.", "Vrishchika moon crush: you're seeing more than they've shown you. Name what you actually know vs what you sense."],
  "7-situationship": ["Your Vrishchika moon detects inconsistency before it's visible. What specifically have you noticed?", "The ambiguity is a boundary violation for a Vrishchika moon. Today, name what you actually need.", "Vrishchika energy today: the patterns you're seeing are real. Trust them."],
  "7-relationship": ["Your Vrishchika moon needs depth, not just presence. Is the connection deep enough today?", "The intensity between you — is it energy, or is it unresolved tension? Today, decide which.", "Vrishchika moon in relationship: something is being kept back. Today is the day to bring it forward."],
  "7-ex": ["Vrishchika moons don't let go of betrayals — or genuine connections. Which category is this in, honestly?", "Your Vrishchika moon is still processing. That's allowed. Today, ask: what specifically hasn't been resolved?", "The intensity you still feel is real data. Today, sit with what it's actually about."],
};

// Generic daily reflections when specific key not found
export const GENERIC_REFLECTIONS: string[] = [
  "Today, notice whether your actions in this connection come from clarity or from anxiety. They feel similar but point in different directions.",
  "The thing you're avoiding saying is usually the thing that would change everything.",
  "Pay attention to how you feel after spending time with them — or thinking about them. That feeling is data.",
  "The version of this connection that exists in your head: is it accurate, or is it the version you need it to be?",
  "What would you tell a close friend in exactly this situation? You already have the answer.",
  "Something in this connection needs more honesty. Today, locate what it is.",
  "The pattern you keep experiencing with them — it has a name. Today, find the name.",
  "How they treat you on difficult days tells you more than how they treat you on easy ones. What are you seeing?",
  "You're allowed to want what you want. Stop negotiating your needs down before you've even asked for them.",
  "The question you're not asking out loud — ask it today, even just to yourself.",
];
