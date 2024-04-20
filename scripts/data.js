//
// interesting noto symbols 💰🡼🞿🞺🞴🞧☠🮲🮳
// used to drive the creation of each widget

const modularContentData = [
  {
    // this one is a bit of a prototype, showing all properties even if not used in this one
    type: "crime",
    subType: undefined,
    displayName: "stealing candy from a baby",
    moduleID: "crime_stealcandy", // must be unique
    description: "it's just another reminder that even the smallest opponents can leave you feeling like a total loser",
    durationMS: 30000,
    yield: [
      { type: "candy", quantity: [0, 2] }, // if the quantity is an array, it means a range
      { type: "sadness", quantity: 1 },
      { type: "money", quantity: 0 },
    ],
    cost: 0,
    requirements: undefined, // undefined means none
    committersRequired: undefined, // if this is 0 or undefined, it'll just be one
    coolDownMS: 5000, // how long to wait before can be done again
    maxCriminals: 0, // if 0 or undefined, it's unlimited
    automatable: true, // can it just repeat itself over and over
    riskLost: 0,
    riskCaught: 0,
  },
  {
    type: "crime",
    description: "",
    displayName: "such a long crime",
    durationMS: 41556952000,
  },
  {
    type: "robbery",
    description: "",
    displayName: "this is different",
    durationMS: 41556952000,
    potentialRobberies: ["bus"],
  },
];

const robberyData = [
  {
    displayName: "bus",
    description: "you really are going to try and steal change from the bus driver aren't you",
    yield: [{ type: "money", quantity: [0, 2] }],
    timeRangeToShow: [10000, 30000],
    timeRangeToStay: [30000, 60000],
  },
];

/**
 * this holds the data about inventory
 * @type this is the only essential key
 * @displayName will default to whatever type is if undefined
 * @description
 * @value if non zero then means it can be sold
 * @saleRisk if non zero then means chance of losing it without making money
 */
const inventoryData = [{ type: "candy", description: "a sad little confection, it tastes like regret", value: 0 }];