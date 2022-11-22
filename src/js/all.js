import { resolvePromisesSeq } from "./utils/resolvePromisesSeq.js"
import { removeAllChildNodes } from "./utils/removeAllChildNodes.js"
import { html, render } from 'https://unpkg.com/lit-html@1.3.0/lit-html.js'
import header from "./components/header.js";
import main from "./components/main.js";
import footer from "./components/footer.js";

const content = html`<div class="pokeDiv">
    <div class="pokeListWrapper">
        <section class="pokeList"></section>
        <div id="paginationWrapper"></div>
    </div>
    <section class="pokeDetails">
        <p class="noDetailsInfo">
            Click the pokemon to see detailed information!
        </p>
        <div class="pokeDetailsCard"></div>
    </section>
</div>
`

const page = html`
${header}
${main(content)}
${footer}
`
render(page, document.body)

const pokeList = document.querySelector('.pokeList')
const pokeDetailsCard = document.querySelector('.pokeDetailsCard')
const noDetailsInfo = document.querySelector('.noDetailsInfo')
const paginationWrapper = document.getElementById('paginationWrapper')

document.addEventListener('DOMContentLoaded', getPokemons)
document.addEventListener('DOMContentLoaded', renderPokemons)
document.addEventListener('DOMContentLoaded', renderNumberOfPages)

let offset = 0
let currentPage = 1
let pages

const prevBtn = document.createElement('button');
const nextBtn = document.createElement('button');

async function getPokemons() {
    const pokeapi = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
    const response = await fetch(pokeapi);
    const data = await response.json();
    const pokemonsArr = data.results
    return pokemonsArr
}

async function renderPokemons() {
    removeAllChildNodes(pokeList)

    const pokeDetailsPromise = await getDetails()
    const pokeDetailsArr = await resolvePromisesSeq(pokeDetailsPromise)
    const pokeDetailsToRender = pokeDetailsArr.flat()

    const handlePokeLike = ((button, pokemon) => {


        if (button.dataset.active != 'true') {
            button.dataset.active = 'true';
        } else {
            button.dataset.active = "false"
        }

        localStorage.setItem("favourite_pokemon", JSON.stringify(pokemon))
    })

    pokeDetailsToRender.map(pokemon => {
        const pokeName = pokemon.name
        const pokeImgUrl = pokemon.sprites.other['official-artwork'].front_default
        const pokeDiv = document.createElement('div')
        pokeDiv.classList.add('pokeWrapper')
        const pokeP = document.createElement('p')
        pokeP.classList.add('pokeName')
        pokeP.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1)
        const pokeImg = document.createElement('img')
        pokeImg.src = pokeImgUrl
        const heart = document.createElement('button')
        heart.classList.add('heartBtn')

        const icon = html`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.15"
                d="M4.3314 12.0474L12 20L19.6686 12.0474C20.5211 11.1633 21 9.96429 21 8.71405C21 6.11055 18.9648 4 16.4543 4C15.2487 4 14.0925 4.49666 13.24 5.38071L12 6.66667L10.76 5.38071C9.90749 4.49666 8.75128 4 7.54569 4C5.03517 4 3 6.11055 3 8.71405C3 9.96429 3.47892 11.1633 4.3314 12.0474Z"
                fill="none" />
            <path
                d="M4.3314 12.0474L12 20L19.6686 12.0474C20.5211 11.1633 21 9.96429 21 8.71405C21 6.11055 18.9648 4 16.4543 4C15.2487 4 14.0925 4.49666 13.24 5.38071L12 6.66667L10.76 5.38071C9.90749 4.49666 8.75128 4 7.54569 4C5.03517 4 3 6.11055 3 8.71405C3 9.96429 3.47892 11.1633 4.3314 12.0474Z"
                stroke="gray" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        `

        render(icon, heart)

        heart.addEventListener('click', () => handlePokeLike(heart, pokemon))

        pokeDiv.appendChild(pokeImg)
        pokeDiv.appendChild(pokeP)
        pokeDiv.appendChild(heart)

        pokeList.appendChild(pokeDiv)

        pokeDiv.addEventListener('click', () => renderDetailsCard(pokemon))
    })
}

async function renderDetailsCard(pokemon) {
    const pokeID = pokemon.id
    const pokeName = pokemon.name
    const pokeImgUrl = pokemon.sprites.other['official-artwork'].front_default
    const typesList = pokemon.types.map(t => t.type.name)
    const pokeWeightValue = pokemon.weight
    const pokeHeightValue = pokemon.height

    const species = await getPokeSpecies(pokeID)
    const evolvesList = species.map(s => (s.evolves_from_species?.name))

    const pokeDiv = document.createElement('div')
    pokeDiv.classList.add('pokeWrapper')
    const pokeP = document.createElement('p')
    pokeP.classList.add('pokeName')
    pokeP.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1)
    const pokeImg = document.createElement('img')
    pokeImg.src = pokeImgUrl
    const pokeType = document.createElement('p')
    const evolvesFrom = document.createElement('p')
    const pokeHeight = document.createElement('p')
    const pokeWeight = document.createElement('p')
    const types = typesList.map(type => ` ${type}`)
    const evolvesF = evolvesList.map(evolves => `${evolves === undefined ? 'Initial form' : evolves}`)

    pokeType.textContent = `Types: ${types}`
    evolvesFrom.textContent = `Evolves from: ${evolvesF}`
    pokeHeight.textContent = `Height: ${pokeHeightValue}`
    pokeWeight.textContent = `Weight: ${pokeWeightValue}`

    removeAllChildNodes(pokeDetailsCard)

    pokeDiv.appendChild(pokeImg)
    pokeDiv.appendChild(pokeP)
    pokeDiv.appendChild(pokeType)
    pokeDiv.appendChild(evolvesFrom)
    pokeDiv.appendChild(pokeHeight)
    pokeDiv.appendChild(pokeWeight)

    if (noDetailsInfo) {
        noDetailsInfo.remove()
    }

    pokeDetailsCard.appendChild(pokeDiv)
}

async function getPokeInfo(pokemon) {
    const url = pokemon.url
    const response = await fetch(url);
    const data = await response.json();
    const pokemonsDetails = []
    pokemonsDetails.push(data)
    return pokemonsDetails
}

function loadMorePokemons(index) {
    if (index !== 1) {
        if (index !== 2) {
            offset = index * 20
        }
        else {
            offset = index * 10
        }
    }
    else {
        offset = 0
    }
    currentPage = index;

    (currentPage === 1) ? (prevBtn.disabled = true) : (prevBtn.disabled = false);
    (currentPage === pages) ? (nextBtn.disabled = true) : (nextBtn.disabled = false);

    getPokemons()
    getDetails()
    renderPokemons()
}

async function getNumberOfPages() {
    const url = `https://pokeapi.co/api/v2/pokemon`
    const response = await fetch(url);
    const data = await response.json();
    const pokemonsCount = data.count
    const numberOfPages = Math.ceil(pokemonsCount / 20) - 1
    return numberOfPages
}

async function renderNumberOfPages() {
    pages = await getNumberOfPages();
    (currentPage === 1) ? (prevBtn.disabled = true) : (prevBtn.disabled = false);

    function handleNextPage() {
        const nextPageIndex = (currentPage + 1)
        if (nextPageIndex > pages) {
            currentPage = currentPage
        }
        else { currentPage = nextPageIndex }
        loadMorePokemons(currentPage)
    }

    function handlePrevPage() {
        const prevPageIndex = (currentPage - 1)
        if (prevPageIndex < 1) {
            currentPage = currentPage
        }
        else {
            currentPage = prevPageIndex
        }
        loadMorePokemons(currentPage);
    }

    prevBtn.innerHTML = '&lt'
    nextBtn.innerHTML = '&gt'
    paginationWrapper.appendChild(prevBtn)
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button')
        btn.textContent = i
        btn.addEventListener('click', () => loadMorePokemons(i));
        paginationWrapper.appendChild(btn);
    }
    paginationWrapper.appendChild(nextBtn)

    prevBtn.addEventListener('click', handlePrevPage);
    nextBtn.addEventListener('click', handleNextPage);
}

async function getDetails() {
    const pokemons = await getPokemons()
    const pokeDetails = await pokemons.map(pokemon => getPokeInfo(pokemon))
    return pokeDetails
}

async function getPokeSpecies(pokeID) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokeID}/`
    const response = await fetch(url);
    const data = await response.json();
    const pokemonSpecies = []
    pokemonSpecies.push(data)
    return pokemonSpecies
}
