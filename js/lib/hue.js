define(["exports", "components/fxos-mvc/dist/mvc"], function (exports, _componentsFxosMvcDistMvc) {
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

  var Service = _componentsFxosMvcDistMvc.Service;


  var USER_NAME = "web";
  var APP_NAME = "foxbox-client";

  var loadJSON = function (method, url, content) {
    if (content === undefined) content = "";
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.responseType = "json";
      xhr.timeout = 3000;
      xhr.overrideMimeType("application/json");
      xhr.setRequestHeader("Accept", "application/json,text/javascript,*/*;q=0.01");
      xhr.addEventListener("load", function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject("Could not complete the operation.");
        }
      });
      xhr.addEventListener("error", reject);
      xhr.send(JSON.stringify(content));
    });
  };

  var toArray = function (object) {
    return Object.keys(object).map(function (k) {
      return object[k];
    });
  };

  var Hue = (function (Service) {
    var Hue = function Hue(settings) {
      this.settings = settings;
      Service.call(this);
    };

    _extends(Hue, Service);

    Hue.prototype.connectToBridge = function () {
      return this.getBridgeAddress().then(this.getUserId.bind(this));
    };

    Hue.prototype.getBridgeAddress = function () {
      var _this = this;
      return new Promise(function (resolve, reject) {
        if (_this.settings.bridgeAddress) {
          // @todo Try to ping it to see if it's still connected.
          return resolve(_this.settings.bridgeAddress);
        }

        loadJSON("GET", "https://www.meethue.com/api/nupnp").then(function (response) {
          if (!response) {
            return reject("Cannot reach the broker server. Make sure you're connected to the internet.");
          }

          if (!response.length) {
            return reject("No bridge found. Please connect a bridge and try again.");
          }

          // @todo Manage the case where several bridges are connected.
          _this.settings.bridgeAddress = response[0].internalipaddress;
          return resolve(_this.settings.bridgeAddress);
        });
      });
    };

    Hue.prototype.getUserId = function () {
      var _this2 = this;
      var retriesNumber = 10;
      var messageShown = false;

      return new Promise(function (resolve, reject) {
        if (_this2.settings.userId) {
          // @todo Check that this user ID is still working/authorised.
          return resolve(_this2.settings.userId);
        }

        var userInterval = setInterval(function () {
          loadJSON("POST", "http://" + _this2.settings.bridgeAddress + "/api", {
            devicetype: "" + APP_NAME + "#" + USER_NAME
          }).then(function (response) {
            console.log(response);

            if (response[0] && response[0].success) {
              _this2.settings.userId = response[0].success.username;
              clearInterval(userInterval);
              _this2._dispatchEvent("dismiss-message");
              return resolve(_this2.settings.userId);
            }

            if (response[0] && response[0].error.type === 101 && !messageShown) {
              _this2._dispatchEvent("message", {
                title: "Please link",
                body: "Please press the link button on your Philips bridge."
              });
              messageShown = true;
            }

            if (retriesNumber === 0) {
              clearInterval(userInterval);
              _this2._dispatchEvent("message", {
                title: "Error",
                body: "The link button was not pressed on time."
              });
              return reject("The link button was not pressed on time.");
            }

            retriesNumber--;
          });
        }, 1000);
      });
    };

    Hue.prototype.getLights = function () {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        return loadJSON("GET", "http://" + _this3.settings.bridgeAddress + "/api/" + _this3.settings.userId).then(function (response) {
          if (!response.lights) {
            return reject("lights property is missing.");
          }

          resolve(toArray(response.lights));
        });
      });
    };

    Hue.prototype.getLight = function (id) {
      var _this4 = this;
      return new Promise(function (resolve, reject) {
        return loadJSON("GET", "http://" + _this4.settings.bridgeAddress + "/api/" + _this4.settings.userId + "/lights/" + id).then(function (response) {
          if (!response) {
            return reject("Response is empty.");
          }

          resolve(response);
        });
      });
    };

    Hue.prototype.changeLightState = function (id, states) {
      var _this5 = this;
      return new Promise(function (resolve, reject) {
        return loadJSON("PUT", "http://" + _this5.settings.bridgeAddress + "/api/" + _this5.settings.userId + "/lights/" + id + "/state", states).then(function (response) {
          if (response[0] && response[0].error) {
            return reject(response[0].error.description);
          }

          resolve(response);
        });
      });
    };

    Hue.prototype.changeLightAttribute = function (id, attrs) {
      var _this6 = this;
      return new Promise(function (resolve, reject) {
        return loadJSON("PUT", "http://" + _this6.settings.bridgeAddress + "/api/" + _this6.settings.userId + "/lights/" + id, attrs).then(function (response) {
          if (response[0] && response[0].error) {
            return reject(response[0].error.description);
          }

          resolve(response);
        });
      });
    };

    return Hue;
  })(Service);

  exports["default"] = Hue;
});