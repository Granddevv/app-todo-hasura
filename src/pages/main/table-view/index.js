import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Table, Tag, Button } from 'antd';
import { MUTATION_TASK_DELETE } from '../../../graphql/mutation';
import { useMutation } from '@apollo/client';

export default function TableView(props) {
    const { data, handleUpdate, handleRefetch } = props;
    const [ handleMutationTaskDelete, { data: dataTaskDelete } ] = useMutation(MUTATION_TASK_DELETE);

    useEffect(() => {
        if(dataTaskDelete?.delete_task_by_pk) {
            handleRefetch()
        }
    }, [dataTaskDelete])

    function handleDelete(item) {
        handleMutationTaskDelete({
            variables: {
                id: item.id
            }
        })
    }


    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'completed',
            key: 'completed',
            render: (completed) => <Tag color={completed? 'green': 'red'}>
                {completed? 'Completed': 'Pending'}
            </Tag>
        },
        {
            title: 'Creation Date',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => a.created_at - b.created_at,
            render: (date) => <span>{moment(date).format('MMM ddd YYYY')}</span>
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (date) => <span>{moment(date).format('MMM ddd YYYY')}</span>
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, item) => <div>
                <Button onClick={() => handleUpdate(item)}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                </Button>
                <Button onClick={() => handleDelete(item)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </Button>
            </div>
        }
    ]

    const dataSource = data && data.length > 0? data.map(item => {
        return {
            ...item,
            key: item.id
        }
    }): [];

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    )
}