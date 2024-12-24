console.log('THANKS TO QURAN API ID')
// UTILITY
const BASE_URL_QURAN_API = 'https://quran-api-id.vercel.app'
const BASE_URL_QURAN_API_INDO = 'https://api.npoint.io/99c279bb173a6e28359c'
const SETTINGS = {
  showTranslation: true,
  showLatin: true,
  sound: 'ahmedajamy',
}
let OPTIONS_MENU_ITEM = null
let OPTIONS_MENU_BUTTON = null
let AUDIOS = []

// PAGE HOME
const PAGE_HOME = document.querySelector('#page-home')
const CONTAINER_SURAH = document.querySelector('.surah-list')

// PAGE SURAHS
const PAGE_SURAHS = document.querySelector('#page-surah')
const SURAH_NAME_INDO = document.querySelector('#surah-name-indo')
const SURAH_NAME_LATIN = document.querySelector('#surah-name-latin')
const SURAH_INFO = document.querySelector('#surah-info')
const AYAH_CONTAINER = document.querySelector('#ayah-container')
const BACK_HOME_BUTTON = document.querySelector('.back-button')
const SETTING_BUTTON = document.querySelector('.settings-button')
const SETTINGS_CARD = document.querySelector('.settings-card')
const CLOSE_SETTINGS_BUTTON = document.querySelector('.close-settings')
const SETTING_SHOW_TRANSLATION = document.querySelector('#show-translation')
const SETTING_SHOW_LATIN = document.querySelector('#show-latin')

// INIT
getAllSurahs()

async function getAllSurahs() {
  const surahs = await fetchJSON('data/surah.json')
  for (const surah of surahs) {
    CONTAINER_SURAH.appendChild(createSurahItem(surah))
  }
}

BACK_HOME_BUTTON.addEventListener('click', () => switchPage('home'))

// SETTING LISTENER
SETTING_BUTTON.addEventListener('click', () => {
  SETTINGS_CARD.classList.toggle('hidden')
})

CLOSE_SETTINGS_BUTTON.addEventListener('click', () => {
  SETTINGS_CARD.classList.add('hidden')
})

SETTING_SHOW_TRANSLATION.addEventListener('change', () => {
  SETTINGS.showTranslation = SETTING_SHOW_TRANSLATION.checked
  const ayahs = document.querySelectorAll('.ayah')
  ayahs.forEach((ayah) => {
    ayah.querySelector('.translation').classList.toggle('hidden', !SETTINGS.showTranslation)
  })
})

SETTING_SHOW_LATIN.addEventListener('change', () => {
  SETTINGS.showLatin = SETTING_SHOW_LATIN.checked
  const ayahs = document.querySelectorAll('.ayah')
  ayahs.forEach((ayah) => {
    ayah.querySelector('.latin').classList.toggle('hidden', !SETTINGS.showLatin)
  })
})

document.addEventListener('click', (event) => {
  if (!SETTINGS_CARD.contains(event.target) && event.target !== SETTING_BUTTON) {
    SETTINGS_CARD.classList.add('hidden')
  }

  if (OPTIONS_MENU_ITEM || OPTIONS_MENU_BUTTON) {
    if (OPTIONS_MENU_ITEM !== event.target && OPTIONS_MENU_BUTTON !== event.target) {
      OPTIONS_MENU_ITEM.classList.add('hidden')
      OPTIONS_MENU_ITEM = null
      OPTIONS_MENU_BUTTON = null
    }
  }
})

// COMPONENTS
function createSurahItem(surah) {
  const { number, name, numberOfAyahs, revelation } = surah
  const element = createElement('div', { class: 'surah-item' }, [
    createElement('div', { class: 'surah-number' }, [toArabic(number)]),
    createElement('div', { class: 'surah-info' }, [
      createElement('h2', {}, [name]),
      createElement('p', {}, [`${revelation} · ${numberOfAyahs} Ayat`]),
    ]),
  ])

  element.addEventListener('click', async () => {
    try {
      const data = await fetchJSON(`data/${number}.json`)

      SURAH_NAME_LATIN.textContent = surah.name
      SURAH_NAME_INDO.textContent = surah.translation
      SURAH_INFO.textContent = `${surah.revelation} · ${surah.numberOfAyahs} Ayat`

      AYAH_CONTAINER.innerHTML = ''
      AUDIOS = []
      for (let i = 0; i < data.ayahs.length; i++) {
        let ayah = {
          arab: data.ayahs[i].arab + ' ۝' + toArabic(data.ayahs[i].no),
          translation: data.ayahs[i].translation,
          latin: data.ayahs[i].latin,
          audio: data.ayahs[i].audio[SETTINGS.sound],
          i,
        }
        AYAH_CONTAINER.appendChild(createAyah(ayah))
      }

      switchPage('surah')
    } catch (error) {
      console.error('Terjadi kesalahan:', error)
    }
  })
  return element
}

function createSurahItemOld(surah) {
  const { number, name, numberOfAyahs, revelation } = surah
  const element = createElement('div', { class: 'surah-item' }, [
    createElement('div', { class: 'surah-number' }, [toArabic(number)]),
    createElement('div', { class: 'surah-info' }, [
      createElement('h2', {}, [name]),
      createElement('p', {}, [`${revelation} · ${numberOfAyahs} Ayat`]),
    ]),
  ])

  element.addEventListener('click', async () => {
    try {
      const [surahData, ayahData] = await Promise.all([
        fetchJSON(`${BASE_URL_QURAN_API}/surahs/${number}`),
        fetchJSON(`${BASE_URL_QURAN_API_INDO}/surat/${number}`),
      ])

      const surah = surahData
      const ayahs = ayahData
      console.log(surah)

      SURAH_NAME_LATIN.textContent = surah.name
      SURAH_NAME_INDO.textContent = surah.translation
      SURAH_INFO.textContent = `${surah.revelation} · ${surah.numberOfAyahs} Ayat`

      AYAH_CONTAINER.innerHTML = ''
      AUDIOS = []
      for (let i = 0; i < ayahs.length; i++) {
        let ayah = null
        const type = 'long'

        if (type === 'long') {
          // USING QURAN API
          ayah = {
            arab: surah.ayahs[i].arab + ' ۝' + toArabic(surah.ayahs[i].number.inSurah),
            translation: surah.ayahs[i].translation,
            latin: ayahs[i].tr,
            audio: surah.ayahs[i].audio[SETTINGS.sound],
            i,
          }
        }

        if (type === 'short') {
          // USING QURAN INDO API
          ayah = {
            arab: ayahs[i].ar + +' ۝' + toArabic(ayahs[i].nomor),
            translation: ayahs[i].id,
            latin: ayahs[i].tr,
            audio: surah.ayahs[i].audio[SETTINGS.sound],
            i,
          }
        }
        AYAH_CONTAINER.appendChild(createAyah(ayah))
      }

      switchPage('surah')
    } catch (error) {
      console.error('Terjadi kesalahan:', error)
    }
  })
  return element
}

function createAyahOld(ayah) {
  const { arab, translation, latin, i } = ayah
  const element = createElement('div', { class: 'ayah' }, [
    createElement('div', { class: 'ayah-text' }, [
      createElement('p', { class: 'arabic' }, [arab]),
      createElement('custom', { class: 'latin' }, [latin]),
      createElement('p', { class: 'translation' }, [translation]),
    ]),
  ])

  return element
}

function createAyah(ayah) {
  const { arab, translation, latin, audio, i } = ayah
  const audioComponent = createElement('audio', { class: 'audio hidden', controls: true, src: audio })
  const element = createElement('div', { class: 'ayah' }, [
    createElement('div', { class: 'ayah-options' }, [
      createElement('button', { class: 'options-button', onclick: optionsMenuClick }, ['⋮']),
      createElement('div', { class: 'options-menu hidden' }, [
        createElement('button', { onclick: playAudioClick, ayah: i }, ['Play']),
        createElement('button', {}, ['Bookmark']),
        createElement('button', {}, ['Salin Teks']),
      ]),
    ]),
    createElement('div', { class: 'ayah-text' }, [
      createElement('p', { class: 'arabic' }, [arab]),
      createElement('custom', { class: `latin ${SETTINGS.showLatin ? '' : 'hidden'}` }, [latin]),
      createElement('p', { class: `translation ${SETTINGS.showTranslation ? '' : 'hidden'}` }, [translation]),
    ]),
    audioComponent,
  ])

  AUDIOS.push(audioComponent)

  function optionsMenuClick(e) {
    document.querySelectorAll('.options-menu').forEach((menu) => menu.classList.add('hidden'))
    const optionsMenu = e.target.parentElement.querySelector('.options-menu')
    OPTIONS_MENU_ITEM = optionsMenu
    OPTIONS_MENU_BUTTON = e.target
    optionsMenu.classList.toggle('hidden')
  }

  function playAudioClick(e) {
    let index = e.target.getAttribute('ayah')
    playAudio(index)
  }

  return element
}

// UTILITY
async function fetchJSON(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data)
}

function createElement(tagName, attributes = {}, children = []) {
  //
  if (tagName === 'custom') {
    const div = document.createElement('div')

    // Menambahkan atribut ke elemen
    for (const [key, value] of Object.entries(attributes)) {
      if (key.startsWith('on') && typeof value === 'function') {
        // Jika atribut adalah event listener (misalnya 'onclick'), tambahkan event listener
        div.addEventListener(key.slice(2).toLowerCase(), value)
      } else {
        // Tambahkan atribut biasa
        div.setAttribute(key, value)
      }
    }

    div.innerHTML = children[0]
    return div
  }
  // Membuat elemen baru dengan tagName yang diberikan
  const element = document.createElement(tagName)

  // Menambahkan atribut ke elemen
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith('on') && typeof value === 'function') {
      // Jika atribut adalah event listener (misalnya 'onclick'), tambahkan event listener
      element.addEventListener(key.slice(2).toLowerCase(), value)
    } else {
      // Tambahkan atribut biasa
      element.setAttribute(key, value)
    }
  }

  // Menambahkan anak-anak (children) ke elemen
  children.forEach((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      // Jika child adalah string atau number, tambahkan sebagai teks
      element.appendChild(document.createTextNode(child))
    } else if (child instanceof HTMLElement) {
      // Jika child adalah elemen HTML, tambahkan sebagai anak
      element.appendChild(child)
    }
  })

  return element
}

function switchPage(page) {
  if (page === 'home') {
    PAGE_HOME.classList.remove('hidden')
    PAGE_SURAHS.classList.add('hidden')
  } else if (page === 'surah') {
    PAGE_HOME.classList.add('hidden')
    PAGE_SURAHS.classList.remove('hidden')
  }
}

function toArabic(number) {
  const ARABIC_NUMBERS = {
    0: '٠',
    1: '١',
    2: '٢',
    3: '٣',
    4: '٤',
    5: '٥',
    6: '٦',
    7: '٧',
    8: '٨',
    9: '٩',
  }

  const numberArabic = number
    .toString()
    .split('')
    .map((digit) => ARABIC_NUMBERS[digit])
    .join('')
  return numberArabic
}

function playAudio(index) {
  if (Number(index) < AUDIOS.length) {
    AUDIOS.forEach((audio, i) => {
      if (i !== Number(index)) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    AUDIOS[index].play()

    AUDIOS[index].addEventListener('ended', () => {
      playAudio(Number(index) + 1)
    })
  }
}
