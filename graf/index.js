const mE = document.querySelector("#m");
const xE = document.querySelector("#x");
const yE = document.querySelector("#y");
const resultElement = document.querySelector("#result");
const count = document.querySelector("#hitung");

document.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) countResult();
});

count.addEventListener("click", function (e) {
  countResult();
});

function countResult() {
  const m = Number(mE.value);
  const x = Number(xE.value);
  const y = Number(yE.value);

  const k = modulo(x - y, m) + 1;
  const kk = Math.floor((m - 1) / 2);

  let result = 0;
  if (k <= kk) result = 2 * (y - 1) * m + k - 1;
  else result = 2 * (y - 1) * m + k;
  resultElement.innerHTML = `Hasil : f(x<sub>${x}</sub>, y<sub>${y}</sub>) = ${result}`;
}

function modulo(num, modulo) {
  return ((num % modulo) + modulo) % modulo;
}
