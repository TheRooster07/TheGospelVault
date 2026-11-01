// Generic schematic map renderer (equirectangular, cos-corrected) -> PNG
const sharp=require('sharp');
const SEA='#DAE4ED', LAND='#F2ECDE', COAST='#9FB2C4', RIVER='#7E9BB5', LBL='#6B7A90', NAVY='#1F3864', RED='#8B2E2E', GOLD='#B8862B', BROWN='#6D5A47', REG='#8A8270';
function render(file,cfg){
 const {lon0,lon1,lat0,lat1,W}=cfg, K=Math.cos((lat0+lat1)/2*Math.PI/180);
 const H=Math.round(W*(lat1-lat0)/((lon1-lon0)*K));
 const X=l=>(l-lon0)/(lon1-lon0)*W, Y=l=>(lat1-l)/(lat1-lat0)*H;
 const P=pts=>pts.map(([a,b],i)=>(i?'L':'M')+X(a).toFixed(1)+' '+Y(b).toFixed(1)).join(' ');
 let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Liberation Sans, Arial, sans-serif">
<defs>${['8B2E2E','1F3864','B8862B','6D5A47'].map(c=>`<marker id="a${c}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#${c}"/></marker>`).join('')}</defs>
<rect width="${W}" height="${H}" fill="${LAND}"/>`;
 for(const p of cfg.seas||[]) s+=`<path d="${P(p)} Z" fill="${SEA}" stroke="${COAST}" stroke-width="2"/>`;
 for(const p of cfg.islands||[]) s+=`<path d="${P(p)} Z" fill="${LAND}" stroke="${COAST}" stroke-width="2"/>`;
 for(const r of cfg.rivers||[]) s+=`<path d="${P(r)}" fill="none" stroke="${RIVER}" stroke-width="${cfg.riverW||3}" stroke-linejoin="round"/>`;
 for(const r of cfg.routes||[]) s+=`<path d="${P(r.pts)}" fill="none" stroke="${r.color}" stroke-width="${r.w||5}" ${r.dash?'stroke-dasharray="14 10"':''} stroke-linejoin="round" stroke-linecap="round" marker-end="url(#a${r.color.slice(1)})"/>`;
 const t=(lon,lat,txt,o={})=>`<text x="${(X(lon)+(o.dx||0)).toFixed(1)}" y="${(Y(lat)+(o.dy||0)).toFixed(1)}" font-size="${o.size||30}" fill="${o.fill||LBL}" ${o.italic?'font-style="italic"':''} ${o.bold?'font-weight="700"':''} text-anchor="${o.anchor||'middle'}" letter-spacing="${o.ls||0}">${txt}</text>`;
 for(const l of cfg.labels||[]){const [lon,lat,txt,kind,anchor]=l; const o={anchor};
  if(kind==='region') Object.assign(o,{size:cfg.regSize||32,ls:4,fill:REG,bold:1});
  else if(kind==='water') Object.assign(o,{size:cfg.waterSize||30,italic:1});
  else if(kind==='river') Object.assign(o,{size:cfg.riverSize||27,italic:1,fill:'#5E7C98'});
  else if(kind==='city') Object.assign(o,{size:cfg.citySize||27,fill:NAVY,bold:1});
  else if(kind==='note') Object.assign(o,{size:cfg.noteSize||25,fill:LBL,italic:1});
  if(l[5]) Object.assign(o,l[5]);
  String(txt).split('|').forEach((line,i)=>{s+=t(lon,lat,line,Object.assign({},o,{dy:(o.dy||0)+i*(o.size||30)*1.15}));});}
 for(const d of cfg.dots||[]) s+=`<circle cx="${X(d[0])}" cy="${Y(d[1])}" r="${d[2]||7}" fill="${d[3]||NAVY}"/>`;
 const R=cfg.markerR||28;
 for(const m of cfg.markers||[]){const [n,lo,la,llo,lla,col]=m, c=col||RED, x=X(lo),y=Y(la), lx=X(llo??lo), ly=Y(lla??la);
  if(lx!==x||ly!==y) s+=`<line x1="${x}" y1="${y}" x2="${lx}" y2="${ly}" stroke="${c}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`;
  s+=`<circle cx="${lx}" cy="${ly}" r="${R}" fill="${c}" stroke="#FAF7EF" stroke-width="3"/><text x="${lx}" y="${ly+R*0.37}" font-size="${R*1.07}" font-weight="700" fill="#fff" text-anchor="middle">${n}</text>`;}
 s+='</svg>';
 return sharp(Buffer.from(s),{density:72}).png().toFile(file).then(()=>console.log(file,W,H));
}
// shared geography
const med=[[29,31.0],[29.9,31.2],[30.6,31.5],[31.6,31.6],[32.3,31.3],[33.8,31.1],[34.2,31.3],[34.45,31.55],[34.65,31.85],[34.75,32.05],[34.85,32.4],[34.92,32.65],[34.98,32.82],[35.07,32.9],[35.1,33.1],[35.2,33.27],[35.37,33.56],[35.5,33.9],[35.65,34.25],[35.84,34.43],[35.9,35.0],[35.78,35.52],[36.17,36.6],[35.0,36.8],[34.6,36.8],[33.5,36.2],[32.5,36.1],[30.6,36.85],[29,36.6],[28,36.6],[28,31.0]];
const cyprus=[[32.3,35.1],[33.0,35.4],[34.6,35.7],[34.0,35.0],[33.0,34.6],[32.4,34.7]];
const red=[[32.55,29.95],[33.2,28.8],[34.25,27.75],[34.45,28.2],[34.9,29.45],[35.0,29.55],[34.85,28.1],[35.7,27.35],[36.45,26.2],[38.06,24.09],[39.17,21.5],[40.5,19.5],[41.5,17.8],[42.6,15.5],[39.0,15.5],[38.6,18.0],[37.3,19.5],[37.2,21.0],[36.9,22.0],[35.6,23.9],[34.6,25.5],[33.95,26.6],[33.4,27.6],[32.6,29.6]];
const dead=[[35.45,31.78],[35.58,31.75],[35.6,31.45],[35.52,31.05],[35.4,31.2],[35.38,31.5]];
const galilee=[[35.53,32.88],[35.64,32.88],[35.65,32.73],[35.57,32.7],[35.52,32.78]];
const jordan=[[35.6,33.1],[35.62,32.9],[35.6,32.8],[35.57,32.7],[35.55,32.3],[35.55,32.0],[35.53,31.77]];
const euph=[[38.5,38],[38.2,37.0],[38.0,36.8],[38.4,36.0],[40.1,35.3],[40.9,34.55],[41.9,34.4],[42.9,33.4],[43.9,33.0],[44.42,32.54],[45.5,31.6],[46.4,31.0],[47.4,31.0],[47.9,30.5],[48.2,30.0]];
const tig=[[40.2,38],[41.0,37.4],[42.5,37.0],[43.15,36.36],[43.3,35.5],[43.8,34.5],[44.4,33.3],[45.8,32.5],[46.8,31.6],[47.4,31.0]];
const gulf=[[47.9,29.4],[48.0,30.0],[48.9,30.4],[49.5,30.0],[50.1,30.1],[50.8,28.9],[51.4,27.9],[52.6,27.4],[54.0,26.6],[55.5,26.9],[56.3,27.2],[57,26.5],[57,22],[51.5,22],[51.5,25.3],[50.6,25.5],[50.1,26.3],[49.6,26.9],[48.4,28.4]];
const caspian=[[48.9,39],[49.0,37.5],[50.3,37.2],[51.5,36.8],[53.9,36.9],[54.0,37.4],[54.2,39]];

const jobs=[];
// Chart 6: Syro-Ephraimite crisis (Isa 7-8)
jobs.push(render('map-syro.png',{lon0:34.0,lon1:37.3,lat0:30.85,lat1:34.25,W:1050,regSize:34,citySize:30,markerR:30,
 seas:[med,dead,galilee],rivers:[jordan],riverW:4,
 routes:[{pts:[[36.2,33.35],[35.5,32.4],[35.3,31.95]],color:'#8B2E2E',w:7},{pts:[[35.2,32.15],[35.22,31.93]],color:'#8B2E2E',w:7},
  {pts:[[35.4,31.85],[36.4,32.6],[37.25,34.15]],color:'#B8862B',w:5,dash:1}],
 dots:[[36.3,33.51,9],[35.19,32.28,9],[35.23,31.78,9]],
 labels:[[36.2,33.62,'Damascus','city','end'],[36.2,33.47,'Rezin, king of Aram','note','end'],[35.05,32.33,'Samaria','city','end'],[35.05,32.19,'Pekah','note','end'],
  [35.1,31.72,'Jerusalem','city','end'],[35.1,31.58,'Ahaz','note','end'],
  [35.9,33.95,'ARAM','region'],[35.85,32.55,'ISRAEL|(EPHRAIM)','region',null,{size:28}],[35.0,31.2,'JUDAH','region'],
  [34.45,33.2,'Mediterranean|Sea','water'],[35.8,31.25,'Dead|Sea','water','start',{size:24}],[35.75,32.85,'Galilee','water','start',{size:22}],
  [36.95,33.85,'to Assyria','note','end',{fill:'#8A6A20',size:26}],[36.0,31.75,'Ahaz sends to','note','start',{fill:'#8A6A20',size:26}],[36.0,31.62,'Tiglath-Pileser','note','start',{fill:'#8A6A20',size:26}]],
 markers:[[1,36.0,33.1,36.55,32.85],[2,35.23,31.78,34.65,31.45],[3,35.23,31.78,34.55,32.0],[4,36.62,33.0]]}));
// Chart 12: Sennacherib 701 BC (Isa 36-37)
jobs.push(render('map-701.png',{lon0:34.0,lon1:36.1,lat0:30.9,lat1:32.95,W:1000,citySize:28,markerR:28,
 seas:[med,dead,galilee],rivers:[jordan],riverW:4,
 routes:[{pts:[[35.42,33.62],[35.1,33.05],[34.95,32.7],[34.8,32.1],[34.82,31.75],[34.85,31.6]],color:'#8B2E2E',w:7},
  {pts:[[34.92,31.6],[35.18,31.76]],color:'#8B2E2E',w:5,dash:1},
  {pts:[[35.25,31.95],[35.65,32.45],[36.0,32.92]],color:'#1F3864',w:5,dash:1}],
 dots:[[34.85,31.565,9],[34.87,31.64,7],[35.23,31.78,9],[34.85,31.78,7],[34.75,32.05,7],[35.2,33.27,7],[35.37,33.56,7]],
 labels:[[34.78,31.52,'Lachish','city','end'],[34.8,31.66,'Libnah','city','end',{size:24}],[35.3,31.7,'Jerusalem','city','start'],[34.78,31.82,'Ekron','note','end'],[34.68,32.08,'Joppa','note','end'],
  [35.0,31.15,'JUDAH','region'],
  [34.35,32.6,'Mediterranean|Sea','water'],[35.68,31.4,'Dead|Sea','water','start',{size:24}],
  [34.2,31.2,'Tirhakah of Cush','note','start',{fill:'#8B2E2E'}],[34.2,31.06,'↙ from Egypt','note','start',{fill:'#8B2E2E'}],
  [36.02,32.73,'home to','note','end',{fill:NAVY}],[36.02,32.6,'Nineveh','note','end',{fill:NAVY,bold:1}]],
 markers:[[1,34.9,32.5,34.45,32.25],[2,34.85,31.565,34.45,31.62],[3,35.23,31.78,35.6,31.95],[4,34.87,31.64,34.42,31.9],[5,35.65,32.45,35.95,32.25,'#1F3864']]}));
// Chart 14: Cyrus and the road home (Isa 40-48)
jobs.push(render('map-cyrus.png',{lon0:33,lon1:56,lat0:26.5,lat1:38.6,W:1500,regSize:32,citySize:28,markerR:28,
 seas:[med,red,gulf,caspian],islands:[cyprus],rivers:[euph,tig],
 routes:[{pts:[[53.2,30.2],[50.5,31.4],[48.25,32.19],[45.2,32.6],[44.6,32.6]],color:'#6D5A47',w:7},
  {pts:[[48.5,34.8],[46.3,33.7],[44.7,32.8]],color:'#6D5A47',w:5},
  {pts:[[44.2,32.75],[42.9,33.6],[41.9,34.6],[40.1,35.5],[38.3,36.2],[37.15,36.2],[36.75,35.13],[36.3,33.5],[35.35,31.9]],color:'#B8862B',w:6,dash:1}],
 dots:[[53.2,30.2,9],[48.5,34.8,8],[48.25,32.19,8],[44.42,32.54,10],[35.23,31.78,9],[36.3,33.51,7]],
 labels:[[53.2,29.75,'Pasargadae','note'],[54.0,32.0,'PERSIA','region'],[48.5,35.35,'MEDIA','region'],[48.5,34.55,'Ecbatana','note','start',{dx:14}],[48.3,31.75,'Susa','note','start',{dx:12}],
  [44.42,32.1,'Babylon','city'],[46.6,30.75,'BABYLONIA','region'],[35.1,31.6,'Jerusalem','city','end'],[36.45,33.5,'Damascus','note','start'],
  [33.2,34.6,'Mediterranean','water','start'],[51.6,27.55,'Persian Gulf','water'],[51.6,37.95,'Caspian Sea','water'],
  [40.3,34.6,'Euphrates','river'],[42.3,36.3,'Tigris','river','end'],[40.2,36.75,'the road home  (48:20)','note',null,{fill:'#8A6A20',size:27,bold:1}],
  [42.5,29.5,'ARABIAN DESERT','region',null,{size:28}]],
 markers:[[1,53.2,30.2,52.0,29.0],[2,44.42,32.54,45.7,34.0],[3,44.42,32.54,42.9,31.3],[4,35.23,31.78,34.3,30.4]]}));
// Chart 8: oracles map (pilot geometry)
const LV=[[2,34.65,31.8,32.5,32.75],[9,35.23,31.78,33.15,31.55,'#1F3864'],[10,35.2,33.27,33.2,34.2],[4,36.3,33.5,37.9,34.3],[3,35.8,31.3,37.5,31.2],[7,35.6,30.7,37.0,29.4]];
jobs.push(render('map-oracles.png',{lon0:29,lon1:49,lat0:15.5,lat1:38,W:1100,citySize:28,markerR:28,regSize:32,waterSize:32,riverSize:28,
 seas:[med,red,[[49,28.6],[48.4,28.7],[47.9,29.4],[48.0,29.95],[48.6,29.95],[49,30.2]],dead],islands:[cyprus],
 rivers:[[[32.55,15.5],[32.6,16.8],[33.9,17.7],[33.3,19.5],[32.0,18.7],[31.8,18.5],[30.5,19.2],[30.4,20.0],[31.35,21.8],[32.9,24.1],[32.6,25.7],[32.7,26.2],[31.2,27.2],[31.25,30.05],[31.0,31.4]],euph,tig,jordan],
 dots:[[43.15,36.36,6,'#6B7A90']],
 labels:[[31.5,35.0,'Mediterranean|Sea','water'],[37.0,20.5,'Red Sea','water'],[47.8,28.2,'Persian|Gulf','water',null,{size:28}],[40.2,34.5,'Euphrates','river'],[42.6,36.0,'Tigris','river','end'],[29.9,24.5,'Nile','river'],
  [30.55,28.0,'EGYPT','region'],[34.6,21.0,'CUSH','region'],[42.5,24.5,'ARABIA','region'],[43.3,37.3,'ASSYRIA','region'],[46.0,33.9,'BABYLONIA','region'],[37.9,35.4,'ARAM','region'],[33.95,29.75,'SINAI','region'],
  [35.75,32.3,'Jerusalem','city','start'],[43.6,36.25,'Nineveh','note','start',{italic:0}]],
 markers:[[1,44.42,32.54],[5,31.8,18.5],[6,31.25,29.9],[8,38.5,27.6],...LV.map(m=>m.length===5?[...m]:m)]}));
Promise.all(jobs).then(()=>console.log('done'));
