const {derver} = require("derver");

const {errorMiddleware,notFoundMiddleware,docsMiddleware} = require("./middlewares");

const fetchSources = require('./fetch_sources');
const mergeTranslation = require('./merge_translation');
const generateJson = require('./generate_json');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3030;


(async ()=>{
  await fetchSources();
  await mergeTranslation();
  const DOCS = await generateJson();

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

  server.use(errorMiddleware);
  server.use('/:locale/docs/:project/:type',docsMw);
  server.use('/:locale/docs/:project/:type/:slug',docsMw);
  server.use(notFoundMiddleware);
})();