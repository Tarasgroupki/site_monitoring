<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('site', 'API\SiteController')->middleware(['auth:api']);
Route::get('users', 'API\UsersController@index');
Route::post('auth', 'API\UsersController@actionLogin');
Route::get('users/logout/{id}', 'API\UsersController@actionLogout');
Route::put('users/profile/{id}', 'API\UsersController@profileUpdate')->middleware(['auth:api']);
Route::get('users/profile/{id}', 'API\UsersController@showProfile')->middleware(['auth:api']);
Route::post('fileUpload', 'API\UsersController@FileUpload')->middleware(['auth:api']);