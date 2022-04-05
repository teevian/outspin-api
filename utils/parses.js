var tools = require("./tools");

DEFAULT_PORT = 62126;
/*
const isBadPort = (candidate, start=62120, end=62130) => {
        return isNaN(candidate) || !tools.between(candidate, start, end);
};

const usablePort = (candidate, start=62126, end=62136) => {
        return isBadPort(candidate) ? (console.log("Using DEFAULT port..."), DEFAULT_PORT) : candidate;
};

module.exports = {
        isBadPort,
        usablePort
};
*/

module.exports = {
        isBadPort :
                (candidate, start=62126, end=62621) => {
                        return isNaN(candidate) || !tools.between(candidate, start, end);
                },
        usablePort :
                (candidate, start=62126, end=62621) => {
                        return module.exports.isBadPort(candidate) ?
                                (console.log((new Date()) + " Using DEFAULT port..."), DEFAULT_PORT) : candidate;
                },
  clearEmptyRows :
    (rows) => {
      if(!rows) return [];
      return rows;
    }
};