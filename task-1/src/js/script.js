'use strict';

window.addEventListener('DOMContentLoaded', () => {
   const links = document.querySelectorAll('a');

   links.forEach(link => {
      link.addEventListener('click', (e) => {
         e.preventDefault();
      })
   })

   const timeEach = document.querySelectorAll('.descr__item-clock');

   timeEach.forEach((item) => {
      if (item.children.length > 4) {
         for(let i=0; i < item.children.length; i++) {
            if(i > 2) {
               item.children[i].classList.add('hide');
            }
         }
         createMoreTimeBtn(item);
      }
   })

   function createMoreTimeBtn(item) {
      const moreTime = document.createElement('span');
      moreTime.innerText = `ещё...`;
      moreTime.classList.add('descr__item-time');
      item.append(moreTime);

      moreTime.addEventListener('click', () => {
         for(let i of item.children) {
            i.classList.remove('hide');
         }
         moreTime.classList.add('hide');
      });
   }
}); 