# -*- coding: utf-8 -*-
from utils import bq_client

import click
import logging

from dotenv import find_dotenv, load_dotenv
from pathlib import Path

import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

@click.command()
@click.option('--dataset_id', prompt='Bigquery dataset id',
              help='Your Bigquery Dataset Id')
@click.option('--table_name', prompt='Bigquery table name',
                            help='Your Bigquery table name')
@click.option('--input_dir', prompt='Input directory: ', default="./data/raw", type=click.Path())
@click.option('--output_dir', prompt='Input directory: ', default="./data/initial", type=click.Path())
@click.option('--schema_json', prompt='Schema json file: ', default="./data/initial/schema.json", type=click.Path())
def main(dataset_id, table_name, input_dir, output_dir, schema_json):
    """ Extract, transfer, and load for downloaded data.
    """
    logger = logging.getLogger("get_raw -- {}".format(__name__))
    client = bq_client.start_client()
    created = bq_client.create_dataset(client, dataset_id)
    if created:
        print("Dataset {} created".format(dataset_id))
    else:
        print("Dataset {} failed to create".format(dataset_id))
    created_table = bq_client.create_table(client, dataset_id, table_name, schema_json)
    if created_table:
        print("Table {} created in Dataset {} using Schema file {}".format(dataset_id, table_name, schema_json))
    else:
        print("Table {} failed to create".format(table_name))

if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    # not used in this stub but often useful for finding various files
    project_dir = Path(__file__).resolve().parents[2]

    # find .env automagically by walking up directories until it's found, then
    # load up the .env entries as environment variables
    load_dotenv(find_dotenv())

    main()
