/*=== NAV FONT-WEIGHT === */
const currentPage = location.pathname;
const menuItens = document.querySelectorAll('.header-nav .menu-drop a');

for (const item of menuItens) {
  if (currentPage == (item.getAttribute('href'))) {
    item.classList.add('active');
    item.parentNode.parentNode.querySelector('p').classList.add('active')
  }
}

const ButtonPreventDefault = {
  apply(event, func) {
    ButtonPreventDefault[func](event)
  },
  delete(event) {

    const confirmation = confirm("Você realmente deseja realizar essa exclusão?")
    if (!confirmation) {
      event.preventDefault()
    }
  }
}

const buttonActions = {
  input: "",
  toggleButton(event) {
    buttonActions.input = event.target

    if (buttonActions.input.innerHTML == 'ESCONDER') {
      buttonActions.input.innerHTML = 'MOSTRAR'

      const parent = buttonActions.input.parentElement.parentElement.querySelector('.toggle-content')
      parent.classList.add('hide')
    } else {
      buttonActions.input.innerHTML = 'ESCONDER'

      const parent = buttonActions.input.parentElement.parentElement.querySelector('.toggle-content')
      parent.classList.remove('hide')
    }
  }
}
const addFields = {
  input: "",
  parent: "",
  container: "",

  add(event) {
    addFields.input = event.target
    addFields.parent = addFields.input.parentElement
    addFields.container = addFields.parent.querySelector('.field-container').lastElementChild

    const newField = addFields.container.cloneNode(true)

    if (newField.children[0].value === '') return;

    newField.children[0].value = '';
    addFields.parent.querySelector('.field-container').appendChild(newField);
  },
  remove(event) {
    addFields.input = event.target
    addFields.parent = addFields.input.parentElement.parentElement

    console.log(addFields.parent.parentElement.children);
    

    if (addFields.parent.parentElement.children.length > 1) {
      if (addFields.parent.querySelector('input').value == "") {
        return
      } else {
        addFields.parent.parentElement.removeChild(addFields.parent)
      }
    }
  }
}
const ImagesUpload = {
  input: "",
  preview: document.querySelector('#images-preview'),
  uploadLimit: "",
  files: [],

  handleFileInput(event, limit) {
    const {
      files: fileList
    } = event.target;
    
    ImagesUpload.input = event.target

    ImagesUpload.uploadLimit = limit    

    if (ImagesUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {

      ImagesUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const div = ImagesUpload.getContainer(image)

        ImagesUpload.preview.appendChild(div)

      }

      reader.readAsDataURL(file)
    })

    ImagesUpload.input.files = ImagesUpload.getAllFiles()
  },
  hasLimit(event) {
    const {
      uploadLimit,
      input,
      preview
    } = ImagesUpload;

    const {
      files: fileList
    } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens`)
      event.preventDefault();
      return true
    }

    const imagesDiv = [];

    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'image') {
        imagesDiv.push(item)
      }
    })

    const totalImages = fileList.length + imagesDiv.length
    if (totalImages > uploadLimit) {
      alert("Você está ultrapassando o limite de imagens!")
      event.preventDefault();
      return true
    }

    return false
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    ImagesUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    const div = document.createElement('div')

    div.classList.add('image')

    div.onclick = ImagesUpload.removeImage

    div.appendChild(image)
    div.appendChild(ImagesUpload.getRemoveButton())

    return div
  },
  getRemoveButton() {
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = 'close';
    return button
  },
  removeImage(event) {
    const imageDiv = event.target.parentNode // <div class='image'>
    const imagesArray = Array.from(ImagesUpload.preview.children)
    const index = imagesArray.indexOf(imageDiv)

    console.log(imagesArray);

    ImagesUpload.files.splice(index - 1, 1)
    ImagesUpload.input.files = ImagesUpload.getAllFiles()

    imageDiv.remove();
  },
  removeOldImage(event) {
    const imageDiv = event.target.parentNode

    if (imageDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if (removedFiles) {
        removedFiles.value += `${imageDiv.id}, `

      }
    }

    imageDiv.remove()
  }
}
const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),

  setImage(event) {
    const {
      target
    } = event;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')

    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src
  }
}
const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
  open() {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.bottom = 0
    Lightbox.closeButton.style.top = 0
  },
  close() {
    Lightbox.target.style.opacity = 0
    Lightbox.target.style.top = "-100%"
    Lightbox.target.style.bottom = 'initial'
    Lightbox.closeButton.style.top = "-80px"
  }
}
const Validate = {
  apply(input, func) {

    Validate.clearErrors(input)

    let results = Validate[func](input.value)
    input.value = results.value

    if (results.error)
      Validate.displayError(input, results.error)
  },
  displayError(input, error) {
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.focus
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error')
    if (errorDiv)
      errorDiv.remove()
  },
  isEmail(value) {
    let error = null
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!value.match(emailFormat))
      error = 'Email inválido'

    return {
      error,
      value
    }
  }
}