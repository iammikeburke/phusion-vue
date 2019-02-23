
// abstract
const {AbstractAppComponent} = require("../test-project/app/AbstractAppComponent");

// component
const {AnotherPageComponent} = require("../test-project/app/test/Children/AnotherPage/AnotherPageComponent");
const {TestPageComponent} = require("../test-project/app/test/Children/TestPage/TestPageComponent");
const {TestAppComponent} = require("../test-project/app/test/TestAppComponent");

module.exports = [
  {
    "path": "/",
    "component": TestAppComponent,
    "children": [
      {
        "path": "page-one",
        "component": TestPageComponent
      },
      {
        "path": "page-two",
        "component": AnotherPageComponent
      }
    ]
  }
];
