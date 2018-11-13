#!/usr/bin/env python

# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json

# [START storage_upload_file]
from google.cloud import bigquery

# [END storage_upload_file]

def start_client():
    return bigquery.Client()

def create_dataset(client, dataset_id):
    dataset_ref = client.dataset(dataset_id)
    dataset = bigquery.Dataset(dataset_ref)
    try:
        dataset = client.create_dataset(dataset)
        return True
    except:
        return False

def create_table(client, dataset_id, table_name, schema_json):
    schema = []
    with open(schema_json, 'r') as f:
        schema_dict = json.load(f)

    for field in schema_dict:
        schema.append(bigquery.SchemaField(field["name"], field["type"]))
    dataset_ref = client.dataset(dataset_id)
    table_ref = dataset_ref.table(table_name)
    table = bigquery.Table(table_ref, schema=schema)
    try:
        table = client.create_table(table)  # API request
        return True
    except:
        return False
