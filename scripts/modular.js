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
  buildElementGroup(widgetObject) {
    let type = widgetObject.type;
    let columns = 2;
    let rows = 4;
    switch (type) {
      case "basic crime":
    }
  },
  // this function takes the data from a key/data pair,
  // and returns it as an array regardless of if it is
  // or not
  createDiv() {
    return document.createElement("div");
  },
};
//
// this is the generic object that all widgets will have
// this may be extended by mixins
class modularGenericWidget {
  /**
   * this is the base of any widget
   * @param {*} index
   * @param {*} state basically an enum - virgin, running, paused, finished, waitingReward
   * @param {boolean} locked means it can't be used. different from visible
   * @param {boolean} visible means if the element group is displayed at all
   */
  constructor(index) {
    this.index = index;
    this.moduleID = modularContentData[index].moduleID;
    this.numCommitters = 0;
    this.state = "virgin";
    this.locked = true;
  }
}
//
//
// init the array of widgets
let widgetArray = [];
// fill the array
for (let index = 0; index < modularContentData.length; index++) {
  // make a new object and assign into the array
  widgetArray[index] = new modularGenericWidget(index);
  // pass object into the builder
  modularBuilder.buildElementGroup(widgetArray[index]);
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
