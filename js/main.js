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

// 只有弹窗元素都存在，才绑定事件
if(modal && modalImg && closeBtn){
  document.querySelectorAll('.preview-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = img.src;
    })
  });
  closeBtn.addEventListener('click', ()=>{ modal.style.display = 'none'; });
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.style.display = 'none'; });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') modal.style.display = 'none'; });
}

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
// ========== 全部动画代码，等待DOM加载完成 ==========
document.addEventListener('DOMContentLoaded', function(){
  // 粒子背景
  const canvas = document.createElement('canvas');
  canvas.id = "particleCanvas";
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], mouseX = null, mouseY = null;

  function resizeCanvas(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle{
    constructor(){
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.radius = Math.random() * 1.2 + 0.2;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
    }
    update(){
      this.x += this.speedX;
      this.y += this.speedY;
      if(this.x < 0) this.x = w;
      if(this.x > w) this.x = 0;
      if(this.y <0) this.y = h;
      if(this.y > h) this.y =0;
      if(mouseX && mouseY){
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120){
          const force = (120 - dist)/120;
          this.x -= dx * force * 0.025;
          this.y -= dy * force * 0.025;
        }
      }
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fillStyle = "rgba(240, 200, 255, 0.65)";
      ctx.fill();
    }
  }
  for(let i=0;i<80;i++) particles.push(new Particle());

  window.addEventListener('mousemove', e=>{
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener('mouseleave', ()=>{
    mouseX = null; mouseY = null;
  });

  function animateParticles(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{ p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // 滚动入场动画
  const items = document.querySelectorAll('.highlight-card');
  items.forEach(el=> el.classList.add('reveal-animate'));
  const ioReveal = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('active');
        ioReveal.unobserve(en.target);
      }
    })
  },{threshold:0.15});
  items.forEach(item=> ioReveal.observe(item));

  // 导航磨砂
  const header = document.querySelector('header');
  if(header){
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 40){
        header.classList.add('scrolled');
      }else{
        header.classList.remove('scrolled');
      }
    })
  }

  // 数字计数（支持25+）
  const nums = document.querySelectorAll('.metric .num');
  const ioCounter = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const rawText = en.target.textContent.trim();
        const numMatch = rawText.match(/(\d+)(.*)/);
        if(!numMatch) return;
        const target = parseInt(numMatch[1]);
        const suffix = numMatch[2];
        let current = 0;
        const timer = setInterval(()=>{
          current += 1;
          en.target.textContent = current + suffix;
          if(current >= target) clearInterval(timer);
        },40);
        ioCounter.unobserve(en.target);
      }
    })
  },{threshold:0.2});
  nums.forEach(n=> ioCounter.observe(n));

  // hero视差
  window.addEventListener('scroll', ()=>{
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    if(hero){
      hero.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
  })
});