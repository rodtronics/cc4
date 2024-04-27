class playerDataClass {
  constructor() {
    this.basicCriminals = {};
    this.basicCriminals.total = 5;
    this.basicCriminals.available = 5;
    this.money = 0;
    this.moneyCumulative = 0;
    this.dateTimeStarted = dayjs();
    (this.personSymbol = "🯅"), this.updateMoney();
  }
  addMoney(amount) {
    this.money += amount;
    this.moneyCumulative += amount;
    this.updateMoney();
  }
  subMoney(amount) {
    if (this.money < amount) return -1;
    this.money -= amount;
    this.updateMoney();
  }
  takeCriminal(quantity) {
    quantity = quantity ? quantity : 1;
    this.basicCriminals.available -= quantity;
    this.basicCriminals.available < 0 ? 0 : this.basicCriminals.available;
    this.updateMoney();
  }
  returnCriminal(quantity) {
    quantity = quantity ? quantity : 1;
    this.basicCriminals.available += quantity;
    this.basicCriminals.available > this.basicCriminals.total ? this.basicCriminals.total : this.basicCriminals.available;
    this.updateMoney();
  }
  addNewCriminal(quantity) {
    quantity = quantity ? quantity : 1;
    this.basicCriminals.total += 1;
    this.basicCriminals.available += 1;
  }
  availabilityCSS() {
    let newCSS = "";
    newCSS += ``;
    newCSS += `${this.basicCriminals.available}<notoSymbol2>${this.personSymbol}</notoSymbol2>`;
    newCSS += `/${this.basicCriminals.total}<notoSymbol2>${this.personSymbol}</notoSymbol2>`;
    return newCSS;
  }
  updateMoney() {
    const money = this.money.toFixed(0).toLocaleString();
    const availabilityCSS = this.availabilityCSS();
    global.infoDiv.innerHTML = `$${money}<br>${availabilityCSS}`;
  }
}
