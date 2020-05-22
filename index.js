const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const compression = require('compression')
const log4js = require('log4js')
const moment = require('moment')
const path = require('path')
const multer = require('multer')
const config = require('./config')

const logName = moment().format('YYYY年MM月DD日') + '.log'
const log = log4js.getLogger('admin')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname)
  }
})

log4js.configure({
  appenders: { cheese: { type: 'file', filename: path.join(__dirname, 'log', logName) } },
  categories: { default: { appenders: ['cheese'], level: 'debug' } }
})

app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage }).single('file'))
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => { }
}))

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  next()
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))
app.post('/upload', require('./routes/File').upload)
app.get('/getDirList', require('./routes/File').getDirList)
app.post('/getFileList', require('./routes/File').getFileList)
app.post('/getFileContent', require('./routes/File').getFileContent)
app.post('/createDir', require('./routes/File').createDir)
app.post('/renameDir', require('./routes/File').renameDir)
app.post('/deleteDir', require('./routes/File').deleteDir)
app.post('/deleteFile', require('./routes/File').deleteFile)
app.post('/renameFile', require('./routes/File').renameFile)

app.listen(config.server.port, () => {
  log.info('服务启动成功！')
  console.log('RegionStidioServer start ok! port:::' + config.server.port)
})
