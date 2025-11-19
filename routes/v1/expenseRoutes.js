const { addExpense, getExpensesByMonth, updateExpense, deleteExpense } = require('../../controllers/expenseController');
const auth = require('../../middlewares/auth');

const expenseRouter = require('express').Router();

expenseRouter.post('/add',auth,addExpense);

expenseRouter.get('/',auth,getExpensesByMonth);

expenseRouter.put('/update/:id',auth,updateExpense);

expenseRouter.delete('/delete/:id',auth,deleteExpense);

module.exports = expenseRouter;