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

module.exports.handle = async function handle(client, server_msg) {
  let client_message = null;
  console.log('\n\nSERVER MESSAGE');
  console.log(server_msg);
  switch (server_msg.msg) {
  case 'reconnect' :
    // eslint-disable-next-line no-case-declarations
    const {disconnect_res_proto, sleep_duration} = _reconnect(server_msg.reconnect);
    return {client_message: disconnect_res_proto, sleep_duration, keep_going: (sleep_duration <= 0)};
  case 'get_parameters':
    client_message = await _get_parameters(client);
    return {client_message, sleep_duration: 0, keep_going: true};
  case 'fit_ins' :
    client_message = await _fit(client, server_msg.fit_ins);
    return {client_message, sleep_duration: 0, keep_going: true};
  case 'evaluate_ins' :
    client_message = await _evaluate(client, server_msg.evaluate_ins);
    return {client_message , sleep_duration: 0, keep_going: true};
  case 'properties_ins' :
    client_message = _get_properties(client, server_msg.properties_ins);
    return {client_message, sleep_duration: 0, keep_going: true};
  default:
    throw new Error(`ERROR SWITCH DISPATCH ${JSON.stringify(server_msg)}`);
  }
};

function _reconnect(reconnect_msg){
  let reason = 'ACK';
  let sleep_duration = null;

  if (reconnect_msg.seconds != null){
    reason = 'RECONNECT';
    sleep_duration = reconnect_msg.seconds;
  }

  const disconnect_res_proto = {
    msg : 'disconnect',
    disconnect : {
      reason
    }
  };

  return {disconnect_res_proto, sleep_duration};
}

async function _get_parameters(client) {
  const parameters = await client.get_parameters();
  const parameters_res_proto = {
    msg: 'parameters_res',
    parameters_res: {
      parameters
    }
  };
  return parameters_res_proto;
}

async function _fit(client, fit_msg) {
  const fit_res = await client.fit(fit_msg);
  const fit_res_proto = {
    msg: 'fit_res',
    fit_res: {
      num_examples: fit_res.num_examples,
      metrics: fit_res.metrics,
      parameters: fit_res.parameters
    }
  };
  return fit_res_proto;
}

async function _evaluate(client, evaluate_msg) {
  const res = await client.evaluate(evaluate_msg);
  const evaluate_res_proto = {
    msg: 'evaluate_res',
    evaluate_res:res
  };
  return evaluate_res_proto;
}

function _get_properties(client, properties_msg){
  const properties_ins = properties_msg.properties_ins;
  const properties_res = client.get_properties(properties_ins);
  const properties_res_proto = {
    msg: 'properties_res',
    properties_res
  };
  return properties_res_proto;
}