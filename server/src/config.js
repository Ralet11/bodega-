// export const TOKEN_SECRET = 'some secret key'
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.DB_HOST, "host")
export const DB_HOST = process.env.DB_HOST 
export const FRONTEND_URL = process.env.FRONTEND_URL 

export const DB_DATABASE = process.env.DB_DATABASE 
export const DB_USER = process.env.DB_USER 
export const DB_PASSWORD = process.env.DB_PASSWORD 

export const TOKEN_SECRET = process.env.TOKEN_SECRET
 
export const EMAIL_USER = process.env.EMAIL_USER 
export const EMAIL_PASS = process.env.EMAIL_PASS 
export const SSK = process.env.SSK 
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER 

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
export const AWS_REGION = process.env.AWS_REGION
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME 
export const ACCOUNT_SID = process.env.ACCOUNT_SID  
export const AUTH_TOKEN = process.env.AUTH_TOKEN 
export const ENVIROMENT = process.env.ENVIROMENT
//migraciones: img en discount, 

console.log(DB_HOST,ENVIROMENT, DB_DATABASE, DB_USER, DB_PASSWORD,ACCOUNT_SID,AUTH_TOKEN, FRONTEND_URL, TOKEN_SECRET, EMAIL_USER, EMAIL_PASS,TWILIO_PHONE_NUMBER,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION, AWS_BUCKET_NAME,   "envs")