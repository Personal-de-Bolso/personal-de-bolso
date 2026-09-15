document.addEventListener("DOMContentLoaded",()=>{
const state={profile:{},style:"sergeant",answers:{},q:0,plan:[],workout:{ex:0,set:1,done:0},xp:0,total:0,streak:0,history:[],week:{workouts:0}};
const $=s=>document.querySelector(s),screens=[...document.querySelectorAll(".screen")];

const questions=[
 {key:"goal",text:"Qual é seu objetivo principal agora?",choices:["Emagrecer","Ganhar massa muscular","Recomposição corporal","Força","Condicionamento"]},
 {key:"days",text:"Quantos dias por semana você consegue treinar DE VERDADE?",choices:["2 dias","3 dias","4 dias","5 dias"]},
 {key:"time",text:"Quanto tempo você normalmente tem por treino?",choices:["30 minutos","45 minutos","60 minutos","90 minutos ou mais"]},
 {key:"priority",text:"Existe algum grupo muscular que você quer priorizar?",choices:["Ombros","Peito","Costas","Pernas","Braços","Nenhum específico"]},
 {key:"place",text:"Onde você vai treinar na maior parte do tempo?",choices:["Academia completa","Academia de hotel","Casa","Varia bastante"]},
 {key:"cardio",text:"Como está seu cardio hoje?",choices:["Quase não faço","1–2 vezes por semana","3–4 vezes por semana","Faço bastante"]},
 {key:"limits",text:"Existe algum exercício, movimento ou limitação que eu precise considerar?",choices:["Não","Sim — quero explicar"]},
 {key:"consistency",text:"O que mais costuma te fazer faltar ao treino?",choices:["Preguiça / falta de vontade","Rotina / trabalho","Cansaço","Esqueço o treino","Outro"]},
 {key:"motivation",text:"E quando você estiver pensando em desistir, o que você quer que eu te lembre?",choices:["Meu objetivo físico","Minha confiança / autoestima","Minha vida social","Minha disciplina","Tudo isso"]}
];

const exerciseLibrary=[
 ["Supino reto",4,8,10,90],["Supino inclinado",3,8,12,90],["Puxada frontal",3,8,12,90],
 ["Remada baixa",3,8,12,90],["Desenvolvimento com halteres",3,8,12,90],["Elevação lateral",3,12,15,60],
 ["Face pull",3,12,15,60],["Tríceps pulley",3,10,12,60],["Rosca direta",3,10,12,60],
 ["Agachamento ou leg press",4,8,12,120],["Leg press",3,10,12,120],["Mesa flexora",3,10,15,75],
 ["Extensora",3,10,15,75],["Panturrilha",3,12,20,60],["Abdominal",3,12,20,60]
];

let timerId=null,remaining=0;

function go(id){screens.forEach(s=>s.classList.toggle("active",s.id===id));window.scrollTo(0,0)}
function addBubble(t,who="bot"){const d=document.createElement("div");d.className="bubble "+who;d.textContent=t;$("#chat").appendChild(d);d.scrollIntoView({behavior:"smooth",block:"nearest"})}
function renderQuestion(){
 const q=questions[state.q];addBubble(q.text);const box=$("#choices");box.innerHTML="";
 q.choices.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=c;b.addEventListener("click",()=>answer(c));box.appendChild(b)})
}
function answer(v){
 const q=questions[state.q];state.answers[q.key]=v;addBubble(v,"user");$("#choices").innerHTML="";state.q++;
 if(v.startsWith("Sim")&&q.key==="limits"){$("#textForm").classList.remove("hidden");$("#chatInput").focus();return}
 nextQ()
}
function nextQ(){if(state.q<questions.length)setTimeout(renderQuestion,250);else finishInterview()}
$("#textForm").addEventListener("submit",e=>{e.preventDefault();const v=$("#chatInput").value.trim();if(!v)return;state.answers.limitsDetail=v;addBubble(v,"user");$("#chatInput").value="";$("#textForm").classList.add("hidden");state.q++;nextQ()});
function finishInterview(){
 setTimeout(()=>{const n=state.profile.name;addBubble(`Fechou, ${n}. Agora eu já consigo montar uma primeira estratégia. Você poderá editar o treino antes de aceitar.`);setTimeout(buildPlan,500)},400)
}

function makeExercise(name,sets,repsMin,repsMax,rest){
 return {name,sets:Number(sets),repsMin:Number(repsMin),repsMax:Number(repsMax),rest:Number(rest)}
}
function buildPlan(){
 const a=state.answers,p=state.profile,days=parseInt(a.days)||4;
 let count=Math.max(2,Math.min(4,days)), base=[];
 if(a.priority==="Pernas")base=[
  ["Treino A — Superior",["Supino reto","Puxada frontal","Desenvolvimento com halteres","Remada baixa"]],
  ["Treino B — Pernas",["Agachamento ou leg press","Mesa flexora","Panturrilha","Abdominal"]],
  ["Treino C — Superior",["Supino inclinado","Remada baixa","Elevação lateral","Tríceps pulley","Rosca direta"]],
  ["Treino D — Pernas + Core",["Leg press","Flexora","Extensora","Panturrilha","Abdominal"]]
 ];
 else if(a.priority==="Ombros")base=[
  ["Treino A — Push + Ombros",["Supino reto","Desenvolvimento com halteres","Elevação lateral","Tríceps pulley"]],
  ["Treino B — Pull",["Puxada frontal","Remada baixa","Rosca direta","Face pull"]],
  ["Treino C — Pernas",["Agachamento ou leg press","Mesa flexora","Panturrilha","Abdominal"]],
  ["Treino D — Ombros + Superior",["Desenvolvimento com halteres","Elevação lateral","Supino inclinado","Remada baixa","Tríceps pulley"]]
 ];
 else base=[
  ["Treino A — Superior",["Supino reto","Puxada frontal","Desenvolvimento com halteres","Remada baixa","Tríceps pulley"]],
  ["Treino B — Inferior",["Agachamento ou leg press","Mesa flexora","Panturrilha","Abdominal"]],
  ["Treino C — Superior",["Supino inclinado","Remada baixa","Desenvolvimento com halteres","Elevação lateral","Rosca direta"]],
  ["Treino D — Inferior + Core",["Leg press","Flexora","Extensora","Panturrilha","Abdominal"]]
 ];
 state.plan=base.slice(0,count).map((x)=>({name:x[0],exercises:x[1].map(n=>{const f=exerciseLibrary.find(e=>e[0]===n)||[n,3,8,12,90];return makeExercise(f[0],f[1],f[2],f[3],f[4])})}));
 $("#planTitle").textContent=`Beleza, ${p.name}. Temos um ponto de partida.`;
 $("#planIntro").textContent=`${a.goal} · ${a.days} · ${a.time} · prioridade: ${a.priority}.`;
 $("#planReason").textContent=`Montei uma rotina que cabe na sua disponibilidade e dá prioridade a ${String(a.priority||"seu objetivo").toLowerCase()}. Agora você pode ajustar exercícios, séries, repetições e descanso antes de aceitar.`;
 renderPlanEditor();go("plan")
}

function renderPlanEditor(){
 const box=$("#planCards");box.innerHTML="";
 state.plan.forEach((day,di)=>{
  const card=document.createElement("div");card.className="edit-day";
  card.innerHTML=`<div class="edit-day-head"><h3 contenteditable="true" data-day-title="${di}">${day.name}</h3><button type="button" class="icon-btn" data-remove-day="${di}">EXCLUIR</button></div><div class="day-exercises"></div><button type="button" class="add-ex" data-add-ex="${di}">＋ ADICIONAR EXERCÍCIO</button>`;
  box.appendChild(card);
  const exBox=card.querySelector(".day-exercises");
  day.exercises.forEach((ex,ei)=>renderExerciseRow(exBox,ex,di,ei));
 });
 box.querySelectorAll("[data-day-title]").forEach(el=>el.addEventListener("input",()=>state.plan[Number(el.dataset.dayTitle)].name=el.textContent.trim()||`Treino ${Number(el.dataset.dayTitle)+1}`));
 box.querySelectorAll("[data-remove-day]").forEach(b=>b.addEventListener("click",()=>{if(state.plan.length<=2){alert("Mantenha pelo menos 2 treinos.");return}state.plan.splice(Number(b.dataset.removeDay),1);renderPlanEditor()}));
 box.querySelectorAll("[data-add-ex]").forEach(b=>b.addEventListener("click",()=>{state.plan[Number(b.dataset.addEx)].exercises.push(makeExercise("Supino reto",3,8,12,90));renderPlanEditor()}));
}
function renderExerciseRow(parent,ex,di,ei){
 const row=document.createElement("div");row.className="exercise-row";
 const options=exerciseLibrary.map(x=>`<option ${x[0]===ex.name?"selected":""}>${x[0]}</option>`).join("");
 row.innerHTML=`<label>Exercício<select data-field="name">${options}</select></label>
 <label>Séries<input data-field="sets" type="number" min="1" max="10" value="${ex.sets}"></label>
 <label>Reps mín.<input data-field="repsMin" type="number" min="1" max="50" value="${ex.repsMin}"></label>
 <label>Reps máx.<input data-field="repsMax" type="number" min="1" max="50" value="${ex.repsMax}"></label>
 <button type="button" class="remove-ex">×</button>`;
 parent.appendChild(row);
 row.querySelectorAll("[data-field]").forEach(el=>el.addEventListener("change",()=>{
  const f=el.dataset.field;state.plan[di].exercises[ei][f]=f==="name"?el.value:Number(el.value);
  if(f==="name"){const lib=exerciseLibrary.find(x=>x[0]===el.value);if(lib){state.plan[di].exercises[ei].sets=lib[1];state.plan[di].exercises[ei].repsMin=lib[2];state.plan[di].exercises[ei].repsMax=lib[3];state.plan[di].exercises[ei].rest=lib[4]}}
  save()
 }));
 row.querySelector(".remove-ex").addEventListener("click",()=>{state.plan[di].exercises.splice(ei,1);renderPlanEditor()});
}

function save(){try{localStorage.setItem("pb_state",JSON.stringify(state))}catch(e){}}
function load(){try{const x=JSON.parse(localStorage.getItem("pb_state"));if(x&&x.profile&&x.profile.name){Object.assign(state,x);state.history=Array.isArray(state.history)?state.history:[];state.week=state.week||{workouts:0};return true}}catch(e){}return false}

function updateDash(){
 $("#dashName").textContent=state.profile.name||"Atleta";
 $("#xp").textContent=state.xp;
 $("#dashLevel").textContent="NÍVEL "+(Math.floor(state.xp/1000)+1);
 $("#streak").textContent=state.streak+" 🔥";
 $("#totalWorkouts").textContent=state.total;
 const target=Math.max(3,state.plan.length||3);
 $("#missionText").textContent=`Complete ${target} treinos`;
 $("#missionProgress").textContent=`${Math.min(state.week.workouts,target)} / ${target}`;
 const idx=state.total%Math.max(1,state.plan.length);
 const today=state.plan[idx]||{name:"Treino A",exercises:[]};
 $("#todayName").textContent=today.name;
 $("#todayMeta").textContent=`${today.exercises.length} exercícios · execução guiada`;
 const last=state.history[state.history.length-1];
 if(last){$("#progressTitle").textContent=last.exercise;$("#progressText").textContent=`Último: ${last.weight} kg × ${last.reps} · ${last.date}. ${progressionMessage(last.exercise,last.weight,last.reps)}`}
 else{$("#progressTitle").textContent="Seu histórico começa hoje";$("#progressText").textContent="Cada série concluída vai alimentar suas próximas sugestões de carga e repetições."}
 const mode=state.style==="partner"
  ?"Vamos fazer o básico muito bem e manter a consistência. Sem pressão desnecessária — o importante é aparecer e executar."
  :state.style==="sergeant"
  ?"Você disse que quer mudar. Então pare de negociar com a preguiça e faça o trabalho. Motivação ajuda, mas disciplina é o que te faz aparecer."
  :"Você quer mudar de verdade? Então pare de procurar desculpas. Levanta, começa e faz o trabalho. A conversa sobre preguiça fica para depois do treino.";
 $("#dashMessage").textContent=mode;
}
function progressionMessage(name,weight,reps){
 const last=state.history.filter(h=>h.exercise===name).slice(-3);
 if(last.length<2)return "Na próxima sessão, vamos tentar repetir ou superar essa marca.";
 const prev=last[last.length-2];
 if(weight>prev.weight || reps>prev.reps)return "📈 Evolução detectada. Continue consolidando essa carga.";
 if(weight===prev.weight && reps===prev.reps)return "🎯 Repetiu a marca. Próximo passo: buscar 1 repetição a mais ou uma pequena progressão.";
 return "Mantenha a carga até dominar a faixa de repetições.";
}

function getTodayPlan(){return state.plan[state.total%Math.max(1,state.plan.length)]||state.plan[0]}
function initWorkout(){
 const day=getTodayPlan();
 if(!day||!day.exercises.length)return;
 const x=state.workout.ex,set=state.workout.set,e=day.exercises[x]||day.exercises[0];
 $("#wName").textContent=e.name;
 $("#wTarget").textContent=`${e.repsMin}–${e.repsMax} repetições · descanso ${e.rest}s`;
 $("#setNo").textContent=set;$("#setTotal").textContent=e.sets;
 $("#workoutProgress").textContent=`${x+1} / ${day.exercises.length}`;
 const prev=state.history.filter(h=>h.exercise===e.name).slice(-1)[0];
 $("#wWeight").value=prev?prev.weight:0;
 $("#wReps").value=prev?Math.min(e.repsMax,Math.max(e.repsMin,prev.reps)):e.repsMin;
 $("#lastHint").textContent=prev?`Último: ${prev.weight} kg × ${prev.reps}`:"";
 $("#nextExercise").textContent=x<day.exercises.length-1?day.exercises[x+1].name:"Finalizar treino";
}
function startRest(){
 const day=getTodayPlan(),e=day.exercises[state.workout.ex];
 remaining=e.rest;$("#restCard").classList.remove("hidden");$("#completeSet").disabled=true;updateTimer();clearInterval(timerId);
 timerId=setInterval(()=>{remaining--;updateTimer();if(remaining<=0){clearInterval(timerId);$("#restCard").classList.add("hidden");$("#completeSet").disabled=false}},1000)
}
function updateTimer(){
 const day=getTodayPlan(),e=day.exercises[state.workout.ex],m=String(Math.floor(remaining/60)).padStart(2,"0"),s=String(remaining%60).padStart(2,"0");
 $("#timer").textContent=m+":"+s;$("#timerFill").style.width=Math.max(0,remaining/e.rest*100)+"%"
}

$("#begin").addEventListener("click",()=>go("profile"));
$("#profileForm").addEventListener("submit",e=>{e.preventDefault();state.profile=Object.fromEntries(new FormData(e.currentTarget));go("style")});
document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".mode").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.style=b.dataset.mode}));
$("#styleNext").addEventListener("click",()=>{go("ai");if(!$("#chat").children.length)setTimeout(()=>{addBubble(`Agora eu vou te fazer algumas perguntas, ${state.profile.name}. Responda com sinceridade. Meu trabalho é montar algo que você realmente consiga manter.`);setTimeout(renderQuestion,400)},250)});
$("#acceptPlan").addEventListener("click",()=>{if(!state.plan.length)return;state.total=0;state.xp=0;state.streak=0;state.week={workouts:0};save();updateDash();go("dashboard")});
$("#addDay").addEventListener("click",()=>{const n=state.plan.length+1;state.plan.push({name:`Treino ${String.fromCharCode(64+n)}`,exercises:[makeExercise("Supino reto",3,8,12,90)]});renderPlanEditor()});
$("#startWorkout").addEventListener("click",()=>{
 const day=getTodayPlan();
 if(!day||!day.exercises.length){alert("Este treino ainda não tem exercícios.");return}
 state.currentDay=state.plan.indexOf(day);
 state.workout={ex:0,set:1,done:0,dayIndex:state.currentDay,session:[]};
 go("workout");
 initWorkout();
});
$("#backDash").addEventListener("click",()=>{clearInterval(timerId);updateDash();go("dashboard")});
$("#skipRest").addEventListener("click",()=>{clearInterval(timerId);$("#restCard").classList.add("hidden");$("#completeSet").disabled=false});

$("#completeSet").addEventListener("click",()=>{
 const day=getTodayPlan(),e=day.exercises[state.workout.ex],w=Number($("#wWeight").value),r=Number($("#wReps").value);
 if(!Number.isFinite(w)||w<0||w>500||!Number.isInteger(r)||r<1||r>100){alert("Coloque uma carga e um número de repetições válidos.");return}
 const date=new Date().toLocaleDateString("pt-BR");
 state.history.push({exercise:e.name,weight:w,reps:r,date});
 state.lastWeight=w;state.lastHint=`Última: ${w} kg × ${r}`;state.workout.done++;
 if(state.workout.set<e.sets){
   state.workout.set++;
   initWorkout();
   startRest();
   return;
 }
 if(state.workout.ex<day.exercises.length-1){
   state.workout.ex++;
   state.workout.set=1;
   initWorkout();
   startRest();
   return;
 }
 clearInterval(timerId);state.xp+=400;state.total++;state.streak++;state.week.workouts++;
 save();
 $("#gainXp").textContent=400;
 const session=state.history.slice(-day.exercises.reduce((n,x)=>n+x.sets,0));
 const best=session.reduce((a,h)=>h.weight>a.weight?h:a,{weight:0,reps:0,exercise:""});
 $("#finishProgress").innerHTML=`<b>📈 Progressão registrada</b><p>${best.exercise?`Melhor carga do treino: <strong>${best.weight} kg × ${best.reps}</strong>.`:"Treino registrado."} Na próxima sessão, o Personal vai usar esse histórico para sugerir sua progressão.</p>`;
 $("#finishText").textContent=state.style==="hard"?"Acabou. Você apareceu e fez o trabalho. É exatamente assim que se constrói constância.":state.style==="sergeant"?"Treino feito. Agora você tem um número melhor para comparar da próxima vez.":"Treino concluído. Mais uma sessão feita e mais uma prova de que você consegue manter o processo.";
 go("finish")
});
$("#finishHome").addEventListener("click",()=>{updateDash();go("dashboard")});

if(load()){
 updateDash();go("dashboard")
}
});