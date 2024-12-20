<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Game;
use App\Models\User;
use App\Models\Round;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Http\Requests\GameRequest;




class GameController extends Controller
{
    /**
     * Display a listing of the user's games.
     */
    public function index(Request $request)
    {
        $games = Game::where('user_id', $request->user()->id)->get();

        return response()->json(['games' => $games], 200);
    }

    public function create(Request $request)
    {
        $user = $request->user();

        $gamesCount = $user->games()->count();

        $game = [
            'id' => Str::uuid()->toString(), 
            'title' => 'Erudīcijas spēle nr. ' . ($gamesCount+1), 
            'description' => 'Spēles apraksts', 
            'user_id' => $user->id
        ];
        
        return response()->json(['message' => 'Game is ready for creation.', 'game' => $game], 200);    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GameRequest $request)
    {
        $game = Game::create($request->validated());

        return response()->json(['message' => 'Game successfully created.', 'game' => $game], 201);    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $game = Game::findOrFail($id);
        return response()->json(['game' => $game], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(GameRequest $request, string $id)
    {
        $this->authorize('manage', Game::findOrFail($id));

        $game = Game::findOrFail($id);
        $game->update($request->validated());
        
        return response()->json(['message' => 'Game successfully updated.', 'game' => $game], 200);    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $this->authorize('manage', Game::findOrFail($id));

        $game = Game::findOrFail($id);
        $game->delete();

        return response()->json(null, 204);
    }

} 
