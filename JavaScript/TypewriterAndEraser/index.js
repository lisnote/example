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
  source = "",
  el = document.body,
  delay = 100,
}) {
  const before = source.slice(0, index);
  const after = source.slice(index);
  const target = before + input[0] + after;
  el.innerHTML = before + input[0] + `<span class="cursor"></span>` + after;
  if (input.length > 1) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            typewriter({
              input: input.slice(1),
              index: index + 1,
              source: target,
              delay,
            })
          ),
        delay
      );
    });
  }
  return target;
}

// 橡皮擦
async function eraser({
  index,
  length,
  source,
  el = document.body,
  delay = 100,
}) {
  const before = source.slice(0, index - 1);
  const after = source.slice(index);
  const target = before + after;
  el.innerHTML = before + `<span class="cursor"></span>` + after;
  if (length > 1) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            eraser({
              index: index - 1,
              length: length - 1,
              source: target,
              el,
              delay,
            })
          ),
        delay
      );
    });
  }
  return target;
}

// 事务 ----------------------------------------------------------------------
const sourceText = `JavaScript is a popular programming language used for web development.
It allows you to create interactive and dynamic web pages.`;
const targetText = `JavaScript is a widely-used programming language for building web applications.
It enables the creation of responsive and interactive web interfaces.`;

async function textDiffChange({
  delay = 100,
  typewriterDelay,
  eraserDelay,
} = {}) {
  // 1. 打印原文
  await typewriter({ input: sourceText, delay: typewriterDelay || delay });
  // 2. 操作文本
  const diff = diffWords(sourceText, targetText);
  let indexCount = 0;
  let workingText = sourceText;
  for (const task of diff) {
    if (task.added) {
      workingText = await typewriter({
        input: task.value,
        index: indexCount,
        source: workingText,
        delay,
      });
      indexCount += task.value.length;
    } else if (task.removed) {
      workingText = await eraser({
        index: indexCount + task.value.length,
        length: task.value.length,
        source: workingText,
        delay,
      });
    } else {
      indexCount += task.value.length;
    }
  }
  // 3. 清空文本
  await eraser({
    source: targetText,
    index: targetText.length,
    length: targetText.length,
    delay: eraserDelay || delay,
  });
  textDiffChange(arguments);
}
textDiffChange({ delay: 100, eraserDelay: 1, typewriterDelay: 1 });
