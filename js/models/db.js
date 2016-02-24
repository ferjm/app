define(["exports"], function (exports) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  "use strict";

  var DB_DEVICE_STORE = "device";
  var DB_TAG_STORE = "tag";

  var Db = (function () {
    var Db = function Db() {
      /**
       * The name of the db
       */
      this.name = "foxbox-app";

      /**
       * The version of the indexed database
       */
      this.DB_VERSION = 1;

      /**
       * Our local indexed db where we store our copy of bookmarks
       */
      this.db = null;
    };

    Db.prototype.init = function () {
      var _this = this;
      return new Promise(function (resolve, reject) {
        var req = window.indexedDB.open(_this.idbName, _this.DB_VERSION);
        req.onupgradeneeded = _this.upgradeSchema;
        req.onsuccess = function (evt) {
          _this.db = evt.target.result;
          return resolve();
        };
        req.onerror = function (e) {
          console.error("Error opening database", e);
          return reject(e);
        };
      });
    };

    Db.prototype.upgradeSchema = function (evt) {
      var db = evt.target.result;
      var fromVersion = evt.oldVersion;
      if (fromVersion < 1) {
        var store = db.createObjectStore(DB_DEVICE_STORE, { keyPath: "id" });
        store.createIndex("id", "id", { unique: true });
        store.createIndex("type", "type", { unique: false });

        store = db.createObjectStore(DB_TAG_STORE, {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("name", "name", { unique: true });
      }
    };

    Db.prototype.getDevices = function () {
      return this.getAll(DB_DEVICE_STORE).call(this);
    };

    Db.prototype.getTags = function () {
      return getAll(DB_TAG_STORE).call(this);
    };

    Db.prototype.getDevice = function (id) {
      return getById(DB_DEVICE_STORE).call(this, id);
    };

    Db.prototype.getTag = function (id) {
      return getById(DB_TAG_STORE).call(this, id);
    };

    Db.prototype.setDevice = function (data) {
      return set(DB_DEVICE_STORE).call(this, data);
    };

    Db.prototype.setTag = function (data) {
      return set(DB_TAG_STORE).call(this, data);
    };

    Db.prototype.deleteDevice = function (data) {
      // Is useful?!
      return remove(DB_DEVICE_STORE).call(this, data);
    };

    Db.prototype.deleteTag = function (data) {
      return remove(DB_TAG_STORE).call(this, data);
    };

    _classProps(Db, null, {
      idbName: {
        get: function () {
          return this.name + "_db";
        }
      }
    });

    return Db;
  })();

  exports["default"] = Db;


  function getAll(store) {
    return function () {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this2.db.transaction([store], "readonly");
        var results = [];
        txn.onerror = reject;
        txn.oncomplete = function () {
          resolve(results);
        };
        txn.objectStore(store).openCursor().onsuccess = function (evt) {
          var cursor = evt.target.result;
          if (cursor) {
            results.push(cursor.value);
            cursor["continue"]();
          }
        };
      });
    };
  }

  function getById(store) {
    return function (id) {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this3.db.transaction([store], "readonly");
        txn.onerror = reject;
        txn.objectStore(store).get(id).onsuccess = function (evt) {
          resolve(evt.target.result);
        };
      });
    };
  }

  function set(store) {
    return function (data) {
      var _this4 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this4.db.transaction([store], "readwrite");
        txn.oncomplete = resolve;
        txn.onerror = reject;
        try {
          if (data.id) {
            txn.objectStore(store).put({ id: data.id, data: data });
          } else {
            txn.objectStore(store).put({ data: data });
          }
        } catch (e) {
          console.error("Error putting data in " + _this4.idbName + ":", e);
          resolve();
        }
      });
    };
  }

  function remove(store) {
    return function (id) {
      var _this5 = this;
      return new Promise(function (resolve, reject) {
        var txn = _this5.db.transaction([store], "readwrite");
        txn.oncomplete = resolve;
        txn.onerror = reject;
        try {
          txn.objectStore(store)["delete"](id);
        } catch (e) {
          console.error("Error deleting data from " + _this5.idbName + ":", e);
          resolve();
        }
      });
    };
  }
});