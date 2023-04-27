const express = require("express")
const mysql = require("mysql")

// Connection Object
var connection = mysql.createConnection({
    host     : process.env.SQL_CONNECTION_HOST,
    user     : process.env.SQL_CONNECTION_HOST_USER,
    password : process.env.SQL_CONNECTION_PASSWORD,
    database : process.env.SQL_DATABASE,
    port: 3306
});

// MySQL Connection
connection.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('connected to mysql')
    }
})

const app = express()


// Create table
app.get("/mysql/action", (req, res)=>{
    
    const sql = ''
    
    connection.query(sql, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })
})



const SQLConnection = connection
module.exports = SQLConnection;
