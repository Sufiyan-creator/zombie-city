const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const app=express(),server=http.createServer(app),io=new Server(server);
const PORT=process.env.PORT||3000,rooms=new Map(),MAX_PLAYERS=4,CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function code(){let c;do{c=Array.from({length:6},()=>CHARS[Math.floor(Math.random()*CHARS.length)]).join('')}while(rooms.has(c));return c}
function list(){return [...rooms].map(([code,r])=>({code,players:r.players.size,maxPlayers:MAX_PLAYERS,hostName:r.players.get(r.hostId)?.name||'Survivor'}))}
function people(r){return [...r.players.values()].map(p=>({id:p.id,slot:p.slot,name:p.name,...p.state}))}
function lobbyUpdate(){io.emit('lobbyList',list())}
function roomUpdate(c){const r=rooms.get(c);if(r)io.to(c).emit('roomUpdate',{code:c,players:people(r)})}
function leave(s){const c=s.data.room;if(!c)return;const r=rooms.get(c);s.leave(c);s.data.room=null;if(r){r.players.delete(s.id);if(!r.players.size)rooms.delete(c);else{if(r.hostId===s.id)r.hostId=[...r.players.keys()][0];roomUpdate(c)}}lobbyUpdate();s.emit('roomLeft')}
app.use(express.static(__dirname));app.get('/',(q,res)=>res.sendFile(__dirname+'/index.html'));app.get('/health',(q,res)=>res.json({ok:true,rooms:rooms.size}));app.get('/api/rooms',(q,res)=>{res.set('Cache-Control','no-store');res.json(list())});
io.on('connection',s=>{s.emit('lobbyList',list());
s.on('createRoom',d=>{leave(s);const c=code(),r={hostId:s.id,players:new Map()};r.players.set(s.id,{id:s.id,slot:0,name:String(d?.name||'Host').trim().slice(0,18)||'Host',state:{x:100,y:426,vx:0,vy:0,facing:1,health:100,ammo:30,weapon:0,anim:0,grounded:true}});rooms.set(c,r);s.join(c);s.data.room=c;s.emit('roomJoined',{code:c,slot:0,host:true,players:people(r)});lobbyUpdate()});
s.on('joinRoom',d=>{leave(s);const c=String(d?.code||'').toUpperCase().replace(/[^A-Z0-9]/g,''),r=rooms.get(c);if(!r)return s.emit('roomError','Lobby not found. Refresh and try again.');if(r.players.size>=MAX_PLAYERS)return s.emit('roomError','Lobby is full (4/4).');const used=new Set([...r.players.values()].map(p=>p.slot));let slot=0;while(used.has(slot))slot++;r.players.set(s.id,{id:s.id,slot,name:String(d?.name||`Player ${slot+1}`).trim().slice(0,18),state:{x:100+slot*45,y:426,vx:0,vy:0,facing:1,health:100,ammo:30,weapon:0,anim:0,grounded:true}});s.join(c);s.data.room=c;s.emit('roomJoined',{code:c,slot,host:false,players:people(r)});roomUpdate(c);lobbyUpdate()});
s.on('playerState',st=>{const r=rooms.get(s.data.room),p=r?.players.get(s.id);if(!p)return;const n=v=>Number.isFinite(Number(v))?Number(v):0;p.state={x:Math.max(0,Math.min(12000,n(st?.x))),y:Math.max(0,Math.min(600,n(st?.y))),vx:n(st?.vx),vy:n(st?.vy),facing:n(st?.facing)<0?-1:1,health:Math.max(0,Math.min(100,n(st?.health))),ammo:Math.max(0,Math.min(999,n(st?.ammo))),weapon:Math.max(0,Math.min(3,Math.floor(n(st?.weapon)))),anim:n(st?.anim),grounded:!!st?.grounded};s.to(s.data.room).emit('playerMoved',{id:s.id,slot:p.slot,...p.state})});
s.on('playerShot',sh=>{const r=rooms.get(s.data.room),p=r?.players.get(s.id);if(!p)return;const n=v=>Number.isFinite(Number(v))?Number(v):0;s.to(s.data.room).emit('playerShot',{slot:p.slot,x:Math.max(0,Math.min(12000,n(sh?.x))),y:Math.max(0,Math.min(600,n(sh?.y))),facing:n(sh?.facing)<0?-1:1,weapon:Math.max(0,Math.min(3,Math.floor(n(sh?.weapon))))})});s.on('leaveRoom',()=>leave(s));s.on('disconnect',()=>leave(s))});
server.listen(PORT,'0.0.0.0',()=>console.log('Zombie City listening on '+PORT));
