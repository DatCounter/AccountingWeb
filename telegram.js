const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);
class TelegramBot {
  //initialization bot
  start() {
    //start registration
    bot.start(function (ctx) {
      var sqlite3 = require('sqlite3').verbose();
      var db = new sqlite3.Database('AccountingWebDB');
      var data = {};
      db.get(
        'SELECT count(*) as CountOf from users WHERE messageId = $messageId',
        { $messageId: ctx.message.from.id },
        function (err, row) {
          if (err !== null) console.log('Error on bot.start!!\n' + err);
          data = row.CountOf;
          if (data === 0) {
            db.run(
              'INSERT INTO users VALUES ($messageId, $step, $canAdmin)',
              {
                $messageId: ctx.message.from.id,
                $step: 1,
                $canAdmin: false,
              },
              function (err) {
                if (err !== null) {
                  ctx.reply('Произоишла ошибка! Обратитесь к системному администратору');
                  console.log(err + '\nERROR ON UPDATE user on bot.on method');
                }
              }
            );
            ctx.reply('Здравствуй! Введи логин и пароль для авторизации в системе!');
          } else {
            ctx.reply('Ты уже авторизован или не закончил авторизацию!');
          }
        }
      );
      db.close();
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
      var sqlite3 = require('sqlite3').verbose();
      var db = new sqlite3.Database('AccountingWebDB');
      var data = {};
      db.get(
        'SELECT canAdmin from users WHERE messageId = $messageId',
        { $messageId: ctx.message.from.id },
        function (err, row) {
          data = row;
          if (data === undefined || data.canAdmin == false) {
            ctx.reply('Данная команда вам не доступна!');
            return;
          } else if (data.canAdmin == false) return;

          db.all('SELECT * from orders', function (err, rows) {
            console.log(rows);
            if (rows.length == 0) {
              ctx.reply('Доступных заявок нет');
            } else {
              let message = '';
              rows.forEach(function (order) {
                message +=
                  '\n\n' +
                  'Номер заказа: ' +
                  order.id +
                  '\nИмя: ' +
                  order.name +
                  '\nПочта: ' +
                  order.email +
                  '\nТелефон: ' +
                  order.phone +
                  '\nПредпочтения: ' +
                  order.preferred;
              });
              ctx.reply(message);
            }
          });
        }
      );
      db.close();
    });
    bot.command('remove', function (ctx) {
      var sqlite3 = require('sqlite3').verbose();
      var db = new sqlite3.Database('AccountingWebDB');

      db.get(
        'SELECT messageId, step, canAdmin from users WHERE messageId = $messageId',
        {
          $messageId: ctx.message.from.id,
        },
        function (err, row) {
          if (err !== null) {
            console.log(err.message);
            ctx.reply('Возникла ошибка! Обратитесь к системному администратору!');
            return;
          }
          if (row.canAdmin == false) {
            ctx.reply('Данная команда вам не доступна!');
            return;
          }
          var splitedMsg = ctx.message.text.split(' ');
          if (splitedMsg.length == 2) {
            let idOrder = splitedMsg[1];
            db.get(
              'SELECT count(*) as Length from orders WHERE id = $id',
              {
                $id: idOrder,
              },
              function (err, row) {
                if (row.Length === 0) {
                  ctx.reply(
                    'Такой записи с номером заявки ' +
                      idOrder +
                      ' не существует! Проверьте правильный ввод номера заявки.'
                  );
                } else {
                  db.run(
                    'DELETE from orders WHERE id = $id',
                    {
                      $id: idOrder,
                    },
                    function (err) {
                      if (err !== null) console.log(err.message);
                      ctx.reply('Удаление заявки произошло успешно!');
                    }
                  );
                }
              }
            );
          }
        }
      );
      db.close();
    });

    bot.command('logout', function (ctx) {
      var sqlite3 = require('sqlite3').verbose();
      var db = new sqlite3.Database('AccountingWebDB');
      db.run('UPDATE users SET step = 1, canAdmin = false WHERE messageId = $messageId', {
        $messageId: ctx.message.from.id,
      });
      ctx.reply('Успешный выход!');
      db.close();
    });

    //process of authorization
    bot.on('message', function (ctx) {
      var splitedMsg = ctx.message.text.split(' ');
      var sqlite3 = require('sqlite3').verbose();
      var db = new sqlite3.Database('AccountingWebDB');
      var data = {};
      db.get(
        'SELECT messageId, step, canAdmin from users WHERE messageId = $messageId',
        {
          $messageId: ctx.message.from.id,
        },
        function (err, row) {
          data = row;
          if (data.canAdmin == false) {
            if (
              splitedMsg.length === 2 &&
              splitedMsg[0] === process.env.LOGIN &&
              splitedMsg[1] === process.env.SECRET_PASSWORD &&
              data.step === 1
            ) {
              db.run(
                'UPDATE users SET step = $step, canAdmin = $canAdmin WHERE messageId = $messageId',
                {
                  $step: ++data.step,
                  $canAdmin: true,
                  $messageId: ctx.message.from.id,
                },
                function (err) {
                  if (err !== null) {
                    ctx.reply('Произоишла ошибка! Обратитесь к системному администратору');
                    console.log(err + '\nERROR ON UPDATE user on bot.on method');
                  }
                }
              );
              ctx.reply(
                'Успешный вход! Для просмотра возможностей комманд напишите /help\nНовые заявки будут появлятся в виде новых сообщений'
              );
            } else {
              ctx.reply(
                'Вход прошёл безуспешно, попробуйте ещё раз! Проверьте, не поставили ли вы лишних пробелов и ввели корректный логин и пароль через 1 пробел.'
              );
            }
          } else if (data.step == 2 && data.canAdmin == true) {
            ctx.reply(
              'Я такой команды не знаю, попробуйте использовать /help, для получения всех команд'
            );
          } else {
            ctx.reply("Произведите запись в системе написав '/start'");
          }
        }
      );

      db.close();
    });
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    return true;
  }

  // outhere adding
  addOrder(order) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('AccountingWebDB');
    var data = [{ notNullData: 'notNullData' }];
    db.all('SELECT messageId, canAdmin from users', function (err, rows) {
      data = rows;
      rows.forEach(function (row) {
        if (row.canAdmin == true) {
          bot.telegram.sendMessage(
            row.messageId,
            'Поступил новый заказ!' + '\nЧтобы просмотреть все заказы, напишите /orders'
          );
        }
      });
    });

    db.run(
      'INSERT INTO orders VALUES ($id, $name, $phone, $email, $preferred)',
      {
        $id: order.id,
        $name: order.name,
        $phone: order.phone,
        $email: order.email,
        $preferred: order.preferred,
      },
      function (err) {
        if (err !== null) console.error(err.message);
      }
    );
    db.close();
    console.log(data);
  }
}

module.exports = { TelegramBot };
