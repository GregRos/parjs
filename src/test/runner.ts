

let Jasmine = require("jasmine");
const {SpecReporter} = require("jasmine-spec-reporter");
import "./setup";
import * as glob from "globby";

let jrunner = new Jasmine();
jrunner.specDir = "dist/test";
jrunner.specFiles = glob.sync(`${__dirname}/unit/**/*[sS]pec.js`);
jrunner.helpers = glob.sync(`${__dirname}/helpers/**/*.js`);
jrunner.stopSpecOnExpectationFailure = false;
jrunner.random = false;
jrunner.env.clearReporters();                       // jasmine >= 2.5.2, remove default reporter logs
jrunner.addReporter(new SpecReporter());            // add jasmine-spec-reporter
jrunner.loadConfigFile();                           // load jasmine.json configuration
jrunner.execute();
