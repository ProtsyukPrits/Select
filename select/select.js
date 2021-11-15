

const getTemplate = (data = [], placeholder, selectedId) => {   // Робимо data[] пустим масивом щоб не було проблем
  let text = placeholder ?? 'Placeholder по умолчанию' //Захист коли не працює placeholder
  
  const items = data.map(item => {
    let cls = ''
    if (item.id === selectedId) {  //Робить наш елемент за замовчуванням
      text = item.value
      cls = 'selected'   // Робить виділення для нашого елемента за замовчуванням
    }


    return `<li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>`
  })


  return `
   
  <div class="select__backdrop" data-type="backdrop"></div>
        <div class="select__input" data-type="input">
          <span data-type="value">${text}</span>
          <i class="fas fa-chevron-down" data-type="arrow"></i>
         
        </div>

        <div class="select__dropdown">
          <ul class="select__list">
            ${items.join('') }
          </ul>
        </div>
      
  `
}


export class Select {      //CONSTRUCTOR
  constructor(selector, options) {
    this.$el = document.querySelector(selector)
    this.options = options //для доступності опцій 
    this.selectedId = options.selectedId   // трекає який у нас тепер елемент

    this.#render()
    this.#setup()
  }

// Робота з шаблонами
  #render() {
    const {placeholder, data} = this.options
    this.$el.classList.add('select')
    this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
    
  }


// Робота з настройками
  

  #setup() {
    this.clickHandler = this.clickHandler.bind(this)
    this.$el.addEventListener('click', this.clickHandler)
    this.$arrow = this.$el.querySelector('[data-type="arrow"]')
    this.$value = this.$el.querySelector('[data-type="value"]')
  }

  
  clickHandler(event) {        // Механізм для вибору елементів
    const {type} = event.target.dataset
    
    if (type === 'input') {
      this.toggle()
    } else if (type === 'item') {
      const id = event.target.dataset.id
      this.select(id)
    } else if (type === 'backdrop') {   //Закриває нас селект вне поля 
      this.close()
    }
      
  }
  

  get isOpen() {
    return this.$el.classList.contains('open')
  }

  get current() {
    return this.options.data.find(item => item.id === this.selectedId)
  }



  select(id) {        //Вибирати кожен елемент і заносити його в головний інпут
    this.selectedId = id
    this.$value.textContent = this.current.value

    this.$el.querySelectorAll('[data-type="item"]').forEach(element => {   // Витирає попередні виділення щоб не було 2-го виділення елементів
      element.classList.remove('selected')
      })
    this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')  // Залишає виділеним наш елемент

    this.options.onSelect ? this.options.onSelect(this.current) : null  // Отримуємо обєкт в console.log

    this.close()  // закриваємо список коли вибрали елемент
}

   // Селектор який відкриває і закриває наш інпут
  toggle() {
    this.isOpen ? this.close() : this.open()
  }

  open() {
    this.$el.classList.add('open')
    this.$arrow.classList.remove('fa-chevron-down')
    this.$arrow.classList.add('fa-chevron-up')

  }
  close() {
    this.$el.classList.remove('open')
    this.$arrow.classList.add('fa-chevron-down')
    this.$arrow.classList.remove('fa-chevron-up')
  }
  destroy() {
    this.$el.removeEventListener ('click', this.clickHandler)
    this.$el.innerHTML = '' // Видаляє контент
  }

}