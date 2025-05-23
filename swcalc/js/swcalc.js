function calcularRunas() {
	document.getElementsByClassName('finalRunes')[0].innerHTML = ''

	// status base e status desejado
	let statusBase = {
		hp: document.getElementById('bhp').value * 1,
		atk: document.getElementById('batk').value * 1,
		def: document.getElementById('bdef').value * 1,
		spd: document.getElementById('bspd').value * 1,
		cr: document.getElementById('bcr').value * 1,
		cd: document.getElementById('bcd').value * 1,
		res: document.getElementById('bres').value * 1,
		acc: document.getElementById('bacc').value * 1,
	}

	let statusDesejado = {
		hp: document.getElementById('dhp').value * 1,
		atk: document.getElementById('datk').value * 1,
		def: document.getElementById('ddef').value * 1,
		spd: document.getElementById('dspd').value * 1,
		cr: document.getElementById('dcr').value * 1,
		cd: document.getElementById('dcd').value * 1,
		res: document.getElementById('dres').value * 1,
		acc: document.getElementById('dacc').value * 1,
	}

	// runas e artefatos selecionados
	// TODO: runas pares e artefatos devem ser selecionaveis

	let sets = Array.from(document.querySelector('.sets').querySelectorAll('select')).map(select => select.value)
	let sets4runes = [
		'fatal',
		'swift',
		'vampire',
		'despair',
		'violent',
		'rage'
	]

	if (sets4runes.includes(sets[0]) || sets4runes.includes(sets[1])) {
		sets.pop()
	}

	let runas = {
		sets: sets,
		slots: {
			1: {
				stat: 'atk',
				flat: true
			},
			2: {
				stat: document.getElementById('r2attr').value,
				flat: !['hp', 'atk', 'def'].includes(document.getElementById('r2attr').value)
			},
			3: {
				stat: 'def',
				flat: true
			},
			4: {
				stat: document.getElementById('r4attr').value,
				flat: !['hp', 'atk', 'def'].includes(document.getElementById('r4attr').value)
			},
			5: {
				stat: 'hp',
				flat: true
			},
			6: {
				stat: document.getElementById('r6attr').value,
				flat: !['hp', 'atk', 'def'].includes(document.getElementById('r6attr').value)
			}
		}
	}

	let artefatos = {
		1: {
			stat: document.getElementById('art1').value
		},
		2: {
			stat: document.getElementById('art2').value
		}
	}


	// calculo para identificar os status que estao faltando
	// para buscar esses status nas subs

	let statusRunas = getRunesStats(runas, statusBase)
	let statusSetRunas = getSetsStats(runas.sets)
	let statusArtefatos = getArtStats(artefatos)

	let statusFixos = {
		hp: statusArtefatos.hp.value + (statusBase.hp * statusSetRunas.hp) / 100 + statusRunas.hp,
		atk: statusArtefatos.atk.value + (statusBase.atk * statusSetRunas.atk / 100) + statusRunas.atk,
		def: statusArtefatos.def.value + (statusBase.def * statusSetRunas.def / 100) + statusRunas.def,
		spd: statusSetRunas.spd + (statusBase.spd * statusRunas.spd / 100),
		cr: statusSetRunas.cr + statusRunas.cr + statusBase.cr,
		cd: statusSetRunas.cd + statusRunas.cd + statusBase.cd,
		res: statusSetRunas.res + statusRunas.res + statusBase.res,
		acc: statusSetRunas.acc + statusRunas.acc + statusBase.acc,
	}

	let statusFaltantes = {
		hp: Math.ceil(Math.max(statusDesejado.hp - statusFixos.hp, 0)),
		atk: Math.ceil(Math.max(statusDesejado.atk - statusFixos.atk, 0)),
		def: Math.ceil(Math.max(statusDesejado.def - statusFixos.def, 0)),
		spd: Math.ceil(Math.max(statusDesejado.spd - statusFixos.spd, 0)),
		cr: Math.ceil(Math.max(statusDesejado.cr - statusFixos.cr, 0)),
		cd: Math.ceil(Math.max(statusDesejado.cd - statusFixos.cd, 0)),
		res: Math.ceil(Math.max(statusDesejado.res - statusFixos.res, 0)),
		acc: Math.ceil(Math.max(statusDesejado.acc - statusFixos.acc, 0)),
	}


	// mapeia as possibilidades de status por cada runa
	let possibilidades = checkPossibleStatusPerRune(runas)

	let mapPossibilidades = []
	for (p in possibilidades) {
		temp = possibilidades[p]
		for (t in temp) {
			let key = temp[t]
			if (mapPossibilidades[key] == undefined)
				mapPossibilidades[key] = 0

			mapPossibilidades[key]++
		}
	}

	// status para buscar dividido pelas runas
	let statusParaBuscar = {
		hp: {
			value: Math.ceil(statusFaltantes.hp * 100 / statusBase.hp / mapPossibilidades['hp']),
			gem: {
				value: 0,
				raridade: ''
			},
			grind: {
				value: 0,
				raridade: ''
			}
		},
		atk: {
			value: Math.ceil(statusFaltantes.atk * 100 / statusBase.atk / mapPossibilidades['atk']),
			gem: {
				value: 0,
				raridade: ''
			},
			grind: {
				value: 0,
				raridade: ''
			}
		},
		def: {
			value: Math.ceil(statusFaltantes.def * 100 / statusBase.def / mapPossibilidades['def']),
			gem: {
				value: 0,
				raridade: ''
			},
			grind: {
				value: 0,
				raridade: ''
			}
		},
		spd: {
			value: Math.ceil(statusFaltantes.spd / mapPossibilidades['spd']),
			gem: {
				value: 0,
				raridade: ''
			},
			grind: {
				value: 0,
				raridade: ''
			}
		},
		cr: {
			value: Math.ceil(statusFaltantes.cr / mapPossibilidades['cr']),
			gem: {
				value: 0,
				raridade: ''
			},
			grind: {
				value: 0,
				raridade: ''
			}
		},
		cd: {
			value: Math.ceil(statusFaltantes.cd / mapPossibilidades['cd']),
			gem: {
				value: 0,
				raridade: ''
			},
			grind: {
				value: 0,
				raridade: ''
			}
		},
		res: {
			value: Math.ceil(statusFaltantes.res / mapPossibilidades['res']),
			gem: {
				value: 0,
				raridade: ''
			},
			grind: {
				value: 0,
				raridade: ''
			}
		},
		acc: {
			value: Math.ceil(statusFaltantes.acc / mapPossibilidades['acc']),
			gem: {
				value: 0,
				raridade: ''
			},
			grind: {
				value: 0,
				raridade: ''
			}
		},
	}

	// TODO: verificar dinamicamente as gemas e grinds
	// incluir rare e legend com seus valores min e max
	for (s in statusParaBuscar) {
		let status = statusParaBuscar[s]
		if (status.value == 0) continue

		let gem = getGemstoneStatus(s)
		let grind = getGrindstoneStatus(s)

		let raridades = ['rare', 'hero']

		for (r of raridades) {
			for (let i = gem[r].min; i <= gem[r].max; i++) {
				if (status.value <= i) {
					status.gem.value = i
					status.gem.raridade = r
					break
				}
			}
			if (status.gem.value > 0) break
		}

		if (status.gem.value > 0 || grind == undefined) continue

		for (r of raridades) {
			for (let i = gem[r].min; i <= gem[r].max; i++) {
				for (rg of raridades) {
					for (let j = grind[rg].min; j <= grind[rg].max; j++) {
						if (status.value <= i + j) {
							status.gem.value = i
							status.gem.raridade = r

							status.grind.value = j
							status.grind.raridade = rg
							break
						}
					}
					if (status.grind.value > 0) break
				}
				if (status.grind.value > 0) break
			}
			if (status.grind.value > 0) break
		}
	}

	let runasFinais = {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: []
	}

	for (s in statusParaBuscar) {
		let status = statusParaBuscar[s]
		status.atributo = s
		if (status.value == 0) continue

		for (r in runasFinais) {
			runa = runasFinais[r]

			if (possibilidades[r].includes(s))
				runa.push(status)
		}
	}

	for (r in runasFinais) {
		let runa = runasFinais[r]
		let elemRuna = document.createElement('div')
		elemRuna.classList.add('r' + r)
		document.getElementsByClassName('finalRunes')[0].appendChild(elemRuna)
		elemRuna.innerHTML = '<h3>Runa ' + r + '</h3>' + elemRuna.innerHTML
		for (s in runa) {
			let status = runa[s]
			let elemSub = document.createElement('p')
			elemSub.classList.add('sub' + (s * 1 + 1))
			elemSub.textContent = status.atributo + ': ' + status.value
			document.getElementsByClassName('r' + r)[0].appendChild(elemSub)

			if (status.gem.value > 0) {
				let img = document.createElement('img')
				img.src = 'swcalc/img/gem_' + status.gem.raridade + '.png'
				img.alt = status.gem.raridade + ' gem'
				img.classList.add('gem')
				elemSub.appendChild(img)
			}
			if (status.grind.value > 0) {
				let img = document.createElement('img')
				img.src = 'swcalc/img/grind_' + status.grind.raridade + '.png'
				img.alt = status.grind.raridade + ' grind'
				img.classList.add('grind')
				elemSub.appendChild(img)
			}

		}
		elemRuna.innerHTML += '<hr>'
	}
}