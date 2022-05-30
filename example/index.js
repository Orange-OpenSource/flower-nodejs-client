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

const {Tfjs_Client} = require('./tfjs_Client');
const {start_tfjs_client} = require('../index');
//const {start_tfjs_client} = require('flower-client');


const tfjs_Client = new Tfjs_Client();

start_tfjs_client(
  'localhost:5006',
  tfjs_Client
).then();