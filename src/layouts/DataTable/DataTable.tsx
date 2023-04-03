import { Alert, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { mande, MandeError } from 'mande';
import React, { useEffect, useState } from 'react';
import { ModelCommon } from '@stephenprn/typescript-common/lib/interfaces/model';
import { Pagination, ResultWithNbr } from '@stephenprn/typescript-common/lib/interfaces/pagination';
import './DataTable.scss';
import InfoIcon from '@mui/icons-material/Info';
import { handleErrors } from '../../utils/http';

interface DataTableProps {
    endpoint: string;
    endpointExtraParams?: any;
    columns: GridColDef[];
    reloadUuid?: string; // if this changes, the table will reload
}

export const DataTable = <T extends ModelCommon>({
    endpoint,
    endpointExtraParams,
    columns,
    reloadUuid,
}: DataTableProps) => {
    const [pagination, setPagination] = useState<Pagination>({
        pageNbr: 0,
        nbrResults: 20,
    });
    const [totalResults, setTotalResults] = useState<number | null>(null);
    const [rows, setRows] = useState<T[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const dataApi = mande(endpoint);

    const loadData = async (pagination_: Pagination) => {
        if (loading) {
            return;
        }

        setLoading(true);
        setError(null);

        let response: any;

        try {
            response = await dataApi.get<ResultWithNbr<T>>({
                query: {
                    pageNbr: pagination_.pageNbr,
                    nbrResults: pagination_.nbrResults,
                    ...(endpointExtraParams ?? {}),
                },
            });
            setTotalResults(response.total);
            setRows(response.data);
        } catch (err: any) {
            handleErrors(err);
            setError((err as MandeError).body.message);
            setLoading(false);
            return;
        }

        setLoading(false);
    };

    useEffect(() => {
        loadData(pagination);
    }, [reloadUuid]);

    // set tooltips to columns
    const columns_ = [
        ...columns,
        {
            field: 'infos',
            headerName: '',
            flex: 0.5,
            renderCell: (value: any) => {
                return (
                    <Tooltip
                        title={
                            <>
                                {Object.entries(value.row)
                                    .sort(([key1, _], [key2, __]) => key1.localeCompare(key2))
                                    .map(([key, value]) => (
                                        <div key={key}>
                                            {String(key)}: {String(value)}
                                        </div>
                                    ))}
                            </>
                        }
                    >
                        <InfoIcon />
                    </Tooltip>
                );
            },
        },
    ];

    return (
        <div className="data-table-container">
            {error ? <Alert severity="error">{error}</Alert> : null}
            <div className="table-container">
                <DataGrid
                    loading={loading}
                    columns={columns_}
                    rows={rows}
                    paginationModel={{
                        page: pagination.pageNbr,
                        pageSize: pagination.nbrResults,
                    }}
                    paginationMode="server"
                    rowCount={totalResults ?? 0}
                    getRowId={(row: ModelCommon) => row.uuid}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    onPaginationModelChange={(model) => {
                        const pagination_ = {
                            pageNbr: model.page,
                            nbrResults: model.pageSize,
                        };
                        setPagination(pagination_);
                        loadData(pagination_);
                    }}
                    sx={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        '.MuiDataGrid-columnHeaders': {
                            color: '#5f5f5f',
                        },
                        padding: '16px',
                    }}
                />
            </div>
        </div>
    );
};
