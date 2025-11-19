const { createCategory, getCategories, updateCategory, deleteCtegiry } = require('../../controllers/categoryController');
const auth = require('../../middlewares/auth');

const categoryRouter = require('express').Router();

categoryRouter.post('/add',auth,createCategory);

categoryRouter.get('/',auth,getCategories);

categoryRouter.put('/update/:id',auth,updateCategory);

categoryRouter.delete('/delete/:id',auth,deleteCtegiry)



module.exports = categoryRouter;