(function () {

    //BURGER

    document.addEventListener("DOMContentLoaded", () => {
        const burgerScreen = document.querySelector(".burger-screen");

        const openScreen = () => {
            const scrollBarW = window.innerWidth - document.documentElement.clientWidth;
            if (scrollBarW > 0) document.body.style.paddingRight = scrollBarW + "px";
            document.body.classList.add("no-scroll");
            burgerScreen.classList.add("is-open");
        };

        const closeScreen = () => {
            burgerScreen.classList.remove("is-open");
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";
        };

        const toggleScreen = (e) => {
            e.preventDefault();
            burgerScreen.classList.contains("is-open") ? closeScreen() : openScreen();
        };

        // 1) Навешиваем на все .burger-icon (и на ту, что внутри .burger-screen тоже)
        document.querySelectorAll(".burger-icon").forEach(icon => {
            icon.addEventListener("click", toggleScreen);
        });

        // 2) Закрытие по Esc
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeScreen();
        });

        // 3) Делегирование: клик по ЛЮБОЙ ссылке внутри экрана закрывает его
        burgerScreen.addEventListener("click", (e) => {
            const link = e.target.closest("a");
            if (link) closeScreen();
        });
    });





    //Swiper

    const swiper = new Swiper(".swiper", {
        allowTouchMove: true,
        autoHeight: false,
        loop: false,
        slidesPerView: 'auto',
        pagination: {
            el: ".swiper-pagination",
            type: "custom",
            renderCustom: function (swiper, current, total) {
                return `<span class="swiper-pagination-current">${current}</span> из <span class="swiper-pagination-total">${total}</span>`;
            },
        },
        navigation: {
            nextEl: ".swiper-slide-next",
            prevEl: ".swiper-slide-prev",
        },
        breakpoints: {
            394: {
                slidesPerView: 'auto',
            },
            769: {
                allowTouchMove: false,
            },
        }
    });

    //counter
    document.addEventListener('DOMContentLoaded', () => {
        const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

        document.addEventListener('click', (e) => {
            const plus = e.target.closest('.swiper-slide__item-plus');
            const minus = e.target.closest('.swiper-slide__item-minus');
            if (!plus && !minus) return;

            const form = e.target.closest('.swiper-slide__item-form');
            if (!form) return;

            const out = form.querySelector('.swiper-slide__item-start, #result');
            const btnPlus = form.querySelector('.swiper-slide__item-plus');
            const btnMinus = form.querySelector('.swiper-slide__item-minus');

            let value = parseInt(out.textContent, 10) || 1;

            value += plus ? 1 : -1;
            value = clamp(value, 1, 10);

            out.textContent = value;

            btnMinus.disabled = value <= 1;
            btnPlus.disabled = value >= 10;
        });

        document.querySelectorAll('.swiper-slide__item-form').forEach(form => {
            const out = form.querySelector('.swiper-slide__item-start, #result');
            const btnPlus = form.querySelector('.swiper-slide__item-plus');
            const btnMinus = form.querySelector('.swiper-slide__item-minus');
            const value = parseInt(out.textContent, 10) || 1;
            btnMinus.disabled = value <= 1;
            btnPlus.disabled = value >= 10;
        });
    });


    //buttomMore


    document.addEventListener('DOMContentLoaded', () => {
        const list = document.querySelector('.special__flex-list');
        const items = Array.from(list.querySelectorAll('.special__flex-link'));
        const button = document.querySelector('.special__flex-button'); // если есть

        let expanded = false;

        function applyState() {

            items.forEach(el => el.style.display = 'flex');

            if (expanded) {
                button && (button.textContent = 'Скрыть');
                return;
            }

            const firstRowTop = items.length ? items[0].offsetTop : 0;

            items.forEach(el => {
                el.style.display = (el.offsetTop === firstRowTop) ? 'flex' : 'none';
            });

            button && (button.textContent = 'Показать ещё');
        }

        button?.addEventListener('click', () => {
            expanded = !expanded;
            applyState();
        });

        window.addEventListener('resize', () => {
            if (!expanded) applyState();
        });

        applyState();
    });

    //roll


    (function () {
        const root = document.querySelector('.special__roll');
        const native = root.querySelector('.special__roll-choice'); // твой <select>

        // 0) прячем нативный select, но оставляем в форме
        native.style.position = 'absolute';
        native.style.opacity = '0';
        native.style.pointerEvents = 'none';

        // 1) «кнопка» (то, что видно вместо select)
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'special__roll-btn';
        btn.setAttribute('aria-haspopup', 'listbox');
        btn.setAttribute('aria-expanded', 'false');
        root.appendChild(btn);

        // 2) панель со списком
        const panel = document.createElement('div');
        panel.className = 'special__roll-panel';
        panel.setAttribute('role', 'region');
        root.appendChild(panel);

        // прозрачный верхний отступ
        const spacer = document.createElement('div');
        spacer.className = 'special__roll-spacer';
        panel.appendChild(spacer);

        // сам список
        const list = document.createElement('ul');
        list.className = 'special__roll-list';
        list.setAttribute('role', 'listbox');
        panel.appendChild(list);

        // замена функции makeCheck
        const makeCheck = () => {
            const img = document.createElement('img');
            img.src = 'img/svg/mark.svg';  // путь к твоей иконке
            img.alt = 'selected';
            img.classList.add('special__roll-check');
            return img;
        };


        // создаём пункты по <option>
        const options = Array.from(native.options);
        const items = options.map(opt => {
            const li = document.createElement('li');
            li.className = 'special__roll-option';
            li.setAttribute('role', 'option');
            li.setAttribute('data-value', opt.value);
            li.textContent = opt.textContent;
            li.appendChild(makeCheck()); // иконка справа (скрыта по умолчанию)
            li.addEventListener('click', () => choose(opt.value, true));
            list.appendChild(li);
            return li;
        });

        // выбор значения
        function choose(value, user) {
            native.value = value;                   // синхронизация с form
            btn.textContent = options.find(o => o.value === value)?.textContent || '';
            items.forEach(li => {
                const sel = li.getAttribute('data-value') === value;
                li.classList.toggle('is-selected', sel);
                li.setAttribute('aria-selected', sel ? 'true' : 'false');
            });
            if (user) native.dispatchEvent(new Event('change', { bubbles: true }));
            close();
        }

        // открыть/закрыть
        function open() {
            panel.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            root.classList.add('is-open'); // для смены стрелки
        }
        function close() {
            panel.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            root.classList.remove('is-open');
        }
        function toggle() { panel.classList.contains('open') ? close() : open(); }

        // начальная инициализация
        choose(native.value || options[0].value, false);
        btn.addEventListener('click', toggle);

        // клик вне компонента — закрыть
        document.addEventListener('click', (e) => {
            if (!root.contains(e.target)) close();
        });

        // если кто-то меняет <select> извне
        native.addEventListener('change', () => choose(native.value, false));
    })();


    //selectselect

    document.addEventListener('DOMContentLoaded', () => {
        const select = document.getElementById('sort');
        const wrapper = document.querySelector('.swiper .swiper-wrapper');

        // 1) Получаем инстанс Swiper (любой из способов)
        // ВАЖНО: при инициализации запиши в window.mySwiper:
        // window.mySwiper = new Swiper('.swiper', {... });
        const getSwiper = () =>
            window.mySwiper ||
            window.swiper ||
            (document.querySelector('.swiper') && document.querySelector('.swiper').swiper) ||
            null;

        // Функция безопасного перехода к первому слайду (после update)
        const goFirst = (animate = false) => {
            const sw = getSwiper();
            if (!sw) return;
            // ждём кадр после update(), чтобы клоны/ширины актуализировались
            requestAnimationFrame(() => sw.slideTo(0, animate ? 400 : 400));
        };

        if (!select || !wrapper) {
            console.warn('[sort] select or wrapper not found');
            return;
        }

        // Берём только «настоящие» слайды (без клонов)
        const slideEls = Array.from(wrapper.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)'));
        // Каждый слайд содержит список карточек
        const lists = slideEls.map(slide => slide.querySelector('.swiper-slide__list'));
        // Собираем ВСЕ карточки (DOM-элементы)
        const allItems = lists.flatMap(list => Array.from(list.querySelectorAll('.product')));

        // Сколько карточек сейчас влазит в ОДИН слайд (по факту)
        function calcItemsPerSlide() {
            const list = lists[0];
            if (!list) return allItems.length;
            const currentPerSlide = list.children.length; // фактическая вместимость
            // fallback по колонкам, если вдруг пусто
            const cols = getComputedStyle(list).gridTemplateColumns.trim().split(/\s+/).length || 1;
            return currentPerSlide || cols;
        }

        // Перекладка карточек по слайдам
        function repartition(sortedItems) {
            const perSlide = calcItemsPerSlide();

            // очистим старое содержимое
            lists.forEach(list => (list.innerHTML = ''));

            // разложим по текущим слайдам
            let i = 0;
            lists.forEach(list => {
                for (let k = 0; k < perSlide && i < sortedItems.length; k++, i++) {
                    list.appendChild(sortedItems[i]);
                }
            });

            // если карточек больше — можно создать новые слайды (опционально)
            while (i < sortedItems.length) {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                const ul = document.createElement('ul');
                ul.className = 'swiper-slide__list';
                slide.appendChild(ul);
                wrapper.appendChild(slide);
                lists.push(ul);
                for (let k = 0; k < perSlide && i < sortedItems.length; k++, i++) {
                    ul.appendChild(sortedItems[i]);
                }
            }

            // Обновляем Swiper и возвращаемся к первому слайду
            const sw = getSwiper();
            if (sw) {
                if (sw.params.loop) {
                    sw.loopDestroy();
                    sw.updateSlides();
                    sw.loopCreate();
                    sw.update();
                } else {
                    sw.updateSlides();
                    sw.update();
                }
                goFirst(false); // без анимации после пересборки
            }
        }

        // Сортировка
        function sortItems(type) {
            const sorted = [...allItems];

            switch (type) {
                case 'cheap':
                    sorted.sort((a, b) => +a.dataset.price - +b.dataset.price);
                    break;
                case 'expensive':
                    sorted.sort((a, b) => +b.dataset.price - +a.dataset.price);
                    break;
                case 'popular':
                    sorted.sort((a, b) => +b.dataset.popular - +a.dataset.popular);
                    break;
                case 'hrate':
                    sorted.sort((a, b) => +b.dataset.rating - +a.dataset.rating);
                    break;
                case 'new':
                    sorted.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
                    break;
                default:
                    return;
            }

            repartition(sorted);
        }

        // При выборе в select: сортируем и уводим к первому слайду (мягко)
        select.addEventListener('change', e => {
            sortItems(e.target.value);
            goFirst(true); // плавно при ручном выборе
        });

        // На ресайзе — пересобрать и без анимации вернуться к началу
        window.addEventListener('resize', () => {
            sortItems(select.value);
            goFirst(false);
        });

        // Стартовая раскладка
        sortItems(select.value);
        goFirst(false);
    });


    //galleryButton

    document.addEventListener('DOMContentLoaded', () => {
        const VISIBLE_COUNT = 3;

        // выбираем все блоки отзывов
        document.querySelectorAll('.rev__section').forEach(review => {
            const wrapper = review.querySelector('.gallery__wrapper');
            const btn = review.querySelector('.rev__section-op-button');
            if (!wrapper || !btn) return;

            const slides = Array.from(wrapper.querySelectorAll('.gallery__slide'));
            if (slides.length === 0) { btn.style.display = 'none'; return; }

            let expanded = false;

            if (slides.length <= VISIBLE_COUNT) {
                btn.style.display = 'none';
            } else {
                slides.slice(VISIBLE_COUNT).forEach(el => el.classList.add('is-hidden'));
                btn.textContent = 'Смотреть все фото';
            }

            btn.addEventListener('click', () => {
                expanded = !expanded;
                if (expanded) {
                    slides.forEach(el => el.classList.remove('is-hidden'));
                    btn.textContent = 'Свернуть';
                } else {
                    slides.slice(VISIBLE_COUNT).forEach(el => el.classList.add('is-hidden'));
                    btn.textContent = 'Смотреть все фото';
                }
            });
        });
    });

    //buttonBasket

    document.addEventListener("DOMContentLoaded", () => {
        const basketButtons = document.querySelectorAll(".swiper-slide__item-basket");
        const basketBadge = document.querySelector(".basket__badge");
        let count = 0;

        basketButtons.forEach(button => {
            button.addEventListener("click", () => {
                count++; // считаем реально дальше, без ограничения

                // показываем бейдж при первом клике
                basketBadge.style.display = "block";

                // отображаем максимум 99+
                basketBadge.textContent = count > 99 ? "99+" : count;
            });
        });
    });





    //rev__listButton 

    document.addEventListener('DOMContentLoaded', () => {
        const list = document.querySelector('.rev__list');
        const btn = document.querySelector('.rev__footer-button');
        if (!list || !btn) return;

        const items = Array.from(list.querySelectorAll('.rev__section'));
        const VISIBLE = 3;

        function applyArrowRotation(expanded) {
            const svg = btn.querySelector('svg');
            if (!svg) return;
            svg.classList.toggle('rotated', !!expanded);
        }

        function collapse() {
            items.forEach((li, i) => li.style.display = i < VISIBLE ? '' : 'none');
            if (items.length <= VISIBLE) {
                btn.style.display = 'none';
            } else {
                btn.style.display = '';
                btn.dataset.mode = 'collapsed';
                // вернуть текст + оставить svg, если был
                btn.innerHTML = `Показать еще ${btn.innerHTML.match(/<svg[\s\S]*$/) || ''}`;
                applyArrowRotation(false);
            }
        }

        function expand() {
            items.forEach(li => li.style.display = '');
            btn.dataset.mode = 'expanded';
            btn.innerHTML = `Свернуть ${btn.innerHTML.match(/<svg[\s\S]*$/) || ''}`;
            applyArrowRotation(true);
        }

        // старт
        collapse();

        btn.addEventListener('click', () => {
            if (btn.dataset.mode === 'collapsed') expand();
            else collapse();
        });
    });

    // ------- Вспомогательные функции видимости --------
    function isActuallyVisible(el) {
        const cs = getComputedStyle(el);
        if (el.hidden) return false;
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }

    document.addEventListener("DOMContentLoaded", () => {
        // дубликат на случай изоляции — оставляю как у тебя
        function isActuallyVisible(el) {
            if (!el) return false;
            const cs = getComputedStyle(el);
            if (el.hidden) return false;
            if (cs.display === "none" || cs.visibility === "hidden") return false;
            return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        }

        function markLastVisible() {
            document.querySelectorAll(".rev__list").forEach(list => {
                const items = Array.from(list.querySelectorAll(".rev__section"));
                items.forEach(li => li.classList.remove("is-last-visible"));
                const visibles = items.filter(isActuallyVisible);
                const lastVisible = visibles.at(-1);
                if (lastVisible) lastVisible.classList.add("is-last-visible");
            });
        }

        // при загрузке
        markLastVisible();

        const showMoreBtn = document.querySelector(".rev__footer-button");
        if (showMoreBtn) {
            showMoreBtn.addEventListener("click", () => {
                document.querySelectorAll(".rev__section.is-hidden").forEach(el => el.classList.remove("is-hidden"));
                markLastVisible();
            });
        }

        window.addEventListener("resize", markLastVisible);
    });


    //accordion

    document.addEventListener("DOMContentLoaded", () => {
        const items = Array.from(document.querySelectorAll(".tab-controls__item"));
        if (!items.length) return;

        // Кэшируем ссылки на элементы и пути к иконкам для каждого пункта
        const store = new WeakMap();

        items.forEach(item => {
            const btn = item.querySelector(".tab-controls__button");
            const text = item.querySelector(".tab-controls__text");
            if (!btn || !text) return;

            const ICON_OPEN = btn.dataset.iconOpen || "img/svg/cross.svg";   // когда раскрыто
            const ICON_CLOSED = btn.dataset.iconClosed || "img/svg/bigPlus.svg"; // когда закрыто

            // <img> для иконки (создадим, если его нет)
            let iconImg = btn.querySelector("img.tab-controls__icon");
            if (!iconImg) {
                iconImg = document.createElement("img");
                iconImg.className = "tab-controls__icon";
                iconImg.alt = "toggle";
                btn.innerHTML = "";
                btn.appendChild(iconImg);
            }

            // Старт: всё закрыто
            item.classList.remove("is-open");
            text.style.maxHeight = "0px";
            iconImg.src = ICON_CLOSED;

            store.set(item, { btn, text, iconImg, ICON_OPEN, ICON_CLOSED });
        });

        // Хелперы
        const openItem = (item) => {
            const data = store.get(item);
            if (!data) return;
            const { text, iconImg, ICON_OPEN } = data;
            item.classList.add("is-open");
            // ставим фактическую высоту контента
            text.style.maxHeight = text.scrollHeight + "px";
            iconImg.src = ICON_OPEN;
        };

        const closeItem = (item) => {
            const data = store.get(item);
            if (!data) return;
            const { text, iconImg, ICON_CLOSED } = data;
            item.classList.remove("is-open");
            text.style.maxHeight = "0px";
            iconImg.src = ICON_CLOSED;
        };

        // Клики: открываем текущий, закрываем остальные
        items.forEach(item => {
            const { btn } = store.get(item) || {};
            if (!btn) return;

            btn.addEventListener("click", () => {
                const isOpen = item.classList.contains("is-open");
                // закрыть всё
                items.forEach(closeItem);
                // если текущий был закрыт — открыть его
                if (!isOpen) openItem(item);
            });
        });

        // Поддержка ресайза: обновить высоту только у открытого
        window.addEventListener("resize", () => {
            const opened = document.querySelector(".tab-controls__item.is-open");
            if (!opened) return;
            const { text } = store.get(opened) || {};
            if (text) text.style.maxHeight = text.scrollHeight + "px";
        });
    });




    //newsButton

    document.addEventListener("DOMContentLoaded", () => {
    const list = document.querySelector(".news__list");
    const items = Array.from(list.querySelectorAll(".news__item"));
    const button = document.querySelector(".news__button");

    if (!list || !items.length || !button) return;

    const icon = button.querySelector("svg path");
    const textNode = button.firstChild; // «Показать еще»

    function getVisibleCount() {
        return window.innerWidth <= 393 ? 2 : 3;
    }

    function updateView(showAll) {
        const visibleCount = getVisibleCount();

        items.forEach((item, i) => {
            item.style.display = showAll || i < visibleCount ? "" : "none";
        });

        if (showAll) {
            button.classList.add("is-open");
            textNode.textContent = "Свернуть ";
            icon.setAttribute(
                "d",
                "M5.29688 4.278L26.778 24.8641C27.1768 25.2463 27.1902 25.8793 26.8081 26.278C26.426 26.6768 25.793 26.6902 25.3942 26.3081L3.80813 5.6214V22.5527C3.80813 23.105 3.36042 23.5527 2.80813 23.5527C2.25584 23.5527 1.80813 23.105 1.80813 22.5527V3.278C1.80813 2.72571 2.25584 2.278 2.80813 2.278H22.9636C23.5159 2.278 23.9636 2.72571 23.9636 3.278C23.9636 3.83029 23.5159 4.278 22.9636 4.278H5.29688Z"
            ); // стрелка вверх
        } else {
            button.classList.remove("is-open");
            textNode.textContent = "Показать еще ";
            icon.setAttribute(
                "d",
                "M24.7031 25.722L3.22199 5.13588C2.82325 4.75375 2.80978 4.12073 3.19191 3.72199C3.57403 3.32325 4.20706 3.30978 4.6058 3.69191L26.1919 24.3786V7.44733C26.1919 6.89504 26.6396 6.44733 27.1919 6.44733C27.7442 6.44733 28.1919 6.89504 28.1919 7.44733V26.722C28.1919 27.2743 27.7442 27.722 27.1919 27.722H7.03635C6.48406 27.722 6.03635 27.2743 6.03635 26.722C6.03635 26.1697 6.48406 25.722 7.03635 25.722H24.7031Z"
            ); // стрелка вниз
        }
    }

    updateView(false);
    window.addEventListener("resize", () => updateView(button.classList.contains("is-open")));

    button.addEventListener("click", () => {
        const isOpen = button.classList.contains("is-open");
        updateView(!isOpen);
    });
});


    //TEL

    const telInputs = document.querySelectorAll('input[type="tel"]')
    const im = new Inputmask('+7 (999) 999-99-99')
    im.mask(telInputs)



})()
