// Функция для загрузки CSV файлов
async function loadCSV(url) {
    const response = await fetch(url);
    const text = await response.text();

    // Используем PapaParse для парсинга CSV
    const parsedData = Papa.parse(text, {
        header: true, // предполагаем, что первая строка - заголовки
        skipEmptyLines: true
    }).data;

    const data = {};

    if (url==='data/classes.csv') {
        parsedData.forEach(row => {
            const id = row.id.trim();
            const name = row.name.trim();
            const icon = row.icon.trim();
            if (id && name) {
                data[id] = {
                    name,
                    icon,
                };
            }
        });
    } else {
        parsedData.forEach(row => {
            const id = row.id.trim();
            const name = row.name.trim();
            const color1 = row.color1 ? row.color1.trim() : null;
            const color2 = row.color2 ? row.color2.trim() : null;
            const color3 = row.color3 ? row.color3.trim() : null;
            if (id && name) {
                data[id] = {
                    name,
                    color1,
                    color2,
                    color3
                };
            }
        });
    }



    return data;
}

// Функция для обработки кодов и вывода информации
async function processCodes() {
    const weapons = await loadCSV('data/weapons.csv');
    const troops = await loadCSV('data/troops.csv');
    const classes = await loadCSV('data/classes.csv');

    const codeBlocks = document.querySelectorAll('code');

    codeBlocks.forEach(block => {
        const copyIcon = document.createElement('i');
        copyIcon.classList.add('fas', 'fa-copy', 'copy-icon');
        block.parentNode.insertBefore(copyIcon, block);

        const codes = JSON.parse(block.textContent);
        let output = '';
        let classOutput = '';
        let bannerOutput = '';

        codes.forEach(code => {
            let displayString = '';

            if (code >= 3000 && code < 4000) {
                const banner_num = code - 3000
                bannerOutput += `<div class="banner">`
                bannerOutput += `<img src="assets/banners/Banners_K${banner_num}_thumb.png" alt="Знамя ${banner_num}">`
                bannerOutput += `</div>`
            } else if (code >= 1000 && code < 2000) {
                const weapon = weapons[code];
                const colors = getColors(weapon);
                displayString = '<div style="display:flex; line-height: 30px; padding: 5px">';
                displayString += createColoredCircle(colors);
                displayString += `<img src="assets/weapon.png" alt="Weapon" class="icon" width="34" height="30">`;
                displayString += `<div> ${weapon.name}</div></div>`;
            } else if (code >= 6000 && code < 8000) {
                const troop = troops[code];
                const colors = getColors(troop);
                displayString = '<div style="display:flex; line-height: 30px; padding: 5px">';
                displayString += createColoredCircle(colors);
                displayString += `<div>${troop.name}</div></div>`;
            } else if (code >= 14000 && code < 14100) {
                const hero_class = classes[code];
                classOutput += `<img src="assets/classes/${hero_class.icon}.png" alt="${hero_class.name}" class="class-icon" /><br/>`
                classOutput += `${hero_class.name}</div>`;
            }

            output += displayString;
        });

        // Вставляем результаты под блоком с кодами
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('info')
        resultDiv.innerHTML = bannerOutput + '<div class="team">' + output + '</div><div class="class">' + classOutput + '</div>';
        block.parentNode.insertBefore(resultDiv, block.nextSibling);

        // Настройка копирования в буфер обмена
        const clipboard = new ClipboardJS(copyIcon, {
            text: () => block.textContent
        });

        clipboard.on('success', () => {
            block.style.backgroundColor = '#535C91'; // Цвет фона при копировании
            setTimeout(() => {
                block.style.backgroundColor = ''; // Возврат к исходному цвету
            }, 500);
            console.log('Код скопирован в буфер обмена!');
        });

        clipboard.on('error', () => {
            console.log('Ошибка при копировании.');
        });
    });
}


// Функция для получения массива цветов
function getColors(item) {
    const colors = [];
    if (item.color1 && item.color1 !== 'null') colors.push(item.color1.trim());
    if (item.color2 && item.color2 !== 'null') colors.push(item.color2.trim());
    if (item.color3 && item.color3 !== 'null') colors.push(item.color3.trim());
    return colors.length > 0 ? colors : null;
}

// Функция для создания круга с цветами
function createColoredCircle(colors) {
    const colorMap = {
        'желтый': '#d6ae29',
        'коричневый': '#422429',
        'пурпурный': '#7714b9',
        'зеленый': '#398d10',
        'красный': '#c92134',
        'синий': '#1861b5'
    };

    let circleHTML = '<div class="color-circle">';

    // Убедимся, что есть только необходимые цвета
    if (colors.includes('All')) {
        colors = Object.keys(colorMap);
    }

    const sectorsCount = colors.length;
    const angleStep = 360 / sectorsCount;

    // Формируем резкий градиент
    const colorStops = colors.map((color, index) => {
        const startAngle = index * angleStep;
        return `${colorMap[color]} ${startAngle}deg, ${colorMap[color]} ${startAngle + angleStep}deg`;
    }).join(', ');

    // Создаем круг с резким градиентом
    circleHTML += `
        <div class="sector" style="background: conic-gradient(${colorStops});"></div>
    `;

    circleHTML += '</div>';
    return circleHTML;
}

// Запуск функции после загрузки страницы
window.onload = processCodes;