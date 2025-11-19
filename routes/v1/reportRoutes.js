const { getMonthllyReport } = require('../../controllers/reportsController');
const auth = require('../../middlewares/auth');

const reportRouter = require('express').Router();

reportRouter.get('/',auth,getMonthllyReport)

module.exports = reportRouter;