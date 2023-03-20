k = `c694800140a50a48da51407d7067df5ada0f2943`;

const userCountry = document.getElementById('country-input');
const userYear = document.getElementById('year-input');
const userMonth = document.getElementById('month-input');
const userDay = document.getElementById('day-input');

let countryList = [];
let holidayList = [];

handleGetCountries();
handleGetHolidays();

// API call for country list
function handleGetCountries() {
    $.ajax({
        url: `https://calendarific.com/api/v2/countries?&api_key=${k}`
    }).then(
        (data) => {
            //console.log(data.response.countries)
            countryList = data.response.countries;
            //console.log(countryList[0])
        },
        (error) => {
            console.log('bad request', error);
        }
    );
}
//console.log(countryList[0])

// API call for holidays
function handleGetHolidays(){
    $.ajax({
        url: `https://calendarific.com/api/v2/holidays?&api_key=${k}&country=US&year=2023&month=${userMonth.value}&day=${userDay.value}`
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
    console.log(holidayList.length)
}
