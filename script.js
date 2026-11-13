let grade='11';
const dialog=document.querySelector('dialog');
const free='<div class="modal-footer"><a class="button primary" target="_blank" rel="noopener" href="https://lk.smitup.ru/c/istoriia-default-1755094009mO">Попробовать бесплатные уроки ↗</a></div>';
const contents={
  teacher:()=>`<span class="modal-eyebrow">ТВОЙ ПРЕПОДАВАТЕЛЬ</span><h2 id="dialog-title">Знакомься,<br>Эля Смит.</h2><p>Преподаватель истории в СМИТАП. Окончила исторический факультет СПбГУ с красным дипломом, получила дополнительное образование в области искусствоведения.</p><p>На занятиях — история через объяснения, визуальные материалы, практику и системное повторение.</p>${free}`,
  course:()=>`<span class="modal-eyebrow">ЕГЭ ПО ИСТОРИИ · ${grade} КЛАСС</span><h2 id="dialog-title">Разбираемся.<br>Практикуемся.<br>Повторяем.</h2><ul><li>Вебинары с Элей — теория, практика и записи для повторения.</li><li>Задания в формате ЕГЭ с обратной связью по критериям экзамена.</li><li>Рабочие тетради, карты и дополнительные материалы.</li><li>Тесты-повторения, зачёты и поддержка наставника.</li></ul>${free}`,
  plans:()=>`<span class="modal-eyebrow">ЕГЭ ПО ИСТОРИИ · ${grade} КЛАСС</span><h2 id="dialog-title">Твой формат<br>подготовки.</h2>${grade==='11'?'<div class="plan"><h3>Годовой курс · Стандарт</h3><strong>4 290 ₽ / мес.</strong><p>Группа до 30 человек, занятия с Элей, материалы, личный наставник, пробники и зачёты.</p></div><div class="plan"><h3>Годовой курс · Плюс</h3><strong>5 590 ₽ / мес.</strong><p>Группа до 15 человек, всё из «Стандарта», индивидуальные домашние задания и еженедельные созвоны с наставником.</p></div>':'<div class="plan"><h3>Годовой курс · 10 класс</h3><strong>3 790 ₽ / мес.</strong><p>Занятия с Элей, конспекты, личный наставник, регулярная практика и пробники.</p></div>'}<p class="fine">Условия из брифа. Актуальную стоимость и доступность курса уточняйте на платформе СМИТАП.</p><a class="button primary" href="https://lk.smitup.ru/" target="_blank" rel="noopener">Перейти на платформу ↗</a>`
};
document.querySelectorAll('[data-modal]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#dialog-content').innerHTML=contents[button.dataset.modal]();dialog.showModal();}));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
document.querySelectorAll('[data-grade]').forEach(button=>button.addEventListener('click',()=>{grade=button.dataset.grade;document.querySelectorAll('[data-grade]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));

const teachers=[
 {id:'kirill',name:'Кирилл Нэш',subject:'Математика'},
 {id:'nelya',name:'Неля Лотман',subject:'Русский язык'},
 {id:'elya',name:'Эля Смит',subject:'История'},
 {id:'artem',name:'Артём Вольт',subject:'Физика'},
 {id:'regina',name:'Регина Брайт',subject:'Английский язык'},
 {id:'misha',name:'Миша Гис',subject:'Биология'},
 {id:'vilya',name:'Виля Брик',subject:'Литература'},
 {id:'danya',name:'Даня Байт',subject:'Информатика'},
 {id:'lana',name:'Лана Сильвер',subject:'Химия'},
 {id:'olya',name:'Оля Вебер',subject:'Обществознание'}
];
const ribbon=document.querySelector('.teacher-ribbon');
const track=document.querySelector('.ribbon-track');
const group=track.querySelector('.ribbon-group');
let dragged=false;
track.addEventListener('click',event=>{
 if(dragged)return;
 const button=event.target.closest('[data-person]');if(!button)return;
 const teacher=teachers.find(t=>t.id===button.dataset.person);
 if(teacher.id==='elya') return;
 document.querySelector('#dialog-content').innerHTML=teacher.id==='elya'?contents.teacher():`<span class="modal-eyebrow">ПРЕПОДАВАТЕЛЬ СМИТАП · ${teacher.subject.toUpperCase()}</span><h2 id="dialog-title">${teacher.name}</h2><p>Познакомься с преподавателем и его курсом на сайте СМИТАП.</p><a class="button primary" href="https://smitup.ru/" target="_blank" rel="noopener">Открыть сайт СМИТАП ↗</a>`;
 dialog.showModal();
});
const toggle=document.querySelector('.ribbon-toggle');
toggle.addEventListener('click',()=>{const paused=ribbon.classList.toggle('is-paused');toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Продолжить движение ленты':'Приостановить движение ленты');toggle.querySelector('.pause-icon').textContent=paused?'▷':'Ⅱ';toggle.querySelector('.pause-label').textContent=paused?'Продолжить движение':'Остановить на минутку';toggle.blur();});
// Curved ribbon follows the measured top and bottom edges of the video reference.
const cards=[...group.querySelectorAll('.teacher-photo')];
ribbon.classList.add('ribbon--curved');
let phase=0,lastFrame=0,ribbonWidth=0,scale=1,dragging=false,lastPointer=0,hovering=false;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function resizeRibbon(){ribbonWidth=ribbon.clientWidth;scale=ribbonWidth/1440;renderRibbon();}
function quadTransform(points,width,height){
 const [p0,p1,p2,p3]=points;
 const dx1=p1.x-p2.x,dx2=p3.x-p2.x,dx3=p0.x-p1.x+p2.x-p3.x;
 const dy1=p1.y-p2.y,dy2=p3.y-p2.y,dy3=p0.y-p1.y+p2.y-p3.y;
 const denominator=dx1*dy2-dx2*dy1;
 const g=(dx3*dy2-dx2*dy3)/denominator;
 const h=(dx1*dy3-dx3*dy1)/denominator;
 const a=p1.x-p0.x+g*p1.x,b=p3.x-p0.x+h*p3.x;
 const d=p1.y-p0.y+g*p1.y,e=p3.y-p0.y+h*p3.y;
 return `matrix3d(${a/width},${d/width},0,${g/width},${b/height},${e/height},0,${h/height},0,0,1,0,${p0.x},${p0.y},0,1)`;
}
function renderRibbon(){
 const mobile=ribbonWidth<768;
 // On narrow screens preserve readable faces rather than scaling the entire row down.
 const sizing=mobile?0.79:scale;
 const cardWidth=175*sizing,cardHeight=185*sizing,step=201*sizing,cycle=step*cards.length;
 const half=ribbonWidth/2;
 const virtualHalf=Math.max(half,540);
 const baseY=mobile?135:185*scale;
 const point=(u,edge)=>{
  const x=half+u+0.40*u*u*u/(virtualHalf*virtualHalf);
  const t=(x-half)/virtualHalf;
  const halfHeight=cardHeight/2*(1+0.95*t*t);
  // Rotate the complete ribbon surface, including each card's vertical edges.
  // The reference's bottom corners sit ~0.145 card-heights to the right.
  const angle=8.3*Math.PI/180;
  const dx=x-half,dy=edge*halfHeight;
  return {
   x:half+dx*Math.cos(angle)+dy*Math.sin(angle),
   y:baseY-dx*Math.sin(angle)+dy*Math.cos(angle)
  };
 };
 cards.forEach((card,index)=>{
  const u=(((index-2)*step-phase+cycle/2)%cycle+cycle)%cycle-cycle/2;
  const points=[point(u-cardWidth/2,-1),point(u+cardWidth/2,-1),point(u+cardWidth/2,1),point(u-cardWidth/2,1)];
  card.style.width=`${cardWidth}px`;card.style.height=`${cardHeight}px`;
  card.style.transform=quadTransform(points,cardWidth,cardHeight);
  const visible=points[1].x>-50&&points[0].x<ribbonWidth+50;
  card.style.visibility=visible?'visible':'hidden';
  card.tabIndex=visible?0:-1;
  card.title=card.getAttribute('aria-label').replace('. Познакомиться','');
 });
}
function tick(timestamp){
 const dt=lastFrame?Math.min(timestamp-lastFrame,60):0;lastFrame=timestamp;
 const focusedCard=document.activeElement?.classList.contains('teacher-photo');
 if(!reducedMotion.matches&&!ribbon.classList.contains('is-paused')&&!dragging&&!hovering&&!focusedCard&&!document.hidden){
  phase+=dt*0.044*(ribbonWidth<768?0.79:scale);
 }
 renderRibbon();requestAnimationFrame(tick);
}
cards.forEach(card=>{
 card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')hovering=true;});
 card.addEventListener('pointerleave',()=>hovering=false);
});
ribbon.addEventListener('pointerdown',event=>{
 if(event.button!==0||event.target.closest('.ribbon-toggle'))return;
 dragging=true;dragged=false;lastPointer=event.clientX;
 const move=e=>{const distance=e.clientX-lastPointer;if(Math.abs(distance)>2)dragged=true;phase-=distance;lastPointer=e.clientX;renderRibbon();};
 const end=()=>{dragging=false;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end);setTimeout(()=>dragged=false,0);};
 window.addEventListener('pointermove',move);window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
});
new ResizeObserver(resizeRibbon).observe(ribbon);
resizeRibbon();requestAnimationFrame(tick);
