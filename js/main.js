// main.js — basic interactive behaviors: scroll reveal, nav highlight, timeline toggle, progress animation
(function(){
  // helper to select
  const $ = (s, ctx=document)=> ctx.querySelector(s);
  const $$ = (s, ctx=document)=> Array.from(ctx.querySelectorAll(s));

  // smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){ el.scrollIntoView({behavior:'smooth',block:'start'}); }
    })
  });

  // IntersectionObserver for reveal
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        // animate bars inside
        entry.target.querySelectorAll('.bar').forEach(bar=>{
          const v = parseInt(bar.getAttribute('data-value')||'0',10);
          const inner = bar.querySelector('.fill');
          // if we have ::after, set width by style on a pseudo wrapper
          bar.style.setProperty('--value', v+'%');
          const pseudo = bar;
          // set width on ::after by creating a real child for compatibility
          let child = bar.querySelector('.__fill');
          if(!child){ child = document.createElement('span'); child.className='__fill'; child.style.display='block'; child.style.height='100%'; child.style.width='0%'; child.style.background='linear-gradient(90deg,var(--pink),var(--pink-2))'; child.style.borderRadius='6px'; child.style.transition='width 900ms cubic-bezier(.2,.9,.2,1)'; bar.appendChild(child); }
          setTimeout(()=>{ child.style.width = v+'%'; },120);
        });
        io.unobserve(entry.target);
      }
    })
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

  // progress bars in skill-item that use .bar[data-value]
  document.querySelectorAll('.bar[data-value]').forEach(bar=>{
    // create inner for non-pseudo animation if not using CSS ::after
    if(!bar.querySelector('.__fill')){
      const v = bar.getAttribute('data-value');
      const sp = document.createElement('span'); sp.className='__fill'; sp.style.display='block'; sp.style.height='100%'; sp.style.width='0%'; sp.style.background='linear-gradient(90deg,var(--pink),var(--pink-2))'; sp.style.borderRadius='6px'; sp.style.transition='width 900ms cubic-bezier(.2,.9,.2,1)'; bar.appendChild(sp);
      // animate when in viewport
      const obs = new IntersectionObserver((ents)=>{
        ents.forEach(en=>{ if(en.isIntersecting){ sp.style.width = v+'%'; obs.unobserve(bar); } });
      },{threshold:0.2});
      obs.observe(bar);
    }
  });

  // timeline expand/collapse
  document.querySelectorAll('.timeline-item .content').forEach(content=>{
    content.style.cursor='pointer';
    content.addEventListener('click', e=>{
      content.classList.toggle('expanded');
      if(content.classList.contains('expanded')){
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.transition = 'max-height 420ms ease';
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // nav highlight based on scroll
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navlinks = Array.from(document.querySelectorAll('.nav-links a'));
  const navIO = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        navlinks.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === '#'+id));
      }
    })
  },{threshold:0.5});
  sections.forEach(s=> navIO.observe(s));

})();
/* award tooltip lazy-load + mobile toggle */ (function(){ const awards = document.querySelectorAll('.award[data-img]'); let active = null;

awards.forEach(a=>{ const tip = a.querySelector('.award-tooltip'); const img = tip && tip.querySelector('img'); const src = a.getAttribute('data-img');
