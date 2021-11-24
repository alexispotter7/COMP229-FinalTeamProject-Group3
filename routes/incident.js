const express = require('express')
const router = express.Router()

const incideController = require('../controller/incident')
const authMiddleware = require('../middlewares/auth')


router.get('/', incideController.getAllRecipes)
router.post('/', authMiddleware, incideController.createNewRecipe)

router.get('/:id', authMiddleware, incideController.getRecipeById)
router.put('/:id', authMiddleware, incideController.updateRecipe)
router.delete('/:id', authMiddleware, incideController.deleteRecipe)

module.exports = router