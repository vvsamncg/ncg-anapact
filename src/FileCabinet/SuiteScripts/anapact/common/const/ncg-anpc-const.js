define(['N/log'],
    /**
 * @param{log} log
 */
    (log) => {

        const Method = {
            GET_FIELD_MAPPING: 'getFieldMapping',
            GET_ALL_TEMPLATES: 'getAllTemplates',
            SHOW_CONTRACT_UI : 'showContractUI',
            SAVE_CONTRACT: "saveContract",
            VALIDATE_CONTRACT_NAME: "validateContractName",
            GET_CONTRACTS: 'getContracts',
            GET_MAPPING: "getMapping"
        }

        const SaveAction = {
            CREATE: 'create',
            UPDATE: 'update'
        }

        const Service = {
            SCRIPT_ID_API: 'customscript_ncg_anpc_viewer',
            SCRIPT_DEPLOYMENT_API: 'customdeploy_ncg_anpc_viewer',

            SCRIPT_ID_VIEW: 'customscript_ncg_anpc_contractlist_sl',
            SCRIPT_DEPLOYMENT_VIEW: 'customdeploy_ncg_anapact_contractlist_sl',
        }

        const TemplatePath = {
            CONTRACT: '../html/ncg-anpc-contract.html',
            CONTRACT_LIST: '../html/ncg-anpc-contract-list.html',
        }

        const ScriptPath = {
            FIELDS: '../common/util/ncg-anpc-field.js'
        }

        return {Method, SaveAction, Service, TemplatePath, ScriptPath}

    });
