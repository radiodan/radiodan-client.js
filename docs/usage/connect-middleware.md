The Radiodan client is installed as an npm module, which means server-side
nodejs code can access the objects. We've also provided a [connect
middleware][1] to provide access to the same objects in the browser.

# Using the middleware

Using [Express][2]:
```javascript
var app      = require('express')();
var radiodan = require('radiodan-client');

// mount the middleware at /radiodan
// allow requests from other domains (default: false)
app.use('/radiodan',
  radiodan.middleware({crossOrigin: true})
);

// access at http://localhost:5000
app.listen(5000);
```

# Accessing the client-side objects

In your HTML page, link to the radiodan client code (assuming you've mounted the
middleware at `/radiodan`):

```html
<script src="/radiodan/client.js"></script>
```

This will attach the `Radiodan` object to `window`.

## Objects exposed by the client-side API

* [Player](../api/player.md)
* [Audio Device](../api/audio.md)

## Accessing Objects Example

To get an instance of player with id of `main`:

```javascript
var player = window.Radiodan.player.get('main');
```

# Sending Commands

The API for each object applies to both the client-side and server-side
variants. On the client-side, each command is sent back to the middleware via an
AJAX request.

# Listening To Events

Events are emitted via an [EventSource][3] interface. The Radiodan objects
encapsulate this and re-emit events using an [EventEmitter][4] object.

[1]: https://github.com/senchalabs/connect
[2]: http://expressjs.com/
[3]: https://developer.mozilla.org/en-US/docs/Web/API/EventSource
[4]: http://nodejs.org/api/events.html
