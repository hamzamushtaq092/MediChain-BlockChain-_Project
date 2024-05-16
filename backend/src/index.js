// require('dotenv').config({path:'./env'});
import dotenv from 'dotenv';
import express from 'express'; // Import Express
import connect_DB from './db/index.js';
import {app} from './app.js';

dotenv.config();


connect_DB()
.then(()=>{
    app.on('error',(error)=>{
        console.error('Error in app ',error)
        throw error
    })

    app.listen(process.env.PORT ||8000,()=>{
        console.log('Server is Listening on port ',process.env.PORT)
    })
})
.catch(error=>console.error('MongoDB connection Failed',error))

//async and await return a posmise
// actually this is a promise so it has .then and catch

//2nd Approuch to connect with mongodb {First is through the db foulder and make file there and import it}


// import express from 'express'
// const app = express()
// (async()=>{
//     try {
//         await mongoos.connect( `${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on('error',(error)=>{
//             console.error('Error in app ',error)
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log('Listening on port ',process.env.PORT)
//         })
        
//     } catch (error) {
//         console.error('Error in connecting to database',error)
//         throw error
        
//     }

// })()