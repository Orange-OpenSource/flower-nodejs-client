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

function evaluate_res_to_proto(res) {
  return {
    loss:res.loss[0],
    num_examples:res.num_examples,
    metrics: res.metrics
  };
}

function metrics_to_proto(metrics) {
  let proto = {};
  for (const key in metrics) {
    proto[key] = scalar_to_proto(metrics[key]);
  }
  return proto;
}

function scalar_to_proto(metric) {
  return metric[0];
}

module.exports.evaluate_res_to_proto = evaluate_res_to_proto;
module.exports.metrics_to_proto = metrics_to_proto;
module.exports.scalar_to_proto = scalar_to_proto;