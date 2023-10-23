const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$$('#nx_doctor .sel_list li').forEach(e => {
    e.onclick = e.dataset.selected = true;
})