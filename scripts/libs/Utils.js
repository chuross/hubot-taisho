
module.exports = class Utils {

  static adminUsers = (process.env.HUBOT_ADMIN || '').split(',');

  // Todoist
  static todoistApiToken = process.env.HUBOT_TODOIST_TOKEN;
  static todoistProjectId = process.env.HUBOT_TODOIST_PROJECT_ID

  static get isLine() {
    return process.env.ADAPTER_MODE == 'line'
  }
}