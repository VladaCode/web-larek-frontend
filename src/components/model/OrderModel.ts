import { Model } from '../base/model';
import { IOderFormsData, TFormAddress, TFormContacts, FormErrors } from '../../types/index';

// Класс OrderForms расширяет базовую модель с типом данных IOderFormsData
export class OrderForms extends Model<IOderFormsData> {
    formErrors: FormErrors = {}; // Объект для хранения ошибок формы
    orderaddress: TFormAddress = {
        payment: '',  // Поле для способа оплаты
        address: ''   // Поле для адреса доставки
    };
    ordercontacts: TFormContacts = {
        email: '',    // Поле для email
        phone: ''     // Поле для телефона
    };

    // Метод для установки значений в форму адреса
    setFormAddress(field: keyof TFormAddress, value: string) {
        this.orderaddress[field] = value; // Устанавливаем значение поля

        if (this.validateFormAddress()) { // Проверяем валидность формы
            this.events.emit('orderaddress:ready', this.orderaddress); // Если валидно, эмитируем событие
        }
    }

    // Метод для валидации формы адреса
    validateFormAddress() {
        const errors: typeof this.formErrors = {};
        if (!this.orderaddress.payment) {
            errors.payment = 'Необходимо указать способ оплаты'; // Проверка наличия способа оплаты
        }
        if (!this.orderaddress.address) {
            errors.address = 'Необходимо указать адресс доставки'; // Проверка наличия адреса доставки
        }
        this.formErrors = errors; // Сохраняем ошибки в formErrors
        this.events.emit('formErrorsAddress:change', this.formErrors); // Эмитируем событие с ошибками
        return Object.keys(errors).length === 0; // Возвращаем true, если ошибок нет
    }

    // Метод для установки значений в форму контактов
    setFormContacts(field: keyof TFormContacts, value: string) {
        this.ordercontacts[field] = value; // Устанавливаем значение поля

        if (this.validateFormContacts()) { // Проверяем валидность формы
            this.events.emit('ordercontacts:ready', this.ordercontacts); // Если валидно, эмитируем событие
        }
    }

    // Метод для валидации формы контактов
    validateFormContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.ordercontacts.email) {
            errors.email = 'Необходимо указать email'; // Проверка наличия email
        }
        if (!this.ordercontacts.phone) {
            errors.phone = 'Необходимо указать телефон'; // Проверка наличия телефона
        }
        this.formErrors = errors; // Сохраняем ошибки в formErrors
        this.events.emit('formErrorsContacts:change', this.formErrors); // Эмитируем событие с ошибками
        return Object.keys(errors).length === 0; // Возвращаем true, если ошибок нет
    }

    // Метод для очистки формы адреса
    clearFormAddress() {
        this.orderaddress = {
            payment: '', // Сбрасываем поле способа оплаты
            address: ''  // Сбрасываем поле адреса доставки
        };
    }

    // Метод для очистки формы контактов
    clearFormContacts() {
        this.ordercontacts = {
            email: '', // Сбрасываем поле email
            phone: ''  // Сбрасываем поле телефона
        };
    }
}