<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GamesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $userId = $request->user()->id;
        $games = Game::where('user_id', $userId)->get();
        return response()->json($games);
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = User::find($request->user()->id);

        $gamesCount = $user->games()->count();

        $game = Game::create(['title' => 'Erudīcijas spēle nr. ' . $gamesCount+1, 'description' => 'Spēles apraksts', 'user_id' => $user->id]);

        return response()->json($game, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $game = Game::findOrFail($id);

        if($game !== null) {
            return response()->json($game, 200);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $game = Game::findOrFail($id);

        if ($game->user_id !== $request->user()->id) {
            return response()->json(['message' => ['You are not authorized to perform this action.']], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'string|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validated = $validator->validated();

        $game->update($validated);
        return response()->json(['message' => ["Game successfully saved."], 'id' => $game->id], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $game = Game::findOrFail($id);
        $game->delete();
        return response()->json(200);
    }
}
