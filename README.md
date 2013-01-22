Description
===========

WhackATroll is a simple "whack-a-mole" style HTML5 game.

Apparently someone already thought of this idea... [See here](https://itunes.apple.com/us/app/whack-a-troll/id500917075?mt=8).
But that doesn't really surprise me! If anything it makes me feel that my silly idea has been validated :)

Dependencies
===========

Client
-----------
- I am using [RequireJS](http://requirejs.org/) integrated with [jQuery](http://jquery.com/) v1.8.3.

Server
-----------
- Server is implemented in javascript using [node.js](http://nodejs.org/).
    - [Express](http://expressjs.com/) framework for MVC style web server.
    - [Socket.IO](http://socket.io/) for web sockets.
    - [Node_Redis](https://github.com/mranney/node_redis) driver.
- Caching is handled by [Redis](http://redis.io/).

Tools
===========

- IDE: I am using [WebStorm](http://www.jetbrains.com/webstorm/). Only part that isn't free (but soooo worth it).
- Testing: [jsTestDriver](http://code.google.com/p/js-test-driver/) integrated with RequireJS is used for running unit tests.

Contributors
===========

Just me ([Nick Simmons](https://github.com/nsimmons)).

License
===========
The MIT License

Copyright (c) 2013 Nicholas Simmons

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.