import './scss/styles.scss';
import { APIweblarek } from './components/APIweblarek';
import { IOrder } from './types';

// Пример использования APIweblarek
const api = new APIweblarek('https://cdn.example.com', 'https://api.example.com');

// Проверка методов APIweblarek через консоль
async function testAPI() {
    try {
        console.log('Получение списка продуктов...');
        const products = await api.getProductsListApi();
        console.log('Продукты:', products);

        if (products.length > 0) {
            const productId = products[0].id;
            console.log(`Получение продукта с ID: ${productId}`);
            const product = await api.getProductApi(productId);
            console.log('Продукт:', product);
        }

        const order: IOrder = {
            items: products.map((product) => product.id), // Передаем массив строковых идентификаторов продуктов
            total: 1000, // Пример значения для total
            payment: 'Credit Card', // Пример значения для payment
            email: 'example@example.com', // Пример значения для email
            phone: '1234567890', // Пример значения для phone
            address: '123 Example St, City, Country' // Пример значения для address
        };
        console.log('Отправка заказа...');
        const orderResult = await api.postOrderProductsApi(order);
        console.log('Результат заказа:', orderResult);
    } catch (error) {
        console.error('Ошибка при выполнении API-запроса:', error);
    }
}

// Запуск теста API
testAPI();