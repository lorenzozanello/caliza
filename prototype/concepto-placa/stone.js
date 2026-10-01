// Caliza · piedra generada en WebGL2. Cada semilla es una placa distinta.
// Pasada 1: la placa se pinta una vez en una textura. Pasada 2: brillo, acabado y agua (barata, en cada cuadro).
(function (global) {
  'use strict';
  var VERT = '#version 300 es\nin vec2 p;out vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  var NOISE = [
    'vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}',
    'vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}',
    'vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}',
    'float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);',
    'vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);',
    'vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);',
    'vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));',
    'vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;',
    'vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;',
    'm*=1.79284291400159-.85373472095314*(a0*a0+h*h);',
    'vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}',
    'float fbm(vec2 p){float f=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<6;i++){f+=a*snoise(p);p=r*p*2.03+11.7;a*=.5;}return f;}',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float fbm3(vec2 p){float f=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<4;i++){f+=a*snoise(p);p=r*p*2.1+3.1;a*=.42;}return f;}'
  ].join('\n');


  var SLAB = '#version 300 es\nprecision highp float;in vec2 vUv;out vec4 o;\n' +
    'uniform vec2 uRes;uniform float uSeed,uKind,uZoom;uniform vec2 uPan;\n' + NOISE + '\n' +
    'float vline(float n,float w){float fw=fwidth(n)*1.2;return 1.-smoothstep(w,w+fw,abs(n));}' +
    'float slabH(vec2 p,out vec3 col){' +
    ' vec2 s=vec2(uSeed*1.713,uSeed*-.971);' +
    ' if(uKind<1.5){' +
    '  float ang=.55+.5*fract(uSeed*.37);vec2 dir=vec2(cos(ang),sin(ang));vec2 nrm=vec2(-dir.y,dir.x);' +
    '  vec2 q=vec2(fbm3(p*.32+s),fbm3(p*.32+s+5.2));' +
    '  vec2 pw=p+.85*q;' +
    '  float t=fbm3(pw*.7+s+2.);' +
    '  float f1=dot(pw,nrm)*(uKind<.5?2.1:1.3)+t*1.15;' +
    '  float d1=abs(sin(f1*3.14159*.5));' +
    '  float m1=smoothstep(-.45,.25,fbm3(pw*.45+s+11.));' +
    '  float w1=mix(.012,.06,smoothstep(-.4,.7,fbm3(pw*1.3+s+4.)));' +
    '  float fw1=fwidth(d1)*1.3;' +
    '  float vMain=(1.-smoothstep(w1,w1+fw1,d1))*m1;' +
    '  float halo=exp(-d1*d1*14.)*m1;float ghost=exp(-pow(abs(sin((f1+.42)*1.5708)),2.)*30.)*smoothstep(-.2,.5,fbm3(pw*.5+s+17.));' +
    '  float f2=dot(pw,vec2(dir.x,-dir.y))*2.7+fbm3(pw*1.5+s+7.)*1.4;' +
    '  float d2=abs(sin(f2*3.14159*.5));float fw2=fwidth(d2)*1.3;' +
    '  float m2=smoothstep(.15,.6,fbm3(pw*.7+s+21.));' +
    '  float vThin=(1.-smoothstep(.006,.006+fw2,d2))*m2;' +
    '  float f3=dot(pw,nrm)*6.+fbm(pw*3.+s+3.)*2.2;float d3=abs(sin(f3*3.14159*.5));float fw3=fwidth(d3)*1.3;' +
    '  float vHair=(1.-smoothstep(.004,.004+fw3,d3))*smoothstep(.35,.75,fbm3(pw*1.1+s+31.))*.55;' +
    '  float cloud=fbm(p*.6+s*2.)*.5+.5;' +
    '  float v=clamp(vMain+vThin*.75+vHair,0.,1.);' +
    '  if(uKind<.5){' +
    '   vec3 base=mix(vec3(.945,.937,.92),vec3(.885,.876,.86),smoothstep(.35,.8,cloud));' +
    '   base=mix(base,vec3(.80,.79,.775),halo*.5);base=mix(base,vec3(.85,.84,.825),ghost*.3);' +
    '   vec3 vein=mix(vec3(.52,.50,.48),vec3(.30,.29,.28),smoothstep(.02,.05,w1));' +
    '   vein=mix(vein,vec3(.60,.52,.42),smoothstep(0.,.7,snoise(pw*.45+s+3.))*.5);' +
    '   col=mix(base,vein,v*.88);' +
    '  } else {' +
    '   vec3 base=mix(vec3(.04,.038,.037),vec3(.078,.074,.07),smoothstep(.3,.9,cloud));' +
    '   base=mix(base,vec3(.15,.14,.13),halo*.35);base=mix(base,vec3(.11,.105,.1),ghost*.35);' +
    '   vec3 vein=mix(vec3(.90,.88,.84),vec3(.78,.65,.44),smoothstep(-.1,.5,snoise(pw*.35+s+7.)));' +
    '   col=mix(base,vein,v*.95);' +
    '  }' +
    '  return 1.-v;' +
    ' }' +
    ' float w=fbm3(vec2(p.x*.22,p.y*.6)+s)*.35;' +
    ' float y=p.y+w;' +
    ' float strata=sin(y*9.)*.5+.5;' +
    ' float fine=fbm(vec2(p.x*.4,y*22.)+s)*.5+.5;' +
    ' vec3 base=mix(vec3(.88,.82,.72),vec3(.74,.65,.52),strata*.55+fine*.45);' +
    ' base=mix(base,vec3(.90,.86,.78),smoothstep(.55,.9,fine)*.4);' +
    ' float pn=snoise(vec2(p.x*3.2,y*18.)+s*3.);' +
    ' float pmask=smoothstep(.25,.75,fbm(vec2(p.x*.8,y*3.)+s+2.));' +
    ' float pore=smoothstep(.55,.62+fwidth(pn),pn)*pmask;' +
    ' float rim=smoothstep(.45,.55,pn)*pmask*(1.-pore);' +
    ' col=mix(base,base*.86,rim*.6);' +
    ' col=mix(col,vec3(.42,.35,.27),pore*.85);' +
    ' return 1.-pore*.8;' +
    '}' +
    'void main(){float aspect=uRes.x/uRes.y;vec2 p=(vUv-.5)*vec2(aspect,1.)*uZoom+uPan;vec3 col;float h=slabH(p,col);o=vec4(col,h);}';

  var COMP = '#version 300 es\nprecision highp float;in vec2 vUv;out vec4 o;\n' +
    'uniform sampler2D uSlab,uWet;uniform vec2 uRes;uniform float uFinish,uUseWet,uSeed,uStain,uLight;uniform vec2 uLightPos;\n' +
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n' +
    'float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}\n' +
    'void main(){' +
    ' vec4 s=texture(uSlab,vUv);vec3 col=s.rgb;float h=s.a;' +
    ' vec2 px=1./uRes;float hx=texture(uSlab,vUv+vec2(px.x*2.,0.)).a-texture(uSlab,vUv-vec2(px.x*2.,0.)).a;float hy=texture(uSlab,vUv+vec2(0.,px.y*2.)).a-texture(uSlab,vUv-vec2(0.,px.y*2.)).a;' +
    ' vec3 n=normalize(vec3(-hx*1.5,-hy*1.5,1.));' +
    ' float wraw=uUseWet>.5?texture(uWet,vUv).r:0.;float wet=smoothstep(.18,.34,wraw);float wedge=smoothstep(.18,.26,wraw)-smoothstep(.26,.4,wraw);' +
    ' float polish=clamp(1.-uFinish,0.,1.);' +
    ' vec2 lp=uLightPos;vec3 L=normalize(vec3(lp-vUv,.55));vec3 H=normalize(L+vec3(0.,0.,1.));' +
    ' float spec=pow(max(dot(n,H),0.),mix(18.,140.,polish));' +
    ' float pool=exp(-dot((vUv-lp)*vec2(uRes.x/uRes.y,1.),(vUv-lp)*vec2(uRes.x/uRes.y,1.))*2.2);' +
    ' float grain=(hash(gl_FragCoord.xy+uSeed)-.5)*mix(.01,.045,1.-polish);' +
    ' col+=grain;' +
    ' float lum=dot(col,vec3(.299,.587,.114));' +
    ' if(uFinish>.5&&uFinish<1.5){col=mix(col,vec3(lum),.25)*.86+.075;}' +
    ' if(uFinish>1.5){col*=mix(.92,1.03,vnoise(gl_FragCoord.xy*.35));}' +
    ' if(polish>.5&&uLight>0.){vec2 q=vUv-vec2(.5);float band=smoothstep(.16,.0,abs(q.x*.8+q.y*.55-.18))*smoothstep(.75,.1,length(q));col+=band*mix(.035,.09,1.-lum)*uLight;}' +
    ' if(uStain>0.){float sc=0.;for(int i=0;i<5;i++){float a=hash(vec2(float(i),uSeed))*3.14;vec2 d=vec2(cos(a),sin(a));float off=hash(vec2(uSeed,float(i)))-.5;sc+=smoothstep(.0025,.0,abs(dot(vUv-.5,vec2(-d.y,d.x))-off*.8))*smoothstep(.45,.0,abs(dot(vUv-.5,d)-off*.3));}col=mix(col,vec3(lum)+.18,uStain*sc*.55);' +
    '  float rr=length((vUv-vec2(.62,.38))*vec2(uRes.x/uRes.y,1.));float wr=smoothstep(.012,.0,abs(rr-.11))+smoothstep(.01,.0,abs(rr-.14))*.6;col=mix(col,vec3(lum)+.22,uStain*wr*.5);}' +
    ' if(uStain>0.){float st=smoothstep(.45,.8,vnoise(vUv*vec2(uRes.x/uRes.y,1.)*6.+uSeed));float ring=smoothstep(.02,.0,abs(vnoise(vUv*3.+uSeed*2.)-.55));col=mix(col,col*vec3(.86,.83,.78),uStain*(st*.7+ring*.4));col=mix(col,vec3(dot(col,vec3(.33))),uStain*.35);col+=uStain*.03;}' +
    ' col=mix(col,pow(col,vec3(1.7))*.93,wet*.95);col=mix(col,col*.9,wedge*.6);' +
    ' col+=spec*(.05*polish+.32*wet)+pool*uLight*(.05*polish+.06*wet);' +
    ' o=vec4(clamp(col,0.,1.),1.);' +
    '}';

  var TRAIL = '#version 300 es\nprecision highp float;in vec2 vUv;out vec4 o;uniform sampler2D uPrev;uniform vec2 uA,uB,uRes;uniform float uR,uDecay,uOn;\n' +
    'float seg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);return length(pa-ba*h);}' +
    'void main(){vec2 asp=vec2(uRes.x/uRes.y,1.);float prev=texture(uPrev,vUv).r;prev=max(0.,prev*uDecay-.0015);' +
    'float d=seg(vUv*asp,uA*asp,uB*asp);float s=smoothstep(uR,uR*.2,d)*uOn;o=vec4(min(1.,prev+s*.5),0.,0.,1.);}';

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(gl, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT)); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
    return { p: p, u: u };
  }
  function target(gl, w, h) {
    var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { t: t, fb: fb, w: w, h: h };
  }

  function Stone(canvas, opts) {
    opts = opts || {};
    var gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true });
    if (!gl) throw new Error('webgl2');
    this.gl = gl; this.canvas = canvas; this.wet = !!opts.wet;
    this.pSlab = program(gl, SLAB); this.pComp = program(gl, COMP); this.pTrail = this.wet ? program(gl, TRAIL) : null;
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.s = { seed: 1, kind: 0, finish: 0, zoom: 2.4, pan: [0, 0], stain: 0, light: [0.28, 0.82], lightAmt: 1 };
    this.maxDpr = opts.maxDpr || 1.6;
    this.m = { a: [-1, -1], b: [-1, -1], on: 0 };
    this.wetLife = 0;
    this.resize();
  }
  Stone.prototype.resize = function (w, h) {
    var r = this.canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    w = w || Math.max(2, Math.round(r.width * dpr)); h = h || Math.max(2, Math.round(r.height * dpr));
    if (this.canvas.width === w && this.canvas.height === h && this.slab) return;
    this.canvas.width = w; this.canvas.height = h;
    var gl = this.gl;
    this.slab = target(gl, w, h);
    if (this.wet) { var tw = Math.max(2, w >> 2), th = Math.max(2, h >> 2); this.ping = target(gl, tw, th); this.pong = target(gl, tw, th); }
    this.slabDirty = true; this.dirty = true;
  };
  Stone.prototype.set = function (k) {
    for (var key in k) {
      if ((key === 'seed' || key === 'kind' || key === 'zoom' || key === 'pan') && JSON.stringify(this.s[key]) !== JSON.stringify(k[key])) this.slabDirty = true;
      this.s[key] = k[key];
    }
    this.dirty = true; return this;
  };
  Stone.prototype.pointer = function (x, y) {
    var m = this.m; m.a = m.b[0] < 0 ? [x, y] : m.b; m.b = [x, y]; m.on = 1; this.wetLife = 260; this.dirty = true;
  };
  Stone.prototype.leave = function () { this.m.b = [-1, -1]; };
  Stone.prototype.draw = function (force) {
    var gl = this.gl, s = this.s;
    if (!force && !this.dirty && this.wetLife <= 0) return false;
    if (this.slabDirty) {
      gl.useProgram(this.pSlab.p); var u = this.pSlab.u;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.slab.fb); gl.viewport(0, 0, this.slab.w, this.slab.h);
      gl.uniform2f(u.uRes, this.slab.w, this.slab.h); gl.uniform1f(u.uSeed, s.seed); gl.uniform1f(u.uKind, s.kind);
      gl.uniform1f(u.uZoom, s.zoom); gl.uniform2f(u.uPan, s.pan[0], s.pan[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3); this.slabDirty = false;
    }
    if (this.wet) {
      gl.useProgram(this.pTrail.p); var t = this.pTrail.u;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.pong.fb); gl.viewport(0, 0, this.pong.w, this.pong.h);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.ping.t); gl.uniform1i(t.uPrev, 0);
      gl.uniform2f(t.uA, this.m.a[0], this.m.a[1]); gl.uniform2f(t.uB, this.m.b[0], this.m.b[1]); gl.uniform2f(t.uRes, this.canvas.width, this.canvas.height);
      gl.uniform1f(t.uR, 0.075); gl.uniform1f(t.uDecay, 0.992); gl.uniform1f(t.uOn, this.m.on && this.m.b[0] >= 0 ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      var sw = this.ping; this.ping = this.pong; this.pong = sw; this.m.a = this.m.b; this.m.on = 0; this.wetLife--;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.pComp.p); var c = this.pComp.u;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.slab.t); gl.uniform1i(c.uSlab, 0);
    if (this.wet) { gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.ping.t); gl.uniform1i(c.uWet, 1); }
    gl.uniform2f(c.uRes, this.canvas.width, this.canvas.height); gl.uniform1f(c.uFinish, s.finish); gl.uniform1f(c.uUseWet, this.wet ? 1 : 0);
    gl.uniform1f(c.uSeed, s.seed); gl.uniform1f(c.uStain, s.stain); gl.uniform2f(c.uLightPos, s.light[0], s.light[1]); gl.uniform1f(c.uLight, s.lightAmt);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.dirty = false; return true;
  };

  // Un solo renderizador oculto para todas las placas fijas de la página.
  var shared = null;
  Stone.snapshot = function (into, opts) {
    var r = into.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(2, Math.round((opts.w || r.width) * dpr)), h = Math.max(2, Math.round((opts.h || r.height) * dpr));
    if (!shared) { var c = document.createElement('canvas'); c.width = w; c.height = h; shared = new Stone(c, {}); }
    shared.resize(w, h);
    shared.set({ seed: opts.seed, kind: opts.kind, finish: opts.finish || 0, zoom: opts.zoom || 2.4, pan: opts.pan || [0, 0], stain: opts.stain || 0, light: opts.light || [0.3, 0.8], lightAmt: opts.lightAmt == null ? 1 : opts.lightAmt });
    shared.draw(true);
    into.width = w; into.height = h;
    into.getContext('2d').drawImage(shared.canvas, 0, 0);
    return into;
  };
  Stone.supported = function () { try { return !!document.createElement('canvas').getContext('webgl2'); } catch (e) { return false; } };
  global.CalizaStone = Stone;
})(window);
