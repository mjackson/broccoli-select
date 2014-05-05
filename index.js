var path = require('path');
var mkdirp = require('mkdirp');
var Writer = require('broccoli-writer');
var helpers = require('broccoli-kitchen-sink-helpers');

module.exports = Select;

function Select(inputTree, options) {
  if (!(this instanceof Select))
    return new Select(inputTree, options);

  options = options || {};

  this.acceptFiles = options.acceptFiles || options.files || [ '**' ];
  this.rejectFiles = options.rejectFiles || [];
  this.outputDir = options.outputDir || '/';
  this.inputTree = inputTree;
}

Select.prototype = Object.create(Writer.prototype);
Select.prototype.constructor = Select;

Select.prototype.write = function (readTree, destDir) {
  var acceptFiles = this.acceptFiles;
  var rejectFiles = this.rejectFiles;
  var outputDir = this.outputDir;

  return readTree(this.inputTree).then(function (srcDir) {
    rejectedFiles = getFilesRecursively(srcDir, rejectFiles);
    acceptedFiles = getFilesRecursively(srcDir, acceptFiles).filter(function (file) {
      return file && rejectedFiles.indexOf(file) === -1;
    });

    acceptedFiles.forEach(function (file) {
      mkdirp.sync(path.join(destDir, outputDir, path.dirname(file)));
      helpers.copyPreserveSync(path.join(srcDir, file), path.join(destDir, outputDir, file));
    });
  });
};

function getFilesRecursively(dir, globPatterns) {
  return helpers.multiGlob(globPatterns, { cwd: dir });
}
