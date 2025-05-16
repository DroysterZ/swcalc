// -------- status base e status desejado
let statusBase = {
	hp: 9555,
	atk: 747,
	def: 593,
	spd: 101,
	cr: 15,
	cd: 50,
	res: 15,
	acc: 0
}

let statusDesejado = {
	hp: 0,
	atk: 1600,
	def: 0,
	spd: 88,
	cr: 100,
	cd: 200,
	res: 0,
	acc: 0
}

// -------- runas e artefatos selecionados
// TODO: runas pares e artefatos devem ser selecionaveis

let runas = {
	sets: [
		'rage',
		'blade'
	],
	slots: {
		1: {
			stat: 'atk',
			flat: true
		},
		2: {
			stat: 'atk',
			flat: false
		},
		3: {
			stat: 'def',
			flat: true
		},
		4: {
			stat: 'cd',
			flat: true
		},
		5: {
			stat: 'hp',
			flat: true
		},
		6: {
			stat: 'atk',
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


// -------- calcular os status que ja temos de runas e artefatos
// depois disso, vamos transformar os status que faltam
// em porcentagem, essa porcentagem vai ser o retorno para
// calcular quantos subs serao necessarios nas runas

let statusRunas = {
	hp: 0,
	atk: 0,
	def: 0,
	spd: 0,
	cr: 0,
	cd: 0,
	res: 0,
	acc: 0
}
for (i of [1, 3, 5]) {
	let runa = runas.slots[i]
	statusRunas[runa.stat] += getMaxStatusRuna(runa.stat)
}

for (i of [2, 4, 6]) {
	let runa = runas.slots[i]
	temp = getMaxStatusRuna(runa.stat, runa.flat)

	if (runa.flat == false) {
		temp = statusBase[runa.stat] * (temp / 100)
	}
	statusRunas[runa.stat] += temp
}

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
	hp: Math.max(statusDesejado.hp - statusFixos.hp, 0),
	atk: Math.max(statusDesejado.atk - statusFixos.atk, 0),
	def: Math.max(statusDesejado.def - statusFixos.def, 0),
	spd: Math.max(statusDesejado.spd - statusFixos.spd, 0),
	cr: Math.max(statusDesejado.cr - statusFixos.cr, 0),
	cd: Math.max(statusDesejado.cd - statusFixos.cd, 0),
	res: Math.max(statusDesejado.res - statusFixos.res, 0),
	acc: Math.max(statusDesejado.acc - statusFixos.acc, 0),
}

console.log(statusFaltantes)