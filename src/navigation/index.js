import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { Main, Auth } from '../pages';

export default function Navigation() {
    return (
        <Router>
            <Switch>
                <Route path="/main" component={Main} />
                <Route path="/" component={Auth} />
            </Switch>
        </Router>
    )
}