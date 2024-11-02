<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoundController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/auth/register', [UserController::class, 'createUser']);
Route::post('/auth/login', [UserController::class, 'loginUser']);
Route::middleware('auth:sanctum')->post('/auth/logout', [UserController::class, 'logout']);

Route::group(['middleware' => 'auth:sanctum'], function() {
    Route::apiResource('/games', 'App\Http\Controllers\Api\GamesController');
    Route::apiResource('/rounds', 'App\Http\Controllers\Api\RoundController');

    Route::get('/gamerounds/{game_id}', [RoundController::class, 'showByGame']);
});



