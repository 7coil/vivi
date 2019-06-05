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
  .set('case sensitive routing', true)
  .set('json spaces', 2)
  .command('hyunjin', ({message, content}) => {
    message.channel.createMessage(`This is the HyunJin command. Your input was\n${content}`)
  })
  .command('yves', ({message}) => {
    message.channel.createMessage('This is the lower-case Yves command');
  })
  .command('Yves', ({message}) => {
    message.channel.createMessage('This is the upper-case Yves command');
  })
  .command('yeojin', ({message}) => {
    message.channel.createMessage('This is the YeoJin command');
  }, ({message}) => {
    message.channel.createMessage('Since next(); is not ran, this should not print');
  })
  .command('kimlip', ({next}) => {
    next(new Error('The Kim Lip command failed!'))
  }, ({message}) => {
    message.channel.createMessage('Since next(); is ran, but contains an error, this should not print');
  })
  .command('chuu', ({message, next}) => {
    message.channel.createMessage('This is the Chuu command')
      .then(() => {
        next();
      })
  }, ({message}) => {
    message.channel.createMessage('Since next(); is ran, this should print');
  })
  .command('heejin', deeperRouter)
  .error(({message, err}) => {
    message.channel.createMessage(`Oops! The following error occurred:\n${err.message}`)
  })

deeperRouter
  // Place potential collisions `heejin` with `heejin tears` below.
  .command('tears', ({message}) => {
    message.channel.createMessage('This is the HeeJin command, with tears as a subcommand');
  })
  .command('', ({message}) => {
    message.channel.createMessage('This is the HeeJin command');
  })

bot.connect();
