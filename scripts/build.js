const fs = require('fs/promises');
const { build } = require('esbuild');
const fetchSources = require('./fetch_sources');
const mergeTranslation = require('./merge_translation');
const generateJson = require('./generate_json');
const PATHS = require('./paths');

(async()=>{
  
  await fetchSources();
  await mergeTranslation();
  const DOCS = await generateJson();
  await writeDocsFile(DOCS)
  await build_app()
  
})();

async function writeDocsFile(docs){
  console.log("Saving documentation into JSON file...");
  await fs.rm(PATHS.DIST,{force:true,recursive:true});
  await fs.mkdir(PATHS.DIST);
  await fs.writeFile(PATHS.DIST_DOCS,JSON.stringify(docs));
}

async function build_app(){
  console.log("Building server app...");
  build({
    entryPoints: ['./scripts/server.js'],
    format: "cjs",
    outfile: PATHS.DIST_APP,
    minify: true,
    platform: 'node',
    sourcemap: false,
    bundle: true,
  });
}