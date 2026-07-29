// @ts-nocheck
class BSDApi {}

BSDApi.host = "plusapi.bsd.meowfox.net";
BSDApi.port = 80;
BSDApi.v1ApiRoute = "/bsd/api/v1";
BSDApi.getServerTimeRoute = "get_server_time";
BSDApi.linkTagRoute = "/link_tag";
BSDApi.GET_BSD_OWN_HOME_DATA = "/get_own_home_data";
BSDApi.KEEP_ALIVE = "/keep_alive";
BSDApi.GET_BSD_USERS_BY_MASK = "/get_bsd_users_by_mask";
BSDApi.GET_BSD_ONLINE = "/online";
BSDApi.setTitleRoute = "/set_title";
BSDApi.LOG_EXCEPTION = "/log_exception";
BSDApi.GET_PROXY = "/get_proxy";
BSDApi.REPORT_BATTLEEND_RESULTS = "/battleend_result";
BSDApi.UNLINK_TELEGRAM_ACCOUNT = "/unlink_telegram";
BSDApi.SCUTILS_START_SPECTATE = "/do_spectate";
BSDApi.RESPONSE_TO_LOCALE = {
  this_tg_account_linked_already: "BSDPlusTagAlreadyLinkedByYou",
  other_tg_account_linked_already: "BSDPlusTagAlreadyLinkedByOther",
  user_has_disabled_notifications: "BSDPlusUserHasDisabledNotifications",
  waiting_for_confirmation: "BSDPlusWaitingForConfirmation",
  telegram_timed_out: "BSDPlusTelegramTimedOut",
  user_not_found: "BSDPlusUserNotFound",
  unknown_server_error: "BSDPlusUnknownServerError",
};

exports.BSDApi = BSDApi;
