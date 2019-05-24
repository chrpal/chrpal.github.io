/**
 * The Things Network Data Storage
 * Stores data and makes it available using a REST API
 *
 * OpenAPI spec version: 2.0.0
 * Contact: info@thethingsindustries.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.5
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.TheThingsNetworkDataStorage) {
      root.TheThingsNetworkDataStorage = {};
    }
    root.TheThingsNetworkDataStorage.DevicesApi = factory(root.TheThingsNetworkDataStorage.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';

  /**
   * Devices service.
   * @module api/DevicesApi
   * @version 2.0.0
   */

  /**
   * Constructs a new DevicesApi. 
   * @alias module:api/DevicesApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the apiV2DevicesGet operation.
     * @callback module:api/DevicesApi~apiV2DevicesGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<'String'>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Query the devices for which data has been stored
     * The devices endpoint returns the list of devices for which data has been stored 
     * @param {module:api/DevicesApi~apiV2DevicesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<'String'>}
     */
    this.apiV2DevicesGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['key'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = ['String'];

      return this.apiClient.callApi(
        '/api/v2/devices', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
