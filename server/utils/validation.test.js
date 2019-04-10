const expect = require('expect');
const {isRealString} = require('./validation.js');

describe("test validation",()=>{

    it("should reject non string values",()=>{
        let str = 123;
        let testStr = isRealString(str);
        expect(testStr).toBeFalsy();
    });

    it("should reject string with only spaces",()=>{
        let str = isRealString("        ");
        expect(str).toBeFalsy();
    });

    it("should allow string with non space characters",() =>{
        let str = "Kristi";
        let testStr = isRealString(str);
        expect(testStr).toBeTruthy();
    });
});