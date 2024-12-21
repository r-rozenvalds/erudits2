<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoundController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\QuestionController;

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
    //games
    Route::apiResource('/games', GameController::class);
    Route::get('/create-game', [GameController::class, 'create']);
    Route::get('/game-sidebar/{game_id}', [GameController::class, 'sidebar']);

    //rounds
    Route::apiResource('/rounds', RoundController::class);
    Route::get('/create-round/{game_id}', [RoundController::class, 'create']);
    Route::get('/gamerounds/{game_id}', [RoundController::class, 'roundsByGame']);

    //questions
    Route::apiResource('/questions', QuestionController::class);
    Route::get('/create-question/{round_id}', [QuestionController::class, 'create']);

    //answers
});



