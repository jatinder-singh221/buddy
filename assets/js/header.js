document.addEventListener("DOMContentLoaded", async () => {
    try {
        const navbar = await fetch('navbar.html')
        const response = await navbar.text()
        const header = document.createElement("nav")
        header.innerHTML = response
        document.body.prepend(header)

        const location = window.location.pathname.replace('/', '')
        const link = document.getElementById(`${location}`)
        link.classList.remove('text-slate-700')
        link.classList.add('font-semibold', 'text-[#6927DA]')

        const button = document.querySelector('#menu-button')

        button.addEventListener('click', () => {
            const menu = document.getElementById('menu')
            menu.classList.toggle('hidden')
        })

    } catch (error) {
        console.error(error)
    }
})
