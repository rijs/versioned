// -------------------------------------------
// Global Versioning and Time Travel
// -------------------------------------------
export default function version(ripple){
  log('creating')

  ripple.on('change.version', commit(ripple))
  ripple.version = checkout(ripple)
  ripple.version.log = []
  return ripple
}

const commit = ripple => (name, change) => logged(ripple.resources[name]) && 
  ripple.version.log
    .push(values(ripple.resources)
      .filter(by('body.log'))
      .map(index))

const index = ({ name, body }) => ({ name, index: body.log.length-1 })

const checkout = ripple => function(name, index) {
  return arguments.length == 2                 ? resource(ripple)({ name, index })
       : arguments.length == 1 && is.str(name) ? ripple.resources[name].body.log.length-1
       : arguments.length == 1 && is.num(name) ? application(ripple)(name)
       : arguments.length == 0                 ? ripple.version.log.length - 1
       : err('could not rollback', name, index)
}

const application = ripple => index => ripple
  .version
  .log
  [rel(ripple.version, index)]
  .map(resource(ripple))

const resource = ripple => ({ name, index }) => ripple(
  name
, ripple.resources[name].body.log[rel(ripple.resources[name].body, index)].value.toJS()
)

const rel = ({ log }, index) => index < 0 ? log.length + index - 1 : index

const logged = key('body.log')

const log = require('utilise/log')('[ri/versioned]')
    , err = require('utilise/err')('[ri/versioned]')
import values from 'utilise/values'
import key from 'utilise/key'
import by from 'utilise/by'
import is from 'utilise/is'