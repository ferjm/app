define(["exports", "js/views/footer-menu", "js/views/device-group", "js/views/modal"], function (exports, _jsViewsFooterMenu, _jsViewsDeviceGroup, _jsViewsModal) {
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

  var FooterMenu = _jsViewsFooterMenu["default"];
  var DeviceGroup = _jsViewsDeviceGroup["default"];
  var Modal = _jsViewsModal["default"];
  var HomeView = (function (React) {
    var HomeView = function HomeView(props) {
      React.Component.call(this, props);
      this.state = {
        visible: false,
        title: "",
        body: ""
      };
    };

    _extends(HomeView, React.Component);

    HomeView.prototype.render = function () {
      return (React.createElement("div", null, React.createElement("header", null, React.createElement("h1", null, "My Home")), React.createElement("h2", null, "General"), React.createElement(DeviceGroup, {
        devices: this.props.devices,
        hue: this.props.hue
      }), React.createElement(Modal, {
        visible: this.state.visible,
        title: this.state.title,
        body: this.state.body
      }), React.createElement(FooterMenu, null)));
    };

    return HomeView;
  })(React);

  exports["default"] = HomeView;
});