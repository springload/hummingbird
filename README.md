# Hummingbird Core

- Now a node package
- Contains unit tests


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

Then you can start using hummingbird components right away.

```javascript
    var view = new Hummingbird.StackView();
    view.push(new Marionette.ItemView({template: require("templates/intro.nunj") }));
    view.pop();
```


## Components

### TransitionRegion

Push a view with a transition

```javascript
    var view = new Hummingbird.StackView();
    view.push(new Marionette.ItemView({
            template: Templates["app/templates/intro.hb"]
        }),
        {
            transition: "slideLeft"
        });
    view.pop();
```


### EmptyView

A default view for when a collectionview is empty.


### FetchingView

A view that shows automatically while fetching a collection





## Testing this repo

```
> npm install
> gulp test
```
