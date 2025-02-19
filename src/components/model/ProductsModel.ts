import { Model } from '../base/model';
import { IProduct } from '../../types';

// Определение класса ProductsData, который наследует функциональность от Model
export class ProductsData extends Model<IProduct> {
    // Защищенное поле для хранения массива продуктов
    protected _items: IProduct[] = []; // Инициализация пустого массива продуктов

    // Защищенное поле для хранения идентификатора выбранной карточки
    protected _preview: string | null; // Инициализация переменной для хранения ID карточки или null

    // Сеттер для обновления списка продуктов и эмитирования события изменения карточек
    set items(items: IProduct[]) {
        this._items = items; // Обновление внутреннего массива продуктов
        this.events.emit('cards: changed'); // Эмитирование события о изменении карточек
    }

    // Сеттер для обновления выбранной карточки по ее идентификатору
    set preview(itemId: string | null) {
        if (!itemId) {
            this._preview = null; // Если ID не передан, сбрасываем выбранную карточку
            return;
        }
        const selectedCard = this.getCard(itemId); // Получаем карточку по ID
        if (selectedCard) {
            this._preview = itemId; // Устанавливаем ID выбранной карточки
            this.events.emit('card: selected', selectedCard); // Эмитируем событие о выборе карточки
        }
    }

    // Геттер для получения текущего выбранного идентификатора карточки
    get preview() {
        return this._preview; // Возвращает ID выбранной карточки или null
    }

    // Получить массив всех карточек
    getCardList() {
        return this._items; // Возвращает массив продуктов
    }  

    // Получить карточку по ее идентификатору, возвращает данные карточки   
    getCard(itemId: string) {
        return this._items.find(item => item.id === itemId); // Ищет и возвращает карточку с соответствующим ID
    }
}
