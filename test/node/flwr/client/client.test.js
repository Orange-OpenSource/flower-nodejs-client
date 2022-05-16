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

const assert = require('assert').strict;
const {describe, it, before, after} = require('mocha');

const {Client} = require('../../../../src/node/flwr/client/client');
const ERROR_MESSAGE = 'Abstract method!';

describe('Client class', () => {
  let client;

  before(function (done) {
    client = new Client();
    done();
  });

  after(function (done) {
    done();
  });

  it('Check get_parameters throw error', () => {
    try{
      client.get_parameters();
    }catch (e) {
      assert.deepStrictEqual(e.message, ERROR_MESSAGE);
    }
  });

  it('Check get_properties throw error', () => {
    try{
      client.get_properties();
    }catch (e) {
      assert.deepStrictEqual(e.message, ERROR_MESSAGE);
    }
  });

  it('Check fit throw error', () => {
    try{
      client.fit();
    }catch (e) {
      assert.deepStrictEqual(e.message, ERROR_MESSAGE);
    }
  });

  it('Check evaluate throw error', () => {
    try{
      client.evaluate();
    }catch (e) {
      assert.deepStrictEqual(e.message, ERROR_MESSAGE);
    }
  });

});
