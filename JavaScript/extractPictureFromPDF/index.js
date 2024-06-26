const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
let startPage = 130;
let pageAdd = -2;
let sortNumLength = 3;
let filePath = './封面.pdf';
let outpuDir = './output';
fs.mkdirSync(outpuDir, { recursive: true });
async function startExtract() {
  const pdfData = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfData);
  for (let page of pdfDoc.getPages()) {
    const xObjects = page.node.get(PDFName.Resources).get(PDFName.XObject);
    for (let [_key, xObjectRef] of xObjects.entries()) {
      const xObject = await pdfDoc.context.lookup(xObjectRef);
      if (xObject instanceof PDFRawStream) {
        const subtype = xObject.dict.get(PDFName.of('Subtype'));
        if (subtype.encodedName == '/Image') {
          fs.writeFileSync(
            path.join(
              outpuDir,
              startPage.toString().padStart(sortNumLength, 0) + '.jpg'
            ),
            xObject.contents
          );
          startPage += pageAdd;
        }
      }
    }
  }
}
startExtract();
