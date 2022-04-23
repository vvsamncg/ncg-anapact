/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', '../common/api/ncg-anpc-api', '../common/gateway/ncg-anpc-contract', '../common/const/ncg-anpc-const', '../common/gateway/ncg-anpc-settings', '../common/gateway/ncg-anpc-mapping'],
    /**
     * @param{log} log
     */
    (log, _anapact, _contract, _const, _settings, _mapping) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const response = scriptContext.response;
            const request = scriptContext.request;

            let method = request.parameters.method;
            let toReturn = {};
            let body;

            if(request.body) {
                body = JSON.parse(request.body)
                method = body.method;
            }

            _anapact.init(request.parameters.settingId);

            switch (method) {
                case _const.Method.VALIDATE_CONTRACT_NAME:
                    toReturn = _anapact.validateContractName(request.parameters.txtContractName);
                    break;

                case _const.Method.GET_CONTRACTS:
                    toReturn = _anapact.getContracts(request.parameters.recordId);
                    break;

                case _const.Method.GET_MAPPING:
                    toReturn = _mapping.getAllMappings(request.parameters.contractName);
                    break;

                case  _const.Method.GET_FIELD_MAPPING:
                    toReturn = {
                        status: true,
                        data: _settings.getFieldMapping({
                            recordType: request.parameters.recordType,
                            recordId: request.parameters.recordId,
                            settingId: request.parameters.settingId
                        })
                    };
                    break;

                case _const.Method.SHOW_CONTRACT_UI:
                    //Load Settings
                    if(request.parameters.settingId != "" && request.parameters.settingId != "") {

                        //Get templates from Anapact
                        const temp = _anapact.getAllTemplates();
                        const fieldMapping = _settings.getFieldMapping({
                            recordType: request.parameters.recordType,
                            recordId: request.parameters.recordId,
                            settingId: request.parameters.settingId
                        });

                        toReturn = {
                            code: 200,
                            details: {
                                templates: temp,
                                fieldMapping: fieldMapping
                            }
                        };
                    } else {
                        toReturn = {
                            code: 500,
                            details: "Setting Id is not defined."
                        };
                    }
                    break;

                case _const.Method.SAVE_CONTRACT:
                    toReturn = _anapact.createContract(body.data);
                    if(body.action != "save-only"){
                        _mapping.processMapping(body);
                    }
                    break;

                default:
                    toReturn = {
                        code: 500,
                        details: "Cannot find method!"
                    };
                    break;
            }

            response.setHeader(
                "Content-Type",
                "application/json"
            );
            response.write(
                JSON.stringify(toReturn)
            );
        }

        return {onRequest}

    });
