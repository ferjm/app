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

  var TagItem = (function (React) {
    var TagItem = function TagItem(props) {
      React.Component.call(this, props);
      this.props = props;
      this.state = { checked: props.checked };

      this.db = props.db;
    };

    _extends(TagItem, React.Component);

    TagItem.prototype.handleSetTag = function (evt) {
      var _this = this;
      var value = evt.target.checked;
      this.setState({ checked: value });

      this.db.getDevice(this.props.deviceId).then(function (device) {
        if (!device.data.tags) {
          device.data.tags = [];
        }

        device.data.tags = device.data.tags.filter(function (tag) {
          return tag !== _this.props.id;
        });
        if (value) {
          device.data.tags.push(_this.props.id);
        }

        _this.db.setDevice(device.data);
      })["catch"](function (error) {
        _this.setState({ checked: !value }); // Revert back to original state.
        console.error(error);
      });
    };

    TagItem.prototype.render = function () {
      return (React.createElement("li", null, React.createElement("label", null, React.createElement("input", {
        type: "checkbox",
        checked: this.state.checked,
        onChange: this.handleSetTag.bind(this)
      }), this.props.name)));
    };

    return TagItem;
  })(React);

  exports["default"] = TagItem;
});