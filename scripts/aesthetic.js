const colorSets = [
  ["#B91C00", "#FF6100", "#FFD700", "#00BC3E", "#006CFF"],
  ["rgb(255,255,255)"],
  ["#F94144", "#F3722C", "#F8961E", "#F9844A", "#F9C74F", "#90BE6D", "#43AA8B", "#4D908E", "#577590", "#277DA1"],
  [
    "#F94144",
    "#F3722C",
    "#F8961E",
    "#F9844A",
    "#F9C74F",
    "#90BE6D",
    "#43AA8B",
    "#4D908E",
    "#577590",
    "#277DA1",
    "#577590",
    "#4D908E",
    "#43AA8B",
    "#90BE6D",
    "#F9C74F",
    "#F9844A",
    "#F8961E",
    "#F3722C",
  ],

  ["#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D", "#43AA8B", "#577590"],
  ["#ee4181", "#fa6425", "#fbe61b", "#93b82d", "#108dad", "#108dad", "#108dad", "#108dad", "#108dad", "#108dad"],
  ["#03071E", "#370617", "#6A040F", "#9D0208", "#D00000", "#DC2F02", "#E85D04", "#F48C06", "#FAA307", "#FFBA08"],
  ["#606C38", "#283618", "#FEFAE0", "#DDA15E", "#BC6C25"],
  ["#F4F1DE", "#E07A5F", "#3D405B", "#81B29A", "#F2CC8F"],
  ["#70D6FF", "#FF70A6", "#FF9770", "#FFD670", "#E9FF70"],
  ["#001219", "#005F73", "#0A9396", "#94D2BD", "#E9D8A6", "#EE9B00", "#CA6702", "#BB3E03", "#AE2012", "#9B2226"],
  ["#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"],
  ["#004B23", "#006400", "#007200", "#008000", "#38B000", "#70E000", "#9EF01A", "#CCFF33"],
  ["#FF7B00", "#FF8800", "#FF9500", "#FFA200", "#FFAA00", "#FFB700", "#FFC300", "#FFD000", "#FFDD00", "#FFEA00"],
  ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93"],
  ["#4D9DE0", "#E15554", "#E1BC29", "#3BB273", "#7768AE"],
];

const cssBuilder = {
  /**
   * this generates a css string that can be applied to style.background to
   * give a striped appearanmce
   * @param {number} spacing the gap between lines in px. defaults to 20px
   * @param {number} set there is a const which is an array of a bunch of colors
   * this is what set is chosen
   * @param {colors string} darkColor option to choose a different dark colors. defaults to a grey
   * @param {number} angle option to define the angle. defaults to 45
   * @returns css string that can be applied to style.background
   */
  rainbowStripesCSS(spacing, set, darkColor, angle) {
    // set up some defaults
    spacing = spacing ? spacing : 20;
    set = set ? set : 0;
    darkColor = darkColor ? darkColor : "var(--dark)";
    angle = angle ? angle : "-45";
    // init
    let earlycss = "";
    let finalCSS = "";

    for (let index = 0; index < colorSets[set].length; index++) {
      // this is the code I finally devised that does the job
      let num1 = spacing * 0 + spacing * index * 2;
      let num2 = spacing + index * spacing * 2;
      let num3 = spacing * 2 + index * spacing * 2;
      //
      let newText = "";
      //build the string
      newText += `${colorSets[set][index]} ${num1}px, `;
      newText += `${colorSets[set][index]} ${num2}px,`;
      newText += `${darkColor} ${num2}px, `;
      newText += `${darkColor} ${num3}px`;
      newText += index < colorSets[set].length - 1 ? "," : "";
      earlycss += newText;
    }
    //supply the finalised css
    finalCSS = `repeating-linear-gradient(${angle}deg, ${earlycss})`;
    return finalCSS;
  },
};

// this just sets up an unnessecary things where clicking the version number cycles the colorurs

document.getElementById("versionDivID").addEventListener("click", () => swapColors());

let colorCycler = 2;

function swapColors() {
  colorCycler = colorCycler % colorSets.length;
  document.getElementById("bodyDivID").style.background = cssBuilder.rainbowStripesCSS(20, colorCycler);
  colorCycler += 1;
}
swapColors();

let numberMap = new Map();

numberMap.set(0, "🯰");
numberMap.set(1, "🯱");
numberMap.set(2, "🯲");
numberMap.set(3, "🯳");
numberMap.set(4, "🯴");
numberMap.set(5, "🯵");
numberMap.set(6, "🯶");
numberMap.set(7, "🯷");
numberMap.set(8, "🯸");
numberMap.set(9, "🯹");

function numberToDigital(number) {
  let digitalNumber = "";
  let splitNum = [...(number + "")].map((n) => +n);
  for (let index = 0; index < splitNum.length; index++) {
    digitalNumber += numberMap.get(splitNum[index]);
  }
  return `<notoSymbol2>${digitalNumber}</notoSymbol2>`;
}
