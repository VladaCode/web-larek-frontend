import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder, IOrderResult } from '../types';

// Интерфейс IAPIweblarek определяет методы для работы с API 
export interface IAPIweblarek {
    getProductsListApi(): Promise<IProduct[]>; // Получить список продуктов
    getProductApi(id: string): Promise<IProduct>; // Получить продукт по идентификатору
    postOrderProductsApi(order: IOrder): Promise<IOrderResult>; // Отправить заказ
}

// Класс APIweblarek реализует интерфейс IAPIweblarek и наследуется от класса Api
export class APIweblarek extends Api implements IAPIweblarek {
    readonly cdn: string; // URL CDN для загрузки изображений

    // Конструктор принимает URL CDN, базовый URL API и опциональные параметры запроса
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options); // Вызов конструктора родительского класса Api
        this.cdn = cdn; // Инициализация свойства cdn
    }

    // Метод для получения списка продуктов
    getProductsListApi(): Promise<IProduct[]> {
        // Выполняет GET-запрос к эндпоинту '/product/' и обрабатывает ответ
        return this.get('/product/').then((data: ApiListResponse<IProduct>) =>
            // Маппинг продуктов с добавлением полного URL изображения
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    // Метод для получения продукта по идентификатору
    getProductApi(id: string): Promise<IProduct> {
        // Выполняет GET-запрос к эндпоинту `/product/${id}` и обрабатывает ответ
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image, // Добавление полного URL изображения
            })
        );
    }

    // Метод для отправки заказа
    postOrderProductsApi(order: IOrder): Promise<IOrderResult> {
        // Выполняет POST-запрос к эндпоинту '/order/' с данными заказа и обрабатывает ответ
        return this.post('/order/', order).then(
            (data: IOrderResult) => data
        );
    }
}