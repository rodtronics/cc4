// deprecated:

const modularBuilder = {
  // this is the main called function
  buildElementGroup(elementGroupObject) {
    let index = elementGroupObject.index;
    let type = modularContentData[index].type;

    let columns = 2;
    let rows = 4;
    let containerElement = null;
    // these sections are common to all
    // make the container
    elementGroupObject.elements.container = this.createDiv();
    containerElement = elementGroupObject.elements.container;
    elementGroupObject.elements.container.classList.add("elementGroupContainer");
    // make the header and attach
    elementGroupObject.elements.header = this.createDiv();
    elementGroupObject.elements.header.classList.add("elementGroupHeader");
    elementGroupObject.elements.header.innerText = modularContentData[index].displayName;
    containerElement.appendChild(elementGroupObject.elements.header);

    // elementGroupObject.elements.header.addEventListener("click", () => elementGroupObject.go());
    elementGroupObject.elements.header.addEventListener("click", () => modal.showModal(index));

    switch (type) {
      case "crime":
        // progress bar
        elementGroupObject.elements.progressBar = this.createProgressBar();
        elementGroupObject.elements.progressText = this.createDiv();
        // progess text
        elementGroupObject.elements.progressText.classList.add("elementGroupProgressText", "relativeAndShift");
        // add sub buttons
        elementGroupObject.elements.add = this.createAddSub("add");
        elementGroupObject.elements.add.style.gridColumn = 3;
        elementGroupObject.elements.add.style.gridRow = 4;
        elementGroupObject.elements.add.setAttribute("data-state", "active");

        elementGroupObject.elements.sub = this.createAddSub("sub");
        elementGroupObject.elements.sub.style.gridColumn = 1;
        elementGroupObject.elements.sub.style.gridRow = 4;
        elementGroupObject.elements.sub.setAttribute("data-state", "inactive");
        elementGroupObject.elements.sub.addEventListener("click", () => elementGroupObject.sub());
        // create counter
        elementGroupObject.elements.counter = this.createDiv();
        elementGroupObject.elements.counter.classList.add("elementGroupCounter");
        elementGroupObject.elements.counter.style.gridColumn = 2;
        elementGroupObject.elements.counter.style.gridRow = 4;
        elementGroupObject.elements.counter.innerText = elementGroupObject.data.numCommitters;
        elementGroupObject.elements.add.addEventListener("click", () => elementGroupObject.add());

        containerElement.appendChild(elementGroupObject.elements.progressText);
        containerElement.appendChild(elementGroupObject.elements.progressBar);
        containerElement.appendChild(elementGroupObject.elements.add);
        containerElement.appendChild(elementGroupObject.elements.sub);
        containerElement.appendChild(elementGroupObject.elements.counter);

        break;
      case "robbery":
        // add progress bar

        elementGroupObject.elements.crimeContainer = this.createDiv();
        elementGroupObject.elements.crimeContainer.classList.add("elementGroupSubContainerFlex");
        elementGroupObject.elements.crimeContainer.style.display = "flex";
        elementGroupObject.elements.crimeContainer.style.flexDirection = "column";

        // elementGroupObject.elements.container.style.display = "flex";
        elementGroupObject.elements.container.style.display = "grid";

        elementGroupObject.elements.container.style.flexDirection = "column";
        elementGroupObject.elements.container.style.justifyContent = "flex-start";
        elementGroupObject.elements.container.style.alignItems = "centre";

        elementGroupObject.elements.container.style.height = "600px";
        // elementGroupObject.elements.container.style.minHeight = "300px";

        elementGroupObject.elements.progressBar = this.createProgressBar();
        elementGroupObject.elements.container.style.gridTemplateColumns = "1fr";
        elementGroupObject.elements.container.style.gridTemplateRows = "60px 50px 40px 1fr";

        // this is for countdown
        elementGroupObject.elements.progressText = this.createDiv();
        elementGroupObject.elements.progressText.classList.add("elementGroupProgressText");
        Object.assign(elementGroupObject, robberyMixin);

        elementGroupObject.elements.container.appendChild(elementGroupObject.elements.progressText);
        elementGroupObject.elements.container.appendChild(elementGroupObject.elements.progressBar);
        elementGroupObject.elements.container.appendChild(elementGroupObject.elements.crimeContainer);

        elementGroupObject.init();
    }
  },

  createDiv() {
    const newDiv = document.createElement("div");
    newDiv.classList.add("elementGroup");
    return newDiv;
  },
  createProgressBar() {
    const newDiv = this.createDiv();
    newDiv.classList.add("elementGroupProgressBar");
    return newDiv;
  },
  /**
   *
   * @param {*} polarity this value is stored in the data-polarity
   *  attribute in the element
   */
  createAddSub(polarity) {
    const newDiv = this.createDiv();
    newDiv.classList.add("elementGroupAddSub");
    newDiv.setAttribute("data-polarity", polarity);
    const innerHTML = polarity == "add" ? "<notoSymbol>🢅</notoSymbol>" : "<notoSymbol>🢇</notoSymbol>";
    newDiv.innerHTML = innerHTML;
    return newDiv;
  },
};
/**
 *  this will be assigned to the object
 */
let robberyMixin = {
  init() {
    this.robberysArray = [];
    this.nextRobberyProgress = 0;
    this.nextRobberyProgressEnd = 0;
    this.nextRobberyTimer = null;
    this.currentTimer = false;
    this.numOfVisibleRobberies = 0;
    this.nextRobberyOpportunity();
  },
  nextRobberyOpportunity() {
    const randomFloat = Math.random();
    const arrayLength = modularContentData[this.index].potentialRobberies.length;
    const newRobberyIndexFromModule = Math.floor(arrayLength * randomFloat);
    // console.log(`${arrayLength}  ${newRobberyIndexFromModule}`);

    const newWaitMS = common.randomFromRange(modularContentData[this.index].timeRangeToShow[0], modularContentData[this.index].timeRangeToShow[1]);
    //init the progress
    this.nextRobberyProgress = 0;
    this.nextRobberyProgressEnd = newWaitMS;
    // console.log(`${this.nextRobberyProgress}  ${this.nextRobberyProgressEnd}`);

    // get which kind of robbery, it's random

    this.nextRobberyChoiceIndex = newRobberyIndexFromModule;
    this.nextRobberyTimer = setInterval(() => this.waitForOpportunity(), global.refreshRate);
  },

  waitForOpportunity() {
    this.currentTimer = true;
    this.nextRobberyProgress += global.refreshRate;
    // console.log(this.nextRobberyProgress);
    const progress = this.nextRobberyProgress / this.nextRobberyProgressEnd;
    const msLeft = this.nextRobberyProgressEnd - this.nextRobberyProgress;
    this.updateProgressBar(progress);

    // why this not working?

    this.elements.progressText.innerHTML = "next opportunity:<br>" + common.formatTime(msLeft);
    if (msLeft < 0) {
      clearInterval(this.nextRobberyTimer);
      // this.nextRobberyTimer = null;

      this.addNewRobbery();
    }
  },

  robberiesAddOne() {
    this.numOfVisibleRobberies += 1;

    if (this.numOfVisibleRobberies < 5 && this.numOfVisibleRobberies >= 0) {
      clearInterval(this.nextRobberyTimer);

      // nextRobberyTimer = null;
      this.currentTimer = true;
      this.nextRobberyOpportunity();
    } else {
      clearInterval(this.nextRobberyTimer);

      this.elements.progressText.innerHTML = "no opportunities";
    }
  },

  robberiesSubOne() {
    this.numOfVisibleRobberies -= 1;
    if (this.currentTimer == false) {
      this.nextRobberyOpportunity();
    }
  },

  addNewRobbery() {
    clearInterval(this.nextRobberyTimer);
    this.currentTimer = false;
    if (this.numOfVisibleRobberies > 4) {
      return;
    }
    this.robberysArray.push(new robberyClass(this, this.nextRobberyChoiceIndex));
    this.robberiesAddOne();
  },
};

class robberyClass {
  /**
   *
   * @param {obj} parentObj the parent holding this
   * @param {number} robberyIndex the index within the robbery module to provide data about what kind of robbery this is
   */
  constructor(parentObj, robberyIndex) {
    this.indexInParent = parentObj.robberysArray.length;
    this.parentObj = parentObj;

    this.elements = {};
    this.robberyIndex = robberyIndex;

    this.opportunityProgressEnd = common.randomFromRange(robberyData[this.robberyIndex].timeRangeToStay[0], robberyData[this.robberyIndex].timeRangeToStay[1]);
    this.opportunityProgress = 0;
    this.opportunityTimer = null;
    this.robberyProgress = null;
    this.robberyProgressEnd = robberyData[robberyIndex].durationMS;
    this.robberyTimer = null;

    this.createElements();
    this.attachElements();
    this.opportunityTimer = setInterval(() => this.runningOpportunity(), global.refreshRate);
  }
  createElements() {
    this.elements.container = modularBuilder.createDiv();
    this.elements.container.classList.add("elementGroupSubContainer");
    this.elements.container.style.display = "grid";
    this.elements.container.style.gridTemplateColumns = "1fr 4fr";
    this.elements.container.style.gridTemplateRows = "40px 40px";
    // this.elements.container.style.gridRow = this.parentObj.numOfVisibleRobberies + 3 + " / span 3";

    // this.elements.header = modularBuilder.createDiv();
    // this.elements.header.classList.add("elementGroupMinorHeader", "thin");

    // this.elements.header.innerText = robberyData[this.robberyIndex].displayName;
    // this.elements.header.style.gridRow = 1;
    // this.elements.container.appendChild(this.elements.header);

    this.elements.progressBar = modularBuilder.createProgressBar();
    this.elements.progressBar.classList.add("elementGroupProgressBar", "subGroup", "robberyProgress");
    this.elements.progressBar.innerText = robberyData[this.robberyIndex].displayName;

    this.elements.progressBar.style.gridRow = "1";
    this.elements.progressBar.style.gridColumn = "1 / span 2";

    this.elements.container.appendChild(this.elements.progressBar);

    this.elements.progressText = modularBuilder.createDiv();
    this.elements.progressText.classList.add("elementGroupProgressText", "thin");
    this.elements.progressText.style.gridRow = "2";
    this.elements.progressBar.style.gridColumn = "2";

    this.elements.goButton1 = modularBuilder.createDiv();
    this.elements.goButton1.classList.add("elementGroupSmallButton", "goButton");

    this.elements.goButton1.style.gridRow = "1";
    this.elements.goButton1.style.gridColumn = "1";
    this.elements.goButton1.innerHTML = "<notoSymbol>🢅</notoSymbol>";

    this.elements.goButton2 = modularBuilder.createDiv();
    this.elements.goButton2.classList.add("elementGroupSmallButton", "noButton");
    this.elements.goButton2.style.gridRow = "2";
    this.elements.goButton2.style.gridColumn = "1";
    this.elements.goButton2.innerHTML = "<notoSymbol>🢃</notoSymbol>";

    this.elements.container.appendChild(this.elements.goButton1);
    this.elements.container.appendChild(this.elements.goButton2);

    this.elements.goButton1.addEventListener("click", () => this.buttonGo());
    this.elements.goButton2.addEventListener("click", () => this.buttonNo());

    // this.elements.container.addEventListener("click", () => this.clicked());
    this.elements.container.appendChild(this.elements.progressText);
  }
  attachElements() {
    this.parentObj.elements.crimeContainer.appendChild(this.elements.container);
  }
  runningOpportunity() {
    this.opportunityProgress += global.refreshRate;
    const progress = this.opportunityProgress / this.opportunityProgressEnd;
    const msLeft = this.opportunityProgressEnd - this.opportunityProgress;
    this.updateProgressBarRobbery(progress, "rgba(255,97,0,0.66)");
    this.elements.progressText.innerHTML = "opportunity gone in<br>" + common.formatTime(msLeft);
    if (this.opportunityProgress > this.opportunityProgressEnd) {
      this.opportunityLost();
      clearInterval(this.opportunityTimer);
    }
  }
  updateProgressBarRobbery(progress, blankColor, fillColor) {
    const css = common.cssProgressBar(progress, blankColor, fillColor);
    this.elements.progressBar.style.background = css;
  }
  buttonGo() {
    clearInterval(this.opportunityTimer);
    this.killButtons();
    this.elements.progressBar.style.gridColumn = "1 / span 2";
    this.robberyTimer = setInterval(() => this.runningRobbery(), global.refreshRate);
  }
  buttonNo() {
    clearInterval(this.opportunityTimer);

    this.destroySelf();
  }
  killButtons() {
    this.elements.goButton1.remove();
    this.elements.goButton2.remove();
    this.elements.goButton1.removeEventListener("click", () => this.buttonGo());
    this.elements.goButton2.removeEventListener("click", () => this.buttonNo());
    this.elements.goButton1 = null;
    this.elements.goButton2 = null;
  }

  runningRobbery() {
    this.robberyProgress += global.refreshRate;
    const progress = this.robberyProgress / this.robberyProgressEnd;
    const msLeft = this.robberyProgressEnd - this.robberyProgress;
    this.updateProgressBarRobbery(progress, "var(--rainbow-D)");
    this.elements.progressText.innerHTML = "robbery done in<br>" + common.formatTime(msLeft);
    if (this.robberyProgress > this.robberyProgressEnd) {
      this.completeRobbery();
      clearInterval(this.robberyTimer);
      this.robberyTimer = null;
    }
  }
  completeRobbery() {
    this.elements.progressText.innerHTML = "click to collect rewards";
    this.updateProgressBarRobbery(1, "white", "var(--rainbow-E)");
    this.elements.container.addEventListener("click", () => this.collectReward());
  }

  opportunityLost() {
    this.elements.progressText.innerHTML = "opportunity lost";
    this.updateProgressBarRobbery(1, "white", "var(--rainbow-C)");

    setTimeout(() => this.destroySelf(), 10000);
  }

  collectReward() {
    this.elements.container.removeEventListener("click", () => this.collectReward());
    const rewardArray = robberyData[this.robberyIndex].yield;
    inventory.addInventoryByArray(rewardArray);
    this.destroySelf();
  }

  destroySelf() {
    this.elements.container.remove();

    this.parentObj.robberiesSubOne();
    // detach all elements
    this.elements = null;

    this.parentObj.robberysArray[this.indexInParent] = null;
  }
}

//
// this is the generic object that all widgets will have
// this may be extended by mixins
class modularGenericElementGroup {
  /**
   * this is the base of any widget
   * @param {*} index
   * @param {*} state basically an enum - virgin, running, paused, finished, waitingReward,cooldown
   * @param {boolean} locked means it can't be used. different from visible
   * @param {boolean} visible means if the element group is displayed at all
   * @param {number} progress this counts up to the base seconds to complete whatever, makes it easy
   */
  constructor(index) {
    this.index = index;
    this.moduleID = modularContentData[index].moduleID;
    this.data = {};
    this.data.numCommitters = 0;
    this.data.state = "virgin";
    this.data.locked = true;
    this.data.visible = true;
    this.data.progress = 0;
    this.data.cooldownProgress = 0;
    this.data.timesCompleted = 0;
    this.elements = {};
    this.elements.container = null;
    this.elements.header = null;
    this.elements.progressBar = null;
    this.elements.progressText = null;
    this.elements.add = null;
    this.elements.sub = null;
    this.elements.counter = null;
    this.timerFunction = null;
  }
  // this will be called if page reloads etc
  resume() {
    if (this.data.numCommitters > 0) {
      this.data.state = "running";
      this.timerFunction = setInterval(() => this.running(), global.refreshRate);
    }
  }
  titleClicked() {}
  add() {
    this.data.numCommitters += 1;
    this.updateCount();
    if (!this.timerFunction) {
      this.elements.sub.setAttribute("data-state", "active");
      this.data.state = "running";
      this.timerFunction = setInterval(() => this.running(), global.refreshRate);
    }
  }
  sub() {
    if (this.data.numCommitters < 1) {
      return;
    }
    this.data.numCommitters -= 1;

    this.updateCount();
    if (this.data.numCommitters < 1) {
      if (this.data.cooldownProgress > 0) {
        this.elements.sub.setAttribute("data-state", "inactive");

        return;
      }
      this.paused();
      clearInterval(this.timerFunction);
      this.timerFunction = null;
      this.elements.sub.setAttribute("data-state", "inactive");
    }
  }
  updateCount() {
    this.elements.counter.innerText = this.data.numCommitters;
  }
  paused() {
    this.data.state = "paused";
    this.elements.progressText.innerText = "paused";
    const progress = this.data.progress / modularContentData[this.index].durationMS;
    this.updateProgressBar(progress, "rgb(140,140,140)");
  }
  running() {
    this.data.progress += global.refreshRate * this.data.numCommitters;
    const progress = this.data.progress / modularContentData[this.index].durationMS;

    this.updateProgressBar(progress);
    this.updateProgressText();
    if (this.data.progress > modularContentData[this.index].durationMS) {
      this.completed();
    }
  }
  updateProgressBar(progress, blankColor, fillColor) {
    const css = common.cssProgressBar(progress, blankColor, fillColor);
    this.elements.progressBar.style.background = css;
  }
  updateProgressText(text) {
    this.elements.progressText.innerText = text || this.msLeft(true);
  }
  completed() {
    inventory.addInventoryByArray(modularContentData[this.index].yield);
    this.data.progress = 0;
    if (modularContentData[this.index].coolDownMS) {
      clearInterval(this.timerFunction);
      this.data.state = "cooldown";
      this.elements.progressBar.innerText = "cooldown";
      this.timerFunction = setInterval(() => this.cooldown(), global.refreshRate);
    }
  }
  cooldown() {
    this.data.cooldownProgress += global.refreshRate;
    if (this.data.cooldownProgress > modularContentData[this.index].coolDownMS) {
      this.elements.progressBar.innerText = "";
      this.elements.progressText.innerText = "";
      this.elements.progressBar.style.background = "transparent";
      this.data.cooldownProgress = 0;
      clearInterval(this.timerFunction);
      this.timerFunction = null;
      this.resume();
      return;
    }
    const progress = this.data.cooldownProgress / modularContentData[this.index].coolDownMS;
    this.updateProgressBar(progress, "blue");
    this.elements.progressText.innerText = this.msLeftCooldown(true);
  }
  /**
   * returns the milliseconds left until complete
   * if format is true then it'll return a formatted string,
   * else just a number
   * @param {boolean} format if true returns formatted string
   * @returns depends
   */
  msLeft(format) {
    const msLeft = (modularContentData[this.index].durationMS - this.data.progress) / this.data.numCommitters;
    if (format == true) {
      return common.formatTime(msLeft);
    }
    return msLeft;
  }
  msLeftCooldown(format) {
    const msLeft = modularContentData[this.index].coolDownMS - this.data.cooldownProgress;
    if (format == true) {
      return common.formatTime(msLeft);
    }
    return msLeft;
  }
}
// deprecated
const modularContentData = [
  {
    // this one is a bit of a prototype, showing all properties even if not used in this one
    type: "crime",
    subType: undefined,
    displayName: "stealing candy from a baby",
    moduleID: "crime_stealcandy", // must be unique
    description: "it's just another reminder that even the smallest opponents can leave you feeling like a total loser",
    durationMS: 30000,
    yield: [
      { type: "candy", quantity: [0, 2] }, // if the quantity is an array, it means a range
      { type: "sadness", quantity: 1 },
      { type: "money", quantity: [0, 3] },
    ],
    cost: 0,
    requirements: undefined, // undefined means none
    committersRequired: undefined, // if this is 0 or undefined, it'll just be one
    coolDownMS: 5000, // how long to wait before can be done again
    maxCriminals: 0, // if 0 or undefined, it's unlimited
    automatable: true, // can it just repeat itself over and over
    riskLost: 0,
    riskCaught: 0,
  },
  {
    type: "crime",
    description: "",
    displayName: "such a long crime",
    durationMS: 41556952000,
  },
  {
    type: "robbery",
    description: "",
    displayName: "minor robberies",
    durationMS: 41556952000,
    potentialRobberies: ["bus", "test"],
    timeRangeToShow: [2000, 3000],
  },
];

// deprecated
const robberyData = [
  {
    category: 1,
    displayName: "bus",
    description: "you really are going to try and steal change from the bus driver aren't you",
    timeRangeToStay: [120000, 240000],
    durationMS: 1000,
    committersNeeded: 2,
    yield: [
      { type: "candy", quantity: [0, 2] }, // if the quantity is an array, it means a range
      { type: "sadness", quantity: 1 },
      { type: "money", quantity: 0 },
    ],
  },
  {
    category: 1,
    displayName: "florist",
    description: "you really are going to try and steal change from the bus driver aren't you",
    yield: [{ type: "money", quantity: [0, 2] }],
    timeRangeToStay: [120000, 240000],
    durationMS: 1000,
    committersNeeded: 2,
    yield: [
      { type: "candy", quantity: [0, 2] }, // if the quantity is an array, it means a range
      { type: "sadness", quantity: 1 },
      { type: "money", quantity: 0 },
    ],
  },
];
