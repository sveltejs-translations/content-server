const path = require('path');

exports.DOCS = "docs";
exports.TMPDIR = "__TMP";
exports.DIST = "dist";
exports.JSONFILE = "docs.json";

exports.SOURCES = path.join(exports.TMPDIR,'sources');
exports.LOCALES = path.join(exports.TMPDIR,'locales');

exports.DIST_DOCS = path.join(exports.DIST,exports.JSONFILE);
exports.DIST_APP = path.join(exports.DIST,'index.js');