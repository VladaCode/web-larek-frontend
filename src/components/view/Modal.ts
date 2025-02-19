import { IEvents } from '../base/events';
import { ensureElement } from "../../utils/utils";
import { Component } from '../base/Component';

// Интерфейс для данных модального окна, содержащий контент
interface IModalData {
    content: HTMLElement; // Поле для хранения содержимого модального окна
}

// Определение класса Modal, который наследует функциональность от Component
export class Modal extends Component<IModalData> {
    // Защищенное поле для кнопки закрытия модального окна
    protected _closeButton: HTMLButtonElement;
    // Защищенное поле для содержимого модального окна
    protected _content: HTMLElement;

    // Конструктор класса Modal
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса

        // Получение элемента кнопки закрытия и элемента содержимого с помощью ensureElement
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Добавление обработчиков событий для закрытия модального окна
        this._closeButton.addEventListener('click', this.close.bind(this)); // Закрытие при клике на кнопку
        this.container.addEventListener('click', this.close.bind(this)); // Закрытие при клике на контейнер
        this._content.addEventListener('click', (event) => event.stopPropagation()); // Предотвращение закрытия при клике на содержимое
    }

    // Сеттер для обновления содержимого модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value); // Замена содержимого модального окна
    }

    // Метод для открытия модального окна
    open() {
        this.container.classList.add('modal_active'); // Добавление класса для отображения модального окна
        this.events.emit('modal:open'); // Эмитирование события об открытии модального окна
    }

    // Метод для закрытия модального окна
    close() {
        this.container.classList.remove('modal_active'); // Удаление класса для скрытия модального окна
        this.content = null; // Сброс содержимого модального окна
        this.events.emit('modal:close'); // Эмитирование события о закрытии модального окна
    }
   
    // Метод для обработки нажатий клавиш
    handleEscUp(evt: KeyboardEvent) {
    // Проверка, была ли нажата клавиша "Escape"
    if (evt.key === 'Escape') {
        this.close(); // Закрытие модального окна, если клавиша "Escape" была нажата
    }
}
    // Метод для рендеринга модального окна
    render(data: IModalData): HTMLElement {
        super.render(data); // Вызов метода рендеринга родительского класса
        this.open(); // Открытие модального окна после рендеринга
        return this.container; // Возврат элемента контейнера модального окна
    }
}

