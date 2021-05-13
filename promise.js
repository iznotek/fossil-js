
const {esModuleFactory, gitExportFactory} = require('./src/lib/fossil-factory');
const {fossilP} = require('./src/lib/runners/promise-wrapped');

module.exports = esModuleFactory(
   gitExportFactory(fossilP)
);
