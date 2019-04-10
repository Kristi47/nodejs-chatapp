let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
}


let validateSelectedRoom = (str)=> {
    return typeof str === 'string' && str.trim().length > 0 && str != "no rooms found" && str != "select room";
}

let toLowerCase = (str) => {
    return str.trim().toLowerCase();
}

module.exports = {isRealString,validateSelectedRoom,toLowerCase}