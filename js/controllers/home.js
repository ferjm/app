define(["exports", "components/fxos-mvc/dist/mvc", "js/views/home"], function (exports, _componentsFxosMvcDistMvc, _jsViewsHome) {
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
  var HomeView = _jsViewsHome["default"];
  var HomeController = (function (Controller) {
    var HomeController = function HomeController() {
      Controller.apply(this, arguments);
    };

    _extends(HomeController, Controller);

    HomeController.prototype.main = function () {
      var _this = this;
      this.hue.addEventListener("message", this.showMessage.bind(this));
      this.hue.addEventListener("dismiss-message", this.hideMessage.bind(this));

      this.view = ReactDOM.render(React.createElement(HomeView, {
        devices: [],
        hue: this.hue
      }), this.mountNode);

      this.hue.connectToBridge().then(this.hue.getLights.bind(this.hue)).then(function (devices) {
        console.log(devices);
        _this.view = ReactDOM.render(React.createElement(HomeView, {
          devices: devices,
          hue: _this.hue
        }), _this.mountNode);

        devices.forEach(function (device, id) {
          var lightId = (id + 1);

          _this.db.getDevice(device.uniqueid).then(function (deviceData) {
            if (!deviceData) {
              _this.db.setDevice({
                id: device.uniqueid,
                lightId: lightId
              });
            } else {
              deviceData.data.lightId = lightId; // In case the id changed.
              _this.db.setDevice(deviceData.data);
            }
          });
        });
      })["catch"](function (error) {
        console.error(error);
      });

      this.db.getTags().then(function (tags) {
        console.log(tags);
      })["catch"](function (error) {
        console.error(error);
      });
    };

    HomeController.prototype.teardown = function () {
      this.hue.removeEventListener("message", this.showMessage.bind(this));
      this.hue.removeEventListener("dismiss-message", this.hideMessage.bind(this));
    };

    HomeController.prototype.showMessage = function (message) {
      this.view.setState({
        visible: true,
        title: message.title,
        body: message.body
      });
    };

    HomeController.prototype.hideMessage = function () {
      this.view.setState({ visible: false });
    };

    return HomeController;
  })(Controller);

  exports["default"] = HomeController;
});