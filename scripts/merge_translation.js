const fs = require('fs/promises');
const path = require('path');
const CFG = require('./../config.json');
const PATHS = require('./paths');
const {getLocales,getProjectsForLocale} = require("./lib");

module.exports = async function(locale_only,project_only){
  for(let locale of (await getLocales())){

    if(locale_only && locale_only !== locale) continue;

    for(let project of (await getProjectsForLocale(locale))){

      if(project_only && project_only !== project) continue;

      console.log(`Merging files for ${locale} locale in  ${project} project...`);
      const SOURCE_DIR = path.join(PATHS.SOURCES,project);
      const DOCS_DIR = path.join(PATHS.DOCS,locale,project);
      const DST_DIR = path.join(PATHS.LOCALES,locale,project);
      await fs.mkdir(DST_DIR,{recursive: true});
      await fs.cp(SOURCE_DIR,DST_DIR,{recursive:true})
      await fs.cp(DOCS_DIR,DST_DIR,{recursive:true})
    }

  }
}