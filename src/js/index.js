

async function getPokemons() {
    for (let id = 1; id < 21; id++) {
        let pokeapi = `https://pokeapi.co/api/v2/pokemon/${id}`
        const response = await fetch(pokeapi);
        const data = await response.json();
        const pokeName = data.name
        const pokeImgUrl = data.sprites.other['official-artwork'].front_default

        const all = document.getElementById('all')
        const pokeDiv = document.createElement('div')
        const pokeP = document.createElement('p')
        pokeP.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1)
        const pokeImg = document.createElement('img')
        pokeImg.src = pokeImgUrl

        pokeDiv.appendChild(pokeP)
        pokeDiv.appendChild(pokeImg)

        all.appendChild(pokeDiv)
    }
}


getPokemons()