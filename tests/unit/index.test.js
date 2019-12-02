const sinon = require('sinon')
const proxyquire = require('proxyquire')
const wordMaker = require('word-maker')
const fs = require('fs')

describe("src/index.js", () => {
    const randomWordStub = sinon.stub(wordMaker, "getRandomWordSync")
    const randomWordAsyncStub = sinon.stub(wordMaker, "getRandomWord")
    let writeFileSyncSpy

    beforeEach(() => {
        randomWordStub.reset()
        randomWordAsyncStub.reset()
        writeFileSyncSpy = sinon.spy(fs, "writeFileSync")
    })

    afterEach(() => {
        writeFileSyncSpy.restore()
    })

    describe("createRandomWordsSync", () => {
        test("should call write file with proper text when word maker returns a result", () => {
            randomWordStub.returns("word") 
            const { createRandomWordsSync } = require("../../src/index")
            
            let fileContent = ''
            for(var i=1;i<=100;i++) {
                let word

                if (i % 15 === 0) {
                    word = 'FizzBuzz'
                } else if (i % 3 === 0) {
                    word = "Fizz"
                } else if(i % 5 === 0) {
                    word = 'Buzz'
                } else {
                    word = "word"
                }

                fileContent += `${i}: ${word}\n`
            }

            createRandomWordsSync()

            expect(writeFileSyncSpy.calledWith("sync.txt", fileContent)).toBe(true)
        })

        test("should call write file with proper text when word maker throws error", () => {
            randomWordStub.throws(new Error()) 
            const { createRandomWordsSync } = require("../../src/index")
            
            let fileContent = ''
            for(var i=1;i<=100;i++) {
                fileContent += `${i}: It shouldn't break anything!\n`
            }

            createRandomWordsSync()

            expect(writeFileSyncSpy.calledWith("sync.txt", fileContent)).toBe(true)
        })
    })

    describe("createRandomWordsAsync", () => {
        test("should call write file with proper text when word maker returns a result", async () => {
            randomWordAsyncStub.resolves("word") 
            const { createRandomWordsAsync } = require("../../src/index")
            
            let fileContent = ''
            for(var i=1;i<=100;i++) {
                let word

                if (i % 15 === 0) {
                    word = 'FizzBuzz'
                } else if (i % 3 === 0) {
                    word = "Fizz"
                } else if(i % 5 === 0) {
                    word = 'Buzz'
                } else {
                    word = "word"
                }

                fileContent += `${i}: ${word}\n`
            }

            await createRandomWordsAsync()

            expect(writeFileSyncSpy.calledWith("async.txt", fileContent)).toBe(true)

            randomWordStub.reset()
            writeFileSyncSpy.restore()
        })

        test("should call write file with proper text when word maker throws error", async () => {
            randomWordAsyncStub.rejects(new Error()) 
            const { createRandomWordsAsync } = require("../../src/index")
            
            let fileContent = ''
            for(var i=1;i<=100;i++) {
                fileContent += `${i}: It shouldn't break anything!\n`
            }

            await createRandomWordsAsync()

            expect(writeFileSyncSpy.calledWith("async.txt", fileContent)).toBe(true)

            randomWordStub.reset()
            writeFileSyncSpy.restore()
        })
    })
})