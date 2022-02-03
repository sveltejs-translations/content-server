const {derver} = require("derver");
const watch = require('node-watch');
const path = require('path');
const {bold,green,yellow} = require("kleur");

const {
  errorMiddleware,
  notFoundMiddleware,
  docsMiddleware,
  corsMiddleware
} = require("./middlewares");
const {askLocaleAndProject} = require("./lib");

const fetchSources = require('./fetch_sources');
const mergeTranslation = require('./merge_translation');
const generateJson = require('./generate_json');

const PATHS = require('./paths');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3030;


(async ()=>{
  const opts = await askLocaleAndProject();
  await fetchSources(opts.project);
  await mergeTranslation(opts.locale,opts.project);
  const DOCS = await generateJson(opts.locale,opts.project);

  const docsMw = docsMiddleware();
  docsMw.update(DOCS);

  
  const server = derver({
    dir: false,
    host: HOST,
    port: PORT,
    banner: false
  });

  console.log(`Listening on ${HOST}:${PORT}`);

  server.use(errorMiddleware,corsMiddleware);
  server.use('/:locale/docs/:project',docsMw);
  server.use('/:locale/docs/:project/:type',docsMw);
  server.use('/:locale/docs/:project/:type/:slug',docsMw);
  server.use(notFoundMiddleware);

  console.log('Watching documentation for changes...')
  watch(PATHS.DOCS,{recursive:true},async (evt,name)=>{

    console.log(yellow().bold('File changed: ')+yellow(name));

    const [_,locale,project] = name.split(path.sep);

    const warns = [];
    if(locale !== opts.locale) warns.push('This file is not of choosen locale.')
    if(project !== opts.project) warns.push('This file is not of choosen project.')

    if(warns.length){
      warns.forEach( warn => console.log(bold().red(`  [!] ${warn}`)));
      console.log('  Please, consider to revert changes in this file');
    }else{
      console.log(green("  Updating API content..."));
      await mergeTranslation(opts.locale,opts.project);
      const DOCS = await generateJson(opts.locale,opts.project);
      docsMw.update(DOCS);
      console.log(green("  Done!"))
    }
  })
})();