import { IEvents } from '../base/events';
import { Form } from './Form';
import { TFormContacts } from "../../types/index";

// код учебного проекта Оно тебе надо

// Класс OrderFormContactsView для представления формы контактов заказа
export class OrderFormContactsView extends Form<TFormContacts> {
    // Конструктор класса, принимает контейнер формы и события
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Вызов конструктора родительского класса Form
    }

    // Сеттер для установки значения поля телефона
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value; // Получение элемента поля телефона по имени и установка его значения
    }

    // Сеттер для установки значения поля электронной почты
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value; // Получение элемента поля электронной почты по имени и установка его значения
    }
}
