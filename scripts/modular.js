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
    const newDiv = this.createDiv(["elementGroupCheckButton", "elementGroupButton"]);
    return newDiv;
  },
  createDoButtonDiv() {
    const newDiv = this.createDiv(["elementGroupDoButton", "elementGroupButton"]);
    return newDiv;
  },

  createInventorySubHeader(displayName) {
    const newDiv = this.createDiv("inventorySubHeader");
    newDiv.innerText = displayName;
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
      newModule.elements.doButton = this.createDoButtonDiv();
      newModule.elements.progressText = this.createProgressTextDiv();

      // add req and new html
      // const reqHTML = this.createReqNetHTML(newModule, "req");
      // const netHTML = this.createReqNetHTML(newModule, "net");
      // newModule.elements.subHeaderReq.innerHTML = reqHTML;
      // newModule.elements.subHeaderNet.innerHTML = netHTML;

      newModule.elements.checkButton.innerHTML = "<notoSymbol3>⮔</notoSymbol3>";
      newModule.elements.checkButton.setAttribute("data-checkState", "off");

      newModule.elements.doButton.innerHTML = "<notoSymbol3>🢅</notoSymbol3>";

      newModule.elements.subHeaderNet.classList.add("borderLeft");

      // set locations
      newModule.elements.container.style.gridTemplateColumns = "1fr 2fr 2fr 1fr";
      newModule.elements.container.style.gridTemplateRows = "1fr 1fr 1fr 1fr";
      newModule.elements.header.style.gridRow = "1";
      newModule.elements.header.style.gridColumn = "1 / span 4";
      newModule.elements.subHeaderReq.style.gridRow = "4";
      newModule.elements.subHeaderReq.style.gridColumn = "1 / span 2";
      newModule.elements.subHeaderNet.style.gridRow = "4";
      newModule.elements.subHeaderNet.style.gridColumn = "3 / span 2";
      newModule.elements.progressBar.style.gridRow = "2";
      newModule.elements.progressBar.style.gridColumn = "2 / span 2";
      newModule.elements.checkButton.style.gridRow = "2";
      newModule.elements.checkButton.style.gridColumn = "1";
      newModule.elements.doButton.style.gridRow = "2";
      newModule.elements.doButton.style.gridColumn = "4";
      newModule.elements.progressText.style.gridRow = "3";
      newModule.elements.progressText.style.gridColumn = "1 / span 4";

      // append
      newModule.elements.container.appendChild(newModule.elements.header);
      newModule.elements.container.appendChild(newModule.elements.subHeaderReq);
      newModule.elements.container.appendChild(newModule.elements.subHeaderNet);
      newModule.elements.container.appendChild(newModule.elements.progressBar);
      newModule.elements.container.appendChild(newModule.elements.checkButton);
      newModule.elements.container.appendChild(newModule.elements.doButton);
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
      newHTML += `<notoSymbol3>${player.personSymbol.repeat(criminals)}</notoSymbol3><br>`;
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
    this.updateReqNet();
    this.setEventListeners();
  }

  setEventListeners() {
    this.elements.checkButton.addEventListener("click", () => this.toggleAutoState());
    this.elements.doButton.addEventListener("click", () => this.startStop());
  }

  // run after initialisation, builds reqs and nets as normalised
  // array in the object, so later can highlight if meets reqs
  buildReqNet() {
    if (!this.dataSet.criminals) {
      this.dataSet.criminals = 1;
    }
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

  updateReqNetOld(type) {
    type = type == true ? "req" : "net";
    let newHTML = "";
    // get number of criminals needed
    let criminals = this.dataSet.criminals ? this.dataSet.criminals : 1;

    let localSet = [];

    // set the text before going through the list
    if (type == "req") {
      newHTML += "<reqNet>required:<br></reqNet>";
      console.log(criminals);
      if (criminals < 6) {
        newHTML += `<notoSymbol3>${player.personSymbol.repeat(criminals)}</notoSymbol3><br>`;
      } else {
        newHTML += `<notoSymbol3>${player.personSymbol}</notoSymbol3>x${criminals}<br>`;
      }

      localSet = this.req ? this.req : null;
    } else {
      newHTML += "<reqNet>net:</reqNet><br>";
      localSet = this.net ? this.net : null;
    }

    if (localSet) {
      for (let index = 0; index < localSet.length; index++) {
        let localSet2 = localSet[index];
        const displayName = localSet2.displayName ? localSet2.displayName : localSet2.type;
        const quantity = localSet2.quantity ? localSet2.quantity : 1;

        if (localSet2.type == "criminal") {
          newHTML += `<notoSymbol3>${player.personSymbol.repeat(quantity)}</notosymbol3>`;
        } else if (localSet2.type == "money") {
          newHTML += `$${quantity}`;
        } else {
          newHTML += `${displayName}`;
          if (Array.isArray(localSet2.quantity)) {
            newHTML += ` x${localSet2.quantity[0]}-${localSet2.quantity[1]}`;
          } else {
            newHTML += localSet2.quantity == 1 ? "" : " x" + localSet2.quantity;
          }
        }

        newHTML += `<br>`;
      }
    }
    if (type == "req") {
      this.elements.subHeaderReq.innerHTML = newHTML;
    } else {
      this.elements.subHeaderNet.innerHTML = newHTML;
    }
  }

  updateReqNet() {
    let reqHTML = "req:<br>";
    let netHTML = "net:<br>";

    reqHTML += personSymbol(this.dataSet.criminals);
    reqHTML += cycleThroughYieldArray(this.dataSet.req);

    netHTML += cycleThroughYieldArray(this.dataSet.net);

    this.elements.subHeaderReq.innerHTML = reqHTML;
    this.elements.subHeaderNet.innerHTML = netHTML;

    function cycleThroughYieldArray(array) {
      if (array == null) return "";
      let newHTML = "";
      for (let index = 0; index < array.length; index++) {
        const element = array[index];

        if (element.type != "money") {
          const quantityHTML = element.quantity > 1 ? `${element.quantity} x ` : "";
          newHTML += `${quantityHTML}${element.type}<br>`;
        } else {
          newHTML += `$${element.quantity.toLocaleString()}`;
        }
      }
      return newHTML;
    }

    function personSymbol(quantity) {
      if (quantity == 0) return "";
      quantity = quantity ? quantity : 1;
      if (quantity <= 5) {
        return `<notoSymbol3>${player.personSymbol.repeat(quantity)}</notosymbol3><br>`;
      } else {
        return `${quantity} x <notoSymbol3>${player.personSymbol}</notoSymbol3><br>`;
      }
    }
  }

  checkReqs() {
    // enough criminals
    const criminalsNeeded = this.dataSet.criminals;
    const criminalsAvailable = player.basicCriminals.criminalsAvailable;
    if (criminalsAvailable < criminalsNeeded) return "not enough people";
    // if no reqs then all god
    if (!this.dataSet.req) return "met";
    for (let index = 0; index < this.dataSet.req.length; index++) {
      const reqType = this.dataSet.req[index].type;
      const reqQuantity = this.dataSet.req[index].quantity;
      const checkedInventory = inventory.checkInventory(reqType);
      if (checkedInventory < reqQuantity) return `not enough ${reqType}`;
    }
    return "met";
  }

  checkCriminalReqs() {
    const criminalsNeeded = this.dataSet.criminals;
    const criminalsAvailable = player.basicCriminals.available;
    if (criminalsAvailable < criminalsNeeded) return "not enough people";
    return "met";
  }

  removeReqs(force) {
    const checkReq = this.checkReqs();
    if (checkReq != "met" || force) {
      console.log(`${checkReq}   ${!force}`);
      return "reqs not met. pass true in the argument to force";
    }
    if (this.dataSet.req) {
      const passedData = common.normaliseData(this.dataSet.req);
      inventory.subInventoryByArray(passedData);
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
    if (force == "clear") {
      this.elements.progressBar.style.background = "";
      return;
    }
    if (force == true || this.state == "running") {
      // logic for redrawing progress bars
      // and numbers
      // progress bar
      const progress = this.calcProgress();
      const newProgressCss = common.cssProgressBar(progress);
      this.elements.progressBar.style.background = newProgressCss;
      const msLeftText = this.msLeft(true);
      this.elements.progressText.innerText = msLeftText;
    }
  }

  calcProgress() {
    return this.data.progress / this.dataSet.durationMS;
  }

  msLeft(format) {
    const msLeft = this.dataSet.durationMS - this.data.progress;
    if (format == true) {
      return common.formatTime(msLeft);
    }
    return msLeft;
  }

  startStop() {
    const criminalReqs = this.checkCriminalReqs();

    switch (this.state) {
      case "running":
        this.state = "paused";
        clearInterval(this.intervalTimer);
        player.returnCriminal(this.dataSet.criminals);
        break;
      case "paused":
        // if it's been paused, the criminals have been returned
        // but I don't need to remove the items;
        if (criminalReqs != "met") {
          this.elements.progressText.innerText = "not enough people";
          return;
        }
        this.run();
        break;
      case "virgin":
      case "completed":
        if (criminalReqs != "met") {
          this.elements.progressText.innerText = "not enough people";
          return;
        }
        this.run();
        break;
    }
  }

  run() {
    const reqCheck = this.checkReqs();
    if (reqCheck != "met") {
      this.elements.progressText.innerText = "reqs not met";
      return;
    }
    this.removeReqs();
    player.takeCriminal(this.dataSet.criminals);
    this.intervalTimer = setInterval(() => this.running(), global.refreshRate);
    this.state = "running";
  }

  running() {
    this.data.progress += global.refreshRate;
    if (this.data.progress > this.dataSet.durationMS) {
      this.completed();
    }
  }

  completed() {
    // reset progress
    this.data.progress = 0;
    // give net
    if (this.dataSet.net) {
      inventory.addInventoryByArray(this.dataSet.net);
      player.updateMoney();
    }
    // check autostate for auto restart
    if (this.autoState == true) {
      player.updateMoney();

      // check reqs again
      const checkReqs = this.checkReqs();
      if (checkReqs != "met") {
        this.toggleAutoState();
        this.stop("reqs not met for restart");
        return;
      }
      this.removeReqs();
      player.updateMoney();
    } else {
      // if no autorestart
      this.stop();
    }
  }

  stop(innerText) {
    innerText = innerText ? innerText : "complete";
    clearInterval(this.intervalTimer);
    this.state = "completed";
    this.redraw("clear");
    this.elements.progressText.innerText = innerText;
    player.returnCriminal(this.dataSet.criminals);
    player.updateMoney();
  }
}
