var express = require('express')
var app = express()
var log4js = require('log4js')
var moment = require('moment')
var path = require('path')
var config = require('./config')

const logName = moment().format('YYYY年MM月DD日') + '.log'
log4js.configure({
  appenders: { cheese: { type: 'file', filename: path.join(__dirname, 'log', logName) } },
  categories: { default: { appenders: ['cheese'], level: 'debug' } }
})
var log = log4js.getLogger('admin')

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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(config.server.port, () => {
  log.info('服务启动成功！')
  console.log('RegionStidioServer start ok! port:::' + config.server.port)
})
