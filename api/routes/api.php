<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoundController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\AnswerController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\GameInstanceController;
use App\Http\Controllers\Api\PingController;

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

Route::post('/join', [GameInstanceController::class, 'join']);
Route::post('/create-player', [PlayerController::class, 'createPlayer']);

Route::get('/ping', [PingController::class, 'sendPing']);

Route::group(['middleware' => 'auth:sanctum'], function() {

    Route::post('/auth/logout', [UserController::class, 'logout']);

    //games
    Route::apiResource('/games', GameController::class);
    Route::get('/create-game', [GameController::class, 'create']);
    Route::get('/game-sidebar/{game_id}', [GameController::class, 'sidebar']);
    Route::get('/full-game/{game_id}', [GameController::class, 'fullIndex']);

    //rounds
    Route::apiResource('/rounds', RoundController::class);
    Route::get('/create-round/{game_id}', [RoundController::class, 'create']);
    Route::get('/gamerounds/{game_id}', [RoundController::class, 'roundsByGame']);

    //questions
    Route::apiResource('/questions', QuestionController::class);
    Route::get('/create-question/{round_id}', [QuestionController::class, 'create']);

    //answers
    Route::delete('/answers/{answer_id}', [AnswerController::class, 'destroy']);
    Route::get('/create-answer/{question_id}', [AnswerController::class, 'create']);

    //game-instances
    Route::post('/activate', [GameInstanceController::class, 'activate']);
    Route::get('/status/{game_id}', [GameInstanceController::class, 'status']);
    Route::get('/instance-game/{game_id}', [GameInstanceController::class, 'instanceGame']);

    //players
    Route::get('/players/{instance_id}', [PlayerController::class, 'index']);
    Route::post('/disqualify-player', [PlayerController::class, 'disqualify']);
    Route::post('/requalify-player', [PlayerController::class, 'requalify']);
});



