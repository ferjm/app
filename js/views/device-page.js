define(["exports", "js/views/footer-menu", "js/views/tag-list"], function (exports, _jsViewsFooterMenu, _jsViewsTagList) {
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
  var TagList = _jsViewsTagList["default"];
  var DevicePage = (function (React) {
    var DevicePage = function DevicePage(props) {
      React.Component.call(this, props);
      this.props = props;
      this.state = {
        tags: [],
        name: props.name
      };

      this.db = props.db;
      this.hue = props.hue;
    };

    _extends(DevicePage, React.Component);

    DevicePage.prototype.componentDidMount = function () {
      this.populateTags();
    };

    DevicePage.prototype.populateTags = function () {
      var _this = this;
      Promise.all([this.db.getDevice(this.props.uniqueid), this.db.getTags()]).then(function (response) {
        var device = response[0];
        var tags = response[1];

        tags.forEach(function (tag) {
          tag.data.checked = !!(device.data.tags && device.data.tags.includes(tag.id));
        });

        _this.setState({ tags: tags });
      });
    };

    DevicePage.prototype.handleRename = function () {
      var _this2 = this;
      var oldName = this.state.name;
      var deviceName = prompt("Enter new device name", oldName);

      if (!deviceName || !deviceName.trim()) {
        return;
      }

      deviceName = deviceName.trim();

      this.setState({ name: deviceName }); // Optimist update.

      this.hue.changeLightAttribute(this.props.lightId, { name: deviceName })["catch"](function (error) {
        _this2.setState({ name: oldName }); // Revert to previous value.
        console.error(error);
      });
    };

    DevicePage.prototype.handleAddTag = function () {
      var _this3 = this;
      var tagName = prompt("Enter new tag name");

      if (!tagName || !tagName.trim()) {
        return;
      }

      tagName = tagName.trim();
      this.db.setTag({ name: tagName }).then(function () {
        _this3.populateTags(); // Needed to get the newly added tag ID.
      });
    };

    DevicePage.prototype.render = function () {
      return (React.createElement("div", null, React.createElement("header", null, React.createElement("h1", null, this.state.name), React.createElement("img", {
        className: "rename",
        src: "css/icons/rename.svg",
        alt: "Rename",
        onClick: this.handleRename.bind(this)
      })), React.createElement("h2", null, "Tags"), React.createElement(TagList, {
        tags: this.state.tags,
        deviceId: this.props.uniqueid,
        db: this.db
      }), React.createElement("div", {
        className: "add"
      }, React.createElement("span", {
        onClick: this.handleAddTag.bind(this)
      }, "Create a new tag")), React.createElement(FooterMenu, null)));
    };

    return DevicePage;
  })(React);

  exports["default"] = DevicePage;
});