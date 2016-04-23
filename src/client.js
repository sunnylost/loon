'use strict'

var EventEmitter = require( 'events' ).EventEmitter,
    Net          = require( 'net' ),
    Message      = require( './message' ),
    Conf         = require( './conf' ),
    gid          = 0,
    typeSymbol   = Symbol( 'type' )

const PUB   = 'pub',
      SUB   = 'sub',
      P2P   = 'p2p',
      TOPIC = 'topic'

class Client extends EventEmitter {
    constructor( type ) {
        super()

        this._gid          = ++gid
        this._socket       = Net.connect( Conf.port )
        this[ typeSymbol ] = type
    }
}

class PubSubClient extends Client {
    constructor( type ) {
        super( type )

        this._socket.on( 'data', data => {
            this.emit( TOPIC, data.toString() )
        } )
    }

    publish( topic, msg ) {
        if ( this[ typeSymbol ] == PUB ) {
            Message.send.call( this, PUB, topic, msg )
        }
        return this
    }

    subscribe( topic ) {
        if ( this[ typeSymbol ] == SUB ) {
            Message.send.call( this, SUB, topic )
        }
        return this
    }
}

class P2PClient extends Client {
    constructor() {
        super( P2P )
    }
}

module.exports = type => {
    if ( type === PUB || type === SUB ) {
        return new PubSubClient( type )
    } else {
        return new P2PClient()
    }
}
