//Novo ingrediente ===
function addIngredient() {

    const ingredients = document.querySelector("#ingredients");

    const fieldContainer = document.querySelectorAll(".ingredient");


    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);


    if (newField.children[0].value == "") return false;

    newField.children[0].value = "";

    ingredients.appendChild(newField);
}


const ingredients = document.querySelector('.add-ingredient')


if (ingredients)

    ingredients.addEventListener("click", addIngredient);

//Novo passo de preparo ===
function addAction() {

    const actions = document.querySelector("#actions");

    const fieldContainer = document.querySelectorAll(".action");


    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    if (newField.children[0].value == "") return false;


    newField.children[0].value = "";

    actions.appendChild(newField);
}


const action = document.querySelector('.add-action');


if (action)

    action.addEventListener("click", addAction);