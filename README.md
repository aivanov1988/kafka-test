## Description

Используя "typescript": "^4.9.5", "@nestjs/core": "^10.0.0", "kafkajs": "^2.2.4"
он сделает инфраструктурный модуль с сервисом продюсером сообщений (тему выбирает любую пусть)
в контроллере подпишется на топики и будет обрабатывать их
я хочу видеть что его сервис может продюсить сообщения в топик и профилировать ошибки
буду обращать внимание на семантику и структуру

8 Story Points
Задача сложная, потребуется доп. информация

## Running the app

для запуска кафки
* docker compose up -d

для старта бэкенда
* nest start

## Test

открыть файл home.html в браузере - он получает данные по SSE в реалтайме

также реализован ряд эндпоинтов

GET http://localhost:3000/home/count - получить общее кол-во сообщений в топике

GET http://localhost:3000/home/452 - получить сообщение по его оффсету

GET http://localhost:3000/home/pagination?skip=600&take=10 - пагинация по оффсетам

GET http://localhost:3000/home/bydate?startFrom=1715584150000&endTo=1715602150000 - поиск по промежутку времени

GET http://localhost:3000/home/bydate?startFrom=1715584150000&take=30 - забрать несколько сообщений от точки во времени
