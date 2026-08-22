import sys
import json
import re

def process_query(user_query, history=None):
    clean_query = user_query.strip().lower()

    # 1. Brooding & Heat Calculations
    if re.search(r'\b(brood|heat|temperature|jiko|bulb)\b', clean_query):
        return {
            "reply": "🌡️ **Python Farm Diagnostic (Brooding Climate):**\n"
                     "• **Days 1–7**: 32°C–35°C (Chicks evenly distributed & active).\n"
                     "• **Days 8–14**: 29°C–32°C.\n"
                     "• **Days 15–21**: 26°C–29°C.\n"
                     "• *Huddling tight* = Too Cold. *Panting at edges* = Too Hot. Ensure zero cold drafts!",
            "engine": "Python Advisory Core v2.4"
        }

    # 2. Vaccination Schedule
    elif re.search(r'\b(vaccin|gumboro|newcastle|pox|typhoid|chanjo)\b', clean_query):
        return {
            "reply": "💉 **Python Poultry Health Core (Vaccine Schedule):**\n"
                     "• **Day 1**: Marek's (Administered at Cucu Mutugi Hatchery).\n"
                     "• **Day 7**: Gumboro 1st Dose (chlorine-free water + skimmed milk).\n"
                     "• **Day 14**: Newcastle + IB (Eye drop or water).\n"
                     "• **Day 21**: Gumboro Booster.\n"
                     "• **Day 28**: Fowl Pox (Wing web stab).",
            "engine": "Python Health Protocol Engine"
        }

    # 3. Order & Pricing Engine
    elif re.search(r'\b(price|cost|order|vifaranga|kienyeji|broiler|layer)\b', clean_query):
        return {
            "reply": "🐣 **Cucu Mutugi Official Chick Pricing & Orders:**\n"
                     "• **Improved Kienyeji**: Day-old (KES 120) | 1 wk (KES 160) | 2 wks (KES 200) | 3 wks (KES 250) | 1 mo (KES 300)\n"
                     "• **ISA Brown Layers**: Day-old (KES 160)\n"
                     "• **Broiler Cobb 500**: Day-old (KES 105)\n"
                     "🚚 Free countrywide delivery on Wednesdays & Thursdays!",
            "engine": "Python Commercial Ledger Core"
        }

    # General Python Advisory Fallback
    else:
        return {
            "reply": f"🤖 **Cucu Mutugi Python AI Assistant:**\n"
                     f"I have processed your query: *\"{user_query}\"*.\n\n"
                     "How can I assist you with farm management, order verification, customer activity, or status updates today?",
            "engine": "Python Intelligence Core"
        }

if __name__ == '__main__':
    try:
        if len(sys.argv) > 1:
            input_text = sys.argv[1]
        else:
            input_text = sys.stdin.read()

        result = process_query(input_text)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"reply": f"Python AI Engine Error: {str(e)}", "engine": "Fallback Engine"}))
