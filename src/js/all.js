import { resolvePromisesSeq } from "./utils/resolvePromisesSeq.js"
import { handleInfiniteScroll } from "./utils/infiniteScroll.js"
import { removeAllChildNodes } from "./utils/removeAllChildNodes.js"
import { setOffset } from "./utils/setOffset.js"

const pokeList = document.querySelector('.pokeList')
const getMorePokeBtn = document.querySelector('.getMorePokemons')
const pokeDetailsCard = document.querySelector('.pokeDetailsCard')
const noDetailsInfo = document.querySelector('.noDetailsInfo')

let offset = 0

//window.onLoad czy DOMContentLoaded?
document.addEventListener('DOMContentLoaded', getPokemons)
document.addEventListener('DOMContentLoaded', renderPokemons)

window.addEventListener("scroll", () => handleInfiniteScroll(loadMorePokemons));

getMorePokeBtn.addEventListener('click', loadMorePokemons)

async function getPokemons() {
    const pokeapi = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
    const response = await fetch(pokeapi);
    const data = await response.json();
    const pokemonsArr = data.results
    return pokemonsArr
}

//resolvePromises ???
async function renderPokemons() {
    const pokeDetailsPromise = await getDetails()
    const pokeDetailsArr = await resolvePromisesSeq(pokeDetailsPromise)
    const pokeDetailsToRender = pokeDetailsArr.flat()

    //dlaczego nie działa zmiana image.src?
    const handlePokeLike = ((image, pokemon) => {
        ((image.src === "./dist/assets/heart.svg") ? (image.src = "./dist/assets/heart2.svg") : (image.src = "./dist/assets/heart.svg"))

        localStorage.setItem("favourite_pokemon", JSON.stringify(pokemon))
        const favPoke = window.localStorage.getItem('favourite_pokemon')
        console.log(JSON.parse(favPoke))
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
        const heartIcon = document.createElement('img')
        heartIcon.classList.add('heartIcon')
        heartIcon.src = "./dist/assets/heart.svg"

        heart.addEventListener('click', () => handlePokeLike(heartIcon, pokemon))

        heart.appendChild(heartIcon)

        pokeDiv.appendChild(pokeImg)
        pokeDiv.appendChild(pokeP)
        pokeDiv.appendChild(heart)

        pokeList.appendChild(pokeDiv)

        const pokeDivTop = setOffset(pokeDiv).top

        pokeDiv.addEventListener('click', () => renderDetailsCard(pokemon, pokeDivTop))
    })
}

async function renderDetailsCard(pokemon, pokeDivTop) {
    const pokeID = pokemon.id
    const pokeName = pokemon.name
    const pokeImgUrl = pokemon.sprites.other['official-artwork'].front_default
    const typesList = pokemon.types.map(t => t.type.name)
    const pokeWeightValue = pokemon.weight
    const pokeHeightValue = pokemon.height

    const species = await getPokeSpecies(pokeID)
    const evolvesList = species.map(s => (s.evolves_from_species?.name))

    // const chainURL = species.map(chain => chain.evolution_chain.url)
    // const chain = await getPokeChain(chainURL)
    // const chainList = chain.map(c => c.chain.evolves_to.map(el => (el.species.name === pokeName) ? (((el.evolves_to.map(el => el.species.name) === pokeName)) ? 'Final form' : (el.evolves_to.map(el => el.species.name))) : (el.species.name)))

    const pokeDiv = document.createElement('div')
    pokeDiv.classList.add('pokeWrapper')
    const pokeP = document.createElement('p')
    pokeP.classList.add('pokeName')
    pokeP.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1)
    const pokeImg = document.createElement('img')
    pokeImg.src = pokeImgUrl
    const pokeType = document.createElement('p')
    const evolvesFrom = document.createElement('p')
    // const evolvesTo = document.createElement('p')
    const pokeHeight = document.createElement('p')
    const pokeWeight = document.createElement('p')
    const types = typesList.map(type => ` ${type}`)
    const evolvesF = evolvesList.map(evolves => `${evolves === undefined ? 'Initial form' : evolves}`)
    // const evolvesT = chainList.map(chain => `${chain}`)

    pokeType.textContent = `Types: ${types}`
    evolvesFrom.textContent = `Evolves from: ${evolvesF}`
    // evolvesTo.textContent = `Evolves to: ${evolvesT}`
    pokeHeight.textContent = `Height: ${pokeHeightValue}`
    pokeWeight.textContent = `Weight: ${pokeWeightValue}`

    removeAllChildNodes(pokeDetailsCard)

    pokeDiv.appendChild(pokeImg)
    pokeDiv.appendChild(pokeP)
    pokeDiv.appendChild(pokeType)
    pokeDiv.appendChild(evolvesFrom)
    // pokeDiv.appendChild(evolvesTo)
    pokeDiv.appendChild(pokeHeight)
    pokeDiv.appendChild(pokeWeight)


    if (noDetailsInfo) {
        noDetailsInfo.remove()
    }

    const topValue = (pokeDivTop - 90).toString() + "px"
    pokeDetailsCard.style.top = topValue

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

function loadMorePokemons() {
    offset = offset + 20
    getPokemons()
    getDetails()
    renderPokemons()
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

// async function getPokeChain(chainURL) {
//     const response = await fetch(chainURL);
//     const data = await response.json();
//     pokemonChain = []
//     pokemonChain.push(data)
//     return pokemonChain
// }

