'use strict'

var EventEmitter = require( 'events' ).EventEmitter,
    Net          = require( 'net' ),
    Message      = require( './message' ),
    Conf         = require( './conf' ),
    gid          = 0

class Client extends EventEmitter {
    constructor( type ) {
        super()
        var socket

        this._gid      = ++gid
        this._channesl = []
        this._socket   = socket = Net.connect( Conf.port )

        socket.on( 'data', data => {
            this.trigger( 'topic', data.toString() )
        } )
    }

    connect( channel ) {
        this._channesl.push( channel )
        this._socket.write()
    }
}

class PubSubClient extends Client {
    constructor( type ) {
        super( type )
    }

    publish( topic ) {
        this._socket.write( `${this._gid}:pub:${topic}` )
        return this
    }

    subscribe( topic ) {
        this._socket.write( `${this._gid}:sub:${topic}` )
        return this
    }
}

class P2PClient extends Client {
    constructor() {
        super( 'p2p' )
    }
}

module.exports = type => {
    if ( type === 'pub' || type === 'sub' ) {
        return new PubSubClient( type )
    } else {
        return new P2PClient()
    }
}
