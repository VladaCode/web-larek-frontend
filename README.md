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

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Описание данных

## Интерфейсы

### IProductItem
```typescript
interface IProductItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
}
```
Используется для описания товара в магазине. Содержит основные характеристики товара: идентификатор, название, описание, категорию, изображение и цену.

### IOrderForm
```typescript
interface IOrderForm {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    total?: string | number;
}
```
Используется для хранения данных формы заказа. Включает контактные данные покупателя и общую стоимость.

### IOrder
```typescript
interface IOrder extends IOrderForm {
    items: string[];
}
```
Расширяет IOrderForm, добавляя массив идентификаторов товаров в заказе.

## Модели данных

Предлагаемая структура классов:

1. **AppState** - основной класс для хранения состояния приложения:
```typescript
class AppState {
    private products: IProductItem[];
    private cart: string[];
    private order: IOrder | null;
}
```

2. **Product** - класс для работы с товарами:
```typescript
class Product {
    constructor(private id(): string { return this.data.id; }
    get title(): string { return this.data.title; }
    // ... остальные геттеры
}
```

3. **Cart** - класс для работы с корзиной:
```typescript
class Cart {
    private items: string[] = [];
    add(id: string): void;
    remove(id: string): void;
    clear(): void;
    get total(): number;
}
```

4. **Order** - класс для работы с заказом:
```typescript
    setContact(form: IOrderForm): void;
    get total(): number;
}
```

Эта структура позволит эффективно управлять данными приложения и поддерживать необходимую бизнес-логику.