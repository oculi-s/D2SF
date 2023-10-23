const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const list = $('#nx_doctor .cht_list');
const addUserChat = () => {

}

$$('#nx_doctor .sel_list li').forEach(e => {
    e.onclick = () => {
        e.dataset.selected = true;

    }
})