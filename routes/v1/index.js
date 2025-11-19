const budgetRouter = require('./budgetRoutes');
const categoryRouter = require('./categoryRoutes');
const expenseRouter = require('./expenseRoutes');
const reportRouter = require('./reportRoutes');
const userRouter = require('./userRoutes');

const v1Router = require('express').Router();

v1Router.use('/user',userRouter);
v1Router.use('/category',categoryRouter);
v1Router.use('/budget',budgetRouter);
v1Router.use('/expense',expenseRouter);
v1Router.use('/report',reportRouter);

module.exports = v1Router;