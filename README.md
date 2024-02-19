# evanoconnor.ie

[![Netlify Status](https://api.netlify.com/api/v1/badges/6aa73728-84ca-41bc-9e11-76a3fa8a4904/deploy-status)](https://app.netlify.com/sites/focused-lovelace-e4d924/deploys)


## Building & Running Locally

This repo needs no build step. To get it running locally all you need is some tool which can serve a directory of static files over HTTP. The easiest one I've found is python's built-in [`http.server`](https://docs.python.org/3/library/http.server.html) module, which you can use like this:

```sh
python3 -m http.server -d src;
```

By default this will serve the contents of the `src` directory on localhost port 8000, but a port number can also be specified at the end of the command.
