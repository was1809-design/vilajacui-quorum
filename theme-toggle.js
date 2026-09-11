(()=>{'use strict';
/* Light-only theme. Removes the theme switch and ignores old saved dark preferences. */
function applyLight(){
 const h=document.documentElement;
 h.setAttribute('data-theme','light');
 h.classList.remove('theme-dark');
 h.classList.add('theme-light');
 h.style.colorScheme='light';
 if(document.body)document.body.setAttribute('data-theme','light');
 try{localStorage.removeItem('qv_theme')}catch{}
 document.querySelectorAll('.qvThemeToggle').forEach(b=>b.remove());
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content='#0F6B68';
}
document.addEventListener('DOMContentLoaded',applyLight);
if(document.readyState!=='loading')applyLight();
new MutationObserver(()=>{if(document.querySelector('.qvThemeToggle'))applyLight()}).observe(document.documentElement,{childList:true,subtree:true});
const s=document.createElement('style');s.textContent=`html{color-scheme:light!important}html,body{background:#f2f2f7}.qvThemeToggle{display:none!important}`;document.head.appendChild(s);
})();