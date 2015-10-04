var request = require('request'),
    _ = require('lodash');

/**
 * Interfaces with the python HTTP server from ../../python-engine/webapp.py
 * @param url [string] URL of the python server
 * @constructor
 */
function HtmEngineClient(url) {
    this.url = url;
}

/**
 * Post data to a model.
 * @param id [string] model id
 * @param value [float] model value
 * @param timestamp [integer] UNIX timestamp associated with value
 * @param callback [function] might be sent error
 */
HtmEngineClient.prototype.postData = function(id, value, timestamp, callback) {

  var convertDate = function(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat*1000);
    return [pad(d.getMonth()+1), pad(d.getDate()), d.getFullYear().toString().substr(2,2)].join('/') + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  };

  var url = this.url + '/event/' + id,
    body = {"value": value, "timestamp": convertDate(timestamp)};
	request({

      url: url,
      method: 'POST',
      json: body
		}, callback);
};

HtmEngineClient.prototype.postBulkData = function(id, value, timestamp, callback) {

  var convertDate = function(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat*1000);
    return [pad(d.getMonth()+1), pad(d.getDate()), d.getFullYear().toString().substr(2,2)].join('/') + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  };

  var url = this.url + '/bulkEvent/' + id,
    body = {"value": value, "timestamp": convertDate(timestamp)};
	request({

      url: url,
      method: 'POST',
      json: body
		}, callback);
};

/**
 * Creates a new model with specified id, min, and max values. If model exists,
 * command is ignored.
 * @param id [string] model id
 * @param min [float] min value for input data
 * @param max [float] max value for input data
 * @param callback
 */
HtmEngineClient.prototype.createModel = function(id, min, max, callback) {
    var url = this.url + '/create/' + id;
    console.log('Creating model %s...', id);
    request({
        url: url,
        method: 'POST',
        json: {
            min: min,
            max: max
        }
    }, callback);
};

/**
 * Gets ALL the data for specified model.
 * @param id [string] model id
 * @param callback [function] called with (err, rows)
 */
HtmEngineClient.prototype.getData = function(id, callback) {
  var url = this.url + '/getData/' + id;

  request({
    url: url,
    method: 'POST',
    json: {}
  }, function(err, response, body) {
    console.log(response);
    callback(null, response.body.data);
  });
};

/**
 * Returns the timestamp for the last data point given a model id.
 * @param id
 * @param callback
 */
HtmEngineClient.prototype.getLastUpdated = function(id, callback) {
    this.getData(id, function(err, data) {
        if (err) return callback(err);
        if (!data.length) return callback();
        callback(null, data[data.length - 1].timestamp);
    });
};


module.exports = HtmEngineClient;
