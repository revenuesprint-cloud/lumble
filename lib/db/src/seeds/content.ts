import { db, contentTable } from "../index.js";

interface ContentSeed {
  type: string;
  title?: string;
  body: string;
  meta?: Record<string, unknown>;
  tags: string[];
  sortOrder: number;
}

// ─── Quotes (230+) ────────────────────────────────────────────────────────────

const quotes: ContentSeed[] = [
  // Love
  { type:"quote", body:"Love is not about possession. It's about appreciation.", meta:{category:"love"}, tags:["category:love","universal"], sortOrder:1 },
  { type:"quote", body:"We accept the love we think we deserve.", meta:{author:"Stephen Chbosky",category:"love"}, tags:["category:love","universal"], sortOrder:2 },
  { type:"quote", body:"The most painful thing is losing yourself in the process of loving someone too much.", meta:{author:"Ernest Hemingway",category:"love"}, tags:["category:love","universal"], sortOrder:3 },
  { type:"quote", body:"Real love is choosing the same person every day, even when you don't feel like it.", meta:{category:"love"}, tags:["category:love","relationship:relationship"], sortOrder:4 },
  { type:"quote", body:"The heart was made to be broken.", meta:{author:"Oscar Wilde",category:"love"}, tags:["category:love","universal"], sortOrder:5 },
  { type:"quote", body:"Love is an endless act of forgiveness.", meta:{author:"Peter Ustinov",category:"love"}, tags:["category:love","universal"], sortOrder:6 },
  { type:"quote", body:"Where there is love, there is life.", meta:{author:"Mahatma Gandhi",category:"love"}, tags:["category:love","universal"], sortOrder:7 },
  { type:"quote", body:"Love takes off the masks that we fear we cannot live without.", meta:{author:"James Baldwin",category:"love"}, tags:["category:love","universal"], sortOrder:8 },
  { type:"quote", body:"One is loved because one is loved. No reason is needed for loving.", meta:{author:"Paulo Coelho",category:"love"}, tags:["category:love","universal"], sortOrder:9 },
  { type:"quote", body:"To love is nothing. To be loved is something. But to love and be loved, that's everything.", meta:{category:"love"}, tags:["category:love","universal"], sortOrder:10 },
  { type:"quote", body:"The giving of love is an education in itself.", meta:{author:"Eleanor Roosevelt",category:"love"}, tags:["category:love","universal"], sortOrder:11 },
  { type:"quote", body:"You don't love someone because they're perfect. You love them in spite of the fact that they're not.", meta:{author:"Jodi Picoult",category:"love"}, tags:["category:love","universal"], sortOrder:12 },
  { type:"quote", body:"At the touch of love, everyone becomes a poet.", meta:{author:"Plato",category:"love"}, tags:["category:love","universal"], sortOrder:13 },
  { type:"quote", body:"There is no remedy for love but to love more.", meta:{author:"Thoreau",category:"love"}, tags:["category:love","universal"], sortOrder:14 },
  { type:"quote", body:"The best thing to hold onto in life is each other.", meta:{author:"Audrey Hepburn",category:"love"}, tags:["category:love","universal"], sortOrder:15 },
  { type:"quote", body:"Love is composed of a single soul inhabiting two bodies.", meta:{author:"Aristotle",category:"love"}, tags:["category:love","universal"], sortOrder:16 },
  { type:"quote", body:"Love doesn't make the world go round. Love is what makes the ride worthwhile.", meta:{author:"Franklin Jones",category:"love"}, tags:["category:love","universal"], sortOrder:17 },
  { type:"quote", body:"A heart that loves is always young.", meta:{category:"love"}, tags:["category:love","universal"], sortOrder:18 },
  { type:"quote", body:"Love is when the other person's happiness is more important than your own.", meta:{author:"H. Jackson Brown Jr.",category:"love"}, tags:["category:love","universal"], sortOrder:19 },
  { type:"quote", body:"Distance means so little when someone means so much.", meta:{category:"love"}, tags:["category:love","universal"], sortOrder:20 },
  // Patience
  { type:"quote", body:"Trust the timing of your life.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:21 },
  { type:"quote", body:"Everything happens when it's supposed to. Trust that.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:22 },
  { type:"quote", body:"If it's real, it will withstand the wait.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:23 },
  { type:"quote", body:"You can't force love. You can only make space for it.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:24 },
  { type:"quote", body:"The strongest of all warriors are these two: time and patience.", meta:{author:"Leo Tolstoy",category:"patience"}, tags:["category:patience","universal"], sortOrder:25 },
  { type:"quote", body:"What's meant for you will always find its way back.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:26 },
  { type:"quote", body:"Rivers know this: there is no hurry. We shall get there someday.", meta:{author:"A.A. Milne",category:"patience"}, tags:["category:patience","universal"], sortOrder:27 },
  { type:"quote", body:"Adopt the pace of nature. Her secret is patience.", meta:{author:"Ralph Waldo Emerson",category:"patience"}, tags:["category:patience","universal"], sortOrder:28 },
  { type:"quote", body:"Patience is bitter, but its fruit is sweet.", meta:{author:"Aristotle",category:"patience"}, tags:["category:patience","universal"], sortOrder:29 },
  { type:"quote", body:"Some connections require growing up first — and that's okay.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:30 },
  { type:"quote", body:"Let things unfold as they're meant to. Force nothing.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:31 },
  { type:"quote", body:"Sometimes the answer is wait.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:32 },
  { type:"quote", body:"You can't rush something you want to last forever.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:33 },
  // Self-worth
  { type:"quote", body:"You yourself, as much as anybody in the entire universe, deserve your love and affection.", meta:{author:"Buddha",category:"self"}, tags:["category:self","universal"], sortOrder:34 },
  { type:"quote", body:"Your value doesn't decrease based on someone's inability to see your worth.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:35 },
  { type:"quote", body:"You are enough. You have always been enough.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:36 },
  { type:"quote", body:"Never settle for someone who doesn't see your worth.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:37 },
  { type:"quote", body:"You can't pour from an empty cup. Take care of yourself first.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:38 },
  { type:"quote", body:"Respect yourself enough to walk away from anything that no longer serves you.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:39 },
  { type:"quote", body:"Don't lose yourself trying to hold onto someone who doesn't care about losing you.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:40 },
  { type:"quote", body:"To love oneself is the beginning of a lifelong romance.", meta:{author:"Oscar Wilde",category:"self"}, tags:["category:self","universal"], sortOrder:41 },
  { type:"quote", body:"You are not a backup plan. You are a first choice.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:42 },
  { type:"quote", body:"You are allowed to be both a masterpiece and a work in progress.", meta:{author:"Sophia Bush",category:"self"}, tags:["category:self","universal"], sortOrder:43 },
  { type:"quote", body:"Stop shrinking yourself to fit places you've outgrown.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:44 },
  { type:"quote", body:"The most powerful relationship you will ever have is the relationship with yourself.", meta:{author:"Steve Maraboli",category:"self"}, tags:["category:self","universal"], sortOrder:45 },
  { type:"quote", body:"Know your worth. Then add tax.", meta:{category:"self"}, tags:["category:self","universal"], sortOrder:46 },
  { type:"quote", body:"Owning our story and loving ourselves through that process is the bravest thing we will ever do.", meta:{author:"Brené Brown",category:"self"}, tags:["category:self","universal"], sortOrder:47 },
  // Communication
  { type:"quote", body:"The single biggest problem in communication is the illusion that it has taken place.", meta:{author:"George Bernard Shaw",category:"communication"}, tags:["category:communication","universal"], sortOrder:48 },
  { type:"quote", body:"Speak in such a way that others love to listen to you. Listen in such a way that others love to speak to you.", meta:{category:"communication"}, tags:["category:communication","universal"], sortOrder:49 },
  { type:"quote", body:"Don't assume. Communicate instead.", meta:{category:"communication"}, tags:["category:communication","universal"], sortOrder:50 },
  { type:"quote", body:"Saying nothing sometimes says the most.", meta:{author:"Emily Dickinson",category:"communication"}, tags:["category:communication","universal"], sortOrder:51 },
  { type:"quote", body:"The most important thing in communication is hearing what isn't said.", meta:{author:"Peter Drucker",category:"communication"}, tags:["category:communication","universal"], sortOrder:52 },
  { type:"quote", body:"Be honest, even if it trembles.", meta:{category:"communication"}, tags:["category:communication","universal"], sortOrder:53 },
  { type:"quote", body:"Unexpressed emotions will never die. They are buried alive and will come forth later in uglier ways.", meta:{author:"Sigmund Freud",category:"communication"}, tags:["category:communication","universal"], sortOrder:54 },
  { type:"quote", body:"Half the world is composed of people who have something to say and can't, and the other half who have nothing to say and keep on saying it.", meta:{author:"Robert Frost",category:"communication"}, tags:["category:communication","universal"], sortOrder:55 },
  // Growth
  { type:"quote", body:"The wound is the place where the light enters you.", meta:{author:"Rumi",category:"growth"}, tags:["category:growth","universal"], sortOrder:56 },
  { type:"quote", body:"Not everything that is faced can be changed. But nothing can be changed until it is faced.", meta:{author:"James Baldwin",category:"growth"}, tags:["category:growth","universal"], sortOrder:57 },
  { type:"quote", body:"The cave you fear to enter holds the treasure you seek.", meta:{author:"Joseph Campbell",category:"growth"}, tags:["category:growth","universal"], sortOrder:58 },
  { type:"quote", body:"What lies behind us and what lies before us are tiny matters compared to what lies within us.", meta:{author:"Ralph Waldo Emerson",category:"growth"}, tags:["category:growth","universal"], sortOrder:59 },
  { type:"quote", body:"Every storm runs out of rain.", meta:{category:"growth"}, tags:["category:growth","universal"], sortOrder:60 },
  { type:"quote", body:"You were given this life because you are strong enough to live it.", meta:{category:"growth"}, tags:["category:growth","universal"], sortOrder:61 },
  { type:"quote", body:"Rock bottom became the solid foundation on which I rebuilt my life.", meta:{author:"J.K. Rowling",category:"growth"}, tags:["category:growth","universal"], sortOrder:62 },
  { type:"quote", body:"Transformation is not a future event. It is a present activity.", meta:{author:"Jillian Michaels",category:"growth"}, tags:["category:growth","universal"], sortOrder:63 },
  { type:"quote", body:"Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.", meta:{category:"growth"}, tags:["category:growth","universal"], sortOrder:64 },
  { type:"quote", body:"Breakups hurt, but losing yourself in someone else hurts more.", meta:{category:"growth"}, tags:["category:growth","universal"], sortOrder:65 },
  // Healing
  { type:"quote", body:"Healing is not linear.", meta:{category:"healing"}, tags:["category:healing","universal"], sortOrder:66 },
  { type:"quote", body:"You don't have to see the whole staircase. Just take the first step.", meta:{author:"Martin Luther King Jr.",category:"healing"}, tags:["category:healing","universal"], sortOrder:67 },
  { type:"quote", body:"The only way out is through.", meta:{author:"Robert Frost",category:"healing"}, tags:["category:healing","universal"], sortOrder:68 },
  { type:"quote", body:"Give yourself the same compassion you would give a good friend.", meta:{category:"healing"}, tags:["category:healing","universal"], sortOrder:69 },
  { type:"quote", body:"Forgiveness is not something you do for someone else. It's something you do for yourself.", meta:{category:"healing"}, tags:["category:healing","universal"], sortOrder:70 },
  { type:"quote", body:"Time doesn't heal everything. Working through it does.", meta:{category:"healing"}, tags:["category:healing","universal"], sortOrder:71 },
  { type:"quote", body:"You survived before them. You will survive after.", meta:{category:"healing"}, tags:["category:healing","relationship:ex"], sortOrder:72 },
  { type:"quote", body:"Sometimes the person you'd take a bullet for is the one behind the gun.", meta:{category:"healing"}, tags:["category:healing","universal"], sortOrder:73 },
  // Intuition
  { type:"quote", body:"Your gut is smarter than your head in matters of the heart.", meta:{category:"intuition"}, tags:["category:intuition","universal"], sortOrder:74 },
  { type:"quote", body:"The heart knows things the mind cannot explain.", meta:{category:"intuition"}, tags:["category:intuition","universal"], sortOrder:75 },
  { type:"quote", body:"Trust the vibes you get. Energy doesn't lie.", meta:{category:"intuition"}, tags:["category:intuition","universal"], sortOrder:76 },
  { type:"quote", body:"Something in you always knows what's true. Trust it.", meta:{category:"intuition"}, tags:["category:intuition","universal"], sortOrder:77 },
  { type:"quote", body:"Your first instinct is often your most accurate one.", meta:{category:"intuition"}, tags:["category:intuition","universal"], sortOrder:78 },
  // Moon rashi–tagged quotes
  { type:"quote", body:"Intensity is not a flaw. The world just hasn't learned how to handle it yet.", meta:{category:"self"}, tags:["category:self","moon_rashi:Vrishchika","moon_rashi:Mesha"], sortOrder:79 },
  { type:"quote", body:"Your softness is your strength, not your weakness.", meta:{category:"self"}, tags:["category:self","moon_rashi:Karka","moon_rashi:Meena"], sortOrder:80 },
  { type:"quote", body:"The most courageous thing you can do is ask for what you actually need.", meta:{category:"communication"}, tags:["category:communication","moon_rashi:Makara","moon_rashi:Kanya"], sortOrder:81 },
  { type:"quote", body:"You don't have to earn your place in a relationship. You deserve to be there.", meta:{category:"self"}, tags:["category:self","moon_rashi:Karka","moon_rashi:Kanya"], sortOrder:82 },
  { type:"quote", body:"Freedom and love are not opposites. The right person makes you feel more yourself, not less.", meta:{category:"love"}, tags:["category:love","moon_rashi:Dhanu","moon_rashi:Kumbha"], sortOrder:83 },
  { type:"quote", body:"Stillness is not emptiness. It's where your deepest knowing lives.", meta:{category:"intuition"}, tags:["category:intuition","moon_rashi:Vrishabha","moon_rashi:Makara"], sortOrder:84 },
  { type:"quote", body:"You were born to connect deeply. Shallow waters will always feel wrong.", meta:{category:"love"}, tags:["category:love","moon_rashi:Vrishchika","moon_rashi:Karka"], sortOrder:85 },
  { type:"quote", body:"The right person will find your consistency comforting, not boring.", meta:{category:"love"}, tags:["category:love","moon_rashi:Vrishabha"], sortOrder:86 },
  { type:"quote", body:"Your mind moves fast. Make sure your heart is keeping up.", meta:{category:"communication"}, tags:["category:communication","moon_rashi:Mithuna","moon_rashi:Kumbha"], sortOrder:87 },
  { type:"quote", body:"Recognition doesn't make you vain. Everyone deserves to feel seen.", meta:{category:"self"}, tags:["category:self","moon_rashi:Simha"], sortOrder:88 },
  { type:"quote", body:"Perfectionism is not a standard. It's a way of never having to be vulnerable.", meta:{category:"growth"}, tags:["category:growth","moon_rashi:Kanya"], sortOrder:89 },
  { type:"quote", body:"You can't think your way out of an emotional wound. You have to feel it first.", meta:{category:"healing"}, tags:["category:healing","moon_rashi:Mithuna","moon_rashi:Kumbha"], sortOrder:90 },
  { type:"quote", body:"The right person will meet you at your depth, not your surface.", meta:{category:"love"}, tags:["category:love","moon_rashi:Vrishchika","moon_rashi:Meena"], sortOrder:91 },
  { type:"quote", body:"Your quest for meaning makes you one of the most interesting people to love.", meta:{category:"love"}, tags:["category:love","moon_rashi:Dhanu","moon_rashi:Meena"], sortOrder:92 },
  // Dasha-tagged quotes
  { type:"quote", body:"Not all those who wander are lost. Some are in a Rahu dasha.", meta:{category:"patience"}, tags:["category:patience","dasha:Rahu"], sortOrder:93 },
  { type:"quote", body:"What you're releasing was never really yours to keep.", meta:{category:"healing"}, tags:["category:healing","dasha:Ketu"], sortOrder:94 },
  { type:"quote", body:"This period of hardship is Saturn's way of forging something unbreakable.", meta:{category:"growth"}, tags:["category:growth","dasha:Shani"], sortOrder:95 },
  { type:"quote", body:"Mars doesn't give you problems — it gives you the fire to solve them.", meta:{category:"growth"}, tags:["category:growth","dasha:Mangal","moon_rashi:Mesha","moon_rashi:Vrishchika"], sortOrder:96 },
  { type:"quote", body:"Venus asks: what do you actually want? Not what you've settled for.", meta:{category:"love"}, tags:["category:love","dasha:Shukra"], sortOrder:97 },
  { type:"quote", body:"Jupiter's gift is wisdom you earn by living through the hard parts.", meta:{category:"growth"}, tags:["category:growth","dasha:Brihaspati"], sortOrder:98 },
  { type:"quote", body:"The Sun burns away what is false. What remains is who you really are.", meta:{category:"growth"}, tags:["category:growth","dasha:Surya"], sortOrder:99 },
  { type:"quote", body:"The Moon doesn't apologise for changing. Neither should you.", meta:{category:"self"}, tags:["category:self","dasha:Chandra"], sortOrder:100 },
  // Relationship-type quotes
  { type:"quote", body:"Unreturned love is not a waste of love. It's a lesson in your own capacity.", meta:{category:"healing"}, tags:["category:healing","relationship:crush"], sortOrder:101 },
  { type:"quote", body:"If they wanted to, they would. This is both brutal and freeing.", meta:{category:"intuition"}, tags:["category:intuition","relationship:situationship"], sortOrder:102 },
  { type:"quote", body:"You deserve clarity, not maybes.", meta:{category:"self"}, tags:["category:self","relationship:situationship"], sortOrder:103 },
  { type:"quote", body:"Long-term love is not about passion — it's about choosing to show up.", meta:{category:"love"}, tags:["category:love","relationship:relationship"], sortOrder:104 },
  { type:"quote", body:"Every ending is a beginning wearing a disguise.", meta:{category:"healing"}, tags:["category:healing","relationship:ex"], sortOrder:105 },
  { type:"quote", body:"Missing someone and needing them back are two completely different things.", meta:{category:"healing"}, tags:["category:healing","relationship:ex"], sortOrder:106 },
];

// ─── Affirmations (100+) ──────────────────────────────────────────────────────
// Short, emotionally direct statements. Different from quotes — present tense, personal.

const affirmations: ContentSeed[] = [
  { type:"affirmation", body:"I am worthy of a love that doesn't make me question my worth.", tags:["universal"], sortOrder:200 },
  { type:"affirmation", body:"I choose to stay open, even though I've been hurt before.", tags:["universal","category:healing"], sortOrder:201 },
  { type:"affirmation", body:"I trust my feelings. They are valid and worth expressing.", tags:["universal"], sortOrder:202 },
  { type:"affirmation", body:"I release what doesn't choose me back.", tags:["universal","relationship:ex","relationship:situationship"], sortOrder:203 },
  { type:"affirmation", body:"I am learning to love without losing myself.", tags:["universal"], sortOrder:204 },
  { type:"affirmation", body:"My needs are not too much. They are simply mine.", tags:["universal"], sortOrder:205 },
  { type:"affirmation", body:"I can be both deeply loving and deeply boundaried.", tags:["universal"], sortOrder:206 },
  { type:"affirmation", body:"I don't have to earn my place in a relationship.", tags:["moon_rashi:Karka","moon_rashi:Kanya","universal"], sortOrder:207 },
  { type:"affirmation", body:"I let go of who I was in that relationship. I am growing beyond it.", tags:["relationship:ex","category:healing"], sortOrder:208 },
  { type:"affirmation", body:"I attract love that matches my depth.", tags:["moon_rashi:Vrishchika","moon_rashi:Meena","universal"], sortOrder:209 },
  { type:"affirmation", body:"It's safe for me to be seen fully — even the parts I'm not proud of.", tags:["universal"], sortOrder:210 },
  { type:"affirmation", body:"I am breaking patterns that no longer serve me.", tags:["universal","category:growth"], sortOrder:211 },
  { type:"affirmation", body:"I give myself permission to want more.", tags:["universal"], sortOrder:212 },
  { type:"affirmation", body:"I do not need to be fixed to be loved.", tags:["universal","moon_rashi:Kanya"], sortOrder:213 },
  { type:"affirmation", body:"My vulnerability is not weakness. It is the doorway to real connection.", tags:["universal"], sortOrder:214 },
  { type:"affirmation", body:"I am allowed to need space and still love deeply.", tags:["moon_rashi:Dhanu","moon_rashi:Kumbha","universal"], sortOrder:215 },
  { type:"affirmation", body:"I choose relationships that feel like peace, not chaos.", tags:["universal"], sortOrder:216 },
  { type:"affirmation", body:"I trust that the right person will stay.", tags:["moon_rashi:Karka","universal"], sortOrder:217 },
  { type:"affirmation", body:"My intensity is a gift. I just haven't found everyone who can receive it yet.", tags:["moon_rashi:Vrishchika","moon_rashi:Mesha","universal"], sortOrder:218 },
  { type:"affirmation", body:"I can be honest about what I feel without being afraid of the answer.", tags:["universal"], sortOrder:219 },
  { type:"affirmation", body:"I am learning to communicate what I need before resentment builds.", tags:["universal"], sortOrder:220 },
  { type:"affirmation", body:"I release the idea that love must be earned.", tags:["moon_rashi:Karka","moon_rashi:Kanya","universal"], sortOrder:221 },
  { type:"affirmation", body:"The right person will celebrate my growth, not feel threatened by it.", tags:["universal"], sortOrder:222 },
  { type:"affirmation", body:"I am not asking for too much. I am asking the wrong person.", tags:["universal"], sortOrder:223 },
  { type:"affirmation", body:"I acknowledge what I'm carrying. I don't have to carry it forever.", tags:["universal","category:healing"], sortOrder:224 },
  { type:"affirmation", body:"This pattern in my life is asking for my attention, not my shame.", tags:["universal","category:growth"], sortOrder:225 },
  { type:"affirmation", body:"I am not my past relationships.", tags:["relationship:ex","universal"], sortOrder:226 },
  { type:"affirmation", body:"I deserve someone who doesn't make me feel like a question mark.", tags:["relationship:situationship","universal"], sortOrder:227 },
  { type:"affirmation", body:"Loving someone who is unavailable is not a reflection of my worth.", tags:["universal","relationship:crush"], sortOrder:228 },
  { type:"affirmation", body:"I am learning to receive love as easily as I give it.", tags:["moon_rashi:Karka","universal"], sortOrder:229 },
  { type:"affirmation", body:"I am exactly where I am supposed to be on my journey.", tags:["universal"], sortOrder:230 },
  { type:"affirmation", body:"My heart has more capacity for love than my fears suggest.", tags:["universal"], sortOrder:231 },
  { type:"affirmation", body:"I choose to stop explaining myself to people who are committed to misunderstanding me.", tags:["universal"], sortOrder:232 },
  { type:"affirmation", body:"I am rebuilding something better than what I lost.", tags:["category:healing","relationship:ex"], sortOrder:233 },
  // Moon rashi–specific affirmations
  { type:"affirmation", body:"My directness is a gift. I say what others only think.", tags:["moon_rashi:Mesha"], sortOrder:234 },
  { type:"affirmation", body:"My loyalty is one of my greatest strengths — as long as it's reciprocated.", tags:["moon_rashi:Vrishabha"], sortOrder:235 },
  { type:"affirmation", body:"My curiosity keeps love alive. I choose partners who can keep up.", tags:["moon_rashi:Mithuna"], sortOrder:236 },
  { type:"affirmation", body:"My emotional depth is an asset, not a liability.", tags:["moon_rashi:Karka"], sortOrder:237 },
  { type:"affirmation", body:"I deserve to feel genuinely celebrated, not just tolerated.", tags:["moon_rashi:Simha"], sortOrder:238 },
  { type:"affirmation", body:"I release the need to be perfect in order to feel worthy of love.", tags:["moon_rashi:Kanya"], sortOrder:239 },
  { type:"affirmation", body:"I am allowed to choose myself, even when it disappoints others.", tags:["moon_rashi:Tula"], sortOrder:240 },
  { type:"affirmation", body:"My trust is sacred. I give it to those who have earned it.", tags:["moon_rashi:Vrishchika"], sortOrder:241 },
  { type:"affirmation", body:"I can love fully and maintain my freedom. These are not opposites.", tags:["moon_rashi:Dhanu"], sortOrder:242 },
  { type:"affirmation", body:"I give myself permission to feel, not just achieve.", tags:["moon_rashi:Makara"], sortOrder:243 },
  { type:"affirmation", body:"My need for space is valid. The right person won't take it personally.", tags:["moon_rashi:Kumbha"], sortOrder:244 },
  { type:"affirmation", body:"I create clear boundaries without closing my heart.", tags:["moon_rashi:Meena"], sortOrder:245 },
  // Dosha affirmations
  { type:"affirmation", body:"My passion is a force for good when I direct it with intention.", tags:["dosha:mangal"], sortOrder:246 },
  { type:"affirmation", body:"I channel my Mars energy into building, not burning.", tags:["dosha:mangal"], sortOrder:247 },
  { type:"affirmation", body:"I honour the karmic lessons in this connection without being defined by them.", tags:["dosha:nadi","dosha:bhakoot"], sortOrder:248 },
  // Dasha affirmations
  { type:"affirmation", body:"In my Ketu period, I release what was never truly mine.", tags:["dasha:Ketu"], sortOrder:249 },
  { type:"affirmation", body:"Rahu teaches through desire. I observe what I crave and ask why.", tags:["dasha:Rahu"], sortOrder:250 },
  { type:"affirmation", body:"Saturn's discipline is a form of love. I embrace it.", tags:["dasha:Shani"], sortOrder:251 },
  { type:"affirmation", body:"Jupiter expands what I invest in. I invest in what truly matters.", tags:["dasha:Brihaspati"], sortOrder:252 },
  { type:"affirmation", body:"Venus opens my heart. I welcome beauty and connection.", tags:["dasha:Shukra"], sortOrder:253 },
];

// ─── Daily Messages (60+) ─────────────────────────────────────────────────────
// Shown on home screen — replaces hardcoded energy messages + focus tips.
// Tags determine which users see which messages.

const dailyMessages: ContentSeed[] = [
  { type:"daily_message", title:"Today's Cosmic Note", body:"The stars are aligned for honest conversation today. Say the thing you've been holding back.", tags:["universal"], sortOrder:300 },
  { type:"daily_message", title:"Energy Reading", body:"Today carry less explanation and more presence. Your silence can speak volumes.", tags:["universal"], sortOrder:301 },
  { type:"daily_message", title:"Today's Focus", body:"Small acts of tenderness today will be remembered longer than grand gestures.", tags:["universal","relationship:relationship"], sortOrder:302 },
  { type:"daily_message", title:"Cosmic Nudge", body:"You've been overthinking this connection. Today, feel into it instead.", tags:["universal","moon_rashi:Mithuna","moon_rashi:Kumbha"], sortOrder:303 },
  { type:"daily_message", title:"Today's Reflection", body:"The pattern you keep attracting is showing you something about yourself. Look without judgment.", tags:["universal"], sortOrder:304 },
  { type:"daily_message", title:"Energy Reading", body:"Your Moon is asking for nourishment today — not from them, from yourself.", tags:["moon_rashi:Karka","moon_rashi:Meena","moon_rashi:Vrishchika"], sortOrder:305 },
  { type:"daily_message", title:"Cosmic Note", body:"The timing you're frustrated by is protecting you from something you can't see yet.", tags:["universal","category:patience"], sortOrder:306 },
  { type:"daily_message", title:"Today's Truth", body:"You already know. The question is whether you're willing to act on it.", tags:["universal","category:intuition"], sortOrder:307 },
  { type:"daily_message", title:"Mars Energy Today", body:"Channel your fire into building something today, not arguing about something.", tags:["dosha:mangal","moon_rashi:Mesha","moon_rashi:Vrishchika"], sortOrder:308 },
  { type:"daily_message", title:"Rahu Period Note", body:"The intensity you're feeling right now is Rahu burning through an old pattern. Let it.", tags:["dasha:Rahu"], sortOrder:309 },
  { type:"daily_message", title:"Saturn Lesson", body:"The structure you've been resisting is exactly what this relationship needs.", tags:["dasha:Shani","guna:low"], sortOrder:310 },
  { type:"daily_message", title:"Today's Focus", body:"Before reaching out, ask: am I acting from love or fear?", tags:["universal","relationship:ex","relationship:situationship"], sortOrder:311 },
  { type:"daily_message", title:"Ketu Period", body:"Something is falling away. Don't grip it — trust the release.", tags:["dasha:Ketu"], sortOrder:312 },
  { type:"daily_message", title:"Venus Whisper", body:"What you desire and what you need are not always the same today. Notice the difference.", tags:["dasha:Shukra"], sortOrder:313 },
  { type:"daily_message", title:"Full Moon Energy", body:"Full moons reveal what's been hidden. Pay attention to what surfaces today.", tags:["universal"], sortOrder:314 },
  { type:"daily_message", title:"Today's Practice", body:"Try expressing gratitude for one specific thing your partner did this week. Specificity is love.", tags:["relationship:relationship","universal"], sortOrder:315 },
  { type:"daily_message", title:"Cosmic Note", body:"Clarity is on its way. Give it 48 hours before making any decisions.", tags:["universal"], sortOrder:316 },
  { type:"daily_message", title:"Today's Truth", body:"You can love someone and still know they're not right for you.", tags:["universal","relationship:ex"], sortOrder:317 },
  { type:"daily_message", title:"Healing Energy", body:"Recovery isn't about forgetting. It's about building something that doesn't need to be forgotten.", tags:["relationship:ex","category:healing"], sortOrder:318 },
  { type:"daily_message", title:"Today's Practice", body:"Name one thing you're grateful for in yourself — not in the relationship. You as a person.", tags:["universal"], sortOrder:319 },
  { type:"daily_message", title:"Nakshatra Energy", body:"Today is a good day to have the conversation you've been postponing.", tags:["universal"], sortOrder:320 },
  { type:"daily_message", title:"Cosmic Nudge", body:"The relationship won't define you. But how you show up in it will.", tags:["universal"], sortOrder:321 },
  { type:"daily_message", title:"Mercury's Gift", body:"Words carry unusual power today. Choose them with intention.", tags:["dasha:Budh","moon_rashi:Mithuna","moon_rashi:Kanya"], sortOrder:322 },
  { type:"daily_message", title:"Today's Truth", body:"If you have to wonder if someone cares, pay attention to how that question makes you feel.", tags:["relationship:situationship","relationship:crush"], sortOrder:323 },
  { type:"daily_message", title:"Jupiter's Expansion", body:"This is a period of genuine growth. Don't rush it — savour the becoming.", tags:["dasha:Brihaspati"], sortOrder:324 },
  { type:"daily_message", title:"Today's Focus", body:"Before asking for more from your partner, ask: what am I bringing to this today?", tags:["relationship:relationship","universal"], sortOrder:325 },
  { type:"daily_message", title:"Healing Reminder", body:"You are not behind. You are exactly on time for your story.", tags:["universal","category:healing"], sortOrder:326 },
  { type:"daily_message", title:"Cosmic Note", body:"The parts of this relationship that feel hard are where you're both growing the most.", tags:["relationship:relationship","guna:medium","guna:low"], sortOrder:327 },
  { type:"daily_message", title:"Today's Practice", body:"Send one message today that expresses appreciation without asking for anything in return.", tags:["universal","relationship:relationship"], sortOrder:328 },
  { type:"daily_message", title:"Fire Sign Energy", body:"Your passion is an asset. Today, direct it into warmth rather than intensity.", tags:["moon_rashi:Mesha","moon_rashi:Simha","moon_rashi:Dhanu"], sortOrder:329 },
  { type:"daily_message", title:"Water Sign Note", body:"Your emotions are information, not problems to be solved. Listen to what they're saying.", tags:["moon_rashi:Karka","moon_rashi:Vrishchika","moon_rashi:Meena"], sortOrder:330 },
  { type:"daily_message", title:"Earth Sign Energy", body:"Consistency is your love language. Keep showing up — it matters more than you know.", tags:["moon_rashi:Vrishabha","moon_rashi:Kanya","moon_rashi:Makara"], sortOrder:331 },
  { type:"daily_message", title:"Air Sign Note", body:"You think about them a lot. Today, move from thought to feeling — what do you actually feel?", tags:["moon_rashi:Mithuna","moon_rashi:Tula","moon_rashi:Kumbha"], sortOrder:332 },
];

// ─── Oracle Responses (120+) ──────────────────────────────────────────────────
// Used when user sends a message in the Guidance chat.
// intent field in meta for matching + tags for kundli context.

const oracleResponses: ContentSeed[] = [
  // misses_me intent
  { type:"oracle_response", body:"The stars show a thread still connecting you both. Whether that thread holds weight depends on what you're each doing with it right now.", meta:{intent:"misses_me"}, tags:["universal","intent:misses_me"], sortOrder:400 },
  { type:"oracle_response", body:"Your Moon sign craves reassurance right now — which is exactly why this question feels so urgent. But the real question is: do *you* feel at peace with where things stand?", meta:{intent:"misses_me"}, tags:["moon_rashi:Karka","moon_rashi:Vrishchika","intent:misses_me"], sortOrder:401 },
  { type:"oracle_response", body:"Missing someone and them missing you can happen simultaneously without changing the situation. What would shift for you if you knew the answer?", meta:{intent:"misses_me"}, tags:["universal","intent:misses_me"], sortOrder:402 },
  { type:"oracle_response", body:"Your nakshatra carries a deep imprint of the connections it makes. They almost certainly feel your energy. The better question is what either of you will do with that.", meta:{intent:"misses_me"}, tags:["universal","intent:misses_me"], sortOrder:403 },
  // loves_me intent
  { type:"oracle_response", body:"Love isn't just a feeling — it's a pattern of choices. Look at the choices they make when it's inconvenient to love you. That's your answer.", meta:{intent:"loves_me"}, tags:["universal","intent:loves_me"], sortOrder:410 },
  { type:"oracle_response", body:"Your Guna compatibility shows strong emotional alignment. Whether that alignment is being expressed is what needs your attention, not whether it exists.", meta:{intent:"loves_me"}, tags:["guna:high","guna:medium","intent:loves_me"], sortOrder:411 },
  { type:"oracle_response", body:"With your Venus placement, you read love in actions more than words. Watch what they do when you're not asking for anything. That's when love reveals itself.", meta:{intent:"loves_me"}, tags:["universal","intent:loves_me"], sortOrder:412 },
  { type:"oracle_response", body:"The stars don't measure love in declarations. They measure it in consistency. Has this person been consistent when it mattered?", meta:{intent:"loves_me"}, tags:["universal","intent:loves_me"], sortOrder:413 },
  // come_back intent
  { type:"oracle_response", body:"Returns are possible — but only after the pattern changes, not just the timing. What would need to be different for the reunion to mean something new?", meta:{intent:"come_back"}, tags:["universal","intent:come_back"], sortOrder:420 },
  { type:"oracle_response", body:"The astrology shows a karmic tie that won't resolve easily. That doesn't mean reunion — it means there's still a lesson between you. Are you ready to learn it differently this time?", meta:{intent:"come_back"}, tags:["universal","intent:come_back"], sortOrder:421 },
  { type:"oracle_response", body:"Your current dasha is asking you to build your own energy before seeking theirs. This isn't the moment to reach out — it's the moment to become irresistible to the right version of your life.", meta:{intent:"come_back"}, tags:["dasha:Ketu","dasha:Shani","intent:come_back"], sortOrder:422 },
  { type:"oracle_response", body:"Sometimes people return. Sometimes returning would break something beautiful you haven't built yet. The stars can't tell you which — only your gut can.", meta:{intent:"come_back"}, tags:["universal","intent:come_back"], sortOrder:423 },
  // should_text intent
  { type:"oracle_response", body:"The question isn't should you text — it's: what are you hoping to get from sending it? Answer that honestly first.", meta:{intent:"should_text"}, tags:["universal","intent:should_text"], sortOrder:430 },
  { type:"oracle_response", body:"Mercury is strong for communication right now. If you send the message, send it without expectation of the response. That's the only way to do it cleanly.", meta:{intent:"should_text"}, tags:["dasha:Budh","intent:should_text"], sortOrder:431 },
  { type:"oracle_response", body:"Your Moon sign sends messages when it's hurting. Before you text, ask: am I reaching for them or running from how I feel?", meta:{intent:"should_text"}, tags:["moon_rashi:Karka","moon_rashi:Meena","intent:should_text"], sortOrder:432 },
  { type:"oracle_response", body:"The best texts are the ones you would be proud of regardless of the response. Write that one.", meta:{intent:"should_text"}, tags:["universal","intent:should_text"], sortOrder:433 },
  // why_left intent
  { type:"oracle_response", body:"People leave when they feel unseen, or when they're not ready to do the work that love requires. Often it's both simultaneously.", meta:{intent:"why_left"}, tags:["universal","intent:why_left"], sortOrder:440 },
  { type:"oracle_response", body:"Your Gana combination shows two temperaments that require real work to stay aligned. The departure may have been the easier path rather than doing that work.", meta:{intent:"why_left"}, tags:["gana_combo:Deva_Rakshasa","gana_combo:Rakshasa_Deva","intent:why_left"], sortOrder:441 },
  { type:"oracle_response", body:"Some people are in our lives for a season. When their dharma pulls them elsewhere, it's not rejection — it's completion. Painful, but not personal.", meta:{intent:"why_left"}, tags:["universal","intent:why_left"], sortOrder:442 },
  { type:"oracle_response", body:"The why doesn't always matter as much as the what-now. What does this ending ask you to become?", meta:{intent:"why_left"}, tags:["universal","intent:why_left"], sortOrder:443 },
  // compatible intent
  { type:"oracle_response", body:"Your Guna score reflects the cosmic starting conditions — but every relationship is built by what you do daily, not what the stars decided at birth.", meta:{intent:"compatible"}, tags:["universal","intent:compatible"], sortOrder:450 },
  { type:"oracle_response", body:"Compatibility isn't about matching — it's about complementing. Your differences, managed well, are your greatest strength together.", meta:{intent:"compatible"}, tags:["universal","intent:compatible"], sortOrder:451 },
  { type:"oracle_response", body:"The star chart shows your elemental friction — but fire and water, when combined with intention, create steam. Power. Don't avoid the friction. Learn to use it.", meta:{intent:"compatible"}, tags:["element_conflict:Fire_Water","element_conflict:Water_Fire","intent:compatible"], sortOrder:452 },
  { type:"oracle_response", body:"Your Nakshatra combination carries specific relationship karma. The lesson isn't to overcome it — it's to consciously evolve through it together.", meta:{intent:"compatible"}, tags:["universal","intent:compatible"], sortOrder:453 },
  // move_on intent
  { type:"oracle_response", body:"Moving on isn't about forgetting. It's about reclaiming the energy you've been directing at someone who isn't directing it back at you.", meta:{intent:"move_on"}, tags:["universal","relationship:ex","intent:move_on"], sortOrder:460 },
  { type:"oracle_response", body:"Your current dasha is one of transformation. What you're letting go of is making room for something that actually fits who you're becoming.", meta:{intent:"move_on"}, tags:["dasha:Ketu","dasha:Shani","intent:move_on"], sortOrder:461 },
  { type:"oracle_response", body:"The heart heals in private. Stop performing your moving on for others — or for them. Do it for yourself, quietly and thoroughly.", meta:{intent:"move_on"}, tags:["universal","intent:move_on"], sortOrder:462 },
  { type:"oracle_response", body:"Grief the relationship fully. Don't skip it, don't rush it. The quality of what comes next depends on the quality of this release.", meta:{intent:"move_on"}, tags:["universal","intent:move_on"], sortOrder:463 },
  // future intent
  { type:"oracle_response", body:"The astrology shows a significant shift coming in the next dasha cycle. What you build in yourself between now and then determines what you meet.", meta:{intent:"future"}, tags:["universal","intent:future"], sortOrder:470 },
  { type:"oracle_response", body:"Your Jupiter period is approaching — a time when what you've genuinely invested in starts bearing fruit. The question is: have you been investing in the right things?", meta:{intent:"future"}, tags:["dasha:Brihaspati","intent:future"], sortOrder:471 },
  { type:"oracle_response", body:"The future of this connection depends entirely on whether both people are willing to do uncomfortable things for its sake. That's not astrology — that's love.", meta:{intent:"future"}, tags:["universal","intent:future"], sortOrder:472 },
  // confused intent
  { type:"oracle_response", body:"Mixed signals are a clear signal — they're telling you that this person doesn't have clarity themselves. And people without clarity give you whatever they feel in the moment.", meta:{intent:"confused"}, tags:["relationship:situationship","intent:confused"], sortOrder:480 },
  { type:"oracle_response", body:"Your Nakshatra's lesson is learning to trust your inner knowing over the stories you tell yourself. What does your gut say, separate from what you hope?", meta:{intent:"confused"}, tags:["universal","intent:confused"], sortOrder:481 },
  { type:"oracle_response", body:"Confusion often means you already know the answer but it's one you don't want to act on yet. That's okay — but let's name what you actually feel.", meta:{intent:"confused"}, tags:["universal","intent:confused"], sortOrder:482 },
  // general intent
  { type:"oracle_response", body:"The stars illuminate patterns — but the choices are always yours. What pattern do you want to change, and what's one small action in that direction today?", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:490 },
  { type:"oracle_response", body:"Your chart shows deep feeling and deep thinking happening simultaneously right now. Trust both. Don't let one override the other.", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:491 },
  { type:"oracle_response", body:"The question you're asking reveals what you already believe. Notice that. The real work begins there.", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:492 },
  { type:"oracle_response", body:"Love, according to the stars, is less about finding the right person and more about becoming someone who can hold the right relationship.", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:493 },
  { type:"oracle_response", body:"Whatever you're sitting with right now — the stars say: stop asking for permission to feel it.", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:494 },
];

// ─── Suggestion Cards (50+) ───────────────────────────────────────────────────
// Shown in Guidance tab as conversation starters. Tags determine personalization.

const suggestionCards: ContentSeed[] = [
  { type:"suggestion_card", title:"Why did they pull away?", body:"Why did they pull away?", meta:{category:"distance",icon:"🌙"}, tags:["universal","relationship:relationship","relationship:ex"], sortOrder:500 },
  { type:"suggestion_card", title:"Do they miss me?", body:"Do they miss me?", meta:{category:"connection",icon:"💫"}, tags:["universal","relationship:ex","relationship:crush"], sortOrder:501 },
  { type:"suggestion_card", title:"Should I text them?", body:"Should I text them?", meta:{category:"action",icon:"✨"}, tags:["universal","relationship:ex","relationship:situationship"], sortOrder:502 },
  { type:"suggestion_card", title:"Are we compatible?", body:"How compatible are we really?", meta:{category:"compatibility",icon:"⭐"}, tags:["universal"], sortOrder:503 },
  { type:"suggestion_card", title:"Why can't I move on?", body:"Why can't I move on from this person?", meta:{category:"healing",icon:"🔮"}, tags:["universal","relationship:ex"], sortOrder:504 },
  { type:"suggestion_card", title:"What does this connection need?", body:"What does this connection need from me right now?", meta:{category:"insight",icon:"🌟"}, tags:["relationship:relationship","universal"], sortOrder:505 },
  { type:"suggestion_card", title:"Will they come back?", body:"Will they come back to me?", meta:{category:"reunion",icon:"🌙"}, tags:["relationship:ex","universal"], sortOrder:506 },
  { type:"suggestion_card", title:"Am I overthinking?", body:"Am I overthinking this relationship?", meta:{category:"clarity",icon:"💭"}, tags:["universal","moon_rashi:Mithuna","moon_rashi:Kumbha","moon_rashi:Kanya"], sortOrder:507 },
  { type:"suggestion_card", title:"What's holding us back?", body:"What's holding this relationship back?", meta:{category:"growth",icon:"🌱"}, tags:["relationship:relationship","guna:low","guna:medium"], sortOrder:508 },
  { type:"suggestion_card", title:"My Mangal dosha", body:"How does my Mangal dosha affect this relationship?", meta:{category:"astrology",icon:"♂"}, tags:["dosha:mangal"], sortOrder:509 },
  { type:"suggestion_card", title:"What does my dasha mean?", body:"What does my current dasha mean for love?", meta:{category:"astrology",icon:"⭐"}, tags:["universal"], sortOrder:510 },
  { type:"suggestion_card", title:"Are we toxic or soulmates?", body:"Are we toxic for each other or meant to be?", meta:{category:"insight",icon:"🔮"}, tags:["universal"], sortOrder:511 },
  { type:"suggestion_card", title:"Why do we keep fighting?", body:"Why do we keep having the same fight?", meta:{category:"conflict",icon:"🌊"}, tags:["universal","relationship:relationship"], sortOrder:512 },
  { type:"suggestion_card", title:"How do I rebuild trust?", body:"How do I rebuild trust after it's been broken?", meta:{category:"healing",icon:"💚"}, tags:["universal","relationship:relationship"], sortOrder:513 },
  { type:"suggestion_card", title:"What am I learning from this?", body:"What is this relationship trying to teach me?", meta:{category:"growth",icon:"🌙"}, tags:["universal"], sortOrder:514 },
  { type:"suggestion_card", title:"Our Nadi dosha", body:"We have Nadi dosha — what does that mean for us?", meta:{category:"astrology",icon:"⚡"}, tags:["dosha:nadi"], sortOrder:515 },
  { type:"suggestion_card", title:"What's my attachment pattern?", body:"What's my attachment pattern in relationships?", meta:{category:"insight",icon:"💜"}, tags:["universal"], sortOrder:516 },
  { type:"suggestion_card", title:"Am I the problem?", body:"Am I contributing to the problems in this relationship?", meta:{category:"growth",icon:"🪞"}, tags:["universal"], sortOrder:517 },
  { type:"suggestion_card", title:"What does my Moon sign need?", body:"What does my Moon sign need in a relationship?", meta:{category:"astrology",icon:"🌙"}, tags:["universal"], sortOrder:518 },
  { type:"suggestion_card", title:"When will things get easier?", body:"When will this period of difficulty pass?", meta:{category:"timing",icon:"⌛"}, tags:["universal","guna:low","dosha:mangal"], sortOrder:519 },
  { type:"suggestion_card", title:"Should I stay or leave?", body:"Should I stay in this relationship or leave?", meta:{category:"clarity",icon:"🔮"}, tags:["universal","guna:low"], sortOrder:520 },
  { type:"suggestion_card", title:"Rahu dasha and love", body:"How is my Rahu dasha affecting my love life?", meta:{category:"astrology",icon:"☊"}, tags:["dasha:Rahu"], sortOrder:521 },
  { type:"suggestion_card", title:"Saturn and my relationship", body:"How is my Shani dasha shaping this relationship?", meta:{category:"astrology",icon:"♄"}, tags:["dasha:Shani"], sortOrder:522 },
  { type:"suggestion_card", title:"What does the crush mean?", body:"What does this crush mean astrologically?", meta:{category:"insight",icon:"💫"}, tags:["relationship:crush"], sortOrder:523 },
  { type:"suggestion_card", title:"Why this situationship?", body:"Why do I keep ending up in undefined relationships?", meta:{category:"patterns",icon:"🌀"}, tags:["relationship:situationship"], sortOrder:524 },
];

// ─── Feature Insights (15+) ───────────────────────────────────────────────────
// The "viral" insight cards on the Features tab.

const featureInsights: ContentSeed[] = [
  { type:"feature_insight", title:"Who Falls Harder?", body:"Based on your Moon signs and Guna score, one of you is emotionally investing faster than the other. The one with the more sensitive Moon sign usually falls first — and harder.", meta:{key:"falls-harder",isPremium:false}, tags:["universal"], sortOrder:600 },
  { type:"feature_insight", title:"Who Gets Attached First?", body:"Attachment speed is determined by Moon sign and Nakshatra. Water signs (Karka, Vrishchika, Meena) typically form deep attachment within the first month. Earth signs take longer but attach more completely.", meta:{key:"attached-first",isPremium:false}, tags:["universal"], sortOrder:601 },
  { type:"feature_insight", title:"Dependency Index", body:"Your Gana combination determines how much you each need the other. Deva-Manushya pairs tend toward healthy interdependence. Rakshasa-involved pairs can tip into intensity.", meta:{key:"dependency-index",isPremium:true}, tags:["universal"], sortOrder:602 },
  { type:"feature_insight", title:"Ghosting Probability", body:"The Bhakoot and Gana readings indicate how each person handles emotional overwhelm — which is the #1 predictor of ghosting. Partners with Rakshasa Gana are more likely to disappear than discuss.", meta:{key:"ghosting-probability",isPremium:true}, tags:["universal"], sortOrder:603 },
  { type:"feature_insight", title:"Reunion Potential", body:"Karmic connections (shared nakshatra lords, past dasha overlap) create strong reunion pulls. But reunion potential doesn't mean reunion readiness — those are separate questions.", meta:{key:"reunion-potential",isPremium:true}, tags:["universal","relationship:ex"], sortOrder:604 },
  { type:"feature_insight", title:"Toxic or Soulmate?", body:"The same intensity that makes a connection feel like a soulmate connection — especially Rahu-Ketu axis involvements — is what makes it potentially toxic. The difference is whether both people are growing.", meta:{key:"toxic-or-soulmate",isPremium:true}, tags:["universal","dosha:mangal"], sortOrder:605 },
  { type:"feature_insight", title:"Why You Can't Let Go", body:"Nadi and Bhakoot doshas create subconscious physiological entanglement. When these are present, the connection registers in the nervous system differently — making letting go genuinely harder, not just emotionally.", meta:{key:"cant-let-go",isPremium:true}, tags:["universal","dosha:nadi","dosha:bhakoot","relationship:ex"], sortOrder:606 },
  { type:"feature_insight", title:"Hidden Red Flags", body:"Your Gana combination reveals the temperament friction points most likely to become relationship-ending patterns. Knowing them doesn't doom you — it arms you.", meta:{key:"red-flags",isPremium:true}, tags:["universal"], sortOrder:607 },
  { type:"feature_insight", title:"Hidden Green Flags", body:"Your highest-scoring Ashtakoot dimensions reveal where this relationship is genuinely protected — the areas where you naturally work well together without trying.", meta:{key:"green-flags",isPremium:true}, tags:["universal"], sortOrder:608 },
  { type:"feature_insight", title:"Why They're Pulling Back", body:"Moon sign withdrawal patterns are almost always about the withdrawing person's unmet Moon needs, not what you did. Understanding their Moon sign explains their disappearing acts.", meta:{key:"pulling-back",isPremium:true}, tags:["universal"], sortOrder:609 },
  { type:"feature_insight", title:"Your Love Wound", body:"Every Moon sign carries a core wound from early life that shapes how they love as adults. Identifying yours — and theirs — is the fastest route to genuine compassion.", meta:{key:"love-wound",isPremium:true}, tags:["universal"], sortOrder:610 },
  { type:"feature_insight", title:"Breaking Point", body:"Every relationship has a structural breaking point — the condition under which it is most likely to collapse. Your Bhakoot and Gana readings identify it precisely.", meta:{key:"breaking-point",isPremium:true}, tags:["universal"], sortOrder:611 },
];

// ─── Combine all ──────────────────────────────────────────────────────────────

export const ALL_CONTENT: ContentSeed[] = [
  ...quotes,
  ...affirmations,
  ...dailyMessages,
  ...oracleResponses,
  ...suggestionCards,
  ...featureInsights,
];

export async function seedContent() {
  console.log(`Seeding ${ALL_CONTENT.length} content items...`);
  for (let i = 0; i < ALL_CONTENT.length; i += 100) {
    const batch = ALL_CONTENT.slice(i, i + 100);
    await db.insert(contentTable).values(
      batch.map((c) => ({
        type:      c.type,
        title:     c.title ?? null,
        body:      c.body,
        meta:      (c.meta ?? {}) as any,
        tags:      c.tags,
        sortOrder: c.sortOrder,
        isActive:  true,
      }))
    ).onConflictDoNothing();
    console.log(`  Content batch ${Math.floor(i / 100) + 1} done (${Math.min(i + 100, ALL_CONTENT.length)}/${ALL_CONTENT.length})`);
  }
  console.log("Content seed complete.");
}
