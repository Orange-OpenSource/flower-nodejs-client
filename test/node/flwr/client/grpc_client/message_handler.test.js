/*
* Software Name : flower-nodejs-client
* Version: 0.1.0
* SPDX-FileCopyrightText: Copyright (c) 2022 Orange
* SPDX-License-Identifier: Apache-2.0
*
* This software is distributed under the Apache License 2.0,
* the text of which is available at https://github.com/Orange-OpenSource/flower-nodejs-client/blob/main/LICENSE
* or see the "license.txt" file for more details.
*
* Author: Emile Bergin <emile.bergin@orange.com>
*/

const {describe, it} = require('mocha');
const {strict: assert} = require('assert');

const {handle} = require('../../../../../src/node/flwr/client/grpc_client/message_handler');
const {Tfjs_client_wrapper} = require('../../../../../src/node/flwr/client/tfjs_client_wrapper');
const {getFakeClient} = require('../../../../resources/fakeClient');


describe('Message handler functions', () => {
  const client = new Tfjs_client_wrapper(getFakeClient());
  let tensors = null;

  it('Check get_parameters', async () => {
    const server_message = {
      get_parameters: {},
      msg: 'get_parameters'
    };

    const expected = {
      client_message : {
        msg: 'parameters_res',
        parameters_res: {
          parameters: {
            tensor_type: 'Float64Array',
            tensors: []
          }
        }
      },
      keep_going: true,
      sleep_duration: 0
    };
    const result = await handle(client, server_message);
    tensors = result.client_message.parameters_res.parameters.tensors;
    result.client_message.parameters_res.parameters.tensors = [];
    assert.deepStrictEqual(result, expected);
  });

  it('Check _reconnect', async () => {
    const server_message = {
      reconnect: {
        seconds : 10000
      },
      msg: 'reconnect'
    };
    const expected = {
      client_message : {
        msg: 'disconnect',
        disconnect : {
          reason : 'RECONNECT'
        }
      },
      sleep_duration: 10000,
      keep_going: false
    };
    const result = await handle(client, server_message);
    assert.deepStrictEqual(result, expected);
  });

  it('Check _fit', async () => {
    const server_message = {
      msg: 'fit_ins',
      fit_ins: {
        parameters: {
          tensor_type: 'Float64Array',
          tensors
        },
        config:{
          test: { double: 0.999}
        }}
    };

    const expected = {
      client_message: {
        msg: 'fit_res',
        fit_res: {
          metrics: undefined,
          num_examples: 100,
          parameters: {
            tensor_type: 'Float64Array',
            tensors
          }
        }
      },
      keep_going: true,
      sleep_duration: 0
    };
    const result = await handle(client, server_message);
    assert.deepStrictEqual(result, expected);
  });

  it('Check _evaluate', async () => {
    const server_message = {
      msg: 'evaluate_ins',
      evaluate_ins: {
        parameters: {
          tensor_type: 'Float64Array',
          tensors
        },
        config:{
          test: { double: 0.999}
        }
      }
    };

    const expected = {
      client_message: {
        msg: 'evaluate_res',
        evaluate_res: {
          loss : 0.999,
          metrics: {
            mse:{
              double: 0.999
            }
          },
          num_examples: 100
        }
      },
      keep_going: true,
      sleep_duration: 0
    };
    const result = await handle(client, server_message);
    result.client_message.evaluate_res.loss = 0.999;
    result.client_message.evaluate_res.metrics.mse.double = 0.999;

    assert.deepStrictEqual(result, expected);
  });

  it('Check _get_properties', async () => {
    const server_message = {
      msg: 'properties_ins',
      properties_ins: {
        config:{
          test: { double: 0.999}
        }}
    };

    const expected = {
      client_message: {
        msg: 'properties_res',
        properties_res: {
          status: {
            code: 0,
            message: 'OK'
          },
          properties: {
            test: { double: 0.999}
          }
        }
      },
      keep_going: true,
      sleep_duration: 0
    };
    const result = await handle(client, server_message);
    assert.deepStrictEqual(result, expected);
  });

  it('Check handler throw error', async () => {
    const expectedError = 'ERROR SWITCH DISPATCH {}';
    const expectedError2 = 'ERROR SWITCH DISPATCH {"msg":"test"}';
    const errorMessage = 'Should throw error';
    let server_message = {};
    try {
      await handle(client, server_message);
      throw new Error(errorMessage);
    }catch (e) {
      assert.deepStrictEqual(e.message, expectedError);
    }
    server_message = {msg:'test'};
    try {
      await handle(client, server_message);
      throw new Error(errorMessage);
    }catch (e) {
      assert.deepStrictEqual(e.message, expectedError2);
    }
  });


});