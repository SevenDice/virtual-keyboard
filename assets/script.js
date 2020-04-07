/* eslint-disable no-underscore-dangle */
const Keyboard = {
  elements: {
    textarea: null,
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oniput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    lang: true,
  },

  init() {
    // Create h1 and textarea
    const vkHeader = document.createElement('h1')
    vkHeader.innerHTML = "Virtual Keyboard"
    vkHeader.classList.add('title')
    document.body.append(vkHeader)

    const vkHeaderDescription = document.createElement('p')
    vkHeaderDescription.innerText = "ОС: Windows, Ru/En: Ctrl-Alt"
    vkHeaderDescription.classList.add('title__description')
    document.body.appendChild(vkHeaderDescription);

    const textarea = document.createElement('textarea')
    textarea.classList.add('use-keyboard-input')
    textarea.id = 'textarea-id'

    document.body.appendChild(textarea)

    let lang = localStorage.getItem('lang') || 'en'

    // Create main elements
    this.elements.main = document.createElement('div')
    this.elements.keysContainer = document.createElement('div')

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden')
    this.elements.keysContainer.classList.add('keyboard__keys')
    this.elements.keysContainer.appendChild(this._createKeys())

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key')

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer)
    document.body.appendChild(this.elements.main)

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach(element => {
      element.addEventListener('focus', () => {
        this.open(element.value, currentValue => {
          element.value = currentValue
        })
      })
    })
  },
  _createKeys() {
    const fragment = document.createDocumentFragment()

    const keyLayoutEn = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'enter',
      'done','layout', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
      'space',
    ]

    const keyLayoutRus = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'done','layout', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
      'space',
    ]

    let keyLayout

    if (this.properties.lang) {
      keyLayout = keyLayoutEn
    } else {
      keyLayout = keyLayoutRus
    }
    
    // Creates HTML for an icon
    const createIconHTML = icon_name => `<i class="material-icons">${icon_name}</i>`

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button')
      const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1
      const insertLineBreakRU = ['backspace', 'ъ', 'enter', '.'].indexOf(key) !== -1
      // Add attributes/classes
      keyElement.setAttribute('type', 'button')
      keyElement.classList.add('keyboard__key')

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide')
          keyElement.innerHTML = createIconHTML('backspace')

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1)
            this._triggerEvent('oninput')
            console.log();
          })

          break

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable')
          keyElement.innerHTML = createIconHTML('keyboard_capslock')

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock()
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock)
          })

          break

        case 'enter':
          keyElement.classList.add('keyboard__key--wide')
          keyElement.innerHTML = createIconHTML('keyboard_return')

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n'
            this._triggerEvent('oninput')
          })

          break

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide')
          keyElement.innerHTML = createIconHTML('space_bar')

          keyElement.addEventListener('click', () => {
            this.properties.value += ' '
            this._triggerEvent('oninput')
          })

          break

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark')
          keyElement.innerHTML = createIconHTML('check_circle')

          keyElement.addEventListener('click', () => {
            this.close()
            this._triggerEvent('onclose')
          })

          break

          case 'tab':
          keyElement.classList.add('keyboard__key--wide')
          keyElement.innerHTML = createIconHTML('keyboard_tab')

          keyElement.addEventListener('click', () => {
            this.properties.value += '     '
            this._triggerEvent('oninput')
          })

          break

          case 'layout':
          keyElement.classList.add('keyboard__key--wide')
          keyElement.innerHTML = createIconHTML('language')

          keyElement.addEventListener('click', () => {
            console.log('object')
            this._changeKeyboardLayout()
          })

          break

        default:
          keyElement.textContent = key.toLowerCase()

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
            this._triggerEvent('oninput')
          })

          break
      }

      fragment.appendChild(keyElement)

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'))
      } 
    })

    return fragment
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value)
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
      }
    }
  },

  _changeKeyboardLayout() {
    this.properties.lang = !this.properties.lang
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || ''
    this.eventHandlers.oninput = oninput
    this.eventHandlers.onclose = onclose
    this.elements.main.classList.remove('keyboard--hidden')
  },

  close() {
    this.properties.value = ''
    this.eventHandlers.oniput = oninput
    this.eventHandlers.onclose = onclose
    this.elements.main.classList.add('keyboard--hidden')
  },
}

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.init()
  
  // Keyboard.open("dcode", function(currentValue) {
  //   console.log("value changed! here it is: " + currentValue);
  // }, function (currentValue) {
  //   console.log("keyboardc closed! Finishing value: " + currentValue)
  // });
})
