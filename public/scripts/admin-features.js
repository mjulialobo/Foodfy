//==NEW INGREDIENT==//

function addIngredient() {

    const ingredients = document.querySelector("#ingredients");

    const fieldContainer = document.querySelectorAll(".ingredient");

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);


    if (newField.children[0].value == "") return false;

    newField.children[0].value = "";

    ingredients.appendChild(newField);
}

const ingredients = document.querySelector(".add-ingredient")


if (ingredients) {

    ingredients.addEventListener("click", addIngredient);
}
//==NEW STEP ==//

function addPreparation() {

    const preparation = document.querySelector("#preparation");
    const fieldContainer = document.querySelectorAll(".preparation");

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    if (newField.children[0].value == "") return false;


    newField.children[0].value = "";

    preparation.appendChild(newField);
}

const preparation = document.querySelector(".add-preparation");

if (preparation) {

    preparation.addEventListener("click", addPreparation);

}

//==PAGINATION==//
function paginate(selectedPage, totalPages) {

    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {

            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(currentPage - 1)
            }
            pages.push(currentPage)

            oldPage = currentPage
        }
    }
    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}
const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
}

//==UPLOAD IMAGE -RECIPES ==//
const RecipePhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        RecipePhotosUpload.input = event.target

        if (RecipePhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            RecipePhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = RecipePhotosUpload.getContainer(image)
                RecipePhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })

        RecipePhotosUpload.input.files = RecipePhotosUpload.getAllFiles()

    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = RecipePhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite de fotos")
            event.preventDefault()
            return true
        }
        return false

    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        RecipePhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = RecipePhotosUpload.removePhoto
        div.appendChild(image)

        div.appendChild(RecipePhotosUpload.getRemoveButton())
        return div

    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "delete_outline"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode //<div class="photo">
        const photosArray = Array.from(RecipePhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        RecipePhotosUpload.files.splice(index, 1)

        RecipePhotosUpload.input.files = RecipePhotosUpload.getAllFiles()

        photoDiv.remove();
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

//==CHANGE IMAGE CHEF EDIT//

//==IMAGE GALLERY==//

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        target.classList.add('active')

        ImageGallery.highlight.src = target.src

    }

}