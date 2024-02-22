(window.webpackJsonpNuxtCustomElementsNcComponents=window.webpackJsonpNuxtCustomElementsNcComponents||[]).push([[88],{1308:function(e,t,s){var a=s(1347);a.__esModule&&(a=a.default),"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);(0,s(178).default)("83e482b2",a,!0,{sourceMap:!1})},1346:function(e,t,s){"use strict";s(1308)},1347:function(e,t,s){var a=s(177)(!1);a.push([e.i,".label[data-v-4a728294]{border-radius:25px}",""]),e.exports=a},175:function(e,t,s){"use strict";s.r(t);s(228),s(201),s(257),s(199),s(219);var a=s(365),c={name:"SetListCheckboxCell",props:{value:String,column:Object,values:Array},data:function(){},computed:{colors:function(){return this.$store.state.settings.darkTheme?a.a.dark:a.a.light},localState:{get:function(){return this.value&&this.value.split(",")||[]},set:function(e){this.$emit("input",e.join(",")),this.$emit("update")}},setValues:function(){return this.column&&this.column.dtxp?this.column.dtxp.split(",").map((function(e){return e.replace(/^'|'$/g,"")})):this.values||[]},parentListeners:function(){var e={};return this.$listeners.blur&&(e.blur=this.$listeners.blur),this.$listeners.focus&&(e.focus=this.$listeners.focus),e}},mounted:function(){this.$el.focus();var e=document.createEvent("MouseEvents");e.initMouseEvent("mousedown",!0,!0,window),this.$el.dispatchEvent(e)}},n=(s(1346),s(191)),l=Object(n.a)(c,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"d-flex align-center"},[s("div",e._l(e.setValues,(function(t,a){return s("div",{key:t},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.localState,expression:"localState"}],staticClass:"orange--text",attrs:{id:"key-check-box-"+t,type:"checkbox"},domProps:{value:t,checked:Array.isArray(e.localState)?e._i(e.localState,t)>-1:e.localState},on:{change:function(s){var a=e.localState,c=s.target,n=!!c.checked;if(Array.isArray(a)){var l=t,f=e._i(a,l);c.checked?f<0&&(e.localState=a.concat([l])):f>-1&&(e.localState=a.slice(0,f).concat(a.slice(f+1)))}else e.localState=n}}}),e._v(" "),s("label",{staticClass:"py-1 px-3 d-inline-block my-1 label",style:{background:e.colors[a%e.colors.length]},attrs:{for:"key-check-box-"+t}},[e._v(e._s(t))])])})),0)])}),[],!1,null,"4a728294",null);t.default=l.exports},365:function(e,t,s){"use strict";s.d(t,"b",(function(){return a})),t.a={light:["#ffdce5","#fee2d5","#ffeab6","#d1f7c4","#ede2fe","#eee","#cfdffe","#d0f1fd","#c2f5e8","#ffdaf6"],dark:["#f82b6099","#ff6f2c99","#fcb40099","#20c93399","#8b46ff99","#666","#2d7ff999","#18bfff99","#20d9d299","#ff08c299"]};var a={light:["#cfdffe","#d0f1fd","#c2f5e8","#ffdaf6","#ffdce5","#fee2d5","#ffeab6","#d1f7c4","#ede2fe","#eeeeee"],dark:["#2d7ff999","#18bfff99","#20d9d299","#ff08c299","#f82b6099","#ff6f2c99","#fcb40099","#20c93399","#8b46ff99","#666"]};
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */}}]);