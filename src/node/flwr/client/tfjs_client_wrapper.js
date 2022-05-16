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

const {Client} = require('./client');
const assert = require('assert');
const {getWeights, weights_to_parameters, parameters_to_weights} = require('../common/parameter');
const tf = require('@tensorflow/tfjs-node');

const DEPRECATION_WARNING_EVALUATE_1 =
    'DEPRECATION WARNING: deprecated return format\n' +
    '\n' +
    '    num_examples, loss, accuracy\n' +
    '\n' +
    'move to\n' +
    '\n' +
    '    loss, num_examples, {"accuracy": accuracy}\n' +
    '\n' +
    'instead. Note that the deprecated return format will be removed in a future\n' +
    'release.';

const EXCEPTION_MESSAGE_WRONG_RETURN_TYPE =
    'NumPyClient.evaluate did not return a tuple with 3 elements.\n' +
    'The return type should have the following type signature:\n' +
    '\n' +
    '    Tuple[float, int, Dict[str, Scalar]]\n' +
    '\n' +
    'Example\n' +
    '-------\n' +
    '\n' +
    '    0.5, 10, {"accuracy": 0.95}\n';

class Tfjs_client_wrapper extends Client{
  constructor(client) {
    super();
    this.client = client;
  }

  get_properties(ins){
    return this.client.get_properties(ins);
  }

  async get_parameters() {
    const weights = await getWeights(this.client.get_parameters());
    const tensors = await weights_to_parameters(weights);

    const parameters = {
      tensors,
      tensor_type: 'Float64Array'
    };

    return parameters;
  }

  async fit(ins) {
    const parameters = await parameters_to_weights(ins.parameters);
    this.setWeights(parameters);
    let results = await this.client.fit(parameters, ins.config);

    results.parameters_prime = await getWeights(results.parameters_prime);
    results.parameters_prime = await weights_to_parameters(results.parameters_prime);

    const fit_res = {
      num_examples: results.num_examples,
      metrics: results.history,
      parameters: {
        tensors: results.parameters_prime,
        tensor_type: 'Float64Array'
      }

    };
    return fit_res;
  }

  async evaluate(ins) {
    let evaluate_res = null;
    const parameters = await parameters_to_weights(ins.parameters);

    this.setWeights(parameters);

    const results = await this.client.evaluate(parameters, ins.config);

    if (results.length === 3) {
      if (typeof results[0] === 'object' && typeof results[1] === 'number' && typeof results[2] === 'number') {
        console.log(DEPRECATION_WARNING_EVALUATE_1);
        const [num_examples, loss, accuracy] = results;
        evaluate_res = {
          num_examples,
          loss,
          accuracy
        };
      }else if (typeof results[0] === 'object' && typeof results[1] === 'number' && typeof results[2] === 'object') {
        const [loss, num_examples, metrics] = results;
        for (const key in metrics) {
          metrics[key] = { double: metrics[key][0]};
        }
        evaluate_res = {
          num_examples,
          loss,
          metrics
        };
      } else {
        throw new Error('Return value expected to be of type (float, int, dict).');
      }
    } else if (results.length === 4) {
      console.log(DEPRECATION_WARNING_EVALUATE_1);
      assert(typeof results[0], 'number');
      assert(typeof results[1], 'number');
      assert(typeof results[2], 'number');
      assert(typeof results[3], 'object');
      const [num_examples, loss, accuracy, metrics] = results;
      for (const key in metrics) {
        metrics[key] = { double: metrics[key][0]};
      }
      evaluate_res = {
        num_examples,
        loss,
        accuracy,
        metrics
      };
    } else {
      throw new Error(EXCEPTION_MESSAGE_WRONG_RETURN_TYPE);
    }
    return evaluate_res;
  }

  setWeights(parameters) {
    const weights = this.client.model.getWeights();
    for (const i in weights) {
      parameters[i] = tf.tensor(Array.from(parameters[i]), weights[i].shape);
    }
    this.client.model.setWeights(parameters);
  }
}

module.exports.Tfjs_client_wrapper = Tfjs_client_wrapper;