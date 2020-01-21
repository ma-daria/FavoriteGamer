# WNM.Digital.Test
**Задание**

Вам поручено разработать API, которое будет добавлять в избранное определенных игроков
Overwatch. Для этого разработайте следующие методы API:
- Регистрация пользователей, где обязательные поля: имя, фамилия, аватарка, email и пароль.
Аватарка должна быть строго в формате JPEG или PNG и весить не более 5мб
Пароль должен храниться в зашифрованном виде, email должен быть уникальным
- Вход в систему по email и паролю
После регистрации или авторизации пользователю выдается токен для авторизации по типу
Bearer
- Поиск игроков - проверяет, существует ли статистика для такого никнейма.
Возвращает поле, равное true или false
- Добавление игрока в избранное - он должен выводиться в следующей ручке
- Получение игроков из избранного - у каждого игрока есть аватарка, ник и текущий
уровень в рейтинге


**Запуск приложения**
-Создать базу данных postgreSQL
-Создать файл .env по типу .env.example
-cd link_shortener_02
-npm install
-npm start


**Описание routes**
- https://test-maryina.wnm.digital/api/sign_up
(post)роут регистрации

на вход - FormData вида:

|key|value|
|----|----|
|name| |
|surname| |
|avatar| |
|email| |
|password| |

на выход - json вида:
```
{
    "status": "true\false"
}
```
А также в cookie отправляется токен пользователя, по которому дается доступ к остальным роутам

- https://test-maryina.wnm.digital/api/sign_in
(post)роут для входа в систему

на вход - json вида:
```
{
  "email": "2234",
  "password": "1"
}
```
на выход - json вида:
```
{
    "status": "true\false"
}
```
А также в cookie отправляется токен пользователя, по которому дается доступ к остальным роутам

- https://test-maryina.wnm.digital/api/gamer_search
(get)роут для проверки сущестования играков по нику

на вход - в query передается параметр gamer:
```
api/gamer_search?gamer=nikname
```
на выход - json вида:
```
{
    status: "true\false\no login"
}
```

- https://test-maryina.wnm.digital/api/add_favorite
(post)роут для добавления игрока по нику в избранное.

на вход - json вида:
```
{
  "gamer": "nickname_gamer"
}
```
на выход - json вида:
```
{
   status: "true\false\no login"
}
```

- https://test-maryina.wnm.digital/api/get_favorite
(get)роут для получения списка избранных играков

на выход - json вида:
```
{
    "gamer": [
        {
            "nickname": "nickname",
            "lavel": "lavel",
            "photo": "url photo"
        },
        ...
    ]
}
```
