var message = {
    send( action, topic, msg ) {
        this._socket.write( JSON.stringify( {
            gid : this._gid,
            action,
            topic,
            msg
        } ) )
    }
}

module.exports = message
