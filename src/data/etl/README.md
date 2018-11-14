## Example Apache Beam Runner Config

This is an example configuration which could be used to run this ETL pipeline in Apache Beam. 

```
--project=stop_events
--runner=DirectRunner
--javascriptTextTransformGcsPath=/path/to/file/trimet_dwell_time/src/data/etl/LOAD_UDF.js
--JSONPath=/path/to/file/trimet_dwell_time/src/data/etl/schema.json
--javascriptTextTransformFunctionName=transform
--inputFilePattern=/path/to/file/trimet_dwell_time/data/sample/sample.csv
--outputTable=stop-events:stuff.stop_events
--bigQueryLoadingTemporaryDirectory=gs://metri_stop_events/bq_load_temp/
```
