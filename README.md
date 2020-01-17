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

**База данных** 
- postgresql
- логин postgres
- пароль docker

**Описание routes**
- https://test-maryina.wnm.digital/api/sign_up
роут регистрации

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

- https://test-maryina.wnm.digital/api/sign_in
роут для входа в систему

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

- https://test-maryina.wnm.digital/api/gamer_search
роут для проверки сущестования играков по нику

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

- https://test-maryina.wnm.digital/api/add_favorite
роут для добавления игрока по нику в избранное.

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
роут для получения списка избранных играков

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
