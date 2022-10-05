///////////////////////////////////////////
//       Created by Androz2091          //
//  Maintained by Snowflake Studio ❄   //
/////////////////////////////////////////

const Util = require("./src/util/Util");

module.exports = {
    Client: require("./src/Client"),
    Constants: require("./src/constants/Constants"),
    keygen: Util.keygen,
    Store: require("./src/store/Store"),
    StreamDownloader: require("./src/util/Downloader"),
    Util: Util,
    validateURL: Util.validateURL,
    version: require("./package.json").version
};