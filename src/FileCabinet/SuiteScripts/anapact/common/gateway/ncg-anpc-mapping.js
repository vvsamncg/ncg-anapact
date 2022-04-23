/**
 * @NApiVersion 2.1
 */
define(['N/log', 'N/record', 'N/search', '../const/ncg-anpc-const'],
    /**
     * @param{log} log
     * @param{record} record
     * @param{search} search
     */
    (log, record, search, _const) => {
        const RECORD_TYPE = "customrecord_ncg_anpc_contract_mapping";
        const Fields = {
            TEMPLATE: 'custrecord_ncg_anpc_contract_template',
            MAP: 'custrecord_ncg_anpc_json_map'
        }

        const MappingFields = {
            MAPPING_NAME: {name: "custrecord_ncg_anpc_mapping_name"},
            JSON_MAP: {name: "custrecord_ncg_anpc_json_map"},
            CONTRACT_TEMPLATE: {name: "custrecord_ncg_anpc_contract_template"}
        };
        const getAllMappings = (contractName) => {
            const toReturn = [];
            const mappingObj = search.create({
                type: RECORD_TYPE,
                filters: [
                    [Fields.TEMPLATE, search.Operator.IS, contractName]
                ],
                columns:[
                    search.createColumn(MappingFields.MAPPING_NAME),
                    search.createColumn(MappingFields.JSON_MAP),
                    search.createColumn(MappingFields.CONTRACT_TEMPLATE)
                ]
            })
            .run()
            .each(function(result){
                toReturn.push({
                    mappingName: result.getValue(MappingFields.MAPPING_NAME),
                    jsonMap: result.getValue(MappingFields.JSON_MAP),
                    contractTemplate: result.getValue(MappingFields.CONTRACT_TEMPLATE),
                    id: result.id
                });
                return true;
            });
            return toReturn;
        }

        const processMapping = (body) => {
            let createObj;
            switch (body.action){
                case _const.SaveAction.CREATE:
                    createObj = record.create({
                        type: RECORD_TYPE
                    });
                    break;
                case _const.SaveAction.UPDATE:
                    createObj = record.load({
                        type: RECORD_TYPE,
                        id: body.mappingId
                    });
                    break;
                default:
                    break;
            }

            for(var mapping in body.mappingData) {
                let val = '';
                if(mapping == Fields.MAP) {
                    val = JSON.stringify(body.mappingData[mapping]);
                } else {
                    val = body.mappingData[mapping];
                }
                createObj.setValue({
                    fieldId: mapping,
                    value: val
                })
            }
            createObj.save();
        }

        return {
            getAllMappings,
            processMapping
        }

    });
