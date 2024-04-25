/* this is a bit of a new approach
going to perhaps try and make these as independend of any other functions 
I've already made.

the overall idea is to have some kind of widget builder and two kinds of data
one kind of data is structure. this is where I define the different "types" of widgets
eg crime vs research vs resource
the other is content data, this will first off state type of widget, and then the content

a longer term question is whether or not I will let myself determine functionality from the content data
eg.. a crime, but it needs a minimum number of people to run. 
I'd like to this by having optional properties

and what this should potentially mean is extending the generic class with mixins
for different functionality

going to try and do JSDoc as much as I can
stay consistent with namings
*/

//
// this is an object with methods that construct the overall widget

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

class playerDataClass {
  constructor() {
    this.money = 0;
    this.moneyCumulative = 0;
    this.dateTimeStarted = dayjs();
  }
  addMoney(amount) {
    this.money += amount;
    this.moneyCumulative += amount;
    global.updateMoney();
  }
  subMoney(amount) {
    if (this.money < amount) return -1;
    this.money -= amount;
    global.updateMoney();
  }
}

class inventoryClass {
  constructor() {
    this.inventory = [];
    for (let index = 0; index < inventoryData.length; index++) {
      this.inventory[index] = {};
      this.inventory[index].type = inventoryData[index].type;
      this.inventory[index].quantity = 0;
      this.inventory[index].quantityCumulative = 0;
    }
  }
  checkInventory(type) {
    const index = this.getIndexByType(type);
    if (index == null || index == -1) return index;
    return this.inventory[index].quantity;
  }
  /**
   * this is passed an array of objects (or they're normalised into an array)
   * and adds them, and allows for variable amounts
   * @param {array} yieldArray
   */
  addInventoryByArray(yieldArray) {
    yieldArray = common.normaliseData(yieldArray);
    for (let index = 0; index < yieldArray.length; index++) {
      const type = yieldArray[index].type;
      const quantityArray = common.normaliseData(yieldArray[index].quantity);
      let finalQuantity = 0;
      if (quantityArray[1]) {
        const min = Math.min(quantityArray[0], quantityArray[1]);
        const max = Math.max(quantityArray[0], quantityArray[1]);
        const random = Math.random();
        const diff = Math.abs(max - min);
        finalQuantity = Math.round(random * diff + min);
      } else {
        finalQuantity = quantityArray[0];
      }
      this.addInventoryByType(type, finalQuantity);
      // console.log(inventoryIndex);
    }
  }
  /**
   * this method doesn't allow for arrays of amounts
   * @param {string} type
   * @param {number} amount
   * @returns null if bad input and -1 if can't find index
   */
  addInventoryByType(type, amount) {
    const index = this.getIndexByType(type);
    if (index == null || index == -1) return index;
    if (type == "money") {
      player.addMoney(amount);
    }
    this.inventory[index].quantity += amount;
    this.inventory[index].quantityCumulative += amount;
    console.log(`Inventory: ${type} +${amount}`);
  }
  subInventory(type, amount) {
    const index = this.getIndexByType(type);
    if (index == null || index == -1) return index;
    if (this.inventory[index].quantity < amount) return "notEnough";
    this.inventory[index].quantity -= amount;
    console.log(`Inventory: ${type} -${amount}`);
    return this.inventory[index].quantity;
  }
  getIndexByType(type) {
    if (!type) return null;
    for (let index = 0; index < inventoryData.length; index++) {
      if (inventoryData[index].type == type) {
        return index;
      }
    }
    return -1;
  }
}

class criminalsClass {
  constructor() {
    this.number = 1;
  }
}

/**
 * this is the new one
 */
const moduleBuilder = {
  /**
   * starts going through the metadata and switches
   */
  start() {
    for (let index = 0; index < gameMetadata.length; index++) {
      switch (gameMetadata[index].type) {
        case "staticCrime":
          this.staticCrimeModule(staticCrimesData);
      }
    }
  },
  /**
   *
   * @param {string OR array of strings} additionalClasses
   */
  createDiv(additionalClasses) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("elementGroup");
    if (additionalClasses) {
      additionalClasses = common.normaliseData(additionalClasses);
      for (let index = 0; index < additionalClasses.length; index++) {
        newDiv.classList.add(additionalClasses[index]);
      }
    }
    return newDiv;
  },
  createHeaderDiv(text) {
    const newDiv = this.createDiv("elementGroupHeader");
    newDiv.innerText = text;
    return newDiv;
  },
  createSubHeaderDiv() {
    const newDiv = this.createDiv("elementGroupSubHeader");
    return newDiv;
  },
  createContainterDiv() {
    const newDiv = this.createDiv("elementGroupContainer");
    return newDiv;
  },
  createProgressBarDiv() {
    const newDiv = this.createDiv("elementGroupProgressBar");
    return newDiv;
  },
  createProgressTextDiv() {
    const newDiv = this.createDiv("elementGroupProgressText");
    return newDiv;
  },
  createCheckButtonDiv() {
    const newDiv = this.createDiv("elementGroupCheckButton");
    return newDiv;
  },

  staticCrimeModule(staticCrimeDataSet) {
    // instancesArray = common.normaliseData(instancesArray);
    // for (let index = 0; index < instancesArray.length; index++) {

    for (let index = 0; index < staticCrimeDataSet.length; index++) {
      // make a static crime

      const dataSet = staticCrimeDataSet[index];
      const uid = dataSet.uid;
      let newModule = new moduleClass("staticCrime", uid);

      // reference the dataset here, makes easy
      newModule.dataSet = dataSet;
      // console.log(`static crime module: ${uid}  ${dataIndex}`);

      // create DIVs
      newModule.elements.container = this.createContainterDiv();
      newModule.elements.header = this.createHeaderDiv(dataSet.displayName);
      newModule.elements.subHeaderReq = this.createSubHeaderDiv();
      newModule.elements.subHeaderNet = this.createSubHeaderDiv();
      newModule.elements.progressBar = this.createProgressBarDiv();
      newModule.elements.checkButton = this.createCheckButtonDiv();
      newModule.elements.progressText = this.createProgressTextDiv();

      // add req and new html
      // const reqHTML = this.createReqNetHTML(newModule, "req");
      // const netHTML = this.createReqNetHTML(newModule, "net");
      // newModule.elements.subHeaderReq.innerHTML = reqHTML;
      // newModule.elements.subHeaderNet.innerHTML = netHTML;

      newModule.elements.checkButton.innerHTML = "<notoSymbol3>⮔</notoSymbol3>";
      newModule.elements.checkButton.setAttribute("data-checkState", "off");

      newModule.elements.subHeaderNet.classList.add("borderLeft");

      // set locations
      newModule.elements.container.style.gridTemplateColumns = "repeat (4,1fr)";
      newModule.elements.container.style.gridTemplateRows = "1fr 1fr 1fr 1fr";
      newModule.elements.header.style.gridRow = "1";
      newModule.elements.header.style.gridColumn = "1 / span 4";
      newModule.elements.subHeaderReq.style.gridRow = "4";
      newModule.elements.subHeaderReq.style.gridColumn = "1 / span 2";
      newModule.elements.subHeaderNet.style.gridRow = "4";
      newModule.elements.subHeaderNet.style.gridColumn = "3 / span 2";
      newModule.elements.progressBar.style.gridRow = "2";
      newModule.elements.progressBar.style.gridColumn = "1 / span 3";
      newModule.elements.checkButton.style.gridRow = "2";
      newModule.elements.checkButton.style.gridColumn = "4";
      newModule.elements.progressText.style.gridRow = "3";
      newModule.elements.progressText.style.gridColumn = "1 / span 4";

      // append
      newModule.elements.container.appendChild(newModule.elements.header);
      newModule.elements.container.appendChild(newModule.elements.subHeaderReq);
      newModule.elements.container.appendChild(newModule.elements.subHeaderNet);
      newModule.elements.container.appendChild(newModule.elements.progressBar);
      newModule.elements.container.appendChild(newModule.elements.checkButton);
      newModule.elements.container.appendChild(newModule.elements.progressText);

      moduleArray.push(newModule);
    }
  },
  getDataIndexByUID(type, uid) {
    let dataArrayToSearch = null;
    switch (type) {
      case "staticCrime":
        dataArrayToSearch = staticCrimesData;
        break;
      default:
        return null;
    }
    for (let index = 0; index < dataArrayToSearch.length; index++) {
      // console.log(`getdataindex  ${uid}  ${dataArrayToSearch[index].uid}`);
      if (dataArrayToSearch[index].uid == uid) {
        return index;
      }
    }
    return -1;
  },
  /**
   * takes the dataset, and generates some html
   * @param {*} dataSet array of objects
   * @param {*} type "req" or "net" (anything except req is net)
   * @returns html
   */
  createReqNetHTML(moduleObject, type) {
    type = type == "req" ? "req" : "net";
    let newHTML = "";
    const personSymbol = "🯅";
    // get number of criminals needed
    criminals = moduleObject.dataSet.criminals ? dataSet.criminals : 1;

    let localSet = [];

    // set the text before going through the list
    if (type == "req") {
      newHTML += "<reqNet>required:<br>";
      newHTML += `<notoSymbol3>${personSymbol.repeat(criminals)}</notoSymbol3><br>`;
      localSet = moduleObject.dataSet.req ? common.normaliseData(dataSet.req) : null;
    } else {
      newHTML += "<reqNet>net:</reqNet><br>";
      localSet = moduleObject.dataSet.net ? common.normaliseData(dataSet.net) : null;
      // console.log(`net ${dataSet.net}`);
    }
    if (localSet) {
      for (let index = 0; index < localSet.length; index++) {
        localSet2 = localSet[index];
        newHTML += `${localSet2.type}`;
        if (localSet2.quantity > 1) {
          newHTML += `${localSet2.quantity}`;
        }
        newHTML += `<br>`;
      }
    }

    newHTML += `</reqNet>`;
    // console.log(`${type}     ${localSet}`);
    return newHTML;
    //
  },
};

class moduleClass {
  constructor(type, uid) {
    this.type = type;
    this.uid = uid;
    this.dataSet = undefined;
    this.state = "virgin";
    this.autoState = false;
    this.elements = {};
    this.data = {};
    this.data.progress = 0;
    this.visible = false;
    this.display = true;
    this.req = [{}];
    this.net = [{}];
    this.intervalTimer = null;
  }

  init() {
    this.buildReqNet();
    this.updateReqNet(true);
    this.updateReqNet(false);
    this.setEventListeners();
  }

  setEventListeners() {
    this.elements.checkButton.addEventListener("click", () => this.toggleAutoState());
    this.elements.header.addEventListener("click", () => this.startStop());
  }

  // run after initialisation, builds reqs and nets as normalised
  // array in the object, so later can highlight if meets reqs
  buildReqNet() {
    // set up reqs. make null if none
    if (this.dataSet.req == undefined) {
      this.req = null;
    } else {
      // have determines reqs exist
      // normalise
      const localReqs = common.normaliseData(this.dataSet.req);
      // if just single word and not object, set reqs as single length
      // array with that data
      for (let index = 0; index < localReqs.length; index++) {
        if (typeof localReqs[index] == "string") {
          this.req[index].type = localReqs[index];
          this.req[index].quantity = 1;
        } else {
          this.req[index] = {};
          this.req[index].type = localReqs[index].type;
          this.req[index].quantity = localReqs[index].quantity;
        }
      }
    }

    // bad practice I am sure but I've just copied and pasted but chanegd from req to net
    if (this.dataSet.net == undefined) {
      this.net = null;
    } else {
      // have determines reqs exist
      // normalise
      const localNets = common.normaliseData(this.dataSet.net);
      // if just single word and not object, set reqs as single length
      // array with that data

      for (let index = 0; index < localNets.length; index++) {
        if (typeof localNets[index] == "string") {
          this.net[index].type = localNets[index];
          this.net[index].quantity = 1;
        } else {
          this.net[index] = {};
          this.net[index].type = localNets[index].type;
          this.net[index].quantity = localNets[index].quantity;
        }
      }
    }
  }

  updateReqNet(type) {
    type = type == true ? "req" : "net";
    let newHTML = "";
    const personSymbol = "🯅";
    // get number of criminals needed
    let criminals = this.dataSet.criminals ? this.dataSet.criminals : 1;

    let localSet = [];

    // set the text before going through the list
    if (type == "req") {
      newHTML += "<reqNet>required:<br>";
      newHTML += `<notoSymbol3>${personSymbol.repeat(criminals)}</notoSymbol3><br>`;
      newHTML += `<minusLineHeight></minusLineHeight>`;
      localSet = this.req ? this.req : null;
    } else {
      newHTML += "<reqNet>net:</reqNet><br>";
      localSet = this.net ? this.net : null;
    }

    if (localSet) {
      for (let index = 0; index < localSet.length; index++) {
        let localSet2 = localSet[index];
        newHTML += `${localSet2.type}`;

        if (Array.isArray(localSet2.quantity)) {
          newHTML += ` x${localSet2.quantity[0]}-${localSet2.quantity[1]}`;
        } else {
          newHTML += localSet2.quantity == 1 ? "" : " x" + localSet2.quantity;
        }

        newHTML += `<br>`;
      }
    }
    newHTML += `</reqNet>`;
    if (type == "req") {
      this.elements.subHeaderReq.innerHTML = newHTML;
    } else {
      this.elements.subHeaderNet.innerHTML = newHTML;
    }
  }

  toggleAutoState() {
    if (this.autoState == false) {
      this.elements.checkButton.setAttribute("data-checkState", "on");
      this.autoState = true;
    } else {
      this.elements.checkButton.setAttribute("data-checkState", "off");
      this.autoState = false;
    }
  }

  /**
   * this asks the module to redraw
   * idea is this is called every anim frame, just to redraw the gfx
   * won't run unless the module is "running", or if forced (useful
   * for redrawing immediately after a pause or complete for ex)
   * @param {boolean} force
   */
  redraw(force) {
    if (force == true || this.state == "running") {
      // logic for redrawing progress bars
      // and numbers
      const progress = this.calcProgress();
      const newProgressCss = common.cssProgressBar(progress);
      this.elements.progressBar.style.background = newProgressCss;
    }
  }
  calcProgress() {
    const durationMS = this.dataSet.durationMS ? this.dataSet.durationMS : 10000;
    return this.data.progress / durationMS;
  }

  startStop() {
    switch (this.state) {
      case "running":
        this.state = "paused";
        clearInterval(this.intervalTimer);
        break;
      case "virgin":
      case "paused":

      case "completed":
        setInterval(() => this.running(), global.refreshRate);
        this.state = "running";
        break;
    }
  }

  running() {
    this.progress += global.refreshRate;
    if (this.progress > this.dataSet.durationMS) {
      this.completed();
    }
  }

  completed() {
    this.progress = 0;
    if (this.toggleAutoState == true) {
    } else {
      clearInterval(this.intervalTimer);
      this.state = "completed";
    }
  }
}
