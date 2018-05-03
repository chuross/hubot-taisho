class Utils {

  static get adminUsers() {
    return (process.env.HUBOT_ADMIN || '').split(',');
  }

  static get todoistApiToken() {
    return process.env.HUBOT_TODOIST_TOKEN;
  }

  static get todoistProjectId() {
    return process.env.HUBOT_TODOIST_PROJECT_ID;
  }

  static get isLine() {
    return process.env.ADAPTER_MODE == 'line';
  }
}

module.exports = Utils;