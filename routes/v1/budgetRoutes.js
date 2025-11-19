const { createOrUpdateBudget, getBudgetsByMonth, deleteBudget } = require('../../controllers/budgetController');
const auth = require('../../middlewares/auth');

const budgetRouter = require('express').Router();

budgetRouter.post('/add',auth,createOrUpdateBudget);

budgetRouter.get('/',auth,getBudgetsByMonth);

budgetRouter.delete('/delete/:id',auth,deleteBudget);

module.exports = budgetRouter;