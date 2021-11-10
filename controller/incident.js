const express = require('express')
const incidentModel = require('../models/incident')

const { OK, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, CREATED, NO_CONTENT } = require('http-status-codes')

exports.getAllRecipes = (req, res) => {
    incidentModel.find((err, recipes) => {
        if (err) return res.status(INTERNAL_SERVER_ERROR).json({ "error": err.message })
        res.status(OK).json(recipes)
    })
}

exports.createNewRecipe = (req, res) => {
    const newRecipe = new incidentModel({
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
        description: req.body.description
    })    

    incidentModel.create(newRecipe, (err, incident) => {
        if (err) return res.status(BAD_REQUEST).json({"error": err.message})
        return res.status(CREATED).json(incident)
    }) 
}

exports.getRecipeById = (req, res) => {
    const incidentId = req.params.id 
    incidentModel.findById(incidentId, (err, incident) => {
        if (err) res.status(NOT_FOUND).json({"error": "Incident with that id does not exist"})
        res.status(OK).json(incident)
    })
}

exports.updateRecipe = (req, res) => {
   const incidentId = req.params.id
   const newRecipe = {
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
        description: req.body.description
    }  
   incidentModel.findOne({_id: incidentId}, (err,inc) => {
       if (err) {
            incidentModel.create(new incidentModel(newRecipe), (err, incident) => {
                if (err) return res.status(BAD_REQUEST).json({"error": err.message})
                return res.status(CREATED).json(incident)
            })  
       }
       else{
           incidentModel.updateOne({_id: incidentId}, newRecipe, (err, incident) => {
               if (err) return res.status(BAD_REQUEST).json({"error": err.message})
               return res.status(OK).json(newRecipe)
           })
       }
   })
}

exports.deleteRecipe = (req, res) => {
    incidentId = req.params.id
    incidentModel.deleteOne({_id: incidentId}, (err) => {
        if (err) return res.status(BAD_REQUEST).json({"error": "Incident with that id does not exist"})
        res.status(OK).json()
    })
}

// data = {
//     description: String,
//     priority: String,
//     customerInformation: String,
//     narrative: String,
//     record: String,
//     status: {
//         default: true
//     }
// }