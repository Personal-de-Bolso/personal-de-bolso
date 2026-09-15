document.addEventListener("DOMContentLoaded",()=>{
const state={profile:{},style:"sergeant",answers:{},q:0,plan:[],workout:{ex:0,set:1,done:0},xp:0,total:0,streak:0};
const $=s=>document.querySelector(s), screens=[...document.querySelectorAll(".screen")];
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
const exercises=[
 ["Supino reto",4,8,10,90],["Puxada frontal",3,8,12,90],["Desenvolvimento com halteres",3,8,12,90],
 ["Remada baixa",3,8,12,90],["Elevação lateral",3,12,15,60],["Tríceps pulley",3,10,12,60],["Rosca direta",3,10,12,60],
 ["Agachamento ou leg press",4,8,12,120],["Mesa flexora",3,10,15,75],["Panturrilha",3,12,20,60]
];
let timerId=null,remaining=0;
function go(id){screens.forEach(s=>s.classList.toggle("active",s.id===id));window.scrollTo(0,0)}
function addBubble(t,who="bot"){const d=document.createElement("div");d.className="bubble "+who;d.textContent=t;$("#chat").appendChild(d);d.scrollIntoView({behavior:"smooth",block:"nearest"})}
function renderQuestion(){const q=questions[state.q];addBubble(q.text);const box=$("#choices");box.innerHTML="";q.choices.forEach(c=>{const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=c;b.addEventListener("click",()=>answer(c));box.appendChild(b)})}
function answer(v){const q=questions[state.q];state.answers[q.key]=v;addBubble(v,"user");$("#choices").innerHTML="";state.q++;if(v.startsWith("Sim")&&q.key==="limits"){$("#textForm").classList.remove("hidden");$("#chatInput").focus();return}nextQ()}
function nextQ(){if(state.q<questions.length)setTimeout(renderQuestion,250);else finishInterview()}
$("#textForm").addEventListener("submit",e=>{e.preventDefault();const v=$("#chatInput").value.trim();if(!v)return;state.answers.limitsDetail=v;addBubble(v,"user");$("#chatInput").value="";$("#textForm").classList.add("hidden");state.q++;nextQ()});
function finishInterview(){setTimeout(()=>{const n=state.profile.name;addBubble(`Fechou, ${n}. Agora eu já consigo montar uma primeira estratégia. Você poderá editar o treino depois — mas primeiro quero te mostrar o que eu faria.`);setTimeout(buildPlan,500)},400)}
function buildPlan(){
 const a=state.answers,p=state.profile,days=parseInt(a.days)||4;
 let count=Math.max(2,Math.min(4,days)), base=[];
 if(a.priority==="Pernas")base=[["Treino A — Superior","Supino reto · Puxada frontal · Desenvolvimento · Remada baixa"],["Treino B — Pernas","Agachamento/leg press · Mesa flexora · Panturrilha · Core"],["Treino C — Superior","Supino inclinado · Remada · Elevação lateral · Tríceps · Bíceps"],["Treino D — Pernas + Core","Leg press · Flexora · Extensora · Panturrilha · Core"]];
 else if(a.priority==="Ombros")base=[["Treino A — Push + Ombros","Supino reto · Desenvolvimento · Elevação lateral · Tríceps"],["Treino B — Pull","Puxada frontal · Remada · Rosca direta · Face pull"],["Treino C — Pernas","Agachamento/leg press · Flexora · Panturrilha · Core"],["Treino D — Ombros + Superior","Desenvolvimento · Elevação lateral · Supino inclinado · Remada · Tríceps"]];
 else base=[["Treino A — Superior","Supino reto · Puxada frontal · Desenvolvimento · Remada baixa · Tríceps"],["Treino B — Inferior","Agachamento/leg press · Mesa flexora · Panturrilha · Core"],["Treino C — Superior","Supino inclinado · Remada · Desenvolvimento · Elevação lateral · Bíceps"],["Treino D — Inferior + Core","Leg press · Flexora · Extensora · Panturrilha · Core"]];
 state.plan=base.slice(0,count).map((x,i)=>({name:x[0],items:x[1]}));
 $("#planTitle").textContent=`Beleza, ${p.name}. Temos um ponto de partida.`;
 $("#planIntro").textContent=`${a.goal} · ${a.days} · ${a.time} · prioridade: ${a.priority}.`;
 $("#planReason").textContent=`Montei uma rotina que cabe na sua disponibilidade e dá prioridade a ${a.priority.toLowerCase()}. Como sua meta é ${a.goal.toLowerCase()}, a prioridade agora é criar consistência antes de inventar complexidade.`;
 $("#planCards").innerHTML=state.plan.map((x,i)=>`<div class="plan-card"><h3>${x.name}</h3><p>${x.items}</p><div class="meta">${i+1} · progressão de carga · descanso automático</div></div>`).join("");
 go("plan");
}
function save(){try{localStorage.setItem("pb_state",JSON.stringify(state))}catch(e){}}
function load(){try{const x=JSON.parse(localStorage.getItem("pb_state"));if(x&&x.profile&&x.profile.name){Object.assign(state,x);return true}}catch(e){}return false}
function updateDash(){
 $("#dashName").textContent=state.profile.name||"Atleta";$("#xp").textContent=state.xp;$("#dashLevel").textContent="NÍVEL "+(Math.floor(state.xp/1000)+1);
 $("#streak").textContent=state.streak+" 🔥";$("#totalWorkouts").textContent=state.total;
 const target=state.plan.length||3;$("#missionText").textContent=`Complete ${target} treinos`;$("#missionProgress").textContent=`${Math.min(state.total,target)} / ${target}`;
 const today=state.plan[0]||{name:"Treino A",items:"Seu primeiro treino"};
 $("#todayName").textContent=today.name;$("#todayMeta").textContent=today.items;
 const mode=state.style==="partner"
 ? "Vamos fazer o básico muito bem e manter a consistência. Sem pressão desnecessária — o importante é aparecer e executar."
 : state.style==="sergeant"
 ? "Você disse que quer mudar. Então pare de negociar com a preguiça e faça o trabalho. Motivação ajuda, mas disciplina é o que te faz aparecer."
 : "Você quer mudar de verdade? Então pare de procurar desculpas. Levanta, começa e faz o trabalho. A conversa sobre preguiça fica para depois do treino.";
 $("#dashMessage").textContent=mode;
}
function initWorkout(){
 const x=state.workout.ex,set=state.workout.set,e=exercises[x]||exercises[0];
 $("#wName").textContent=e[0];$("#wTarget").textContent=`${e[2]}–${e[3]} repetições · descanso ${e[4]}s`;
 $("#setNo").textContent=set;$("#setTotal").textContent=e[1];$("#workoutProgress").textContent=`${x+1} / ${exercises.length}`;
 $("#wWeight").value=state.lastWeight||0;$("#wReps").value=e[2];$("#lastHint").textContent=state.lastHint||"";
 $("#nextExercise").textContent=x<exercises.length-1?exercises[x+1][0]:"Finalizar treino";
}
function startRest(){
 const e=exercises[state.workout.ex];remaining=e[4];$("#restCard").classList.remove("hidden");$("#completeSet").disabled=true;updateTimer();clearInterval(timerId);
 timerId=setInterval(()=>{remaining--;updateTimer();if(remaining<=0){clearInterval(timerId);$("#restCard").classList.add("hidden");$("#completeSet").disabled=false}},1000)
}
function updateTimer(){const m=String(Math.floor(remaining/60)).padStart(2,"0"),s=String(remaining%60).padStart(2,"0");$("#timer").textContent=m+":"+s;$("#timerFill").style.width=Math.max(0,remaining/exercises[state.workout.ex][4]*100)+"%"}
$("#begin").addEventListener("click",()=>go("profile"));
$("#profileForm").addEventListener("submit",e=>{e.preventDefault();state.profile=Object.fromEntries(new FormData(e.currentTarget));go("style")});
document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".mode").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.style=b.dataset.mode}));
$("#styleNext").addEventListener("click",()=>{go("ai");setTimeout(()=>{addBubble(`Agora eu vou te fazer algumas perguntas, ${state.profile.name}. Responda com sinceridade. Meu trabalho é montar algo que você realmente consiga manter.`);setTimeout(renderQuestion,400)},250)});
$("#acceptPlan").addEventListener("click",()=>{state.total=0;state.xp=0;state.streak=0;save();updateDash();go("dashboard")});
$("#editPlan").addEventListener("click",()=>alert("Na próxima iteração vamos transformar esta tela em um editor completo: adicionar/remover exercícios, alterar séries, repetições, carga e descanso."));
$("#startWorkout").addEventListener("click",()=>{state.workout={ex:0,set:1,done:0};state.lastHint="";go("workout");initWorkout()});
$("#backDash").addEventListener("click",()=>{clearInterval(timerId);updateDash();go("dashboard")});
$("#skipRest").addEventListener("click",()=>{clearInterval(timerId);$("#restCard").classList.add("hidden");$("#completeSet").disabled=false});
$("#completeSet").addEventListener("click",()=>{
 const w=Number($("#wWeight").value),r=Number($("#wReps").value),e=exercises[state.workout.ex];
 if(!Number.isFinite(w)||w<0||w>500||!Number.isInteger(r)||r<1||r>100){alert("Coloque uma carga e um número de repetições válidos.");return}
 state.lastWeight=w;state.lastHint=`Última: ${w} kg × ${r}`;
 state.workout.done++;
 if(state.workout.set<e[1]){state.workout.set++;startRest();initWorkout();return}
 if(state.workout.ex<exercises.length-1){state.workout.ex++;state.workout.set=1;startRest();initWorkout();return}
 clearInterval(timerId);state.xp+=400;state.total++;state.streak++;save();$("#gainXp").textContent=400;$("#finishText").textContent=state.style==="hard"?"Acabou. Você apareceu e fez o trabalho. É exatamente assim que se constrói constância.":"Treino concluído. Mais uma sessão feita e mais uma prova de que você consegue manter o processo.";go("finish")
});
$("#finishHome").addEventListener("click",()=>{updateDash();go("dashboard")});
if(load()){updateDash();go("dashboard")}

});
