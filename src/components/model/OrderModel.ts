import { Model } from '../base/model';
import { IOderFormsData, TFormAddress, TFormContacts, FormErrors } from '../../types/index';

// Класс OrderForms расширяет базовую модель с типом данных IOderFormsData
export class OrderModel extends Model<IOderFormsData> {
    formErrors: FormErrors = {}; // Объект для хранения ошибок формы
    orderAddress: TFormAddress = {
        payment: '',  // Поле для способа оплаты
        address: ''   // Поле для адреса доставки
    };
    orderContacts: TFormContacts = {
        email: '',    // Поле для email
        phone: ''     // Поле для телефона
    };

    // Метод для установки значений в форму адреса
    setFormAddress(field: keyof TFormAddress, value: string) {
        this.orderAddress[field] = value; // Устанавливаем значение поля

        if (this.validateFormAddress()) { // Проверяем валидность формы
            this.events.emit('orderaddress:ready', this.orderAddress); // Если валидно, эмитируем событие
        }
    }

    // Метод для валидации формы адреса
    validateFormAddress() {
        const errors: typeof this.formErrors = {};
        if (!this.orderAddress.payment) {
            errors.payment = 'Необходимо указать способ оплаты'; // Проверка наличия способа оплаты
        }
        if (!this.orderAddress.address) {
            errors.address = 'Необходимо указать адресс доставки'; // Проверка наличия адреса доставки
        }
        this.formErrors = errors; // Сохраняем ошибки в formErrors
        this.events.emit('formErrorsAddress:change', this.formErrors); // Эмитируем событие с ошибками
        return Object.keys(errors).length === 0; // Возвращаем true, если ошибок нет
    }

    // Метод для установки значений в форму контактов
    setFormContacts(field: keyof TFormContacts, value: string) {
        this.orderContacts[field] = value; // Устанавливаем значение поля

        if (this.validateFormContacts()) { // Проверяем валидность формы
            this.events.emit('ordercontacts:ready', this.orderContacts); // Если валидно, эмитируем событие
        }
    }

    // Метод для валидации формы контактов
    validateFormContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.orderContacts.email) {
            errors.email = 'Необходимо указать email'; // Проверка наличия email
        }
        if (!this.orderContacts.phone) {
            errors.phone = 'Необходимо указать телефон'; // Проверка наличия телефона
        }
        this.formErrors = errors; // Сохраняем ошибки в formErrors
        this.events.emit('formErrorsContacts:change', this.formErrors); // Эмитируем событие с ошибками
        return Object.keys(errors).length === 0; // Возвращаем true, если ошибок нет
    }

    // Метод для очистки формы адреса
    clearFormAddress() {
        this.orderAddress = {
            payment: '', // Сбрасываем поле способа оплаты
            address: ''  // Сбрасываем поле адреса доставки
        };
    }

    // Метод для очистки формы контактов
    clearFormContacts() {
        this.orderContacts = {
            email: '', // Сбрасываем поле email
            phone: ''  // Сбрасываем поле телефона
        };
    }
}