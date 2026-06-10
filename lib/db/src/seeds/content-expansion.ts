// ─── Lumble Content Expansion ─────────────────────────────────────────────────
// A large batch of additional, kundli-tagged content so different users see
// genuinely different copy. Everything here is matched server-side by tag
// overlap against the profile's stored kundliTags (built by buildKundliTags):
//   universal | rel_type:<type> | moon:<EnglishSign> | partner_moon:<EnglishSign>
//   element:<F/E/A/W> | partner_element:<...> | element_combo:<X_Y>
//   nakshatra:<Sanskrit> | dasha:<Lord> | dosha:nadi | dosha:mangal
// Oracle bodies may use template vars filled by oracle.ts buildContext():
//   {{u}} {{p}} {{uMoon}} {{pMoon}} {{uMoonStyle}} {{pMoonStyle}} {{gunaVerdict}}
//   {{pNakPattern}} {{pNakShadow}} {{strongKootaText}} {{lagnaLoveStyle}} ...
// Energy bodies may use {{um}} (user moon) and {{pm}} (partner moon).
//
// sortOrder starts at 5000 so these always rank AFTER the original seed for
// equal match scores — existing defaults are never displaced, new tagged copy
// only surfaces when it genuinely matches a user (match_score DESC wins first).

interface ContentSeed {
  type: string;
  title?: string;
  body: string;
  meta?: Record<string, unknown>;
  tags: string[];
  sortOrder: number;
}

const O = (intent: string) => ({ intent, version: 2 });

// ─── Oracle Responses — personalized by dasha / rel_type / element / moon ─────
// Format mirrors oracleResponsesV2: Insight quote + "What to do" checklist.

const oracleExpansion: ContentSeed[] = [
  // ── misses_me ───────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"You're in a Ketu phase — a time when things you're meant to release start to ache the loudest right before they leave. {{p}} may still feel the pull. That doesn't make going back the lesson here.\"\n\nWhat to do\n✓ Let the ache be a sign of letting go, not of going back   ✓ Build one new thing this week that has nothing to do with them   ✓ Stop checking for proof they miss you", meta:O("misses_me"), tags:["dasha:Ketu","intent:misses_me"], sortOrder:5000 },
  { type:"oracle_response", body:"Insight\n\"They're an ex for a reason that was real when it happened. Missing you and being right for you are two different things — and the gap between them is exactly where people get stuck.\"\n\nWhat to do\n✓ Write down the actual reason it ended   ✓ Ask if that reason has genuinely changed   ✓ Don't reach back for a feeling — reach back only for a changed pattern", meta:O("misses_me"), tags:["rel_type:ex","intent:misses_me"], sortOrder:5001 },
  { type:"oracle_response", body:"Insight\n\"In something undefined, 'do they miss me' is usually the wrong question. The real one is whether they'd choose you if the comfort of the in-between disappeared. {{p}}'s silence answers more than their messages do.\"\n\nWhat to do\n✓ Notice who reaches first, and how often   ✓ Ask for the clarity you actually want   ✓ Give the ambiguity a deadline in your own head", meta:O("misses_me"), tags:["rel_type:situationship","intent:misses_me"], sortOrder:5002 },
  { type:"oracle_response", body:"Insight\n\"A {{pMoon}} moon feels absence in the body, not just the mind — they almost certainly carry you. But Water moons protect what they feel by going quiet. The silence isn't absence. It's defence.\"\n\nWhat to do\n✓ Don't read the quiet as a no   ✓ If you need to know, ask once, directly   ✓ Stop decoding old messages for hidden warmth", meta:O("misses_me"), tags:["partner_element:Water","intent:misses_me"], sortOrder:5003 },

  // ── loves_me ────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"You're in a Shukra phase — the most love-active period there is. What's real gets clearer now, and what isn't gets clearer too. Watch what {{p}} does when loving you is inconvenient. That's the whole answer.\"\n\nWhat to do\n✓ Track actions in the inconvenient moments   ✓ Let this period show you what's solid   ✓ Stop asking and start observing", meta:O("loves_me"), tags:["dasha:Shukra","intent:loves_me"], sortOrder:5010 },
  { type:"oracle_response", body:"Insight\n\"You've already chosen each other once. The question now isn't whether they love you — it's whether you're both still actively choosing it, or coasting on the habit of it. {{gunaVerdict}}.\"\n\nWhat to do\n✓ Name one thing you've stopped noticing about them   ✓ Tell them one specific thing you love today   ✓ Ask: are we choosing this, or just used to it?", meta:O("loves_me"), tags:["rel_type:relationship","intent:loves_me"], sortOrder:5011 },
  { type:"oracle_response", body:"Insight\n\"A {{pMoon}} moon shows love through steadiness, not declarations. If you're waiting for the grand confirmation, you'll miss the quiet, repeated proof that's already there.\"\n\nWhat to do\n✓ Count the consistent small things, not the big words   ✓ Notice what they do reliably   ✓ Ask directly if you still need to hear it out loud", meta:O("loves_me"), tags:["partner_element:Earth","intent:loves_me"], sortOrder:5012 },

  // ── come_back ───────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"You're in a Shani phase, where only what's genuinely solid survives. If this connection is meant to rebuild, it will hold up to honest weight. If it only works in the fantasy of reunion, this period will show you that too.\"\n\nWhat to do\n✓ Test the idea against reality, not longing   ✓ Name what would actually be different   ✓ Let the difficulty reveal what's real", meta:O("come_back"), tags:["dasha:Shani","intent:come_back"], sortOrder:5020 },
  { type:"oracle_response", body:"Insight\n\"A {{pMoon}} moon doesn't return impulsively — when Earth moons come back, it's a decision, not a mood. So if they do reach out, take it seriously. And if they don't, take that seriously too.\"\n\nWhat to do\n✓ Watch for deliberate action, not a late-night text   ✓ Don't chase a maybe   ✓ Decide what you'd need to see before saying yes", meta:O("come_back"), tags:["partner_element:Earth","intent:come_back"], sortOrder:5021 },
  { type:"oracle_response", body:"Insight\n\"Going back to an ex only works when the pattern changed, not just the loneliness. {{pNakShadow}} — that was part of the old dynamic. Ask whether that's actually different now.\"\n\nWhat to do\n✓ Name the exact pattern that broke it   ✓ Look for evidence it changed, not promises   ✓ Don't confuse a familiar feeling with a fixed problem", meta:O("come_back"), tags:["rel_type:ex","intent:come_back"], sortOrder:5022 },

  // ── should_text ─────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"Your Mangal energy wants to act now, and that urgency is mostly real. But there's a difference between a direct message and a reactive one. Send the honest thing, not the heat-of-the-moment thing.\"\n\nWhat to do\n✓ Write it, wait one hour, then read it cold   ✓ Cut anything designed to provoke a reaction   ✓ Send once, then let it breathe", meta:O("should_text"), tags:["dasha:Mangal","intent:should_text"], sortOrder:5030 },
  { type:"oracle_response", body:"Insight\n\"In an undefined situation, a text rarely creates the clarity you want — it usually just refreshes the loop. If you reach out, reach out for an answer, not for contact.\"\n\nWhat to do\n✓ Ask the real question instead of sending 'hey'   ✓ Decide in advance how you'll handle no reply   ✓ Don't text to feel close — that closeness doesn't come from a screen", meta:O("should_text"), tags:["rel_type:situationship","intent:should_text"], sortOrder:5031 },
  { type:"oracle_response", body:"Insight\n\"A {{uMoon}} moon texts when it's feeling something, not always when there's something to say. Before you send it, check: are you reaching for them, or reaching away from a feeling?\"\n\nWhat to do\n✓ Name the feeling underneath the urge   ✓ If it's anxiety, sit with it before acting   ✓ If it's something real, say that real thing plainly", meta:O("should_text"), tags:["element:Water","intent:should_text"], sortOrder:5032 },

  // ── why_left ────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"People rarely leave over the final moment — they leave over a pattern that built quietly underneath it. {{pNakShadow}}. That was running long before the visible ending.\"\n\nWhat to do\n✓ Stop hunting for the one thing you missed   ✓ Look at the slow pattern, not the last scene   ✓ Use what you learned to ask differently next time", meta:O("why_left"), tags:["rel_type:ex","intent:why_left"], sortOrder:5040 },
  { type:"oracle_response", body:"Insight\n\"A {{pMoon}} moon withdraws inward long before it withdraws fully. By the time the leaving was visible, it had already been happening internally for a while. That's about their wiring, not your worth.\"\n\nWhat to do\n✓ Don't take the suddenness personally — it wasn't sudden for them   ✓ Notice what you needed that wasn't there   ✓ Write your own closure instead of waiting for theirs", meta:O("why_left"), tags:["partner_element:Water","intent:why_left"], sortOrder:5041 },

  // ── why_fight ───────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"You and {{p}} have a built-in push and pull — one of you moves close exactly when the other needs room. The fight is almost never about the topic. It's about the timing mismatch underneath it.\"\n\nWhat to do\n✓ Name the cycle out loud: 'we're in the pattern again'   ✓ Agree on a pause signal before the next one   ✓ Ask what each of you actually needs in that moment", meta:O("why_fight"), tags:["dosha:bhakoot","intent:why_fight"], sortOrder:5050 },
  { type:"oracle_response", body:"Insight\n\"In a committed relationship, the recurring fight has a recurring real subject sitting underneath it. {{gunaVerdict}} — the friction isn't a verdict on the connection, it's a signpost to the thing neither of you has said directly.\"\n\nWhat to do\n✓ Find the one topic that always returns   ✓ Say the real thing outside of a fight, when you're calm   ✓ Ask yourself: am I trying to win, or to be understood?", meta:O("why_fight"), tags:["rel_type:relationship","intent:why_fight"], sortOrder:5051 },
  { type:"oracle_response", body:"Insight\n\"You share a similar emotional energy type, which means stress tends to hit you both at once — and when neither of you has capacity, small things ignite. The fight is often just two depleted people, not two incompatible ones.\"\n\nWhat to do\n✓ Notice when you're both running on empty   ✓ Build in recovery time before the next stretch   ✓ When you're both low, bring in support instead of leaning harder on each other", meta:O("why_fight"), tags:["dosha:nadi","intent:why_fight"], sortOrder:5052 },

  // ── compatible ──────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"Your strongest natural area: {{strongKootaText}} That's not luck — it's real, and it's the foundation worth building on. {{gunaVerdict}}.\"\n\nWhat to do\n✓ Lean deliberately into what already flows   ✓ Name the one friction area and tend it directly   ✓ Ask: are we both actively choosing this?", meta:O("compatible"), tags:["universal","intent:compatible"], sortOrder:5060 },
  { type:"oracle_response", body:"Insight\n\"Different elements aren't incompatibility — they're complementarity that needs translation. One of you brings heat, one brings depth. Managed with intention, that difference is the whole strength of this.\"\n\nWhat to do\n✓ Name what your differences give each other   ✓ Translate your needs instead of assuming they're shared   ✓ Use the contrast as balance, not as a battleground", meta:O("compatible"), tags:["dosha:bhakoot","intent:compatible"], sortOrder:5061 },

  // ── move_on ─────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"You're in a Ketu phase, which is built for exactly this — releasing what was never fully yours to keep. What you let go of now makes room for something that actually fits who you're becoming.\"\n\nWhat to do\n✓ Stop organizing your present around their absence   ✓ Let the release happen instead of fighting it   ✓ Build one thing this week that's entirely yours", meta:O("move_on"), tags:["dasha:Ketu","intent:move_on"], sortOrder:5070 },
  { type:"oracle_response", body:"Insight\n\"You're not only grieving them — you're grieving the version of yourself that existed in that connection. That second grief is quieter and it matters just as much.\"\n\nWhat to do\n✓ Let yourself feel it without replaying it   ✓ Stop checking their profile — every check restarts the loop   ✓ Rebuild the parts of you that existed before them", meta:O("move_on"), tags:["rel_type:ex","intent:move_on"], sortOrder:5071 },

  // ── future ──────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"You're in a Brihaspati phase — a period of growth where this connection either expands with you or starts to feel small. The future depends less on fate and more on whether it can grow at your pace.\"\n\nWhat to do\n✓ Notice whether you feel bigger or smaller around them   ✓ Name what you need to grow toward   ✓ Have the honest conversation about direction", meta:O("future"), tags:["dasha:Brihaspati","intent:future"], sortOrder:5080 },
  { type:"oracle_response", body:"Insight\n\"The future of something undefined gets decided by whether someone is willing to define it. {{gunaVerdict}} — the material is there. The missing variable is a real conversation, not more time.\"\n\nWhat to do\n✓ Name what you actually want this to become   ✓ Ask {{p}} where they genuinely stand   ✓ Let their honest answer guide you, not your hope", meta:O("future"), tags:["rel_type:situationship","intent:future"], sortOrder:5081 },

  // ── addicted ────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"You're in a Rahu phase, where connection takes on an almost magnetic charge. The intensity is real — but Rahu intensity is famous for feeling like fate when it's actually a pattern asking to be broken.\"\n\nWhat to do\n✓ Separate the intensity from the rightness   ✓ Notice what old pattern this is repeating   ✓ Channel the charge into something that gives back", meta:O("addicted"), tags:["dasha:Rahu","intent:addicted"], sortOrder:5090 },
  { type:"oracle_response", body:"Insight\n\"The depth that makes this hurt so much is the same depth that makes you capable of extraordinary love. The work isn't to feel less. It's to aim that depth at someone who can actually receive it.\"\n\nWhat to do\n✓ Name the exact feeling you're craving   ✓ Stop feeding the loop — every check resets it   ✓ Point that energy at something that returns it", meta:O("addicted"), tags:["element:Water","intent:addicted"], sortOrder:5091 },

  // ── confused ────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"Mixed signals usually mean someone is mixed internally — they want you and aren't ready, both true at once. You can't resolve their inner conflict by reading the signals more carefully.\"\n\nWhat to do\n✓ Ask the direct question, once   ✓ Watch what they observe-ably do, not what they hint   ✓ If it stays unclear, the ambiguity is itself the answer", meta:O("confused"), tags:["rel_type:situationship","intent:confused"], sortOrder:5100 },
  { type:"oracle_response", body:"Insight\n\"A {{uMoon}} moon often senses the truth before the mind explains it away. What did your gut say in the first moment, before the second-guessing started? That read is usually the accurate one.\"\n\nWhat to do\n✓ Go back to your first instinct   ✓ Stop gathering more data — you have enough   ✓ Ask plainly, then leave room for a real answer", meta:O("confused"), tags:["element:Water","intent:confused"], sortOrder:5101 },

  // ── red_flag ────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"No compatibility score justifies staying in something that consistently harms you. {{pNakShadow}} — when that shows up as a repeating pattern rather than a bad day, it's information, not a phase to wait out.\"\n\nWhat to do\n✓ Track the specific behaviors, not the apologies   ✓ Tell one person you trust what's been happening   ✓ Say what you need and watch whether the pattern changes", meta:O("red_flag"), tags:["rel_type:relationship","intent:red_flag"], sortOrder:5110 },
  { type:"oracle_response", body:"Insight\n\"A {{uMoon}} moon reads safety accurately — when something feels off in your body before your mind agrees, that's data. The question isn't whether you can sense it. It's whether you'll act on what you already see.\"\n\nWhat to do\n✓ Write down the specific things you've explained away   ✓ Ask what you'd tell a close friend in this exact situation   ✓ Don't wait for a bigger, clearer sign", meta:O("red_flag"), tags:["element:Water","intent:red_flag"], sortOrder:5111 },

  // ── timing ──────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"You're in a Shani phase, and Shani doesn't reward rushing — it rewards what's built to last. 'Too soon' here usually means something real still needs to be in place, not that the door is closed.\"\n\nWhat to do\n✓ Name what specifically needs to be ready   ✓ Give it a concrete timeline, not open-ended waiting   ✓ Work on the part that's in your control", meta:O("timing"), tags:["dasha:Shani","intent:timing"], sortOrder:5120 },
  { type:"oracle_response", body:"Insight\n\"Timing questions are almost always readiness questions wearing a calendar. The variable isn't the date — it's whether you and they are actually ready. Be honest about which one you're really asking.\"\n\nWhat to do\n✓ Separate 'is it the right time' from 'am I ready'   ✓ Name what readiness would actually look like   ✓ Move when you're ready, not when conditions are perfect", meta:O("timing"), tags:["universal","intent:timing"], sortOrder:5121 },

  // ── general ─────────────────────────────────────────────────────────────────
  { type:"oracle_response", body:"Insight\n\"{{dashaOracleContext}}. That phase is shaping how you're reading this whole connection right now — which means the lens matters as much as the situation.\"\n\nWhat to do\n✓ Name what this life phase is asking of you   ✓ Separate the phase from the person   ✓ Act on what you sense once you've named both", meta:O("general"), tags:["universal","intent:general"], sortOrder:5130 },
  { type:"oracle_response", body:"Insight\n\"Your pattern in love is {{pNakPattern}} — wait, that's them. Yours runs differently, and the friction you're feeling often lives in the gap between two real patterns, not in something being wrong.\"\n\nWhat to do\n✓ Name your own pattern honestly   ✓ Name theirs without judgment   ✓ Talk about the gap instead of fighting inside it", meta:O("general"), tags:["universal","intent:general"], sortOrder:5131 },
];

// ─── Question & Answer cards — browse library depth ───────────────────────────
// meta: { question, shortAnswer, category, icon }
// categories: about_them | about_you | what_to_do | patterns | big_picture

const Q = (question: string, shortAnswer: string, category: string, icon: string) =>
  ({ question, shortAnswer, category, icon });

const questionExpansion: ContentSeed[] = [
  // ── About Them ────────────────────────────────────────────────────────────
  { type:"question_answer", title:"Do they take me seriously?",
    body:"The clearest test isn't what they say about the future — it's whether they show up reliably in the present. People who take you seriously become consistent. People who don't stay vague. Their Moon sign shapes how they express it, but consistency translates across every chart.",
    meta:Q("Do they take me seriously?","Watch for consistency, not promises.","about_them","⚖️"), tags:["universal","rel_type:situationship","rel_type:relationship"], sortOrder:5300 },
  { type:"question_answer", title:"Why do they only reach out when it suits them?",
    body:"Intermittent attention almost always means you're filling a need without being a priority. It's not that they feel nothing — it's that the current arrangement costs them nothing. The shift happens when you stop being endlessly available and start requiring something real.",
    meta:Q("Why do they only reach out when it suits them?","You're convenient, not yet chosen.","about_them","📲"), tags:["universal","rel_type:situationship","rel_type:ex"], sortOrder:5301 },
  { type:"question_answer", title:"Are they scared of how they feel about me?",
    body:"Often, yes. Someone who runs hot then cold is usually pulled toward you and frightened of what that pull means for them. Their chart may carry a Ketu or Saturn influence that equates closeness with loss of control. Fear of feeling is not the same as absence of feeling.",
    meta:Q("Are they scared of how they feel about me?","Fear of feeling is not absence of it.","about_them","🌡️"), tags:["universal","rel_type:crush","rel_type:situationship"], sortOrder:5302 },
  { type:"question_answer", title:"Do they regret how things ended?",
    body:"Probably more than they show. Endings rarely sit cleanly, especially for a Water Moon who processes loss privately and intensely. But regret and readiness to repair are different things. Their regret is real. Whether they'll do anything with it is a separate question.",
    meta:Q("Do they regret how things ended?","Likely yes — but regret isn't repair.","about_them","🍂"), tags:["universal","rel_type:ex","intent:why_left"], sortOrder:5303 },
  { type:"question_answer", title:"Why do they keep me at arm's length?",
    body:"Distance is usually self-protection, not disinterest. Someone guarding their inner world has often been hurt for opening it before. Their Nakshatra may incline them toward intense privacy that loosens only with proven, repeated safety. Consistency earns access. Pressure closes the door.",
    meta:Q("Why do they keep me at arm's length?","They're protecting a door that got slammed before.","about_them","🚪"), tags:["universal","rel_type:relationship","rel_type:situationship"], sortOrder:5304 },

  // ── About You ─────────────────────────────────────────────────────────────
  { type:"question_answer", title:"Why do I lose myself in relationships?",
    body:"When you merge so fully that your own edges blur, it usually means love and identity got tangled early on. A Pisces or Cancer Moon feels this most. The work isn't loving less — it's keeping one part of your life that stays entirely yours, even at your most in love.",
    meta:Q("Why do I lose myself in relationships?","Love and identity got tangled. Keep one part yours.","about_you","🪞"), tags:["universal","moon:Pisces","moon:Cancer","moon:Libra"], sortOrder:5310 },
  { type:"question_answer", title:"Why do I pick people who can't fully show up?",
    body:"We're drawn to what feels familiar before we're drawn to what feels good. If unavailability feels like home, your nervous system reads it as love. That's not a flaw in you — it's a pattern you learned, and patterns can be unlearned once you can see the shape of them.",
    meta:Q("Why do I pick people who can't fully show up?","Familiar feels like love before good does.","about_you","🔄"), tags:["universal","rel_type:crush","rel_type:situationship"], sortOrder:5311 },
  { type:"question_answer", title:"Why do I overthink every message?",
    body:"Overthinking is anxiety wearing the costume of analysis. You're not actually trying to decode them — you're trying to feel safe. An Air or Mercury-strong chart runs faster here. The interrupt is action: ask the real question instead of running the twentieth simulation.",
    meta:Q("Why do I overthink every message?","It's anxiety, not analysis. Ask the real question.","about_you","🌀"), tags:["universal","moon:Gemini","moon:Virgo","moon:Aquarius"], sortOrder:5312 },
  { type:"question_answer", title:"Why do I feel too much?",
    body:"Feeling deeply is not a malfunction — it's a capacity most people never develop. A Water Moon registers emotion at a frequency others simply don't reach. The goal isn't to feel less. It's to stop spending that depth on people who can't meet it.",
    meta:Q("Why do I feel too much?","It's a capacity, not a flaw. Spend it wisely.","about_you","🌊"), tags:["universal","moon:Cancer","moon:Scorpio","moon:Pisces","element:Water"], sortOrder:5313 },
  { type:"question_answer", title:"Why do I keep score in love?",
    body:"Keeping score usually means you've been the one giving more for long enough that it started to hurt. The tally is a protest against an imbalance you haven't named out loud yet. Name the imbalance directly — that conversation does more than the silent ledger ever will.",
    meta:Q("Why do I keep score in love?","The tally is an unnamed imbalance. Name it.","about_you","⚖️"), tags:["universal","rel_type:relationship"], sortOrder:5314 },

  // ── What To Do ────────────────────────────────────────────────────────────
  { type:"question_answer", title:"How do I set a boundary without losing them?",
    body:"A boundary isn't a threat — it's information about how to love you well. The right person receives it as clarity, not rejection. State it as a request about your own needs, not an accusation about their behavior. If a clear, kind boundary ends it, it was already ending.",
    meta:Q("How do I set a boundary without losing them?","State your need, not their fault.","what_to_do","🧱"), tags:["universal","rel_type:relationship","rel_type:situationship"], sortOrder:5320 },
  { type:"question_answer", title:"How do I stop chasing someone?",
    body:"Chasing keeps you in motion so you don't have to feel the stillness underneath. The pull eases when you put that same energy into something that actually returns it. Stop reaching for one day, then two. Notice how much of the intensity was the chase itself.",
    meta:Q("How do I stop chasing someone?","Redirect the energy into what returns it.","what_to_do","🏃"), tags:["universal","rel_type:crush","rel_type:situationship","intent:addicted"], sortOrder:5321 },
  { type:"question_answer", title:"How do I bring up the future without scaring them?",
    body:"Frame it as curiosity about direction, not a demand for a destination. 'Where do you see this going' lands softer than an ultimatum and still gets you a real answer. If a calm question about the future frightens someone, their reaction is itself part of your answer.",
    meta:Q("How do I bring up the future without scaring them?","Ask about direction, not destination.","what_to_do","🧭"), tags:["universal","rel_type:relationship","rel_type:situationship"], sortOrder:5322 },
  { type:"question_answer", title:"How do I rebuild after I broke their trust?",
    body:"Trust rebuilds through repeated, boring consistency — not through one big apology. Acknowledge the specific harm without defending it, then let your actions outpace your words for as long as it takes. You can't rush this, and trying to is itself part of what broke it.",
    meta:Q("How do I rebuild after I broke their trust?","Consistency over time, not one apology.","what_to_do","🔧"), tags:["universal","rel_type:relationship"], sortOrder:5323 },
  { type:"question_answer", title:"How do I know when to walk away?",
    body:"You walk away when staying costs you more of yourself than the connection gives back, repeatedly, after you've actually said what you need. You don't have to stop loving them first. Loving someone and being right for each other are two different things.",
    meta:Q("How do I know when to walk away?","When staying costs more of you than it gives.","what_to_do","🕊️"), tags:["universal","rel_type:relationship","rel_type:ex","guna:low"], sortOrder:5324 },

  // ── Patterns ──────────────────────────────────────────────────────────────
  { type:"question_answer", title:"Why does the same fight keep coming back?",
    body:"A recurring fight has a recurring real subject buried under the surface topic. You keep resolving the symptom and never the cause, so it regenerates. Find the one unspoken need at the center — name that instead of the dishes or the text — and the loop finally breaks.",
    meta:Q("Why does the same fight keep coming back?","You're fixing the symptom, not the cause.","patterns","🔁"), tags:["universal","rel_type:relationship","dosha:bhakoot"], sortOrder:5330 },
  { type:"question_answer", title:"Why do I sabotage things when they're going well?",
    body:"When closeness arrives, an old belief whispers that good things don't last for you — so you create the loss before it can happen to you. It feels like control. It's really fear arriving early. Naming it in the moment robs it of most of its power.",
    meta:Q("Why do I sabotage things when they're going well?","Fear arriving early, disguised as control.","patterns","🔥"), tags:["universal","rel_type:relationship","rel_type:crush"], sortOrder:5331 },
  { type:"question_answer", title:"Why do I always end up in undefined relationships?",
    body:"Undefined connections let you stay close without risking a clear no. If part of you fears rejection, ambiguity feels safer than asking. But the safety is an illusion — the slow ache of not-knowing usually costs more than a direct answer ever would.",
    meta:Q("Why do I always end up in undefined relationships?","Ambiguity feels safer than a clear answer.","patterns","🌀"), tags:["universal","rel_type:situationship"], sortOrder:5332 },
  { type:"question_answer", title:"Why do I attract intense, then unstable, connections?",
    body:"A Rahu influence or a Water-heavy chart often confuses intensity for depth. The nervous system learns to read drama as aliveness. Calm can feel like boredom at first. Real compatibility usually arrives quietly — and learning to trust quiet is the pattern to build.",
    meta:Q("Why do I attract intense, then unstable, connections?","You learned to read drama as aliveness.","patterns","⚡"), tags:["universal","dasha:Rahu","element:Water"], sortOrder:5333 },

  // ── Big Picture ───────────────────────────────────────────────────────────
  { type:"question_answer", title:"Is it naive to still believe in love?",
    body:"No. Staying open after being hurt isn't naivety — it's a kind of courage most people lose. The real question isn't whether love exists. It's whether you're showing up honestly about what you actually want, instead of armoring against the next disappointment.",
    meta:Q("Is it naive to still believe in love?","Staying open is courage, not naivety.","big_picture","⭐"), tags:["universal","rel_type:ex","category:healing"], sortOrder:5340 },
  { type:"question_answer", title:"Will I always feel this much, or does it fade?",
    body:"The intensity fades. The capacity doesn't. What feels unbearable now becomes a quieter knowing later — not because you cared less, but because you grew a larger life around the feeling. Give it time and motion. The depth that hurts now is the same depth that will love well later.",
    meta:Q("Will I always feel this much, or does it fade?","Intensity fades. Your capacity to love stays.","big_picture","🌅"), tags:["universal","rel_type:ex","category:healing"], sortOrder:5341 },
  { type:"question_answer", title:"What is this chapter of my life actually teaching me?",
    body:"Your current dasha sets the theme of this season — release, growth, testing, or expansion. The lesson is rarely about the other person. It's about what you're being asked to become. Name the theme honestly, and the confusing parts of this period start to make sense.",
    meta:Q("What is this chapter teaching me?","Your dasha sets the theme. Name it.","big_picture","🔮"), tags:["universal","dasha:Ketu","dasha:Shani","dasha:Brihaspati"], sortOrder:5342 },
  { type:"question_answer", title:"Am I meant to be with someone, or be on my own a while?",
    body:"Both can be true in sequence. A Ketu or Saturn period often asks for a season of solitude that rebuilds your relationship with yourself first. That's not punishment — it's preparation. The strongest partnerships tend to form from wholeness, not from a need to be completed.",
    meta:Q("Am I meant to be with someone, or on my own a while?","Solitude now can be preparation, not punishment.","big_picture","🌙"), tags:["universal","dasha:Ketu","dasha:Shani"], sortOrder:5343 },
];

// ─── Energy Messages — more daily variety, templated with {{um}}/{{pm}} ───────

const energyExpansion: ContentSeed[] = [
  { type:"energy_message", body:"Your {{um}} moon is steadier than the day feels. Whatever wobbled this morning, you're the stable point — use it.", meta:{condition:"neutral"}, tags:["condition:neutral","universal"], sortOrder:5900 },
  { type:"energy_message", body:"There's warmth available between you today that you'd normally talk yourself out of reaching for. Reach for it.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","universal"], sortOrder:5901 },
  { type:"energy_message", body:"The friction today isn't a verdict — it's static. Lower your volume before you lower your opinion of each other.", meta:{condition:"high_tension"}, tags:["condition:high_tension","universal"], sortOrder:5902 },
  { type:"energy_message", body:"Your {{um}} moon and their {{pm}} moon are unusually in step today. Plans made now tend to hold.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","universal"], sortOrder:5903 },
  { type:"energy_message", body:"A day for small repairs, not big talks. One kind, specific gesture lands further than a whole conversation right now.", meta:{condition:"neutral"}, tags:["condition:neutral","rel_type:relationship"], sortOrder:5904 },
  { type:"energy_message", body:"The pull to reconnect is real today, but check the motive first — is it clarity, or just quiet? One is worth acting on.", meta:{condition:"high_reconnection"}, tags:["condition:high_reconnection","rel_type:ex"], sortOrder:5905 },
  { type:"energy_message", body:"Your words carry further than usual today. Say the honest thing while the channel is open.", meta:{condition:"high_communication"}, tags:["condition:high_communication","universal"], sortOrder:5906 },
  { type:"energy_message", body:"Two Water moons today means feelings run deep on both sides at once. Name what you feel before you act on it.", meta:{condition:"high_tension"}, tags:["condition:high_tension","element_combo:Water_Water","dosha:nadi"], sortOrder:5907 },
  { type:"energy_message", body:"The {{um}} and {{pm}} energy is generative today, not heavy. Build something small together instead of resolving something old.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","universal"], sortOrder:5908 },
  { type:"energy_message", body:"Your Mangal edge is sharp today. That energy is fuel — point it at a shared goal, not at each other.", meta:{condition:"high_tension"}, tags:["condition:high_tension","dosha:mangal","dasha:Mangal"], sortOrder:5909 },
  { type:"energy_message", body:"A slower day in the current between you. Slow isn't distant — sometimes it's just rest. Let it be that.", meta:{condition:"neutral"}, tags:["condition:neutral","universal"], sortOrder:5910 },
  { type:"energy_message", body:"Today rewards presence over performance. You don't have to fix anything — just be fully there for ten real minutes.", meta:{condition:"high_closeness"}, tags:["condition:high_closeness","rel_type:relationship"], sortOrder:5911 },
];

// ─── Combined export ──────────────────────────────────────────────────────────

export const EXPANSION_CONTENT: ContentSeed[] = [
  ...oracleExpansion,
  ...questionExpansion,
  ...energyExpansion,
];
