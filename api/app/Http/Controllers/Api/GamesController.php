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
    $validator = Validator::make($request->all(), [
        'title' => 'required|string',
        'description' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $validated = $validator->validated();

    $validated['user_id'] = auth()->id();

    $game = Game::create($validated);

    return response()->json(['message' => ['Game successfully created.']], 201);
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new Game(Game::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'string',
            'user_id' => auth()->id(),
        ]);

        $game = Game::findOrFail($id);
        $game->update($validated);
        return new Game($game);
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
