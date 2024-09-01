const axios = require("axios");
const MOCKAPI = "https://fakestoreapi.com";
module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    axios
      .get(`${MOCKAPI}/${url}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
