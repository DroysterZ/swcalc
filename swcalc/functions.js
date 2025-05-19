function getArtStats(artifacts) {
	let stats = {
		hp: {
			value: 0,
			flat: true
		},
		atk: {
			value: 0,
			flat: true
		},
		def: {
			value: 0,
			flat: true
		}
	}

	for (a in artifacts) {
		let artifact = artifacts[a]
		let stat = artifact.stat

		stats[stat].value += getMaxArtStatValue(stat)
	}

	return stats
}

function getMaxArtStatValue(stat) {
	switch (stat) {
		case 'hp':
			return 1500

		case 'atk':
		case 'def':
			return 100
	}
}

function getSetsStats(sets) {
	let stats = {
		hp: 0,
		atk: 0,
		def: 0,
		spd: 0,
		cr: 0,
		cd: 0,
		res: 0,
		acc: 0
	}

	for (s in sets) {
		let set = sets[s]
		switch (set) {
			case 'energy':
				stats.hp += 15
				break

			case 'fatal':
				stats.atk += 35
				break

			case 'guard':
				stats.def += 15
				break

			case 'swift':
				stats.spd += 25
				break

			case 'blade':
				stats.cr += 12
				break

			case 'rage':
				stats.cd += 40
				break

			case 'endure':
				stats.res += 20
				break

			case 'focus':
				stats.acc += 20
				break
		}
	}

	return stats
}

function getMaxStatusRuna(runa, flat = true) {
	switch (runa) {
		case 'hp':
			return flat ? 2448 : 63

		case 'atk':
		case 'def':
			return flat ? 160 : 63

		case 'spd':
			return 42

		case 'cr':
			return 58

		case 'cd':
			return 80

		case 'res':
		case 'acc':
			return 64
	}
}

function getGemstoneStatus(stat) {
	switch (stat) {
		case 'hp':
		case 'atk':
		case 'def':
			return {
				rare: {
					min: 5,
					max: 9
				},
				hero: {
					min: 7,
					max: 11
				},
				legend: {
					min: 9,
					max: 13
				}
			}

		case 'spd':
			return {
				rare: {
					min: 3,
					max: 6
				},
				hero: {
					min: 5,
					max: 8
				},
				legend: {
					min: 7,
					max: 10
				}
			}

		case 'cr':
			return {
				rare: {
					min: 3,
					max: 5
				},
				hero: {
					min: 4,
					max: 7
				},
				legend: {
					min: 6,
					max: 9
				}
			}

		case 'cd':
			return {
				rare: {
					min: 4,
					max: 6
				},
				hero: {
					min: 5,
					max: 8
				},
				legend: {
					min: 7,
					max: 10
				}
			}

		case 'res':
		case 'acc':
			return {
				rare: {
					min: 5,
					max: 8
				},
				hero: {
					min: 6,
					max: 9
				},
				legend: {
					min: 8,
					max: 11
				}
			}
	}
}

function getGrindstoneStatus(stat) {
	switch (stat) {
		case 'hp':
		case 'atk':
		case 'def':
			return {
				rare: {
					min: 3,
					max: 6
				},
				hero: {
					min: 4,
					max: 7
				},
				legend: {
					min: 5,
					max: 10
				}
			}

		case 'spd':
			return {
				rare: {
					min: 2,
					max: 3
				},
				hero: {
					min: 3,
					max: 4
				},
				legend: {
					min: 4,
					max: 5
				}
			}
	}

	return undefined;
}

function getRunesStats(runas, base) {
	let stats = {
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
		stats[runa.stat] += getMaxStatusRuna(runa.stat)
	}

	for (i of [2, 4, 6]) {
		let runa = runas.slots[i]
		temp = getMaxStatusRuna(runa.stat, runa.flat)

		if (runa.flat == false) {
			temp = base[runa.stat] * (temp / 100)
		}
		stats[runa.stat] += temp
	}
	return stats
}

function checkPossibleStatusPerRune(runas) {
	let stats = [
		{
			stat: 'hp',
			flat: false
		},
		{
			stat: 'atk',
			flat: false
		},
		{
			stat: 'def',
			flat: false
		},
		{
			stat: 'spd',
			flat: true
		},
		{
			stat: 'cr',
			flat: true
		},
		{
			stat: 'cd',
			flat: true
		},
		{
			stat: 'res',
			flat: true
		},
		{
			stat: 'acc',
			flat: true
		}
	]

	let possibilities = {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: []
	}

	for (r in runas.slots) {
		for (s in stats) {
			let stat = stats[s]
			let runa = runas.slots[r]

			if (r == 1 && stat.stat == 'def' || r == 3 && stat.stat == 'atk') continue
			if (stat.stat == runa.stat && runa.flat == stat.flat) continue

			possibilities[r].push(stat.stat)
		}
	}

	return possibilities
}