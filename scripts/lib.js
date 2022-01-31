const prompts = require('prompts');
const fs = require('fs/promises');
const path = require('path');
const PATHS = require('./paths');


async function getLocales(){
  return await fs.readdir(PATHS.DOCS);
}

async function getProjectsForLocale(locale){
  return await fs.readdir(path.join(PATHS.DOCS,locale));
}

async function askLocaleAndProject(){
  return await prompts([
    {
      type: 'select',
      name: 'locale',
      message: 'Locale',
      choices: (await getLocales()).map( loc => ({title: loc, value: loc}) ),
      initial: 0
    },
    {
      type: 'select',
      name: 'project',
      message: 'Project(site)',
      choices: async prev => {
        return (await getProjectsForLocale(prev)).map( p => ({title: p, value: p}) )
      },
      initial: 0
    }
  ]);
}

module.exports ={
  getLocales,
  getProjectsForLocale,
  askLocaleAndProject
}