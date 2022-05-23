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

const tf = require('@tensorflow/tfjs');

function getFakeModel(){
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 2, inputShape: [2], kernelInitializer:'zeros', biasInitializer:'ones'}));
  model.add(tf.layers.dense({units: 1, kernelInitializer:'zeros', biasInitializer:'ones'}));
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd', metrics: ['accuracy']});
  return model;
}

module.exports.getFakeModel = getFakeModel;