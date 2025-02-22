import './scss/styles.scss'; // Импортируем стили
import { EventEmitter } from "./components/base/events"; // Импортируем EventEmitter для управления событиями
import { ProductsModel } from "./components/model/ProductsModel"; // Импортируем модель данных продуктов
import { BasketModel } from "./components/model/BasketModel"; // Импортируем модель данных корзины
import { OrderModel } from "./components/model/OrderModel"; // Импортируем модель данных заказов
import { IProduct, IProductsList, TProductBasket, IOrderForm, TFormAddress, TFormContacts } from './types'; // Импортируем типы данных
import { API_URL, CDN_URL } from "./utils/constants"; // Импортируем константы для API
import { APIweblarek } from "./components/APIweblarek"; // Импортируем класс для работы с API
import { Modal } from "./components/view/Modal"; // Импортируем компонент для модальных окон
import { ProductViewBasket, ProductViewList, ProductViewPreview } from "./components/view/ProductView"; // Импортируем представления продуктов
import { BasketView } from "./components/view/BasketView"; // Импортируем представление корзины
import { OrderFormContactsView } from "./components/view/OrderFormContactsView"; // Импортируем представление формы контактов заказа
import { OrderFormAddressView } from "./components/view/OrderFormAddressView"; // Импортируем представление формы адреса заказа
import { MainPage } from "./components/view/Page"; // Импортируем основной компонент страницы
import { cloneTemplate, ensureElement } from './utils/utils'; // Импортируем утилиты для работы с элементами и шаблонами
import { Success } from './components/view/Success'; // Импортируем компонент для успешного оформления заказа

// Создаем экземпляр EventEmitter для управления событиями
const events = new EventEmitter();
// Создаем экземпляр APIweblarek для работы с API
const api = new APIweblarek(CDN_URL, API_URL);

// Получаем шаблоны для различных представлений
const productViewlistTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productViewpreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productViewbasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketViewTemplate = ensureElement<HTMLTemplateElement>('#basket');
const addressViewTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsViewTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создаем экземпляры моделей данных
const productsData = new ProductsModel({}, events);
const basketData = new BasketModel({}, events);
const orderForms = new OrderModel({}, events);

// Создаем экземпляры представлений
const page = new MainPage(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new BasketView(cloneTemplate(basketViewTemplate), events);
const addressPayment  = new OrderFormAddressView(cloneTemplate(addressViewTemplate), events);
const contacts = new OrderFormContactsView(cloneTemplate(contactsViewTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Обработчик события изменения списка продуктов
events.on<IProductsList>('products: changed', () => {
    page.catalog = productsData.getProductList().map(item => {
        const product = new ProductViewList(cloneTemplate(productViewlistTemplate), {
            onClick: () => events.emit('product: selected', item)
        });
        return product.render(item);
    });
});

// Обработчик события выбора продукта
events.on('product: selected', (item: IProduct) => {
    const productpreview = new ProductViewPreview(cloneTemplate(productViewpreviewTemplate), {
        onClick: () => {
            if (basketData.inBasket(item.id)) {
                basketData.removeFromBasket(item.id);
                productpreview.buttonChange = 'Купить';
            } else {
                basketData.addToBasket(item);
                productpreview.buttonChange = 'Убрать';
            }
            page.counter = basketData.getProductListInBasketNumber();
        },
    });

    if (item.price === null) {
        productpreview.disableButton(); // Отключаем кнопку, если цена null
    } else {
        productpreview.buttonChange = basketData.inBasket(item.id) ? 'Убрать' : 'Купить';
    }

    modal.render({ content: productpreview.render(item) });
});

// Метод для рендеринга элементов корзины
const renderBasketItems = () => {
    const basketitems = basketData.items.map((item, index) => {
        const basketitem = new ProductViewBasket(cloneTemplate(productViewbasketTemplate), {
            onClick: () => events.emit('basket: removeproduct', item)
        });
        basketitem.index = index + 1;
        return basketitem.render(item);
    });
    return basketitems;
};

// Обработчик события открытия корзины
events.on('basket: open', () => {
    modal.render({
        content: basket.render({
            items: renderBasketItems(), // Используем новый метод
            total: basketData.getTotalPrice(),
        })
    });
});

// Обработчик события удаления продукта из корзины
events.on('basket: removeproduct', (item: TProductBasket) => {
    basketData.removeFromBasket(item.id);
    page.counter = basketData.getProductListInBasketNumber();
    modal.render({
        content: basket.render({
            items: renderBasketItems(), // Используем новый метод
            total: basketData.getTotalPrice(),
        })
    });
});

// Обработчик события отправки корзины
events.on('basket: submit', () => {
    events.emit('form-address: open');
});


// Обработчик изменения состояния валидации формы адреса
events.on('formErrorsAddress:change', (errors: Partial<TFormAddress>) => {
    const { payment, address } = errors;
    addressPayment.valid = !payment && !address;
    addressPayment.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Обработчик изменения данных формы адреса
events.on(/^order\..*:change/, (data: { field: keyof TFormAddress, value: string }) => {
    orderForms.setFormAddress(data.field, data.value);
});

// Обработчик открытия формы адреса
events.on('form-address: open', () => {
    modal.render({
        content: addressPayment.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        }),
    });
});

// Обработчик события отправки заказа
events.on('order:submit', () => {
    events.emit('form-contacts: open');
});

// Обработчик изменения состояния валидации формы контактов
events.on('formErrorsContacts:change', (errors: Partial<TFormContacts>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Обработчик изменения данных формы контактов
events.on(/^contacts\..*:change/, (data: { field: keyof TFormContacts, value: string }) => {
    orderForms.setFormContacts(data.field, data.value);
});

// Обработчик открытия формы контактов
events.on('form-contacts: open', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

// Обработчик отправки формы контактов
events.on('contacts:submit', () => {
    api.postOrderProductsApi({
        payment: orderForms.orderAddress.payment,
        address: orderForms.orderAddress.address,
        email: orderForms.orderContacts.email,
        phone: orderForms.orderContacts.phone,
        total: basketData.getTotalPrice(),
        items: basketData.getProductListInBasket(),
    })
    .then((res) => {
        modal.render({
            content: success.render({
                content: res.total
            })
        });
        orderForms.clearFormAddress();
        orderForms.clearFormContacts();
        basketData.clearBasketData();
        page.counter = 0;
    })
    .catch(console.error);
});

// Обработчик закрытия успешного оформления заказа
events.on('success:close', () => {
    modal.close();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокируем прокрутку страницы если модалка закрыта
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем список продуктов с API
api.getProductsListApi()
    .then((res) => {
        productsData.items = res;
        console.log(productsData.items);
    })
    .catch(console.error);
