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

class Client {
  //Abstract base class for Flower clients.

  get_parameters(){
    //Return ParametersRes: the current local model parameters.
    throw new Error('Abstract method!');
  }

  // eslint-disable-next-line no-unused-vars
  get_properties(ins){
    //ins : FitIns
    //             The training instructions containing (global) model parameters
    //             received from the server and a dictionary of configuration values
    //             used to customize the local training process.
    //return PropertiesRes : set of client's properties.
    throw new Error('Abstract method!');
  }

  // eslint-disable-next-line
  fit(parameters, config){
    //return FitRes: Refine the provided weights using the locally held dataset.
    throw new Error('Abstract method!');
  }

  // eslint-disable-next-line no-unused-vars
  evaluate(parameters, config) {
    //ins : EvaluateIns
    //             The evaluation instructions containing (global) model parameters
    //             received from the server and a dictionary of configuration values
    //             used to customize the local evaluation process.
    //return EvaluateRes: Evaluate the provided weights using the locally held dataset.
    throw new Error('Abstract method!');
  }
}

module.exports.Client = Client;