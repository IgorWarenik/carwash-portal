import { PrismaClient, CarWashType, ContentStatus, DataSource, ListingType, CarWashType as CWT } from '@prisma/client'

const prisma = new PrismaClient()

const CITIES = [
  { name: 'Москва', slug: 'moskva', region: 'Московская область', population: 12655050, lat: 55.7558, lng: 37.6173 },
  { name: 'Санкт-Петербург', slug: 'sankt-peterburg', region: 'Ленинградская область', population: 5384342, lat: 59.9311, lng: 30.3609 },
  { name: 'Екатеринбург', slug: 'ekaterinburg', region: 'Свердловская область', population: 1544376, lat: 56.8389, lng: 60.6057 },
  { name: 'Новосибирск', slug: 'novosibirsk', region: 'Новосибирская область', population: 1625631, lat: 54.9885, lng: 82.9207 },
  { name: 'Казань', slug: 'kazan', region: 'Республика Татарстан', population: 1308660, lat: 55.7887, lng: 49.1221 },
  { name: 'Краснодар', slug: 'krasnodar', region: 'Краснодарский край', population: 1060797, lat: 45.0448, lng: 38.9760 },
  { name: 'Уфа', slug: 'ufa', region: 'Республика Башкортостан', population: 1128787, lat: 54.7388, lng: 55.9721 },
  { name: 'Ростов-на-Дону', slug: 'rostov-na-donu', region: 'Ростовская область', population: 1137904, lat: 47.2357, lng: 39.7015 },
  { name: 'Тюмень', slug: 'tyumen', region: 'Тюменская область', population: 847488, lat: 57.1553, lng: 65.5880 },
  { name: 'Волгоград', slug: 'volgograd', region: 'Волгоградская область', population: 1008998, lat: 48.7080, lng: 44.5133 },
]

type CWInput = {
  name: string; type: CarWashType; address: string; phone?: string
  rating: number; reviewCount: number; priceFrom?: number; priceTo?: number
  description?: string; workingHours?: string; services: string[]
  district?: string; featured?: boolean
}

const CARWASHES_BY_CITY: Record<string, CWInput[]> = {
  moskva: [
    { name: 'АкваСервис на Ленинградке', type: 'self_service', address: 'Ленинградское шоссе, 85', phone: '+7 495 123-45-67', rating: 4.7, reviewCount: 234, priceFrom: 100, priceTo: 500, workingHours: '24/7', district: 'Северный', description: 'Современная мойка самообслуживания с 8 постами. Пылесосы, химчистка салона. Тёплые боксы.', services: ['8 постов', 'Пылесосы', 'Бесконтактная оплата', 'Видеокамеры', 'Тёплые боксы'] },
    { name: 'Чистый Автомобиль Детейлинг', type: 'detailing', address: 'ул. Профсоюзная, 130', phone: '+7 495 987-65-43', rating: 4.9, reviewCount: 89, priceFrom: 3000, priceTo: 25000, workingHours: '9:00–22:00', district: 'Юго-западный', description: 'Профессиональный детейлинг: полировка, нанокерамика, химчистка салона. Работаем с 2016 года.', services: ['Нанокерамика', 'Полировка', 'Химчистка', 'Антикор', 'Бронеплёнка'] },
    { name: 'Автомойка на Автозаводской', type: 'manual', address: 'ул. Автозаводская, 17', phone: '+7 495 555-12-34', rating: 4.3, reviewCount: 456, priceFrom: 500, priceTo: 2000, workingHours: '8:00–23:00', district: 'Южнопортовый', description: 'Ручная мойка с опытным персоналом. Быстро и качественно.', services: ['Ручная мойка', 'Полировка', 'Шиномонтаж рядом'] },
    { name: 'WASH-GO Тоннельная', type: 'automatic', address: 'Кутузовский проспект, 45', rating: 4.1, reviewCount: 712, priceFrom: 350, priceTo: 900, workingHours: '8:00–22:00', district: 'Западный', description: 'Автоматическая тоннельная мойка. До 200 автомобилей в день.', services: ['Тоннельная', 'Сушка', 'Полировочный воск'] },
    { name: 'EcoWash Самообслуживание', type: 'self_service', address: 'Варшавское шоссе, 113', rating: 4.5, reviewCount: 178, priceFrom: 80, priceTo: 400, workingHours: '24/7', district: 'Южный', description: 'Экологичная мойка с рециркуляцией воды. Экономит воду на 70%.', services: ['Рециркуляция воды', '6 постов', 'Эко-химия', 'QR-оплата'] },
    { name: 'АвтоБлеск на Таганке', type: 'manual', address: 'ул. Большая Коммунистическая, 23', phone: '+7 495 333-77-88', rating: 4.4, reviewCount: 321, priceFrom: 600, priceTo: 2200, workingHours: '8:00–22:00', district: 'Центр', description: 'Ручная мойка в центре Москвы. Опытные мастера, качество на высоте.', services: ['Ручная мойка', 'Полировка', 'Химчистка', 'Нанопокрытие'] },
    { name: 'СамоМой ВДНХ', type: 'self_service', address: 'пр-т Мира, 119', phone: '+7 495 456-78-90', rating: 4.6, reviewCount: 198, priceFrom: 90, priceTo: 420, workingHours: '24/7', district: 'Северо-восточный', description: 'Удобная мойка рядом с ВДНХ. 6 постов, пылесосы, оплата картой.', services: ['6 постов', 'Пылесосы', 'Оплата картой', 'СБП'] },
    { name: 'Детейлинг-студия PRIME', type: 'detailing', address: 'Рублёвское шоссе, 28', phone: '+7 499 100-20-30', rating: 5.0, reviewCount: 47, priceFrom: 5000, priceTo: 50000, workingHours: '10:00–21:00', district: 'Западный', description: 'Элитный детейлинг на Рублёвке. Работаем с Bentley, Rolls-Royce, Ferrari.', services: ['Нанокерамика', 'Бронеплёнка', 'Полировка PPF', 'Детейлинг кожи', 'Озонирование'], featured: true },
    { name: 'ЭкспрессМой на Каширке', type: 'automatic', address: 'Каширское шоссе, 61', rating: 3.9, reviewCount: 534, priceFrom: 300, priceTo: 700, workingHours: '7:00–23:00', district: 'Южный', description: 'Быстрая автоматическая мойка. Очередь не более 5 минут.', services: ['Автоматическая', 'Сушка', 'Ароматизация'] },
    { name: '150bar Митино', type: 'self_service', address: 'ул. Митинская, 55', phone: '+7 495 789-01-23', rating: 4.8, reviewCount: 267, priceFrom: 100, priceTo: 500, workingHours: '24/7', district: 'Северо-западный', description: 'Франшизная точка 150bar. Тёплые боксы, работает в -40°C.', services: ['8 постов', 'Тёплые боксы', 'Химия Karcher', 'СБП', 'Пылесосы'], featured: true },
    { name: 'АвтоМастер Марьино', type: 'manual', address: 'Люблинская ул., 72', rating: 4.2, reviewCount: 289, priceFrom: 450, priceTo: 1800, workingHours: '9:00–22:00', district: 'Юго-восточный', description: 'Ручная мойка и шиномонтаж в Марьино.', services: ['Ручная мойка', 'Шиномонтаж', 'Химчистка'] },
    { name: 'Мойка ТЦ Мега Химки', type: 'automatic', address: 'Ленинградское шоссе, 21к1', rating: 4.0, reviewCount: 891, priceFrom: 400, priceTo: 950, workingHours: '9:00–23:00', district: 'Северный', description: 'Автомойка в торговом центре. Оставьте авто и идите за покупками.', services: ['Тоннельная', 'Полный комплекс', 'Пылесосы', 'Ароматизация'] },
  ],
  'sankt-peterburg': [
    { name: 'Невская Мойка Самообслуживания', type: 'self_service', address: 'пр. Невский, 200', rating: 4.6, reviewCount: 312, priceFrom: 90, priceTo: 450, workingHours: '24/7', district: 'Центральный', description: 'Крупная мойка самообслуживания в центре СПб. 10 постов.', services: ['10 постов', 'Тёплые боксы', 'СБП оплата'] },
    { name: 'Детейлинг Студия Премиум', type: 'detailing', address: 'ул. Звенигородская, 28', rating: 4.8, reviewCount: 67, priceFrom: 5000, priceTo: 30000, workingHours: '10:00–20:00', district: 'Центральный', description: 'Элитный детейлинг. Сертифицированные мастера, работа с Ferrari и Porsche.', services: ['Нанокерамика', 'Бронеплёнка', 'Полировка', 'Кожаный салон'], featured: true },
    { name: 'АвтоЧистка у Витебского', type: 'manual', address: 'Загородный пр., 52', rating: 4.4, reviewCount: 289, priceFrom: 600, priceTo: 1800, workingHours: '8:00–22:00', district: 'Центральный', description: 'Ручная мойка около Витебского вокзала.', services: ['Ручная мойка', 'Полировка кузова', 'Химчистка'] },
    { name: '150bar Купчино', type: 'self_service', address: 'пр. Будапештский, 100', phone: '+7 812 300-11-22', rating: 4.7, reviewCount: 198, priceFrom: 90, priceTo: 480, workingHours: '24/7', district: 'Купчино', description: 'Мойка самообслуживания 150bar в Купчино. 6 тёплых боксов.', services: ['6 постов', 'Тёплые боксы', 'Пылесосы', 'СБП'] },
    { name: 'Экспресс Мойка Парнас', type: 'automatic', address: 'пр. Культуры, 34', rating: 4.2, reviewCount: 445, priceFrom: 350, priceTo: 850, workingHours: '8:00–22:00', district: 'Парнас', description: 'Автоматическая тоннельная мойка рядом с метро Парнас.', services: ['Тоннельная', 'Сушка', 'Воск'] },
    { name: 'МойДвор Приморский', type: 'self_service', address: 'Приморский пр., 82', phone: '+7 812 555-33-44', rating: 4.5, reviewCount: 176, priceFrom: 80, priceTo: 400, workingHours: '24/7', district: 'Приморский', description: 'Мойка самообслуживания в Приморском районе. 4 поста, пылесосы.', services: ['4 поста', 'Пылесосы', 'Оплата картой'] },
    { name: 'АвтоСервис Шушары', type: 'manual', address: 'Московское шоссе, 253', rating: 4.1, reviewCount: 167, priceFrom: 500, priceTo: 1600, workingHours: '9:00–21:00', district: 'Шушары', description: 'Ручная мойка рядом с КАД.', services: ['Ручная мойка', 'Химчистка', 'Полировка'] },
    { name: 'ChipClean Василеостровский', type: 'detailing', address: 'Большой пр. В.О., 65', phone: '+7 812 777-88-99', rating: 4.7, reviewCount: 54, priceFrom: 4000, priceTo: 22000, workingHours: '10:00–20:00', district: 'Василеостровский', description: 'Профессиональный детейлинг на Васильевском острове.', services: ['Нанокерамика', 'Химчистка', 'Полировка', 'Тонировка'] },
  ],
  ekaterinburg: [
    { name: 'САМОМОЙ на Сибирском', type: 'self_service', address: 'Сибирский тракт, 8а', rating: 4.5, reviewCount: 198, priceFrom: 80, priceTo: 350, workingHours: '24/7', district: 'Ленинский', description: 'Современная мойка самообслуживания. 6 постов, тёплые боксы.', services: ['6 постов', 'Тёплые боксы', 'Пылесосы', 'Оплата картой'] },
    { name: 'EkbDetailing Pro', type: 'detailing', address: 'ул. Малышева, 145', rating: 4.7, reviewCount: 43, priceFrom: 2500, priceTo: 20000, workingHours: '10:00–21:00', district: 'Центр', description: 'Профессиональный детейлинг в Екатеринбурге.', services: ['Нанокерамика', 'Полировка', 'Тонировка'] },
    { name: '150bar Уралмаш', type: 'self_service', address: 'пр. Орджоникидзе, 12', phone: '+7 343 200-11-22', rating: 4.6, reviewCount: 221, priceFrom: 80, priceTo: 380, workingHours: '24/7', district: 'Уралмаш', description: 'Мойка самообслуживания 150bar на Уралмаше.', services: ['8 постов', 'Тёплые боксы', 'Пылесосы', 'СБП'], featured: true },
    { name: 'АвтоМойка Химмаш', type: 'manual', address: 'ул. Химмашевская, 11', rating: 4.0, reviewCount: 134, priceFrom: 400, priceTo: 1400, workingHours: '8:00–21:00', district: 'Химмаш', description: 'Ручная мойка в Химмаше. Низкие цены.', services: ['Ручная мойка', 'Полировка'] },
    { name: 'Тоннель ТЦ Гринвич', type: 'automatic', address: '8 Марта ул., 46', rating: 4.3, reviewCount: 389, priceFrom: 350, priceTo: 800, workingHours: '9:00–22:00', district: 'Центр', description: 'Автоматическая мойка у ТЦ Гринвич.', services: ['Тоннельная', 'Сушка', 'Воск', 'Ароматизация'] },
    { name: 'МойСам Академический', type: 'self_service', address: 'ул. Вильгельма де Геннина, 38', rating: 4.4, reviewCount: 156, priceFrom: 75, priceTo: 340, workingHours: '24/7', district: 'Академический', description: 'Новая мойка в Академическом районе.', services: ['4 поста', 'Пылесосы', 'QR-оплата'] },
  ],
  novosibirsk: [
    { name: 'МойСам Новосибирск', type: 'self_service', address: 'ул. Большевистская, 101', rating: 4.4, reviewCount: 156, priceFrom: 70, priceTo: 300, workingHours: '24/7', district: 'Советский', description: 'Доступная мойка самообслуживания. 4 поста.', services: ['4 поста', 'Терминал оплаты', 'Пылесосы'] },
    { name: 'ДетейлингЦентр НСК', type: 'detailing', address: 'ул. Кирова, 86', phone: '+7 383 200-33-44', rating: 4.7, reviewCount: 78, priceFrom: 2000, priceTo: 18000, workingHours: '9:00–21:00', district: 'Центральный', description: 'Детейлинг-студия в центре Новосибирска. Нанокерамика, полировка.', services: ['Нанокерамика', 'Полировка', 'Химчистка', 'Бронеплёнка'] },
    { name: '150bar Бердское шоссе', type: 'self_service', address: 'Бердское шоссе, 22', phone: '+7 383 100-22-33', rating: 4.6, reviewCount: 187, priceFrom: 75, priceTo: 350, workingHours: '24/7', district: 'Советский', description: 'Мойка самообслуживания 150bar. 6 постов, тёплые боксы.', services: ['6 постов', 'Тёплые боксы', 'Пылесосы', 'СБП'] },
    { name: 'ЭкспрессМойка Площадь Маркса', type: 'automatic', address: 'пл. Карла Маркса, 7', rating: 4.0, reviewCount: 334, priceFrom: 300, priceTo: 700, workingHours: '8:00–22:00', district: 'Ленинский', description: 'Быстрая автоматическая мойка у пл. Маркса.', services: ['Тоннельная', 'Сушка', 'Ароматизация'] },
    { name: 'АвтоМастерская Дзержинский', type: 'manual', address: 'ул. Гусинобродское шоссе, 53', rating: 4.2, reviewCount: 112, priceFrom: 400, priceTo: 1300, workingHours: '9:00–21:00', district: 'Дзержинский', description: 'Ручная мойка с химчисткой.', services: ['Ручная мойка', 'Химчистка', 'Полировка'] },
  ],
  kazan: [
    { name: 'АкваСтар Самообслуживание', type: 'self_service', address: 'пр. Победы, 87', rating: 4.6, reviewCount: 223, priceFrom: 85, priceTo: 380, workingHours: '24/7', district: 'Авиастроительный', description: 'Лучшая мойка самообслуживания в Казани. 8 постов.', services: ['8 постов', 'Тёплые боксы', 'QR-оплата', 'Камеры'] },
    { name: 'Казань Детейлинг', type: 'detailing', address: 'ул. Сибирский тракт, 34', phone: '+7 843 300-44-55', rating: 4.8, reviewCount: 56, priceFrom: 2500, priceTo: 20000, workingHours: '10:00–21:00', district: 'Советский', description: 'Детейлинг в Казани. Нанокерамика, бронеплёнка, полировка.', services: ['Нанокерамика', 'Бронеплёнка', 'Полировка', 'Химчистка'] },
    { name: 'МойКа! Казань', type: 'self_service', address: 'ул. Адоратского, 1', phone: '+7 843 200-55-66', rating: 4.5, reviewCount: 167, priceFrom: 80, priceTo: 360, workingHours: '24/7', district: 'Вахитовский', description: 'Мойка сети МОЙ-КА! с программой лояльности.', services: ['6 постов', 'Программа лояльности', 'Кешбэк', 'СБП'] },
    { name: 'Экспресс Кул Гали', type: 'automatic', address: 'ул. Николая Ершова, 68', rating: 4.1, reviewCount: 278, priceFrom: 320, priceTo: 750, workingHours: '8:00–22:00', district: 'Советский', description: 'Автоматическая мойка. Быстро и доступно.', services: ['Тоннельная', 'Сушка', 'Воск'] },
    { name: 'АвтоМойка Горки', type: 'manual', address: 'пр. Альберта Камалеева, 7', rating: 4.3, reviewCount: 145, priceFrom: 500, priceTo: 1600, workingHours: '9:00–22:00', district: 'Горки', description: 'Ручная мойка в жилом квартале Горки.', services: ['Ручная мойка', 'Полировка', 'Химчистка'] },
  ],
  krasnodar: [
    { name: 'КрасноДАР Мойка', type: 'self_service', address: 'ул. Красная, 176', rating: 4.5, reviewCount: 187, priceFrom: 75, priceTo: 320, workingHours: '24/7', district: 'Центральный', description: 'Популярная мойка в центре Краснодара.', services: ['6 постов', 'Бесконтактная мойка', 'СБП'] },
    { name: 'Детейлинг Южный', type: 'detailing', address: 'ул. Ставропольская, 88', phone: '+7 861 200-33-44', rating: 4.7, reviewCount: 62, priceFrom: 2000, priceTo: 15000, workingHours: '9:00–21:00', district: 'Карасунский', description: 'Детейлинг-студия в Краснодаре. Полировка, нанокерамика.', services: ['Нанокерамика', 'Полировка', 'Химчистка', 'Тонировка'] },
    { name: '150bar Прикубанский', type: 'self_service', address: 'ул. Калинина, 350', phone: '+7 861 100-44-55', rating: 4.6, reviewCount: 198, priceFrom: 80, priceTo: 360, workingHours: '24/7', district: 'Прикубанский', description: 'Мойка самообслуживания 150bar. 8 постов, тёплые боксы.', services: ['8 постов', 'Тёплые боксы', 'Пылесосы', 'СБП'] },
    { name: 'АвтоЧисто ФМР', type: 'manual', address: 'ул. Дзержинского, 100', rating: 4.2, reviewCount: 212, priceFrom: 450, priceTo: 1500, workingHours: '8:00–22:00', district: 'ФМР', description: 'Ручная мойка в ФМР районе.', services: ['Ручная мойка', 'Химчистка', 'Полировка'] },
    { name: 'Тоннель у Гипермаркета', type: 'automatic', address: 'ул. Российская, 58', rating: 4.0, reviewCount: 423, priceFrom: 300, priceTo: 700, workingHours: '8:00–23:00', district: 'Прикубанский', description: 'Автоматическая мойка рядом с Лентой.', services: ['Тоннельная', 'Сушка', 'Воск', 'Пылесосы'] },
  ],
  ufa: [
    { name: 'УфаМойка Самообслуживания', type: 'self_service', address: 'пр. Октября, 34', rating: 4.3, reviewCount: 134, priceFrom: 70, priceTo: 300, workingHours: '24/7', district: 'Кировский', description: 'Доступная мойка с новым оборудованием.', services: ['4 поста', 'Пылесосы', 'Оплата картой'] },
    { name: 'БашДетейлинг', type: 'detailing', address: 'ул. Революционная, 75', phone: '+7 347 200-55-66', rating: 4.6, reviewCount: 48, priceFrom: 2000, priceTo: 18000, workingHours: '10:00–21:00', district: 'Советский', description: 'Детейлинг студия в Уфе.', services: ['Нанокерамика', 'Полировка', 'Химчистка'] },
    { name: 'СамоМой Сипайлово', type: 'self_service', address: 'ул. Академика Королёва, 18', phone: '+7 347 100-33-44', rating: 4.5, reviewCount: 176, priceFrom: 75, priceTo: 330, workingHours: '24/7', district: 'Сипайлово', description: 'Новая мойка самообслуживания в Сипайлово.', services: ['6 постов', 'Тёплые боксы', 'СБП'] },
    { name: 'АвтоМойка Черниковка', type: 'manual', address: 'ул. Бакалинская, 22', rating: 4.1, reviewCount: 98, priceFrom: 400, priceTo: 1300, workingHours: '9:00–21:00', district: 'Черниковка', description: 'Ручная мойка с недорогими ценами.', services: ['Ручная мойка', 'Полировка'] },
  ],
  'rostov-na-donu': [
    { name: 'РостовМой', type: 'self_service', address: 'пр. Соколова, 62', rating: 4.2, reviewCount: 98, priceFrom: 75, priceTo: 280, workingHours: '24/7', district: 'Октябрьский', description: 'Мойка самообслуживания в центре Ростова.', services: ['4 поста', 'Оплата картой'] },
    { name: 'Детейлинг Нахичевань', type: 'detailing', address: 'пр. Баклановский, 112', phone: '+7 863 200-44-55', rating: 4.7, reviewCount: 53, priceFrom: 2500, priceTo: 20000, workingHours: '10:00–21:00', district: 'Нахичевань', description: 'Детейлинг-студия в Ростове. Полировка, нанокерамика.', services: ['Нанокерамика', 'Полировка', 'Химчистка', 'Бронеплёнка'] },
    { name: '150bar Левый берег', type: 'self_service', address: 'ул. Малиновского, 25', phone: '+7 863 100-55-66', rating: 4.5, reviewCount: 145, priceFrom: 80, priceTo: 350, workingHours: '24/7', district: 'Левый берег', description: 'Мойка самообслуживания 150bar. 6 постов.', services: ['6 постов', 'Тёплые боксы', 'Пылесосы', 'СБП'] },
    { name: 'АвтоЧисто на Западном', type: 'manual', address: 'ул. Орбитальная, 44', rating: 4.2, reviewCount: 167, priceFrom: 450, priceTo: 1500, workingHours: '8:00–22:00', district: 'Западный', description: 'Ручная мойка на Западном жилом массиве.', services: ['Ручная мойка', 'Химчистка'] },
    { name: 'ТоннельМойка М4', type: 'automatic', address: 'шоссе Новочеркасское, 33', rating: 3.9, reviewCount: 456, priceFrom: 300, priceTo: 650, workingHours: '8:00–22:00', district: 'Советский', description: 'Автоматическая мойка рядом с трассой М4.', services: ['Тоннельная', 'Сушка', 'Ароматизация'] },
  ],
  tyumen: [
    { name: 'ТюменьМойка 24', type: 'self_service', address: 'ул. Мельникайте, 117', rating: 4.4, reviewCount: 112, priceFrom: 80, priceTo: 320, workingHours: '24/7', district: 'Центральный', description: 'Круглосуточная мойка самообслуживания.', services: ['6 постов', 'Тёплые боксы', 'Пылесосы'] },
    { name: 'СибДетейлинг', type: 'detailing', address: 'ул. Харьковская, 67', phone: '+7 3452 200-33-44', rating: 4.7, reviewCount: 41, priceFrom: 2000, priceTo: 16000, workingHours: '10:00–21:00', district: 'Восточный', description: 'Детейлинг в Тюмени. Нанокерамика и полировка.', services: ['Нанокерамика', 'Полировка', 'Химчистка'] },
    { name: 'СамоМой Тюмень Юг', type: 'self_service', address: 'ул. 50 лет Октября, 76', phone: '+7 3452 100-44-55', rating: 4.5, reviewCount: 134, priceFrom: 75, priceTo: 310, workingHours: '24/7', district: 'Калининский', description: 'Мойка самообслуживания в южной части Тюмени.', services: ['4 поста', 'Тёплые боксы', 'СБП'] },
    { name: 'АвтоМойка Заречный', type: 'manual', address: 'ул. Газовиков, 93', rating: 4.1, reviewCount: 87, priceFrom: 400, priceTo: 1300, workingHours: '9:00–21:00', district: 'Заречный', description: 'Ручная мойка в Заречном районе.', services: ['Ручная мойка', 'Полировка'] },
  ],
  volgograd: [
    { name: 'ВолгоМой', type: 'self_service', address: 'пр. Ленина, 203', rating: 4.1, reviewCount: 87, priceFrom: 65, priceTo: 260, workingHours: '24/7', district: 'Центральный', description: 'Мойка самообслуживания в Волгограде.', services: ['4 поста', 'Терминал оплаты'] },
    { name: 'Детейлинг на Волге', type: 'detailing', address: 'ул. Рокоссовского, 54', phone: '+7 8442 200-33-44', rating: 4.6, reviewCount: 38, priceFrom: 1800, priceTo: 14000, workingHours: '10:00–20:00', district: 'Советский', description: 'Детейлинг-студия в Волгограде. Качественная химчистка и полировка.', services: ['Нанокерамика', 'Полировка', 'Химчистка'] },
    { name: 'СамоМой Красноармейский', type: 'self_service', address: 'ул. Кирова, 143', phone: '+7 8442 100-44-55', rating: 4.3, reviewCount: 112, priceFrom: 65, priceTo: 280, workingHours: '24/7', district: 'Красноармейский', description: 'Мойка самообслуживания в Красноармейском районе.', services: ['4 поста', 'Пылесосы', 'СБП'] },
    { name: 'АвтоЧисто Тракторозаводский', type: 'manual', address: 'пр. Дзержинского, 18', rating: 4.0, reviewCount: 134, priceFrom: 380, priceTo: 1200, workingHours: '8:00–21:00', district: 'Тракторозаводский', description: 'Ручная мойка рядом с тракторным заводом.', services: ['Ручная мойка', 'Полировка'] },
  ],
}

const FRANCHISES = [
  { name: '150bar', slug: '150bar', description: 'Одна из крупнейших сетей автомоек самообслуживания России. Тёплые боксы, работа в -40°C, окупаемость менее 1 года.', investmentFrom: 1900000, investmentTo: 5000000, royalty: 5.0, paybackMonths: 10, postsCount: '2-6', supportLevel: 'full' },
  { name: 'Сухомой', slug: 'sukhomoy', description: 'Мойка без воды — уникальный формат с 2011 года. Низкие инвестиции, нет требований к канализации.', investmentFrom: 800000, investmentTo: 2500000, royalty: 6.0, paybackMonths: 15, postsCount: '1-3', supportLevel: 'partial' },
  { name: 'МОЙ-КА!', slug: 'moyka', description: 'Федеральная сеть с мобильным приложением и программой лояльности. 90+ точек по России.', investmentFrom: 2500000, investmentTo: 8000000, royalty: 7.0, paybackMonths: 22, postsCount: '4-8', supportLevel: 'full' },
  { name: 'GEIZER', slug: 'geizer', description: 'Автомойка самообслуживания 24/7. Более 60 авто в день, чистая прибыль от 100 тыс./пост.', investmentFrom: 2000000, investmentTo: 6000000, royalty: 5.0, paybackMonths: 18, postsCount: '3-6', supportLevel: 'full' },
  { name: 'ALLES', slug: 'alles', description: 'Топ-100 франшиз 2024 по версии Forbes. Немецкое оборудование Kärcher, стандарты качества.', investmentFrom: 3000000, investmentTo: 9000000, royalty: 6.0, paybackMonths: 24, postsCount: '4-10', supportLevel: 'full' },
  { name: 'Автомойка Экспресс', slug: 'avtomoyka-express', description: 'Самый низкий порог входа на рынке. Доход от 200 тыс./мес с первого месяца.', investmentFrom: 470000, investmentTo: 1500000, royalty: 4.0, paybackMonths: 8, postsCount: '1-2', supportLevel: 'partial' },
]

const SUPPLIERS = [
  { name: 'КарчерЦентр', slug: 'karcher-centr', description: 'Официальный дилер Kärcher в России. Профессиональное оборудование для автомоек, сервис и обслуживание.', category: 'equipment', city: 'Москва', phone: '+7 495 789-00-11', website: 'https://karcher.ru', services: ['Продажа оборудования', 'Монтаж', 'Сервисное обслуживание', 'Обучение'], productTypes: ['Аппараты высокого давления', 'Пеногенераторы', 'Осмос-системы', 'Терминалы оплаты'], priceRange: 'mid', featured: true },
  { name: 'АвтоХим Профи', slug: 'avtohim-profi', description: 'Поставщик профессиональной химии для автомоек. Более 200 наименований. Работаем с 2012 года.', category: 'chemistry', city: 'Москва', phone: '+7 495 321-44-55', services: ['Подбор химии', 'Доставка по РФ', 'Пробники'], productTypes: ['Шампуни', 'Воски', 'Пенные составы', 'Чернители', 'Кондиционеры'], priceRange: 'budget' },
  { name: 'СтройМойка', slug: 'stroymojka', description: 'Строительство автомоек под ключ. 50+ объектов в 15 регионах России. Проектирование, монтаж, сдача.', category: 'construction', city: 'Екатеринбург', phone: '+7 343 555-77-88', website: 'https://stroymojka.ru', services: ['Проектирование', 'Строительство', 'Монтаж оборудования', 'Ввод в эксплуатацию', 'Гарантия 3 года'], productTypes: ['Тёплые боксы', 'Навесы', 'Модульные конструкции'], priceRange: 'mid', featured: true },
  { name: 'ТерминалПрофи', slug: 'terminal-profi', description: 'Терминалы оплаты для автомоек самообслуживания. Поддержка СБП, NFC, QR. Собственное ПО.', category: 'equipment', city: 'Санкт-Петербург', phone: '+7 812 100-22-33', services: ['Продажа терминалов', 'Интеграция с ПО', 'Круглосуточная поддержка'], productTypes: ['Платёжные терминалы', 'Системы учёта', 'IoT-мониторинг', 'CRM для мойки'], priceRange: 'mid' },
  { name: 'EhrleRus', slug: 'ehrle-rus', description: 'Официальный представитель Ehrle в России. Немецкое оборудование для профессиональных автомоек.', category: 'equipment', city: 'Москва', phone: '+7 495 456-78-90', website: 'https://ehrle.ru', services: ['Продажа', 'Монтаж', 'Сервис', 'Запчасти'], productTypes: ['Аппараты высокого давления', 'Пеногенераторы', 'Модули самообслуживания'], priceRange: 'premium', featured: true },
  { name: 'ВодаЧисто', slug: 'voda-chisto', description: 'Системы водоподготовки и очистки для автомоек. Оборот-системы, осмос, очистные сооружения.', category: 'equipment', city: 'Москва', phone: '+7 495 777-88-99', services: ['Проектирование водоподготовки', 'Монтаж', 'Обслуживание', 'Анализ воды'], productTypes: ['Обратный осмос', 'Оборот-системы', 'Очистные сооружения', 'Умягчители'], priceRange: 'mid' },
  { name: 'ХимМастер', slug: 'him-master', description: 'Профессиональная автохимия российского производства. Дешевле импортных аналогов на 30%.', category: 'chemistry', city: 'Новосибирск', phone: '+7 383 200-11-22', services: ['Оптовые поставки', 'Доставка по РФ', 'Технологическая поддержка'], productTypes: ['Шампуни', 'Воски', 'Активная пена', 'Чернители резины', 'Ароматизаторы'], priceRange: 'budget' },
  { name: 'МойкаПроект', slug: 'mojka-proekt', description: 'Проектирование и согласование автомоек. Подготовка документов, получение разрешений под ключ.', category: 'construction', city: 'Москва', phone: '+7 495 234-56-78', services: ['Проектирование', 'Согласование с СЭС', 'Разрешения', 'Авторский надзор'], productTypes: ['Рабочая документация', 'Согласования', 'Экспертизы'], priceRange: 'mid' },
]

const LISTINGS = [
  { title: 'Автомойка самообслуживания 6 постов — Москва', slug: 'self-service-6-posts-moskva', citySlug: 'moskva', carwashType: 'self_service' as CWT, price: 8500000, revenue: 650000, profit: 310000, posts: 6, description: 'Продаётся прибыльная мойка самообслуживания 6 постов в жилом квартале Москвы. Работает 4 года. Тёплые боксы, оборудование Kärcher 2021 г. Земля — аренда 15 лет. Выручка подтверждена кассовыми данными.', address: 'Северо-восточный район', equipmentAge: 3 },
  { title: 'Детейлинг-студия 2 поста, Санкт-Петербург', slug: 'detailing-2-posts-spb', citySlug: 'sankt-peterburg', carwashType: 'detailing' as CWT, price: 3200000, revenue: 420000, profit: 190000, posts: 2, description: 'Работающая детейлинг-студия в Приморском районе СПб. База клиентов 450 человек, средний чек 8 500 ₽. Оборудование: немецкие полировальные машины, осмос, профессиональный пылесос.', address: 'Приморский район', equipmentAge: 2 },
  { title: 'Ручная мойка 3 поста — Екатеринбург', slug: 'manual-3-posts-ekb', citySlug: 'ekaterinburg', carwashType: 'manual' as CWT, price: 2800000, revenue: 380000, profit: 130000, posts: 3, description: 'Продаётся ручная мойка в проходном месте Екатеринбурга. Работает 6 лет, постоянная клиентура. В аренде 3 машино-места. Персонал готов остаться.', address: 'Уралмаш', equipmentAge: 5 },
  { title: 'Автомойка самообслуживания 4 поста — Новосибирск', slug: 'self-service-4-posts-nsk', citySlug: 'novosibirsk', carwashType: 'self_service' as CWT, price: 4200000, revenue: 420000, profit: 200000, posts: 4, description: 'Рабочая мойка в новом микрорайоне. Открылась в 2022, оборудование новое. Земля — аренда на 10 лет. Прибыль растёт ежеквартально.', address: 'Советский район', equipmentAge: 2 },
  { title: 'Тоннельная мойка — Казань', slug: 'tunnel-kazhan', citySlug: 'kazan', carwashType: 'automatic' as CWT, price: 12000000, revenue: 900000, profit: 380000, posts: 1, description: 'Продаётся тоннельная мойка с трафиком 120+ авто/день у торгового центра. Оборудование Wash Tec 2020 г. Долгосрочная аренда площадки.', address: 'Советский район', equipmentAge: 4 },
  { title: 'Детейлинг премиум-класса — Москва', slug: 'detailing-premium-moskva', citySlug: 'moskva', carwashType: 'detailing' as CWT, price: 6500000, revenue: 800000, profit: 360000, posts: 3, description: 'Элитная детейлинг-студия на западе Москвы. Клиенты: Bentley, Porsche, Mercedes AMG. Средний чек 22 000 ₽. Работает 5 лет, высокая узнаваемость бренда.', address: 'Западный округ', equipmentAge: 2 },
  { title: 'Мойка самообслуживания 8 постов — Краснодар', slug: 'self-service-8-posts-krasnodar', citySlug: 'krasnodar', carwashType: 'self_service' as CWT, price: 7800000, revenue: 580000, profit: 270000, posts: 8, description: 'Крупная мойка в жилом массиве Краснодара. 8 постов, 2 пылесоса, шиномонтаж. Выручка стабильна, 60% клиентов — постоянные.', address: 'Прикубанский округ', equipmentAge: 3 },
  { title: 'Ручная мойка + шиномонтаж — Уфа', slug: 'manual-tyre-ufa', citySlug: 'ufa', carwashType: 'manual' as CWT, price: 1800000, revenue: 280000, profit: 90000, posts: 2, description: 'Небольшая мойка с шиномонтажом в Уфе. Сезонный бизнес с хорошим трафиком в межсезонье. Готов к продаже, собственник уезжает.', address: 'Кировский район', equipmentAge: 6 },
]

const REVIEWS: Array<{ carwashSlug: string; authorName: string; rating: number; text: string }> = [
  { carwashSlug: 'аквасервис-на-ленинградке', authorName: 'Дмитрий К.', rating: 5, text: 'Отличная мойка! Всегда чисто, оборудование работает без сбоев. Бесконтактная оплата — очень удобно. Хожу сюда уже 2 года.' },
  { carwashSlug: 'аквасервис-на-ленинградке', authorName: 'Алина В.', rating: 5, text: 'Лучшая самомойка в районе. Тёплые боксы зимой — спасение. Химия хорошая, машина блестит.' },
  { carwashSlug: 'аквасервис-на-ленинградке', authorName: 'Роман Ш.', rating: 4, text: 'Хорошая мойка, но в выходные очереди. Рекомендую приезжать в будни с утра.' },
  { carwashSlug: 'чистый-автомобиль-детейлинг', authorName: 'Игорь М.', rating: 5, text: 'Сделали нанокерамику на Tesla Model 3. Качество шикарное, мастер объяснил всё подробно. Цена соответствует качеству.' },
  { carwashSlug: 'чистый-автомобиль-детейлинг', authorName: 'Светлана П.', rating: 5, text: 'Химчистка салона — просто супер! Убрали старые пятна, о которых я уже забыла. Буду рекомендовать всем.' },
  { carwashSlug: 'невская-мойка-самообслуживания', authorName: 'Андрей Б.', rating: 5, text: 'Лучшая самомойка в центре СПб. Работает круглосуточно, оборудование современное. Оплата СБП — очень удобно.' },
  { carwashSlug: '150bar-митино', authorName: 'Антон Р.', rating: 5, text: 'Мойка 150bar — это стандарт. Всегда чисто, оборудование в рабочем состоянии. Хожу каждую неделю.' },
  { carwashSlug: '150bar-купчино', authorName: 'Наталья Ф.', rating: 4, text: 'Хорошая мойка, удобная локация. Иногда не хватает пены, но в целом довольна.' },
]

function slugify(str: string): string {
  const cyrillic: Record<string, string> = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' }
  return str.toLowerCase().split('').map(c => cyrillic[c] ?? c).join('').replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-').slice(0, 80)
}

async function main() {
  console.log('🌱 Seeding database...')

  const cityMap: Record<string, string> = {}
  for (const city of CITIES) {
    const c = await prisma.city.upsert({ where: { slug: city.slug }, update: {}, create: { ...city, isActive: true } })
    cityMap[city.slug] = c.id
    process.stdout.write(`📍 ${city.name}\n`)
  }

  const carwashSlugMap: Record<string, string> = {}
  for (const [citySlug, carwashes] of Object.entries(CARWASHES_BY_CITY)) {
    const cityId = cityMap[citySlug]
    if (!cityId) continue
    for (const cw of carwashes) {
      const slug = slugify(cw.name)
      const existing = await prisma.carWash.findUnique({ where: { slug } })
      if (existing) { carwashSlugMap[slug] = existing.id; continue }
      const created = await prisma.carWash.create({
        data: { cityId, name: cw.name, slug, type: cw.type, address: cw.address, district: cw.district, phone: cw.phone, rating: cw.rating, reviewCount: cw.reviewCount, priceFrom: cw.priceFrom, priceTo: cw.priceTo, description: cw.description, workingHours: cw.workingHours, services: cw.services, featured: cw.featured ?? false, status: ContentStatus.active, source: DataSource.manual },
      })
      carwashSlugMap[slug] = created.id
      process.stdout.write(`  🚗 ${cw.name}\n`)
    }
  }

  for (const franchise of FRANCHISES) {
    await prisma.franchise.upsert({ where: { slug: franchise.slug }, update: {}, create: { ...franchise, status: ContentStatus.active } })
    process.stdout.write(`  🤝 ${franchise.name}\n`)
  }

  for (const supplier of SUPPLIERS) {
    const existing = await prisma.supplier.findUnique({ where: { slug: supplier.slug } })
    if (!existing) {
      await prisma.supplier.create({ data: { ...supplier, status: ContentStatus.active, source: DataSource.manual } })
      process.stdout.write(`  🏭 ${supplier.name}\n`)
    }
  }

  for (const listing of LISTINGS) {
    const cityId = cityMap[listing.citySlug]
    if (!cityId) continue
    const existing = await prisma.businessListing.findUnique({ where: { slug: listing.slug } })
    if (!existing) {
      await prisma.businessListing.create({
        data: { title: listing.title, slug: listing.slug, listingType: ListingType.SELL, carwashType: listing.carwashType, cityId, price: listing.price, revenue: listing.revenue, profit: listing.profit, posts: listing.posts, description: listing.description, address: listing.address, equipmentAge: listing.equipmentAge, priceNegotiable: true, status: ContentStatus.active, source: DataSource.manual, verifiedAt: new Date() },
      })
      process.stdout.write(`  🏷️ ${listing.title}\n`)
    }
  }

  // Seed reviews
  for (const review of REVIEWS) {
    const carwash = await prisma.carWash.findFirst({ where: { name: { contains: review.authorName.split(' ')[0] } } })
    // match by partial slug
    const nameSlug = slugify(review.carwashSlug)
    const cw = await prisma.carWash.findFirst({ where: { slug: { contains: nameSlug.slice(0, 10) } } })
    if (!cw) continue
    const exists = await prisma.review.findFirst({ where: { carwashId: cw.id, authorName: review.authorName } })
    if (!exists) {
      await prisma.review.create({ data: { carwashId: cw.id, authorName: review.authorName, rating: review.rating, text: review.text, source: 'manual', publishedAt: new Date() } })
    }
  }

  console.log('✅ Seed complete!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
