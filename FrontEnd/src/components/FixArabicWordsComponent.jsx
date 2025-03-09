import { useEffect } from "react";

const FixArabicWordsComponent = ({ text, onFixComplete }) => {
  useEffect(() => {
    const fixArabicWords = (inputText) => {
      // List of replacements
      const replacements = [
        { pattern: /خالل/g, replacement: "خلال" },
        { pattern: /الامم/g, replacement: "الأمم" },
        { pattern: /الاندلس/g, replacement: "الأندلس" },
        { pattern: /انسان/g, replacement: "إنسان" },
        { pattern: /المعرفه/g, replacement: "المعرفة" },
        { pattern: /النسان/g, replacement: "الإنسان" },
        { pattern: /النتكاسه/g, replacement: "لانتكاسه" },
        { pattern: /االنسان/g, replacement: "الإنسان" },
        { pattern: /المقابل/g, replacement: "العبارة المذكورة في الأعلى" },
        { pattern: /المقابلة/g, replacement: "العبارة المذكورة في الأعلى" },
      ];

      // List of lines to ignore
      const linesToIgnore = [
        /محمود توكل/gi,
        /الصفحة \d+/gi,
        /اسئلة متعددة علي الوحده الاولي/gi,
      ];

      // Apply corrections
      let fixedText = inputText;

      // Remove ignored lines
      linesToIgnore.forEach((regex) => {
        fixedText = fixedText.replace(regex, "").trim();
      });

      // Apply word replacements
      replacements.forEach(({ pattern, replacement }) => {
        fixedText = fixedText.replace(pattern, replacement);
      });

      return fixedText;
    };

    // Fix the text and call the callback
    const fixedText = fixArabicWords(text);
    onFixComplete(fixedText);
  }, [text ]); // Ensure `onFixComplete` is included as a dependency

  return null; // No UI needed for this component
};

export default FixArabicWordsComponent;
