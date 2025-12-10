import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchProductPrice = async (productName: string): Promise<SearchResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a prompt that encourages structured comparison and authenticity verification
    const prompt = `请帮我全网搜索商品 "${productName}" 的当前价格，并进行真伪/可信度识别。
    
    请严格遵循以下步骤：
    1. **搜索渠道**：优先搜索品牌官网、京东自营、天猫官方旗舰店、亚马逊自营、苏宁易购等高可信度平台。
    2. **识别真伪**：对于搜索到的价格，分析其店铺性质。必须明确区分“官方自营/旗舰店”与“第三方个人/小店”。
    3. **排除陷阱**：如果发现价格显著低于市场均价（如低20%以上）且来源不明的，请标记为高风险，不要将其作为“最佳价格”推荐。
    4. **比价**：重点找出在**高可信度官方渠道**中的最低价格。
    
    请按以下Markdown格式返回结果（不要返回JSON，只返回Markdown文本）：
    
    ### 🛡️ 渠道可信度与真伪分析
    简要分析搜索到的主要价格来源的可靠性。**必须**指出哪些是官方正品渠道，哪些是风险较高的第三方或二手渠道。如果有发现疑似假货或翻新机的异常低价，请在此处重点警示。
    
    ### 🏆 官方/自营最佳价格
    明确指出哪个**官方/自营**渠道的价格最低，具体金额是多少。
    
    ### 📊 全网价格详情表
    | 平台 | 店铺性质 (官方/第三方) | 商品/型号 | 价格 (CNY) | 风险/备注 |
    |---|---|---|---|---|
    | 京东 | ✅ 自营 | ... | ... | 正品保障 |
    | 某二手平台 | ⚠️ 个人 | ... | ... | 需谨慎，谨防翻新 |
    
    ### 💡 避坑与购买建议
    基于价格和真伪风险，给出最终购买建议。告诉用户如何避免买到假货。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT set because googleSearch is used
      },
    });

    const text = response.text || "未能获取价格信息，请稍后重试。";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks: groundingChunks as any[], // Casting to match our simplified type
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("搜索失败，请检查网络或API Key配置。");
  }
};