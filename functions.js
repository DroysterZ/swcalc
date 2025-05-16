function calcFlatStats(base, target) {
	let diffStats = {
		hp: Math.max(target.hp + base.hp, base.hp),
		atk: Math.max(target.atk + base.atk, base.atk),
		def: Math.max(target.def + base.def, base.def),
	};

	diffStats.hp = (diffStats.hp * 100 / base.hp) - 100;
	diffStats.atk = (diffStats.atk * 100 / base.atk) - 100;
	diffStats.def = (diffStats.def * 100 / base.def) - 100;

	return diffStats;
}

function calcPercentStats(base, target) {
	let diffStats = {
		spd: target.spd,
		cr: Math.max(target.cr - base.cr, base.cr),
		cd: Math.max(target.cd - base.cd, base.cd),
		res: Math.max(target.res - base.res, base.res),
		acc: Math.max(target.acc - base.acc, base.acc)
	};

	return diffStats;
}

function getSetStats(set) {
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

	return stats;
}

function getMaxRuneStatValue(stat, flat = false) {
	switch (stat) {
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

		case 'acc':
		case 'res':
			return 64;
	}
}

function getRunesStats(runes) {
	let stats = {
		hp: 0,
		fhp: 0,
		atk: 0,
		fatk: 0,
		def: 0,
		fdef: 0,
		spd: 0,
		cr: 0,
		cd: 0,
		res: 0,
		acc: 0
	};

	for (r in runes.slots) {
		let rune = runes.slots[r];
		let stat = rune.stat;
		let flat = rune.flat;

		let statValue = getMaxRuneStatValue(stat, flat);
		if (flat) {
			stat = 'f' + stat;
		}
		stats[stat] += statValue;
	}

	for (s in runes.sets) {
		let set = runes.sets[s];
		let setStats = getSetStats(set);

		for (stat in setStats) {
			stats[stat] += setStats[stat];
		}
	}

	return stats;
}

function getArtStats(artifacts) {
	let stats = {
		fhp: 0,
		fatk: 0,
		fdef: 0
	}

	for (a in artifacts) {
		let artifact = artifacts[a];
		let stat = artifact.stat;

		stats['f' + stat] += getMaxArtStatValue(stat);
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

function getRunesArtifactsStats(runes, artifacts) {
	let stats = {
		hp: 0,
		fhp: 0,
		atk: 0,
		fatk: 0,
		def: 0,
		fdef: 0,
		spd: 0,
		cr: 0,
		cd: 0,
		res: 0,
		acc: 0
	};
	let rstats = getRunesStats(runes);
	let artStats = getArtStats(artifacts);

	for (s in stats) {
		stats[s] += rstats[s] ?? 0;
		stats[s] += artStats[s] ?? 0;
	}

	return stats;
}

function calcTargetStats(baseStats, flatStats, percentStats, equipStats) {
	let targetStats = {
		hp: Math.max((flatStats.hp * baseStats.hp / 100) - equipStats.fhp, 0),
		atk: Math.max(flatStats.atk * baseStats.atk / 100 - equipStats.fatk, 0),
		def: Math.max(flatStats.def * baseStats.def / 100 - equipStats.fdef, 0),
		spd: percentStats.spd - equipStats.spd,
		cr: percentStats.cr - equipStats.cr,
		cd: percentStats.cd - equipStats.cd,
		res: percentStats.res - equipStats.res,
		acc: percentStats.acc - equipStats.acc
	};

	return targetStats;
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
			flat: false,
		},
		{
			stat: 'cd',
			flat: false,
		},
		{
			stat: 'res',
			flat: false,
		},
		{
			stat: 'acc',
			flat: false,
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