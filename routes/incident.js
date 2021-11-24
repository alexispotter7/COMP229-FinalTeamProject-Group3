const express = require('express')
const router = express.Router()

const incideController = require('../controller/incident')
const authMiddleware = require('../middlewares/auth')


router.get('/', incideController.getAllIncidents)
router.post('/', authMiddleware, incideController.createNewIncident)

router.get('/:id', authMiddleware, incideController.getIncidentById)
router.put('/:id', authMiddleware, incideController.updateIncident)
router.delete('/:id', authMiddleware, incideController.deleteIncident)

module.exports = router