//
// interesting noto symbols 💰🡼🞿🞺🞴🞧☠🮲🮳
// used to drive the creation of each widget
/*
thinking out loud here
OK so game broken into either 2 or 3 fundament sections
A crimes you can do
B research or locations - stuff you can also do
C managements

perhaps B is not needed


within A there are a few different kinds of crimes

there are basic crimes. they take time. you can possibly set them to auto repeat
you can add more people to make them go faster but its significantly less efficient the more poeple you add

opportunity crimes. the opportunity comes and goes. this rewards you on being around to catch it I guess





meta stuff

inventory and or warehouse

are these the same or different???



managing people. make this simple.



what about research???


investments?






something to deciode... how about LEVEL





*/

const gameMetadata = [
  { type: "staticCrime", instances: ["jaywalk", "stayup", "chalk"] },
  { type: "opportunityCrime", instances: [] },
  { type: "location", instances: [] },
];

/**
 * required properties
 * uid
 * pretty much everything will default other than that
 */
let staticCrimesData = [
  {
    uid: "stealchalk",
    displayName: "stealing chalk",
    net: [
      { type: "chalk", quantity: 1 },
      { type: "money", quantity: 4 },
    ],
    criminals: 0,
    durationMS: 2000,
    onceOff: true,
  },
  {
    uid: "jaywalk",
    displayName: "jaywalking",
    description: "walking, but where you shouldn't",
    durationMS: 2000,
    req: "money",
    net: "criminal",
    unlockuid: "stealchalk",
  },
  {
    uid: "fashion",
    displayName: "fashion crime",
    description: "walking, but where you shouldn't",
    durationMS: 5000,
    net: { type: "shame", quantity: [1, 14] },
  },
  {
    uid: "gamble",
    displayName: "gamble",
    description: "gambling",
    durationMS: 5000,
    req: { type: "money", quantity: 10 },
    net: { type: "money", quantity: [6, 12] },
    criminals: 0,
  },

  { uid: "chalk", displayName: "chalk vandalism", description: "eco friendly taggin", req: { type: "chalk", quantity: 2 }, criminals: 2, net: "kidcred" },
  {
    uid: "stayup",
    displayName: "staying up past bedtime",
    description: "mum is gonna be pissed when she finds out",
    net: ["tired", { type: "told off", quantity: 2 }],
  },
  { uid: "stealcar", displayName: "grand theft auto", description: "", durationMS: 10000, net: "vehicle", criminals: 7 },
  { uid: "sellcar", displayName: "sell stolen car", description: "", durationMS: 10000, req: "vehicle", net: { type: "money", quantity: 57 } },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
  { uid: "", displayName: "", description: "", durationMS: 10000 },
];

// this cleans up the data so other objects can assume it's correct
function staticCrimeDataClean() {
  for (let index = 0; index < staticCrimesData.length; index++) {
    const element = staticCrimesData[index];
    // fix name if necessary
    if (!element.displayName) element.displayName = element.uid;
    if (!element.description) element.description = "";
    // ten seconds is default time
    if (!element.durationMS) element.durationMS = 10000;
    // default num of criminals. can set to 0 to mean none needed
    if (!element.criminals && element.criminals != 0) element.criminals = 1;
    if (!element.req) {
      element.req = null;
    } else {
      element.req = fixYields(element.req);
    }
    if (!element.net) {
      element.net = null;
    } else {
      element.net = fixYields(element.net);
    }

    function fixYields(yield) {
      let fixedYield = [];
      // normalise into array
      let localYield = common.normaliseData(yield);
      // cycle thru array
      for (let index = 0; index < localYield.length; index++) {
        const element = localYield[index];
        fixedYield[index] = {};
        // check if element is a single string and clean it up
        // or is proper object
        if (typeof element == "string") {
          fixedYield[index].type = element;
          fixedYield[index].quantity = 1;
        } else if (element.type && element.quantity) {
          // or if legit yield object
          fixedYield[index].type = element.type;
          fixedYield[index].quantity = element.quantity;
        } else {
          fixedYield[index] = -1;
        }
      }
      return fixedYield;
    }
  }
}

/**
 * this holds the data about inventory
 * @type this is the only essential key
 * @displayName will default to whatever type is if undefined
 * @description
 * @value if non zero then means it can be sold
 * @saleRisk if non zero then means chance of losing it without making money
 */
const inventoryData = [
  { type: "money", displayName: "money", inventoryType: "inventory" },
  { type: "candy", displayName: "candy", description: "a sad little confection, it tastes like regret", value: 0 },
  { type: "sadness", displayName: "sadness", description: "you feel a bit sad about the things you have done", saleValue: 0 },
  { type: "tired", displayName: "tired", description: "", saleValue: 0 },
  { type: "shoes", displayName: "stolen shoes", description: "", saleValue: 0 },
  { type: "chalk", displayName: "chalk", description: "", saleValue: 0 },
  { type: "told off", displayName: "told off", description: "feels stick bro", saleValue: 0 },
  { type: "kidcred", displayName: "street cred with children", description: "", saleValue: 0 },
  { type: "shame", displayName: "shame", description: "", saleValue: 0 },
  { type: "criminal", displayName: "criminal", description: "", saleValue: 0 },
  { type: "vehicle", displayName: "vehicle", description: "", saleValue: 0, inventoryType: "locations" },
  { type: "", displayName: "", description: "", saleValue: 0 },
  { type: "", displayName: "", description: "", saleValue: 0 },
  { type: "", displayName: "", description: "", saleValue: 0 },
  { type: "", displayName: "", description: "", saleValue: 0 },
  { type: "", displayName: "", description: "", saleValue: 0 },
  { type: "", displayName: "", description: "", saleValue: 0 },
  { type: "", displayName: "", description: "", saleValue: 0 },
];
