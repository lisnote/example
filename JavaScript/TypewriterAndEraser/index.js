/**
 * * 流程
 * 1. 打印原文
 * 2. 操作文本
 * 3. 清空文本
 *
 * * 功能函数
 * 1. 打字机
 * 2. 橡皮擦
 * 3. 移动光标
 */
import { diffWords } from "diff";

// 功能函数 ------------------------------------------------------------
// 打字机
const cursor = `<span class="cursor"></span>`;
let cursorIndex = 0;
async function typewriter({
  input,
  index = 0,
  sourceText = "",
  el = document.body,
  delay = 100,
  moveDelay = 500,
}) {
  const beforeCursor = sourceText.slice(0, index);
  const afterCursor = sourceText.slice(index);
  if (cursorIndex !== index) {
    await moveCursor({
      index,
      sourceText,
      delay: moveDelay,
    });
  }
  cursorIndex = beforeCursor.length + 1;
  const targetText = beforeCursor + input[0] + afterCursor;
  const targetHTML = beforeCursor + input[0] + cursor + afterCursor;
  await new Promise((resolve) => setTimeout(resolve, delay));
  el.innerHTML = targetHTML;
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
  moveDelay = 500,
}) {
  const beforeCursor = sourceText.slice(0, index - 1);
  const afterCursor = sourceText.slice(index);
  if (cursorIndex !== index) {
    await moveCursor({
      index,
      sourceText,
      delay: moveDelay,
    });
  }
  cursorIndex = beforeCursor.length;
  const targetText = beforeCursor + afterCursor;
  const targetHTML = beforeCursor + cursor + afterCursor;
  await new Promise((resolve) => setTimeout(resolve, delay));
  el.innerHTML = targetHTML;
  if (length == 1) return targetText;
  return eraser({
    index: index - 1,
    length: length - 1,
    sourceText: targetText,
    el,
    delay,
  });
}

// 移动光标
async function moveCursor({
  index,
  sourceText,
  delay = 1000,
  el = document.body,
}) {
  const beforeCursor = sourceText.slice(0, index);
  cursorIndex = beforeCursor.length;
  const afterCursor = sourceText.slice(index);
  const targetHTML = beforeCursor + cursor + afterCursor;
  await new Promise((resolve) => setTimeout(resolve, delay / 2));
  el.innerHTML = targetHTML;
  await new Promise((resolve) => setTimeout(resolve, delay / 2));
}

// 事务 ----------------------------------------------------------------------
const originalText = `JavaScript is a popular programming language used for web development.
It allows you to create interactive and dynamic web pages.`;
const finalText = `JavaScript is a widely-used programming language for building web applications.
It enables the creation of responsive and interactive web interfaces.`;

async function textDiffChange({
  beginDealy = 10,
  endDelay = 10,
  typewriterDelay = 10,
  eraserDelay = 10,
  moveDelay = 500,
} = {}) {
  // 1. 打印原文
  await typewriter({
    input: originalText,
    delay: beginDealy || typewriterDelay,
  });
  const diff = diffWords(originalText, finalText);
  let indexCount = 0;
  let workingText = originalText;
  // 2. 操作文本
  for (const task of diff) {
    if (task.added) {
      workingText = await typewriter({
        input: task.value,
        index: indexCount,
        sourceText: workingText,
        delay: typewriterDelay,
        moveDelay,
      });
      indexCount += task.value.length;
    } else if (task.removed) {
      workingText = await eraser({
        index: indexCount + task.value.length,
        length: task.value.length,
        sourceText: workingText,
        delay: eraserDelay,
        moveDelay,
      });
    } else {
      indexCount += task.value.length;
    }
  }
  // 3. 清空文本
  // await eraser({
  //   sourceText: finalText,
  //   index: finalText.length,
  //   length: finalText.length,
  //   delay: endDelay || eraserDelay,
  // });
  textDiffChange(...arguments);
}
textDiffChange({
  beginDealy: 50,
  endDelay: 10,
  typewriterDelay: 100,
  eraserDelay: 50,
  moveDelay: 500,
});
