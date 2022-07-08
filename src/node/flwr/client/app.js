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

const PROTO_PATH = __dirname + '../../../../../transport.proto';
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const {Tfjs_client_wrapper} = require('./tfjs_client_wrapper');
const {handle} = require('./grpc_client/message_handler');
const fs = require('fs');
const sleep = require('../common/sleep');

const GRPC_MAX_MESSAGE_LENGTH = 512 * 1024 * 1024;

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const transport_proto = grpc.loadPackageDefinition(packageDefinition).flower.transport;

async function start_client(
  server_address,
  client,
  root_certificates= grpc.credentials.createInsecure(),
  grpc_max_message_length = GRPC_MAX_MESSAGE_LENGTH
) {
  const options = {'grpc.max_send_message_length': grpc_max_message_length,'grpc.max_receive_message_length': grpc_max_message_length};
  const client_grpc = new transport_proto.FlowerService(server_address, root_certificates, options);
  await connect(client_grpc, client);
}

async function connect(client_grpc, client) {
  const call = client_grpc.join();
  console.log('client : join');
  call.on('data', async function (server_msg) {
    const {client_message, sleep_duration, keep_going} = await handle(client, server_msg);
    console.log('\n\nCLIENT_MESSAGE');
    console.log(JSON.stringify(client_message, null, 2));
    call.write(client_message);
    if (!keep_going) {
      call.end();
      console.info(`Disconnect, then re-establish connection after ${sleep_duration} second(s)`);
      await sleep(sleep_duration);
      await connect(client_grpc, client);
    }
  })
    .on('end', function () {
      console.log('\ncall.on == END: \nThe server has finished sending\n\n');
      call.end();
    })
    .on('error', function (e) {
      console.error(`\ncall.on == ERROR: \nAn error has occurred and the stream has been closed\n ${JSON.stringify(e)}\n\n`);
    })
    .on('status', function (status) {
      console.info(`\ncall.on == ERROR: \nprocess status\n${JSON.stringify(status)}\n\n`);
    });

}

module.exports.start_tfjs_client = async function start_tfjs_client(
  server_address,
  client,
  root_certificates = undefined,
  grpc_max_message_length = GRPC_MAX_MESSAGE_LENGTH
) {
  const flower_client = new Tfjs_client_wrapper(client);

  if (root_certificates !== undefined){
    const root_cert = fs.readFileSync(root_certificates);
    root_certificates = grpc.credentials.createSsl(root_cert);
    console.log(root_certificates);
  }

  await start_client(
    server_address,
    flower_client,
    root_certificates,
    grpc_max_message_length
  );
};