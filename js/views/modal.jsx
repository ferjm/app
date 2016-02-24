define(["exports"], function (exports) {
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

  var Modal = (function (React) {
    var Modal = function Modal(props) {
      React.Component.call(this, props);
      this.state = {
        dismissed: false
      };
    };

    _extends(Modal, React.Component);

    Modal.prototype.close = function () {
      this.setState({ dismissed: true });
    };

    Modal.prototype.render = function () {
      var style = "modal" + ((this.state.dismissed ? false : this.props.visible) ? " visible" : "");

      return (React.createElement("div", {
        className: style
      }, React.createElement("header", null, React.createElement("h1", null, this.props.title)), React.createElement("div", null, this.props.body), React.createElement("footer", null, React.createElement("button", {
        onClick: this.close.bind(this)
      }, "Close"))));
    };

    return Modal;
  })(React);

  exports["default"] = Modal;
});