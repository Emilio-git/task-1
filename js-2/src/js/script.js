'use strict';

window.addEventListener('DOMContentLoaded', () => {
   const destination = document.querySelector('.destination__select');

   const availableTime = document.querySelector('.time');
   const optionsFromA = document.createElement('select');
   const optionsFromB = document.createElement('select');

   optionsFromA.innerHTML = `
      <option class="time__option" value="18:00(из A в B)">18:00(из A в B)</option>
      <option class="time__option" value="18:30(из A в B)">18:30(из A в B)</option>
      <option class="time__option" value="18:45(из A в B)">18:45(из A в B)</option>
      <option class="time__option" value="19:00(из A в B)">19:00(из A в B)</option>
      <option class="time__option" value="19:15(из A в B)">19:15(из A в B)</option>
      <option class="time__option" value="21:00(из A в B)">21:00(из A в B)</option>
   `;
   optionsFromB.innerHTML = `
      <option class="time__option" value="18:30(из B в A)">18:30(из B в A)</option>
      <option class="time__option" value="18:45(из B в A)">18:45(из B в A)</option>
      <option class="time__option" value="19:00(из B в A)">19:00(из B в A)</option>
      <option class="time__option" value="19:15(из B в A)">19:15(из B в A)</option>
      <option class="time__option" value="19:35(из B в A)">19:35(из B в A)</option>
      <option class="time__option" value="21:50(из B в A)">21:50(из B в A)</option>
      <option class="time__option" value="21:55(из B в A)">21:55(из B в A)</option>
   `;

   checkDestination();

   destination.addEventListener('change', () => {
      availableTime.lastElementChild.remove();
      checkDestination();
   })

   function addAdditionalSelector() {
      const backToA = document.createElement('div');
      backToA.innerHTML = `
      <label class="time__label" for="timeBack">Выберите время возвращения в А</label>
      <select class="time__select" name="timeBack" id="timeBack">
         <option class="time__option-back" value="18:30(из B в A)">18:30(из B в A)</option>
         <option class="time__option-back" value="18:45(из B в A)">18:45(из B в A)</option>
         <option class="time__option-back" value="19:00(из B в A)">19:00(из B в A)</option>
         <option class="time__option-back" value="19:15(из B в A)">19:15(из B в A)</option>
         <option class="time__option-back" value="19:35(из B в A)">19:35(из B в A)</option>
         <option class="time__option-back" value="21:50(из B в A)">21:50(из B в A)</option>
         <option class="time__option-back" value="21:55(из B в A)">21:55(из B в A)</option>
      </select>
      `;

      return backToA
   }

   function checkDestination() {
      if(destination.value === 'fromA') {
         availableTime.append(optionsFromA);
      } else if (destination.value === 'fromB') {
         availableTime.append(optionsFromB);
      } else if (destination.value === 'fromAtoA') {
         availableTime.append(optionsFromA);
         availableTime.append(addAdditionalSelector());
      } else {
         throw alert('Произошла ошибка');
      }
   }

});