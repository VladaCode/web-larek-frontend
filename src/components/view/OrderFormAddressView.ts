import { IEvents } from '../base/events';
import { ensureAllElements } from "../../utils/utils";
import { Form } from './Form';
import { TFormAddress } from "../../types/index";

// Класс OrderFormPaymentDeliveryView для представления формы оплаты и доставки
export class OrderFormAddressView extends Form<TFormAddress> {
   protected _buttonsРayment: HTMLButtonElement[]; // Защищенный массив кнопок оплаты

    // Конструктор класса, принимает контейнер формы и события
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Вызов конструктора родительского класса Form

        this._buttonsРayment = ensureAllElements(`.button_alt`, container); // Получение всех кнопок с классом 'button_alt' внутри контейнера

        // Добавление обработчиков событий для каждой кнопки оплаты
        this._buttonsРayment.forEach((buttonРayment) => {
            buttonРayment.addEventListener('click', () => {
                // Установка текущей кнопки оплаты и вызов метода onInputChange
                this.buttonsРayment = buttonРayment.name;
                this.onInputChange(`payment`, buttonРayment.name);
            });
        });
    }

    // Сеттер для установки активной кнопки оплаты
    set buttonsРayment(name: string) {
        // Перебор всех кнопок и переключение класса активности
        this._buttonsРayment.forEach((buttonsРayment) => {
            this.toggleClass(buttonsРayment, 'button_alt-active', buttonsРayment.name === name);
        });
    }

    // Сеттер для установки значения поля адреса
    set address(value: string) {
        // Получение элемента поля адреса по имени и установка его значения
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    // Метод для очистки активных состояний всех кнопок оплаты
    clearbuttonsРayment() {
        this._buttonsРayment.forEach((buttonРayment) => {
            // Удаление класса активности у каждой кнопки
            this.toggleClass(buttonРayment, 'button_alt-active', false);
        });
    }
}
