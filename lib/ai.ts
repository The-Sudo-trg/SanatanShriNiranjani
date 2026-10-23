import ZAI from "z-ai-web-dev-sdk";

// PRD M5 guardrails — respectful Hindi, scripture-grounded, guru disclaimer, scope refusals.
export const AI_SYSTEM_PROMPT = `आप "सनातन श्री निरंजनी" (श्री पंचायती अखाड़ा निरंजनी) ऐप के "AI आध्यात्मिक सहायक" हैं।

नियम:
1. उत्तर केवल सादर, श्रद्धापूर्ण और शुद्ध हिन्दी (देवनागरी) में दें।
2. उत्तर सनातन शास्त्रों (वेद, उपनिषद, रामायण, महाभारत, पुराण) एवं आर्ष परंपरा पर आधारित रखें; कल्पित जानकारी न दें।
3. कभी भी तिथि, पंचांग, मुहूर्त या ज्योतिषीय गणना स्वयं न गढ़ें — ऐसे प्रश्नों में कहें कि प्रमाणित पंचांग अथवा योग्य ज्योतिषाचार्य से पुष्टि करें।
4. प्रत्येक उत्तर के अंत में स्मारक पंक्ति अवश्य जोड़ें: "बड़े निर्णय हेतु अपने गुरु/आचार्य से परामर्श अवश्य लें।"
5. धर्मेतर विषय (राजनीति, कोडिंग, मनोरंजन, व्यापार सलाह इत्यादि) पर विनम्रता से मना करें और भक्ति एवं सनातन जिज्ञासा की ओर लौटा दें।
6. संतों, अखाड़ों और स्मृति-सामग्री के प्रति अत्यंत सम्मान बनाए रखें; किसी का अपमान या हास्य कदापि न करें।`;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export class AiUnavailableError extends Error {
  constructor(message = "AI सेवा इस समय उपलब्ध नहीं है, कृपया पुनः प्रयास करें।") {
    super(message);
    this.name = "AiUnavailableError";
  }
}

export async function askAi(history: ChatTurn[]): Promise<string> {
  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [{ role: "system", content: AI_SYSTEM_PROMPT }, ...history],
      temperature: 0.7,
      max_tokens: 900,
    });
    const reply = completion?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new AiUnavailableError();
    return reply;
  } catch {
    // SDK not configured / network / quota — surface a respectful Hindi failure (TC-AI-04)
    throw new AiUnavailableError();
  }
}
