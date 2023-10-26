const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const _$ = document.createElement.bind(document);
const list = $('#nx_doctor .cht_list');
const sel = $('#nx_doctor .sel_list');
const send = $('#nx_doctor #cht_send');

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
const addUserChat = async (inner) => {
    const chat = _$('li');
    const txt = _$('div');
    chat.classList.add('cht_user');
    txt.classList.add('cht_txt');
    if (!inner) {
        txt.dataset.filled = false;
        const dots = _$('span');
        dots.classList.add('jumping-dots');
        for (let i = 1; i <= 3; i++) {
            let dot = _$('span');
            dot.classList.add(`dot-${i}`);
            dot.innerHTML = '.';
            dots.appendChild(dot);
        }
        txt.appendChild(dots);
    } else {
        txt.innerHTML = inner;
    }
    chat.appendChild(txt);
    list.appendChild(chat);
    list.scrollTo(0, list.scrollHeight);
}

const addUserSelMulti = async (option = [], answer = []) => {
    return new Promise(async (resolve, reject) => {
        await sleep(500);
        for await (let e of option) {
            const opt = _$('li');
            opt.innerHTML = e;
            opt.dataset.selected = false;
            sel.append(opt);
            opt.onclick = () => {
                if (opt.dataset.selected == "false") {
                    opt.dataset.selected = true;
                } else {
                    opt.dataset.selected = false;
                }
            }
        }
        send.onclick = async c => {
            // dots.innerHTML = $$('.sel_list li[data-selected=true]').map(e => e.innerHTML).join(', ');
            const dots = $('.cht_user .cht_txt[data-filled=false]');
            dots.innerHTML = answer.join(', ');
            dots.dataset.filled = true;
            sel.innerHTML = '';
            send.onclick = null;
            resolve(true);
        }
        // await sleep(500);
        await addUserChat();
    })
}
const addUserSel = async (option = [], answer = []) => {
    return new Promise(async (resolve, reject) => {
        await sleep(500);
        for await (let e of option) {
            const opt = _$('li');
            opt.innerHTML = e;
            opt.dataset.selected = false;
            sel.append(opt);
            opt.onclick = async c => {
                opt.dataset.selected = true;
                const dots = $('.cht_user .cht_txt[data-filled=false]');
                // dots.innerHTML = e;
                dots.innerHTML = answer;
                dots.dataset.filled = true;
                sel.innerHTML = '';
                resolve(true);
            }
        }
        // await sleep(500);
        await addUserChat();
    })
}
const addDocChat = async (inner, delay = 0, dots = false) => {
    return new Promise(async (resolve, reject) => {
        const chat = _$('li');
        const txt = _$('div');
        chat.classList.add('cht_doc');
        txt.classList.add('cht_txt');
        if (dots) {
            txt.dataset.filled = false;
            const dots = _$('span');
            dots.classList.add('jumping-dots');
            for (let i = 1; i <= 3; i++) {
                let dot = _$('span');
                dot.classList.add(`dot-${i}`);
                dot.innerHTML = '.';
                dots.appendChild(dot);
            }
            txt.appendChild(dots);
            chat.appendChild(txt);
            list.appendChild(chat);
            list.scrollTo(0, list.scrollHeight);
            setTimeout(() => {
                txt.innerHTML = inner;
                resolve(true);
            }, delay);
        } else {
            await sleep(delay);
            txt.innerHTML = inner;
            chat.appendChild(txt);
            list.appendChild(chat);
            list.scrollTo(0, list.scrollHeight);
            resolve(true);
        }
    })
}

const searchUrl = (query) => `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`
const addChatResult = async (info = [], delay = 0) => {
    await sleep(delay);
    const res = _$('div');
    res.classList.add('result');
    for await (let { name, src, per } of info) {
        const anchor = _$('a');
        anchor.href = searchUrl(name);
        anchor.classList.add('result_item');

        const nm = _$('div');
        const img = _$('img');
        const pr = _$('div');
        nm.classList.add('result_name');
        nm.innerHTML = name;
        img.src = src;
        pr.innerHTML = `유사도 <b>${per}</b>`;

        anchor.appendChild(img);
        anchor.appendChild(nm);
        anchor.appendChild(pr);

        res.appendChild(anchor);
    }
    const chat = _$('li');
    const txt = _$('div');
    chat.classList.add('cht_doc');
    txt.classList.add('cht_txt');
    txt.innerHTML = res.outerHTML;
    chat.appendChild(txt);
    list.appendChild(chat);
    list.scrollTo(0, list.scrollHeight);
}


const addSearchRes = async (info = [], delay = 0) => {
    $('#nx_doc_map').style.display = 'block';
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var { latitude, longitude } = pos.coords;
        console.log(pos.coords)
        var mapOptions = {
            center: new naver.maps.LatLng(latitude, longitude),
            zoom: 16,
            scaleControl: false,
            logoControl: false,
            mapDataControl: false,
            zoomControl: true,
            minZoom: 6
        }
        var map = new naver.maps.Map('map', mapOptions);
        var frame = _$('iframe');
        var params = {
            query: '내과',
            x: longitude,
            y: latitude,
            clientX: longitude,
            clientY: latitude,
            bounds: `${longitude * 0.99}%3B${latitude * 0.99}%3B${longitude * 1.01}%3B${latitude * 1.01}`,
            filterBooking: true,
            filterSpecialist: true
        }
        frame.src = './map/index.html'
        // frame.src = `https://pcmap.place.naver.com/hospital/list?${new URLSearchParams(params).toString()}`
        $('#book').appendChild(frame);
    };

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
}

(async () => {
    // await addDocChat('안녕하세요. 여러분 옆에 작은 의사, 네이버 닥터입니다.')
    // await addDocChat('"<b>속이 쓰릴때</b>"를 검색해 주셔서 네이버 닥터가 도와드리려고 찾아왔어요.', 500);
    // await addDocChat('혹시 가슴이 아프신가요?', 500);
    // await addUserSel(['네', '아니요'], '아니요');
    // await addDocChat("배변을 보면 속쓰림이 완화되시나요?", 500);
    // await addUserSel(['네', '아니요'], '아니요');
    // await addDocChat("최근에 스트레스를 심하게 받은 일이 있으신가요?", 500);
    // await addUserSel(['네', '아니요'], '아니요');
    // await addDocChat("이중에 복용하시는 약이 있나요?", 500);
    // await addUserSelMulti(['아스피린', '진통제', '항생제', '제산제', '스테로이드 (하이손, 캘코트)', '없음'], ['없음']);

    // await addDocChat("최근 1개월 이내에 급격한 체중감소가 있었나요?", 500);
    // await addUserSel(['네', '아니요'], '아니요');
    // await addDocChat("최근 1개월 이내에 변이 빨갛거나 검은색인 적이 있었나요?", 500);
    // await addUserSel(['네', '아니요'], '아니요');
    // await addDocChat("최근 음식을 삼키기 어려운 적이 있었나요?", 500);
    // await addUserSel(['네', '아니요'], '아니요');

    // await addDocChat("최근 2년 이내 위/대장내시경을 받으셨나요?", 500);
    // await addUserSel(['네', '아니요'], '네');
    // await addDocChat("내시경 검사에서 다음과 같은 말을 들어보신 적이 있나요?", 500);
    // await addUserSelMulti(['암/덩어리가 있다.', '위/대장에 궤양이 많다.', '용종/폴립이 다수 존재한다.', '심각한 병으로 오랜기간 치료를 받아야 한다.', '없음/기억나지 않음'], ['없음/기억나지 않음']);
    // await addDocChat("기름진 음식을 많이 드시나요?", 500);
    // await addUserSel(['네', '아니요'], '네');
    // await addDocChat("얼굴이 노랗고 눈의 흰자가 노란색인가요?", 500);
    // await addUserSel(['네', '아니요'], '아니요');

    // await addDocChat("속이 쓰릴 때 설사를 같이 하나요?", 500);
    // await addUserSel(['네', '아니요'], '아니요');

    // await addDocChat("밤늦게 식사를 하고 바로 눕는 습관이 있나요?", 500);
    // await addUserSel(['네', '아니요'], '네');
    // await addDocChat("명치에 타는 듯한 통증이 있나요?", 500);
    // await addUserSel(['네', '아니요'], '네');
    // await addDocChat("누우면 더 아픈가요?", 500);
    // await addUserSel(['네', '아니요'], '네');

    await addDocChat("네이버 닥터의 진단결과 아래의 질병이 의심됩니다.", 2000, true);
    await addChatResult([
        { name: "위식도 역류질환", src: "./source/disease/위식도_역류_질환.jpg", per: "89%" },
        { name: "위궤양", src: "./source/disease/위궤양.jpg", per: "55%" },
        { name: "위마비", src: "./source/disease/위마비.jpg", per: "34%" },
        { name: "기능성 소화불량", src: "./source/disease/기능성_소화불량.jpg", per: "12%" },
        { name: "유당불내증", src: "./source/disease/유당불내증.jpg", per: "3%" }
    ], 1000);
    await addDocChat(`이런 증상에 대해 <b>93%</b>의 전문의는 <a class="result_doc" href=${searchUrl('위식도 역류질환')}>위식도 역류질환</a>을 진단했어요.`, 2000, true);

    await addDocChat("검색 결과에 이 질환들을 치료할 수 있는 병원을 추가했어요. 지금 네이버 예약을 통해 예약하고 전문가의 상담을 받아보세요.", 3000, true);
    await addSearchRes();
    await addDocChat("* 네이버 닥터의 진단 결과는 의학 전문가의 소견이 아닙니다. 자신의 건강 상태에 대해 참고하는 용도로 사용하시기 바랍니다.", 500);
})();