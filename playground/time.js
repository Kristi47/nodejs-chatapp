//UNIX (1 JANAR 1970 00:00:00 am) 

// var date = new Date();
// console.log(date.getMonth());
let moment = require('moment');

let date = moment();
date.add(1,'year').subtract(9,'month');
console.log(date.format('MMM Do, YYYY'));
console.log(date.format('h:mm a'));

let someTimestamp = moment().valueOf();
console.log(someTimestamp);