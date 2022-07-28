const fs = require('fs')
const _path = require('path')

function readDir(path, callback = (f) => f) {
    try {
        const files = fs.readdirSync(path, { withFileTypes: true })

        files.forEach((file) => {
            if (file.name === 'node_modules') return
            if (file.isDirectory()) return readDir(_path.join(path, file.name))

            if (file.isFile()) {
                const splitted = file.name.split('.')
                const isHTML = splitted[splitted.length - 1].includes('htm')

                if (isHTML) {
                    const filePath = `${path}\\${file.name}`
                    parseFile(filePath, callback)
                }
            }
        })
    } catch (e) {
        console.error(e)
    }
}

function parseFile(path, callback) {
    const timestamp = Date.now()
    const data = fs.readFileSync(path, { encoding: 'utf-8' })
    const regexp = /<!--(.*?)-->/gm

    if (!data.match(regexp)) {
        callback(`${path} - skipped (no comments)`)
        return console.log(`${path} - skipped (no comments)`)
    }

    const newData = data.replace(regexp, '')

    try {
        fs.writeFileSync(path, newData, { encoding: 'utf-8' })
        console.log(
            '\x1b[32m%s\x1b[0m',
            `${path} - parsed successfully per ${Date.now() - timestamp} ms.`,
        )
        callback(
            `${path} - parsed successfully per ${Date.now() - timestamp} ms.`,
        )
    } catch (e) {
        console.error(e)
    }
}

// readDir(process.argv[2] || __dirname)

module.exports = readDir
