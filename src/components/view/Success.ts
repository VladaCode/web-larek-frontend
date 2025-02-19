import { IEvents } from '../base/events';
import { ensureElement } from "../../utils/utils"; 
import { Component } from '../base/Component'; 

// Интерфейс для описания структуры данных успешного сообщения
interface ISuccess {
    content: number; // Содержимое, представляющее количество синапсов
}

// Класс Success, наследующий от базового класса Component
export class Success extends Component<ISuccess> {
    protected _title: HTMLElement; // Элемент заголовка
    protected _content: HTMLElement; // Элемент для содержимого
    protected _button_continue: HTMLButtonElement; // Кнопка продолжения

    // Конструктор класса, принимает контейнер и события
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса Component

        // Получение элементов из контейнера, используя функцию ensureElement
        this._title = ensureElement<HTMLElement>('.order-success__title', container);
        this._content = ensureElement<HTMLElement>('.order-success__description', container);
        this._button_continue = ensureElement<HTMLButtonElement>('.order-success__close', container);

        // Добавление обработчика события на кнопку продолжения
        this._button_continue.addEventListener('click', () => {
            this.events.emit('success:close'); // Эмитирование события закрытия успешного сообщения
        });
    }

    // Сеттер для установки содержимого
    set content(value: HTMLElement) {
        this.setText(this._content, `Списано ${value} синапсов`); // Установка текста в элемент содержимого
    }

    // Сеттер для установки заголовка
    set title(value: string) {
        this.setText(this._title, value); // Установка текста в элемент заголовка
    }
}
