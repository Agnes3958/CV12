// Simple scroll reveal + progress bar animation
document.addEventListener('DOMContentLoaded',function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },{threshold:0.12});

  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // animate progress bars when skills visible
  const skillsSection = document.getElementById('skills');
  if(skillsSection){
    const pIo = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          document.querySelectorAll('.bar').forEach(b=>{
            const p = b.getAttribute('data-percent')||70;
            b.style.width = p + '%';
          });
          pIo.disconnect();
        }
      });
    },{threshold:0.25});
    pIo.observe(skillsSection);
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });
});
