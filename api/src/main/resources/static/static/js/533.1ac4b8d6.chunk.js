"use strict";(self.webpackChunkstartbuilding=self.webpackChunkstartbuilding||[]).push([[533],{3280:function(t,n,e){e(2791);n.Z=e.p+"static/media/architecture.631a4752885caafd43ea604fd6b6ff3a.svg"},5791:function(t,n,e){var i=e(184);n.Z=function(t){var n=t.value,e=t.onDismiss,r=t.background;return(0,i.jsxs)("div",{title:n,style:{margin:3,borderRadius:10,display:"flex",justifyContent:"space-around",alignItems:"center",background:null!==r&&void 0!==r?r:"#eee",color:"#303643"},children:[(0,i.jsx)("div",{style:{flex:2,margin:"5px 10px",maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:n}),(0,i.jsx)("button",{style:{border:"none",outline:"none",width:25,height:25,borderRadius:"50%",background:"#303643",color:"#eee",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 5px"},onClick:function(){return e(n)},children:(0,i.jsx)("span",{style:{transform:"translateY(-10%)"},children:"x"})})]})}},6618:function(t,n,e){e.d(n,{Z:function(){return u}});var i=e(1413),r=e(4925),o=e(2791),a=e(4483),l=e(184),d=["type","title","iconName","doThings","hasError","errorMsg","createForm","id","light","containerClassName","icon","iconPlacement","required"],u=(0,o.forwardRef)((function(t,n){var e=t.type,o=t.title,u=t.iconName,c=t.doThings,s=t.hasError,f=t.errorMsg,h=t.createForm,v=t.id,g=t.light,p=t.containerClassName,m=t.icon,x=t.iconPlacement,b=t.required,w=(0,r.Z)(t,d);return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)("div",{style:{position:"relative"},className:"sign_input-container ".concat("card-header"===e?"card-h":""," ").concat(null!==p&&void 0!==p?p:""),children:[b&&(0,l.jsx)("span",{className:"required",children:"*"}),function(){var t=c?{onChange:function(t){c(t.target.value),h&&h(t)}}:{},r=(0,i.Z)((0,i.Z)({},w),{},{ref:n});switch(e){case"phone":return(0,l.jsx)("input",(0,i.Z)((0,i.Z)((0,i.Z)({type:"tel",id:v,required:null===b||void 0===b||b},t),r),{},{ref:n}));case"submit":case"button":var d=c?{onClick:function(){return c()}}:{};return(0,l.jsxs)("button",(0,i.Z)((0,i.Z)((0,i.Z)({type:e,className:g?"submit light":"submit"},d),r),{},{children:[o,u?(0,l.jsx)("div",{style:{display:"flex",justifyContent:"flex-end",flex:1},children:(0,l.jsx)(a.G,{icon:u,className:g?"icon light":"icon"})}):null]}));case"card-header":return(0,l.jsx)("input",(0,i.Z)({id:v,type:"text",required:!0},r));default:return(0,l.jsx)("input",(0,i.Z)((0,i.Z)({type:e,id:v,required:null===b||void 0===b||b},t),r))}}(),m?(0,l.jsx)("div",{style:(0,i.Z)((0,i.Z)({},{display:"flex",justifyContent:"flex-end",flex:1,position:"absolute",zIndex:99}),"left"===x?{left:0}:{right:0}),children:m}):null,"submit"!==e&&"button"!==e?(0,l.jsx)("span",{children:o}):null]}),s&&(0,l.jsx)("p",{className:"errorMsg",children:f})]})}))},5850:function(t,n,e){e.d(n,{ow:function(){return i},Z:function(){return r},vW:function(){return o},$h:function(){return a},sC:function(){return l}});var i=function(t,n){var e,i,r,o,a,l,d,u,c,s;return null!==n&&void 0!==n&&n.parent&&null!==t&&void 0!==t&&t.parent?(null===n||void 0===n||null===(e=n.parent)||void 0===e||null===(i=e.data)||void 0===i||null===(r=i.attributes)||void 0===r?void 0:r.id)===(null===t||void 0===t||null===(o=t.data)||void 0===o||null===(a=o.attributes)||void 0===a?void 0:a.id)?-1:(null===t||void 0===t||null===(l=t.parent)||void 0===l||null===(d=l.data)||void 0===d||null===(u=d.attributes)||void 0===u?void 0:u.id)===(null===n||void 0===n||null===(c=n.data)||void 0===c||null===(s=c.attributes)||void 0===s?void 0:s.id)?1:0:null!==n&&void 0!==n&&n.parent?-1:null!==t&&void 0!==t&&t.parent?1:0},r={name:"",attributes:{id:"8b8ed3c02c734fd0b712f903c0bcd920",description:"New project",nodeType:"empty"},children:[]},o=function(){return new Promise((function(t,n){var e=window.navigator.geolocation;e?e.getCurrentPosition((function(n){return t(n)}),(function(t){return n(t)})):n("Geolocation is not supported on this browser")}))},a=function(t,n){var e=document.createElement("img");e.src=t;var i=document.createElement("canvas"),r=i.getContext("2d");return i.width=e.width,i.height=e.height,e.onload=function(){if(r){r.drawImage(e,0,0,e.width,e.height);for(var t=r.getImageData(0,0,i.width,i.height),o=t.data,a=n.r,l=n.g,d=n.b,u=n.a,c=n.text,s=n.x,f=n.y,h=n.font,v=0,g=o.length;v<g;v+=4)o[v]=a,o[v+1]=l,o[v+2]=d,u&&(o[v+3]=u);r.putImageData(t,0,0),c&&(r.fillStyle=u?"rgba(".concat(a,",").concat(l,",").concat(d,", ").concat(u,")"):"rgb(".concat(a,",").concat(l,",").concat(d,")"),r.font=null!==h&&void 0!==h?h:"20px bolder",r.textAlign="center",r.fillText(c,null!==s&&void 0!==s?s:i.width/2,null!==f&&void 0!==f?f:i.height/2.5))}},i},l={isEmail:function(t){return/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(t)},isValidPassword:function(t){return/^(?=.{8,})(?=.*[^A-Za-z0-9])/g.test(t)}}}}]);
//# sourceMappingURL=533.1ac4b8d6.chunk.js.map