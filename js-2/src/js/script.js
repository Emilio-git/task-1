'use strict';

window.addEventListener('DOMContentLoaded', () => {
   const destination = document.querySelector('.destination__select'),
         availableTime = document.querySelector('.time'),
         optionsFromA = document.createElement('select'),
         optionsFromB = document.createElement('select');

   function addFeaturesToSelect(selectElement) {
      selectElement.classList.add('time__select')
      selectElement.addEventListener('change', () => {
         clearResult();
            timeListener(backToA);
      });
   }

   addFeaturesToSelect(optionsFromA);
   addFeaturesToSelect(optionsFromB);

   optionsFromA.innerHTML = `
      <option class="time__option" value="1080">${timeCounter(1080)}</option>
      <option class="time__option" value="1110">${timeCounter(1110)}</option>
      <option class="time__option" value="1125">${timeCounter(1125)}</option>
      <option class="time__option" value="1140">${timeCounter(1140)}</option>
      <option class="time__option" value="1155">${timeCounter(1155)}</option>
      <option class="time__option" value="1260">${timeCounter(1260)}</option>
   `;
   optionsFromB.innerHTML = `
      <option class="time__option" value="1110">${timeCounter(1110)}</option>
      <option class="time__option" value="1125">${timeCounter(1125)}</option>
      <option class="time__option" value="1140">${timeCounter(1140)}</option>
      <option class="time__option" value="1155">${timeCounter(1155)}</option>
      <option class="time__option" value="1175">${timeCounter(1175)}</option>
      <option class="time__option" value="1310">${timeCounter(1310)}</option>
      <option class="time__option" value="1315">${timeCounter(1315)}</option>
   `;

   function checkDestination() {
      if(destination.value === 'fromA') {
         availableTime.append(optionsFromA);
         removeAdditionalSelector();
      } else if (destination.value === 'fromB') {
         availableTime.append(optionsFromB);
         removeAdditionalSelector();
      } else if (destination.value === 'fromAtoA') {
         availableTime.append(optionsFromA);
         availableTime.after(addAdditionalSelector());
      } else {
         throw alert('Произошла ошибка');
      }
   }

   checkDestination();

   destination.addEventListener('change', () => {
      clearResult();
      availableTime.lastElementChild.remove();
      checkDestination();
   })

   function removeAdditionalSelector() {
      if(availableTime.nextElementSibling.classList.contains('time-back')) {
         availableTime.nextElementSibling.remove();
      }
   }

   const backToA = document.createElement('div');
   backToA.classList.add('time-back')
   backToA.innerHTML = `
   <label class="time__label-back" for="timeBack">Выберите время возвращения в А</label>
   <select class="time__select-back" name="timeBack" id="timeBack">
      <option class="time__option-back" value="1110">${timeCounter(1110)}</option>
      <option class="time__option-back" value="1125">${timeCounter(1125)}</option>
      <option class="time__option-back" value="1140">${timeCounter(1140)}</option>
      <option class="time__option-back" value="1155">${timeCounter(1155)}</option>
      <option class="time__option-back" value="1175">${timeCounter(1175)}</option>
      <option class="time__option-back" value="1310">${timeCounter(1310)}</option>
      <option class="time__option-back" value="1315">${timeCounter(1315)}</option>
   </select>
   `;

   function addAdditionalSelector() {
      timeListener(backToA);
      return backToA
   }

   const wrapper = document.querySelector('.tickets__container');
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
      return timeInMinutes = `${Math.floor(timeInMinutes / 60)}:${timeInMinutes % 60 > 10? timeInMinutes % 60 : '0' + timeInMinutes % 60}`;
   } 

   function getQuantityPhrase(quantity) {
      if(quantity.slice(-1) == 1 && quantity != 11) {
         return `билет`;
      } else if(quantity.slice(-1) < 5 && quantity.slice(-1) != 0 &&(quantity < 5 || quantity > 20)) {
         return `билета`;
      } else {
         return `билетов`;
      }
   }

   function getChoosedTime() {
      return optionsFromA.value;
   }
   
   function timeListener(time) {
      const allTimes = time.querySelectorAll('.time__option-back');
      const timeToStamp = time.querySelector('#timeBack');
      let choosedTime = getChoosedTime();
      allTimes.forEach(time => {
         if(time.value < choosedTime || time.value <= +choosedTime + 50) {
            time.setAttribute('disabled', 'true');
         } else {
            time.removeAttribute('disabled', 'true');
            timeToStamp.value = time.value;
         }
      });
   }

   function getResult(quantity, destination, time) {
      let timeAmount, destinationPhrase, sum;

      if (quantity < 1 || quantity > 100) {
         throwError();
         return;
      }

      if (destination === 'fromA') {
         timeAmount = 50;
         destinationPhrase = `из A в B`;
         sum = 700;
      } else if (destination === 'fromB') {
         timeAmount = 50;
         destinationPhrase = `из В в А`;
         sum = 700;
      }
      else {
         timeAmount = 100
         destinationPhrase = `из A в B и обратно в А`;
         sum = 1200;
      }
      
      let arrivalTime = +time + timeAmount;
      const timeBackOnB = backToA.querySelector('#timeBack').value;
      let timeOnB = timeBackOnB - time - 50;
      const result = document.createElement('div');
      result.classList.add('tickets__result');
      result.innerHTML = `
         <p class="tickets__text">
            Вы выбрали ${quantity} ${getQuantityPhrase(quantity)} по маршруту ${destinationPhrase} <br>
            Cтоимость одного билета ${sum}₽<br>
            Общая стоимость билетов - ${sum * quantity}₽<br>
            Это путешествие займет у вас ${timeAmount == 100 ? `50 минут в сторону В и 50 минут в сторону А обратно, в пункте B вы пробудете ${timeOnB}` : `50 минут`} минут<br>
            Теплоход отправляется в ${timeCounter(time)}, ${timeAmount == 100 ? `возвращение обратно в пункт А ${timeCounter(arrivalTime + timeOnB)}`: `прибытие в ${timeCounter(arrivalTime)}`}
         </p>
         <div class="tickets__ship">
            <img src="./src/img/ship.png" alt="Ship"/>
         </div>
         <button class="tickets__submit">Продолжить оформление</button>
      `;

      wrapper.append(result);
   }
   
   function clearResult() {
      if (wrapper.lastElementChild.classList.contains('tickets__result')) {
         wrapper.lastElementChild.remove();
      }
   }

   function throwError() {
      const result = document.createElement('div');
      result.classList.add('tickets__result');
      result.innerHTML = `
         <p class="tickets__text">
            Введено некорректное количество билетов.<br>
            Пожалуйста, введите количество от 1 до 100.
         </p>
      `;
      wrapper.append(result);
   }

});