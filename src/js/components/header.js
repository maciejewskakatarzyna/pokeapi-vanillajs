import { html, render } from 'https://unpkg.com/lit-html@1.3.0/lit-html.js'

const header = html`
<header class="header">
    <div class="logo"><a href="/">Pokemon API - Vanilla JS</a></div>
    <nav class="nav">
        <ul class="nav_list">
            <li class="nav_list_item">
                <a class="nav_list_link" href="/all.html">All Pokemons</a>
            </li>
            <li class="nav_list_item">
                <a class="nav_list_link" href="/favourite.html">My favourite Pokemon</a>
            </li>
            <li class="nav_list_item">
                <a class="nav_list_link" href="/map.html">Pokemon Map</a>
            </li>
        </ul>
    </nav>
</header>`


export default header;