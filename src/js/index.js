const pokeList = document.getElementById('pokeList')
const getMorePokeBtn = document.getElementById('getMorePokemons')
const pokeDetailWrapper = document.getElementById('pokeDetails')
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

let offset = 0

function loadMore() {
    offset = offset + 20
    getPokemons()
    getDetails()
    renderPokemons()
}

getMorePokeBtn.addEventListener('click', loadMore)


async function getPokemons() {
    let pokeapi = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
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

const renderDetailsCard = (pokemon, pokeDivOffsetTop) => {
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
    if (showDetailsP) {
        showDetailsP.remove()
    }
    removeAllChildNodes(pokeDetailsCard)
    pokeDetailsCard.appendChild(pokeDiv)
    const topValue = pokeDivOffsetTop.toString()
    pokeDetailWrapper.style.top = topValue + "px"

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
        let pokeDivOffsetTop = pokeDiv.offsetTop
        pokeDiv.addEventListener('click', () => renderDetailsCard(pokemon, pokeDivOffsetTop))

    })
}

renderPokemons()