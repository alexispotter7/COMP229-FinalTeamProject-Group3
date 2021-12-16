const express = require('express')
const incidentModel = require('../models/incident')
const userModel = require('../models/user')
const { OK, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, CREATED, NO_CONTENT } = require('http-status-codes')

exports.getAllIncidents = (req, res) => {
    // console.log(req.decoded) // to check what is passed to this controller    
    
    const username = req.decoded.username; // get user name that has gone through authentication

    //if the user is an authorized admin, it can get all the incidents. Otherwise, only the incidents it created
    const checkAdmin = (user) => { 

    console.log()

        if(user.admin == true) {            
            incidentModel.find((err, incidents) => {
                if (err) return res.status(INTERNAL_SERVER_ERROR).json({ "error": err.message })        
                res.status(OK).json(incidents)
            })
            
        } else {
            // res.json({"message": "Admin only can see all the things"})
            incidentModel.find({"owner": user.username}, (err, incidents) => {
                if (err) return res.status(INTERNAL_SERVER_ERROR).json({ "error": err.message })                        
                res.status(OK).json(incidents)
                console.log(incidents)
            })
        }
    } 

    userModel.findOneByUsername(username)
    .then(checkAdmin)    
}

exports.createNewIncident = (req, res) => {

    const date = new Date() // raw data for duration calculation   
    // const currentDate = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
       
    function formatDate(date) {
        yy = String(date.getYear() - 100) // For years greater than or equal to 2000, the value returned by getYear() is 100 or greater. For example, if the year is 2026, getYear() returns 126.
        mm = date.getMonth().toString()
        dd = date.getDate().toString()
        hh = date.getHours().toString()
        mm = date.getMinutes().toString()
        ss = date.getSeconds().toString()

        return yy+mm+dd+"-"+hh+mm+ss
    }
    

    const recordNum = formatDate(date)

    const newRecipe = new incidentModel({
        owner : req.decoded.username,
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        description: req.body.description,
        priority: req.body.priority,                
        createdDate: date,
        recordNumber: recordNum,
        incidentResoultion: req.body.incidentResoultion 
    })    
    // For Narrative
    // timestamp = new Date().toLocaleDateString('en-CA')
    timestamp = new Date()
    comment = req.body.newComment;
    var narr = {timestamp, comment} 
    newRecipe.narrative.push(narr)    

    incidentModel.create(newRecipe, (err, incident) => {
        if (err) return res.status(BAD_REQUEST).json({"error": err.message})
        return res.status(CREATED).json(incident)
    }) 
}

exports.getIncidentById = (req, res) => {
    const incidentId = req.params.id 
    incidentModel.findById(incidentId, (err, incident) => {
        if (err) res.status(NOT_FOUND).json({"error": "Incident with that id does not exist"})

        currentDate = new Date()
        
        result = Math.abs(currentDate - incident.createdDate) // the result is in milliseconds
        duration = function(result) {
            

            resultInSec = result / 1000
            resultInMin = resultInSec / 60
            resultInHour = resultInMin / 60
            resultInDay = resultInMin / 24

            dayInMilliSec =  1000 * 60 * 60 * 24
            hourInMilliSec = 1000 * 60 * 60
            minInMilliSec = 1000 * 60
            secInMilliSec = 1000

            
            if(dayInMilliSec <= result){
                return Math.floor(resultInDay) + " days(s)"
            }else if(hourInMilliSec <= result && result < dayInMilliSec) {                
               return Math.floor(resultInHour) + " hour(s)"
            }else if (minInMilliSec <= result && result < hourInMilliSec) {
                return Math.floor(resultInMin) + " minute(s)"
            }else if (secInMilliSec <= result && result < minInMilliSec) {
                return Math.floor(resultInSec) + " seconds(s)"
            }else {
                return result + " milliseconds(s)"
            }

        }

        incidentWithDuration = Object.assign(incident, {"incidentDuration" : String(duration(result))}) // The format of incidentDuration is String
        console.log(incident.createdDate)
        res.status(OK).json(incidentWithDuration)
    })
}


exports.updateIncident = async (req, res) => {
   const incidentId = req.params.id
    
// For Narrative
    // timestamp = new Date().toLocaleDateString('en-CA')
    timestamp = new Date()
    comment = req.body.newComment;   
    var narr = {timestamp, comment} 

    const newIncident = {
        owner : req.decoded.username,
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        description: req.body.description,
        priority: req.body.priority,              
        status: req.body.status,       
        incidentResoultion: req.body.incidentResoultion
     }

    try {
        const existingIncident = await incidentModel.findById(incidentId)        
        if (existingIncident.status === false) return res.status(403).json() // ???        
        await incidentModel.updateOne({_id:incidentId}, newIncident)
        
        var existingInci2 = await incidentModel.findById(incidentId)
        await existingInci2.narrative.push(narr)
        await console.log(existingInci2.narrative)
        existingInci2.save()
        // console.log(existingIncident.narrative)
        res.status(200).json()


    } catch(e) {
        console.log("Inside catch{}. Error occured")
        const newIncidentModel = new incidentModel(newIncident)
        await incidentModel.create(newIncidentModel)
        res.status(201).json()
    }
}

exports.deleteIncident = (req, res) => {
    const incidentId = req.params.id
    incidentModel.deleteOne({_id: incidentId}, (err) => {
        if (err) return res.status(BAD_REQUEST).json({"error": "Incident with that id does not exist"})
        res.status(OK).json()
    })
}

exports.closeIncidentStatus = async (req, res) => {
    const incidentId = req.params.id
    const incident = await incidentModel.findById(incidentId)
    incident.status = false
    await incidentModel.updateOne({_id: incidentId}, incident)
    res.status(200).json()
}