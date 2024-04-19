// crime committer 4

// set the version
const ccVersion = 0.1;
const ccCode = "🡼dank.alpha";
//and apply it
document.getElementById("versionDivID").innerText = `v${ccVersion}${ccCode}`;

// this object contains a lot of global values
let global = {
  refreshRate: 61.8 / 2, //phi divided by 2, means values accumulate in an unrepeating fashion
  precision: 4, // precision on floats
  bodyDiv: document.getElementById("bodyDivID"),
};

const common = {
  /**
   * passed an array, it looks for the property "type", and tries to find
   * the index of it, or returns null
   * @param {array} is the passed array
   * @param {searchType} is the value in the "type":"value" pair
   * @returns the index of the item in the array
   * ot null if none (rather than -1)
   */
  getIndexInArrayFromType(array, searchType) {
    let index = array.findIndex((obj) => obj.type === searchType);
    index = index == -1 ? null : index;
  },
  /**
   * normalises data into arrays so I can supply either 1 value or 2
   * but don't have to be careful about making sure single variables
   * are arrays
   * @param {*} data is either a single variable or array of variables
   * @returns {array} always an array, even if single element
   */
  normaliseData(data) {
    return Array.isArray(data) ? data : [data];
  },
  /**
   *  returns the css required to make a progress bar
   * @param {number} progress this is supplied as a 0-1
   * @param {color} blankColor will default to black
   * @param {color} fillColor will default to white
   */
  cssProgressBar(progress, blankColor, fillColor) {
    progress *= 100;
    blankColor = blankColor || "black";
    fillColor = fillColor || "white";
    let css = "";
    css += `linear-gradient(90deg, ${fillColor} 0%,${fillColor} ${progress}%,${blankColor} ${progress}%,${blankColor} 100%)`;
    return css;
  },
  formatTime(timeInMS) {
    if (timeInMS == false) {
      return "";
    }
    let formattedTime = "";
    let timeUntilComplete = 0;
    timeUntilComplete = dayjs.duration(dayjs(timeInMS), "millisecond");
    timeUntilComplete.years = timeUntilComplete.format("YY");

    timeUntilComplete.months = timeUntilComplete.format("M");
    timeUntilComplete.days = timeUntilComplete.format("D");
    timeUntilComplete.hours = timeUntilComplete.format("H");
    timeUntilComplete.minutes = timeUntilComplete.format("mm");
    timeUntilComplete.seconds = timeUntilComplete.format("ss");
    timeUntilComplete.milliseconds = timeUntilComplete.format("SSS");

    if (timeUntilComplete.years > 0) {
      formattedTime += timeUntilComplete.years + "y "; // + timeUntilComplete.months + "mo ";
    }

    if (timeUntilComplete.months > 0) {
      formattedTime += timeUntilComplete.months + "mo ";
    }

    if (timeUntilComplete.days > 0) {
      formattedTime += timeUntilComplete.days + "d " + timeUntilComplete.hours + "h " + timeUntilComplete.minutes + "m ";
    } else if (timeUntilComplete.hours > 0) {
      formattedTime += timeUntilComplete.hours + "h " + timeUntilComplete.minutes + "m ";
    } else if (timeUntilComplete.minutes > 0) {
      formattedTime += timeUntilComplete.minutes + "m ";
    }
    formattedTime += timeUntilComplete.seconds + "s";
    if (timeInMS < 10000) {
      formattedTime += " " + timeUntilComplete.milliseconds + "ms";
    }
    return formattedTime;
  },
};

// init

//
//
// init the array of widgets
let elementGroupArray = [];
// fill the array
for (let index = 0; index < modularContentData.length; index++) {
  // make a new object and assign into the array
  elementGroupArray[index] = new modularGenericElementGroup(index);
  // pass object into the builder
  modularBuilder.buildElementGroup(elementGroupArray[index]);
}

for (let index = 0; index < elementGroupArray.length; index++) {
  global.bodyDiv.appendChild(elementGroupArray[index].elements.container);
}
