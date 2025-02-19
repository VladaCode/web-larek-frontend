import { Model } from '../base/model';
import { IProductBasketData, TProductBasket } from '../../types/index';

// Определение класса BasketData, который наследует функциональность от Model
export class BasketData extends Model<IProductBasketData> {
    // Защищенное поле для хранения товаров в корзине
    protected _items: TProductBasket[] = []; // Инициализация пустого массива

    // Сеттер для обновления списка товаров и эмитирования события изменения корзины
    set items(items: TProductBasket[]) {
        this._items = items; // Обновление внутреннего массива товаров
        this.events.emit('basket: change', this._items); // Эмитирование события о изменении корзины
    }

    // Геттер для получения текущего списка товаров в корзине
    get items() {
        return this._items; // Возвращает массив товаров
    }

    // Получить список идентификаторов товаров в корзине
    getProductListInBasket(): string[] {
        return this._items.map(item => item.id); // Возвращает массив идентификаторов
    }

    // Получить количество товаров в корзине для отображения
    getProductListInBasketNumber(): number {
        return this._items.length; // Возвращает количество товаров в массиве
    }

    // Получить общую стоимость всех товаров в корзине
    getTotalPrice(): number {
        return this._items.reduce((acc, item) => acc + item.price, 0); // Суммирует цены всех товаров
    } 

    // Добавить товар в корзину
    addToBasket(item: TProductBasket): void {
        this._items = [item, ...this._items]; // Добавляет новый товар в начало массива
    }

    // Удалить товар из корзины по его идентификатору
    removeFromBasket(itemId: string): void {
        this._items = this._items.filter(item => item.id !== itemId); // Фильтрует массив, исключая товар с данным ID
    }

    // Проверить, находится ли товар в корзине
    inBasket(itemID: string) {
        return this._items.some(item => item.id === itemID); // Возвращает true, если товар найден
    }

    // Очистить корзину, удаляя все товары
    clearBasketData(): void {
        this._items = []; // Сбрасывает массив товаров до пустого
    } 
}

