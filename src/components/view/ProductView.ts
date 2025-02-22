import { ensureElement } from "../../utils/utils";
import { Component } from '../base/Component';
import { IProduct } from '../../types/index';

// Интерфейс для описания действий продукта, содержащего обработчик клика
interface IProductActions {
    onClick: (event: MouseEvent) => void;  // Метод  который принимает событие MouseEvent
}

// Базовый класс представления продукта, расширяющий Component и принимающий тип IProduct
export class ProductViewBase extends Component<IProduct> {
    protected _title: HTMLElement; //Защищенное свойство  для хранения элемента заголовка
    protected _price: HTMLElement; // Защищенное свойство  для хранения элемента цены

    // Конструктор класса ProductViewBase, принимающий контейнер и инициализирующий элементы заголовка и цены
    constructor(container: HTMLElement) {
        super(container); // Вызов конструктора родительского класса Component
        this._title = ensureElement<HTMLElement>('.card__title', container); // Инициализация элемента заголовка
        this._price = ensureElement<HTMLElement>('.card__price', container);  // Инициализация элемента цены
    }

    // Сеттер для установки текста заголовка продукта
    set title(value: string) {
        // Установка текста заголовка
        this.setText(this._title, value);
    }

    // Сеттер для установки текста цены продукта
    set price(value: number | null) {
        // Установка текста цены (в синапсах) или "Бесценно" если значение null
        this.setText(this._price, value ? `${value.toString()} синапсов` : 'Бесценно');
    }
}

// Класс представления корзины продуктов, расширяющий ProductViewBase
export class ProductViewBasket extends ProductViewBase {
    protected _buttonDelete?: HTMLButtonElement; // Защищенное свойство  для хранения кнопки удаления продукта
    protected _index: HTMLElement; // Защищенное свойство для хранения элемента индекса продукта

    // Конструктор класса ProductViewBasket, принимающий контейнер и действия, инициализирующий элементы кнопки удаления и индекса
    constructor(container: HTMLElement, actions?: IProductActions) {
        super(container); // Вызов конструктора родительского класса ProductViewBase
        this._buttonDelete = container.querySelector('.basket__item-delete'); // Инициализация кнопки удаления
        this._index = container.querySelector('.basket__item-index'); // Инициализация элемента индекса продукта

        // Добавление обработчика клика для кнопки удаления или контейнера
        if (actions?.onClick) {
            if (this._buttonDelete) {
                this._buttonDelete.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Сеттер для установки текста индекса продукта
    set index(value: number) {
        // Установка текста индекса
        this.setText(this._index, value.toString());
    }
}

// Класс представления списка карточек продуктов, расширяющий ProductViewBase
export class ProductViewList extends ProductViewBase {
    protected _category?: HTMLElement; // Защищенное свойство  для хранения элемента категории продукта
    protected _image?: HTMLImageElement; // Защищенное свойство  для хранения элемента изображения продукта
    // Словарь для сопоставления категорий продуктов с CSS-классами
    protected ProductCategoryType: Record<string, string> = {
        "софт-скил": "_soft",
        "кнопка": "_button",
        "другое": "_other",
        "хард-скил": "_hard",
        "дополнительное": "_additional",
    }

    // Конструктор класса, принимающий контейнер и действия, инициализирующий элементы категории и изображения
    constructor(container: HTMLElement, actions?: IProductActions) {
        super(container);  // Вызов конструктора родительского класса ProductViewBase
        this._category = container.querySelector('.card__category');  // Инициализация элемента категории продукта
        this._image = container.querySelector('.card__image');  // Инициализация элемента изображения продукта

        // Добавление обработчика клика для изображения или контейнера
        if (actions?.onClick) {
            if (this._image) {
                this._image.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Сеттер для установки текста категории продукта и добавления соответствующих классов
    set category(value: string) {
        this.setText(this._category, value); // Установка текста категории
        this.toggleClass(this._category, this.ProductCategoryType[value], true); // Добавление класса категории
      };

    // Сеттер для установки источника и альтернативного текста изображения продукта
    set image(value: string) {
        this.setImage(this._image, value); // Установка источника и текста изображения
    }
}

// Класс предварительного просмотра продукта, расширяющий ProductViewBase
export class ProductViewPreview extends ProductViewBase {
    protected _category?: HTMLElement; // Защищенное свойство для хранения элемента категории продукта
    protected _description?: HTMLElement;  // Защищенное свойство  для хранения элемента описания продукта
    protected _image?: HTMLImageElement; // Защищенное свойство для хранения элемента изображения продукта
    protected _buttonChange: HTMLButtonElement;  // Защищенное свойство для хранения кнопки изменения продукта

    // Словарь для сопоставления категорий продуктов с CSS-классами
    protected ProductCategoryType: Record<string, string> = {
        "софт-скил": "_soft",
        "кнопка": "_button",
        "другое": "_other",
        "хард-скил": "_hard",
        "дополнительное": "_additional",
    }

    // Конструктор класса ProductViewPreview, принимающий контейнер и действия, инициализирующий элементы категории, описания, изображения и кнопки
    constructor(container: HTMLElement, actions?: IProductActions) {
        super(container); // Вызов конструктора родительского класса ProductViewBase
        this._category = container.querySelector('.card__category'); // Инициализация элемента категории продукта
        this._description = container.querySelector('.card__text'); // Инициализация элемента описания продукта
        this._image = container.querySelector('.card__image');  // Инициализация элемента изображения продукта
        this._buttonChange = container.querySelector('.button');  // Инициализация кнопки изменения продукта

        // Добавление обработчика клика для кнопки изменения или контейнера
        if (actions?.onClick) {
            if (this._buttonChange) {
                this._buttonChange.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Сеттер для установки текста категории продукта и добавления соответствующих классов
    set category(value: string) {
        this.setText(this._category, value); // Установка текста категории
        this.toggleClass(this._category, this.ProductCategoryType[value], true); // Добавление класса категории
      };

    // Сеттер для установки источника и альтернативного текста изображения продукта
    set image(value: string) {
        this.setImage(this._image, value); // Установка источника и текста изображения
    }

    // Сеттер для установки текста описания продукта
    set description(value: string) {
        // Установка текста описания
        this.setText(this._description, value);
    }

    // Сеттер для установки текста кнопки изменения продукта
    set buttonChange(text: string) {
        // Установка текста кнопки изменения
        this.setText(this._buttonChange, text);
    }

    // Метод для отключения кнопки изменения продукта
    disableButton() {
        // Отключение кнопки изменения
        this.setDisabled(this._buttonChange, true);
    }
}