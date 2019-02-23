
module.exports = {
  "phusion": {
    "routes": [
      {
        "path": "/",
        "component": "TestAppComponent",
        "children": [
          {
            "path": "page-one",
            "component": "TestPageComponent"
          },
          {
            "path": "page-two",
            "component": "AnotherPageComponent"
          }
        ]
      }
    ]
  }
};
