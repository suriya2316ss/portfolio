
// ===== REVEAL =====
let prog=0,rbar=document.getElementById('rbar'),rev=document.getElementById('reveal');
const ri=setInterval(()=>{
  prog+=Math.random()*14+6;
  if(prog>=100){prog=100;clearInterval(ri);setTimeout(()=>{rev.style.opacity='0';rev.style.pointerEvents='none';initCounters();animBars()},350)}
  rbar.style.width=prog+'%';
},70);

// ===== CURSOR — INSTANT =====
const cdot=document.getElementById('cdot'),cring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  // Dot is pixel-perfect instant
  cdot.style.transform=`translate(${mx-3}px,${my-3}px)`;
});
(function loop(){
  // Ring uses lerp factor 0.6 — very close behind, barely noticeable lag
  rx+=(mx-rx)*.6; ry+=(my-ry)*.6;
  cring.style.transform=`translate(${rx-17}px,${ry-17}px)`;
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.tilt,.fbt,.igtab,.iggt,.star,.sol,.fbt').forEach(el=>{
  el.addEventListener('mouseenter',()=>cring.classList.add('h'));
  el.addEventListener('mouseleave',()=>cring.classList.remove('h'));
});

// ===== NAV =====
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>navEl.classList.toggle('sc',window.scrollY>40));
document.getElementById('ntog').addEventListener('click',()=>document.getElementById('nlinks').classList.toggle('open'));

// ===== PAGE NAV =====
let curPg='home';
function showPg(id){
  document.querySelectorAll('.pg').forEach(p=>{p.classList.remove('act');p.style.display='none'});
  const t=document.getElementById(id);
  if(!t)return;
  t.style.display='block';
  requestAnimationFrame(()=>t.classList.add('act'));
  curPg=id;
  window.scrollTo({top:0,behavior:'smooth'});
  document.querySelectorAll('.nl').forEach(l=>l.classList.toggle('act',l.dataset.pg===id));
  document.getElementById('nlinks').classList.remove('open');
  setTimeout(()=>initTilt(),100);
  if(id==='home'){initCounters();setTimeout(animBars,400)}
}
document.querySelectorAll('.nl,[data-pg]').forEach(el=>{
  el.addEventListener('click',e=>{e.preventDefault();const pg=el.dataset.pg;if(pg)showPg(pg)});
});
document.querySelectorAll('.plink').forEach(el=>{
  el.addEventListener('click',e=>{e.preventDefault();showPg(el.dataset.t)});
});

// ===== TILT =====
function initTilt(){
  document.querySelectorAll('.tilt').forEach(c=>{
    c.onmousemove=e=>{
      const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      const rx=(y-r.height/2)/r.height*-10,ry=(x-r.width/2)/r.width*10;
      c.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    };
    c.onmouseleave=()=>c.style.transform='perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
  });
}
initTilt();

// ===== COUNTERS =====
function initCounters(){
  document.querySelectorAll('.stn[data-c]').forEach(el=>{
    if(el.dataset.done)return;
    el.dataset.done='1';
    const t=+el.dataset.c;let n=0;
    const s=setInterval(()=>{n+=Math.ceil(t/50);if(n>=t){n=t;clearInterval(s)}el.textContent=n},25);
  });
}

// ===== SKILL BARS =====
function animBars(){
  document.querySelectorAll('.sbf[data-p]').forEach(el=>{
    el.style.width=el.dataset.p+'%';
  });
}

// ===== MEMORY FILTER =====
document.querySelectorAll('.fbt').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.fbt').forEach(x=>x.classList.remove('act'));
    b.classList.add('act');
    const f=b.dataset.f;
    document.querySelectorAll('.mitem').forEach(m=>{
      m.classList.toggle('hid',f!=='all'&&m.dataset.c!==f);
    });
  });
});

// ===== INSTAGRAM TABS =====
document.querySelectorAll('.igtab').forEach(t=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.igtab').forEach(x=>x.classList.remove('act'));
    document.querySelectorAll('.ig-panel').forEach(x=>x.classList.remove('act'));
    t.classList.add('act');
    document.getElementById('tab-'+t.dataset.tab).classList.add('act');
  });
});

// ===== INSTAGRAM GRID TABS =====
document.querySelectorAll('.iggt').forEach(t=>{
  t.addEventListener('click',()=>{
    const view=t.dataset.view, target=t.dataset.target;
    const panel=document.getElementById('tab-'+target);
    panel.querySelectorAll('.iggt').forEach(x=>x.classList.remove('act'));
    t.classList.add('act');
    const showEl=document.getElementById(target+'-'+view);
    panel.querySelectorAll('[id^="'+target+'"]').forEach(x=>x.style.display='none');
    if(showEl)showEl.style.display='';
  });
});

// ===== STAR RATING =====
let selRat=0;
const slbls=['','Poor','Fair','Good','Very Good','Excellent'];
document.querySelectorAll('.star').forEach(s=>{
  s.addEventListener('mouseenter',()=>{
    const v=+s.dataset.v;
    document.querySelectorAll('.star').forEach((x,i)=>x.classList.toggle('hov',i<v));
    document.getElementById('slbl').textContent=slbls[v];
  });
  s.addEventListener('mouseleave',()=>{
    document.querySelectorAll('.star').forEach(x=>x.classList.remove('hov'));
    document.getElementById('slbl').textContent=selRat>0?slbls[selRat]:'Rate your experience';
  });
  s.addEventListener('click',()=>{
    selRat=+s.dataset.v;
    document.querySelectorAll('.star').forEach((x,i)=>{x.classList.toggle('act',i<selRat);x.classList.remove('hov')});
    document.getElementById('slbl').textContent=slbls[selRat];
  });
});

// ===== REVIEW SUBMIT =====
// let rcnt=6;
// document.getElementById('bsub').addEventListener('click',()=>{
//   const n=document.getElementById('rn').value.trim(),
//         role=document.getElementById('rr').value.trim(),
//         txt=document.getElementById('rt').value.trim(),
//         cat=document.getElementById('rcat').value;
//   if(!n||!txt||selRat===0){document.getElementById('rfw').style.animation='shk .45s ease';setTimeout(()=>document.getElementById('rfw').style.animation='',500);return}
//   const cols=['linear-gradient(135deg,#4776e6,#8e54e9)','linear-gradient(135deg,#fa709a,#fee140)','linear-gradient(135deg,#11998e,#38ef7d)','linear-gradient(135deg,#f093fb,#f5576c)','linear-gradient(135deg,#f7971e,#ffd200)','linear-gradient(135deg,#a18cd1,#fbc2eb)'];
//   const col=cols[Math.floor(Math.random()*cols.length)];
//   const stars='★'.repeat(selRat)+'☆'.repeat(5-selRat);
//   const card=document.createElement('div');
//   card.className='rc tilt nr';
//   card.innerHTML=`<div class="rch"><div class="rav" style="background:${col}">${n[0].toUpperCase()}</div><div class="rvi"><h5>${esc(n)}</h5><span>${esc(role)||'Community Member'}</span></div><div class="rvs">${stars}</div></div><p>"${esc(txt)}"</p><div class="rcf"><span class="rtag">${esc(cat)||'Overall Portfolio'}</span><span class="rdate">Just now</span></div>`;
//   document.getElementById('rl').prepend(card);
//   document.getElementById('rn').value=document.getElementById('rr').value=document.getElementById('rt').value='';
//   document.getElementById('rcat').value='';
//   document.querySelectorAll('.star').forEach(x=>x.classList.remove('act','hov'));
//   selRat=0;document.getElementById('slbl').textContent='Rate your experience';
//   rcnt++;document.getElementById('rcnt').textContent=rcnt;
//   toast('Thank you for your review! 🎉');
//   setTimeout(()=>card.classList.remove('nr'),700);
//   initTilt();
// });
// function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
// function toast(m){let t=document.querySelector('.toast');if(t)t.remove();t=document.createElement('div');t.className='toast';t.innerHTML=`<span>✅</span><span>${m}</span>`;document.body.appendChild(t);setTimeout(()=>t.classList.add('show'),40);setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),400)},3400)}



// ===== CONTACT FORM SUBMIT =====
// document.getElementById('cbsub').addEventListener('click',()=>{
//   const n=document.getElementById('cn').value.trim(),
//         e=document.getElementById('ce').value.trim(),
//         s=document.getElementById('cs').value.trim(),
//         m=document.getElementById('cm').value.trim(),
//         cat=document.getElementById('ccat').value;
//   if(!n||!e||!m){
//     document.getElementById('cfw').style.animation='shk .45s ease';
//     setTimeout(()=>document.getElementById('cfw').style.animation='',500);
//     return;
//   }
//   document.getElementById('cn').value=document.getElementById('ce').value=
//   document.getElementById('cs').value=document.getElementById('cm').value='';
//   document.getElementById('ccat').value='';
//   toast('Message sent! I\'ll reply within 24 hours 🚀');
// });

// ===== CODE RAIN =====
function initCodeRain(){
  const c=document.getElementById('ytcr');if(!c)return;
  const chars='01アイウエオ</>{}[]';
  for(let i=0;i<18;i++){
    const s=document.createElement('span');
    s.style.cssText=`position:absolute;font-family:monospace;font-size:${Math.random()*7+8}px;color:#00d4ff;left:${Math.random()*100}%;animation:rain ${Math.random()*3+2}s linear ${Math.random()*3}s infinite;top:-20px`;
    setInterval(()=>s.textContent=chars[Math.floor(Math.random()*chars.length)],200+Math.random()*300);
    c.appendChild(s);
  }
}

// ===== BG PARALLAX =====
document.addEventListener('mousemove',e=>{
  const x=(e.clientX/window.innerWidth-.5)*2,y=(e.clientY/window.innerHeight-.5)*2;
  document.querySelectorAll('.orb').forEach((o,i)=>{
    const f=(i+1)*12;
    o.style.transform=`translate(${x*f}px,${y*f}px)`;
  });
  document.querySelector('.grid-bg').style.backgroundPosition=`${x*16}px ${y*16}px`;
});

// Shake keyframe
const sk=document.createElement('style');
sk.textContent='@keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}@keyframes rain{from{top:-20px;opacity:.7}to{top:100%;opacity:0}}';
document.head.appendChild(sk);

// ===== KEYBOARD NAV =====
const PGS=['home','skills','editing','instagram','memories','youtube','contact'];
document.addEventListener('keydown',e=>{
  const i=PGS.indexOf(curPg);
  if(e.key==='ArrowRight'&&i<PGS.length-1)showPg(PGS[i+1]);
  if(e.key==='ArrowLeft'&&i>0)showPg(PGS[i-1]);
});

// ===== INIT =====
showPg('home');
setTimeout(initCodeRain,500);




// EmailJS Initialization
emailjs.init({
    publicKey: "epjvoZoxqlqHkkNkm"
});

// Contact Form
document.addEventListener("DOMContentLoaded", () => {

    const sendBtn = document.getElementById("cbsub");

    if (!sendBtn) return;

    sendBtn.addEventListener("click", function (e) {

        e.preventDefault();

        const name = document.getElementById("cn").value.trim();
        const email = document.getElementById("ce").value.trim();
        const subject = document.getElementById("cs").value.trim();
        const message = document.getElementById("cm").value.trim();
        const category = document.getElementById("ccat").value;

        // Validation
        if (name === "") {
            alert("Please enter your name");
            return;
        }

        if (email === "") {
            alert("Please enter your email");
            return;
        }

        if (message === "") {
            alert("Please enter your message");
            return;
        }

        const params = {
            name: name,
            email: email,
            subject: subject,
            message: message,
            category: category
        };

        console.log(params);

        // Send Mail To You
        emailjs.send(
            "service_zd7l4l2",
            "template_u3n0f6u",
            params
        )

        // Auto Reply To Visitor
        .then(() => {
            return emailjs.send(
                "service_zd7l4l2",
                "template_xgzkxkr",
                params
            );
        })

        .then(() => {

            alert("Message sent successfully! I will contact you within 24 hours.");

            document.getElementById("cn").value = "";
            document.getElementById("ce").value = "";
            document.getElementById("cs").value = "";
            document.getElementById("cm").value = "";
            document.getElementById("ccat").selectedIndex = 0;

        })

        .catch((error) => {
            console.error("EmailJS Error:", error);
            alert("Failed to send message. Check console (F12).");
        });

    });

});

// New code
// ===== DISABLE CUSTOM CURSOR ON TOUCH DEVICES =====
const isTouchDevice = (
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0
);

if (isTouchDevice) {
  // Hide cursor elements
  document.getElementById('cdot').style.display = 'none';
  document.getElementById('cring').style.display = 'none';

  // Restore normal cursor for whole page
  document.body.style.cursor = 'auto';

  // Fix all buttons and links
  document.querySelectorAll('a, button, .tilt, .fbt, .igtab, .star, .sol')
    .forEach(el => el.style.cursor = 'auto');
}
