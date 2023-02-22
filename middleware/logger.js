const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFilenam) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}   ${uuid()}   ${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFilenam), logItem)
    } catch (error) {
        console.log(error)
    }
}

const logger = (req, res, next) => {
    let reqFrom = req.headers.origin ? req.headers.origin : req.headers.referer
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'requests.log')
    console.log(`${req.method} ${req.path}  ${reqFrom}`)
    //console.log(req.headers)
    next()
}

module.exports = { logEvents, logger }