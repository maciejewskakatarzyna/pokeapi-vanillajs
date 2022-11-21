import header from "./components/header.js";
import main from "./components/main.js";
import footer from "./components/footer.js";
import { render, html } from 'https://unpkg.com/lit-html@1.3.0/lit-html.js'

const content = html`<section class="section_wrapper">
    <div class="section_desc">
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            reiciendis, at laudantium eos quibusdam sequi, tenetur blanditiis,
            mollitia itaque fugit sunt fugiat et esse? Repellat doloremque
            asperiores reiciendis magni fugit.
        </p>
    </div>
    <div class="section_img"></div>
</section>
<section class="section_wrapper">
    <div class="section_img"></div>
    <div class="section_desc">
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            reiciendis, at laudantium eos quibusdam sequi, tenetur blanditiis,
            mollitia itaque fugit sunt fugiat et esse? Repellat doloremque
            asperiores reiciendis magni fugit.
        </p>
    </div>
</section>
<section class="section_wrapper">
    <div class="section_desc">
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            reiciendis, at laudantium eos quibusdam sequi, tenetur blanditiis,
            mollitia itaque fugit sunt fugiat et esse? Repellat doloremque
            asperiores reiciendis magni fugit.
        </p>
    </div>
    <div class="section_img"></div>
</section>`

const page = html`
${header}
${main(content)}
${footer}
`
render(page, document.body)