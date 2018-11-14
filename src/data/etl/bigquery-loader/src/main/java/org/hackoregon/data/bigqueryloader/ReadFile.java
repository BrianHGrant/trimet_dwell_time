package org.hackoregon.data.bigqueryloader;

import com.google.api.services.bigquery.model.TableFieldSchema;
import com.google.api.services.bigquery.model.TableSchema;
import org.apache.beam.sdk.transforms.SerializableFunction;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;
import org.json.JSONArray;

import org.hackoregon.data.bigqueryloader.common.JavascriptTextTransformer.TransformTextViaJavascript;
import org.hackoregon.data.bigqueryloader.common.JavascriptTextTransformer.JavascriptTextTransformerOptions;
import org.hackoregon.data.bigqueryloader.common.BigQueryConverters;
import org.apache.beam.sdk.Pipeline;
import org.apache.beam.sdk.io.TextIO;
import org.apache.beam.sdk.io.gcp.bigquery.BigQueryIO;
import org.apache.beam.sdk.io.gcp.bigquery.BigQueryIO.Write.CreateDisposition;
import org.apache.beam.sdk.io.gcp.bigquery.BigQueryIO.Write.WriteDisposition;

import org.apache.beam.sdk.options.PipelineOptionsFactory;
import org.apache.beam.sdk.options.Description;
import org.apache.beam.sdk.options.ValueProvider;
import org.apache.beam.sdk.options.ValueProvider.NestedValueProvider;
import org.apache.beam.sdk.options.Validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ReadFile {
    /** Options supported by {@link ReadFile}. */
    public interface Options extends JavascriptTextTransformerOptions {
        @Description("The location of the text you'd like to process")
        ValueProvider<String> getInputFilePattern();

        void setInputFilePattern(ValueProvider<String> value);

        @Description("JSON file with BigQuery Schema description")
        ValueProvider<String> getJSONPath();

        void setJSONPath(ValueProvider<String> value);

        @Description("Output topic to write to")
        ValueProvider<String> getOutputTable();

        void setOutputTable(ValueProvider<String> value);

        @Description("Path to javascript fn for transforming output")
        ValueProvider<String> getJavascriptTextTransformGcsPath();

        void setJavascriptTextTransformGcsPath(ValueProvider<String> jsTransformPath);

        @Validation.Required
        @Description("UDF Javascript Function Name")
        ValueProvider<String> getJavascriptTextTransformFunctionName();

        void setJavascriptTextTransformFunctionName(
                ValueProvider<String> javascriptTextTransformFunctionName);

        @Validation.Required
        @Description("Temporary directory for BigQuery loading process")
        ValueProvider<String> getBigQueryLoadingTemporaryDirectory();

        void setBigQueryLoadingTemporaryDirectory(ValueProvider<String> directory);
    }
    private static final Logger LOG = LoggerFactory.getLogger(ReadFile.class);

    private static final String BIGQUERY_SCHEMA = "BigQuery Schema";
    private static final String NAME = "name";
    private static final String TYPE = "type";
    private static final String MODE = "mode";

    public static void main(String[] args) {
        // Create the pipeline.
        Options options = PipelineOptionsFactory.fromArgs(args).withValidation().as(Options.class);
        Pipeline pipeline = Pipeline.create(options);

        pipeline.apply("Read from source", TextIO.read().from(options.getInputFilePattern()))
                .apply(
                        TransformTextViaJavascript.newBuilder()
                                .setFileSystemPath(options.getJavascriptTextTransformGcsPath())
                                .setFunctionName(options.getJavascriptTextTransformFunctionName())
                                .build())
                .apply(BigQueryConverters.jsonToTableRow())
                .apply("Insert into Bigquery",
                        BigQueryIO.writeTableRows()
                                .withSchema(
                                        NestedValueProvider.of(
                                                options.getJSONPath(),
                                                new SerializableFunction<String, TableSchema>() {
                                                    @Override
                                                    public TableSchema apply(String jsonPath) {
                                                        TableSchema tableSchema = new TableSchema();
                                                        List<TableFieldSchema> fields = new ArrayList<>();
                                                        SchemaParser schemaParser = new SchemaParser();
                                                        JSONObject jsonSchema;

                                                        try {
                                                            jsonSchema = schemaParser.parseSchema(jsonPath);

                                                            JSONArray bqSchemaJsonArray =
                                                                    jsonSchema.getJSONArray(BIGQUERY_SCHEMA);

                                                            for (int i = 0; i < bqSchemaJsonArray.length(); i++) {
                                                                JSONObject inputField = bqSchemaJsonArray.getJSONObject(i);
                                                                TableFieldSchema field =
                                                                        new TableFieldSchema()
                                                                                .setName(inputField.getString(NAME))
                                                                                .setType(inputField.getString(TYPE));

                                                                if (inputField.has(MODE)) {
                                                                    field.setMode(inputField.getString(MODE));
                                                                }

                                                                fields.add(field);
                                                            }
                                                            tableSchema.setFields(fields);


                                                        }

                                                        catch (Exception e) {
                                                            throw new RuntimeException(e);
                                                        }
                                                        return tableSchema;

                                                    }
                                                }))
                                .to(options.getOutputTable())
                                .withCreateDisposition(CreateDisposition.CREATE_IF_NEEDED)
                                .withWriteDisposition(WriteDisposition.WRITE_TRUNCATE)
                                .withCustomGcsTempLocation(options.getBigQueryLoadingTemporaryDirectory()));

        pipeline.run();


    }
}
