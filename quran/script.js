console.log('THANKS TO QURAN API ID')
// UTILITY
const BASE_URL_QURAN_API = 'https://quran-api-id.vercel.app'
const BASE_URL_QURAN_API_INDO = 'https://api.npoint.io/99c279bb173a6e28359c'

// PAGE HOME
const PAGE_HOME = document.querySelector('#page-home')
const CONTAINER_SURAH = document.querySelector('.surah-list')

// PAGE SURAHS
const PAGE_SURAHS = document.querySelector('#page-surah')
const SURAH_NAME_INDO = document.querySelector('#surah-name-indo')
const SURAH_NAME_LATIN = document.querySelector('#surah-name-latin')
const SURAH_INFO = document.querySelector('#surah-info')
const AYAH_CONTAINER = document.querySelector('#ayah-container')

// INIT
getAllSurahs()

async function getAllSurahs() {
  const surahs = await fetchJSON(`${BASE_URL_QURAN_API}/surahs`)
  for (const surah of surahs) {
    CONTAINER_SURAH.appendChild(createSurahItem(surah))
  }
}

// COMPONENTS
function createSurahItem(surah) {
  const { number, name, numberOfAyahs, revelation } = surah
  const element = createElement('div', { class: 'surah-item' }, [
    createElement('div', { class: 'surah-number' }, [toArabic(number)]),
    createElement('div', { class: 'surah-info' }, [
      createElement('h2', {}, [name]),
      createElement('p', {}, [`${revelation} · ${numberOfAyahs} Ayat`]),
    ])
  ])

  element.addEventListener('click', async () => {
    try {
        const [surahData, ayahData] = await Promise.all([
            fetchJSON(`${BASE_URL_QURAN_API}/surahs/${number}`),
            fetchJSON(`${BASE_URL_QURAN_API_INDO}/surat/${number}`)
        ])

        const surah = surahData
        const ayahs = ayahData

        SURAH_NAME_LATIN.textContent = surah.name
        SURAH_NAME_INDO.textContent = surah.translation
        SURAH_INFO.textContent = `${surah.revelation} · ${surah.numberOfAyahs} Ayat`

        for (let i = 0; i < ayahs.length; i++) {
            let ayah = null
            const type = 'long'

            if (type === 'long') {
            // USING QURAN API
                ayah = {
                    arab : surah.ayahs[i].arab + ' ۝' + toArabic(surah.ayahs[i].number.inSurah),
                    translation : surah.ayahs[i].translation,
                    latin : ayahs[i].tr
                }
            }

            if (type === 'short') {
                // USING QURAN INDO API
                ayah = {
                  arab : ayahs[i].ar + + ' ۝' + toArabic(ayahs[i].nomor),
                  translation : ayahs[i].id,
                  latin : ayahs[i].tr
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

function createAyah(ayah) {
  const { arab, translation, latin } = ayah
  const element = createElement('div', { class: 'ayah' }, [
    createElement('div', { class: 'ayah-text' }, [
      createElement('p', { class: 'arabic' }, [arab]),
      createElement('custom', { class: 'latin' }, [latin]),
      createElement('p', { class: 'translation' }, [translation]),
    ]),
  ])

  return element
}

// UTILITY
async function fetchJSON(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data);
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

  const numberArabic = number.toString().split('').map((digit) => ARABIC_NUMBERS[digit]).join('')
  return numberArabic
}