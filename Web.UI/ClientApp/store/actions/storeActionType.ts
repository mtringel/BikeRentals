﻿export enum StoreActionType {
    // ClientContext
    ClientContext_SetGlobals,
    ClientContext_SetNavMenu,
    ClientContext_SetActiveScreen,
    ClientContext_AddErrorIndicator,
    ClientContext_RemoveErrorIndicator,
    ClientContext_AddLoaderIndicator,
    ClientContext_RemoveLoaderIndicator,
    ClientContext_SetCurrentLocation,

    // AuthService
    AuthService_SetCurrentUserSuccess,

    // WebApiService
    WebApiService_SetLastAntiforgeryToken,
    WebApiService_SubscribeRequest,
    WebApiService_ClearAllRequests,

    // LoginParams
    LoginParams_SetReturnUrl,
    LoginParams_SetDefaultEmail,

    // BikeModels
    BikeModels_SetListData,
    BikeModels_ClearState, 

    // Bikes
    Bikes_SetListData,
    Bikes_SetFormData,
    Bikes_PostSuccess,
    Bikes_PutSuccess,
    Bikes_DeleteSuccess,
    Bikes_ClearState,

    // BikeRents
    BikeRents_SetListData,
    BikeRents_SetFormData,
    BikeRents_PostSuccess,
    BikeRents_PutSuccess,
    BikeRents_DeleteSuccess,
    BikeRents_ClearState,
    BikeRents_SetUseBikeId,

    // Colors
    Colors_SetListData,
    Colors_ClearState,

    // UserListScreen
    Users_SetFormData,
    Users_SetListData,
    Users_PostSuccess,
    Users_PutSuccess,
    Users_DeleteSuccess,
    Users_ClearState,

    // FormValidator
    FormValidator_SetErrors,

    // AutoComplete
    AutoComplete_SetListData,
    AutoComplete_ClearState
}