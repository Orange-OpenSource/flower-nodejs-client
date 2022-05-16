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

const {describe, it, beforeEach} = require('mocha');
const {strict: assert} = require('assert');

const {evaluate_res_to_proto, metrics_to_proto, scalar_to_proto} = require('../../../../src/node/flwr/common/serde');

let res = {};

describe('Serde functions', () => {

  beforeEach('Before each', ()=>{
    res = {
      num_examples:100,
      loss:{ 0 : 0.18000000715255737},
      metrics:{
        accuracy:{
          0 : 0.612819492816925
        }
      }
    };
  });

  it('Check evaluate_res_to_proto if metrics', async () => {
    const expected = {
      'num_examples':100,
      'loss': 0.18000000715255737,
      'metrics':{
        'accuracy':{
          0 : 0.612819492816925
        }
      }
    };
    const result = evaluate_res_to_proto(res);
    assert.deepStrictEqual(result, expected);
  });

  it('Check evaluate_res_to_proto if no metrics', async () => {
    const expected = {
      'num_examples': 100,
      'loss': 0.18000000715255737,
      'metrics':{
      }
    };
    res.metrics = {};

    const result = evaluate_res_to_proto(res);
    assert.deepStrictEqual(result, expected);
  });

  it('Check metrics_to_proto', async () => {
    const expected = {accuracy: 0.612819492816925};
    const result = metrics_to_proto(res.metrics);
    assert.deepStrictEqual(result, expected);
  });

  it('Check scalar_to_proto', async () => {
    const expected = 0.612819492816925;
    const result = scalar_to_proto(res.metrics.accuracy);
    assert.deepStrictEqual(result, expected);
  });

});