
// Интерфейс для описания товара
export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
  }

//Интерфейс для вывода массива товаров
  export interface IProductsList {
    items: IProduct[];
  }

// Тип содержащий данные товара используемые в корзине
export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'image' | 'price'>;

// Интерфейс для описания результата заказа, содержащего идентификатор заказа и общую сумму
export interface IOrderResult {
  id: string;
  total: number;
}

// Интерфейс для описания формы заказа
export interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

// Коллекция Заказ
export interface IOrder extends IOrderForm {
  items: string[]; // перечень карточек в корзине
  total: number; // общая сумма заказа
}

// описывает ошибки формы заказа. Он использует утилиту Partial, чтобы сделать все поля необязательными, и утилиту Record, чтобы сопоставить ключи интерфейса IOrder со строками, представляющими ошибки
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;


// Тип содержащий данные заказа, используемые в модальном окне cо способом оплаты и адресом
export type TFormAddress = Pick<IOrderForm, 'payment' | 'address'>;

// Тип содержащий данные заказа, используемые в модальном окне c электронной почтой и номером телефона
export type TFormContacts = Pick<IOrderForm, 'email' | 'phone'>;

// Интерфейс, описывающий данные и методы для работы с формами заказа
export interface IOderFormsData {
  formErrors: FormErrors;
  setFormAddress(field: keyof TFormAddress, value: string): void; // установка поля формы адреса
  setFormContacts(field: keyof TFormContacts, value: string): void; // установка поля формы контактов
  validateFormAddress(): void; // валидация
  validateFormContacts(): void;
  clearFormAddress(): void; // очистка
  cleaFormContacts(): void;
}


//Интерфейс, описывающий коллекцию товаров в корзине
export interface IProductBasketData {
  items: TProductBasket[]; //массив товаров в корзине
  getProductListInBasket(): TProductBasket[]; //получить массив товаров в корзине
  getProductListInBasketNumber(): number;  // получить количество товаров  для отображения на корзине
  addToBasket(): void; //добавить товар в корзину
  removeFromBasket(): void; //удалить товар из корзины
  //getTotalPrice(): number; // получить сумму заказа
  inBasket(): void; //проверить наличие товара в корзине 
  clearBasketData(): void; //очистить данные корзины после заказа
}

