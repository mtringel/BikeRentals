import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomeContainer from './containers/HomeContainer';
import LoginContainer from './containers/account/LoginContainer';
import RegisterContainer from './containers/account/RegisterContainer';
import UserListContainer from './containers/users/UserListContainer';
import UserEditContainer from './containers/users/UserEditContainer';
import { StringHelper } from './helpers/stringHelper';
import { TypeHelper } from './helpers/typeHelper';
import { QueryParamsHelper } from './helpers/queryParamsHelper';
import { storeProvider } from './boot';
import BikeListContainer from './containers/bikes/BikeListContainer';

export const routeUrls = {
    home: () => "/",

    account: {
        login: () => "/login",
        register: () => "/register",
        profile: () => "/profile"
    },

    users: {
        list: () => "/users",
        // /users/:userId
        edit: (userId: string, ) => "/users/" + (userId === ":userId" ? userId : encodeURI(userId)),
        new: () => "/users/new"
    },

    bikes: {
        list: () => "/bikes",
        // /bikes/:bikesId
        edit: (bikeId: string, ) => "/bikes/" + (bikeId === ":bikeId" ? bikeId : encodeURI(bikeId)),
        new: () => "/bikes/new"
    },

    rents: {
        list: () => "/rents",
        // /rents/:rentId
        edit: (rentId: string, ) => "/rents/" + (rentId=== ":rentId" ? rentId: encodeURI(rentId)),
        new: () => "/rents/new"
    }
};

export const routes = <Layout>
    {/* exact is mandatory, otherwise it will match all routes */}
    <Route path={routeUrls.home()} exact component={HomeContainer} /> 

    {/* Account */}
    <Route path={routeUrls.account.login()} exact component={LoginContainer} />
    <Route path={routeUrls.account.register()} exact component={RegisterContainer} />
    <Route path={routeUrls.account.profile()} exact component={UserEditContainer} />

    {/* Users*/}
    <Route path={routeUrls.users.list()} exact component={UserListContainer} />
    <Route path={routeUrls.users.edit(":userId")} exact component={UserEditContainer} />

    {/* Bikes */}
    <Route path={routeUrls.bikes.list()} exact component={BikeListContainer} />

    {/* Rents */}
    {/* <Route path={routeUrls.rents.list()} exact component={BikeRentContainer} /> */}
</Layout>;