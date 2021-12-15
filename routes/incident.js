const express = require('express')
const router = express.Router()

const incideController = require('../controller/incident')
const authMiddleware = require('../middlewares/auth')
const adminAuthMiddleWare = require('../middlewares/adminAuth')


router.get('/', authMiddleware, incideController.getAllIncidents)
router.post('/', authMiddleware, incideController.createNewIncident)

router.get('/:id', authMiddleware, incideController.getIncidentById)
router.put('/:id', authMiddleware, incideController.updateIncident)
router.delete('/:id', authMiddleware, incideController.deleteIncident)

router.post('/:id/close', authMiddleware, incideController.closeIncidentStatus)

module.exports = router