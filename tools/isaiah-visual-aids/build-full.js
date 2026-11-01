const pptxgen=require('pptxgenjs');
const {applyTheme}=require('/root/.claude/skills/synced/df3e0e2c-357b-4215-a121-5a7459f781ff_8d92f6aa-875a-4902-affe-70947c9e0d47/pptx/scripts/apply_theme.js');
const sizeOf=f=>{const b=require('fs').readFileSync(f);return {w:b.readUInt32BE(16),h:b.readUInt32BE(20)};};
const BG='FAF7EF',NAVY='1F3864',BLUE='2E5496',GREEN='375623',RED='8B2E2E',GOLD='B8862B',PURPLE='7030A0',BROWN='6D5A47',GREY='6B7A90',INK='1C2433',WHITE='FFFFFF',TINT='F1ECDD';
const TOTAL=18, FOOT='Isaiah 1–66 · Outline and Notes  ·  thegospelvault.com';
const THEME={name:'Gospel Vault Charts',headFontFace:'Cambria',bodyFontFace:'Arial',colors:{dk1:'000000',lt1:'FFFFFF',dk2:NAVY,lt2:BG,accent1:BLUE,accent2:GREEN,accent3:RED,accent4:GOLD,accent5:PURPLE,accent6:BROWN,hlink:BLUE,folHlink:'5B6578'}};
const pres=new pptxgen(); pres.layout='LAYOUT_WIDE'; pres.theme={headFontFace:'Cambria',bodyFontFace:'Arial'};
pres.title='Isaiah 1–66 — Visual Aids: Charts, Timelines & Maps'; pres.author='The Gospel Vault'; pres.subject='Companion charts to Isaiah 1–66 Outline and Notes (Pastor William K. Lyons)';
pres.defineSlideMaster({title:'CHART',background:{color:BG},objects:[
 {placeholder:{options:{name:'title',type:'title',x:0.55,y:0.34,w:12.2,h:0.7,fontFace:'Cambria',fontSize:34,bold:true,color:NAVY,align:'left',valign:'middle',margin:0},text:''}},
 {placeholder:{options:{name:'body',type:'body',x:0.55,y:1.0,w:12.2,h:0.38,fontFace:'Arial',fontSize:16,italic:true,color:GREY,align:'left',valign:'middle',margin:0},text:''}},
 {text:{text:FOOT,options:{x:6.5,y:7.0,w:6.3,h:0.3,fontFace:'Arial',fontSize:11,color:GREY,align:'right',valign:'middle',margin:0,isTextBox:true}}}]});
const S=pres.shapes;
const tb=(s,text,o)=>s.addText(text,Object.assign({fontFace:'Arial',color:INK,margin:0,isTextBox:true,valign:'top'},o));
const rect=(s,x,y,w,h,fill,line,o={})=>s.addShape(o.round?S.ROUNDED_RECTANGLE:S.RECTANGLE,Object.assign({x,y,w,h,fill:{color:fill},line:{color:line||fill,width:line?1.5:0}},o.round?{rectRadius:o.round}:{}));
const line=(s,x,y,w,h,c,wd=1.5,dash)=>s.addShape(S.LINE,{x,y,w,h,line:Object.assign({color:c,width:wd},dash?{dashType:'dash'}:{})});
const circ=(s,x,y,d,c,n,fs=14)=>{s.addShape(S.OVAL,{x,y,w:d,h:d,fill:{color:c},line:{color:c,width:0}});if(n!==undefined)tb(s,String(n),{x,y,w:d,h:d,fontSize:fs,bold:true,color:WHITE,align:'center',valign:'middle'});};
const slide=(n,title,sub,where,notes)=>{const s=pres.addSlide({masterName:'CHART'});s.addText(title,{placeholder:'title'});s.addText(sub,{placeholder:'body'});
 tb(s,`Chart ${n} of ${TOTAL}  ·  ${where}`,{x:0.55,y:7.0,w:6,h:0.3,fontSize:11,bold:true,color:GREY,valign:'middle'});s.addNotes(notes);return s;};
const foot=(s,t,y=6.5)=>tb(s,t,{x:0.6,y,w:12.15,h:0.42,fontSize:13,italic:true,color:GREY});
const steps=(s,x,y,w,items,gap,c=RED)=>items.forEach(([h,b,col],i)=>{const yy=y+i*gap;circ(s,x,yy,0.46,col||c,i+1,15);
 tb(s,h,{x:x+0.62,y:yy-0.02,w:w-0.62,h:0.36,fontSize:16,bold:true,color:NAVY});tb(s,b,{x:x+0.62,y:yy+0.34,w:w-0.62,h:gap-0.4,fontSize:13});});
const map=(s,file,x,y,h,alt)=>{const d=sizeOf(file);const w=h*d.w/d.h;s.addImage({path:file,x,y,w,h,altText:alt});return w;};
const chap='https://thegospelvault.com/bible-studies/isaiah/';
const SRC='Lyons, Isaiah 1–66 Outline and Notes (thegospelvault.com/bible-studies/isaiah/)';

/* 1 Isaiah at a Glance */
{const s=slide(1,'Isaiah at a Glance','From Isaiah’s call to the new heavens and new earth  ·  not to scale','Overview',
 `PLACEMENT: Isaiah notes, Introduction; book overview. SOURCES: ${SRC} — Introduction: ministry 740–680 BC from the year Uzziah died (6:1); 722 BC fall of Samaria (7:8; 8:4 notes; 2 Kings 17); 701 BC Sennacherib (36–37); Babylonian captivity total in 586 BC (39:6 notes); Babylon falls to the Medes 539 BC (13:17 notes); Cyrus (44:28–45:1). Bands follow the notes’ assignments: Tribulation (24, 34), Millennial Kingdom (2, 4, 11, 25, 35, 60), Second Coming from Bozrah (63:1–6). Era colors match God’s Prophetical Program Chart 1.`);
 const by=2.75,bh=0.92;
 [['Isaiah’s Day','the Assyrian crisis',0.6,3.3,BLUE],['Exile & Return','Babylon → Persia',3.3,5.6,BROWN],['The Church Age','the hidden valley',5.6,7.6,GREEN],
  ['Tribulation','Isa 24; 34',7.6,8.95,RED],['Millennial Kingdom','Isa 2; 11; 35; 60',8.95,11.4,GOLD],['Eternal State','Isa 65:17; 66:22',11.4,12.78,PURPLE]].forEach(([a,b,x0,x1,c])=>{
  rect(s,x0,by,x1-x0,bh,c);tb(s,[{text:a,options:{bold:true,fontSize:15,breakLine:true}},{text:b,options:{fontSize:12}}],{x:x0+0.05,y:by,w:x1-x0-0.1,h:bh,color:WHITE,align:'center',valign:'middle'});});
 const br=(x0,x1,label,c)=>{const y=2.38;line(s,x0+0.05,y,x1-x0-0.1,0,c);line(s,x0+0.05,y,0,0.2,c);line(s,x1-0.05,y,0,0.2,c);
  tb(s,label,{x:x0,y:1.88,w:x1-x0,h:0.4,fontSize:13,bold:true,color:c,align:'center',valign:'bottom'});};
 br(0.6,3.3,'Isaiah 1–39  ·  judgment',BLUE);br(3.3,12.78,'Isaiah 40–66  ·  comfort, written ahead to the exile and beyond',NAVY);
 [[0.6,1,'740 BC\nUzziah dies;\nIsaiah called (6:1)'],[2.05,0,'722 BC\nSamaria falls to\nAssyria  (7:8)'],[3.0,1,'701 BC\nSennacherib turned\nback  (37:36–37)'],
  [3.95,0,'586 BC\nJerusalem falls\n(foretold 39:6)'],[4.7,1,'539–538 BC\nBabylon falls; Cyrus\nfrees the captives\n(44:28; 45:1)'],[5.6,0,'First Advent\nIsa 7:14; 9:6\n52:13–53:12'],
  [8.95,1,'Second Coming\nfrom Edom, Bozrah\nIsa 63:1–6']].forEach(([x,short,txt])=>{const ly=short?3.95:5.0;line(s,x,by+bh,0,ly-(by+bh)-0.05,NAVY);
  s.addShape(S.OVAL,{x:x-0.08,y:by+bh-0.08,w:0.16,h:0.16,fill:{color:NAVY},line:{color:BG,width:1}});const w=x===0.6?1.35:1.6,left=x===0.6;
  tb(s,txt,{x:left?x:x-w/2,y:ly,w,h:0.98,fontSize:12,align:left?'left':'center'});});
 foot(s,'The prophet saw Messiah’s sufferings (ch. 53) and His glory (ch. 11) on one horizon; the Church Age between them was not yet revealed (see Prophecy Chart 10, the Two-Mountain View).',6.08);}

/* 2 Kings and prophets */
{const s=slide(2,'Kings and Prophets in Isaiah’s Day','Judah, Israel, Assyria and the eighth-century prophets, 800–670 BC','Introduction',
 `PLACEMENT: Isaiah notes, Introduction (§I.D–J) and Isaiah 7. SOURCES: ${SRC}: Uzziah 791–740; Jeroboam II 793–753 (Isa 7 notes; Introduction gives 782–753 as his sole reign); Pekah 752–732; Rezin and Pekah die 732; Ahaz dies 715 (14:28); Hezekiah dies 686 (38 notes); Samaria falls 722; Sargon dies 705; Sennacherib 705–681 (37 notes give 681; Introduction 680); Isaiah 740–680; Micah to Judah, Amos and Hosea to Israel (Introduction §I.C). Other reign dates follow E. R. Thiele, The Mysterious Numbers of the Hebrew Kings, including co-regencies (Jotham, Manasseh). Prophets’ ranges approximate from Amos 1:1, Hos 1:1, Mic 1:1.`);
 const X=yr=>2.15+(800-yr)/130*10.55, lx=0.6,lw=1.45;
 const lanes=[['JUDAH',1.75,BLUE],['ISRAEL',2.75,GREEN],['ASSYRIA',3.75,BROWN],['PROPHETS',4.6,NAVY]];
 lanes.forEach(([n,y,c],i)=>{const h=i===3?1.32:0.8;rect(s,lx,y,lw,h,TINT);tb(s,n,{x:lx,y,w:lw,h,fontSize:14,bold:true,color:c,align:'center',valign:'middle'});});
 const bar=(a,b,y,h,c,label,fs=11,o={})=>{const x0=X(a),x1=X(Math.max(b,670));rect(s,x0,y,x1-x0,h,c,o.line);tb(s,label+(b<670?'  →':''),{x:x0+0.05,y,w:x1-x0-0.1,h,fontSize:fs,color:o.ink||WHITE,bold:!!o.bold,align:'center',valign:'middle'});};
 bar(791,740,1.75,0.38,BLUE,'Uzziah 791–740');bar(735,715,1.75,0.38,BLUE,'Ahaz 735–715');bar(697,642,1.75,0.38,BLUE,'Manasseh 697–642');
 bar(750,732,2.17,0.38,'4A6FB0','Jotham 750–732');bar(715,686,2.17,0.38,'4A6FB0','Hezekiah 715–686');
 bar(793,753,2.75,0.38,GREEN,'Jeroboam II 793–753');bar(753,740,2.75,0.38,'5E7F4A','4 kings',10);
 bar(752,732,3.17,0.38,'5E7F4A','Pekah 752–732');bar(732,722,3.17,0.38,'5E7F4A','Hoshea',10);
 bar(745,727,3.75,0.8,BROWN,'Tiglath-Pileser III\n745–727',11);bar(727,722,3.75,0.8,'8A7560','Sh.\nV',9);bar(722,705,3.75,0.8,BROWN,'Sargon II\n722–705',11);bar(705,681,3.75,0.8,BROWN,'Sennacherib\n705–681',11);
 bar(760,750,4.6,0.3,'8794AE','Amos',10);bar(755,715,4.93,0.3,'8794AE','Hosea  c. 755–715',10);bar(735,700,5.26,0.3,'8794AE','Micah  c. 735–700',10);bar(740,680,5.59,0.33,NAVY,'ISAIAH  740–680',11,{bold:true});
 [[732,'732 Damascus falls','r'],[722,'722 Samaria falls','l'],[701,'701 Sennacherib','l']].forEach(([yr,t,a])=>{const x=X(yr);line(s,x,1.65,0,4.4,RED,1.25,true);const w=1.7;tb(s,t,{x:a==='r'?x-w-0.05:a==='l'?x+0.05:x-w/2,y:6.3,w,h:0.27,fontSize:11,bold:true,color:RED,align:a==='r'?'right':a==='l'?'left':'center'});});
 for(let yr=800;yr>=680;yr-=20){const x=X(yr);tb(s,yr+' BC',{x:x-0.45,y:6.07,w:0.9,h:0.25,fontSize:10,color:GREY,align:'center'});}
 tb(s,'Isaiah to Judah; Micah to Judah; Amos and Hosea to the Northern Kingdom. Reigns overlap where a son ruled with his father.',{x:0.6,y:6.66,w:12.15,h:0.3,fontSize:12,italic:true,color:GREY});}

/* 3 Shape of the book */
{const s=slide(3,'The Shape of the Book','Sixty-six chapters in two great movements: judgment, then comfort','Overview',
 `PLACEMENT: Isaiah notes, Introduction and Isaiah 40. SOURCES: ${SRC}, Isaiah 40: “While the first 39 chapters … are filled with messages of judgment, this section emphasizes restoration and deliverance”; 40–48 deliverance from captivity in Babylon, ending “there is no peace for the wicked” (48:22), Cyrus the chief deliverer; 49–57 the rejection and restoration of the suffering servant, ending 57:21, with 52:13–53:12; 58–66 the consummation of God’s restoration; the heart of the section is the coming of Messiah, ch. 61–63. Isaiah 13 notes: 13–23 judgment on the nations. Isaiah 38 notes: chapters 38–39 occurred before 36–37. Subdivisions of 1–39 are descriptive groupings of the chapters’ content.`);
 const X=c=>0.6+(c-1)*12.15/66, W=n=>n*12.15/66;
 rect(s,X(1),1.75,W(39)-0.04,0.7,BLUE);tb(s,'Isaiah 1–39  ·  Judgment',{x:X(1),y:1.75,w:W(39),h:0.7,fontSize:17,bold:true,color:WHITE,align:'center',valign:'middle'});
 rect(s,X(40),1.75,W(27),0.7,GOLD);tb(s,'Isaiah 40–66  ·  Comfort',{x:X(40),y:1.75,w:W(27),h:0.7,fontSize:17,bold:true,color:WHITE,align:'center',valign:'middle'});
 const blocks=[[1,12,'1–12','Judah and Jerusalem; Immanuel',BLUE],[13,23,'13–23','Burdens on the nations',BLUE],[24,27,'24–27','In that day',BLUE],[28,35,'28–35','Woes and the coming King',BLUE],[36,39,'36–39','History',BROWN],
  [40,48,'40–48','Deliverance from Babylon: Cyrus',GOLD],[49,57,'49–57','The Suffering Servant',RED],[58,66,'58–66','Restoration consummated',GOLD]];
 blocks.forEach(([a,b,r,t,c])=>{const x=X(a)+0.03,w=W(b-a+1)-0.06;rect(s,x,2.6,w,1.45,WHITE,c);
  const nar=w<1;tb(s,[{text:r,options:{bold:true,fontSize:nar?11:14,color:c==='B8862B'?'8A6A20':c,breakLine:true}},{text:t,options:{fontSize:nar?10.5:12}}],{x:x+0.07,y:2.62,w:w-0.14,h:1.4,align:'center',valign:'middle'});});
 // chapter ruler
 for(let c=1;c<=66;c++){const x=X(c)+W(1)/2;line(s,x,4.2,0,c%5===0||c===1||c===66?0.16:0.08,GREY,0.75);}
 [1,10,20,30,39,40,48,53,57,66].forEach(c=>tb(s,String(c),{x:X(c)+W(1)/2-0.25,y:4.38,w:0.5,h:0.24,fontSize:10,color:GREY,align:'center'}));
 const mk=(c,col)=>{const x=X(c)+W(1)/2;s.addShape(S.OVAL,{x:x-0.1,y:4.66,w:0.2,h:0.2,fill:{color:col},line:{color:col,width:0}});};
 mk(48,NAVY);mk(57,NAVY);mk(53,RED);rect(s,X(61),4.7,W(3),0.12,GOLD);mk(38.5,BROWN);
 [[NAVY,'48:22 and 57:21','“There is no peace,” says the LORD, “for the wicked” — the refrain that closes 40–48 and 49–57'],[RED,'52:13–53:12','The Suffering Servant, at the center of chapters 40–66'],
  ['8A6A20','61–63','The heart of 58–66: the coming of Messiah'],[BROWN,'36–39','History: the hinge between Assyria (36–37) and Babylon (39)']].forEach(([c,h,t],i)=>{const x=0.6+i*3.05;
  s.addShape(S.OVAL,{x,y:5.12,w:0.2,h:0.2,fill:{color:c},line:{color:c,width:0}});tb(s,[{text:h,options:{bold:true,color:c,breakLine:true}},{text:t}],{x:x+0.3,y:5.05,w:2.65,h:1.2,fontSize:12});});
 tb(s,'Book order is not always time order: the notes date Hezekiah’s illness and Babylon’s envoys (38–39) before Sennacherib’s siege (36–37), all in 701 BC.',{x:0.6,y:6.6,w:12.15,h:0.35,fontSize:12,italic:true,color:GREY});}

/* 4–5 Messiah lists */
const mlist=(n,title,sub,col,items,note,notes)=>{const s=slide(n,title,sub,'Messiah in Isaiah',notes);
 const half=Math.ceil(items.length/2),rh=Math.min(0.62,4.75/half);
 items.forEach(([ref,desc,nt],i)=>{const c=i<half?0:1,r=i%half,x=0.6+c*6.15,y=1.6+r*rh;
  circ(s,x,y+0.04,0.36,col,i+1,12);
  tb(s,[{text:ref+'  ',options:{bold:true,color:NAVY}},{text:desc}],{x:x+0.48,y,w:3.95,h:rh,fontSize:12.5,valign:'top'});
  tb(s,nt,{x:x+4.5,y,w:1.5,h:rh,fontSize:11,color:GREY,valign:'top'});});
 tb(s,note,{x:0.6,y:6.5,w:12.15,h:0.42,fontSize:12.5,italic:true,color:GREY});};
mlist(4,'Messiah in Isaiah: The First Advent','The sufferings: prophecies fulfilled when Christ came the first time','2E5496',[
 ['7:14','Born of a virgin: “Immanuel,” God with us','Matt 1:22–23'],['8:14; 28:16','The stone: stumbling stone and sure foundation','Rom 9:33; 1 Pet 2:6–8'],
 ['9:1–2','A great light dawns in Galilee','Matt 4:13–16'],['9:6','“A child is born, a Son is given”','Luke 2:11'],
 ['11:1–2','Shoot from Jesse; the Spirit rests on Him','Acts 13:23; Matt 3:16'],['22:22','The key of the house of David','Rev 3:7'],
 ['35:5–6','The blind see, the deaf hear, the lame leap','Matt 11:4–5'],['40:3','A voice in the wilderness prepares His way','Matt 3:3; John 1:23'],
 ['40:11','The Shepherd gathers the lambs','John 10:11'],['42:1–4','The gentle, Spirit-anointed Servant','Matt 12:17–21'],
 ['49:6','A light to the Gentiles','Luke 2:32; Acts 13:47'],['50:6','His back to the smiters; His face to spitting','Matt 26:67; 27:30'],
 ['52:13–53:12','Wounded for our transgressions; bore the sin of many','Acts 8:32–35; 1 Pet 2:22–25'],['55:3','The sure mercies of David','Acts 13:34'],
 ['61:1–2a','Anointed to preach good news — He stopped mid-verse','Luke 4:16–21'],['62:11','“Behold, your salvation comes”','Matt 21:5']],
 'In Nazareth Jesus read Isaiah 61:1–2a and stopped before “the day of vengeance” (61:2b), which waits for His return (see Prophecy Chart 11).',
 `PLACEMENT: Isaiah notes, book overview; linked from chapters 7, 9, 11, 35, 40, 42, 49, 50, 53, 55, 61, 62. SOURCES: passages and New Testament fulfillments are a synthesis, not taken from the notes alone; see Arnold G. Fruchtenbaum, Messianic Christology (Tustin, CA: Ariel Ministries, 2010) [FGR]. The notes themselves treat 7:14 (near and far fulfillment, Matt 1), 9:6–7, 11:1–5, 40:3–5 (John the Baptist), 42:1 (Matt 12), 49:1–6, 50:4–9, 52:13–53:12 (substitutionary death of Christ). Classification as First Advent follows the Two-Mountain View (Prophecy Chart 10).`);
mlist(5,'Messiah in Isaiah: The Second Advent','The glories: prophecies that wait for Christ’s return and kingdom','B8862B',[
 ['2:2–4','Nations stream to the LORD’s house; swords into plowshares','Mic 4:1–3'],['4:2','The Branch of the LORD, beautiful and glorious','Jer 23:5; Zech 6:12'],
 ['9:7','On David’s throne: no end to His government','Luke 1:32–33'],['11:3–10','Judges in righteousness; the wolf with the lamb','Rev 19:11'],
 ['11:11–12','Regathers Israel a second time','Matt 24:31'],['16:5','A throne in the tent of David, established in mercy','Amos 9:11'],
 ['25:8','Swallows up death forever; wipes away tears','1 Cor 15:54'],['32:1','A King will reign in righteousness','Jer 23:5–6'],
 ['33:17','Your eyes will see the King in His beauty','Rev 22:4'],['49:7','Kings will see and arise; princes will bow','Phil 2:10–11'],
 ['59:20','The Redeemer will come to Zion','Rom 11:26'],['60:1–3','The glory of the LORD rises on Zion; nations come to her light','Rev 21:23–24'],
 ['61:2b–3','The day of vengeance of our God','2 Thess 1:7–8'],['63:1–6','Comes from Edom, His garments stained red','Rev 19:13–15']],
 'See Prophecy Chart 24 (from Bozrah to the Mount of Olives, Isaiah 63) and Chart 31 (Isaiah 2 and Micah 4).',
 `PLACEMENT: Isaiah notes, book overview; linked from chapters 2, 4, 9, 11, 16, 25, 32, 33, 49, 59, 60, 61, 63. SOURCES: synthesis; see Fruchtenbaum, Messianic Christology [FGR], and J. Dwight Pentecost, Things to Come [FGR]. The notes place 2:2–4 (“the last days – the time of the millennial kingdom”), 4:2–6, 11, 25, 32:1 (“has to be the age to come”), 35 and 60 in the millennial kingdom, and 63:1–6 at the Second Coming. New Testament references are cross-references (cf.), not all direct quotations.`);

/* 6 Syro-Ephraimite crisis map */
{const s=slide(6,'The Syro-Ephraimite Crisis','Isaiah 7–8  ·  Aram and Israel against Judah, about 735–732 BC  ·  schematic map','Isaiah 7–8',
 `PLACEMENT: Isaiah notes, Isaiah 7 (and 8). SOURCES: ${SRC}, Isaiah 7: Rezin of Aram and Pekah of Israel (752–732) allied to replace Ahaz with a puppet king (7:6); Isaiah meets Ahaz at the upper pool with Shear-jashub (7:3); “If you will not believe, you surely shall not last” (7:9); Immanuel sign (7:14–16); both kings died in 732. Isaiah 8: Tiglath-Pileser III subdued Damascus and Samaria (732), Samaria fell 722. Ahaz’s appeal to Assyria: 2 Kings 16:7–9.`);
 map(s,'map-syro.png',0.6,1.55,5.3,'Schematic map: Aram and Israel march on Jerusalem; Ahaz appeals to Assyria.');
 steps(s,5.4,1.65,7.3,[['The alliance','Rezin of Aram and Pekah of Israel march on Jerusalem to set up a puppet king (7:1–6)'],
  ['At the upper pool','Isaiah and his son Shear-jashub meet Ahaz: “If you will not believe, you surely shall not last” (7:3–9)'],
  ['The sign refused','Ahaz will not ask for a sign; God gives one anyway: Immanuel (7:10–16)'],
  ['Ahaz turns to Assyria','Assyria takes Damascus in 732 BC; Samaria falls in 722 BC (8:4; 2 Kings 16:7–9; 17:6)',GOLD]],1.2);
 tb(s,'Thirty-three years later Hezekiah faces Assyria at the same upper pool (36:2) — and trusts the LORD.',{x:5.4,y:6.45,w:7.35,h:0.45,fontSize:12.5,italic:true,color:GREY});}

/* 7 Sign-children */
{const s=slide(7,'Isaiah’s Sign-Children','“I and the children whom the LORD has given me are for signs” (8:18)','Isaiah 7–8',
 `PLACEMENT: Isaiah notes, Isaiah 7 and 8. SOURCES: ${SRC}: Shear-jashub “a remnant will return” (7:3); Immanuel “God with us,” born of a virgin, near fulfillment to Ahaz and far fulfillment in Christ quoted by Matthew (7:14 notes); Maher-shalal-hash-baz “quick pickings, easy prey,” the longest personal name in the Bible; a year after his birth Assyria plundered Damascus and Samaria (8:1–4 notes).`);
 const cards=[['Shear-jashub','“A remnant shall return”',GREEN,'Isaiah 7:3','Goes with Isaiah to meet Ahaz at the upper pool. His name is the message: Judah will not be destroyed; a remnant will return (cf. 10:20–22).'],
  ['Immanuel','“God with us”',GOLD,'Isaiah 7:14; 8:8, 10','Near: before the child is grown, the alliance of Rezin and Pekah is broken.\nFar: born of a virgin — Jesus Christ (Matt 1:22–23).'],
  ['Maher-shalal-hash-baz','“Quick pickings, easy prey”',RED,'Isaiah 8:1–4','Before he can say “father” or “mother,” Assyria plunders Damascus and Samaria (732 BC). The longest personal name in the Bible.']];
 cards.forEach(([n,m,c,r,b],i)=>{const x=0.6+i*4.1,w=3.85;rect(s,x,1.7,w,1.25,c);
  tb(s,[{text:n,options:{bold:true,fontSize:19,breakLine:true}},{text:m,options:{fontSize:14,italic:true}}],{x:x+0.1,y:1.7,w:w-0.2,h:1.25,color:WHITE,align:'center',valign:'middle'});
  rect(s,x,2.95,w,2.35,WHITE,c);tb(s,r,{x:x+0.2,y:3.1,w:w-0.4,h:0.35,fontSize:14,bold:true,color:NAVY});tb(s,b,{x:x+0.2,y:3.5,w:w-0.4,h:2.1,fontSize:14});});
 tb(s,'Isaiah’s own name means “the LORD is salvation.” Father and sons together were a living sermon to Judah.',{x:0.6,y:5.6,w:12.15,h:0.4,fontSize:14,italic:true,color:GREY});}

/* 8 Burdens map */
{const s=slide(8,'The Burdens on the Nations','Isaiah 13–23  ·  ten oracles, from Babylon to Tyre  ·  schematic map','Isaiah 13–23',
 `PLACEMENT: Isaiah notes, Isaiah 13 (introduction to chapters 13–23), linked from each of 13–23. SOURCES: oracle list exactly as ${SRC}, Isaiah 13 §I.A–J. Medes 539 BC (13:17); Philistia oracle in the year Ahaz died, 715 BC (14:28); Moab within three years (16:13–14); Damascus capital of Rezin (17); papyrus envoys (18:2, 7); Isaiah’s three-year sign (20); Dedan, Tema, Kedar (21:13–17); valley of vision = Jerusalem (22:1). The notes read 21:1–10 as Merodach-baladan’s Babylon (c. 722–702 BC).`);
 map(s,'map-oracles.png',0.6,1.55,5.3,'Schematic map of the Near East numbering the nations of Isaiah 13–23.');
 [['Babylon','13:1–14:27  (21:1–10)','Overthrown by the Medes (13:17); the king of Babylon brought down'],['Philistia','14:28–32','Given the year Ahaz died: do not rejoice that the rod is broken'],
  ['Moab','15:1–16:14','Ar and Kir fall in a night; within three years Moab’s glory is degraded'],['Damascus (Aram)','17:1–14','Rezin’s capital, allied with Israel, ceases to be a city'],
  ['Cush (Ethiopia)','18:1–7','Envoys in papyrus vessels; a gift brought to Mount Zion'],['Egypt','19:1–20:6','Isaiah walks stripped three years: Egypt cannot save Judah'],
  ['Edom (Dumah)','21:11–12','“Watchman, what of the night?”'],['Arabia','21:13–17','Dedan, Tema and Kedar; Kedar’s splendor ends within a year'],
  ['Jerusalem','22:1–25','The “valley of vision”: feasting while the city is threatened'],['Tyre','23:1–18','The great Phoenician seaport and its trade brought low']].forEach(([nm,ref,note],i)=>{
  const col=i<5?0:1,r=i%5,x=5.25+col*3.75,y=1.55+r*1.0,c=i===8?NAVY:RED;circ(s,x,y+0.02,0.42,c,i+1,14);
  tb(s,[{text:nm,options:{bold:true,color:NAVY,fontSize:15}},{text:'  '+ref,options:{color:GREY,fontSize:12}}],{x:x+0.55,y,w:3.1,h:0.34});tb(s,note,{x:x+0.55,y:y+0.34,w:3.05,h:0.6,fontSize:12});});
 tb(s,'God rules the nations Judah feared or trusted. Locations approximate.',{x:5.25,y:6.55,w:7.5,h:0.3,fontSize:12,italic:true,color:GREY});}

/* 9 Near and far */
{const s=slide(9,'Near and Far in the Burdens','Some oracles were fulfilled in Isaiah’s near future; some also look to “that day”','Isaiah 13–23',
 `PLACEMENT: Isaiah notes, Isaiah 13–23. SOURCES: ${SRC}: Babylon — Medes 539 BC (13:17), 13:6–13 “looks forward to the tribulation period,” Israel restored in “that day” (14:1–4); Moab — within three years (16:14); Damascus — Rezin and Pekah died 732, Damascus plundered (7:16; 8:4 notes); Cush — 18:7 offerings to Zion “at the time of the destruction of Assyria or possibly at the time of the millennium”; Egypt — 20:3–4 three-year sign; 19:16–25 “in that day Egypt will know the true God of Israel,” Assyria included; Tyre — trade cut off c. 700–630 BC, the seventy years (23:15–17). A dash means the notes keep that burden in near history.`);
 const cols=[[0.6,2.0,'ORACLE'],[2.75,4.85,'NEAR  ·  in Isaiah’s era'],[7.75,5.0,'FAR  ·  “in that day”']];
 cols.forEach(([x,w,l])=>tb(s,l,{x,y:1.6,w,h:0.3,fontSize:13,bold:true,color:GREY}));
 const rows=[['Babylon','13–14','Overthrown by the Medes, 539 BC (13:17–22)','The Day of the LORD, the Tribulation (13:6–13); Israel restored and singing over the fallen king (14:1–4)'],
  ['Moab','15–16','Within three years Moab’s glory is degraded (16:14)','—'],
  ['Damascus','17','Rezin’s alliance broken; Damascus plundered, 732 BC (17:1–3; 8:4)','—'],
  ['Cush','18','Assyria cut down like pruned branches (18:5–6)','A gift brought to Mount Zion — possibly in the millennium (18:7)'],
  ['Egypt','19–20','Isaiah’s three-year sign: Egypt led away by Assyria (20:3–4)','Egypt and Assyria worship with Israel “in that day” (19:18–25)'],
  ['Tyre','23','Trade cut off for “seventy years,” about 700–630 BC (23:15–17)','—']];
 rows.forEach(([n,r,a,b],i)=>{const y=1.98+i*0.72,h=0.64;rect(s,0.6,y,2.0,h,RED,null,{round:0.06});
  tb(s,[{text:n,options:{bold:true,fontSize:15,breakLine:true}},{text:'Isaiah '+r,options:{fontSize:11}}],{x:0.6,y,w:2.0,h,color:WHITE,align:'center',valign:'middle'});
  rect(s,2.75,y,4.85,h,WHITE,'C9B9A6');tb(s,a,{x:2.9,y,w:4.6,h,fontSize:13,valign:'middle'});
  rect(s,7.75,y,5.0,h,b==='—'?BG:'FBF4E2',b==='—'?'D9D2C3':GOLD);tb(s,b,{x:7.9,y,w:4.75,h,fontSize:13,valign:'middle',color:b==='—'?GREY:INK,align:b==='—'?'center':'left'});});
 foot(s,'A dash: the notes place that burden in Isaiah’s near history. Isaiah often joins a near judgment to a far one (compare Chart 1).',6.42);}

/* 10 In that day */
{const s=slide(10,'“In That Day”: Isaiah 24–27','The earth judged, the dragon slain, and the kingdom opened','Isaiah 24–27',
 `PLACEMENT: Isaiah notes, Isaiah 24–27. SOURCES: ${SRC}: “God will ‘ruin’ the whole earth” (24 notes); worldwide earthquake (24:19–20); “In that day, the Lord will punish” (24:21); “First comes the tribulation chapter 24. Then comes the millennial kingdom” (25:1 notes); 25:6–8 from Mount Zion; 26:1 “In that Day – not today”; 26:17 the tribulation a time of “labor” for Israel; 26:19 Israel’s resurrection after the tribulation; 27:1 Leviathan slain at the end of the tribulation at Christ’s second advent (Rev 19:11–16); 27:2–6 the vineyard; 27:12–13 regathering from the Euphrates to Egypt.`);
 const zones=[[0.6,5.0,'Tribulation',RED],[5.0,7.55,'Second Coming',NAVY],[7.55,12.78,'Millennial Kingdom',GOLD]];
 zones.forEach(([a,b,t,c])=>{rect(s,a,1.65,b-a,0.55,c);tb(s,t,{x:a,y:1.65,w:b-a,h:0.55,fontSize:16,bold:true,color:WHITE,align:'center',valign:'middle'});});
 const list=(x,w,items,c,g=0.6)=>items.forEach(([r,t],i)=>{const y=2.45+i*g;tb(s,[{text:r+'  ',options:{bold:true,color:c}},{text:t}],{x,y,w,h:0.56,fontSize:13});});
 list(0.6,4.25,[['24:1–3','The earth laid waste and emptied'],['24:19–20','A worldwide earthquake: the earth reels like a drunkard'],['24:21–22','The LORD punishes the host on high and the kings of the earth'],['26:17–18','Israel in labor, like a woman giving birth'],['26:20–21','“Hide yourself … until the indignation is past”']],RED);
 list(5.15,2.25,[['27:1','The LORD slays Leviathan, the twisting serpent, with His sword'],['24:23','The LORD of hosts reigns on Mount Zion']],NAVY,1.15);
 list(7.7,5.05,[['25:6','A feast for all peoples on Mount Zion'],['25:8','Death swallowed up forever; tears wiped away'],['25:9','“This is our God; we have waited for Him”'],['26:1–3','A strong city; perfect peace for the steadfast mind'],['26:19','Israel’s dead will live'],['27:2–6','The vineyard kept and fruitful, filling the world'],['27:12–13','The great trumpet: Israel gathered from the Euphrates to Egypt']],'8A6A20',0.55);
 foot(s,'“First comes the tribulation, chapter 24. Then comes the millennial kingdom.” — the notes on 25:1',6.55);}

/* 11 Six woes */
{const s=slide(11,'Six Woes and the Coming King','Isaiah 28–33  ·  misplaced trust, and God’s answer','Isaiah 28–33',
 `PLACEMENT: Isaiah notes, Isaiah 28–33. SOURCES: ${SRC}: 28:1 woe to the Northern Kingdom, Ephraim, Samaria — the drunkards; 29:1 Woe O Ariel – Jerusalem, 29:13 why it has gone this way; 29:15–16 woe to those who hide plans, potter and clay; 30:1 rebellious children who go to Egypt without consulting God; 31:1 woe to those who go down to Egypt for help; 33:1 woe to the destroyer – Assyrians; “woe” occurs 22 times in Isaiah, more than any other prophetic book (notes on 18:1). God’s answer: 28:16 a cornerstone in Zion; 30:15; 32:1 “has to be the age to come”; 33:17 Messiah the King seen.`);
 [['28:1','Ephraim’s drunkards','The proud crown of Samaria, soon trampled'],['29:1','Ariel — Jerusalem','Worship by rote; hearts far from God (29:13)'],['29:15','Those who hide plans from the LORD','The clay questioning the potter (29:16)'],
  ['30:1','Rebellious children','Off to Egypt without asking the LORD'],['31:1','Those who trust Egypt’s horses','Chariots instead of the Holy One of Israel'],['33:1','The destroyer — Assyria','The destroyer will itself be destroyed']].forEach(([r,w,t],i)=>{
  const y=1.65+i*0.78;circ(s,0.6,y+0.08,0.46,RED,i+1,15);tb(s,[{text:r+'  ',options:{color:GREY,fontSize:13}},{text:'Woe: '+w,options:{bold:true,color:NAVY,fontSize:15}}],{x:1.2,y,w:6.4,h:0.36});
  tb(s,t,{x:1.2,y:y+0.36,w:6.4,h:0.36,fontSize:13});});
 rect(s,7.95,1.65,4.8,4.0,'FBF4E2',GOLD,{round:0.08});tb(s,'GOD’S ANSWER',{x:8.2,y:1.8,w:4.3,h:0.32,fontSize:13,bold:true,color:'8A6A20'});
 tb(s,[['28:16','A tested cornerstone, a sure foundation in Zion'],['30:15','“In returning and rest you shall be saved”'],['30:18','The LORD waits to be gracious to you'],['32:1','A King will reign in righteousness'],['33:17','Your eyes will see the King in His beauty'],['33:22','The LORD is our Judge, Lawgiver and King']]
  .flatMap(([r,t],i,a)=>[{text:r+'  ',options:{bold:true,color:'8A6A20'}},{text:t,options:{breakLine:i<a.length-1}}]),{x:8.2,y:2.2,w:4.35,h:3.9,fontSize:14,paraSpaceAfter:9});
 foot(s,'“Woe” appears 22 times in Isaiah, more than in any other prophetic book.',6.5);}

/* 12 Sennacherib map */
{const s=slide(12,'Sennacherib’s Campaign, 701 BC','Isaiah 36–37  ·  2 Kings 18–19  ·  schematic map','Isaiah 36–37',
 `PLACEMENT: Isaiah notes, Isaiah 36 and 37. SOURCES: ${SRC}: “In the fourteenth year of King Hezekiah” (36:1); 701 BC (Introduction §H); the Rabshakeh at the conduit of the upper pool (36:2) — the same place Isaiah met Ahaz 33 years earlier (7:3 notes); Sennacherib left Lachish for Libnah, five miles north; Tirhakah, king of Cush, came (37:8–9); 185,000 struck (37:36; Introduction); Sennacherib assassinated by two sons twenty years later (37 notes: 681 BC). Route along the coast is schematic.`);
 const w=map(s,'map-701.png',0.6,1.55,5.3,'Schematic map of Sennacherib’s march down the coast to Lachish and the Rabshakeh’s approach to Jerusalem.');
 steps(s,0.6+w+0.45,1.6,12.75-(0.6+w+0.45),[['Down the coast','“In the fourteenth year of King Hezekiah” Sennacherib takes the fortified cities of Judah (36:1)'],
  ['From Lachish','The Rabshakeh is sent to Jerusalem with a great army (36:2)'],['At the upper pool','He mocks Hezekiah’s trust, where Isaiah once met Ahaz (36:2–20; 7:3)'],
  ['At Libnah','Sennacherib hears that Tirhakah of Cush is coming (37:8–9); Hezekiah spreads the letter before the LORD (37:14–20)'],
  ['Home to Nineveh','The angel of the LORD strikes 185,000; Sennacherib returns, later killed by his sons (37:36–38)',NAVY]],1.0);}

/* 13 Hezekiah */
{const s=slide(13,'Hezekiah’s Three Crises','In the order they happened  ·  all in 701 BC, according to the notes','Isaiah 36–39',
 `PLACEMENT: Isaiah notes, Isaiah 36–39. SOURCES: ${SRC}, Isaiah 38: “Chapters 38 & 39 occur chronologically before Chapters 36 & 37”; Hezekiah died 686, so his sickness was in 701; Isaiah 39: Merodach-baladan’s envoys came before Sennacherib’s attack, since the treasures had not yet been paid as tribute (2 Kings 18:13–16) — “Hezekiah’s illness, Merodach-baladan’s visit, and Sennacherib’s attack – all three occurred in 701 B.C.” Parallels: 2 Kings 18–20; 2 Chron 32.`);
 tb(s,'Book order:  36–37  →  38  →  39            Order of events:  38  →  39  →  36–37',{x:0.6,y:1.6,w:12.15,h:0.35,fontSize:14,bold:true,color:BROWN});
 const cards=[['1','Illness','Isaiah 38  ·  2 Kings 20:1–11',GREEN,'“Set your house in order.” Hezekiah prays and is given fifteen more years. The sign: the shadow goes back ten steps (38:8). His song of thanksgiving (38:9–20).'],
  ['2','Babylon’s envoys','Isaiah 39  ·  2 Kings 20:12–19',BROWN,'Merodach-baladan’s envoys arrive. Hezekiah shows them everything. Isaiah: all of it will be carried to Babylon (39:6).'],
  ['3','Assyria’s siege','Isaiah 36–37  ·  2 Kings 18:13–19:37',RED,'The Rabshakeh mocks at the upper pool. Hezekiah spreads the letter before the LORD. The angel of the LORD strikes 185,000.']];
 cards.forEach(([n,t,r,c,b],i)=>{const x=0.6+i*4.15,w=3.75;rect(s,x,2.15,w,0.9,c);circ(s,x+0.18,2.35,0.5,WHITE);tb(s,n,{x:x+0.18,y:2.35,w:0.5,h:0.5,fontSize:17,bold:true,color:c,align:'center',valign:'middle'});
  tb(s,t,{x:x+0.82,y:2.15,w:w-0.9,h:0.9,fontSize:19,bold:true,color:WHITE,valign:'middle'});rect(s,x,3.05,w,2.35,WHITE,c);
  tb(s,r,{x:x+0.2,y:3.2,w:w-0.4,h:0.32,fontSize:13,bold:true,color:NAVY});tb(s,b,{x:x+0.2,y:3.6,w:w-0.4,h:2.2,fontSize:14});
  if(i<2)tb(s,'›',{x:x+w,y:2.15,w:0.4,h:0.9,fontSize:30,bold:true,color:GREY,align:'center',valign:'middle'});});
 foot(s,'Placed last, chapter 39 turns the book from Assyria to Babylon — the setting of chapters 40–66.',5.65);}

/* 14 Cyrus map */
{const s=slide(14,'Cyrus and the Road Home','Isaiah 41–48  ·  the deliverer named in advance  ·  schematic map','Isaiah 40–48',
 `PLACEMENT: Isaiah notes, Isaiah 44–45 (and 40–48). SOURCES: ${SRC}: “Cyrus is the chief deliverer! Isa. 44:28–45:1” (40 notes); one from the east, Cyrus of Persia, who subdues Babylon in 539 BC (41:2 notes); Cyrus diverted the waters of the Euphrates (44:27 notes); “My shepherd,” “His anointed” (44:28; 45:1); Bel and Nebo (46:1); “When Cyrus issues his decree – flee quickly” (48:20 notes; 2 Chron 36:22–23; Ezra 1:1–4). Routes schematic.`);
 const w=map(s,'map-cyrus.png',0.6,1.6,4.9,'Schematic map: Cyrus advances from Persia and Media to Babylon; the exiles return to Jerusalem.');
 steps(s,0.6+w+0.4,1.62,12.75-(0.6+w+0.4),[['One from the east','God stirs up Cyrus of Persia: “My shepherd,” “His anointed” (41:2; 44:28; 45:1)',BROWN],
  ['Babylon falls, 539 BC','The river dried up (44:27); Bel bows down, Nebo stoops (46:1)'],['The decree, 538 BC','“You shall be built” (44:28; 2 Chron 36:22–23; Ezra 1:1–4)',RED],
  ['The road home','“Go forth from Babylon! Flee from the Chaldeans!” (48:20)',GOLD]],1.2);
 foot(s,'God named Cyrus and his work long before he was born — proof that the LORD alone declares the end from the beginning (46:10).',6.6);}

/* 15 Idols */
{const s=slide(15,'The Living God and the Idols','Isaiah 40–48  ·  “To whom will you liken Me?” (40:18, 25; 46:5)','Isaiah 40–48',
 `PLACEMENT: Isaiah notes, Isaiah 40, 41, 44 and 46. SOURCES: ${SRC}: “The God of Israel is the only God and, therefore, idol worship makes no sense!” (44:6); “How an Idol Comes To Be” (44:9–17); Bel and Nebo carried on animals (46:1–2); God’s ability to predict the future “makes Him stand alone as the unique God” (46:10 notes; 44:28; 45:1).`);
 rect(s,0.6,1.6,5.95,0.5,BROWN,null,{round:0.06});tb(s,'THE IDOLS',{x:0.6,y:1.6,w:5.95,h:0.5,fontSize:16,bold:true,color:WHITE,align:'center',valign:'middle'});
 rect(s,6.8,1.6,5.95,0.5,NAVY,null,{round:0.06});tb(s,'THE LORD',{x:6.8,y:1.6,w:5.95,h:0.5,fontSize:16,bold:true,color:WHITE,align:'center',valign:'middle'});
 [['Made by a craftsman from half a log; the other half cooks his dinner (44:9–17)','Made the heavens and stretched out the earth (40:12, 26; 44:24)'],
  ['Must be carried on weary animals: Bel bows, Nebo stoops (46:1–2)','Carries His people from birth to old age (46:3–4)'],
  ['Set in its place, it cannot move (46:7)','Sits above the circle of the earth (40:22)'],
  ['Cannot tell what is past or what is coming (41:21–24)','Declares the end from the beginning; names Cyrus in advance (46:9–10; 44:28)'],
  ['Cannot answer or save in trouble (45:20; 46:7)','“Besides Me there is no Savior” (43:11; 45:21–22)'],
  ['Its makers will be put to shame (44:9–11; 45:16)','“I am the First and I am the Last” (44:6)']].forEach(([a,b],i)=>{const y=2.22+i*0.72,h=0.64;
  rect(s,0.6,y,5.95,h,WHITE,'C9B9A6');tb(s,a,{x:0.75,y,w:5.7,h,fontSize:13,valign:'middle'});rect(s,6.8,y,5.95,h,WHITE,NAVY);tb(s,b,{x:6.95,y,w:5.7,h,fontSize:13,valign:'middle'});});}

/* 16 Servant Songs */
{const s=slide(16,'The Four Servant Songs','The Servant who succeeds where the servant nation failed  ·  Isaiah 42–53','Isaiah 42–53',
 `PLACEMENT: Isaiah notes at Isaiah 42, 49, 50 and 52:13–53:12. SOURCES: ${SRC}: 42:1 “My Servant (in contrast to the nation of Israel, vs. 19),” Matt 12:15–20; Spirit upon Him (Matt 3:16–17); justice to the nations at His second advent. 49 — the Servant speaks (vs. 1–5); “You are Israel” (49:3, Rom 9:6); light to the Gentiles (49:6). 50:4–9 — “The Servant is not like the nation … one of obedience.” 52:13–53:12 — the Suffering Servant. New Testament references added for the fulfillment column.`);
 [[0.6,2.05,'SONG'],[2.8,5.95,'THE SERVANT IN ISAIAH'],[8.9,3.88,'FULFILLED IN CHRIST']].forEach(([x,w,l])=>tb(s,l,{x,y:1.62,w,h:0.3,fontSize:13,bold:true,color:GREY}));
 [['42:1–9','Chosen, upheld and Spirit-anointed; quiet and gentle, He brings justice to the nations','Matt 12:17–21; 3:16–17',BLUE],
  ['49:1–13','Called from the womb; restores Jacob and is a light to the Gentiles. Named “Israel” (49:3)','Luke 2:30–32; Acts 13:47',GREEN],
  ['50:4–11','The obedient disciple: His ear opened, His back given to the smiters, His face set like flint','Matt 26:67; 27:26; Luke 9:51',GOLD],
  ['52:13–53:12','Marred, despised, wounded for our transgressions, silent as a lamb, then highly exalted','Acts 8:32–35; 1 Pet 2:22–25',RED]].forEach(([ref,d,nt,c],i)=>{const y=2.0+i*0.98,rh=0.86;
  rect(s,0.6,y,2.05,rh,c,null,{round:0.07});tb(s,[{text:`Song ${i+1}`,options:{fontSize:12,breakLine:true}},{text:'Isaiah '+ref,options:{fontSize:15,bold:true}}],{x:0.6,y,w:2.05,h:rh,color:WHITE,align:'center',valign:'middle'});
  for(const [x,w,t] of [[2.8,5.95,d],[8.9,3.88,nt]]){rect(s,x,y,w,rh,WHITE,c);tb(s,t,{x:x+0.15,y,w:w-0.3,h:rh,fontSize:14,valign:'middle'});}});
 tb(s,[{text:'The servant nation  ',options:{bold:true,color:NAVY}},{text:'blind and deaf to its calling (42:19)'},{text:'      The Servant  ',options:{bold:true,color:NAVY}},{text:'“I was not rebellious” (50:5): obedient to the Father’s will'}],{x:0.6,y:6.04,w:12.18,h:0.36,fontSize:14});}

/* 17 Isaiah 53 */
{const s=slide(17,'Isaiah 52:13–53:12: Who Is Speaking?','God speaks of “My Servant”; Israel confesses “we” and “our”','Isaiah 52:13–53:12',
 `PLACEMENT: Isaiah notes, Isaiah 52:13–53:12. SOURCES: ${SRC}: “God is doing the speaking” (52:13–15); “People of Israel do the speaking” (53:1ff.); the pronoun clues (“we, us, our” and “he, him, his”) and the Servant as a single, innocent sufferer, from Fruchtenbaum, The Suffering Messiah of Isaiah 53, as cited in the notes; substitutionary death of Christ. New Testament list from the notes (“Often quoted in the New Testament”) with one correction: John 12:38 and Rom 10:16 quote 53:1 (the notes list them under 52:15); 52:15 is quoted in Rom 15:21. 53:10–12 labeled by its content (“My righteous Servant,” 53:11).`);
 const blocks=[['52:13–15','GOD SPEAKS','“My Servant” will prosper and be exalted; His appearance marred more than any man; He will sprinkle many nations, and kings will shut their mouths.',NAVY,1.25],
  ['53:1–9','ISRAEL SPEAKS','“Who has believed our report?” Despised and rejected; He bore our griefs; wounded for our transgressions; all we like sheep have gone astray; silent as a lamb; His grave with the rich.',RED,1.7],
  ['53:10–12','THE LORD’S PURPOSE','It pleased the LORD to bruise Him, an offering for sin; He will see His seed; “My righteous Servant shall justify many”; He bore the sin of many and intercedes.',NAVY,1.4]];
 let y=1.6;blocks.forEach(([r,who,t,c,h])=>{rect(s,0.6,y,1.9,h,c,null,{round:0.06});tb(s,[{text:who,options:{fontSize:12,bold:true,breakLine:true}},{text:r,options:{fontSize:15,bold:true}}],{x:0.6,y,w:1.9,h,color:WHITE,align:'center',valign:'middle'});
  rect(s,2.6,y,5.75,h,WHITE,c);tb(s,t,{x:2.75,y,w:5.5,h,fontSize:14,valign:'middle'});y+=h+0.15;});
 rect(s,8.65,1.6,4.1,4.65,'F3F1EA','C9C3B4',{round:0.08});tb(s,'QUOTED IN THE NEW TESTAMENT',{x:8.85,y:1.75,w:3.8,h:0.3,fontSize:12,bold:true,color:GREY});
 tb(s,[['52:15','Rom 15:21'],['53:1','John 12:38; Rom 10:16'],['53:4','Matt 8:17'],['53:5–6','1 Pet 2:24–25'],['53:7–8','Acts 8:32–33'],['53:9','1 Pet 2:22'],['53:12','Luke 22:37']]
  .flatMap(([a,b],i,arr)=>[{text:a+'   ',options:{bold:true,color:NAVY}},{text:b,options:{breakLine:i<arr.length-1}}]),{x:8.85,y:2.15,w:3.75,h:3.9,fontSize:15,paraSpaceAfter:10});
 foot(s,'One Servant, innocent, suffering in the place of others: “He was wounded for our transgressions” (53:5).',6.5);}

/* 18 Wife of Jehovah */
{const s=slide(18,'Israel, the Wife of Jehovah','The marriage picture behind Isaiah 50, 54 and 62','Isaiah 50; 54; 62',
 `PLACEMENT: Isaiah notes, Isaiah 54 (and 50:1, 62:4–5). SOURCES: ${SRC}, Isaiah 54 §I “Notes on the picture used in the scriptures of Israel as the wife of Jehovah”: the Marriage (Ex 19:1–8; Ezek 16:8), the Great Adultery (Jer 3:1–5, 20; Ezek 16:15–34; Hos 2:2–5), a Period of Separation (Isa 50:1), the Divorce (Jer 3:6–10), the Punishment (Ezek 16:35–43; Hos 2:6–13), the Remarriage (Jer 31:31–34; Ezek 16:60–63; Isa 54:1–8; 62:4–5; Hos 2:14–23). Isaiah 50 notes: the Lord “divorcing” Zion temporarily. Isaiah 62 notes: “Forsaken is now called ‘God’s delight.’”`);
 const st=[['The Marriage','Ex 19:1–8; Ezek 16:8',GREEN],['The Great Adultery','Jer 3:1–5, 20; Ezek 16:15–34',RED],['Separation','Isa 50:1',BROWN],['The Divorce','Jer 3:6–10',RED],['The Punishment','Ezek 16:35–43; Hos 2:6–13',BROWN],['The Remarriage','Jer 31:31–34; Isa 54:1–8; 62:4–5',GOLD]];
 const w=1.86,g=0.2;st.forEach(([t,r,c],i)=>{const x=0.6+i*(w+g);rect(s,x,1.7,w,0.78,c,null,{round:0.06});tb(s,t,{x:x+0.05,y:1.7,w:w-0.1,h:0.78,fontSize:14,bold:true,color:WHITE,align:'center',valign:'middle'});
  rect(s,x,2.48,w,0.9,WHITE,c);tb(s,r,{x:x+0.1,y:2.48,w:w-0.2,h:0.9,fontSize:12,align:'center',valign:'middle'});
  if(i<5)tb(s,'›',{x:x+w,y:1.75,w:g,h:0.6,fontSize:22,bold:true,color:GREY,align:'center',valign:'middle'});});
 tb(s,'WHAT ISAIAH ADDS',{x:0.6,y:3.7,w:6,h:0.3,fontSize:13,bold:true,color:GREY});
 [['50:1','Sent away, not forsaken','“Where is your mother’s certificate of divorce?” She was sent away for her own sins — for a time.',BROWN],
  ['54:5–8','“Your Maker is your husband”','“For a mere moment I have forsaken you, but with great mercies I will gather you.”',GOLD],
  ['62:4–5','New names','“Forsaken” becomes Hephzibah, “My delight is in her”; “Desolate” becomes Beulah, “Married.”',GOLD]].forEach(([r,h,b,c],i)=>{const x=0.6+i*4.1,w2=3.85;
  rect(s,x,4.05,w2,1.95,WHITE,c,{round:0.06});tb(s,[{text:r+'  ',options:{bold:true,color:c===GOLD?'8A6A20':c}},{text:h,options:{bold:true,color:NAVY}}],{x:x+0.2,y:4.15,w:w2-0.4,h:0.62,fontSize:15,valign:'middle'});
  tb(s,b,{x:x+0.2,y:4.82,w:w2-0.4,h:1.15,fontSize:14});});
 foot(s,'Idolatry was Israel’s adultery; the remarriage rests on the New Covenant (Jer 31:31–34).',6.2);}

pres.writeFile({fileName:'Isaiah_Visual_Aids.pptx'}).then(async f=>{await applyTheme(f,THEME);console.log('wrote',f);});
