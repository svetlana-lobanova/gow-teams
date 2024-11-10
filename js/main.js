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
        'PVP синий': ['pvp', 'blue'],
        'PVP коричневый': ['pvp', 'brown'],
        'PVP фиолетовый': ['pvp', 'purple'],
        'Вторжение-капитан Гном-Надзиратель': ['dwarven-overseer', 'invasion'],
        'Башня-бед красный Стена-Беды': ['doomed-wall', 'tod'],
        'Фракция желто-коричневый': ['faction', 'yellow-brown'],
        'Фракция желтый': ['faction', 'yellow'],
        'Фракция коричневый': ['faction', 'brown'],
        'Фракция синий': ['faction', 'blue'],
        'Фракция зеленый': ['faction', 'green'],
        'Фракция коричнево-синий': ['faction', 'brown-blue'],
        'Фракция коричнево-зеленый': ['faction', 'brown-green'],
        'Фракция зелено-синий': ['faction', 'green-blue'],
        'Фракция желто-синий': ['faction', 'yellow-blue'],
        'Фракция красно-зеленый': ['faction', 'red-green'],
        'Фракция фиолетово-синий': ['faction', 'purple-blue'],
        'Фракция красно-синий': ['faction', 'red-blue'],
        'Фракция красный': ['faction', 'red'],
        'Фракция красно-коричневый': ['faction', 'red-brown'],
        'Фракция зелено-коричневый': ['faction', 'green-brown'],
        'Фракция фиолетово-зеленй': ['faction', 'purple-green'],
        'Сочащиеся пещеры': ['dripping-caverns'],
        'Импириназар': ['emperinazar'],
        'Подшпиль-Казиел': ['underspire', 'kaziel'],
        'Подшпиль-Грош-нак': ['underspire', 'grosh-nak']
    };

    if (combo !== '') {
        document.title = combo;
        const teams = await fetchTeams(combos[combo]);
        await displayResults(teams);
    } else {
        document.getElementById('results').innerHTML = '<p>Не выбран тип команды</p>';
    }
};