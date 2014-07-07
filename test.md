While we're at it, we'll also create a `bitly` directory inside `packages`, and initialize our new Bitly package with a `package.js` file. All our Bitly-related functions will run on the server, so we don't need to add the package client-side.

~~~js
Package.describe({
  summary: "Bitly package"
});

Package.on_use(function (api) {
  api.add_files('bitly.js', 'server');
  if(api.export)
    api.export('Bitly');
});
~~~

Some random text, say with my name on it.

~~~bash
console.log("test");
~~~

this is the end of the file

~~~js
console.log("Golden test");
~~~
