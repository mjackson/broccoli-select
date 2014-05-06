var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Writer = require('broccoli-writer');
var helpers = require('broccoli-kitchen-sink-helpers');

module.exports = Select;

function Select(inputTree, options) {
  if (!(this instanceof Select))
    return new Select(inputTree, options);

  options = options || {};

  this.acceptFiles = options.acceptFiles || options.files || [ '**/*' ];
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
    var rejectedFiles = getFilesRecursively(srcDir, rejectFiles);
    var acceptedFiles = getFilesRecursively(srcDir, acceptFiles).filter(function (file) {
      return rejectedFiles.indexOf(file) === -1;
    });

    acceptedFiles.forEach(function (file) {
      var srcFile = path.join(srcDir, file);
      var destFile = path.join(destDir, outputDir, file);
      var stat = fs.lstatSync(srcFile);

      if (stat.isFile() || stat.isSymbolicLink()) {
        mkdirp.sync(path.dirname(destFile));
        helpers.copyPreserveSync(srcFile, destFile, stat);
      }
    });
  });
};

function getFilesRecursively(dir, globPatterns) {
  return helpers.multiGlob(globPatterns, { cwd: dir });
}
