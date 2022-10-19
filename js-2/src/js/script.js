'use strict';

window.addEventListener('DOMContentLoaded', () => {
   const destination = document.querySelector('.destination__select');

   const availableTime = document.querySelector('.time');
   const optionsFromA = document.createElement('select');
   const optionsFromB = document.createElement('select');

   function addClassSelect (selectElement) {
      selectElement.classList.add('time__select')
   }
   addClassSelect(optionsFromA);
   addClassSelect(optionsFromB);

   optionsFromA.innerHTML = `
      <option class="time__option" value="1080">18:00(из A в B)</option>
      <option class="time__option" value="1110">18:30(из A в B)</option>
      <option class="time__option" value="1125">18:45(из A в B)</option>
      <option class="time__option" value="1140">19:00(из A в B)</option>
      <option class="time__option" value="1155">19:15(из A в B)</option>
      <option class="time__option" value="1260">21:00(из A в B)</option>
   `;
   optionsFromB.innerHTML = `
      <option class="time__option" value="1110">18:30(из B в A)</option>
      <option class="time__option" value="1125">18:45(из B в A)</option>
      <option class="time__option" value="1140">19:00(из B в A)</option>
      <option class="time__option" value="1155">19:15(из B в A)</option>
      <option class="time__option" value="1175">19:35(из B в A)</option>
      <option class="time__option" value="1320">21:50(из B в A)</option>
      <option class="time__option" value="1325">21:55(из B в A)</option>
   `;

   checkDestination();

   destination.addEventListener('change', () => {
      clearResult();
      availableTime.lastElementChild.remove();
      checkDestination();
   })

   function addAdditionalSelector() {
      const backToA = document.createElement('div');
      backToA.classList.add('time-back')
      backToA.innerHTML = `
      <label class="time__label" for="timeBack">Выберите время возвращения в А</label>
      <select class="time__select" name="timeBack" id="timeBack">
         <option class="time__option-back" value="1110">18:30(из B в A)</option>
         <option class="time__option-back" value="1125">18:45(из B в A)</option>
         <option class="time__option-back" value="1140">19:00(из B в A)</option>
         <option class="time__option-back" value="1155">19:15(из B в A)</option>
         <option class="time__option-back" value="1175">19:35(из B в A)</option>
         <option class="time__option-back" value="1320">21:50(из B в A)</option>
         <option class="time__option-back" value="1325">21:55(из B в A)</option>
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

   const wrapper = document.querySelector('.tickets__content');
   const btnResult = document.querySelector('.quantity__btn');
   const quantityInput = document.querySelector('.quantity__input');

   quantityInput.addEventListener('input', () => {
      clearResult();
   });

   btnResult.addEventListener('click', () => {
      const currentQuantity = quantityInput.value;
      getResult(currentQuantity, destination.value, availableTime.lastElementChild.value);
   });

   function timeCounter(timeInMinutes) {
      return timeInMinutes = `${Math.floor(timeInMinutes / 60)}-${timeInMinutes % 60 ? timeInMinutes % 60 : '00'}`;
   } 

   

   function getResult(quantity, destination, time) {
      let timeAmount, destinationPhrase, sum;
      if (quantity < 1 || quantity > 30) {
         throwError();
         return;
      }

      if (destination === 'fromA') {
         timeAmount = 50;
         destinationPhrase = `из A в B`;
         sum = 700 * quantity;
      } else if (destination === 'fromB') {
         timeAmount = 50;
         destinationPhrase = `из В в А`;
         sum = 700 * quantity;
      }
      else {
         timeAmount = 100
         destinationPhrase = `из A в B и обратно в А`;
         sum = 1200 * quantity;
      }

      let arrivalTime = +time + timeAmount;

      const result = document.createElement('div');
      result.classList.add('tickets__result');
      result.innerHTML = `
         <p class="tickets__text">
            Вы выбрали ${quantity} билета по маршруту ${destinationPhrase} стоимостью ${sum}р.<br>
            Это путешествие займет у вас ${timeAmount} минут. <br>
            Теплоход отправляется в ${timeCounter(time)}, а прибудет в ${timeCounter(arrivalTime)}.
         </p>
      `;
      wrapper.append(result);

   }
   
   function clearResult() {
      if (wrapper.contains(result)) {
         wrapper.lastElementChild.remove();
      }
   }

   function throwError() {
      const result = document.createElement('div');
      result.classList.add('tickets__result');
      result.innerHTML = `
         <p class="tickets__text">
            Введено некорректное количество билетов.<br>
            Пожалуйста, введите количество от 1 до 30.
         </p>
      `;
      wrapper.append(result);
   }


});