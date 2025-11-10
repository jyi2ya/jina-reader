export function countGPTToken(text: string): number {
    // Simple approximation:
    // - English words average ~1.3 tokens per word
    // - Chinese characters average ~2 tokens per character
    // - Numbers/symbols count as separate tokens

    const chineseCharPattern = /[\u4e00-\u9fff]/g;
    const chineseCount = (text.match(chineseCharPattern) || []).length;
    const nonChineseText = text.replace(chineseCharPattern, '');

    // Count words in non-Chinese text (split by whitespace)
    const wordCount = nonChineseText.trim() ? nonChineseText.trim().split(/\s+/).length : 0;

    // Approximate tokens: Chinese chars * 2 + English words * 1.3
    return Math.ceil(chineseCount * 2 + wordCount * 1.3);
}

