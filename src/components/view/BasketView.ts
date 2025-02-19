import { IEvents } from '../base/events';
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from '../base/Component';

// Интерфейс для представления состояния корзины
interface IBasketView {
    items: HTMLElement[]; // Массив элементов, представляющих товары в корзине
    total: number; // Общая стоимость товаров в корзине
}

// Определение класса BasketView, который наследует функциональность от Component
export class BasketView extends Component<IBasketView> {
    // Защищенные поля для различных элементов корзины
    protected _title: HTMLElement; // Элемент для отображения заголовка модального окна корзины
    protected _productListBasket: HTMLElement; // Элемент для отображения списка товаров в корзине
    protected _basketButton: HTMLButtonElement; // Кнопка для отправки корзины
    protected _total: HTMLElement; // Элемент для отображения общей стоимости

    // Конструктор класса BasketView
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса

        // Получение элементов корзины с помощью ensureElement
        this._title = ensureElement<HTMLElement>('.modal__title', container); // Заголовок корзины
        this._productListBasket = ensureElement<HTMLElement>('.basket__list', container); // Список товаров
        this._basketButton = ensureElement<HTMLButtonElement>('.basket__button', container); // Кнопка корзины
        this._total = ensureElement<HTMLElement>('.basket__price', container); // Элемент для общей стоимости

        // Добавление обработчика события клика на кнопку корзины
        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket: submit'); // Эмитирование события отправки корзины
        });

        // Инициализация массива товаров в корзине
        this.items = [];
    }

    // Сеттер для установки заголовка корзины
    set title(value: string) {
        this.setText(this._title, value); // Установка текста заголовка
    }

    // Сеттер для установки общей стоимости корзины
    set total(value: number) {
        this.setText(this._total, `${value} синапсов`); // Установка текста общей стоимости с указанием валюты
    }

    // Сеттер для установки списка карточек товаров в корзине
    set productListBasket(value: HTMLElement[]) {
        this.items = value; // Присвоение нового списка товаров
    }

    // Сеттер для установки элементов в корзине
    set items(items: HTMLElement[]) {
        // Проверка, есть ли товары в корзине
        if (items.length) {
            this._productListBasket.replaceChildren(...items); // Замена содержимого списка товаров новыми элементами
            this._basketButton.removeAttribute('disabled'); // Активирование кнопки, если товары есть
        } else {
            this._basketButton.setAttribute('disabled', 'disabled'); // Деактивация кнопки, если товаров нет
            this._productListBasket.replaceChildren(
                createElement<HTMLParagraphElement>('p', { // Создание элемента с сообщением об отсутствии товаров
                    textContent: 'В корзине нет товаров'
                })
            );
        }
    }

    // Метод для обновления индексов товаров в корзине
    getnewindexlist() {
        Array.from(this._productListBasket.children).forEach((item, index) =>
            (item.querySelector(`.basket__item-index`)!.textContent = (index + 1).toString())); // Установка индекса для каждого товара
    }
}
