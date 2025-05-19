// status base e status desejado
let statusBase = {
	hp: 12015,
	atk: 714,
	def: 626,
	spd: 101,
	cr: 30,
	cd: 50,
	res: 15,
	acc: 0
}

let statusDesejado = {
	hp: 20000,
	atk: 1000,
	def: 600,
	spd: 123,
	cr: 100,
	cd: 0,
	res: 0,
	acc: 0
}

// runas e artefatos selecionados
// TODO: runas pares e artefatos devem ser selecionaveis

let runas = {
	sets: [
		'violent',
		'destroy'
	],
	slots: {
		1: {
			stat: 'atk',
			flat: true
		},
		2: {
			stat: 'spd',
			flat: false
		},
		3: {
			stat: 'def',
			flat: true
		},
		4: {
			stat: 'cr',
			flat: true
		},
		5: {
			stat: 'hp',
			flat: true
		},
		6: {
			stat: 'hp',
			flat: false
		}
	}
}

let artefatos = {
	1: {
		stat: 'atk'
	},
	2: {
		stat: 'atk'
	}
}


// calculo para identificar os status que estao faltando
// para buscar esses status nas subs

let statusRunas = getRunesStats(runas)
let statusSetRunas = getSetsStats(runas.sets)
let statusArtefatos = getArtStats(artefatos)

let statusFixos = {
	hp: statusArtefatos.hp.value + statusSetRunas.hp + statusRunas.hp,
	atk: statusArtefatos.atk.value + statusSetRunas.atk + statusRunas.atk,
	def: statusArtefatos.def.value + statusSetRunas.def + statusRunas.def,
	spd: statusSetRunas.spd + statusRunas.spd,
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

console.log(runasFinais)