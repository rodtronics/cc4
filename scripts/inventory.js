class inventoryClass {
  constructor(typeOfInventory) {
    this.elements = {};
    this.inventory = [];
    for (let index = 0; index < inventoryData.length; index++) {
      this.inventory[index] = {};
      this.inventory[index].type = inventoryData[index].type;
      this.inventory[index].quantity = 0;
      this.inventory[index].quantityCumulative = 0;
      this.inventory[index].subElements = {};
    }
    this.buildElements(typeOfInventory);
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
    // yieldArray = common.normaliseData(yieldArray);
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
   * @param {number} quantity
   * @returns null if bad input and -1 if can't find index
   */
  addInventoryByType(type, quantity) {
    const index = this.getIndexByType(type);
    if (index == null || index == -1) return index;
    if (type == "money") {
      player.addMoney(quantity);
    }
    if (type == "criminal") {
      player.addNewCriminal(quantity);
      this.refreshDisplay();
      console.log(`${quantity} criminals added`);
      return;
    }
    this.inventory[index].quantity += quantity;
    this.inventory[index].quantityCumulative += quantity;
    console.log(`Inventory: ${type} +${quantity}`);
    this.refreshDisplay();
  }
  subInventoryByArray(array) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      const answer = this.subInventory(element.type, element.quantity);
    }
  }
  subInventory(type, quantity) {
    if (type == "money") {
      player.addMoney(quantity);
    }
    const index = this.getIndexByType(type);
    if (index == null || index == -1) return index;
    if (this.inventory[index].quantity < quantity) return "notEnough";
    this.inventory[index].quantity -= quantity;
    console.log(`Inventory: ${type} -${quantity}`);
    this.refreshDisplay();
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
  buildElements(typeOfInventory) {
    // make container and header
    this.elements.container = moduleBuilder.createContainterDiv();
    this.elements.container.classList.add("inventoryContainer");
    this.elements.header = moduleBuilder.createHeaderDiv(typeOfInventory);
    this.elements.header.classList.add("inventoryHeader");
    this.elements.subContainer = moduleBuilder.createDiv("inventorySubContainer");

    this.elements.container.appendChild(this.elements.header);
    this.elements.container.appendChild(this.elements.subContainer);

    for (let index = 0; index < inventoryData.length; index++) {
      this.buildSubElement(index);
    }
  }
  buildSubElement(index) {
    const displayName = inventoryData[index].displayName ? inventoryData[index].displayName : inventoryData[index].type;
    this.inventory[index].subElements.itemContainer = moduleBuilder.createDiv();
    this.inventory[index].subElements.itemContainer.classList.add("inventoryItemContainer");
    const itemContainer = this.inventory[index].subElements.itemContainer;
    itemContainer.addEventListener("click", () => modal.showModal(displayName, inventoryData[index].description));
    this.inventory[index].subElements.header = moduleBuilder.createDiv();
    this.inventory[index].subElements.header.classList.add("inventoryItemHeader");
    this.inventory[index].subElements.header.innerText = displayName;
    this.inventory[index].subElements.quantityBox = moduleBuilder.createDiv();
    this.inventory[index].subElements.quantityBox.classList.add("inventoryQuantityBox");
    itemContainer.appendChild(this.inventory[index].subElements.header);
    itemContainer.appendChild(this.inventory[index].subElements.quantityBox);
  }

  refreshDisplay() {
    // clear subitems
    while (this.elements.subContainer.firstChild) {
      this.elements.subContainer.removeChild(this.elements.subContainer.lastChild);
      // add only items with quantity
    }
    for (let index = 0; index < inventoryData.length; index++) {
      if (this.inventory[index].quantity > 0) {
        this.elements.subContainer.appendChild(this.inventory[index].subElements.itemContainer);
        let quantity = "";
        if (this.inventory[index].type == "money") quantity += "$";
        quantity += this.inventory[index].quantity;
        this.inventory[index].subElements.quantityBox.innerText = quantity;
      }
    }
  }
}

// there is multiple inventory type windws
// defined by this array. default is 0
const inventoryNameArray = ["inventory", "locations", "skills"];
/*
ok so trying to have a master inventory,
the inventory is just one large list,
but there are multiple inventory modules
built from the array above. a module per element
each module defines a list. 

will call masterInventory, which will add and take away from inventory

the main difference, is that when refreshed, each module will only
show items with its inventoryType, or default to to inventory

not so different after all, same functions called etc,









*/



class inventoryClassOld {
  constructor(typeOfInventory) {
    this.elements = {};
    this.inventory = [];
    for (let index = 0; index < inventoryData.length; index++) {
      this.inventory[index] = {};
      this.inventory[index].type = inventoryData[index].type;
      this.inventory[index].quantity = 0;
      this.inventory[index].quantityCumulative = 0;
      this.inventory[index].subElements = {};
    }
    this.buildElements(typeOfInventory);
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
    // yieldArray = common.normaliseData(yieldArray);
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
   * @param {number} quantity
   * @returns null if bad input and -1 if can't find index
   */
  addInventoryByType(type, quantity) {
    const index = this.getIndexByType(type);
    if (index == null || index == -1) return index;
    if (type == "money") {
      player.addMoney(quantity);
    }
    if (type == "criminal") {
      player.addNewCriminal(quantity);
      this.refreshDisplay();
      console.log(`${quantity} criminals added`);
      return;
    }
    this.inventory[index].quantity += quantity;
    this.inventory[index].quantityCumulative += quantity;
    console.log(`Inventory: ${type} +${quantity}`);
    this.refreshDisplay();
  }
  subInventoryByArray(array) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      const answer = this.subInventory(element.type, element.quantity);
    }
  }
  subInventory(type, quantity) {
    if (type == "money") {
      player.addMoney(quantity);
    }
    const index = this.getIndexByType(type);
    if (index == null || index == -1) return index;
    if (this.inventory[index].quantity < quantity) return "notEnough";
    this.inventory[index].quantity -= quantity;
    console.log(`Inventory: ${type} -${quantity}`);
    this.refreshDisplay();
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
  buildElements(typeOfInventory) {
    // make container and header
    this.elements.container = moduleBuilder.createContainterDiv();
    this.elements.container.classList.add("inventoryContainer");
    this.elements.header = moduleBuilder.createHeaderDiv(typeOfInventory);
    this.elements.header.classList.add("inventoryHeader");
    this.elements.subContainer = moduleBuilder.createDiv("inventorySubContainer");

    this.elements.container.appendChild(this.elements.header);
    this.elements.container.appendChild(this.elements.subContainer);

    for (let index = 0; index < inventoryData.length; index++) {
      this.buildSubElement(index);
    }
  }
  buildSubElement(index) {
    const displayName = inventoryData[index].displayName ? inventoryData[index].displayName : inventoryData[index].type;
    this.inventory[index].subElements.itemContainer = moduleBuilder.createDiv();
    this.inventory[index].subElements.itemContainer.classList.add("inventoryItemContainer");
    const itemContainer = this.inventory[index].subElements.itemContainer;
    itemContainer.addEventListener("click", () => modal.showModal(displayName, inventoryData[index].description));
    this.inventory[index].subElements.header = moduleBuilder.createDiv();
    this.inventory[index].subElements.header.classList.add("inventoryItemHeader");
    this.inventory[index].subElements.header.innerText = displayName;
    this.inventory[index].subElements.quantityBox = moduleBuilder.createDiv();
    this.inventory[index].subElements.quantityBox.classList.add("inventoryQuantityBox");
    itemContainer.appendChild(this.inventory[index].subElements.header);
    itemContainer.appendChild(this.inventory[index].subElements.quantityBox);
  }









































class masterInventoryClass {
  constructor() {
    this.inventoryTypeArray = [];
    this.inventory = [];
    for (let index = 0; index < inventoryData.length; index++) {
      this.inventory[index] = {};
      this.inventory[index].type = inventoryData[index].type;
      this.inventory[index].quantity = 0;
      this.inventory[index].quantityCumulative = 0;
      this.inventory[index].subElements = {};
      const inventoryType = inventoryData[index].inventoryType ? inventoryData[index].inventoryType : "inventory";
      this.inventory[index].inventoryType = inventoryType;
    }
    for (let index = 0; index < inventoryNameArray.length; index++) {
      const element = inventoryNameArray[index];
      this.buildBaseElements(this.inventoryTypeArray[index]);
    }
  }

  buildBaseElements(inventoryType) {
    inventoryType = {};
  }

  checkInventory(type) {
    return quantity;
  }

  addInventoryByArray(yieldArray) {}

  addInventoryByType(type, quantity) {}

  subInventoryByArray(yieldArray) {}

  subInventoryByType(type, quantity) {}

  getIndexByType(type) {}

  attachElements(parentElement) {}

  refreshDisplay() {}
}
