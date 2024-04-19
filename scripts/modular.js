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

    elementGroupObject.elements.header.addEventListener("click", () => elementGroupObject.go());
    //
    switch (type) {
      case "crime":
        // progress bar
        elementGroupObject.elements.progressBar = this.createProgressBar();
        containerElement.appendChild(elementGroupObject.elements.progressBar);
        elementGroupObject.elements.progressText = this.createDiv();
        // progess text
        elementGroupObject.elements.progressText.classList.add("elementGroupProgressText");
        containerElement.appendChild(elementGroupObject.elements.progressText);
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
    this.elements = {};
    this.elements.container = null;
    this.elements.header = null;
    this.elements.progressBar = null;
    this.elements.progressText = null;
    this.timerFunction = null;
  }
  go() {
    this.data.numCommitters += 1;
    if (!this.timerFunction) {
      this.data.state = "running";
      this.timerFunction = setInterval(() => this.running(), global.refreshRate);
    }
  }
  running() {
    this.data.progress += global.refreshRate * this.data.numCommitters;
    this.updateProgressBar();
    this.updateProgressText();
    if (this.data.progress > modularContentData[this.index].durationMS) {
      this.completed();
    }
  }
  updateProgressBar() {
    const progress = this.data.progress / modularContentData[this.index].durationMS;
    const css = common.cssProgressBar(progress);
    this.elements.progressBar.style.background = css;
  }
  updateProgressText(text) {
    this.elements.progressText.innerText = text || this.msLeft(true);
  }
  completed() {
    this.data.progress = 0;
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
