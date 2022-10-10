const pokeList = document.getElementById('pokeList')
const getMorePokeBtn = document.getElementById('getMorePokemons')

async function getPokeInfo(poke) {
    let url = poke.url
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
}

let offset = 0

function loadMore() {
    offset = offset + 20
    getPokemons()
    getDetails()
}

getMorePokeBtn.addEventListener('click', loadMore)


async function getPokemons() {
    let pokeapi = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
    const response = await fetch(pokeapi);
    const data = await response.json();
    let pokemonsArr = data.results

    return pokemonsArr

    // const pokeName = data.name
    // const pokeImgUrl = data.sprites.other['official-artwork'].front_default

    // const handleGetPokeInfo = () => {
    //     console.log(data)
    // }

    // const pokeDiv = document.createElement('div')
    // pokeDiv.addEventListener('click', handleGetPokeInfo)
    // pokeDiv.classList.add('pokeWrapper')
    // const pokeP = document.createElement('p')
    // pokeP.classList.add('pokeName')
    // pokeP.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1)
    // const pokeImg = document.createElement('img')
    // pokeImg.src = pokeImgUrl

    // pokeDiv.appendChild(pokeImg)
    // pokeDiv.appendChild(pokeP)

    // pokeList.appendChild(pokeDiv)
    // getMorePokeBtn.style.display = 'block'
}

getPokemons()

// const getDetails = () => {
//     pokemonsArr.map(pokemon => getPokeInfo(pokemon))
// }



const getDetails = () => {
    let pokemons = getPokemons()
    pokemons.then(result => console.log(result))
}

getDetails()


