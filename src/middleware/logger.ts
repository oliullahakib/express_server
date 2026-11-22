import {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import fs from "fs"
const logger = (req:Request,res:Response, next:NextFunction)=>{
const url = req.url
const method = req.method
const time = Date.now()
const log = `\nMethod: ${method} | URL : ${url} | Time: ${time}\n`
fs.appendFile("looger.txt",log,(err)=>console.log(err))
next()
}
export default logger