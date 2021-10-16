const index = require("./index")
// @ponicode
describe("index.getAuthTokens", () => {
    test("0", () => {
        let callFunction = () => {
            index.getAuthTokens()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.putAuthTokens", () => {
    test("0", () => {
        let callFunction = () => {
            index.putAuthTokens(["Edmond", "Edmond", "Edmond"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            index.putAuthTokens(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.deleteAuthTokens", () => {
    test("0", () => {
        let callFunction = () => {
            index.deleteAuthTokens()
        }
    
        expect(callFunction).not.toThrow()
    })
})
