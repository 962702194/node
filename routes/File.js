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