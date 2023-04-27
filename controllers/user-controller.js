const SQLConnection = require('../config/sql')


const mapSelected =(SelectedArray)=>{
   const mappingObj = { Parties: '1', Seminars: '2', Birthdays: '3', Weddings: '4', ThemeParties: '5', Conferences: '6', TradeShows: '7', CharityEvents: '8', MusicEvents: '9', SportingEvents: 'A', Festivals: 'B', NetworkingEvents: 'C', Dinners: 'D', ProductLaunch: 'E', Exhibitions: 'F',}
    
   var selectedStr = ''
    SelectedArray.map((item) => {
        selectedStr = selectedStr + mappingObj[item]
    })
    return selectedStr
}

const user_data = (req, res)=>{
    const {UserID, AuthMethod, UserName, DOB, Country, State, City, ZipCode, Selected, Gender, Age } = req.body
    const selectedCode = mapSelected(Selected)

    const sql = `INSERT INTO user_data(user_id, user_name, dob, country, state, city, zipcode, gender, age, intrest) VALUES ('${UserID}', '${UserName}','${DOB}', '${Country}','${State}', '${City}','${ZipCode}', '${Gender}','${Age}', '${selectedCode}')`
    SQLConnection.query(sql, (err, result)=>{
        if(err) {
            console.log(err)
        }else{
           
            const sql = `UPDATE ${AuthMethod}_auth SET complete = 1 WHERE auth_id='${UserID}'`
            SQLConnection.query(sql, (err, result)=>{
                if(err){
                    console.log(err)
                }else{
                    res.status(201).json(result)
                }

            })
        }
    })
}

const complete_check = (req, res) => {
    const {UserID, AuthMethod} = req.body
    
    const sql = `SELECT * FROM ${AuthMethod}_auth WHERE auth_id LIKE '${UserID}'`
    SQLConnection.query(sql, (err, result) => {
        if(err){
            console.log(err)
        }else{
            res.status(201).json(result[0])
        }
    })
}


const get_info =  (req, res) => {
    const {AuthId} = req.body

    const sql = `SELECT * FROM user_data WHERE user_id LIKE '${AuthId}'`
    SQLConnection.query(sql, (err, result) => {
        if(err){
            console.log(err)
        }else{
            res.status(201).json(result[0])
        }
    })
}

module.exports = {
    user_data,
    complete_check,
    get_info
}