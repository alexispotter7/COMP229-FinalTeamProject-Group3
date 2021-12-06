const express = require('express')
const incidentModel = require('../models/incident')

const { OK, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, CREATED, NO_CONTENT } = require('http-status-codes')

exports.getAllIncidents = (req, res) => {
    incidentModel.find((err, incidents) => {
        if (err) return res.status(INTERNAL_SERVER_ERROR).json({ "error": err.message })
        res.status(OK).json(incidents)
    })
}

exports.createNewIncident = (req, res) => {
    const newRecipe = new incidentModel({
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
        description: req.body.description,
        priority: req.body.priority,
        customerInformation: req.body.customerInformation,
        narrative: req.body.narrative,
        record: req.body.record,
    })    

    incidentModel.create(newRecipe, (err, incident) => {
        if (err) return res.status(BAD_REQUEST).json({"error": err.message})
        return res.status(CREATED).json(incident)
    }) 
}

exports.getIncidentById = (req, res) => {
    const incidentId = req.params.id 
    incidentModel.findById(incidentId, (err, incident) => {
        if (err) res.status(NOT_FOUND).json({"error": "Incident with that id does not exist"})
        res.status(OK).json(incident)
    })
}


exports.updateIncident = async (req, res) => {
   const incidentId = req.params.id
   const newIncident = {
       name: req.body.name,
       date: req.body.date,
       address: req.body.address,
       description: req.body.description,
       priority: req.body.priority,
       customerInformation: req.body.customerInformation,
       narrative: req.body.narrative,
       record: req.body.record,
       status: req.body.status
    }  
    try {
        const existingIncident = await incidentModel.findById(incidentId)
        // console.log(existingIncident.status === false)
        if (existingIncident.status === false) return res.sendStatus(403)
        console.log("hello")
        await incidentModel.updateOne({_id:incidentId}, newIncident)
        res.sendStatus(200)
    } catch(e) {
        const newIncidentModel = new incidentModel(newIncident)
        await incidentModel.create(newIncidentModel)
        res.sendStatus(201)
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
    res.sendStatus(200)
}