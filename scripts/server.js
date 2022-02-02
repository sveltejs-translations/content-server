const {derver} = require("derver");
const fs = require("fs/promises");
const path = require('path');
const {JSONFILE} = require('./paths');

const {
  errorMiddleware,
  notFoundMiddleware,
  docsMiddleware,
  corsMiddleware
} = require("./middlewares");

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3030;


(async ()=>{
  const DOCS = await loadDocs(path.join(__dirname,JSONFILE)); 

  const docsMw = docsMiddleware();
  docsMw.update(DOCS);

  const server = derver({
    dir: false,
    host: HOST,
    port: PORT,
    log: false,
    banner: false,
    compress: true,
    cache: 24*3600,
  });

  console.log(`Listening on ${HOST}:${PORT}`);

  server.use(errorMiddleware,corsMiddleware);
  server.use('/:locale/docs/:project/:type',docsMw);
  server.use('/:locale/docs/:project/:type/:slug',docsMw);
  server.use(notFoundMiddleware);
})();

async function loadDocs(file){
  console.log('Loading docs from JSON file...');
  const json = await fs.readFile(file,'utf-8');
  return JSON.parse(json);
}