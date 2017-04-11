/**
 * Created by lifeg on 08/04/2017.
 */
let Jasmine = require('jasmine');
let SpecReporter = require('jasmine-spec-reporter');
let jrunner = new Jasmine();
jrunner.loadConfigFile("__test__/jasmine.json");
jrunner.env.clearReporters(); // jasmine >= 2.5.2, remove default reporter logs
jrunner.addReporter(new SpecReporter()); // add jasmine-spec-reporter
jrunner.loadConfigFile(); // load jasmine.json configuration
jrunner.execute();
//# sourceMappingURL=jrunner.js.map