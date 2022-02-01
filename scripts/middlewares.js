exports.notFoundMiddleware = function (req,res,next){
  if(!res.body) return res.error('Not found',404);
  next();
}

exports.errorMiddleware = function (req, res, next) {
  res.error = function(error,status=500){
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error}));
  }
  next();
}

exports.corsMiddleware = function (req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}

exports.docsMiddleware = function (){
  let docs = {};

  const mw = function(req,res,next){
    const {locale,project,type,slug} = req.params;
    const full = req.query.content !== undefined;

    if(!docs[locale]) return res.error('Wrong locale');
    if(!docs[locale][project]) return res.error('Wrong project');

    const content = docs[locale][project].find( cnt => cnt.type === type);
    if(!content) return res.error('Wrong type');

    if(slug){
      const section = content.content.full.find(sec => sec.slug === slug);
      if(!section) return res.error('Wrong slug');
      res.body = JSON.stringify(section);
    }else{
      res.body = JSON.stringify((full ? content.content.full : content.content.list));
    }
    res.setHeader('Content-Type', 'application/json');
    next();
  }

  mw.update = function(updatedDocs){
    docs = updatedDocs;
  }
  return mw;
}