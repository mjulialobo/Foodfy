const cards = document.querySelectorAll('.card')

for (let card of cards) {
    card.addEventListener('click', () => {
        const cardId = card.getAttribute('id')
        window.location.href = `/recipe/${cardId}`
    })
}

const description = document.getElementsByClassName('recipe-description')

for (let i = 0; i < description.length; i++) {
    const span = description[i].querySelector('.span')
    const content = description[i].querySelector('.content')

    span.addEventListener('click', function() {
        if (span.querySelector('span').innerHTML === 'Esconder') {
            content.classList.add('active')
            span.querySelector('span').innerText = 'Mostrar'
        } else {
            content.classList.remove('active')
            span.querySelector('span').innerText = 'Esconder'
        }
    })
}