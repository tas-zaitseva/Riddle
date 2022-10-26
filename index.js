

document.addEventListener('DOMContentLoaded', ()=> {
  let startContainer = document.querySelector('#start');
  let endContainer = document.querySelector('#end');
  let midContainer = document.querySelector('#mid');
  
  let prev = document.querySelector('#prev');
  let next = document.querySelector('#next');
  let changePrev = document.querySelector('#changePrev');
  let changeNext = document.querySelector('#changeNext');


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

    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('item__button')) {
        event.preventDefault();
        let obj = event.target.previousElementSibling;

        if (mid.length < 1) {
          mid.push(obj.dataset['name']);
          midContainer.appendChild(obj);

          start = start.filter(item => item !== obj.dataset['name']);
          end = end.filter(item => item !== obj.dataset['name']);
          renderArray(start, startContainer);
          renderArray(end, endContainer);

        } else if (mid.length === 1) {
          alert('Можно певезти только одного за раз!');
        };
      }
    })

    prev.addEventListener('click', function(event) {
      event.preventDefault();
      if(mid.length) {
        start.push(mid.pop());
        renderArray(mid, midContainer);
        renderArray(start, startContainer);
      }
    })
    
    next.addEventListener('click', function(event) {
      event.preventDefault();
      if(mid.length) {
        end.push(mid.pop());
        renderArray(mid, midContainer);
        renderArray(end, endContainer);
      }
      if ((end.length === 1 && end[0] === 'капуста') || (start.length === 1 && start[0] === 'капуста')){
        setTimeout(()=> {
          alert('Волк съел козу! Вы проиграли. Попробуйте еще раз.');
          start = ['волк', 'коза', 'капуста'];
          end.length = 0;
          renderArray(start, startContainer);
          renderArray(end, endContainer);
        });
      } else if ((end.length === 1 && end[0] === 'волк') || (start.length === 1 && start[0] === 'волк')){
        setTimeout(()=>{
          alert('Коза съела капусту! Вы проиграли. Попробуйте еще раз.');
          start = ['волк', 'коза', 'капуста'];
          end.length = 0;
          renderArray(start, startContainer);
          renderArray(end, endContainer);
        });
      } else if (end.length === 3) {
        setTimeout(()=>{
          alert('Ура! Вы перевезли всех. Никто никого не съел.');
          start = ['волк', 'коза', 'капуста'];
          end.length = 0;
          renderArray(start, startContainer);
          renderArray(end, endContainer);
        });
      }
    })

    changePrev.addEventListener('click', function(event) {
      event.preventDefault();
      if (start.length === 1 && mid.length === 1) {
        [start[0], mid[0]] = [mid[0], start[0]];
        renderArray(start, startContainer);
        renderArray(mid, midContainer);
      }
    })

    changeNext.addEventListener('click', function(event) {
      event.preventDefault();
      if (end.length === 1 && mid.length === 1) {
        [end[0], mid[0]] = [mid[0], end[0]];
        renderArray(end, endContainer);
        renderArray(mid, midContainer);
      }
    })

    




  });




})
