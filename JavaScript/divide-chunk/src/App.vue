<script setup>
import { renderAsync } from "docx-preview";
import pdf from "pdf-dist/build/pdf.min.js";
import { ref } from "vue";

const docxRef = ref();
fetch("./docx.docx")
  .then((resp) => resp.blob())
  .then((blob) => {
    renderAsync(blob, docxRef.value);
  });

const pdfRef = ref();
fetch("./pdf.pdf").then(resp=>resp.blob()).then(blob=>{
  console.log(blob)
})

const mode = ref("pdf");
function switchMode() {
  mode.value = mode.value === "docx" ? "pdf" : "docx";
}
</script>

<template>
  <div>
    <button @click="switchMode">切换</button>
  </div>
  <div ref="docxRef" v-show="mode === 'docx'"></div>
  <canvas ref="pdfRef" v-show="mode === 'pdf'"></canvas>
</template>
