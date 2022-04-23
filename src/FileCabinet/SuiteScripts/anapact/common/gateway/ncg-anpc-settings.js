/**
 * @NApiVersion 2.1
 */
define(['N/log', 'N/record', 'N/search'],
    /**
     * @param{log} log
     * @param{record} record
     * @param{search} search
     */
    (log, record, search) => {

        const RECORD_TYPE = 'customrecord_ncg_anpc_settings';
        const Fields = {
            NAME: 'name',
            INACTIVE: 'isnactive',
            INTERNAL_ID: 'internalid',
            TENANT_ID: 'custrecord_ncg_anpc_settings_tenant_id',
            EMAIL: 'custrecord_ncg_anpc_settings_email',
            APP_URL: 'custrecord_ncg_anpc_settings_url',
            CONTRACT_URL: 'custrecord_ncg_anpc_settings_cr_url',


            SEARCH: 'CUSTRECORD_NCG_ANPC_SETTINGS_LINE_SETTIN',
            SEARCH_RECORD_TYPE: 'custrecord_ncg_anpc_settings_line_rectyp',
            SEARCH_RECORD_MAPPING: 'custrecord_ncg_anpc_settings_line_search'
        }

        const SEARCH_RECORD_TYPE = [Fields.SEARCH,Fields.SEARCH_RECORD_TYPE].join('.');
        const SEARCH_RECORD_MAPPING = [Fields.SEARCH,Fields.SEARCH_RECORD_MAPPING].join('.');

        const getSettings = (params) => {
            let data;
            let filters = [
                //[Fields.INACTIVE, 'is', 'F']
            ]
            if(params.settingId){
                //filters.push('AND');
                filters.push([Fields.INTERNAL_ID, 'anyof', params.settingId])
            };

            if(params.recordType){
                filters.push('AND');
                filters.push([SEARCH_RECORD_TYPE, 'is', params.recordType])
            }

            search.create({
                type: RECORD_TYPE,
                filters: filters,
                columns:[
                    Fields.INTERNAL_ID,
                    Fields.TENANT_ID,
                    Fields.EMAIL,
                    Fields.APP_URL,
                    Fields.CONTRACT_URL,
                    SEARCH_RECORD_TYPE,
                    SEARCH_RECORD_MAPPING
                ]
            })
                .run()
                .getRange({start:0, end: 1000})
                .forEach(function(result){
                    if(!data){
                        data = {
                            email: result.getValue(Fields.EMAIL),
                            tenant_id: result.getValue(Fields.TENANT_ID),
                            app_url: result.getValue(Fields.APP_URL),
                            contract_url: result.getValue(Fields.CONTRACT_URL),
                            mapping: {}
                        }
                    }

                    log.debug('RESULT',result);

                    let recordtype = result.getValue(result.columns[5]);
                    let mapping = result.getValue(result.columns[6]);

                    data.mapping[recordtype] = mapping;
                });

            log.debug('DATA', data);
            return data
        }

        const getFieldMapping = (params) => {
            log.debug('getFieldMapping', params);

            let settings = getSettings({
                recordType: params.recordType,
                settingId: params.settingId
            });

            if(!settings) return [];

            return _getSearchResults({
                recordType: params.recordType,
                recordId: params.recordId,
                searchId: settings.mapping[params.recordType]
            })
        }

        const _getSearchResults = (params) => {
            log.debug('_getSearchResults', params);
            let map = search.load({
                type: params.recordType,
                id: params.searchId
            });
            map.filters.push(
                search.createFilter({
                    name: Fields.INTERNAL_ID,
                    operator: search.Operator.ANYOF,
                    values: [params.recordId]
                })
            );

            return map.run()
                .getRange({start:0, end: 1})
                .reduce(function(res, result) {
                    let data = [];
                    let columns = result.columns;
                    columns.forEach(function(cols){
                        data.push({
                            field: cols.label,
                            value: result.getValue(cols)
                        });
                    })

                    return data;
                }, []);
        }

        return {
            getSettings, getFieldMapping
        }

    });
