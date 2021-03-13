const { Telegraf } = require('telegraf');

var orders = [];
var users = [];

class Order {
  constructor(id, name, preferred, email = null, phone = null) {
    (this.id = id),
      (this.name = name),
      (this.email = email),
      (this.phone = phone),
      (this.preferred = preferred);
  }
  id;
  name;
  email;
  phone;
  preferred;
}

class User {
  constructor(id, user, password, canAdmin, step) {
    (this.id = id),
      (this.user = user ?? null),
      (this.password = password ?? null),
      (this.canAdmin = canAdmin ?? false),
      (this.step = step ?? 0);
  }
  id;
  user;
  password;
  canAdmin;
  step;
}

const token = '1645281069:AAEawojtDZUHHO-rzQHvdlpXzVG0SwowUkY';
const bot = new Telegraf(token);
class TelegramBot {
  //initialization bot
  start() {
    const user = 'OlgaAdmin';
    const password = 'XO3o#doA@zyf';
    //start registration
    bot.start(function (ctx) {
      if (!users.find((u) => u.id == ctx.message.from.id)) {
        users[users.length] = new User(ctx.message.from.id, null, null, false, 1);

        ctx.reply('Здравствуй! Введи логин и пароль для авторизации в системе!');
      } else {
        ctx.reply('Ты уже авторизован или не закончил авторизацию!');
      }
    });
    //help
    bot.help((ctx) =>
      ctx.reply(
        'Доступные команды:\n/start - начать процесс авторизации, без него вы не сможете попасть к функционалу' +
          '\n/orders - просмотр всех заказов, которые необходимо обработать' +
          '\n/remove [N] - удаления заказа, где [N] - номер заявки' +
          '\n/update - изменить заказ(НЕ ДОСТУПНО)\n/add - добавить в ручную заказ(НЕ ДОСТУПНО)'
      )
    );
    bot.command('orders', function (ctx) {
      let user = users.find((u) => u.id == ctx.message.from.id);
      if (!user) {
        ctx.reply('Данная команда вам не доступна!');
        return;
      }
      if (orders.length == 0) {
        ctx.reply('Доступных заявок нет');
      } else {
        for (let i = 0; i < orders.length; i++) {
          ctx.reply(
            'Номер заявки: ' +
              (orders[i].id + 1) +
              '\n' +
              orders[i].name +
              '\nКонтакты:\n' +
              orders[i].email +
              '\n' +
              orders[i].phone +
              '\nПредпочтительный вид связи: ' +
              orders[i].preferred
          );
        }
      }
    });
    //наладить верное удаление
    bot.command('remove', function (ctx) {
      let user = users.find((u) => u.id == ctx.message.from.id);
      if (!user) {
        ctx.reply('Данная команда вам не доступна!');
        return;
      }
      var splitedMsg = ctx.message.text.split(' ');
      if (splitedMsg[0] == '/remove' && splitedMsg.length == 2) {
        let numberOfOrder = Number(splitedMsg[1]) - 1;
        let order = orders.find((o) => o.id === numberOfOrder);

        if (order instanceof Order) {
          let indexToRemove = orders.findIndex((o) => o.id === order.id);
          orders.splice(indexToRemove, 1);
          ctx.reply('Удаленa запись: №' + (order.id + 1));
        } else {
          ctx.reply('Заявки с номером ' + (numberOfOrder + 1) + ' не существует');
        }
      } else {
        ctx.reply('Вы забыли написать номер заявки');
      }
    });

    //process of authorization
    bot.on('message', function (ctx) {
      var splitedMsg = ctx.message.text.split(' ');
      let userIndex = users.findIndex((u) => u.id == Number(ctx.message.from.id));

      if (userIndex != -1) {
        let currentUser = users[userIndex];
        if (
          splitedMsg.length == 2 &&
          splitedMsg[0] == user &&
          splitedMsg[1] == password &&
          currentUser.step == 1
        ) {
          currentUser.user = user;
          currentUser.password = password;
          currentUser.canAdmin = true;
          currentUser.step++;
          users[userIndex] = currentUser;
          ctx.reply(
            'Успешный вход! Для просмотра возможностей комманд напишите /help\nНовые заявки будут появлятся в виде новых сообщений'
          );
        } else {
          ctx.reply(
            'Вход прошёл безуспешно, попробуйте ещё раз! Проверьте, не поставили ли вы лишних пробелов и ввели корректный логин и пароль через 1 пробел.'
          );
        }
      } else if (userIndex == -1) {
        ctx.reply("Произведите запись в системе написав '/start'");
      } else if (currentUser.step == 2 && currentUser.canAdmin == true) {
        ctx.reply(
          'Я такой команды не знаю, попробуйте использовать /help, для получения всех команд'
        );
      } else {
        ctx.reply("Произведите запись в системе написав '/start'");
      }
    });
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    return true;
  }

  // outhere adding
  addOrder(order) {
    order.id = orders.length;
    var newOrder = new Order(order.id, order.name, order.preferred, order.email, order.phone);
    if (newOrder instanceof Order) {
      orders.push(newOrder);
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        bot.telegram.sendMessage(
          user.id,
          'Поступил новый заказ с номером ' +
            newOrder.id +
            '\nЧтобы просмотреть все заказы, напишите /orders'
        );
      }
    } else {
      console.log(order + 'is not Order');
    }
  }
}

module.exports = { TelegramBot };
