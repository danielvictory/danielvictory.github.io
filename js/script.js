k = `c694800140a50a48da51407d7067df5ada0f2943`;

const userCountry = document.getElementById('country-input');
const userYear = document.getElementById('year-input');
const userMonth = document.getElementById('month-input');
const userDay = document.getElementById('day-input');

let today = new Date();
userYear.value = today.getFullYear()
userMonth.value = today.getMonth() + 1
userDay.value = today.getDate()

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

    if (userCountry.value === 'Please Choose a Country') {
        alert('You must choose a country first!')
    } else {
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
}
//console.log(holidayList)

function renderHoliday(){
    //console.log(holidayList.length)
    if (holidayList.length > 0) {
        holidayList.forEach(holiday => {
            createCard();

            let $cardDate = $(`#card-date-${cardCount}`);
            let $cardType = $(`#card-type-${cardCount}`);
            let $cardName = $(`#card-name-${cardCount}`);
            let $cardDesc = $(`#card-desc-${cardCount}`);

            $cardDate.text(holiday.date.iso.slice(0,10));
            $cardType.text(holiday.primary_type)
            $cardName.text(holiday.name);
            $cardDesc.text(holiday.description);
        });
    } else {
        createCard();

        let $cardDate = $(`#card-date-${cardCount}`);
        let $cardType = $(`#card-type-${cardCount}`);
        let $cardName = $(`#card-name-${cardCount}`);
        let $cardDesc = $(`#card-desc-${cardCount}`);

        let countryName = nameFromIso(userCountry.value);

        $cardDate.text(`${userYear.value}-${userMonth.value}-${userDay.value}`);
        //console.log(userCountry.value)
        //console.log(nameFromIso(userCountry.value))
        $cardType.text(countryName)
        $cardName.text('None');
        $cardDesc.text(`Sadly, there is no reason to celebrate in ${countryName} on the date in question :(`);
    }
    display = true;
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

function nameFromIso(iso) {
    let countryName = countryList.find(country => country['iso-3166'] === iso)
    return countryName.country_name
}