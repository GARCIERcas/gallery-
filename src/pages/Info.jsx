import { config } from '../config.js'
import { FREE_DELIVERY_FROM, deliveryMethods, formatPrice, materials } from '../data.js'
import { useTitle } from '../router.js'

export function Delivery() {
  useTitle('Доставка и оплата')
  return (
    <main className="narrow prose">
      <h1>Доставка и оплата</h1>
      <h2>Изготовление</h2>
      <p>Каждый отпечаток делаем под заказ за 3–5 рабочих дней. Перед отправкой проверяем цвет и качество, упаковываем в жёсткую коробку с защитными уголками.</p>
      <h2>Доставка</h2>
      <ul className="plain">
        {deliveryMethods.map((d) => (
          <li key={d.id} className="sum-row"><span>{d.label}<br /><span className="muted small">{d.note}</span></span><span>{d.price ? formatPrice(d.price) : 'Бесплатно'}</span></li>
        ))}
      </ul>
      <p>При заказе от {formatPrice(FREE_DELIVERY_FROM)} доставка бесплатная.</p>
      <h2>Оплата</h2>
      <p>Картой онлайн — после подтверждения заказа пришлём ссылку на оплату. Или при получении — картой либо наличными.</p>
      <h2>Материалы</h2>
      {materials.map((m) => <p key={m.id}><b>{m.label}.</b> {m.note}. Пигментные чернила, срок службы отпечатка — более 100 лет.</p>)}
      <h2>Возврат</h2>
      <p>Если отпечаток пришёл повреждённым или с браком печати — переделаем бесплатно или вернём деньги. Напишите нам в течение 14 дней после получения.</p>
    </main>
  )
}

export function About() {
  useTitle('О галерее')
  return (
    <main className="narrow prose">
      <h1>О галерее</h1>
      <p>Мы делаем репродукции картин, которые любим сами: импрессионисты и постимпрессионисты из собрания Чикагского института искусств.</p>
      <p>Изображения взяты из открытой коллекции Art Institute of Chicago и находятся в общественном достоянии (CC0). Мы печатаем их в высоком разрешении на музейных материалах — так, чтобы картину хотелось рассматривать вблизи.</p>
      <h2>Контакты</h2>
      <p>
        Email: <a className="u" href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a><br />
        Телефон: {config.contactPhone}
        {config.telegram && <><br />Telegram: <a className="u" href={`https://t.me/${config.telegram}`}>@{config.telegram}</a></>}
      </p>
    </main>
  )
}

export function Privacy() {
  useTitle('Политика конфиденциальности')
  return (
    <main className="narrow prose">
      <h1>Политика конфиденциальности</h1>
      <p>Мы собираем только данные, необходимые для выполнения заказа: имя, телефон, email и адрес доставки.</p>
      <p>Данные используются исключительно для связи с вами, доставки и оплаты заказа, передаются только службе доставки и не передаются третьим лицам в иных целях.</p>
      <p>Вы можете запросить удаление своих данных, написав на {config.contactEmail}.</p>
    </main>
  )
}
