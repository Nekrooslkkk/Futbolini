/* FUTBOLINI · test/peer_falso.js (7.9116) · un "PeerJS" de mentira para probar las salas de duelo sin internet:
   las dos copias del juego (iframes de test/duelo.sh) se encuentran por un buzón que vive en la página de arriba. */
(function(){
  var B=function(){ try{ return window.parent&&window.parent.__buzon; }catch(e){ return null; } };
  function Em(){ this._h={}; }
  Em.prototype.on=function(ev,f){ (this._h[ev]=this._h[ev]||[]).push(f); return this; };
  Em.prototype._emit=function(ev,a){ (this._h[ev]||[]).slice().forEach(function(f){ try{ f(a); }catch(e){ console.error(e); } }); };
  function Conn(){ Em.call(this); this.otro=null; this.open=false; }
  Conn.prototype=Object.create(Em.prototype);
  Conn.prototype.send=function(d){ var o=this.otro; if(!this.open||!o) return; setTimeout(function(){ o._emit("data",d); },5); };
  Conn.prototype.close=function(){ if(!this.open) return; this.open=false; var s=this, o=this.otro; setTimeout(function(){ s._emit("close"); },1);
    if(o&&o.open){ o.open=false; setTimeout(function(){ o._emit("close"); },5); } };
  function Peer(id){ Em.call(this); if(id==null||typeof id==="object") id="anon-"+Math.random().toString(36).slice(2); this.id=id; var s=this;
    setTimeout(function(){ var b=B(); if(!b){ s._emit("error",{type:"network"}); return; }
      if(b.peers[id]&&!b.peers[id].destroyed){ s._emit("error",{type:"unavailable-id"}); return; } b.peers[id]=s; s._emit("open",id); },10); }
  Peer.prototype=Object.create(Em.prototype);
  Peer.prototype.connect=function(to){ var c=new Conn(), s=this, b=B(), dest=b&&b.peers[to];
    setTimeout(function(){ if(!dest||dest.destroyed){ s._emit("error",{type:"peer-unavailable"}); return; }
      var c2=new Conn(); c.otro=c2; c2.otro=c; dest._emit("connection",c2);
      setTimeout(function(){ c.open=true; c2.open=true; c2._emit("open"); c._emit("open"); },5); },10);
    return c; };
  Peer.prototype.destroy=function(){ this.destroyed=true; var b=B(); if(b&&b.peers[this.id]===this) delete b.peers[this.id]; };
  Peer.prototype.reconnect=function(){};
  window.Peer=Peer; window.__peerFalso=true;
})();
