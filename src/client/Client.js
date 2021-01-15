const BaseClient = require('./BaseClient');
const PollingClient = require('./PollingClient');
const ClientUser = require('../structures/ClientUser');

/**
 * The main hub for interacting with telegram API
 * @extends {BaseClient}
 */
class Client extends BaseClient {
  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options) {
    super(options);
    /**
     * Options of the client
     * @type {Object} 
     */
    this.options = options;

    /**
     * The polling client used to get updates from telegram API
     * @type {PollingClient}
     */
    this.polling = new PollingClient(this);

    /**
     * The webhook client used to get updates from telegram API
     * @type {WebhookClient}
     */
    //this.webhook = new WebhookClient(this);

    /**
     * The action manager of the client
     * @type {ActionManager}
     * @private
     */
    // this.actions = new ActionManager(this);

    /**
     * The token of the bot to authorize with API
     * <warn>This should be kept private always</warn>
     * @type {?string}
     */
    this.token = null;
    
 
    /**
     * The client user
     * @type {?ClientUser}
     */
     this.user = null;
     
     
    /**
     * The time at which the client was ready 
     * @type {?Date}
     */
    this.readAt = null;

  }

  /**
   * The uptime of the bot/client
   * @type {?Date}
   */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
  };

  /**
   * Logs the client in and starts receiving events.
   *  @param {string} [token=this.token] Token of the bot to log in with
   * returns {Promise<string>} Token of the bot used
   */
  async login(token = this.token) {
    if (!token || typeof token != 'string') throw new Error('NO TOKEN OR INVALID TOKEN PROVIDED');
    this.debug(`Provided token ${token}`);
    this.token = token;
    this.fetchApplication();
    try {
      await this.trackUpdates();
    } catch (err) {

    };

  };
  
  startPolling() {
    this.polling.start();
  };

  /**
   * Track telegram updates either through polling or webhooks 
   */
  async trackUpdates() {

  };

  fetchApplication() {
    return this.api.getMe.get()
      .then((res) => {
        this.user = new ClientUser(this, res);
        return this.user;
      });
  };
  
  
  getUpdates(data) {
    return this.api.getUpdates().get(data);
  };


};

module.exports = Client;