// Функция для загрузки CSV файлов
async function loadCSV(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

        const text = await response.text();

        // Используем PapaParse для парсинга CSV
        const parsedData = Papa.parse(text, {
            header: true, // предполагаем, что первая строка - заголовки
            skipEmptyLines: true
        }).data;

        return parseCSVData(parsedData, url);
    } catch (error) {
        console.error("Ошибка при загрузке CSV: ", error);
        return {};
    }
}

// Обработка данных CSV в зависимости от типа файла
function parseCSVData(parsedData, url) {
    const data = {};

    const isClassFile = url === 'data/classes.csv';
    parsedData.forEach(row => {
        const id = row.id?.trim();
        const name = row.name?.trim();
        if (!id || !name) return;

        const entry = {
            name,
            ...(isClassFile ? { icon: row.icon?.trim() } : {
                color1: row.color1?.trim() || null,
                color2: row.color2?.trim() || null,
                color3: row.color3?.trim() || null
            })
        };
        data[id] = entry;
    });

    return data;
}

// Функция для обработки кодов и вывода информации
async function processCode(codesString) {
    const [weapons, troops, classes] = await Promise.all([
        loadCSV('data/weapons.csv'),
        loadCSV('data/troops.csv'),
        loadCSV('data/classes.csv')
    ]);

    const block = document.createElement('code');
    block.textContent = codesString;
    const copyIcon = createCopyIcon(block);

    const codes = JSON.parse(codesString);
    const { output, classOutput, bannerOutput } = parseCodes(codes, weapons, troops, classes);

    // Создаем контейнер для результатов
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('info');
    resultDiv.innerHTML = `<div class="team">${output}</div><div class="class">${classOutput}</div>`;

    document.body.appendChild(block);
    block.parentNode.insertBefore(copyIcon, block);
    document.body.appendChild(resultDiv);
}

// Создание и настройка иконки копирования
function createCopyIcon(block) {
    const copyIcon = document.createElement('i');
    copyIcon.classList.add('fas', 'fa-copy', 'copy-icon');

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

    return copyIcon;
}

// Обработка кодов и формирование вывода
function parseCodes(codes, weapons, troops, classes) {
    let output = '';
    let classOutput = '';
    let bannerOutput = '';

    codes.forEach(code => {
        if (code >= 3000 && code < 4000) {
            bannerOutput += createBanner(code);
        } else if (code >= 1000 && code < 2000) {
            output += createWeaponOutput(code, weapons);
        } else if (code >= 6000 && code < 8000) {
            output += createTroopOutput(code, troops);
        } else if (code >= 14000 && code < 14100) {
            classOutput += createClassOutput(code, classes);
        }
    });

    return { output, classOutput, bannerOutput };
}

// Функции для создания вывода
function createBanner(code) {
    const bannerNum = code - 3000;
    return `<div class="banner">
                <img src="assets/banners/Banners_K${bannerNum}_thumb.png" alt="Знамя ${bannerNum}">
            </div>`;
}

function createWeaponOutput(code, weapons) {
    const weapon = weapons[code];
    const colors = getColors(weapon);
    return `<div style="display:flex; line-height: 30px; padding: 5px">
                ${createColoredCircle(colors)}
                <img src="assets/weapon.png" alt="Weapon" class="icon" width="34" height="30">
                <div>${weapon.name}</div>
            </div>`;
}

function createTroopOutput(code, troops) {
    const troop = troops[code];
    const colors = getColors(troop);
    return `<div style="display:flex; line-height: 30px; padding: 5px">
                ${createColoredCircle(colors)}
                <div>${troop.name}</div>
            </div>`;
}

function createClassOutput(code, classes) {
    const heroClass = classes[code];
    return `<img src="assets/classes/${heroClass.icon}.png" alt="${heroClass.name}" class="class-icon" /><br/>${heroClass.name}`;
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

    if (colors.includes('All')) {
        colors = Object.keys(colorMap);
    }

    const sectorsCount = colors.length;
    const angleStep = 360 / sectorsCount;

    const colorStops = colors.map((color, index) => {
        const startAngle = index * angleStep;
        return `${colorMap[color]} ${startAngle}deg, ${colorMap[color]} ${startAngle + angleStep}deg`;
    }).join(', ');

    return `<div class="color-circle">
                <div class="sector" style="background: conic-gradient(${colorStops});"></div>
            </div>`;
}

// Обрабатываем список кодов
export async function processCodes(codeList) {
    for (const code of codeList) {
        await processCode(code); // Ждем завершения каждой обработки
    }
}
