import { removeAllChildNodes } from "./utils/removeAllChildNodes.js"

const section = document.querySelector('.section_wrapper')

const displayFavPoke = () => {
    const favPoke = window.localStorage.getItem('favourite_pokemon')
    const favPokeParsed = JSON.parse(favPoke)

    const pokeName = document.createElement('p')
    pokeName.textContent = favPokeParsed.name

    removeAllChildNodes(section)
    section.appendChild(pokeName)
}

window.addEventListener('DOMContentLoaded', displayFavPoke)