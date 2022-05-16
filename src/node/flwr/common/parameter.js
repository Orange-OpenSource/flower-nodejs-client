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

async function getWeights(model){
  const weights = [];
  for (const layer of model) {
    const result = await layer.data();
    weights.push(result);
  }
  return weights;
}

async function parameters_to_weights(parameters) {
  let results = [];
  for (const tensor of parameters.tensors) {
    const result = await bytes_to_ndarray(tensor);
    results.push(result);
  }
  return results;
}

function bufferToFloat64Array(buf) {
  const arrayBuffer = new ArrayBuffer(buf.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  const res = new Float64Array(arrayBuffer);
  return res;
}

async function bytes_to_ndarray(tensor) {
  const res = bufferToFloat64Array(tensor);
  return res;
}

async function weights_to_parameters(weights) {
  let results = [];
  for (const ndarray of weights) {
    const result = await ndarray_to_bytes(new Float64Array(ndarray));
    results.push(result);
  }
  return results;
}

function float64ArrayToBuffer(float64Array){
  return new Buffer.from(float64Array.buffer);
}

async function ndarray_to_bytes(ndarray) {
  return float64ArrayToBuffer(ndarray);
}

module.exports.weights_to_parameters = weights_to_parameters;
module.exports.parameters_to_weights = parameters_to_weights;
module.exports.getWeights = getWeights;