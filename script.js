document.addEventListener('DOMContentLoaded', () => {
    yukleGecmis();
    yukleTema();
    initializeChart();
    initializeCamera();
    document.addEventListener('keydown', handleKeydown);
});

function hesapla(islem) {
    const number1 = parseFloat(document.getElementById('number1').value);
    const number2 = parseFloat(document.getElementById('number2').value);

    if (isNaN(number1) || (isNaN(number2) && !['karekök', 'sin', 'cos', 'log', 'faktoriyel'].includes(islem))) {
        document.getElementById('result').textContent = 'Lütfen geçerli sayılar girin!';
        document.getElementById('result').classList.add('show');
        return;
    }

    let sonuc;
    let islemMetni;
    switch (islem) {
        case 'topla':
            sonuc = number1 + number2;
            islemMetni = `${number1} + ${number2} = ${sonuc}`;
            break;
        case 'cikar':
            sonuc = number1 - number2;
            islemMetni = `${number1} - ${number2} = ${sonuc}`;
            break;
        case 'carp':
            sonuc = number1 * number2;
            islemMetni = `${number1} * ${number2} = ${sonuc}`;
            break;
        case 'bol':
            if (number2 === 0) {
                document.getElementById('result').textContent = 'Bölen 0 olamaz!';
                document.getElementById('result').classList.add('show');
                return;
            }
            sonuc = number1 / number2;
            islemMetni = `${number1} / ${number2} = ${sonuc}`;
            break;
        case 'karekök':
            sonuc = Math.sqrt(number1);
            islemMetni = `√${number1} = ${sonuc}`;
            break;
        case 'us':
            sonuc = Math.pow(number1, number2);
            islemMetni = `${number1} ^ ${number2} = ${sonuc}`;
            break;
        case 'mod':
            sonuc = number1 % number2;
            islemMetni = `${number1} % ${number2} = ${sonuc}`;
            break;
        case 'sin':
            sonuc = Math.sin(number1);
            islemMetni = `sin(${number1}) = ${sonuc}`;
            break;
        case 'cos':
            sonuc = Math.cos(number1);
            islemMetni = `cos(${number1}) = ${sonuc}`;
            break;
        case 'log':
            sonuc = Math.log(number1);
            islemMetni = `log(${number1}) = ${sonuc}`;
            break;
        case 'faktoriyel':
            sonuc = faktoriyel(number1);
            islemMetni = `${number1}! = ${sonuc}`;
            break;
        default:
            document.getElementById('result').textContent = 'Geçersiz işlem!';
            document.getElementById('result').classList.add('show');
            return;
    }

    const resultElement = document.getElementById('result');
    resultElement.textContent = `Sonuç: ${sonuc}`;
    resultElement.classList.add('show');

    ekleGecmis(islemMetni);
    saklaGecmis(islemMetni);
    updateChart(number1, number2, sonuc);
}

function faktoriyel(number) {
    if (number < 0) return 'Negatif sayılar için faktöriyel hesaplanamaz!';
    if (number === 0 || number === 1) return 1;
    return number * faktoriyel(number - 1);
}

function ekleGecmis(islem) {
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.textContent = islem;
    historyList.appendChild(listItem);

    setTimeout(() => {
        listItem.classList.add('show');
    }, 10);
}

function saklaGecmis(islem) {
    let gecmis = JSON.parse(localStorage.getItem('gecmis')) || [];
    gecmis.push(islem);
    localStorage.setItem('gecmis', JSON.stringify(gecmis));
}

function yukleGecmis() {
    const gecmis = JSON.parse(localStorage.getItem('gecmis')) || [];
    gecmis.forEach(islem => {
        ekleGecmis(islem);
    });
}

function temizleGecmis() {
    localStorage.removeItem('gecmis');
    document.getElementById('historyList').innerHTML = '';
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();
}

function toggleTheme() {
    const currentTheme = document.body.classList.toggle('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    document.getElementById('theme-button').textContent = currentTheme === 'dark' ? 'Açık Tema' : 'Koyu Tema';
}

function yukleTema() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
    document.getElementById('theme-button').textContent = savedTheme === 'dark' ? 'Açık Tema' : 'Koyu Tema';
}

let chart;

function initializeChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'İşlem Sonuçları',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart(number1, number2, sonuc) {
    chart.data.labels.push(`${number1} ve ${number2}`);
    chart.data.datasets[0].data.push(sonuc);
    chart.update();
}

function handleKeydown(event) {
    const keyMap = {
        '1': 'topla',
        '2': 'cikar',
        '3': 'carp',
        '4': 'bol',
        '5': 'karekök',
        '6': 'us',
        '7': 'mod',
        '8': 'sin',
        '9': 'cos',
        '0': 'log'
    };
    if (keyMap[event.key]) {
        hesapla(keyMap[event.key]);
    }
}

function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;
    if (feedbackText.trim() === '') {
        alert('Lütfen geri bildirim alanını doldurun.');
        return;
    }
    alert('Geri bildiriminiz için teşekkür ederiz!');
    document.getElementById('feedbackText').value = '';
}

function initializeCamera() {
    const video = document.getElementById('camera');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Kamera erişimi reddedildi: ', err);
        });
}

function captureImage() {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('camera');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    Tesseract.recognize(
        canvas,
        'eng',
        {
            logger: m => console.log(m)
        }
    ).then(({ data: { text } }) => {
        document.getElementById('ocr-result').textContent = `Tanınan metin: ${text}`;
        processOCRText(text);
    });
}

function processOCRText(text) {
    // Burada OCR ile tanınan metni matematiksel bir ifadeye dönüştürme ve hesaplama yapılır
    // Basit bir örnek: metni değerlendir ve sonucu göster
    try {
        const result = eval(text);
        document.getElementById('result').textContent = `OCR Sonucu: ${result}`;
        document.getElementById('result').classList.add('show');
    } catch (error) {
        document.getElementById('result').textContent = 'Geçersiz ifade!';
        document.getElementById('result').classList.add('show');
    }
}
