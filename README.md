# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

npm install
npm run start

или

yarn
yarn start
## Сборка

npm run build

или

yarn build

# Описание данных

## Интерфейсы

### IProductItem
interface IProductItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
}
Используется для описания товара в магазине. Содержит основные характеристики товара: идентификатор, название, описание, категорию, изображение и цену.

### IOrderForm
interface IOrderForm {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    total?: string | number;
}
Используется для хранения данных формы заказа. Включает контактные данные покупателя и общую стоимость.

### IOrder
interface IOrder extends IOrderForm {
    items: string[];
}
Расширяет IOrderForm, добавляя массив идентификаторов товаров в заказе.

### RequiredOrder
type RequiredOrder = Required<IOrder>;
Расширяет IOrder и делает все его свойства обязательными.

### IOrderResult
export interface IOrderResult {
  id: string;
  total: number;
}
Описывает результат заказа


## Базовые классы

### Класс Api

Класс Api предназначен для упрощения работы с HTTP-запросами. Он предоставляет методы для выполнения стандартных HTTP-запросов (GET и POST) и обработки ответов.


Конструктор
- `constructor(baseUrl: string, options: RequestInit = {})`
- `baseUrl`: Базовый URL для API.
- `options`: Опции для запросов, включая заголовки. По умолчанию устанавливается заголовок `Content-Type` как `application/json`.

Методы
- `protected handleResponse(response: Response): Promise<object>`
    -  Обрабатывает ответ от сервера. 
    -  Возвращает JSON, если ответ успешный. 
    -  Отклоняет промис с ошибкой, если ответ не успешный.

- `get(uri: string)`
    -  Выполняет `GET`-запрос к указанному `uri`.

- `post(uri: string, data: object, method: ApiPostMethods = 'POST')`
    -  Выполняет `POST`-запрос (или другой метод, указанный в `method`) к указанному `uri` с переданными `data`.


### Класс EventEmitter выступает в роли Представителя (Presenter) - связывает модели данных с отображением интерфейсов при сработке какого нибудь события, управляя взаимодействием между ними.

Класс `EventEmitter` предназначен для реализации брокера событий. Он позволяет устанавливать обработчики на события, инициировать события и снимать обработчики с событий.

Конструктор:

```typescript
constructor() {
    this._events = new Map<EventName, Set<Subscriber>>();
}
```
- Конструктор инициализирует _events как новый объект Map, который будет использоваться для хранения событий и их обработчиков.


Методы:  
  
- `on` - для подписки на событие.  
- `off` - для отписки от события.  
- `emit` - уведомления подписчиков о наступлении события соответственно.  
- `onAll` - для подписки на все события.  
- `offAll` - сброса всех подписчиков.  
- `trigger` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.  
  

