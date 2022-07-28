const express = require('express')
const cors = require('cors')
const readDir = require('./hcparser')

const PORT = 3333

const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }))

app.get('*', (req, res) => {
    res.status(200).json({ message: 'Server worked' })
})

app.post('*', (req, res) => {
    const { path } = req.body

    if (!path) res.status(400).json({ message: 'Path is empty' })

    try {
        let outlog = ''
        readDir(path, (log) => (outlog += `${log}\n`))
        res.status(200).json({ message: 'Parsed succesfully:\n' + outlog })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
