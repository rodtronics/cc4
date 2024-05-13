const modal = {
  modalOuter: document.getElementById("modalOuterID"),
  modalContainer: document.getElementById("modalContainerID"),
  modalHeader: document.getElementById("modalHeaderDivID"),
  modalContent: document.getElementById("modalContentDivID"),
  showModalByIndex(index) {
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
  showModal(headerHTML, innerHTML) {
    innerHTML = innerHTML ? innerHTML : "";
    this.modalHeader.innerHTML = headerHTML;
    this.modalContent.innerHTML = innerHTML;
    this.modalOuter.style.display = "block";
  },
  closeModal() {
    this.modalOuter.style.display = "none";
  },
};

modal.modalOuter.addEventListener("click", () => modal.closeModal());

function reqNetModalTextGen(uid) {
  const crimeIndex = common.getIndexByUID(staticCrimesData, uid);
  const crimeData = staticCrimesData[crimeIndex];
  let newHTML = "<br><br>";

  const personSymbols = personSymbol(crimeData.criminals);

  // get requirements
  if (crimeData.req) {
    newHTML += "you need:<br>";
    newHTML += personSymbols;
    newHTML += cycleThrough(crimeData.req);
  } else if (crimeData.criminals > 0) {
    newHTML += "you need:<br>";
    newHTML += personSymbols;
  }

  // get net
  if (crimeData.net) {
    newHTML += "<br>you'll get:<br>";
    newHTML += cycleThrough(crimeData.net);
  }
  return newHTML;

  function cycleThrough(array) {
    let newHTML = "";
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      // is money?
      if (element.type == "money") {
        // is array of money?
        if (Array.isArray(element.quantity)) {
          const num1 = element.quantity[0];
          const num2 = element.quantity[1];
          newHTML += `$${num1.toLocaleString()} - $${num2.toLocaleString()}<br>`;
        } else {
          // not array of money
          newHTML += `$${element.quantity.toLocaleString()}<br>`;
        }
      } else {
        // not money
        const displayName = getDisplayNameFromUID(element.type);
        if (Array.isArray(element.quantity)) {
          const num1 = element.quantity[0];
          const num2 = element.quantity[1];
          newHTML += `${num1} - ${num2} x ${displayName}`;
        } else {
          const quantityHTML = element.quantity > 1 ? `${element.quantity} x ` : "";
          newHTML += `${quantityHTML}${displayName}<br>`;
        }
      }
    }
    return newHTML;
  }

  function getDisplayNameFromUID(uid) {
    const inventoryIndex = inventory.getIndexByType(uid);
    const displayName = inventoryData[inventoryIndex].displayName;
    return displayName;
  }

  function personSymbol(quantity) {
    if (quantity == undefined) return;
    if (quantity == 0) return "";
    quantity = quantity ? quantity : 1;
    if (quantity <= 5) {
      return `<notoSymbol3>${player.personSymbol.repeat(quantity)}</notosymbol3><br>`;
    } else {
      return `${quantity} x <notoSymbol3>${player.personSymbol}</notoSymbol3><br>`;
    }
  }
}
