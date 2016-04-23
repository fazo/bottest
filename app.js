var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();

var pizzaBot = new builder.BotConnectorBot();
pizzaBot.add('/', new builder.CommandDialog()
    .matches('^pizza', '/pizza')
    .matches('my order', '/orders')
    .onDefault(function (session) {
        session.send("Say pizza to get a pizza, boi");
    }));

pizzaBot.add('/pizza', [
    function (session) {
        builder.Prompts.choice(session, "What kind of pizza would you like, bruh?", "Pepperoni|Margarita|Just fuck me up fam");
    },
    function (session, results) {
        session.pizzaType = results.response.entity;
        //session.send("Yo that shit's lit af, nigga");
        builder.Prompts.choice(session, "Extra toppings?", "Bacon|Resentment|Cheddar|Nothing");
    },
    function (session, results) {
        session.send("Tight.");
        session.topping = results.response.entity;
        builder.Prompts.choice(session, "How ya gon pay, booi?", "Cash|Card|Method of questionable ethicality");
    },
    function (session, results) {
    },
    function (session, results) {
        session.paymentMethod = results.response.entity;
        session.send("So, let's recap this bitch. A ".concat(session.pizzaType).concat(" pizza with extra ").concat(session.pizzaType).concat(". Gona pay with dat ").concat(results.response.paymentMethod));
        builder.Prompts.confirm(session, "Is that aight?");
    },
    function (session, results) {
        if(results.response.entity)
        {
          session.send("Enjoy that shiz!");
        }
    }
]);

server.use(pizzaBot.verifyBotFramework({ appId: 'you id', appSecret: 'your secret' }));
server.post('/v1/messages', pizzaBot.listen());

server.listen(3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
