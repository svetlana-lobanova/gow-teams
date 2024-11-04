import { processCodes } from './formatTeams.js';

export async function displayResults(teams) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Очищаем предыдущие результаты

    if (teams.length === 0) {
        resultsDiv.innerHTML = '<p>Нет команд, соответствующих указанным параметрам.</p>';
        return;
    }

    await processCodes(teams)
}