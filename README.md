# Distance_control

A tool to emulate mouse over the network on Linux

## Installation

Just run:
```
npm install
```

The package need:
- node
- npm

And is dependent on:
- socket.io
- express

## Usage


Launch the server with
```
node index.js
```

The server should be accessible on port `3000`

## How did it works ?

Requests are sended to the server with websocket using socket.io,
then, in the backend it uses the unixtool `xdotool` to control the mouse.

The canvas tool is JS native.
