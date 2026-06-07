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
  { type:"daily_message", body:"Say the thing you've been holding back. Today is a good day for it.", tags:["universal"], sortOrder:300 },
  { type:"daily_message", body:"Stop explaining yourself so much. Just be present. That's enough.", tags:["universal"], sortOrder:301 },
  { type:"daily_message", body:"Small, specific acts of care land harder than big gestures. One small thing today.", tags:["universal","rel_type:relationship"], sortOrder:302 },
  { type:"daily_message", body:"You've been in your head about this for a while. What does it actually feel like?", tags:["universal","moon:Gemini","moon:Aquarius"], sortOrder:303 },
  { type:"daily_message", body:"The pattern you keep running into is trying to tell you something. Worth listening.", tags:["universal"], sortOrder:304 },
  { type:"daily_message", body:"You've been filling yourself up for them. Fill yourself up for you today.", tags:["moon:Cancer","moon:Pisces","moon:Scorpio"], sortOrder:305 },
  { type:"daily_message", body:"The timing that's frustrating you right now might be keeping you from something worse. Trust it.", tags:["universal"], sortOrder:306 },
  { type:"daily_message", body:"You already know what you need to do. The question is whether you're going to do it.", tags:["universal"], sortOrder:307 },
  { type:"daily_message", body:"Your energy runs hot right now. Build something with it instead of starting something.", tags:["dosha:mangal","moon:Aries","moon:Scorpio"], sortOrder:308 },
  { type:"daily_message", body:"The intensity you're feeling right now is burning through something old. Let it finish.", tags:["dasha:Rahu"], sortOrder:309 },
  { type:"daily_message", body:"The hard part you're in right now is actually doing something. Stick it out.", tags:["dasha:Shani","guna:low"], sortOrder:310 },
  { type:"daily_message", body:"Before reaching out, pause: is this love or is this anxiety? Answer honestly.", tags:["universal","rel_type:ex","rel_type:situationship"], sortOrder:311 },
  { type:"daily_message", body:"Something is falling away right now. Don't grip it. See what's underneath.", tags:["dasha:Ketu"], sortOrder:312 },
  { type:"daily_message", body:"What you want and what you actually need might not be the same thing today. Notice the gap.", tags:["dasha:Shukra"], sortOrder:313 },
  { type:"daily_message", body:"Something that's been under the surface is trying to come up today. Pay attention to it.", tags:["universal"], sortOrder:314 },
  { type:"daily_message", body:"Tell them one specific thing you noticed about them this week. Specificity is the whole thing.", tags:["rel_type:relationship","universal"], sortOrder:315 },
  { type:"daily_message", body:"Give it another day or two before you make a decision. The clarity will come.", tags:["universal"], sortOrder:316 },
  { type:"daily_message", body:"You can love someone fully and still know it's not right. Those two things coexist.", tags:["universal","rel_type:ex"], sortOrder:317 },
  { type:"daily_message", body:"Getting over someone isn't about forgetting them. It's about building something new.", tags:["rel_type:ex"], sortOrder:318 },
  { type:"daily_message", body:"Name one thing you actually like about yourself today. Not about the relationship — about you.", tags:["universal"], sortOrder:319 },
  { type:"daily_message", body:"The conversation you've been putting off? Today is actually a good day for it.", tags:["universal"], sortOrder:320 },
  { type:"daily_message", body:"How you show up in this connection is building something. Make sure it's what you actually want to build.", tags:["universal"], sortOrder:321 },
  { type:"daily_message", body:"The words you use today will land differently than usual. Choose them carefully.", tags:["dasha:Budh","moon:Gemini","moon:Virgo"], sortOrder:322 },
  { type:"daily_message", body:"If you're wondering whether someone cares, notice how that wondering feels. That's information.", tags:["rel_type:situationship","rel_type:crush"], sortOrder:323 },
  { type:"daily_message", body:"You're in a genuine growth period right now. Don't rush to wrap it up.", tags:["dasha:Brihaspati"], sortOrder:324 },
  { type:"daily_message", body:"Before you ask for more from them, check what you're bringing today. Both matter.", tags:["rel_type:relationship","universal"], sortOrder:325 },
  { type:"daily_message", body:"You're not behind. You're moving at the pace that's actually right for you.", tags:["universal"], sortOrder:326 },
  { type:"daily_message", body:"The friction in this connection right now is two people growing. That's not a bad sign.", tags:["rel_type:relationship","guna:medium","guna:low"], sortOrder:327 },
  { type:"daily_message", body:"Say thank you for something specific they did. Not general — one specific thing.", tags:["universal","rel_type:relationship"], sortOrder:328 },
  { type:"daily_message", body:"Your passion is genuinely magnetic. Today, aim it at warmth, not friction.", tags:["moon:Aries","moon:Leo","moon:Sagittarius","element:Fire"], sortOrder:329 },
  { type:"daily_message", body:"Your emotions aren't problems to solve. They're information. What are they saying?", tags:["moon:Cancer","moon:Scorpio","moon:Pisces","element:Water"], sortOrder:330 },
  { type:"daily_message", body:"You showing up consistently is doing more than you think. Keep going.", tags:["moon:Taurus","moon:Virgo","moon:Capricorn","element:Earth"], sortOrder:331 },
  { type:"daily_message", body:"You've been thinking about them a lot. What do you actually feel underneath the thoughts?", tags:["moon:Gemini","moon:Libra","moon:Aquarius","element:Air"], sortOrder:332 },
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

// ─── Oracle Responses v2 (structured Insight + What to do format) ─────────────
// These override the old oracle responses. meta.intent is used for routing.

const oracleResponsesV2: ContentSeed[] = [
  // misses_me
  { type:"oracle_response", body:"Insight\n\"Probably yes — a {{pMoon}} emotional style holds on quietly. But missing you and doing something about it are two different things.\"\n\nWhat to do\n✓ Stop waiting for signs   ✓ Ask yourself what you'd do with a yes   ✓ Build something for yourself right now", meta:{intent:"misses_me",version:2}, tags:["universal","intent:misses_me"], sortOrder:1400 },
  { type:"oracle_response", body:"Insight\n\"{{p}} probably thinks about you. That doesn't mean they're ready to act on it — carrying someone and choosing them are not the same thing.\"\n\nWhat to do\n✓ Don't mistake their silence for an answer   ✓ Give it a clear deadline in your head   ✓ Focus on what's in your control", meta:{intent:"misses_me",version:2}, tags:["universal","intent:misses_me"], sortOrder:1401 },
  { type:"oracle_response", body:"Insight\n\"Something real persists between you — that's true. But 'missing' without action is just attachment. What would you actually do with a yes?\"\n\nWhat to do\n✓ Decide what you want first   ✓ Don't keep the door open forever   ✓ Put your energy somewhere that gives back", meta:{intent:"misses_me",version:2}, tags:["universal","intent:misses_me"], sortOrder:1402 },
  { type:"oracle_response", body:"Insight\n\"{{p}}'s {{pMoon}} style processes feeling quietly and doesn't announce what they carry. The connection didn't vanish — but their silence is still information.\"\n\nWhat to do\n✓ Take the silence at face value   ✓ If you need to know, ask directly   ✓ Stop re-reading old messages for hidden meaning", meta:{intent:"misses_me",version:2}, tags:["universal","intent:misses_me"], sortOrder:1403 },
  // loves_me
  { type:"oracle_response", body:"Insight\n\"{{p}}'s {{pMoon}} emotional style doesn't fake feelings they don't have — it hides the ones they do. Look at what they do when it's inconvenient for them. That's the real answer.\"\n\nWhat to do\n✓ Watch their actions, not their words   ✓ Notice how they show up when you need something   ✓ Ask directly if you're still unsure", meta:{intent:"loves_me",version:2}, tags:["universal","intent:loves_me"], sortOrder:1410 },
  { type:"oracle_response", body:"Insight\n\"The connection is real — {{gunaVerdict}}. But feeling something and choosing to act on it are different. You're not imagining it. The question is whether they're showing up for it.\"\n\nWhat to do\n✓ Stop analyzing and ask once, clearly   ✓ Give them space to answer honestly   ✓ Trust what you observe, not what you hope", meta:{intent:"loves_me",version:2}, tags:["universal","intent:loves_me"], sortOrder:1411 },
  { type:"oracle_response", body:"Insight\n\"Your instincts are strong. What you sensed before the doubt set in — that's usually accurate. A {{pMoon}} style hides care, it doesn't fake it.\"\n\nWhat to do\n✓ Go back to your first read   ✓ Notice consistency in small moments   ✓ Don't ask again — decide based on what you've already seen", meta:{intent:"loves_me",version:2}, tags:["universal","intent:loves_me"], sortOrder:1412 },
  // come_back
  { type:"oracle_response", body:"Insight\n\"Coming back only works if something actually changed — not just the feeling, the pattern. What specifically would be different this time?\"\n\nWhat to do\n✓ Name what needs to change before saying yes   ✓ Don't mistake missing them for being ready   ✓ Give it more time before deciding", meta:{intent:"come_back",version:2}, tags:["universal","intent:come_back"], sortOrder:1420 },
  { type:"oracle_response", body:"Insight\n\"The connection was real — that's not the question. The question is whether you're both different enough from who you were when it ended.\"\n\nWhat to do\n✓ Make a list of what needs to be different   ✓ Have the conversation about what broke it   ✓ Don't go back to the same dynamic in a new beginning", meta:{intent:"come_back",version:2}, tags:["universal","intent:come_back"], sortOrder:1421 },
  { type:"oracle_response", body:"Insight\n\"Real reconciliation needs two honest conversations: what broke it, and what's genuinely changed. Without both, the return is just the same story starting over.\"\n\nWhat to do\n✓ Have the real conversation first   ✓ Don't rush the decision because the feeling is back   ✓ Check: is this love or fear of moving on?", meta:{intent:"come_back",version:2}, tags:["universal","intent:come_back"], sortOrder:1422 },
  // should_text
  { type:"oracle_response", body:"Insight\n\"If they haven't replied, more messages won't get you the answer you want. One honest message is all you get — anything after that is chasing, not communicating.\"\n\nWhat to do\n✓ Send one real message if you haven't   ✓ After that, give it actual space   ✓ The silence is already information — stop looking for a different answer in it", meta:{intent:"should_text",version:2}, tags:["universal","intent:should_text"], sortOrder:1430 },
  { type:"oracle_response", body:"Insight\n\"The right message doesn't need to be calculated. If you're still working out what to say, you're not ready to send it. When you know the real thing, you'll just know.\"\n\nWhat to do\n✓ Write the honest version, not the safe one   ✓ Say exactly what you mean — no subtext   ✓ Send it once and let it land", meta:{intent:"should_text",version:2}, tags:["universal","intent:should_text"], sortOrder:1431 },
  { type:"oracle_response", body:"Insight\n\"You're asking whether to text because you're hoping the answer is yes. If you reach out, say the actual thing — not something designed to get a reaction.\"\n\nWhat to do\n✓ Don't send 'hey' — say the real thing   ✓ Reach out once, then give genuine space   ✓ Their response (or silence) tells you what you need to know", meta:{intent:"should_text",version:2}, tags:["universal","intent:should_text"], sortOrder:1432 },
  { type:"oracle_response", body:"Insight\n\"{{p}}'s pattern means they respond to directness, not hints. If you're going to reach out, be clear. Calculated messages get calculated responses.\"\n\nWhat to do\n✓ Be direct — say what you actually want to say   ✓ Don't test them — it won't give you real information   ✓ Decide in advance how you'll handle no reply", meta:{intent:"should_text",version:2}, tags:["universal","intent:should_text"], sortOrder:1433 },
  // why_left
  { type:"oracle_response", body:"Insight\n\"It's rarely one thing. A {{pMoon}} emotional style pulls back before the visible signs — the withdrawal started earlier than you think. It's not a verdict on your worth.\"\n\nWhat to do\n✓ Stop replaying it for a new answer   ✓ Notice what this clarified about what you need   ✓ Don't reach out for closure — write it yourself", meta:{intent:"why_left",version:2}, tags:["universal","intent:why_left"], sortOrder:1440 },
  { type:"oracle_response", body:"Insight\n\"When someone leaves, the most useful question is: what did this clarify about what you actually need? That answer matters more than the reason they gave.\"\n\nWhat to do\n✓ Write down what you needed that wasn't there   ✓ Stop replaying — you have enough data   ✓ Let the clarity from this shape what you ask for next", meta:{intent:"why_left",version:2}, tags:["universal","intent:why_left"], sortOrder:1441 },
  { type:"oracle_response", body:"Insight\n\"The departure happened at the surface. What drove it was a pattern running underneath that neither person named. Unnamed things express themselves as distance.\"\n\nWhat to do\n✓ Don't look for the moment you missed — it was a pattern, not a moment   ✓ Trust your instincts about what felt off   ✓ Use what you learned to ask differently next time", meta:{intent:"why_left",version:2}, tags:["universal","intent:why_left"], sortOrder:1442 },
  // why_fight
  { type:"oracle_response", body:"Insight\n\"You process emotion through {{uMoonStyle}}. {{p}} processes through {{pMoonStyle}}. When those clash under stress, you're both speaking different languages at the same volume. The fight is usually not about the fight.\"\n\nWhat to do\n✓ Name what's underneath — once, calmly, not mid-fight   ✓ Ask: what's the one thing we never actually say?   ✓ Pick a pause signal for when it escalates", meta:{intent:"why_fight",version:2}, tags:["universal","intent:why_fight"], sortOrder:1450 },
  { type:"oracle_response", body:"Insight\n\"The recurring argument has a recurring real subject. What's the one thing neither of you has said directly? That's what the fights are actually about.\"\n\nWhat to do\n✓ Find the pattern — what always comes up?   ✓ Say the real thing outside of a fight   ✓ Ask yourself: am I fighting to win or to be understood?", meta:{intent:"why_fight",version:2}, tags:["universal","intent:why_fight"], sortOrder:1451 },
  // compatible
  { type:"oracle_response", body:"Insight\n\"Your compatibility: {{gunaVerdict}}. Genuine material is there. Compatible doesn't mean easy — it means worth the work when both people are doing it.\"\n\nWhat to do\n✓ Build from your strength: {{strongKootaText}}   ✓ Pay attention to your friction area   ✓ Ask: are we both actually choosing this?", meta:{intent:"compatible",version:2}, tags:["universal","intent:compatible"], sortOrder:1460 },
  { type:"oracle_response", body:"Insight\n\"Compatible means built for something real together — if both people understand the shape of what they have. You have a real foundation. The question is what you're building on it.\"\n\nWhat to do\n✓ Stop asking if you're compatible and start asking if you're both choosing this   ✓ Name one thing each of you needs to work on   ✓ Compatibility is potential — relationship is choice", meta:{intent:"compatible",version:2}, tags:["universal","intent:compatible"], sortOrder:1461 },
  // move_on
  { type:"oracle_response", body:"Insight\n\"You don't move on by deciding to. You move forward by building enough in the present that the past stops being the loudest thing.\"\n\nWhat to do\n✓ Unfollow or mute — not drama, just hygiene   ✓ Stop measuring progress by whether you've stopped feeling   ✓ Find one thing you're actively building right now", meta:{intent:"move_on",version:2}, tags:["universal","intent:move_on"], sortOrder:1470 },
  { type:"oracle_response", body:"Insight\n\"Moving on doesn't mean not feeling it. It means the feeling stops running your decisions. You can miss someone and still choose not to go back.\"\n\nWhat to do\n✓ Give yourself a timeline — not to stop feeling, to stop acting from it   ✓ Delete the thread if you keep re-reading it   ✓ Do one new thing this week that has nothing to do with them", meta:{intent:"move_on",version:2}, tags:["universal","intent:move_on"], sortOrder:1471 },
  // future
  { type:"oracle_response", body:"Insight\n\"The future is built in small moments — how you both show up when it's inconvenient. Signs and timing don't decide it. Choices do.\"\n\nWhat to do\n✓ Be specific about what you need from {{p}}   ✓ Watch what they're actually doing, not what they're saying   ✓ Build something for yourself either way", meta:{intent:"future",version:2}, tags:["universal","intent:future"], sortOrder:1480 },
  { type:"oracle_response", body:"Insight\n\"The future of this isn't written. It's decided. The most important variable is whether you're both honest about what you want — not aspirationally, practically.\"\n\nWhat to do\n✓ Name what you actually need   ✓ Have the conversation you've been building toward   ✓ Accept the answer you get, not the one you want", meta:{intent:"future",version:2}, tags:["universal","intent:future"], sortOrder:1481 },
  // addicted
  { type:"oracle_response", body:"Insight\n\"The intensity is real. But the pull isn't always toward the person — it's toward the feeling they gave you: being chosen, certainty, intensity. Those are different things.\"\n\nWhat to do\n✓ Name the specific feeling you miss   ✓ Reduce exposure — checking their profile restarts the loop   ✓ Direct that energy toward something that can actually give back", meta:{intent:"addicted",version:2}, tags:["universal","intent:addicted"], sortOrder:1490 },
  { type:"oracle_response", body:"Insight\n\"The pull is mostly a loop, not a fact. Each time you check on them or replay the connection, you restart the attachment response. The loop breaks when you stop feeding it.\"\n\nWhat to do\n✓ Identify every behavior that keeps the loop going   ✓ Stop those behaviors for 7 days   ✓ Notice how the intensity shifts", meta:{intent:"addicted",version:2}, tags:["universal","intent:addicted"], sortOrder:1491 },
  // confused
  { type:"oracle_response", body:"Insight\n\"Mixed signals from {{p}} usually mean they're mixed internally — they want you and aren't ready at the same time. The confusion is theirs, not a failure of your perception.\"\n\nWhat to do\n✓ Ask the direct question — once   ✓ Give them time to answer honestly   ✓ If there's still no clarity, that ambiguity is its own answer", meta:{intent:"confused",version:2}, tags:["universal","intent:confused"], sortOrder:1500 },
  { type:"oracle_response", body:"Insight\n\"You already know something is off. Your gut registered it before your mind started explaining it away. What did you notice before the second-guessing started?\"\n\nWhat to do\n✓ Trust your first read   ✓ Stop analyzing — more analysis won't give you clarity   ✓ Ask directly, then leave space for a real answer", meta:{intent:"confused",version:2}, tags:["universal","intent:confused"], sortOrder:1501 },
  // red_flag
  { type:"oracle_response", body:"Insight\n\"Your instincts are data. A {{uMoon}} emotional style reads safety accurately — when something feels off, it usually is. The question is whether you're willing to act on what you're already seeing.\"\n\nWhat to do\n✓ Write down the specific things you've noticed   ✓ Ask: what would you tell a close friend in this exact situation?   ✓ Don't wait for a bigger sign", meta:{intent:"red_flag",version:2}, tags:["universal","intent:red_flag"], sortOrder:1510 },
  { type:"oracle_response", body:"Insight\n\"The red flag is rarely in the dramatic moments. It's in the pattern of small things you've explained away — each one individually reasonable, together forming a clear picture.\"\n\nWhat to do\n✓ List what you've explained away   ✓ Look at the pattern, not each incident in isolation   ✓ Trust what the pattern says", meta:{intent:"red_flag",version:2}, tags:["universal","intent:red_flag"], sortOrder:1511 },
  // timing
  { type:"oracle_response", body:"Insight\n\"Timing questions are usually readiness questions. The calendar isn't the variable — your readiness and theirs are. Be honest about which one you're actually asking about.\"\n\nWhat to do\n✓ Be honest about your own readiness first   ✓ 'Too late' is rarely actually too late — 'too soon' means there's work left   ✓ Stop waiting for perfect conditions", meta:{intent:"timing",version:2}, tags:["universal","intent:timing"], sortOrder:1520 },
  { type:"oracle_response", body:"Insight\n\"The right moment doesn't usually announce itself. You sense it from your own readiness — not the circumstances. If you're waiting for everything to be perfect, the wait could be forever.\"\n\nWhat to do\n✓ Ask: what am I actually waiting for?   ✓ Name it specifically   ✓ Move when you're ready, not when everything is ideal", meta:{intent:"timing",version:2}, tags:["universal","intent:timing"], sortOrder:1521 },
  // general
  { type:"oracle_response", body:"Insight\n\"Your love style is {{lagnaLoveStyle}}. That's both your strength and your blindspot right now. The gift: {{lagunaNeed}}. The thing to watch: {{lagnaBlindspot}}.\"\n\nWhat to do\n✓ Say the thing you've been building toward   ✓ Watch {{p}}'s actions, not their words   ✓ Trust what you noticed before you talked yourself out of it", meta:{intent:"general",version:2}, tags:["universal","intent:general"], sortOrder:1530 },
  { type:"oracle_response", body:"Insight\n\"You already sense what's true here — before the analysis, before the second-guessing. What did your gut say first? That first read is almost always the most accurate thing you have.\"\n\nWhat to do\n✓ Go back to your first instinct   ✓ Stop looking for more information — you have enough   ✓ Ask {{p}} the thing you've been not asking", meta:{intent:"general",version:2}, tags:["universal","intent:general"], sortOrder:1531 },
  { type:"oracle_response", body:"Insight\n\"Something real exists between you and {{p}} — {{gunaVerdict}}. And something about it isn't fully resolved. The resolution doesn't come from waiting or analyzing — it comes from asking the question directly.\"\n\nWhat to do\n✓ Name what's unresolved   ✓ Have the direct conversation   ✓ Accept whatever answer you get honestly", meta:{intent:"general",version:2}, tags:["universal","intent:general"], sortOrder:1532 },
];

// ─── Moon Profiles (12 signs) ─────────────────────────────────────────────────
// type: moon_profile | meta.moonRashiIdx (0-11) | meta.moonName, meta.element

const moonProfiles: ContentSeed[] = [
  { type:"moon_profile", title:"Aries Moon", body:"You move fast because you feel deeply. But you often decide someone is the one before you've seen them when things go wrong.", meta:{moonRashiIdx:0,moonName:"Aries",element:"Fire",need:"to be chased back",emotion:"acts first, feels later",give:"passion and urgency",needsToHear:"Your intensity is not the problem. The wrong person made it a problem.",coreWound:"They loved someone who never matched their energy and concluded it was their fault for being too much.",fear:"Being ignored. Not the relationship ending — being treated like they don't matter while it's still alive.",blindspot:"They chase people who are unavailable and call it passion. They mistake anxiety for attraction.",solution:"Watch how they behave in the first disagreement. That moment tells you more than six months of good times.",insecurityHook:"You keep asking if you were too much — but the real question is whether they were enough."}, tags:["universal","moon:Aries","element:Fire","moon_rashi:0"], sortOrder:1600 },
  { type:"moon_profile", title:"Taurus Moon", body:"You don't leave when you should because leaving means admitting the investment was wrong. Sunk cost is your blind spot.", meta:{moonRashiIdx:1,moonName:"Taurus",element:"Earth",need:"physical consistency",emotion:"holds, waits, endures",give:"loyalty and stability",needsToHear:"Loyalty is a gift. But giving it to someone who hasn't earned it isn't love — it's hope.",coreWound:"They stayed loyal to someone who used their stability as a safety net while keeping options open.",fear:"Being replaced quietly. Not a dramatic ending — just being slowly phased out.",blindspot:"They confuse comfort for compatibility. If it feels safe and familiar, they stay longer than they should.",solution:"Ask yourself: if you'd just met this person today, would you choose them?",insecurityHook:"You've been so consistent for them. The question you won't ask is: have they been consistent for you?"}, tags:["universal","moon:Taurus","element:Earth","moon_rashi:1"], sortOrder:1601 },
  { type:"moon_profile", title:"Gemini Moon", body:"You talk about your feelings so fluently that people assume you've processed them. You often haven't.", meta:{moonRashiIdx:2,moonName:"Gemini",element:"Air",need:"to be mentally matched",emotion:"analyses before feeling",give:"conversation and mental stimulation",needsToHear:"You're not too complicated. You just haven't found someone with the patience to read you properly yet.",coreWound:"They were misunderstood by someone they thought really got them — and they haven't fully trusted anyone since.",fear:"Being known and then found boring. Or worse: found too complicated.",blindspot:"They use analysis to avoid feeling. When something hurts, they intellectualise it.",solution:"Sit with the feeling before you explain it. The explanation is defence. The feeling is the truth.",insecurityHook:"You keep wondering if they're losing interest — but ask yourself if you've let them actually see you yet."}, tags:["universal","moon:Gemini","element:Air","moon_rashi:2"], sortOrder:1602 },
  { type:"moon_profile", title:"Cancer Moon", body:"You became the caretaker because it felt safer than being taken care of. Vulnerability goes both directions.", meta:{moonRashiIdx:3,moonName:"Cancer",element:"Water",need:"emotional safety and reciprocity",emotion:"absorbs and then retreats",give:"nurturing and full emotional presence",needsToHear:"You are not responsible for regulating other people's emotions. That was never the agreement.",coreWound:"They gave someone their full emotional world and that person didn't protect it.",fear:"Being emotionally naked and then left. Having someone see all of them and then choose to go.",blindspot:"They absorb other people's emotions as their own and can't tell where they end.",solution:"Let someone take care of you once, even when it's uncomfortable. Their response is the real data.",insecurityHook:"You've been so available for them. The question you're afraid to ask is: would they do the same for you?"}, tags:["universal","moon:Cancer","element:Water","moon_rashi:3"], sortOrder:1603 },
  { type:"moon_profile", title:"Leo Moon", body:"The attention you seek from them is really the acceptance you've been trying to find for yourself.", meta:{moonRashiIdx:4,moonName:"Leo",element:"Fire",need:"to be chosen publicly and enthusiastically",emotion:"performs strength even when struggling",give:"warmth, generosity, and celebration",needsToHear:"You don't have to be performing to deserve love. You were enough before you became impressive.",coreWound:"They loved someone who took their warmth and generosity — and still looked elsewhere.",fear:"Being ordinary in someone's eyes. Being loved, but not being the person they're proudest of.",blindspot:"They perform strength so well that people don't know when they're actually struggling.",solution:"Ask: does this person see me when I'm not my best self? That's the only version of being seen that matters.",insecurityHook:"You've been so generous with them. The question you avoid is: do they actually see you, or just what you give?"}, tags:["universal","moon:Leo","element:Fire","moon_rashi:4"], sortOrder:1604 },
  { type:"moon_profile", title:"Virgo Moon", body:"You see their flaws clearly but stay. The question isn't whether you can improve this — it's whether you should.", meta:{moonRashiIdx:5,moonName:"Virgo",element:"Earth",need:"consistency and honest communication",emotion:"catalogues problems as love",give:"acts of service and precise care",needsToHear:"You are not a rough draft. You don't have to earn love by being better.",coreWound:"They gave everything perfectly and it still wasn't enough. So now they give more perfectly.",fear:"Being loved imperfectly. Accepting love that has flaws in it.",blindspot:"They use criticism of the relationship as a way to not feel how much they actually care.",solution:"Write down the three things you're trying to fix about this connection. Then ask: is any of this actually fixable?",insecurityHook:"You've been trying to get this right for so long. But what if the problem isn't your effort — it's the math?"}, tags:["universal","moon:Virgo","element:Earth","moon_rashi:5"], sortOrder:1605 },
  { type:"moon_profile", title:"Libra Moon", body:"The harmony you create often has nothing under it. You've been maintaining a surface while your actual needs go unmet.", meta:{moonRashiIdx:6,moonName:"Libra",element:"Air",need:"harmony and partnership",emotion:"shape-shifts to avoid conflict",give:"balance and beautiful presence",needsToHear:"You are allowed to want what you want. Having preferences is not the same as being difficult.",coreWound:"They kept the peace so well that they lost themselves entirely in the process.",fear:"Being responsible for the end. Walking away and having it be their fault.",blindspot:"They see both sides so clearly they can't decide which side they're actually on.",solution:"Say one thing you actually want this week without softening it. Watch what happens.",insecurityHook:"You've been so understanding of everyone else. Has anyone been that understanding of you?"}, tags:["universal","moon:Libra","element:Air","moon_rashi:6"], sortOrder:1606 },
  { type:"moon_profile", title:"Scorpio Moon", body:"You protect yourself so well that sometimes the person you're protecting yourself from is the one who would have stayed.", meta:{moonRashiIdx:7,moonName:"Scorpio",element:"Water",need:"total trust and depth",emotion:"tests before trusting",give:"complete loyalty when trust is earned",needsToHear:"You are not too intense. You are calibrated for depth. Most people just aren't built for it.",coreWound:"They trusted someone completely and that person used what they'd shared against them.",fear:"Betrayal from inside the relationship. From the one person they'd lowered their defences for.",blindspot:"They can see through everyone else's patterns but are often the last to see what's happening to them.",solution:"Show them one thing you haven't shown anyone else. Their response is the only data that matters.",insecurityHook:"You keep wondering if they'd stay if they really knew you. But have you let them close enough to try?"}, tags:["universal","moon:Scorpio","element:Water","moon_rashi:7"], sortOrder:1607 },
  { type:"moon_profile", title:"Sagittarius Moon", body:"The next connection you leave because it 'felt limiting' — ask whether the limiting was real or whether you were just afraid.", meta:{moonRashiIdx:8,moonName:"Sagittarius",element:"Fire",need:"freedom within commitment",emotion:"romanticises then disappears",give:"expansion, inspiration, and honesty",needsToHear:"Depth doesn't have to mean trapped. You can build something lasting and still be free inside it.",coreWound:"They loved someone who made them feel small for wanting more — more space, more meaning, more honesty.",fear:"Losing themselves in someone else. Becoming the version of themselves that stopped growing.",blindspot:"They confuse physical or emotional distance with personal freedom. They leave before things get hard.",solution:"Stay through one uncomfortable moment you'd normally escape from. That's where the real version of this exists.",insecurityHook:"You keep leaving before things get hard. What if the thing you're running from is actually the thing?"}, tags:["universal","moon:Sagittarius","element:Fire","moon_rashi:8"], sortOrder:1608 },
  { type:"moon_profile", title:"Capricorn Moon", body:"Staying is not the same as choosing. You deserve to be wanted for reasons that have nothing to do with what you provide.", meta:{moonRashiIdx:9,moonName:"Capricorn",element:"Earth",need:"earned security and demonstrated respect",emotion:"shows love through acts, not words",give:"reliability, commitment, and steady presence",needsToHear:"You don't have to earn love by being useful. You deserve to be wanted for reasons beyond what you provide.",coreWound:"They gave everything to something that was never going to work and refused to admit it.",fear:"Failure. Investing completely in something and having to admit it was the wrong investment.",blindspot:"They mistake endurance for love. Staying is not the same as choosing.",solution:"Say the one thing you've been calculating whether to say. The calculation is the problem. Just say it.",insecurityHook:"You've built so much with them. But building together is not the same as being built for each other."}, tags:["universal","moon:Capricorn","element:Earth","moon_rashi:9"], sortOrder:1609 },
  { type:"moon_profile", title:"Aquarius Moon", body:"You've made emotional unavailability into a philosophy. But what you're really doing is protecting yourself from something that already hurt.", meta:{moonRashiIdx:10,moonName:"Aquarius",element:"Air",need:"to be seen as genuinely unique",emotion:"detached on surface, intense underneath",give:"unconventional love and intellectual depth",needsToHear:"Being different is not the same as being difficult. The right person will not need you to be less.",coreWound:"They were misunderstood by nearly everyone who mattered and started to believe being known was impossible.",fear:"Being with someone who doesn't actually see them — just a curated version they allowed forward.",blindspot:"They intellectualise emotion so fluently that they argue themselves out of feelings that are valid.",solution:"Once this week, respond from feeling before you respond from analysis. Even if it's awkward.",insecurityHook:"You keep watching from the outside wondering if they really want you. What would happen if you stepped inside and asked?"}, tags:["universal","moon:Aquarius","element:Air","moon_rashi:10"], sortOrder:1610 },
  { type:"moon_profile", title:"Pisces Moon", body:"The love you feel for them is real. The version of them you're in love with might not be.", meta:{moonRashiIdx:11,moonName:"Pisces",element:"Water",need:"spiritual and emotional merger",emotion:"merges completely, loses self",give:"unconditional empathy and profound depth",needsToHear:"The love you feel for them is real. The version of them you're in love with might not be.",coreWound:"They loved someone so completely that they disappeared into them. When it ended, they didn't know who they were.",fear:"Being alone with themselves after a connection ends. The silence is too loud.",blindspot:"They romanticise people so thoroughly that they fall in love with who someone could be rather than who they are.",solution:"Write down who they actually are — not who you hope they are, but the pattern of behaviour over time. Read it back.",insecurityHook:"You feel things others can't even articulate. The tragedy would be spending that depth on someone who can't receive it."}, tags:["universal","moon:Pisces","element:Water","moon_rashi:11"], sortOrder:1611 },
];

// ─── Nakshatra Profiles (27 nakshatras) ───────────────────────────────────────
// type: nakshatra_profile | meta.nakshatraIdx (0-26)

const nakshatraProfiles: ContentSeed[] = [
  { type:"nakshatra_profile", title:"Ashwini", body:"falls fast, heals fast, repeats the cycle", meta:{nakshatraIdx:0,pattern:"falls fast, heals fast, repeats the cycle",craving:"someone who can match their speed without flinching",trap:"choosing excitement over stability every time",strength:"the ability to begin again without carrying the weight of what ended",shadow:"they leave before they can be left"}, tags:["universal","nakshatra:Ashwini","nakshatra_idx:0"], sortOrder:1700 },
  { type:"nakshatra_profile", title:"Bharani", body:"bonds once and carries it forever, even when they pretend not to", meta:{nakshatraIdx:1,pattern:"bonds once and carries it forever",craving:"to be loved the way they love — completely, even past reason",trap:"loyalty to people who have already checked out",strength:"a depth of devotion that most people only read about",shadow:"they grieve connections they'd never go back to"}, tags:["universal","nakshatra:Bharani","nakshatra_idx:1"], sortOrder:1701 },
  { type:"nakshatra_profile", title:"Krittika", body:"burns through connections that don't challenge them", meta:{nakshatraIdx:2,pattern:"burns through connections that don't challenge them",craving:"transformation — to be changed by someone",trap:"confusing destruction with depth",strength:"passion that genuinely reshapes what it touches",shadow:"they create conflict to feel alive in the relationship"}, tags:["universal","nakshatra:Krittika","nakshatra_idx:2"], sortOrder:1702 },
  { type:"nakshatra_profile", title:"Rohini", body:"roots quietly and deeply, rarely shows how attached they've become", meta:{nakshatraIdx:3,pattern:"roots quietly and deeply",craving:"safety and constancy — someone whose presence feels like ground",trap:"staying in stable but loveless situations because leaving feels like uprooting",strength:"the ability to build something lasting if the foundation is right",shadow:"they settle for security and call it love"}, tags:["universal","nakshatra:Rohini","nakshatra_idx:3"], sortOrder:1703 },
  { type:"nakshatra_profile", title:"Mrigashira", body:"pursues beauty in all its forms and loves whoever represents it at the time", meta:{nakshatraIdx:4,pattern:"pursues beauty in all its forms",craving:"sensory and emotional richness in one person",trap:"falling in love with aesthetics and confusing them for substance",strength:"they bring beauty into every connection they enter",shadow:"they confuse how someone makes them feel for who that someone is"}, tags:["universal","nakshatra:Mrigashira","nakshatra_idx:4"], sortOrder:1704 },
  { type:"nakshatra_profile", title:"Ardra", body:"storms into people's lives and exits the same way", meta:{nakshatraIdx:5,pattern:"storms into people's lives and exits the same way",craving:"someone who understands pain intuitively without needing to be explained to",trap:"forming trauma bonds and calling them destiny",strength:"emotional honesty that strips everything to its truth",shadow:"they seek partners who carry similar wounds and wonder why it hurts"}, tags:["universal","nakshatra:Ardra","nakshatra_idx:5"], sortOrder:1705 },
  { type:"nakshatra_profile", title:"Punarvasu", body:"returns. always returns to what feels like home", meta:{nakshatraIdx:6,pattern:"returns. always returns to what feels like home",craving:"the feeling of being safe with someone who is also an adventure",trap:"returning to connections long after the returning makes sense",strength:"resilience — their love survives things that would end others",shadow:"they call going back 'knowing what they want'"}, tags:["universal","nakshatra:Punarvasu","nakshatra_idx:6"], sortOrder:1706 },
  { type:"nakshatra_profile", title:"Pushya", body:"nurtures so relentlessly that they forget to have needs of their own", meta:{nakshatraIdx:7,pattern:"nurtures so relentlessly they forget their own needs",craving:"someone who sees through their caretaking and takes care of them back",trap:"giving so much there's nothing left to receive",strength:"they create the conditions for real intimacy",shadow:"they're so focused on the other person that they lose themselves quietly"}, tags:["universal","nakshatra:Pushya","nakshatra_idx:7"], sortOrder:1707 },
  { type:"nakshatra_profile", title:"Ashlesha", body:"reads between every line, picks up everything unsaid, and says nothing", meta:{nakshatraIdx:8,pattern:"reads between every line, says nothing",craving:"someone they can lower their defences for completely",trap:"their perception creates suspicion — they see too much and trust too little",strength:"they know what's really happening before it surfaces",shadow:"their insight keeps them from being surprised and also from being open"}, tags:["universal","nakshatra:Ashlesha","nakshatra_idx:8"], sortOrder:1708 },
  { type:"nakshatra_profile", title:"Magha", body:"carries past wounds into every new connection and calls it pattern recognition", meta:{nakshatraIdx:9,pattern:"carries past wounds into every new connection",craving:"to be chosen after earning it — to have someone stay knowing everything",trap:"their dignity becomes distance",strength:"they love with discipline and intentionality — when they choose you, they mean it",shadow:"they withhold love as a form of protection"}, tags:["universal","nakshatra:Magha","nakshatra_idx:9"], sortOrder:1709 },
  { type:"nakshatra_profile", title:"Purva Phalguni", body:"loves in waves — present, then absent, present, then absent", meta:{nakshatraIdx:10,pattern:"loves in waves — present, then absent",craving:"a love that makes sense, that has logic under the feeling",trap:"they leave when the feeling outpaces the logic",strength:"precision — they don't love carelessly, which means it means something when they do",shadow:"they use analysis to avoid the feeling they're actually in"}, tags:["universal","nakshatra:Purva Phalguni","nakshatra_idx:10"], sortOrder:1710 },
  { type:"nakshatra_profile", title:"Uttara Phalguni", body:"holds everyone they love in extraordinary tenderness, even people who have hurt them", meta:{nakshatraIdx:11,pattern:"holds everyone in extraordinary tenderness",craving:"a love that is also a spiritual practice",trap:"confusing devotion with sacrifice",strength:"they transform whatever they touch with genuine care",shadow:"they are better at giving love than asking for it to be right"}, tags:["universal","nakshatra:Uttara Phalguni","nakshatra_idx:11"], sortOrder:1711 },
  { type:"nakshatra_profile", title:"Hasta", body:"organises their entire emotional life around the relationship — for better or worse", meta:{nakshatraIdx:12,pattern:"organises their entire emotional life around the relationship",craving:"partnership in the real sense: someone to build a life with",trap:"making someone their entire world and then wondering why the world feels unstable",strength:"they are fully present — no half-measures, no hedging",shadow:"they manage their fear of abandonment through control"}, tags:["universal","nakshatra:Hasta","nakshatra_idx:12"], sortOrder:1712 },
  { type:"nakshatra_profile", title:"Chitra", body:"builds toward perfection or walks away — no middle state", meta:{nakshatraIdx:13,pattern:"builds toward perfection or walks away",craving:"someone who matches their standards without being told what those standards are",trap:"the standard becomes a wall that no one can get over",strength:"they create extraordinary things with the right person",shadow:"they weaponise the standard to avoid vulnerability"}, tags:["universal","nakshatra:Chitra","nakshatra_idx:13"], sortOrder:1713 },
  { type:"nakshatra_profile", title:"Swati", body:"moves through the world and its people like wind — touching everything, held by nothing", meta:{nakshatraIdx:14,pattern:"moves through the world like wind — touching everything, held by nothing",craving:"someone who gives them space and still stays",trap:"they create space until the space swallows the connection",strength:"they never cling — this is a gift and also a loss",shadow:"they call avoidance freedom"}, tags:["universal","nakshatra:Swati","nakshatra_idx:14"], sortOrder:1714 },
  { type:"nakshatra_profile", title:"Vishakha", body:"outlasts almost everyone — in love and in grieving", meta:{nakshatraIdx:15,pattern:"outlasts almost everyone — in love and in grieving",craving:"loyalty that matches theirs",trap:"they endure past the point of return and call it strength",strength:"commitment that doesn't waver",shadow:"they stay because leaving feels like defeat"}, tags:["universal","nakshatra:Vishakha","nakshatra_idx:15"], sortOrder:1715 },
  { type:"nakshatra_profile", title:"Anuradha", body:"loves devotionally, often past the point where devotion is returned", meta:{nakshatraIdx:16,pattern:"loves devotionally, often past the point where devotion is returned",craving:"reciprocity — to feel that their love is also someone else's religion",trap:"they give everything and are confused when it isn't everything in return",strength:"the depth of their love is rarely encountered",shadow:"devotion becomes martyrdom"}, tags:["universal","nakshatra:Anuradha","nakshatra_idx:16"], sortOrder:1716 },
  { type:"nakshatra_profile", title:"Jyeshtha", body:"protects their inner world intensely — loves the few they let in completely", meta:{nakshatraIdx:17,pattern:"protects their inner world intensely",craving:"to be seen without performing, to be known without explaining",trap:"they mistake distance for safety and wonder why they're lonely",strength:"when they trust, the trust is total and real",shadow:"they protect themselves from the very thing they're aching for"}, tags:["universal","nakshatra:Jyeshtha","nakshatra_idx:17"], sortOrder:1717 },
  { type:"nakshatra_profile", title:"Mula", body:"pulls everything apart to understand it and puts it back together changed", meta:{nakshatraIdx:18,pattern:"pulls everything apart to understand it",craving:"a love that can survive honesty, including the honest parts that hurt",trap:"they mistake intensity for truth and crisis for intimacy",strength:"radical honesty that creates real change",shadow:"they create the rupture they're afraid of"}, tags:["universal","nakshatra:Mula","nakshatra_idx:18"], sortOrder:1718 },
  { type:"nakshatra_profile", title:"Purva Ashadha", body:"seeks the horizon — in people as in everything", meta:{nakshatraIdx:19,pattern:"seeks the horizon — in people as in everything",craving:"expansion, discovery, a love that makes the world larger",trap:"adventure over depth — they move on before things get real",strength:"they bring freedom into connection",shadow:"they call running 'not being held back'"}, tags:["universal","nakshatra:Purva Ashadha","nakshatra_idx:19"], sortOrder:1719 },
  { type:"nakshatra_profile", title:"Uttara Ashadha", body:"sets impossible targets and meets most of them, including in love", meta:{nakshatraIdx:20,pattern:"sets impossible targets and meets most of them",craving:"a partner who is an equal in the truest sense",trap:"they schedule love and wonder why it feels efficient instead of alive",strength:"they build things that last",shadow:"they love with strategy because vulnerability feels like losing"}, tags:["universal","nakshatra:Uttara Ashadha","nakshatra_idx:20"], sortOrder:1720 },
  { type:"nakshatra_profile", title:"Shravana", body:"listens until they know exactly who you are, then keeps that knowledge close", meta:{nakshatraIdx:21,pattern:"listens until they know exactly who you are",craving:"to feel truly heard by someone who doesn't need them to be anything other than what they are",trap:"they give others full attention and wonder why no one gives them the same",strength:"profound emotional memory — they don't forget what matters",shadow:"they make others feel known without knowing themselves"}, tags:["universal","nakshatra:Shravana","nakshatra_idx:21"], sortOrder:1721 },
  { type:"nakshatra_profile", title:"Dhanishtha", body:"vibrates at a frequency most can't tune into — the rare one who can becomes everything", meta:{nakshatraIdx:22,pattern:"vibrates at a frequency most can't tune into",craving:"resonance — to feel genuinely understood at a level most connections don't reach",trap:"the standard of resonance is so high that most connections are dismissed before they've had a chance",strength:"when they bond, it's at a frequency that doesn't break easily",shadow:"they're lonely and call it being selective"}, tags:["universal","nakshatra:Dhanishtha","nakshatra_idx:22"], sortOrder:1722 },
  { type:"nakshatra_profile", title:"Shatabhisha", body:"cycles through attachment and detachment in patterns that seem random but aren't", meta:{nakshatraIdx:23,pattern:"cycles through attachment and detachment in patterns that seem random but aren't",craving:"freedom within commitment — the paradox of staying while not being held",trap:"they run from the closeness they seek",strength:"they can hold love lightly, which sometimes is what it needs",shadow:"inconsistency as self-protection"}, tags:["universal","nakshatra:Shatabhisha","nakshatra_idx:23"], sortOrder:1723 },
  { type:"nakshatra_profile", title:"Purva Bhadrapada", body:"loves unconventionally and refuses to do it any other way", meta:{nakshatraIdx:24,pattern:"loves unconventionally and refuses to do it any other way",craving:"someone who sees the world differently and wants to build something unique inside that shared vision",trap:"they choose people who are interesting over people who are right for them",strength:"they create extraordinary connections when they find someone who can match them",shadow:"they mistake unusual for compatible"}, tags:["universal","nakshatra:Purva Bhadrapada","nakshatra_idx:24"], sortOrder:1724 },
  { type:"nakshatra_profile", title:"Uttara Bhadrapada", body:"withdraws to process then returns changed — the cycle is their love language", meta:{nakshatraIdx:25,pattern:"withdraws to process then returns changed",craving:"a partner who can be with them in silence without reading it as rejection",trap:"they withdraw too long and the connection dies in the gap",strength:"their love deepens with time in ways that surprise even them",shadow:"they need solitude to love well and lose people who need presence"}, tags:["universal","nakshatra:Uttara Bhadrapada","nakshatra_idx:25"], sortOrder:1725 },
  { type:"nakshatra_profile", title:"Revati", body:"guides every person they love toward something — including themselves", meta:{nakshatraIdx:26,pattern:"guides every person they love toward something",craving:"a love that is also a destination, that leads somewhere real",trap:"they nurture others' growth while neglecting their own",strength:"they make people feel seen and pointed toward their best selves",shadow:"they love people for who they could be, not who they are"}, tags:["universal","nakshatra:Revati","nakshatra_idx:26"], sortOrder:1726 },
];

// ─── Dasha Chapters (9 lords) ─────────────────────────────────────────────────
// type: dasha_chapter | meta.dashaLord

const dashaChapters: ContentSeed[] = [
  { type:"dasha_chapter", title:"Surya Dasha", body:"A period of identity — who you are in love, not just whether you're loved.", meta:{dashaLord:"Surya",theme:"identity",headline:"A period of identity — who you are in love, not just whether you're loved.",challenge:"You may need to be right more than you need to be close. This breaks things.",gift:"Clarity about what you actually want — possibly for the first time.",warning:"Don't mistake the clarity for permission to be careless with someone who has been loyal.",lessonForLove:"A relationship that can't survive your full self was never going to survive anyway.",oracleContext:"in your Surya mahadasha, identity is the theme — who you are in love, not just whether you're loved"}, tags:["universal","dasha:Surya"], sortOrder:1800 },
  { type:"dasha_chapter", title:"Chandra Dasha", body:"A period of deep feeling — everything in love is amplified, including the fear.", meta:{dashaLord:"Chandra",theme:"emotion",headline:"A period of deep feeling — everything in love is amplified, including the fear.",challenge:"Emotional overwhelm creates reactions that look like overreaction but aren't.",gift:"Intuition about this connection is at its sharpest. What your gut says right now is worth listening to.",warning:"Don't make permanent decisions from temporary emotional flooding.",lessonForLove:"What you feel is real data, even when it's inconvenient.",oracleContext:"in your Chandra mahadasha, emotional truth is surfacing — the question is what to do with it"}, tags:["universal","dasha:Chandra"], sortOrder:1801 },
  { type:"dasha_chapter", title:"Mangal Dasha", body:"A period of action — what you've been sitting with needs to become a decision.", meta:{dashaLord:"Mangal",theme:"action",headline:"A period of action — what you've been sitting with needs to become a decision.",challenge:"Impatience creates friction. You want answers now. The other person may not be ready.",gift:"The courage to name what you actually want, out loud, directly.",warning:"Aggression isn't the same as honesty. Know the difference.",lessonForLove:"Saying the hard thing with care is the only kind of honesty that builds something.",oracleContext:"in your Mangal mahadasha, action is being called for — what you've been circling needs a direct response"}, tags:["universal","dasha:Mangal"], sortOrder:1802 },
  { type:"dasha_chapter", title:"Budh Dasha", body:"A period of discernment — you see the dynamic more clearly now. Trust that.", meta:{dashaLord:"Budh",theme:"discernment",headline:"A period of discernment — you see the dynamic more clearly now. Trust that.",challenge:"Overthinking becomes the primary way you avoid doing anything.",gift:"Ability to see the relationship as it actually is, not as you need it to be.",warning:"Analysis without action is just anxiety with better vocabulary.",lessonForLove:"Clarity is only useful if you act on it.",oracleContext:"in your Budh mahadasha, you can see this pattern clearly — the question is whether you'll act on what you see"}, tags:["universal","dasha:Budh"], sortOrder:1803 },
  { type:"dasha_chapter", title:"Brihaspati Dasha", body:"A period of expansion — this connection either grows with you or gets left behind.", meta:{dashaLord:"Brihaspati",theme:"expansion",headline:"A period of expansion — this connection either grows with you or gets left behind.",challenge:"Outgrowing someone you genuinely love. Having to choose between growth and loyalty.",gift:"Wisdom about what love should actually feel like, versus what you've been accepting.",warning:"Don't mistake restlessness for incompatibility. Sometimes you're growing, not leaving.",lessonForLove:"A love that doesn't expand you is contracting you.",oracleContext:"in your Brihaspati mahadasha, you're being asked to grow — and the relationship has to answer whether it's coming with you"}, tags:["universal","dasha:Brihaspati"], sortOrder:1804 },
  { type:"dasha_chapter", title:"Shukra Dasha", body:"A period of love — the most relationship-active of all dashas. What happens now tends to last.", meta:{dashaLord:"Shukra",theme:"love",headline:"A period of love — the most relationship-active of all dashas. What happens now tends to last.",challenge:"The desire to romanticise overrides the ability to see clearly.",gift:"This is the dasha built for love. What you build in it has foundation.",warning:"This period amplifies everything — including the wrong connections. Beauty is not the same as right.",lessonForLove:"The connection you're in during this dasha will teach you more about love than anything before.",oracleContext:"in your Shukra mahadasha, the universe is pointing you toward love — the question is whether you're choosing the right direction to look"}, tags:["universal","dasha:Shukra"], sortOrder:1805 },
  { type:"dasha_chapter", title:"Shani Dasha", body:"A period of structure — what's real survives. What isn't, won't.", meta:{dashaLord:"Shani",theme:"structure",headline:"A period of structure — what's real survives. What isn't, won't.",challenge:"Everything in love feels effortful. Distance can feel like loss when it's actually just pace.",gift:"What's still standing at the end of this period is the real thing.",warning:"Don't interpret the difficulty as incompatibility. This period tests — it doesn't condemn.",lessonForLove:"Easy isn't the standard. Solid is the standard.",oracleContext:"in your Shani mahadasha, love is being tested for what's real — what endures this period was always meant to"}, tags:["universal","dasha:Shani"], sortOrder:1806 },
  { type:"dasha_chapter", title:"Rahu Dasha", body:"A period of intensity — everything feels more charged and significant than usual.", meta:{dashaLord:"Rahu",theme:"obsession",headline:"A period of intensity — everything feels more charged and significant than usual.",challenge:"The addictive quality of connection in this period — whether it's healthy or not.",gift:"Breaking patterns that have followed you through multiple relationships.",warning:"Love that starts in this phase is often exactly what you needed to experience and exactly what you shouldn't stay in forever.",lessonForLove:"The most intense thing you've ever felt isn't always the most right.",oracleContext:"in your Rahu mahadasha, what you're feeling has a karmic charge — the question is whether the karma is being resolved or repeated"}, tags:["universal","dasha:Rahu"], sortOrder:1807 },
  { type:"dasha_chapter", title:"Ketu Dasha", body:"A period of release — something has to go. The question is whether you'll let it go willingly.", meta:{dashaLord:"Ketu",theme:"release",headline:"A period of release — something has to go. The question is whether you'll let it go willingly.",challenge:"The dissolution feels like failure. It isn't. It's refinement.",gift:"What you release in this period creates space for something finally aligned.",warning:"Don't hold on to what's leaving just because letting go feels like giving up.",lessonForLove:"Some connections are meant to teach you what you're not, so you can find what you are.",oracleContext:"in your Ketu mahadasha, release is the lesson — what's leaving was always meant to, even if it doesn't feel that way"}, tags:["universal","dasha:Ketu"], sortOrder:1808 },
];

// ─── Koota Narratives (8 kootas) ──────────────────────────────────────────────
// type: koota_narrative | meta.kootaName

const kootaNarratives: ContentSeed[] = [
  { type:"koota_narrative", title:"Varna", body:"Your default life priorities sit at different levels. One person always feels like the other doesn't take the important things seriously enough — or takes them too seriously.", meta:{kootaName:"Varna",label:"Varna — life priorities",weakText:"Your default life priorities sit at different levels. This shows up as one person always feeling like the other doesn't take the important things seriously enough.",strongText:"Your life priorities are aligned at a foundational level. You move in the same direction without having to negotiate it.",fix:"Explicitly agree on what matters most — not what should matter, but what actually does. The gap is usually about values that were never spoken."}, tags:["universal","koota:Varna"], sortOrder:1900 },
  { type:"koota_narrative", title:"Vashya", body:"Influence flows unevenly between you. One person consistently has more pull, and the other adjusts more. This creates invisible resentment on both sides.", meta:{kootaName:"Vashya",label:"Vashya — influence balance",weakText:"Influence flows unevenly between you. One person consistently has more pull, and the other adjusts more. This creates invisible resentment on both sides.",strongText:"The influence between you flows mutually. Neither person is consistently bending toward the other — the balance is felt even when it isn't named.",fix:"Name who adjusts more often. Not to blame — to make it visible so both people can choose it consciously."}, tags:["universal","koota:Vashya"], sortOrder:1901 },
  { type:"koota_narrative", title:"Tara", body:"Your emotional readiness tends to be out of sync. One of you is ready for what the other isn't — and it keeps switching.", meta:{kootaName:"Tara",label:"Tara — readiness timing",weakText:"Your emotional readiness tends to be out of sync. One of you is ready for what the other isn't — and it keeps switching. You arrive at the same place at different times.",strongText:"Your emotional readiness tends to align. When you're both ready for something, you tend to be ready at the same time. This is rarer than it sounds.",fix:"When the timing feels off, name it. 'I'm ready for this, are you?' The friction here is about readiness, not compatibility."}, tags:["universal","koota:Tara"], sortOrder:1902 },
  { type:"koota_narrative", title:"Yoni", body:"Your intimate compatibility requires more conscious effort. The natural frequency between you in close contact is slightly discordant — manageable but present.", meta:{kootaName:"Yoni",label:"Yoni — intimate compatibility",weakText:"Your intimate compatibility requires more conscious effort. The natural frequency between you in close contact is slightly discordant — manageable but present.",strongText:"Your intimate compatibility is built in. Physical and energetic closeness between you is natural, not constructed.",fix:"Build physical rituals that aren't goal-oriented. Proximity without agenda reduces the friction in this area."}, tags:["universal","koota:Yoni"], sortOrder:1903 },
  { type:"koota_narrative", title:"Graha Maitri", body:"Your mental styles don't naturally align. Mental understanding takes effort — you process information in ways that feel slightly foreign to each other.", meta:{kootaName:"Graha Maitri",label:"Graha Maitri — mental compatibility",weakText:"Your mental styles don't naturally align. This means mental understanding takes effort — you process information in ways that feel slightly foreign to each other.",strongText:"Your mental styles are naturally compatible. You understand each other's logic without needing to translate it.",fix:"When you feel misunderstood, slow down and describe how you reached the conclusion, not just what the conclusion is. The gap is in the process, not the intent."}, tags:["universal","koota:Graha_Maitri"], sortOrder:1904 },
  { type:"koota_narrative", title:"Gana", body:"Your fundamental temperaments are different. Under stress, you escalate in opposite directions — one withdraws, one pursues. Together, they create the push-pull.", meta:{kootaName:"Gana",label:"Gana — temperament",weakText:"Your fundamental temperaments are different. Under stress, you escalate in opposite directions — one withdraws, one pursues. Neither response is wrong. Together, they create the push-pull.",strongText:"Your temperaments match. You approach life's emotional challenges with the same basic instincts. This doesn't mean you never conflict — it means conflict feels navigable.",fix:"Agree in advance on a signal for 'I need space' that isn't the same as 'I'm pulling away.' The confusion between these is where Gana friction lives."}, tags:["universal","koota:Gana"], sortOrder:1905 },
  { type:"koota_narrative", title:"Bhakoot", body:"There's a structural push-pull in your connection. One person feels closer at exactly the moment the other needs space. This cycle doesn't have a clear cause — which makes it maddening.", meta:{kootaName:"Bhakoot",label:"Bhakoot — emotional current",weakText:"There's a structural push-pull in your connection. One person feels closer at exactly the moment the other needs space. This cycle doesn't have a clear cause — which makes it maddening.",strongText:"No push-pull friction. The emotional current between you flows without the structural pattern that creates the classic 'one step forward, two steps back' dynamic.",fix:"When the push-pull starts, name the pattern specifically: 'We're in the cycle again.' Naming it creates enough distance from the pattern to interrupt it."}, tags:["universal","koota:Bhakoot"], sortOrder:1906 },
  { type:"koota_narrative", title:"Nadi", body:"You share a similar emotional energy type, which creates strong resonance but also, over time, energy depletion. You may feel drained by each other in ways you can't explain.", meta:{kootaName:"Nadi",label:"Nadi — energy compatibility",weakText:"You share a similar emotional energy type, which creates strong resonance but also, over time, energy depletion. You may feel drained by each other in ways you can't explain.",strongText:"Your emotional energy types complement each other naturally — neither person is competing with the same frequency.",fix:"Build deliberate restoration time both together and separately. Couples with similar energy types need more solo recharge time than others."}, tags:["universal","koota:Nadi"], sortOrder:1907 },
];

// ─── Daily Focus Messages (30 entries) ────────────────────────────────────────
// Short daily grounding line shown below the quote card.

const dailyFocusMessages: ContentSeed[] = [
  { type:"daily_focus", body:"You haven't said what's true yet — that's where the real work is.", tags:["universal","rel_type:crush"], sortOrder:2000 },
  { type:"daily_focus", body:"The label question is less important than the pattern question.", tags:["universal","rel_type:situationship"], sortOrder:2001 },
  { type:"daily_focus", body:"The daily choice to stay present is the whole thing.", tags:["universal","rel_type:relationship"], sortOrder:2002 },
  { type:"daily_focus", body:"Healing doesn't require forgetting — it requires understanding.", tags:["universal","rel_type:ex"], sortOrder:2003 },
  { type:"daily_focus", body:"Say the thing you've been not saying. That's the only move left.", tags:["universal"], sortOrder:2004 },
  { type:"daily_focus", body:"Notice who shows up for you without being asked.", tags:["universal"], sortOrder:2005 },
  { type:"daily_focus", body:"Easy isn't the standard. Solid is the standard.", tags:["universal","dasha:Shani"], sortOrder:2006 },
  { type:"daily_focus", body:"What you feel is real data. Don't explain it away.", tags:["universal","dasha:Chandra"], sortOrder:2007 },
  { type:"daily_focus", body:"A love that doesn't expand you is quietly contracting you.", tags:["universal","dasha:Brihaspati"], sortOrder:2008 },
  { type:"daily_focus", body:"Clarity is only useful if you do something with it.", tags:["universal","dasha:Budh"], sortOrder:2009 },
  { type:"daily_focus", body:"The most intense feeling isn't always the most right one.", tags:["universal","dasha:Rahu"], sortOrder:2010 },
  { type:"daily_focus", body:"What you release right now creates space for something aligned.", tags:["universal","dasha:Ketu"], sortOrder:2011 },
  { type:"daily_focus", body:"Pay attention to how they treat you when it's inconvenient for them.", tags:["universal"], sortOrder:2012 },
  { type:"daily_focus", body:"Your needs matter. Say them out loud today.", tags:["universal","moon:Cancer","moon:Pisces","moon:Libra"], sortOrder:2013 },
  { type:"daily_focus", body:"If it's not a clear yes, it might be a soft no.", tags:["universal"], sortOrder:2014 },
  { type:"daily_focus", body:"You're allowed to outgrow the version of yourself that tolerated less.", tags:["universal"], sortOrder:2015 },
  { type:"daily_focus", body:"Protect your energy as fiercely as you protect your heart.", tags:["universal","moon:Scorpio","moon:Aquarius"], sortOrder:2016 },
  { type:"daily_focus", body:"Rest is not giving up. Rest is preparing.", tags:["universal","dasha:Shani"], sortOrder:2017 },
  { type:"daily_focus", body:"Ask yourself: is this anxiety, or is this clarity?", tags:["universal","moon:Gemini","moon:Virgo"], sortOrder:2018 },
  { type:"daily_focus", body:"The relationship you have with yourself sets the tone for every other one.", tags:["universal"], sortOrder:2019 },
  { type:"daily_focus", body:"Today, choose honesty over harmony. The harmony will come after.", tags:["universal","moon:Aries","element:Fire"], sortOrder:2020 },
  { type:"daily_focus", body:"Give someone the chance to show up for you instead of doing it all yourself.", tags:["universal","moon:Cancer","moon:Virgo"], sortOrder:2021 },
  { type:"daily_focus", body:"You deserve consistency, not just intensity.", tags:["universal","rel_type:situationship","rel_type:ex"], sortOrder:2022 },
  { type:"daily_focus", body:"Stop explaining yourself to people who aren't curious about you.", tags:["universal"], sortOrder:2023 },
  { type:"daily_focus", body:"What would love do here? Now do that.", tags:["universal","rel_type:relationship"], sortOrder:2024 },
  { type:"daily_focus", body:"Today's emotion is valid data. Don't dismiss it.", tags:["universal"], sortOrder:2025 },
  { type:"daily_focus", body:"The conversation you keep not having is costing more than having it would.", tags:["universal"], sortOrder:2026 },
  { type:"daily_focus", body:"Notice how you feel in the hour after you think about them. That residue is more honest than the thought.", tags:["universal","rel_type:ex","rel_type:situationship"], sortOrder:2027 },
  { type:"daily_focus", body:"Comparison is the thief of love.", tags:["universal"], sortOrder:2028 },
  { type:"daily_focus", body:"What you seek is also seeking you.", tags:["universal","dasha:Shukra"], sortOrder:2029 },
];

// ─── Energy Messages (20 entries) ─────────────────────────────────────────────
// The one-line message shown in the "Your energy today" card.

const energyMessages: ContentSeed[] = [
  { type:"energy_message", body:"Your {{um}} moon and their {{pm}} moon are in friction today. Pause before reacting — the tension is real but temporary.", meta:{condition:"high_tension"}, tags:["condition:high_tension","universal"], sortOrder:2100 },
  { type:"energy_message", body:"Something is running hot between you two today. If you have something to say, this energy will carry it well.", meta:{condition:"high_tension"}, tags:["condition:high_tension","universal"], sortOrder:2101 },
  { type:"energy_message", body:"The tension isn't the problem — the silence around it is. Say the thing before it calcifies.", meta:{condition:"high_tension"}, tags:["condition:high_tension","universal"], sortOrder:2102 },
  { type:"energy_message", body:"{{um}} and {{pm}} are in resonance today. Something wants to be felt or said — don't hold it back.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","universal"], sortOrder:2103 },
  { type:"energy_message", body:"The energy between you is soft and open today. Use that. Say the thing you usually talk yourself out of.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","universal"], sortOrder:2104 },
  { type:"energy_message", body:"Today has unusually good energy for honesty. The landing will be gentler than you expect.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","universal"], sortOrder:2105 },
  { type:"energy_message", body:"A quieter day in the energy between you — {{pm}} moon is processing inward. Give it space.", meta:{condition:"neutral"}, tags:["condition:neutral","universal"], sortOrder:2106 },
  { type:"energy_message", body:"Not every day is a breakthrough day. Today is a maintenance day — show up steadily.", meta:{condition:"neutral"}, tags:["condition:neutral","universal"], sortOrder:2107 },
  { type:"energy_message", body:"The connection is settling today. That's not a bad sign — it's a sign of something deepening.", meta:{condition:"neutral"}, tags:["condition:neutral","universal"], sortOrder:2108 },
  { type:"energy_message", body:"Your communication energy is high right now. An honest exchange now will carry further than you expect.", meta:{condition:"high_communication"}, tags:["condition:high_communication","universal"], sortOrder:2109 },
  { type:"energy_message", body:"Today is a good day to say the thing clearly. The reception is open.", meta:{condition:"high_communication"}, tags:["condition:high_communication","universal"], sortOrder:2110 },
  { type:"energy_message", body:"The energy is pulling both of you toward something real. Don't overthink it — just show up.", meta:{condition:"high_reconnection"}, tags:["condition:high_reconnection","universal"], sortOrder:2111 },
  { type:"energy_message", body:"Today is one of those days where reaching out wouldn't be wrong.", meta:{condition:"high_reconnection"}, tags:["condition:high_reconnection","rel_type:ex","rel_type:situationship"], sortOrder:2112 },
  { type:"energy_message", body:"The pull toward them is real today. The question is whether you act on what you know, or wait for more certainty.", meta:{condition:"high_reconnection"}, tags:["condition:high_reconnection","universal"], sortOrder:2113 },
  { type:"energy_message", body:"Today carries good emotional clarity. What you feel right now about this connection is probably accurate.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","dasha:Chandra"], sortOrder:2114 },
  { type:"energy_message", body:"The energy today supports action more than analysis. Move.", meta:{condition:"high_tension"}, tags:["condition:high_tension","dasha:Mangal"], sortOrder:2115 },
  { type:"energy_message", body:"Something is building between you — not tension, not ease, but something that needs a conversation to land.", meta:{condition:"neutral"}, tags:["condition:neutral","universal"], sortOrder:2116 },
  { type:"energy_message", body:"A grounding day. Nothing dramatic — just be present with them.", meta:{condition:"neutral"}, tags:["condition:neutral","element:Earth","element_combo:Earth_Earth"], sortOrder:2117 },
  { type:"energy_message", body:"The energy between you is magnetic today. Don't mistake intensity for urgency.", meta:{condition:"high_tension"}, tags:["condition:high_tension","dasha:Rahu","dosha:mangal"], sortOrder:2118 },
  { type:"energy_message", body:"Today is about building, not resolving. Add something instead of fixing something.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","rel_type:relationship"], sortOrder:2119 },
];

// ─── Compatibility Texts (7 sections × 3 variations) ─────────────────────────
// type: compatibility_text | meta.section must match the label in CompatibilitySection

const compatibilityTexts: ContentSeed[] = [
  // Emotional Chemistry
  { type:"compatibility_text", body:"Your {{uMoon}} and {{partnerName}}'s {{pMoon}} emotional styles have natural alignment — you understand each other's logic without needing to translate it. This is rare and worth protecting.", meta:{section:"Emotional Chemistry",scoreRange:"high"}, tags:["universal","guna:high","section:emotional_chemistry"], sortOrder:2200 },
  { type:"compatibility_text", body:"Your {{uMoon}} and {{pMoon}} emotional styles operate on different frequencies. You interpret the same silence very differently. The gap is workable — but it requires naming.", meta:{section:"Emotional Chemistry",scoreRange:"low"}, tags:["universal","guna:low","section:emotional_chemistry"], sortOrder:2201 },
  { type:"compatibility_text", body:"The chemistry is {{uElement}} meeting {{pElement}}. When aligned, you amplify each other. When not, you exhaust each other. The difference is mostly communication.", meta:{section:"Emotional Chemistry",scoreRange:"medium"}, tags:["universal","section:emotional_chemistry"], sortOrder:2202 },
  // Communication Energy
  { type:"compatibility_text", body:"Your emotional stress responses are naturally aligned — you tend to handle difficulty in ways that don't compound each other.", meta:{section:"Communication Energy",scoreRange:"high"}, tags:["universal","guna:high","section:communication_energy"], sortOrder:2210 },
  { type:"compatibility_text", body:"You approach life's challenges from fundamentally different emotional instincts. Under stress, one person moves toward connection, one pulls away. Without naming this, it becomes the unnamed thing that keeps coming up.", meta:{section:"Communication Energy",scoreRange:"low"}, tags:["universal","guna:low","section:communication_energy"], sortOrder:2211 },
  { type:"compatibility_text", body:"Your communication styles complement each other when things are good. Under pressure, the gap shows. Name it before the pressure does.", meta:{section:"Communication Energy",scoreRange:"medium"}, tags:["universal","section:communication_energy"], sortOrder:2212 },
  // Attachment Dynamics
  { type:"compatibility_text", body:"No push-pull structural pattern here. The emotional current between you flows without the classic 'one step forward, two steps back' dynamic.", meta:{section:"Attachment Dynamics",scoreRange:"high"}, tags:["universal","guna:high","section:attachment_dynamics"], sortOrder:2220 },
  { type:"compatibility_text", body:"There's a structural push-pull in your connection. One person feels closer at exactly the moment the other needs space. This cycle doesn't have a clear cause — which makes it maddening.", meta:{section:"Attachment Dynamics",scoreRange:"low"}, tags:["universal","guna:low","dosha:bhakoot","section:attachment_dynamics"], sortOrder:2221 },
  { type:"compatibility_text", body:"The attachment between you is real. What you're navigating is whose attachment style leads. Figure that out and the dynamic gets significantly easier.", meta:{section:"Attachment Dynamics",scoreRange:"medium"}, tags:["universal","section:attachment_dynamics"], sortOrder:2222 },
  // Emotional Tension
  { type:"compatibility_text", body:"No Nadi friction. Your emotional energy types complement each other naturally — neither person is competing with the same frequency.", meta:{section:"Emotional Tension",scoreRange:"high"}, tags:["universal","guna:high","section:emotional_tension"], sortOrder:2230 },
  { type:"compatibility_text", body:"You share a similar emotional energy type, which creates strong resonance but also, over time, energy depletion. You may feel drained by each other in ways you can't explain.", meta:{section:"Emotional Tension",scoreRange:"low"}, tags:["universal","dosha:nadi","section:emotional_tension"], sortOrder:2231 },
  { type:"compatibility_text", body:"The emotional tension between you is real but not permanent. It responds to pace — when you both slow down, it softens.", meta:{section:"Emotional Tension",scoreRange:"medium"}, tags:["universal","section:emotional_tension"], sortOrder:2232 },
  // Long-Term Potential
  { type:"compatibility_text", body:"At this level, your compatibility profile lands in genuinely strong territory. The foundation exists — what you build on it is the only question.", meta:{section:"Long-Term Potential",scoreRange:"high"}, tags:["universal","guna:high","section:long_term_potential"], sortOrder:2240 },
  { type:"compatibility_text", body:"The profile flags real friction in a few key areas. Not impossible — but requiring extraordinary self-awareness from both people. The potential is there if the work is too.", meta:{section:"Long-Term Potential",scoreRange:"low"}, tags:["universal","guna:low","section:long_term_potential"], sortOrder:2241 },
  { type:"compatibility_text", body:"This connection is workable. The friction area is not a stop sign — it's specifically where to invest attention. That investment is what determines the long-term.", meta:{section:"Long-Term Potential",scoreRange:"medium"}, tags:["universal","section:long_term_potential"], sortOrder:2242 },
  // Why This Feels Addictive
  { type:"compatibility_text", body:"The physical and emotional pull between you is built into how your personalities interact — it's not imagined, and it's not accidental.", meta:{section:"Why This Feels Addictive",scoreRange:"high"}, tags:["universal","guna:high","section:addictive"], sortOrder:2250 },
  { type:"compatibility_text", body:"The pull you feel is real — but it's worth understanding whether it's coming from genuine compatibility or from a pattern that predates this person.", meta:{section:"Why This Feels Addictive",scoreRange:"low"}, tags:["universal","guna:low","section:addictive"], sortOrder:2251 },
  { type:"compatibility_text", body:"There's chemistry here — real chemistry, not projection. The question is always what you do with it.", meta:{section:"Why This Feels Addictive",scoreRange:"medium"}, tags:["universal","section:addictive"], sortOrder:2252 },
  // Hidden Relationship Pattern
  { type:"compatibility_text", body:"The profile shows no major structural friction. The tension in this connection comes from individual patterns and wounds, not incompatibility — harder to see, and fully workable.", meta:{section:"Hidden Relationship Pattern",scoreRange:"high"}, tags:["universal","guna:high","section:hidden_pattern"], sortOrder:2260 },
  { type:"compatibility_text", body:"The hidden pattern: an underlying friction that surfaces as something else. It looks like a communication problem or a timing problem. It's actually a values difference that hasn't been named.", meta:{section:"Hidden Relationship Pattern",scoreRange:"low"}, tags:["universal","guna:low","section:hidden_pattern"], sortOrder:2261 },
  { type:"compatibility_text", body:"Every connection has a pattern running under it. Yours involves who adjusts and who receives. Right now one person is doing more adjusting than is sustainable.", meta:{section:"Hidden Relationship Pattern",scoreRange:"medium"}, tags:["universal","section:hidden_pattern"], sortOrder:2262 },
];

// ─── Hero Cards (key element combos) ─────────────────────────────────────────
// type: hero_card | meta.elementCombo, meta.relType, meta.headline, meta.action

const heroCards: ContentSeed[] = [
  // Fire + Water
  { type:"hero_card", body:"{{u}}, your {{um}} moon is direct and {{p}}'s {{pm}} moon is everything that's unsaid. The situationship exists in that gap — you can't read them clearly and they can't say things plainly. That's not bad energy, it's a {{pm}} moon protecting itself.", meta:{elementCombo:"Fire_Water",relType:"situationship",headline:"Today's read",moonTag:"Fire · Water",action:"Ask {{p}} one direct question and sit with their answer without pushing."}, tags:["universal","element_combo:Fire_Water","rel_type:situationship"], sortOrder:2300 },
  { type:"hero_card", body:"{{u}}, your {{um}} moon and {{p}}'s {{pm}} moon are opposites in the best and hardest way. You bring heat to their depth; they bring depth to your heat. When this is working, it's profound. When it's not, Fire feels extinguished and Water feels evaporated.", meta:{elementCombo:"Fire_Water",relType:"relationship",headline:"Today's read",moonTag:"Fire · Water",action:"Tell {{p}} one thing you genuinely admire about how they feel things."}, tags:["universal","element_combo:Fire_Water","rel_type:relationship"], sortOrder:2301 },
  { type:"hero_card", body:"{{u}}, your {{um}} moon is drawn to {{p}}'s {{pm}} moon because Water offers emotional depth that Fire craves but struggles to create alone. This is real mutual attraction.", meta:{elementCombo:"Fire_Water",relType:"crush",headline:"Today's read",moonTag:"Fire · Water",action:"Let your interest be visible to {{p}} today. Drop the ambiguity."}, tags:["universal","element_combo:Fire_Water","rel_type:crush"], sortOrder:2302 },
  { type:"hero_card", body:"{{u}}, Fire and Water endings are rarely clean. {{p}}'s {{pm}} moon felt everything and showed very little. Your {{um}} moon ran hot in the relationship and still does.", meta:{elementCombo:"Fire_Water",relType:"ex",headline:"Today's read",moonTag:"Fire · Water",action:"Stop trying to decipher what {{p}} felt. Focus on what you feel."}, tags:["universal","element_combo:Fire_Water","rel_type:ex"], sortOrder:2303 },
  // Earth + Water
  { type:"hero_card", body:"{{u}}, Earth and Water is one of the most naturally nurturing combinations — and one of the most enabling in a situationship. You both avoid confrontation. That's why this hasn't been named.", meta:{elementCombo:"Earth_Water",relType:"situationship",headline:"Today's read",moonTag:"Earth · Water",action:"Name it today. One of you has to, and it might as well be you."}, tags:["universal","element_combo:Earth_Water","rel_type:situationship"], sortOrder:2310 },
  { type:"hero_card", body:"{{u}}, Earth and Water in a relationship is the most genuinely nurturing combination. Your {{um}} moon and {{p}}'s {{pm}} moon both give in ways that actually land. The risk is that you're both so focused on the other's wellbeing that neither asks for their own needs to be met.", meta:{elementCombo:"Earth_Water",relType:"relationship",headline:"Today's read",moonTag:"Earth · Water",action:"Ask {{p}} what they need today. Then tell them what you need."}, tags:["universal","element_combo:Earth_Water","rel_type:relationship"], sortOrder:2311 },
  { type:"hero_card", body:"{{u}}, your {{um}} moon is one of the few things that genuinely comforts {{p}}'s {{pm}} moon. Water moons are drawn to Earth for the same reason water carves valleys — they find their level.", meta:{elementCombo:"Earth_Water",relType:"crush",headline:"Today's read",moonTag:"Earth · Water",action:"Be exactly who you are around {{p}} today. No performance."}, tags:["universal","element_combo:Earth_Water","rel_type:crush"], sortOrder:2312 },
  // Air + Water
  { type:"hero_card", body:"{{u}}, your {{um}} moon is in your head and {{p}}'s {{pm}} moon is in their feelings — you're both avoiding the middle ground where those two things have to meet. The situationship lives in that avoidance.", meta:{elementCombo:"Air_Water",relType:"situationship",headline:"Today's read",moonTag:"Air · Water",action:"Bridge it today. Say something that's both honest and emotionally real."}, tags:["universal","element_combo:Air_Water","rel_type:situationship"], sortOrder:2320 },
  { type:"hero_card", body:"{{u}}, Air and Water in a relationship: you provide the perspective that gets {{p}}'s {{pm}} moon out of emotional spirals; {{p}} provides the emotional depth that keeps your {{um}} moon from floating away.", meta:{elementCombo:"Air_Water",relType:"relationship",headline:"Today's read",moonTag:"Air · Water",action:"When {{p}} shares something emotional today, just be with it. Don't fix it."}, tags:["universal","element_combo:Air_Water","rel_type:relationship"], sortOrder:2321 },
  // Fire + Earth
  { type:"hero_card", body:"{{u}}, your {{um}} moon moves fast and {{p}}'s {{pm}} moon moves slow. That's not incompatibility — it's friction. You interpret their caution as disinterest. They interpret your urgency as pressure.", meta:{elementCombo:"Fire_Earth",relType:"situationship",headline:"Today's read",moonTag:"Fire · Earth",action:"Slow down to {{p}}'s pace for just today. Notice what you see."}, tags:["universal","element_combo:Fire_Earth","rel_type:situationship"], sortOrder:2330 },
  { type:"hero_card", body:"{{u}}, your {{um}} moon and {{p}}'s {{pm}} moon have a productive friction. You spark ideas and they build them. You feel things intensely and they process them steadily. When you respect that difference instead of fighting it, this relationship is extraordinary.", meta:{elementCombo:"Fire_Earth",relType:"relationship",headline:"Today's read",moonTag:"Fire · Earth",action:"Let {{p}} take their time on something today without rushing them."}, tags:["universal","element_combo:Fire_Earth","rel_type:relationship"], sortOrder:2331 },
  // Water + Water
  { type:"hero_card", body:"{{u}}, two Water moons in a situationship: both of you feel everything and say almost nothing directly. You've built tremendous emotional intimacy and then refused to name it.", meta:{elementCombo:"Water_Water",relType:"situationship",headline:"Today's read",moonTag:"Water · Water",action:"Break the silence. Say one true thing to {{p}} today."}, tags:["universal","element_combo:Water_Water","rel_type:situationship"], sortOrder:2340 },
  { type:"hero_card", body:"{{u}}, two Water moons in a relationship is a depth that can be transcendent or consuming. You feel everything together — the beauty and the fear. Make sure the depth doesn't become enmeshment.", meta:{elementCombo:"Water_Water",relType:"relationship",headline:"Today's read",moonTag:"Water · Water",action:"Do one thing today that is entirely, separately yours."}, tags:["universal","element_combo:Water_Water","rel_type:relationship"], sortOrder:2341 },
  // Earth + Earth
  { type:"hero_card", body:"{{u}}, your {{um}} moon and {{p}}'s {{pm}} moon are both Earth — you both move slowly, value security, and resist naming things until you're sure. The situationship exists because you're both waiting for certainty that neither of you will create until you risk something.", meta:{elementCombo:"Earth_Earth",relType:"situationship",headline:"Today's read",moonTag:"Earth · Earth",action:"Be the one who risks something small today. Earth moons respect that."}, tags:["universal","element_combo:Earth_Earth","rel_type:situationship"], sortOrder:2350 },
  { type:"hero_card", body:"{{u}}, two Earth moons in a relationship is one of the most stable foundations there is — and one of the most vulnerable to complacency. You and {{p}} build trust slowly and it holds. The risk is mistaking comfort for connection.", meta:{elementCombo:"Earth_Earth",relType:"relationship",headline:"Today's read",moonTag:"Earth · Earth",action:"Do one thing with {{p}} today that is a choice, not just a habit."}, tags:["universal","element_combo:Earth_Earth","rel_type:relationship"], sortOrder:2351 },
  // Fire + Fire
  { type:"hero_card", body:"{{u}}, your {{um}} moon and {{p}}'s {{pm}} moon are both Fire — meaning you're two people who lead, not follow. The situationship stalls because neither of you will admit first that you want more. That's not mystery. That's a standoff.", meta:{elementCombo:"Fire_Fire",relType:"situationship",headline:"Today's read",moonTag:"Fire · Fire",action:"Be the one who names it, just once. Their reaction tells you everything."}, tags:["universal","element_combo:Fire_Fire","rel_type:situationship"], sortOrder:2360 },
  { type:"hero_card", body:"{{u}}, your {{um}} moon and {{p}}'s {{pm}} moon are both Fire — you both lead, both need space, and both hate being told what to do. The relationship works when you're on the same team.", meta:{elementCombo:"Fire_Fire",relType:"relationship",headline:"Today's read",moonTag:"Fire · Fire",action:"Pick one thing to do together today, not against each other."}, tags:["universal","element_combo:Fire_Fire","rel_type:relationship"], sortOrder:2361 },
  // Air + Air
  { type:"hero_card", body:"{{u}}, two Air moons in a situationship is two people who have talked about everything except the actual thing. Stop discussing and start deciding.", meta:{elementCombo:"Air_Air",relType:"situationship",headline:"Today's read",moonTag:"Air · Air",action:"Have one conversation with {{p}} where no topic is deflected."}, tags:["universal","element_combo:Air_Air","rel_type:situationship"], sortOrder:2370 },
  { type:"hero_card", body:"{{u}}, two Air moons in a relationship have the best conversations of anyone they know — and sometimes use those conversations to avoid the harder emotional work. Go there.", meta:{elementCombo:"Air_Air",relType:"relationship",headline:"Today's read",moonTag:"Air · Air",action:"Have a conversation today that isn't about ideas — just about how you both actually feel."}, tags:["universal","element_combo:Air_Air","rel_type:relationship"], sortOrder:2371 },
];

// ─── Right Now Moments ────────────────────────────────────────────────────────
// Home screen "Right now" card. Two halves: user moment + partner signal.
// meta.isPartner = false → user moment; meta.isPartner = true → partner signal.
// Tags: element:X + rel_type:Y for user; partner_element:X + rel_type:Y for partner.

const rightNowContent: ContentSeed[] = [
  // ── Fire user moments ─────────────────────────────────────────────────────
  { type:"right_now", body:"{{u}}, your {{um}} moon already knows what it wants. The pause isn't uncertainty — it's you deciding whether to actually act on what you've already decided.", meta:{isPartner:false}, tags:["element:Fire","rel_type:crush","universal"], sortOrder:3000 },
  { type:"right_now", body:"{{u}}, you've played out this conversation at least four times today. Your {{um}} moon is ready. The only thing you haven't figured out is how to start.", meta:{isPartner:false}, tags:["element:Fire","rel_type:crush","universal"], sortOrder:3001 },
  { type:"right_now", body:"{{u}}, your {{um}} moon has a natural ceiling for ambiguity and you're close to it. What feels like frustration is actually clarity — you know what you want, you just haven't said it.", meta:{isPartner:false}, tags:["element:Fire","rel_type:situationship","universal"], sortOrder:3002 },
  { type:"right_now", body:"{{u}}, you've rehearsed the defining conversation enough to give it word for word. What's stopping you isn't the words — it's fear of what {{p}} might say back.", meta:{isPartner:false}, tags:["element:Fire","rel_type:situationship","universal"], sortOrder:3003 },
  { type:"right_now", body:"{{u}}, something small happened recently that's still sitting in you. Your {{um}} moon doesn't stay quiet for long. {{p}} probably senses something's off.", meta:{isPartner:false}, tags:["element:Fire","rel_type:relationship","universal"], sortOrder:3004 },
  { type:"right_now", body:"{{u}}, your {{um}} moon needs things to feel like they're moving. If the relationship has felt static lately, that restlessness is information — not something to suppress.", meta:{isPartner:false}, tags:["element:Fire","rel_type:relationship","universal"], sortOrder:3005 },
  { type:"right_now", body:"{{u}}, the impulse to reach out to {{p}} is stronger today. Your {{um}} moon acts before it thinks sometimes — make sure this is the thinking kind first.", meta:{isPartner:false}, tags:["element:Fire","rel_type:ex","universal"], sortOrder:3006 },
  { type:"right_now", body:"{{u}}, your {{um}} moon isn't built to quietly accept an ending. The fact that this still burns doesn't mean you should go back — it means you haven't fully reclaimed yourself yet.", meta:{isPartner:false}, tags:["element:Fire","rel_type:ex","universal"], sortOrder:3007 },

  // ── Earth user moments ────────────────────────────────────────────────────
  { type:"right_now", body:"{{u}}, your {{um}} moon has been collecting evidence about {{p}} quietly. You have enough. The block isn't information — it's the risk of being wrong.", meta:{isPartner:false}, tags:["element:Earth","rel_type:crush","universal"], sortOrder:3010 },
  { type:"right_now", body:"{{u}}, your {{um}} moon is waiting for a sign that this is safe before it moves. {{p}} might be waiting for the same sign from you. Someone has to go first.", meta:{isPartner:false}, tags:["element:Earth","rel_type:crush","universal"], sortOrder:3011 },
  { type:"right_now", body:"{{u}}, your {{um}} moon has been accommodating uncertainty longer than it's built to. You're not someone who thrives in ambiguity — you're someone who tolerates it when they have to.", meta:{isPartner:false}, tags:["element:Earth","rel_type:situationship","universal"], sortOrder:3012 },
  { type:"right_now", body:"{{u}}, you've analyzed this from every angle and kept reaching the same conclusion. Your {{um}} moon knows what it needs. You just haven't asked for it directly yet.", meta:{isPartner:false}, tags:["element:Earth","rel_type:situationship","universal"], sortOrder:3013 },
  { type:"right_now", body:"{{u}}, your {{um}} moon notices when things shift, even slightly. Something has shifted this week and you haven't spoken it to {{p}} yet.", meta:{isPartner:false}, tags:["element:Earth","rel_type:relationship","universal"], sortOrder:3014 },
  { type:"right_now", body:"{{u}}, there's a specific thing you've been thinking about this week that you haven't said to {{p}}. Your {{um}} moon holds things carefully — sometimes too carefully.", meta:{isPartner:false}, tags:["element:Earth","rel_type:relationship","universal"], sortOrder:3015 },
  { type:"right_now", body:"{{u}}, your {{um}} moon is doing the practical parts of moving on. The emotional part is a few steps behind that, and that's exactly how your moon processes — thoroughly, in order.", meta:{isPartner:false}, tags:["element:Earth","rel_type:ex","universal"], sortOrder:3016 },
  { type:"right_now", body:"{{u}}, your {{um}} moon doesn't release things quickly. The fact that you're still processing {{p}} isn't weakness — it's the depth you bring to everything.", meta:{isPartner:false}, tags:["element:Earth","rel_type:ex","universal"], sortOrder:3017 },

  // ── Air user moments ──────────────────────────────────────────────────────
  { type:"right_now", body:"{{u}}, your {{um}} moon has been reading {{p}}'s messages for things that may or may not be there. The analysis won't give you certainty — only a direct conversation will.", meta:{isPartner:false}, tags:["element:Air","rel_type:crush","universal"], sortOrder:3020 },
  { type:"right_now", body:"{{u}}, you've had the conversation you need to have with {{p}} about fifty times in your head. The words are there. What's missing is the decision to actually say them.", meta:{isPartner:false}, tags:["element:Air","rel_type:crush","universal"], sortOrder:3021 },
  { type:"right_now", body:"{{u}}, your {{um}} moon can talk itself into and out of anything. Check that you're not using your own clarity to avoid the one conversation that would actually give you clarity.", meta:{isPartner:false}, tags:["element:Air","rel_type:situationship","universal"], sortOrder:3022 },
  { type:"right_now", body:"{{u}}, you've got a very articulate understanding of why this situation is what it is. You also know that understanding it doesn't change it. Something else has to change it.", meta:{isPartner:false}, tags:["element:Air","rel_type:situationship","universal"], sortOrder:3023 },
  { type:"right_now", body:"{{u}}, your {{um}} moon has been rationalizing something instead of feeling it. There's a specific thing you've been explaining away that deserves to actually be felt.", meta:{isPartner:false}, tags:["element:Air","rel_type:relationship","universal"], sortOrder:3024 },
  { type:"right_now", body:"{{u}}, something happened recently that you've analyzed thoroughly and discussed very little. Your {{um}} moon is good at understanding things — right now it needs to express them.", meta:{isPartner:false}, tags:["element:Air","rel_type:relationship","universal"], sortOrder:3025 },
  { type:"right_now", body:"{{u}}, your {{um}} moon has probably already constructed a clean narrative about why the ending was right. Check whether you're processing or just explaining — they're different.", meta:{isPartner:false}, tags:["element:Air","rel_type:ex","universal"], sortOrder:3026 },
  { type:"right_now", body:"{{u}}, your {{um}} moon is running conversations with {{p}} in your head — making arguments, finding the right words. The argument you win in your head doesn't change anything real.", meta:{isPartner:false}, tags:["element:Air","rel_type:ex","universal"], sortOrder:3027 },

  // ── Water user moments ────────────────────────────────────────────────────
  { type:"right_now", body:"{{u}}, your {{um}} moon already knows how {{p}} feels. You've picked it up without them saying anything. You're just not sure what to do with what you know.", meta:{isPartner:false}, tags:["element:Water","rel_type:crush","universal"], sortOrder:3030 },
  { type:"right_now", body:"{{u}}, you've sensed something real here and you've been quietly talking yourself out of trusting it. Your {{um}} moon's instincts have context your logic doesn't. Listen to them.", meta:{isPartner:false}, tags:["element:Water","rel_type:crush","universal"], sortOrder:3031 },
  { type:"right_now", body:"{{u}}, your {{um}} moon has been absorbing the ambiguity in this and calling it patience. It's not patience — it's you carrying something that should be shared, not held.", meta:{isPartner:false}, tags:["element:Water","rel_type:situationship","universal"], sortOrder:3032 },
  { type:"right_now", body:"{{u}}, your {{um}} moon knows the difference between someone who's figuring things out and someone who's comfortable keeping you waiting. Which one is this?", meta:{isPartner:false}, tags:["element:Water","rel_type:situationship","universal"], sortOrder:3033 },
  { type:"right_now", body:"{{u}}, there's something between you and {{p}} that hasn't been said out loud yet. Your {{um}} moon has been holding it. Today is a reasonable day to stop holding it.", meta:{isPartner:false}, tags:["element:Water","rel_type:relationship","universal"], sortOrder:3034 },
  { type:"right_now", body:"{{u}}, you've been holding something for {{p}} emotionally this week. Your {{um}} moon does this automatically. Make sure you're also holding something for yourself.", meta:{isPartner:false}, tags:["element:Water","rel_type:relationship","universal"], sortOrder:3035 },
  { type:"right_now", body:"{{u}}, the grief comes in waves and your {{um}} moon stays in each one until it's done. That's right. Don't rush it and don't apologize to anyone for it.", meta:{isPartner:false}, tags:["element:Water","rel_type:ex","universal"], sortOrder:3036 },
  { type:"right_now", body:"{{u}}, you've been checking in on {{p}} from a distance — their profile, what people say, small signals. Your {{um}} moon is still monitoring something it's not ready to release. Notice that.", meta:{isPartner:false}, tags:["element:Water","rel_type:ex","universal"], sortOrder:3037 },

  // ── Fire partner signals ──────────────────────────────────────────────────
  { type:"right_now", body:"{{p}}'s {{pm}} moon has noticed you. Fire moons act on what they want — if they haven't acted yet, there's a reason. They're calibrating. Show up clearly.", meta:{isPartner:true}, tags:["partner_element:Fire","rel_type:crush","universal"], sortOrder:3100 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is deciding. Fire moons move fast once they decide — the pause means they're still weighing something, not that they're uninterested.", meta:{isPartner:true}, tags:["partner_element:Fire","rel_type:crush","universal"], sortOrder:3101 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon doesn't do indefinite. They have a natural limit on undefined things and they won't feel guilty about moving on when it expires.", meta:{isPartner:true}, tags:["partner_element:Fire","rel_type:situationship","universal"], sortOrder:3102 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is in a holding pattern right now. Fire moons don't hold forever. Watch which direction they move when the pattern breaks.", meta:{isPartner:true}, tags:["partner_element:Fire","rel_type:situationship","universal"], sortOrder:3103 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon needs to feel like you're fully present. Something has made them feel like part of you is somewhere else this week.", meta:{isPartner:true}, tags:["partner_element:Fire","rel_type:relationship","universal"], sortOrder:3104 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is carrying something they haven't said yet. Fire moons act when they're ready — give them space to get there without pushing.", meta:{isPartner:true}, tags:["partner_element:Fire","rel_type:relationship","universal"], sortOrder:3105 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon has moved the energy somewhere else — work, something new, people who are available. That's how Fire moons survive endings. It doesn't mean what it looks like.", meta:{isPartner:true}, tags:["partner_element:Fire","rel_type:ex","universal"], sortOrder:3106 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon will reach back out if and when it decides to. If it hasn't, that's information. Let that be the answer for right now.", meta:{isPartner:true}, tags:["partner_element:Fire","rel_type:ex","universal"], sortOrder:3107 },

  // ── Earth partner signals ─────────────────────────────────────────────────
  { type:"right_now", body:"{{p}}'s {{pm}} moon is paying close attention to whether you follow through on small things. They're not testing you — they're building a picture of whether you're consistent.", meta:{isPartner:true}, tags:["partner_element:Earth","rel_type:crush","universal"], sortOrder:3110 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon moves slowly. The fact that they keep engaging with you means something — Earth moons don't give sustained attention to things that don't matter.", meta:{isPartner:true}, tags:["partner_element:Earth","rel_type:crush","universal"], sortOrder:3111 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is comfortable in this arrangement in a way that may not be serving you. They're not pushing for more because you're already meeting their needs.", meta:{isPartner:true}, tags:["partner_element:Earth","rel_type:situationship","universal"], sortOrder:3112 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon takes time to commit because they take it seriously. They need consistency, more time, or a direct conversation — probably all three.", meta:{isPartner:true}, tags:["partner_element:Earth","rel_type:situationship","universal"], sortOrder:3113 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon goes quiet when they're processing something they don't know how to say. The quiet this week isn't distance — something is building.", meta:{isPartner:true}, tags:["partner_element:Earth","rel_type:relationship","universal"], sortOrder:3114 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon needs things to feel solid. If anything has felt unsettled between you recently, it registers more deeply for them than it might for you.", meta:{isPartner:true}, tags:["partner_element:Earth","rel_type:relationship","universal"], sortOrder:3115 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is doing the slow, thorough work of rebuilding. They're probably further along in that process than their behavior suggests.", meta:{isPartner:true}, tags:["partner_element:Earth","rel_type:ex","universal"], sortOrder:3116 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon won't reach back out impulsively. If they do, it will be because they've decided to — deliberately, not on a whim.", meta:{isPartner:true}, tags:["partner_element:Earth","rel_type:ex","universal"], sortOrder:3117 },

  // ── Air partner signals ───────────────────────────────────────────────────
  { type:"right_now", body:"{{p}}'s {{pm}} moon engages with what genuinely interests them. The fact that they keep coming back to you is the signal — Air moons disengage from things that don't hold them.", meta:{isPartner:true}, tags:["partner_element:Air","rel_type:crush","universal"], sortOrder:3120 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is figuring out whether you're consistent or just compelling. Compelling is easy for Air moons to walk away from. Consistent isn't.", meta:{isPartner:true}, tags:["partner_element:Air","rel_type:crush","universal"], sortOrder:3121 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon has rationalized this arrangement into something that works for them. They're probably not experiencing the ambiguity the same way you are. That matters.", meta:{isPartner:true}, tags:["partner_element:Air","rel_type:situationship","universal"], sortOrder:3122 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon isn't unavailable — they're just not being pushed toward clarity. A direct question gets a direct answer with Air moons. Ask it.", meta:{isPartner:true}, tags:["partner_element:Air","rel_type:situationship","universal"], sortOrder:3123 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is in their head right now — not away from you, but inside a thought process they haven't brought you into yet. Ask where they actually are.", meta:{isPartner:true}, tags:["partner_element:Air","rel_type:relationship","universal"], sortOrder:3124 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon needs the relationship to feel like it's still moving. Check whether you've both settled into routine — they feel that shift first.", meta:{isPartner:true}, tags:["partner_element:Air","rel_type:relationship","universal"], sortOrder:3125 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon has already moved the story forward in their head. The emotional chapter may still be open even if the cognitive one is closed.", meta:{isPartner:true}, tags:["partner_element:Air","rel_type:ex","universal"], sortOrder:3126 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is not unreachable — Air moons stay connected to the idea of people long after things end. Being an idea in their head isn't the same as a real option.", meta:{isPartner:true}, tags:["partner_element:Air","rel_type:ex","universal"], sortOrder:3127 },

  // ── Water partner signals ─────────────────────────────────────────────────
  { type:"right_now", body:"{{p}}'s {{pm}} moon is picking up on everything you're not saying. They already know more about how you feel than you've told them. What they're deciding is what to do with it.", meta:{isPartner:true}, tags:["partner_element:Water","rel_type:crush","universal"], sortOrder:3130 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon feels things deeply and shares almost none of it. The quiet isn't disinterest — it's protection. Consistency earns their trust. Not intensity.", meta:{isPartner:true}, tags:["partner_element:Water","rel_type:crush","universal"], sortOrder:3131 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is more invested in this than they're showing. Water moons protect what they care about by going quiet about it. The silence is the tell, not evidence of absence.", meta:{isPartner:true}, tags:["partner_element:Water","rel_type:situationship","universal"], sortOrder:3132 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is waiting to feel safe enough to name what this is. Safety for them comes from consistency, not declarations. Show up the same way, repeatedly.", meta:{isPartner:true}, tags:["partner_element:Water","rel_type:situationship","universal"], sortOrder:3133 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon has been absorbing something this week they haven't processed out loud yet. Ask them what's going on — not 'are you okay' but something more specific.", meta:{isPartner:true}, tags:["partner_element:Water","rel_type:relationship","universal"], sortOrder:3134 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon needs to feel genuinely seen right now — not just loved in general, but noticed specifically. Name one specific thing about them today.", meta:{isPartner:true}, tags:["partner_element:Water","rel_type:relationship","universal"], sortOrder:3135 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon is still carrying this quietly. Water moons don't put things down easily. They look okay. They're probably not fully okay.", meta:{isPartner:true}, tags:["partner_element:Water","rel_type:ex","universal"], sortOrder:3136 },
  { type:"right_now", body:"{{p}}'s {{pm}} moon will reach back out if and when they feel safe enough to. Water moons don't reach back impulsively — they reach back when the feeling becomes too heavy to hold alone.", meta:{isPartner:true}, tags:["partner_element:Water","rel_type:ex","universal"], sortOrder:3137 },
];

// ─── Combine all ──────────────────────────────────────────────────────────────

export const ALL_CONTENT: ContentSeed[] = [
  ...quotes,
  ...affirmations,
  ...affirmationsExtended,
  ...dailyMessages,
  ...dailyMessagesExtended,
  // oracleResponses (v1) intentionally excluded — replaced by oracleResponsesV2
  ...oracleResponsesV2,
  ...suggestionCards,
  ...featureInsights,
  ...questionAnswers,
  ...moonProfiles,
  ...nakshatraProfiles,
  ...dashaChapters,
  ...kootaNarratives,
  ...dailyFocusMessages,
  ...energyMessages,
  ...compatibilityTexts,
  ...heroCards,
  ...rightNowContent,
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
