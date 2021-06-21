import React, { useEffect, useState } from 'react';
import { Input } from '../../../components';
import { Switch } from 'antd';
import { MUTATION_TASK_CREATE, MUTATION_TASK_UPDATE } from '../../../graphql/mutation';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useApp } from '../../../context/app.context';
import { FORM_STATUS_ADD, FORM_STATUS_EDIT } from '../../../assets/const';

export default function TaskForm(props) {
    const { status, data, handleBack } = props;
    const { auth } = useApp();
    const [ formVal, setFormVal ] = useState(data);
    const [ handleMutationTaskCreate, { data: dataTaskCreate } ] = useMutation(MUTATION_TASK_CREATE);
    const [ handleMutationTaskUpdate, { data: dataTaskUpdate } ] = useMutation(MUTATION_TASK_UPDATE);

    useEffect(() => {
        if(status === FORM_STATUS_EDIT) {
            setFormVal({
                ...formVal,
                due_date: moment(data.due_date).format('YYYY-MM-DD')
            })
        }
    }, [])

    useEffect(() => {
        if(dataTaskCreate?.insert_task) {
            handleBack();
        }
    }, [dataTaskCreate])

    useEffect(() => {
        if(dataTaskUpdate?.update_task_by_pk) {
            handleBack();
        }
    }, [dataTaskUpdate])

    function handleChange(key, val) {
        setFormVal({
            ...formVal,
            [key]: val
        })
    }

    function handleSubmit() {
        if(status === FORM_STATUS_ADD) {
            handleMutationTaskCreate({
                variables: {
                    task: {
                        ...formVal,
                        id: uuidv4(),
                        due_date: moment(formVal.due_date).format(),
                        created_at: moment().format(),
                        user_id: auth?.user?.id,
                        completed: formVal.completed? true: false
                    }
                }
            })
        } else {
            handleMutationTaskUpdate({
                variables: {
                    task: {
                        created_at: formVal.created_at,
                        description: formVal.description,
                        title: formVal.title,
                        user_id: formVal.user_id,
                        due_date: moment(formVal.due_date).format(),
                        completed: formVal.completed
                    },
                    id: formVal.id
                }
            })
        }
    }

    return (
        <div className="p-6 mx-auto w-full max-w-md bg-white rounded-xl shadow-md flex flex-col items-center">
            <div>
                <h2 className="text-xl">{status === FORM_STATUS_ADD? 'Create a Task': `Update Task - ${formVal.title}`}</h2>
            </div>
            <div className="flex w-full justify-between">
                <Input 
                    labelClass="capitalize text-gray-500"
                    inputClass="border rounded border-gray-300 p-4 w-full outline-none	"
                    wrapClass="my-2 w-full"
                    label="title"
                    type="text"
                    value={formVal.title} 
                    onChange={(evt) => handleChange('title', evt.target.value)}
                />
                <div className="flex">
                    <span className="mx-1">Completed</span>
                    <Switch checked={formVal.completed} onChange={() => handleChange('completed', !formVal.completed)} />
                </div>
            </div>
            <Input 
                labelClass="capitalize text-gray-500"
                inputClass="border rounded border-gray-300 p-4 w-full outline-none	"
                wrapClass="my-2 w-full"
                label="description"
                type="text"
                value={formVal.description} 
                onChange={(evt) => handleChange('description', evt.target.value)}
            />
            <Input 
                labelClass="capitalize text-gray-500"
                inputClass="border rounded border-gray-300 p-4 w-full outline-none	"
                wrapClass="my-2 w-full"
                label="Due Date"
                type="date"
                value={formVal.due_date} 
                onChange={(evt) => handleChange('due_date', evt.target.value)}
            />
            <div className="flex justify-between w-full mt-5">
                <button className="shadow-sm px-5 py-3 bg-red-200 rounded text-gray-500" onClick={handleBack}>Cancel</button>
                <button className="shadow-sm px-5 py-3 bg-green-200 rounded text-gray-500" onClick={handleSubmit}>{status === FORM_STATUS_ADD? 'Add': 'Save'}</button>
            </div>
        </div>
    )
}