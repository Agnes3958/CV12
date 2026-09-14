// main.js — interactive behaviors: scroll reveal, nav highlight, timeline toggle, progress animation, award hover tooltip
(function(){
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
  
  // hero CTA 按钮平滑滚动
  document.querySelectorAll('.cta a[href^="#"]').forEach(a=>{
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
        entry.target.querySelectorAll('.bar').forEach(bar=>{
          const v = parseInt(bar.getAttribute('data-value')||'0',10);
          bar.style.setProperty('--value', v+'%');
          let child = bar.querySelector('.__fill');
          if(!child){ child = document.createElement('span'); child.className='__fill'; child.style.display='block'; child.style.height='100%'; child.style.width='0%'; child.style.background='linear-gradient(90deg,var(--pink),var(--pink-2))'; child.style.borderRadius='6px'; child.style.transition='width 900ms cubic-bezier(.2,.9,.2,1)'; bar.appendChild(child); }
          setTimeout(()=>{ child.style.width = v+'%'; },120);
        });
        io.unobserve(entry.target);
      }
    })
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

  // progress bars in skill-item
  document.querySelectorAll('.bar[data-value]').forEach(bar=>{
    if(!bar.querySelector('.__fill')){
      const v = bar.getAttribute('data-value');
      const sp = document.createElement('span'); sp.className='__fill'; sp.style.display='block'; sp.style.height='100%'; sp.style.width='0%'; sp.style.background='linear-gradient(90deg,var(--pink),var(--pink-2))'; sp.style.borderRadius='6px'; sp.style.transition='width 900ms cubic-bezier(.2,.9,.2,1)'; bar.appendChild(sp);
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

  // === Award hover tooltip: lazy-load data-img into the tooltip <img> ===
  document.querySelectorAll('.award[data-img]').forEach(a => {
    const img = a.querySelector('.award-tooltip img');
    const src = a.getAttribute('data-img');
    const tip = a.querySelector('.award-tooltip');
    if(!img || !src) return;

    const ensure = () => { if(!img.getAttribute('src')) img.src = src; };
    a.addEventListener('mouseenter', ensure);
    a.addEventListener('focus', ensure);

    a.addEventListener('click', (e)=>{
      if(window.matchMedia('(hover: none)').matches){
        e.preventDefault();
        ensure();
        if(tip) tip.classList.toggle('visible');
      }
    });
  });

})();
// 图片点击放大预览
const modal = document.querySelector('.image-modal');
const modalImg = document.querySelector('.modal-img');
const closeBtn = document.querySelector('.modal-close');

// 给页面所有图片绑定点击事件
document.querySelectorAll('img').forEach(img => {
  img.style.cursor = 'zoom-in'; // 鼠标悬浮变成放大镜图标
  img.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalImg.src = img.src;
  })
});

// 点击关闭按钮关闭弹窗
closeBtn.addEventListener('click', ()=>{
  modal.style.display = 'none';
});
// 点击弹窗黑色背景关闭
modal.addEventListener('click', (e)=>{
  if(e.target === modal) modal.style.display = 'none';
});
// 按键盘ESC键关闭
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') modal.style.display = 'none';
});
