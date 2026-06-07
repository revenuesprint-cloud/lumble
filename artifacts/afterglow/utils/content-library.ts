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
    coreWound:     "They gave everything to someone who couldn't match their energy, and started thinking the problem was them.",
    fear:          "Being treated like they don't matter while the relationship is still going.",
    blindspot:     "They keep chasing people who are hard to get and call it love — even when it just makes them anxious.",
    attachment:    "They fall hard and fast. If someone goes quiet, they immediately think they did something wrong.",
    dealbreaker:   "Being left waiting with no explanation. Silence from someone they've given everything to.",
    getHooked:     "By someone who challenges them and then goes slightly cold. The chase becomes the whole point.",
    redFlag:       "They look past bad behavior because the good moments feel so worth it.",
    needsToHear:   "How much you care isn't the problem. You just gave it to the wrong person.",
    insight:       "You move fast because you feel deeply. But you often decide someone is right for you before you've seen how they handle a tough moment.",
    solution:      "Watch how they act during your first fight. That tells you more than months of good times.",
    insecurityHook:"Stop asking if you were too much. Start asking if they were enough.",
  },
  // 1 Vrishabha
  1: {
    coreWound:     "They stayed loyal to someone who was using their love as a safety net while keeping other options open.",
    fear:          "Being slowly pushed out while they kept showing up like everything was fine.",
    blindspot:     "They stay in relationships that feel comfortable even when the relationship isn't actually good for them.",
    attachment:    "They take time to open up, but once they do, they don't leave easily. That's both their strength and their problem.",
    dealbreaker:   "Small lies that keep adding up. They notice when things don't match, but get told they're imagining it.",
    getHooked:     "By someone who feels like home right away. Warmth and presence pull them in completely.",
    redFlag:       "They keep giving people the benefit of the doubt well past the point where it makes sense.",
    needsToHear:   "Being loyal is a beautiful thing. But giving it to someone who hasn't earned it isn't love — it's just hope.",
    insight:       "You don't leave when you should because leaving feels like admitting you wasted your time.",
    solution:      "Ask yourself: if you met this person today for the first time, would you still choose them?",
    insecurityHook:"You've been so consistent for them. Have they been consistent for you?",
  },
  // 2 Mithuna
  2: {
    coreWound:     "Someone they thought really understood them didn't — and they've had trouble trusting that anyone truly can since.",
    fear:          "Getting close to someone, and then being found boring. Or worse — too complicated.",
    blindspot:     "When something hurts, they think about it instead of feeling it. Analyzing is their way of hiding.",
    attachment:    "They want closeness but pull back when things get too real. Hot and cold is their default.",
    dealbreaker:   "Someone who won't let them grow or change their mind.",
    getHooked:     "By someone who matches them mentally and then surprises them emotionally. That combination is rare — and addictive.",
    redFlag:       "They stay in draining relationships because the conversations are really good.",
    needsToHear:   "You're not too complicated. You just haven't found someone patient enough to actually read you.",
    insight:       "You talk about feelings so well that people think you've worked through them. Often you haven't.",
    solution:      "Next time something hurts, feel it first before you explain it. The explanation is a shield.",
    insecurityHook:"You wonder if they're losing interest. But have you actually let them see the real you yet?",
  },
  // 3 Karka
  3: {
    coreWound:     "They opened up completely to someone who didn't protect that. Big trust, then a big loss.",
    fear:          "Letting someone see everything about them and having that person leave anyway.",
    blindspot:     "They pick up other people's feelings like a sponge and can't always tell which emotions are actually theirs.",
    attachment:    "They love intensely, then pull back to protect themselves, then feel guilty for pulling back.",
    dealbreaker:   "Someone who refuses to talk about feelings or what's actually going on.",
    getHooked:     "By someone who needs them. Being needed feels safe — even when the person is wrong for them.",
    redFlag:       "They mix up someone needing them with someone loving them. Those are very different things.",
    needsToHear:   "It's not your job to manage everyone else's emotions. That was never part of the deal.",
    insight:       "You became the caretaker because it felt safer than letting someone take care of you.",
    solution:      "Let someone do something for you, even when it feels uncomfortable. How they respond tells you everything.",
    insecurityHook:"You've been so there for them. Would they be there for you the same way?",
  },
  // 4 Simha
  4: {
    coreWound:     "They gave their full warmth and attention to someone who still looked elsewhere.",
    fear:          "Being seen as ordinary by someone they love. Being cared for, but not being the person someone is proudest of.",
    blindspot:     "They put on such a strong front that no one knows when they're struggling. Then they feel alone in it.",
    attachment:    "They need to feel chosen — clearly and often. Anything less feels like rejection.",
    dealbreaker:   "Being told their feelings are dramatic when they're real.",
    getHooked:     "By someone who makes them feel like the most interesting person in the room — especially if that person is a little hard to read.",
    redFlag:       "They stay with impressive-looking people who don't actually see them.",
    needsToHear:   "You don't have to perform to deserve love. You were enough before you became impressive.",
    insight:       "The attention you want from them is really the acceptance you've been looking for inside yourself.",
    solution:      "Ask: does this person see you on a bad day? That's the only kind of being seen that actually counts.",
    insecurityHook:"You've given so much to them. Do they actually see you, or just what you give?",
  },
  // 5 Kanya
  5: {
    coreWound:     "They did everything right and it still wasn't enough. So they did more. Still not enough.",
    fear:          "Accepting love that feels imperfect — because what if imperfect love means it isn't really real?",
    blindspot:     "They pick the relationship apart as a way to avoid feeling how much they actually care.",
    attachment:    "They try to fix what's wrong in the relationship the same way they try to fix themselves — by finding every flaw.",
    dealbreaker:   "Someone who keeps changing their story or can't explain the gaps.",
    getHooked:     "By someone who seems like they need fixing. It gives them a reason to stay close without being open.",
    redFlag:       "They stay in situations that aren't working because they believe one more try will fix it.",
    needsToHear:   "You're not a work in progress that has to earn love. You're enough as you are.",
    insight:       "You can see the problems clearly and you stay anyway. The question isn't whether you can fix this — it's whether you should.",
    solution:      "Write down three things you're trying to fix about this. Then ask: is any of this actually going to change?",
    insecurityHook:"You've been trying to get this right for so long. What if the problem isn't your effort?",
  },
  // 6 Tula
  6: {
    coreWound:     "They kept the peace so well that they lost track of who they actually were. Nobody noticed because they always seemed fine.",
    fear:          "Being the reason it ended. Choosing themselves and having it be their fault.",
    blindspot:     "They can see every side of every situation so clearly that they never know which side they're actually on.",
    attachment:    "They change to fit whoever they're with. It feels like being flexible. It's also how they slowly disappear.",
    dealbreaker:   "Having to choose between themselves and the relationship. But they'll avoid this moment for as long as possible.",
    getHooked:     "By someone who is confident and pulls them in a clear direction. The relief of not having to decide everything feels huge.",
    redFlag:       "They stay long after their needs have been ignored, because leaving feels like giving up on something beautiful.",
    needsToHear:   "You're allowed to want what you want. Having needs isn't the same as being difficult.",
    insight:       "The harmony you create often has nothing underneath it. Your real needs keep going unmet.",
    solution:      "Say one thing you actually want this week without softening it. Their reaction is the answer.",
    insecurityHook:"You've been so understanding of everyone. Has anyone been that understanding of you?",
  },
  // 7 Vrishchika
  7: {
    coreWound:     "They trusted someone completely. That person used what they shared against them.",
    fear:          "Being betrayed by the one person they actually let in.",
    blindspot:     "They can read everyone else clearly but are often the last to see what's happening in their own relationship.",
    attachment:    "Calm on the outside, intense on the inside. They test people because they need to know someone can handle the real them.",
    dealbreaker:   "Any dishonesty. Even small ones that 'don't really count.'",
    getHooked:     "By someone who can handle their intensity without flinching. Finding someone unafraid of them is rare — when it happens, it's everything.",
    redFlag:       "They confuse intensity with connection. If something stirs them up deeply, they call it love — even when it's pain.",
    needsToHear:   "You're not too intense. You're made for depth. Most people just aren't ready for it.",
    insight:       "You protect yourself so well that sometimes you push away the very person who would have stayed.",
    solution:      "Tell them one thing you've never told anyone else. How they handle that moment is everything.",
    insecurityHook:"You wonder if they'd stay if they really knew you. But have you let them close enough to actually find out?",
  },
  // 8 Dhanu
  8: {
    coreWound:     "They were made to feel bad for wanting more — more honesty, more space, more life. They've been working that out ever since.",
    fear:          "Losing themselves inside a relationship. Becoming a smaller version of who they used to be.",
    blindspot:     "They think keeping distance is the same as having freedom. They leave before things get hard instead of working through it.",
    attachment:    "They fall in love with the idea of someone, then feel uncomfortable when the real person shows up.",
    dealbreaker:   "Being asked to be smaller or quieter. Someone who feels threatened by how much they want from life.",
    getHooked:     "By someone who makes the world feel bigger. Feeling genuinely inspired is the biggest pull for them.",
    redFlag:       "They fall in love with someone's potential, call it love, then leave when that potential doesn't show up.",
    needsToHear:   "You can go deep and still have freedom. Building something real doesn't mean getting trapped.",
    insight:       "When you leave because something felt limiting — check whether the limit was real, or whether you just got scared of what comes after the beginning.",
    solution:      "Stay through one uncomfortable moment you'd normally walk away from. That's where the real thing lives.",
    insecurityHook:"You keep leaving before things get hard. What if the hard part is actually the part that matters?",
  },
  // 9 Makara
  9: {
    coreWound:     "They put everything into something that was never going to work, and couldn't stop because they'd already given so much.",
    fear:          "Working really hard on something and having to admit it was the wrong thing to work on.",
    blindspot:     "They think staying means caring. But staying isn't the same as actually choosing someone.",
    attachment:    "They show love through actions, not words. They'll show up and fix things. But they won't say how they feel until they're sure it's safe.",
    dealbreaker:   "Someone chaotic and unreliable — even if the feelings are real.",
    getHooked:     "By someone who is also working toward something real. Shared goals and reliability feel like love to them.",
    redFlag:       "They stay with people who don't match them emotionally because everything else looks fine on paper.",
    needsToHear:   "You don't have to earn love by being useful. You deserve to be wanted for who you are, not just what you do.",
    insight:       "Are you staying because it's right, or because you've already built so much that leaving feels like losing?",
    solution:      "Say the thing you've been calculating whether to say. Stop calculating. Just say it.",
    insecurityHook:"You've built so much together. But building together isn't the same as being built for each other.",
  },
  // 10 Kumbha
  10: {
    coreWound:     "Almost everyone who mattered to them didn't really get them. They started to think being truly known just wasn't possible.",
    fear:          "Being with someone who only sees the version of them they put forward — not the real one.",
    blindspot:     "They can think their way out of feelings that are completely real and valid.",
    attachment:    "They seem unbothered on the outside. They are not unbothered. They just rarely show how much they care.",
    dealbreaker:   "Someone who wants them to be more normal. More predictable. Just less.",
    getHooked:     "By someone they can't fully figure out. Another interesting, hard-to-read person is the most magnetic thing to them.",
    redFlag:       "They stay in their head so long the other person has already moved on emotionally.",
    needsToHear:   "Being different isn't the same as being difficult. The right person won't need you to be less.",
    insight:       "You've made being closed off into a whole philosophy. But really it's just protection from something that already hurt.",
    solution:      "Once this week, respond from how you feel before you respond from how you think. Even if it's awkward.",
    insecurityHook:"You keep watching from the outside wondering if they really want you. What would happen if you just asked?",
  },
  // 11 Meena
  11: {
    coreWound:     "They loved someone so completely they disappeared into them. When it ended, they didn't know who they were anymore.",
    fear:          "Being alone with themselves after a connection ends. The quiet feels too loud.",
    blindspot:     "They fall in love with who someone could be, not who that person actually is right now.",
    attachment:    "They love at a level most people never experience. When it's real on both sides, it's incredible. When it's not, they don't notice for too long.",
    dealbreaker:   "Cruelty. Any kind of it. Especially the casual kind the other person doesn't even realize is cruel.",
    getHooked:     "By someone who feels like recognition — like they've known them before. That sense of familiarity is the strongest pull.",
    redFlag:       "They stay because they can feel how good it could be — and they can't tell the difference between that feeling and what's actually real.",
    needsToHear:   "The love you feel for them is real. The version of them you're in love with might not be.",
    insight:       "You have one of the deepest abilities to love. The question is whether what you're giving it to is worth it.",
    solution:      "Write down who they actually are — not on their best days, but the pattern over time. Then read it back.",
    insecurityHook:"You feel things most people can't put into words. Don't spend that depth on someone who can't receive it.",
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
  0:  { pattern: "falls fast, gets over it fast, and does the whole thing again", craving: "someone who can keep up without slowing them down", trap: "picking excitement over reliability every time", strength: "they can start fresh without dragging the past with them", shadow: "they leave before they can be left" },
  1:  { pattern: "bonds once and carries that person with them forever, even when they act like they've moved on", craving: "to be loved exactly as hard as they love — completely, no holding back", trap: "staying loyal to people who have already checked out", strength: "they care with a depth most people only read about", shadow: "they grieve relationships they'd never even go back to" },
  2:  { pattern: "burns through connections that don't challenge them", craving: "to be genuinely changed by someone", trap: "thinking that difficult means deep", strength: "their love actually changes the people around them", shadow: "they start arguments just to feel something in the relationship" },
  3:  { pattern: "gets deeply attached and rarely shows just how much", craving: "safety — someone whose presence feels solid and reliable", trap: "staying in comfortable but loveless situations because leaving feels like losing everything", strength: "they can build something that genuinely lasts", shadow: "they settle for feeling secure and call it love" },
  4:  { pattern: "chases beauty and whoever seems to represent it most right now", craving: "someone who is both beautiful and deep in one person", trap: "falling for how someone makes them feel instead of who the person actually is", strength: "they bring something special into every connection they enter", shadow: "they think the feeling someone gives them is the same as knowing that person" },
  5:  { pattern: "crashes into people's lives and exits the same way", craving: "someone who understands their pain without needing it explained", trap: "holding onto painful connections and calling it fate", strength: "emotional honesty that actually helps", shadow: "they go for people who are also hurting, then wonder why it keeps hurting" },
  6:  { pattern: "always comes back — to people, to places, to whatever feels like home", craving: "safety and adventure in the same person", trap: "going back to things long past when going back made sense", strength: "their love survives things that would end most connections", shadow: "they call going back 'knowing what they want'" },
  7:  { pattern: "takes care of everyone until they forget to have needs themselves", craving: "someone who sees through all the caregiving and takes care of them back", trap: "giving so much there's nothing left to take in", strength: "they create the conditions for real closeness", shadow: "they focus so much on the other person they quietly lose themselves" },
  8:  { pattern: "picks up on everything unsaid and says nothing", craving: "someone they can completely lower their guard with", trap: "they notice so much they start suspecting things that aren't there", strength: "they know what's really going on before it even surfaces", shadow: "being very perceptive keeps them protected but also keeps them closed off" },
  9:  { pattern: "carries old hurt into new relationships and calls it knowing their patterns", craving: "to be fully chosen by someone who knows everything about them", trap: "their pride becomes distance", strength: "when they love, it's on purpose — when they choose you, they really mean it", shadow: "they hold back love as a way of staying safe" },
  10: { pattern: "loves in waves — fully there, then pulled back, then fully there again", craving: "love that makes sense — feelings that have real logic behind them", trap: "they pull back when feelings get bigger than they can understand", strength: "they don't love carelessly, so when they do, it means something", shadow: "they use thinking to avoid actually feeling what they're in" },
  11: { pattern: "holds everyone they love with extraordinary care, even people who've hurt them", craving: "a love that also feels like a purpose", trap: "confusing devotion with just accepting whatever comes", strength: "they genuinely make the people they care about better", shadow: "they're better at giving love than asking for it to be right" },
  12: { pattern: "builds their whole emotional world around the relationship, for better or worse", craving: "a real partner — someone to actually build a life with", trap: "making someone their whole world, then wondering why everything feels shaky", strength: "fully present — no half-measures, no hedging", shadow: "they manage their fear of being left by trying to control things" },
  13: { pattern: "pushes toward perfection or walks away — nothing in between", craving: "someone who meets their standards without being told what they are", trap: "the standards become walls no one can actually get over", strength: "with the right person, they create something extraordinary", shadow: "they use standards as an excuse to avoid being open" },
  14: { pattern: "moves through people like the wind — touching everything, staying nowhere", craving: "someone who gives them space and still stays", trap: "they create so much space the connection quietly dies inside it", strength: "they never cling — that's a gift and also a loss", shadow: "they call avoidance freedom" },
  15: { pattern: "lasts longer than almost everyone — in love and in grief", craving: "loyalty that matches their own", trap: "they hold on past the point of return and call it strength", strength: "their commitment doesn't waver", shadow: "they stay because leaving feels like losing" },
  16: { pattern: "loves deeply, often well past the point where it's being matched", craving: "to be loved back with the same amount — completely", trap: "they give everything and can't understand when they don't get that back", strength: "the depth of how they love is rare", shadow: "devotion turns into suffering" },
  17: { pattern: "guards their inner world intensely, but loves the few they let in completely", craving: "to be fully known without having to explain themselves", trap: "they keep their distance thinking it's safety, then wonder why they feel lonely", strength: "when they trust, it's completely real", shadow: "they protect themselves from the very thing they're aching for" },
  18: { pattern: "takes everything apart to understand it, then puts it back together changed", craving: "a love that can survive complete honesty — even the parts that hurt", trap: "they confuse intensity with going deep", strength: "their honesty creates real change", shadow: "they cause the very break they were afraid of" },
  19: { pattern: "always looking for something more — in people and in everything", craving: "a love that makes their world feel bigger", trap: "they pick adventure over depth and move on before things get real", strength: "they bring a feeling of freedom into every connection", shadow: "they call running away 'not being held back'" },
  20: { pattern: "sets very high standards and usually meets them, including in love", craving: "a true equal — someone who matches them completely", trap: "they treat love like a project and wonder why it feels more like work than a feeling", strength: "they build things that last", shadow: "they approach love with strategy because being open feels like losing" },
  21: { pattern: "listens until they know exactly who you are, then holds onto that", craving: "to feel truly heard by someone who accepts them without conditions", trap: "they give others full attention and don't understand why no one does the same for them", strength: "they remember what matters to the people they love", shadow: "they make others feel known without fully knowing themselves" },
  22: { pattern: "connects at a level most people can't match — when someone gets it, they become everything", craving: "to be understood at a level most friendships don't reach", trap: "the bar for feeling understood is so high that most connections get dismissed before they had a chance", strength: "when they bond, it's deep and hard to break", shadow: "they're lonely and call it being picky" },
  23: { pattern: "cycles between needing closeness and needing space in ways that seem random but aren't", craving: "freedom inside commitment — the ability to stay without feeling stuck", trap: "they run from the closeness they actually want", strength: "they can hold love lightly, which is sometimes exactly what it needs", shadow: "pushing people away as a way of feeling safe" },
  24: { pattern: "loves in ways that don't follow the rules, and refuses to change that", craving: "someone who sees the world differently and wants to build something unique with them", trap: "they choose interesting people over right-for-them people", strength: "they create connections unlike anything else when they find someone who really gets them", shadow: "they think unusual means compatible" },
  25: { pattern: "goes quiet to think, then comes back changed — that cycle is how they love", craving: "someone who can sit with them in silence without taking it personally", trap: "they go quiet too long and the connection fades in the gap", strength: "their love deepens over time in ways that surprise everyone, including them", shadow: "they need alone time to love well, and lose people who need constant closeness" },
  26: { pattern: "guides everyone they care about toward something better", craving: "a love that goes somewhere real — not just a good feeling", trap: "they take care of others' growth while neglecting their own", strength: "they make the people they love feel seen and pointed toward their best selves", shadow: "they love people for who they could be, not who they actually are right now" },
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
    headline:          "A time to figure out who you really are in love — not just whether someone wants you.",
    relationshipEffect:"You're becoming someone new, and your relationship has to answer a question: does it fit who you're growing into, or just who you used to be?",
    challenge:         "You might need to be right more than you need to be close right now. That can hurt things.",
    gift:              "Real clarity about what you actually want — maybe for the first time.",
    warning:           "Being clear about yourself doesn't mean being careless with someone who has been loyal to you.",
    lessonForLove:     "A relationship that can't handle the real you was never going to last anyway.",
    oracleContext:     "in your Surya period, you're figuring out who you really are in love — not just whether someone wants you",
  },
  Chandra: { theme:"emotion", quoteCategory:"intuition",
    headline:          "A time of big feelings — everything in love is louder right now, including the scary parts.",
    relationshipEffect:"Your emotions are turned all the way up. You feel more, need more, notice more. The connection feels either really nourishing or really draining.",
    challenge:         "Feeling things this intensely can look like overreacting to others — even when it isn't.",
    gift:              "Your gut feeling about this connection is sharper right now. It's probably right.",
    warning:           "Don't make big permanent decisions while everything feels this intense. Let things settle first.",
    lessonForLove:     "What you're feeling is real information, even when it's uncomfortable.",
    oracleContext:     "in your Chandra period, your feelings are surfacing — the question is what to do with them",
  },
  Mangal: { theme:"action", quoteCategory:"growth",
    headline:          "A time for action — what you've been sitting on needs to become a real decision.",
    relationshipEffect:"Your patience is running thin. Things that have been unresolved are demanding to be dealt with. This can mean more conflict — or a real breakthrough.",
    challenge:         "You want answers now. The other person might not be ready for the conversation yet.",
    gift:              "The courage to actually say what you want — out loud, clearly, without softening it.",
    warning:           "Being pushy and being honest aren't the same thing. Know which one you're doing.",
    lessonForLove:     "Saying the hard thing with care is the only kind of honesty that actually builds something.",
    oracleContext:     "in your Mangal period, action is being called for — what you've been circling around needs a direct answer",
  },
  Budh: { theme:"discernment", quoteCategory:"communication",
    headline:          "A time of clarity — you can see this relationship more clearly than you have before.",
    relationshipEffect:"You're noticing patterns in this connection you couldn't see before. That's useful — and uncomfortable at the same time.",
    challenge:         "Overthinking everything becomes the main reason nothing actually changes.",
    gift:              "You can see the relationship as it actually is, not as you hope it is.",
    warning:           "Thinking clearly about something without doing anything about it is just worrying with nicer words.",
    lessonForLove:     "Clarity only matters if you do something with it.",
    oracleContext:     "in your Budh period, you can see the pattern clearly — the question is whether you'll act on what you see",
  },
  Brihaspati: { theme:"expansion", quoteCategory:"growth",
    headline:          "A time of growth — you're changing, and the relationship either keeps up or it won't fit anymore.",
    relationshipEffect:"You're growing, and you're noticing whether this relationship is growing with you. One that's too small starts to feel suffocating.",
    challenge:         "Growing past someone you still really care about. Having to choose between growing and staying.",
    gift:              "Getting honest about what love should actually feel like — versus what you've been accepting.",
    warning:           "Feeling restless doesn't automatically mean the relationship is wrong. Sometimes you're just growing through something.",
    lessonForLove:     "A relationship that doesn't help you grow is quietly making you smaller.",
    oracleContext:     "in your Brihaspati period, you're being asked to grow — and the relationship has to answer whether it's coming with you",
  },
  Shukra: { theme:"love", quoteCategory:"love",
    headline:          "One of the best times in your life for love. What happens in this period tends to stick.",
    relationshipEffect:"The best conditions for deep connection. New love formed now tends to last. Existing connections either go much deeper or reveal themselves as wrong.",
    challenge:         "You want to see everything as romantic right now. That can make things harder to see clearly.",
    gift:              "This period is genuinely built for love. What you build now has a real foundation.",
    warning:           "This period makes everything feel stronger — including wrong connections. Beautiful isn't the same as right.",
    lessonForLove:     "Whatever relationship you're in during this period will teach you more about love than anything before it.",
    oracleContext:     "in your Shukra period, love is being pointed toward you — the question is whether you're looking in the right direction",
  },
  Shani: { theme:"structure", quoteCategory:"patience",
    headline:          "A testing time — what's real in your relationship survives it. What isn't real, doesn't.",
    relationshipEffect:"This period removes what was never solid. That's painful — and it's also necessary. Whatever connection makes it through is genuinely built to last.",
    challenge:         "Love feels like hard work right now. Distance can feel like loss when it's really just the pace of this period.",
    gift:              "Whatever is still standing at the end of this period is the real thing.",
    warning:           "Difficulty doesn't mean the relationship is wrong. This period tests — it doesn't condemn.",
    lessonForLove:     "Easy isn't the right standard for love. Solid is.",
    oracleContext:     "in your Shani period, your relationship is being tested for what's actually real — what survives was always meant to",
  },
  Rahu: { theme:"obsession", quoteCategory:"intuition",
    headline:          "A time of intensity — everything feels more charged and significant than usual.",
    relationshipEffect:"Connections in this period feel magnetic and very hard to let go of. The intensity is real. But intense doesn't automatically mean right for you.",
    challenge:         "Connection can feel addictive right now — whether it's healthy or not.",
    gift:              "Breaking old patterns that have followed you through multiple relationships.",
    warning:           "The most intense thing you've ever felt isn't always the most right thing.",
    lessonForLove:     "Love that starts in this period is often exactly what you needed to experience — and not what you should stay in forever.",
    oracleContext:     "in your Rahu period, what you're feeling has extra charge — the question is whether the pattern is being broken or just repeated",
  },
  Ketu: { theme:"release", quoteCategory:"healing",
    headline:          "A time of letting go — something needs to leave. The question is whether you'll let it go willingly.",
    relationshipEffect:"This period removes what isn't essential. Connections without a real foundation tend to fall away. That hurts — and it's also right.",
    challenge:         "It feels like failure. It isn't. It's the relationship being refined down to what's real.",
    gift:              "What you let go of makes room for something actually aligned with who you are.",
    warning:           "Don't hold on to what's leaving just because letting go feels like giving up.",
    lessonForLove:     "Some connections exist to show you what you don't want — so you can find what you actually do.",
    oracleContext:     "in your Ketu period, letting go is the lesson — what's leaving was always meant to, even when it doesn't feel that way",
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
    weakText:   "You both have different ideas about what matters most in life. This shows up as one person feeling like the other doesn't take the important things seriously enough — or takes them way too seriously.",
    strongText: "Your priorities in life naturally match. You both want the same things without having to negotiate it.",
    fix:        "Be honest about what actually matters to each of you — not what should matter, but what does. The gap here is usually about values that were never said out loud.",
  },
  Vashya: {
    label:      "Vashya — balance of influence",
    weakText:   "One of you consistently has more pull in the relationship. The other adjusts more often. This creates invisible resentment on both sides over time.",
    strongText: "The influence between you flows both ways. Neither person is always the one adjusting — the balance feels natural.",
    fix:        "Name which one of you adjusts more. Not to blame — just to make it visible so both people can choose to change it.",
  },
  Tara: {
    label:      "Tara — emotional timing",
    weakText:   "Your emotional readiness tends to be out of sync. One of you is ready for something the other isn't — and it keeps swapping. You want the same things, just at different times.",
    strongText: "Your timing tends to match. When you're both ready for something, you usually arrive there together. This is actually rare.",
    fix:        "When the timing feels off, just say it directly: 'I'm ready for this — are you?' The tension here is usually about timing, not about how you feel.",
  },
  Yoni: {
    label:      "Yoni — physical closeness",
    weakText:   "Your physical chemistry takes more conscious effort. The natural pull between you in close contact isn't automatic — it's manageable, but it requires attention.",
    strongText: "Your physical chemistry is naturally built in. Being close is easy and natural between you.",
    fix:        "Create moments of being close that have no goal attached. Just proximity. That reduces the friction here.",
  },
  "Graha Maitri": {
    label:      "Graha Maitri — how you think together",
    weakText:   "Your thinking styles don't naturally match. Understanding each other's reasoning takes effort — you process things in ways that feel a bit foreign to each other.",
    strongText: "Your thinking styles naturally work together. You get each other's logic without having to explain yourself.",
    fix:        "When you feel misunderstood, explain how you got to your conclusion — not just what it is. The gap is in how you got there, not in what you want.",
  },
  Gana: {
    label:      "Gana — emotional style",
    weakText:   "Your personalities are different at a pretty basic level. Under pressure, you respond in opposite ways — one pulls away, one moves closer. Neither is wrong. Together, they create a push and pull.",
    strongText: "Your emotional styles match. You handle the hard moments with the same instincts. You still disagree — but it feels like something you can work through.",
    fix:        "Agree on a signal for 'I need space' that doesn't look the same as 'I'm pulling away.' Mixing those two up is where most of the tension here comes from.",
  },
  Bhakoot: {
    label:      "Bhakoot — the push and pull",
    weakText:   "There is a built-in push and pull between you. One person feels close exactly when the other needs space. This cycle doesn't have a clear cause — which makes it really frustrating.",
    strongText: "No built-in push and pull. The emotional flow between you is natural — no back-and-forth cycle.",
    fix:        "When the cycle starts, name it: 'We're in the back-and-forth again.' Just saying it out loud creates enough distance from the pattern to interrupt it.",
  },
  Nadi: {
    label:      "Nadi — energy balance",
    weakText:   "You share a similar emotional energy type. That creates strong connection, but can also leave you both feeling drained over time in ways that are hard to explain.",
    strongText: "Your emotional energy types balance each other naturally. Neither person is competing for the same space.",
    fix:        "Make sure you both have real time alone to recharge — not just time apart. People with similar energy types need more solo time than most couples.",
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
    headline:     "Everything is possible. Nothing is certain. The gap in between is where all the feeling lives.",
    reality:      "A crush lives mostly in your imagination. What you're feeling is partly about them and partly about who you've decided they are based on very little actual information. Both can be true.",
    mainFear:     "That saying something will end the possibility. That the real version is less than the version in your head.",
    mainTrap:     "Staying in the crush stage forever because possibility feels better than risk.",
    whenItWorks:  "When both people are in the same place — sensing each other without naming it, slowly building toward honesty.",
    whenItDoesnt: "When one person is completely in, and the other is just enjoying the attention.",
    keyQuestion:  "Are your feelings for who they actually are — or for who you've imagined them to be?",
  },
  situationship: {
    headline:     "No label. Lots of feelings. That gap is the whole problem.",
    reality:      "A situationship exists because at least one person is getting the good parts of a relationship without the responsibility. The question is always which one — and whether you're getting less.",
    mainFear:     "That asking for clarity will end it. That naming it kills it. That they don't feel the same and will leave if asked directly.",
    mainTrap:     "Staying in the unclear zone because unclear means it's not over yet.",
    whenItWorks:  "When both people genuinely need time to know what they want and are being honest about that.",
    whenItDoesnt: "When one person knows they don't want commitment and hasn't said so. Usually: when you already know.",
    keyQuestion:  "If nothing changed in the next six months — no label, no commitment — would you stay? Your honest answer is the answer.",
  },
  relationship: {
    headline:     "You chose each other. The question is whether you keep choosing.",
    reality:      "The beginning was one thing. What exists now is a choice that has to be made over and over — in small ways and occasionally in big ones. Love that lasts isn't an accident. It's something you tend.",
    mainFear:     "That you've both changed, and who you've become might not fit together as well as who you were.",
    mainTrap:     "Going on autopilot — assuming the choice was made once and doesn't need to be remade.",
    whenItWorks:  "When both people keep growing and build together from that growing place.",
    whenItDoesnt: "When the relationship becomes the whole identity. When who each person is outside of it gets unclear.",
    keyQuestion:  "Are you choosing this person, or are you choosing the comfort of what you've built together? Those are different things.",
  },
  ex: {
    headline:     "It ended. The feelings didn't. That's not a contradiction — it's just grief.",
    reality:      "The attachment doesn't end when the relationship does. What you miss might be them — or it might be the version of yourself that existed in that connection.",
    mainFear:     "That it was the right one and you let it go. Or that it was never right and you wasted the time.",
    mainTrap:     "Going back out of habit instead of because something actually changed. Returning because forward feels unknown.",
    whenItWorks:  "When both people have genuinely changed, know specifically how, and have that conversation honestly.",
    whenItDoesnt: "When going back means the same dynamic with the same unspoken agreement not to change it.",
    keyQuestion:  "If you went back right now, what would actually be different? Not hoped — actually different. Name one thing.",
  },
};

// ─── Oracle response library ──────────────────────────────────────────────────
// 8+ responses per intent, all hardcoded, selected deterministically by
// hash(intent + userNakshatra + partnerNakshatra + messageLengthBucket)


export const ORACLE_LIBRARY: Record<string, string[]> = {
  misses_me: [
    "Insight\n\"Probably yes — a {{pMoon}} emotional style holds on quietly. But missing you and doing something about it are two different things.\"\n\nWhat to do\n✓ Stop waiting for signs   ✓ Ask yourself what you'd do with a yes   ✓ Build something for yourself right now",
    "Insight\n\"{{p}} probably thinks about you. That doesn't mean they're ready to act on it — carrying someone and choosing them are not the same thing.\"\n\nWhat to do\n✓ Don't mistake their silence for an answer   ✓ Give it a clear deadline in your head   ✓ Focus on what's in your control",
    "Insight\n\"Something real persists between you — that's true. But 'missing' without action is just attachment. What would you actually do with a yes?\"\n\nWhat to do\n✓ Decide what you want first   ✓ Don't keep the door open forever   ✓ Put your energy somewhere that gives back",
    "Insight\n\"{{p}}'s {{pMoon}} style processes feeling quietly and doesn't announce what they carry. The connection didn't vanish — but their silence is still information.\"\n\nWhat to do\n✓ Take the silence at face value   ✓ If you need to know, ask directly   ✓ Stop re-reading old messages for hidden meaning",
  ],
  loves_me: [
    "Insight\n\"{{p}}'s {{pMoon}} emotional style doesn't fake feelings they don't have — it hides the ones they do. Look at what they do when it's inconvenient for them. That's the real answer.\"\n\nWhat to do\n✓ Watch their actions, not their words   ✓ Notice how they show up when you need something   ✓ Ask directly if you're still unsure",
    "Insight\n\"The connection is real — {{gunaVerdict}}. But feeling something and choosing to act on it are different. You're not imagining it. The question is whether they're showing up for it.\"\n\nWhat to do\n✓ Stop analyzing and ask once, clearly   ✓ Give them space to answer honestly   ✓ Trust what you observe, not what you hope",
    "Insight\n\"Your instincts are strong. What you sensed before the doubt set in — that's usually accurate. A {{pMoon}} style hides care, it doesn't fake it.\"\n\nWhat to do\n✓ Go back to your first read   ✓ Notice consistency in small moments   ✓ Don't ask again — decide based on what you've already seen",
    "Insight\n\"{{p}}'s pattern in love is {{pNakPattern}}. That kind of attachment isn't casual. The question isn't whether the feeling is there — it's whether they're willing to act on it.\"\n\nWhat to do\n✓ Look at initiation — who reaches out when?   ✓ Ask for what you need directly   ✓ Accept the answer you get, not the one you wanted",
  ],
  come_back: [
    "Insight\n\"Coming back only works if something actually changed — not just the feeling, the pattern. What specifically would be different this time?\"\n\nWhat to do\n✓ Name what needs to change before saying yes   ✓ Don't mistake missing them for being ready   ✓ Give it more time before deciding",
    "Insight\n\"The connection was real — that's not the question. The question is whether you're both different enough from who you were when it ended.\"\n\nWhat to do\n✓ Make a list of what needs to be different   ✓ Have the conversation about what broke it   ✓ Don't go back to the same dynamic in a new beginning",
    "Insight\n\"{{p}}'s {{pMoon}} emotional style tends to return when the feeling gets strong enough — but feeling is not the same as readiness. What has actually changed on their end?\"\n\nWhat to do\n✓ Ask them directly what's different now   ✓ Watch their actions over weeks, not days   ✓ Don't let hope override what you're actually seeing",
    "Insight\n\"Real reconciliation needs two honest conversations: what broke it, and what's genuinely changed. Without both, the return is just the same story starting over.\"\n\nWhat to do\n✓ Have the real conversation first   ✓ Don't rush the decision because the feeling is back   ✓ Check: is this love or fear of moving on?",
  ],
  should_text: [
    "Insight\n\"If they haven't replied, more messages won't get you the answer you want. One honest message is all you get — anything after that is chasing, not communicating.\"\n\nWhat to do\n✓ Send one real message if you haven't   ✓ After that, give it actual space   ✓ The silence is already information — stop looking for a different answer in it",
    "Insight\n\"The right message doesn't need to be calculated. If you're still working out what to say, you're not ready to send it. When you know the real thing, you'll just know.\"\n\nWhat to do\n✓ Write the honest version, not the safe one   ✓ Say exactly what you mean — no subtext   ✓ Send it once and let it land",
    "Insight\n\"You're asking whether to text because you're hoping the answer is yes. If you reach out, say the actual thing — not something designed to get a reaction.\"\n\nWhat to do\n✓ Don't send 'hey' — say the real thing   ✓ Reach out once, then give genuine space   ✓ Their response (or silence) tells you what you need to know",
    "Insight\n\"{{p}}'s pattern means they respond to directness, not hints. If you're going to reach out, be clear. Calculated messages get calculated responses.\"\n\nWhat to do\n✓ Be direct — say what you actually want to say   ✓ Don't test them — it won't give you real information   ✓ Decide in advance how you'll handle no reply",
  ],
  why_left: [
    "Insight\n\"It's rarely one thing. A {{pMoon}} emotional style pulls back before the visible signs — the withdrawal started earlier than you think. It's not a verdict on your worth.\"\n\nWhat to do\n✓ Stop replaying it for a new answer   ✓ Notice what this clarified about what you need   ✓ Don't reach out for closure — write it yourself",
    "Insight\n\"{{p}}'s shadow in love is {{pNakShadow}}. They were probably doing the most they were capable of. That doesn't make it okay — it makes it explainable.\"\n\nWhat to do\n✓ Stop taking it personally — their pattern predates you   ✓ Ask: what did this teach me about what I need?   ✓ Give yourself time before assuming you know the full reason",
    "Insight\n\"The departure happened at the surface. What drove it was a pattern running underneath that neither person named. Unnamed things express themselves as distance.\"\n\nWhat to do\n✓ Don't look for the moment you missed — it was a pattern, not a moment   ✓ Trust your instincts about what felt off   ✓ Use what you learned to ask differently next time",
    "Insight\n\"When someone leaves, the most useful question is: what did this clarify about what you actually need? That answer matters more than the reason they gave.\"\n\nWhat to do\n✓ Write down what you needed that wasn't there   ✓ Stop replaying — you have enough data   ✓ Let the clarity from this shape what you ask for next",
  ],
  why_fight: [
    "Insight\n\"You process emotion through {{uMoonStyle}}. {{p}} processes through {{pMoonStyle}}. When those clash under stress, you're both speaking different languages at the same volume. The fight is usually not about the fight.\"\n\nWhat to do\n✓ Name what's underneath — once, calmly, not mid-fight   ✓ Ask: what's the one thing we never actually say?   ✓ Pick a pause signal for when it escalates",
    "Insight\n\"The recurring argument has a recurring real subject. What's the one thing neither of you has said directly? That's what the fights are actually about.\"\n\nWhat to do\n✓ Find the pattern — what always comes up?   ✓ Say the real thing outside of a fight   ✓ Ask yourself: am I fighting to win or to be understood?",
    "Insight\n\"Under pressure, one of you moves toward, one moves away. Neither is wrong, but together they create a push-pull that exhausts both people. It's not about who's right.\"\n\nWhat to do\n✓ Name the dynamic out loud — it gets smaller when you do   ✓ Agree on a cool-down rule before the next fight   ✓ Ask: what do we both actually want from this?",
    "Insight\n\"Most recurring arguments circle back to the same unaddressed thing. Fix the underlying thing, not just the fight.\"\n\nWhat to do\n✓ Identify the real subject — it's probably the same every time   ✓ Say it once, directly, when you're calm   ✓ Stop fighting about the symptom and address the cause",
  ],
  compatible: [
    "Insight\n\"Your compatibility: {{gunaVerdict}}. Genuine material is there. Compatible doesn't mean easy — it means worth the work when both people are doing it.\"\n\nWhat to do\n✓ Build from your strength: {{strongKootaText}}   ✓ Pay attention to your friction area   ✓ Ask: are we both actually choosing this?",
    "Insight\n\"Compatible means built for something real together — if both people understand the shape of what they have. You have a real foundation. The question is what you're building on it.\"\n\nWhat to do\n✓ Stop asking if you're compatible and start asking if you're both choosing this   ✓ Name one thing each of you needs to work on   ✓ Compatibility is potential — relationship is choice",
    "Insight\n\"{{gunaVerdict}} — real resonance is there. Your strongest point: {{strongKootaText}}. Your friction area is where most of the unanswered questions live.\"\n\nWhat to do\n✓ Lean into what flows naturally   ✓ Address the friction area directly — it won't resolve itself   ✓ Both people have to be growing for this to work long-term",
    "Insight\n\"The most compatible people still have friction — because friction is where growth lives. You have a genuine foundation. The question is whether you're both using it.\"\n\nWhat to do\n✓ Look at how you handle the hard moments, not the easy ones   ✓ Ask: are we growing together or avoiding the same things?   ✓ Say the thing that keeps not getting said",
  ],
  move_on: [
    "Insight\n\"You don't move on by deciding to. You move forward by building enough in the present that the past stops being the loudest thing.\"\n\nWhat to do\n✓ Unfollow or mute — not drama, just hygiene   ✓ Stop measuring progress by whether you've stopped feeling   ✓ Find one thing you're actively building right now",
    "Insight\n\"You're not just holding on to them — you're holding on to the version of yourself that existed in that connection. That grief is different, and it matters.\"\n\nWhat to do\n✓ Let yourself feel it without replaying it   ✓ Don't check their social — every check restarts the loop   ✓ Rebuild the parts of yourself that existed before them",
    "Insight\n\"Moving on doesn't mean not feeling it. It means the feeling stops running your decisions. You can miss someone and still choose not to go back.\"\n\nWhat to do\n✓ Give yourself a timeline — not to stop feeling, to stop acting from it   ✓ Delete the thread if you keep re-reading it   ✓ Do one new thing this week that has nothing to do with them",
    "Insight\n\"When energy has direction, grief changes shape. The question isn't 'am I over them' — it's 'what am I building right now?' When that answer gets interesting, the first question matters less.\"\n\nWhat to do\n✓ Stop organizing your present around their absence   ✓ Build something that has nothing to do with this   ✓ Give yourself permission to actually be okay",
  ],
  future: [
    "Insight\n\"The future is built in small moments — how you both show up when it's inconvenient. Signs and timing don't decide it. Choices do.\"\n\nWhat to do\n✓ Be specific about what you need from {{p}}   ✓ Watch what they're actually doing, not what they're saying   ✓ Build something for yourself either way",
    "Insight\n\"Your compatibility: {{gunaVerdict}}. Real material is there. But compatible material still requires two people actively choosing each other. That's the variable that matters most.\"\n\nWhat to do\n✓ Ask: are we both choosing this, right now?   ✓ Name what you need to see from them   ✓ Stop waiting for the future to decide — it's being decided in present choices",
    "Insight\n\"The future of this isn't written. It's decided. The most important variable is whether you're both honest about what you want — not aspirationally, practically.\"\n\nWhat to do\n✓ Name what you actually need   ✓ Have the conversation you've been building toward   ✓ Accept the answer you get, not the one you want",
    "Insight\n\"The future of this connection depends on whether both people are showing up honestly. That's the only thing that actually determines it.\"\n\nWhat to do\n✓ Have the direct conversation — stop waiting for the right moment   ✓ Watch actions over weeks, not days   ✓ Build your own life alongside this, not instead of it",
  ],
  addicted: [
    "Insight\n\"The intensity is real. But the pull isn't always toward the person — it's toward the feeling they gave you: being chosen, certainty, intensity. Those are different things.\"\n\nWhat to do\n✓ Name the specific feeling you miss   ✓ Reduce exposure — checking their profile restarts the loop   ✓ Direct that energy toward something that can actually give back",
    "Insight\n\"Your nervous system learned {{p}}'s presence as a baseline. When it's gone, it treats the absence as deprivation. This is real — and it passes when you stop feeding the loop.\"\n\nWhat to do\n✓ Cut the loop — less checking, less replaying   ✓ Name what specific need this connection was filling   ✓ Find one other place to start meeting that need",
    "Insight\n\"The same depth that makes this hurt this much is what makes you capable of real love. The work isn't to feel less — it's to direct that energy better.\"\n\nWhat to do\n✓ Stop feeding the obsession loop — every action toward them resets it   ✓ Ask: what exactly did they give me that I'm craving?   ✓ Find one thing outside of this that gets your full attention",
    "Insight\n\"The pull is mostly a loop, not a fact. Each time you check on them or replay the connection, you restart the attachment response. The loop breaks when you stop feeding it.\"\n\nWhat to do\n✓ Identify every behavior that keeps the loop going   ✓ Stop those behaviors for 7 days   ✓ Notice how the intensity shifts",
  ],
  confused: [
    "Insight\n\"Mixed signals from {{p}} usually mean they're mixed internally — they want you and aren't ready at the same time. The confusion is theirs, not a failure of your perception.\"\n\nWhat to do\n✓ Ask the direct question — once   ✓ Give them time to answer honestly   ✓ If there's still no clarity, that ambiguity is its own answer",
    "Insight\n\"You already know something is off. Your gut registered it before your mind started explaining it away. What did you notice before the second-guessing started?\"\n\nWhat to do\n✓ Trust your first read   ✓ Stop analyzing — more analysis won't give you clarity   ✓ Ask directly, then leave space for a real answer",
    "Insight\n\"{{p}}'s {{pMoon}} style can want you and not be ready simultaneously — both true at once. You can't resolve their internal conflict by reading the signals more carefully.\"\n\nWhat to do\n✓ Name what you're observing, not what you're afraid it means   ✓ Ask once, plainly   ✓ Set a deadline: if it's still unclear by [date], you have your answer",
    "Insight\n\"The confusion lives in the gap between what {{p}} is showing and what they're saying. That gap is information — not about you, about them.\"\n\nWhat to do\n✓ Trust what you observe over what you're told   ✓ Say what you need clearly, once   ✓ Don't wait indefinitely for someone who hasn't decided",
  ],
  red_flag: [
    "Insight\n\"Your instincts are data. A {{uMoon}} emotional style reads safety accurately — when something feels off, it usually is. The question is whether you're willing to act on what you're already seeing.\"\n\nWhat to do\n✓ Write down the specific things you've noticed   ✓ Ask: what would you tell a close friend in this exact situation?   ✓ Don't wait for a bigger sign",
    "Insight\n\"The red flag is rarely in the dramatic moments. It's in the pattern of small things you've explained away — each one individually reasonable, together forming a clear picture.\"\n\nWhat to do\n✓ List what you've explained away   ✓ Look at the pattern, not each incident in isolation   ✓ Trust what the pattern says",
    "Insight\n\"No compatibility score justifies staying in something that consistently harms you. Sometimes the most significant connection teaches you exactly what you won't accept.\"\n\nWhat to do\n✓ Name what's happening clearly, without softening it   ✓ Tell one person you trust what's been going on   ✓ Get space — clarity requires distance",
    "Insight\n\"{{p}}'s shadow in love is {{pNakShadow}}. When does that show up? What does it look like consistently? Your own observation is more useful than any general read.\"\n\nWhat to do\n✓ Track specific behaviors, not feelings   ✓ Say what you need and watch what happens   ✓ If the pattern doesn't change, that's your answer",
  ],
  timing: [
    "Insight\n\"Timing questions are usually readiness questions. The calendar isn't the variable — your readiness and theirs are. Be honest about which one you're actually asking about.\"\n\nWhat to do\n✓ Be honest about your own readiness first   ✓ 'Too late' is rarely actually too late — 'too soon' means there's work left   ✓ Stop waiting for perfect conditions",
    "Insight\n\"'Too soon' usually means there's growth that hasn't happened yet — in you, in them, or in the connection. That's not a no — it's information about what needs to happen first.\"\n\nWhat to do\n✓ Name what specifically needs to be ready   ✓ Give it a concrete timeline, not open-ended waiting   ✓ Work on what's in your control",
    "Insight\n\"If the timing keeps missing, it may be two people on slightly different cycles. Both people have to close the gap — it doesn't happen on its own.\"\n\nWhat to do\n✓ Have an honest conversation about where you both are   ✓ Agree on what readiness looks like for each of you   ✓ Decide together, not through signals",
    "Insight\n\"The right moment doesn't usually announce itself. You sense it from your own readiness — not the circumstances. If you're waiting for everything to be perfect, the wait could be forever.\"\n\nWhat to do\n✓ Ask: what am I actually waiting for?   ✓ Name it specifically   ✓ Move when you're ready, not when everything is ideal",
  ],
  general: [
    "Insight\n\"Your love style is {{lagnaLoveStyle}}. That's both your strength and your blindspot right now. The gift: {{lagunaNeed}}. The thing to watch: {{lagnaBlindspot}}.\"\n\nWhat to do\n✓ Say the thing you've been building toward   ✓ Watch {{p}}'s actions, not their words   ✓ Trust what you noticed before you talked yourself out of it",
    "Insight\n\"You already sense what's true here — before the analysis, before the second-guessing. What did your gut say first? That first read is almost always the most accurate thing you have.\"\n\nWhat to do\n✓ Go back to your first instinct   ✓ Stop looking for more information — you have enough   ✓ Ask {{p}} the thing you've been not asking",
    "Insight\n\"The question you're circling has an answer you already feel. The analysis is a way of getting permission to act on it. What would you tell someone you love in your exact situation?\"\n\nWhat to do\n✓ Apply that advice to yourself   ✓ Name the real question underneath this one   ✓ Have the conversation you've been avoiding",
    "Insight\n\"Something real exists between you and {{p}} — {{gunaVerdict}}. And something about it isn't fully resolved. The resolution doesn't come from waiting or analyzing — it comes from asking the question directly.\"\n\nWhat to do\n✓ Name what's unresolved   ✓ Have the direct conversation   ✓ Accept whatever answer you get honestly",
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
  "Something worth thinking about today: are you staying in this connection because it feels right, or because you're scared of what stops if you leave? Those two things can feel the same from the inside — but they lead to very different places.",
  "The thing you've been avoiding saying is probably the thing that would most change this. That's not a coincidence — it's exactly why you're avoiding it.",
  "Notice how you feel in the hour AFTER you think about them. Not while you're thinking — after. That feeling is more honest than the thoughts.",
  "The version of this connection you're holding onto in your head — when did it stop matching what's actually happening? That gap started at a specific moment. Find it.",
  "What would you tell someone you love if they described your exact situation to you right now? You already have the answer. The only question is why you're not applying it to yourself.",
  "There's something in this connection that keeps asking you to make yourself smaller to make things work. Whatever that is — find it today, and name it.",
  "The pattern you keep running into with them isn't bad luck. It has a shape. Once you can see the shape clearly, you get to decide whether you keep fitting into it.",
  "How they treat you when something is inconvenient for them is the most honest information you have about who they are. Not the good moments — the inconvenient ones. Look at those directly.",
  "You already know what you need from this. The question you keep skipping: are you willing to ask for it clearly, and actually accept whatever the honest answer is?",
  "The conversation you keep not having is costing you more than just having it would. At some point, avoiding it costs more than the honesty. You might already be past that point.",
];
