const header=document.querySelector('.site-header');
const toggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.nav-links');
const dropdownButtons=document.querySelectorAll('.nav-link-button');
const year=document.querySelector('[data-year]');
if(year) year.textContent=new Date().getFullYear();
const setHeader=()=>header?.classList.toggle('scrolled',window.scrollY>16); setHeader(); window.addEventListener('scroll',setHeader,{passive:true});
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕':'☰';});}
dropdownButtons.forEach(btn=>btn.addEventListener('click',()=>{if(matchMedia('(max-width: 960px)').matches){const parent=btn.closest('.dropdown');const open=parent.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));}}));
document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!e.target.closest('.site-header')){nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.textContent='☰';}});
const dlg=document.querySelector('#lightbox');const dlgImg=dlg?.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>{if(dlg&&dlgImg){dlgImg.src=b.dataset.lightbox;dlgImg.alt=b.querySelector('img')?.alt||'Studio photo';dlg.showModal();}}));
dlg?.querySelector('.lightbox-close')?.addEventListener('click',()=>dlg.close());dlg?.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});


// Booking quote calculator
(()=>{
  const calc=document.querySelector('[data-booking-calculator]');
  if(!calc) return;
  const R={studio:3000,post:3500,host:1500,advance:1000};
  const q=s=>calc.querySelector(s);
  const hours=q('#studio-hours'), post=q('#add-post'), postHours=q('#post-hours'), host=q('#add-host');
  const postWrap=q('[data-post-hours-wrap]');
  const studioLine=q('[data-studio-line]'), postLine=q('[data-post-line]'), hostLine=q('[data-host-line]');
  const totalEl=q('[data-total]'), advanceEl=q('[data-advance]'), balanceEl=q('[data-balance]'), summary=q('[data-summary]');
  const formLink=q('[data-booking-form]'), waLink=q('[data-whatsapp-quote]'), copyBtn=q('[data-copy-summary]');
  const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
  const safeNum=(v,min=0)=>Math.max(min,Number.parseFloat(v)||0);
  function update(){
    const h=safeNum(hours.value,1);
    const ph=post.checked?safeNum(postHours.value,1):0;
    const studioCost=h*R.studio;
    const postCost=ph*R.post;
    const hostCost=host.checked?h*R.host:0;
    const total=studioCost+postCost+hostCost;
    const balance=Math.max(0,total-R.advance);
    postWrap?.classList.toggle('show',post.checked);
    studioLine.textContent=`${h} hr × ${money(R.studio)}`;
    postLine.textContent=post.checked?`${ph} hr × ${money(R.post)}`:'Not selected';
    hostLine.textContent=host.checked?`${h} hr × ${money(R.host)}`:'Not selected';
    totalEl.textContent=money(total); advanceEl.textContent=money(R.advance); balanceEl.textContent=money(balance);
    const lines=[
      'Time 2 Talk — Studio Quote',
      `Studio: ${h} hr × ${money(R.studio)} = ${money(studioCost)}`,
      post.checked?`Post-production: ${ph} hr × ${money(R.post)} = ${money(postCost)} (includes 1 Teaser, 1 Podcast & 3 Reels; extra reel ₹500 each)`:'Post-production: Not selected',
      host.checked?`Host: ${h} hr × ${money(R.host)} = ${money(hostCost)}`:'Host: Not selected',
      `Estimated total: ${money(total)}`,
      `Advance to confirm booking: ${money(R.advance)}`,
      `Estimated balance after advance: ${money(balance)}`
    ];
    summary.textContent=lines.join('\n');
    if(waLink) waLink.href=`https://wa.me/919625669469?text=${encodeURIComponent(lines.join('\n'))}`;
  }
  calc.querySelectorAll('[data-stepper]').forEach(stepper=>{
    const input=stepper.querySelector('input');
    stepper.querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>{
      const delta=Number(btn.dataset.step)||0;
      const min=Number(input.min)||0;
      const max=Number(input.max)||Infinity;
      const step=Number(input.step)||1;
      const current=Number(input.value)||min;
      const next=Math.min(max,Math.max(min,current+(delta*step)));
      input.value=String(next);
      input.dispatchEvent(new Event('input',{bubbles:true}));
    }));
  });
  [hours,post,postHours,host].forEach(el=>el?.addEventListener('input',update));
  [post,host].forEach(el=>el?.addEventListener('change',update));
  copyBtn?.addEventListener('click',async()=>{
    const original=copyBtn.textContent;
    try{await navigator.clipboard.writeText(summary.textContent);copyBtn.textContent='Copied';}
    catch(e){
      const ta=document.createElement('textarea');ta.value=summary.textContent;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();copyBtn.textContent='Copied';
    }
    setTimeout(()=>copyBtn.textContent=original,1500);
  });
  update();
})();
