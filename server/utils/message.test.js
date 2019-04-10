
let expect = require('expect');
let {generateMessage,generateLocationMessage} = require('./message.js');

describe("generateMessage", () =>{

    it("should generate the corrent message object",() =>{
        let from = "Kristi";
        let text = "Hello";
        let message = generateMessage(from,text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({ from,text });
    });

});


describe("generate location message",() => {

    it("should generate correct location message",() => {
        let from = "Kristi";
        let latitude = 15;
        let longtitude = 19;
        let url = "https://www.google.com/maps?q=15,19";
        let message = generateLocationMessage(from,latitude,longtitude);
        expect(typeof message.createdAt).toBe('number')
        expect(message).toMatchObject({from,from});
    });
})