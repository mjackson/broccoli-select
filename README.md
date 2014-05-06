## broccoli-select

A [Broccoli](https://github.com/joliss/broccoli) plugin that enables greater flexibility when selecting files based on glob patterns.

### Usage

```js
var select = require('broccoli-select');

var templatesTree = select('templates', {

  // A list of glob patterns of files to select as input.
  // May be ommitted to select all files in the input tree.
  // May also be just "files" instead of "acceptFiles".
  acceptFiles: [ '**/*.hbs' ],

  // A list of glob patterns that will not be included as input. 
  rejectFiles: [ 'ignore-me.hbs' ],

  // The output directory for all selected files.
  outputDir: '/files/go/here'

});
```

### License

MIT
