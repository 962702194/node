const path = require('path')
const fs = require('fs')
const mammoth = require("mammoth")
const basePath = path.join(__dirname, '..', 'upload')

exports.upload = async (req, res) => {
    const { file } = req;
    const sourcePath = path.join(__dirname, '..', file.path);
    const destPath = path.join(basePath, file.originalname);
    fs.renameSync(sourcePath, destPath);
    res.json(true)
}

exports.getDirList = async (req, res) => {
    const dirPath = path.join(basePath)
    const dirList = fs.readdirSync(dirPath);
    if(dirList&&dirList.length){
        const fileList = fs.readdirSync(path.join(dirPath, dirList[0]));
        res.json({dir: dirList, file: fileList})
    }else{
        res.json({dir: dirList, file: []})
    }
}

exports.getFileList = async (req, res) => {
    const dirPath = path.join(basePath, req.body.dirName)
    const fileList = fs.readdirSync(dirPath);
    res.json(fileList || [])
}

exports.getFileContent = async (req, res) => {
    const {dirName, fileName} = req.body
    const {value} = await mammoth.convertToHtml({path: path.join(basePath, dirName, fileName)})
    res.json(value)
}

exports.createDir = async (req, res) => {
    const {dirName} = req.body
    const dirPath = path.join(basePath, dirName)
    const isExist = fs.existsSync(dirPath)
    if(!isExist){
        fs.mkdir(dirPath,(error)=>{
            if(error){
                res.json(false)
                return false;
            }
            res.json(true)
        })
    }else{
        res.json(false)
    }
}

exports.renameDir = async (req, res) => {
    const [oldName, newName] = req.body.dirName.split('->')
    const dirPath = path.join(basePath, oldName)
    const destPath = path.join(basePath, newName)
    const isExist = fs.existsSync(dirPath)
    if(isExist){
        fs.renameSync(dirPath, destPath);
        res.json(true)
    }else{
        res.json(false)
    }
}

exports.deleteDir = async (req, res) => {
    const {dirName} = req.body
    const dirPath = path.join(basePath, dirName)
    const isExist = fs.existsSync(dirPath)
    if(isExist){
        var files = fs.readdirSync(dirPath);//读取该文件夹
        for(let i=0,len=files.length;i<len;i++){
            fs.unlinkSync(path.join(dirPath, files[i])); 
        }
        fs.rmdirSync(dirPath);
        res.json(true)
    }else{
        res.json(false)
    }
}

exports.deleteFile = async (req, res) => {
    const {dirName,fileName} = req.body
    const filePath = path.join(basePath, dirName,fileName)
    const isExist = fs.existsSync(filePath)
    if(isExist){
        fs.unlinkSync(path.join(filePath))
        res.json(true)
    }else{
        res.json(false)
    }
}

exports.renameFile = async (req, res) => {
    const {dirName,fileName,rename} = req.body
    const filePath = path.join(basePath, dirName,fileName)
    const destPath = path.join(basePath, dirName,rename)
    const isExist = fs.existsSync(filePath)
    if(isExist){
        fs.renameSync(filePath, destPath);
        res.json(true)
    }else{
        res.json(false)
    }
}