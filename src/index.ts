import './scss/styles.scss'; // Импортируем стили
import { EventEmitter } from "./components/base/events"; // Импортируем EventEmitter для управления событиями
import { ProductsData } from "./components/model/ProductsModel"; // Импортируем модель данных продуктов
import { BasketData } from "./components/model/BasketModel"; // Импортируем модель данных корзины
import { OrderForms } from "./components/model/OrderModel"; // Импортируем модель данных заказов
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
const cardviewlistTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardviewpreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardviewbasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketviewTemplate = ensureElement<HTMLTemplateElement>('#basket');
const delpayviewTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsviewTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const success = ensureElement<HTMLTemplateElement>('#success');

// Создаем экземпляры моделей данных
const productsData = new ProductsData({}, events);
const basketData = new BasketData({}, events);
const orderForms = new OrderForms({}, events);

// Создаем экземпляры представлений
const mainpage = new MainPage(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new BasketView(cloneTemplate(basketviewTemplate), events);
const deliverypayment  = new OrderFormAddressView(cloneTemplate(delpayviewTemplate), events);
const contacts = new OrderFormContactsView(cloneTemplate(contactsviewTemplate), events);
const successView = new Success(cloneTemplate(success), events);

// Обработчик события изменения списка продуктов
events.on<IProductsList>('cards: changed', () => {
    mainpage.catalog = productsData.getCardList().map(item => {
        const card = new ProductViewList(cloneTemplate(cardviewlistTemplate), {
            onClick: () => events.emit('card: selected', item)
        });
        return card.render(item);
    });
});

// Обработчик события выбора продукта
events.on('card: selected', (item: IProduct) => {
    const cardpreview = new ProductViewPreview(cloneTemplate(cardviewpreviewTemplate), {
        onClick: () => {
            if (basketData.inBasket(item.id)) {
                basketData.removeFromBasket(item.id);
                cardpreview.buttonChange = 'Купить';
            } else {
                basketData.addToBasket(item);
                cardpreview.buttonChange = 'Убрать';
            }
            mainpage.counter = basketData.getProductListInBasketNumber();
        },
    });

    if (item.price === null) {
        cardpreview.disableButton(); // Отключаем кнопку, если цена null
    } else {
        cardpreview.buttonChange = basketData.inBasket(item.id) ? 'Убрать' : 'Купить';
    }

    modal.render({ content: cardpreview.render(item) });
});

// Обработчик события открытия корзины
events.on('basket: open', () => {
    const basketitems = basketData.items.map((item, index) => {
        const basketitem = new ProductViewBasket(cloneTemplate(cardviewbasketTemplate), {
            onClick: () => events.emit('basket: removecard', item)
        });
        basketitem.index = index + 1;
        return basketitem.render(item);
    });
    modal.render({
        content: basket.render({
            items: basketitems,
            total: basketData.getTotalPrice(),
        })
    });
});

// Обработчик события удаления продукта из корзины
events.on('basket: removecard', (item: TProductBasket) => {
    basketData.removeFromBasket(item.id);
    const basketitems = basketData.items.map((item, index) => {
        const basketitem = new ProductViewBasket(cloneTemplate(cardviewbasketTemplate), {
            onClick: () => events.emit('basket: removecard', item)
        });
        basketitem.index = index + 1;
        return basketitem.render(item);
    });
    mainpage.counter = basketData.getProductListInBasketNumber();
    modal.render({
        content: basket.render({
            items: basketitems,
            total: basketData.getTotalPrice(),
        })
    });
});

// Обработчик события отправки корзины
events.on('basket: submit', () => {
    events.emit('form-payment-delivery: open');
});

// Обработчик изменения состояния валидации формы адреса
events.on('formErrorsFirst:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    deliverypayment.valid = !payment && !address;
    deliverypayment.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Обработчик изменения данных формы адреса
events.on(/^order\..*:change/, (data: { field: keyof TFormAddress, value: string }) => {
    orderForms.setFormAddress(data.field, data.value);
});

// Обработчик открытия формы адреса
events.on('form-payment-delivery: open', () => {
    modal.render({
        content: deliverypayment.render({
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
events.on('formErrorsSecond:change', (errors: Partial<TFormContacts>) => {
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
        payment: orderForms.orderaddress.payment,
        address: orderForms.orderaddress.address,
        email: orderForms.ordercontacts.email,
        phone: orderForms.ordercontacts.phone,
        total: basketData.getTotalPrice(),
        items: basketData.getProductListInBasket(),
    })
    .then((res) => {
        events.emit('success:close', res);
        modal.render({
            content: successView.render({
                content: res.total
            })
        });
        orderForms.clearFormAddress();
        orderForms.clearFormContacts();
        basketData.clearBasketData();
        mainpage.counter = 0;
    })
    .catch(console.error);
});

// Обработчик закрытия успешного оформления заказа
events.on('success:close', () => {
    modal.close();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    mainpage.locked = true;
});

// Разблокируем прокрутку страницы если модалка закрыта
events.on('modal:close', () => {
    mainpage.locked = false;
});

// Получаем список продуктов с API
api.getProductsListApi()
    .then((res) => {
        productsData.items = res;
        console.log(productsData.items);
    })
    .catch(console.error);
