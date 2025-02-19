
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

// код учебного проекта Оно тебе надо

// Интерфейс для состояния формы, содержащий информацию о валидности и ошибках
interface IFormState {
    valid: boolean; // Поле, указывающее, валидна ли форма
    errors: string[]; // Массив строк, содержащий ошибки валидации
}

// Определение класса Form, который наследует функциональность от Component
export class Form<T> extends Component<IFormState> {
    // Защищенные поля для кнопки отправки и элемента для отображения ошибок
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    // Конструктор класса Form
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container); // Вызов конструктора родительского класса

        // Получение элемента кнопки отправки формы с помощью ensureElement
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        // Получение элемента для отображения ошибок формы
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Добавление обработчика события ввода для отслеживания изменений в полях формы
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement; // Приведение целевого элемента к типу HTMLInputElement
            const field = target.name as keyof T; // Получение имени поля из атрибута name
            const value = target.value; // Получение значения поля
            this.onInputChange(field, value); // Вызов метода для обработки изменения ввода
        });

        // Добавление обработчика события отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault(); // Предотвращение стандартного поведения отправки формы
            this.events.emit(`${this.container.name}:submit`); // Эмитирование события отправки формы
        });
    }

    // Защищенный метод для обработки изменения ввода в полях формы
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, { // Эмитирование события изменения поля
            field,
            value
        });
    }

    // Сеттер для установки валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value; // Деактивация кнопки отправки в зависимости от валидности
    }

    // Сеттер для установки ошибок формы
    set errors(value: string) {
        this.setText(this._errors, value); // Установка текста ошибок в соответствующий элемент
    }

    // Метод для рендеринга формы
    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state; // Деструктуризация состояния
        super.render({ valid, errors }); // Вызов метода рендеринга родительского класса
        Object.assign(this, inputs); // Присвоение оставшихся полей состояния текущему объекту
        return this.container; // Возврат элемента контейнера формы
    }
}
