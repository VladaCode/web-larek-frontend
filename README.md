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

## Описание
"Веб-ларек" представляет собой интернет-магазин. Основные элементы включают главную страницу с перечнем товаров и значком корзины, а также множество модальных окон, позволяющих просматривать конкретные товары и оформлять заказы на них.
[Ссылка на макет](https://www.figma.com/design/50YEgxY8IYDYj7UQu7yChb/Веб-ларёк?node-id=1-735&t=FMeANR9pPSSAO4YU-0)

## Архитектура приложения 
Для построения архитектуры приложения интернет-магазина был выбран паттерн MVP. Этот паттерн разделяет приложение на три ключевых слоя:

- **Модель (Model)**: Отвечает за бизнес-логику приложения и управление данными.
- **Представление (View)**: Отображает данные пользователю и обрабатывает ввод от пользователя.
- **Презентер (Presenter)**: Действует как посредник между моделью и представлением. Взаимодействие между моделью и представлением происходит исключительно через презентер.

# Интерфейсы и типы

### interface IProduct
```
interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
}
```
Используется для описания товара в магазине. Содержит основные характеристики товара: идентификатор, название, описание, категорию, изображение и цену.

### interface  IProductsList
```
export interface IProductsList {
    items: IProduct[];
  }
```
Интерфейс для вывода массива товаров

### type TProductBasket
```
export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'image' | 'price'>;
```
Тип, включающий определенные свойства из IProduct, используемые для отображения карточки в корзине.

### interface IOrderForm
```
 interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
}
```
Интерфейс, описывающий форму заказа. Включает способ оплаты, адрес доставки, email и телефон.


### type FormErrors
```
type FormErrors = Partial<Record<keyof IOrderForm, string>>;
```
Описывает ошибки формы заказа. Он использует утилиту Partial, чтобы сделать все поля необязательными, и утилиту Record, чтобы сопоставить ключи интерфейса IOrder со строками, представляющими ошибки

### type TFormAddress
Pick - утилита создаёт новый тип, выбирая из объекта заданные поля
```
type TFormAddress = Pick<IOrderForm, 'payment' | 'address'>;
```
Тип содержащий данные заказа, используемые в модальном окне cо способом оплаты и адресом

### type TFormContacts
```
 type TFormContacts = Pick<IOrderForm, 'email' | 'phone'>;
```
Тип содержащий данные заказа, используемые в модальном окне c электронной почтой и номером телефона

### interface IOderFormsData
```
export interface IOderFormsData {
  formErrors: FormErrors;
  setFormAddress(): void; // установка
  setFormContacts(): void; 
  validateFormAddress(): void; // валидация
  validateFormContacts(): void;
  clearFormAddress(): void; // очистка
  cleaFormContacts(): void;
}
```
Интерфейс, описывающий данные и методы для работы с формами заказа. Включает ошибки формы, методы для установки и валидации полей формы, а также методы для очистки полей формы.

### interface IOrderResult
```
export interface IOrderResult {
  id: string;
  total: number;
}
```

Интерфейс для описания результата заказа, содержащего идентификатор заказа и общую сумму

### interface IProductBasketData
```
export interface IProductBasketData {
  items: TProductBasket[];
  getProductListInBasket(): TProductBasket[]; 
  getProductListInBasketNumber(): number;   для отображения на корзине
  addToBasket(): void; 
  removeFromBasket(): void;
  getTotalPrice(): number; 
  inBasket(): void; 
  clearBasketData(): void; 
}
```
Интерфейс, описывающий коллекцию карточек в корзине. Включает массив объектов типа TCardBasket, методы для получения массива карточек в корзине и их количества, методы для добавления и удаления карточек из корзины, метод для получения полной суммы заказа, метод для проверки наличия карточки в корзине и метод для очистки данных корзины после заказа.


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


Основные методы, реализуемые классом описаны интерфейсом 'IEvents':

 - `on` - подписка на событие
 - `emit` - инициализация события
 - `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

 ### Класс Model
В параметры конструктора класса передается интерфейс IEvents. Базовая модель, чтобы можно было отличить ее от простых объектов с данными.
(класс из учебного проекта Оно тебе надо)


### Класс Component
Базовый класс для использования в классах представления VIEW. Имеет необходимые методы для управления разметкой. 
(класс из учебного проекта Оно тебе надо)

  
## СЛОЙ МОДЕЛЬ (Model)

### Класс ProductsModel

Класс отвечает за хранение информации и логику работы с данными товаров реализует интерфейс IProduct.  
Конструктор класса принимает инстант брокера событий.

Поля класса:
 - `_items: IProduct[]` - массив объектов товаров
 - `_preview: string | null` - id товара для просмотра в модальном окне
 - `events: IEvents` - экземпляр класса EventEmitter для инициализации событий при изменения данных.

Методы:
 - `getProduct(itemId: string)` - получает один товар по id из массива;
 - `getProductsList(): void` - возвращает массив товаров;
 - также геттеры и сеттеры для полей класса

 ### Класс OrderModel
Класс отвечает за хранение информации и логику работы с данными заказа реализует интерфейс IOderFormsData.  
Конструктор класса принимает инстант брокера событий.

Поля класса:
 - `orderAdress: TFormAddress` - объект с данными адреса заказа и способом оплаты;
 - `orderContacts: TFormContacts` - объект с данными контактной информации заказа
- events: IEvents - экземпляр класса EventEmitter для инициализации событий при изменения данных.

Методы из интерфейса IOderFormsData:
 - `setFormAddress(field: keyof TFormAddress, value: string): void` - устанавливает данные адреса заказа и способа оплаты;
 - `setFormContacts(field: keyof TFormContacts, value: string): void` - устанавливает данные контактной информации заказа;
 - `validateFormAddress(): void` - валидация формы адреса заказа и способа оплаты;
 - `validateFormContacts(): void` - валидация формы контактной информации заказа;
 - ` clearFormAddress(): void` - очистка формы адреса заказа и способа оплаты;
 - `clearFormContacts(): void` - очистка формы контактной информации заказа
 
 
### Класс BasketModel
Класс отвечает за работу с данными, связанными с корзиной, включая добавление и удаление товаров.

Поля класса:
 - `_items: TProductBasket[]` - массив товаров в корзине;
 - `events: IEvents` - экземпляр класса EventEmitter для инициализации событий при изменения данных.

 Методы из интерфейса IProductBasketData:
 - `getProductListInBasket(): string[]` - получить массив товаров в корзине;
 - `getProductListInBasketNumber(): number` - получить количество товаров в корзине;
 - `addToBasket(item: TProductBasket): void` - добавить товар в корзину;
 - `removeFromBasket(itemId: string): void` - удалить товар из корзины;
 - `getTotalPrice(): number` - получить общую стоимость товаров в корзине;
 - `inBasket(itemID: string) : boolean` - проверить наличие товара в корзине;
 - `clearBasketData(): void` - очистить данные корзины после заказа;
 - также геттеры и сеттеры для полей класса


## СЛОЙ ПРЕДСТАВЛЕНИЯ (View)
Классы этого слоя отвечают за отображение данных пользователю и обработку пользовательского ввода

### Класс Modal
Реализует функциональность модального окна. Устанавливает слушатели для закрытия окна при нажатии клавиши Esc, клике на оверлей или кнопку закрытия. В конструктор передаются HTMLElement элемента, настройки с селекторами и экземпляр брокера событий. `constructor(container: HTMLElement, protected events: IEvents) `

Поля класса:
 - `content: HTMLElement` - элемент  модального окна;
 - `events: IEvents` - экземпляр класса EventEmitter для инициализации событий при изменения данных
 Методы:
 - методы `open` и `close` для открытия и закрытия;
 - `render()` - метод для рендеринга модального окна;
 - `handleEscUp()` - колбек для закрытия модалки по нажатию на Esc
 - сеттер для content

### Класс Form
Реализует класс для формы.
Класс управляет состоянием формы и взаимодействием с ней. Предназначен для обработки валидации формы, отображения ошибок и событий отправки. 
(Взят из учебного проекта)

Поля класса:
- `_submit: HTMLButtonElement`
- `_errors: HTMLElement`
- `events: IEvents` - экземпляр класса EventEmitter для инициализации событий при изменения данных.

Методы:
- `set valid(value: boolean)` -  валидность форм и включает или отключает кнопку отправки;
- `set errors(value: string)` - устанавливает  ошибки для форм и обновляет элемент отображения ошибок;
- `render()` - отображает состояние формы, включая валидность, ошибки и вводы

И классы: OrderFormAddressView, OrderFormContactsView - формы для отображения кнопок способа оплаты, адреса, телефона, email 

### Класс Page
Класс представляет собой главную страницу, на которой отображаются все карточки товаров, а также счетчик количества товаров, добавленных в корзину.
(Взят из учебного проекта)

Поля класса:
-  `_counter: HTMLElement` - представляет собой HTML элемент, который отображает количество товаров в корзине;
-  `_catalog: HTMLElement` - представляет собой HTML элемент, содержащий каталог товаров;
-  `_wrapper: HTMLElement` - представляет собой HTML элемент-обертку для всей страницы;
-  `_basket: HTMLElement` - представляет собой HTML элемент корзины

Методы:
- `set counter(value: number)` - устанавливает значение счетчика товаров в корзине;
- `set catalog(items: HTMLElement[])` - обновляет каталог товаров, заменяя его содержимое;
- `set locked(value: boolean)` - блокирует или разблокирует страницу, добавляя или удаляя соответствующий CSS класс

### Класс BasketView
Представляет корзину: отображает товары, добавленные в корзину (каждому товару присваивается порядковый номер), общую сумму заказа, а также содержит кнопку, при нажатии на которую открывается первое модальное окно заказа. 


Поля класса:
- `_productListBasket: HTMLElement` - HTML элемент, представляющий список товаров в корзине;
- ` _basketButton: HTMLButtonElement` -  кнопка для подтверждения заказа;
- `_total: HTMLElement ` - HTML элемент отображающий общую сумму заказа

Методы:
- `set total(value: number)` -  устанавливает общую сумму заказа и отображает её;
- `set productListBasket(items: HTMLElement[])` - обновляет массив товаров в корзине.
- `set items(items: HTMLElement[])` - обновляет содержимое корзины. Если корзина пуста, отображает сообщение "Корзина пуста" и блокирует кнопку подтверждения заказа.
- `getnewindexlist()` -  для обновления индексов товаров в корзине

### Классы  ProductViewBase, ProductViewBasket, ProductViewCardList, ProductViewPreview
В проекте реализовано четыре класса для различных вариантов отображения товара. Кнопка для выбранного товара должна изменять свое состояние в зависимости от того, находится ли товар в корзине, и быть неактивной для товаров с нулевой ценой. Базовый класс ProductViewBase содержит минимально необходимые поля: `title` и `price`. Остальные классы расширяют количество полей и устанавливают соответствующие сеттеры.

- ProductViewBase -  базовый класс, который предоставляет общие методы и свойства для других классов, представляющих товары
- ProductViewBasket - класс представляет товар, который находится в корзине покупок
- ProductViewList -  класс представляет список товра на странице каталога
- ProductViewPreview -  Этот класс представляет предварительный просмотр продукта

### Класс OrderSuccess 
Представляет окно подтверждения заказа, которое отображает общую сумму заказа. Окно содержит кнопку, при нажатии на которую оно закрывается.

Поля класса:
- `_total: HTMLElement` - HTML элемент, отображающий общую сумму заказа;
- `_button: HTMLButtonElement` - кнопка для закрытия окна чтобы продолжить 

Методы:
- `set total(value: HTMLElement)` - устанавливает текст, отображающий общую сумму заказа

## СЛОЙ ПРЕЗЕНТЕРА (Presenter)
Слой соединения между моделью и представлением.

### Взаимодействие компонентов:
1. **Открытие страницы**:
   - Запускаем событие.
   - Отображаем перечень карточек в компоненте "Главная страница"
   - Данные берем из модели `ProductsModel`

2. **Открытие карточки**
   - По клику на карточку запускаем событие `product: selected`
   - Отображаем данные карточки в соответствующем компоненте "Карточка"
   - Запускаем событие проверки наличия товара в корзине из модели `BasketModel`
   - Если товар в корзине, отображаем кнопку "Убрать", если нет — "Купить"
   - Отображаем количество товаров в корзине, используя метод `getProductListInBasketNumber` из модели `BasketModel`
   - Если цена товара равна нулю, кнопка неактивна.

3. **Добавление товара в корзину**:
   - При нажатии на кнопку "Купить" добавляем карточку в модель `BasketModel` с помощью метода `addToBasket`
   - Отображаем в компоненте "Корзина" обновленный перечень товаров

4. **Удаление карточки из корзины**:
   - По событию `basket: removeproduct` запускаем событие.
   - Убираем карточку из модели `BasketModel` с помощью метода `removeFromBasket`
   - Отображаем в компоненте "Корзина" обновленный перечень товаров.

5. **Открытие корзины**:
   - По событию `basket: open` запускаем событие
   - Отображаем данные корзины в компоненте "Корзина", полученные из модели `BasketModel`
   - Отображаем общую сумму, используя метод `getTotalPrice` из модели `BasketModel`

6. **Оформление заказа**:
   - При нажатии на кнопку "Оформить" в корзине подтверждаем данные корзины и запускаем событие `basket: submit`
   - Открываем первую форму, запускаем проверку на валидность, передаем данные и отображаем ошибки при необходимости
   - Кнопка "Далее" неактивна до прохождения валидации

 7. **Подтверждение данных в формах**:
    - При нажатии на кнопку "Далее" подтверждаем данные первой формы и запускаем событие `adress: open`
    - Открываем вторую форму, запускаем метод для получения полной суммы и перечня товаров в корзине, проверяем на   валидность, передаем данные и отображаем ошибки при необходимости
    - Кнопка "Оплатить" неактивна до прохождения валидации

8. **Оплата заказа**:
   - При нажатии на кнопку "Оплатить" подтверждаем данные второй формы и запускаем событие `contacts: submit`
   - Создаем новый заказ, данные берем из `OrderForms` и `BasketData`
   - Передаем данные заказа на сервер.
   - Открываем окно успеха, отображаем полную сумму.
   - Обнуляем данные форм и корзины с помощью методов `clearBasketData`, `clearFormAddress` и `clearFormContacts`

9. **Новые покупки**:
    - По событию `success:close` закрываем окно успеха и возвращаемся к покупкам

10. **Блокировка прокрутки**:
    - При открытии модального окна блокируем прокрутку
    - При закрытии модального окна снимаем блокировку


### События

#### Системные события:
- `products: changed` - изменение массива карточек
- `product: selected` - изменение открываемой в модальном окне карточки

#### События пользовательского взаимодействия с интерфейсом:
- `basket: open` - открытие корзины
- `basket: removeproduct` - удаление карточки из корзины
- `basket: submit` - подтверждение данных корзины
- `formErrorsAddress:change` - изменение состояния валидации формы с адресом заказа и способом оплаты
- `formErrorsContacts:change` - изменение состояния валидации формы с номерами телефонов и email
- `form-adress: open` - открытие первой формы с адресом заказа и способом оплаты
- `form-contacts: open` - открытие второй формы с номерами телефонов и email
- `adress: submit` - подтверждение  формы с адресом заказа и способом оплаты
- `contacts: submit` - подтверждение и отправка заказа на сервер
- `success: close` - закрытие окна успеха
- `modal: open` - событие открытия модального окна
- `modal: close` - событие закрытия модального окна

