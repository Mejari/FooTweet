Changelog
---------

* 0.1.2
    * Increasing amount of past tweets loaded on startup to further avoid double-tweeting users.

* 0.1.1
    * Sorting new statuses by created-date, oldest first so that we don't miss old tweets with new limiting option

* 0.1.0
    * Upgraded to the latest versions of:
        * [connect](https://npmjs.org/package/connect)
        * [express](https://npmjs.org/package/express)
        * [jade](https://npmjs.org/package/jade)
        * [socket-io](https://npmjs.org/package/socket.io)
        * [node-twitter-api](https://npmjs.org/package/node-twitter-api)
        * [sequelize-mysql](https://npmjs.org/package/sequelize-mysql)
    * Changed default console logging to [log4js](https://npmjs.org/package/log4js)
    * Added more application details to `package.json`
    * Changed error views to extends default layout
    * Added ability to set maximum number of tweets per search interval
        * Defaults to 15
    * Added this changelog

* 0.0.1
    * Initial version