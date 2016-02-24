define(["exports", "components/fxos-mvc/dist/mvc", "js/controllers/home", "js/controllers/device", "js/lib/hue", "js/models/settings", "js/models/db"], function (exports, _componentsFxosMvcDistMvc, _jsControllersHome, _jsControllersDevice, _jsLibHue, _jsModelsSettings, _jsModelsDb) {
  "use strict";

  var _extends = function (child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    child.__proto__ = parent;
  };

  var RoutingController = _componentsFxosMvcDistMvc.RoutingController;
  var HomeController = _jsControllersHome["default"];
  var DeviceController = _jsControllersDevice["default"];
  var Hue = _jsLibHue["default"];
  var Settings = _jsModelsSettings["default"];
  var Db = _jsModelsDb["default"];
  var MainController = (function (RoutingController) {
    var MainController = function MainController() {
      this.settings = new Settings();
      this.db = new Db();
      this.hue = new Hue(this.settings);
      this.mountNode = document.getElementById("main");
      var options = {
        settings: this.settings,
        db: this.db,
        hue: this.hue,
        mountNode: this.mountNode
      };

      RoutingController.call(this, {
        home: new HomeController(options),
        "home/device/(.+)": new DeviceController(options)
      });
    };

    _extends(MainController, RoutingController);

    MainController.prototype.main = function () {
      window.location.hash = "";
      this.db.init().then(function () {
        window.location.hash = "#home";
      });
    };

    return MainController;
  })(RoutingController);

  exports["default"] = MainController;
});