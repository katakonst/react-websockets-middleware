# React-websockets-middleware

A Redux WebSocket Middleware for React

## What it does?

This middleware connects, send and receive data from a websocket server

## Installation and Usage

### Installing

```
npm install react-websockets-midleware
```

Then you create the middleware and use it in your redux application
```js
import { createWebSocketMiddleware } from "../react-websockets-middleware"

const socketMiddleware = createWebSocketMiddleware({
    endpoint: "ws://localhost:9898"
  })
const store = createStore(rootReducer, applyMiddleware(socketMiddleware));
```

### Receiving actions

Any action received from the websocket middleware will be dispatched and handled by the reducers.

Current actions are:
```js
export const ActionTypes = {
    WEBSOCKET_CONNECTED: '@@react-web-sockets-middleware/WEBSOCKET_CONNECTED',
    WEBSOCKET_DISCONNECTED: '@@react-web-sockets-middleware/WEBSOCKET_DISCONNECTED',
    WEBSOCKET_ERROR: '@@react-web-sockets-middleware/WEBSOCKET_ERROR',
    WEBSOCKET_RECEIVE_DATA: '@@react-web-sockets-middleware/WEBSOCKET_RECEIVE_DATA',
    WEBSOCKET_WRITE_DATA: '@@react-web-sockets-middleware/WEBSOCKET_WRITE_DATA'
}
```
and can be imported as:
```js
import { ActionTypes } from "react-websockets-middleware"

```
How to use it in the reducer:
This will be called at every mesage received
```js
export function reducerExample(state, action: Action) {
  switch (action.type) {
    case ActionTypes.WEBSOCKET_RECEIVE_DATA:
        return {
          ...state,
          payload: state.payload,
          endpoint: state.endpoint
        };
    default:
      return state;
  }
}
        
```
### Dispatching actions

To send actions through the socket you can do the following:
```js
  dispatch({type: ActionTypes.WEBSOCKET_WRITE_DATA,
      endpoint:"ws://localhost:9898",
      payload: data})
}
```

## License
MIT