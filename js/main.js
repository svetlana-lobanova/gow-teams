import { fetchTeams } from './fetchTeams.js';
import { displayResults } from './displayResults.js';

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return params.get('combo') ? params.get('combo') : '';
}

window.onload = async () => {
    const combo = getQueryParams();

    const combos = {
        'PVP желтый': ['pvp', 'yellow'],
        'PVP фиолетовый': ['pvp', 'purple'],
        'PVP зеленый': ['pvp', 'green'],
        'Вторжение-капитан Гном-Надзиратель': ['dwarven-overseer', 'invasion'],
        'Фракция желто-коричневый': ['faction', 'yellow-brown'],
        'Фракция желтый': ['faction', 'yellow'],
        'Фракция коричневый': ['faction', 'brown'],
        'Импириназар': ['emperinazar'],
        'Подшпиль-Казиел': ['underspire', 'kaziel']
    };

    if (combo !== '') {
        document.title = combo;
        const teams = await fetchTeams(combos[combo]);
        await displayResults(teams);
    } else {
        document.getElementById('results').innerHTML = '<p>Не выбран тип команды</p>';
    }
};