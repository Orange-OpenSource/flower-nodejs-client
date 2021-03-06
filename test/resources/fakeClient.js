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

const tf = require('@tensorflow/tfjs-node');
const {Client} = require('../../src/node/flwr/client/client');

const limit = 10;
const nb = 100;
const x = [];
const y = [];
for (let i = 0; i < nb; i++) {
  const n = Math.floor(Math.random() * limit);
  x.push(n);
  y.push(n + 1);
}

const x_test = [];
const y_test = [];
for (let i = 0; i < nb; i++) {
  const n = Math.floor(Math.random() * limit);
  x_test.push(n);
  y_test.push(n + 1); //todo +bruit
}

const xs_test = tf.tensor2d(x, [nb, 1]).div(limit);
const ys_test = tf.tensor2d(y, [nb, 1]).div(limit);



class Tfjs_Client extends Client{
  constructor() {
    super();
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({units: 2, inputShape: [1]}));
    this.model.add(tf.layers.dense({units: 1}));
    this.model.compile({loss: 'meanSquaredError', optimizer: 'sgd', metrics: ['mse']});
  }

  get_parameters(){
    return this.model.getWeights();
  }

  // eslint-disable-next-line no-unused-vars
  get_properties(ins){
    return {
      status: {
        code: 0,
        message: 'OK'
      },
      properties: {
        test: { double: 0.999}
      }
    };
  }

  // eslint-disable-next-line no-unused-vars
  async fit(parameters, config) {
    this.setWeights(parameters);
    /*await this.model.fit(xs, ys, {verbose:0, epochs:1, batchSize:32, callbacks: {
      onEpochEnd: (epoch, logs) => {
        // Plot the loss and accuracy values at the end of every training epoch.
        console.log(epoch, logs);
      }}});*/
    return {
      parameters_prime: this.model.getWeights(),
      num_examples: nb,
      metrics: {}
    };
  }

  // eslint-disable-next-line no-unused-vars
  async evaluate(parameters, config) {
    this.setWeights(parameters);
    const tensors = await this.model.evaluate(xs_test, ys_test, {verbose: 0});
    const metrics = [];
    for (const tensorElement of tensors) {
      const elem = await tensorElement.data();
      metrics.push(elem);
    }
    const [mse, loss] = metrics;
    return [loss, nb, {mse}];
  }

  setWeights(parameters) {
    const weights = this.model.getWeights();
    for (const i in weights) {
      parameters[i] = tf.tensor(Array.from(parameters[i].dataSync()), weights[i].shape);
    }
    this.model.setWeights(parameters);
  }
}

function getFakeClient(){
  return new Tfjs_Client();
}

module.exports.Tfjs_Client = Tfjs_Client;
module.exports.getFakeClient = getFakeClient;