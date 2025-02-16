import { ApiPostMethods, IApi } from '../../types';

// Класс для работы с API
export class Api implements IApi {
  readonly baseUrl: string; // Базовый URL для API-запросов
  protected options: RequestInit; // Опции для настройки fetch-запросов

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl; // Устанавливаем базовый URL
    this.options = {
      headers: {
        'Content-Type': 'application/json', // Устанавливаем заголовки по умолчанию
        ...(options.headers as object ?? {}) // Объединяем с переданными заголовками
      }
    };
  }

  // Обрабатываем ответ от API
  protected handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) return response.json(); // Если ответ успешный, возвращаем данные в формате JSON
    else return response.json()
      .then(data => Promise.reject(data.error ?? response.statusText)); // Если ответ неуспешный, возвращаем ошибку
  }

  // Метод для выполнения GET-запроса
  get<T>(uri: string): Promise<T> {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method: 'GET'
    }).then(this.handleResponse<T>);
  }

  // Метод для выполнения POST-запроса
  post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method,
      body: JSON.stringify(data) // Преобразуем данные в строку JSON
    }).then(this.handleResponse<T>);
  }
}