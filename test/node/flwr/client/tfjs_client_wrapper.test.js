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
const {Tfjs_client_wrapper} = require('../../../../src/node/flwr/client/tfjs_client_wrapper');
const {Tfjs_Client} = require('../../../resources/fakeClient');
const sinon = require('sinon');

describe('Tfjs_client_wrapper class', () => {
  let wrapper = null;
  const client = new Tfjs_Client();
  let tensors = null;
  const errorMessage = 'Should throw error';

  beforeEach('beforeAll',async ()=>{
    wrapper = new Tfjs_client_wrapper(client);
    tensors = await wrapper.get_parameters();
    tensors = tensors.tensors;
  });

  it('Check constructor', () => {
    assert.notDeepStrictEqual(wrapper.client,null);
  });

  it('Check get_parameters', async () => {
    const expected = {
      tensor_type: 'Float64Array',
      tensors : null
    };
    const result = await wrapper.get_parameters();
    result.tensors = null;
    assert.deepStrictEqual(result, expected);
  });

  it('Check evaluate throw No Weights', async () => {
    const expectedError = 'parameters.tensors is not iterable';
    const expectedError2 = 'Cannot read properties of undefined (reading \'parameters\')';
    try {
      await wrapper.evaluate();
      throw new Error(errorMessage);
    }catch (e) {
      assert.deepStrictEqual(e.message, expectedError2);
    }

    let ins = {
      parameters: {
        tensors : null
      }
    };
    try {
      await wrapper.evaluate(ins);
      throw new Error(errorMessage);
    }catch (e) {
      assert.deepStrictEqual(e.message, expectedError);
    }

    ins = {
      parameters: {
        tensors : undefined
      }
    };
    try {
      await wrapper.evaluate(ins);
      throw new Error(errorMessage);
    }catch (e) {
      assert.deepStrictEqual(e.message, expectedError);
    }
  });

  it('Check evaluate throw error linked with type', async () => {
    const expectedError = 'Return value expected to be of type (float, int, dict).';
    const mock = sinon.mock(client);
    mock.expects('evaluate').once().resolves([Number(1),Number(1),Number(1)]);

    const evaluateIns = {
      parameters: {
        tensor_type: 'Float64Array',
        tensors
      },
      config:{
        test: { double: 0.999}
      }
    };

    try{
      await wrapper.evaluate(evaluateIns);
      throw new Error(errorMessage);
    }catch (e) {
      assert.deepStrictEqual(e.message, expectedError);
    }

    mock.verify();
    mock.restore();
  });

  it('Check evaluate throw error linked with type 2', async () => {
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
    const mock = sinon.mock(client);
    mock.expects('evaluate').once().resolves([Number(1), Number(1), Number(1), Number(1), Number(1)]);

    const evaluateIns = {
      parameters: {
        tensor_type: 'Float64Array',
        tensors
      },
      config:{
        test: { double: 0.999}
      }
    };

    try{
      await wrapper.evaluate(evaluateIns);
      throw new Error(errorMessage);
    }catch (e) {
      assert.deepStrictEqual(e.message, EXCEPTION_MESSAGE_WRONG_RETURN_TYPE);
    }

    mock.verify();
    mock.restore();

  });
});
