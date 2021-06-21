import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useApp } from '../../context/app.context';
import { QUERY_TASK } from '../../graphql/query';
import TableView from './table-view';
import ListView from './list-view';
import TaskForm from './task-form';
import { Button, Switch } from 'antd';
import { Redirect } from 'react-router-dom';
import { SCREEN_FORM, SCREEN_DATA, LAYOUT_LIST, LAYOUT_TABLE, FORM_STATUS_ADD, FORM_STATUS_EDIT } from '../../assets/const';

export default function Main() {
    const { auth } = useApp();
    const [ layout, setLayout ] = useState(LAYOUT_TABLE);
    const [ screen, setScreen ] = useState(SCREEN_DATA);
    const [ formStatus, setFormStatus ] = useState(FORM_STATUS_ADD);
    const [ selectedItem, setSelectedItem ] = useState({});

    const { data, refetch } = useQuery(QUERY_TASK, {
        variables: {
            id: auth?.user?.id
        }
    })

    function handleChangeLayout(layout) {
        setLayout(layout? LAYOUT_LIST: LAYOUT_TABLE);
    }

    function handleBack() {
        setScreen(SCREEN_DATA);
        refetch();
    }

    function handleNew() {
        setScreen(SCREEN_FORM);
        setFormStatus(FORM_STATUS_ADD);
        setSelectedItem({});
    }

    function handleUpdate(item) {
        setScreen(SCREEN_FORM);
        setFormStatus(FORM_STATUS_EDIT);
        setSelectedItem(item);
    }

    if(!auth?.isAuth) {
        return <Redirect to="/" />
    }

    return (
        <div className="absolute w-full h-full">
            <div className="w-full h-full flex justify-center items-center">
                {screen === SCREEN_DATA && <div className="p-6 mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
                        <div>
                            <h2 className="text-xl">My Todo List</h2>
                        </div>
                        <div className="flex justify-between w-full">
                            <Button onClick={handleNew}>New</Button>
                            <div className="flex items-center">
                                <span className="mx-1">Table</span>
                                <Switch checked={layout === LAYOUT_LIST} onChange={handleChangeLayout} />
                                <span className="mx-1">List</span>
                            </div>
                        </div>
                        {layout === LAYOUT_TABLE && <TableView data={data?.task_aggregate?.nodes} handleUpdate={handleUpdate} handleRefetch={refetch} />}
                        {layout === LAYOUT_LIST && <ListView data={data?.task_aggregate?.nodes} handleUpdate={handleUpdate} handleRefetch={refetch} />}
                    </div>
                }
                {screen === SCREEN_FORM && <TaskForm status={formStatus} data={selectedItem} handleBack={handleBack} />}
            </div>
        </div>
    )
}