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
		let artifact = artifacts[a];
		let stat = artifact.stat;

		stats[stat].value += getMaxArtStatValue(stat);
	}

	return stats;
}

function getMaxArtStatValue(stat) {
	switch (stat) {
		case 'hp':
			return 1500;

		case 'atk':
		case 'def':
			return 100;
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
	};

	for (s in sets) {
		let set = sets[s];
		switch (set) {
			case 'energy':
				stats.hp = 15;
				break;

			case 'fatal':
				stats.atk = 35;
				break;

			case 'guard':
				stats.def = 15;
				break;

			case 'swift':
				stats.spd = 25;
				break;

			case 'blade':
				stats.cr = 12;
				break;

			case 'rage':
				stats.cd = 40;
				break;

			case 'endure':
				stats.res = 20;
				break;

			case 'focus':
				stats.acc = 20;
				break;
		}
	}

	return stats;
}

function getMaxStatusRuna(runa, flat = true) {
	switch (runa) {
		case 'hp':
			return flat ? 2448 : 63;

		case 'atk':
		case 'def':
			return flat ? 160 : 63;

		case 'spd':
			return 42;

		case 'cr':
			return 58;

		case 'cd':
			return 80;

		case 'res':
		case 'acc':
			return 64;
	}
}

function checkPossibleStatusPerRune(runes) {
	let stats = [
		{
			stat: 'hp',
			flat: false,
		},
		{
			stat: 'hp',
			flat: true,
		},
		{
			stat: 'atk',
			flat: false,
		},
		{
			stat: 'atk',
			flat: true,
		},
		{
			stat: 'def',
			flat: false,
		},
		{
			stat: 'def',
			flat: true,
		},
		{
			stat: 'spd',
			flat: true,
		},
		{
			stat: 'cr',
			flat: true,
		},
		{
			stat: 'cd',
			flat: true,
		},
		{
			stat: 'res',
			flat: true,
		},
		{
			stat: 'acc',
			flat: true,
		},
	]

	let possibilities = {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: []
	}

	for (s in stats) {
		for (p in possibilities) {
			if (runes.slots[p].stat != stats[s].stat || runes.slots[p].flat != stats[s].flat) {
				if (!(stats[s].stat == 'def' && p == 1) && !(stats[s].stat == 'atk' && p == 3)) {
					possibilities[p].push(stats[s]);
				}
			}
		}
	}

	return possibilities;
}