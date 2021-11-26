var Status;
(function (Status) {
Status[Status["open"] = 0] = "open";
Status[Status["closed"] = 1] = "closed";
Status[Status["hidden"] = 2] = "hidden";
})(Status || (Status = {}));


module.exports = Status;