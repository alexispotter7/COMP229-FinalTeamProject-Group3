const express = require('express')
const router = express.Router()

const incideController = require('../controller/incident')

router.get('/', incideController.getAllIncidents)
router.post('/', incideController.createNewIncident)

router.get('/:id', incideController.getIncidentById)
router.put('/:id', incideController.updateIncident)
router.delete('/:id', incideController.deleteIncident)

module.exports = router