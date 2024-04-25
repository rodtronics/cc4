// crime committer 4

// set the version
const ccVersion = 0.2;
const notoSymbol = "<notoSymbol>🢅</notoSymbol>";
const ccCode = "dank.alpha";
//and apply it
document.getElementById("versionDivID").innerHTML = `v${ccVersion}${notoSymbol} ${ccCode}`;

// this object contains a lot of global values
let global = {
  refreshRate: 61.8 / 2, //phi divided by 2, means values accumulate in an unrepeating fashion
  precision: 4, // precision on floats
  bodyDiv: document.getElementById("bodyDivID"),
  infoDiv: document.getElementById("infoDivID"),

  updateMoney() {
    let money = player.money.toFixed(0).toLocaleString();
    this.infoDiv.innerHTML = `$${money}`;
  },
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
    // console.log(`${array}  ${searchType}`);
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
    blankColor = blankColor || "var(--dark)";
    fillColor = fillColor || "transparent";
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
  /**
   * takes two values and returns a random value in between
   * @param {number} lower lower value
   * @param {number} upper upper valre
   * @returns
   */
  randomFromRange(lower, upper) {
    if (!lower || !upper) {
      return null;
    }
    const min = Math.min(lower, upper);
    const max = Math.max(lower, upper);
    const random = Math.random();
    const diff = Math.abs(max - min);
    const answer = Math.round(random * diff + min);
    return answer;
  },
  /**
   * given an array of objects, it returns the index of the object
   * where the type property matches the type value given
   * @param {array} array of objects
   * @param {string} type the value to try and match with type property
   * @returns the index if found, -1 if can't find the matching object, or null if parameters bad
   */
  getIndexByType(array, type) {
    if (!Array.isArray(array) || !type) return null;
    for (let index = 0; index < array.length; index++) {
      if (array[index].type === type) {
        return index;
      }
      return -1;
    }
  },
};

const modal = {
  modalOuter: document.getElementById("modalOuterID"),
  modalContainer: document.getElementById("modalContainerID"),
  showModal(index) {
    const elementGroupObject = elementGroupArray[index];
    const type = modularContentData[index].type;
    let innerHTML = "";
    switch (type) {
      case "crime":
        const displayName = modularContentData[index].displayName;
        const description = modularContentData[index].description || "";
        innerHTML = `<h1>${displayName}</h1><br><br>${description}`;
    }
    this.modalContainer.innerHTML = innerHTML;
    this.modalOuter.style.display = "block";
  },
  closeModal() {
    this.modalOuter.style.display = "none";
  },
};
modal.modalOuter.addEventListener("click", () => modal.closeModal());

/*

INITILISATIONSSS */

//player init
let player = new playerDataClass();
// inventory init
let inventory = new inventoryClass();
//module init
let moduleArray = [];
moduleBuilder.start();

for (let index = 0; index < moduleArray.length; index++) {
  moduleArray[index].init();
}

// tab
const tabDiv = document.getElementById("tabDivID");
makePrimaryTabs(tabDiv);
setActiveTab(0);

for (let index = 0; index < moduleArray.length; index++) {
  global.bodyDiv.appendChild(moduleArray[index].elements.container);
}
