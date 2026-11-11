/* Sin conexiones reales ni credenciales: pruebas de contrato de Instagram. */
'use strict';
const assert = require('node:assert/strict');
const handler = require('../api/instagram-feed.js');
const prevFetch = global.fetch, prevToken = process.env.CALIZA_INSTAGRAM_ACCESS_TOKEN;
const response = () => ({
 statusCode:200, headers:{}, body:null,
 setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},
 json(v){this.body=v;return this;}
});
async function run() {
  delete process.env.CALIZA_INSTAGRAM_ACCESS_TOKEN;
  let res=response();
  await handler({method:'GET'},res);
  assert.equal(res.statusCode,503);
  assert.equal(res.body.status,'not_connected');
  res=response();
  await handler({method:'POST'},res);
  assert.equal(res.statusCode,405);
  process.env.CALIZA_INSTAGRAM_ACCESS_TOKEN='TEST-ONLY-NOT-REAL-1234567890000';
  const fake={
    data:[
      {username:'calizastonedesign',media_type:'IMAGE',media_url:'https://scontent.cdninstagram.com/p/a.jpg',permalink:'https://www.instagram.com/p/ABCDE12345/',caption:'<Piedra & diseño>'},
      {username:'calizastonedesign',media_type:'VIDEO',thumbnail_url:'https://scontent.cdninstagram.com/p/b.jpg',permalink:'https://www.instagram.com/reel/ABCDEF67890/',caption:'Video'},
      {username:'not-caliza',media_type:'IMAGE',media_url:'https://scontent.cdninstagram.com/p/c.jpg',permalink:'https://www.instagram.com/p/OTHER12345/'},
      {username:'calizastonedesign',media_type:'IMAGE',media_url:'https://example.org/photo.jpg',permalink:'https://www.instagram.com/p/BADPHOTO12/'},
      {username:'calizastonedesign',media_type:'IMAGE',media_url:'https://scontent.cdninstagram.com/p/a.jpg',permalink:'https://www.instagram.com/p/ABCDE12345/'}
    ]
  };
  let calls=0;
  global.fetch=async(url,opts)=>{
    calls++;
    assert.match(url,/^https:\/\/graph\.instagram\.com\/v25\.0\/me\/media/);
    assert.equal(opts.headers.Authorization,'Bearer '+process.env.CALIZA_INSTAGRAM_ACCESS_TOKEN);
    assert(!url.includes(process.env.CALIZA_INSTAGRAM_ACCESS_TOKEN));
    return {ok:true,json:async()=>fake};
  };
  res=response();await handler({method:'GET'},res);
  assert.equal(res.statusCode,200);
  assert.equal(res.body.posts.length,2);
  assert.equal(calls,1);
  assert(!JSON.stringify(res.body).includes('TEST-ONLY'));
  assert(!JSON.stringify(res.body).includes('example.org'));
  assert.match(res.headers['Cache-Control'],/s-maxage=900/);
  global.fetch=async()=>({ok:false});
  res=response();await handler({method:'GET'},res);
  assert.equal(res.statusCode,502);
  global.fetch=async()=>{throw new Error('test failure')};
  res=response();await handler({method:'GET'},res);
  assert.equal(res.statusCode,502);
  global.fetch=async()=>({ok:true,json:async()=>({data:[{username:'another-account'}]})});
  res=response();await handler({method:'GET'},res);
  assert.equal(res.statusCode,403);
  console.log('PASS: Instagram owned-account, no secrets, safe media URL and failure behavior');
}
run().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{
 global.fetch=prevFetch;
 if(prevToken===undefined)delete process.env.CALIZA_INSTAGRAM_ACCESS_TOKEN;
 else process.env.CALIZA_INSTAGRAM_ACCESS_TOKEN=prevToken;
});
