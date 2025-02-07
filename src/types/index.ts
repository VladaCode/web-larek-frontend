// Интерфейс для описания товара
export interface IProductItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
  }

//Интерфейс для описания объекта действий с одним методом onClick, который принимает объект MouseEvent
  export interface IActions {
    onClick: (event: MouseEvent) => void;
  }

// Интерфейс для описания формы заказа
export interface IOrderForm {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    total?: string | number; // общая стоимость заказа
}

// Интерфейс расширяет IOrderForm и добавляет обязательное поле items, которое является массивом строк и представляет собой список идентификаторов товаров в заказе.
export interface IOrder extends IOrderForm {
  items: string[];
}

// интерфейс расширяет IOrder и делает все его свойства обязательными.
export type RequiredOrder = Required<IOrder>;

// Интерфейс описывает результат заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// описывает ошибки формы заказа. Он использует утилиту Partial, чтобы сделать все поля необязательными, и утилиту Record, чтобы сопоставить ключи интерфейса IOrder со строками, представляющими ошибки
export type FormErrors = Partial<Record<keyof IOrder, string>>;


