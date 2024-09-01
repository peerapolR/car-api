const { v4: uuidv4 } = require("uuid");
const addKey = (oldObject, newKey = "uid", value = uuidv4()) => {
  oldObject[newKey] = value;
  return oldObject;
};
module.exports = {
  addKey,
};
