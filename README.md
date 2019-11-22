# duojs
Very basic duolingo SDK 

Usage:

```javascript
const duo = require('./duo.js');
const api = new duo.Api("user", "pass");

api.app.once('ready', () => {
  api.getUserObject("user123").then((obj) => {
    console.log(obj.fullname);
  });
});
```
