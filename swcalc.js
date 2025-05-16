let baseStats = {
	hp: 9555,
	atk: 747,
	def: 593,
	spd: 101,
	cr: 15,
	cd: 50,
	res: 15,
	acc: 0
};

let desiredStats = {
	hp: 0,
	atk: 1600,
	def: 0,
	spd: 88,
	cr: 100,
	cd: 200,
	res: 0,
	acc: 0
};

let runes = {
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
			flat: false
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

let artifacts = {
	1: {
		stat: 'atk'
	},
	2: {
		stat: 'atk'
	}
}


let flatStats = calcFlatStats(baseStats, desiredStats);
let percentStats = calcPercentStats(baseStats, desiredStats);
let equipStats = getRunesArtifactsStats(runes, artifacts)

let calculatedStats = calcTargetStats(baseStats, flatStats, percentStats, equipStats);

let runePossibilities = checkPossibleStatusPerRune(runes);


console.log(calculatedStats);
console.log(runePossibilities);