const input = document.getElementById('monster-name')
const suggestions = document.getElementById('monster-suggestions')
const img = document.getElementById('monster-img')

input.addEventListener('input', () => {
	const term = input.value.toLowerCase()
	suggestions.innerHTML = ''
	if (!term) {
		suggestions.style.display = 'none'
		return
	}

	const filtered = monsters.filter(m => m.name.toLowerCase().includes(term))
	filtered.forEach(mon => {
		const li = document.createElement('li')
		li.textContent = mon.name
		li.addEventListener('click', () => {
			selectMonster(mon)
			suggestions.innerHTML = ''
			suggestions.style.display = 'none'
		})
		suggestions.appendChild(li)
	})
	suggestions.style.display = filtered.length ? 'block' : 'none'
})

function selectMonster(mon) {
	img.src = mon.image
	input.value = mon.name

	document.getElementById('bhp').value = mon.stats.hp
	document.getElementById('batk').value = mon.stats.atk
	document.getElementById('bdef').value = mon.stats.def
	document.getElementById('bspd').value = mon.stats.spd
	document.getElementById('bcr').value = mon.stats.cr
	document.getElementById('bcd').value = mon.stats.cd
	document.getElementById('bres').value = mon.stats.res
	document.getElementById('bacc').value = mon.stats.acc
}

let monsters = []
debugger
fetch('swcalc/json/monsters.json')
	.then(res => res.json())
	.then(data => {
		monsters = data
	})
	.catch(err => {
		console.error("Erro ao carregar monsters.json:", err)
	})