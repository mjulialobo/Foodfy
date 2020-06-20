const cards = document.querySelectorAll('.card')
const modalOverlay = document.querySelector('.modal-overlay')

for (let card of cards) {
    card.addEventListener('click', () => {
        const cardId = card.getAttribute('id')
        const cardName = card.querySelector('h3').innerText
        const cardAuthor = card.querySelector('p').innerText
        modalOverlay.classList.add('active')
        modalOverlay.querySelector('img').src = `/assets/${cardId}`;
        modalOverlay.querySelector('h3').innerText = `${cardName}`
        modalOverlay.querySelector('p').innerText = `${cardAuthor}`
    })
}

document.querySelector('.close').addEventListener('click', () => {
    modalOverlay.classList.remove('active')
    modalOverlay.querySelector("img").src = ""
    modalOverlay.querySelector('h3').innerText = ''
    modalOverlay.querySelector('p').innerText = ''
})