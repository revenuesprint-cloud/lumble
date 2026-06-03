// ─── Quote Bank ──────────────────────────────────────────────────────────────
// 160+ curated quotes across 7 categories.
// Daily selection is deterministic: same person + same day = same quote.

export interface Quote {
  text: string;
  author?: string;
  category: string;
}

const LOVE: Quote[] = [
  { text: "Love is not about possession. It's about appreciation.", category: "love" },
  { text: "The most painful thing is losing yourself in the process of loving someone too much.", author: "Ernest Hemingway", category: "love" },
  { text: "We accept the love we think we deserve.", author: "Stephen Chbosky", category: "love" },
  { text: "To love is nothing. To be loved is something. But to love and be loved, that's everything.", author: "T. Tolis", category: "love" },
  { text: "Loving someone and having them love you back is the most precious thing in the world.", author: "Nicholas Sparks", category: "love" },
  { text: "Real love is choosing the same person every day, even when you don't feel like it.", category: "love" },
  { text: "The heart was made to be broken.", author: "Oscar Wilde", category: "love" },
  { text: "Love is an endless act of forgiveness.", author: "Peter Ustinov", category: "love" },
  { text: "You don't love someone because they're perfect. You love them in spite of the fact that they're not.", author: "Jodi Picoult", category: "love" },
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn", category: "love" },
  { text: "A heart that loves is always young.", category: "love" },
  { text: "Where there is love, there is life.", author: "Mahatma Gandhi", category: "love" },
  { text: "The giving of love is an education in itself.", author: "Eleanor Roosevelt", category: "love" },
  { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle", category: "love" },
  { text: "Distance means so little when someone means so much.", category: "love" },
  { text: "Love is not finding someone to live with; it's finding someone you can't live without.", category: "love" },
  { text: "At the touch of love, everyone becomes a poet.", author: "Plato", category: "love" },
  { text: "Love takes off the masks that we fear we cannot live without.", author: "James Baldwin", category: "love" },
  { text: "The most beautiful thing in the world is to see two people in love.", category: "love" },
  { text: "You are my today and all of my tomorrows.", category: "love" },
  { text: "Love doesn't make the world go round. Love is what makes the ride worthwhile.", author: "Franklin Jones", category: "love" },
  { text: "There is no remedy for love but to love more.", author: "Thoreau", category: "love" },
  { text: "Love is when the other person's happiness is more important than your own.", author: "H. Jackson Brown Jr.", category: "love" },
  { text: "The very first moment I beheld him, my heart was irrevocably gone.", author: "Jane Austen", category: "love" },
  { text: "One is loved because one is loved. No reason is needed for loving.", author: "Paulo Coelho", category: "love" },
];

const PATIENCE: Quote[] = [
  { text: "Trust the timing of your life.", category: "patience" },
  { text: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.", category: "patience" },
  { text: "Good things come to those who wait, but only what's left by those who hustle.", author: "Abraham Lincoln", category: "patience" },
  { text: "The two hardest tests on the spiritual road are the patience to wait for the right moment and the courage to walk away when nothing's working.", author: "Paulo Coelho", category: "patience" },
  { text: "Everything you want is on the other side of patience.", category: "patience" },
  { text: "Rivers know this: there is no hurry. We shall get there someday.", author: "A.A. Milne", category: "patience" },
  { text: "Timing is everything. If it's meant to happen, it will happen at the right time.", category: "patience" },
  { text: "Have patience. All things are difficult before they become easy.", author: "Saadi", category: "patience" },
  { text: "Adopt the pace of nature. Her secret is patience.", author: "Ralph Waldo Emerson", category: "patience" },
  { text: "The strongest of all warriors are these two: time and patience.", author: "Leo Tolstoy", category: "patience" },
  { text: "Everything happens when it's supposed to. Trust that.", category: "patience" },
  { text: "Be patient with yourself. Self-growth is tender; it's holy ground.", author: "Anne Lamott", category: "patience" },
  { text: "Don't rush the process. Good things take time.", category: "patience" },
  { text: "If it's real, it will withstand the wait.", category: "patience" },
  { text: "You can't force love. You can only make space for it.", category: "patience" },
  { text: "Slow down and everything you are chasing will come around and catch you.", author: "John De Paola", category: "patience" },
  { text: "Let things unfold as they're meant to. Force nothing.", category: "patience" },
  { text: "Sometimes the answer is wait.", category: "patience" },
  { text: "Patience is bitter, but its fruit is sweet.", author: "Aristotle", category: "patience" },
  { text: "What's meant for you will always find its way back.", category: "patience" },
  { text: "You can't rush something you want to last forever.", category: "patience" },
  { text: "Some connections require growing up first — and that's okay.", category: "patience" },
  { text: "The universe has a plan. Your only job is to stay ready.", category: "patience" },
];

const SELF_WORTH: Quote[] = [
  { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha", category: "self" },
  { text: "Your value doesn't decrease based on someone's inability to see your worth.", category: "self" },
  { text: "Never settle for someone who doesn't see your worth.", category: "self" },
  { text: "The moment you feel you have to prove your worth to someone is the moment you absolutely and utterly walk away.", author: "Alysia Harris", category: "self" },
  { text: "You are enough. You have always been enough.", category: "self" },
  { text: "Owning our story and loving ourselves through that process is the bravest thing we will ever do.", author: "Brené Brown", category: "self" },
  { text: "You can't pour from an empty cup. Take care of yourself first.", category: "self" },
  { text: "The most powerful relationship you will ever have is the relationship with yourself.", author: "Steve Maraboli", category: "self" },
  { text: "Respect yourself enough to walk away from anything that no longer serves you.", category: "self" },
  { text: "Don't lose yourself trying to hold onto someone who doesn't care about losing you.", category: "self" },
  { text: "To love oneself is the beginning of a lifelong romance.", author: "Oscar Wilde", category: "self" },
  { text: "You are not a backup plan. You are a first choice.", category: "self" },
  { text: "Know your worth. Then add tax.", category: "self" },
  { text: "You are allowed to be both a masterpiece and a work in progress.", author: "Sophia Bush", category: "self" },
  { text: "Stop shrinking yourself to fit places you've outgrown.", category: "self" },
  { text: "The woman you're becoming will cost you people, relationships, spaces and material things. Choose her over everything.", category: "self" },
  { text: "Self-love is not selfish; you cannot truly love another until you know how to love yourself.", category: "self" },
  { text: "Fall in love with taking care of yourself.", category: "self" },
  { text: "Be the love you never received.", author: "Rune Lazuli", category: "self" },
  { text: "You were never too much. They just weren't enough.", category: "self" },
  { text: "The only validation you need is from yourself.", category: "self" },
  { text: "You deserve someone who makes you forget your phone exists.", category: "self" },
  { text: "Your standards are not too high. The person was just too low.", category: "self" },
];

const COMMUNICATION: Quote[] = [
  { text: "The biggest communication problem is we do not listen to understand. We listen to reply.", author: "Stephen Covey", category: "communication" },
  { text: "Speak clearly, if you speak at all. Carve every word before you let it fall.", author: "Oliver Wendell Holmes", category: "communication" },
  { text: "Honest hearts produce honest actions.", author: "Brigham Young", category: "communication" },
  { text: "The truth is rarely pure and never simple.", author: "Oscar Wilde", category: "communication" },
  { text: "Silence is sometimes the best answer.", author: "Dalai Lama", category: "communication" },
  { text: "Say what you need to say before it's too late.", category: "communication" },
  { text: "Don't assume. Communicate. Minds aren't read.", category: "communication" },
  { text: "Kind words can be short and easy to speak, but their echoes are truly endless.", author: "Mother Teresa", category: "communication" },
  { text: "Half the world is composed of people who have something to say and can't, and the other half who have nothing to say and keep on saying it.", author: "Robert Frost", category: "communication" },
  { text: "To effectively communicate, we must realize that we are all different in the way we perceive the world.", author: "Tony Robbins", category: "communication" },
  { text: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel", category: "communication" },
  { text: "What you're not changing, you're choosing.", category: "communication" },
  { text: "Being honest may not get you many friends, but it will get you the right ones.", category: "communication" },
  { text: "The truth is a mirror that's cracked. Everyone sees a different reflection.", category: "communication" },
  { text: "Express yourself. Don't suppress yourself.", category: "communication" },
  { text: "Assumptions are the termites of relationships.", author: "Henry Winkler", category: "communication" },
  { text: "Never make someone a priority when all you are to them is an option.", author: "Maya Angelou", category: "communication" },
  { text: "You teach people how to treat you by what you allow.", category: "communication" },
];

const GROWTH: Quote[] = [
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell", category: "growth" },
  { text: "Life will only change when you become more committed to your dreams than you are to your comfort zone.", category: "growth" },
  { text: "Not all storms come to disrupt your life. Some come to clear your path.", category: "growth" },
  { text: "Your current situation is not your final destination.", category: "growth" },
  { text: "Every storm runs out of rain.", author: "Maya Angelou", category: "growth" },
  { text: "Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.", category: "growth" },
  { text: "The universe is always speaking to us... sending us little messages, causing coincidences and serendipities.", author: "Nancy Thayer", category: "growth" },
  { text: "Sometimes the smallest step in the right direction ends up being the biggest step of your life.", category: "growth" },
  { text: "Do not be afraid to start over. It is a brand new opportunity to rebuild what you truly want.", category: "growth" },
  { text: "What feels like the end is often the beginning.", category: "growth" },
  { text: "You cannot swim for new horizons until you have courage to lose sight of the shore.", author: "William Faulkner", category: "growth" },
  { text: "The stars don't ask for permission to shine.", category: "growth" },
  { text: "Sometimes you have to fall apart to fall into place.", category: "growth" },
  { text: "Your story is not over yet. The best chapters are still being written.", category: "growth" },
  { text: "Becoming is better than being.", author: "Carol Dweck", category: "growth" },
  { text: "Be willing to be a beginner every single morning.", author: "Meister Eckhart", category: "growth" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi", category: "growth" },
  { text: "You are allowed to be a work in progress and still be worthy of love.", category: "growth" },
  { text: "Every ending is a new beginning. Breathe and trust the journey.", category: "growth" },
  { text: "The universe doesn't give you what you ask for with your thoughts; it gives you what you demand with your actions.", category: "growth" },
  { text: "Hard times are not trying to finish you. They are trying to shape you.", category: "growth" },
  { text: "Stars can't shine without darkness.", category: "growth" },
];

const HEALING: Quote[] = [
  { text: "Healing is not linear. Be patient with yourself.", category: "healing" },
  { text: "One day you'll look back and realize that you were blooming all along.", category: "healing" },
  { text: "Give yourself the same compassion you give everyone else.", category: "healing" },
  { text: "Sometimes good things fall apart so better things can fall together.", author: "Marilyn Monroe", category: "healing" },
  { text: "You don't have to have it all figured out to move forward.", category: "healing" },
  { text: "Let it hurt. Let it bleed. Let it heal. And let it go.", category: "healing" },
  { text: "The truth is, unless you let go, unless you forgive yourself, unless you forgive the situation, unless you realize that the situation is over, you cannot move forward.", author: "Steve Maraboli", category: "healing" },
  { text: "Some people are not meant to stay forever. They are meant to teach you something.", category: "healing" },
  { text: "Missing someone is how you know they mattered. But staying stuck is how you forget yourself.", category: "healing" },
  { text: "She made broken look beautiful and strong look invincible. She walked with the universe on her shoulders and made it look like a pair of wings.", category: "healing" },
  { text: "You are not defined by how someone else treated you.", category: "healing" },
  { text: "Cry. Forgive. Learn. Move on. Let your tears water the seeds of your future happiness.", author: "Steve Maraboli", category: "healing" },
  { text: "The only way out is through.", author: "Robert Frost", category: "healing" },
  { text: "Not everything that is faced can be changed. But nothing can be changed until it is faced.", author: "James Baldwin", category: "healing" },
  { text: "You are allowed to grieve what you thought this was going to be.", category: "healing" },
  { text: "The day you finally choose yourself is the day everything changes.", category: "healing" },
  { text: "Scars show us where we have been, they don't dictate where we're going.", category: "healing" },
  { text: "What's broken can be mended. What hurts can be healed. And no matter how dark it gets, the sun is going to rise again.", category: "healing" },
];

const INTUITION: Quote[] = [
  { text: "Your intuition knows what to do. The trick is getting your head to shut up so you can hear.", author: "Louise Smith", category: "intuition" },
  { text: "The universe always falls in love with a stubborn heart.", category: "intuition" },
  { text: "Trust your gut. It sees things your eyes can't.", category: "intuition" },
  { text: "The cosmos is full of signals. Most people are too noisy to hear them.", category: "intuition" },
  { text: "There are no coincidences. Everything is a nudge from the universe.", category: "intuition" },
  { text: "Listen to the wind. It talks. Listen to the silence. It speaks. Listen to your heart. It knows.", category: "intuition" },
  { text: "The stars incline us; they do not bind us.", author: "Shakespeare", category: "intuition" },
  { text: "You were born with the ability to know things that cannot be proven. Trust that.", category: "intuition" },
  { text: "What if the universe isn't testing you — what if it's directing you?", category: "intuition" },
  { text: "Your feelings are data. Not noise.", category: "intuition" },
  { text: "Sometimes the universe whispers. Sometimes it screams. Either way, it's telling you something.", category: "intuition" },
  { text: "The answers you seek never come when the mind is busy. They come when the mind is still.", author: "Rumi", category: "intuition" },
  { text: "Everything you need to know you have already been told. You just stopped listening.", category: "intuition" },
  { text: "Trust the vibes you get. Energy doesn't lie.", category: "intuition" },
  { text: "Synchronicity is the universe's way of winking at you.", category: "intuition" },
];

// ─── All quotes ───────────────────────────────────────────────────────────────

const ALL_QUOTES = [...LOVE, ...PATIENCE, ...SELF_WORTH, ...COMMUNICATION, ...GROWTH, ...HEALING, ...INTUITION];

// ─── Deterministic selection ──────────────────────────────────────────────────

function seedHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Category cycles through each day of the week
const DAILY_CATEGORIES = ["love","patience","self","growth","healing","communication","intuition"];

export function getDailyQuote(userName: string): Quote {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const dayOfWeek = today.getDay(); // 0–6
  const category = DAILY_CATEGORIES[dayOfWeek];

  // Pick from the category pool
  const pool = ALL_QUOTES.filter((q) => q.category === category);
  const seed = seedHash(userName + dateStr);
  return pool[seed % pool.length];
}

export function getDailyFocus(userName: string): string {
  const focuses = [
    "Notice what drains you today and what gives you energy.",
    "You don't need to solve everything today. Just be present.",
    "One honest conversation can change everything.",
    "Your needs matter. Say them out loud today.",
    "Let go of one thing that isn't serving you.",
    "Be as kind to yourself as you would be to someone you love.",
    "Today, choose peace over being right.",
    "Pay attention to how they make you feel, not just what they say.",
    "If it's not a clear yes, it might be a soft no.",
    "Don't overthink. Trust the first feeling.",
    "Give yourself permission to want what you want.",
    "Protect your energy as fiercely as you protect your heart.",
    "Clarity comes from action, not more thinking.",
    "You're allowed to outgrow the version of yourself that tolerated less.",
    "Notice who shows up for you without being asked.",
    "The way someone treats you when they're stressed tells you everything.",
    "Rest is not giving up. Rest is preparing.",
    "Comparison is the thief of love.",
    "What you seek is also seeking you.",
    "Be honest about what chapter of life you're really in.",
    "Your boundaries are not a punishment. They're a standard.",
    "Today's emotion is valid data. Don't dismiss it.",
    "Ask yourself: is this anxiety, or is it clarity?",
    "The relationship you have with yourself sets the tone for every other one.",
    "What would love do here? Now do that.",
    "You deserve consistency, not intensity.",
    "Stop explaining yourself to people who aren't curious about you.",
  ];
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const seed = seedHash(userName + dateStr + "focus");
  return focuses[seed % focuses.length];
}

// Quote for a specific category (for onboarding tips, feature cards, etc.)
export function getQuoteByCategory(category: string, seed: number): Quote {
  const pool = ALL_QUOTES.filter((q) => q.category === category);
  return pool[Math.abs(seed) % pool.length];
}

export { ALL_QUOTES };
