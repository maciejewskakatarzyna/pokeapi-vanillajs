import { html, render } from 'https://unpkg.com/lit-html@1.3.0/lit-html.js'

const main = (content) => html`
<main class="main">
    ${content}
</main>`

export default main;