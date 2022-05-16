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

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

class FakeServer {

  constructor(address) {
    this.server = new grpc.Server();
    const PROTO_PATH = 'transport.proto';
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

    this.server.addService(transport_proto.FlowerService.service, {
      join: this.join
    });

    this.server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
      this.server.start();
    });
  }

  join(call) {
    console.log('join');
    const message = {
      msg:'reconnect',
      reconnect:{
        seconds:1
      }
    };
    call.write(message);
    call.on('data', function(message) {
      console.log(message);
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

  reconnect(call){
    const message = {
      msg:'reconnect',
      reconnect:{
        seconds:3
      }
    };
    call.write(message);
  }

  stop(){
    this.server.tryShutdown((error)=>{
      if (error){
        this.server.forceShutdown();
      }
    });
  }
}

module.exports.FakeServer = FakeServer;