export default createWebSocketMiddleware

export const ActionTypes = {
    WEBSOCKET_CONNECTED: '@@react-websockets-middleware/WEBSOCKET_CONNECTED',
    WEBSOCKET_DISCONNECTED: '@@react-websockets-middleware/WEBSOCKET_DISCONNECTED',
    WEBSOCKET_ERROR: '@@react-websockets-middleware/WEBSOCKET_ERROR',
    WEBSOCKET_RECEIVE_DATA: '@@react-websockets-middleware/WEBSOCKET_RECEIVE_DATA',
    WEBSOCKET_WRITE_DATA: '@@react-websockets-middleware/WEBSOCKET_WRITE_DATA'
}

export function createWebSocketMiddleware (configs = {}) {
    const connections = {}

    if (!configs.endpoint) {
        throw new Error("No endpoint passed")
    }

    return function (store) {
        connections[configs.endpoint] = createSocketConnection(configs.endpoint, store, connections);

        return function (next) {
            return function (action) {
                console.log(isWebSocketAction(action))
                if (!isWebSocketAction(action)) {
                    return next(action)
                }

                const endpoint = action.endpoint
                const connection = connections[endpoint]

                if (!connection) {
                    throw new Error("No connection for endpoint: " + endpoint)
                }
                if (action.type === ActionTypes.WEBSOCKET_WRITE_DATA) {
                    connection.socket.send(action.payload)
                } else {
                    return next(action)
                }
            }
        }
    }
}

function createSocketConnection (endpoint, store, connections) {
    const connection = {
        endpoint: endpoint,
        socket: new WebSocket(endpoint),
    }

    connections[endpoint] = connection
    connection.socket.onmessage =function (data) {
        store.dispatch({
            type: ActionTypes.WEBSOCKET_RECEIVE_DATA,
            payload: data,
            endpoint: endpoint
        })
    }

    connection.socket.onopen = function () {
        store.dispatch({
            type: ActionTypes.WEBSOCKET_CONNECTED,
            endpoint: endpoint
        })
    }

    connection.socket.onclose = function () {
        store.dispatch({
            type: ActionTypes.WEBSOCKET_DISCONNECTED,
            endpoint: endpoint
        })
    }

    connection.socket.onerror = function (error) {
        store.dispatch({
                type: ActionTypes.WEBSOCKET_ERROR,
                payload: new Error(error),
                endpoint: endpoint,
                error: true
            }
        )
    }
    return connection
}

export function isWebSocketAction (action) {
    return [
        ActionTypes.WEBSOCKET_CONNECTED,
        ActionTypes.WEBSOCKET_DISCONNECTED,
        ActionTypes.WEBSOCKET_ERROR,
        ActionTypes.WEBSOCKET_RECEIVE_DATA,
        ActionTypes.WEBSOCKET_WRITE_DATA,
    ].indexOf(action.type) > -1
}
