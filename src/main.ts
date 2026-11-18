import {desk,duration} from "@shared/desk";
import {wrap} from "@shared/surface";
type S={at:number;edit:boolean;mins:number[];due:number[]};const tag=["A","B","C"];
desk<S>({name:"Clamp Clock",accent:"#ECA64C",motion:{"motif":"interval","color":"#ECA64C","shine":"#FFF0BB"},initial:()=>({at:0,edit:false,mins:[20,12,5],due:[0,0,0]}),ticking:s=>s.due.some(Boolean),
 render:(s,now)=>{const i=s.at,remaining=s.due[i]-now;const state=(j:number)=>!s.due[j]?s.mins[j]+"m set":s.due[j]<=now?"RELEASE":duration(s.due[j]-now);
 const next=[0,1,2].filter(j=>s.due[j]>0).sort((a,b)=>s.due[a]-s.due[b])[0];return {title:"Clamp "+tag[i],value:s.edit?s.mins[i]+" min":state(i),progress:s.due[i]?1-Math.max(0,remaining)/(s.mins[i]*60000):0,lines:["Clamp "+tag[i]+(s.edit?" / EDIT":" / MONITOR"),...tag.map((t,j)=>t+"   "+state(j)),next===undefined?"No timers running":"First due: "+tag[next],"Click: minutes / Start: run"]};},
 action:(s,k,now)=>{const i=s.at;if(k==="ok"&&!s.due[i])s.edit=!s.edit;
 if(k==="up"||k==="down"){const n=k==="up"?1:-1;if(s.edit)s.mins[i]=Math.max(1,Math.min(240,s.mins[i]+n));else s.at=wrap(i+n,3);}
 if(k==="start"){s.edit=false;if(!s.due[i])s.due[i]=now+s.mins[i]*60000;else if(s.due[i]<=now)s.due[i]=0;}
 if(k==="hold-start"){s.due[i]=0;s.edit=false;}}});
