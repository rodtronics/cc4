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

function setActiveTab(index) {
  console.log(index);
  // turn off all tabs
  for (let index = 0; index < primaryTabs.length; index++) {
    primaryTabs[index].element.setAttribute("data-tabState", "inactive");
  }
  // turn on the right one
  primaryTabs[index].element.setAttribute("data-tabState", "active");
  // then display the relevant icons
}

const tabDiv = document.getElementById("tabDivID");
makePrimaryTabs(tabDiv);
setActiveTab(0);
