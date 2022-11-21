import header from "./components/header.js";
import main from "./components/main.js";
import footer from "./components/footer.js";
import { render, html } from 'https://unpkg.com/lit-html@1.3.0/lit-html.js'

const content = html`<section class="section_wrapper">MAP</section>`

const page = html`
${header}
${main(content)}
${footer}
`
render(page, document.body)