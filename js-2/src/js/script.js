'use strict';

window.addEventListener('DOMContentLoaded', () => {
   // Необходимые константы.
   const destination = document.querySelector('.destination__select'),
         availableTime = document.querySelector('.time'),
         optionsFromA = document.createElement('select'),
         optionsFromB = document.createElement('select'),
         wrapper = document.querySelector('.tickets__container'),
         btnResult = document.querySelector('.quantity__btn'),
         quantityInput = document.querySelector('.quantity__input');
         
   // Определение UTC зоны клиента (пользователя).
   const clientTimeOffset = new Date().getTimezoneOffset();

   // Данные, которые приходят условно с сервера. Числами, отражено время по GMT 0,
   // в удобном для чтения программы формате.
   const scheduleData = {
      fromA: [
         900, 930, 945, 960, 975, 1080,
      ],
      fromB: [
         930, 945, 960, 975, 995, 1130, 1135,
      ],
   }

   // Конвертация данных для дальнейшей передачи в каждый option.
   function getScheduleTime(data, selectorOfOption) {
      return data.map(time => {
         return `<option class=${selectorOfOption} value="${time - clientTimeOffset}">${timeCounter(time - clientTimeOffset)}</option>`;
      })
   }

   // Добавление стилевых классов и листенера для переданного select'а.
   function addFeaturesToSelect(selectElement) {
      selectElement.classList.add('time__select')
      selectElement.addEventListener('change', () => {
         clearResult();
         timeListener(backToA);
      });
   }

   // Добавление необходимых функций для select'ов разных путей.
   addFeaturesToSelect(optionsFromA);
   addFeaturesToSelect(optionsFromB);

   // Развертывание в нужный формат данных, полученных из условной БД.
   optionsFromA.innerHTML = `${[...getScheduleTime(scheduleData.fromA, 'time__option')]}`;
   optionsFromB.innerHTML = `${[...getScheduleTime(scheduleData.fromB, 'time__option')]}`;

   // Проверка выбранного пути направления пользователя.
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

   // Инициализация select'а направления, для первоначального предложения времени пользователю.
   checkDestination();

   // Листенер при выборе пользователем другого направления.
   destination.addEventListener('change', () => {
      clearResult();
      availableTime.lastElementChild.remove();
      checkDestination();
   })

   // Функция удаления дополнительно выпадающего select'а для выбора обратного времени.
   function removeAdditionalSelector() {
      if(availableTime.nextElementSibling.classList.contains('time-back')) {
         availableTime.nextElementSibling.remove();
      }
   }

   // Создание дополнительного select'а (вынесено нарочно в глобальную область).
   const backToA = document.createElement('div');
   backToA.classList.add('time-back')
   backToA.innerHTML = `
   <label class="time__label-back" for="timeBack">Выберите время возвращения в А</label>
   <select class="time__select-back" name="timeBack" id="timeBack">
      ${[...getScheduleTime(scheduleData.fromB, 'time__option-back')]}
   </select>
   `;

   // Листенер для удаления времени обратного направления 
   // (для исключения ошибок при покупке билетов пользователя).
   function addAdditionalSelector() {
      timeListener(backToA);
      return backToA
   }

   //  Очистка предыдущего результата при вводе нового количества билетов пользователя.
   quantityInput.addEventListener('input', () => {
      clearResult();
   });

   // Инициализация результата при нажатии кнопки.
   btnResult.addEventListener('click', () => {
      const currentQuantity = quantityInput.value;
      getResult(currentQuantity, destination.value, availableTime.lastElementChild.value);
   });

   // Функция перевода времени полученной из условной БД в формат часы:минуты.
   function timeCounter(timeInMinutes) {
      let hours, minutes;
      if (Math.floor(timeInMinutes / 60) >= 24) {
         hours = `0${Math.floor(timeInMinutes / 60) - 24}`
      } else {
         hours = Math.floor(timeInMinutes / 60)
      }
      if (timeInMinutes % 60 > 10) {
         minutes = timeInMinutes % 60
      } else {
         minutes = '0' + timeInMinutes % 60;
      }
      return `${hours}:${minutes}`;
   } 

   // Фунцкия определения фразы для определенного количества билетов введенных пользователем.
   function getQuantityPhrase(quantity) {
      if(quantity.slice(-1) == 1 && quantity != 11) {
         return `билет`;
      } else if(quantity.slice(-1) < 5 && quantity.slice(-1) != 0 &&(quantity < 5 || quantity > 20)) {
         return `билета`;
      } else {
         return `билетов`;
      }
   }

   // Вспомогательная функция возврата выбранного времени.
   function getChoosedTime() {
      return optionsFromA.value;
   }
   
   // Листенер для дополнительного селекта, который убирает время обратного пути,
   // чтобы пользователь не ошибся при покупке билетов.
   // Больше или равно в данном случае исключает, что клиент ни пробудет ни минуты в пункте B. 
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

   // Функция получения результата и его вывода.
   function getResult(quantity, destination, time) {
      let timeAmount, destinationPhrase, sum;

      if (quantity < 1 || quantity > 100 || (+quantity % 1 > 0)) {
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
      
      const timeBackOnB = backToA.querySelector('#timeBack').value,
            result = document.createElement('div');
      let arrivalTime = +time + timeAmount,
          timeOnB = timeBackOnB - time - 50;

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
   
   // Функция очистки предыдущего результата.
   function clearResult() {
      if (wrapper.lastElementChild.classList.contains('tickets__result')) {
         wrapper.lastElementChild.remove();
      }
   }

   // Функция вывода ошибки при некорректном введении пользователем количества билетов,
   // превышающих заданный лимит, который также отражен в html атрибутами min и max.
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

// P.S. В целом программа не имеет ограничений по вводу пользователем количества билетов, оно задано условно.
// Допускаю, что данный код требует оптимизации, а также валидации введенных данных,
// однако на это необходимо дополнительно время.
// Можно было добавить импровизированную БД в json формате.