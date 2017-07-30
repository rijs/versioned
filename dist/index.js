'use strict';

// -------------------------------------------
// Global Versioning and Time Travel
// -------------------------------------------
module.exports = function version(ripple) {
  log('creating');

  var type = ripple.types['application/data'];
  ripple.on('change.version', commit(ripple));
  ripple.version = checkout(ripple);
  ripple.version.calc = calc(ripple);
  ripple.version.log = [];
  return ripple;
};

var commit = function commit(ripple) {
  return function (name, change) {
    return logged(ripple.resources[name]) && ripple.version.log.push(values(ripple.resources).filter(by(logged)).map(index));
  };
};

var index = function index(_ref) {
  var name = _ref.name;
  var body = _ref.body;
  return { name: name, index: body.log.length - 1 };
};

var checkout = function checkout(ripple) {
  return function (name, index) {
    return arguments.length == 2 ? resource(ripple)({ name: name, index: index }) : arguments.length == 1 && is.str(name) ? ripple.resources[name].body.log.length - 1 : arguments.length == 1 && is.num(name) ? application(ripple)(name) : arguments.length == 0 ? ripple.version.log.length - 1 : err('could not rollback', name, index);
  };
};

var application = function application(ripple) {
  return function (index) {
    return ripple.version.log[rel(ripple.version.log, index)].map(resource(ripple));
  };
};

var resource = function resource(ripple) {
  return function (_ref2) {
    var name = _ref2.name;
    var index = _ref2.index;
    return ripple(name, ripple.version.calc(name, index));
  };
};

var calc = function calc(ripple) {
  return function (name, index) {
    var log = ripple.resources[name].body.log,
        end = rel(log, index),
        i = end;

    if (log[end].cache) return log[end].cache;

    while (is.def(log[i].key)) {
      i--;
    }var root = clone(log[i].value);
    while (i !== end) {
      set(log[++i])(root);
    }return def(log[end], 'cache', root);
  };
};

var rel = function rel(log, index) {
  return index < 0 ? log.length + index - 1 : index;
};

var logged = function logged(res) {
  return res.body.log && res.body.log.max > 0;
};

var log = require('utilise/log')('[ri/versioned]'),
    err = require('utilise/err')('[ri/versioned]'),
    values = require('utilise/values'),
    clone = require('utilise/clone'),
    set = require('utilise/set'),
    key = require('utilise/key'),
    def = require('utilise/def'),
    by = require('utilise/by'),
    is = require('utilise/is');