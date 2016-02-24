define(["exports", "components/fxos-mvc/dist/mvc", "js/views/device-page"], function (exports, _componentsFxosMvcDistMvc, _jsViewsDevicePage) {
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

  var Controller = _componentsFxosMvcDistMvc.Controller;
  var DevicePage = _jsViewsDevicePage["default"];
  var DeviceController = (function (Controller) {
    var DeviceController = function DeviceController() {
      Controller.apply(this, arguments);
    };

    _extends(DeviceController, Controller);

    DeviceController.prototype.main = function (id) {
      var _this = this;
      // Get the light ID of the bulb on the bridge.
      this.db.getDevice(id).then(function (response) {
        var lightId = response.data.lightId;

        // Request bulb details from the bridge given its light ID.
        _this.hue.getLight(lightId).then(function (response) {
          var props = response;
          props.lightId = lightId;
          props.db = _this.db;
          props.hue = _this.hue;
          _this.view = ReactDOM.render(React.createElement(DevicePage, props), _this.mountNode);
        });
      })["catch"](function (error) {
        console.error(error);
      });
    };

    return DeviceController;
  })(Controller);

  exports["default"] = DeviceController;
});