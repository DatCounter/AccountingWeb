class TelegramAuth
{
    token = "1645281069:AAEawojtDZUHHO-rzQHvdlpXzVG0SwowUkY";

    constructor() {
        
        Telegram.Passport.createAuthButton('telegram_passport_auth', {
            bot_id:       123456, // place id of your bot here
            scope:        {data: [{type: 'id_document', selfie: true}, 'address_document', 'phone_number', 'email'], v: 1},
            public_key:   token, // place public key of your bot here
            nonce:        'ab2df83746a87d2f3bd6...', // place nonce here
            callback_url: 'https://example.com/callback/' // place callback url here
          });
    }
}