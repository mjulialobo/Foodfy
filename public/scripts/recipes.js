const cards = document.querySelectorAll('.card')

for (let card of cards) {
    card.addEventListener('click', () => {
        const cardId = card.getAttribute('id')
        window.location.href = `/recipe/${cardId}`
    })
}

//event listener no botão
button1.addEventListener = ingredients.getAttribute('class')
    // quando clicar, se estiver mostrando, adicionar hidden e trocar texto para "MOSTRAR"
    //else tirar hidden e trocar texto para "esconder"

if (hidden) {
    onclick.remove(hidden)
} else {
    onclick.add(hidden)
}

//sempre começar mostrando tudo
const button1 = ingredients.classList.remove('hidden')