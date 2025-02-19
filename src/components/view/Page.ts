import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";

//  MainPage - главная страница
//  код учебного проекта Оно тебе надо

// Интерфейс для главной страницы, содержащий состояние страницы
interface IMainPage {
    counter: number; // Счетчик, отображающий количество товаров в корзине
    catalog: HTMLElement[]; // Массив элементов, представляющих каталог товаров
    locked: boolean; // Флаг, указывающий, заблокирована ли страница
}

// Определение класса MainPage, который наследует функциональность от Component
export class MainPage extends Component<IMainPage> {
    // Защищенные поля для различных элементов страницы
    protected _counter: HTMLElement; // Элемент для отображения счетчика
    protected _catalog: HTMLElement; // Элемент для отображения каталога товаров
    protected _wrapper: HTMLElement; // Обертка страницы
    protected _basket: HTMLElement; // Элемент корзины

    // Конструктор класса MainPage
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса

        // Получение элементов страницы с помощью ensureElement
        this._counter = ensureElement<HTMLElement>('.header__basket-counter'); // Элемент счетчика
        this._catalog = ensureElement<HTMLElement>('.gallery'); // Элемент каталога
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper'); // Элемент обертки страницы
        this._basket = ensureElement<HTMLElement>('.header__basket'); // Элемент корзины

        // Добавление обработчика события клика на элемент корзины
        this._basket.addEventListener('click', () => {
            this.events.emit('basket: open'); // Эмитирование события открытия корзины
        });
    }

    // Сеттер для установки значения счетчика
    set counter(value: number) {
        this.setText(this._counter, String(value)); // Установка текста счетчика
    }

    // Сеттер для установки элементов каталога
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items); // Замена детей элемента каталога новыми элементами
    }

    // Сеттер для установки состояния блокировки страницы
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked'); // Добавление класса блокировки
        } else {
            this._wrapper.classList.remove('page__wrapper_locked'); // Удаление класса блокировки
        }
    }
}

