const path = require('path')
const express = require('express')
const expressApp = express()
const port = Number(process.env.PORT) || 3000

const staticPath = path.resolve(process.resourcesPath, './assets')
expressApp.use(express.static(staticPath))

expressApp.get('/*', (req, res) => {
    res.sendFile(path.resolve(staticPath, './index.html'))
})

exports.startExpress = (puerto = port) => {
    return new Promise((resolve, reject) => {
        
        expressApp
        .listen(puerto, () => {
            console.log('Listening on port: ', puerto)
            resolve(true)
        })
        .once('error', reject)
    })
}