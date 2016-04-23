var Net     = require( 'net' ),
    Message = require( './message' ),
    Client  = require( './client' ),
    Conf    = require( './conf' ),
    clients = [],
    server

function startServer() {
    console.log( Conf.port )
    server = Net.createServer( socket => {
        clients.push( socket )
        console.log( 'connected' )

        socket.on( 'data', data => {
            console.log( data.toString() )
        } )

        socket.on( 'end', () => {
            clients.splice( clients.indexOf( socket ), 1 )
            console.log( 'connection end' )
        } )
    } ).listen( Conf.port )

    return server
}

exports.createClient = type => {
    return Client( type )
}

startServer()
