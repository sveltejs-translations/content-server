const path = require('path');
const {transform} = require('transform-docs');
const CFG = require('./../config.json');
const {formatDate} = require('./dates');
const PATHS = require('./paths');

const {getLocales,getProjectsForLocale} = require("./lib");

module.exports = async function(locale_only,project_only){
  const json = {};

  if(!locale_only || locale_only === 'en'){
    json.en={};
    for(let project in CFG.sources){
      if(project_only && project_only !== project) continue;
      console.log(`Generating JSON for ${project} project in en locale...`);
      json.en[project] = await generate(path.join(PATHS.SOURCES,project),project);
    }
  }


  for(let locale of (await getLocales())){
    
    if(locale_only && locale_only !== locale) continue;

    json[locale]={};
    for(let project of (await getProjectsForLocale(locale))){

      if(project_only && project_only !== project) continue;

      console.log(`Generating JSON for ${project} project in ${locale} locale...`);

      const DOCS_DIR = path.join(PATHS.LOCALES,locale,project);
      json[locale][project] = await generate(DOCS_DIR,project);
      formatDates(json[locale][project],locale);
    }
  }

  return json;
}

async function generate(dir,project){
  try{
    return await transform(dir,project);
  }catch(err){
    console.log(err.message);
    return [];
  }
}

const typesWithDate = ['blog'];
function formatDates(input,locale){
  for(section of input){
    if(typesWithDate.includes(section.type)){
      for(let i in section.content.list){
        section.content.list[i].date.pretty = 
        section.content.full[i].date.pretty = 
        formatDate(section.content.list[i].date.numeric,locale)
      }
    }
  } 
}