const { getRandomWordSync, getRandomWord } = require('word-maker');
const fs = require('fs')

const createRandomWordsSync = () => {
    console.time('Sync version - full execution time')

    let fileContent = ''
    for (let i=1; i<=100; i++) {
        let word
        
        try {
            word = getRandomWordSync({ withErrors: true }) 
        } catch (err) {
            word = "It shouldn't break anything!"
            fileContent += `${i}: ${word}\n`
            continue
        }

        if (i % 15 === 0) {
            word = 'FizzBuzz'
        } else if (i % 3 === 0) {
            word = "Fizz"
        } else if(i % 5 === 0) {
            word = 'Buzz'
        }

        fileContent += `${i}: ${word}\n`
    }

    fs.writeFileSync("sync.txt", fileContent)

    console.timeEnd('Sync version - full execution time')
}

const getWordAsync = async (index) => {
    let word

    try {
        word = await getRandomWord({ slow: true, withErrors: true }) 
    } catch (err) {
        word = "It shouldn't break anything!"
        return `${index}: ${word}`
    }
    
    if (index % 15 === 0) {
        word = 'FizzBuzz'
    } else if (index % 3 === 0) {
        word = "Fizz"
    } else if(index % 5 === 0) {
        word = 'Buzz'
    }

    return `${index}: ${word}`
}

const createRandomWordsAsync = async () => {
    console.time('Async version - full execution time')
    
    let promises = []
    
    for (let i=1; i<=100; i++) {
        promises.push(getWordAsync(i))
    }
    
    console.time('Async version - getRandomWord execution time')
    const results = await Promise.all(promises)
    console.timeEnd('Async version - getRandomWord execution time')

    const fileContent = results.join("\n").concat("\n")

    fs.writeFileSync("async.txt", fileContent)

    console.timeEnd('Async version - full execution time')
}

module.exports = {
    createRandomWordsSync,
    createRandomWordsAsync
}

// createRandomWordsSync()
// createRandomWordsAsync()