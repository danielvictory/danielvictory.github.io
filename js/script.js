k = `c694800140a50a48da51407d7067df5ada0f2943`;

const userCountry = document.getElementById('country-input');
const userYear = document.getElementById('year-input');
const userMonth = document.getElementById('month-input');
const userDay = document.getElementById('day-input');

const $cardContainer = $('#card-container');

let cardCount = 0;
let display = false;
let countryList = [];
let holidayList = [];

handleGetCountries();

//handleGetHolidays();

$('form').on('submit', handleGetHolidays);

// API call for country list
function handleGetCountries() {
    $.ajax({
        url: `https://calendarific.com/api/v2/countries?&api_key=${k}`
    }).then(
        (data) => {
            //console.log(data.response.countries)
            countryList = data.response.countries;
            //console.log(countryList[0])
            countryDropdown();
        },
        (error) => {
            console.log('bad request', error);
        }
    );
    countryDropdown();
}
//console.log(countryList[0])

function countryDropdown() {
    let fragment = document.createDocumentFragment();
    //console.log(fragment)
    //console.log(countryList)
    countryList.forEach(country => {
        //console.log(countryList)
        let opt = document.createElement('option');
        opt.innerHTML = country.country_name;
        opt.value = country['iso-3166'];
        //console.log(opt)
        fragment.appendChild(opt);
        //console.log(fragment)
    });
    userCountry.appendChild(fragment);
}

// API call for holidays
function handleGetHolidays(evt){
    evt.preventDefault();
    $.ajax({
        url: `https://calendarific.com/api/v2/holidays?&api_key=${k}&country=${userCountry.value}&year=${userYear.value}&month=${userMonth.value}&day=${userDay.value}`
    }).then(
        (data) => {
            //console.log(data.response.holidays)
            holidayList = data.response.holidays;
            renderHoliday();
        },
        (error) => {
            console.log('bad request', error);
        }
    );
}
//console.log(holidayList)

function renderHoliday(){
    //console.log(holidayList.length)
    if (holidayList.length > 0) {
        holidayList.forEach(holiday => {
            createCard();

            let $cardType = $(`#card-type-${cardCount}`);
            let $cardDate = $(`#card-date-${cardCount}`);
            let $cardName = $(`#card-name-${cardCount}`);
            let $cardDesc = $(`#card-desc-${cardCount}`);

            $cardType.text(holiday.primary_type)
            $cardDate.text(holiday.date.iso);
            $cardName.text(holiday.name);
            $cardDesc.text(holiday.description);

        });
        display = true;
    }
}

function createCard() {
    if (display) {
        removeCards();
    }
    
    cardCount++;
    let newCard = document.createElement('section');

    newCard.setAttribute('id',`card-${cardCount}`);
    newCard.innerHTML = `<span id='card-date-${cardCount}'></span><br><span id='card-type-${cardCount}'></span><h3 id='card-name-${cardCount}'>New Card</h3>
    <p id='card-desc-${cardCount}'>New Desc</p>`;

    $cardContainer.append(newCard);
}

function removeCards() {
    $cardContainer.empty();
    cardCount = 0;
    display = false;
}