/**
 * * 流程
 * 1. 打印原文
 * 2. 操作文本
 * 3. 清空文本
 *
 * * 功能函数
 * 1. 打字机
 * 2. 橡皮擦
 */
import { diffWords } from "diff";

// 功能函数 ------------------------------------------------------------
// 打字机
async function typewriter({
  input,
  index = 0,
  sourceText = "",
  el = document.body,
  delay = 100,
}) {
  const cursor = `<span class="cursor"></span>`;
  const beforeCursor = sourceText.slice(0, index);
  const afterCursor = sourceText.slice(index);
  const targetText = beforeCursor + input[0] + afterCursor;
  const sourceHTML = beforeCursor + cursor + afterCursor;
  const targetHTML = beforeCursor + input[0] + cursor + afterCursor;
  el.innerHTML = sourceHTML;
  await new Promise((resolve) =>
    setTimeout(() => resolve((el.innerHTML = targetHTML)), delay / 2)
  );
  await new Promise((resolve) => setTimeout(resolve, delay / 2));
  if (input.length == 1) return targetText;
  return typewriter({
    input: input.slice(1),
    index: index + 1,
    sourceText: targetText,
    delay,
  });
}

// 橡皮擦
async function eraser({
  index,
  length,
  sourceText,
  el = document.body,
  delay = 100,
}) {
  const cursor = `<span class="cursor"></span>`;
  const beforeCursor = sourceText.slice(0, index - 1);
  const afterCursor = sourceText.slice(index);
  const targetText = beforeCursor + afterCursor;
  const sourceHTML =
    beforeCursor + sourceText[index - 1] + cursor + afterCursor;
  const targetHTML = beforeCursor + cursor + afterCursor;
  el.innerHTML = sourceHTML;
  await new Promise((resolve) =>
    setTimeout(() => resolve((el.innerHTML = targetHTML)), delay / 2)
  );
  await new Promise((resolve) => setTimeout(resolve, delay / 2));
  if (length == 1) return targetText;
  return eraser({
    index: index - 1,
    length: length - 1,
    sourceText: targetText,
    el,
    delay,
  });
}

// 事务 ----------------------------------------------------------------------
const originalText = `JavaScript is a popular programming language used for web development.
It allows you to create interactive and dynamic web pages.`;
const finalText = `JavaScript is a widely-used programming language for building web applications.
It enables the creation of responsive and interactive web interfaces.`;

async function textDiffChange({
  delay = 100,
  typewriterDelay,
  eraserDelay,
} = {}) {
  // 1. 打印原文
  await typewriter({ input: originalText, delay: typewriterDelay || delay });
  // 2. 操作文本
  const diff = diffWords(originalText, finalText);
  let indexCount = 0;
  let workingText = originalText;
  for (const task of diff) {
    if (task.added) {
      workingText = await typewriter({
        input: task.value,
        index: indexCount,
        sourceText: workingText,
        delay,
      });
      indexCount += task.value.length;
    } else if (task.removed) {
      workingText = await eraser({
        index: indexCount + task.value.length,
        length: task.value.length,
        sourceText: workingText,
        delay,
      });
    } else {
      indexCount += task.value.length;
    }
  }
  // 3. 清空文本
  await eraser({
    sourceText: finalText,
    index: finalText.length,
    length: finalText.length,
    delay: eraserDelay || delay,
  });
  textDiffChange(arguments);
}
textDiffChange({ delay: 1000, typewriterDelay: 1, eraserDelay: 1 });
