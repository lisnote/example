var img = document.querySelector("#displacementFilter feTurbulence");
var frames = 0;

function AnimateBaseFrequency() {
  let bf = "0.01 .1";
  let bfx = Number(bf.split(" ")[0]);
  let bfy = Number(bf.split(" ")[1]);
  frames += 0.5;
  bfx += 0.001 * Math.cos((frames * Math.PI) / 180);
  bfy += 0.005 * Math.sin((frames * Math.PI) / 180);

  bf = bfx.toString() + " " + bfy.toString();
  img.setAttributeNS(null, "baseFrequency", bf);
}

setInterval(AnimateBaseFrequency,20)
