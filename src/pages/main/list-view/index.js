import moment from 'moment';
import React, { useEffect } from 'react';
import { Tag, Button } from 'antd';
import { MUTATION_TASK_DELETE } from '../../../graphql/mutation';
import { useMutation } from '@apollo/client';

export default function ListView(props) {
    
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
    
    return (
        <div className="w-full mt-5">
            {data && data.map(item => <div key={item.id} className="w-full flex border-t py-3 justify-between">
                <div className="mr-10">
                    <h2>{item.title}</h2>
                    <span>{item.description}</span>
                </div>
                <div className="mr-10">
                    <span>Creation Date: {moment(item.created_at).format('MMM ddd YYYY')}</span>
                    <br />
                    <span>Due Date: {moment(item.due_date).format('MMM ddd YYYY')}</span>
                    <br /> 
                </div>
                <div className="mr-10">
                    <Tag color={item.completed? 'green': 'red'}>
                        {item.completed? 'Completed': 'Pending'}
                    </Tag> 
                </div>
                <div>
                    <Button onClick={() => handleUpdate(item)}>
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Button>
                    <Button onClick={() => handleDelete(item)}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                </div>
            </div>)}
        </div>
    )
}