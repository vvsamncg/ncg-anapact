define(['N/log'],

    (log) => {

        let contracts = {};

        const addContract = (data) => {
            contracts[data.contractTemplateName] = data;
        }

        const getRawData = (contractName) => {
            return contracts[contractName];
        }

        const getOptions = () => {
            return Object.keys(contracts);
        }

        const getMetaDataFieldList = (contractName) => {
            let con = contracts[contractName];
            if(!con) return [];

            return JSON.parse(con.metDataFieldList);
        }

        const getDynamicFields = (contractName) => {
            let con = contracts[contractName];
            if(!con) return [];

            return JSON.parse(con.dynamicFields);
        }

        const getTemplate = (contractName) => {
            let con = contracts[contractName];
            if(!con) return '';

            return con.contractTemplateContent;
        }

        const setWorkFlowList = (contractName) => {
            let con = contracts[contractName];
            if(!con) return '';

            return JSON.parse(con.setWorkFlowList);
        }

        return {
            addContract,
            getOptions,
            getMetaDataFieldList,
            getDynamicFields,
            getTemplate,
            setWorkFlowList
        }

    });
