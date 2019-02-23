
// abstract
const {AbstractAppComponent} = require("../test-project/app/AbstractAppComponent");

// component
const {AnotherPageComponent} = require("../test-project/app/test/Children/AnotherPage/AnotherPageComponent");
const {TestPageComponent} = require("../test-project/app/test/Children/TestPage/TestPageComponent");
const {TestAppComponent} = require("../test-project/app/test/TestAppComponent");

module.exports = {
  "abstract": {
    AbstractAppComponent: AbstractAppComponent
  },
  "component": {
    AnotherPageComponent: AnotherPageComponent,
    TestPageComponent: TestPageComponent,
    TestAppComponent: TestAppComponent
  }
};
