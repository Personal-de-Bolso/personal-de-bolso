const state={profile:{},answers:{},q:0};
const $=s=>document.querySelector(s); const screens=[...document.querySelectorAll('.screen')];
function go(id){screens.forEach(x=>x.classList.toggle('active',x.id===id));window.scrollTo(0,0)}
const questions=[
 {key:'goal',text:'Qual é o seu principal objetivo agora?',choices:['Emagrecer','Ganhar massa muscular','Recomposição corporal','Força','Condicionamento']},
 {key:'days',text:'Quantos dias por semana você consegue treinar de verdade?',choices:['2 dias','3 dias','4 dias','5 dias','6 dias']},
 {key:'time',text:'Quanto tempo você normalmente tem por treino?',choices:['30 minutos','45 minutos','60 minutos','90 minutos ou mais']},
 {key:'priority',text:'Tem algum grupo muscular que você quer priorizar?',choices:['Ombros','Peito','Costas','Pernas','Braços','Nenhum específico']},
 {key:'place',text:'Onde você normalmente treina?',choices:['Academia completa','Academia de hotel','Casa','Varia bastante']},
 {key:'likes',text:'Agora uma importante: existe algum exercício que você odeia ou não quer fazer?',choices:['Não','Sim — quero explicar']}
];
function addBubble(text,who='bot'){const d=document.createElement('div');d.className='bubble '+who;d.textContent=text;$('#chat').appendChild(d);d.scrollIntoView({behavior:'smooth',block:'nearest'})}
function renderQuestion(){const q=questions[state.q];addBubble(q.text);const box=$('#choices');box.innerHTML='';q.choices.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='choice';b.textContent=c;b.addEventListener('click',()=>answer(c));box.appendChild(b)});}
function answer(value){const q=questions[state.q];state.answers[q.key]=value;addBubble(value,'user');$('#choices').innerHTML='';state.q++;if(q.key==='likes'&&value.startsWith('Sim')){$('#textForm').classList.remove('hidden');$('#chatInput').focus();return}nextQuestion()}
function nextQuestion(){if(state.q<questions.length){setTimeout(renderQuestion,250)}else finish()}
$('#textForm').addEventListener('submit',e=>{e.preventDefault();const v=$('#chatInput').value.trim();if(!v)return;state.answers.likesDetail=v;addBubble(v,'user');$('#textForm').classList.add('hidden');state.q++;finish()});
function finish(){setTimeout(()=>{addBubble('Perfeito. Já tenho o suficiente para montar uma primeira versão do seu treino. Depois você poderá editar tudo.');setTimeout(buildPlan,450)},400)}
function buildPlan(){const p=state.profile,a=state.answers;$('#planTitle').textContent=`Beleza, ${p.name}. Vamos montar algo que você consiga sustentar.`;$('#planIntro').textContent=`Objetivo: ${a.goal}. ${a.days}, com treinos de ${a.time}. Prioridade: ${a.priority}.`;
const cards=[['Treino A — Superior','Supino reto · Remada · Desenvolvimento · Puxada · Elevação lateral','Foco: base + hipertrofia'],['Treino B — Inferior','Agachamento · Leg press · Mesa flexora · Panturrilha · Abdômen','Foco: pernas + gasto energético'],['Treino C — Superior','Supino inclinado · Remada baixa · Desenvolvimento · Puxada · Tríceps','Foco: progressão de cargas'],['Treino D — Inferior + Core','Leg press · Cadeira extensora · Flexora · Panturrilha · Core','Foco: volume controlado']];
const n=Math.max(2,Math.min(4,parseInt(a.days)||4));$('#planCards').innerHTML=cards.slice(0,n).map(x=>`<div class="plan-card"><h3>${x[0]}</h3><p>${x[1]}</p><div class="meta">${x[2]} · descanso automático</div></div>`).join('');go('plan')}
$('#profileForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);state.profile=Object.fromEntries(fd.entries());go('ai');setTimeout(()=>{addBubble(`Fala, ${state.profile.name}. Agora começa a parte importante. Eu não vou te entregar um treino genérico de internet.`);setTimeout(renderQuestion,450)},250)});
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$('#restart').addEventListener('click',()=>{state.q=0;state.answers={};$('#chat').innerHTML='';go('ai');renderQuestion()});
$('#acceptPlan').addEventListener('click',()=>alert('Próxima etapa da V1: transformar este plano em um treino executável, com séries, repetições, cargas, timer de descanso, XP e missões.'));
