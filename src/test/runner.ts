import Jasmine from "jasmine";
import { SpecReporter } from "jasmine-spec-reporter";
import "./setup";
import * as glob from "globby";

const jrunner = new Jasmine();
jrunner.addMatchingSpecFiles(glob.sync(`${__dirname}/**/*[sS]pec.js`));
jrunner.addMatchingHelperFiles(glob.sync(`${__dirname}/helpers/**/*.js`));
jrunner.env.configure({
    stopSpecOnExpectationFailure: false,
    random: false
});
jrunner.env.clearReporters(); // jasmine >= 2.5.2, remove default reporter logs
jrunner.addReporter(new SpecReporter() as never); // add jasmine-spec-reporter
jrunner.loadConfigFile(); // load jasmine.json configuration

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jrunner.execute();
