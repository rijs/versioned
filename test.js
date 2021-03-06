var core      = require('rijs.core').default
  , data      = require('rijs.data').default
  , update    = require('utilise/update')
  , push      = require('utilise/push')
  , expect    = require('chai').expect
  , version   = require('./').default

describe('Versioned', function(){

  it('should initialise api', function(){  
    var ripple = version(data(core()))
    expect(ripple.version).to.be.a('function')
    expect(ripple.version.log).to.be.eql([])
    expect(ripple.version()).to.be.eql(-1)
  })

  it('should time travel - resource', function(){  
    var ripple = version(data(core()))
      
    expect(ripple('foo', {}, { log: 10 })).to.be.eql({})
    expect(ripple.version('foo')).to.be.eql(0)
    expect(ripple.version.log).to.be.eql([[{ name: 'foo', index: 0 }]])

    update('foo', 'bar')(ripple('foo'))

    expect(ripple('foo')).to.be.eql({ foo: 'bar' })
    expect(ripple.version('foo')).to.be.eql(1)
    expect(ripple.version.log).to.be.eql([[{ name: 'foo', index: 0 }], [{ name: 'foo', index: 1 }]])

    ripple.version('foo', 0)

    expect(ripple.version('foo')).to.be.eql(2)
    expect(ripple.resources.foo.body).to.be.eql({})

    ripple.version('foo', -1)

    expect(ripple.version('foo')).to.be.eql(3)
    expect(ripple.resources.foo.body).to.be.eql({ foo: 'bar' })
  })

  it('should time travel - application', function(){  
    var ripple = version(data(core()))
      
    expect(ripple('foo', {}, { log: 10 })).to.be.eql({})
    expect(ripple('bar', [], { log: 10 })).to.be.eql([])
    expect(ripple.version()).to.be.eql(1)
    expect(ripple.version.log).to.be.eql([
      [{ name: 'foo', index: 0 }]
    , [{ name: 'foo', index: 0 }, { name: 'bar', index: 0 }]
    ])

    update('foo', 'bar')(ripple('foo'))
    push('baz')(ripple('bar'))

    expect(ripple.version()).to.be.eql(3)
    expect(ripple.version.log).to.be.eql([
      [{ name: 'foo', index: 0 }]
    , [{ name: 'foo', index: 0 }, { name: 'bar', index: 0 }]
    , [{ name: 'foo', index: 1 }, { name: 'bar', index: 0 }]
    , [{ name: 'foo', index: 1 }, { name: 'bar', index: 1 }]
    ])
    expect(ripple.resources.foo.body).to.be.eql({ foo: 'bar' })
    expect(ripple.resources.bar.body).to.be.eql(['baz'])

    expect(ripple.version(-1).length).to.eql(2)
    expect(ripple.version()).to.be.eql(5)
    expect(ripple.resources.foo.body).to.be.eql({ foo: 'bar' })
    expect(ripple.resources.bar.body).to.be.eql([])

    expect(ripple.version(1).length).to.eql(2)
    expect(ripple.version()).to.be.eql(7)
    expect(ripple.resources.foo.body).to.be.eql({})
    expect(ripple.resources.bar.body).to.be.eql([])
  })

  it('should ignore invalid input', function(){
    var ripple = version(data(core()))
    expect(ripple.version(false)).to.eql('could not rollback')
    expect(ripple.version(undefined)).to.eql('could not rollback')
  })

})