# Ripple | Versioned
[![Coverage Status](https://coveralls.io/repos/rijs/versioned/badge.svg?branch=master&service=github)](https://coveralls.io/github/rijs/versioned?branch=master)
[![Build Status](https://travis-ci.org/rijs/versioned.svg)](https://travis-ci.org/rijs/versioned)

Adds versioning info and enables time travel, if there any resources being used which are [versioned](https://github.com/pemrouz/versioned/issues/1). This is achieved by materializing a list of indices of the individual versioned resources under `ripple.versioned.log`. A change in a versioned resource will create a new list of indicies. Rollbacking to a specfied time simply reregisters the snapshots of all the resources at that time.

```js
ripple.version()   // get current HEAD
ripple.version(10) // time travel to specified time, returns list of resources reset
```

You can also rollback individual resources:

```js
ripple.version('foo')     // get current HEAD for resource
ripple.version('foo', 10) // rollback resource, returns resource reset
```

Negative numbers are interpreted as relative to the current index:

```js
ripple.version(-1) // i.e. undo one step, HEAD~1
```