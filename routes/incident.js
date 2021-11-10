const express = require('express')
const router = express.Router()

const incideController = require('../controller/incident')

router.get('/', incideController.getAllRecipes)
router.post('/', incideController.createNewRecipe)

router.get('/:id', incideController.getRecipeById)
router.put('/:id', incideController.updateRecipe)
router.delete('/:id', incideController.deleteRecipe)

module.exports = router