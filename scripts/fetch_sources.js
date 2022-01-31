const fetchRepoDir = require('fetch-repo-dir');
const fs = require('fs/promises');
const path = require('path');

const CFG = require('./../config.json');
const PATHS = require('./paths');


module.exports = async function(project_only){
  await fs.rm(PATHS.TMPDIR,{ force:true, recursive: true });
  await fs.mkdir(PATHS.SOURCES,{ recursive: true });

  for(let project in CFG.sources){
    if(project_only && project_only !== project) continue;
    
    console.log(`Downloading source documentation for ${project}...`)
    await fetchRepoDir({
      src: CFG.sources[project],
      dir: path.join(PATHS.SOURCES,project)
    })
  }
}