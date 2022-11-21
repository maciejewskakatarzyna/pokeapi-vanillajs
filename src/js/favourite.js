import { removeAllChildNodes } from "./utils/removeAllChildNodes.js"
import header from "./components/header.js";
import main from "./components/main.js";
import footer from "./components/footer.js";
import { render, html } from 'https://unpkg.com/lit-html@1.3.0/lit-html.js'

const content = html`<section class="section_wrapper">No favourite pokemon :(</section>
`

const page = html`
${header}
${main(content)}
${footer}
`
render(page, document.body)


const section = document.querySelector('.section_wrapper')

const displayFavPoke = () => {
    const favPoke = window.localStorage.getItem('favourite_pokemon')
    const favPokeParsed = JSON.parse(favPoke)

    const pokeName = document.createElement('p')
    pokeName.textContent = favPokeParsed?.name ? favPokeParsed.name : 'No favourite pokemon :('

    removeAllChildNodes(section)
    section.appendChild(pokeName)
}

window.addEventListener('DOMContentLoaded', displayFavPoke)