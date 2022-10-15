const pokeList = document.getElementById('pokeList')
const getMorePokeBtn = document.getElementById('getMorePokemons')
const pokeDetailsCard = document.getElementById('pokeDetailsCard')
const showDetailsP = document.querySelector('p')

async function getPokeInfo(poke) {
    let url = poke.url
    const response = await fetch(url);
    const data = await response.json();
    pokemonsDetails = []
    pokemonsDetails.push(data)
    return pokemonsDetails
}

let offsetPoke = 0

function loadMore() {
    offsetPoke = offsetPoke + 20
    getPokemons()
    getDetails()
    renderPokemons()
}

getMorePokeBtn.addEventListener('click', loadMore)


async function getPokemons() {
    let pokeapi = `https://pokeapi.co/api/v2/pokemon/?offset=${offsetPoke}&limit=20`
    const response = await fetch(pokeapi);
    const data = await response.json();
    let pokemonsArr = data.results
    return pokemonsArr
}

getPokemons()

const getDetails = async function () {
    let pokemons = await getPokemons()
    let pokeDetails = await pokemons.map(pokemon => getPokeInfo(pokemon))
    return pokeDetails
}

const resolvePromisesSeq = async (tasks) => {
    const results = [];
    for (const task of tasks) {
        results.push(await task);
    }
    return results;
};

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

async function getPokeSpecies(pokeID) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokeID}/`
    const response = await fetch(url);
    const data = await response.json();
    pokemonSpecies = []
    pokemonSpecies.push(data)
    return pokemonSpecies
}

async function getPokeChain(chainURL) {
    const response = await fetch(chainURL);
    const data = await response.json();
    pokemonChain = []
    pokemonChain.push(data)
    return pokemonChain
}

const renderDetailsCard = async function (pokemon, pokeDivTop) {
    const pokeID = pokemon.id
    const pokeName = pokemon.name
    const pokeImgUrl = pokemon.sprites.other['official-artwork'].front_default
    const typesList = pokemon.types.map(t => t.type.name)
    const pokeWeightValue = pokemon.weight
    const pokeHeightValue = pokemon.height

    const species = await getPokeSpecies(pokeID)
    const evolvesList = species.map(s => (s.evolves_from_species?.name))

    const chainURL = species.map(chain => chain.evolution_chain.url)
    const chain = await getPokeChain(chainURL)
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
    const evolvesTo = document.createElement('p')
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


    if (showDetailsP) {
        showDetailsP.remove()
    }
    const topValue = (pokeDivTop - 90).toString() + "px"
    pokeDetailsCard.style.top = topValue
    pokeDetailsCard.appendChild(pokeDiv)
}

const renderPokemons = async function () {
    let pokeDetailsPromise = await getDetails()
    let pokeDetailsArr = await resolvePromisesSeq(pokeDetailsPromise)
    let pokeDetailsToRender = pokeDetailsArr.flat()

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

        pokeDiv.appendChild(pokeImg)
        pokeDiv.appendChild(pokeP)
        pokeList.appendChild(pokeDiv)
        let pokeDivTop = offset(pokeDiv).top
        pokeDiv.addEventListener('click', () => renderDetailsCard(pokemon, pokeDivTop))
    })
}

renderPokemons()

const handleInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 0.5;

    if (endOfPage) {
        setTimeout(loadMore, 500)
    }
};

window.addEventListener("scroll", handleInfiniteScroll);