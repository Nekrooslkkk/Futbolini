"use strict";
/* ============================================================
   FUTBOLINI · plop-perfil.js — 7.9089 · el perfil del DT como una red social de verdad (Twitter 2009)
   Pedido del autor: "variar de cuenta más intuitivo, tipo perfil real, que desde tu perfil puedas cambiarte
   el nombre como en una red social, y que tus me gusta salgan como el Twitter antiguo".
   - Selector de cuenta: dos "sesiones" con avatar y @ (cuenta oficial del club / tu cuenta personal).
   - Perfil personal: cabecera con retrato, nombre visible, @usuario, bio, ciudad, "se unió en", y los contadores
     (plops · seguidores · favoritos). "Editar perfil" cambia nombre visible, usuario y bio ahí mismo.
     El nombre visible es de PLOP (E.perfil.plopNombre): no cambia tu nombre real en la vida del juego.
   - "Me gusta" pasa a ser ★ Favoritos, como en 2009 (la lógica de likes no se toca: solo el rótulo).
   La lógica de publicar, seguidores y verificado sigue en ui.js / redes.js; acá solo va la cara.
   ============================================================ */
function plopNombreVisible(){ const P=(E&&E.perfil)||{}; return P.plopNombre||P.nombre||"DT"; }
function plopBio(){ const P=(E&&E.perfil)||{}; return P.plopBio||""; }
function _plopAnioAlta(){ const P=(E&&E.perfil)||{}; return P.plopDesde||(E.carrera&&E.carrera.desde)||E.anio; }
function _plopCiudad(){ const c=(typeof infoClub==="function"&&infoClub(E.club))||{}; return c.ciudad||""; }
function _plopMisPosts(){ const h=(typeof handleDT==="function")?handleDT():""; return (E.timeline||[]).filter(t=>t&&t.autor===h).length; }

function guardarPerfilPlop(nombre,usuario,bio){
  E.perfil=E.perfil||{};
  const lim=(typeof textoLimpio==="function")?textoLimpio:((s,n)=>String(s||"").trim().slice(0,n));
  const n=lim(nombre,30);
  let u=String(usuario||"").trim().replace(/\s/g,"").replace(/[<>"'`]/g,"").replace(/^@*/,"@").slice(0,16);
  if(u.length<2) return "El usuario necesita al menos una letra después de la @.";
  if(n) E.perfil.plopNombre=n;
  E.perfil.plopUser=u;
  E.perfil.plopBio=lim(bio,160);
  if(!E.perfil.plopDesde) E.perfil.plopDesde=_plopAnioAlta();
  if(typeof guardar==="function") guardar();
  return null;
}
function cabeceraPerfilPlop(){
  const box=el("div","plopp");
  const verif=!!(E.plopVerif&&typeof handleDT==="function"&&E.plopVerif[handleDT()]);
  const av=el("div","plopp-av");
  if(typeof retratoSVG==="function"){ try{ av.innerHTML=retratoSVG({}); }catch(e){ av.textContent="🙂"; } } else av.textContent="🙂";
  box.appendChild(av);
  const datos=el("div","plopp-datos");
  datos.innerHTML="<div class='plopp-nom'>"+escHtml(plopNombreVisible())+(verif?" <span class='plopp-ver' title='Verificado'>✔</span>":"")+"</div>"+
    "<div class='plopp-user'>"+escHtml(typeof handleDT==="function"?handleDT():"@dt")+"</div>"+
    (plopBio()?"<div class='plopp-bio'>"+escHtml(plopBio())+"</div>":"<div class='plopp-bio mini'>Sin bio todavía. Los hinchas leen esto antes que tus declaraciones.</div>")+
    "<div class='plopp-meta'>"+(_plopCiudad()?"📍 "+escHtml(_plopCiudad())+" · ":"")+"⚽ DT de "+escHtml(E.clubNombre||"")+" · se unió en "+_plopAnioAlta()+"</div>";
  box.appendChild(datos);
  const cont=el("div","plopp-cont");
  const nFav=(E.plopLikes||[]).length;
  [["Plops",_plopMisPosts()],["Seguidores",(E.seguidores||0).toLocaleString("es-CL")],["Favoritos",nFav]].forEach(([k,v])=>cont.appendChild(el("div","plopp-c","<b>"+v+"</b><span>"+k+"</span>")));
  box.appendChild(cont);
  const bEd=el("button","btn-aqua chico gris plopp-editar","Editar perfil"); bEd.type="button";
  bEd.onclick=()=>{ box.replaceWith(formPerfilPlop()); };
  box.appendChild(bEd);
  return box;
}
function formPerfilPlop(){
  const f=el("div","plopp plopp-form");
  f.appendChild(el("div","plopp-nom","Editar perfil"));
  const campo=(lb,val,max,ph,area)=>{ const w=el("label","plopp-campo"); w.appendChild(el("span",null,lb));
    const i=el(area?"textarea":"input"); if(!area) i.type="text"; i.maxLength=max; i.value=val||""; i.placeholder=ph; if(area) i.rows=2; w.appendChild(i); f.appendChild(w); return i; };
  const iN=campo("Nombre",plopNombreVisible(),30,"Cómo te ven en PLOP");
  const iU=campo("Usuario",(typeof handleDT==="function")?handleDT():"@dt",16,"@usuario");
  const iB=campo("Bio",plopBio(),160,"Una línea: quién eres (160)",true);
  f.appendChild(el("p","mini","El nombre de PLOP es tuyo para jugar: no cambia tu nombre real en la vida del DT. Cambiar el usuario hace que tus menciones viejas queden con el @ anterior, como en cualquier red."));
  const fila=el("div","plopp-bots");
  const bG=el("button","btn-aqua chico verde","Guardar"); bG.type="button";
  const bC=el("button","btn-aqua chico gris","Cancelar"); bC.type="button";
  bG.onclick=()=>{ const err=guardarPerfilPlop(iN.value,iU.value,iB.value); if(err){ aviso(err); return; } aviso("Perfil actualizado · ahora firmas como "+handleDT()); irA("redes"); };
  bC.onclick=()=>irA("redes");
  fila.appendChild(bG); fila.appendChild(bC); f.appendChild(fila);
  return f;
}
/* selector de cuenta: dos sesiones con avatar y @ */
function selectorCuentasPlop(root){
  const nav=root.querySelector(".plopt-nav"); if(!nav) return;
  const bs=[].slice.call(nav.querySelectorAll("button")).filter(b=>/Cuenta oficial del club|Perfil personal del DT/.test(b.textContent));
  if(bs.length<2) return;
  const sel=el("div","plopp-sesiones");
  sel.appendChild(el("span","mini","Estás como:"));
  bs.forEach(b=>{
    const club=/Cuenta oficial/.test(b.textContent);
    const h=club?((typeof handleClub==="function")?handleClub():"@club"):((typeof handleDT==="function")?handleDT():"@dt");
    const ini=club?(E.clubNombre||"CL"):plopNombreVisible();
    b.innerHTML=(typeof _plopAvatar==="function"?_plopAvatar(ini):"")+"<span><b>"+escHtml(club?(E.clubNombre||"Club"):plopNombreVisible())+"</b><small>"+escHtml(h)+"</small></span>";
    b.classList.add("plopp-sesion");
    sel.appendChild(b);
  });
  root.querySelector(".plopt-top").insertAdjacentElement("afterend",sel);
}
function plopPerfilReal(){
  const root=document.querySelector("#vista .plopt"); if(!root||root.querySelector(".plopp-sesiones")) return false;
  selectorCuentasPlop(root);
  /* la caja vieja "Tu cuenta" sobra: ahora se edita desde el perfil */
  root.querySelectorAll(".plopt-lado h3.sub").forEach(h=>{ if(/^Tu cuenta/.test(h.textContent)){ let n=h.nextElementSibling; for(let i=0;i<2&&n;i++){ const x=n.nextElementSibling; if(n.tagName==="INPUT"||(n.tagName==="BUTTON"&&/Guardar usuario/.test(n.textContent))) n.remove(); n=x; } h.remove(); } });
  if(typeof REDES_PEST!=="undefined"&&REDES_PEST!=="club"){
    const main=root.querySelector(".plopt-main"); if(main) main.insertBefore(cabeceraPerfilPlop(),main.firstChild);
    const chico=root.querySelector(".plopt-lado .plopt-perfil"); if(chico) chico.remove();   /* la cabecera ya dice quién eres */
  }
  /* ★ Favoritos como en 2009 (solo rótulos) */
  root.querySelectorAll("button").forEach(b=>{
    const t=b.textContent.trim();
    if(t==="Me gusta") b.textContent="★ Favoritos";
    else if(t==="♡ Me gusta") b.textContent="☆ Favorito";
    else if(t==="❤ Te gusta") b.textContent="★ Favorito";
  });
  root.querySelectorAll(".panel > .cab span").forEach(s=>{ if(/^Tus Me gusta/.test(s.textContent)) s.textContent=s.textContent.replace(/^Tus Me gusta/,"Tus favoritos"); });
  return true;
}
(function(){
  const o=window.vistaRedes; if(typeof o!=="function"||o._perfil) return;
  const w=function(){ const r=o.apply(this,arguments); try{ plopPerfilReal(); }catch(e){ console.error("plop perfil:",e); } return r; };
  Object.keys(o).forEach(k=>w[k]=o[k]); w._perfil=true; w._orig=o; window.vistaRedes=w;
})();
if(typeof document!=="undefined"&&!document.getElementById("css-plop-perfil")){
  const st=document.createElement("style"); st.id="css-plop-perfil";
  st.textContent=
    ".plopp{position:relative;display:grid;grid-template-columns:96px 1fr;gap:4px 14px;padding:14px;margin:0 0 12px;background:#fff;border:1px solid #e1e8ed;border-radius:6px;color:#333;font-family:'Lucida Grande','Lucida Sans Unicode',Tahoma,Arial,sans-serif}"+
    ".plopp-av{grid-row:span 2;width:96px;height:96px;border:1px solid #ccd6dd;border-radius:4px;overflow:hidden;background:#e8f4fa;display:grid;place-items:center;font-size:42px}.plopp-av svg{width:100%;height:100%}"+
    ".plopp-nom{font:700 22px/1.2 'Lucida Grande',Tahoma,Arial,sans-serif;color:#333}.plopp-ver{color:#1da1f2;font-size:16px}"+
    ".plopp-user{color:#8899a6;font-size:14px}.plopp-bio{margin:6px 0 2px;font-size:14px;color:#333}.plopp-meta{font-size:12.5px;color:#8899a6}"+
    ".plopp-cont{grid-column:1/-1;display:flex;gap:22px;border-top:1px solid #e1e8ed;padding-top:8px;margin-top:6px}"+
    ".plopp-c{display:flex;flex-direction:column}.plopp-c b{font-size:17px;color:#0084b4}.plopp-c span{font-size:11px;color:#8899a6;text-transform:uppercase;letter-spacing:.4px}"+
    ".plopp-editar{position:absolute;right:12px;top:12px}"+
    ".plopp-form{display:block}.plopp-campo{display:grid;grid-template-columns:90px 1fr;gap:8px;align-items:center;margin:8px 0}.plopp-campo span{font-weight:700;font-size:13px;color:#555}"+
    ".plopp-campo input,.plopp-campo textarea{width:100%;padding:6px 8px;border:1px solid #ccd6dd;border-radius:3px;font:14px 'Lucida Grande',Tahoma,sans-serif}.plopp-bots{display:flex;gap:6px}"+
    ".plopp-sesiones{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px}.plopp-sesiones .mini{color:#fff;text-shadow:0 1px 2px rgba(0,60,120,.6)}"+
    ".plopt .plopp-sesion{display:flex !important;align-items:center;gap:8px;padding:4px 12px 4px 4px !important;border-radius:22px !important;text-align:left}"+
    ".plopt .plopp-sesion .plopt-av{width:28px;height:28px;font-size:11px;border-radius:50%}.plopp-sesion span{display:flex;flex-direction:column;line-height:1.15}.plopp-sesion small{font-weight:400;color:#8899a6;font-size:11px}"+
    ".plopt .plopp-sesion[aria-pressed=true]{box-shadow:0 0 0 2px #1da1f2 !important}"+
    "@media (max-width:600px){.plopp{grid-template-columns:64px 1fr}.plopp-av{width:64px;height:64px}.plopp-nom{font-size:18px}.plopp-editar{position:static;grid-column:1/-1}}";
  document.head.appendChild(st);
}
