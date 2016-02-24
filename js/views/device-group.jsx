define(["exports", "js/views/device-item"], function (exports, _jsViewsDeviceItem) {
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

  var DeviceItem = _jsViewsDeviceItem["default"];
  var DeviceGroup = (function (React) {
    var DeviceGroup = function DeviceGroup() {
      React.Component.apply(this, arguments);
    };

    _extends(DeviceGroup, React.Component);

    DeviceGroup.prototype.render = function () {
      var _this = this;
      var deviceNodes = this.props.devices.map(function (device, id) {
        return (React.createElement(DeviceItem, {
          key: device.uniqueid,
          id: device.uniqueid,
          lightId: id + 1,
          type: device.type,
          name: device.name,
          manufacturer: device.manufacturername,
          modelid: device.modelid,
          state: device.state,
          hue: _this.props.hue
        }));
      });

      return (React.createElement("ul", {
        className: "device-list"
      }, deviceNodes));
    };

    return DeviceGroup;
  })(React);

  exports["default"] = DeviceGroup;
});