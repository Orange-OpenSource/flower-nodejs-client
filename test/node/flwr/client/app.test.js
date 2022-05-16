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

const {describe, it, before, after} = require('mocha');
const {strict: assert} = require('assert');
const {sleep} = require('../../../../src/node/flwr/client/app');
//const {start_tfjs_client} = require('../../../../src/node/flwr/client/app');
const FakeServer =  require('../../../resources/fakeServer').FakeServer;
//const {getFakeClient} = require('../../../resources/fakeClient');

describe('app class', () => {
  const address = 'localhost:5006';
  //let client = getFakeClient();
  let server = null;

  before(function (done) {
    server = new FakeServer(address);
    done();
  });

  after(function (done) {
    server.stop();
    done();
  });

  it('sleep', async() => {
    const t = 0.01;
    const before = Date.now();
    await sleep(t);
    const after = Date.now();
    assert.ok(((after-before)>t*10),'Ok');
  });

  it('start_tfjs_client', async () => {
    //await start_tfjs_client(address, client); //todo
  });
});