
const {fossilP} = require('./lib/runners/promise-wrapped');
const {esModuleFactory, gitInstanceFactory, gitExportFactory} = require('./lib/fossil-factory');

module.exports = esModuleFactory(
   gitExportFactory(gitInstanceFactory, {fossilP})
);
