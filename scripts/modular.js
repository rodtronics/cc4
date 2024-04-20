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
        containerElement.appendChild(elementGroupObject.elements.progressBar);
        elementGroupObject.elements.progressText = this.createDiv();
        // progess text
        elementGroupObject.elements.progressText.classList.add("elementGroupProgressText");
        containerElement.appendChild(elementGroupObject.elements.progressText);
        // add sub buttons
        elementGroupObject.elements.add = this.createAddSub("add");
        elementGroupObject.elements.add.style.gridColumn = 3;
        elementGroupObject.elements.add.style.gridRow = 4;
        elementGroupObject.elements.add.setAttribute("data-state", "active");

        containerElement.appendChild(elementGroupObject.elements.add);

        elementGroupObject.elements.sub = this.createAddSub("sub");
        elementGroupObject.elements.sub.style.gridColumn = 1;
        elementGroupObject.elements.sub.style.gridRow = 4;
        elementGroupObject.elements.sub.setAttribute("data-state", "inactive");
        containerElement.appendChild(elementGroupObject.elements.sub);
        elementGroupObject.elements.sub.addEventListener("click", () => elementGroupObject.sub());
        // create counter
        elementGroupObject.elements.counter = this.createDiv();
        elementGroupObject.elements.counter.classList.add("elementGroupCounter");
        elementGroupObject.elements.counter.style.gridColumn = 2;
        elementGroupObject.elements.counter.style.gridRow = 4;
        elementGroupObject.elements.counter.innerText = elementGroupObject.data.numCommitters;
        containerElement.appendChild(elementGroupObject.elements.counter);
        elementGroupObject.elements.add.addEventListener("click", () => elementGroupObject.add());

        break;
      case "robbery":
        elementGroupObject.elements.robberyCounter = this.createDiv();
        elementGroupObject.elements.container.appendChild(elementGroupObject.elements.robberyCounter);
        elementGroupObject.elements.container.style.gridTemplateColumns = "1fr";
        Object.assign(elementGroupObject, robberyMixin);
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
    this.robberies = [];
    this.nextRobberyChoiceIndex = 0;
    this.nextRobberyTime = 0;
    this.assignNextRobbery();
    this.robberyWatchTimer = null;
    this.robberyCloseTimers = [];
  },
  /**
   * this will be called to make a new robbery
   * @param {*} index this is the index of the reference to the new robbery in the
   * robbery array
   */
  newRobbery(index) {
    localRobbery = {};

    localRobbery.container = modularBuilder.createDiv();
    localRobbery.container.classList.add("elementGroupSubContainer");

    localRobbery.header = modularBuilder.createDiv();
    localRobbery.header.classList.add("elementGroupMinorHeader");
    localRobbery.header.innerText = "header";
    localRobbery.header.style.gridRow = 1;
    localRobbery.container.appendChild(localRobbery.header);

    localRobbery.progressBar = modularBuilder.createProgressBar();
    localRobbery.progressBar.classList.add("elementGroupProgressBar");
    localRobbery.progressBar.style.gridRow = 2;
    localRobbery.container.appendChild(localRobbery.progressBar);

    localRobbery.progressText = modularBuilder.createDiv();
    localRobbery.progressText.classList.add("elementGroupProgressText");
    localRobbery.progressText.style.gridRow = 3;
    localRobbery.container.appendChild(localRobbery.progressText);

    return localRobbery;
  },
  startRobbery(index) {
    localRobbery = this.robberies[index];
  },
  assignNextRobbery() {
    const randomFloat = Math.random();
    const arrayLength = modularContentData[this.index].potentialRobberies.length;
    const newRobberyIndex = Math.floor(randomFloat * arrayLength);
    this.nextRobberyChoiceIndex = newRobberyIndex;
    const newMS = common.randomFromRange(robberyData[newRobberyIndex].timeRangeToShow[0], robberyData[newRobberyIndex].timeRangeToShow[1]);
    this.nextRobberyTime = dayjs().add(dayjs(newMS, "millisecond"));
    const newLiveTimeMS = common.randomFromRange(robberyData[newRobberyIndex].timeRangeToStay[0], robberyData[newRobberyIndex].timeRangeToStay[1]);

    this.robberies.push(this.newRobbery());
    this.robberies[this.robberies.length - 1].timeToClose = dayjs().add(dayjs(newLiveTimeMS, "millisecond"));
    this.robberyWatchTimer = setInterval(() => this.watchNextRobbery(), 123);
  },
  watchNextRobbery() {
    timeLeft = dayjs(this.nextRobberyTime).diff(dayjs());
    if (timeLeft < 0) {
      this.showNextRobbery();
      clearInterval(this.robberyWatchTimer);
      this.robberyWatchTimer = null;
      this.assignNextRobbery();
    }
  },
  showNextRobbery() {
    this.elements.container.appendChild(this.robberies[this.robberies.length - 1].container);
    this.robberyCloseTimers.push(
      setInterval(() => this.watchCloseRobbery(this.robberies.length - 1), this.robberyCloseTimers.length - 1),
      1000
    );
  },
  watchCloseRobbery(index, selfIndex) {
    timeLeft = dayjs(this.robberies[index].timeToClose).diff(dayjs());
    this.robberies[this.robberies.length - 1].element.robberyCounter.innerText = common.formatTime(timeLeft);

    if (timeLeft < 0) {
      clearInterval(this.robberyCloseTimers[selfIndex]);
      this.robberyCloseTimers[selfIndex] = null;
      this.discardRobbery(index);
    }
    console.log(timeLeft);
  },
  discardRobbery(robberyIndex) {
    this.robberies[robberyIndex].container.parentNode.removeChild(his.robberies(robberyIndex).container);
    this.robberies[robberyIndex].forEach((element) => {
      element = null;
    });
  },
  robberyComplete(index) {},
};

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
    this.data.progress = 0;
    if (modularContentData[this.index].coolDownMS) {
      clearInterval(this.timerFunction);
      this.data.state = "cooldown";
      this.elements.progressBar.innerText = "cooldown";
      this.timerFunction = setInterval(() => this.cooldown(), global.refreshRate);
    }
  }
  cooldown() {
    console.log("cool");
    this.data.cooldownProgress += global.refreshRate;
    if (this.data.cooldownProgress > modularContentData[this.index].coolDownMS) {
      this.elements.progressBar.innerText = "";
      this.elements.progressText.innerText = "";
      this.elements.progressBar.style.background = "white";
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
    // player inventory
    this.inventory = [];

    for (let index = 0; index < array.length; index++) {
      this.inventory[index] = {};
      this.inventory[index].type = inventoryData[index].type;
      this.inventory[index].quantity = 0;
      this.inventory[index].quantityCumulative = 0;
    }
  }

  addInventory(type, quantity) {}
}

const modalBuilder = {
  init() {},
};
