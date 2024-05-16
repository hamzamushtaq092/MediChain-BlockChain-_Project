import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// cors means that form which url u can request to your backend usually it did by some urls 
//but in our case we did for all so we use *

//explore cors in  https://expressjs.com/en/resources/middleware/cors.html
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//security practices

app.use(express.json({limit:'50kb'}))  //it means that how much json data you can handle at one request


// handle urls data 

app.use(express.urlencoded({extended:true, limit:'50kb' })) //it means that how much url data you can handle at one request


app.use(express.static('public')) // is used to serve static files like images, CSS files, and JavaScript files.



// parse cookies is use to access the user browser cookies and set and also do CRUD operations on it


app.use(cookieParser())



//routes import 

import userRouter from './routes/user.route.js'
import patientRouter from './routes/patients.route.js'

// routes declaration
app.use('/api/v1/users',userRouter)

app.use('/api/v1/patients',patientRouter)


export {app }