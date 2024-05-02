// ok so split up. MAIN tabs, the MAIN tabs that separate the fundamental functions of the game. maybe just two
// and then maybe a lot of sub tabs coz hopefully this game has lots of crimes etc
//

// doing vs being

let primaryTabs = [{ displayName: "doing" }, { displayName: "being" }];

function makePrimaryTabs(divToAppendTo) {
  for (let index = 0; index < primaryTabs.length; index++) {
    // create the div and reference it in the array
    let newDiv = document.createElement("div");
    primaryTabs[index].element = newDiv;

    //few settings
    newDiv.classList.add("tabClass");
    newDiv.setAttribute("data-tabState", "inactive");
    newDiv.innerHTML = primaryTabs[index].displayName;
    // eventlistener
    // attach to div
    divToAppendTo.appendChild(newDiv);
    newDiv.addEventListener("click", () => setActiveTab(index));
  }
}

let activeTab = 0;
function setActiveTab(tabIndex) {
  tabIndex = tabIndex == undefined ? activeTab : tabIndex;
  activeTab = tabIndex;
  // turn off all tabs
  for (let index = 0; index < primaryTabs.length; index++) {
    // console.log(primaryTabs[index].element);
    primaryTabs[index].element.setAttribute("data-tabState", "inactive");
  }
  // turn on the right one
  primaryTabs[tabIndex].element.setAttribute("data-tabState", "active");
  //clear all elements from the body

  clearElements();
  // then display the relevant icons
  // global.bodyDiv.appendChild(inventory.elements.container);
  inventory.refreshDisplay();
  for (let index = 0; index < moduleArray.length; index++) {
    console.log(`${moduleArray[index].uid}     ${moduleArray[index].data.visible}`);
    if (tabIndex == 0 && moduleArray[index].type == "staticCrime" && moduleArray[index].data.visible == true) {
      global.bodyDiv.appendChild(moduleArray[index].elements.container);
    } else if (tabIndex == 1) {
      global.bodyDiv.appendChild(inventory.elements.container);
      inventory.refreshDisplay();
    }
  }
}

function clearElements() {
  while (global.bodyDiv.firstChild) {
    global.bodyDiv.removeChild(global.bodyDiv.lastChild);
  }
}
