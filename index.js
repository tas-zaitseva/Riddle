
document.addEventListener('DOMContentLoaded', ()=> {
  //активные элементы
  let startContainer = document.querySelector('#start');
  let endContainer = document.querySelector('#end');
  let midContainer = document.querySelector('#mid');

  
  let prev = document.querySelector('#prev');
  let next = document.querySelector('#next');
  let changePrev = document.querySelector('#changePrev');
  let changeNext = document.querySelector('#changeNext');
  
  let overlay = document.querySelector('#overlay');
  let modal = document.querySelector('#modal');
  let modalText = modal.querySelector('.modal__text');
  let modalScore = document.querySelector('.modal__score');
  let modalBtn = document.querySelector('#modalBtn');
  
  //переменные для измерения времени
  let score = 0;
  let timer;
  
  //переменные для хранения времени
  let result = document.querySelector('.section__result');
  let storage = sessionStorage;
  storage.setItem('result', '[]');

  //проверка, есть ли что-то в storage
  if (JSON.parse(storage.getItem('result')).length) {
    result.firstElementChild.textContent = `${Math.min(...JSON.parse(storage.getItem('result')))}`;
  } else {
    result.firstElementChild.textContent = '0';
  }

  //получение массива исходных элементов
  async function request(url) {
    const promise = await fetch(url);
    const response = promise.json();
    return response;
  }

  request('data.json').then(response => {
    let start = response.startArr;
    let mid = response.midArr;
    let end = response.endArr;

    renderArray(start, startContainer);

    //функция, которая отрисовывет элементы из нужного массива в нужном контейнере
    function renderArray(array, container) {
      container.innerHTML = '';
      for (let element of array) {
  
        let item = document.createElement('li');
        item.classList.add('item');
        
        let person = document.createElement('div');
        person.classList.add('item__person');
        person.dataset['name'] = element;
        item.appendChild(person);
        
        if (array !== mid) {
          let button = document.createElement('button');
          button.classList.add('item__button');
          button.dataset['name'] = element;
          button.innerText = 'В лодку';
          item.appendChild(button);
        }
        container.appendChild(item);
      }
    }

    //функция, которая "перезагружает" игру
    function restartGame() {
      start = ['волк', 'коза', 'капуста'];
      end.length = 0;
      renderArray(start, startContainer);
      renderArray(end, endContainer);
    }

    //обработчик клика по кнопке персонажа для помещения его в лодку
    document.addEventListener('click', event=> {

      if (event.target.classList.contains('item__button')) {
        event.preventDefault();
        
        if (score === 0 && !timer) {
          timer = setInterval(()=> {score +=1; console.log(score)}, 1000);
        }

        let obj = event.target.previousElementSibling;

        if (mid.length < 1) {
          mid.push(obj.dataset['name']);
          midContainer.appendChild(obj);

          start = start.filter(item => item !== obj.dataset['name']);
          end = end.filter(item => item !== obj.dataset['name']);
          renderArray(start, startContainer);
          renderArray(end, endContainer);

        } else if (mid.length === 1) {
          modalText.innerText = 'Можно певезти только одного персонажа за раз!';
          overlay.classList.remove('hidden');
        };
      }
    })

    //обработчики клика по контролам
    prev.addEventListener('click', event=> {
      event.preventDefault();
      if(mid.length) {
        start.push(mid.pop());
        renderArray(mid, midContainer);
        renderArray(start, startContainer);
      }
    })
    
    next.addEventListener('click', event=> {
      event.preventDefault();
      if (mid.length) {
        end.push(mid.pop());
        renderArray(mid, midContainer);
        renderArray(end, endContainer);
      }

      if ((end.length === 1 && end[0] === 'капуста') || (start.length === 1 && start[0] === 'капуста')){
        modalText.innerText = 'Волк съел козу! Вы проиграли. Попробуйте еще раз.';
        overlay.classList.remove('hidden');

      } else if ((end.length === 1 && end[0] === 'волк') || (start.length === 1 && start[0] === 'волк')){
        modalText.innerText = 'Коза съела капусту! Вы проиграли. Попробуйте еще раз.';
        overlay.classList.remove('hidden');

      } else if (end.length === 3) {
        if (timer) {
          timer = clearInterval(timer);
        }

        let array = JSON.parse(storage.getItem('result'));
        array.push(score);
        storage.setItem('result', JSON.stringify(array));
        result.firstElementChild.textContent = `${Math.min(...array)}`;

        modalText.innerText = 'Ура! Вы перевезли всех. Никто никого не съел.';
        modalScore.innerHTML = `Ваш результат: <span>${score}</span> секунд`;
        overlay.classList.remove('hidden');
        score = 0;
      }
    })

    changePrev.addEventListener('click', event=> {
      event.preventDefault();
      if (start.length === 1 && mid.length === 1) {
        [start[0], mid[0]] = [mid[0], start[0]];
        renderArray(start, startContainer);
        renderArray(mid, midContainer);
      }
    })

    changeNext.addEventListener('click', event=> {
      event.preventDefault();
      if (end.length === 1 && mid.length === 1) {
        [end[0], mid[0]] = [mid[0], end[0]];
        renderArray(end, endContainer);
        renderArray(mid, midContainer);
      }
    })

    //обработчик клика по кнопке в модальном окне
    modalBtn.addEventListener('click', event=> {
      event.preventDefault();
      overlay.classList.add('hidden');
      modalScore.innerHTML = '';

      if (!mid.length) {
        restartGame();
      }
    })
  });
})
