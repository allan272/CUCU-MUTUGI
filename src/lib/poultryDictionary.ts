/**
 * CUCU MUTUGI POULTRY - Expert Troubleshooter & Knowledge Dictionary
 * Comprehensive domain dictionary and matching engine for poultry farming assistance.
 */

export interface DictionaryEntry {
  keywords: string[];
  patterns: RegExp[];
  category: string;
  response: string;
  actionLabel?: string;
  actionUrl?: string;
  followUps?: string[];
}

export const POULTRY_DICTIONARY: DictionaryEntry[] = [
  // ─── 1. CHICK MORTALITY & SICKNESS TROUBLESHOOTING ──────────────────────────
  {
    keywords: ['dying', 'mortality', 'death', 'dead', 'drooping', 'weak chicks', 'lethargic', 'sick', 'mgonjwa', 'kufa'],
    patterns: [/chicks? (are )?(dying|dead|dropping|weak)/i, /high mortality/i, /why are my chicks dying/i],
    category: 'Emergency / Mortality',
    response: `⚠️ **Emergency Chick Care Protocol:**
1. **Check Brooding Temperature Immediately**: Are chicks huddling under the heat source (Too Cold)? Or scattered at the perimeter gasping (Too Hot)? Maintain 32°C–35°C in Week 1.
2. **Water & Glucose/Electrolytes**: Ensure fresh clean water with liquid glucose or multivitamin anti-stress.
3. **Inspect Droppings**:
   - Bloody/red droppings = **Coccidiosis** (treat immediately with Amprolium/Toltrazuril).
   - White pasty vents = **Pullorum / Bacterial infection** (requires broad-spectrum antibiotic).
   - Greenish/watery = **Newcastle / severe stress**.
4. **Drafts & Ventilation**: Ensure no cold breeze blows directly onto chick level while keeping air fresh.`,
    actionLabel: 'Emergency WhatsApp Support',
    actionUrl: 'https://wa.me/254706972161?text=Urgent%20Help%20My%20Chicks%20Are%20Dying',
    followUps: ['Brooding Temperature Guide', 'Coccidiosis Treatment', 'Vaccine Schedule']
  },

  // ─── 2. BLOODY DROPPINGS / COCCIDIOSIS ──────────────────────────────────────
  {
    keywords: ['bloody', 'blood in stool', 'coccidiosis', 'red poop', 'damu', 'kuharisha'],
    patterns: [/blood(y)? (droppings|stool|poop)/i, /coccidiosis/i, /red (droppings|poop)/i],
    category: 'Disease: Coccidiosis',
    response: `🩸 **Coccidiosis Alert & Treatment:**
- **Symptoms**: Bloody or reddish-brown droppings, ruffled feathers, huddling with closed eyes, reduced appetite.
- **Immediate Treatment**: Administer **Amprolium 20%** or **ESB3 (Sulfaclozine)** in drinking water for 3–5 consecutive days. Follow with multivitamins for 3 days.
- **Prevention**: Keep litter bone dry! Remove wet wood shavings around drinkers immediately. Never let water spill on the floor.`,
    actionLabel: 'Learn Health Management',
    actionUrl: '/resources/health-management',
    followUps: ['Water Management', 'Feeding Programme', 'Vaccine Timetable']
  },

  // ─── 3. BROODING & TEMPERATURE ──────────────────────────────────────────────
  {
    keywords: ['brooding', 'temperature', 'heat', 'cold', 'infrared', 'jiko', 'huddle', 'heating', 'baridi', 'joto'],
    patterns: [/brooding temp(erature)?/i, /chicks (are )?huddling/i, /how much heat/i, /how to brood/i],
    category: 'Brooding Management',
    response: `🌡️ **Optimal Brooding Temperature Guidelines:**
- **Week 1 (Days 1–7)**: 32°C – 35°C (Chicks evenly spread & actively feeding).
- **Week 2 (Days 8–14)**: 29°C – 32°C.
- **Week 3 (Days 15–21)**: 26°C – 29°C.
- **Week 4 (Days 22–28)**: 23°C – 26°C (Begin withdrawing supplemental heat gradually).

**Signs to watch:**
- *Huddling tight under bulb/jiko* = Too cold 🥶 (Increase heat).
- *Spreading to far corners & panting* = Too hot 🥵 (Reduce heat).
- *All clustered on one side* = Cold draft/wind blowing from the opposite side.`,
    actionLabel: 'View Full Brooding Guide',
    actionUrl: '/resources/brooding-management',
    followUps: ['First Day Glucose Water', 'Chick Mash Feeds', 'Vaccination Schedule']
  },

  // ─── 4. VACCINATION SCHEDULE ────────────────────────────────────────────────
  {
    keywords: ['vaccine', 'vaccination', 'chanjo', 'schedule', 'gumboro', 'newcastle', 'fowl pox', 'mareks', 'typhoid'],
    patterns: [/vaccin(e|ation) (schedule|timetable|plan)/i, /when to vaccinate/i, /chanjo ya kuku/i],
    category: 'Vaccination Schedule',
    response: `💉 **Standard Kenya Poultry Vaccination Timetable:**
- **Day 1**: Marek's Disease (Administered at Cucu Mutugi hatchery).
- **Day 7**: **Gumboro 1st Dose** (In chlorine-free drinking water + skimmed milk stabilizer).
- **Day 14**: **Newcastle + Infectious Bronchitis (IB)** (Eye drop or drinking water).
- **Day 21**: **Gumboro 2nd Dose** (Booster).
- **Day 28**: **Fowl Pox** (Wing-web stab applicator).
- **Week 6**: Newcastle Booster (Lasota).
- **Week 8**: **Fowl Typhoid** (Intramuscular injection).
- **Week 18 (Layers/Breeders)**: Deworming + Newcastle booster.

*Tip: Always withdraw water for 1–2 hours before administering oral vaccines so birds drink quickly within 2 hours.*`,
    actionLabel: 'Open Health & Vaccine Guide',
    actionUrl: '/resources/health-management',
    followUps: ['Gumboro Signs', 'Newcastle Symptoms', 'Deworming Protocol']
  },

  // ─── 5. PRICES & CHICK BREEDS ───────────────────────────────────────────────
  {
    keywords: ['price', 'cost', 'how much', 'bei', 'kuroiler', 'sasso', 'kenbro', 'isa brown', 'cobb 500', 'broiler', 'layer', 'rainbow rooster', 'kienyeji'],
    patterns: [/how much (is|are) (the )?chicks/i, /chick(s)? price(s)?/i, /bei ya vifaranga/i, /order chicks/i],
    category: 'Products & Pricing',
    response: `IMPROVED KIENYEJI Chicks (Kuroiler, Sasso, Kenbro, Rainbow Rooster, KARI):
- Day old chick: KES 120
- One week old: KES 160
- Two weeks old: KES 200
- Three weeks old: KES 250
- One month old: KES 300

LAYERS (ISA Brown):
- Day old chick: KES 160

BROILER (Cobb 500):
- Day old chick: KES 105

All chicks are fully pre-vaccinated before delivery.
Free Countrywide Delivery on Wednesdays & Thursdays!`,
    actionLabel: 'Order Chicks Online',
    actionUrl: '/products',
    followUps: ['Delivery Routes & Days', 'Payment Method M-Pesa', 'Book Chick Batch']
  },

  // ─── 6. DELIVERY & MARKETING DAYS ───────────────────────────────────────────
  {
    keywords: ['delivery', 'deliver', 'transport', 'marketing days', 'when do you deliver', 'location', 'wednesday', 'thursday', 'nairobi', 'nakuru', 'embu', 'eldoret', 'safari'],
    patterns: [/where do you deliver/i, /delivery days/i, /free delivery/i, /siku za delivery/i],
    category: 'Delivery & Logistics',
    response: `🚚 **Free Countrywide Delivery Details:**
- **Dispatch Days**: Every **Wednesday** and **Thursday**.
- **Key Delivery Hubs**: Embu HQ, Nairobi, Nakuru, Eldoret, Nyeri, Kirinyaga, Meru, Tharaka Nithi, Kitale, Kitui, Machakos, Naivasha, Bungoma, and Rongo.
- **Collection**: Chicks are transported in specialized ventilated chick boxes to ensure 100% arrival vitality.`,
    actionLabel: 'View Contact & Locations',
    actionUrl: '/contact',
    followUps: ['Order Chicks', 'Check Chick Prices', 'Book Upcoming Batch']
  },

  // ─── 7. FEEDING PROGRAMME & RATIONS ─────────────────────────────────────────
  {
    keywords: ['feed', 'feeding', 'mash', 'growers', 'layers mash', 'starter', 'finisher', 'nutrition', 'chakula', 'diet', 'formulation'],
    patterns: [/what (feed|food) to give/i, /feeding programme/i, /feed formulation/i, /chakula cha kuku/i],
    category: 'Feeding Programme',
    response: `🌾 **Recommended Poultry Feeding Schedule:**
1. **Weeks 1–4**: **Chick Starter Mash** (High protein 20–22% for rapid bone & organ development).
2. **Weeks 5–8**: **Growers Mash** (16–18% protein for lean muscle growth).
3. **Weeks 9–18**: Transition to **Finisher** (for broilers/meat) or mature **Growers** (for improved kienyeji).
4. **Week 18+ (Layers)**: **Layers Mash** (16% protein + 3.5–4.0% Calcium & Limestone for strong eggshells).

*Feed budget: An improved kienyeji bird consumes approx. 6–7 kg of feed from day-old to maturity (5 months).*`,
    actionLabel: 'View Feeding Programme',
    actionUrl: '/resources/feeding-programme',
    followUps: ['Brooding Care', 'Egg Production Tips', 'Water Management']
  },

  // ─── 8. EGG PRODUCTION & DROP IN LAYING ─────────────────────────────────────
  {
    keywords: ['eggs', 'not laying', 'drop in eggs', 'soft shell', 'egg eating', 'cannibalism', 'mayai', 'kutaga', 'laying rate'],
    patterns: [/why are my hens not laying/i, /drop in egg production/i, /soft (shell|eggs)/i, /kuku hawatagi/i],
    category: 'Egg Production Management',
    response: `🥚 **Troubleshooting Egg Laying Issues:**
- **Drop in Egg Yield**:
  - *Light duration*: Layers require **16 hours of light daily** (natural + artificial lighting).
  - *Water shortage*: Even 2 hours without clean water can drop egg production for a week!
  - *Stress / Disease*: Check for mites, lice, or early respiratory signs.
- **Soft / Thin Eggshells**: Deficiency of **Calcium & Vitamin D3**. Supplement feed with crushed oyster shells or DCP (Dicalcium Phosphate).
- **Egg Eating / Cannibalism**: Lack of protein/calcium or nest boxes are too bright. Darken nest boxes and ensure adequate perches.`,
    actionLabel: 'View Record Keeping & Yields',
    actionUrl: '/resources/record-keeping',
    followUps: ['Layers Feed Mash', 'Vaccination for Layers', 'Order ISA Brown Layers']
  },

  // ─── 9. RESPIRATORY ISSUES / COUGHING / SNEEZING ────────────────────────────
  {
    keywords: ['coughing', 'sneezing', 'gasping', 'swollen eye', 'rattling', 'coryza', 'crd', 'kukohoa', 'mafua', 'respiratory'],
    patterns: [/chick(en)?s? (are )?(coughing|sneezing|gasping)/i, /swollen eyes?/i, /rattling sound/i, /mafua ya kuku/i],
    category: 'Disease: Respiratory (CRD/Coryza)',
    response: `🫁 **Poultry Respiratory Distress Protocol (CRD / Infectious Coryza):**
- **Symptoms**: Gurgling/rattling breath, swollen face/eyes with foul odor, nasal discharge, sneezing.
- **Recommended Action**:
  1. Treat with **Tylosin + Doxycycline (e.g. Tylodox)** or **Enrofloxacin 10%** in drinking water for 5 days.
  2. Isolate severely affected birds.
  3. Improve ventilation and reduce ammonia fumes from wet bedding.
  4. Disinfect drinkers daily.`,
    actionLabel: 'Open Health Guide',
    actionUrl: '/resources/health-management',
    followUps: ['Coccidiosis Treatment', 'Brooding Ventilation', 'Emergency Vet Help']
  },

  // ─── 10. GREETINGS & GENERAL INTRO ──────────────────────────────────────────
  {
    keywords: ['hello', 'hi', 'habari', 'mambo', 'hey', 'good morning', 'good afternoon', 'sasa', 'jambo', 'help'],
    patterns: [/^(hi|hello|hey|habari|mambo|jambo|sasa|good morning|good afternoon)/i],
    category: 'Greeting',
    response: `🐔 **Habari! Welcome to Cucu Mutugi Poultry Assistant.**
I am here to guide you with any poultry questions, chick care, disease diagnostics, vaccination schedules, pricing, and orders!

What would you like assistance with today?
- 🐣 **Chick Prices & Free Delivery**
- 🌡️ **Brooding & Temperature Help**
- 💉 **Vaccination Schedule & Diseases**
- 🌾 **Feed Formulations & Nutrition**
- 💬 **Join WhatsApp Community Lounge**`,
    followUps: ['Chick Prices & Breeds', 'Vaccine Schedule', 'Brooding Temperature', 'Emergency Sick Chicks']
  }
];

export function findAssistantReply(userQuery: string): {
  reply: string;
  category?: string;
  actionLabel?: string;
  actionUrl?: string;
  followUps?: string[];
} {
  const clean = userQuery.trim().toLowerCase();
  if (!clean) {
    return {
      reply: 'Please type your question or symptoms (e.g., "chicks dying", "vaccination schedule", "kuroiler price").',
      followUps: ['Chick Prices', 'Vaccination Schedule', 'Brooding Guide']
    };
  }

  // 1. Try regex pattern match first
  for (const entry of POULTRY_DICTIONARY) {
    for (const pattern of entry.patterns) {
      if (pattern.test(clean)) {
        return {
          reply: entry.response,
          category: entry.category,
          actionLabel: entry.actionLabel,
          actionUrl: entry.actionUrl,
          followUps: entry.followUps
        };
      }
    }
  }

  // 2. Try scoring keyword matches
  let bestEntry: DictionaryEntry | null = null;
  let highestScore = 0;

  for (const entry of POULTRY_DICTIONARY) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        score += kw.length > 4 ? 3 : 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && highestScore >= 2) {
    return {
      reply: bestEntry.response,
      category: bestEntry.category,
      actionLabel: bestEntry.actionLabel,
      actionUrl: bestEntry.actionUrl,
      followUps: bestEntry.followUps
    };
  }

  // 3. Fallback answer with WhatsApp hotline
  return {
    reply: `I understand you are asking about **"${userQuery}"**.

For specific farm diagnosis or customized orders:
- **Brooding Care**: Maintain 32°C–35°C during week 1 and give glucose water.
- **Vaccines**: Day 7 Gumboro, Day 14 Newcastle, Day 28 Fowl Pox.
- **Kienyeji Pricing**: Day old KES 120, 1 week KES 160, 2 weeks KES 200, 3 weeks KES 250, 1 month KES 300.
- **Layers**: Day old KES 160. **Broilers**: Day old KES 105. Free nationwide delivery.

You can also speak directly with our Senior Poultry Officer on WhatsApp for instant assistance!`,
    actionLabel: 'Chat with Senior Poultry Officer',
    actionUrl: `https://wa.me/254706972161?text=${encodeURIComponent('Hi Cucu Mutugi, I need assistance with: ' + userQuery)}`,
    followUps: ['Check Chick Prices', 'Vaccine Schedule', 'Brooding Temperature Guide', 'Visit Community Lounge']
  };
}
