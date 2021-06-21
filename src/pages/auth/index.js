import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_SIGNIN } from '../../graphql/query';
import { MUTATION_SIGNUP } from '../../graphql/mutation';
import { useHistory } from 'react-router-dom';
import { useApp } from '../../context/app.context';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../../components';

const SCREEN_SIGNIN = 'SCREEN_SIGNIN';
const SCREEN_SIGNUP = 'SCREEN_SIGNUP';

export default function Auth() {
    const { setAuth } = useApp();
    const [ screenMode, setScreenMode ] = useState(SCREEN_SIGNIN)
    const [ formVal, setFormVal ] = useState({
        email: '',
        password: '',
        passwordRepeat: ''
    })

    const history = useHistory();

    const [ handleQuerySignIn, { loading: signinLoading, data: signinData } ] = useLazyQuery(QUERY_SIGNIN);
    const [ handleMutationSignUp, { loading: signupLoading, data: signupData } ] = useMutation(MUTATION_SIGNUP)

    useEffect(() => {
        if(signinData?.user_aggregate?.nodes?.length > 0) {
            setAuth({
                isAuth: true,
                user: signinData.user_aggregate.nodes[0]
            })
            history.push('main');
        }
    }, [signinData])

    useEffect(() => {
        if(signupData?.insert_user?.returning?.length > 0) {
            setAuth({
                isAuth: true, 
                user: signupData.insert_user.returning[0]
            });
            history.push('main')
        }
    }, [signupData])

    function handleChange(key, val) {
        setFormVal({
            ...formVal,
            [key]: val
        })
    }

    function handleSubmit() {
        if(screenMode === SCREEN_SIGNIN) {
            handleQuerySignIn({
                variables: {
                    email: formVal.email,
                    password: formVal.password
                }
            })
        } else {
            if(formVal.password === formVal.passwordRepeat) {
                handleMutationSignUp({
                    variables: {
                        id: uuidv4(),
                        email: formVal.email,
                        password: formVal.password
                    }
                })
            }
        }
    }

    if(signinLoading || signupLoading) {
        return (
            <div className="absolute w-full h-full">
                <div className="w-full h-full flex justify-center items-center">
                    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
                        <span className="text-gray-500">Loading...</span>
                    </div>
                </div>
            </div>  
        )      
    }

    return (
        <div className="absolute w-full h-full">
            <div className="w-full h-full flex justify-center items-center">
                <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
                    {screenMode === SCREEN_SIGNIN && 
                        <div>
                            <h3 className="text-3xl text-gray-500 text-center uppercase">Sign In</h3>
                            <Input 
                                labelClass="capitalize text-gray-500"
                                inputClass="border rounded border-gray-300 p-4 w-full outline-none	"
                                wrapClass="my-2"
                                label="email"
                                type="text"
                                value={formVal.email} 
                                onChange={(evt) => handleChange('email', evt.target.value)}
                            />
                            <Input 
                                labelClass="capitalize text-gray-500"
                                inputClass="border rounded border-gray-300 p-4 w-full outline-none	"
                                wrapClass="my-2"
                                label="password"
                                type="password"
                                value={formVal.password} 
                                onChange={(evt) => handleChange('password', evt.target.value)}
                            />
                        </div>}
                    {screenMode === SCREEN_SIGNUP && <div>
                        <h3 className="text-3xl text-gray-500 text-center uppercase">Sign Up</h3>
                        <Input 
                            labelClass="capitalize text-gray-500"
                            inputClass="border rounded border-gray-300 p-4 w-full outline-none	"
                            wrapClass="my-2"
                            label="email"
                            type="text"
                            value={formVal.email} 
                            onChange={(evt) => handleChange('email', evt.target.value)}
                        />
                        <Input 
                            labelClass="capitalize text-gray-500"
                            inputClass="border rounded border-gray-300 p-4 w-full outline-none	"
                            wrapClass="my-2"
                            label="password"
                            type="password"
                            value={formVal.password} 
                            onChange={(evt) => handleChange('password', evt.target.value)}
                        />
                        <Input 
                            labelClass="capitalize text-gray-500"
                            inputClass="border rounded border-gray-300 p-4 w-full outline-none	"
                            wrapClass="my-2"
                            label="password repeat"
                            type="password"
                            value={formVal.passwordRepeat} 
                            onChange={(evt) => handleChange('passwordRepeat', evt.target.value)}
                        />
                    </div>}
                    <div className="my-2">
                        <button className="shadow-sm px-5 py-3 bg-green-200 rounded text-gray-500	" onClick={handleSubmit}>{screenMode === SCREEN_SIGNIN? 'Sign In': 'Sign Up'}</button>
                    </div>
                    <div className="text-center">
                        {screenMode === SCREEN_SIGNIN && <a className="text-xs text-blue-300 cursor-pointer	" onClick={() => setScreenMode(SCREEN_SIGNUP)}>Go to Sign Up</a>}
                        {screenMode === SCREEN_SIGNUP && <a className="text-xs text-blue-300 cursor-pointer	" onClick={() => setScreenMode(SCREEN_SIGNIN)}>Go to Sign In</a>}
                    </div>
                </div>
            </div>
        </div>
    )
}