let moment = require('moment');

let generateMessage = (from,text) =>{
    return {
        from:from,
        text:text,
        createdAt: moment().valueOf()
    }
}

let generateLocationMessage = (from,latitude,longtitude) =>{
    return {
        from:from,
        url: `https://www.google.com/maps?q=${latitude},${longtitude}`,
        createdAt: moment().valueOf()
    }    
}

module.exports = {generateMessage,generateLocationMessage};