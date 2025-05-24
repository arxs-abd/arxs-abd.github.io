const getData = (name) => {
  return JSON.parse(localStorage.getItem(name)) || null
}

const setData = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data))
}
