import sourceMapSupport from 'source-map-support';
import Eris from 'eris';
import configuration from '../configuration.yaml'
import fs from 'fs';
import path from 'path';
import Haseul from 'haseul';

// Read the source map
sourceMapSupport.install({
  retrieveSourceMap: () => ({
    url: 'index.js',
    map: fs.readFileSync(path.join(__dirname, 'index.js.map'), 'utf8')
  })
});

const bot = new Eris(configuration.token)
const router = new Haseul();
const deeperRouter = new Haseul();

bot.on('ready', () => {
  console.log('ready!');
});

bot.on('messageCreate', (message) => {
  router.route(message.content, message);
})

router
  .set('prefix', 'vivi')
  .set('json spaces', 2)
  .command('help', ({message}) => {
    message.channel.createMessage('This is the help command');
  })
  .command('banana', ({message, next}) => {
    next(new Error('owo whats this'))
  })
  .command('hello', deeperRouter)
  .error(({message, err}) => {
    message.channel.createMessage(`Oops! The following error occured:\n${err.message}`)
  })

deeperRouter
  .command('world', ({message}) => {
    message.channel.createMessage('Test2');
  })

bot.connect();
