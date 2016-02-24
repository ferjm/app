define(["exports", "components/fxos-mvc/dist/mvc"], function (exports, _componentsFxosMvcDistMvc) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

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

  var Model = _componentsFxosMvcDistMvc.Model;
  var Settings = (function (Model) {
    var Settings = function Settings() {
      Model.call(this, {
        _bridgeAddress: localStorage.getItem("bridgeAddress") || "",
        _userId: localStorage.getItem("userId") || ""
      });
    };

    _extends(Settings, Model);

    _classProps(Settings, null, {
      bridgeAddress: {
        get: function () {
          return this._bridgeAddress;
        },
        set: function (bridgeAddress) {
          bridgeAddress = String(bridgeAddress) || "";
          this._bridgeAddress = bridgeAddress.replace(/\/$/, ""); // Trailing slash.
          localStorage.setItem("bridgeAddress", this._bridgeAddress);
        }
      },
      userId: {
        get: function () {
          return this._userId;
        },
        set: function (userId) {
          this._userId = userId;
          localStorage.setItem("userId", this._userId);
        }
      }
    });

    return Settings;
  })(Model);

  exports["default"] = Settings;
});