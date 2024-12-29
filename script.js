document.addEventListener('DOMContentLoaded', () => {
    // Language selection
    const languageToggle = document.getElementById('language-toggle');
    const languageOptions = document.getElementById('language-options');
    const languageButtons = languageOptions.querySelectorAll('button');

    languageToggle.addEventListener('click', () => {
        languageOptions.style.display = languageOptions.style.display === 'none' ? 'block' : 'none';
    });

    function changeLanguage(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-' + lang + ']').forEach(elem => {
            elem.textContent = elem.getAttribute('data-' + lang);
        });
        languageOptions.style.display = 'none';
        showFact(); // Update the current fact
        updateScore(); // Update the score display
    }

    languageButtons.forEach(button => {
        button.addEventListener('click', () => changeLanguage(button.getAttribute('data-lang')));
    });

    // Menorah
    const menorah = document.getElementById('menorah');
    const lightCandleBtn = document.getElementById('light-candle');
    let litCandles = 0;

    lightCandleBtn.addEventListener('click', () => {
        if (litCandles < 8) {
            const candle = menorah.children[litCandles + 1];
            candle.classList.add('lit');
            litCandles++;
            if (litCandles === 8) {
                lightCandleBtn.disabled = true;
            }
        }
    });

    // Dreidel
    const dreidel = document.getElementById('dreidel');
    const spinDreidelBtn = document.getElementById('spin-dreidel');
    const dreidelResult = document.getElementById('dreidel-result');
    const sides = {
        he: ['נ (Nun)', 'ג (Gimel)', 'ה (Hey)', 'ש (Shin)'],
        en: ['N (Nun)', 'G (Gimel)', 'H (Hey)', 'S (Shin)'],
        ru: ['Н (Нун)', 'Г (Гимель)', 'Х (Хей)', 'Ш (Шин)']
    };

    spinDreidelBtn.addEventListener('click', () => {
        const randomSide = Math.floor(Math.random() * 4);
        const rotations = Math.floor(Math.random() * 5) + 5; // 5-10 rotations
        const totalRotation = rotations * 360 + randomSide * 90;

        dreidel.style.transform = `rotateY(${totalRotation}deg)`;
        
        setTimeout(() => {
            const currentLang = document.documentElement.lang;
            dreidelResult.textContent = `${dreidelResult.getAttribute('data-' + currentLang)}: ${sides[currentLang][randomSide]}`;
        }, 3000);
    });

    // Facts Carousel
    const facts = {
        he: [
            "חנוכה נמשך שמונה לילות כדי להנציח כמה זמן בער האור הקדוש.",
            "משמעות המילה 'חנוכה' היא 'הקדשה' בעברית.",
            "באופן מסורתי, מתנות לא היו חלק מחנוכה. מסורת הענקת המתנות היא חדשה יחסית.",
            "משחק הסביבונים נוצר כדרך ליהודים ללמוד את התורה בסתר כשהיא אסורה.",
            "חנוכה אינו החג היהודי החשוב ביותר, למרות הפופולריות שלו בתרבות המערבית."
        ],
        en: [
            "Hanukkah lasts eight nights to commemorate how long the holy light burned.",
            "The word 'Hanukkah' means 'dedication' in Hebrew.",
            "Traditionally, gifts were not part of Hanukkah. The gift-giving tradition is relatively new.",
            "The dreidel game was created as a way for Jews to study Torah in secret when it was forbidden.",
            "Hanukkah is not the most important Jewish holiday, despite its popularity in Western culture."
        ],
        ru: [
            "Ханука длится восемь ночей в память о том, как долго горел священный свет.",
            "Слово 'Ханука' означает 'освящение' на иврите.",
            "Традиционно подарки не были частью Хануки. Традиция дарить подарки относительно нова.",
            "Игра в дрейдл была создана как способ для евреев тайно изучать Тору, когда это было запрещено.",
            "Ханука не является самым важным еврейским праздником, несмотря на ее популярность в западной культуре."
        ]
    };
    const factElement = document.getElementById('fact');
    const prevFactBtn = document.getElementById('prev-fact');
    const nextFactBtn = document.getElementById('next-fact');
    let currentFact = 0;

    function showFact() {
        const currentLang = document.documentElement.lang;
        gsap.to(factElement, {opacity: 0, duration: 0.5, onComplete: () => {
            factElement.textContent = facts[currentLang][currentFact];
            gsap.to(factElement, {opacity: 1, duration: 0.5});
        }});
    }

    prevFactBtn.addEventListener('click', () => {
        currentFact = (currentFact - 1 + facts[document.documentElement.lang].length) % facts[document.documentElement.lang].length;
        showFact();
    });

    nextFactBtn.addEventListener('click', () => {
        currentFact = (currentFact + 1) % facts[document.documentElement.lang].length;
        showFact();
    });

    showFact();

    // Latke Flipping Game
    const latke = document.getElementById('latke');
    const flipLatkeBtn = document.getElementById('flip-latke');
    const scoreElement = document.getElementById('score');
    let isFlipping = false;
    let score = 0;

    function updateScore() {
        const currentLang = document.documentElement.lang;
        scoreElement.textContent = `${scoreElement.getAttribute('data-' + currentLang).split(':')[0]}: ${score}`;
    }

    flipLatkeBtn.addEventListener('click', () => {
        if (!isFlipping) {
            isFlipping = true;
            gsap.to(latke, {
                rotationX: 360,
                duration: 0.5,
                onComplete: () => {
                    gsap.set(latke, {rotationX: 0});
                    isFlipping = false;
                    score++;
                    updateScore();
                    if (score % 5 === 0) {
                        gsap.to(scoreElement, {scale: 1.2, yoyo: true, repeat: 1, duration: 0.3});
                    }
                }
            });
        }
    });

    // Set initial language
    changeLanguage('he');
});