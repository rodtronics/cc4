const modal = {
  modalOuter: document.getElementById("modalOuterID"),
  modalContainer: document.getElementById("modalContainerID"),
  showModal(index) {
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
  closeModal() {
    this.modalOuter.style.display = "none";
  },
};

modal.modalOuter.addEventListener("click", () => modal.closeModal());
