define(["exports", "js/views/tag-item"], function (exports, _jsViewsTagItem) {
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

  var TagItem = _jsViewsTagItem["default"];
  var TagList = (function (React) {
    var TagList = function TagList(props) {
      React.Component.call(this, props);
      this.db = props.db;
    };

    _extends(TagList, React.Component);

    TagList.prototype.render = function () {
      var _this = this;
      var tagNodes = this.props.tags.map(function (tag) {
        return (React.createElement(TagItem, {
          key: tag.id,
          id: tag.id,
          name: tag.data.name,
          checked: tag.data.checked,
          deviceId: _this.props.deviceId,
          db: _this.db
        }));
      });

      return (React.createElement("ul", {
        className: "tag-list"
      }, tagNodes));
    };

    return TagList;
  })(React);

  exports["default"] = TagList;
});