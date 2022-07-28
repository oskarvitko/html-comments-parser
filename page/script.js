const form = document.querySelector('form')

form.addEventListener('submit', callback)

const URL = `http://localhost:3333`

const loader = document.querySelector('.loader')

async function longpooling() {
    try {
        const response = await fetch(URL)
        if (response.status === 200) {
            loader.classList.remove('active')
        }
    } catch (e) {
        longpooling()
    }
}

longpooling()

async function callback(e) {
    e.preventDefault()
    const input = form.path
    const error = document.querySelector('.error-message')
    const info = document.querySelector('.info-message')
    const path = input.value

    clearError()

    var reg = new RegExp(/^([a-z]:((\\|\/|\\\\|\/\/))|(\\\\|\/\/))[^<>:"|?*]+/i)

    if (!path.match(reg)) return showError('Invalid path!')

    const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({ path }),
        headers: { 'content-type': 'application/json' },
    })
    const data = await response.json()

    showMessage(data.message.replaceAll('\n', '<br>'))

    form.reset()

    function showMessage(message) {
        info.innerHTML = message
        info.classList.add('active')
    }

    function showError(message) {
        error.textContent = message
        error.classList.add('active')
        input.classList.add('error')
    }

    function clearError() {
        input.classList.remove('error')
        error.classList.remove('active')
    }
}
