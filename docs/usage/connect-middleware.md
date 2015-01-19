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
** TODO: Add as AMD module? **

# Listening for events

[1]: https://github.com/senchalabs/connect
[2]: http://expressjs.com/
