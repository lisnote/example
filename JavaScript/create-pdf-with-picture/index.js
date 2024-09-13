const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'input');
const outputPath = path.join(__dirname, 'output', 'output.pdf');
async function start() {
  const pdfDoc = await PDFDocument.create();
  for (let filename of fs.readdirSync(inputDir)) {
    const picture = fs.readFileSync(path.join(inputDir, filename));
    const pdfImage = await pdfDoc.embedJpg(picture);
    const { width, height } = pdfImage.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(pdfImage, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }
  fs.writeFileSync(outputPath, await pdfDoc.save());
  console.log('success');
}
start();
