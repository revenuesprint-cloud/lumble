// Vedic numerology + day-lord color system for daily lucky features.
// All outputs are deterministic: same user + same date = same result.

// ─── Numerology helpers ───────────────────────────────────────────────────────

function reduceToSingle(n: number): number {
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return n === 0 ? 9 : n;
}

function dateDigitSum(dateStr: string): number {
  // Works on "YYYY-MM-DD" strings
  return dateStr
    .replace(/-/g, "")
    .split("")
    .reduce((sum, d) => sum + parseInt(d, 10), 0);
}

export function lifePathNumber(birthDate: string): number {
  return reduceToSingle(dateDigitSum(birthDate));
}

export function todayVibration(): number {
  const now   = new Date();
  const yy    = now.getFullYear();
  const mm    = now.getMonth() + 1;
  const dd    = now.getDate();
  const total = dateDigitSum(`${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`);
  return reduceToSingle(total);
}

export function getLuckyNumber(birthDate: string): number {
  return reduceToSingle(lifePathNumber(birthDate) + todayVibration());
}

// ─── Number archetypes ────────────────────────────────────────────────────────

export interface NumberData {
  archetype:        string;
  energy:           string;
  description:      string;
  opportunities:    string[];
  lifePathMeaning:  string;
}

export const NUMBER_DATA: Record<number, NumberData> = {
  1: {
    archetype:       "The Pioneer",
    energy:          "Leadership & Initiative",
    description:     "Today carries the energy of beginnings. Whatever you start now has momentum behind it. Decisions you make carry more weight than usual — and your first instinct is sharper than it's been all week.",
    opportunities:   [
      "The first person to reach out to you today is bringing something important — don't brush it off",
      "If you're choosing between two paths, trust your gut and move. The 1 punishes hesitation",
      "Watch for this digit today: in timestamps, receipts, or door numbers. Each sighting is the universe confirming your direction",
    ],
    lifePathMeaning: "Your soul chose the path of the leader. You're here to forge new ground, often alone at first — and that independence isn't loneliness, it's purpose. The people who come after you walk easier because you went first.",
  },
  2: {
    archetype:       "The Diplomat",
    energy:          "Balance & Partnership",
    description:     "Today's vibration lives in the space between two people. What isn't being said in one of your relationships? What needs a gentle bridge? Your intuition is tuned into subtleties that most people miss entirely today.",
    opportunities:   [
      "Send the message you've been sitting on — today's energy softens how things land",
      "Your most meaningful conversation today won't be the loudest one. Listen for the quieter one",
      "Look for things that come in pairs — two signs pointing the same way is not a coincidence today",
    ],
    lifePathMeaning: "You feel things between the lines — the unspoken tension, the quiet love, the thing that was almost said. This sensitivity isn't a flaw. It's how you read rooms, people, and situations that most people walk through blind.",
  },
  3: {
    archetype:       "The Creator",
    energy:          "Expression & Joy",
    description:     "Something wants to come out of you today — a feeling, an idea, a confession you've been sitting with. The 3 energy resists being kept quiet. Something that leaves your head and enters the world today will go further than you expect.",
    opportunities:   [
      "Say the thing you've been composing in your head. Today it'll land the way you meant it",
      "Be the one who laughs first. The energy in a room follows whoever leads with lightness today",
      "Notice what you create effortlessly in the next few hours — that's your natural frequency showing up",
    ],
    lifePathMeaning: "Your soul speaks in creativity. Whether through words, art, presence, or just the energy you carry into a room — you're here to make people feel something. That's not small. That's everything.",
  },
  4: {
    archetype:       "The Builder",
    energy:          "Stability & Foundation",
    description:     "Today asks for the unglamorous thing: showing up, following through, doing the work that doesn't get celebrated. That's the real flex right now — and what you build on a 4 day actually holds.",
    opportunities:   [
      "Whatever you start and complete today, however small, will compound in ways you won't see yet",
      "Four is the number of corners in every structure. Look for what needs to be stabilised in one of your relationships",
      "The thing on your list you keep skipping because it's boring — that's the one the 4 energy is asking for",
    ],
    lifePathMeaning: "You came here to build things that last. Habits, structures, relationships. People lean on you because you actually hold weight without buckling. That reliability is a form of love most people never think to call by its name.",
  },
  5: {
    archetype:       "The Explorer",
    energy:          "Freedom & Change",
    description:     "The 5 is restless. Something is shifting, and the worst thing you can do is hold too tight. Go somewhere you don't usually go, say yes to the unplanned thing, and let today be different from yesterday.",
    opportunities:   [
      "Take the long way. Change one routine. The detour is the actual point today, not the inconvenience",
      "If your first plan falls through, the second plan was always the real plan",
      "Watch for this number near transport — bus numbers, exits, floor numbers. Movement is your sign today",
    ],
    lifePathMeaning: "You are the one who can't be contained, and every time you've tried to settle before you were ready, something in you resisted. That resistance is your compass. You're not restless — you're alive to something most people stop feeling.",
  },
  6: {
    archetype:       "The Nurturer",
    energy:          "Love & Responsibility",
    description:     "Today is about tending to what you love. Who needs a check-in? What relationship has been running on fumes while you waited for the right moment? The 6 energy rewards care given freely, without keeping score.",
    opportunities:   [
      "Reach out to someone you've been meaning to — the timing today is softer than you think",
      "Something beautiful is already in your ordinary today. The meal, the space, the quiet moment. Notice it",
      "Where have you been giving without receiving? Today you're allowed to ask for what you actually need",
    ],
    lifePathMeaning: "Love isn't something that happens to you — it's something you create. You make people feel at home, held, and seen. The fact that you make it look effortless doesn't mean it is. It means you're very, very good at it.",
  },
  7: {
    archetype:       "The Seeker",
    energy:          "Wisdom & Introspection",
    description:     "Today is quieter than it looks on the surface. Something is processing underneath — in you, in your relationships, in situations you think have stalled. Give yourself permission to not have it figured out yet. That's exactly where the real insight lives.",
    opportunities:   [
      "The thought you keep coming back to today is asking to be thought through, not rushed past",
      "Spend time alone if you can — even briefly. The 7 energy reveals itself in stillness, not noise",
      "What question have you been avoiding asking yourself? Today you can sit with it honestly without it crushing you",
    ],
    lifePathMeaning: "You came here to understand things — people, patterns, the deep why underneath everything. Your tendency to overthink isn't a flaw. It's how you download truth. The problem isn't that you think too much — it's that not enough people can keep up.",
  },
  8: {
    archetype:       "The Achiever",
    energy:          "Power & Abundance",
    description:     "The 8 is the infinity symbol standing upright — what you put out returns amplified today. Your actions carry unusual weight. Move with intention. This is a day where bold, considered moves compound into something real.",
    opportunities:   [
      "Ask for what you're worth. The 8 energy specifically supports requests that would usually feel like too much",
      "Any decision involving resources, work, or long-term plans made today carries forward momentum",
      "Notice who shows up in your world today — 8 days bring powerful connections when you're paying attention",
    ],
    lifePathMeaning: "You have an unusual relationship with power — sometimes drawn to it, sometimes afraid of what it says about you to want it. Your journey is discovering that real power isn't control. It's impact. And you have more of it than you let yourself believe.",
  },
  9: {
    archetype:       "The Sage",
    energy:          "Completion & Release",
    description:     "Something is finishing. It might be a feeling, a version of a situation, an old story you've been telling yourself about someone. The 9 day doesn't cling. It asks you to let one thing complete so something new can have room.",
    opportunities:   [
      "A conversation that needs a proper ending can happen today with more grace than usual",
      "What would you do if this were the last day of a particular chapter? That clarity is your compass right now",
      "Forgiveness — of yourself or someone else — comes unusually easily on 9 days. See if there's anywhere that wants to move",
    ],
    lifePathMeaning: "You've lived many lifetimes in this one. You feel everything and you carry more than people know about. Your wisdom isn't just for you — it changes the rooms you walk into, the people who know you, the conversations you don't realise you're shaping.",
  },
};

// ─── Day-lord color system ────────────────────────────────────────────────────

const DAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;
export type Planet = typeof DAY_LORDS[number];

export interface ColorEntry {
  name:          string;
  hex:           string;
  gradient:      [string, string];
  planet:        Planet;
  planetMeaning: string;
  colorMeaning:  string;
  howToUse:      string[];
}

const COLOR_MATRIX: Record<Planet, Record<string, ColorEntry>> = {
  Sun: {
    Fire:  { name: "Solar Gold",     hex: "#F59E0B", gradient: ["#FDE68A", "#F59E0B"], planet: "Sun", planetMeaning: "The Sun governs vitality, confidence, and your core identity. Sun days amplify visibility and self-expression — what you put out today is seen.", colorMeaning: "Solar Gold activates your inner fire. It draws attention without trying and projects confidence without ego. This is the color of people who have stopped apologising for taking up space.", howToUse: ["Wear gold or amber tones — even a small detail like a ring or earring activates the frequency", "Look for this color today: sunlight on windows, golden drinks, anything catching the light. Each one is a sign", "If you have something to say that you've been keeping quiet — today this color gives you the channel to say it"] },
    Earth: { name: "Amber Clay",     hex: "#D97706", gradient: ["#F59E0B", "#D97706"], planet: "Sun", planetMeaning: "The Sun governs vitality, confidence, and your core identity.", colorMeaning: "Amber Clay is the Sun grounded in earth — warmth that doesn't fade, the kind of showing up that doesn't burn out. This is the color of steady, sustainable radiance.", howToUse: ["Terracotta, burnt orange, or warm brown tones anchor your energy without draining it today", "Drink something warm and golden — tea, turmeric, honey. Small ritual, real effect", "Your most productive hours are when the sun is highest today. Don't spend them scrolling"] },
    Air:   { name: "Pale Saffron",   hex: "#FDE68A", gradient: ["#FEF9C3", "#FDE68A"], planet: "Sun", planetMeaning: "The Sun governs vitality, confidence, and your core identity.", colorMeaning: "Pale Saffron is light you barely register until it's gone. It's the color of easy confidence — not loud, just certain. The kind of presence that doesn't need to prove itself.", howToUse: ["Light yellows and warm creams lift your mood subtly and consistently throughout the day", "If you're in conversation, be the one who finds the lightness. You'll be remembered for it", "Notice light itself today — how it shifts, where it falls, when it hits your face. The Sun is speaking gently"] },
    Water: { name: "Deep Amber",     hex: "#B45309", gradient: ["#D97706", "#92400E"], planet: "Sun", planetMeaning: "The Sun governs vitality, confidence, and your core identity.", colorMeaning: "Deep Amber is intensity meeting warmth — what happens when fire learns patience. Water moons on Sun days sometimes feel overstimulated. This shade is the bridge between brilliance and rest.", howToUse: ["Warm earthy tones help you stay fully present without being overwhelmed by today's outward energy", "If social situations feel like a lot, give yourself a midday reset alone. You process sun differently", "Your insights from today often arrive hours after an experience, not during it — trust the delay"] },
  },
  Moon: {
    Fire:  { name: "Moonlit Rose",   hex: "#FDA4AF", gradient: ["#FDE8E8", "#FDA4AF"], planet: "Moon", planetMeaning: "The Moon governs emotions, intuition, and inner cycles. Moon days are softer externally but feel much louder on the inside.", colorMeaning: "Moonlit Rose is the feeling of something tender being said out loud. It's the specific bravery of softness — the strength that looks like vulnerability and is anything but.", howToUse: ["Rose, blush, or soft pink grounds the emotional intensity that Moon days bring for Fire moons", "Say the vulnerable thing today. Moon days carry emotional honesty unusually far and land it cleanly", "Notice what you feel in the first ten minutes after waking — that's today's emotional weather for the whole day"] },
    Earth: { name: "Stone Pearl",    hex: "#E2E8F0", gradient: ["#F8FAFC", "#E2E8F0"], planet: "Moon", planetMeaning: "The Moon governs emotions, intuition, and inner cycles.", colorMeaning: "Stone Pearl is stillness you can wear. For Earth moons on Moon days, the inner world is especially rich — and this color protects that quiet intelligence while you move through the noise.", howToUse: ["White, grey, or pearl tones create a subtle protective layer between you and external demands today", "Your emotional intelligence is at its peak — trust the feeling in your body over the logic in your head today", "If something feels off in a relationship, you're probably right. But wait until tomorrow to act on it"] },
    Air:   { name: "Pale Lavender",  hex: "#DDD6FE", gradient: ["#EDE9FE", "#DDD6FE"], planet: "Moon", planetMeaning: "The Moon governs emotions, intuition, and inner cycles.", colorMeaning: "Pale Lavender is the exact color of the space between thinking and feeling. Air moons run on thought — Moon days ask you to feel without immediately analysing. Let that be okay today.", howToUse: ["Lavender or soft purple helps you say what you feel, not just what you think", "Moon days are made for conversations without a predetermined outcome. Lean into the uncertainty", "If you find yourself more sensitive than usual today, you're tuned in correctly. Don't try to dial it back"] },
    Water: { name: "Silver Tide",    hex: "#94A3B8", gradient: ["#CBD5E1", "#94A3B8"], planet: "Moon", planetMeaning: "The Moon governs emotions, intuition, and inner cycles.", colorMeaning: "Silver Tide is the ocean just before dawn — filled with feeling but completely clear. Water moons on Moon days are operating at their full depth. Don't waste this frequency on shallow water.", howToUse: ["Silver, slate, or cool grey connects you to the lunar energy you already carry in your chart", "Your intuition is accurate today. If something feels wrong, it is. If something feels right, trust it fully", "Write down what you feel before you analyse it. This is a rare window of emotional clarity that closes quickly"] },
  },
  Mars: {
    Fire:  { name: "Crimson Pulse",  hex: "#F43F5E", gradient: ["#FECDD3", "#F43F5E"], planet: "Mars", planetMeaning: "Mars governs desire, courage, and direct action. Mars days cut through hesitation — the energy rewards people who move first.", colorMeaning: "Crimson Pulse is the color of wanting something without apology. For Fire moons, this is your native language — today you're fully fluent in it and people can feel it.", howToUse: ["Red or deep rose today amplifies your magnetism and your ability to move things forward without second-guessing", "If there's something you've been afraid to want — admit it to yourself today, minimum. The rest follows", "Your directness will not land wrong today. Say the clear thing instead of the careful thing"] },
    Earth: { name: "Terra Cotta",    hex: "#C2410C", gradient: ["#EA580C", "#C2410C"], planet: "Mars", planetMeaning: "Mars governs desire, courage, and direct action.", colorMeaning: "Terra Cotta is Mars for someone who builds things that last. The action today isn't loud or dramatic — it's the kind that actually sticks because it's grounded.", howToUse: ["Earthy reds and burnt orange bring determined, grounded forward motion today", "Pick one thing that's been waiting for action. One. Do it completely before anything else", "Your frustration today is precise information — what specifically is it pointing at? That's your task"] },
    Air:   { name: "Coral Dawn",     hex: "#FB7185", gradient: ["#FCA5A5", "#FB7185"], planet: "Mars", planetMeaning: "Mars governs desire, courage, and direct action.", colorMeaning: "Coral Dawn is desire made beautiful — wanting something without over-intellectualising why. Air moons often analyse their wants before feeling them. Today, let yourself want first.", howToUse: ["Coral and salmon tones bring warmth and confident social energy today", "Say what you actually want in a conversation, not the edited version of what you want", "Your energy is high today. Channel it toward motion rather than anxiety — they use the same fuel"] },
    Water: { name: "Deep Garnet",    hex: "#9F1239", gradient: ["#BE123C", "#881337"], planet: "Mars", planetMeaning: "Mars governs desire, courage, and direct action.", colorMeaning: "Deep Garnet is the quiet version of fire — feeling intensity so completely that it becomes a kind of power. Water moons carry Mars days differently: deeper, more internal, and ultimately more lasting.", howToUse: ["Deep red or garnet grounds intense emotional energy without suppressing it or letting it leak", "If you're feeling something strongly today, name it precisely. Vague feelings build pressure; named ones can move", "The thing you're protecting yourself from today — is it actually a threat, or is it just unfamiliar?"] },
  },
  Mercury: {
    Fire:  { name: "Electric Jade",  hex: "#10B981", gradient: ["#A7F3D0", "#10B981"], planet: "Mercury", planetMeaning: "Mercury governs communication, quick thinking, and the movement of ideas. Mercury days sharpen the mind and speed up the signal between thought and speech.", colorMeaning: "Electric Jade is thought that moves fast and lands precisely. Fire moons on Mercury days can say exactly what they mean without burning anyone in the process.", howToUse: ["Bright green activates your communication energy — wear it if you have anything important to say today", "Write something. Anything. Mercury days reward people who capture their thoughts before they dissolve", "The idea you have in passing today is worth more than it feels like in the moment. Write it down immediately"] },
    Earth: { name: "Forest Depth",   hex: "#059669", gradient: ["#10B981", "#065F46"], planet: "Mercury", planetMeaning: "Mercury governs communication, quick thinking, and the movement of ideas.", colorMeaning: "Forest Depth is Mercury thinking through the body — slow, thorough, and complete. Earth moons process information carefully, and today your deliberateness is your competitive edge.", howToUse: ["Deep green grounds Mercury's scattered energy into something practical that you'll still stand behind tomorrow", "You're unusually good at saying things that make sense and stay true. Do that today deliberately", "If someone is speaking too fast, it's okay to ask them to slow down. Your pace is the right pace"] },
    Air:   { name: "Mint Crystal",   hex: "#6EE7B7", gradient: ["#D1FAE5", "#6EE7B7"], planet: "Mercury", planetMeaning: "Mercury governs communication, quick thinking, and the movement of ideas.", colorMeaning: "Mint Crystal is the color of a thought landing perfectly in someone else's mind. Air moons on Mercury days are operating at peak clarity — this is your most fluent day of the week.", howToUse: ["Mint or light green amplifies your natural communication ability — you're more persuasive than usual today", "The email you've been overthinking? Just send it. Today it'll land exactly how you meant it", "Someone is waiting for your honest perspective on something. Give it to them today, cleanly"] },
    Water: { name: "Seafoam Mist",   hex: "#34D399", gradient: ["#6EE7B7", "#10B981"], planet: "Mercury", planetMeaning: "Mercury governs communication, quick thinking, and the movement of ideas.", colorMeaning: "Seafoam Mist is Mercury softened by water — communication that reaches people beneath the words. Water moons on Mercury days can say things that land at a cellular level.", howToUse: ["Soft green or teal bridges the gap between what you feel and what you can actually say today", "The most impactful thing you communicate today won't be the most polished — it'll be the most honest", "If you've been holding a feeling back in a close relationship, Mercury today gives you the exact words"] },
  },
  Jupiter: {
    Fire:  { name: "Golden Sun",     hex: "#EAB308", gradient: ["#FEF08A", "#EAB308"], planet: "Jupiter", planetMeaning: "Jupiter governs expansion, luck, and the widening of perspective. Jupiter days widen your field of vision — what seemed impossible last week looks different today.", colorMeaning: "Golden Sun is abundance that wants to be shared. Fire moons on Jupiter days are at their most magnetic — people genuinely want to be near what you're carrying today.", howToUse: ["Gold and bright yellow amplify the generous, expansive energy of the day. You're a good luck charm for others too", "Give someone a genuine, specific compliment today. Jupiter rewards what you put into circulation", "Think bigger than you usually allow yourself to. The resistance you feel is a ceiling, not a truth"] },
    Earth: { name: "Turmeric Gold",  hex: "#D97706", gradient: ["#FDE68A", "#D97706"], planet: "Jupiter", planetMeaning: "Jupiter governs expansion, luck, and the widening of perspective.", colorMeaning: "Turmeric Gold is wealth you can hold. Earth moons receive Jupiter's abundance through preparation and patience — and today, something you've been building quietly is starting to pay off.", howToUse: ["Warm gold and ochre tones draw practical, material good fortune toward you today", "Take stock of what you already have before reaching for more. Gratitude actively activates Jupiter energy", "A practical decision made today has long-term significance beyond what's immediately visible. Think past this week"] },
    Air:   { name: "Lemon Light",    hex: "#FEF08A", gradient: ["#FEF9C3", "#FEF08A"], planet: "Jupiter", planetMeaning: "Jupiter governs expansion, luck, and the widening of perspective.", colorMeaning: "Lemon Light is the color of a good idea that actually works and keeps working. Air moons on Jupiter days think things through to their best possible outcome today.", howToUse: ["Light yellow brightens your mental field and attracts fortunate, aligned connections today", "Say yes to the thing that currently feels one size too large for you. That fit is correct", "The idea that keeps returning? Today is the day to tell someone about it and see what happens"] },
    Water: { name: "Amber Glow",     hex: "#F59E0B", gradient: ["#FDE68A", "#F59E0B"], planet: "Jupiter", planetMeaning: "Jupiter governs expansion, luck, and the widening of perspective.", colorMeaning: "Amber Glow is warmth that expands quietly rather than announcing itself. Water moons receive Jupiter's blessings through emotional openness — the more you let in today, the more keeps arriving.", howToUse: ["Warm amber tones help you receive abundance today instead of deflecting or second-guessing it", "Accept the compliment. Receive the help that's being offered. Let someone be genuinely generous toward you", "Something that looked like an obstacle earlier this week is beginning to look like a door today"] },
  },
  Venus: {
    Fire:  { name: "Rose Flame",     hex: "#EC4899", gradient: ["#FBCFE8", "#EC4899"], planet: "Venus", planetMeaning: "Venus governs love, beauty, desire, and what you find truly valuable. Venus days heighten attraction and make you unusually sensitive to beauty in everything.", colorMeaning: "Rose Flame is wanting something beautiful and being completely unapologetic about it. Fire moons on Venus days are at their most alluring — naturally, without effort, without even meaning to.", howToUse: ["Pink and magenta amplify your magnetism today — wear it if you're seeing someone whose attention matters", "Do one beautiful thing for yourself today. Not for anyone else. Not for documentation. For you only", "The person who keeps crossing your mind today — reach out. Venus days carry that kind of thing especially well"] },
    Earth: { name: "Dusty Rose",     hex: "#FDA4AF", gradient: ["#FFE4E6", "#FDA4AF"], planet: "Venus", planetMeaning: "Venus governs love, beauty, desire, and what you find truly valuable.", colorMeaning: "Dusty Rose is love that's been worn in — familiar, deep, and more beautiful for having been used. Earth moons express Venus through showing up, staying, and making something with their hands.", howToUse: ["Soft pink and blush create a gentle, receptive energy that draws connection and warmth toward you", "Cook something, arrange something, create something physical today. Venus Earth days reward it disproportionately", "The relationship you tend most carefully today is the one that will grow the most in the next month"] },
    Air:   { name: "Blush Mist",     hex: "#FBCFE8", gradient: ["#FDF2F8", "#FBCFE8"], planet: "Venus", planetMeaning: "Venus governs love, beauty, desire, and what you find truly valuable.", colorMeaning: "Blush Mist is flirtation made visible — connection that feels easy, conversation that doesn't require effort. Air moons on Venus days are unusually charming without trying.", howToUse: ["Light pink and lavender blush invite ease and beauty into your interactions naturally today", "If there's someone you've been circling around in conversation, today is the day to actually land", "Beauty is speaking to you today — in music, in small aesthetics, in how someone looks at you. Pay attention"] },
    Water: { name: "Mauve Deep",     hex: "#C084FC", gradient: ["#E879F9", "#C084FC"], planet: "Venus", planetMeaning: "Venus governs love, beauty, desire, and what you find truly valuable.", colorMeaning: "Mauve Deep is love felt in the bones rather than just the heart. Water moons on Venus days feel everything more intensely — beauty hits harder, longing goes further, connection cuts deeper.", howToUse: ["Purple-pink lets you feel the depth of today's emotional field without being swallowed by it", "If you're in love, say it. If you're missing someone, let yourself miss them fully without rushing past it", "Your sensitivity today isn't weakness. It's Venus in its highest form — feeling without numbness"] },
  },
  Saturn: {
    Fire:  { name: "Midnight Blaze", hex: "#4338CA", gradient: ["#6D28D9", "#4338CA"], planet: "Saturn", planetMeaning: "Saturn governs discipline, karma, and long-term structures. Saturn days ask for honesty about what you're actually building — and whether it still reflects who you actually are.", colorMeaning: "Midnight Blaze is the discipline of a soul that refuses to perform smallness anymore. Fire moons under Saturn become powerful when they stop performing confidence and start being real.", howToUse: ["Deep indigo and violet hold you accountable to who you actually are today, not who you feel you're supposed to be", "Say no to one thing today that you've been saying yes to out of habit or obligation rather than choice", "The hardest honest thing you need to say to yourself — today it can land without breaking you"] },
    Earth: { name: "Obsidian",       hex: "#1E293B", gradient: ["#334155", "#1E293B"], planet: "Saturn", planetMeaning: "Saturn governs discipline, karma, and long-term structures.", colorMeaning: "Obsidian is Saturn in its truest and oldest form — dense, ancient, and clarifying. Earth moons on Saturn days have the rare ability to see a situation with complete clarity and still not flinch.", howToUse: ["Black and deep navy ground and protect your energy field, creating a useful boundary today", "Audit one thing in your life with complete honesty today. Saturn days are structurally built for this", "What you build today lasts. What you ignore today compounds quietly. Choose with that in mind"] },
    Air:   { name: "Storm Slate",    hex: "#475569", gradient: ["#64748B", "#334155"], planet: "Saturn", planetMeaning: "Saturn governs discipline, karma, and long-term structures.", colorMeaning: "Storm Slate is the specific clarity that arrives after difficult weather — not cheerful, but sharp and trustworthy. Air moons process Saturn days through honest thinking, and what you reason your way to today is probably true.", howToUse: ["Grey and slate tones bring mental clarity and a quiet, productive focus that cuts through distraction", "If you've been avoiding a difficult thought, today you can think it through without it overwhelming you", "The most important thing you can do today is probably the most boring item on your list. Do it first"] },
    Water: { name: "Deep Violet",    hex: "#5B21B6", gradient: ["#7C3AED", "#4C1D95"], planet: "Saturn", planetMeaning: "Saturn governs discipline, karma, and long-term structures.", colorMeaning: "Deep Violet is the color of transformation that has already begun and can't be undone. Water moons feel Saturn as a deep internal shift — something is composting into something completely new inside you.", howToUse: ["Dark purple connects you to the part of yourself that already knows what needs to change", "Something in your emotional world is completing. Let it finish properly instead of reopening it prematurely", "The uncomfortable truth you've been circling — today you can face it and find yourself still standing"] },
  },
};

// ─── Main export ──────────────────────────────────────────────────────────────

export interface LuckyFeatures {
  number:         number;
  lifePath:       number;
  dayVibration:   number;
  archetype:      string;
  energy:         string;
  description:    string;
  opportunities:  string[];
  lifePathMeaning:string;
  color:          ColorEntry & { element: string };
  planet:         Planet;
}

export function getLuckyFeatures(birthDate: string, moonElement: string): LuckyFeatures {
  const day    = new Date().getDay(); // 0 = Sunday
  const planet = DAY_LORDS[day];
  const color  = COLOR_MATRIX[planet][moonElement] ?? COLOR_MATRIX[planet]["Fire"];
  const num    = getLuckyNumber(birthDate);
  const data   = NUMBER_DATA[num];
  const lp     = lifePathNumber(birthDate);
  const dv     = todayVibration();

  return {
    number:          num,
    lifePath:        lp,
    dayVibration:    dv,
    archetype:       data.archetype,
    energy:          data.energy,
    description:     data.description,
    opportunities:   data.opportunities,
    lifePathMeaning: data.lifePathMeaning,
    color:           { ...color, element: moonElement },
    planet,
  };
}
