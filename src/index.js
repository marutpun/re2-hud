import 'regenerator-runtime/runtime';
import {
	healthPoint,
	inGameTime,
	daRank,
	daScore,
	enemyWrapper,
	sortHPPercentage,
	sortHPCurrent,
} from './utils';
import './css/style.css';

const JSON_ADDRESS = '127.0.0.1';
const JSON_PORT = 7190;
const POLLING_RATE = 333;

async function getData() {
	try {
		let res = await fetch(`http://${JSON_ADDRESS}:${JSON_PORT}/`);
		let data = await res.json();
		console.log(data);
		return appendData(data);
	} catch (err) {
		console.log(err);
	}
}

function appendData(data) {
	// player health point
	healthPoint.innerText = data.PlayerCurrentHealth;
	if (data.PlayerPoisoned) {
		healthPoint.className = `healthpoint healthpoint--poison`;
	} else if (data.PlayerCurrentHealth <= 1200 && data.PlayerCurrentHealth >= 801) {
		healthPoint.className = `healthpoint healthpoint--success`;
	} else if (data.PlayerCurrentHealth <= 800 && data.PlayerCurrentHealth >= 361) {
		healthPoint.className = `healthpoint healthpoint--warning`;
	} else {
		healthPoint.className = `healthpoint healthpoint--danger`;
	}

	// game time
	inGameTime.innerText = data.IGTFormattedString;

	// da rank, da score
	daRank.textContent = `DA Rank: ${data.Rank}`;
	daScore.textContent = `DA Score: ${data.RankScore.toFixed(3)}`;

	// enemy health point
	enemyWrapper.innerHTML = '';

	// add HP Bar
	data.EnemyHealth.sort((a, b) => {
		return sortHPPercentage(a.Percentage, b.Percentage) || sortHPCurrent(a.CurrentHP, b.CurrentHP);
	}).forEach((monster) => {
		const progressContainer = document.createElement('div');
		const progressBar = document.createElement('div');

		if (monster.IsAlive) {
			const percentageHP = parseFloat(monster.Percentage * 100).toFixed(2);
			progressContainer.className = `progress`;
			progressBar.className = `progress-bar`;
			progressBar.innerText = `${monster.CurrentHP} ${percentageHP}%`;
			progressBar.setAttribute('role', 'progressbar');
			progressBar.setAttribute('aria-valuenow', `${percentageHP}`);
			progressBar.setAttribute('aria-valuemin', 0);
			progressBar.setAttribute('aria-valuemax', 100);
			progressBar.style.width = `${percentageHP}%`;

			progressContainer.appendChild(progressBar);
			enemyWrapper.appendChild(progressContainer);
		}
	});
}

setInterval(getData, POLLING_RATE);
