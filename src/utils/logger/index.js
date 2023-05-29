import services from 'services';

import ServerLogger from './ServerLogger';

const logger = new ServerLogger({
  transport: (messages) => services.sendLog({ messages }),
  useConsole: true,
});

export default logger;
