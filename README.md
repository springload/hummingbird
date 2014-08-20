# Hummingbird Core

Making it a node package to make it easy to require via browserify

- Adding unit tests



## Using in your project

```bash
> npm install hummingbird
```

Then, deep in your application:

```js

var Hummingbird = require("hummingbird");

var View = Hummingbird.View;

var myCoolView = new View({
    template: require("./templates/myCoolView.nunj");
});

```


## Testing this repo

```
> npm install
> gulp test
```
