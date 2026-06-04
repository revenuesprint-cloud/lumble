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
  { type:"quote", body:"Some connections require growing up first. and that's okay.", meta:{category:"patience"}, tags:["category:patience","universal"], sortOrder:30 },
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
  // Moon rashi to tagged quotes
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
  { type:"quote", body:"Mars doesn't give you problems. it gives you the fire to solve them.", meta:{category:"growth"}, tags:["category:growth","dasha:Mangal","moon_rashi:Mesha","moon_rashi:Vrishchika"], sortOrder:96 },
  { type:"quote", body:"Venus asks: what do you actually want? Not what you've settled for.", meta:{category:"love"}, tags:["category:love","dasha:Shukra"], sortOrder:97 },
  { type:"quote", body:"Jupiter's gift is wisdom you earn by living through the hard parts.", meta:{category:"growth"}, tags:["category:growth","dasha:Brihaspati"], sortOrder:98 },
  { type:"quote", body:"The Sun burns away what is false. What remains is who you really are.", meta:{category:"growth"}, tags:["category:growth","dasha:Surya"], sortOrder:99 },
  { type:"quote", body:"The Moon doesn't apologise for changing. Neither should you.", meta:{category:"self"}, tags:["category:self","dasha:Chandra"], sortOrder:100 },
  // Relationship-type quotes
  { type:"quote", body:"Unreturned love is not a waste of love. It's a lesson in your own capacity.", meta:{category:"healing"}, tags:["category:healing","relationship:crush"], sortOrder:101 },
  { type:"quote", body:"If they wanted to, they would. This is both brutal and freeing.", meta:{category:"intuition"}, tags:["category:intuition","relationship:situationship"], sortOrder:102 },
  { type:"quote", body:"You deserve clarity, not maybes.", meta:{category:"self"}, tags:["category:self","relationship:situationship"], sortOrder:103 },
  { type:"quote", body:"Long-term love is not about passion it's about choosing to show up.", meta:{category:"love"}, tags:["category:love","relationship:relationship"], sortOrder:104 },
  { type:"quote", body:"Every ending is a beginning wearing a disguise.", meta:{category:"healing"}, tags:["category:healing","relationship:ex"], sortOrder:105 },
  { type:"quote", body:"Missing someone and needing them back are two completely different things.", meta:{category:"healing"}, tags:["category:healing","relationship:ex"], sortOrder:106 },
];

// ─── Affirmations (100+) ──────────────────────────────────────────────────────
// Short, emotionally direct statements. Different from quotes present tense, personal.

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
  { type:"affirmation", body:"It's safe for me to be seen fully. even the parts I'm not proud of.", tags:["universal"], sortOrder:210 },
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
  // Moon rashi to specific affirmations
  { type:"affirmation", body:"My directness is a gift. I say what others only think.", tags:["moon_rashi:Mesha"], sortOrder:234 },
  { type:"affirmation", body:"My loyalty is one of my greatest strengths. as long as it's reciprocated.", tags:["moon_rashi:Vrishabha"], sortOrder:235 },
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
// Shown on home screen replaces hardcoded energy messages + focus tips.
// Tags determine which users see which messages.

const dailyMessages: ContentSeed[] = [
  { type:"daily_message", title:"Today's Cosmic Note", body:"The stars are aligned for honest conversation today. Say the thing you've been holding back.", tags:["universal"], sortOrder:300 },
  { type:"daily_message", title:"Energy Reading", body:"Today carry less explanation and more presence. Your silence can speak volumes.", tags:["universal"], sortOrder:301 },
  { type:"daily_message", title:"Today's Focus", body:"Small acts of tenderness today will be remembered longer than grand gestures.", tags:["universal","relationship:relationship"], sortOrder:302 },
  { type:"daily_message", title:"Cosmic Nudge", body:"You've been overthinking this connection. Today, feel into it instead.", tags:["universal","moon_rashi:Mithuna","moon_rashi:Kumbha"], sortOrder:303 },
  { type:"daily_message", title:"Today's Reflection", body:"The pattern you keep attracting is showing you something about yourself. Look without judgment.", tags:["universal"], sortOrder:304 },
  { type:"daily_message", title:"Energy Reading", body:"Your Moon is asking for nourishment today. not from them, from yourself.", tags:["moon_rashi:Karka","moon_rashi:Meena","moon_rashi:Vrishchika"], sortOrder:305 },
  { type:"daily_message", title:"Cosmic Note", body:"The timing you're frustrated by is protecting you from something you can't see yet.", tags:["universal","category:patience"], sortOrder:306 },
  { type:"daily_message", title:"Today's Truth", body:"You already know. The question is whether you're willing to act on it.", tags:["universal","category:intuition"], sortOrder:307 },
  { type:"daily_message", title:"Mars Energy Today", body:"Channel your fire into building something today, not arguing about something.", tags:["dosha:mangal","moon_rashi:Mesha","moon_rashi:Vrishchika"], sortOrder:308 },
  { type:"daily_message", title:"Rahu Period Note", body:"The intensity you're feeling right now is Rahu burning through an old pattern. Let it.", tags:["dasha:Rahu"], sortOrder:309 },
  { type:"daily_message", title:"Saturn Lesson", body:"The structure you've been resisting is exactly what this relationship needs.", tags:["dasha:Shani","guna:low"], sortOrder:310 },
  { type:"daily_message", title:"Today's Focus", body:"Before reaching out, ask: am I acting from love or fear?", tags:["universal","relationship:ex","relationship:situationship"], sortOrder:311 },
  { type:"daily_message", title:"Ketu Period", body:"Something is falling away. Don't grip it trust the release.", tags:["dasha:Ketu"], sortOrder:312 },
  { type:"daily_message", title:"Venus Whisper", body:"What you desire and what you need are not always the same today. Notice the difference.", tags:["dasha:Shukra"], sortOrder:313 },
  { type:"daily_message", title:"Full Moon Energy", body:"Full moons reveal what's been hidden. Pay attention to what surfaces today.", tags:["universal"], sortOrder:314 },
  { type:"daily_message", title:"Today's Practice", body:"Try expressing gratitude for one specific thing your partner did this week. Specificity is love.", tags:["relationship:relationship","universal"], sortOrder:315 },
  { type:"daily_message", title:"Cosmic Note", body:"Clarity is on its way. Give it 48 hours before making any decisions.", tags:["universal"], sortOrder:316 },
  { type:"daily_message", title:"Today's Truth", body:"You can love someone and still know they're not right for you.", tags:["universal","relationship:ex"], sortOrder:317 },
  { type:"daily_message", title:"Healing Energy", body:"Recovery isn't about forgetting. It's about building something that doesn't need to be forgotten.", tags:["relationship:ex","category:healing"], sortOrder:318 },
  { type:"daily_message", title:"Today's Practice", body:"Name one thing you're grateful for in yourself. not in the relationship. You as a person.", tags:["universal"], sortOrder:319 },
  { type:"daily_message", title:"Nakshatra Energy", body:"Today is a good day to have the conversation you've been postponing.", tags:["universal"], sortOrder:320 },
  { type:"daily_message", title:"Cosmic Nudge", body:"The relationship won't define you. But how you show up in it will.", tags:["universal"], sortOrder:321 },
  { type:"daily_message", title:"Mercury's Gift", body:"Words carry unusual power today. Choose them with intention.", tags:["dasha:Budh","moon_rashi:Mithuna","moon_rashi:Kanya"], sortOrder:322 },
  { type:"daily_message", title:"Today's Truth", body:"If you have to wonder if someone cares, pay attention to how that question makes you feel.", tags:["relationship:situationship","relationship:crush"], sortOrder:323 },
  { type:"daily_message", title:"Jupiter's Expansion", body:"This is a period of genuine growth. Don't rush it savour the becoming.", tags:["dasha:Brihaspati"], sortOrder:324 },
  { type:"daily_message", title:"Today's Focus", body:"Before asking for more from your partner, ask: what am I bringing to this today?", tags:["relationship:relationship","universal"], sortOrder:325 },
  { type:"daily_message", title:"Healing Reminder", body:"You are not behind. You are exactly on time for your story.", tags:["universal","category:healing"], sortOrder:326 },
  { type:"daily_message", title:"Cosmic Note", body:"The parts of this relationship that feel hard are where you're both growing the most.", tags:["relationship:relationship","guna:medium","guna:low"], sortOrder:327 },
  { type:"daily_message", title:"Today's Practice", body:"Send one message today that expresses appreciation without asking for anything in return.", tags:["universal","relationship:relationship"], sortOrder:328 },
  { type:"daily_message", title:"Fire Sign Energy", body:"Your passion is an asset. Today, direct it into warmth rather than intensity.", tags:["moon_rashi:Mesha","moon_rashi:Simha","moon_rashi:Dhanu"], sortOrder:329 },
  { type:"daily_message", title:"Water Sign Note", body:"Your emotions are information, not problems to be solved. Listen to what they're saying.", tags:["moon_rashi:Karka","moon_rashi:Vrishchika","moon_rashi:Meena"], sortOrder:330 },
  { type:"daily_message", title:"Earth Sign Energy", body:"Consistency is your love language. Keep showing up. it matters more than you know.", tags:["moon_rashi:Vrishabha","moon_rashi:Kanya","moon_rashi:Makara"], sortOrder:331 },
  { type:"daily_message", title:"Air Sign Note", body:"You think about them a lot. Today, move from thought to feeling what do you actually feel?", tags:["moon_rashi:Mithuna","moon_rashi:Tula","moon_rashi:Kumbha"], sortOrder:332 },
];

// ─── Oracle Responses (120+) ──────────────────────────────────────────────────
// Used when user sends a message in the Guidance chat.
// intent field in meta for matching + tags for kundli context.

const oracleResponses: ContentSeed[] = [
  // misses_me intent
  { type:"oracle_response", body:"The stars show a thread still connecting you both. Whether that thread holds weight depends on what you're each doing with it right now.", meta:{intent:"misses_me"}, tags:["universal","intent:misses_me"], sortOrder:400 },
  { type:"oracle_response", body:"Your Moon sign craves reassurance right now. which is exactly why this question feels so urgent. But the real question is: do *you* feel at peace with where things stand?", meta:{intent:"misses_me"}, tags:["moon_rashi:Karka","moon_rashi:Vrishchika","intent:misses_me"], sortOrder:401 },
  { type:"oracle_response", body:"Missing someone and them missing you can happen simultaneously without changing the situation. What would shift for you if you knew the answer?", meta:{intent:"misses_me"}, tags:["universal","intent:misses_me"], sortOrder:402 },
  { type:"oracle_response", body:"Your nakshatra carries a deep imprint of the connections it makes. They almost certainly feel your energy. The better question is what either of you will do with that.", meta:{intent:"misses_me"}, tags:["universal","intent:misses_me"], sortOrder:403 },
  // loves_me intent
  { type:"oracle_response", body:"Love isn't just a feeling it's a pattern of choices. Look at the choices they make when it's inconvenient to love you. That's your answer.", meta:{intent:"loves_me"}, tags:["universal","intent:loves_me"], sortOrder:410 },
  { type:"oracle_response", body:"Your Guna compatibility shows strong emotional alignment. Whether that alignment is being expressed is what needs your attention, not whether it exists.", meta:{intent:"loves_me"}, tags:["guna:high","guna:medium","intent:loves_me"], sortOrder:411 },
  { type:"oracle_response", body:"With your Venus placement, you read love in actions more than words. Watch what they do when you're not asking for anything. That's when love reveals itself.", meta:{intent:"loves_me"}, tags:["universal","intent:loves_me"], sortOrder:412 },
  { type:"oracle_response", body:"The stars don't measure love in declarations. They measure it in consistency. Has this person been consistent when it mattered?", meta:{intent:"loves_me"}, tags:["universal","intent:loves_me"], sortOrder:413 },
  // come_back intent
  { type:"oracle_response", body:"Returns are possible. but only after the pattern changes, not just the timing. What would need to be different for the reunion to mean something new?", meta:{intent:"come_back"}, tags:["universal","intent:come_back"], sortOrder:420 },
  { type:"oracle_response", body:"The astrology shows a karmic tie that won't resolve easily. That doesn't mean reunion. it means there's still a lesson between you. Are you ready to learn it differently this time?", meta:{intent:"come_back"}, tags:["universal","intent:come_back"], sortOrder:421 },
  { type:"oracle_response", body:"Your current dasha is asking you to build your own energy before seeking theirs. This isn't the moment to reach out it's the moment to become irresistible to the right version of your life.", meta:{intent:"come_back"}, tags:["dasha:Ketu","dasha:Shani","intent:come_back"], sortOrder:422 },
  { type:"oracle_response", body:"Sometimes people return. Sometimes returning would break something beautiful you haven't built yet. The stars can't tell you which. only your gut can.", meta:{intent:"come_back"}, tags:["universal","intent:come_back"], sortOrder:423 },
  // should_text intent
  { type:"oracle_response", body:"The question isn't should you text it's: what are you hoping to get from sending it? Answer that honestly first.", meta:{intent:"should_text"}, tags:["universal","intent:should_text"], sortOrder:430 },
  { type:"oracle_response", body:"Mercury is strong for communication right now. If you send the message, send it without expectation of the response. That's the only way to do it cleanly.", meta:{intent:"should_text"}, tags:["dasha:Budh","intent:should_text"], sortOrder:431 },
  { type:"oracle_response", body:"Your Moon sign sends messages when it's hurting. Before you text, ask: am I reaching for them or running from how I feel?", meta:{intent:"should_text"}, tags:["moon_rashi:Karka","moon_rashi:Meena","intent:should_text"], sortOrder:432 },
  { type:"oracle_response", body:"The best texts are the ones you would be proud of regardless of the response. Write that one.", meta:{intent:"should_text"}, tags:["universal","intent:should_text"], sortOrder:433 },
  // why_left intent
  { type:"oracle_response", body:"People leave when they feel unseen, or when they're not ready to do the work that love requires. Often it's both simultaneously.", meta:{intent:"why_left"}, tags:["universal","intent:why_left"], sortOrder:440 },
  { type:"oracle_response", body:"Your Gana combination shows two temperaments that require real work to stay aligned. The departure may have been the easier path rather than doing that work.", meta:{intent:"why_left"}, tags:["gana_combo:Deva_Rakshasa","gana_combo:Rakshasa_Deva","intent:why_left"], sortOrder:441 },
  { type:"oracle_response", body:"Some people are in our lives for a season. When their dharma pulls them elsewhere, it's not rejection it's completion. Painful, but not personal.", meta:{intent:"why_left"}, tags:["universal","intent:why_left"], sortOrder:442 },
  { type:"oracle_response", body:"The why doesn't always matter as much as the what-now. What does this ending ask you to become?", meta:{intent:"why_left"}, tags:["universal","intent:why_left"], sortOrder:443 },
  // compatible intent
  { type:"oracle_response", body:"Your Guna score reflects the cosmic starting conditions. but every relationship is built by what you do daily, not what the stars decided at birth.", meta:{intent:"compatible"}, tags:["universal","intent:compatible"], sortOrder:450 },
  { type:"oracle_response", body:"Compatibility isn't about matching it's about complementing. Your differences, managed well, are your greatest strength together.", meta:{intent:"compatible"}, tags:["universal","intent:compatible"], sortOrder:451 },
  { type:"oracle_response", body:"The star chart shows your elemental friction. but fire and water, when combined with intention, create steam. Power. Don't avoid the friction. Learn to use it.", meta:{intent:"compatible"}, tags:["element_conflict:Fire_Water","element_conflict:Water_Fire","intent:compatible"], sortOrder:452 },
  { type:"oracle_response", body:"Your Nakshatra combination carries specific relationship karma. The lesson isn't to overcome it it's to consciously evolve through it together.", meta:{intent:"compatible"}, tags:["universal","intent:compatible"], sortOrder:453 },
  // move_on intent
  { type:"oracle_response", body:"Moving on isn't about forgetting. It's about reclaiming the energy you've been directing at someone who isn't directing it back at you.", meta:{intent:"move_on"}, tags:["universal","relationship:ex","intent:move_on"], sortOrder:460 },
  { type:"oracle_response", body:"Your current dasha is one of transformation. What you're letting go of is making room for something that actually fits who you're becoming.", meta:{intent:"move_on"}, tags:["dasha:Ketu","dasha:Shani","intent:move_on"], sortOrder:461 },
  { type:"oracle_response", body:"The heart heals in private. Stop performing your moving on for others or for them. Do it for yourself, quietly and thoroughly.", meta:{intent:"move_on"}, tags:["universal","intent:move_on"], sortOrder:462 },
  { type:"oracle_response", body:"Grief the relationship fully. Don't skip it, don't rush it. The quality of what comes next depends on the quality of this release.", meta:{intent:"move_on"}, tags:["universal","intent:move_on"], sortOrder:463 },
  // future intent
  { type:"oracle_response", body:"The astrology shows a significant shift coming in the next dasha cycle. What you build in yourself between now and then determines what you meet.", meta:{intent:"future"}, tags:["universal","intent:future"], sortOrder:470 },
  { type:"oracle_response", body:"Your Jupiter period is approaching. a time when what you've genuinely invested in starts bearing fruit. The question is: have you been investing in the right things?", meta:{intent:"future"}, tags:["dasha:Brihaspati","intent:future"], sortOrder:471 },
  { type:"oracle_response", body:"The future of this connection depends entirely on whether both people are willing to do uncomfortable things for its sake. That's not astrology that's love.", meta:{intent:"future"}, tags:["universal","intent:future"], sortOrder:472 },
  // confused intent
  { type:"oracle_response", body:"Mixed signals are a clear signal they're telling you that this person doesn't have clarity themselves. And people without clarity give you whatever they feel in the moment.", meta:{intent:"confused"}, tags:["relationship:situationship","intent:confused"], sortOrder:480 },
  { type:"oracle_response", body:"Your Nakshatra's lesson is learning to trust your inner knowing over the stories you tell yourself. What does your gut say, separate from what you hope?", meta:{intent:"confused"}, tags:["universal","intent:confused"], sortOrder:481 },
  { type:"oracle_response", body:"Confusion often means you already know the answer but it's one you don't want to act on yet. That's okay. but let's name what you actually feel.", meta:{intent:"confused"}, tags:["universal","intent:confused"], sortOrder:482 },
  // general intent
  { type:"oracle_response", body:"The stars illuminate patterns. but the choices are always yours. What pattern do you want to change, and what's one small action in that direction today?", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:490 },
  { type:"oracle_response", body:"Your chart shows deep feeling and deep thinking happening simultaneously right now. Trust both. Don't let one override the other.", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:491 },
  { type:"oracle_response", body:"The question you're asking reveals what you already believe. Notice that. The real work begins there.", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:492 },
  { type:"oracle_response", body:"Love, according to the stars, is less about finding the right person and more about becoming someone who can hold the right relationship.", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:493 },
  { type:"oracle_response", body:"Whatever you're sitting with right now. the stars say: stop asking for permission to feel it.", meta:{intent:"general"}, tags:["universal","intent:general"], sortOrder:494 },
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
  { type:"suggestion_card", title:"Our Nadi dosha", body:"We have Nadi dosha what does that mean for us?", meta:{category:"astrology",icon:"⚡"}, tags:["dosha:nadi"], sortOrder:515 },
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
  { type:"feature_insight", title:"Who Falls Harder?", body:"Based on your Moon signs and Guna score, one of you is emotionally investing faster than the other. The one with the more sensitive Moon sign usually falls first. and harder.", meta:{key:"falls-harder",isPremium:false}, tags:["universal"], sortOrder:600 },
  { type:"feature_insight", title:"Who Gets Attached First?", body:"Attachment speed is determined by Moon sign and Nakshatra. Water signs (Karka, Vrishchika, Meena) typically form deep attachment within the first month. Earth signs take longer but attach more completely.", meta:{key:"attached-first",isPremium:false}, tags:["universal"], sortOrder:601 },
  { type:"feature_insight", title:"Dependency Index", body:"Your Gana combination determines how much you each need the other. Deva-Manushya pairs tend toward healthy interdependence. Rakshasa-involved pairs can tip into intensity.", meta:{key:"dependency-index",isPremium:true}, tags:["universal"], sortOrder:602 },
  { type:"feature_insight", title:"Ghosting Probability", body:"The Bhakoot and Gana readings indicate how each person handles emotional overwhelm. which is the #1 predictor of ghosting. Partners with Rakshasa Gana are more likely to disappear than discuss.", meta:{key:"ghosting-probability",isPremium:true}, tags:["universal"], sortOrder:603 },
  { type:"feature_insight", title:"Reunion Potential", body:"Karmic connections (shared nakshatra lords, past dasha overlap) create strong reunion pulls. But reunion potential doesn't mean reunion readiness those are separate questions.", meta:{key:"reunion-potential",isPremium:true}, tags:["universal","relationship:ex"], sortOrder:604 },
  { type:"feature_insight", title:"Toxic or Soulmate?", body:"The same intensity that makes a connection feel like a soulmate connection especially Rahu-Ketu axis involvements is what makes it potentially toxic. The difference is whether both people are growing.", meta:{key:"toxic-or-soulmate",isPremium:true}, tags:["universal","dosha:mangal"], sortOrder:605 },
  { type:"feature_insight", title:"Why You Can't Let Go", body:"Nadi and Bhakoot doshas create subconscious physiological entanglement. When these are present, the connection registers in the nervous system differently making letting go genuinely harder, not just emotionally.", meta:{key:"cant-let-go",isPremium:true}, tags:["universal","dosha:nadi","dosha:bhakoot","relationship:ex"], sortOrder:606 },
  { type:"feature_insight", title:"Hidden Red Flags", body:"Your Gana combination reveals the temperament friction points most likely to become relationship-ending patterns. Knowing them doesn't doom you. it arms you.", meta:{key:"red-flags",isPremium:true}, tags:["universal"], sortOrder:607 },
  { type:"feature_insight", title:"Hidden Green Flags", body:"Your highest-scoring Ashtakoot dimensions reveal where this relationship is genuinely protected. the areas where you naturally work well together without trying.", meta:{key:"green-flags",isPremium:true}, tags:["universal"], sortOrder:608 },
  { type:"feature_insight", title:"Why They're Pulling Back", body:"Moon sign withdrawal patterns are almost always about the withdrawing person's unmet Moon needs, not what you did. Understanding their Moon sign explains their disappearing acts.", meta:{key:"pulling-back",isPremium:true}, tags:["universal"], sortOrder:609 },
  { type:"feature_insight", title:"Your Love Wound", body:"Every Moon sign carries a core wound from early life that shapes how they love as adults. Identifying yours. and theirs is the fastest route to genuine compassion.", meta:{key:"love-wound",isPremium:true}, tags:["universal"], sortOrder:610 },
  { type:"feature_insight", title:"Breaking Point", body:"Every relationship has a structural breaking point. the condition under which it is most likely to collapse. Your Bhakoot and Gana readings identify it precisely.", meta:{key:"breaking-point",isPremium:true}, tags:["universal"], sortOrder:611 },
];

// ─── GenZ Question Answers (70 items) ────────────────────────────────────────
// These are the burning questions GenZ asks about their relationships.
// Each answer is 2-4 sentences, astrologically credible, honest and direct.
// type: "question_answer"
// meta: { question, shortAnswer, category, icon }
// category: "about_them" | "about_you" | "what_to_do" | "patterns" | "big_picture"

const questionAnswers: ContentSeed[] = [
  // ── About Them ──────────────────────────────────────────────────────────────
  { type:"question_answer", title:"Why do they pull away when things get good?",
    body:"Their Moon sign goes into self-protection mode exactly when closeness peaks it's not about you, it's about their fear of how much they feel. The pattern is almost always about them running from the vulnerability, not from you.",
    meta:{ question:"Why do they pull away when things get good?", shortAnswer:"They're scared of how much they feel.", category:"about_them", icon:"💨" },
    tags:["universal","pattern:avoidant","relationship:situationship"], sortOrder:700 },

  { type:"question_answer", title:"Do they actually miss me?",
    body:"Yes. but missing someone and being ready to do something about it are completely different things. Their Moon sign processes absence quietly and intensely; they just won't always show you that.",
    meta:{ question:"Do they actually miss me?", shortAnswer:"Yes, but not in a way that changes anything yet.", category:"about_them", icon:"💭" },
    tags:["universal","relationship:ex","intent:misses_me"], sortOrder:701 },

  { type:"question_answer", title:"Why do they go hot and cold?",
    body:"Hot-and-cold behavior almost always means someone is attracted to you but scared of what that attraction means. Their Moon sign can't decide whether intimacy feels safe. so they oscillate. It's inconsistency, not mixed feelings.",
    meta:{ question:"Why do they go hot and cold?", shortAnswer:"Attracted but scared. Classic avoidant pattern.", category:"about_them", icon:"🌡️" },
    tags:["universal","relationship:situationship","relationship:crush","pattern:hot_cold"], sortOrder:702 },

  { type:"question_answer", title:"Do they think about me?",
    body:"Connections that register at your Nakshatra level don't just evaporate. They think about you probably more than they'd admit. The more relevant question is what they're doing with those thoughts.",
    meta:{ question:"Do they think about me?", shortAnswer:"Probably more than they let on.", category:"about_them", icon:"🧠" },
    tags:["universal","relationship:ex","relationship:situationship","intent:misses_me"], sortOrder:703 },

  { type:"question_answer", title:"Are they losing interest?",
    body:"Reduced energy doesn't always mean reduced interest. it can mean they're overwhelmed with something else, or going through their own dasha challenges. But if the pattern has lasted more than 3 weeks with no explanation, that's different information.",
    meta:{ question:"Are they losing interest?", shortAnswer:"Not necessarily. but look at the pattern, not the day.", category:"about_them", icon:"📉" },
    tags:["universal","relationship:relationship","relationship:situationship"], sortOrder:704 },

  { type:"question_answer", title:"Why won't they commit?",
    body:"Commitment avoidance is almost always a Ketu or Saturn influence in their chart someone who's been hurt, or who equates commitment with loss of self. It's not that they don't value you. It's that they haven't resolved their relationship with losing freedom.",
    meta:{ question:"Why won't they commit?", shortAnswer:"They value you. They fear losing themselves more.", category:"about_them", icon:"🔒" },
    tags:["relationship:situationship","universal","pattern:avoidant"], sortOrder:705 },

  { type:"question_answer", title:"Why did they ghost me?",
    body:"Ghosting is almost always about the ghoster's inability to handle conflict or discomfort, not your lack of worth. Their Moon sign especially Dhanu, Kumbha, or Kanya moons can disappear rather than face an uncomfortable conversation.",
    meta:{ question:"Why did they ghost me?", shortAnswer:"Their conflict-avoidance, not your worth.", category:"about_them", icon:"👻" },
    tags:["universal","relationship:situationship","relationship:crush"], sortOrder:706 },

  { type:"question_answer", title:"Will they come back?",
    body:"Karmic connections don't close cleanly there's usually a thread that pulls both people back. But returning to the same dynamic means repeating the same karma. The real question isn't if they'll come back it's what would need to be different for it to mean something.",
    meta:{ question:"Will they come back?", shortAnswer:"Maybe. The better question is what would be different.", category:"about_them", icon:"🔄" },
    tags:["relationship:ex","universal","intent:come_back"], sortOrder:707 },

  { type:"question_answer", title:"Why do they send mixed signals?",
    body:"Mixed signals usually mean someone is navigating two competing truths at once: they want you, and they're not ready for what wanting you implies. They're not lying they're genuinely conflicted. But that's still your time being taken up.",
    meta:{ question:"Why do they send mixed signals?", shortAnswer:"They want you AND they're not ready. Both are true.", category:"about_them", icon:"🔀" },
    tags:["universal","relationship:situationship","relationship:crush"], sortOrder:708 },

  { type:"question_answer", title:"Why did they leave when everything seemed fine?",
    body:"'Seemed fine' is often the clue. People who leave without warning were often building up to it silently for a long time their Moon sign processes discontent internally first. By the time you saw it, they'd already decided.",
    meta:{ question:"Why did they leave when everything seemed fine?", shortAnswer:"They'd been processing it internally for a while.", category:"about_them", icon:"🚶" },
    tags:["relationship:ex","universal","intent:why_left"], sortOrder:709 },

  { type:"question_answer", title:"Are they talking to someone else?",
    body:"The stars can't tell you that. only they can. But your gut registered something. The question isn't whether you're right; it's whether you trust yourself enough to ask the question directly rather than spiral.",
    meta:{ question:"Are they talking to someone else?", shortAnswer:"Trust your gut enough to just ask.", category:"about_them", icon:"📱" },
    tags:["universal","relationship:situationship","relationship:relationship"], sortOrder:710 },

  { type:"question_answer", title:"Why do they act like they care and then disappear?",
    body:"Their presence when they're present is genuine. so is their absence. They have the capacity for deep connection but not the consistency. That combination will keep hurting you until you decide what you actually need from them.",
    meta:{ question:"Why do they act like they care and then disappear?", shortAnswer:"The care is real. The consistency isn't.", category:"about_them", icon:"🌊" },
    tags:["universal","relationship:situationship","pattern:hot_cold"], sortOrder:711 },

  // ── About You ───────────────────────────────────────────────────────────────
  { type:"question_answer", title:"Am I the toxic one in this relationship?",
    body:"Asking this question usually means you're not truly toxic people rarely audit themselves. More likely, you have patterns that show up under stress that you're not proud of. That's human, not toxic. The work is identifying which specific triggers bring those patterns out.",
    meta:{ question:"Am I the toxic one in this relationship?", shortAnswer:"Probably not. But you have patterns worth looking at.", category:"about_you", icon:"🪞" },
    tags:["universal","category:growth"], sortOrder:720 },

  { type:"question_answer", title:"Why do I always fall for unavailable people?",
    body:"Your Moon sign finds familiarity in emotional inconsistency somewhere in early life, inconsistent love was the only love available. The good news: you can relearn what 'available' feels like. It just takes being willing to feel bored at first.",
    meta:{ question:"Why do I always fall for unavailable people?", shortAnswer:"Familiarity with inconsistency, learned early. Rewritable.", category:"about_you", icon:"🎯" },
    tags:["universal","pattern:avoidant","category:growth"], sortOrder:721 },

  { type:"question_answer", title:"Why can't I stop thinking about them?",
    body:"Your Nakshatra forms attachment at a depth that doesn't release quickly. this isn't weakness, it's how you're built. The obsessive thoughts are your nervous system trying to resolve something that didn't get a clean ending. Give it a task: write the letter you'll never send.",
    meta:{ question:"Why can't I stop thinking about them?", shortAnswer:"Your attachment runs deep. Give it a productive task.", category:"about_you", icon:"🌀" },
    tags:["universal","relationship:ex","intent:addicted"], sortOrder:722 },

  { type:"question_answer", title:"Am I too much for them?",
    body:"You are not too much. You are the right amount for the wrong person or for someone who hasn't done the work to hold depth yet. Your intensity is not a flaw. It's a filter.",
    meta:{ question:"Am I too much for them?", shortAnswer:"You're not too much. They're not enough.", category:"about_you", icon:"🌋" },
    tags:["universal","moon_rashi:Vrishchika","moon_rashi:Mesha","moon_rashi:Karka"], sortOrder:723 },

  { type:"question_answer", title:"Am I being paranoid or is my gut right?",
    body:"Your Moon sign has strong intuition that usually fires before your mind catches up. The pattern most people find is: their gut was right. The second-guessing came after. If something felt off, that was real data. the question is what you do with it.",
    meta:{ question:"Am I being paranoid or is my gut right?", shortAnswer:"Your gut is usually ahead of your brain.", category:"about_you", icon:"🔮" },
    tags:["universal","intent:confused","category:intuition"], sortOrder:724 },

  { type:"question_answer", title:"Why do I always feel like I care more?",
    body:"Your Moon placement makes you emotionally expressive in ways that often outpace a partner who processes love more quietly. You might actually care equally. but differently. Still worth asking: is this specific person matching your depth, or just benefiting from it?",
    meta:{ question:"Why do I always feel like I care more?", shortAnswer:"You might care equally, just differently. Or you might be right.", category:"about_you", icon:"⚖️" },
    tags:["universal","moon_rashi:Karka","moon_rashi:Meena","moon_rashi:Vrishchika"], sortOrder:725 },

  { type:"question_answer", title:"Why do I keep going back to them?",
    body:"Familiarity registers as safety in the nervous system, even when the relationship isn't safe. Your Nakshatra tends to return to what it knows. Breaking the pattern requires building enough new safety elsewhere that the pull of the old loses its grip.",
    meta:{ question:"Why do I keep going back to them?", shortAnswer:"Familiarity feels like safety, even when it isn't.", category:"about_you", icon:"🔁" },
    tags:["universal","relationship:ex","intent:come_back","pattern:cycles"], sortOrder:726 },

  { type:"question_answer", title:"Am I self-sabotaging?",
    body:"Classic self-sabotage signals: things go well and then you create drama, you push away people who actually show up, you feel more comfortable in uncertainty than in stability. If any of those land yes, and it's worth understanding why safety feels threatening to you.",
    meta:{ question:"Am I self-sabotaging?", shortAnswer:"Maybe. Does stable feel boring?", category:"about_you", icon:"💣" },
    tags:["universal","category:growth","pattern:sabotage"], sortOrder:727 },

  { type:"question_answer", title:"Why do I get so anxious when they don't reply?",
    body:"Anxious attachment means your nervous system treats silence as abandonment. even when it's just someone busy. Your Moon sign amplifies this. The work isn't to stop caring; it's to build enough security in yourself that their silence doesn't destabilize you.",
    meta:{ question:"Why do I get so anxious when they don't reply?", shortAnswer:"Anxious attachment. Silence = abandonment to your nervous system.", category:"about_you", icon:"📵" },
    tags:["universal","moon_rashi:Karka","pattern:anxious_attachment"], sortOrder:728 },

  { type:"question_answer", title:"Why do I lose myself in relationships?",
    body:"Your Moon sign loves deeply enough to reshape itself around what it loves. which is beautiful and also dangerous. You lose yourself when the other person's needs consistently override yours with your permission. The question is: at what point do you stop volunteering yourself for that?",
    meta:{ question:"Why do I lose myself in relationships?", shortAnswer:"You're built to merge. The key is staying anchored.", category:"about_you", icon:"🌊" },
    tags:["universal","moon_rashi:Meena","moon_rashi:Karka","moon_rashi:Tula"], sortOrder:729 },

  { type:"question_answer", title:"Why do I keep choosing the same type of person?",
    body:"Repetition is the soul's way of trying to master what it couldn't master the first time. Your Nakshatra gravitates toward a specific energy because it feels familiar. and somewhere inside, you believe this time you can make it work. The pattern breaks when you do something genuinely different, not just with different people.",
    meta:{ question:"Why do I keep choosing the same type of person?", shortAnswer:"Trying to master the original wound. It won't work the same way.", category:"about_you", icon:"🎭" },
    tags:["universal","pattern:repetition","category:growth"], sortOrder:730 },

  { type:"question_answer", title:"Is my attachment style ruining this?",
    body:"Attachment styles don't ruin relationships unconscious attachment styles do. Simply knowing whether you're anxious, avoidant, or secure gives you a map to work with. The relationship has a better chance once you can name your patterns to each other.",
    meta:{ question:"Is my attachment style ruining this?", shortAnswer:"Unconscious patterns do damage. Named ones are workable.", category:"about_you", icon:"🔗" },
    tags:["universal","category:growth","pattern:anxious_attachment"], sortOrder:731 },

  // ── What To Do ──────────────────────────────────────────────────────────────
  { type:"question_answer", title:"Should I reach out first?",
    body:"Reach out if you have something genuine to say. not to test them, not to 'keep them thinking about you,' just because you want to. The problem with strategic texting is that it's rarely satisfying even when it works.",
    meta:{ question:"Should I reach out first?", shortAnswer:"Only if you have something real to say.", category:"what_to_do", icon:"📲" },
    tags:["universal","relationship:ex","relationship:situationship","intent:should_text"], sortOrder:740 },

  { type:"question_answer", title:"Should I give them another chance?",
    body:"Second chances work when something genuinely changed. not when time passed. The question is not 'do I still love them' but 'what specific thing is different now that would change the outcome?' If you can't name it precisely, you're hoping, not knowing.",
    meta:{ question:"Should I give them another chance?", shortAnswer:"Only if something specifically changed. Not just time.", category:"what_to_do", icon:"🎲" },
    tags:["universal","relationship:ex","intent:come_back"], sortOrder:741 },

  { type:"question_answer", title:"How do I stop overthinking this?",
    body:"You can't think your way out of an emotional loop you have to move through it. Your Moon sign processes emotion by doing something physical: walk, cook, create. Make something with your hands today. The spiral needs a direction to discharge.",
    meta:{ question:"How do I stop overthinking this?", shortAnswer:"Move your body. The spiral needs somewhere to go.", category:"what_to_do", icon:"🌀" },
    tags:["universal","moon_rashi:Mithuna","moon_rashi:Kanya","moon_rashi:Kumbha"], sortOrder:742 },

  { type:"question_answer", title:"How do I get them to open up?",
    body:"You can't force a Moon sign to open they open when they feel safe enough. Create safety by being consistent, low-stakes, and not treating every emotional moment as a test. And stop interrogating. Curiosity, not analysis, opens people up.",
    meta:{ question:"How do I get them to open up?", shortAnswer:"Create safety first. Stop interrogating.", category:"what_to_do", icon:"🗝️" },
    tags:["universal","pattern:avoidant","relationship:relationship"], sortOrder:743 },

  { type:"question_answer", title:"How do I stop being so available?",
    body:"This isn't about playing games it's about genuinely redirecting your energy into things that matter to you. When you have a full life, availability becomes natural and grounded, not strategic. The less available-from-anxiety you are, the more attractive-from-wholeness you become.",
    meta:{ question:"How do I stop being so available?", shortAnswer:"Build a life, not a strategy.", category:"what_to_do", icon:"⚡" },
    tags:["universal","relationship:crush","relationship:situationship"], sortOrder:744 },

  { type:"question_answer", title:"Should I tell them how I feel?",
    body:"Unexpressed feelings become either resentment or obsession. Telling them won't guarantee the outcome you want. but it will free up the energy you're currently spending managing the secret. Say it simply, without an ultimatum, and let them respond honestly.",
    meta:{ question:"Should I tell them how I feel?", shortAnswer:"Say it without an ultimatum. Free the energy either way.", category:"what_to_do", icon:"💬" },
    tags:["universal","relationship:crush","relationship:situationship","intent:should_text"], sortOrder:745 },

  { type:"question_answer", title:"How do I let go without closure?",
    body:"Closure is a myth you're using to stay tethered. The truth is you can't get closure from the person who caused the pain. only from yourself. Write out what the relationship meant, what you're grieving, and what you learned. That's the closure. Send the letter to yourself.",
    meta:{ question:"How do I let go without closure?", shortAnswer:"Closure comes from yourself, not from them.", category:"what_to_do", icon:"🕊️" },
    tags:["universal","relationship:ex","intent:move_on"], sortOrder:746 },

  { type:"question_answer", title:"How do I set a boundary without pushing them away?",
    body:"A boundary that pushes the right person away isn't really a problem it's a filter. But the way to set boundaries without triggering avoidants is to frame them as needs, not rules: 'I need X to feel safe' lands very differently than 'You're not allowed to Y.'",
    meta:{ question:"How do I set a boundary without pushing them away?", shortAnswer:"Say 'I need' not 'you can't.'", category:"what_to_do", icon:"🛡️" },
    tags:["universal","relationship:relationship","relationship:situationship"], sortOrder:747 },

  // ── Patterns ────────────────────────────────────────────────────────────────
  { type:"question_answer", title:"Is this a trauma bond or real love?",
    body:"The difference: real love expands you; trauma bonds contract you. If the connection makes you feel better about yourself and more yourself, it's love. If it makes you feel crazy, insufficient, or like you need to earn the good moments that's a bond built on pain, not love.",
    meta:{ question:"Is this a trauma bond or real love?", shortAnswer:"Real love expands you. Trauma bonds shrink you.", category:"patterns", icon:"🔬" },
    tags:["universal","pattern:trauma_bond","category:growth"], sortOrder:750 },

  { type:"question_answer", title:"Are we compatible or just comfortable?",
    body:"Comfort masquerades as compatibility all the time. The test: when you imagine a better version of your life, are they in it? Or do they just fit your current version because they've always been there? Compatible means growing together. Comfortable means not having to face the alternative.",
    meta:{ question:"Are we compatible or just comfortable?", shortAnswer:"Comfort is real. Compatible means growing together.", category:"patterns", icon:"🛋️" },
    tags:["universal","relationship:relationship","intent:compatible"], sortOrder:751 },

  { type:"question_answer", title:"Is this love or just attachment?",
    body:"Attachment can exist without love, and love can exist without healthy attachment. You can be profoundly attached to someone who isn't good for you. The marker of love is: does wanting what's best for them ever lead you toward giving them space or freedom, even when that costs you?",
    meta:{ question:"Is this love or just attachment?", shortAnswer:"Can you want what's best for them, even when it costs you?", category:"patterns", icon:"🧲" },
    tags:["universal","intent:addicted","category:growth"], sortOrder:752 },

  { type:"question_answer", title:"Why does this feel addictive even though it hurts?",
    body:"Intermittent reinforcement unpredictable rewards is the most powerful psychological pattern for creating addiction. The highs feel higher because of the lows. Your Nakshatra's depth means you imprint these cycles deeply. Naming it as a chemical pattern (not fate) is the first exit.",
    meta:{ question:"Why does this feel addictive even though it hurts?", shortAnswer:"Intermittent rewards create the strongest addictions.", category:"patterns", icon:"💊" },
    tags:["universal","pattern:hot_cold","intent:addicted"], sortOrder:753 },

  { type:"question_answer", title:"Why do we keep having the same fight?",
    body:"The recurring argument is never really about the surface subject it's about an unmet need that hasn't been named directly. One of you needs security, or freedom, or recognition, or to be heard. Until that need is said out loud and responded to, the specific argument will keep changing form.",
    meta:{ question:"Why do we keep having the same fight?", shortAnswer:"It's not the fight. It's the unmet need underneath.", category:"patterns", icon:"🔁" },
    tags:["universal","relationship:relationship","intent:why_fight"], sortOrder:754 },

  { type:"question_answer", title:"What's the hidden pattern in this connection?",
    body:"The pattern that's hardest to see is the one you're both playing out from before you met. Your Moon signs are two people bringing their individual wounds into contact. the friction you feel is usually where those wounds intersect, not where you're actually incompatible.",
    meta:{ question:"What's the hidden pattern in this connection?", shortAnswer:"Two people's old wounds meeting. That's where the friction is.", category:"patterns", icon:"🕵️" },
    tags:["universal","category:growth"], sortOrder:755 },

  { type:"question_answer", title:"Are we growing together or growing apart?",
    body:"Check the last 3 months: are there more moments of genuine discovery together, or more moments of going through motions? Growth together looks like: you challenge each other, you're interested in what the other is becoming, you're not the same people you were a year ago.",
    meta:{ question:"Are we growing together or growing apart?", shortAnswer:"Are you interested in who they're becoming?", category:"patterns", icon:"🌱" },
    tags:["relationship:relationship","intent:future"], sortOrder:756 },

  // ── Big Picture ─────────────────────────────────────────────────────────────
  { type:"question_answer", title:"Is this worth fighting for?",
    body:"Worth fighting for means: the best version of this relationship is worth the cost of the worst moments. Not that the worst moments are acceptable. but that what you'd build together justifies working through them. Only you can answer that. But answer it honestly, not hopefully.",
    meta:{ question:"Is this worth fighting for?", shortAnswer:"Is the best version worth the worst moments' cost?", category:"big_picture", icon:"⚔️" },
    tags:["universal","relationship:relationship","intent:future"], sortOrder:760 },

  { type:"question_answer", title:"Is this the right person for me?",
    body:"Your chart says someone is 'right' when they make you more yourself, not less. Not easier, necessarily some of the most important people are challenging. But the challenge should be growing you, not shrinking you. If you feel smaller around them, that's your answer.",
    meta:{ question:"Is this the right person for me?", shortAnswer:"Do you feel more yourself or less?", category:"big_picture", icon:"🎯" },
    tags:["universal","intent:compatible"], sortOrder:761 },

  { type:"question_answer", title:"Why does love feel so hard for me?",
    body:"Love feels hard when there's a gap between what you believe you deserve and what you actually want. Your Moon sign craves depth. which means you'll always feel the distance between real connection and performed connection more acutely than most. That sensitivity is the same thing that makes you capable of extraordinary love.",
    meta:{ question:"Why does love feel so hard for me?", shortAnswer:"You feel the gap between real and performed love more than most.", category:"big_picture", icon:"💙" },
    tags:["universal","category:healing"], sortOrder:762 },

  { type:"question_answer", title:"What do I actually want from this?",
    body:"Strip away what you think you should want, what sounds reasonable, and what you've been telling yourself. What do you actually want? Security? Passion? To be chosen? To feel known? Naming it precisely changes how you approach the conversation and the relationship.",
    meta:{ question:"What do I actually want from this?", shortAnswer:"Strip away 'should.' What do you actually want?", category:"big_picture", icon:"🔍" },
    tags:["universal","intent:general"], sortOrder:763 },

  { type:"question_answer", title:"How do I know if they're my person?",
    body:"There's no cosmic stamp of approval. But your chart shows what 'your person' needs to have: someone whose Moon element complements yours, whose dasha period is in harmony with yours, and most practically someone who shows up consistently without you having to earn it.",
    meta:{ question:"How do I know if they're my person?", shortAnswer:"They show up consistently without you earning it.", category:"big_picture", icon:"✨" },
    tags:["universal","intent:compatible","intent:future"], sortOrder:764 },
];

// ─── Extended Daily Messages (40 more) ───────────────────────────────────────
// GenZ-specific, situation-aware daily messages to supplement existing 34.

const dailyMessagesExtended: ContentSeed[] = [
  // Situationship-specific
  { type:"daily_message", title:"Today's Reality Check", body:"You've been waiting for them to decide what this is. But here's the truth: them not deciding IS their decision. What are you doing with that information?", tags:["relationship:situationship"], sortOrder:335 },
  { type:"daily_message", title:"No More Maybes", body:"The situationship you're in only survives because neither person has said what they actually want out loud. Today: say it internally to yourself first.", tags:["relationship:situationship"], sortOrder:336 },
  { type:"daily_message", title:"Your Worth Today", body:"You deserve someone who talks about you with excitement, not just answers your texts. Notice who does that today.", tags:["relationship:situationship","relationship:crush"], sortOrder:337 },

  // Crush-specific
  { type:"daily_message", title:"The Projection Check", body:"Most of what you feel about your crush is about what they represent, not who they actually are. What specifically do you know about them versus what you've imagined?", tags:["relationship:crush"], sortOrder:338 },
  { type:"daily_message", title:"Take One Real Step", body:"The crush phase lives on uncertainty. One real conversation changes everything. and not always in the direction you fear. Consider taking one real step today.", tags:["relationship:crush"], sortOrder:339 },

  // Ex-specific
  { type:"daily_message", title:"Nostalgia Is a Liar", body:"Your brain is remembering the best parts of the relationship while your body remembers the pain. Both are real. Don't let one override the other today.", tags:["relationship:ex"], sortOrder:340 },
  { type:"daily_message", title:"You Survived Before Them", body:"Everything you love about yourself existed before them. That person is still here, and is getting clearer every day you choose yourself.", tags:["relationship:ex","category:healing"], sortOrder:341 },
  { type:"daily_message", title:"The Real Question", body:"The question isn't 'will they come back.' It's: who do you want to be in the next chapter of your life, and does that future include going back?", tags:["relationship:ex","intent:come_back"], sortOrder:342 },

  // Hot-and-cold pattern
  { type:"daily_message", title:"About the Inconsistency", body:"People who run hot and cold aren't doing it TO you. They're doing it because of something in them they haven't resolved. The question is whether you want to wait while they figure it out.", tags:["pattern:hot_cold","relationship:situationship","universal"], sortOrder:343 },
  { type:"daily_message", title:"Your Energy Matters", body:"Every time you chase after someone who just pulled away, you're teaching them that pulling away gets your attention. Today, try the opposite.", tags:["pattern:hot_cold","universal"], sortOrder:344 },

  // Anxiety/overthinking
  { type:"daily_message", title:"The 3am Spiral", body:"What you feel at 3am is not the truth it's anxiety with extra authority. Write it down now, read it at noon. See which version of the story feels more real.", tags:["moon_rashi:Karka","moon_rashi:Vrishchika","moon_rashi:Meena","universal"], sortOrder:345 },
  { type:"daily_message", title:"Your Gut vs Your Fear", body:"Your gut says one calm, clear thing. Your fear says ten loud, urgent things. Which voice were you listening to this morning?", tags:["universal","category:intuition"], sortOrder:346 },
  { type:"daily_message", title:"Overthinking Check", body:"You've been analyzing this from every angle. What would happen if today you just felt it instead of explaining it?", tags:["moon_rashi:Mithuna","moon_rashi:Kanya","moon_rashi:Kumbha","universal"], sortOrder:347 },

  // Attachment
  { type:"daily_message", title:"The Space Between Texts", body:"The anxiety you feel waiting for a reply is yours to work with, not theirs to fix. Today: what can you do in the next hour that has nothing to do with them?", tags:["pattern:anxious_attachment","universal"], sortOrder:348 },
  { type:"daily_message", title:"Available to Yourself First", body:"Before checking if they're available, check: are YOU available to yourself right now? What do you actually need today?", tags:["universal","category:self"], sortOrder:349 },

  // GenZ self-worth
  { type:"daily_message", title:"Not a Backup Plan", body:"You are allowed to require being someone's first choice. That's not needy. That's knowing your worth.", tags:["universal","relationship:situationship"], sortOrder:350 },
  { type:"daily_message", title:"Earned Love vs Given Love", body:"You've been working hard to earn this love. Ask yourself: when has love that needed to be earned ever felt like enough once you got it?", tags:["moon_rashi:Karka","moon_rashi:Kanya","universal"], sortOrder:351 },
  { type:"daily_message", title:"The Version They See", body:"Are you showing up as the full version of yourself, or the edited-for-safety version? The edited version can't get real love because it's not really you they're loving.", tags:["universal"], sortOrder:352 },

  // Moon element-specific (more GenZ tone)
  { type:"daily_message", title:"Fire Moon Note", body:"You've been pouring passion into someone who might not be running at your temperature. That's exhausting. Today, point some of that fire at something that's definitely yours.", tags:["moon_rashi:Mesha","moon_rashi:Simha","moon_rashi:Dhanu"], sortOrder:353 },
  { type:"daily_message", title:"Water Moon Note", body:"You've been absorbing their emotional state as if it's yours. Do a quick check: what are YOU feeling, separate from them? That answer is important.", tags:["moon_rashi:Karka","moon_rashi:Vrishchika","moon_rashi:Meena"], sortOrder:354 },
  { type:"daily_message", title:"Earth Moon Note", body:"You've been patient and consistent. which is your power. But patience without a limit isn't a virtue. What are you actually waiting for, and when does the waiting end?", tags:["moon_rashi:Vrishabha","moon_rashi:Kanya","moon_rashi:Makara"], sortOrder:355 },
  { type:"daily_message", title:"Air Moon Note", body:"You've thought about this from every angle. The thinking isn't the problem anymore it's the delay between thinking and feeling it in your body. What does your body actually know about this?", tags:["moon_rashi:Mithuna","moon_rashi:Tula","moon_rashi:Kumbha"], sortOrder:356 },

  // Solutions-focused
  { type:"daily_message", title:"One Action Today", body:"What is one thing, just one, you could do today to move this situation forward in a direction that's good for YOU? Not for them. For you.", tags:["universal"], sortOrder:357 },
  { type:"daily_message", title:"Say the Thing", body:"There's something you've been holding back. Not the big declaration. just one small true thing you've been editing out of conversations. Try saying it today.", tags:["universal","relationship:relationship","relationship:situationship"], sortOrder:358 },
  { type:"daily_message", title:"Ask the Question", body:"The question you're most afraid to ask is usually the one that would actually move things forward. Ask it today. even just to yourself in a journal.", tags:["universal"], sortOrder:359 },

  // Dasha-specific (GenZ framing)
  { type:"daily_message", title:"Rahu Phase Note", body:"You're in a period where desire runs hot and nothing feels like enough. That's Rahu doing what it does. The question is whether what you're chasing is actually what you want or just what's shiny.", tags:["dasha:Rahu"], sortOrder:360 },
  { type:"daily_message", title:"Saturn Season", body:"Things feel slow, heavy, and like everything requires more effort than it should. That's not the relationship failing that's Saturn doing its work. What it builds in this period lasts.", tags:["dasha:Shani"], sortOrder:361 },
  { type:"daily_message", title:"Ketu Clarity", body:"You've been releasing things that don't fit who you're becoming. The loneliness of this period is real. and it's making space. Don't fill it yet.", tags:["dasha:Ketu"], sortOrder:362 },
  { type:"daily_message", title:"Venus Window", body:"This is a genuinely good period for love. not because things are easy, but because your heart is more open than usual. Don't waste it on dead ends.", tags:["dasha:Shukra"], sortOrder:363 },

  // Pattern-breaking
  { type:"daily_message", title:"The Loop", body:"If this situation feels exactly like the last one, it's because you're playing a familiar role. What would you do if you decided not to play that role today?", tags:["universal","pattern:repetition"], sortOrder:364 },
  { type:"daily_message", title:"Who You Become", body:"Five years from now, will you be grateful you stayed in this dynamic? Or will you wish you'd made a different choice earlier? Live from that future version today.", tags:["universal"], sortOrder:365 },
  { type:"daily_message", title:"The Comfortable Lie", body:"The story you've been telling yourself about why this situation is fine say it out loud today and notice if it still sounds true.", tags:["universal","relationship:situationship","relationship:relationship"], sortOrder:366 },

  // Healing-focused GenZ
  { type:"daily_message", title:"You're Not Behind", body:"Other people's timelines are not your deadline. You're healing at the pace your particular wound requires. which is exactly the right pace.", tags:["relationship:ex","category:healing","universal"], sortOrder:367 },
  { type:"daily_message", title:"The Thing About Moving On", body:"Moving on doesn't mean you've stopped caring. It means you've stopped letting that caring run your decisions. There's a difference.", tags:["relationship:ex","intent:move_on"], sortOrder:368 },
  { type:"daily_message", title:"Grief Without a Timeline", body:"You don't have to be over it by now. Grief has no schedule. Give yourself permission to still be in it while also choosing to build forward.", tags:["category:healing","relationship:ex"], sortOrder:369 },
];

// ─── GenZ Additional Affirmations (25 more) ───────────────────────────────────

const affirmationsExtended: ContentSeed[] = [
  { type:"affirmation", body:"I am not responsible for managing their emotional unavailability.", tags:["universal","pattern:avoidant"], sortOrder:255 },
  { type:"affirmation", body:"Being chosen slowly is still being chosen. I don't need to rush someone who is genuinely building toward me.", tags:["universal","relationship:crush"], sortOrder:256 },
  { type:"affirmation", body:"I choose clarity over the comfort of ambiguity.", tags:["relationship:situationship","universal"], sortOrder:257 },
  { type:"affirmation", body:"Healing doesn't mean going back to who I was. It means becoming more of who I actually am.", tags:["category:healing","universal"], sortOrder:258 },
  { type:"affirmation", body:"My needs are not a burden. They are a map to deeper intimacy.", tags:["universal"], sortOrder:259 },
  { type:"affirmation", body:"I release the relationship I thought we'd have and grieve it properly.", tags:["relationship:ex","category:healing"], sortOrder:260 },
  { type:"affirmation", body:"The anxiety I feel is not evidence of what's real. It is evidence of what I fear.", tags:["universal","pattern:anxious_attachment"], sortOrder:261 },
  { type:"affirmation", body:"I deserve the energy I give.", tags:["universal"], sortOrder:262 },
  { type:"affirmation", body:"I am done translating their mixed signals. I now require clear ones.", tags:["relationship:situationship","universal"], sortOrder:263 },
  { type:"affirmation", body:"My gut is smarter than my hope. I listen to it.", tags:["universal","category:intuition"], sortOrder:264 },
  { type:"affirmation", body:"I don't have to earn something that should be freely given.", tags:["universal","moon_rashi:Karka","moon_rashi:Kanya"], sortOrder:265 },
  { type:"affirmation", body:"Being honest about what I want is not the same as being demanding.", tags:["universal"], sortOrder:266 },
  { type:"affirmation", body:"I am allowed to outgrow someone I used to love.", tags:["universal","relationship:ex"], sortOrder:267 },
  { type:"affirmation", body:"The right person will not make me feel like I need to audit my own feelings.", tags:["universal"], sortOrder:268 },
  { type:"affirmation", body:"I stop performing low-maintenance to seem more appealing.", tags:["universal"], sortOrder:269 },
  { type:"affirmation", body:"I choose to feel this fully rather than numb it or rush through it.", tags:["universal","category:healing"], sortOrder:270 },
  { type:"affirmation", body:"My healing is not linear and that is completely fine.", tags:["category:healing","universal"], sortOrder:271 },
  { type:"affirmation", body:"I am not available for relationships that live entirely in my head.", tags:["relationship:crush","relationship:situationship","universal"], sortOrder:272 },
  { type:"affirmation", body:"The version of me that exists when I'm not trying to be enough for someone is the version worth knowing.", tags:["universal"], sortOrder:273 },
  { type:"affirmation", body:"I practice communicating what I need before I reach the point of resentment.", tags:["universal","relationship:relationship"], sortOrder:274 },
  { type:"affirmation", body:"I trust that walking away from what's wrong is always walking toward what's right.", tags:["universal","relationship:ex","relationship:situationship"], sortOrder:275 },
  { type:"affirmation", body:"I am in the process of becoming someone who recognizes love when it's real.", tags:["universal","category:growth"], sortOrder:276 },
  { type:"affirmation", body:"Every boundary I hold teaches me something about what I actually value.", tags:["universal"], sortOrder:277 },
  { type:"affirmation", body:"I am not the problem. I am the person who keeps asking if I'm the problem.", tags:["universal"], sortOrder:278 },
  { type:"affirmation", body:"I release the fantasy version of this connection and work with reality.", tags:["universal","relationship:crush","relationship:situationship"], sortOrder:279 },
];

// ─── Combine all ──────────────────────────────────────────────────────────────

export const ALL_CONTENT: ContentSeed[] = [
  ...quotes,
  ...affirmations,
  ...affirmationsExtended,
  ...dailyMessages,
  ...dailyMessagesExtended,
  ...oracleResponses,
  ...suggestionCards,
  ...featureInsights,
  ...questionAnswers,
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
