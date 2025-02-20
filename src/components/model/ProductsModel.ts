import { Model } from '../base/model';
import { IProduct } from '../../types';

// Определение класса ProductsData, который наследует функциональность от Model
export class ProductsModel extends Model<IProduct> {
    // Защищенное поле для хранения массива продуктов
    protected _items: IProduct[] = []; // Инициализация пустого массива продуктов

    // Защищенное поле для хранения идентификатора выбранной карточки
    protected _preview: string | null; // Инициализация переменной для хранения ID карточки или null

    // Сеттер для обновления списка продуктов и эмитирования события изменения карточек
    set items(items: IProduct[]) {
        this._items = items; // Обновление внутреннего массива продуктов
        this.events.emit('products: changed'); // Эмитирование события о изменении продуктов
    }

    // Сеттер для обновления выбранной карточки по ее идентификатору
    set preview(itemId: string | null) {
        if (!itemId) {
            this._preview = null; // Если ID не передан, сбрасываем выбранную карточку
            return;
        }
        const selectedProduct = this.getProduct(itemId); // Получаем карточку по ID
        if (selectedProduct) {
            this._preview = itemId; // Устанавливаем ID выбранной карточки
            this.events.emit('product: selected', selectedProduct); // Эмитируем событие о выборе продукта
        }
    }

    // Геттер для получения текущего выбранного идентификатора карточки
    get preview() {
        return this._preview; // Возвращает ID выбранной карточки или null
    }

    // Получить массив всех карточек
    getProductList() {
        return this._items; // Возвращает массив продуктов
    }  

    // Получить карточку по ее идентификатору, возвращает данные карточки   
    getProduct(itemId: string) {
        return this._items.find(item => item.id === itemId); // Ищет и возвращает карточку с соответствующим ID
    }
}
