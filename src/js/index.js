

async function getPokemons() {
    for (let id = 1; id < 21; id++) {
        let pokeapi = `https://pokeapi.co/api/v2/pokemon/${id}`
        const response = await fetch(pokeapi);
        const data = await response.json();
        const pokeName = data.name
        const pokeImgUrl = data.sprites.other['official-artwork'].front_default

        const pokeList = document.getElementById('pokeList')
        const pokeDiv = document.createElement('div')
        pokeDiv.classList.add('pokeWrapper')
        const pokeP = document.createElement('p')
        pokeP.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1)
        const pokeImg = document.createElement('img')
        pokeImg.src = pokeImgUrl

        pokeDiv.appendChild(pokeImg)
        pokeDiv.appendChild(pokeP)


        pokeList.appendChild(pokeDiv)
    }
}


getPokemons()
