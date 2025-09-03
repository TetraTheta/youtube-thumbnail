//////////
// BODY //
//////////
getParam()
document.getElementById('form').addEventListener('submit', () => fetchThumbnail())
document.getElementById('clear').addEventListener('click', () => reset())

///////////
const ThumbnailData = [
  {
    type: 'Maximum',
    expected: '1280x720 or 1920x1080',
    urlKey: 'maxresdefault',
  },
  {
    type: 'Standard',
    expected: '640x480',
    urlKey: 'sddefault',
  },
  {
    type: 'High',
    expected: '480x360',
    urlKey: 'hqdefault',
  },
  {
    type: 'Medium',
    expected: '320x180',
    urlKey: 'mqdefault',
  },
  {
    type: 'Normal',
    expected: '120x90',
    urlKey: 'default',
  },
]
Object.freeze(ThumbnailData) // Freeze Quality to prevent modification

/**
 * Workaround for '<a download>' does not work with Cross-Origin
 * @param {string} url
 * @param {string} name
 */
function dlImg(url, name) {
  fetch(url)
    .then((rsp) => rsp.blob())
    .then((b) => {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(b, name)
      } else {
        let a = document.createElement('a')
        a.href = URL.createObjectURL(b)
        a.download = name
        a.click()
      }
    })
}

/**
 * Take value from '#youtube-id' and use it for fetching YouTube video thumbnail
 */
function fetchThumbnail() {
  event.preventDefault()
  const input = document.getElementById('youtube-url')
  const type = document.getElementById('thumb-type').value // either 'jpg' or 'webp'
  const res = getYTId(decodeURI(input.value)) // YouTube Video ID or empty string

  console.log(`Detected Video ID: ${res}, Thumbnail Type: ${type}`)

  input.value = res

  const container = document.createDocumentFragment()
  const result = document.getElementById('result')
  result.innerHTML = ''

  ThumbnailData.forEach((t) => {
    const url = `https://i.ytimg.com/vi/${res}/${t.urlKey}.${type}`

    const sec = document.createElement('section')
    sec.className = 'col-md-6 col-xl-4 col-xxl-3 d-flex'

    sec.innerHTML = `
      <div class="card bg-dark text-white w-100 h-100">
        <div class="card-header text-center small">${t.type} (${t.expected})</div>
        <div class="card-body d-flex flex-column p-2">
          <div class="thumb-image-wrap flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden">
            <img class="img-fluid thumb-img" alt="${t.type}" />
          </div>
          <div class="mt-2 text-center">
            Resolution: <span class="thumb-res">Loading...</span><br />
            <button class="btn btn-primary" disabled><i class="fa-solid fa-download"></i> DOWNLOAD</button>
          </div>
        </div>
      </div>
    `
    container.appendChild(sec)

    const loader = new Image()
    loader.src = url

    loader.onload = () => {
      const thumbImg = sec.querySelector('.thumb-img')
      thumbImg.src = url
      thumbImg.style.maxWidth = '100%'
      thumbImg.style.maxHeight = '100%'
      thumbImg.style.objectFit = 'contain'

      sec.querySelector('.thumb-res').textContent = `${loader.naturalWidth}x${loader.naturalHeight}`
      const btn = sec.querySelector('button')
      btn.disabled = false
      btn.onclick = () => dlImg(url, `${res}_${t.type}.${type}`)
    }
    loader.onerror = () => {
      sec.querySelector('.thumb-res').textContent = 'N/A'
    }
  })
  result.appendChild(container)

  // prevent site refresh
  return false
}

/**
 * Get '?q=' search param from URL that user used (immeadiate search)
 */
function getParam() {
  const params = new URL(location.href).searchParams
  const query = params.get('q')
  if (query) {
    document.getElementById('youtube-url').value = query
    document.getElementById('submit').click()
  }
}

const delParams = ['a', 'app', 'list', 'feature', 'rel', 'si']

/**
 * Parse input and return YouTube Video ID
 * @param {string} url YouTube URL or YouTube Video ID
 * @returns {string} Parsed YouTube Video ID or empty string
 */
function getYTId(url) {
  // YouTube Video ID Only
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
  // YouTube URL
  try {
    url = url.replace(/(attribution_link|uploademail|youtube-nocookie)/gi, 'x')
    let urlObj = new URL(url)

    const embed = urlObj.searchParams.get('url')
    if (embed) urlObj = new URL(embed)

    const v = urlObj.searchParams.get('v')
    if (v) return v

    delParams.forEach((p) => urlObj.searchParams.delete(p))
    url = urlObj.toString().replace(/%3D/gi, '=')
    const idMatch = url.match(/[a-zA-Z0-9_-]{11}/i)
    if (idMatch) {
      const id = idMatch[0]
      console.log(`Detected YouTube Video ID: ${id} / ${id.length}`)
      return id
    } else {
      console.error(`Failed to parse YouTube Video ID: ${url}`)
      return ''
    }
  } catch (e) {
    console.error(`Error processing URL: ${e.message}`)
    return ''
  }
}

function reset() {
  // input
  document.getElementById('youtube-url').value = ''
  // result
  // innerHTML doesn't work :(
  const res = document.getElementById('result')
  while (res.lastElementChild) res.removeChild(res.lastElementChild)
}

// for development
function sample() {
  reset()
  const sList = [
    'maAR5SHBO2E', // glory MAX -나의 최대치로 너와 함께할게
    'https://www.youtube.com/watch?v=6HPnf-H9x64', // Datamania (tpz Overheat Remix)
    'https://youtu.be/jv543Nk5s18', // 염라
  ]
  document.getElementById('youtube-url').value = sList[Math.floor(Math.random() * sList.length)]
  document.getElementById('submit').click()
}
