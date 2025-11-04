"use client";
import QueryTable from '@/components/tables/QueryTable';
import { useAppDispatch, useAppSelector } from '@/store'
import { changeQueryStatus, deleteQuery, getAllQueries } from '@/store/slice/querySlice';
import React, { useEffect } from 'react'

function Query() {
    const dispatch = useAppDispatch();
    const { queries, loading, error } = useAppSelector(state => state?.query);
    const fetchQueriesAdmin = async () => {
        await dispatch(getAllQueries());
    }

    useEffect(() => {
        fetchQueriesAdmin();
    }, [dispatch]);


    // console.log("---- queries -----", queries);

    return (
        <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#16325d]">Blogs</h2>
            </div>
            <QueryTable
                queries={queries}
                onChangeStatus={(queryId, status) => {
                    // console.log("---- queri id, status ----", queryId, status);
                    return dispatch(changeQueryStatus({ id: queryId, status }))
                }}
                onDeleteQuery={(queryId) => dispatch(deleteQuery(queryId))}
            />
        </div>
    )
}

export default Query