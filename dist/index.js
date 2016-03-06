'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = version;

var _values = require('utilise/values');

var _values2 = _interopRequireDefault(_values);

var _key = require('utilise/key');

var _key2 = _interopRequireDefault(_key);

var _by = require('utilise/by');

var _by2 = _interopRequireDefault(_by);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Global Versioning and Time Travel
// -------------------------------------------
function version(ripple) {
  log('creating');

  ripple.on('change.version', commit(ripple));
  ripple.version = checkout(ripple);
  ripple.version.log = [];
  return ripple;
}

var commit = function commit(ripple) {
  return function (name, change) {
    return logged(ripple.resources[name]) && ripple.version.log.push((0, _values2.default)(ripple.resources).filter((0, _by2.default)('body.log')).map(index));
  };
};

var index = function index(_ref) {
  var name = _ref.name;
  var body = _ref.body;
  return { name: name, index: body.log.length - 1 };
};

var checkout = function checkout(ripple) {
  return function (name, index) {
    return arguments.length == 2 ? resource(ripple)({ name: name, index: index }) : arguments.length == 1 && _is2.default.str(name) ? ripple.resources[name].body.log.length - 1 : arguments.length == 1 && _is2.default.num(name) ? application(ripple)(name) : arguments.length == 0 ? ripple.version.log.length - 1 : err('could not rollback', name, index);
  };
};

var application = function application(ripple) {
  return function (index) {
    return ripple.version.log[rel(ripple.version, index)].map(resource(ripple));
  };
};

var resource = function resource(ripple) {
  return function (_ref2) {
    var name = _ref2.name;
    var index = _ref2.index;
    return ripple(name, ripple.resources[name].body.log[rel(ripple.resources[name].body, index)].value.toJS());
  };
};

var rel = function rel(_ref3, index) {
  var log = _ref3.log;
  return index < 0 ? log.length + index - 1 : index;
};

var logged = (0, _key2.default)('body.log');

var log = require('utilise/log')('[ri/versioned]'),
    err = require('utilise/err')('[ri/versioned]');