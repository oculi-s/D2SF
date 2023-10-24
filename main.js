const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const _$ = document.createElement.bind(document);

const list = $('#nx_doctor .cht_list');
const addUserChat = inner => {
    const chat = _$('li');
    chat.classList.add('cht_user');
    const txt = _$('div');
    txt.classList.add('cht_txt');
    txt.innerHTML = inner;

}

const addDocChat = inner => {

}

$$('#nx_doctor .sel_list li').forEach(e => {
    e.onclick = () => {
        e.dataset.selected = true;

    }
})