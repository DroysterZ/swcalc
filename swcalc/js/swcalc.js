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
		},
		atk: {
			value: Math.ceil(statusFaltantes.atk * 100 / statusBase.atk / mapPossibilidades['atk']),
		},
		def: {
			value: Math.ceil(statusFaltantes.def * 100 / statusBase.def / mapPossibilidades['def']),
		},
		spd: {
			value: Math.ceil(statusFaltantes.spd / mapPossibilidades['spd']),
		},
		cr: {
			value: Math.ceil(statusFaltantes.cr / mapPossibilidades['cr']),
		},
		cd: {
			value: Math.ceil(statusFaltantes.cd / mapPossibilidades['cd']),
		},
		res: {
			value: Math.ceil(statusFaltantes.res / mapPossibilidades['res']),
		},
		acc: {
			value: Math.ceil(statusFaltantes.acc / mapPossibilidades['acc']),
		},
	}

	// TODO: verificar dinamicamente as gemas e grinds
	// incluir rare e legend com seus valores min e max
	/*
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
	*/

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

	/*
	<div class="r1">
		<h3>Runa 1</h3>
		<hr>
		<div class="sub1">
			<p><b>hp: 19</b></p>
			<div>
				<p>8 + 8 + 3</p>
			</div>
		</div>
		<hr>
		<div class="sub2">
			<p>atk: 13<img src="swcalc/img/gem_rare.png" alt="rare gem" class="gem"><img src="swcalc/img/grind_hero.png" alt="hero grind" class="grind"></p>
		</div>
	</div>
	*/
	for (r in runasFinais) {
		let runa = runasFinais[r]
		let elemRuna = document.createElement('div')
		elemRuna.classList.add('r' + r)
		document.getElementsByClassName('finalRunes')[0].appendChild(elemRuna)
		elemRuna.innerHTML = '<h3>Rune ' + r + '</h3>' + elemRuna.innerHTML

		let rarity = ['rare', 'hero', 'legend']
		let temp
		for (s in runa) {
			let status = runa[s]
			let ups = []
			ups.push(getUpsSubstats(status.value, status.atributo))

			let gem = getGemstoneStatus(status.atributo)
			let grind = getGrindstoneStatus(status.atributo)

			for (r of rarity) {
				temp = [0]
				if (grind[r].max) {
					temp = getUpsSubstats(status.value - grind[r].max, status.atributo)
					temp.push(grind[r].max)

					ups.push(temp)
				}
			}

			for (r of rarity) {
				temp = [0]
				if (gem[r].max > status.value)
					temp = [gem[r].min + gem[r].max - status.value]

				ups.push(temp)
			}

			for (rgem of rarity) {
				for (rgrind of rarity) {
					let tempGem = gem[rgem].max
					let tempGrind = grind[rgrind].max

					temp = [0]
					if (tempGem + tempGrind > status.value) {
						let control = 0;
						while (tempGem + tempGrind > status.value) {
							if (control == 0) {
								tempGem = tempGem > gem[rgem].min ? tempGem - 1 : tempGem
								control = 1
							} else {
								tempGrind = tempGrind > grind[rgrind].min ? tempGrind - 1 : tempGrind
								control = 0
							}
						}
						temp = [tempGem, tempGrind]
					}
					ups.push(temp)

				}
			}

			let div = ''
			div += '<div class="sub' + (s * 1 + 1) + '">'
			div += '	<p><b>' + status.atributo + ': ' + status.value + '</b></p>'
			div += '	<div>'

			for (u in ups) {
				u *= 1
				let possibility = ups[u]
				if (possibility[0] == 0) continue

				switch (u) {
					case 0:
						// ups
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 1:
						// rare grind
						div += '<p>' + possibility.join(' + ') + '<img src="swcalc/img/grind_rare.png" alt="rare grind" class="grind"></p>'
						break

					case 2:
						// hero grind
						div += '<p>' + possibility.join(' + ') + '<img src="swcalc/img/grind_hero.png" alt="hero grind" class="grind"></p>'
						break

					case 3:
						// legend grind
						div += '<p>' + possibility.join(' + ') + '<img src="swcalc/img/grind_legend.png" alt="legend grind" class="grind"></p>'
						break

					case 4:
						// rare gem
						div += '<p>' + possibility.join(' + ') + '<img src="swcalc/img/gem_rare.png" alt="rare gem" class="gem"></p>'
						break

					case 5:
						// hero gem
						div += '<p>' + possibility.join(' + ') + '<img src="swcalc/img/gem_hero.png" alt="hero gem" class="gem"></p>'
						break

					case 6:
						// legend gem
						div += '<p>' + possibility.join(' + ') + '<img src="swcalc/img/gem_legend.png" alt="legend gem" class="gem"></p>'
						break

					case 7:
						// rare gem + rare grind
						possibility[0] += '<img src="swcalc/img/gem_rare.png" alt="rare gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_rare.png" alt="rare grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 8:
						// rare gem + hero grind
						possibility[0] += '<img src="swcalc/img/gem_rare.png" alt="rare gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_hero.png" alt="hero grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 9:
						// rare gem + legend grind
						possibility[0] += '<img src="swcalc/img/gem_rare.png" alt="rare gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_legend.png" alt="legend grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 10:
						// hero gem + rare grind
						possibility[0] += '<img src="swcalc/img/gem_hero.png" alt="hero gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_rare.png" alt="rare grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 11:
						// hero gem + hero grind
						possibility[0] += '<img src="swcalc/img/gem_hero.png" alt="hero gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_hero.png" alt="hero grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 12:
						// hero gem + legend grind
						possibility[0] += '<img src="swcalc/img/gem_hero.png" alt="hero gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_legend.png" alt="legend grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 13:
						// legend gem + rare grind
						possibility[0] += '<img src="swcalc/img/gem_legend.png" alt="legend gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_rare.png" alt="rare grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 14:
						// legend gem + hero grind
						possibility[0] += '<img src="swcalc/img/gem_legend.png" alt="legend gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_hero.png" alt="hero grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break

					case 15:
						// legend gem + legend grind
						possibility[0] += '<img src="swcalc/img/gem_legend.png" alt="legend gem" class="gem">'
						possibility[1] += '<img src="swcalc/img/grind_legend.png" alt="legend grind" class="grind">'
						div += '<p>' + possibility.join(' + ') + '</p>'
						break
				}
			}
			div += '	</div>'
			div += '</div>'

			elemRuna.innerHTML += div

			// let elemSub = document.createElement('div')
			// elemSub.classList.add('sub' + (s * 1 + 1))
			// elemSub.textContent = status.atributo + ': ' + status.value
			// document.getElementsByClassName('r' + r)[0].appendChild(elemSub)

			// if (status.gem.value > 0) {
			// 	let img = document.createElement('img')
			// 	img.src = 'swcalc/img/gem_' + status.gem.raridade + '.png'
			// 	img.alt = status.gem.raridade + ' gem'
			// 	img.classList.add('gem')
			// 	elemSub.appendChild(img)
			// }
			// if (status.grind.value > 0) {
			// 	let img = document.createElement('img')
			// 	img.src = 'swcalc/img/grind_' + status.grind.raridade + '.png'
			// 	img.alt = status.grind.raridade + ' grind'
			// 	img.classList.add('grind')
			// 	elemSub.appendChild(img)
			// }

		}
		elemRuna.innerHTML += '<hr>'
	}
}