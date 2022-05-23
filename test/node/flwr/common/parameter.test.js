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

const {getWeights, parameters_to_weights, weights_to_parameters} = require('../../../../src/node/flwr/common/parameter');
const {getFakeModel} = require('../../../resources/fakeModel');

const expectedWeights = [
  new Float64Array([ 45.1, 84.5, 87.9, 87.1 ]),
  new Float64Array([ 1.1, 1.2, 1.3, 1.4 ])
];

const expectedParameters = {
  tensors: [
    Buffer.from([0xcd, 0xcc, 0xcc, 0xcc, 0xcc, 0x8c, 0x46, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x55, 0x40, 0x9a, 0x99, 0x99, 0x99, 0x99, 0xf9, 0x55, 0x40, 0x66, 0x66, 0x66, 0x66, 0x66, 0xc6, 0x55, 0x40]),
    Buffer.from([0x9a, 0x99, 0x99, 0x99, 0x99, 0x99, 0xf1, 0x3f, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0xf3, 0x3f, 0xcd, 0xcc, 0xcc, 0xcc, 0xcc, 0xcc, 0xf4, 0x3f, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0xf6, 0x3f])
  ],
  tensor_type: 'Float64Array'
};

describe('Parameter functions', () => {

  it('Check getWeights', async () => {
    const weights = getFakeModel().getWeights();
    const actual = await getWeights(weights);
    const expected = [
      new Float32Array([ 0, 0, 0, 0 ]),
      new Float32Array([ 1, 1 ]),
      new Float32Array([ 0, 0 ]),
      new Float32Array([ 1 ])
    ];
    assert.deepStrictEqual(actual, expected);
  });

  it('Check parameters_to_weights', async () => {
    const result = await parameters_to_weights(expectedParameters);
    assert.deepStrictEqual(result, expectedWeights);
  });

  it('Check weights_to_parameters', async () => {
    const result = await weights_to_parameters(expectedWeights);
    assert.deepStrictEqual(result, expectedParameters.tensors);
  });

});