// COMPONENTS
const DATE_TEXT = document.querySelector('.date-picker h1')
const CALENDAR_CONTAINER = document.querySelector('.calendar')
const TEMP_TEXT = document.querySelector('.temp')
const ICON_TEXT = document.querySelector('.icon')
const CITY_TEXT = document.querySelector('.city h1')
const COUNTRY_TEXT = document.querySelector('.city h2')
const HOLIDAY_TEXT = document.querySelector('#holiday-name')

// INIT
moment.locale('id')
const NOW = moment()
let HOLIDAYS = null
const LOCATOIN = {
    lat : null,
    long : null
}
const ICON = new Map()
initIcon()
init()

async function init() {
    await getHoliday(NOW.year(), NOW.month() + 1)
    await getLocationPermission()
}

// SET DATE AND GENERATE CALENDAR
function setCalender() {
    DATE_TEXT.innerHTML = NOW.format('MMMM YYYY')
    const CALENDER_TIME = generateCalendarArray(NOW.year(), NOW.month() + 1)

    for (const week of CALENDER_TIME) {
        // Create Week
        const WEEK_CONTAINER = document.createElement('div')
        WEEK_CONTAINER.classList.add('days')
        let i = 1
        for (const days of week) {
            // Create Day
            const DAY_CONTAINER = document.createElement('div')
            DAY_CONTAINER.classList.add('box')

            // Create Date
            const TEXT_DAYS = document.createElement('span')
            TEXT_DAYS.innerHTML = days.date

            // If Not Current Month
            if (!days.is_date) DAY_CONTAINER.classList.add('not')

            // If In Holiday
            if (HOLIDAYS.find(holiday => holiday.holiday_date === days.datetime)) {
                TEXT_DAYS.classList.add('holiday')
            }
            
            // If Today
            if (days.datetime === NOW.format('YYYY-MM-DD')) {
                TEXT_DAYS.classList.add('today')
                if (HOLIDAYS.find(holiday => holiday.holiday_date === days.datetime)) {
                    HOLIDAY_TEXT.textContent = HOLIDAYS.find(holiday => holiday.holiday_date === days.datetime).holiday_name
                }
            }
            
            // If Sunday
            if (i === 7) DAY_CONTAINER.classList.add('holiday') 

            DAY_CONTAINER.appendChild(TEXT_DAYS)
            WEEK_CONTAINER.appendChild(DAY_CONTAINER)

            i++
        }

        CALENDAR_CONTAINER.appendChild(WEEK_CONTAINER)
    }    
}

// UTILITY
async function getHoliday(year, month) {
    let allHolidays = null
    if (getLocalStorage('holidays')) {
        allHolidays =  getLocalStorage('holidays')
    } else {
        const data = await axios.get('https://api-harilibur.vercel.app/api?year=2024')
    
        const newHoliday = data.data.map(holiday => {
            let [year, month, day] = holiday.holiday_date.split('-')
            
            month = month.padStart(2, '0')
            day = day.padStart(2, '0')
            
            holiday.holiday_date = `${year}-${month}-${day}`
            
            return holiday
        })
        setLocalStorage('holidays', newHoliday)
        allHolidays = data.data
    }

    HOLIDAYS = allHolidays.filter(holiday => {
        const holidayDate = new Date(holiday.holiday_date);
        return holidayDate.getFullYear() === year && (holidayDate.getMonth() + 1) === month;
    });

    setCalender()

}

function generateCalendarArray(year, month) {
    const startOfMonth = moment([year, month - 1]).startOf('month')
    const endOfMonth = moment([year, month - 1]).endOf('month')

    let calendar = []
    let week = []
    let currentDay = startOfMonth.clone().startOf('week').add(1, 'day')

    while (currentDay.isBefore(endOfMonth.clone().endOf('week').add(1, 'day'))) {
        week.push({
            date: currentDay.date(),
            is_date: currentDay.isSame(startOfMonth, 'month'),
            datetime: currentDay.format('YYYY-MM-DD')
        });

        if (week.length === 7) {
            calendar.push(week)
            week = []
        }

        currentDay.add(1, 'day')
    }

    // Memastikan kalender memiliki 6 minggu
    while (calendar.length < 6) {
        const lastDate = calendar[calendar.length - 1][6]
        week = []

        for (let i = 1; i <= 7; i++) {
            let newDay = moment(lastDate.date, 'D').add(i, 'day')
            week.push({
                date: newDay.date(),
                is_date: false,
                datetime: newDay.format('YYYY-MM-DD')
            });
        }
        calendar.push(week)
    }

    return calendar
}

async function getLocationPermission() {
    // Mengecek apakah browser mendukung Geolocation API
    if (navigator.geolocation) {
        // Meminta izin lokasi dan mendapatkan posisi saat ini
        navigator.geolocation.getCurrentPosition(
            // Callback untuk ketika izin diberikan dan lokasi diperoleh
            function(position) {
                LOCATOIN.lat = position.coords.latitude;
                LOCATOIN.long = position.coords.longitude;
                console.log(`Latitude: ${LOCATOIN.lat}, Longitude: ${LOCATOIN.long}`);

                getWeather()
            },
            // Callback untuk ketika izin ditolak atau terjadi kesalahan
            function(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        console.error("Izin lokasi ditolak oleh pengguna.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error("Informasi lokasi tidak tersedia.");
                        break;
                    case error.TIMEOUT:
                        console.error("Permintaan lokasi melebihi batas waktu.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.error("Terjadi kesalahan yang tidak diketahui.");
                        break;
                }
            }
        );
    } else {
        console.error("Geolocation tidak didukung oleh browser ini.");
    }

}

async function getWeather() {
    const data = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${LOCATOIN.lat}&longitude=${LOCATOIN.long}&current=temperature_2m,is_day,weather_code`)
    const country = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${LOCATOIN.lat}&lon=${LOCATOIN.long}&zoom=10&addressdetails=1`)

    // Render Temperature
    const DATA = data.data.current
    const temp = DATA.temperature_2m
    TEMP_TEXT.innerHTML = `${temp}<sup>o</sup> C`

    // Render Icon
    let icon = ICON.get(DATA.weather_code)
    if ([0, 1].includes(DATA.weather_code) && DATA.is_day === 0) {
        icon = '🌙'
    }
    ICON_TEXT.textContent = icon

    // Render Country
    CITY_TEXT.textContent = country.data.name
    COUNTRY_TEXT.textContent = country.data.address.country

}

function formatHolidaysDate(holidays) {
    return holidays.map(holiday => {
        let [year, month, day] = holiday.holiday_date.split('-');
        
        // Tambahkan nol di depan bulan atau hari jika perlu
        month = month.padStart(2, '0');
        day = day.padStart(2, '0');
        
        // Gabungkan kembali ke format YYYY-MM-DD
        holiday.holiday_date = `${year}-${month}-${day}`;
        
        return holiday;
    });
}

function initIcon() {
    addMapping([0, 1], '☀️') //Cerah
    addMapping([2, 3], '☁️') // Berawan
    addMapping([61, 63, 65], '🌧️') // Hujan
    // addMapping(['snow', 'flurries', 'sleet', 'chance-snow', 'chance-flurries'], '❄️') //Salju
    addMapping([66, 67], '⛈️') // Hujan Badai

    function addMapping(values, icon) {
        values.forEach(value => ICON.set(value, icon));
    }
}

function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
