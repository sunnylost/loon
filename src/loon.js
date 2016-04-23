'use strict'

var Net     = require( 'net' ),
    Client  = require( './client' ),
    Conf    = require( './conf' ),
    clients = [],
    topics  = {},
    server

function handleData( socket, data ) {
    let topic = topics[ data.topic ]

    switch ( data.action ) {
        case 'pub':
            for ( let client of topic ) {
                if ( client.gid != data.gid ) {
                    client.socket.write( data.msg )
                }
            }
            break

        case 'sub':
            if ( !topic ) {
                topic = topics[ data.topic ] = new Set
            }

            topic.add( {
                gid : data.gid,
                socket
            } )
            break
    }
}

function startServer() {
    server = Net.createServer( socket => {
        clients.push( socket )

        socket.on( 'data', data => {
            handleData( socket, JSON.parse( data.toString() ) )
        } )

        socket.on( 'end', () => {
            clients.splice( clients.indexOf( socket ), 1 )
        } )
    } ).listen( Conf.port )

    return server
}

exports.createClient = type => {
    return Client( type )
}

startServer()
