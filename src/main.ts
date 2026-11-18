import {desk,duration} from "@shared/desk";
import {wrap,rect,type Frame} from "@shared/surface";

function clampTimers(s: S, now: number): Frame {
  const marks: Frame = [];
  s.due.forEach((due,j)=>{
    const x = 53+j*6, fraction = due?1-Math.max(0,due-now)/(s.mins[j]*60000):0;
    marks.push(rect("track"+j,x,3,4,9,"#35414AFF"));
    if (due) {
      const h = Math.min(9,Math.max(1,Math.round(9*fraction)));
      marks.push(rect("elapsed"+j,x,12-h,4,h,due<=now?"#93DEAAFF":"#E6A856FF"));
    }
  });
  marks.push(rect("selected",53+s.at*6,14,4,1,"#FFF1CFFF"));
  return marks;
}

type S={at:number;edit:boolean;mins:number[];due:number[]};const tag=["A","B","C"];
desk<S>({name:"Clamp Clock",accent:"#ECA64C",motion:{enabled:false},initial:()=>({at:0,edit:false,mins:[20,12,5],due:[0,0,0]}),ticking:s=>s.due.some(Boolean),
 render:(s,now)=>{const i=s.at;const state=(j:number)=>!s.due[j]?s.mins[j]+"m set":s.due[j]<=now?"RELEASE":duration(s.due[j]-now);
 const next=[0,1,2].filter(j=>s.due[j]>0).sort((a,b)=>s.due[a]-s.due[b])[0];return {title:"Clamp "+tag[i],value:s.edit?s.mins[i]+" min":state(i),marks:clampTimers(s,now),lines:["Clamp "+tag[i]+(s.edit?" / EDIT":" / MONITOR"),...tag.map((t,j)=>t+"   "+state(j)),next===undefined?"No timers running":"First due: "+tag[next],"Click: minutes / Start: run"]};},
 action:(s,k,now)=>{const i=s.at;if(k==="ok"&&!s.due[i])s.edit=!s.edit;
 if(k==="up"||k==="down"){const n=k==="up"?1:-1;if(s.edit)s.mins[i]=Math.max(1,Math.min(240,s.mins[i]+n));else s.at=wrap(i+n,3);}
 if(k==="start"){s.edit=false;if(!s.due[i])s.due[i]=now+s.mins[i]*60000;else if(s.due[i]<=now)s.due[i]=0;}
 if(k==="hold-start"){s.due[i]=0;s.edit=false;}}});
