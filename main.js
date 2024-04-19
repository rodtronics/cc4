// crime committer 4

// set the version
const ccVersion = 0.1;
const ccCode = "dank alpha";
//and apply it
document.getElementById("versionDivID").innerText = `v${ccVersion} ${ccCode}`;

// this object contains a lot of global values
let global = {
  refreshRate: 61.8 / 2, //phi divided by 2, means values accumulate in an unrepeating fashion
  precision: 4, // precision on floats
};

const common = {
  /**
   * passed an array, it looks for the property "type", and tries to find
   * the index of it, or returns null
   * @param {array} is the passed array
   * @param {searchType} is the value in the "type":"value" pair
   * @returns the index of the item in the array
   * ot null if none (rather than -1)
   */
  getIndexInArrayFromType(array, searchType) {
    let index = array.findIndex((obj) => obj.type === searchType);
    index = index == -1 ? null : index;
  },
  /**
   * normalises data into arrays so I can supply either 1 value or 2
   * but don't have to be careful about making sure single variables
   * are arrays
   * @param {*} data is either a single variable or array of variables
   * @returns {array} always an array, even if single element
   */
  normaliseData(data) {
    return Array.isArray(data) ? data : [data];
  },
};
